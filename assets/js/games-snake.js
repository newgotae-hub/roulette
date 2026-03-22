(() => {
  const DEFAULT_SEED = 0x51a7c0de;
  const GRID_SIZE = 20;
  const START_LENGTH = 3;
  const BASE_STEP_MS = 120;
  const MIN_STEP_MS = 70;
  const SCORE_PER_SPEED_UP = 4;
  const MODE_CONFIGS = {
    classic: {
      id: 'classic',
      targetScore: 10,
      timeLimitMs: null,
      wrapWalls: false,
      bonusEvery: 3,
      bonusPoints: 2,
      baseStepMs: 120,
      minStepMs: 70,
      speedStepScore: 4
    },
    timed: {
      id: 'timed',
      targetScore: 12,
      timeLimitMs: 45000,
      wrapWalls: false,
      bonusEvery: 3,
      bonusPoints: 2,
      baseStepMs: 110,
      minStepMs: 65,
      speedStepScore: 3
    },
    wrap: {
      id: 'wrap',
      targetScore: 12,
      timeLimitMs: null,
      wrapWalls: true,
      bonusEvery: 4,
      bonusPoints: 2,
      baseStepMs: 115,
      minStepMs: 65,
      speedStepScore: 4
    }
  };

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
  const modeBadgeEl = document.getElementById('snake-mode-badge');
  const rewardBadgeEl = document.getElementById('snake-reward-badge');
  const timerBadgeEl = document.getElementById('snake-timer-badge');
  const streakBadgeEl = document.getElementById('snake-streak-badge');
  const modeNoteEl = document.getElementById('snake-mode-note');
  const boardShellEl = canvas ? canvas.closest('.board-shell') : null;
  const ctx = canvas.getContext('2d');
  const modeButtons = Array.from(document.querySelectorAll('[data-snake-mode]'));

  const controls = {
    up: document.getElementById('snake-up') || document.querySelector('[data-snake-dir="up"]'),
    down: document.getElementById('snake-down') || document.querySelector('[data-snake-dir="down"]'),
    left: document.getElementById('snake-left') || document.querySelector('[data-snake-dir="left"]'),
    right: document.getElementById('snake-right') || document.querySelector('[data-snake-dir="right"]')
  };

  const state = {
    mode: 'classic',
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem('rlt-snake-best-v1') || '0') || 0,
    seed: DEFAULT_SEED,
    rng: null,
    snake: [],
    direction: { x: 1, y: 0 },
    queuedDirection: null,
    apple: { x: 0, y: 0 },
    bonusApple: null,
    bonusActive: false,
    normalApplesSinceBonus: 0,
    flow: 0,
    recentTrail: [],
    timeLeftMs: null,
    streak: 0,
    streakWindowMs: 0,
    lastEndReason: null,
    accumulator: 0,
    tickMs: BASE_STEP_MS,
    lastFrameTime: 0,
    frameHandle: 0,
    boardRect: { width: 0, height: 0 },
    swipeStart: null,
    initialized: false
  };

  let feedbackTimeout = 0;

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

  function currentModeConfig() {
    return MODE_CONFIGS[state.mode] || MODE_CONFIGS.classic;
  }

  function currentModeLabel() {
    if (state.mode === 'timed') {
      return copy.modeTimedLabel || copy.timedModeLabel || 'Timed';
    }
    if (state.mode === 'wrap') {
      return copy.modeWrapLabel || copy.wrapModeLabel || 'Wrap';
    }
    return copy.modeClassicLabel || copy.classicModeLabel || 'Classic';
  }

  function formatTimer(ms) {
    const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }

  function currentBonusEvery(config = currentModeConfig()) {
    const flowLift = Math.floor(Math.max(0, state.flow) / 3);
    return Math.max(2, config.bonusEvery - flowLift);
  }

  function bonusReadyIn() {
    const config = currentModeConfig();
    if (state.bonusActive) return 0;
    return Math.max(0, currentBonusEvery(config) - state.normalApplesSinceBonus);
  }

  function rewardBadgeText() {
    const config = currentModeConfig();
    if (state.bonusActive && state.bonusApple) {
      const totalBonus = config.bonusPoints + streakBonusPoints();
      return `${copy.bonusRewardLabel || `Bonus +${totalBonus}`} · ${copy.bonusActiveLabel || 'Bonus apple'}`;
    }
    const readyIn = bonusReadyIn();
    if (readyIn <= 0) {
      return copy.bonusReadyLabel || 'Bonus ready';
    }
    return `${copy.bonusNextLabel || 'Bonus in'} ${readyIn}`;
  }

  function streakBonusPoints() {
    return Math.max(0, state.streak - 2);
  }

  function streakBadgeText() {
    if (state.streak <= 0) {
      return copy.streakIdleLabel || 'No streak';
    }
    const bonusText = streakBonusPoints() > 0
      ? ` · +${streakBonusPoints()}`
      : '';
    return `${copy.streakLabel || 'Streak'} x${state.streak}${bonusText}`;
  }

  function timerBadgeText() {
    const config = currentModeConfig();
    if (config.timeLimitMs == null) {
      return copy.timerIdleLabel || 'No timer';
    }
    return formatTimer(state.timeLeftMs);
  }

  function syncModeButtons() {
    for (const btn of modeButtons) {
      const mode = btn.dataset.snakeMode;
      const active = mode === state.mode;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function syncHudBadges() {
    if (modeBadgeEl) modeBadgeEl.textContent = currentModeLabel();
    if (rewardBadgeEl) rewardBadgeEl.textContent = rewardBadgeText();
    if (timerBadgeEl) timerBadgeEl.textContent = timerBadgeText();
    if (streakBadgeEl) streakBadgeEl.textContent = streakBadgeText();
  }

  function isCellEqual(a, b) {
    return Boolean(a && b) && a.x === b.x && a.y === b.y;
  }

  function isBlocked(cell, extras = []) {
    if (isOccupied(cell, state.snake)) return true;
    if (state.apple && isCellEqual(cell, state.apple)) return true;
    if (state.bonusActive && state.bonusApple && isCellEqual(cell, state.bonusApple)) return true;
    return extras.some((item) => isCellEqual(cell, item));
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
    return state.score >= currentModeConfig().targetScore;
  }

  function phaseLabel() {
    if (state.phase === 'running') return copy.startingLabel || 'Playing';
    if (state.phase === 'paused') return copy.resumeLabel || 'Resume';
    if (state.phase === 'won') return copy.statusWin || 'Complete';
    if (state.phase === 'gameover' && state.lastEndReason === 'timeout') return copy.timeoutLabel || 'Time up';
    if (state.phase === 'gameover') return copy.statusGameOver || 'Game over';
    return copy.readyLabel || copy.startLabel || 'Ready';
  }

  function phaseStatus() {
    if (state.phase === 'running') return copy.statusPlaying || 'Snake is moving. Keep eating and avoid the walls.';
    if (state.phase === 'paused') return copy.statusPaused || 'Paused. Resume when you are ready.';
    if (state.phase === 'won') return copy.statusWin || 'You won. Clear run complete.';
    if (state.phase === 'gameover' && state.lastEndReason === 'timeout') return copy.statusTimeout || 'Time ran out. Try the Timed mode again.';
    if (state.phase === 'gameover' && state.lastEndReason === 'wall') return copy.hitWallStatus || 'You hit the wall.';
    if (state.phase === 'gameover' && state.lastEndReason === 'body') return copy.hitBodyStatus || 'You ran into your own body.';
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
    if (targetEl) targetEl.textContent = String(currentModeConfig().targetScore);
    if (lengthEl) lengthEl.textContent = String(state.snake.length);
    if (speedEl) speedEl.textContent = `${Math.round(1000 / state.tickMs)} /s`;
    const tagState = state.phase === 'gameover' && state.lastEndReason === 'timeout' ? 'timeout' : state.phase;
    setTag(tagState, phaseLabel());
    setStatus(phaseStatus());
    syncModeButtons();
    syncHudBadges();
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

  function nextRandomCell(extras = []) {
    const candidate = { x: 0, y: 0 };
    let safety = 0;
    do {
      candidate.x = Math.floor(state.rng() * GRID_SIZE);
      candidate.y = Math.floor(state.rng() * GRID_SIZE);
      safety += 1;
      if (safety > 500) break;
    } while (isBlocked(candidate, extras));
    return candidate;
  }

  function updateSpeed() {
    const config = currentModeConfig();
    const scoreReduction = Math.floor(state.score / config.speedStepScore) * 5;
    const flowReduction = Math.min(18, Math.max(0, state.flow - 1) * 2);
    state.tickMs = Math.max(config.minStepMs, config.baseStepMs - scoreReduction - flowReduction);
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem('rlt-snake-best-v1', String(state.best));
    }
  }

  function spawnNormalApple() {
    const extras = state.bonusActive && state.bonusApple ? [state.bonusApple] : [];
    state.apple = nextRandomCell(extras);
  }

  function spawnBonusApple() {
    state.bonusActive = true;
    state.bonusApple = nextRandomCell([state.apple]);
  }

  function selectMode(nextMode, options = {}) {
    if (!MODE_CONFIGS[nextMode]) nextMode = 'classic';
    state.mode = nextMode;
    syncModeButtons();
    resetGame(options.seed ?? state.seed);
  }

  function syncButtons() {
    syncActionButtons();
  }

  function modeNoteText() {
    if (state.mode === 'timed') {
      return copy.modeTimedNote || 'Timed mode pushes a faster pace and rewards clean route planning.';
    }
    if (state.mode === 'wrap') {
      return copy.modeWrapNote || 'Wrap mode loops through the walls, so the danger shifts from edges to your own body.';
    }
    return copy.modeClassicNote || 'Classic mode is the clean baseline: build streaks, trigger bonus apples, and stay off the walls.';
  }

  function setFeedback(kind) {
    if (!boardShellEl) return;
    boardShellEl.dataset.feedback = kind;
    window.clearTimeout(feedbackTimeout);
    feedbackTimeout = window.setTimeout(() => {
      if (boardShellEl.dataset.feedback === kind) {
        delete boardShellEl.dataset.feedback;
      }
    }, kind === 'crash' ? 420 : 240);

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      if (kind === 'bonus') navigator.vibrate([18, 34, 18]);
      else if (kind === 'eat') navigator.vibrate(14);
      else if (kind === 'crash') navigator.vibrate([26, 40, 26]);
    }
  }

  function updateModeNote() {
    if (modeNoteEl) modeNoteEl.textContent = modeNoteText();
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
    state.apple = null;
    state.bonusApple = null;
    state.bonusActive = false;
    state.normalApplesSinceBonus = 0;
    state.flow = 0;
    state.recentTrail = [];
    state.timeLeftMs = currentModeConfig().timeLimitMs;
    state.streak = 0;
    state.streakWindowMs = 0;
    state.accumulator = 0;
    state.phase = 'ready';
    state.lastEndReason = null;
    state.lastFrameTime = 0;
    spawnNormalApple();
    updateSpeed();
    updateHint();
    updateModeNote();
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

  function restartAndLaunch(nextDirection = null) {
    const seed = state.seed;
    resetGame(seed);
    if (nextDirection && !opposite(nextDirection, state.direction)) {
      state.direction = nextDirection;
      state.queuedDirection = nextDirection;
    }
    startGame();
    setFeedback('eat');
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
    if (state.phase === 'gameover' || state.phase === 'won') {
      restartAndLaunch(next);
      return;
    }
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
    state.lastEndReason = reason;
    state.accumulator = 0;
    if (state.score > state.best) {
      state.best = state.score;
      saveBest();
    }
    updateHud();
    setFeedback(reason === 'win' ? 'bonus' : 'crash');
    draw(reason);
  }

  function maybeIncreaseDifficulty() {
    updateSpeed();
  }

  function stepGame() {
    if (state.phase !== 'running') return;
    const config = currentModeConfig();

    if (config.timeLimitMs != null) {
      state.timeLeftMs = Math.max(0, state.timeLeftMs - state.tickMs);
      if (state.timeLeftMs <= 0) {
        endGame('timeout');
        return;
      }
    }

    if (state.streakWindowMs > 0) {
      state.streakWindowMs = Math.max(0, state.streakWindowMs - state.tickMs);
      if (state.streakWindowMs === 0 && state.streak > 0) {
        state.streak = 0;
      }
      if (state.streakWindowMs === 0 && state.flow > 0) {
        state.flow = Math.max(0, state.flow - 1);
      }
    }

    if (state.queuedDirection && !opposite(state.queuedDirection, state.direction)) {
      state.direction = state.queuedDirection;
    }
    state.queuedDirection = null;

    const head = state.snake[0];
    state.recentTrail.unshift({ x: head.x, y: head.y });
    if (state.recentTrail.length > 6) {
      state.recentTrail.pop();
    }
    const next = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    if (config.wrapWalls) {
      next.x = (next.x + GRID_SIZE) % GRID_SIZE;
      next.y = (next.y + GRID_SIZE) % GRID_SIZE;
    } else if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      endGame('wall');
      return;
    }

    const isAppleCell = next.x === state.apple.x && next.y === state.apple.y;
    const isBonusCell = state.bonusActive && state.bonusApple && next.x === state.bonusApple.x && next.y === state.bonusApple.y;
    const tailWillMove = !(isAppleCell || isBonusCell);
    const occupied = state.snake.some((segment, index) => {
      if (tailWillMove && index === state.snake.length - 1) return false;
      return cellsEqual(segment, next);
    });

    if (occupied) {
      endGame('body');
      return;
    }

    state.snake.unshift(next);

    if (isBonusCell) {
      state.score += currentModeConfig().bonusPoints + streakBonusPoints();
      state.bonusActive = false;
      state.bonusApple = null;
      state.normalApplesSinceBonus = 0;
      state.flow = Math.min(8, state.flow + 2);
      state.streakWindowMs = (config.timeLimitMs == null ? 4200 : 3400) + Math.min(1200, state.flow * 100);
      if (state.score > state.best) {
        state.best = state.score;
        saveBest();
      }
      if (isComplete()) {
        endGame('win');
        return;
      }
      spawnNormalApple();
      updateSpeed();
      updateHud();
      setFeedback('bonus');
      draw();
      return;
    }

    if (isAppleCell) {
      state.score += 1;
      state.normalApplesSinceBonus += 1;
      state.streak = state.streakWindowMs > 0 ? state.streak + 1 : 1;
      state.flow = Math.min(8, state.flow + 1);
      state.streakWindowMs = (config.timeLimitMs == null ? 4200 : 3200) + Math.min(1000, state.flow * 90);
      if (state.score > state.best) {
        state.best = state.score;
        saveBest();
      }
      if (isComplete()) {
        endGame('win');
        return;
      }
      spawnNormalApple();
      if (!state.bonusActive && state.normalApplesSinceBonus >= currentBonusEvery(config)) {
        state.normalApplesSinceBonus = 0;
        spawnBonusApple();
      }
      maybeIncreaseDifficulty();
      setFeedback('eat');
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

    if (state.recentTrail.length) {
      ctx.save();
      state.recentTrail.forEach((segment, index) => {
        const depth = state.recentTrail.length - index;
        const alpha = Math.max(0.04, Math.min(0.18, depth * 0.03));
        const padding = 0.18 + (index * 0.02);
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        drawRoundedRect(
          ctx,
          segment.x * cell + cell * padding,
          segment.y * cell + cell * padding,
          cell * (1 - padding * 2),
          cell * (1 - padding * 2),
          cell * 0.24
        );
        ctx.fill();
      });
      ctx.restore();
    }

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

    if (state.bonusActive && state.bonusApple) {
      ctx.save();
      ctx.shadowColor = 'rgba(245, 158, 11, 0.56)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#fbbf24';
      drawRoundedRect(
        ctx,
        state.bonusApple.x * cell + cell * 0.12,
        state.bonusApple.y * cell + cell * 0.12,
        cell * 0.76,
        cell * 0.76,
        cell * 0.25
      );
      ctx.fill();
      ctx.lineWidth = Math.max(1, cell * 0.05);
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.18)';
      ctx.stroke();
      ctx.restore();
    }

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
        timeout: ['rgba(245, 158, 11, 0.12)', '#92400e', '#b45309'],
        gameover: ['rgba(239, 68, 68, 0.10)', '#7f1d1d', '#991b1b']
      };
      const overlayKey = state.phase === 'gameover' && state.lastEndReason === 'timeout' ? 'timeout' : state.phase;
      const [fillStyle, titleColor, bodyColor] = overlayStyles[overlayKey] || overlayStyles.ready;
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

    if (state.phase === 'running' && state.streak > 1) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      drawRoundedRect(ctx, 12, 12, 132, 34, 14);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 14px Inter, Arial, sans-serif';
      ctx.fillText(`Streak x${state.streak}`, 78, 34);
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
    const config = currentModeConfig();
    const status = state.phase === 'running'
      ? (copy.playingTag || 'running')
      : state.phase;
    const timeLeft = config.timeLimitMs == null ? 0 : Math.max(0, Math.round(state.timeLeftMs));
    const payload = {
      game: 'Snake',
      mode: state.mode,
      modeLabel: currentModeLabel(),
      state: status,
      score: state.score,
      target: config.targetScore,
      length: state.snake.length,
      speed: Math.round(1000 / state.tickMs),
      wrapWalls: Boolean(config.wrapWalls),
      timeLimitMs: config.timeLimitMs,
      timeLeft,
      timer: timeLeft,
      bonusActive: Boolean(state.bonusActive),
      bonusPoints: config.bonusPoints,
      bonusReadyIn: bonusReadyIn(),
      streak: state.streak,
      streakWindowMs: Math.max(0, Math.round(state.streakWindowMs)),
      streakBonusPoints: streakBonusPoints(),
      bonusState: state.bonusActive ? 'active' : 'idle',
      bonus: {
        active: Boolean(state.bonusActive),
        readyIn: bonusReadyIn(),
        points: config.bonusPoints,
        apple: state.bonusActive && state.bonusApple ? { x: state.bonusApple.x, y: state.bonusApple.y } : null
      },
      bonusApple: state.bonusActive && state.bonusApple ? { x: state.bonusApple.x, y: state.bonusApple.y } : null,
      lastEndReason: state.lastEndReason || 'none',
      seed: state.seed,
      flow: state.flow,
      head: { x: head.x, y: head.y },
      apple: { x: state.apple.x, y: state.apple.y },
      bonusEveryNow: currentBonusEvery(config),
      trailLength: state.recentTrail.length,
      board: encodeBoard()
    };
    return JSON.stringify(payload);
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

    for (const btn of modeButtons) {
      btn.addEventListener('click', () => selectMode(btn.dataset.snakeMode));
    }

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
        btn.dataset.pressed = 'true';
        setDirection({
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 },
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 }
        }[dir]);
      });
      const clearPressed = () => {
        delete btn.dataset.pressed;
      };
      btn.addEventListener('pointerup', clearPressed);
      btn.addEventListener('pointercancel', clearPressed);
      btn.addEventListener('pointerleave', clearPressed);
    }
  }

  function bindSwipe() {
    if (!canvas) return;
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (state.phase === 'ready') {
        startGame();
      } else if (state.phase === 'gameover' || state.phase === 'won') {
        resetGame(state.seed);
        startGame();
      }
      canvas.setPointerCapture?.(event.pointerId);
      state.swipeStart = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener('pointerup', (event) => {
      event.preventDefault();
      if (!state.swipeStart) return;
      const dx = event.clientX - state.swipeStart.x;
      const dy = event.clientY - state.swipeStart.y;
      state.swipeStart = null;
      const threshold = Math.max(18, Math.round(Math.min(state.boardRect.width || 0, state.boardRect.height || 0) * 0.05));
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
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
    if (state.mode === 'timed') {
      hintEl.textContent = copy.mobileHintTimed || copy.mobileHint || 'Swipe the board or use the buttons below on mobile.';
      return;
    }
    if (state.mode === 'wrap') {
      hintEl.textContent = copy.mobileHintWrap || copy.mobileHint || 'Swipe the board or use the buttons below on mobile.';
      return;
    }
    hintEl.textContent = copy.mobileHintClassic || copy.mobileHint || 'Swipe the board or use the buttons below on mobile.';
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    syncButtons();
    updateHint();
    updateModeNote();
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
