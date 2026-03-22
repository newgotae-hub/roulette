(() => {
  const GRID_SIZE = 7;
  const MINES_TOTAL = 8;
  const DEFAULT_SEED = 0x6d696e65;
  const STORAGE_BEST = 'rlt-minesweeper-best-v1';
  const STORAGE_DAILY_PREFIX = 'rlt-minesweeper-daily-best-v1-';
  const copy = window.__MINESWEEPER_COPY__ || {};

  const boardEl = document.getElementById('ms-board');
  const calloutTitleEl = document.getElementById('ms-callout-title');
  const calloutEl = document.getElementById('ms-callout');
  const modeBadgeEl = document.getElementById('ms-mode-badge');
  const statusEl = document.getElementById('ms-status');
  const hintEl = document.getElementById('ms-hint');
  const revealToolBtn = document.getElementById('ms-reveal-mode');
  const flagToolBtn = document.getElementById('ms-flag-mode');
  const heroPlayBtn = document.getElementById('ms-hero-play');
  const heroDailyBtn = document.getElementById('ms-hero-daily');
  const newBtn = document.getElementById('ms-new');
  const dailyBtn = document.getElementById('ms-daily');
  const resetBtn = document.getElementById('ms-reset');
  const bestEl = document.getElementById('ms-best');
  const dailyBestEl = document.getElementById('ms-daily-best');
  const flagsEl = document.getElementById('ms-flags');
  const safeEl = document.getElementById('ms-safe');
  const elapsedEl = document.getElementById('ms-elapsed');
  const minesEl = document.getElementById('ms-mines');
  const boardSizeEl = document.getElementById('ms-board-size');
  const boardCells = [];

  if (!boardEl) {
    return;
  }

  const state = {
    mode: 'free',
    tool: 'reveal',
    phase: 'ready',
    seed: DEFAULT_SEED,
    dailyKey: '',
    board: createBoard(),
    generated: false,
    cursor: { x: 3, y: 3 },
    revealedCount: 0,
    flagsPlaced: 0,
    elapsedBaseMs: 0,
    clockStartedAt: 0,
    qaElapsedMs: 0,
    rafId: 0,
    bestTimeMs: readStoredNumber(STORAGE_BEST),
    dailyBestTimeMs: 0,
    lastAction: 'reset',
    lastResult: 'ready',
    firstClickSafe: true,
    mineTotal: MINES_TOTAL
  };

  function safeGet(key) {
    try {
      return window.localStorage?.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage?.setItem(key, value);
    } catch (error) {
      // ignore storage failures in webviews/private mode
    }
  }

  function readStoredNumber(key) {
    const raw = safeGet(key);
    const value = Number.parseInt(raw || '0', 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function localDateKey(date = new Date()) {
    return [
      String(date.getUTCFullYear()),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0')
    ].join('-');
  }

  function hashString(input) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0) || DEFAULT_SEED;
  }

  function normalizeSeed(seed) {
    if (Number.isFinite(seed)) {
      return (seed >>> 0) || DEFAULT_SEED;
    }
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

  function createBoard() {
    return Array.from({ length: GRID_SIZE }, () => (
      Array.from({ length: GRID_SIZE }, () => ({
        mine: false,
        adjacent: 0,
        revealed: false,
        flagged: false,
        exploded: false
      }))
    ));
  }

  function indexOf(x, y) {
    return y * GRID_SIZE + x;
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE;
  }

  function getCell(x, y) {
    if (!inBounds(x, y)) return null;
    return state.board[y][x];
  }

  function neighbors(x, y) {
    const results = [];
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny)) results.push({ x: nx, y: ny });
      }
    }
    return results;
  }

  function getDailySeed() {
    return hashString(`minesweeper:${state.dailyKey || localDateKey()}`);
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function currentElapsedMs() {
    if (state.phase === 'playing' && state.clockStartedAt > 0) {
      return Math.max(0, state.elapsedBaseMs + (performance.now() - state.clockStartedAt) + state.qaElapsedMs);
    }
    return Math.max(0, state.elapsedBaseMs);
  }

  function startClock() {
    if (state.clockStartedAt <= 0) {
      state.clockStartedAt = performance.now();
      state.qaElapsedMs = 0;
      scheduleTick();
    }
  }

  function freezeClock() {
    state.elapsedBaseMs = currentElapsedMs();
    state.clockStartedAt = 0;
    state.qaElapsedMs = 0;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function scheduleTick() {
    if (state.rafId || state.phase !== 'playing') return;
    const tick = () => {
      state.rafId = 0;
      if (state.phase === 'playing') {
        renderHud();
        scheduleTick();
      }
    };
    state.rafId = window.requestAnimationFrame(tick);
  }

  function setStatus(text, title, tagText) {
    if (statusEl) statusEl.textContent = text;
    if (calloutTitleEl) calloutTitleEl.textContent = title || phaseLabel();
    if (calloutEl) calloutEl.textContent = text;
    if (modeBadgeEl) modeBadgeEl.textContent = tagText || `${modeLabel()} 쨌 ${toolLabel()}`;
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'won') return copy.wonLabel || 'Cleared';
    if (state.phase === 'lost') return copy.lostLabel || 'Exploded';
    return copy.readyLabel || 'Ready';
  }

  function toolLabel() {
    return state.tool === 'flag'
      ? (copy.flagToolLabel || 'Flag')
      : (copy.revealToolLabel || 'Reveal');
  }

  function modeLabel() {
    return state.mode === 'daily'
      ? (copy.dailyModeLabel || 'Daily challenge')
      : (copy.freeModeLabel || 'Free play');
  }

  function statusText() {
    if (state.phase === 'won') {
      return copy.wonStatus || 'Board cleared. Try a faster run.';
    }
    if (state.phase === 'lost') {
      return copy.lostStatus || 'A mine exploded. Reset and try a cleaner path.';
    }
    if (state.phase === 'playing') {
      if (state.tool === 'flag') {
        return copy.flaggingStatus || 'Flag a suspect square, then switch back to Reveal.';
      }
      return copy.playingStatus || 'First click is safe. Reveal carefully and use Flag for guesses.';
    }
    if (state.mode === 'daily') {
      return copy.dailyReadyStatus || 'Today is a shared challenge. Everyone gets the same seed.';
    }
    return copy.readyStatus || 'Pick Reveal or Flag, then click a square to begin.';
  }

  function updateStats() {
    const elapsed = currentElapsedMs();
    const safeCells = GRID_SIZE * GRID_SIZE - MINES_TOTAL;
    const safeRemaining = Math.max(0, safeCells - state.revealedCount);
    state.flagsPlaced = countFlags();
    state.safeRemaining = safeRemaining;

    if (bestEl) bestEl.textContent = state.bestTimeMs ? formatDuration(state.bestTimeMs) : '--';
    if (dailyBestEl) dailyBestEl.textContent = state.dailyBestTimeMs ? formatDuration(state.dailyBestTimeMs) : '--';
    if (flagsEl) flagsEl.textContent = String(state.flagsPlaced);
    if (safeEl) safeEl.textContent = String(state.safeRemaining);
    if (elapsedEl) elapsedEl.textContent = formatDuration(elapsed);
    if (minesEl) minesEl.textContent = String(MINES_TOTAL);
    if (boardSizeEl) boardSizeEl.textContent = `${GRID_SIZE}x${GRID_SIZE}`;
  }

  function renderHud() {
    if (revealToolBtn) {
      revealToolBtn.dataset.active = state.tool === 'reveal' ? 'true' : 'false';
      revealToolBtn.setAttribute('aria-pressed', state.tool === 'reveal' ? 'true' : 'false');
    }
    if (flagToolBtn) {
      flagToolBtn.dataset.active = state.tool === 'flag' ? 'true' : 'false';
      flagToolBtn.setAttribute('aria-pressed', state.tool === 'flag' ? 'true' : 'false');
    }
    if (newBtn) newBtn.textContent = copy.newBoardLabel || 'New board';
    if (dailyBtn) {
      dailyBtn.textContent = copy.dailyBoardLabel || 'Daily challenge';
      dailyBtn.dataset.active = state.mode === 'daily' ? 'true' : 'false';
      dailyBtn.setAttribute('aria-pressed', state.mode === 'daily' ? 'true' : 'false');
    }
    if (resetBtn) resetBtn.textContent = copy.resetLabel || 'Reset';
    setStatus(statusText(), phaseLabel(), `${modeLabel()} 쨌 ${toolLabel()}`);
    updateStats();
  }

  function syncCell(cellEl, cell, x, y) {
    let visibleState = 'hidden';
    let visibleText = '';

    if (state.phase === 'lost' && cell.exploded) {
      visibleState = 'exploded';
      visibleText = copy.explodedCellLabel || 'Exploded mine';
    } else if ((state.phase === 'won' || state.phase === 'lost') && cell.mine) {
      visibleState = 'mine';
      visibleText = copy.mineCellLabel || 'Mine';
    } else if (!cell.revealed && cell.flagged) {
      visibleState = 'flagged';
      visibleText = copy.flaggedCellLabel || 'Flagged cell';
    } else if (cell.revealed) {
      visibleState = 'revealed';
      visibleText = cell.adjacent > 0 ? String(cell.adjacent) : '';
    }

    cellEl.dataset.state = visibleState;
    if (cell.adjacent) {
      cellEl.dataset.adjacent = String(cell.adjacent);
    } else {
      delete cellEl.dataset.adjacent;
    }
    cellEl.textContent = visibleText;
    cellEl.setAttribute('aria-label', describeCell(cell, x, y, visibleState));
    cellEl.setAttribute('aria-pressed', state.cursor.x === x && state.cursor.y === y ? 'true' : 'false');
    cellEl.tabIndex = state.cursor.x === x && state.cursor.y === y ? 0 : -1;
  }

  function describeCell(cell, x, y, visibleState) {
    const label = `${copy.rowLabel || 'Row'} ${y + 1}, ${copy.columnLabel || 'Column'} ${x + 1}`;
    if (visibleState === 'flagged') return `${copy.flaggedCellLabel || 'Flagged cell'} 쨌 ${label}`;
    if (visibleState === 'mine') return `${copy.mineCellLabel || 'Mine'} 쨌 ${label}`;
    if (visibleState === 'exploded') return `${copy.explodedCellLabel || 'Exploded mine'} 쨌 ${label}`;
    if (cell.revealed && cell.adjacent > 0) {
      return `${copy.numberCellLabel || 'Revealed cell'} ${cell.adjacent} 쨌 ${label}`;
    }
    if (cell.revealed) {
      return `${copy.emptyCellLabel || 'Empty cell'} 쨌 ${label}`;
    }
    return `${copy.hiddenCellLabel || 'Hidden cell'} 쨌 ${label}`;
  }

  function buildBoard() {
    if (boardCells.length) return;
    const fragment = document.createDocumentFragment();
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ms-cell';
        button.id = `ms-cell-${indexOf(x, y)}`;
        button.dataset.x = String(x);
        button.dataset.y = String(y);
        button.dataset.index = String(indexOf(x, y));
        button.setAttribute('role', 'gridcell');
        button.addEventListener('click', () => handleCellAction(x, y));
        button.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          handleCellAction(x, y, 'flag');
        });
        fragment.appendChild(button);
        boardCells.push(button);
      }
    }
    boardEl.appendChild(fragment);
  }

  function renderBoard() {
    buildBoard();
    boardCells.forEach((button) => {
      const x = Number(button.dataset.x || '0');
      const y = Number(button.dataset.y || '0');
      syncCell(button, getCell(x, y), x, y);
    });
  }

  function render() {
    renderHud();
    renderBoard();
  }

  function moveCursor(dx, dy) {
    state.cursor.x = Math.max(0, Math.min(GRID_SIZE - 1, state.cursor.x + dx));
    state.cursor.y = Math.max(0, Math.min(GRID_SIZE - 1, state.cursor.y + dy));
    renderBoard();
    focusSelectedCell();
  }

  function focusSelectedCell() {
    const selected = document.getElementById(`ms-cell-${indexOf(state.cursor.x, state.cursor.y)}`);
    if (selected && typeof selected.focus === 'function') {
      selected.focus({ preventScroll: true });
    }
  }

  function generateBoard(firstX, firstY) {
    state.board = createBoard();
    const rng = createRng(state.seed);
    const protectedIndex = indexOf(firstX, firstY);
    const candidates = [];

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const currentIndex = indexOf(x, y);
        if (currentIndex !== protectedIndex) {
          candidates.push({ x, y, index: currentIndex });
        }
      }
    }

    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      const temp = candidates[index];
      candidates[index] = candidates[swapIndex];
      candidates[swapIndex] = temp;
    }

    candidates.slice(0, MINES_TOTAL).forEach((spot) => {
      state.board[spot.y][spot.x].mine = true;
    });

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const cell = state.board[y][x];
        if (cell.mine) continue;
        cell.adjacent = neighbors(x, y).reduce((count, point) => (
          count + (state.board[point.y][point.x].mine ? 1 : 0)
        ), 0);
      }
    }

    state.generated = true;
  }

  function revealConnectedCells(startX, startY) {
    const queue = [{ x: startX, y: startY }];
    const seen = new Set();

    while (queue.length) {
      const { x, y } = queue.shift();
      const key = `${x}:${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cell = getCell(x, y);
      if (!cell || cell.revealed || cell.flagged || cell.mine) continue;

      cell.revealed = true;
      state.revealedCount += 1;

      if (cell.adjacent === 0) {
        neighbors(x, y).forEach((point) => {
          const neighbor = getCell(point.x, point.y);
          if (neighbor && !neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
            queue.push(point);
          }
        });
      }
    }
  }

  function revealAllCells() {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const cell = getCell(x, y);
        if (cell) cell.revealed = true;
      }
    }
  }

  function endGame(result, explosion) {
    freezeClock();
    state.phase = result;
    state.lastResult = result;

    if (explosion) {
      const { x, y } = explosion;
      const cell = getCell(x, y);
      if (cell) {
        cell.exploded = true;
      }
    }

    revealAllCells();
    state.revealedCount = GRID_SIZE * GRID_SIZE - MINES_TOTAL;

    if (result === 'won') {
      const elapsed = currentElapsedMs();
      if (elapsed > 0 && (state.bestTimeMs === 0 || elapsed < state.bestTimeMs)) {
        state.bestTimeMs = Math.floor(elapsed);
        safeSet(STORAGE_BEST, String(state.bestTimeMs));
      }
      if (state.mode === 'daily') {
        const dailyElapsed = Math.floor(elapsed);
        if (dailyElapsed > 0 && (state.dailyBestTimeMs === 0 || dailyElapsed < state.dailyBestTimeMs)) {
          state.dailyBestTimeMs = dailyElapsed;
          safeSet(`${STORAGE_DAILY_PREFIX}${state.dailyKey}`, String(state.dailyBestTimeMs));
        }
      }
    }
  }

  function checkWin() {
    const safeCells = GRID_SIZE * GRID_SIZE - MINES_TOTAL;
    if (state.revealedCount >= safeCells) {
      endGame('won');
      return true;
    }
    return false;
  }

  function handleCellAction(x, y, forcedTool) {
    if (state.phase === 'won' || state.phase === 'lost') return;
    state.cursor.x = x;
    state.cursor.y = y;

    const tool = forcedTool || state.tool;
    const cell = getCell(x, y);
    if (!cell) return;

    if (tool === 'flag') {
      if (cell.revealed) {
        setStatus(copy.flagOnRevealedStatus || 'This square is already open.', phaseLabel(), `${modeLabel()} 쨌 ${toolLabel()}`);
        return;
      }
      cell.flagged = !cell.flagged;
      state.lastAction = cell.flagged ? 'flag' : 'unflag';
      renderBoard();
      renderHud();
      return;
    }

    if (cell.flagged || cell.revealed) {
      setStatus(copy.revealBlockedStatus || 'Unflag the square first if you want to reveal it.', phaseLabel(), `${modeLabel()} 쨌 ${toolLabel()}`);
      return;
    }

    if (!state.generated) {
      generateBoard(x, y);
    }

    if (state.phase === 'ready') {
      state.phase = 'playing';
      state.lastResult = 'started';
      startClock();
    }

    if (cell.mine) {
      cell.exploded = true;
      state.lastAction = 'mine';
      endGame('lost', { x, y });
      render();
      return;
    }

    revealConnectedCells(x, y);
    state.lastAction = 'reveal';
    if (!checkWin()) {
      render();
    } else {
      render();
    }
  }

  function toggleTool(tool) {
    state.tool = tool === 'flag' ? 'flag' : 'reveal';
    renderHud();
    focusSelectedCell();
  }

  function startDailyChallenge() {
    resetGame(undefined, { mode: 'daily' });
    scrollPlayArea();
  }

  function startFreeBoard() {
    const nextSeed = ((state.seed + 1) >>> 0);
    resetGame(nextSeed, { mode: 'free' });
    scrollPlayArea();
  }

  function scrollPlayArea() {
    const playArea = document.getElementById('play-area');
    if (playArea && typeof playArea.scrollIntoView === 'function') {
      playArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function resetGame(seed = DEFAULT_SEED, options = {}) {
    const mode = options.mode === 'daily' ? 'daily' : 'free';
    const hasSeed = Number.isFinite(seed) || typeof seed === 'string';
    state.mode = mode;
    state.dailyKey = localDateKey();
    state.seed = mode === 'daily' && !hasSeed ? getDailySeed() : normalizeSeed(hasSeed ? seed : DEFAULT_SEED);
    state.dailyBestTimeMs = readStoredNumber(`${STORAGE_DAILY_PREFIX}${state.dailyKey}`);
    state.tool = 'reveal';
    state.phase = 'ready';
    state.board = createBoard();
    state.generated = false;
    state.cursor = { x: 3, y: 3 };
    state.revealedCount = 0;
    state.flagsPlaced = 0;
    state.elapsedBaseMs = 0;
    state.clockStartedAt = 0;
    state.qaElapsedMs = 0;
    state.lastAction = 'reset';
    state.lastResult = 'ready';
    state.firstClickSafe = true;
    state.mineTotal = MINES_TOTAL;
    render();
    focusSelectedCell();
    return render_game_to_text();
  }

  function advanceTime(ms) {
    const amount = Math.max(0, Number(ms || 0));
    if (state.phase === 'playing' && state.clockStartedAt > 0) {
      state.qaElapsedMs += amount;
      renderHud();
    }
    return render_game_to_text();
  }

  function boardMatrix() {
    const rows = [];
    for (let y = 0; y < GRID_SIZE; y += 1) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const cell = getCell(x, y);
        if (!cell) {
          row.push('H');
          continue;
        }
        if (state.phase === 'lost' && cell.exploded) {
          row.push('X');
          continue;
        }
        if ((state.phase === 'won' || state.phase === 'lost') && cell.mine) {
          row.push('M');
          continue;
        }
        if (!cell.revealed && cell.flagged) {
          row.push('F');
          continue;
        }
        if (cell.revealed) {
          row.push(cell.adjacent > 0 ? String(cell.adjacent) : '.');
          continue;
        }
        row.push('H');
      }
      rows.push(row);
    }
    return rows;
  }

  function render_game_to_text() {
    const elapsed = Math.floor(currentElapsedMs());
    return JSON.stringify({
      mode: state.mode,
      phase: state.phase,
      tool: state.tool,
      seed: state.seed,
      dailyKey: state.dailyKey,
      firstClickSafe: state.firstClickSafe,
      minesTotal: MINES_TOTAL,
      flagsPlaced: countFlags(),
      revealedCount: state.revealedCount,
      safeRemaining: Math.max(0, GRID_SIZE * GRID_SIZE - MINES_TOTAL - state.revealedCount),
      elapsedMs: elapsed,
      bestTimeMs: state.bestTimeMs,
      dailyBestTimeMs: state.dailyBestTimeMs,
      cursor: { x: state.cursor.x, y: state.cursor.y },
      board: boardMatrix(),
      lastAction: state.lastAction,
      qaReady: true
    });
  }

  function countFlags() {
    let count = 0;
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const cell = getCell(x, y);
        if (cell && cell.flagged) count += 1;
      }
    }
    return count;
  }

  function handleKeydown(event) {
    const key = event.key;
    const ignoreTarget = event.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
    if (ignoreTarget) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'f', 'F', 'r', 'R', 'n', 'N', 'd', 'D', '1', '2'].includes(key)) {
      event.preventDefault();
    }

    if (key === 'ArrowUp') {
      moveCursor(0, -1);
      return;
    }
    if (key === 'ArrowDown') {
      moveCursor(0, 1);
      return;
    }
    if (key === 'ArrowLeft') {
      moveCursor(-1, 0);
      return;
    }
    if (key === 'ArrowRight') {
      moveCursor(1, 0);
      return;
    }
    if (key === 'f' || key === 'F' || key === '2') {
      toggleTool('flag');
      return;
    }
    if (key === '1') {
      toggleTool('reveal');
      return;
    }
    if (key === 'r' || key === 'R') {
      reset();
      return;
    }
    if (key === 'n' || key === 'N') {
      startFreeBoard();
      return;
    }
    if (key === 'd' || key === 'D') {
      startDailyChallenge();
      return;
    }
    if (key === 'Enter' || key === ' ') {
      handleCellAction(state.cursor.x, state.cursor.y);
    }
  }

  function initButtons() {
    if (revealToolBtn) {
      revealToolBtn.addEventListener('click', () => toggleTool('reveal'));
    }
    if (flagToolBtn) {
      flagToolBtn.addEventListener('click', () => toggleTool('flag'));
    }
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', () => {
        scrollPlayArea();
        focusSelectedCell();
      });
    }
    if (heroDailyBtn) {
      heroDailyBtn.addEventListener('click', () => {
        startDailyChallenge();
      });
    }
    if (newBtn) {
      newBtn.addEventListener('click', () => startFreeBoard());
    }
    if (dailyBtn) {
      dailyBtn.addEventListener('click', () => startDailyChallenge());
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => reset());
    }
  }

  function init() {
    boardEl.setAttribute('role', 'grid');
    boardEl.setAttribute('aria-label', copy.ariaBoard || 'Minesweeper board');
    if (hintEl && copy.hint) {
      hintEl.textContent = copy.hint;
    }
    if (minesEl) minesEl.textContent = String(MINES_TOTAL);
    if (boardSizeEl) boardSizeEl.textContent = `${GRID_SIZE}횞${GRID_SIZE}`;
    initButtons();
    document.addEventListener('keydown', handleKeydown, { passive: false });
    resetGame(DEFAULT_SEED, { mode: 'free' });
    window.QA_READY = true;
    window.__WEBGAME_QA_READY__ = true;
  }

  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.resetGame = resetGame;
  window.reset = () => resetGame(DEFAULT_SEED, { mode: 'free' });
  window.QA_READY = true;
  window.__WEBGAME_QA_READY__ = true;

  init();
})();
