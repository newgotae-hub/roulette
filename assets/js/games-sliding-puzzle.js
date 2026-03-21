(() => {
  const SIZE = 4;
  const TILE_COUNT = SIZE * SIZE - 1;
  const STORAGE_PREFIX = 'rlt-sliding-puzzle-v1';
  const DEFAULT_DAILY_KEY = () => {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  const SOLVED = Array.from({ length: TILE_COUNT }, (_, index) => index + 1).concat(0);
  const QA_PRESET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 13, 14, 11, 0];
  const DIRECTIONS = {
    ArrowUp: { dx: 0, dy: -1, label: 'up' },
    ArrowDown: { dx: 0, dy: 1, label: 'down' },
    ArrowLeft: { dx: -1, dy: 0, label: 'left' },
    ArrowRight: { dx: 1, dy: 0, label: 'right' }
  };
  const MODE_CONFIGS = {
    classic: {
      id: 'classic',
      rounds: 'free',
      timeLimitMs: 0,
      scrambleSteps: 24
    },
    timed: {
      id: 'timed',
      rounds: 'timed',
      timeLimitMs: 420000,
      scrambleSteps: 30
    },
    daily: {
      id: 'daily',
      rounds: 'daily',
      timeLimitMs: 600000,
      scrambleSteps: 32
    }
  };

  const copy = window.__SLIDING_PUZZLE_COPY__ || {};
  const boardEl = document.getElementById('sliding-puzzle-board');
  const statusEl = document.getElementById('sliding-puzzle-status');
  const modeLabelEl = document.getElementById('sliding-puzzle-mode-label');
  const modeNoteEl = document.getElementById('sliding-puzzle-mode-note');
  const movesEl = document.getElementById('sliding-puzzle-moves');
  const timeEl = document.getElementById('sliding-puzzle-time');
  const bestTimeEl = document.getElementById('sliding-puzzle-best-time');
  const bestMovesEl = document.getElementById('sliding-puzzle-best-moves');
  const undoEl = document.getElementById('sliding-puzzle-undos');
  const blankEl = document.getElementById('sliding-puzzle-blank');
  const stateEl = document.getElementById('sliding-puzzle-state');
  const presetEl = document.getElementById('sliding-puzzle-preset');
  const goalEl = document.getElementById('sliding-puzzle-goal');
  const newGameBtn = document.getElementById('sliding-puzzle-new');
  const resetBtn = document.getElementById('sliding-puzzle-reset');
  const undoBtn = document.getElementById('sliding-puzzle-undo');
  const puzzleButtons = Array.from(document.querySelectorAll('[data-puzzle-mode]'));
  const padButtons = Array.from(document.querySelectorAll('[data-puzzle-direction]'));

  const state = {
    mode: 'classic',
    phase: 'ready',
    preset: 'standard',
    variant: 0,
    dailyKey: DEFAULT_DAILY_KEY(),
    seed: 0,
    timeLimitMs: 0,
    elapsedMs: 0,
    moves: 0,
    undos: 0,
    bestMoves: 0,
    bestTimeMs: 0,
    blankIndex: 15,
    board: SOLVED.slice(),
    history: [],
    solved: false,
    qaReady: false,
    status: '',
    message: ''
  };

  function hashString(input) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  function normalizeMode(value) {
    const mode = String(value || '').trim().toLowerCase();
    return MODE_CONFIGS[mode] ? mode : 'classic';
  }

  function getModeConfig(mode = state.mode) {
    return MODE_CONFIGS[normalizeMode(mode)] || MODE_CONFIGS.classic;
  }

  function toIndex(x, y) {
    return y * SIZE + x;
  }

  function toPoint(index) {
    return {
      x: index % SIZE,
      y: Math.floor(index / SIZE)
    };
  }

  function cloneBoard(board = state.board) {
    return board.slice();
  }

  function boardIsSolved(board = state.board) {
    for (let index = 0; index < TILE_COUNT; index += 1) {
      if (board[index] !== index + 1) return false;
    }
    return board[TILE_COUNT] === 0;
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutes = String(Math.floor(total / 60));
    const seconds = String(total % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function buildSeed(mode, variant = 0) {
    const dailyPart = mode === 'daily' ? `:${state.dailyKey}` : '';
    return hashString(`sliding-puzzle:${mode}:${variant}${dailyPart}`);
  }

  function createRng(seed) {
    let value = (seed >>> 0) || 1;
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  function shuffleBoard(mode, variant = 0) {
    const config = getModeConfig(mode);
    const rng = createRng(buildSeed(mode, variant));
    const board = SOLVED.slice();
    let blankIndex = TILE_COUNT;
    let lastDirection = null;
    const directions = [
      { dx: 0, dy: -1, name: 'up' },
      { dx: 0, dy: 1, name: 'down' },
      { dx: -1, dy: 0, name: 'left' },
      { dx: 1, dy: 0, name: 'right' }
    ];

    for (let step = 0; step < config.scrambleSteps; step += 1) {
      const blank = toPoint(blankIndex);
      const candidates = directions.filter((direction) => {
        if (lastDirection && direction.dx === -lastDirection.dx && direction.dy === -lastDirection.dy) {
          return false;
        }
        const nextX = blank.x + direction.dx;
        const nextY = blank.y + direction.dy;
        return nextX >= 0 && nextX < SIZE && nextY >= 0 && nextY < SIZE;
      });
      const direction = candidates[Math.floor(rng() * candidates.length)] || candidates[0];
      const nextIndex = toIndex(blank.x + direction.dx, blank.y + direction.dy);
      board[blankIndex] = board[nextIndex];
      board[nextIndex] = 0;
      blankIndex = nextIndex;
      lastDirection = direction;
    }

    return { board, blankIndex, seed: buildSeed(mode, variant) };
  }

  function setStatus(text) {
    state.status = text;
    if (statusEl) statusEl.textContent = text;
  }

  function updateBestScoresOnSolve() {
    if (!state.solved) return;
    if (!state.bestMoves || state.moves < state.bestMoves) state.bestMoves = state.moves;
    const solvedTime = state.elapsedMs;
    if (!state.bestTimeMs || solvedTime < state.bestTimeMs) state.bestTimeMs = solvedTime;
  }

  function syncModeButtons() {
    for (const button of puzzleButtons) {
      const buttonMode = normalizeMode(button.dataset.puzzleMode);
      const active = buttonMode === state.mode;
      button.dataset.active = active ? 'true' : 'false';
      button.setAttribute('aria-pressed', String(active));
    }
  }

  function syncStats() {
    if (modeLabelEl) {
      modeLabelEl.textContent = `${copy.modeLabels?.[state.mode] || state.mode} · ${copy.phaseLabels?.[state.phase] || state.phase}`;
      modeLabelEl.dataset.mode = state.mode;
      modeLabelEl.dataset.phase = state.phase;
    }
    if (modeNoteEl) modeNoteEl.textContent = copy.modeNotes?.[state.mode] || '';
    if (movesEl) movesEl.textContent = String(state.moves);
    if (undoEl) undoEl.textContent = String(state.undos);
    if (bestMovesEl) bestMovesEl.textContent = String(state.bestMoves || 0);
    if (bestTimeEl) bestTimeEl.textContent = state.bestTimeMs ? formatTime(state.bestTimeMs) : '—';
    if (blankEl) blankEl.textContent = `${toPoint(state.blankIndex).x},${toPoint(state.blankIndex).y}`;
    if (stateEl) stateEl.textContent = copy.phaseLabels?.[state.phase] || state.phase;
    if (presetEl) presetEl.textContent = state.preset === 'qa'
      ? (copy.presetLabels?.qa || 'QA preset')
      : (copy.presetLabels?.standard || 'Standard');
    if (goalEl) goalEl.textContent = copy.goalText || 'Put 1–15 in order and leave the blank at the bottom-right.';
    if (timeEl) {
      const remaining = state.timeLimitMs > 0 ? Math.max(0, state.timeLimitMs - state.elapsedMs) : state.elapsedMs;
      timeEl.textContent = state.timeLimitMs > 0 ? formatTime(remaining) : formatTime(state.elapsedMs);
    }
  }

  function renderBoard() {
    if (!boardEl) return;
    boardEl.innerHTML = '';
    state.board.forEach((value, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'sp-tile';
      cell.dataset.index = String(index);
      cell.dataset.value = String(value);
      cell.setAttribute('aria-label', value === 0 ? 'Blank tile' : `Tile ${value}`);
      cell.disabled = value === 0 || state.phase === 'solved' || state.phase === 'timeout';
      if (value === 0) {
        cell.classList.add('is-blank');
      } else {
        cell.style.setProperty('--tile-hue', String(205 - value * 6));
      }
      cell.innerHTML = value === 0 ? '<span aria-hidden="true">&nbsp;</span>' : `<span>${value}</span>`;
      cell.addEventListener('click', () => handleTileClick(index));
      boardEl.appendChild(cell);
    });
  }

  function renderStatus() {
    const messages = {
      ready: copy.statuses?.ready || 'Tap a tile next to the blank to begin.',
      playing: copy.statuses?.playing || 'Keep sliding tiles toward the solved grid.',
      solved: copy.statuses?.solved || 'Puzzle solved. Try another puzzle or beat your time.',
      timeout: copy.statuses?.timeout || 'Time is up. Restart and try again.'
    };
    setStatus(messages[state.phase] || messages.ready);
  }

  function render() {
    syncModeButtons();
    syncStats();
    renderBoard();
    renderStatus();
    window.__SLIDING_PUZZLE_QA_READY__ = true;
    window.QA_READY = true;
  }

  function applyBoard(board, preset = 'standard', options = {}) {
    state.board = board.slice();
    state.blankIndex = state.board.indexOf(0);
    state.preset = preset;
    state.history = [];
    state.moves = 0;
    state.undos = 0;
    state.elapsedMs = 0;
    state.solved = boardIsSolved(state.board);
    state.phase = state.solved ? 'solved' : 'ready';
    state.seed = options.seed || state.seed;
    state.timeLimitMs = options.timeLimitMs !== undefined ? options.timeLimitMs : state.timeLimitMs;
    if (state.solved) updateBestScoresOnSolve();
    render();
    return render_game_to_text();
  }

  function resetGame(mode = state.mode, variant = 0) {
    state.mode = normalizeMode(mode);
    state.variant = Number.isFinite(Number(variant)) ? Number(variant) : 0;
    state.dailyKey = DEFAULT_DAILY_KEY();
    const config = getModeConfig(state.mode);
    const shuffled = shuffleBoard(state.mode, state.variant);
    state.board = shuffled.board;
    state.blankIndex = shuffled.blankIndex;
    state.seed = shuffled.seed;
    state.timeLimitMs = config.timeLimitMs;
    state.elapsedMs = 0;
    state.moves = 0;
    state.undos = 0;
    state.bestMoves = 0;
    state.bestTimeMs = 0;
    state.history = [];
    state.preset = 'standard';
    state.solved = false;
    state.phase = 'ready';
    state.qaReady = true;
    render();
    return render_game_to_text();
  }

  function newPuzzle() {
    return resetGame(state.mode, state.variant + 1);
  }

  function setMode(mode) {
    return resetGame(mode, 0);
  }

  function setPuzzlePreset(preset) {
    if (String(preset || '').toLowerCase() !== 'qa') return render_game_to_text();
    return applyBoard(QA_PRESET, 'qa', {
      seed: hashString('sliding-puzzle:qa'),
      timeLimitMs: state.timeLimitMs
    });
  }

  function attemptMove(dx, dy) {
    if (state.phase === 'solved' || state.phase === 'timeout') return false;
    const blank = toPoint(state.blankIndex);
    const nextX = blank.x + dx;
    const nextY = blank.y + dy;
    if (nextX < 0 || nextX >= SIZE || nextY < 0 || nextY >= SIZE) return false;

    const nextIndex = toIndex(nextX, nextY);
    const previousBoard = state.board.slice();
    state.board[state.blankIndex] = state.board[nextIndex];
    state.board[nextIndex] = 0;
    state.history.push({
      board: previousBoard,
      blankIndex: state.blankIndex,
      moves: state.moves,
      elapsedMs: state.elapsedMs,
      phase: state.phase
    });
    state.blankIndex = nextIndex;
    state.moves += 1;
    state.phase = 'playing';
    if (state.solved) state.solved = false;
    if (boardIsSolved(state.board)) {
      state.solved = true;
      state.phase = 'solved';
      updateBestScoresOnSolve();
    }
    render();
    return true;
  }

  function handleTileClick(index) {
    if (state.phase === 'solved' || state.phase === 'timeout') return;
    const tile = toPoint(index);
    const blank = toPoint(state.blankIndex);
    const distance = Math.abs(tile.x - blank.x) + Math.abs(tile.y - blank.y);
    if (distance !== 1) return;
    const dx = blank.x - tile.x;
    const dy = blank.y - tile.y;
    attemptMove(dx, dy);
  }

  function undoMove() {
    if (!state.history.length || state.phase === 'timeout') return;
    const snapshot = state.history.pop();
    state.board = snapshot.board;
    state.blankIndex = snapshot.blankIndex;
    state.moves = snapshot.moves;
    state.elapsedMs = snapshot.elapsedMs;
    state.phase = snapshot.phase;
    state.undos += 1;
    state.solved = boardIsSolved(state.board);
    if (state.solved) {
      state.phase = 'solved';
      updateBestScoresOnSolve();
    }
    render();
  }

  function advanceTimeline() {
    if (state.phase === 'playing' && state.timeLimitMs > 0 && state.elapsedMs >= state.timeLimitMs) {
      state.phase = 'timeout';
    }
    if (state.phase === 'ready' && state.solved) {
      state.phase = 'solved';
    }
    render();
    return render_game_to_text();
  }

  function advanceTime(ms) {
    const delta = Number(ms) || 0;
    if (delta > 0) state.elapsedMs += delta;
    return advanceTimeline();
  }

  function render_game_to_text() {
    const timeLeftMs = state.timeLimitMs > 0
      ? Math.max(0, state.timeLimitMs - state.elapsedMs)
      : 0;
    return JSON.stringify({
      game: 'sliding-puzzle',
      mode: state.mode,
      phase: state.phase,
      preset: state.preset,
      variant: state.variant,
      timeLimitMs: state.timeLimitMs,
      elapsedMs: state.elapsedMs,
      timeLeftMs,
      timeLeft: timeLeftMs,
      timer: timeLeftMs,
      seed: state.seed,
      dailyKey: state.dailyKey,
      moves: state.moves,
      undos: state.undos,
      bestMoves: state.bestMoves,
      bestTimeMs: state.bestTimeMs,
      blankIndex: state.blankIndex,
      solved: state.solved,
      board: cloneBoard(state.board),
      qaReady: state.qaReady,
      coordinateSystem: 'grid origin is top-left; x grows right, y grows down'
    });
  }

  function handleKeydown(event) {
    const key = String(event.key || '').toLowerCase();
    if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
      event.preventDefault();
      const direction = DIRECTIONS[event.key];
      attemptMove(direction.dx, direction.dy);
      return;
    }
    if (key === 'u' || key === 'backspace' || key === 'delete') {
      event.preventDefault();
      undoMove();
      return;
    }
    if (key === 'r') {
      event.preventDefault();
      resetGame(state.mode, 0);
      return;
    }
    if (key === 'n') {
      event.preventDefault();
      newPuzzle();
      return;
    }
    if (key === '1') {
      event.preventDefault();
      setMode('classic');
      return;
    }
    if (key === '2') {
      event.preventDefault();
      setMode('timed');
      return;
    }
    if (key === '3') {
      event.preventDefault();
      setMode('daily');
    }
  }

  function bindEvents() {
    if (newGameBtn) newGameBtn.addEventListener('click', newPuzzle);
    if (resetBtn) resetBtn.addEventListener('click', () => resetGame(state.mode, 0));
    if (undoBtn) undoBtn.addEventListener('click', undoMove);
    for (const button of puzzleButtons) {
      button.addEventListener('click', () => setMode(button.dataset.puzzleMode));
    }
    for (const button of padButtons) {
      button.addEventListener('click', () => {
        const direction = button.dataset.puzzleDirection;
        const mapping = {
          up: DIRECTIONS.ArrowUp,
          down: DIRECTIONS.ArrowDown,
          left: DIRECTIONS.ArrowLeft,
          right: DIRECTIONS.ArrowRight
        };
        const vector = mapping[direction];
        if (vector) attemptMove(vector.dx, vector.dy);
      });
    }
    window.addEventListener('keydown', handleKeydown);
  }

  function init() {
    bindEvents();
    resetGame('classic', 0);
    window.render_game_to_text = render_game_to_text;
    window.advanceTime = advanceTime;
    window.resetGame = resetGame;
    window.reset = () => resetGame('classic', 0);
    window.newPuzzle = newPuzzle;
    window.setSlidingPuzzleMode = setMode;
    window.setSlidingPuzzlePreset = setPuzzlePreset;
    window.undoMove = undoMove;
    window.__WEBGAME_QA_READY__ = true;
    window.QA_READY = true;
  }

  init();
})();
