(() => {
  const DEFAULT_SEED = 0x51f1a54;
  const STORAGE_KEY = 'rlt-sequence-flash-best-v1';
  const DAILY_STORAGE_KEY = 'rlt-sequence-flash-daily-best-v1';
  const COLORS = ['coral', 'sky', 'mint', 'amber'];
  const BASE_FLASH_MS = 460;
  const GAP_MS = 140;

  const copy = window.__SEQUENCE_FLASH_COPY__ || {};
  const meta = window.__SEQUENCE_FLASH_META__ || {};

  const els = {
    pads: Array.from(document.querySelectorAll('.sf-pad')),
    start: document.getElementById('sequence-flash-start'),
    daily: document.getElementById('sequence-flash-daily'),
    reset: document.getElementById('sequence-flash-reset'),
    round: document.getElementById('sequence-flash-round'),
    best: document.getElementById('sequence-flash-best'),
    dailyBest: document.getElementById('sequence-flash-daily-best'),
    streak: document.getElementById('sequence-flash-streak'),
    speed: document.getElementById('sequence-flash-speed'),
    next: document.getElementById('sequence-flash-next'),
    status: document.getElementById('sequence-flash-status'),
    tag: document.getElementById('sequence-flash-tag'),
    hint: document.getElementById('sequence-flash-hint'),
    mobileFlow: document.getElementById('sequence-flash-mobile-flow')
  };

  const state = {
    mode: 'free',
    phase: 'ready',
    round: 0,
    bestRound: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    dailyBest: Number(window.localStorage?.getItem(DAILY_STORAGE_KEY) || '0') || 0,
    streak: 0,
    seed: DEFAULT_SEED,
    rng: null,
    sequence: [],
    inputIndex: 0,
    activeColor: null,
    playbackIndex: 0,
    playbackWaitingGap: false,
    playbackTimerMs: 0,
    pendingNextRound: false,
    pendingTimerMs: 0,
    dailyKey: dailyKeyForToday(),
    replayCharge: 1
  };

  function pulseDevice(pattern) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  }

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

  function currentFlashMs() {
    return Math.max(220, BASE_FLASH_MS - Math.max(0, state.round - 1) * 16);
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, String(state.bestRound));
      window.localStorage.setItem(DAILY_STORAGE_KEY, String(state.dailyBest));
    }
  }

  function updateBest() {
    if (state.round > state.bestRound) state.bestRound = state.round;
    if (state.mode === 'daily' && state.round > state.dailyBest) state.dailyBest = state.round;
    saveBest();
  }

  function nextColorFromSeed() {
    if (state.sequence.length === 0) return 'coral';
    return COLORS[Math.floor(state.rng() * COLORS.length)];
  }

  function phaseLabel() {
    if (state.phase === 'showing') return copy.showingLabel || 'Showing';
    if (state.phase === 'input') return copy.inputLabel || 'Your turn';
    if (state.phase === 'success') return copy.successLabel || 'Nice';
    if (state.phase === 'gameover') return copy.gameoverLabel || 'Missed';
    return copy.readyLabel || 'Ready';
  }

  function defaultStatus() {
    if (state.phase === 'showing') return copy.showingStatus || 'Watch the pads and follow the sequence in order.';
    if (state.phase === 'input') return copy.inputStatus || 'Repeat the pattern in the same order.';
    if (state.phase === 'success') return copy.successStatus || 'Round clear. The next sequence is getting ready.';
    if (state.phase === 'gameover') return copy.gameoverStatus || 'Sequence missed. Reset and try to beat your best round.';
    return state.mode === 'daily'
      ? (copy.dailyReadyStatus || 'Daily run ready. Everyone gets the same sequence seed today.')
      : (copy.readyStatus || 'Press Start and copy the pattern one pad at a time.');
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function setTag() {
    if (!els.tag) return;
    els.tag.dataset.state = state.phase;
    const modeLabel = state.mode === 'daily'
      ? (copy.dailyModeLabel || 'Daily')
      : (copy.freeModeLabel || 'Free');
    els.tag.textContent = `${modeLabel} · ${phaseLabel()}`;
  }

  function updateHints() {
    if (els.hint) {
      els.hint.textContent = state.mode === 'daily'
        ? (copy.dailyHint || copy.hint || '')
        : (copy.hint || '');
    }
    if (els.mobileFlow) {
      if (state.phase === 'input') {
        els.mobileFlow.textContent = copy.mobileFlowInput || copy.mobileFlowReady || '';
      } else if (state.phase === 'showing') {
        els.mobileFlow.textContent = copy.mobileFlowWatch || copy.mobileFlowReady || '';
      } else if (state.phase === 'gameover') {
        els.mobileFlow.textContent = copy.mobileFlowGameover || copy.mobileFlowReady || '';
      } else {
        els.mobileFlow.textContent = copy.mobileFlowReady || '';
      }
    }
  }

  function syncPads() {
    els.pads.forEach((pad) => {
      const color = pad.dataset.color;
      pad.dataset.active = state.activeColor === color ? 'true' : 'false';
      pad.disabled = state.phase === 'showing' || state.phase === 'success';
    });
  }

  function syncPreview() {
    if (!els.next) return;
    els.next.innerHTML = '';
    state.sequence.slice(Math.max(0, state.inputIndex), Math.min(state.sequence.length, state.inputIndex + 3)).forEach((color) => {
      const chip = document.createElement('span');
      chip.className = 'sf-preview-chip';
      chip.innerHTML = `<span class="sf-preview-dot" data-color="${color}"></span>${copy[color + 'Label'] || color}`;
      els.next.appendChild(chip);
    });
    if (!els.next.children.length) {
      const idle = document.createElement('span');
      idle.className = 'sf-preview-chip';
      idle.textContent = copy.previewIdle || 'Watch first';
      els.next.appendChild(idle);
    }
  }

  function syncHud() {
    if (els.round) els.round.textContent = String(state.round);
    if (els.best) els.best.textContent = String(state.bestRound);
    if (els.dailyBest) els.dailyBest.textContent = String(state.dailyBest);
    if (els.streak) els.streak.textContent = state.phase === 'gameover' ? '0' : String(state.streak);
    if (els.speed) els.speed.textContent = `${Math.round(1000 / currentFlashMs())} /min`;
    if (els.start) {
      els.start.textContent = state.phase === 'input' && state.replayCharge > 0
        ? (copy.replayButton || 'Replay cue')
        : state.phase === 'gameover'
          ? (copy.restartButton || 'Restart')
          : (copy.startButton || 'Start');
      els.start.disabled = state.phase === 'showing' || state.phase === 'success';
    }
    if (els.daily) els.daily.textContent = copy.dailyButton || 'Daily challenge';
    if (els.reset) els.reset.textContent = copy.resetButton || 'Reset';
    setTag();
    setStatus(defaultStatus());
    updateHints();
    syncPreview();
    syncPads();
  }

  function clearPressed() {
    els.pads.forEach((pad) => {
      delete pad.dataset.pressed;
    });
  }

  function animatePad(color) {
    state.activeColor = color;
    syncPads();
  }

  function stopPad() {
    state.activeColor = null;
    syncPads();
  }

  function beginPlayback() {
    state.phase = 'showing';
    state.inputIndex = 0;
    state.playbackIndex = 0;
    state.playbackWaitingGap = false;
    state.playbackTimerMs = currentFlashMs();
    animatePad(state.sequence[0]);
    pulseDevice(10);
    syncHud();
  }

  function extendSequenceAndShow() {
    state.sequence.push(nextColorFromSeed());
    state.round = state.sequence.length;
    state.replayCharge = 1;
    beginPlayback();
  }

  function replaySequence() {
    if (!state.sequence.length) return render_game_to_text();
    state.replayCharge = Math.max(0, state.replayCharge - 1);
    beginPlayback();
    return render_game_to_text();
  }

  function resetGame(seed = DEFAULT_SEED, options = {}) {
    state.seed = normalizeSeed(seed);
    state.rng = createRng(state.seed);
    state.mode = options.mode === 'daily' ? 'daily' : 'free';
    state.sequence = [];
    state.round = 0;
    state.inputIndex = 0;
    state.streak = 0;
    state.playbackIndex = 0;
    state.playbackWaitingGap = false;
    state.playbackTimerMs = 0;
    state.pendingNextRound = false;
    state.pendingTimerMs = 0;
    state.dailyKey = dailyKeyForToday();
    state.replayCharge = 1;
    state.phase = 'ready';
    stopPad();
    clearPressed();
    syncHud();
    return render_game_to_text();
  }

  function startDaily() {
    const parts = state.dailyKey.split('-').map(Number);
    const seed = normalizeSeed((parts[0] * 10000) + (parts[1] * 100) + parts[2]);
    resetGame(seed, { mode: 'daily' });
    return startGame();
  }

  function startGame() {
    if (state.phase === 'input' && state.replayCharge > 0) {
      return replaySequence();
    }
    if (state.phase === 'ready' || state.phase === 'gameover') {
      if (state.phase === 'gameover') {
        const currentMode = state.mode;
        const currentSeed = state.seed;
        resetGame(currentSeed, { mode: currentMode });
      }
      extendSequenceAndShow();
      return render_game_to_text();
    }
    return render_game_to_text();
  }

  function finishInputSuccess() {
    state.phase = 'success';
    state.pendingNextRound = true;
    state.pendingTimerMs = Math.max(220, 360 - Math.min(120, state.round * 8));
    state.streak += 1;
    updateBest();
    pulseDevice(12);
    syncHud();
  }

  function failRound() {
    state.phase = 'gameover';
    state.streak = 0;
    stopPad();
    pulseDevice([20, 34, 18]);
    syncHud();
  }

  function pressPad(color) {
    if (state.phase === 'ready' || state.phase === 'gameover') {
      startGame();
      return render_game_to_text();
    }
    if (state.phase !== 'input') return render_game_to_text();
    const expected = state.sequence[state.inputIndex];
    animatePad(color);
    if (color === expected) {
      state.inputIndex += 1;
      if (state.inputIndex >= state.sequence.length) {
        finishInputSuccess();
      } else {
        syncHud();
      }
    } else {
      failRound();
    }
    return render_game_to_text();
  }

  function updateShowing(ms) {
    let remaining = ms;
    while (remaining > 0 && state.phase === 'showing') {
      const step = Math.min(remaining, state.playbackTimerMs);
      state.playbackTimerMs -= step;
      remaining -= step;
      if (state.playbackTimerMs > 0) continue;

      if (!state.playbackWaitingGap) {
        stopPad();
        state.playbackWaitingGap = true;
        state.playbackTimerMs = GAP_MS;
      } else {
        state.playbackWaitingGap = false;
        state.playbackIndex += 1;
        if (state.playbackIndex >= state.sequence.length) {
          state.phase = 'input';
          state.inputIndex = 0;
          stopPad();
          syncHud();
          break;
        }
        animatePad(state.sequence[state.playbackIndex]);
        state.playbackTimerMs = currentFlashMs();
      }
    }
  }

  function updateSuccess(ms) {
    const step = Math.min(ms, state.pendingTimerMs);
    state.pendingTimerMs -= step;
    if (state.pendingTimerMs <= 0 && state.pendingNextRound) {
      state.pendingNextRound = false;
      extendSequenceAndShow();
    }
  }

  function advanceTime(ms = 0) {
    const delta = Math.max(0, Number(ms || 0));
    if (state.phase === 'showing') {
      updateShowing(delta);
    } else if (state.phase === 'success') {
      updateSuccess(delta);
    }
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({
      slug: meta.slug || 'sequence-flash',
      mode: state.mode,
      phase: state.phase,
      round: state.round,
      bestRound: state.bestRound,
      dailyBest: state.dailyBest,
      streak: state.streak,
      replayCharge: state.replayCharge,
      seed: state.seed,
      dailyKey: state.dailyKey,
      sequenceLength: state.sequence.length,
      inputIndex: state.inputIndex,
      activeColor: state.activeColor,
      expectedNext: state.phase === 'input' ? state.sequence[state.inputIndex] : null,
      upcoming: state.sequence.slice(Math.max(0, state.inputIndex), Math.min(state.sequence.length, state.inputIndex + 3))
    });
  }

  function bind() {
    els.pads.forEach((pad) => {
      const color = pad.dataset.color;
      pad.addEventListener('click', () => pressPad(color));
      pad.addEventListener('pointerdown', () => {
        pad.dataset.pressed = 'true';
      });
      pad.addEventListener('pointerup', clearPressed);
      pad.addEventListener('pointercancel', clearPressed);
      pad.addEventListener('pointerleave', clearPressed);
    });
    if (els.start) els.start.addEventListener('click', startGame);
    if (els.daily) els.daily.addEventListener('click', startDaily);
    if (els.reset) els.reset.addEventListener('click', () => resetGame(state.seed, { mode: state.mode }));
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (key === 'r') {
        event.preventDefault();
        resetGame(state.seed, { mode: state.mode });
      } else if (key === 'd') {
        event.preventDefault();
        startDaily();
      } else if (key === ' ' || key === 'enter') {
        event.preventDefault();
        startGame();
      } else {
        const map = {
          '1': 'coral',
          '2': 'sky',
          '3': 'mint',
          '4': 'amber',
          'q': 'coral',
          'w': 'sky',
          'a': 'mint',
          's': 'amber'
        };
        if (map[key]) {
          event.preventDefault();
          pressPad(map[key]);
        }
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
