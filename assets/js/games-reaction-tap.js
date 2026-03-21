(() => {
  const DEFAULT_SEED = 0x52454143;
  const STORAGE_PREFIX = 'rlt-reaction-tap-v1';
  const MODE_CONFIGS = {
    classic: { id: 'classic', rounds: 1, waitMin: 900, waitMax: 1700, feedbackMs: 650 },
    sprint: { id: 'sprint', rounds: 5, waitMin: 760, waitMax: 1520, feedbackMs: 520 },
    daily: { id: 'daily', rounds: 5, waitMin: 820, waitMax: 1560, feedbackMs: 580 }
  };

  const copy = window.__REACTION_TAP_COPY__ || {};

  const targetEl = document.getElementById('reaction-tap-target');
  const kickerEl = document.getElementById('reaction-tap-kicker');
  const labelEl = document.getElementById('reaction-tap-label');
  const detailEl = document.getElementById('reaction-tap-detail');
  const statusEl = document.getElementById('reaction-tap-status');
  const modeNoteEl = document.getElementById('reaction-tap-mode-note');
  const progressEl = document.getElementById('reaction-tap-progress');
  const startBtn = document.getElementById('reaction-tap-start');
  const replayBtn = document.getElementById('reaction-tap-replay');
  const modeButtons = Array.from(document.querySelectorAll('[data-reaction-mode]'));

  const statEls = {
    hits: document.getElementById('reaction-tap-hits'),
    round: document.getElementById('reaction-tap-round'),
    fastest: document.getElementById('reaction-tap-fastest'),
    bestReaction: document.getElementById('reaction-tap-best-reaction'),
    average: document.getElementById('reaction-tap-average'),
    bestAverage: document.getElementById('reaction-tap-best-average'),
    streak: document.getElementById('reaction-tap-streak'),
    misses: document.getElementById('reaction-tap-misses')
  };

  const state = {
    mode: 'classic',
    phase: 'ready',
    seed: DEFAULT_SEED,
    dailyKey: '',
    rng: null,
    elapsedMs: 0,
    round: 0,
    totalRounds: 1,
    waitMs: 0,
    armedAtMs: 0,
    feedbackUntilMs: 0,
    pendingRound: 0,
    score: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    reactionTimes: [],
    lastReactionMs: 0,
    fastestMs: 0,
    averageMs: 0,
    bestReactionMs: 0,
    bestAverageMs: 0,
    qaReady: false
  };

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

  function createRng(seed) {
    let value = (seed >>> 0) || DEFAULT_SEED;
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  function normalizeMode(value) {
    const mode = String(value || '').trim().toLowerCase();
    return MODE_CONFIGS[mode] ? mode : 'classic';
  }

  function getModeConfig(mode = state.mode) {
    return MODE_CONFIGS[normalizeMode(mode)] || MODE_CONFIGS.classic;
  }

  function getModeLabel(mode = state.mode) {
    const labels = copy.modeLabels || {};
    const normalized = normalizeMode(mode);
    return labels[normalized] || normalized;
  }

  function getModeDescription(mode = state.mode) {
    const descriptions = copy.modeDescriptions || {};
    const normalized = normalizeMode(mode);
    return descriptions[normalized] || '';
  }

  function getModeNote(mode = state.mode) {
    const notes = copy.modeNotes || {};
    const normalized = normalizeMode(mode);
    return notes[normalized] || getModeDescription(normalized);
  }

  function getModeSeed(mode) {
    if (mode === 'daily') {
      return hashString(`reaction-tap:daily:${localDateKey()}`);
    }
    return hashString(`reaction-tap:${mode}`);
  }

  function resetRunStats() {
    state.score = 0;
    state.misses = 0;
    state.streak = 0;
    state.lastReactionMs = 0;
    state.fastestMs = 0;
    state.averageMs = 0;
    state.reactionTimes = [];
    state.waitMs = 0;
    state.armedAtMs = 0;
    state.feedbackUntilMs = 0;
    state.pendingRound = 0;
  }

  function formatMs(value) {
    return Number.isFinite(value) && value > 0 ? `${value} ms` : '—';
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function updateLiveBestMetrics() {
    if (!state.reactionTimes.length) return;
    const bestReaction = Math.min(...state.reactionTimes);
    const average = Math.round(state.reactionTimes.reduce((sum, value) => sum + value, 0) / state.reactionTimes.length);
    state.fastestMs = bestReaction;
    state.averageMs = average;
    state.bestReactionMs = state.bestReactionMs ? Math.min(state.bestReactionMs, bestReaction) : bestReaction;
    state.bestAverageMs = state.bestAverageMs ? Math.min(state.bestAverageMs, average) : average;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  }

  function syncModeButtons() {
    for (const button of modeButtons) {
      const buttonMode = normalizeMode(button.dataset.reactionMode);
      const active = buttonMode === state.mode;
      button.dataset.active = active ? 'true' : 'false';
      button.setAttribute('aria-pressed', String(active));
    }
  }

  function updateProgress() {
    if (!progressEl) return;
    const progress = state.phase === 'waiting' && state.waitMs > 0
      ? Math.min(1, Math.max(0, (state.elapsedMs - (state.armedAtMs - state.waitMs)) / state.waitMs))
      : 0;
    progressEl.style.setProperty('--progress', String(progress));
    progressEl.dataset.state = state.phase;
  }

  function renderStatusText() {
    const fallback = {
      ready: 'Tap the big button to begin.',
      waiting: 'Hold for the signal.',
      armed: 'Tap now.',
      feedback: state.pendingRound
        ? (state.lastReactionMs > 0 ? 'Nice tap. The next round starts soon.' : 'Too soon. Try again on the same board.')
        : 'Nice tap. Reviewing the result.',
      complete: 'Run complete. Replay to chase a cleaner score.'
    };
    return copy.statuses?.[state.phase] || fallback[state.phase] || fallback.ready;
  }

  function syncHud() {
    if (labelEl) {
      labelEl.textContent = `${getModeLabel()} · ${copy.phaseLabels?.[state.phase] || state.phase}`;
      labelEl.dataset.phase = state.phase;
      labelEl.dataset.mode = state.mode;
    }

    if (kickerEl) {
      const fallback = {
        ready: 'Tap to start',
        waiting: 'Wait for green',
        armed: 'Tap now',
        feedback: state.lastReactionMs > 0 ? 'Nice' : 'Too soon',
        complete: 'Replay'
      };
      kickerEl.textContent = copy.kickers?.[state.phase] || fallback[state.phase] || fallback.ready;
    }

    if (detailEl) {
      const phaseDetail = (() => {
        if (state.phase === 'waiting') {
          const remaining = Math.max(0, Math.ceil(state.armedAtMs - state.elapsedMs));
          return (copy.details?.waiting || 'Signal in {ms} ms.').replace('{ms}', String(remaining));
        }
        if (state.phase === 'armed') {
          return copy.details?.armed || 'The stage is live. Tap as fast as you can.';
        }
        if (state.phase === 'feedback') {
          return state.lastReactionMs > 0
            ? (copy.details?.hit || 'Reaction time: {ms} ms.').replace('{ms}', String(state.lastReactionMs))
            : (copy.details?.falseStart || 'Too soon. Wait for the next signal.');
        }
        if (state.phase === 'complete') {
          return state.mode === 'daily'
            ? (copy.details?.dailyComplete || 'Daily challenge complete. Come back tomorrow for the same seed.')
            : (copy.details?.complete || 'Replay the same mode to beat your previous run.');
        }
        return copy.details?.ready || 'One big tap target. Easy to start, quick to replay.';
      })();
      detailEl.textContent = phaseDetail;
    }

    if (modeNoteEl) modeNoteEl.textContent = getModeNote();
    if (statusEl) statusEl.textContent = renderStatusText();

    if (statEls.hits) statEls.hits.textContent = String(state.score);
    if (statEls.round) statEls.round.textContent = `${Math.min(Math.max(state.round, 0), state.totalRounds || 1)} / ${state.totalRounds || 1}`;
    if (statEls.fastest) statEls.fastest.textContent = formatMs(state.fastestMs);
    if (statEls.bestReaction) statEls.bestReaction.textContent = formatMs(state.bestReactionMs);
    if (statEls.average) statEls.average.textContent = formatMs(state.averageMs);
    if (statEls.bestAverage) statEls.bestAverage.textContent = formatMs(state.bestAverageMs);
    if (statEls.streak) statEls.streak.textContent = String(state.bestStreak || state.streak);
    if (statEls.misses) statEls.misses.textContent = String(state.misses);

    if (targetEl) {
      targetEl.dataset.phase = state.phase;
      targetEl.dataset.mode = state.mode;
      targetEl.setAttribute('aria-label', copy.targetAria || 'Reaction Tap target button');
    }

    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = copy.startButton || 'Start';
    }
    if (replayBtn) replayBtn.textContent = copy.replayButton || 'Replay';

    updateProgress();
  }

  function render() {
    syncModeButtons();
    syncHud();
  }

  function startRound(roundIndex) {
    const config = getModeConfig();
    state.round = roundIndex;
    state.waitMs = Math.round(config.waitMin + state.rng() * (config.waitMax - config.waitMin));
    state.armedAtMs = state.elapsedMs + state.waitMs;
    state.feedbackUntilMs = 0;
    state.pendingRound = 0;
    state.phase = 'waiting';
    setStatus(copy.statuses?.waiting || 'Hold for the signal.');
    render();
  }

  function beginRun() {
    if (state.phase === 'complete') {
      resetGame(state.mode);
    }
    if (state.phase !== 'ready') return render_game_to_text();
    state.totalRounds = getModeConfig().rounds;
    state.phase = 'waiting';
    startRound(1);
    return render_game_to_text();
  }

  function scheduleFeedback(nextRoundIndex, isHit, reactionMs = 0) {
    state.phase = 'feedback';
    state.pendingRound = nextRoundIndex;
    state.feedbackUntilMs = state.elapsedMs + getModeConfig().feedbackMs;
    state.lastReactionMs = reactionMs;
    setStatus(isHit ? (copy.statuses?.hit || 'Nice tap. The next round starts soon.') : (copy.statuses?.falseStart || 'Too soon. Try again on the same board.'));
    render();
  }

  function finishRun() {
    state.phase = 'complete';
    state.pendingRound = 0;
    setStatus(copy.statuses?.complete || 'Run complete. Replay to chase a cleaner score.');
    render();
  }

  function recordTap() {
    if (state.phase === 'ready') {
      return beginRun();
    }

    if (state.phase === 'waiting') {
      state.misses += 1;
      state.streak = 0;
      scheduleFeedback(state.round, false, 0);
      return render_game_to_text();
    }

    if (state.phase === 'armed') {
      const reactionMs = Math.max(0, Math.round(state.elapsedMs - state.armedAtMs));
      state.score += 1;
      state.streak += 1;
      state.reactionTimes.push(reactionMs);
      state.fastestMs = Math.min(...state.reactionTimes);
      state.averageMs = Math.round(state.reactionTimes.reduce((sum, value) => sum + value, 0) / state.reactionTimes.length);
      updateLiveBestMetrics();

      const nextRound = state.round + 1;
      if (nextRound > state.totalRounds) {
        scheduleFeedback(0, true, reactionMs);
      } else {
        scheduleFeedback(nextRound, true, reactionMs);
      }
      return render_game_to_text();
    }

    if (state.phase === 'feedback') {
      if (state.pendingRound) {
        startRound(state.pendingRound);
      }
      return render_game_to_text();
    }

    if (state.phase === 'complete') {
      resetGame(state.mode);
      return beginRun();
    }

    return render_game_to_text();
  }

  function setMode(mode) {
    const nextMode = normalizeMode(mode);
    resetGame(nextMode);
    return render_game_to_text();
  }

  function resetGame(mode = state.mode) {
    state.mode = normalizeMode(mode);
    state.dailyKey = localDateKey();
    state.seed = state.mode === 'daily' ? getModeSeed('daily') : getModeSeed(state.mode);
    state.rng = createRng(state.seed);
    state.phase = 'ready';
    state.elapsedMs = 0;
    state.round = 0;
    state.totalRounds = getModeConfig(state.mode).rounds;
    resetRunStats();
    state.bestReactionMs = 0;
    state.bestAverageMs = 0;
    state.bestStreak = 0;
    state.qaReady = true;
    setStatus(copy.statuses?.ready || 'Tap the big button to begin.');
    render();
    return render_game_to_text();
  }

  function advanceTimeline() {
    let guard = 0;
    while (guard < 20) {
      guard += 1;
      if (state.phase === 'waiting' && state.elapsedMs >= state.armedAtMs) {
        state.phase = 'armed';
        setStatus(copy.statuses?.armed || 'Tap now.');
        render();
        continue;
      }
      if (state.phase === 'feedback' && state.elapsedMs >= state.feedbackUntilMs) {
        if (state.pendingRound > 0 && state.pendingRound <= state.totalRounds) {
          startRound(state.pendingRound);
          continue;
        }
        finishRun();
        continue;
      }
      break;
    }
    render();
    return render_game_to_text();
  }

  function advanceTime(ms) {
    const delta = Number(ms) || 0;
    if (delta > 0) state.elapsedMs += delta;
    return advanceTimeline();
  }

  function render_game_to_text() {
    const timeLeftMs = state.phase === 'waiting' ? Math.max(0, Math.ceil(state.armedAtMs - state.elapsedMs)) : 0;
    const payload = {
      game: 'reaction-tap',
      mode: state.mode,
      phase: state.phase,
      round: state.round,
      totalRounds: state.totalRounds,
      seed: state.seed,
      dailyKey: state.dailyKey,
      elapsedMs: state.elapsedMs,
      waitMs: state.waitMs,
      timeLeftMs,
      timeLeft: timeLeftMs,
      timer: timeLeftMs,
      signalInMs: timeLeftMs,
      score: state.score,
      misses: state.misses,
      streak: state.streak,
      bestStreak: state.bestStreak,
      lastReactionMs: state.lastReactionMs,
      fastestMs: state.fastestMs,
      averageMs: state.averageMs,
      bestReactionMs: state.bestReactionMs,
      bestAverageMs: state.bestAverageMs,
      qaReady: state.qaReady
    };
    return JSON.stringify(payload);
  }

  function handleKeydown(event) {
    const key = String(event.key || '').toLowerCase();
    if (key === ' ' || key === 'spacebar' || key === 'enter') {
      event.preventDefault();
      recordTap();
      return;
    }
    if (key === 'r') {
      event.preventDefault();
      resetGame(state.mode);
      return;
    }
    if (key === '1') {
      event.preventDefault();
      setMode('classic');
      return;
    }
    if (key === '2') {
      event.preventDefault();
      setMode('sprint');
      return;
    }
    if (key === '3') {
      event.preventDefault();
      setMode('daily');
      return;
    }
    if (key === 'arrowleft' || key === 'arrowup') {
      event.preventDefault();
      const modes = ['classic', 'sprint', 'daily'];
      const index = modes.indexOf(state.mode);
      setMode(modes[(index + modes.length - 1) % modes.length]);
      return;
    }
    if (key === 'arrowright' || key === 'arrowdown') {
      event.preventDefault();
      const modes = ['classic', 'sprint', 'daily'];
      const index = modes.indexOf(state.mode);
      setMode(modes[(index + 1) % modes.length]);
    }
  }

  function bindEvents() {
    if (targetEl) targetEl.addEventListener('click', recordTap);
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (state.phase === 'ready' || state.phase === 'complete') {
          beginRun();
          return;
        }
        if (state.phase === 'feedback' && state.pendingRound) {
          startRound(state.pendingRound);
        }
      });
    }
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        resetGame(state.mode);
        beginRun();
      });
    }
    for (const button of modeButtons) {
      button.addEventListener('click', () => setMode(button.dataset.reactionMode));
    }
    window.addEventListener('keydown', handleKeydown);
  }

  function init() {
    bindEvents();
    resetGame('classic');
    window.__WEBGAME_QA_READY__ = true;
    window.QA_READY = true;
    window.render_game_to_text = render_game_to_text;
    window.advanceTime = advanceTime;
    window.resetGame = resetGame;
    window.reset = () => resetGame('classic');
    window.setReactionTapMode = setMode;
    window.beginReactionTapRun = beginRun;
  }

  init();
})();
