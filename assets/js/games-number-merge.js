(() => {
  const GRID_SIZE = 4;
  const TARGET_TILE = 2048;
  const DEFAULT_SEED = 0x2048cafe;
  const copy = window.__NUMBER_MERGE_COPY__ || {};

  const gridEl = document.getElementById('merge-grid');
  const statusEl = document.getElementById('merge-status');
  const modeEl = document.getElementById('merge-mode');
  const scoreEl = document.getElementById('merge-score');
  const bestEl = document.getElementById('merge-best');
  const targetEl = document.getElementById('merge-target');
  const movesEl = document.getElementById('merge-moves');
  const maxTileEl = document.getElementById('merge-max-tile');
  const dailyBestEl = document.getElementById('merge-daily-best');
  const tagEl = document.getElementById('merge-game-tag');
  const hintEl = document.getElementById('merge-hint');
  const playAreaEl = document.getElementById('play-area');
  const newBtn = document.getElementById('merge-new');
  const dailyBtn = document.getElementById('merge-daily');
  const undoBtn = document.getElementById('merge-undo');

  const controls = {
    up: document.getElementById('merge-up'),
    down: document.getElementById('merge-down'),
    left: document.getElementById('merge-left'),
    right: document.getElementById('merge-right')
  };

  const state = {
    phase: 'ready',
    board: Array(GRID_SIZE * GRID_SIZE).fill(0),
    score: 0,
    best: Number(window.localStorage?.getItem('rlt-merge-best-v1') || '0') || 0,
    target: TARGET_TILE,
    moves: 0,
    maxTile: 2,
    seed: DEFAULT_SEED,
    mode: 'free',
    dailyKey: '',
    dailyBest: 0,
    rng: null,
    snapshot: null,
    swipeStart: null
  };

  function normalizeSeed(seed) {
    if (Number.isFinite(seed)) return (seed >>> 0) || DEFAULT_SEED;
    const parsed = Number.parseInt(String(seed), 10);
    return Number.isFinite(parsed) ? ((parsed >>> 0) || DEFAULT_SEED) : DEFAULT_SEED;
  }

  function localDateKey(date = new Date()) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  function hashString(input) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0) || DEFAULT_SEED;
  }

  function getDailySeed(date = new Date()) {
    return hashString(`number-merge:${localDateKey(date)}`);
  }

  function getDailyBestKey(dailyKey) {
    return `rlt-merge-daily-best-v1-${dailyKey || localDateKey()}`;
  }

  function createRng(seed) {
    let value = normalizeSeed(seed);
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  function chunkBoard(board) {
    const rows = [];
    for (let row = 0; row < GRID_SIZE; row += 1) {
      rows.push(board.slice(row * GRID_SIZE, row * GRID_SIZE + GRID_SIZE));
    }
    return rows;
  }

  function flatten(rows) {
    return rows.flat();
  }

  function cloneStateSnapshot() {
    return {
      board: state.board.slice(),
      score: state.score,
      moves: state.moves,
      maxTile: state.maxTile,
      phase: state.phase,
      mode: state.mode,
      dailyKey: state.dailyKey,
      dailyBest: state.dailyBest
    };
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem('rlt-merge-best-v1', String(state.best));
    }
  }

  function saveDailyBest() {
    if (window.localStorage && state.dailyKey) {
      window.localStorage.setItem(getDailyBestKey(state.dailyKey), String(state.dailyBest));
    }
  }

  function getEmptyIndexes(board = state.board) {
    const out = [];
    board.forEach((value, index) => {
      if (!value) out.push(index);
    });
    return out;
  }

  function spawnTile() {
    const empty = getEmptyIndexes();
    if (!empty.length) return false;
    const index = empty[Math.floor(state.rng() * empty.length)];
    state.board[index] = state.rng() < 0.9 ? 2 : 4;
    state.maxTile = Math.max(state.maxTile, state.board[index]);
    return true;
  }

  function buildGrid() {
    if (!gridEl || gridEl.children.length) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
      const cell = document.createElement('div');
      cell.className = 'merge-cell';
      cell.id = `merge-cell-${index}`;
      cell.dataset.value = '0';
      cell.setAttribute('aria-hidden', 'true');
      fragment.appendChild(cell);
    }
    gridEl.appendChild(fragment);
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'won') return copy.wonLabel || 'Target reached';
    if (state.phase === 'stuck') return copy.stuckLabel || 'No moves left';
    return copy.readyLabel || 'Ready';
  }

  function modeLabel() {
    if (state.mode === 'daily') return copy.dailyModeLabel || 'Daily challenge';
    return copy.freeModeLabel || 'Free play';
  }

  function phaseStatus() {
    if (state.phase === 'playing') return copy.playingStatus || 'Keep the board open and stack your larger tiles on one side.';
    if (state.phase === 'won') return copy.wonStatus || 'You reached the target tile.';
    if (state.phase === 'stuck') return copy.stuckStatus || 'No valid move is left.';
    if (state.mode === 'daily') return copy.dailyReadyStatus || 'Today is a shared challenge. Start with the same board and chase a better daily score.';
    return copy.readyStatus || 'Start by sliding any direction.';
  }

  function updateStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function updateTag() {
    if (!tagEl) return;
    tagEl.dataset.state = state.phase;
    tagEl.textContent = phaseLabel();
  }

  function focusPlayArea() {
    if (!playAreaEl || !window.matchMedia || !window.matchMedia('(max-width: 920px)').matches) return;
    playAreaEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function syncButtons() {
    if (newBtn) newBtn.textContent = copy.newButton || 'Replay board';
    if (dailyBtn) {
      dailyBtn.textContent = copy.dailyButton || 'Daily challenge';
      dailyBtn.dataset.active = state.mode === 'daily' ? 'true' : 'false';
      dailyBtn.setAttribute('aria-pressed', String(state.mode === 'daily'));
    }
    if (undoBtn) {
      undoBtn.textContent = copy.undoButton || 'Undo';
      undoBtn.disabled = !state.snapshot;
    }
  }

  function renderBoard() {
    buildGrid();
    const cells = gridEl ? Array.from(gridEl.children) : [];
    state.board.forEach((value, index) => {
      const cell = cells[index];
      if (!cell) return;
      cell.dataset.value = String(value);
      cell.textContent = value ? String(value) : '';
      cell.style.fontSize = value >= 1024 ? '1.35rem' : value >= 128 ? '1.6rem' : '1.95rem';
    });
  }

  function render() {
    if (modeEl) modeEl.textContent = modeLabel();
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (bestEl) bestEl.textContent = String(state.best);
    if (dailyBestEl) dailyBestEl.textContent = String(state.dailyBest);
    if (targetEl) targetEl.textContent = String(state.target);
    if (movesEl) movesEl.textContent = String(state.moves);
    if (maxTileEl) maxTileEl.textContent = String(state.maxTile);
    if (hintEl) {
      hintEl.textContent = state.mode === 'daily'
        ? (copy.dailyHint || 'Use arrow keys, WASD, or a swipe on the board. This daily board uses the same seed for everyone today.')
        : (copy.mobileHint || 'Use arrow keys, WASD, or a swipe on the board to move every tile at once.');
    }
    updateTag();
    updateStatus(phaseStatus());
    syncButtons();
    renderBoard();
  }

  function transpose(rows) {
    return rows[0].map((_, column) => rows.map((row) => row[column]));
  }

  function reverseRows(rows) {
    return rows.map((row) => row.slice().reverse());
  }

  function mergeRowLeft(row) {
    const compact = row.filter(Boolean);
    const out = [];
    let gained = 0;
    for (let index = 0; index < compact.length; index += 1) {
      const current = compact[index];
      const next = compact[index + 1];
      if (current && current === next) {
        const merged = current * 2;
        out.push(merged);
        gained += merged;
        index += 1;
      } else {
        out.push(current);
      }
    }
    while (out.length < GRID_SIZE) out.push(0);
    return { row: out, gained };
  }

  function moveLeft(rows) {
    let gained = 0;
    const nextRows = rows.map((row) => {
      const merged = mergeRowLeft(row);
      gained += merged.gained;
      return merged.row;
    });
    return { rows: nextRows, gained };
  }

  function moveRight(rows) {
    const reversed = reverseRows(rows);
    const moved = moveLeft(reversed);
    return { rows: reverseRows(moved.rows), gained: moved.gained };
  }

  function moveUp(rows) {
    const transposed = transpose(rows);
    const moved = moveLeft(transposed);
    return { rows: transpose(moved.rows), gained: moved.gained };
  }

  function moveDown(rows) {
    const transposed = transpose(rows);
    const moved = moveRight(transposed);
    return { rows: transpose(moved.rows), gained: moved.gained };
  }

  function boardsEqual(a, b) {
    return a.every((value, index) => value === b[index]);
  }

  function canMove(board = state.board) {
    if (getEmptyIndexes(board).length) return true;
    const rows = chunkBoard(board);
    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const current = rows[row][col];
        if (row + 1 < GRID_SIZE && rows[row + 1][col] === current) return true;
        if (col + 1 < GRID_SIZE && rows[row][col + 1] === current) return true;
      }
    }
    return false;
  }

  function recomputeMaxTile() {
    state.maxTile = Math.max(...state.board, 2);
  }

  function applyMove(direction) {
    const rows = chunkBoard(state.board);
    let moved;
    if (direction === 'left') moved = moveLeft(rows);
    else if (direction === 'right') moved = moveRight(rows);
    else if (direction === 'up') moved = moveUp(rows);
    else if (direction === 'down') moved = moveDown(rows);
    else return render_game_to_text();

    const nextBoard = flatten(moved.rows);
    if (boardsEqual(state.board, nextBoard)) {
      updateStatus(copy.staticStatus || 'That move changed nothing. Try another direction.');
      return render_game_to_text();
    }

    state.snapshot = cloneStateSnapshot();
    state.board = nextBoard;
    state.score += moved.gained;
    state.moves += 1;
    state.phase = 'playing';
    spawnTile();
    recomputeMaxTile();
    if (state.score > state.best) {
      state.best = state.score;
      saveBest();
    }
    if (state.mode === 'daily' && state.score > state.dailyBest) {
      state.dailyBest = state.score;
      saveDailyBest();
    }

    if (state.maxTile >= state.target) {
      state.phase = 'won';
    } else if (!canMove()) {
      state.phase = 'stuck';
    }

    render();
    if (state.phase === 'playing') {
      updateStatus(copy.movedStatus || 'Good move. Look for the next merge or clear more space.');
    }
    return render_game_to_text();
  }

  function undoMove() {
    if (!state.snapshot) return render_game_to_text();
    state.board = state.snapshot.board.slice();
    state.score = state.snapshot.score;
    state.moves = state.snapshot.moves;
    state.maxTile = state.snapshot.maxTile;
    state.phase = state.snapshot.phase;
    state.snapshot = null;
    render();
    updateStatus(copy.undoStatus || 'One move rolled back.');
    return render_game_to_text();
  }

  function resetGame(seed = DEFAULT_SEED, options = {}) {
    const mode = options.mode || state.mode || 'free';
    state.mode = mode === 'daily' ? 'daily' : 'free';
    state.dailyKey = localDateKey();
    state.dailyBest = Number(window.localStorage?.getItem(getDailyBestKey(state.dailyKey)) || '0') || 0;
    state.seed = state.mode === 'daily' ? getDailySeed() : normalizeSeed(seed);
    state.rng = createRng(state.seed);
    state.board = Array(GRID_SIZE * GRID_SIZE).fill(0);
    state.score = 0;
    state.moves = 0;
    state.maxTile = 2;
    state.phase = 'ready';
    state.snapshot = null;
    spawnTile();
    spawnTile();
    render();
    return render_game_to_text();
  }

  function startDailyChallenge() {
    return resetGame(getDailySeed(), { mode: 'daily' });
  }

  function advanceTime() {
    render();
    return render_game_to_text();
  }

  function render_game_to_text() {
    const payload = {
      game: 'number-merge',
      grid: '4x4 row-major',
      mode: state.mode,
      phase: state.phase,
      score: state.score,
      target: state.target,
      moves: state.moves,
      maxTile: state.maxTile,
      seed: state.seed,
      dailyKey: state.dailyKey,
      dailyBest: state.dailyBest,
      board: chunkBoard(state.board)
    };
    return JSON.stringify(payload);
  }

  function handleDirection(direction) {
    applyMove(direction);
  }

  function handleKeydown(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      event.preventDefault();
      handleDirection('up');
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
      event.preventDefault();
      handleDirection('down');
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      event.preventDefault();
      handleDirection('left');
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      event.preventDefault();
      handleDirection('right');
    } else if (key === 'u' || key === 'U') {
      event.preventDefault();
      undoMove();
    } else if (key === 'n' || key === 'N' || key === 'Enter') {
      event.preventDefault();
      resetGame(state.seed);
    }
  }

  function bindButtons() {
    if (newBtn) newBtn.addEventListener('click', () => {
      resetGame(state.seed, { mode: state.mode });
      focusPlayArea();
    });
    if (dailyBtn) dailyBtn.addEventListener('click', () => {
      startDailyChallenge();
      focusPlayArea();
    });
    if (undoBtn) undoBtn.addEventListener('click', undoMove);
    for (const [direction, button] of Object.entries(controls)) {
      if (button) button.addEventListener('click', () => handleDirection(direction));
    }
  }

  function bindSwipe() {
    if (!gridEl) return;
    gridEl.addEventListener('pointerdown', (event) => {
      state.swipeStart = { x: event.clientX, y: event.clientY };
    });
    gridEl.addEventListener('pointerup', (event) => {
      if (!state.swipeStart) return;
      const dx = event.clientX - state.swipeStart.x;
      const dy = event.clientY - state.swipeStart.y;
      state.swipeStart = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        handleDirection(dx > 0 ? 'right' : 'left');
      } else {
        handleDirection(dy > 0 ? 'down' : 'up');
      }
    });
    gridEl.addEventListener('pointercancel', () => {
      state.swipeStart = null;
    });
  }

  function init() {
    if (state.rng) return;
    if (gridEl && copy.ariaBoard) gridEl.setAttribute('aria-label', copy.ariaBoard);
    buildGrid();
    bindButtons();
    bindSwipe();
    window.addEventListener('keydown', handleKeydown);
    resetGame(DEFAULT_SEED);
    window.__WEBGAME_QA_READY__ = true;
    window.QA_READY = true;
    window.render_game_to_text = render_game_to_text;
    window.advanceTime = advanceTime;
    window.resetGame = resetGame;
    window.reset = resetGame;
  }

  init();
})();
