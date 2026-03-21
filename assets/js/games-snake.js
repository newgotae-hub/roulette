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
  const targetEl = document.getElementById('snake-target');
  const lengthEl = document.getElementById('snake-length');
  const speedEl = document.getElementById('snake-speed');
  const startBtn = document.getElementById('snake-start');
  const pauseBtn = document.getElementById('snake-pause');
  const restartBtn = document.getElementById('snake-restart');
  const gameTag = document.getElementById('snake-game-tag');
  const hintEl = document.getElementById('snake-hint');
  const ctx = canvas.getContext('2d');

  const controls = {
    up: document.getElementById('snake-up') || document.querySelector('[data-snake-dir="up"]'),
    down: document.getElementById('snake-down') || document.querySelector('[data-snake-dir="down"]'),
    left: document.getElementById('snake-left') || document.querySelector('[data-snake-dir="left"]'),
    right: document.getElementById('snake-right') || document.querySelector('[data-snake-dir="right"]')
  };

  const state = {
    phase: 'ready',
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

  function isComplete() {
    return state.score >= (Number(copy.targetScore) || 10);
  }

  function phaseLabel() {
    if (state.phase === 'running') return copy.startingLabel || 'Playing';
    if (state.phase === 'paused') return copy.resumeLabel || 'Resume';
    if (state.phase === 'won') return copy.statusWin || 'Complete';
    if (state.phase === 'gameover') return copy.statusGameOver || 'Game over';
    return copy.readyLabel || copy.startLabel || 'Ready';
  }

  function phaseStatus() {
    if (state.phase === 'running') return copy.statusPlaying || 'Snake is moving. Keep eating and avoid the walls.';
    if (state.phase === 'paused') return copy.statusPaused || 'Paused. Resume when you are ready.';
    if (state.phase === 'won') return copy.statusWin || 'You won. Clear run complete.';
    if (state.phase === 'gameover') return copy.statusGameOver || 'Game over. Restart to try again.';
    return copy.statusReady || 'Press Start or any direction to begin.';
  }

  function syncActionButtons() {
    if (startBtn) {
      if (state.phase === 'running') {
        startBtn.textContent = copy.startingLabel || 'Playing';
        startBtn.disabled = true;
      } else if (state.phase === 'paused') {
        startBtn.textContent = copy.resumeLabel || 'Resume';
        startBtn.disabled = false;
      } else if (state.phase === 'won' || state.phase === 'gameover') {
        startBtn.textContent = copy.restartLabel || 'Restart';
        startBtn.disabled = false;
      } else {
        startBtn.textContent = copy.startLabel || 'Start';
        startBtn.disabled = false;
      }
    }

    if (pauseBtn) {
      if (state.phase === 'ready') {
        pauseBtn.textContent = copy.pauseLabel || 'Pause';
        pauseBtn.disabled = true;
      } else if (state.phase === 'paused') {
        pauseBtn.textContent = copy.resumeLabel || 'Resume';
        pauseBtn.disabled = false;
      } else if (state.phase === 'won' || state.phase === 'gameover') {
        pauseBtn.textContent = copy.restartLabel || 'Restart';
        pauseBtn.disabled = false;
      } else {
        pauseBtn.textContent = copy.pauseLabel || 'Pause';
        pauseBtn.disabled = false;
      }
    }

    if (restartBtn) {
      restartBtn.textContent = copy.restartLabel || 'Restart';
    }
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (bestEl) bestEl.textContent = String(state.best);
    if (targetEl) targetEl.textContent = String(Number(copy.targetScore) || 10);
    if (lengthEl) lengthEl.textContent = String(state.snake.length);
    if (speedEl) speedEl.textContent = `${Math.round(1000 / state.tickMs)} /s`;
    setTag(state.phase, phaseLabel());
    setStatus(phaseStatus());
    syncActionButtons();
  }

  function setControlsDisabled(disabled) {
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
    syncActionButtons();
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
    state.phase = 'ready';
    state.lastFrameTime = 0;
    updateSpeed();
    updateHud();
    draw();
    setControlsDisabled(false);
    if (canvas) canvas.focus?.();
    return render_game_to_text();
  }

  function startGame() {
    if (state.phase === 'running') return;
    state.phase = 'running';
    state.lastFrameTime = performance.now();
    updateHud();
    draw();
  }

  function pauseGame() {
    if (state.phase !== 'running') return;
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
    if (state.phase === 'ready') {
      startGame();
      return;
    }
    if (state.phase === 'paused') {
      resumeGame();
    } else if (state.phase === 'running') {
      pauseGame();
    } else {
      resetGame(state.seed);
    }
  }

  function setDirection(next) {
    if (!next) return;
    if (state.phase === 'ready') {
      startGame();
    }
    if (state.phase !== 'running') return;
    const current = state.queuedDirection || state.direction;
    if (opposite(next, current)) return;
    state.queuedDirection = next;
  }

  function endGame(reason) {
    state.phase = reason === 'win' ? 'won' : 'gameover';
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
      if (isComplete()) {
        endGame('win');
        return;
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
    bg.addColorStop(0, '#f8fafc');
    bg.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(offsetX, offsetY);

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        ctx.fillStyle = (row + col) % 2 === 0 ? 'rgba(148, 163, 184, 0.08)' : 'rgba(255, 255, 255, 0.55)';
        ctx.fillRect(col * cell, row * cell, cell - 1, cell - 1);
      }
    }

    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.30)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#f59e0b';
    drawRoundedRect(ctx, state.apple.x * cell + cell * 0.18, state.apple.y * cell + cell * 0.18, cell * 0.64, cell * 0.64, cell * 0.2);
    ctx.fill();
    ctx.restore();

    state.snake.forEach((segment, index) => {
      const padding = index === 0 ? 0.12 : 0.16;
      ctx.fillStyle = index === 0 ? '#14532d' : '#16a34a';
      ctx.shadowColor = index === 0 ? 'rgba(20, 83, 45, 0.20)' : 'rgba(22, 163, 74, 0.18)';
      ctx.shadowBlur = index === 0 ? 12 : 6;
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

    if (state.phase !== 'running') {
      ctx.save();
      const overlayStyles = {
        ready: ['rgba(255, 255, 255, 0.82)', '#0f172a', '#475569'],
        paused: ['rgba(15, 23, 42, 0.10)', '#0f172a', '#475569'],
        won: ['rgba(22, 163, 74, 0.10)', '#14532d', '#166534'],
        gameover: ['rgba(239, 68, 68, 0.10)', '#7f1d1d', '#991b1b']
      };
      const [fillStyle, titleColor, bodyColor] = overlayStyles[state.phase] || overlayStyles.ready;
      ctx.fillStyle = fillStyle;
      ctx.fillRect(0, 0, boardWidth, boardHeight);
      ctx.textAlign = 'center';
      ctx.fillStyle = titleColor;
      ctx.font = '700 24px Arial, sans-serif';
      ctx.fillText(phaseLabel(), boardWidth / 2, boardHeight / 2 - 4);
      ctx.font = '500 14px Arial, sans-serif';
      ctx.fillStyle = bodyColor;
      ctx.fillText(phaseStatus(), boardWidth / 2, boardHeight / 2 + 20);
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
      `target: ${Number(copy.targetScore) || 10}`,
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
    if (startBtn) startBtn.addEventListener('click', startGame);
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
