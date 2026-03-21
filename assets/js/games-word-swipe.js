(() => {
  const DEFAULT_MODE = 'free';
  const DEFAULT_FREE_SEED = 0x776f7264;
  const STORAGE_KEY_PREFIX = 'rlt-word-swipe-best-v1';
  const ROWS = 4;
  const COLS = 4;

  const COPY = window.__WORD_SWIPE_COPY__ || {};
  const META = window.__WORD_SWIPE_META__ || {};

  const FALLBACK_COPY = {
    freeModeLabel: 'Free',
    dailyModeLabel: 'Daily',
    readyLabel: 'Ready',
    playingLabel: 'Playing',
    clearedLabel: 'Cleared',
    hint: 'Trace connected letters to build the current target word.',
    dailyHint: 'Daily challenge uses a date-seeded board shared across players.',
    mobileFlowReady: 'Swipe or tap connected cells to trace a word.',
    mobileFlowPlaying: 'Keep tracing the current path, or tap a new start cell to try again.',
    mobileFlowCleared: 'Board cleared. Reset to play a new puzzle.',
    readyStatus: 'Trace connected letters to build the current target word.',
    solvedStatus: 'Word found. Keep going until the board is cleared.',
    clearedStatus: 'Every target word is solved. Reset to replay.',
    invalidStatus: 'That path does not match a remaining target word.',
    duplicateStatus: 'That word is already solved.',
    selectionNone: 'No selection',
    resetButton: 'New puzzle',
    dailyButton: 'Daily challenge',
    clearButton: 'Clear path',
    solvedFormatPrefix: '',
    solvedFormatMiddle: ' / ',
    solvedFormatSuffix: ''
  };

  const ui = Object.assign({}, FALLBACK_COPY, COPY);
  const isKorean = String(META.lang || document.documentElement.lang || '').toLowerCase().startsWith('ko');
  const modeLabels = {
    free: String(ui.freeModeLabel || 'Free'),
    daily: String(ui.dailyModeLabel || 'Daily')
  };

  const freePuzzle = {
    id: 'starter',
    mode: 'free',
    title: 'Starter board',
    note: 'Four readable row words keep the first run quick and clean.',
    targetWords: ['WAVE', 'PLAY', 'TIDE', 'STAR'],
    board: [
      ['W', 'A', 'V', 'E'],
      ['P', 'L', 'A', 'Y'],
      ['T', 'I', 'D', 'E'],
      ['S', 'T', 'A', 'R']
    ],
    paths: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15]
    ]
  };

  const dailyPuzzles = [
    {
      id: 'daily-code',
      mode: 'daily',
      title: 'Code board',
      note: 'A calmer daily board with compact four-letter targets.',
      targetWords: ['CODE', 'NOTE', 'GRID', 'PLAY'],
      board: [
        ['C', 'O', 'D', 'E'],
        ['N', 'O', 'T', 'E'],
        ['G', 'R', 'I', 'D'],
        ['P', 'L', 'A', 'Y']
      ],
      paths: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15]
      ]
    },
    {
      id: 'daily-wave',
      mode: 'daily',
      title: 'Wave board',
      note: 'A soft mix of short words for a lighter daily session.',
      targetWords: ['WAVE', 'MATH', 'BOLD', 'TEAM'],
      board: [
        ['W', 'A', 'V', 'E'],
        ['M', 'A', 'T', 'H'],
        ['B', 'O', 'L', 'D'],
        ['T', 'E', 'A', 'M']
      ],
      paths: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15]
      ]
    },
    {
      id: 'daily-glow',
      mode: 'daily',
      title: 'Glow board',
      note: 'A route-reading board with a little more visual variety.',
      targetWords: ['GLOW', 'RIDE', 'LINK', 'WORD'],
      board: [
        ['G', 'L', 'O', 'W'],
        ['R', 'I', 'D', 'E'],
        ['L', 'I', 'N', 'K'],
        ['W', 'O', 'R', 'D']
      ],
      paths: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15]
      ]
    },
    {
      id: 'daily-lane',
      mode: 'daily',
      title: 'Lane board',
      note: 'Short words make the daily board feel quick to complete.',
      targetWords: ['LANE', 'MOVE', 'CLIP', 'DRAW'],
      board: [
        ['L', 'A', 'N', 'E'],
        ['M', 'O', 'V', 'E'],
        ['C', 'L', 'I', 'P'],
        ['D', 'R', 'A', 'W']
      ],
      paths: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15]
      ]
    }
  ];

  const els = {
    root: document.querySelector('.ws-wrap'),
    board: document.getElementById('word-swipe-board'),
    tag: document.getElementById('word-swipe-tag'),
    hint: document.getElementById('word-swipe-hint'),
    mobileFlow: document.getElementById('word-swipe-mobile-flow'),
    status: document.getElementById('word-swipe-status'),
    score: document.getElementById('word-swipe-score'),
    best: document.getElementById('word-swipe-best'),
    moves: document.getElementById('word-swipe-moves'),
    solved: document.getElementById('word-swipe-solved'),
    target: document.getElementById('word-swipe-target'),
    selectionLabel: document.getElementById('word-swipe-selection-label'),
    progressNote: document.getElementById('word-swipe-progress-note'),
    targetList: document.getElementById('word-swipe-target-list'),
    reset: document.getElementById('word-swipe-reset'),
    daily: document.getElementById('word-swipe-daily'),
    clear: document.getElementById('word-swipe-clear')
  };

  const pointerState = {
    active: false,
    pointerId: null,
    dragging: false,
    lastIndex: null
  };

  const state = {
    mode: DEFAULT_MODE,
    phase: 'ready',
    puzzle: freePuzzle,
    board: cloneBoard(freePuzzle.board),
    selection: [],
    foundWords: [],
    solvedPaths: new Set(),
    targetIndex: 0,
    score: 0,
    best: 0,
    moves: 0,
    elapsedMs: 0,
    dailyKey: '',
    seed: DEFAULT_FREE_SEED,
    started: false,
    invalidFlash: false
  };

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function flattenBoard(board) {
    return board.reduce((acc, row) => acc.concat(row), []);
  }

  function storageKey(mode) {
    return `${STORAGE_KEY_PREFIX}-${mode}`;
  }

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {}
  }

  function todayKey() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function dateSeed(text) {
    const digits = String(text || '').replace(/\D/g, '');
    const fallback = 20260322;
    return Number(digits || fallback) || fallback;
  }

  function selectDailyPuzzle(seedText) {
    const key = String(seedText || todayKey());
    const digits = key.replace(/\D/g, '');
    const numeric = Number(digits || DEFAULT_FREE_SEED) || DEFAULT_FREE_SEED;
    const index = Math.abs(numeric) % dailyPuzzles.length;
    return {
      puzzle: dailyPuzzles[index],
      dailyKey: key,
      seed: numeric
    };
  }

  function currentModeLabel() {
    return modeLabels[state.mode] || modeLabels.free;
  }

  function puzzleForMode(mode, seed) {
    if (mode === 'daily') {
      const selected = selectDailyPuzzle(seed ? String(seed) : todayKey());
      return selected;
    }
    return {
      puzzle: freePuzzle,
      dailyKey: '',
      seed: Number(seed) || DEFAULT_FREE_SEED
    };
  }

  function canUseCell(index) {
    return Number.isInteger(index) && index >= 0 && index < ROWS * COLS;
  }

  function cellLetter(index) {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    return state.board[row]?.[col] || '';
  }

  function isAdjacent(a, b) {
    if (!canUseCell(a) || !canUseCell(b)) return false;
    const ar = Math.floor(a / COLS);
    const ac = a % COLS;
    const br = Math.floor(b / COLS);
    const bc = b % COLS;
    return Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1 && !(ar === br && ac === bc);
  }

  function selectionLetters(indices = state.selection) {
    return indices.map((index) => cellLetter(index)).join('');
  }

  function solvedWordSet() {
    return new Set(state.foundWords);
  }

  function targetWords() {
    return state.puzzle.targetWords.slice();
  }

  function targetPathByWord(word) {
    const normalized = String(word || '').toUpperCase();
    const index = state.puzzle.targetWords.findIndex((entry) => String(entry).toUpperCase() === normalized);
    return index >= 0 ? state.puzzle.paths[index] : null;
  }

  function remainingTargetWords() {
    const solved = solvedWordSet();
    return state.puzzle.targetWords.filter((word) => !solved.has(word));
  }

  function currentTargetWord() {
    return remainingTargetWords()[0] || '';
  }

  function isPrefixMatch(candidateLetters) {
    const upper = String(candidateLetters || '').toUpperCase();
    return remainingTargetWords().some((word) => String(word).toUpperCase().startsWith(upper));
  }

  function selectionLabel() {
    if (!state.selection.length) return String(ui.selectionNone || 'No selection');
    return selectionLetters(state.selection).split('').join(' • ');
  }

  function setButtonText(button, text) {
    if (button) button.textContent = String(text);
  }

  function syncStaticUi() {
    setButtonText(els.reset, ui.resetButton || 'New puzzle');
    setButtonText(els.daily, ui.dailyButton || 'Daily challenge');
    setButtonText(els.clear, ui.clearButton || 'Clear path');
    if (els.root) {
      els.root.dataset.mode = state.mode;
      els.root.dataset.phase = state.phase;
    }
  }

  function syncBadge() {
    if (!els.tag) return;
    const modeLabel = currentModeLabel();
    const phaseLabel = state.phase === 'cleared'
      ? (ui.clearedLabel || 'Cleared')
      : state.phase === 'playing'
        ? (ui.playingLabel || 'Playing')
        : (ui.readyLabel || 'Ready');
    els.tag.textContent = `${modeLabel} · ${phaseLabel}`;
    els.tag.dataset.state = state.phase;
  }

  function syncTextContent() {
    if (els.hint) {
      if (state.phase === 'cleared') {
        els.hint.textContent = String(ui.clearedStatus || 'Every target word is solved. Reset to replay.');
      } else if (state.phase === 'playing') {
        els.hint.textContent = String(ui.readyStatus || 'Trace connected letters to build the current target word.');
      } else {
        els.hint.textContent = String(ui.readyStatus || 'Trace connected letters to build the current target word.');
      }
    }
    if (els.mobileFlow) {
      if (state.phase === 'cleared') {
        els.mobileFlow.textContent = String(ui.mobileFlowCleared || 'Board cleared. Reset to play a new puzzle.');
      } else if (state.phase === 'playing') {
        els.mobileFlow.textContent = String(ui.mobileFlowPlaying || 'Keep tracing the current path, or tap a new start cell to try again.');
      } else {
        els.mobileFlow.textContent = String(ui.mobileFlowReady || 'Swipe or tap connected cells to trace a word.');
      }
    }
    if (els.status) {
      if (state.phase === 'cleared') {
        els.status.textContent = String(ui.clearedStatus || 'Every target word is solved. Reset to replay.');
      } else if (state.phase === 'playing') {
        els.status.textContent = state.invalidFlash
          ? String(ui.invalidStatus || 'That path does not match a remaining target word.')
          : String(ui.readyStatus || 'Trace connected letters to build the current target word.');
      } else {
        els.status.textContent = String(ui.readyStatus || 'Trace connected letters to build the current target word.');
      }
    }
    if (els.progressNote) {
      const modeText = currentModeLabel();
      const extra = state.puzzle.note ? ` · ${state.puzzle.note}` : '';
      els.progressNote.textContent = `${modeText} board${extra}`;
    }
    if (els.selectionLabel) {
      els.selectionLabel.textContent = selectionLabel();
    }
  }

  function syncStats() {
    if (els.score) els.score.textContent = String(state.score);
    if (els.best) els.best.textContent = String(state.best);
    if (els.moves) els.moves.textContent = String(state.moves);
    if (els.solved) {
      const prefix = ui.solvedFormatPrefix || '';
      const middle = ui.solvedFormatMiddle || ' / ';
      const suffix = ui.solvedFormatSuffix || '';
      els.solved.textContent = `${prefix}${state.foundWords.length}${middle}${state.puzzle.targetWords.length}${suffix}`;
    }
    if (els.target) els.target.textContent = currentTargetWord() || (ui.clearedLabel || 'Cleared');
    if (els.progressNote && state.phase === 'ready') {
      els.progressNote.textContent = `${currentModeLabel()} board · ${state.puzzle.note}`;
    }
    if (els.targetList) {
      els.targetList.innerHTML = '';
      state.puzzle.targetWords.forEach((word, index) => {
        const chip = document.createElement('span');
        chip.className = 'ws-target-chip';
        if (!state.foundWords.includes(word) && index === state.targetIndex) chip.classList.add('is-active');
        if (state.foundWords.includes(word)) chip.dataset.state = 'solved';
        chip.textContent = word;
        chip.setAttribute('aria-label', state.foundWords.includes(word) ? `${word} solved` : `${word} target word`);
        if (state.foundWords.includes(word)) {
          chip.style.opacity = '0.72';
        }
        state.foundWords.includes(word) ? chip.setAttribute('aria-current', 'false') : undefined;
        if (index === state.targetIndex && state.phase !== 'cleared') {
          chip.setAttribute('aria-current', 'true');
        }
        els.targetList.appendChild(chip);
      });
    }
  }

  function renderBoard() {
    if (!els.board) return;
    els.board.innerHTML = '';
    const solvedPaths = new Set();
    state.puzzle.targetWords.forEach((word, index) => {
      if (state.foundWords.includes(word)) {
        state.puzzle.paths[index].forEach((cellIndex) => solvedPaths.add(cellIndex));
      }
    });

    const selectionMap = new Map();
    state.selection.forEach((cellIndex, stepIndex) => {
      selectionMap.set(cellIndex, String(stepIndex + 1));
    });

    flattenBoard(state.board).forEach((letter, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ws-cell';
      button.textContent = letter;
      button.setAttribute('aria-label', `${letter} cell ${index + 1}`);
      button.setAttribute('data-index', String(index));
      button.dataset.state = solvedPaths.has(index)
        ? 'solved'
        : state.selection.includes(index)
          ? 'selected'
          : 'idle';
      if (selectionMap.has(index)) {
        button.dataset.step = selectionMap.get(index);
      } else {
        button.removeAttribute('data-step');
      }
      if (state.selection[0] === index) {
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.removeAttribute('aria-pressed');
      }
      button.addEventListener('click', (event) => {
        event.preventDefault();
        chooseCell(index, { source: 'tap' });
      });
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        beginPointerTrace(index, event);
      });
      button.addEventListener('pointerenter', (event) => {
        if (!pointerState.active || event.pointerId !== pointerState.pointerId) return;
        extendPointerTrace(index);
      });
      els.board.appendChild(button);
    });
  }

  function render() {
    syncStaticUi();
    syncBadge();
    syncTextContent();
    syncStats();
    renderBoard();
  }

  function setPuzzleForMode(mode, seed) {
    const selected = puzzleForMode(mode, seed);
    state.mode = mode === 'daily' ? 'daily' : 'free';
    state.puzzle = selected.puzzle;
    state.dailyKey = selected.dailyKey || '';
    state.seed = selected.seed || DEFAULT_FREE_SEED;
    state.board = cloneBoard(selected.puzzle.board);
    state.selection = [];
    state.foundWords = [];
    state.solvedPaths = new Set();
    state.targetIndex = 0;
    state.score = 0;
    state.moves = 0;
    state.elapsedMs = 0;
    state.phase = 'ready';
    state.started = false;
    state.invalidFlash = false;
    const storedBest = Number(safeGet(storageKey(state.mode)) || 0);
    state.best = Number.isFinite(storedBest) && storedBest > 0 ? storedBest : 0;
  }

  function markSolved(word) {
    if (state.foundWords.includes(word)) return false;
    state.foundWords.push(word);
    state.solvedPaths.add(word);
    const puzzleIndex = state.puzzle.targetWords.findIndex((entry) => entry === word);
    if (puzzleIndex >= 0) {
      state.puzzle.paths[puzzleIndex].forEach((cellIndex) => state.solvedPaths.add(cellIndex));
    }
    state.score += 100 + (word.length * 15);
    state.moves += 1;
    state.targetIndex = state.foundWords.length;
    if (state.foundWords.length >= state.puzzle.targetWords.length) {
      state.phase = 'cleared';
      state.best = Math.max(state.best, state.score);
      safeSet(storageKey(state.mode), String(state.best));
    }
    return true;
  }

  function commitSelection() {
    const letters = selectionLetters(state.selection).toUpperCase();
    const target = currentTargetWord();
    const targetPath = targetPathByWord(target);
    if (!letters || !target) {
      state.selection = [];
      return;
    }

    const exactWord = state.puzzle.targetWords.find((word, index) => {
      if (state.foundWords.includes(word)) return false;
      return String(word).toUpperCase() === letters && arraysEqual(state.selection, state.puzzle.paths[index]);
    });

    if (exactWord) {
      markSolved(exactWord);
      state.selection = [];
      state.invalidFlash = false;
      if (state.phase !== 'cleared') {
        state.phase = 'playing';
      }
      state.started = true;
      syncTextContent();
      syncStats();
      renderBoard();
      return;
    }

    if (target && isPrefixMatch(letters)) {
      state.phase = 'playing';
      state.started = true;
      state.invalidFlash = false;
      render();
      return;
    }

    state.invalidFlash = true;
    state.moves += 1;
    if (targetPath && state.selection.length > 0) {
      state.selection = [state.selection[state.selection.length - 1]];
    } else {
      state.selection = [];
    }
    render();
    window.setTimeout(() => {
      state.invalidFlash = false;
      render();
    }, 220);
  }

  function arraysEqual(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((value, index) => value === right[index]);
  }

  function startGame(mode) {
    const nextMode = mode === 'daily' ? 'daily' : 'free';
    setPuzzleForMode(nextMode, nextMode === 'daily' ? todayKey() : DEFAULT_FREE_SEED);
    state.phase = 'playing';
    state.started = true;
    render();
    return render_game_to_text();
  }

  function resetGame(seed = DEFAULT_FREE_SEED, options = {}) {
    const mode = options.mode === 'daily' ? 'daily' : 'free';
    const effectiveSeed = mode === 'daily'
      ? (seed || dateSeed(todayKey()))
      : (seed || DEFAULT_FREE_SEED);
    setPuzzleForMode(mode, effectiveSeed);
    render();
    return render_game_to_text();
  }

  function reset() {
    return resetGame(DEFAULT_FREE_SEED, { mode: 'free' });
  }

  function addSelection(index, options = {}) {
    if (!canUseCell(index) || state.phase === 'cleared') return;
    if (!state.started) {
      state.phase = 'playing';
      state.started = true;
    }

    const fromTap = options.source === 'tap';
    const lastIndex = state.selection[state.selection.length - 1];

    if (!state.selection.length) {
      state.selection = [index];
    } else if (index === lastIndex) {
      if (fromTap) {
        state.selection = [index];
      }
    } else if (state.selection.includes(index)) {
      if (fromTap) {
        state.selection = [index];
      }
    } else if (isAdjacent(lastIndex, index)) {
      state.selection.push(index);
    } else if (fromTap) {
      state.selection = [index];
    } else {
      return;
    }

    state.invalidFlash = false;
    state.moves += 1;
    render();
    commitSelection();
  }

  function chooseCell(index, options = {}) {
    addSelection(index, options);
  }

  function clearSelection() {
    state.selection = [];
    state.invalidFlash = false;
    if (state.phase === 'playing' && !state.foundWords.length) {
      state.phase = 'ready';
      state.started = false;
    }
    render();
  }

  function beginPointerTrace(index, event) {
    pointerState.active = true;
    pointerState.dragging = true;
    pointerState.pointerId = event.pointerId;
    pointerState.lastIndex = index;
    chooseCell(index, { source: 'pointer' });
    if (event.currentTarget && event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (_) {}
    }
  }

  function extendPointerTrace(index) {
    if (!pointerState.active || pointerState.lastIndex === index) return;
    if (state.selection.includes(index) && index !== state.selection[0]) return;
    if (!isAdjacent(pointerState.lastIndex, index)) return;
    pointerState.lastIndex = index;
    chooseCell(index, { source: 'pointer' });
  }

  function endPointerTrace() {
    if (!pointerState.active) return;
    pointerState.active = false;
    pointerState.dragging = false;
    pointerState.pointerId = null;
    pointerState.lastIndex = null;
  }

  function buildStateText() {
    return JSON.stringify({
      mode: state.mode,
      phase: state.phase,
      score: state.score,
      best: state.best,
      moves: state.moves,
      wordsSolved: state.foundWords.length,
      targetWord: currentTargetWord(),
      foundWords: state.foundWords.slice(),
      board: cloneBoard(state.board),
      selection: state.selection.slice(),
      elapsedMs: 0,
      qaReady: true,
      dailyKey: state.dailyKey,
      seed: state.seed
    });
  }

  function render_game_to_text() {
    return buildStateText();
  }

  function advanceTime(ms) {
    state.elapsedMs += Math.max(0, Number(ms) || 0);
    if (state.phase === 'playing' && currentTargetWord()) {
      if (els.progressNote) {
        els.progressNote.textContent = `${currentModeLabel()} board · ${state.puzzle.note} · ${Math.round(state.elapsedMs / 1000)}s`;
      }
    }
    return render_game_to_text();
  }

  function wordSwipeTrace(indices) {
    if (!Array.isArray(indices)) return render_game_to_text();
    if (state.phase === 'cleared') return render_game_to_text();
    if (!state.started) {
      state.phase = 'playing';
      state.started = true;
    }
    state.selection = [];
    indices.forEach((index) => {
      if (canUseCell(index)) {
        state.selection.push(index);
      }
    });
    const exactWord = state.puzzle.targetWords.find((word, index) => {
      return !state.foundWords.includes(word)
        && String(word).toUpperCase() === selectionLetters(state.selection).toUpperCase()
        && arraysEqual(state.selection, state.puzzle.paths[index]);
    });
    if (exactWord) {
      markSolved(exactWord);
      state.selection = [];
      if (state.phase !== 'cleared') {
        state.phase = 'playing';
      }
      state.invalidFlash = false;
    } else {
      state.invalidFlash = true;
      state.moves += 1;
      state.selection = [];
      window.setTimeout(() => {
        state.invalidFlash = false;
        render();
      }, 220);
    }
    render();
    return render_game_to_text();
  }

  function onKeyDown(event) {
    if (state.phase === 'cleared' && event.key !== 'r' && event.key !== 'R') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      clearSelection();
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      reset();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(-1, 0);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(1, 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(0, -1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(0, 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (state.focusIndex !== undefined && state.focusIndex !== null) {
        chooseCell(state.focusIndex, { source: 'tap' });
      }
    }
  }

  function moveFocus(deltaCol, deltaRow) {
    const current = Number.isInteger(state.focusIndex) ? state.focusIndex : 0;
    const row = Math.floor(current / COLS);
    const col = current % COLS;
    const nextRow = Math.max(0, Math.min(ROWS - 1, row + deltaRow));
    const nextCol = Math.max(0, Math.min(COLS - 1, col + deltaCol));
    state.focusIndex = nextRow * COLS + nextCol;
    render();
  }

  function attachEvents() {
    if (els.reset) {
      els.reset.addEventListener('click', () => reset());
    }
    if (els.daily) {
      els.daily.addEventListener('click', () => resetGame(todayKey(), { mode: 'daily' }));
    }
    if (els.clear) {
      els.clear.addEventListener('click', () => clearSelection());
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerup', endPointerTrace, { passive: true });
    document.addEventListener('pointercancel', endPointerTrace, { passive: true });
    document.addEventListener('pointermove', (event) => {
      if (!pointerState.active) return;
      if (pointerState.pointerId !== null && event.pointerId !== pointerState.pointerId) return;
      const point = document.elementFromPoint(event.clientX, event.clientY);
      const cell = point && point.closest ? point.closest('.ws-cell') : null;
      if (!cell) return;
      const index = Number(cell.getAttribute('data-index'));
      if (!Number.isInteger(index)) return;
      extendPointerTrace(index);
    }, { passive: true });
  }

  function initialize() {
    if (!els.board) return;
    attachEvents();
    state.focusIndex = 0;
    render();
  }

  window.QA_READY = true;
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.reset = reset;
  window.resetGame = resetGame;
  window.wordSwipeTrace = wordSwipeTrace;
  window.__WORD_SWIPE_STATE__ = state;

  initialize();
})();
