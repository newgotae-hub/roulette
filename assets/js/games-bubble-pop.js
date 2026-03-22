(() => {
  const copy = window.__BUBBLE_POP_COPY__ || {};
  const meta = window.__BUBBLE_POP_META__ || {};
  const canvas = document.getElementById('bubble-pop-board');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = 720;
  const H = 860;
  const ROWS = 8;
  const COLS = 7;
  const CELL = 82;
  const BOARD_W = COLS * CELL;
  const BOARD_H = ROWS * CELL;
  const BOARD_X = Math.round((W - BOARD_W) / 2);
  const BOARD_Y = 118;
  const COLORS = [
    { key: 'coral', fill: '#fb7185', glow: 'rgba(251,113,133,.35)' },
    { key: 'sky', fill: '#38bdf8', glow: 'rgba(56,189,248,.35)' },
    { key: 'mint', fill: '#34d399', glow: 'rgba(52,211,153,.35)' },
    { key: 'amber', fill: '#fbbf24', glow: 'rgba(251,191,36,.35)' },
    { key: 'violet', fill: '#a78bfa', glow: 'rgba(167,139,250,.35)' }
  ];
  const MAX_MOVES = 18;
  const TARGET_SCORE = 720;
  const PARTICLE_LIMIT = 90;
  const STORAGE_KEY = 'rlt-bubble-pop-best-v1';
  const deterministicMode = Boolean(navigator.webdriver || meta.deterministic);
  const coarsePointer = typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer: coarse)').matches
    : (navigator.maxTouchPoints || 0) > 0;

  const els = {
    score: document.getElementById('bubble-pop-score'),
    best: document.getElementById('bubble-pop-best'),
    moves: document.getElementById('bubble-pop-moves'),
    target: document.getElementById('bubble-pop-target'),
    combo: document.getElementById('bubble-pop-combo'),
    status: document.getElementById('bubble-pop-status'),
    mode: document.getElementById('bubble-pop-mode'),
    selection: document.getElementById('bubble-pop-selection'),
    restart: document.getElementById('bubble-pop-restart'),
    shuffle: document.getElementById('bubble-pop-shuffle'),
    clearSelection: document.getElementById('bubble-pop-clear'),
    touchHint: document.getElementById('bubble-pop-touch-hint')
  };

  function injectQuickRestart() {
    const actions = document.querySelector('.bp-actions');
    if (!actions || !els.restart || actions.querySelector('[data-quick-restart="true"]')) return;
    const quickButton = document.createElement('button');
    quickButton.type = 'button';
    quickButton.className = 'bp-button';
    quickButton.dataset.quickRestart = 'true';
    quickButton.textContent = (els.restart.textContent || 'Restart').trim();
    quickButton.addEventListener('click', () => els.restart.click());
    const hubLink = actions.querySelector('a[href$="/games/"], a[href$="/en/games/"]');
    if (hubLink) hubLink.replaceWith(quickButton);
    else actions.appendChild(quickButton);
  }

  const state = {
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    movesLeft: MAX_MOVES,
    combo: 0,
    target: TARGET_SCORE,
    board: [],
    selection: [],
    selectionColor: null,
    message: copy.readyStatus || 'Tap a bubble group to start.',
    particles: [],
    pulse: 0,
    seed: 0,
    canShuffle: true
  };

  function mulberry32(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function saveBest() {
    if (window.localStorage) window.localStorage.setItem(STORAGE_KEY, String(state.best));
  }

  function cellId(row, col) {
    return row * COLS + col;
  }

  function buildBoard(seed) {
    const rng = mulberry32(seed);
    const board = [];
    for (let row = 0; row < ROWS; row += 1) {
      const rowItems = [];
      for (let col = 0; col < COLS; col += 1) {
        const paletteIndex = Math.floor(rng() * COLORS.length);
        rowItems.push({ row, col, color: COLORS[paletteIndex].key });
      }
      board.push(rowItems);
    }
    return board;
  }

  function colorInfo(key) {
    return COLORS.find((color) => color.key === key) || COLORS[0];
  }

  function getCell(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    return state.board[row][col];
  }

  function forEachCell(callback) {
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) callback(state.board[row][col], row, col);
    }
  }

  function getCluster(row, col) {
    const start = getCell(row, col);
    if (!start || !start.color) return [];
    const queue = [[row, col]];
    const seen = new Set([cellId(row, col)]);
    const cluster = [];
    while (queue.length) {
      const [currentRow, currentCol] = queue.shift();
      const cell = getCell(currentRow, currentCol);
      if (!cell || cell.color !== start.color) continue;
      cluster.push(cell);
      [
        [currentRow - 1, currentCol],
        [currentRow + 1, currentCol],
        [currentRow, currentCol - 1],
        [currentRow, currentCol + 1]
      ].forEach(([nextRow, nextCol]) => {
        const key = cellId(nextRow, nextCol);
        if (seen.has(key)) return;
        const nextCell = getCell(nextRow, nextCol);
        if (nextCell && nextCell.color === start.color) {
          seen.add(key);
          queue.push([nextRow, nextCol]);
        }
      });
    }
    return cluster;
  }

  function countBubbles() {
    let count = 0;
    forEachCell((cell) => {
      if (cell.color) count += 1;
    });
    return count;
  }

  function largestPlayableClusterSize() {
    const visited = new Set();
    let largest = 0;
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const start = getCell(row, col);
        if (!start?.color) continue;
        const startKey = cellId(row, col);
        if (visited.has(startKey)) continue;
        const queue = [[row, col]];
        visited.add(startKey);
        let size = 0;
        while (queue.length) {
          const [currentRow, currentCol] = queue.shift();
          const cell = getCell(currentRow, currentCol);
          if (!cell || cell.color !== start.color) continue;
          size += 1;
          [
            [currentRow - 1, currentCol],
            [currentRow + 1, currentCol],
            [currentRow, currentCol - 1],
            [currentRow, currentCol + 1]
          ].forEach(([nextRow, nextCol]) => {
            const key = cellId(nextRow, nextCol);
            if (visited.has(key)) return;
            const nextCell = getCell(nextRow, nextCol);
            if (nextCell && nextCell.color === start.color) {
              visited.add(key);
              queue.push([nextRow, nextCol]);
            }
          });
        }
        largest = Math.max(largest, size);
      }
    }
    return largest;
  }

  function findBestCluster() {
    const visited = new Set();
    let best = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const start = getCell(row, col);
        if (!start?.color) continue;
        const startKey = cellId(row, col);
        if (visited.has(startKey)) continue;
        const cluster = getCluster(row, col);
        cluster.forEach((cell) => visited.add(cellId(cell.row, cell.col)));
        if (cluster.length > best.length) {
          best = cluster;
        }
      }
    }
    return best;
  }

  function projectedGain(clusterSize) {
    if (clusterSize < 2) return 0;
    const chainBonus = state.combo * 12;
    const sizeBonus = Math.max(0, clusterSize - 3) * (8 + state.combo);
    return clusterSize * clusterSize * 5 + chainBonus + sizeBonus;
  }

  function boardNeedsShuffle() {
    return state.phase === 'playing' && state.canShuffle && largestPlayableClusterSize() < 2;
  }

  function clusterMatchesSelection(cluster) {
    if (!state.selection.length || state.selection.length !== cluster.length) return false;
    const selectedKeys = new Set(state.selection.map((cell) => cellId(cell.row, cell.col)));
    return cluster.every((cell) => selectedKeys.has(cellId(cell.row, cell.col)));
  }

  function updateBest(score) {
    if (score > state.best) {
      state.best = score;
      saveBest();
    }
  }

  function emitParticles(cells) {
    const particles = [];
    cells.slice(0, 12).forEach((cell, index) => {
      particles.push({
        x: BOARD_X + cell.col * CELL + CELL / 2,
        y: BOARD_Y + cell.row * CELL + CELL / 2,
        vx: ((index % 4) - 1.5) * 1.4,
        vy: -2.8 - (index % 3) * 0.35,
        alpha: 1,
        size: 7 + (index % 3) * 2,
        color: colorInfo(cell.color).fill
      });
    });
    state.particles = state.particles.concat(particles).slice(-PARTICLE_LIMIT);
  }

  function applyGravity() {
    for (let col = 0; col < COLS; col += 1) {
      const compacted = [];
      for (let row = ROWS - 1; row >= 0; row -= 1) {
        const cell = state.board[row][col];
        if (cell.color) compacted.push(cell.color);
      }
      for (let row = ROWS - 1, index = 0; row >= 0; row -= 1, index += 1) {
        state.board[row][col].color = compacted[index] || null;
      }
    }

    const remainingCols = [];
    for (let col = 0; col < COLS; col += 1) {
      let hasColor = false;
      for (let row = 0; row < ROWS; row += 1) {
        if (state.board[row][col].color) {
          hasColor = true;
          break;
        }
      }
      if (hasColor) remainingCols.push(state.board.map((row) => row[col].color));
    }
    while (remainingCols.length < COLS) remainingCols.push(Array(ROWS).fill(null));
    for (let col = 0; col < COLS; col += 1) {
      for (let row = 0; row < ROWS; row += 1) state.board[row][col].color = remainingCols[col][row];
    }
  }

  function selectionLabel() {
    if (!state.selection.length) return copy.selectionNone || 'No group selected';
    if (state.selection.length < 2) {
      return copy.selectionSingle || 'Single bubble';
    }
    return `${state.selection.length} ${copy.selectionSuffix || 'bubbles ready'} · +${projectedGain(state.selection.length)}`;
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'won') return copy.wonLabel || 'Cleared';
    if (state.phase === 'gameover') return copy.gameoverLabel || 'Out of moves';
    return copy.readyLabel || 'Ready';
  }

  function syncHud() {
    if (els.score) els.score.textContent = String(state.score);
    if (els.best) els.best.textContent = String(state.best);
    if (els.moves) els.moves.textContent = String(state.movesLeft);
    if (els.target) els.target.textContent = String(state.target);
    if (els.combo) els.combo.textContent = String(state.combo);
    if (els.status) els.status.textContent = state.message;
    if (els.selection) els.selection.textContent = selectionLabel();
    if (els.mode) {
      els.mode.dataset.state = state.phase;
      els.mode.textContent = `${copy.modeLabel || 'Bubble Pop'} · ${phaseLabel()}`;
    }
    if (els.touchHint) {
      els.touchHint.textContent = coarsePointer ? (copy.mobileHint || copy.hint || '') : (copy.hint || '');
    }
    if (els.shuffle) els.shuffle.disabled = !state.canShuffle || state.phase === 'won' || state.phase === 'gameover';
    if (els.shuffle) {
      const needsShuffle = boardNeedsShuffle();
      els.shuffle.dataset.recommended = needsShuffle ? 'true' : 'false';
      els.shuffle.title = needsShuffle
        ? (copy.shuffleReadyStatus || 'No matching groups left. Use Shuffle to rescue the board.')
        : '';
    }
    if (els.status) {
      els.status.dataset.state = boardNeedsShuffle() ? 'warning' : state.phase;
    }
  }

  function setMessage(message) {
    state.message = message;
    syncHud();
  }

  function updateSelection(cluster) {
    state.selection = cluster.map((cell) => ({ row: cell.row, col: cell.col, color: cell.color }));
    state.selectionColor = cluster[0]?.color || null;
    if (cluster.length >= 2) {
      setMessage(`${copy.selectionStatus || 'Group selected.'} ${cluster.length}. ${copy.selectionTapAgain || 'Tap again to pop it.'}`);
    } else {
      setMessage(copy.singleBubbleStatus || 'That bubble needs a matching neighbor.');
    }
    syncHud();
    render();
  }

  function clearSelection() {
    state.selection = [];
    state.selectionColor = null;
    if (boardNeedsShuffle()) {
      setMessage(copy.shuffleReadyStatus || 'No matching groups left. Use Shuffle to rescue the board.');
    } else if (state.phase === 'playing') {
      const bestCluster = findBestCluster();
      if (bestCluster.length >= 2) {
        setMessage(`${copy.readyStatus || 'Tap a bubble group to start your first pop.'} Best opening: ${bestCluster.length} · +${projectedGain(bestCluster.length)}.`);
      } else {
        setMessage(copy.readyStatus || 'Tap a bubble group to start your first pop.');
      }
    }
    syncHud();
    render();
  }

  function settlePhase() {
    const bubblesLeft = countBubbles();
    if (bubblesLeft === 0 || state.score >= state.target) {
      state.phase = 'won';
      setMessage(copy.wonStatus || 'Board cleared. Restart to chase a higher score.');
      return;
    }
    if (state.movesLeft <= 0) {
      state.phase = 'gameover';
      setMessage(copy.gameoverStatus || 'No moves left. Restart to try again.');
      return;
    }
    state.phase = 'playing';
    if (boardNeedsShuffle()) {
      setMessage(copy.shuffleReadyStatus || 'No matching groups left. Use Shuffle to rescue the board.');
    }
  }

  function popSelection(cluster) {
    if (cluster.length < 2) {
      setMessage(copy.needGroupStatus || 'Pick a group of at least two bubbles.');
      updateSelection(cluster);
      return;
    }
    state.phase = 'playing';
    emitParticles(cluster);
    cluster.forEach((cell) => {
      state.board[cell.row][cell.col].color = null;
    });
    applyGravity();
    state.movesLeft -= 1;
    state.combo += 1;
    const chainBonus = Math.min(96, state.combo * 10);
    const sizeBonus = Math.max(0, cluster.length - 3) * (8 + state.combo);
    const gained = cluster.length * cluster.length * 5 + chainBonus + sizeBonus;
    state.score += gained;
    updateBest(state.score);
    state.selection = [];
    state.selectionColor = null;
    settlePhase();
    if (state.phase === 'playing') {
      const extra = cluster.length >= 5 ? ` · ${copy.chainBonusStatus || 'Chain bonus!'}` : '';
      setMessage((copy.popStatus || 'Popped a cluster.') + ` +${gained}${extra}`);
    }
    syncHud();
    render();
  }

  function reset(seed = 20260322) {
    state.phase = 'ready';
    state.score = 0;
    state.movesLeft = MAX_MOVES;
    state.combo = 0;
    state.target = TARGET_SCORE;
    state.seed = seed;
    state.board = buildBoard(seed);
    state.selection = [];
    state.selectionColor = null;
    state.message = copy.readyStatus || 'Tap a bubble group to start.';
    state.particles = [];
    state.pulse = 0;
    state.canShuffle = true;
    syncHud();
    render();
    return renderGameToText();
  }

  function shuffleBoard() {
    const colors = [];
    forEachCell((cell) => {
      if (cell.color) colors.push(cell.color);
    });
    const rng = mulberry32(state.seed + state.movesLeft + state.score + 17);
    for (let i = colors.length - 1; i > 0; i -= 1) {
      const swapIndex = Math.floor(rng() * (i + 1));
      const temp = colors[i];
      colors[i] = colors[swapIndex];
      colors[swapIndex] = temp;
    }
    let idx = 0;
    forEachCell((cell) => {
      cell.color = colors[idx] || null;
      idx += 1;
    });
    state.canShuffle = false;
    state.combo = 0;
    state.phase = state.phase === 'ready' ? 'ready' : 'playing';
    clearSelection();
    setMessage(copy.shuffleStatus || 'The field was shuffled. Look for the next cluster.');
  }

  function screenToCell(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    if (x < BOARD_X || x > BOARD_X + BOARD_W || y < BOARD_Y || y > BOARD_Y + BOARD_H) return null;
    return {
      row: Math.floor((y - BOARD_Y) / CELL),
      col: Math.floor((x - BOARD_X) / CELL)
    };
  }

  function handleCellTap(row, col) {
    const cell = getCell(row, col);
    if (!cell || !cell.color || state.phase === 'won' || state.phase === 'gameover') return false;
    const cluster = getCluster(row, col);
    if (!state.selection.length) {
      updateSelection(cluster);
      state.phase = state.phase === 'ready' ? 'playing' : state.phase;
      return true;
    }
    if (clusterMatchesSelection(cluster)) {
      popSelection(cluster);
      return true;
    }
    updateSelection(cluster);
    state.phase = state.phase === 'ready' ? 'playing' : state.phase;
    return true;
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#f8fbff');
    gradient.addColorStop(1, '#dbeafe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(56,189,248,.08)';
    ctx.beginPath();
    ctx.arc(W * 0.14, H * 0.12, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W * 0.84, H * 0.18, 92, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '700 40px "Noto Sans KR","Noto Sans",sans-serif';
    ctx.fillText(copy.canvasTitle || 'Bubble Pop', BOARD_X, 58);
    ctx.fillStyle = '#475569';
    ctx.font = '20px "Noto Sans KR","Noto Sans",sans-serif';
    ctx.fillText(copy.canvasSub || 'Tap the same group twice to pop it.', BOARD_X, 88);
  }

  function drawBoard() {
    ctx.save();
    const recommended = !state.selection.length ? findBestCluster() : [];
    const recommendedKeys = new Set(recommended.map((cell) => cellId(cell.row, cell.col)));
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    ctx.strokeStyle = 'rgba(148,163,184,.22)';
    ctx.lineWidth = 2;
    roundRect(ctx, BOARD_X - 18, BOARD_Y - 18, BOARD_W + 36, BOARD_H + 36, 34);
    ctx.fill();
    ctx.stroke();
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const cell = state.board[row][col];
        const x = BOARD_X + col * CELL + CELL / 2;
        const y = BOARD_Y + row * CELL + CELL / 2;
        ctx.fillStyle = 'rgba(226,232,240,.44)';
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fill();
        if (!cell.color) continue;
        const selected = state.selection.some((item) => item.row === row && item.col === col);
        const recommendedCell = !selected && recommended.length >= 3 && recommendedKeys.has(cellId(row, col));
        const info = colorInfo(cell.color);
        const radius = selected
          ? 30 + Math.sin(state.pulse + row + col) * 1.8
          : recommendedCell
            ? 29 + Math.sin(state.pulse + row + col) * 0.9
            : 29;
        ctx.save();
        ctx.shadowColor = info.glow;
        ctx.shadowBlur = selected ? 24 : (recommendedCell ? 20 : 16);
        ctx.fillStyle = info.fill;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = selected
          ? 'rgba(255,255,255,.96)'
          : recommendedCell
            ? 'rgba(15,23,42,.24)'
            : 'rgba(255,255,255,.72)';
        ctx.lineWidth = selected ? 4 : (recommendedCell ? 3 : 2);
        ctx.beginPath();
        ctx.arc(x, y, radius + (selected ? 5 : 2), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawParticles() {
    state.particles.forEach((particle) => {
      if (particle.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function updateParticles() {
    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.06;
      particle.alpha -= 0.025;
      particle.size *= 0.992;
    });
    state.particles = state.particles.filter((particle) => particle.alpha > 0.02);
  }

  function update(dt) {
    state.pulse += dt * 5.4;
    updateParticles();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawBoard();
    drawParticles();
  }

  function renderGameToText() {
    return JSON.stringify({
      phase: state.phase,
      score: state.score,
      best: deterministicMode ? 0 : state.best,
      movesLeft: state.movesLeft,
      combo: state.combo,
      target: state.target,
      bubblesRemaining: countBubbles(),
      selectionSize: state.selection.length,
      selectionColor: state.selectionColor,
      qaReady: true,
      coordinateSystem: {
        origin: 'top-left',
        xDirection: 'right',
        yDirection: 'down',
        cellSize: CELL
      },
      board: state.board.map((row) => row.map((cell) => cell.color || null))
    });
  }

  function advanceTime(ms) {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i += 1) update(1 / 60);
    render();
    return renderGameToText();
  }

  canvas.addEventListener('click', (event) => {
    const cell = screenToCell(event.clientX, event.clientY);
    if (cell) handleCellTap(cell.row, cell.col);
  });
  canvas.addEventListener('pointerup', (event) => {
    const cell = screenToCell(event.clientX, event.clientY);
    if (cell) handleCellTap(cell.row, cell.col);
  });
  els.restart?.addEventListener('click', () => reset(state.seed));
  els.clearSelection?.addEventListener('click', () => {
    clearSelection();
    setMessage(copy.clearStatus || 'Selection cleared.');
  });
  els.shuffle?.addEventListener('click', shuffleBoard);
  injectQuickRestart();

  window.bubblePopTap = (row, col) => handleCellTap(row, col);
  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
  window.resetGame = reset;
  window.reset = reset;
  window.QA_READY = true;
  window.__WEBGAME_QA_READY__ = true;

  reset();
})();
