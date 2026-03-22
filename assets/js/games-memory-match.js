(() => {
  const BOARD_SIZE = 4;
  const PAIR_COUNT = 8;
  const DEFAULT_SEED = 0x4d4d4631;
  const MATCH_BONUS = 12;
  const STREAK_BONUS = 2;
  const MISMATCH_REVEAL_MS = 520;
  const STORAGE_KEY = 'rlt-memory-match-best-v1';
  const DAILY_STORAGE_KEY = 'rlt-memory-match-daily-best-v1';

  const copy = window.__MEMORY_MATCH_COPY__ || {};
  const meta = window.__MEMORY_MATCH_META__ || {};
  const lang = meta.lang === 'ko' ? 'ko' : 'en';

  const boardEl = document.getElementById('memory-match-board');
  if (!boardEl) return;

  const statusEl = document.getElementById('memory-match-status');
  const modeEl = document.getElementById('memory-match-mode');
  const scoreEl = document.getElementById('memory-match-score');
  const bestEl = document.getElementById('memory-match-best');
  const dailyBestEl = document.getElementById('memory-match-daily-best');
  const turnsEl = document.getElementById('memory-match-turns');
  const matchesEl = document.getElementById('memory-match-matches');
  const remainingEl = document.getElementById('memory-match-remaining');
  const streakEl = document.getElementById('memory-match-streak');
  const hintEl = document.getElementById('memory-match-hint');
  const mobileFlowEl = document.getElementById('memory-match-mobile-flow');
  const resetBtn = document.getElementById('memory-match-reset');
  const startBtn = document.getElementById('memory-match-start');
  const dailyBtn = document.getElementById('memory-match-daily');
  const newBtn = document.getElementById('memory-match-new');
  const flipBtn = document.getElementById('memory-match-flip');
  const leftBtn = document.getElementById('memory-match-left');
  const rightBtn = document.getElementById('memory-match-right');
  const upBtn = document.getElementById('memory-match-up');
  const downBtn = document.getElementById('memory-match-down');

  const THEMES = [
    { id: 'sun', symbol: 'SU', ko: '태양', en: 'Sun', tone: '#d97706' },
    { id: 'moon', symbol: 'MO', ko: '달', en: 'Moon', tone: '#64748b' },
    { id: 'leaf', symbol: 'LE', ko: '잎', en: 'Leaf', tone: '#16a34a' },
    { id: 'wave', symbol: 'WA', ko: '물결', en: 'Wave', tone: '#0284c7' },
    { id: 'pulse', symbol: 'PU', ko: '파동', en: 'Pulse', tone: '#be123c' },
    { id: 'prism', symbol: 'PR', ko: '프리즘', en: 'Prism', tone: '#7c3aed' },
    { id: 'anchor', symbol: 'AN', ko: '닻', en: 'Anchor', tone: '#0f766e' },
    { id: 'ember', symbol: 'EM', ko: '불씨', en: 'Ember', tone: '#ea580c' }
  ];

  const state = {
    mode: 'classic',
    seed: DEFAULT_SEED,
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    dailyBest: Number(window.localStorage?.getItem(DAILY_STORAGE_KEY) || '0') || 0,
    dailyKey: dailyKeyForToday(),
    turns: 0,
    matches: 0,
    streak: 0,
    focusedIndex: 0,
    cards: [],
    selected: [],
    clock: 0,
    eventKind: null,
    pendingMismatch: null,
    boardLocked: false
  };

  function pulseDevice(pattern) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function safeSet(key, value) {
    try {
      window.localStorage?.setItem(key, value);
    } catch (_) {}
  }

  function saveBest() {
    safeSet(STORAGE_KEY, String(state.best));
  }

  function saveDailyBest() {
    safeSet(DAILY_STORAGE_KEY, String(state.dailyBest));
  }

  function dailyKeyForToday(date = new Date()) {
    const year = String(date.getUTCFullYear());
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function dailySeedForKey(key) {
    let hash = 0x811c9dc5;
    const value = `memory-match:${key}`;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0) || DEFAULT_SEED;
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

  function modeLabel() {
    return state.mode === 'daily'
      ? (copy.dailyModeLabel || 'Daily')
      : (copy.classicModeLabel || copy.modeLabel || 'Classic');
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'resolving') return copy.resolvingLabel || 'Checking';
    if (state.phase === 'complete') return copy.completeLabel || 'Complete';
    return copy.readyLabel || 'Ready';
  }

  function statusText() {
    if (state.phase === 'complete') {
      return copy.statusComplete || 'All pairs are matched. Start a new board or reset to play again.';
    }
    if (state.phase === 'resolving') {
      return copy.statusResolving || 'That pair does not match. The cards will close back down.';
    }
    if (state.phase === 'playing') {
      return state.turns === 0
        ? (copy.statusPlayingStart || 'Open the first card to start the board.')
        : (copy.statusPlaying || 'Keep the matched pairs in mind and pick the next card.');
    }
    return state.mode === 'daily'
      ? (copy.statusReadyDaily || 'Daily challenge ready. Tap a card or press Enter to start.')
      : (copy.statusReady || 'Tap a card or press Enter to start.');
  }

  function injectQuickReplayControls() {
    const actions = document.querySelector('.mm-actions');
    if (!actions || actions.querySelector('[data-quick-memory="true"]')) return;

    const hubLink = actions.querySelector('a[href$="/games/"], a[href$="/en/games/"]');
    if (hubLink) hubLink.remove();

    const makeButton = (label, onClick) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mm-button';
      button.dataset.quickMemory = 'true';
      button.textContent = label;
      button.addEventListener('click', onClick);
      return button;
    };

    actions.appendChild(makeButton((copy.newButton || 'New board').trim(), () => newBtn?.click()));
    actions.appendChild(makeButton((copy.resetButton || 'Reset').trim(), () => resetBtn?.click()));
  }

  function buildDeck(seed) {
    const rng = createRng(seed);
    const deck = THEMES.flatMap((theme) => ([
      { pairId: theme.id, symbol: theme.symbol, label: theme, tone: theme.tone, state: 'hidden' },
      { pairId: theme.id, symbol: theme.symbol, label: theme, tone: theme.tone, state: 'hidden' }
    ]));
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
    }
    return deck;
  }

  function labelFor(card) {
    return lang === 'ko' ? card.label.ko : card.label.en;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pairCountRemaining() {
    return Math.max(0, PAIR_COUNT - state.matches);
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    state.cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mm-card';
      button.dataset.index = String(index);
      button.dataset.pair = card.pairId;
      button.style.setProperty('--tone', card.tone);
      button.innerHTML = `
        <span class="mm-card-inner">
          <span class="mm-card-face mm-card-face-back">
            <span class="mm-card-back-mark">R.</span>
            <span class="mm-card-back-text">${escapeHtml(copy.cardBackLabel || 'Tap to reveal')}</span>
          </span>
          <span class="mm-card-face mm-card-face-front">
            <span class="mm-card-symbol">${escapeHtml(card.symbol)}</span>
            <span class="mm-card-name">${escapeHtml(labelFor(card))}</span>
          </span>
        </span>`;
      button.addEventListener('click', () => flipCard(index));
      boardEl.appendChild(button);
    });
  }

  function setFocusedIndex(index) {
    state.focusedIndex = clamp(index, 0, state.cards.length - 1);
    syncBoard();
    const active = boardEl.querySelector(`.mm-card[data-index="${state.focusedIndex}"]`);
    active?.focus({ preventScroll: true });
  }

  function syncBoard() {
    Array.from(boardEl.children).forEach((button, index) => {
      const card = state.cards[index];
      if (!card) return;
      button.dataset.state = card.state;
      button.dataset.pair = card.pairId;
      button.classList.toggle('is-focused', index === state.focusedIndex);
      button.classList.toggle('is-revealed', card.state === 'revealed' || card.state === 'matched');
      button.classList.toggle('is-matched', card.state === 'matched');
      button.setAttribute('aria-pressed', card.state === 'revealed' || card.state === 'matched' ? 'true' : 'false');
      button.tabIndex = index === state.focusedIndex ? 0 : -1;
    });
    boardEl.dataset.phase = state.phase;
    boardEl.dataset.feedback = state.eventKind || '';
    boardEl.dataset.locked = state.boardLocked ? 'true' : 'false';
  }

  function syncHud() {
    if (modeEl) {
      modeEl.dataset.mode = state.mode;
      modeEl.textContent = `${modeLabel()} · ${phaseLabel()}`;
    }
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (bestEl) bestEl.textContent = String(state.best);
    if (dailyBestEl) dailyBestEl.textContent = String(state.dailyBest);
    if (turnsEl) turnsEl.textContent = String(state.turns);
    if (matchesEl) matchesEl.textContent = String(state.matches);
    if (remainingEl) remainingEl.textContent = String(pairCountRemaining());
    if (streakEl) streakEl.textContent = String(state.streak);
    if (statusEl) statusEl.textContent = statusText();

    if (hintEl) {
      const mobile = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
      hintEl.textContent = mobile
        ? (copy.mobileHint || 'On mobile, tap cards to flip them and use the buttons below to move the focus.')
        : (copy.hint || 'Use the arrow keys to move the focus and Enter or Space to flip a card.');
    }

    if (mobileFlowEl) {
      mobileFlowEl.textContent = state.phase === 'complete'
        ? (copy.mobileFlowComplete || 'When the board is complete, use New board or Reset to start again right away.')
        : state.phase === 'resolving'
          ? (copy.mobileFlowResolving || 'Mismatched cards stay up briefly, then close back down.')
          : (copy.mobileFlowReady || 'The cards are sized for easy taps and work cleanly in embedded webviews.');
    }

    if (resetBtn) resetBtn.textContent = copy.resetButton || (lang === 'ko' ? '리셋' : 'Reset');
    if (newBtn) newBtn.textContent = copy.newButton || (lang === 'ko' ? '새 판' : 'New board');
    if (startBtn) startBtn.textContent = copy.startButton || (lang === 'ko' ? '게임 시작' : 'Start game');
    if (dailyBtn) dailyBtn.textContent = copy.dailyButton || (lang === 'ko' ? '오늘의 판' : 'Daily challenge');
    if (flipBtn) flipBtn.textContent = copy.flipButton || (lang === 'ko' ? '열기' : 'Flip');
    if (leftBtn) leftBtn.textContent = lang === 'ko' ? '왼쪽' : 'Left';
    if (rightBtn) rightBtn.textContent = lang === 'ko' ? '오른쪽' : 'Right';
    if (upBtn) upBtn.textContent = lang === 'ko' ? '위' : 'Up';
    if (downBtn) downBtn.textContent = lang === 'ko' ? '아래' : 'Down';
  }

  function updateBest() {
    if (state.score > state.best) {
      state.best = state.score;
      saveBest();
    }
    if (state.mode === 'daily' && state.score > state.dailyBest) {
      state.dailyBest = state.score;
      saveDailyBest();
    }
  }

  function revealCard(index) {
    const card = state.cards[index];
    if (!card || card.state === 'matched' || card.state === 'revealed') return false;
    card.state = 'revealed';
    return true;
  }

  function hideCard(index) {
    const card = state.cards[index];
    if (card && card.state === 'revealed') {
      card.state = 'hidden';
    }
  }

  function markMismatch(firstIndex, secondIndex) {
    state.phase = 'resolving';
    state.pendingMismatch = {
      first: firstIndex,
      second: secondIndex,
      resolveAt: state.clock + MISMATCH_REVEAL_MS
    };
    state.selected = [firstIndex, secondIndex];
    state.eventKind = 'miss';
    state.boardLocked = true;
  }

  function resolveMismatchIfNeeded() {
    if (!state.pendingMismatch || state.clock < state.pendingMismatch.resolveAt) return;
    hideCard(state.pendingMismatch.first);
    hideCard(state.pendingMismatch.second);
    state.pendingMismatch = null;
    state.selected = [];
    state.phase = 'playing';
    state.eventKind = null;
    state.boardLocked = false;
    syncBoard();
    syncHud();
  }

  function startPlaying() {
    if (state.phase === 'ready') {
      state.phase = 'playing';
      state.eventKind = 'start';
      boardEl.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      syncHud();
    }
  }

  function finishBoard() {
    state.phase = 'complete';
    state.eventKind = 'complete';
    state.boardLocked = false;
    updateBest();
    pulseDevice([14, 24, 14]);
    syncBoard();
    syncHud();
  }

  function flipCard(index) {
    if (state.phase === 'complete') {
      if (state.mode === 'daily') startDaily();
      else startFree();
      return;
    }
    if (state.boardLocked) return;
    if (state.phase === 'ready') startPlaying();
    if (state.phase !== 'playing') return;

    const card = state.cards[index];
    if (!card || card.state === 'matched' || card.state === 'revealed') return;
    if (!revealCard(index)) return;

    if (state.selected.length === 0) {
      state.selected = [index];
      state.eventKind = 'reveal';
      syncBoard();
      syncHud();
      return;
    }

    const firstIndex = state.selected[0];
    const firstCard = state.cards[firstIndex];
    state.turns += 1;

    if (firstCard && firstCard.pairId === card.pairId) {
      firstCard.state = 'matched';
      card.state = 'matched';
      state.selected = [];
      state.matches += 1;
      state.streak += 1;
      state.score += MATCH_BONUS + Math.max(0, state.streak - 1) * STREAK_BONUS;
      state.eventKind = state.streak >= 2 ? 'hot' : 'match';
      pulseDevice(state.streak >= 2 ? [10, 18, 10] : 10);
      updateBest();
      if (state.matches >= PAIR_COUNT) {
        finishBoard();
        return;
      }
    } else {
      state.streak = 0;
      pulseDevice(18);
      markMismatch(firstIndex, index);
    }

    syncBoard();
    syncHud();
  }

  function moveFocus(deltaCol, deltaRow) {
    const row = Math.floor(state.focusedIndex / BOARD_SIZE);
    const col = state.focusedIndex % BOARD_SIZE;
    const nextRow = clamp(row + deltaRow, 0, BOARD_SIZE - 1);
    const nextCol = clamp(col + deltaCol, 0, BOARD_SIZE - 1);
    setFocusedIndex(nextRow * BOARD_SIZE + nextCol);
  }

  function reset(seed = DEFAULT_SEED, options = {}) {
    state.mode = options.mode === 'daily' ? 'daily' : 'classic';
    state.seed = normalizeSeed(seed);
    state.dailyKey = options.dailyKey || dailyKeyForToday();
    state.score = 0;
    state.turns = 0;
    state.matches = 0;
    state.streak = 0;
    state.clock = 0;
    state.phase = 'ready';
    state.focusedIndex = 0;
    state.selected = [];
    state.eventKind = null;
    state.pendingMismatch = null;
    state.boardLocked = false;
    state.cards = buildDeck(state.seed);
    buildBoard();
    syncBoard();
    syncHud();
    return renderGameToText();
  }

  function startFree() {
    return reset(DEFAULT_SEED + Math.floor(Math.random() * 100000), { mode: 'classic' });
  }

  function startDaily() {
    const key = dailyKeyForToday();
    return reset(dailySeedForKey(key), { mode: 'daily', dailyKey: key });
  }

  function advanceTime(ms) {
    state.clock += Math.max(0, Number(ms) || 0);
    resolveMismatchIfNeeded();
    return renderGameToText();
  }

  function renderGameToText() {
    return JSON.stringify({
      mode: state.mode,
      phase: state.phase,
      score: state.score,
      best: Math.max(0, state.score),
      dailyBest: state.mode === 'daily' ? Math.max(0, state.score) : 0,
      turns: state.turns,
      matches: state.matches,
      remaining: pairCountRemaining(),
      streak: state.streak,
      dailyKey: state.dailyKey,
      focusedIndex: state.focusedIndex,
      selected: state.selected.slice(),
      locked: state.boardLocked,
      pendingResolveMs: state.pendingMismatch ? Math.max(0, state.pendingMismatch.resolveAt - state.clock) : 0,
      boardSize: BOARD_SIZE,
      cards: state.cards.map((card) => ({ pairId: card.pairId, state: card.state }))
    });
  }

  function handleKeydown(event) {
    const key = event.key;
    if (key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(-1, 0);
    } else if (key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(1, 0);
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(0, -1);
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(0, 1);
    } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      flipCard(state.focusedIndex);
    } else if (key === 'd' || key === 'D') {
      event.preventDefault();
      startDaily();
    } else if (key === 'r' || key === 'R') {
      event.preventDefault();
      reset(state.seed, { mode: state.mode, dailyKey: state.dailyKey });
    }
  }

  function bind() {
    startBtn?.addEventListener('click', () => {
      if (state.phase === 'ready') startPlaying();
      else if (state.phase === 'complete') reset(state.seed, { mode: state.mode, dailyKey: state.dailyKey });
      syncHud();
    });
    dailyBtn?.addEventListener('click', startDaily);
    resetBtn?.addEventListener('click', () => reset(state.seed, { mode: state.mode, dailyKey: state.dailyKey }));
    newBtn?.addEventListener('click', startFree);
    flipBtn?.addEventListener('click', () => flipCard(state.focusedIndex));
    leftBtn?.addEventListener('click', () => moveFocus(-1, 0));
    rightBtn?.addEventListener('click', () => moveFocus(1, 0));
    upBtn?.addEventListener('click', () => moveFocus(0, -1));
    downBtn?.addEventListener('click', () => moveFocus(0, 1));
    boardEl.addEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);
    injectQuickReplayControls();
  }

  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
  window.reset = () => reset(DEFAULT_SEED, { mode: 'classic' });
  window.resetGame = reset;
  window.startFree = startFree;
  window.startDaily = startDaily;
  window.QA_READY = true;
  window.__WEBGAME_QA_READY__ = true;

  bind();
  reset(DEFAULT_SEED, { mode: 'classic' });
})();
