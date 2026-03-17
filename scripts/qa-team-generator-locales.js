#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');
const vm = require('vm');
const { spawnSync, spawn } = require('child_process');
const { ALL_LOCALES, RTL_LOCALES } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const I18N_PATH = path.join(ROOT, 'assets/js/team-generator-i18n.js');
const OUTPUT_DIR = path.join(ROOT, 'test-results', 'team-generator-local-qa-dom');
const HOST = '127.0.0.1';
const PORT = Number(process.env.QA_PORT || 4173);
const CHROME_PORT = Number(process.env.QA_CHROME_PORT || 9223);
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};
const EXPECTED_MEMBER_INPUTS = ['21', '18', '17', '16', '14', '12'];
const EXPECTED_AVERAGES = ['19.5', '16.5', '13'];
const LOCALES = String(process.env.QA_LOCALES || '')
  .split(',')
  .map((locale) => locale.trim())
  .filter(Boolean);
const ACTIVE_LOCALES = LOCALES.length ? LOCALES : ALL_LOCALES;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendResponse(res, status, body, contentType) {
  res.writeHead(status, { 'Content-Type': contentType || 'text/plain; charset=utf-8' });
  res.end(body);
}

function resolveStaticPath(urlPath) {
  const pathname = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  const relativePath = pathname.endsWith('/')
    ? path.join(pathname, 'index.html')
    : pathname;
  const absolutePath = path.resolve(ROOT, `.${relativePath}`);
  if (!absolutePath.startsWith(ROOT)) return null;
  return absolutePath;
}

function createStaticServer() {
  return http.createServer((req, res) => {
    const absolutePath = resolveStaticPath(req.url);
    if (!absolutePath) {
      sendResponse(res, 403, 'Forbidden');
      return;
    }

    fs.readFile(absolutePath, (error, buffer) => {
      if (error) {
        sendResponse(res, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not Found' : 'Server Error');
        return;
      }
      sendResponse(res, 200, buffer, MIME_TYPES[path.extname(absolutePath)] || 'application/octet-stream');
    });
  });
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, HOST, resolve);
  });
}

async function close(server) {
  if (!server.listening) return;
  await new Promise((resolve) => server.close(resolve));
}

function resolveChromiumBinary() {
  if (process.env.CHROMIUM_BIN) return process.env.CHROMIUM_BIN;
  const lookup = spawnSync('/bin/bash', [
    '-lc',
    'command -v chromium || command -v chromium-browser || command -v google-chrome || command -v google-chrome-stable'
  ], { encoding: 'utf8' });
  const candidate = (lookup.stdout || '').trim().split('\n').find(Boolean);
  if (!candidate) throw new Error('Could not locate a Chromium binary. Set CHROMIUM_BIN.');
  return candidate;
}

async function httpRequest(method, url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          body
        });
      });
    });
    req.on('error', reject);
    req.end();
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
  const deadline = Date.now() + 15000;
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

function parseDataMap() {
  const source = fs.readFileSync(I18N_PATH, 'utf8');
  const start = source.indexOf('const dataMap = ');
  const end = source.indexOf('\n  function normalizeLang');
  if (start === -1 || end === -1) throw new Error('Could not locate team-generator dataMap.');
  return JSON.parse(source.slice(start + 'const dataMap = '.length, end).trim().replace(/;$/, ''));
}

function buildRuntimeExpectations() {
  const source = fs.readFileSync(I18N_PATH, 'utf8');
  const expectations = {};

  for (const locale of ALL_LOCALES) {
    const sandbox = {
      console,
      URL,
      URLSearchParams,
      setTimeout: () => 0,
      clearTimeout: () => {},
      window: {
        __rltBootLang: locale,
        __TEAM_GENERATOR_LOCAL_QA__: false,
        location: { href: 'http://localhost/', search: '' }
      },
      document: {
        documentElement: {
          lang: locale,
          dir: locale === 'ar' ? 'rtl' : 'ltr',
          getAttribute: () => null,
          setAttribute: () => {},
          classList: {
            add: () => {},
            remove: () => {}
          }
        },
        addEventListener: () => {},
        getElementById: () => null,
        querySelectorAll: () => []
      }
    };

    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: 'team-generator-i18n.js' });
    const messages = sandbox.window.__TEAM_GENERATOR_CONFIG__ && sandbox.window.__TEAM_GENERATOR_CONFIG__.messages;
    if (!messages) throw new Error(`Could not build runtime messages for ${locale}`);

    expectations[locale] = {
      scoreToggleBtn: messages.scoreToggleBtn,
      cardMatchAverageLabel: messages.cardMatchAverageLabel,
      resultMetaDefault: messages.resultMetaDefault,
      scoreStatusWinner: messages.scoreStatusWinner,
      scoreStatusTie: messages.scoreStatusTie
    };
  }

  return expectations;
}

class ChromiumRunner {
  constructor(binary, port) {
    this.binary = binary;
    this.port = port;
    this.child = null;
    this.stderrTail = '';
  }

  async start() {
    const userDataDir = path.join('/tmp', `team-generator-qa-${process.pid}-${Date.now()}`);
    this.child = spawn(this.binary, [
      '--headless',
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
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank'
    ], {
      stdio: ['ignore', 'ignore', 'pipe']
    });

    this.child.stderr.on('data', (chunk) => {
      this.stderrTail += chunk.toString('utf8');
      if (this.stderrTail.length > 24000) {
        this.stderrTail = this.stderrTail.slice(-24000);
      }
    });

    this.child.on('exit', () => {
      this.child = null;
    });

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
        for (const pending of this.pending.values()) {
          pending.reject(new Error('CDP socket closed'));
        }
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

      if (message.error) {
        pending.reject(new Error(JSON.stringify(message.error)));
      } else {
        pending.resolve(message.result);
      }
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

      this.sendFrame(0x1, JSON.stringify({
        id,
        method,
        params: params || {}
      }));
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

function localeFile(locale) {
  return locale === 'ko'
    ? path.join(ROOT, 'team-generator', 'index.html')
    : path.join(ROOT, locale, 'team-generator', 'index.html');
}

function localeHarnessUrl(locale) {
  const params = new URLSearchParams({
    locale,
    qa: '1',
    qa_headless: '1',
    qa_autofill: '1',
    qa_case: 'score-entry'
  });
  return `http://${HOST}:${PORT}/assets/qa/team-generator-local-harness.html?${params.toString()}`;
}

function buildSnapshotScript() {
  return `(() => {
    const cards = Array.from(document.querySelectorAll('[data-team-card]'));
    const memberInputs = Array.from(document.querySelectorAll('input[data-member-score-input]'));
    const visibleWinnerPills = Array.from(document.querySelectorAll('[data-team-winner-pill]'))
      .filter((node) => node.getAttribute('aria-hidden') !== 'true')
      .map((node) => node.textContent.trim())
      .filter(Boolean);
    const averageLabels = Array.from(document.querySelectorAll('[data-team-stat-label]'))
      .map((node) => node.textContent.trim())
      .filter(Boolean);
    const averageValues = Array.from(document.querySelectorAll('[data-team-stat-value]'))
      .map((node) => node.textContent.trim())
      .filter(Boolean);
    const toggle = document.getElementById('score-toggle-btn');
    const config = window.__TEAM_GENERATOR_CONFIG__ || {};
    const runtimeMessages = config.messages || {};

    return JSON.stringify({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir || 'ltr',
      qaReady: document.documentElement.getAttribute('data-team-generator-qa-ready'),
      bodyVisible: document.body ? getComputedStyle(document.body).visibility : null,
      readyState: document.readyState,
      toggleLabel: toggle ? toggle.textContent.trim() : null,
      runtimeMetaDefault: runtimeMessages.resultMetaDefault || null,
      cardCount: cards.length,
      resultsTitle: (document.getElementById('results-title') || {}).textContent || null,
      resultsIntro: (document.getElementById('results-intro') || {}).textContent || null,
      rerollLabel: (document.getElementById('reroll-btn') || {}).textContent || null,
      copyLabel: (document.getElementById('copy-btn') || {}).textContent || null,
      exportLabel: (document.getElementById('export-btn') || {}).textContent || null,
      emptyBody: (document.getElementById('empty-body') || {}).textContent || null,
      teamTitles: cards.map((card) => {
        const title = card.querySelector('h3');
        return title ? title.textContent.trim() : '';
      }).filter(Boolean),
      winnerPills: visibleWinnerPills,
      averageLabels,
      averageValues,
      memberInputCount: memberInputs.length,
      memberInputValues: memberInputs.map((input) => input.value)
    });
  })()`;
}

async function captureSnapshot(socket) {
  const result = await socket.send('Runtime.evaluate', {
    expression: buildSnapshotScript(),
    returnByValue: true
  }, 10000);

  if (result.exceptionDetails) {
    throw new Error(`Runtime.evaluate exception: ${result.exceptionDetails.text || 'unknown exception'}`);
  }

  const value = result.result && result.result.value;
  if (typeof value !== 'string') {
    throw new Error(`Runtime.evaluate returned ${result.result ? result.result.type : 'no result'}`);
  }

  return JSON.parse(value);
}

async function waitForReadySnapshot(socket) {
  const deadline = Date.now() + 30000;
  let lastSnapshot = {};

  while (Date.now() < deadline) {
    try {
      lastSnapshot = await captureSnapshot(socket);
      if (
        lastSnapshot.qaReady === 'true'
        && lastSnapshot.toggleLabel
        && lastSnapshot.cardCount === 3
        && lastSnapshot.memberInputCount === 6
      ) {
        return lastSnapshot;
      }
    } catch (error) {
      lastSnapshot = { evaluationError: error.message };
    }

    await delay(150);
  }

  return Object.assign({}, lastSnapshot, { timeout: true });
}

function normalizeScoreNumber(value) {
  const digitMap = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };

  const normalized = String(value || '')
    .replace(/[٠-٩۰-۹]/g, (match) => digitMap[match] || match)
    .replace(/[٫,]/g, '.')
    .replace(/٬/g, '')
    .replace(/[^0-9.+-]/g, '');

  return Number.parseFloat(normalized);
}

function stripTags(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function extractTextById(html, id) {
  const pattern = new RegExp(`<([a-z0-9:-]+)[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'i');
  const match = html.match(pattern);
  return match ? stripTags(match[2]) : null;
}

function validateLocale(locale, payload, staticText, dynamicText) {
  const issues = [];

  if (payload.timeout) issues.push(`timed out waiting for QA-ready UI (${payload.evaluationError || payload.readyState || 'unknown'})`);
  if (payload.lang !== locale) issues.push(`lang mismatch: expected ${locale}, got ${payload.lang}`);

  const expectedDir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  if (payload.dir !== expectedDir) issues.push(`dir mismatch: expected ${expectedDir}, got ${payload.dir}`);
  if (payload.qaReady !== 'true') issues.push(`qaReady mismatch: expected true, got ${payload.qaReady}`);
  if (payload.bodyVisible !== 'visible') issues.push(`body visibility mismatch: expected visible, got ${payload.bodyVisible}`);
  if (payload.toggleLabel !== dynamicText.scoreToggleBtn) issues.push(`toggle label mismatch: expected "${dynamicText.scoreToggleBtn}", got "${payload.toggleLabel}"`);
  if (normalizeText(payload.runtimeMetaDefault) !== normalizeText(dynamicText.resultMetaDefault)) {
    issues.push(`result meta mismatch: expected "${dynamicText.resultMetaDefault}", got "${payload.runtimeMetaDefault}"`);
  }
  if (payload.cardCount !== 3) issues.push(`card count mismatch: expected 3, got ${payload.cardCount}`);
  if (payload.memberInputCount !== 6) issues.push(`member input count mismatch: expected 6, got ${payload.memberInputCount}`);

  if (JSON.stringify(payload.memberInputValues || []) !== JSON.stringify(EXPECTED_MEMBER_INPUTS)) {
    issues.push(`member score autofill mismatch: expected ${EXPECTED_MEMBER_INPUTS.join(',')}, got ${(payload.memberInputValues || []).join(',')}`);
  }

  const normalizedAverageValues = (payload.averageValues || []).map(normalizeScoreNumber);
  const expectedAverageValues = EXPECTED_AVERAGES.map((value) => Number(value));
  if (
    normalizedAverageValues.length !== expectedAverageValues.length
    || normalizedAverageValues.some((value, index) => Math.abs(value - expectedAverageValues[index]) > 1e-9)
  ) {
    issues.push(`team averages mismatch: expected ${EXPECTED_AVERAGES.join(',')}, got ${(payload.averageValues || []).join(',')}`);
  }

  const averageLabels = payload.averageLabels || [];
  if (!averageLabels.length || !averageLabels.every((label) => label === dynamicText.cardMatchAverageLabel)) {
    issues.push(`team average labels mismatch: expected only "${dynamicText.cardMatchAverageLabel}", got ${averageLabels.join(',') || '(none)'}`);
  }

  const allowedWinnerPills = new Set([dynamicText.scoreStatusWinner, dynamicText.scoreStatusTie]);
  const winnerPills = payload.winnerPills || [];
  if (!winnerPills.length) {
    issues.push('winner pills missing');
  } else {
    if (!winnerPills.includes(dynamicText.scoreStatusWinner)) {
      issues.push(`winner pill mismatch: expected at least one "${dynamicText.scoreStatusWinner}", got ${winnerPills.join(',')}`);
    }
    const invalidWinnerPills = winnerPills.filter((label) => !allowedWinnerPills.has(label));
    if (invalidWinnerPills.length) {
      issues.push(`unexpected winner pill labels: ${invalidWinnerPills.join(',')}`);
    }
  }

  return issues;
}

function validateLocaleSource(staticSnapshot, staticText) {
  const issues = [];

  if (staticSnapshot.resultsTitle !== staticText.resultsTitle) issues.push(`results title mismatch: expected "${staticText.resultsTitle}", got "${staticSnapshot.resultsTitle}"`);
  if (normalizeText(staticSnapshot.resultsIntro) !== normalizeText(staticText.resultsIntro)) {
    issues.push(`results intro mismatch: expected "${staticText.resultsIntro}", got "${staticSnapshot.resultsIntro}"`);
  }
  if (staticSnapshot.rerollLabel !== staticText.rerollBtn) issues.push(`reroll label mismatch: expected "${staticText.rerollBtn}", got "${staticSnapshot.rerollLabel}"`);
  if (staticSnapshot.copyLabel !== staticText.copyBtn) issues.push(`copy label mismatch: expected "${staticText.copyBtn}", got "${staticSnapshot.copyLabel}"`);
  if (staticSnapshot.exportLabel !== staticText.exportBtn) issues.push(`export label mismatch: expected "${staticText.exportBtn}", got "${staticSnapshot.exportLabel}"`);
  if (normalizeText(staticSnapshot.heroBody) !== normalizeText(staticText.heroBody)) {
    issues.push(`hero body mismatch: expected "${staticText.heroBody}", got "${staticSnapshot.heroBody}"`);
  }
  if (normalizeText(staticSnapshot.emptyBody) !== normalizeText(staticText.emptyBody)) {
    issues.push(`empty body mismatch: expected "${staticText.emptyBody}", got "${staticSnapshot.emptyBody}"`);
  }

  return issues;
}

async function openLocaleSocket(locale) {
  const page = await httpRequestJson('PUT', `http://${HOST}:${CHROME_PORT}/json/new?${encodeURIComponent(localeHarnessUrl(locale))}`);
  const socket = new CdpSocket(page.webSocketDebuggerUrl);
  await socket.connect();
  await socket.send('Runtime.enable', {}, 5000);
  return { page, socket };
}

async function closeLocaleSocket(pageId, socket) {
  try {
    await socket.close();
  } catch (_) {
    // Ignore socket shutdown errors during cleanup.
  }

  try {
    await httpRequest('GET', `http://${HOST}:${CHROME_PORT}/json/close/${pageId}`);
  } catch (_) {
    // Ignore target close errors during cleanup.
  }
}

async function auditLocale(locale, staticMap, dynamicMap) {
  const { page, socket } = await openLocaleSocket(locale);

  try {
    const sourceHtml = fs.readFileSync(localeFile(locale), 'utf8');
    const staticSnapshot = {
      heroBody: extractTextById(sourceHtml, 'hero-body'),
      resultsTitle: extractTextById(sourceHtml, 'results-title'),
      resultsIntro: extractTextById(sourceHtml, 'results-intro'),
      rerollLabel: extractTextById(sourceHtml, 'reroll-btn'),
      copyLabel: extractTextById(sourceHtml, 'copy-btn'),
      exportLabel: extractTextById(sourceHtml, 'export-btn'),
      emptyBody: extractTextById(sourceHtml, 'empty-body')
    };
    const payload = await waitForReadySnapshot(socket);
    const staticText = staticMap[locale] || staticMap.en;
    const dynamicText = dynamicMap[locale] || dynamicMap.en;
    const issues = [
      ...validateLocaleSource(staticSnapshot, staticText),
      ...validateLocale(locale, payload, staticText, dynamicText)
    ];
    return {
      locale,
      pass: issues.length === 0,
      issues,
      payload,
      staticSnapshot
    };
  } finally {
    await closeLocaleSocket(page.id, socket);
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const staticMap = parseDataMap();
  const dynamicMap = buildRuntimeExpectations();
  const chromiumBinary = resolveChromiumBinary();
  const server = createStaticServer();
  const chrome = new ChromiumRunner(chromiumBinary, CHROME_PORT);
  const entries = [];

  try {
    await listen(server);
    await chrome.start();

    for (const locale of ACTIVE_LOCALES) {
      console.log(`Auditing ${locale}...`);
      entries.push(await auditLocale(locale, staticMap, dynamicMap));
    }
  } finally {
    await close(server);
    await chrome.stop();
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    chromiumBinary,
    chromePort: CHROME_PORT,
    mode: 'dom-audit',
    entries
  };
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const summaryLines = entries.map((entry) => (
    `${entry.pass ? 'PASS' : 'FAIL'} ${entry.locale} :: ${entry.issues.length ? entry.issues.join(' | ') : entry.payload.toggleLabel}`
  ));
  const summaryPath = path.join(OUTPUT_DIR, 'summary.txt');
  fs.writeFileSync(summaryPath, `${summaryLines.join('\n')}\n`);

  const failures = entries.filter((entry) => !entry.pass);
  console.log(`Audited ${entries.length} locales.`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Summary: ${summaryPath}`);

  if (failures.length) {
    throw new Error(`Locale QA failed for ${failures.map((entry) => entry.locale).join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
