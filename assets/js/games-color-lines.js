(() => {
  const BOARD_SIZE = 9;
  const START_BALLS = [
    { row: 1, col: 1, color: 'coral' },
    { row: 1, col: 4, color: 'sky' },
    { row: 1, col: 7, color: 'mint' },
    { row: 3, col: 2, color: 'amber' },
    { row: 4, col: 4, color: 'violet' },
    { row: 5, col: 6, color: 'slate' },
    { row: 7, col: 1, color: 'rose' }
  ];
  const SPAWN_COUNT = 3;
  const LINE_TARGET = 5;
  const DEFAULT_SEED = 0xc0110a5;
  const STORAGE_KEY = 'rlt-color-lines-best-v1';
  const DAILY_STORAGE_KEY = 'rlt-color-lines-daily-best-v1';
  const COLORS = ['coral', 'sky', 'mint', 'amber', 'violet', 'slate', 'rose'];
  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  const copy = window.__COLOR_LINES_COPY__ || {};
  const meta = window.__COLOR_LINES_META__ || {};
  const gridEl = document.getElementById('color-lines-grid');
  if (!gridEl) return;

  const els = {
    score: document.getElementById('color-lines-score'),
    best: document.getElementById('color-lines-best'),
    lines: document.getElementById('color-lines-lines'),
    moves: document.getElementById('color-lines-moves'),
    balls: document.getElementById('color-lines-balls'),
    upcoming: document.getElementById('color-lines-upcoming'),
    tag: document.getElementById('color-lines-tag'),
    status: document.getElementById('color-lines-status'),
    hint: document.getElementById('color-lines-hint'),
    mobileFlow: document.getElementById('color-lines-mobile-flow'),
    reset: document.getElementById('color-lines-reset'),
    clear: document.getElementById('color-lines-clear'),
    select: document.getElementById('color-lines-select')
  };

  const state = {
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    dailyBest: Number(window.localStorage?.getItem(DAILY_STORAGE_KEY) || '0') || 0,
    lines: 0,
    moves: 0,
    board: [],
    selected: null,
    seed: DEFAULT_SEED,
    rng: null,
    upcoming: [],
    lastPath: [],
    lastCleared: [],
    dailyKey: dailyKeyForToday(),
    mode: 'free'
  };

  function dailyKeyForToday() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  }

  function normalizeSeed(seed) {
    if (Number.isFinite(seed)) return (seed >>> 0) || DEFAULT_SEED;
    const parsed = Number.parseInt(String(seed), 10);
    return Number.isFinite(parsed) ? ((parsed >>> 0) || DEFAULT_SEED) : DEFAULT_SEED;
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

  function emptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));
  }

  function boardKey(row, col) {
    return `${row},${col}`;
  }

  function getEmptyCells() {
    const out = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (!state.board[row][col]) out.push({ row, col });
      }
    }
    return out;
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, String(state.best));
      window.localStorage.setItem(DAILY_STORAGE_KEY, String(state.dailyBest));
    }
  }

  function updateBest() {
    if (state.score > state.best) state.best = state.score;
    if (state.mode === 'daily' && state.score > state.dailyBest) state.dailyBest = state.score;
    saveBest();
  }

  function rollColor() {
    return COLORS[Math.floor(state.rng() * COLORS.length)];
  }

  function rollUpcoming() {
    state.upcoming = Array.from({ length: SPAWN_COUNT }, () => rollColor());
  }

  function placeStarterLayout() {
    for (const item of START_BALLS) {
      state.board[item.row][item.col] = item.color;
    }
  }

  function ensureGrid() {
    if (gridEl.children.length) return;
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cl-cell';
        button.id = `color-lines-cell-${row}-${col}`;
        button.dataset.row = String(row);
        button.dataset.col = String(col);
        button.setAttribute('aria-label', `Cell ${row + 1}, ${col + 1}`);
        fragment.appendChild(button);
      }
    }
    gridEl.appendChild(fragment);
  }

  function phaseLabel() {
    if (state.phase === 'selected') return copy.selectedLabel || 'Selected';
    if (state.phase === 'gameover') return copy.gameoverLabel || 'Board full';
    return copy.readyLabel || 'Ready';
  }

  function defaultStatus() {
    if (state.phase === 'gameover') return copy.gameoverStatus || 'The board is full. Reset and try a cleaner route.';
    if (state.selected) return copy.selectedStatus || 'Choose an empty cell with an open path.';
    return state.mode === 'daily'
      ? (copy.dailyStatus || 'Daily board ready. Everyone gets the same start today.')
      : (copy.readyStatus || 'Pick a ball, then tap an empty cell to move it.');
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function setPhase(nextPhase) {
    state.phase = nextPhase;
    if (els.tag) {
      els.tag.dataset.state = nextPhase;
      els.tag.textContent = `${state.mode === 'daily' ? (copy.dailyModeLabel || 'Daily') : (copy.freeModeLabel || 'Free')} · ${phaseLabel()}`;
    }
  }

  function updateHints() {
    if (els.hint) {
      els.hint.textContent = state.mode === 'daily'
        ? (copy.dailyHint || copy.hint || '')
        : (copy.hint || '');
    }
    if (els.mobileFlow) {
      if (state.phase === 'gameover') {
        els.mobileFlow.textContent = copy.mobileFlowGameover || copy.mobileFlowReady || '';
      } else if (state.selected) {
        els.mobileFlow.textContent = copy.mobileFlowSelected || copy.mobileFlowReady || '';
      } else {
        els.mobileFlow.textContent = copy.mobileFlowReady || '';
      }
    }
  }

  function syncHud() {
    if (els.score) els.score.textContent = String(state.score);
    if (els.best) els.best.textContent = String(state.mode === 'daily' ? state.dailyBest : state.best);
    if (els.lines) els.lines.textContent = String(state.lines);
    if (els.moves) els.moves.textContent = String(state.moves);
    if (els.balls) els.balls.textContent = String(BOARD_SIZE * BOARD_SIZE - getEmptyCells().length);
    if (els.select) {
      els.select.textContent = state.selected
        ? `${state.selected.row + 1}, ${state.selected.col + 1}`
        : (copy.noSelectionLabel || 'None');
    }
    if (els.reset) els.reset.textContent = copy.resetButton || 'New board';
    if (els.clear) els.clear.textContent = copy.clearButton || 'Clear selection';
    updateHints();
    setPhase(state.phase === 'gameover' ? 'gameover' : state.selected ? 'selected' : 'ready');

    if (els.upcoming) {
      els.upcoming.innerHTML = '';
      state.upcoming.forEach((color, index) => {
        const chip = document.createElement('span');
        chip.className = 'cl-upcoming-dot';
        chip.dataset.color = color;
        chip.id = `color-lines-upcoming-${index}`;
        chip.setAttribute('aria-hidden', 'true');
        els.upcoming.appendChild(chip);
      });
    }
  }

  function renderBoard() {
    ensureGrid();
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const cell = document.getElementById(`color-lines-cell-${row}-${col}`);
        if (!cell) continue;
        const value = state.board[row][col];
        cell.dataset.filled = value ? 'true' : 'false';
        cell.dataset.selected = state.selected && state.selected.row === row && state.selected.col === col ? 'true' : 'false';
        cell.dataset.preview = state.lastPath.some((step) => step.row === row && step.col === col) ? 'true' : 'false';
        cell.innerHTML = value ? `<span class="cl-ball" data-color="${value}"></span>` : '';
      }
    }
  }

  function render() {
    renderBoard();
    syncHud();
  }

  function spawnUpcomingBalls() {
    const empty = getEmptyCells();
    if (!empty.length) {
      state.phase = 'gameover';
      return;
    }
    state.lastCleared = [];
    for (const color of state.upcoming) {
      const slots = getEmptyCells();
      if (!slots.length) break;
      const choice = slots[Math.floor(state.rng() * slots.length)];
      state.board[choice.row][choice.col] = color;
    }
    rollUpcoming();
    const cleared = collectLines();
    if (cleared.length) {
      clearCells(cleared, true);
    }
    if (!getEmptyCells().length) {
      state.phase = 'gameover';
    }
  }

  function inBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  function collectLines() {
    const marked = new Set();
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const color = state.board[row][col];
        if (!color) continue;
        for (const [dr, dc] of DIRECTIONS) {
          const prevRow = row - dr;
          const prevCol = col - dc;
          if (inBounds(prevRow, prevCol) && state.board[prevRow][prevCol] === color) continue;
          const line = [];
          let cursorRow = row;
          let cursorCol = col;
          while (inBounds(cursorRow, cursorCol) && state.board[cursorRow][cursorCol] === color) {
            line.push({ row: cursorRow, col: cursorCol });
            cursorRow += dr;
            cursorCol += dc;
          }
          if (line.length >= LINE_TARGET) {
            line.forEach((cell) => marked.add(boardKey(cell.row, cell.col)));
          }
        }
      }
    }
    return Array.from(marked).map((entry) => {
      const [row, col] = entry.split(',').map(Number);
      return { row, col };
    });
  }

  function clearCells(cells, fromSpawn = false) {
    cells.forEach(({ row, col }) => {
      state.board[row][col] = '';
    });
    state.lastCleared = cells.slice();
    state.lines += 1;
    state.score += cells.length * (fromSpawn ? 3 : 2);
    updateBest();
    setStatus(fromSpawn
      ? (copy.spawnClearStatus || 'The new balls completed a line and cleared space for you.')
      : (copy.clearStatus || 'Line cleared. Use the extra space to set up the next route.'));
  }

  function pathToTarget(start, target) {
    if (!start || !target) return null;
    const queue = [{ row: start.row, col: start.col }];
    const visited = new Set([boardKey(start.row, start.col)]);
    const parent = new Map();
    while (queue.length) {
      const current = queue.shift();
      if (current.row === target.row && current.col === target.col) {
        const path = [];
        let cursorKey = boardKey(target.row, target.col);
        while (parent.has(cursorKey)) {
          const [row, col] = cursorKey.split(',').map(Number);
          path.unshift({ row, col });
          cursorKey = parent.get(cursorKey);
        }
        return path;
      }
      const neighbors = [
        { row: current.row - 1, col: current.col },
        { row: current.row + 1, col: current.col },
        { row: current.row, col: current.col - 1 },
        { row: current.row, col: current.col + 1 }
      ];
      for (const next of neighbors) {
        if (!inBounds(next.row, next.col)) continue;
        if (state.board[next.row][next.col] && !(next.row === target.row && next.col === target.col)) continue;
        const nextKey = boardKey(next.row, next.col);
        if (visited.has(nextKey)) continue;
        visited.add(nextKey);
        parent.set(nextKey, boardKey(current.row, current.col));
        queue.push(next);
      }
    }
    return null;
  }

  function moveSelected(targetRow, targetCol) {
    if (!state.selected) return render_game_to_text();
    if (state.board[targetRow][targetCol]) {
      selectCell(targetRow, targetCol);
      return render_game_to_text();
    }
    const path = pathToTarget(state.selected, { row: targetRow, col: targetCol });
    if (!path) {
      state.lastPath = [];
      setStatus(copy.blockedStatus || 'That route is blocked. Open a lane first.');
      render();
      return render_game_to_text();
    }

    const color = state.board[state.selected.row][state.selected.col];
    state.board[state.selected.row][state.selected.col] = '';
    state.board[targetRow][targetCol] = color;
    state.selected = null;
    state.moves += 1;
    state.lastPath = path;

    const cleared = collectLines();
    if (cleared.length) {
      clearCells(cleared, false);
    } else {
      spawnUpcomingBalls();
      if (state.phase !== 'gameover') {
        setStatus(copy.moveStatus || 'Move complete. Watch the next three colors before you pick again.');
      }
    }

    if (state.phase !== 'gameover' && !getEmptyCells().length) {
      state.phase = 'gameover';
      setStatus(copy.gameoverStatus || 'The board is full. Reset and try a cleaner route.');
    }

    render();
    return render_game_to_text();
  }

  function selectCell(row, col) {
    if (!state.board[row][col]) {
      if (state.selected) return moveSelected(row, col);
      setStatus(copy.emptyStatus || 'Pick a colored ball first, then choose an empty cell.');
      render();
      return render_game_to_text();
    }
    state.selected = { row, col };
    state.lastPath = [];
    setStatus(copy.selectedStatus || 'Selection locked. Now choose an empty cell with a clear path.');
    render();
    return render_game_to_text();
  }

  function resetGame(seed = DEFAULT_SEED, options = {}) {
    state.seed = normalizeSeed(seed);
    state.rng = createRng(state.seed);
    state.score = 0;
    state.lines = 0;
    state.moves = 0;
    state.board = emptyBoard();
    state.selected = null;
    state.lastPath = [];
    state.lastCleared = [];
    state.dailyKey = dailyKeyForToday();
    state.mode = options.mode === 'daily' ? 'daily' : 'free';
    placeStarterLayout();
    rollUpcoming();
    state.phase = 'ready';
    setStatus(defaultStatus());
    render();
    return render_game_to_text();
  }

  function startDaily() {
    const parts = state.dailyKey.split('-').map(Number);
    const seed = normalizeSeed((parts[0] * 10000) + (parts[1] * 100) + parts[2]);
    resetGame(seed, { mode: 'daily' });
    setStatus(copy.dailyStatus || 'Daily board ready. Everyone gets the same start today.');
    render();
    return render_game_to_text();
  }

  function clearSelection() {
    state.selected = null;
    state.lastPath = [];
    setStatus(defaultStatus());
    render();
    return render_game_to_text();
  }

  function advanceTime() {
    render();
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({
      slug: meta.slug || 'color-lines',
      phase: state.phase,
      mode: state.mode,
      score: state.score,
      lines: state.lines,
      moves: state.moves,
      best: state.best,
      dailyBest: state.dailyBest,
      dailyKey: state.dailyKey,
      seed: state.seed,
      selected: state.selected ? { row: state.selected.row, col: state.selected.col } : null,
      emptyCells: getEmptyCells().length,
      upcoming: state.upcoming.slice(),
      board: state.board.map((row) => row.slice()),
      lastPath: state.lastPath.slice(),
      lastCleared: state.lastCleared.slice()
    });
  }

  function bind() {
    ensureGrid();
    gridEl.addEventListener('click', (event) => {
      const button = event.target.closest('.cl-cell');
      if (!button) return;
      const row = Number(button.dataset.row);
      const col = Number(button.dataset.col);
      selectCell(row, col);
    });
    if (els.reset) els.reset.addEventListener('click', () => resetGame(state.seed, { mode: state.mode }));
    if (els.clear) els.clear.addEventListener('click', clearSelection);
    const dailyBtn = document.getElementById('color-lines-daily');
    if (dailyBtn) dailyBtn.addEventListener('click', startDaily);
    window.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        resetGame(state.seed, { mode: state.mode });
      } else if (event.key.toLowerCase() === 'd') {
        event.preventDefault();
        startDaily();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        clearSelection();
      }
    });
  }

  bind();
  resetGame(DEFAULT_SEED, { mode: meta.mode || 'free' });
  window.__WEBGAME_QA_READY__ = true;
  window.QA_READY = true;
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.resetGame = resetGame;
  window.reset = resetGame;
})();
