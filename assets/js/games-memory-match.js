(() => {
  const BOARD_SIZE = 4;
  const PAIR_COUNT = 8;
  const DEFAULT_SEED = 0x4d4d4631;
  const MATCH_BONUS = 12;
  const STREAK_BONUS = 2;
  const MISMATCH_REVEAL_MS = 650;
  const STORAGE_KEY = 'rlt-memory-match-best-v1';
  const DAILY_STORAGE_KEY = 'rlt-memory-match-daily-best-v1';

  const copy = window.__MEMORY_MATCH_COPY__ || {};
  const meta = window.__MEMORY_MATCH_META__ || {};
  const lang = meta.lang === 'ko' ? 'ko' : 'en';

  const boardEl = document.getElementById('memory-match-board');
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
    { id: 'sun', symbol: '☼', ko: '햇살', en: 'Sun', tone: '#d97706' },
    { id: 'moon', symbol: '☾', ko: '달빛', en: 'Moon', tone: '#64748b' },
    { id: 'leaf', symbol: '❋', ko: '잎새', en: 'Leaf', tone: '#16a34a' },
    { id: 'wave', symbol: '≈', ko: '파도', en: 'Wave', tone: '#0284c7' },
    { id: 'pulse', symbol: '◌', ko: '맥박', en: 'Pulse', tone: '#be123c' },
    { id: 'prism', symbol: '◇', ko: '프리즘', en: 'Prism', tone: '#7c3aed' },
    { id: 'anchor', symbol: '⚓', ko: '닻', en: 'Anchor', tone: '#0f766e' },
    { id: 'ember', symbol: '✺', ko: '불꽃', en: 'Ember', tone: '#ea580c' }
  ];

  const state = {
    mode: 'classic',
    seed: DEFAULT_SEED,
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    dailyBest: Number(window.localStorage?.getItem(DAILY_STORAGE_KEY) || '0') || 0,
    bootBest: null,
    turns: 0,
    matches: 0,
    streak: 0,
    dailyKey: dailyKeyForToday(),
    focusedIndex: 0,
    cards: [],
    selected: [],
    revealUntil: 0,
    eventUntil: 0,
    clock: 0,
    eventKind: null,
    pendingMismatch: null,
    boardLocked: false
  };

  function labelFor(theme) {
    return lang === 'ko' ? theme.ko : theme.en;
  }

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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function dailyKeyForToday() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
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

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, String(state.best));
    }
  }

  function saveDailyBest() {
    if (window.localStorage) {
      window.localStorage.setItem(DAILY_STORAGE_KEY, String(state.dailyBest));
    }
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

  function cardLabel(card) {
    return labelFor(card.label);
  }

  function cardStateLabel(card) {
    if (card.state === 'matched') return copy.cardMatchedLabel || (lang === 'ko' ? '맞춘 카드' : 'Matched card');
    if (card.state === 'revealed') return copy.cardRevealedLabel || (lang === 'ko' ? '열린 카드' : 'Revealed card');
    return copy.cardHiddenLabel || (lang === 'ko' ? '숨겨진 카드' : 'Hidden card');
  }

  function pairCountRemaining() {
    return Math.max(0, PAIR_COUNT - state.matches);
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || (lang === 'ko' ? '진행 중' : 'Playing');
    if (state.phase === 'resolving') return copy.resolvingLabel || (lang === 'ko' ? '비교 중' : 'Checking');
    if (state.phase === 'complete') return copy.completeLabel || (lang === 'ko' ? '완료' : 'Complete');
    return copy.readyLabel || (lang === 'ko' ? '준비됨' : 'Ready');
  }

  function modeLabel() {
    if (state.mode === 'daily') {
      return copy.dailyModeLabel || (lang === 'ko' ? '데일리' : 'Daily');
    }
    return copy.classicModeLabel || copy.modeLabel || copy.freeModeLabel || (lang === 'ko' ? '클래식' : 'Classic');
  }

  function statusText() {
    if (state.phase === 'complete') return copy.statusComplete || (lang === 'ko' ? '?? ?? ?????. ? ??? ???? ?? ?????.' : 'All pairs are matched. Start a new board or reset to play again.');
    if (state.phase === 'resolving') return copy.statusResolving || (lang === 'ko' ? '?? ?? ?????. ??? ?? ?? ????.' : 'That pair does not match. The cards will close back up.');
    if (state.phase === 'playing') {
      if (state.turns === 0) return copy.statusPlayingStart || (lang === 'ko' ? '? ??? ?? ??? ?????.' : 'Open the first card to start the board.');
      return copy.statusPlaying || (lang === 'ko' ? '?? ?? ????? ?? ??? ?? ???.' : 'Keep the matched pairs in mind and pick the next card.');
    }
    if (state.mode === 'daily') return copy.statusReadyDaily || (lang === 'ko' ? '??? ??? ?????. ??? ???? Enter? ?????.' : 'Daily challenge ready. Tap a card or press Enter to start.');
    return copy.statusReady || (lang === 'ko' ? '??? ???? Enter? ??? ? ????.' : 'Tap a card or press Enter to start.');
  }

  function updateEvent(kind, durationMs) {
    state.eventKind = kind;
    state.eventUntil = state.clock + durationMs;
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
        ? (copy.mobileHint || (lang === 'ko'
          ? '모바일에서는 카드를 탭해 뒤집고, 아래 버튼으로도 이동할 수 있습니다.'
          : 'On mobile, tap cards to flip them and use the buttons below to move the focus.'))
        : (copy.hint || (lang === 'ko'
          ? '방향키로 카드를 이동하고 Enter 또는 Space로 뒤집어 보세요.'
          : 'Use the arrow keys to move the focus and Enter or Space to flip a card.'));
    }
    if (mobileFlowEl) {
      mobileFlowEl.textContent = state.phase === 'complete'
        ? (copy.mobileFlowComplete || (lang === 'ko'
          ? '완료 상태에서는 새 보드나 초기화 버튼을 눌러 바로 다시 시작할 수 있습니다.'
          : 'When the board is complete, use New board or Reset to start again right away.'))
        : state.phase === 'resolving'
          ? (copy.mobileFlowResolving || (lang === 'ko'
            ? '짝이 다른 카드는 잠깐 뒤집힌 뒤 다시 닫힙니다.'
            : 'Mismatched cards stay up briefly, then close back down.'))
          : (copy.mobileFlowReady || (lang === 'ko'
            ? '탭하기 좋은 큰 카드로 구성했고, 웹뷰에서도 바로 플레이할 수 있게 만들었습니다.'
            : 'The cards are sized for easy taps and work cleanly in embedded webviews.'));
    }
    if (resetBtn) resetBtn.textContent = copy.resetButton || (lang === 'ko' ? '초기화' : 'Reset');
    if (newBtn) newBtn.textContent = copy.newButton || (lang === 'ko' ? '새 보드' : 'New board');
    if (startBtn) startBtn.textContent = copy.startButton || (lang === 'ko' ? '시작' : 'Start game');
    if (dailyBtn) dailyBtn.textContent = copy.dailyButton || (lang === 'ko' ? '데일리 도전' : 'Daily challenge');
    if (flipBtn) flipBtn.textContent = copy.flipButton || (lang === 'ko' ? '뒤집기' : 'Flip');
    if (leftBtn) leftBtn.textContent = '←';
    if (rightBtn) rightBtn.textContent = '→';
    if (upBtn) upBtn.textContent = '↑';
    if (downBtn) downBtn.textContent = '↓';
  }

  function buildBoard() {
    if (!boardEl || boardEl.children.length) return;
    boardEl.innerHTML = '';
    state.cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mm-card';
      button.dataset.index = String(index);
      button.dataset.pair = card.pairId;
      button.dataset.state = card.state;
      button.style.setProperty('--tone', card.tone);
      button.innerHTML = `
        <span class="mm-card-inner">
          <span class="mm-card-face mm-card-face-back">
            <span class="mm-card-back-mark">R.</span>
            <span class="mm-card-back-text">${escapeHtml(copy.cardBackLabel || (lang === 'ko' ? '탭해서 열기' : 'Tap to reveal'))}</span>
          </span>
          <span class="mm-card-face mm-card-face-front">
            <span class="mm-card-symbol">${escapeHtml(card.symbol)}</span>
            <span class="mm-card-name">${escapeHtml(cardLabel(card))}</span>
          </span>
        </span>`;
      button.addEventListener('click', () => flipCard(index));
      boardEl.appendChild(button);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setFocusedIndex(index) {
    state.focusedIndex = clamp(index, 0, state.cards.length - 1);
    syncBoard();
    const active = boardEl?.querySelector(`.mm-card[data-index="${state.focusedIndex}"]`);
    if (active && typeof active.focus === 'function') {
      active.focus({ preventScroll: true });
    }
  }

  function syncBoard() {
    if (!boardEl) return;
    Array.from(boardEl.children).forEach((button, index) => {
      const card = state.cards[index];
      if (!card) return;
      button.dataset.state = card.state;
      button.dataset.pair = card.pairId;
      button.classList.toggle('is-focused', index === state.focusedIndex);
      button.classList.toggle('is-revealed', card.state === 'revealed' || card.state === 'matched');
      button.classList.toggle('is-matched', card.state === 'matched');
      button.setAttribute('aria-pressed', card.state === 'revealed' || card.state === 'matched' ? 'true' : 'false');
      button.setAttribute('aria-label', `${cardStateLabel(card)} · ${cardLabel(card)}`);
      button.tabIndex = index === state.focusedIndex ? 0 : -1;
    });
    boardEl.dataset.phase = state.phase;
    boardEl.dataset.feedback = state.eventKind || '';
    boardEl.dataset.locked = state.boardLocked ? 'true' : 'false';
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

  function shouldLockCards() {
    return state.phase === 'resolving' && state.pendingMismatch !== null;
  }

  function revealCard(index) {
    const card = state.cards[index];
    if (!card) return false;
    if (card.state === 'matched' || card.state === 'revealed') return false;
    card.state = 'revealed';
    return true;
  }

  function hideCard(index) {
    const card = state.cards[index];
    if (!card || card.state === 'matched') return;
    card.state = 'hidden';
  }

  function completeIfReady() {
    if (state.matches >= PAIR_COUNT) {
      state.phase = 'complete';
      state.boardLocked = false;
      state.pendingMismatch = null;
      state.selected = [];
      updateBest();
      updateEvent('complete', 1200);
      syncHud();
      syncBoard();
    }
  }

  function resolveMismatchIfNeeded() {
    if (!state.pendingMismatch) return;
    if (state.clock < state.pendingMismatch.resolveAt) return;
    hideCard(state.pendingMismatch.first);
    hideCard(state.pendingMismatch.second);
    state.pendingMismatch = null;
    state.selected = [];
    state.boardLocked = false;
    if (state.phase !== 'complete') state.phase = 'playing';
    updateEvent('playing', 100);
    syncHud();
    syncBoard();
  }

  function finishMatch(firstIndex, secondIndex) {
    const first = state.cards[firstIndex];
    const second = state.cards[secondIndex];
    if (!first || !second) return;
    first.state = 'matched';
    second.state = 'matched';
    state.matches += 1;
    state.streak += 1;
    state.score += MATCH_BONUS + (state.streak * STREAK_BONUS);
    state.selected = [];
    state.boardLocked = false;
    state.pendingMismatch = null;
    state.phase = state.matches >= PAIR_COUNT ? 'complete' : 'playing';
    updateEvent('match', 180);
    updateBest();
    syncHud();
    syncBoard();
    completeIfReady();
  }

  function markMismatch(firstIndex, secondIndex) {
    state.turns += 1;
    state.streak = 0;
    state.phase = 'resolving';
    state.boardLocked = true;
    state.pendingMismatch = {
      first: firstIndex,
      second: secondIndex,
      resolveAt: state.clock + MISMATCH_REVEAL_MS
    };
    state.selected = [firstIndex, secondIndex];
    updateEvent('miss', MISMATCH_REVEAL_MS);
    syncHud();
    syncBoard();
  }

  function startPlaying() {
    if (state.phase === 'ready') {
      state.phase = 'playing';
      state.eventKind = 'start';
      state.eventUntil = state.clock + 120;
      syncHud();
      syncBoard();
    }
  }

  function scrollBoardIntoView() {
    boardEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startFree() {
    state.mode = 'classic';
    const nextSeed = normalizeSeed(state.seed + 1);
    reset(nextSeed, { mode: 'classic' });
    scrollBoardIntoView();
  }

  function startDaily() {
    state.mode = 'daily';
    const dailyKey = dailyKeyForToday();
    const seed = dailySeedForKey(dailyKey);
    reset(seed, { mode: 'daily', dailyKey });
    scrollBoardIntoView();
  }

  function flipCard(index) {
    const card = state.cards[index];
    if (!card) return;
    if (state.boardLocked) return;
    if (state.phase === 'complete') {
      reset();
      return;
    }
    if (card.state === 'matched') return;
    if (state.phase === 'ready') startPlaying();

    if (card.state === 'revealed') {
      setFocusedIndex(index);
      return;
    }

    if (!revealCard(index)) return;
    setFocusedIndex(index);

    if (state.selected.length === 0) {
      state.selected = [index];
      state.eventKind = 'reveal';
      state.eventUntil = state.clock + 120;
      syncHud();
      syncBoard();
      return;
    }

    if (state.selected.length === 1 && state.selected[0] !== index) {
      const firstIndex = state.selected[0];
      const firstCard = state.cards[firstIndex];
      const secondCard = state.cards[index];
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        state.turns += 1;
        finishMatch(firstIndex, index);
      } else {
        markMismatch(firstIndex, index);
      }
    }
  }

  function moveFocus(dx, dy) {
    const x = state.focusedIndex % BOARD_SIZE;
    const y = Math.floor(state.focusedIndex / BOARD_SIZE);
    const nextX = clamp(x + dx, 0, BOARD_SIZE - 1);
    const nextY = clamp(y + dy, 0, BOARD_SIZE - 1);
    setFocusedIndex(nextY * BOARD_SIZE + nextX);
    if (state.phase === 'ready') startPlaying();
  }

  function newBoard() {
    if (state.mode === 'daily') {
      startDaily();
      return;
    }
    state.seed = normalizeSeed(state.seed + 1);
    reset(state.seed, { mode: 'classic' });
  }

  function reset(seed = state.seed, options = {}) {
    const nextMode = options.mode || state.mode || 'classic';
    state.mode = nextMode;
    state.dailyKey = options.dailyKey || dailyKeyForToday();
    state.seed = normalizeSeed(seed);
    state.phase = 'ready';
    state.score = 0;
    state.turns = 0;
    state.matches = 0;
    state.streak = 0;
    state.focusedIndex = 0;
    state.cards = buildDeck(state.seed);
    state.selected = [];
    state.revealUntil = 0;
    state.eventUntil = 0;
    state.eventKind = null;
    state.pendingMismatch = null;
    state.boardLocked = false;
    state.clock = 0;
    if (state.bootBest === null) {
      state.bootBest = state.best;
    }
    buildBoard();
    syncHud();
    syncBoard();
    setFocusedIndex(0);
    return renderGameToText();
  }

  function advanceTime(ms) {
    const delta = Math.max(0, Number(ms) || 0);
    state.clock += delta;
    resolveMismatchIfNeeded();
    if (state.eventUntil && state.clock >= state.eventUntil) {
      state.eventUntil = 0;
      if (state.eventKind === 'reveal' || state.eventKind === 'start') {
        state.eventKind = null;
      } else if (state.eventKind === 'match' || state.eventKind === 'miss') {
        state.eventKind = null;
      } else if (state.phase === 'complete') {
        state.eventKind = null;
      }
      syncBoard();
    }
    syncHud();
    return renderGameToText();
  }

  function renderGameToText() {
    return JSON.stringify({
      mode: state.mode,
      modeLabel: modeLabel(),
      phase: state.phase,
      seed: state.seed,
      dailyKey: state.dailyKey,
      score: state.score,
      best: state.bootBest ?? state.best,
      dailyBest: state.dailyBest,
      turns: state.turns,
      matches: state.matches,
      remaining: pairCountRemaining(),
      streak: state.streak,
      focusedIndex: state.focusedIndex,
      selected: state.selected.slice(),
      locked: state.boardLocked,
      pendingResolveMs: state.pendingMismatch ? Math.max(0, state.pendingMismatch.resolveAt - state.clock) : 0,
      boardSize: BOARD_SIZE,
      cards: state.cards.map((card, index) => ({
        index,
        pair: card.pairId,
        state: card.state
      })),
      coordinateSystem: 'grid origin at top-left; indices increase left-to-right, top-to-bottom',
      qaReady: true
    });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    const target = document.documentElement;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    }
  }

  function handleKeydown(event) {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Spacebar', 'r', 'R', 'n', 'N', 'd', 'D', 'f', 'F'].includes(key)) {
      event.preventDefault();
    }
    if (key === 'ArrowLeft') moveFocus(-1, 0);
    else if (key === 'ArrowRight') moveFocus(1, 0);
    else if (key === 'ArrowUp') moveFocus(0, -1);
    else if (key === 'ArrowDown') moveFocus(0, 1);
    else if (key === 'Enter' || key === ' ' || key === 'Spacebar') flipCard(state.focusedIndex);
    else if (key === 'r' || key === 'R') reset();
    else if (key === 'n' || key === 'N') newBoard();
    else if (key === 'd' || key === 'D') startDaily();
    else if (key === 'f' || key === 'F') toggleFullscreen();
    else if (key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }

  function bindControls() {
    startBtn?.addEventListener('click', () => startFree());
    dailyBtn?.addEventListener('click', () => startDaily());
    resetBtn?.addEventListener('click', () => reset());
    newBtn?.addEventListener('click', () => newBoard());
    flipBtn?.addEventListener('click', () => flipCard(state.focusedIndex));
    leftBtn?.addEventListener('click', () => moveFocus(-1, 0));
    rightBtn?.addEventListener('click', () => moveFocus(1, 0));
    upBtn?.addEventListener('click', () => moveFocus(0, -1));
    downBtn?.addEventListener('click', () => moveFocus(0, 1));
    boardEl?.addEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);
  }

  window.QA_READY = true;
  window.__WEBGAME_QA_READY__ = true;
  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
  window.reset = reset;
  window.resetGame = reset;
  window.startFree = startFree;
  window.startDaily = startDaily;
  window.__MEMORY_MATCH_RESET__ = reset;

  bindControls();
  reset();
})();
