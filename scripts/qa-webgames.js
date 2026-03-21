#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SCENARIO_DIR = path.join(ROOT, 'assets', 'qa', 'webgames');
const OUTPUT_DIR = path.join(ROOT, 'test-results', 'webgames');
const HOST = '127.0.0.1';
const PORT = Number(process.env.WEBGAMES_QA_PORT || 4174);
const CHROME_PORT = Number(process.env.WEBGAMES_QA_CHROME_PORT || 9224);
const DEFAULT_TIMEOUT_MS = 15000;

const KEY_MAP = {
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, nativeVirtualKeyCode: 38, windowsVirtualKeyCode: 38 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, nativeVirtualKeyCode: 40, windowsVirtualKeyCode: 40 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, nativeVirtualKeyCode: 37, windowsVirtualKeyCode: 37 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, nativeVirtualKeyCode: 39, windowsVirtualKeyCode: 39 }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseArgs(argv) {
  const args = { scenario: null, strict: false, headless: true, outputDir: OUTPUT_DIR, list: false };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--scenario' && next) { args.scenario = next; index += 1; }
    else if (arg === '--strict') { args.strict = true; }
    else if (arg === '--headless' && next) { args.headless = next !== '0' && next !== 'false'; index += 1; }
    else if (arg === '--output-dir' && next) { args.outputDir = path.resolve(ROOT, next); index += 1; }
    else if (arg === '--list') { args.list = true; }
  }
  return args;
}

function resolveChromiumBinary() {
  if (process.env.CHROMIUM_BIN) return process.env.CHROMIUM_BIN;
  const knownPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const candidate of knownPaths) {
    if (fs.existsSync(candidate)) return candidate;
  }
  const probes = [
    ['bash', ['-lc', 'command -v chromium || command -v chromium-browser || command -v google-chrome || command -v google-chrome-stable']],
    ['where.exe', ['chromium']],
    ['where.exe', ['chrome']],
    ['where.exe', ['google-chrome']]
  ];
  for (const [command, args] of probes) {
    try {
      const result = spawnSync(command, args, { encoding: 'utf8' });
      if (result.status === 0) {
        const candidate = String(result.stdout || '').trim().split(/\r?\n/).find(Boolean);
        if (candidate) return candidate.trim();
      }
    } catch (_) {
      // continue
    }
  }
  throw new Error('Could not locate a Chromium binary. Set CHROMIUM_BIN.');
}

function readScenarios() {
  if (!fs.existsSync(SCENARIO_DIR)) return [];
  return fs.readdirSync(SCENARIO_DIR)
    .filter((file) => file.endsWith('.qa.json'))
    .map((file) => {
      const absolutePath = path.join(SCENARIO_DIR, file);
      const data = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
      return Object.assign({ file, absolutePath }, data);
    });
}

function normalizeScenario(rawScenario) {
  const id = rawScenario.id || path.basename(rawScenario.file || 'scenario.qa.json', '.qa.json');
  const name = rawScenario.name || id;
  const pageCandidates = Array.isArray(rawScenario.pageCandidates)
    ? rawScenario.pageCandidates
    : Array.isArray(rawScenario.paths)
      ? rawScenario.paths
      : [];
  const fallbackPath = rawScenario.fallbackPath || rawScenario.contractPath || null;
  const parsedAssertions = Array.isArray(rawScenario.parsedAssertions)
    ? rawScenario.parsedAssertions
    : Array.isArray(rawScenario.requiredParsedKeys)
      ? rawScenario.requiredParsedKeys.map((key) => ({ key }))
      : [];
  const bursts = Array.isArray(rawScenario.bursts) && rawScenario.bursts.length
    ? rawScenario.bursts
    : [
        { label: 'boot', calls: ['window.reset()'] },
        { label: 'advance-east', keys: ['ArrowRight'], advanceMs: 360 },
        { label: 'advance-south', keys: ['ArrowDown'], advanceMs: 360 },
        { label: 'advance-west', keys: ['ArrowLeft'], advanceMs: 360 },
        { label: 'reset', calls: ['window.reset()'] }
      ];
  return {
    id,
    name,
    pageCandidates,
    fallbackPath,
    parsedAssertions,
    requiredHooks: Array.isArray(rawScenario.requiredHooks)
      ? rawScenario.requiredHooks
      : ['QA_READY', 'render_game_to_text', 'advanceTime', 'reset'],
    bursts
  };
}

function createStaticServer() {
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent(String(req.url || '/').split('?')[0]);
    const relativePath = pathname.endsWith('/') ? path.join(pathname, 'index.html') : pathname;
    const absolutePath = path.resolve(ROOT, `.${relativePath}`);
    if (!absolutePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    fs.readFile(absolutePath, (error, buffer) => {
      if (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(error.code === 'ENOENT' ? 'Not Found' : 'Server Error');
        return;
      }
      const ext = path.extname(absolutePath).toLowerCase();
      const mime = {
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain; charset=utf-8',
        '.xml': 'application/xml; charset=utf-8'
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(buffer);
    });
  });
}

async function listen(server, port) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, HOST, resolve);
  });
}

async function closeServer(server) {
  if (!server.listening) return;
  await new Promise((resolve) => server.close(resolve));
}

async function httpRequest(method, url) {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve({ statusCode: response.statusCode || 0, body }));
    });
    request.on('error', reject);
    request.end();
  });
}

async function httpRequestJson(method, url) {
  const response = await httpRequest(method, url);
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`HTTP ${response.statusCode} for ${url}`);
  }
  return JSON.parse(response.body);
}

async function waitForChromeReady(port) {
  const deadline = Date.now() + DEFAULT_TIMEOUT_MS;
  let lastError = 'Chromium not started';
  while (Date.now() < deadline) {
    try {
      return await httpRequestJson('GET', `http://${HOST}:${port}/json/version`);
    } catch (error) {
      lastError = error.message;
      await delay(200);
    }
  }
  throw new Error(`Chromium DevTools port did not become ready: ${lastError}`);
}

class ChromiumRunner {
  constructor(binary, port, headless) {
    this.binary = binary;
    this.port = port;
    this.headless = headless;
    this.child = null;
  }

  async start() {
    const userDataDir = path.join(os.tmpdir(), `webgames-qa-${process.pid}-${Date.now()}`);
    const args = [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--hide-scrollbars',
      '--metrics-recording-only',
      '--no-first-run',
      '--force-device-scale-factor=1',
      '--window-size=1280,960',
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${userDataDir}`
    ];
    if (this.headless) args.unshift('--headless=new');
    this.child = spawn(this.binary, [...args, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
    await waitForChromeReady(this.port);
  }

  async stop() {
    if (!this.child) return;
    const child = this.child;
    child.kill('SIGKILL');
    await new Promise((resolve) => {
      child.once('exit', resolve);
      setTimeout(resolve, 500);
    });
  }
}

class CdpSocket {
  constructor(wsUrl) {
    const parsed = new URL(wsUrl);
    this.host = parsed.hostname;
    this.port = Number(parsed.port || 80);
    this.path = `${parsed.pathname}${parsed.search}`;
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this.pending = new Map();
    this.nextId = 1;
    this.handshakeDone = false;
    this.connectPromise = null;
  }

  connect() {
    if (this.connectPromise) return this.connectPromise;
    this.connectPromise = new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      this.socket = net.createConnection({ host: this.host, port: this.port });
      this.socket.on('error', reject);
      this.socket.on('close', () => {
        for (const pending of this.pending.values()) pending.reject(new Error('CDP socket closed'));
        this.pending.clear();
      });
      this.socket.on('data', (chunk) => {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        if (!this.handshakeDone) {
          const headerEnd = this.buffer.indexOf('\r\n\r\n');
          if (headerEnd === -1) return;
          const headerText = this.buffer.slice(0, headerEnd).toString('utf8');
          if (!/^HTTP\/1\.1 101 /m.test(headerText)) {
            reject(new Error(`WebSocket handshake failed: ${headerText}`));
            return;
          }
          this.handshakeDone = true;
          this.buffer = this.buffer.slice(headerEnd + 4);
          resolve();
        }
        if (this.handshakeDone) this.flushFrames();
      });
      this.socket.on('connect', () => {
        this.socket.write(
          `GET ${this.path} HTTP/1.1\r\n`
          + `Host: ${this.host}:${this.port}\r\n`
          + 'Upgrade: websocket\r\n'
          + 'Connection: Upgrade\r\n'
          + `Sec-WebSocket-Key: ${key}\r\n`
          + 'Sec-WebSocket-Version: 13\r\n'
          + '\r\n'
        );
      });
    });
    return this.connectPromise;
  }

  flushFrames() {
    while (this.buffer.length >= 2) {
      const firstByte = this.buffer[0];
      const secondByte = this.buffer[1];
      const opcode = firstByte & 0x0f;
      const masked = (secondByte & 0x80) !== 0;
      let offset = 2;
      let payloadLength = secondByte & 0x7f;
      if (payloadLength === 126) {
        if (this.buffer.length < offset + 2) return;
        payloadLength = this.buffer.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        if (this.buffer.length < offset + 8) return;
        payloadLength = Number(this.buffer.readBigUInt64BE(offset));
        offset += 8;
      }
      const maskOffset = offset;
      if (masked) offset += 4;
      if (this.buffer.length < offset + payloadLength) return;
      let payload = this.buffer.slice(offset, offset + payloadLength);
      if (masked) {
        const mask = this.buffer.slice(maskOffset, maskOffset + 4);
        const unmasked = Buffer.alloc(payload.length);
        for (let index = 0; index < payload.length; index += 1) {
          unmasked[index] = payload[index] ^ mask[index % 4];
        }
        payload = unmasked;
      }
      this.buffer = this.buffer.slice(offset + payloadLength);
      if (opcode === 0x8) {
        this.socket.end();
        return;
      }
      if (opcode === 0x9) {
        this.sendFrame(0xA, payload);
        continue;
      }
      if (opcode !== 0x1) continue;
      const message = JSON.parse(payload.toString('utf8'));
      if (!message.id || !this.pending.has(message.id)) continue;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
    }
  }

  sendFrame(opcode, body) {
    const payload = Buffer.isBuffer(body) ? body : Buffer.from(String(body), 'utf8');
    let header;
    if (payload.length < 126) {
      header = Buffer.alloc(2);
      header[1] = 0x80 | payload.length;
    } else if (payload.length < 65536) {
      header = Buffer.alloc(4);
      header[1] = 0x80 | 126;
      header.writeUInt16BE(payload.length, 2);
    } else {
      header = Buffer.alloc(10);
      header[1] = 0x80 | 127;
      header.writeBigUInt64BE(BigInt(payload.length), 2);
    }
    header[0] = 0x80 | opcode;
    const mask = crypto.randomBytes(4);
    const maskedPayload = Buffer.alloc(payload.length);
    for (let index = 0; index < payload.length; index += 1) {
      maskedPayload[index] = payload[index] ^ mask[index % 4];
    }
    this.socket.write(Buffer.concat([header, mask, maskedPayload]));
  }

  async send(method, params, timeoutMs) {
    await this.connect();
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs || 10000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        }
      });
      this.sendFrame(0x1, JSON.stringify({ id, method, params: params || {} }));
    });
  }

  async close() {
    if (!this.socket) return;
    this.socket.end();
    await new Promise((resolve) => {
      this.socket.once('close', resolve);
      setTimeout(resolve, 250);
    });
  }
}

async function openTarget(socketPort, url) {
  return httpRequestJson('PUT', `http://${HOST}:${socketPort}/json/new?${encodeURIComponent(url)}`);
}

async function closeTarget(socketPort, pageId) {
  try {
    await httpRequest('GET', `http://${HOST}:${socketPort}/json/close/${pageId}`);
  } catch (_) {
    // ignore cleanup
  }
}

async function evaluate(socket, expression, timeoutMs = 10000) {
  const result = await socket.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  }, timeoutMs);
  if (result.exceptionDetails) {
    throw new Error(`Runtime.evaluate exception: ${result.exceptionDetails.text || 'unknown exception'}`);
  }
  return result.result ? result.result.value : undefined;
}

async function selectTargetUrl(scenario) {
  for (const candidate of scenario.pageCandidates) {
    const absoluteUrl = new URL(candidate, `http://${HOST}:${PORT}/`).href;
    const response = await httpRequest('GET', absoluteUrl);
    if (response.statusCode === 200) return { url: absoluteUrl, source: 'actual', candidate };
  }
  if (scenario.fallbackPath) {
    const absoluteUrl = new URL(scenario.fallbackPath, `http://${HOST}:${PORT}/`).href;
    const response = await httpRequest('GET', absoluteUrl);
    if (response.statusCode === 200) return { url: absoluteUrl, source: 'fallback', candidate: scenario.fallbackPath };
  }
  return { url: null, source: 'missing', candidate: null };
}

function buildConsoleCaptureScript() {
  return `(() => {
    const qa = { errors: [] };
    const push = (type, message) => qa.errors.push({ type, message, time: performance.now() });
    window.__webgameQa = qa;
    window.addEventListener('error', (event) => push('error', event && event.message ? event.message : 'window error'));
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event && event.reason;
      push('unhandledrejection', reason && reason.message ? reason.message : String(reason || 'unhandledrejection'));
    });
    const originalError = console.error.bind(console);
    console.error = (...args) => {
      push('console.error', args.map((arg) => {
        try { return typeof arg === 'string' ? arg : JSON.stringify(arg); }
        catch { return String(arg); }
      }).join(' '));
      return originalError(...args);
    };
  })();`;
}

function buildStateCaptureScript() {
  return `(() => {
    const renderFn = typeof window.render_game_to_text === 'function' ? window.render_game_to_text : null;
    let text = '';
    let renderError = null;
    if (renderFn) {
      try { text = String(renderFn()); }
      catch (error) { renderError = String(error && error.message ? error.message : error); }
    }
    let parsed = null;
    if (text) {
      try { parsed = JSON.parse(text); }
      catch { parsed = null; }
    }
    return {
      qaReady: Boolean(window.QA_READY || window.__WEBGAME_QA_READY__),
      readyState: document.readyState,
      hasRender: typeof window.render_game_to_text === 'function',
      hasAdvanceTime: typeof window.advanceTime === 'function',
      hasReset: typeof window.reset === 'function' || typeof window.resetGame === 'function',
      text,
      parsed,
      renderError,
      title: document.title,
      href: location.href,
      bodyText: document.body ? document.body.innerText : '',
      consoleErrors: window.__webgameQa ? window.__webgameQa.errors.slice() : []
    };
  })()`;
}

async function waitForScenarioReady(socket, scenario) {
  const deadline = Date.now() + DEFAULT_TIMEOUT_MS;
  let lastState = null;
  while (Date.now() < deadline) {
    lastState = await evaluate(socket, buildStateCaptureScript(), 10000);
    const hooksReady = scenario.requiredHooks.every((hook) => {
      if (hook === 'QA_READY') return lastState.qaReady === true;
      if (hook === 'render_game_to_text') return lastState.hasRender === true;
      if (hook === 'advanceTime') return lastState.hasAdvanceTime === true;
      if (hook === 'reset') return lastState.hasReset === true;
      return true;
    });
    if (hooksReady && lastState.readyState !== 'loading') return lastState;
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${scenario.id} QA hooks to become ready.`);
}

async function resetGame(socket, scenario) {
  const expressions = ['window.reset && window.reset()', 'window.resetGame && window.resetGame()'];
  for (const expression of expressions) {
    try {
      const result = await evaluate(socket, expression, 10000);
      if (result !== undefined) return result;
    } catch (_) {
      // continue
    }
  }
  throw new Error(`Could not invoke reset hook for ${scenario.id}.`);
}

async function dispatchKey(socket, keyName) {
  const config = KEY_MAP[keyName];
  if (!config) throw new Error(`Unsupported key: ${keyName}`);
  await socket.send('Input.dispatchKeyEvent', Object.assign({
    type: 'keyDown', modifiers: 0, autoRepeat: false, isSystemKey: false
  }, config), 10000);
  await socket.send('Input.dispatchKeyEvent', Object.assign({
    type: 'keyUp', modifiers: 0, autoRepeat: false, isSystemKey: false
  }, config), 10000);
}

async function captureScreenshot(socket, filePath) {
  const result = await socket.send('Page.captureScreenshot', { format: 'png', fromSurface: true }, 15000);
  if (!result || !result.data) throw new Error('Page.captureScreenshot returned no image data');
  fs.writeFileSync(filePath, Buffer.from(result.data, 'base64'));
}

function summarizeState(state) {
  if (!state) return '(missing state)';
  const parsed = state.parsed && typeof state.parsed === 'object' ? state.parsed : null;
  if (parsed) {
    const parts = [];
    if (typeof parsed.mode !== 'undefined') parts.push(`mode=${parsed.mode}`);
    if (typeof parsed.score !== 'undefined') parts.push(`score=${parsed.score}`);
    if (typeof parsed.length !== 'undefined') parts.push(`length=${parsed.length}`);
    if (typeof parsed.ticks !== 'undefined') parts.push(`ticks=${parsed.ticks}`);
    if (typeof parsed.gameOver !== 'undefined') parts.push(`gameOver=${parsed.gameOver}`);
    return parts.length ? parts.join(' ') : normalizeText(state.text).slice(0, 120);
  }
  return normalizeText(state.text).slice(0, 120);
}

function describeParsedValue(value) {
  if (Array.isArray(value)) return `[${value.map(describeParsedValue).join(', ')}]`;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function validateParsedAssertions(parsed, assertions) {
  const issues = [];
  if (!assertions.length) return issues;
  const source = parsed && typeof parsed === 'object' ? parsed : null;
  for (const assertion of assertions) {
    const keys = Array.isArray(assertion.anyOfKeys) && assertion.anyOfKeys.length
      ? assertion.anyOfKeys
      : assertion.key
        ? [assertion.key]
        : [];
    if (!keys.length) {
      issues.push('parsed assertion is missing key/anyOfKeys');
      continue;
    }
    const key = keys.find((candidate) => source && Object.prototype.hasOwnProperty.call(source, candidate));
    if (!key) {
      issues.push(`missing parsed key: ${keys.join(' or ')}`);
      continue;
    }
    const value = source[key];
    if (assertion.exists === true) continue;

    if (assertion.type) {
      const actualType = Array.isArray(value) ? 'array' : (value === null ? 'null' : typeof value);
      if (assertion.type === 'object') {
        if (actualType !== 'object' || Array.isArray(value) || value === null) {
          issues.push(`parsed key ${key} expected object, got ${actualType}`);
        }
      } else if (actualType !== assertion.type) {
        issues.push(`parsed key ${key} expected ${assertion.type}, got ${actualType}`);
      }
    }

    if (Array.isArray(assertion.anyOfValues) && assertion.anyOfValues.length) {
      const normalizedValue = String(value).trim().toLowerCase();
      const allowed = assertion.anyOfValues.map((entry) => String(entry).trim().toLowerCase());
      if (!allowed.includes(normalizedValue)) {
        issues.push(`parsed key ${key} expected one of ${allowed.join(', ')}, got ${describeParsedValue(value)}`);
      }
    }

    if (assertion.min !== undefined && Number(value) < Number(assertion.min)) {
      issues.push(`parsed key ${key} expected >= ${assertion.min}, got ${describeParsedValue(value)}`);
    }
    if (assertion.max !== undefined && Number(value) > Number(assertion.max)) {
      issues.push(`parsed key ${key} expected <= ${assertion.max}, got ${describeParsedValue(value)}`);
    }
  }
  return issues;
}

async function runScenario(chromiumPort, scenario, outputDir, allowFallback) {
  const target = await selectTargetUrl(scenario);
  if (target.source === 'missing') {
    if (!allowFallback) throw new Error(`No route found for ${scenario.id} and fallback is disabled.`);
    throw new Error(`No route or fallback found for ${scenario.id}.`);
  }
  if (target.source === 'fallback') {
    console.log(`[${scenario.id}] actual route missing, using fallback harness: ${target.candidate}`);
  } else {
    console.log(`[${scenario.id}] using actual route: ${target.candidate}`);
  }

  const page = await openTarget(chromiumPort, 'about:blank');
  const socket = new CdpSocket(page.webSocketDebuggerUrl);
  const resultDir = path.join(outputDir, scenario.id);
  const screenshotDir = path.join(resultDir, 'screenshots');
  ensureDir(resultDir);
  ensureDir(screenshotDir);

  const snapshots = [];
  let state = null;
  const issues = [];

  try {
    await socket.connect();
    await socket.send('Page.enable', {}, 15000);
    await socket.send('Runtime.enable', {}, 15000);
    await socket.send('Log.enable', {}, 15000);
    await socket.send('Page.addScriptToEvaluateOnNewDocument', { source: buildConsoleCaptureScript() }, 15000);
    await socket.send('Page.navigate', { url: target.url }, 15000);

    state = await waitForScenarioReady(socket, scenario);
    await resetGame(socket, scenario);
    state = await evaluate(socket, buildStateCaptureScript(), 10000);
    snapshots.push({ label: 'boot', state });
    await captureScreenshot(socket, path.join(screenshotDir, '00-boot.png'));

    const baselineText = normalizeText(state.text);
    let textChanged = false;
    for (const burst of scenario.bursts) {
      if (burst.label !== 'boot') {
        if (Array.isArray(burst.calls)) {
          for (const expression of burst.calls) await evaluate(socket, expression, 10000);
        }
        if (Array.isArray(burst.keys)) {
          for (const key of burst.keys) await dispatchKey(socket, key);
        }
        if (typeof burst.advanceMs === 'number') {
          await evaluate(socket, `window.advanceTime(${Number(burst.advanceMs)})`, 10000);
        }
        if (typeof burst.pauseMs === 'number') await delay(burst.pauseMs);
      }
      state = await evaluate(socket, buildStateCaptureScript(), 10000);
      snapshots.push({ label: burst.label, state });
      await captureScreenshot(socket, path.join(screenshotDir, `${String(snapshots.length - 1).padStart(2, '0')}-${burst.label}.png`));
      if (!textChanged && normalizeText(state.text) !== baselineText) textChanged = true;
    }

    const finalReset = snapshots.find((entry) => entry.label === 'reset');
    if (!state.qaReady) issues.push('QA_READY flag was not truthy');
    if (!state.hasRender || !state.hasAdvanceTime || !state.hasReset) issues.push('one or more required hooks were missing');
    if (!normalizeText(state.text)) issues.push('render_game_to_text returned empty text');
    if (!textChanged) issues.push('render_game_to_text never changed after motion bursts');
    if (finalReset && normalizeText(finalReset.state.text) !== baselineText) issues.push('reset did not restore the boot snapshot');
    if (scenario.parsedAssertions && scenario.parsedAssertions.length) {
      for (const entry of snapshots) {
        issues.push(...validateParsedAssertions(entry.state.parsed, scenario.parsedAssertions).map((issue) => `parsed assertion failed at ${entry.label}: ${issue}`));
      }
    }
    if ((state.consoleErrors || []).length) {
      issues.push(`browser errors detected: ${state.consoleErrors.map((entry) => `${entry.type}:${entry.message}`).join(' | ')}`);
    }

    const report = {
      id: scenario.id,
      name: scenario.name,
      targetUrl: target.url,
      targetStatus: target.source,
      usedFallback: target.source === 'fallback',
      passed: issues.length === 0,
      issues,
      snapshots: snapshots.map((entry) => ({
        label: entry.label,
        summary: summarizeState(entry.state),
        text: entry.state.text,
        qaErrors: entry.state.consoleErrors || []
      }))
    };

    fs.writeFileSync(path.join(resultDir, 'manifest.json'), JSON.stringify(report, null, 2));
    fs.writeFileSync(
      path.join(resultDir, 'summary.txt'),
      [
        `${report.passed ? 'PASS' : 'FAIL'} ${scenario.id} :: ${target.source}${target.source === 'fallback' ? ' (fallback harness)' : ''}`,
        `target: ${target.url}`,
        `boot: ${snapshots[0] ? snapshots[0].state.text : '(missing)'}`,
        `final: ${state.text}`,
        ...(issues.length ? issues.map((issue) => `issue: ${issue}`) : ['issue: none'])
      ].join('\n') + '\n'
    );

    if (!report.passed) {
      throw new Error(`${scenario.id} QA failed: ${issues.join(' | ')}`);
    }

    return report;
  } finally {
    try { await socket.close(); } catch (_) {}
    await closeTarget(chromiumPort, page.id);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const scenarioFiles = readScenarios().map(normalizeScenario);
  const selected = args.scenario ? scenarioFiles.filter((scenario) => scenario.id === args.scenario) : scenarioFiles;

  if (args.list) {
    console.log(selected.map((scenario) => `${scenario.id}: ${scenario.name}`).join('\n'));
    return;
  }

  if (!selected.length) {
    throw new Error(args.scenario ? `Unknown scenario: ${args.scenario}` : 'No QA scenarios found.');
  }

  ensureDir(args.outputDir);
  const chromiumBinary = resolveChromiumBinary();
  const server = createStaticServer();
  const chrome = new ChromiumRunner(chromiumBinary, CHROME_PORT, args.headless);
  const results = [];

  try {
    await listen(server, PORT);
    await chrome.start();
    for (const scenario of selected) {
      results.push(await runScenario(CHROME_PORT, scenario, args.outputDir, !args.strict));
    }
  } finally {
    await closeServer(server);
    await chrome.stop();
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    chromiumBinary,
    chromePort: CHROME_PORT,
    port: PORT,
    results
  };
  const manifestPath = path.join(args.outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  const summaryPath = path.join(args.outputDir, 'summary.txt');
  fs.writeFileSync(
    summaryPath,
    results.map((result) => (
      `${result.passed ? 'PASS' : 'FAIL'} ${result.id} :: ${result.targetStatus}${result.usedFallback ? ' (fallback harness)' : ''} :: ${result.issues.length ? result.issues.join(' | ') : 'ok'}`
    )).join('\n') + '\n'
  );

  console.log(`Webgame QA complete for ${results.length} scenario(s).`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
