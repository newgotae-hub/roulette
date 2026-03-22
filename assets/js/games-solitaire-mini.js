(() => {
  const SUITS = ['spades', 'hearts', 'clubs', 'diamonds'];
  const SUIT_GLYPH = {
    spades: '\u2660',
    hearts: '\u2665',
    clubs: '\u2663',
    diamonds: '\u2666'
  };
  const SUIT_COLOR = { spades: 'black', clubs: 'black', hearts: 'red', diamonds: 'red' };
  const RANK_LABELS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const DEFAULT_SEED = 0x5a1f0a11;
  const CLASSIC_KEY = 'classic';
  const TIMED_KEY = 'timed';
  const DAILY_KEY = 'daily';
  const TIME_LIMIT_MS = 60000;

  const copy = window.__SOLITAIRE_MINI_COPY__ || {};
  const meta = window.__SOLITAIRE_MINI_META__ || {};

  const els = {
    mode: document.getElementById('solitaire-mini-mode'),
    phase: document.getElementById('solitaire-mini-phase'),
    dailyKey: document.getElementById('solitaire-mini-daily-key'),
    seed: document.getElementById('solitaire-mini-seed-chip'),
    score: document.getElementById('solitaire-mini-score'),
    moves: document.getElementById('solitaire-mini-moves'),
    stock: document.getElementById('solitaire-mini-stock'),
    waste: document.getElementById('solitaire-mini-waste'),
    foundationCount: document.getElementById('solitaire-mini-foundation-count'),
    tableauFaceUp: document.getElementById('solitaire-mini-tableau-face-up'),
    timer: document.getElementById('solitaire-mini-timer'),
    undoAvailable: document.getElementById('solitaire-mini-undo-available'),
    status: document.getElementById('solitaire-mini-status'),
    foundations: document.getElementById('solitaire-mini-foundations'),
    piles: document.getElementById('solitaire-mini-piles'),
    tableau: document.getElementById('solitaire-mini-tableau')
  };

  const buttons = {
    classic: document.getElementById('solitaire-mini-classic'),
    timed: document.getElementById('solitaire-mini-timed'),
    daily: document.getElementById('solitaire-mini-daily'),
    draw: document.getElementById('solitaire-mini-draw'),
    auto: document.getElementById('solitaire-mini-auto'),
    undo: document.getElementById('solitaire-mini-undo'),
    reset: document.getElementById('solitaire-mini-reset')
  };

  const state = {
    mode: CLASSIC_KEY,
    phase: 'ready',
    score: 0,
    moves: 0,
    seed: DEFAULT_SEED,
    dailyKey: '',
    timeLimitMs: 0,
    elapsedMs: 0,
    timeLeftMs: 0,
    stock: [],
    waste: [],
    foundations: [],
    tableau: [],
    selected: null,
    history: [],
    undoAvailable: false,
    autoMoveAvailable: false,
    hint: '',
    gameOver: false
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

  function dailySeed() {
    return hashString(`solitaire-mini:${localDateKey()}`);
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

  function makeCard(suit, rank) {
    return {
      suit,
      rank,
      label: `${RANK_LABELS[rank - 1]}${SUIT_GLYPH[suit]}`,
      color: SUIT_COLOR[suit]
    };
  }

  function cloneCard(card) {
    return card ? { ...card } : null;
  }

  function makeDeck(seed) {
    const deck = [];
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank += 1) deck.push(makeCard(suit, rank));
    }
    const rng = createRng(seed);
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(rng() * (index + 1));
      [deck[index], deck[swap]] = [deck[swap], deck[index]];
    }
    return deck;
  }

  function createFoundations() {
    return SUITS.map((suit) => ({ suit, cards: [] }));
  }

  function createTableau(deck) {
    const tableau = [];
    for (let pileIndex = 0; pileIndex < 7; pileIndex += 1) {
      const cards = [];
      for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex += 1) {
        const card = cloneCard(deck.shift());
        card.faceUp = cardIndex === pileIndex;
        cards.push(card);
      }
      tableau.push(cards);
    }
    return tableau;
  }

  function createState(mode = CLASSIC_KEY, seed = DEFAULT_SEED) {
    const actualMode = mode === DAILY_KEY ? DAILY_KEY : (mode === TIMED_KEY ? TIMED_KEY : CLASSIC_KEY);
    const actualSeed = actualMode === DAILY_KEY ? dailySeed() : normalizeSeed(seed);
    const deck = makeDeck(actualSeed);
    const tableau = createTableau(deck);
    return {
      mode: actualMode,
      phase: 'ready',
      score: 0,
      moves: 0,
      seed: actualSeed,
      dailyKey: localDateKey(),
      timeLimitMs: actualMode === CLASSIC_KEY ? 0 : TIME_LIMIT_MS,
      elapsedMs: 0,
      timeLeftMs: actualMode === CLASSIC_KEY ? 0 : TIME_LIMIT_MS,
      stock: deck,
      waste: [],
      foundations: createFoundations(),
      tableau,
      selected: null,
      history: [],
      undoAvailable: false,
      autoMoveAvailable: false,
      hint: '',
      gameOver: false
    };
  }

  function foundationCount() {
    return state.foundations.reduce((total, pile) => total + pile.cards.length, 0);
  }

  function tableauFaceUpCount() {
    return state.tableau.reduce((total, pile) => total + pile.filter((card) => card.faceUp).length, 0);
  }

  function wasteTop() {
    return state.waste.length ? state.waste[state.waste.length - 1].label : '-';
  }

  function foundationTop() {
    return state.foundations.map((pile) => (pile.cards.length ? pile.cards[pile.cards.length - 1].label : '-'));
  }

  function cardColor(card) {
    return card.color === 'red' ? 'red' : 'black';
  }

  function cardCanGoToFoundation(card, foundation) {
    if (!card) return false;
    if (!foundation.cards.length) return card.rank === 1;
    const top = foundation.cards[foundation.cards.length - 1];
    return top.suit === card.suit && card.rank === top.rank + 1;
  }

  function cardCanGoToTableau(card, pile) {
    if (!card) return false;
    if (!pile.length) return card.rank === 13;
    const top = pile[pile.length - 1];
    return top.faceUp && cardColor(top) !== cardColor(card) && card.rank === top.rank - 1;
  }

  function topFaceUpCard(pile) {
    for (let index = pile.length - 1; index >= 0; index -= 1) {
      if (pile[index].faceUp) return { card: pile[index], index };
    }
    return null;
  }

  function sequenceFromPile(pile, startIndex) {
    return pile.slice(startIndex);
  }

  function isDescendingAlternating(cards) {
    if (!cards.length) return false;
    for (let index = 0; index < cards.length - 1; index += 1) {
      const current = cards[index];
      const next = cards[index + 1];
      if (!current.faceUp || !next.faceUp) return false;
      if (current.rank !== next.rank + 1) return false;
      if (cardColor(current) === cardColor(next)) return false;
    }
    return true;
  }

  function cloneStateSnapshot() {
    return JSON.parse(JSON.stringify({
      mode: state.mode,
      phase: state.phase,
      score: state.score,
      moves: state.moves,
      seed: state.seed,
      dailyKey: state.dailyKey,
      timeLimitMs: state.timeLimitMs,
      elapsedMs: state.elapsedMs,
      timeLeftMs: state.timeLeftMs,
      stock: state.stock,
      waste: state.waste,
      foundations: state.foundations,
      tableau: state.tableau,
      selected: state.selected,
      undoAvailable: state.undoAvailable,
      autoMoveAvailable: state.autoMoveAvailable,
      hint: state.hint,
      gameOver: state.gameOver
    }));
  }

  function restoreSnapshot(snapshot) {
    Object.assign(state, JSON.parse(JSON.stringify(snapshot)));
  }

  function captureHistory() {
    state.history.push(cloneStateSnapshot());
    state.undoAvailable = state.history.length > 0;
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'won') return copy.wonLabel || 'Won';
    if (state.phase === 'timeout') return copy.timeoutLabel || 'Timeout';
    if (state.phase === 'stuck') return copy.stuckLabel || 'Stuck';
    return copy.readyLabel || 'Ready';
  }

  function modeLabel() {
    if (state.mode === DAILY_KEY) return copy.dailyModeLabel || 'Daily challenge';
    if (state.mode === TIMED_KEY) return copy.timedModeLabel || 'Timed';
    return copy.classicModeLabel || 'Classic';
  }

  function statusText() {
    if (state.phase === 'won') return copy.wonStatus || 'All foundations are complete.';
    if (state.phase === 'timeout') return copy.timeoutStatus || 'Time is up. Start a new deal and try again.';
    if (state.phase === 'stuck') return copy.stuckStatus || 'No useful move is left.';
    if (state.selected) return copy.selectedStatus || 'Select a target pile or foundation.';
    if (state.mode === DAILY_KEY) return copy.dailyReadyStatus || 'Daily mode uses today?셲 shared seed.';
    if (state.mode === TIMED_KEY) return copy.timedReadyStatus || 'Timed mode gives you one minute to finish the board.';
    return copy.readyStatus || 'Draw a card, then try to move it to a foundation.';
  }

  function updateModeButtons() {
    Object.entries({ classic: buttons.classic, timed: buttons.timed, daily: buttons.daily }).forEach(([mode, button]) => {
      if (!button) return;
      button.dataset.active = String(state.mode === mode);
    });
  }

  function suitGlyph(suit) {
    return SUIT_GLYPH[suit] || '?';
  }

  function buildFoundationView() {
    if (!els.foundations) return;
    els.foundations.innerHTML = '';
    SUITS.forEach((suit, index) => {
      const foundation = state.foundations[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sm-foundation';
      button.id = `solitaire-mini-foundation-${index}`;
      button.dataset.source = 'foundation';
      button.dataset.index = String(index);
      button.setAttribute('aria-label', `${suit} foundation`);
      button.innerHTML = `
        <span class="sm-slot-label">${suitGlyph(suit)}</span>
        <strong>${foundation.cards.length ? foundation.cards[foundation.cards.length - 1].label : `A${suitGlyph(suit)}`}</strong>
      `;
      if (state.selected && state.selected.source === 'foundation' && state.selected.index === index) {
        button.dataset.selected = 'true';
      }
      els.foundations.appendChild(button);
    });
  }

  function buildPileView() {
    if (!els.piles) return;
    els.piles.innerHTML = '';

    const stockButton = document.createElement('button');
    stockButton.type = 'button';
    stockButton.className = 'sm-pile';
    stockButton.id = 'solitaire-mini-draw';
    stockButton.dataset.source = 'stock';
    stockButton.innerHTML = `
      <span class="sm-slot-label">${copy.stockLabel || 'Stock'}</span>
      <strong>${state.stock.length}</strong>
      <span class="sm-slot-detail">${state.stock.length ? (copy.drawLabel || 'Draw') : (copy.recycleLabel || 'Recycle')}</span>
    `;
    els.piles.appendChild(stockButton);

    const wasteButton = document.createElement('button');
    wasteButton.type = 'button';
    wasteButton.className = 'sm-pile sm-pile-waste';
    wasteButton.id = 'solitaire-mini-waste';
    wasteButton.dataset.source = 'waste';
    const wasteCard = state.waste.length ? state.waste[state.waste.length - 1] : null;
    wasteButton.innerHTML = `
      <span class="sm-slot-label">${copy.wasteLabel || 'Waste'}</span>
      <strong>${wasteCard ? wasteCard.label : '—'}</strong>
      <span class="sm-slot-detail">${wasteCard ? (copy.wasteTopLabel || 'Top card') : (copy.emptyWasteLabel || 'Empty')}</span>
    `;
    if (state.selected && state.selected.source === 'waste') wasteButton.dataset.selected = 'true';
    els.piles.appendChild(wasteButton);

    state.foundations.forEach((foundation, index) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'sm-pile sm-pile-foundation';
      slot.dataset.source = 'foundation';
      slot.dataset.index = String(index);
      slot.innerHTML = `
        <span class="sm-slot-label">${suitGlyph(foundation.suit)}</span>
        <strong>${foundation.cards.length ? foundation.cards[foundation.cards.length - 1].label : `A${suitGlyph(foundation.suit)}`}</strong>
        <span class="sm-slot-detail">${foundation.cards.length ? `${foundation.cards.length}/13` : (copy.foundationStartLabel || 'Start foundation')}</span>
      `;
      if (state.selected && state.selected.source === 'foundation' && state.selected.index === index) {
        slot.dataset.selected = 'true';
      }
      els.piles.appendChild(slot);
    });
  }

  function buildTableauView() {
    if (!els.tableau) return;
    els.tableau.innerHTML = '';
    state.tableau.forEach((pile, pileIndex) => {
      const column = document.createElement('div');
      column.className = 'sm-column';
      const visibleCount = pile.filter((card) => card.faceUp).length;
      column.style.minHeight = `${Math.max(160, 88 + (pile.length * 12) + (visibleCount * 24))}px`;
      pile.forEach((card, cardIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sm-card';
        button.dataset.source = 'tableau';
        button.dataset.pile = String(pileIndex);
        button.dataset.index = String(cardIndex);
        button.disabled = !card.faceUp;
        button.style.top = `${cardIndex * 20}px`;
        button.style.zIndex = String(cardIndex + 1);
        button.classList.add(card.faceUp ? 'is-face-up' : 'is-face-down');
        if (card.faceUp) {
          button.innerHTML = `
            <span class="sm-card-rank">${card.label.replace(/[?졻솯?ｂ솱]/, '')}</span>
            <span class="sm-card-suit" data-color="${cardColor(card)}">${SUIT_GLYPH[card.suit]}</span>
          `;
          button.setAttribute('aria-label', `${card.label} ${copy.faceUpLabel || 'face up'}`);
        } else {
          button.innerHTML = `<span class="sm-card-back"></span>`;
          button.setAttribute('aria-label', copy.faceDownLabel || 'face down card');
        }
        if (state.selected && state.selected.source === 'tableau' && state.selected.pile === pileIndex && state.selected.index === cardIndex) {
          button.dataset.selected = 'true';
        }
        column.appendChild(button);
      });
      column.dataset.pile = String(pileIndex);
      column.dataset.faceUp = String(visibleCount);
      column.setAttribute('aria-label', `${copy.tableauPileLabel || 'Tableau pile'} ${pileIndex + 1}`);
      els.tableau.appendChild(column);
    });
  }

  function updateHud() {
    if (els.mode) els.mode.textContent = modeLabel();
    if (els.phase) els.phase.textContent = phaseLabel();
    if (els.dailyKey) els.dailyKey.textContent = `${copy.dailyLabel || 'daily'}: ${state.dailyKey || localDateKey()}`;
    if (els.seed) els.seed.textContent = `${copy.seedLabel || 'seed'}: ${state.seed}`;
    if (els.score) els.score.textContent = String(state.score);
    if (els.moves) els.moves.textContent = String(state.moves);
    if (els.stock) els.stock.textContent = String(state.stock.length);
    if (els.waste) els.waste.textContent = String(state.waste.length);
    if (els.foundationCount) els.foundationCount.textContent = String(foundationCount());
    if (els.tableauFaceUp) els.tableauFaceUp.textContent = String(tableauFaceUpCount());
    if (els.timer) {
      els.timer.textContent = state.timeLimitMs ? `${Math.max(0, Math.ceil(state.timeLeftMs / 1000))}s` : (copy.timerOffLabel || 'off');
    }
    if (els.undoAvailable) els.undoAvailable.textContent = String(state.undoAvailable);
    if (buttons.draw) buttons.draw.textContent = copy.drawButton || 'Draw';
    if (buttons.auto) {
      buttons.auto.textContent = copy.autoButton || 'Auto';
      buttons.auto.disabled = !state.autoMoveAvailable;
    }
    if (buttons.undo) {
      buttons.undo.textContent = copy.undoButton || 'Undo';
      buttons.undo.disabled = !state.undoAvailable;
    }
    if (buttons.reset) buttons.reset.textContent = copy.resetButton || 'Reset';
    updateModeButtons();
    buildFoundationView();
    buildPileView();
    buildTableauView();
    setStatus(statusText());
  }

  function updateAutoMoveAvailable() {
    const wasteCard = state.waste[state.waste.length - 1];
    let available = false;
    if (wasteCard) {
      const foundation = state.foundations.find((pile) => pile.suit === wasteCard.suit);
      if (foundation && cardCanGoToFoundation(wasteCard, foundation)) available = true;
    }
    if (!available) {
      for (let pileIndex = 0; pileIndex < state.tableau.length; pileIndex += 1) {
        const top = topFaceUpCard(state.tableau[pileIndex]);
        if (!top) continue;
        const foundation = state.foundations.find((pile) => pile.suit === top.card.suit);
        if (foundation && cardCanGoToFoundation(top.card, foundation)) {
          available = true;
          break;
        }
      }
    }
    state.autoMoveAvailable = available;
  }

  function evaluatePhase() {
    if (state.timeLimitMs > 0 && state.timeLeftMs <= 0) {
      state.phase = 'timeout';
      state.gameOver = true;
      return;
    }
    if (foundationCount() === 52) {
      state.phase = 'won';
      state.gameOver = true;
      return;
    }
    updateAutoMoveAvailable();
    const canDraw = state.stock.length > 0 || state.waste.length > 0;
    const hasTableauMove = state.tableau.some((pile, index) => {
      const top = topFaceUpCard(pile);
      if (!top) return false;
      const canMoveToTableau = state.tableau.some((otherPile, otherIndex) => {
        if (otherIndex === index) return false;
        return cardCanGoToTableau(top.card, otherPile);
      });
      const canMoveToFoundation = state.foundations.some((foundation) => cardCanGoToFoundation(top.card, foundation));
      return canMoveToTableau || canMoveToFoundation;
    });
    if (!canDraw && !hasTableauMove && !state.autoMoveAvailable && !state.selected) {
      state.phase = 'stuck';
      state.gameOver = true;
      return;
    }
    state.phase = state.moves === 0 && !state.selected ? 'ready' : 'playing';
  }

  function drawCard() {
    if (state.phase === 'won' || state.phase === 'timeout') return render_game_to_text();
    captureHistory();
    state.selected = null;
    if (!state.stock.length) {
      if (!state.waste.length) {
        state.phase = 'stuck';
        state.gameOver = true;
        state.hint = copy.emptyStockHint || 'No cards are left to draw.';
        updateHud();
        return render_game_to_text();
      }
      state.stock = state.waste.slice().reverse().map(cloneCard);
      state.waste = [];
    }
    const card = cloneCard(state.stock.shift());
    state.waste.push(card);
    state.moves += 1;
    state.phase = 'playing';
    state.hint = `${copy.drawnLabel || 'Drew'} ${card.label}.`;
    evaluatePhase();
    updateHud();
    return render_game_to_text();
  }

  function moveWasteToFoundation(index) {
    const card = state.waste[state.waste.length - 1];
    if (!card) return false;
    const foundation = state.foundations[index];
    if (!cardCanGoToFoundation(card, foundation)) return false;
    state.waste.pop();
    foundation.cards.push(card);
    state.moves += 1;
    state.score += 10;
    state.selected = null;
    state.hint = `${card.label} moved to the foundation.`;
    return true;
  }

  function moveWasteToTableau(targetPileIndex) {
    const card = state.waste[state.waste.length - 1];
    if (!card) return false;
    const targetPile = state.tableau[targetPileIndex];
    if (!cardCanGoToTableau(card, targetPile)) return false;
    state.waste.pop();
    targetPile.push({ ...card, faceUp: true });
    state.moves += 1;
    state.score += 5;
    state.selected = null;
    state.hint = `${card.label} moved to tableau ${targetPileIndex + 1}.`;
    return true;
  }

  function moveTableauToFoundation(sourcePileIndex, cardIndex, foundationIndex) {
    const pile = state.tableau[sourcePileIndex];
    const foundation = state.foundations[foundationIndex];
    const moving = pile.slice(cardIndex);
    const topCard = moving[moving.length - 1];
    if (!topCard || !topCard.faceUp || !cardCanGoToFoundation(topCard, foundation) || moving.length !== 1) return false;
    pile.splice(cardIndex, 1);
    if (pile.length && !pile[pile.length - 1].faceUp) pile[pile.length - 1].faceUp = true;
    foundation.cards.push(topCard);
    state.moves += 1;
    state.score += 10;
    state.selected = null;
    state.hint = `${topCard.label} moved to the foundation.`;
    return true;
  }

  function moveTableauToTableau(sourcePileIndex, cardIndex, targetPileIndex) {
    if (sourcePileIndex === targetPileIndex) return false;
    const sourcePile = state.tableau[sourcePileIndex];
    const targetPile = state.tableau[targetPileIndex];
    const moving = sequenceFromPile(sourcePile, cardIndex);
    if (!moving.length || !moving[0].faceUp || !isDescendingAlternating(moving)) return false;
    const topCard = moving[0];
    if (!cardCanGoToTableau(topCard, targetPile)) return false;
    sourcePile.splice(cardIndex, moving.length);
    if (sourcePile.length && !sourcePile[sourcePile.length - 1].faceUp) sourcePile[sourcePile.length - 1].faceUp = true;
    targetPile.push(...moving);
    state.moves += 1;
    state.score += moving.length > 1 ? 8 : 5;
    state.selected = null;
    state.hint = `${topCard.label} moved to tableau ${targetPileIndex + 1}.`;
    return true;
  }

  function selectCard(source) {
    state.selected = source;
    state.hint = source.source === 'waste'
      ? (copy.wasteSelectedHint || 'Waste card selected. Pick a valid target.')
      : (copy.tableauSelectedHint || 'Tableau card selected. Pick a valid target.');
  }

  function clearSelection() {
    state.selected = null;
  }

  function handleCardClick(target) {
    if (state.phase === 'won' || state.phase === 'timeout') return;
    const source = target.dataset.source;
    if (source === 'waste') {
      const top = state.waste[state.waste.length - 1];
      if (!top) return;
      if (!state.selected) {
        selectCard({ source: 'waste', index: state.waste.length - 1 });
        updateHud();
        return;
      }
      if (state.selected.source === 'waste' && state.selected.index === state.waste.length - 1) {
        clearSelection();
        updateHud();
        return;
      }
      captureHistory();
      let moved = false;
      moved = moveWasteToFoundation(0);
      if (!moved) moved = state.tableau.some((_, pileIndex) => moveWasteToTableau(pileIndex));
      if (!moved) {
        clearSelection();
        state.hint = copy.invalidTargetHint || 'That target does not accept this card.';
      }
      evaluatePhase();
      updateHud();
      return;
    }

    if (source === 'foundation') {
      const foundationIndex = Number(target.dataset.index);
      if (Number.isNaN(foundationIndex) || !state.selected) return;
      captureHistory();
      let moved = false;
      if (state.selected.source === 'waste') moved = moveWasteToFoundation(foundationIndex);
      else if (state.selected.source === 'tableau') moved = moveTableauToFoundation(state.selected.pile, state.selected.index, foundationIndex);
      if (!moved) state.hint = copy.invalidTargetHint || 'That target does not accept this card.';
      evaluatePhase();
      updateHud();
      return;
    }

    if (source === 'tableau') {
      const pileIndex = Number(target.dataset.pile);
      const cardIndex = Number(target.dataset.index);
      if (Number.isNaN(pileIndex) || Number.isNaN(cardIndex)) return;
      const pile = state.tableau[pileIndex];
      const card = pile[cardIndex];
      if (!card || !card.faceUp) return;
      if (!state.selected) {
        selectCard({ source: 'tableau', pile: pileIndex, index: cardIndex });
        updateHud();
        return;
      }
      captureHistory();
      let moved = false;
      if (state.selected.source === 'waste') {
        if (cardIndex === pile.length - 1) {
          moved = moveWasteToTableau(pileIndex);
        }
      } else if (state.selected.source === 'tableau') {
        if (state.selected.pile === pileIndex && state.selected.index === cardIndex) {
          clearSelection();
          state.history.pop();
          state.undoAvailable = state.history.length > 0;
          updateHud();
          return;
        }
        moved = moveTableauToTableau(state.selected.pile, state.selected.index, pileIndex);
      }
      if (!moved) state.hint = copy.invalidTargetHint || 'That target does not accept this card.';
      evaluatePhase();
      updateHud();
    }
  }

  function autoMove() {
    if (state.phase === 'won' || state.phase === 'timeout') return render_game_to_text();
    captureHistory();
    let moved = false;
    let movedSomething = true;
    while (movedSomething) {
      movedSomething = false;
      const wasteCard = state.waste[state.waste.length - 1];
      if (wasteCard) {
        const foundationIndex = SUITS.indexOf(wasteCard.suit);
        const foundation = state.foundations[foundationIndex];
        if (cardCanGoToFoundation(wasteCard, foundation)) {
          movedSomething = moveWasteToFoundation(foundationIndex);
          moved = movedSomething || moved;
          continue;
        }
      }
      for (let pileIndex = 0; pileIndex < state.tableau.length; pileIndex += 1) {
        const pile = state.tableau[pileIndex];
        const top = topFaceUpCard(pile);
        if (!top) continue;
        const foundationIndex = SUITS.indexOf(top.card.suit);
        const foundation = state.foundations[foundationIndex];
        if (cardCanGoToFoundation(top.card, foundation)) {
          movedSomething = moveTableauToFoundation(pileIndex, top.index, foundationIndex);
          moved = movedSomething || moved;
          break;
        }
      }
    }
    state.selected = null;
    if (!moved) {
      state.hint = copy.autoMoveHint || 'No automatic move is available.';
      if (state.history.length) {
        state.history.pop();
        state.undoAvailable = state.history.length > 0;
      }
    } else {
      state.hint = copy.autoMoveDoneHint || 'Auto move finished.';
    }
    evaluatePhase();
    updateHud();
    return render_game_to_text();
  }

  function undo() {
    if (!state.history.length) return render_game_to_text();
    const snapshot = state.history.pop();
    restoreSnapshot(snapshot);
    state.undoAvailable = state.history.length > 0;
    updateAutoMoveAvailable();
    updateHud();
    return render_game_to_text();
  }

  function setMode(mode) {
    const nextMode = mode === DAILY_KEY ? DAILY_KEY : (mode === TIMED_KEY ? TIMED_KEY : CLASSIC_KEY);
    const seed = nextMode === DAILY_KEY ? dailySeed() : (nextMode === TIMED_KEY ? (state.seed || DEFAULT_SEED) : DEFAULT_SEED);
    Object.assign(state, createState(nextMode, seed));
    state.history = [];
    state.undoAvailable = false;
    updateAutoMoveAvailable();
    updateHud();
    return render_game_to_text();
  }

  function resetGame(seed = DEFAULT_SEED, options = {}) {
    const mode = options.mode || CLASSIC_KEY;
    const nextMode = mode === DAILY_KEY ? DAILY_KEY : (mode === TIMED_KEY ? TIMED_KEY : CLASSIC_KEY);
    const actualSeed = nextMode === DAILY_KEY ? dailySeed() : normalizeSeed(seed);
    Object.assign(state, createState(nextMode, actualSeed));
    state.dailyKey = localDateKey();
    state.history = [];
    updateAutoMoveAvailable();
    updateHud();
    return render_game_to_text();
  }

  function advanceTime(ms) {
    const delta = Math.max(0, Number(ms || 0));
    if (state.timeLimitMs > 0 && state.phase !== 'won' && state.phase !== 'timeout') {
      state.elapsedMs += delta;
      state.timeLeftMs = Math.max(0, state.timeLimitMs - state.elapsedMs);
      if (state.timeLeftMs <= 0) {
        state.phase = 'timeout';
        state.gameOver = true;
      }
    }
    updateAutoMoveAvailable();
    updateHud();
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({
      game: 'solitaire-mini',
      mode: state.mode,
      phase: state.phase,
      score: state.score,
      moves: state.moves,
      stockCount: state.stock.length,
      wasteCount: state.waste.length,
      foundationCount: foundationCount(),
      tableauFaceUp: tableauFaceUpCount(),
      timeLimitMs: state.timeLimitMs,
      elapsedMs: state.elapsedMs,
      timeLeftMs: state.timeLeftMs,
      timeLeft: Math.ceil(state.timeLeftMs / 1000),
      timer: Math.ceil(state.timeLeftMs / 1000),
      seed: state.seed,
      dailyKey: state.dailyKey,
      wasteTop: wasteTop(),
      foundationTop: foundationTop(),
      tableau: state.tableau.map((pile, index) => ({
        index,
        cards: pile.map((card) => ({
          label: card.label,
          suit: card.suit,
          rank: card.rank,
          faceUp: Boolean(card.faceUp)
        })),
        faceUp: pile.filter((card) => card.faceUp).length,
        top: pile.length ? pile[pile.length - 1].label : '-'
      })),
      undoAvailable: state.undoAvailable,
      autoMoveAvailable: state.autoMoveAvailable,
      qaReady: true
    });
  }

  function handleBoardClick(event) {
    const target = event.target.closest('[data-source]');
    if (!target || target.disabled) return;
    if (target.dataset.source === 'stock') {
      drawCard();
      return;
    }
    handleCardClick(target);
  }

  function bindControls() {
    if (els.foundations) els.foundations.addEventListener('click', handleBoardClick);
    if (els.piles) els.piles.addEventListener('click', handleBoardClick);
    if (els.tableau) els.tableau.addEventListener('click', handleBoardClick);

    if (buttons.classic) buttons.classic.addEventListener('click', () => setMode(CLASSIC_KEY));
    if (buttons.timed) buttons.timed.addEventListener('click', () => setMode(TIMED_KEY));
    if (buttons.daily) buttons.daily.addEventListener('click', () => setMode(DAILY_KEY));
    if (buttons.draw) buttons.draw.addEventListener('click', drawCard);
    if (buttons.auto) buttons.auto.addEventListener('click', autoMove);
    if (buttons.undo) buttons.undo.addEventListener('click', undo);
    if (buttons.reset) buttons.reset.addEventListener('click', () => resetGame(DEFAULT_SEED, { mode: state.mode }));

    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (key === 'escape') {
        event.preventDefault();
        state.selected = null;
        updateHud();
      } else if (key === 'r') {
        event.preventDefault();
        resetGame(DEFAULT_SEED, { mode: state.mode });
      } else if (key === 'd') {
        event.preventDefault();
        drawCard();
      } else if (key === 'u') {
        event.preventDefault();
        undo();
      } else if (key === '1') {
        event.preventDefault();
        setMode(CLASSIC_KEY);
      } else if (key === '2') {
        event.preventDefault();
        setMode(TIMED_KEY);
      } else if (key === '3') {
        event.preventDefault();
        setMode(DAILY_KEY);
      }
    });
  }

  function init() {
    if (els.foundations) els.foundations.setAttribute('aria-label', copy.foundationRowLabel || 'Foundations');
    if (els.piles) els.piles.setAttribute('aria-label', copy.stockWasteLabel || 'Stock and waste');
    if (els.tableau) els.tableau.setAttribute('aria-label', copy.tableauLabel || 'Tableau');
    bindControls();
    resetGame(DEFAULT_SEED, { mode: CLASSIC_KEY });
    window.render_game_to_text = render_game_to_text;
    window.advanceTime = advanceTime;
    window.reset = resetGame;
    window.resetGame = resetGame;
    window.setSolitaireMiniMode = setMode;
    window.drawSolitaireMini = drawCard;
    window.autoMoveSolitaireMini = autoMove;
    window.undoSolitaireMini = undo;
    window.QA_READY = true;
    window.__WEBGAME_QA_READY__ = true;
  }

  init();
})();
