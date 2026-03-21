(() => {
  const DEFAULT_SEED = 0x51a7c0de;
  const GRID_SIZE = 20;
  const START_LENGTH = 3;
  const BASE_STEP_MS = 120;
  const MIN_STEP_MS = 70;
  const SCORE_PER_SPEED_UP = 4;

  const copy = window.__SNAKE_COPY__ || {};
  const canvas = document.getElementById('snake-board');
  const statusEl = document.getElementById('snake-status');
  const scoreEl = document.getElementById('snake-score');
  const bestEl = document.getElementById('snake-best');
  const lengthEl = document.getElementById('snake-length');
  const speedEl = document.getElementById('snake-speed');
  const pauseBtn = document.getElementById('snake-pause');
  const restartBtn = document.getElementById('snake-restart');
  const gameTag = document.getElementById('snake-game-tag');
  const hintEl = document.getElementById('snake-hint');
  const ctx = canvas.getContext('2d');

  const controls = {
    up: document.querySelector('[data-snake-dir="up"]'),
    down: document.querySelector('[data-snake-dir="down"]'),
    left: document.querySelector('[data-snake-dir="left"]'),
    right: document.querySelector('[data-snake-dir="right"]')
  };

  const state = {
    phase: 'running',
    score: 0,
    best: Number(window.localStorage?.getItem('rlt-snake-best-v1') || '0') || 0,
    seed: DEFAULT_SEED,
    rng: null,
    snake: [],
    direction: { x: 1, y: 0 },
    queuedDirection: null,
    apple: { x: 0, y: 0 },
    accumulator: 0,
    tickMs: BASE_STEP_MS,
    lastFrameTime: 0,
    frameHandle: 0,
    boardRect: { width: 0, height: 0 },
    swipeStart: null,
    initialized: false
  };

  function createRng(seed) {
    let value = seed >>> 0;
    if (!value) value = DEFAULT_SEED;
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  function normalizeSeed(seed) {
    if (Number.isFinite(seed)) return (seed >>> 0) || DEFAULT_SEED;
    const parsed = Number.parseInt(String(seed), 10);
    return Number.isFinite(parsed) ? ((parsed >>> 0) || DEFAULT_SEED) : DEFAULT_SEED;
  }

  function opposite(a, b) {
    return a.x === -b.x && a.y === -b.y;
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setTag(stateName, text) {
    if (!gameTag) return;
    gameTag.dataset.state = stateName;
    gameTag.textContent = text;
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (bestEl) bestEl.textContent = String(state.best);
    if (lengthEl) lengthEl.textContent = String(state.snake.length);
    if (speedEl) speedEl.textContent = `${Math.round(1000 / state.tickMs)} /s`;

    if (state.phase === 'running') {
      setTag('running', copy.runningTag || 'Running');
      setStatus(copy.playingStatus || 'Guide the snake with arrow keys, WASD, or the on-screen buttons.');
      if (pauseBtn) pauseBtn.textContent = copy.pauseButton || 'Pause';
    } else if (state.phase === 'paused') {
      setTag('paused', copy.pausedTag || 'Paused');
      setStatus(copy.pausedStatus || 'The game is paused. Press resume or restart to continue.');
      if (pauseBtn) pauseBtn.textContent = copy.resumeButton || 'Resume';
    } else {
      setTag('gameover', copy.gameOverTag || 'Game Over');
      setStatus(copy.gameOverStatus || 'Game over. Restart to try the same challenge again.');
      if (pauseBtn) pauseBtn.textContent = copy.resumeButton || 'Resume';
    }
  }

  function setControlsDisabled(disabled) {
    if (pauseBtn) pauseBtn.disabled = disabled;
    for (const btn of Object.values(controls)) {
      if (btn) btn.disabled = disabled;
    }
  }

  function cellsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function isOccupied(cell, snake) {
    return snake.some((segment) => cellsEqual(segment, cell));
  }

  function nextRandomCell() {
    const candidate = { x: 0, y: 0 };
    let safety = 0;
    do {
      candidate.x = Math.floor(state.rng() * GRID_SIZE);
      candidate.y = Math.floor(state.rng() * GRID_SIZE);
      safety += 1;
      if (safety > 500) break;
    } while (isOccupied(candidate, state.snake));
    return candidate;
  }

  function updateSpeed() {
    const reduced = Math.floor(state.score / SCORE_PER_SPEED_UP) * 5;
    state.tickMs = Math.max(MIN_STEP_MS, BASE_STEP_MS - reduced);
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem('rlt-snake-best-v1', String(state.best));
    }
  }

  function syncButtons() {
    if (restartBtn) restartBtn.textContent = copy.restartButton || 'Restart';
  }

  function resetGame(seed = DEFAULT_SEED) {
    state.seed = normalizeSeed(seed);
    state.rng = createRng(state.seed);
    state.score = 0;
    state.snake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 }
    ];
    state.direction = { x: 1, y: 0 };
    state.queuedDirection = null;
    state.apple = nextRandomCell();
    state.accumulator = 0;
    state.phase = 'running';
    state.lastFrameTime = 0;
    updateSpeed();
    updateHud();
    draw();
    setControlsDisabled(false);
    if (canvas) canvas.focus?.();
    return render_game_to_text();
  }

  function pauseGame() {
    if (state.phase === 'gameover') return;
    state.phase = 'paused';
    updateHud();
    draw();
  }

  function resumeGame() {
    if (state.phase !== 'paused') return;
    state.phase = 'running';
    state.lastFrameTime = performance.now();
    updateHud();
    draw();
  }

  function togglePause() {
    if (state.phase === 'gameover') {
      resetGame(state.seed);
      return;
    }
    if (state.phase === 'paused') {
      resumeGame();
    } else {
      pauseGame();
    }
  }

  function setDirection(next) {
    if (!next) return;
    const current = state.queuedDirection || state.direction;
    if (opposite(next, current)) return;
    state.queuedDirection = next;
  }

  function endGame(reason) {
    state.phase = 'gameover';
    state.accumulator = 0;
    if (state.score > state.best) {
      state.best = state.score;
      saveBest();
    }
    updateHud();
    draw(reason);
  }

  function maybeIncreaseDifficulty() {
    updateSpeed();
  }

  function stepGame() {
    if (state.phase !== 'running') return;

    if (state.queuedDirection && !opposite(state.queuedDirection, state.direction)) {
      state.direction = state.queuedDirection;
    }
    state.queuedDirection = null;

    const head = state.snake[0];
    const next = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      endGame(copy.hitWallStatus || 'You hit the wall.');
      return;
    }

    const tailWillMove = !(next.x === state.apple.x && next.y === state.apple.y);
    const occupied = state.snake.some((segment, index) => {
      if (tailWillMove && index === state.snake.length - 1) return false;
      return cellsEqual(segment, next);
    });

    if (occupied) {
      endGame(copy.hitBodyStatus || 'You ran into your own body.');
      return;
    }

    state.snake.unshift(next);

    if (next.x === state.apple.x && next.y === state.apple.y) {
      state.score += 1;
      if (state.score > state.best) {
        state.best = state.score;
        saveBest();
      }
      state.apple = nextRandomCell();
      maybeIncreaseDifficulty();
    } else {
      state.snake.pop();
    }

    updateHud();
    draw();
  }

  function advanceTime(ms = 0) {
    const value = Number(ms);
    if (!Number.isFinite(value) || value <= 0) {
      return render_game_to_text();
    }

    if (state.phase !== 'running') {
      return render_game_to_text();
    }

    state.accumulator += value;
    while (state.accumulator >= state.tickMs && state.phase === 'running') {
      state.accumulator -= state.tickMs;
      stepGame();
    }
    draw();
    return render_game_to_text();
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function draw() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.boardRect = { width: rect.width, height: rect.height };

    const width = rect.width;
    const height = rect.height;
    const cell = Math.min(width, height) / GRID_SIZE;
    const boardWidth = cell * GRID_SIZE;
    const boardHeight = cell * GRID_SIZE;
    const offsetX = (width - boardWidth) / 2;
    const offsetY = (height - boardHeight) / 2;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#07111f');
    bg.addColorStop(1, '#0a1628');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(offsetX, offsetY);

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        ctx.fillStyle = (row + col) % 2 === 0 ? 'rgba(15, 23, 42, 0.14)' : 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(col * cell, row * cell, cell - 1, cell - 1);
      }
    }

    ctx.save();
    ctx.shadowColor = 'rgba(34, 197, 94, 0.55)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#f59e0b';
    drawRoundedRect(ctx, state.apple.x * cell + cell * 0.18, state.apple.y * cell + cell * 0.18, cell * 0.64, cell * 0.64, cell * 0.2);
    ctx.fill();
    ctx.restore();

    state.snake.forEach((segment, index) => {
      const padding = index === 0 ? 0.12 : 0.16;
      ctx.fillStyle = index === 0 ? '#86efac' : '#22c55e';
      ctx.shadowColor = index === 0 ? 'rgba(134, 239, 172, 0.45)' : 'rgba(34, 197, 94, 0.28)';
      ctx.shadowBlur = index === 0 ? 14 : 8;
      drawRoundedRect(
        ctx,
        segment.x * cell + cell * padding,
        segment.y * cell + cell * padding,
        cell * (1 - padding * 2),
        cell * (1 - padding * 2),
        cell * 0.26
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (state.phase === 'paused' || state.phase === 'gameover') {
      ctx.save();
      ctx.fillStyle = state.phase === 'paused' ? 'rgba(6, 10, 22, 0.66)' : 'rgba(126, 29, 29, 0.66)';
      ctx.fillRect(0, 0, boardWidth, boardHeight);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Arial, sans-serif';
      ctx.fillText(state.phase === 'paused' ? (copy.pausedTag || 'Paused') : (copy.gameOverTag || 'Game Over'), boardWidth / 2, boardHeight / 2 - 4);
      ctx.font = '500 14px Arial, sans-serif';
      const message = state.phase === 'paused'
        ? (copy.pausedOverlay || 'Press resume to continue.')
        : (copy.gameOverOverlay || 'Press restart to play again.');
      ctx.fillText(message, boardWidth / 2, boardHeight / 2 + 20);
      ctx.restore();
    }

    ctx.restore();
  }

  function encodeBoard() {
    const rows = [];
    for (let y = 0; y < GRID_SIZE; y += 1) {
      let line = '';
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (x === state.apple.x && y === state.apple.y) {
          line += '*';
          continue;
        }
        const bodyIndex = state.snake.findIndex((segment) => segment.x === x && segment.y === y);
        line += bodyIndex === -1 ? '.' : (bodyIndex === 0 ? 'H' : '#');
      }
      rows.push(line);
    }
    return rows.join('\n');
  }

  function render_game_to_text() {
    const head = state.snake[0] || { x: 0, y: 0 };
    const status = state.phase === 'running'
      ? (copy.playingTag || 'running')
      : state.phase;
    return [
      'Snake',
      `state: ${status}`,
      `score: ${state.score}`,
      `best: ${state.best}`,
      `length: ${state.snake.length}`,
      `speed: ${Math.round(1000 / state.tickMs)} steps/s`,
      `seed: ${state.seed}`,
      `head: ${head.x},${head.y}`,
      `apple: ${state.apple.x},${state.apple.y}`,
      encodeBoard()
    ].join('\n');
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') {
      event.preventDefault();
      setDirection({ x: 0, y: -1 });
    } else if (key === 'arrowdown' || key === 's') {
      event.preventDefault();
      setDirection({ x: 0, y: 1 });
    } else if (key === 'arrowleft' || key === 'a') {
      event.preventDefault();
      setDirection({ x: -1, y: 0 });
    } else if (key === 'arrowright' || key === 'd') {
      event.preventDefault();
      setDirection({ x: 1, y: 0 });
    } else if (key === ' ' || key === 'spacebar') {
      event.preventDefault();
      togglePause();
    } else if (key === 'r') {
      event.preventDefault();
      resetGame(state.seed);
    }
  }

  function bindControlButtons() {
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (restartBtn) restartBtn.addEventListener('click', () => resetGame(state.seed));

    for (const [dir, btn] of Object.entries(controls)) {
      if (!btn) continue;
      btn.addEventListener('click', () => setDirection({
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      }[dir]));
      btn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        btn.setPointerCapture?.(event.pointerId);
        setDirection({
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 },
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 }
        }[dir]);
      });
    }
  }

  function bindSwipe() {
    if (!canvas) return;
    canvas.addEventListener('pointerdown', (event) => {
      state.swipeStart = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener('pointerup', (event) => {
      if (!state.swipeStart) return;
      const dx = event.clientX - state.swipeStart.x;
      const dy = event.clientY - state.swipeStart.y;
      state.swipeStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else {
        setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    });
    canvas.addEventListener('pointercancel', () => {
      state.swipeStart = null;
    });
  }

  function tick(now) {
    if (state.lastFrameTime === 0) {
      state.lastFrameTime = now;
    }
    const delta = now - state.lastFrameTime;
    state.lastFrameTime = now;
    if (state.phase === 'running' && delta > 0) {
      advanceTime(delta);
    } else {
      draw();
    }
    state.frameHandle = window.requestAnimationFrame(tick);
  }

  function updateHint() {
    if (!hintEl) return;
    hintEl.textContent = copy.mobileHint || 'Swipe the board or use the buttons below on mobile.';
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    syncButtons();
    updateHint();
    updateHud();
    bindControlButtons();
    bindSwipe();
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', draw);

    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    state.resizeObserver = observer;

    resetGame(DEFAULT_SEED);
    window.__WEBGAME_QA_READY__ = true;
    window.QA_READY = true;
    window.render_game_to_text = render_game_to_text;
    window.advanceTime = advanceTime;
    window.resetGame = resetGame;
    window.reset = resetGame;
    window.__WEBGAME_QA_SEED__ = DEFAULT_SEED;
    setControlsDisabled(false);
    draw();
    state.frameHandle = window.requestAnimationFrame(tick);
  }

  if (canvas) {
    init();
  }
})();
