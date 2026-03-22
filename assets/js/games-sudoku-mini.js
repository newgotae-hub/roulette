(() => {
  const BOARD_SIZE = 4;
  const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
  const DAILY_KEY = 'rlt-sudoku-mini-daily-best-v1';
  const BEST_KEY = 'rlt-sudoku-mini-best-v1';
  const copy = window.__SUDOKU_MINI_COPY__ || {};
  const meta = window.__SUDOKU_MINI_META__ || {};
  const boardEl = document.getElementById('sudoku-mini-board');
  if (!boardEl) return;

  const PUZZLES = [
    { id: 'starter', puzzle: [1,0,3,0,0,4,0,2,2,0,4,0,0,3,0,1], solution: [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1] },
    { id: 'cross', puzzle: [0,2,0,4,3,0,0,0,0,0,4,3,4,0,2,0], solution: [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1] },
    { id: 'mirror', puzzle: [1,0,0,4,0,4,1,0,0,1,4,0,4,0,0,1], solution: [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1] }
  ];

  const els = {
    tag: document.getElementById('sudoku-mini-tag'),
    hint: document.getElementById('sudoku-mini-hint'),
    mobile: document.getElementById('sudoku-mini-mobile-flow'),
    status: document.getElementById('sudoku-mini-status'),
    filled: document.getElementById('sudoku-mini-filled'),
    mistakes: document.getElementById('sudoku-mini-mistakes'),
    best: document.getElementById('sudoku-mini-best'),
    dailyBest: document.getElementById('sudoku-mini-daily-best'),
    selectedLabel: document.getElementById('sudoku-mini-selected-label'),
    puzzleLabel: document.getElementById('sudoku-mini-puzzle-label'),
    reset: document.getElementById('sudoku-mini-reset'),
    daily: document.getElementById('sudoku-mini-daily'),
    clear: document.getElementById('sudoku-mini-clear')
  };

  const state = {
    mode: meta.mode === 'daily' ? 'daily' : 'free',
    phase: 'ready',
    puzzle: null,
    board: Array(CELL_COUNT).fill(0),
    fixed: Array(CELL_COUNT).fill(false),
    selected: -1,
    mistakes: 0,
    elapsedMs: 0,
    readySnapshotText: '',
    best: Number(window.localStorage?.getItem(BEST_KEY) || '0') || 0,
    dailyBest: 0,
    seed: 0
  };

  function localDayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function getDailySeed() {
    return hashString(`sudoku-mini:${localDayKey()}`);
  }

  function dailyBestStorageKey() {
    return `${DAILY_KEY}-${localDayKey()}`;
  }

  function pickPuzzle(mode = 'free', seed = 0) {
    if (mode === 'daily') {
      const dailySeed = seed || getDailySeed();
      return { seed: dailySeed, puzzle: PUZZLES[dailySeed % PUZZLES.length] };
    }
    return { seed: 1, puzzle: PUZZLES[0] };
  }

  function buildBoard() {
    if (boardEl.children.length) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < CELL_COUNT; index += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sm-cell';
      button.id = `sudoku-mini-cell-${index}`;
      button.dataset.index = String(index);
      button.setAttribute('aria-label', `Sudoku cell ${index + 1}`);
      fragment.appendChild(button);
    }
    boardEl.appendChild(fragment);
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function phaseLabel() {
    if (state.phase === 'cleared') return copy.clearedLabel || 'Cleared';
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    return copy.readyLabel || 'Ready';
  }

  function modeLabel() {
    return state.mode === 'daily' ? (copy.dailyModeLabel || 'Daily') : (copy.freeModeLabel || 'Free');
  }

  function selectedLabel() {
    if (state.selected < 0) return copy.selectionNone || 'None';
    const row = Math.floor(state.selected / BOARD_SIZE) + 1;
    const col = (state.selected % BOARD_SIZE) + 1;
    return `${row}, ${col}`;
  }

  function filledCount() {
    return state.board.filter(Boolean).length;
  }

  function saveBests() {
    if (!window.localStorage) return;
    window.localStorage.setItem(BEST_KEY, String(state.best));
    window.localStorage.setItem(dailyBestStorageKey(), String(state.dailyBest));
  }

  function updateBests() {
    const score = filledCount() * 10 - state.mistakes;
    if (score > state.best) state.best = score;
    if (state.mode === 'daily' && score > state.dailyBest) state.dailyBest = score;
    saveBests();
  }

  function syncText() {
    if (els.tag) {
      els.tag.dataset.state = state.phase;
      els.tag.textContent = `${modeLabel()} · ${phaseLabel()}`;
    }
    if (els.hint) {
      els.hint.textContent = state.mode === 'daily' ? (copy.dailyHint || copy.hint || '') : (copy.hint || '');
    }
    if (els.mobile) {
      if (state.phase === 'cleared') els.mobile.textContent = copy.mobileFlowCleared || copy.mobileFlowReady || '';
      else if (state.selected >= 0) els.mobile.textContent = copy.mobileFlowPlaying || copy.mobileFlowReady || '';
      else els.mobile.textContent = copy.mobileFlowReady || '';
    }
    if (els.filled) els.filled.textContent = `${filledCount()} / ${CELL_COUNT}`;
    if (els.mistakes) els.mistakes.textContent = String(state.mistakes);
    if (els.best) els.best.textContent = String(state.best);
    if (els.dailyBest) els.dailyBest.textContent = String(state.dailyBest);
    if (els.selectedLabel) els.selectedLabel.textContent = selectedLabel();
    if (els.puzzleLabel) els.puzzleLabel.textContent = state.puzzle.id;
    if (els.reset) els.reset.textContent = copy.resetButton || 'New puzzle';
    if (els.daily) els.daily.textContent = copy.dailyButton || 'Daily challenge';
    if (els.clear) els.clear.textContent = copy.clearButton || 'Clear cell';
  }

  function renderBoard() {
    buildBoard();
    for (let index = 0; index < CELL_COUNT; index += 1) {
      const cell = document.getElementById(`sudoku-mini-cell-${index}`);
      if (!cell) continue;
      const value = state.board[index];
      cell.textContent = value ? String(value) : '';
      cell.dataset.fixed = state.fixed[index] ? 'true' : 'false';
      cell.dataset.selected = state.selected === index ? 'true' : 'false';
      if (cell.dataset.state !== 'invalid') cell.dataset.state = '';
    }
  }

  function render() {
    renderBoard();
    syncText();
  }

  function loadPuzzle(mode = 'free', options = {}) {
    const resolved = pickPuzzle(mode, options.seed);
    state.mode = mode;
    state.seed = resolved.seed;
    state.puzzle = resolved.puzzle;
    state.board = resolved.puzzle.puzzle.slice();
    state.fixed = resolved.puzzle.puzzle.map((value) => value !== 0);
    state.selected = state.fixed.findIndex((value) => !value);
    state.mistakes = 0;
    state.elapsedMs = 0;
    state.phase = 'ready';
    state.dailyBest = Number(window.localStorage?.getItem(dailyBestStorageKey()) || '0') || 0;
    state.readySnapshotText = JSON.stringify({
      mode: state.mode,
      phase: 'ready',
      filled: filledCount(),
      mistakes: 0,
      selectedCell: state.selected >= 0 ? state.selected : null,
      puzzleId: state.puzzle.id,
      board: state.board.slice(),
      complete: false,
      elapsedMs: 0,
      qaReady: true,
      seed: state.seed
    });
    setStatus(copy.readyStatus || 'Pick an empty cell, then enter a digit.');
    render();
  }

  function selectCell(index) {
    if (state.fixed[index]) return;
    state.selected = index;
    state.phase = 'playing';
    setStatus(copy.readyStatus || 'Cell selected.');
    render();
  }

  function clearCell() {
    if (state.selected < 0 || state.fixed[state.selected]) return;
    state.board[state.selected] = 0;
    state.phase = 'playing';
    render();
  }

  function maybeClear() {
    const solved = state.board.every((value, index) => value === state.puzzle.solution[index]);
    if (!solved) return false;
    state.phase = 'cleared';
    updateBests();
    setStatus(copy.clearedStatus || 'Puzzle cleared.');
    render();
    return true;
  }

  function enterDigit(digit) {
    if (state.selected < 0 || state.fixed[state.selected]) return;
    const expected = state.puzzle.solution[state.selected];
    state.elapsedMs += 120;
    if (digit !== expected) {
      state.mistakes += 1;
      const cell = document.getElementById(`sudoku-mini-cell-${state.selected}`);
      if (cell) {
        cell.dataset.state = 'invalid';
        window.setTimeout(() => {
          if (cell.dataset.state === 'invalid') cell.dataset.state = '';
        }, 220);
      }
      setStatus(copy.invalidStatus || 'Wrong digit.');
      syncText();
      return;
    }
    state.board[state.selected] = digit;
    state.phase = 'playing';
    setStatus(copy.solvedStatus || 'Correct digit placed.');
    render();
    maybeClear();
  }

  function sudokuMiniFill(index, digit) {
    selectCell(index);
    enterDigit(digit);
    return render_game_to_text();
  }

  function render_game_to_text() {
    if (state.phase === 'ready' && state.readySnapshotText) {
      return state.readySnapshotText;
    }
    return JSON.stringify({
      mode: state.mode,
      phase: state.phase,
      filled: filledCount(),
      mistakes: state.mistakes,
      selectedCell: state.selected >= 0 ? state.selected : null,
      puzzleId: state.puzzle.id,
      board: state.board.slice(),
      complete: state.phase === 'cleared',
      elapsedMs: state.elapsedMs,
      qaReady: true,
      seed: state.seed
    });
  }

  function advanceTime(ms) {
    state.elapsedMs += Math.max(0, Number(ms) || 0);
    return render_game_to_text();
  }

  function resetGame(seed, options = {}) {
    loadPuzzle(options.mode || state.mode, { seed });
    return render_game_to_text();
  }

  function bindEvents() {
    boardEl.addEventListener('click', (event) => {
      const cell = event.target.closest('.sm-cell');
      if (!cell) return;
      selectCell(Number(cell.dataset.index));
    });
    document.querySelectorAll('[data-digit]').forEach((button) => {
      button.addEventListener('click', () => enterDigit(Number(button.dataset.digit)));
    });
    if (els.reset) els.reset.addEventListener('click', () => loadPuzzle('free'));
    if (els.daily) els.daily.addEventListener('click', () => loadPuzzle('daily'));
    if (els.clear) els.clear.addEventListener('click', clearCell);
  }

  loadPuzzle(state.mode);
  bindEvents();

  window.sudokuMiniFill = sudokuMiniFill;
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.resetGame = resetGame;
  window.reset = resetGame;
  window.__WEBGAME_QA_READY__ = true;
  window.QA_READY = true;
})();
