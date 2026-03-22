(() => {
  const ROWS = 6;
  const COLS = 7;
  const DEFAULT_CPU_DELAY = 260;
  const copy = window.__CONNECT_FOUR_COPY__ || {};
  const config = window.__CONNECT_FOUR_CONFIG__ || window.__CONNECT_FOUR_META__ || {};

  function byId(...ids) {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  const boardEl = byId('connect-four-board', 'cf-board');
  if (!boardEl) return;

  const columnsEl = byId('connect-four-columns', 'cf-column-buttons');
  const statusEl = byId('connect-four-status', 'cf-status');
  const hintEl = byId('connect-four-hint', 'cf-hint');
  const currentPlayerEl = byId('connect-four-current-player', 'cf-turn-text');
  const movesEl = byId('connect-four-moves', 'cf-move-count');
  const winnerEl = byId('connect-four-winner', 'cf-result-badge');
  const focusEl = byId('connect-four-focus', 'cf-focus');
  const phaseTagEl = byId('phase-tag', 'cf-result-badge');
  const modeEl = byId('connect-four-mode', 'cf-mode-text');
  const resetBtn = byId('connect-four-reset', 'cf-reset');
  const newBtn = byId('connect-four-new', 'cf-new');
  const startBtn = byId('connect-four-start');
  const cpuToggleBtn = byId('connect-four-cpu-toggle');
  const modeLocalBtn = byId('connect-four-mode-local', 'cf-mode-local');
  const modeCpuBtn = byId('connect-four-mode-cpu', 'cf-mode-cpu');
  let modeDailyBtn = byId('connect-four-mode-daily', 'cf-mode-daily');
  const mobileFlowEl = byId('connect-four-mobile-flow');
  const modeBadgeEl = byId('cf-mode-badge');
  const turnBadgeEl = byId('cf-turn-badge');
  const resultBadgeEl = byId('cf-result-badge');
  const redScoreEl = byId('cf-red-score');
  const yellowScoreEl = byId('cf-yellow-score');
  let dailyBestEl = byId('cf-daily-best');
  const targetCountEl = byId('cf-target-count');

  const state = {
    phase: 'ready',
    currentPlayer: 1,
    moveCount: 0,
    winner: 0,
    focusColumn: 3,
    board: createBoard(),
    winningCells: [],
    lastMove: null,
    mode: 'local',
    cpuEnabled: false,
    pendingCpuMs: 0,
    clockMs: 0,
    lastAction: 'reset',
    dailyKey: '',
    dailySeed: 0,
    dailyBest: 0,
    dailyOpeningMoves: 0,
    scores: {
      1: 0,
      2: 0
    }
  };

  function createBoard() {
    return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));
  }

  function normalizeMode(mode) {
    if (mode === 'daily') return 'daily';
    if (mode === 'cpu' || mode === true) return 'cpu';
    return 'local';
  }

  function cloneBoard(board = state.board) {
    return board.map((row) => row.slice());
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
    return (hash >>> 0) || 0x5f3759df;
  }

  function getDailySeed(date = new Date()) {
    return hashString(`connect-four:${localDateKey(date)}`);
  }

  function getDailyBestKey(dailyKey) {
    return `rlt-cf-daily-best-v1-${dailyKey || localDateKey()}`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function playerName(player) {
    if (player === 1) return copy.playerOneLabel || 'Red';
    if (player === 2) return copy.playerTwoLabel || 'Yellow';
    return copy.noWinnerLabel || 'None';
  }

  function phaseLabel() {
    if (state.mode === 'daily' && state.phase === 'playing') return copy.dailyModeLabel || 'Daily challenge';
    if (state.phase === 'won') return copy.wonLabel || 'Won';
    if (state.phase === 'draw') return copy.drawLabel || 'Draw';
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    return copy.readyLabel || 'Ready';
  }

  function statusText() {
    if (state.phase === 'won') {
      if (state.mode === 'daily') {
        return `${playerName(state.winner)} ${copy.dailyWinStatus || 'wins today’s challenge.'}`;
      }
      return `${playerName(state.winner)} ${copy.winStatusSuffix || 'wins. Reset for another round.'}`;
    }
    if (state.phase === 'draw') {
      if (state.mode === 'daily') {
        return copy.dailyDrawStatus || 'Today’s challenge is full. Reset and try again tomorrow.';
      }
      return copy.drawStatus || 'The board is full. Reset for a new game.';
    }
    if (state.currentPlayer === 2 && state.cpuEnabled && state.pendingCpuMs > 0) {
      return copy.cpuThinkingStatus || 'CPU is lining up the next move.';
    }
    if (state.mode === 'daily') {
      return copy.dailyStatus || 'Today’s challenge uses the same starting board for everyone. Try to win in the fewest moves.';
    }
    if (state.phase === 'playing') {
      return `${playerName(state.currentPlayer)} ${copy.turnStatusSuffix || 'to move. Choose a column.'}`;
    }
    return copy.readyStatus || 'Choose a column to start.';
  }

  function syncHud() {
    if (statusEl) statusEl.textContent = statusText();
    if (hintEl) {
      hintEl.textContent = state.cpuEnabled
        ? (copy.cpuHint || 'Play against a light CPU, or switch back to local two-player mode.')
        : (copy.localHint || 'Pass the device back and forth or use arrow keys plus Enter.');
    }
    if (currentPlayerEl) currentPlayerEl.textContent = playerName(state.currentPlayer);
    if (movesEl) movesEl.textContent = String(state.moveCount);
    if (winnerEl) winnerEl.textContent = state.winner ? playerName(state.winner) : (state.phase === 'draw' ? (copy.drawLabel || 'Draw') : (copy.noWinnerLabel || 'None'));
    if (focusEl) focusEl.textContent = String(state.focusColumn + 1);
    if (redScoreEl) redScoreEl.textContent = String(state.scores[1]);
    if (yellowScoreEl) yellowScoreEl.textContent = String(state.scores[2]);
    if (targetCountEl) targetCountEl.textContent = String(config.connect || 4);
    if (phaseTagEl) {
      phaseTagEl.textContent = phaseLabel();
      phaseTagEl.dataset.state = state.phase === 'won' ? 'win' : (state.mode === 'daily' ? 'daily' : state.phase);
    }
    if (modeEl) {
      modeEl.textContent = state.mode === 'daily'
        ? (copy.modeDailyLabel || 'Daily challenge')
        : (state.cpuEnabled ? (copy.modeCpuLabel || 'Solo vs CPU') : (copy.modeLocalLabel || 'Local two-player'));
    }
    if (modeBadgeEl) {
      modeBadgeEl.textContent = state.mode === 'daily'
        ? (copy.modeDailyBadge || copy.modeDailyLabel || 'Daily challenge')
        : (state.cpuEnabled ? (copy.modeCpuBadge || copy.modeCpuLabel || 'vs CPU') : (copy.modeLocalBadge || copy.modeLocalLabel || 'Local two-player'));
      modeBadgeEl.dataset.state = state.mode === 'daily' ? 'daily' : (state.cpuEnabled ? 'cpu' : 'local');
    }
    if (turnBadgeEl) {
      turnBadgeEl.textContent = state.phase === 'won'
        ? `${playerName(state.winner)} ${copy.wonLabel || 'won'}`
        : state.phase === 'draw'
          ? (copy.drawLabel || 'Draw')
          : (state.mode === 'daily'
            ? (copy.dailyTurnBadge || `${playerName(state.currentPlayer)} to move`)
            : `${playerName(state.currentPlayer)} ${copy.turnBadgeSuffix || 'turn'}`);
      turnBadgeEl.dataset.state = state.mode === 'daily' ? 'daily' : (state.currentPlayer === 1 ? 'red' : 'yellow');
    }
    if (resultBadgeEl) {
      resultBadgeEl.textContent = state.phase === 'won'
        ? `${playerName(state.winner)} ${state.mode === 'daily' ? (copy.dailyWinStatus || 'wins today’s challenge.') : (copy.winStatusSuffix || 'wins. Reset for another round.')}`
        : state.phase === 'draw'
          ? (state.mode === 'daily' ? (copy.dailyDrawStatus || 'Today’s challenge is full. Reset and try again tomorrow.') : (copy.drawStatus || 'The board is full. Reset for a new game.'))
          : (state.mode === 'daily'
            ? (copy.dailyReadyStatus || 'Today’s challenge uses the same starting board for everyone.')
            : (copy.firstPlayNote || copy.readyStatus || 'Choose a column to start.'));
      resultBadgeEl.dataset.state = state.phase === 'won' ? 'win' : (state.mode === 'daily' ? 'daily' : state.phase);
    }
    if (mobileFlowEl) {
      mobileFlowEl.textContent = state.cpuEnabled
        ? (copy.mobileFlowCpu || 'Drop your disc, then wait for the CPU response.')
        : (copy.mobileFlowLocal || 'Players alternate on the same device.');
    }
    if (dailyBestEl) {
      dailyBestEl.textContent = String(state.dailyBest || 0);
    }
    if (cpuToggleBtn) {
      cpuToggleBtn.dataset.active = state.cpuEnabled ? 'true' : 'false';
      cpuToggleBtn.setAttribute('aria-pressed', state.cpuEnabled ? 'true' : 'false');
      cpuToggleBtn.textContent = state.cpuEnabled
        ? (copy.cpuOnButton || 'CPU on')
        : (copy.cpuOffButton || 'CPU off');
    }
    if (modeLocalBtn) {
      modeLocalBtn.dataset.active = state.cpuEnabled ? 'false' : 'true';
      modeLocalBtn.setAttribute('aria-pressed', state.cpuEnabled ? 'false' : 'true');
    }
    if (modeCpuBtn) {
      modeCpuBtn.dataset.active = state.cpuEnabled ? 'true' : 'false';
      modeCpuBtn.setAttribute('aria-pressed', state.cpuEnabled ? 'true' : 'false');
    }
    if (modeDailyBtn) {
      modeDailyBtn.dataset.active = state.mode === 'daily' ? 'true' : 'false';
      modeDailyBtn.setAttribute('aria-pressed', state.mode === 'daily' ? 'true' : 'false');
    }
    if (startBtn) {
      startBtn.textContent = state.phase === 'ready'
        ? (copy.startButton || 'Start')
        : (copy.restartButton || 'Restart');
    }
  }

  function ensureDailyUi() {
    if (!modeDailyBtn) {
      const modeRow = document.querySelector('.cf-mode-row');
      if (modeRow) {
        const button = document.createElement('button');
        button.id = 'cf-mode-daily';
        button.className = 'cf-mode-pill';
        button.type = 'button';
        button.dataset.cfMode = 'daily';
        button.dataset.active = 'false';
        button.textContent = copy.modeDailyLabel || 'Daily challenge';
        modeRow.appendChild(button);
        modeDailyBtn = button;
      }
    }
    if (!dailyBestEl) {
      const statGrid = document.querySelector('.cf-stat-grid');
      if (statGrid) {
        const stat = document.createElement('div');
        stat.className = 'cf-stat';
        stat.innerHTML = `<span>${copy.dailyBestLabel || 'Daily best'}</span><strong id="cf-daily-best">0</strong>`;
        statGrid.appendChild(stat);
        dailyBestEl = stat.querySelector('#cf-daily-best');
      }
    }
  }

  ensureDailyUi();

  function availableRow(column, board = state.board) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (board[row][column] === 0) return row;
    }
    return -1;
  }

  function boardFull(board = state.board) {
    return board[0].every((cell) => cell !== 0);
  }

  function countDirection(board, row, col, dr, dc, player) {
    let total = 0;
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      total += 1;
      r += dr;
      c += dc;
    }
    return total;
  }

  function winningCellsFor(board, row, col, player) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];
    for (const [dr, dc] of directions) {
      const cells = [[row, col]];
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
        r += dr;
        c += dc;
      }
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.unshift([r, c]);
        r -= dr;
        c -= dc;
      }
      if (cells.length >= 4) {
        return cells;
      }
    }
    return [];
  }

  function simulateDrop(board, column, player) {
    const row = availableRow(column, board);
    if (row === -1) return null;
    const clone = cloneBoard(board);
    clone[row][column] = player;
    return { row, column, board: clone };
  }

  function scoreColumn(column) {
    if (availableRow(column) === -1) return -Infinity;
    const centerBias = 3 - Math.abs(3 - column);
    let score = centerBias * 4;
    const row = availableRow(column);
    if (row > 0) {
      if (state.board[row - 1][column] === 2) score += 2;
      if (state.board[row - 1][column] === 1) score += 1;
    }
    const adjacent = [column - 1, column + 1].filter((col) => col >= 0 && col < COLS);
    adjacent.forEach((col) => {
      const adjRow = availableRow(col);
      if (adjRow !== -1 && state.board[adjRow][col] === 2) score += 3;
    });
    return score;
  }

  function chooseCpuColumn() {
    const order = [3, 2, 4, 1, 5, 0, 6];
    for (const column of order) {
      const sim = simulateDrop(state.board, column, 2);
      if (sim && winningCellsFor(sim.board, sim.row, column, 2).length) return column;
    }
    for (const column of order) {
      const sim = simulateDrop(state.board, column, 1);
      if (sim && winningCellsFor(sim.board, sim.row, column, 1).length) return column;
    }
    let bestColumn = -1;
    let bestScore = -Infinity;
    for (const column of order) {
      const score = scoreColumn(column);
      if (score > bestScore) {
        bestScore = score;
        bestColumn = column;
      }
    }
    return bestColumn === -1 ? order.find((column) => availableRow(column) !== -1) ?? 0 : bestColumn;
  }

  function renderColumns() {
    if (!columnsEl) return;
    columnsEl.innerHTML = '';
    for (let column = 0; column < COLS; column += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `connect-four-col-${column}`;
      button.setAttribute('data-qa-alias', `cf-column-${column + 1}`);
      button.className = 'cf-column-btn';
      button.dataset.column = String(column);
      button.dataset.selected = state.focusColumn === column ? 'true' : 'false';
      button.disabled = availableRow(column) === -1 || (state.cpuEnabled && state.currentPlayer === 2 && state.phase === 'playing');
      button.setAttribute('aria-label', `${copy.dropColumnLabel || 'Drop in column'} ${column + 1}`);
      button.innerHTML = `${column + 1}<small>${availableRow(column) === -1 ? (copy.columnFullLabel || 'Full') : (copy.dropHereLabel || 'Drop')}</small>`;
      button.addEventListener('click', () => {
        state.focusColumn = column;
        dropInColumn(column, 'human');
      });
      columnsEl.appendChild(button);
    }
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const button = document.createElement('button');
        const piece = state.board[row][column];
        button.type = 'button';
        button.id = `connect-four-cell-${row}-${column}`;
        button.className = 'cf-cell';
        button.dataset.piece = String(piece);
        button.dataset.selected = state.focusColumn === column ? 'true' : 'false';
        if (state.lastMove && state.lastMove.row === row && state.lastMove.column === column) {
          button.dataset.lastmove = 'true';
        }
        if (state.winningCells.some(([r, c]) => r === row && c === column)) {
          button.dataset.winning = 'true';
        }
        button.setAttribute('role', 'gridcell');
        button.setAttribute('aria-label', piece === 1
          ? `${copy.playerOneLabel || 'Red'} ${copy.discLabel || 'disc'}`
          : piece === 2
            ? `${copy.playerTwoLabel || 'Yellow'} ${copy.discLabel || 'disc'}`
            : `${copy.emptyCellLabel || 'Empty slot'}, ${copy.columnLabel || 'column'} ${column + 1}`);
        button.addEventListener('click', () => {
          state.focusColumn = column;
          dropInColumn(column, 'human');
        });
        boardEl.appendChild(button);
      }
    }
  }

  function render() {
    renderColumns();
    renderBoard();
    syncHud();
  }

  function scheduleCpuIfNeeded() {
    if (state.cpuEnabled && state.phase === 'playing' && state.currentPlayer === 2) {
      state.pendingCpuMs = DEFAULT_CPU_DELAY;
    } else {
      state.pendingCpuMs = 0;
    }
  }

  function finalizeMove(row, column, player) {
    const winning = winningCellsFor(state.board, row, column, player);
    state.lastMove = { row, column };
    if (winning.length) {
      state.phase = 'won';
      state.winner = player;
      state.winningCells = winning;
      state.pendingCpuMs = 0;
      state.scores[player] += 1;
      if (state.mode === 'daily') {
        const dailyBest = state.dailyBest > 0 ? state.dailyBest : Number(window.localStorage?.getItem(getDailyBestKey(state.dailyKey)) || '0') || 0;
        if (!dailyBest || state.moveCount < dailyBest) {
          state.dailyBest = state.moveCount;
          if (window.localStorage && state.dailyKey) {
            window.localStorage.setItem(getDailyBestKey(state.dailyKey), String(state.dailyBest));
          }
        }
      }
      return;
    }
    if (boardFull()) {
      state.phase = 'draw';
      state.winner = 0;
      state.winningCells = [];
      state.pendingCpuMs = 0;
      return;
    }
    state.phase = 'playing';
    state.winner = 0;
    state.winningCells = [];
    state.currentPlayer = player === 1 ? 2 : 1;
    scheduleCpuIfNeeded();
  }

  function dropInColumn(column, source = 'human') {
    if (state.phase === 'won' || state.phase === 'draw') return false;
    if (state.cpuEnabled && state.currentPlayer === 2 && source !== 'cpu') return false;
    const row = availableRow(column);
    if (row === -1) {
      state.lastAction = 'column-full';
      render();
      return false;
    }
    if (state.phase === 'ready') {
      state.phase = 'playing';
    }
    state.board[row][column] = state.currentPlayer;
    state.moveCount += 1;
    state.focusColumn = column;
    state.lastAction = source === 'cpu' ? 'cpu-drop' : 'drop';
    finalizeMove(row, column, state.currentPlayer);
    render();
    return true;
  }

  function resetGame(options = {}) {
    state.phase = 'ready';
    state.currentPlayer = 1;
    state.moveCount = 0;
    state.winner = 0;
    state.focusColumn = 3;
    state.board = createBoard();
    state.winningCells = [];
    state.lastMove = null;
    state.pendingCpuMs = 0;
    state.clockMs = 0;
    state.lastAction = 'reset';
    state.dailyOpeningMoves = 0;
    const mode = normalizeMode(options.mode || state.mode || 'local');
    state.mode = mode;
    state.cpuEnabled = mode !== 'local';
    if (mode === 'daily') {
      state.dailyKey = localDateKey();
      state.dailySeed = getDailySeed();
      state.dailyBest = Number(window.localStorage?.getItem(getDailyBestKey(state.dailyKey)) || '0') || 0;
      const opening = buildDailyOpening(state.dailySeed);
      if (opening) {
        state.board = opening.board;
        state.currentPlayer = opening.currentPlayer;
        state.moveCount = opening.moveCount;
        state.lastMove = opening.lastMove;
        state.phase = 'playing';
        state.dailyOpeningMoves = opening.moveCount;
      }
    } else {
      state.dailyKey = localDateKey();
      state.dailySeed = 0;
      state.dailyBest = Number(window.localStorage?.getItem(getDailyBestKey(state.dailyKey)) || '0') || 0;
    }
    render();
    return render_game_to_text();
  }

  function buildDailyOpening(seed) {
    const openingOrders = [
      [3, 2, 4, 3, 1, 5],
      [3, 4, 2, 3, 5, 1],
      [2, 3, 4, 2, 5, 1],
      [4, 3, 2, 4, 1, 5],
      [3, 1, 4, 2, 5, 3],
      [3, 5, 2, 4, 1, 3]
    ];
    const startIndex = Math.floor(createRng(seed ^ 0x9e3779b9)() * openingOrders.length);
    for (let offset = 0; offset < openingOrders.length; offset += 1) {
      const sequence = openingOrders[(startIndex + offset) % openingOrders.length];
      const board = createBoard();
      let currentPlayer = 1;
      let moveCount = 0;
      let lastMove = null;
      let failed = false;
      for (const column of sequence) {
        const row = availableRow(column, board);
        if (row === -1) {
          failed = true;
          break;
        }
        board[row][column] = currentPlayer;
        lastMove = { row, column };
        moveCount += 1;
        if (winningCellsFor(board, row, column, currentPlayer).length || boardFull(board)) {
          failed = true;
          break;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      }
      if (!failed && moveCount >= 4) {
        return { board, currentPlayer, moveCount, lastMove };
      }
    }
    return null;
  }

  function setMode(mode) {
    const normalized = normalizeMode(mode);
    state.mode = normalized;
    return resetGame({ mode: normalized });
  }

  function advanceTime(ms) {
    const delta = Math.max(0, Number(ms || 0));
    state.clockMs += delta;
    if (state.cpuEnabled && state.currentPlayer === 2 && state.pendingCpuMs > 0 && state.phase === 'playing') {
      state.pendingCpuMs = Math.max(0, state.pendingCpuMs - delta);
      if (state.pendingCpuMs === 0) {
        const cpuColumn = chooseCpuColumn();
        dropInColumn(cpuColumn, 'cpu');
        return render_game_to_text();
      }
    }
    render();
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({
      phase: state.phase,
      currentPlayer: state.currentPlayer,
      moveCount: state.moveCount,
      winner: state.winner,
      focusColumn: state.focusColumn,
      board: cloneBoard(),
      cpuEnabled: state.cpuEnabled,
      pendingCpuMs: state.pendingCpuMs,
      lastMove: state.lastMove,
      winningCells: state.winningCells,
      clockMs: state.clockMs,
      lastAction: state.lastAction,
      mode: state.mode,
      dailyKey: state.dailyKey,
      dailySeed: state.dailySeed,
      dailyBest: state.dailyBest,
      dailyOpeningMoves: state.dailyOpeningMoves,
      scores: { ...state.scores },
      qaReady: true
    });
  }

  function moveFocus(delta) {
    state.focusColumn = clamp(state.focusColumn + delta, 0, COLS - 1);
    render();
  }

  function handleKeydown(event) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dropInColumn(state.focusColumn, 'human');
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      resetGame();
    } else if (event.key === 'c' || event.key === 'C') {
      event.preventDefault();
      setMode(state.mode === 'cpu' ? 'local' : 'cpu');
    } else if (event.key === 'd' || event.key === 'D') {
      event.preventDefault();
      setMode('daily');
    }
  }

  if (resetBtn) resetBtn.addEventListener('click', () => resetGame());
  if (newBtn) newBtn.addEventListener('click', () => resetGame());
  if (startBtn) startBtn.addEventListener('click', () => resetGame());
  if (cpuToggleBtn) cpuToggleBtn.addEventListener('click', () => setMode(state.mode === 'cpu' ? 'local' : 'cpu'));
  if (modeLocalBtn) modeLocalBtn.addEventListener('click', () => setMode('local'));
  if (modeCpuBtn) modeCpuBtn.addEventListener('click', () => setMode('cpu'));
  if (modeDailyBtn) modeDailyBtn.addEventListener('click', () => setMode('daily'));
  document.addEventListener('keydown', handleKeydown);

  window.connectFourDrop = (column) => dropInColumn(Number(column), 'human');
  window.connectFourSetMode = (mode) => setMode(mode);
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.resetGame = resetGame;
  window.reset = () => resetGame();
  window.QA_READY = true;
  window.__WEBGAME_QA_READY__ = true;

  resetGame({ mode: normalizeMode(config.defaultMode || (config.cpuEnabled ? 'cpu' : 'local')) });
})();
