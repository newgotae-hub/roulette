(function () {
  const { detectLocale } = window.RLTUtils;
  const dict = window.RLTI18N;

  const VIEW_W = 1000;
  const VIEW_H = 800;
  const STORAGE_KEY = "rlt-ladder-state";
  const MAX_PARTICIPANTS = 15;
  const COMPLEXITY_DEFAULT = "3";
  const SPEED_DEFAULT = "1";
  const MIN_ROUTE_DURATION_MS = 2000;
  const PATH_COLORS = [
    "#0f172a", "#1d4ed8", "#0f766e", "#b45309", "#7c3aed",
    "#be123c", "#0369a1", "#334155", "#4d7c0f", "#9f1239"
  ];

  const state = {
    locale: detectLocale(),
    participants: [],
    results: [],
    ladderData: null,
    completedRoutes: new Set(),
    queue: [],
    playing: false,
    fullscreenHintTimer: null,
    applyingPreset: false
  };

  const ui = {
    navSpin: document.getElementById("nav-spin"),
    navLotto: document.getElementById("nav-lotto"),
    navLadder: document.getElementById("nav-ladder"),
    navLucky: document.getElementById("nav-lucky"),
    fullscreenHint: document.getElementById("fullscreen-hint"),
    fullscreenHintText: document.getElementById("fullscreen-hint-text"),
    langKo: document.getElementById("lang-ko"),
    langEn: document.getElementById("lang-en"),
    fullscreenBtn: document.getElementById("fullscreen-toggle"),
    fullscreenIcon: document.getElementById("fullscreen-icon"),
    fullscreenLabel: document.getElementById("fullscreen-label"),
    heroTitle: document.getElementById("hero-title"),
    heroSub: document.getElementById("hero-subtitle"),
    guideTitle: document.getElementById("guide-title"),
    guideSubtitle: document.getElementById("guide-subtitle"),
    guideStep1Title: document.getElementById("guide-step1-title"),
    guideStep1Body: document.getElementById("guide-step1-body"),
    guideStep2Title: document.getElementById("guide-step2-title"),
    guideStep2Body: document.getElementById("guide-step2-body"),
    guideStep3Title: document.getElementById("guide-step3-title"),
    guideStep3Body: document.getElementById("guide-step3-body"),
    faqTitle: document.getElementById("faq-title"),
    faq1Q: document.getElementById("faq1-q"),
    faq1A: document.getElementById("faq1-a"),
    faq2Q: document.getElementById("faq2-q"),
    faq2A: document.getElementById("faq2-a"),
    faq3Q: document.getElementById("faq3-q"),
    faq3A: document.getElementById("faq3-a"),
    faq4Q: document.getElementById("faq4-q"),
    faq4A: document.getElementById("faq4-a"),
    faq5Q: document.getElementById("faq5-q"),
    faq5A: document.getElementById("faq5-a"),
    faq6Q: document.getElementById("faq6-q"),
    faq6A: document.getElementById("faq6-a"),
    faq7Q: document.getElementById("faq7-q"),
    faq7A: document.getElementById("faq7-a"),
    faq8Q: document.getElementById("faq8-q"),
    faq8A: document.getElementById("faq8-a"),
    presetClass: document.getElementById("preset-class"),
    presetTeam: document.getElementById("preset-team"),
    presetSeat: document.getElementById("preset-seat"),
    labelParticipants: document.getElementById("label-participants"),
    labelResults: document.getElementById("label-results"),
    countParticipants: document.getElementById("count-participants"),
    countResults: document.getElementById("count-results"),
    inputParticipants: document.getElementById("input-participants"),
    inputResults: document.getElementById("input-results"),
    mismatchAlert: document.getElementById("mismatch-alert"),
    mismatchText: document.getElementById("mismatch-text"),
    btnAutoFill: document.getElementById("btn-autofill"),
    btnAutoTrim: document.getElementById("btn-autotrim"),
    btnClearParticipants: document.getElementById("btn-clear-participants"),
    btnClearResults: document.getElementById("btn-clear-results"),
    labelComplexity: document.getElementById("label-complexity"),
    labelSpeed: document.getElementById("label-speed"),
    sliderComplexity: document.getElementById("slider-complexity"),
    sliderSpeed: document.getElementById("slider-speed"),
    btnGenerate: document.getElementById("btn-generate"),
    nodesTop: document.getElementById("nodes-top"),
    nodesBottom: document.getElementById("nodes-bottom"),
    svg: document.getElementById("ladder-svg"),
    gBg: document.getElementById("lines-bg"),
    gRungs: document.getElementById("lines-rungs"),
    gActive: document.getElementById("lines-active"),
    ladderEmpty: document.getElementById("ladder-empty"),
    emptyMain: document.getElementById("empty-main"),
    emptySub: document.getElementById("empty-sub"),
    btnPlayAll: document.getElementById("btn-playall"),
    labelPlayAll: document.getElementById("label-playall"),
    progressText: document.getElementById("progress-text"),
    resultsCard: document.getElementById("results-card"),
    resultTitle: document.getElementById("label-result-title"),
    resultsList: document.getElementById("results-list"),
    noResults: document.getElementById("label-no-results"),
    footerTerms: document.getElementById("footer-terms"),
    footerPrivacy: document.getElementById("footer-privacy"),
    metaDescription: document.getElementById("meta-description"),
    metaOgTitle: document.getElementById("meta-og-title"),
    metaOgDescription: document.getElementById("meta-og-description"),
    metaTwitterTitle: document.getElementById("meta-twitter-title"),
    metaTwitterDescription: document.getElementById("meta-twitter-description")
  };

  function t(key, vars) {
    const pack = dict[state.locale] || dict.ko;
    let text = pack[key] || dict.ko[key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        text = text.replace(`{${k}}`, vars[k]);
      });
    }
    return text;
  }

  function updateLanguageButtons() {
    ui.langKo.className = `px-2.5 py-1 text-xs font-semibold rounded-full ${state.locale === "ko" ? "bg-slate-100 text-slate-900" : "text-slate-500"}`;
    ui.langEn.className = `px-2.5 py-1 text-xs font-semibold rounded-full ${state.locale === "en" ? "bg-slate-100 text-slate-900" : "text-slate-500"}`;
  }

  function updateFullscreenButton() {
    const active = !!document.fullscreenElement;
    ui.fullscreenIcon.setAttribute("icon", active ? "solar:minimize-linear" : "solar:maximize-linear");
    ui.fullscreenLabel.textContent = active ? t("fullscreenExit") : t("fullscreen");
    document.body.classList.toggle("is-fullscreen", active);
  }

  function setProgress(running) {
    ui.progressText.textContent = running ? t("progressRunning") : t("progressIdle");
  }

  function applyI18n() {
    document.documentElement.lang = state.locale;
    document.title = t("seoTitle");
    ui.metaDescription.setAttribute("content", t("seoDesc"));
    ui.metaOgTitle.setAttribute("content", t("seoOgTitle"));
    ui.metaOgDescription.setAttribute("content", t("seoOgDesc"));
    ui.metaTwitterTitle.setAttribute("content", t("seoTwitterTitle"));
    ui.metaTwitterDescription.setAttribute("content", t("seoTwitterDesc"));

    ui.navSpin.textContent = t("navSpin");
    ui.navLotto.textContent = t("navLotto");
    ui.navLadder.textContent = t("navLadder");
    ui.navLucky.textContent = t("navLucky");
    ui.fullscreenHintText.textContent = t("fullscreenHint");
    ui.heroTitle.textContent = t("heroTitle");
    ui.heroSub.textContent = t("heroSub");
    ui.guideTitle.textContent = t("guideTitle");
    ui.guideSubtitle.textContent = t("guideSubtitle");
    ui.guideStep1Title.textContent = t("guideStep1Title");
    ui.guideStep1Body.textContent = t("guideStep1Body");
    ui.guideStep2Title.textContent = t("guideStep2Title");
    ui.guideStep2Body.textContent = t("guideStep2Body");
    ui.guideStep3Title.textContent = t("guideStep3Title");
    ui.guideStep3Body.textContent = t("guideStep3Body");
    ui.faqTitle.textContent = t("faqTitle");
    ui.faq1Q.textContent = t("faq1Q");
    ui.faq1A.textContent = t("faq1A");
    ui.faq2Q.textContent = t("faq2Q");
    ui.faq2A.textContent = t("faq2A");
    ui.faq3Q.textContent = t("faq3Q");
    ui.faq3A.textContent = t("faq3A");
    ui.faq4Q.textContent = t("faq4Q");
    ui.faq4A.textContent = t("faq4A");
    ui.faq5Q.textContent = t("faq5Q");
    ui.faq5A.textContent = t("faq5A");
    ui.faq6Q.textContent = t("faq6Q");
    ui.faq6A.textContent = t("faq6A");
    ui.faq7Q.textContent = t("faq7Q");
    ui.faq7A.textContent = t("faq7A");
    ui.faq8Q.textContent = t("faq8Q");
    ui.faq8A.textContent = t("faq8A");
    ui.presetClass.textContent = t("presetClass");
    ui.presetTeam.textContent = t("presetTeam");
    ui.presetSeat.textContent = t("presetSeat");
    ui.labelParticipants.textContent = t("labelParticipants");
    ui.labelResults.textContent = t("labelResults");
    ui.inputParticipants.placeholder = t("phParticipants");
    ui.inputResults.placeholder = t("phResults");
    ui.mismatchText.textContent = t("mismatch");
    ui.btnAutoFill.textContent = t("autoFill");
    ui.btnAutoTrim.textContent = t("autoTrim");
    if (ui.btnClearParticipants) ui.btnClearParticipants.textContent = t("clearAll");
    if (ui.btnClearResults) ui.btnClearResults.textContent = t("clearAll");
    ui.labelComplexity.textContent = t("complexity");
    ui.labelSpeed.textContent = t("speed");
    ui.btnGenerate.textContent = t("btnGenerate");
    ui.labelPlayAll.textContent = state.queue.length > 0 ? t("stopAll") : t("playAll");
    ui.emptyMain.textContent = t("emptyMain");
    ui.emptySub.textContent = t("emptySub");
    ui.resultTitle.textContent = t("resultTitle");
    ui.noResults.textContent = t("noResults");
    ui.footerTerms.textContent = t("footerTerms");
    ui.footerPrivacy.textContent = t("footerPrivacy");

    updateCounts();
    setProgress(false);
    updateFullscreenButton();
    updateLanguageButtons();
  }

  function setLocale(locale) {
    if (locale !== "ko" && locale !== "en") return;
    state.locale = locale;
    try {
      localStorage.setItem("rlt-lang", locale);
    } catch (e) {}
    applyI18n();
    renderNodes();
    renderResultsTable();
  }

  function parseLadderEntries(text, options) {
    const opts = options || {};
    const allowDuplicates = !!opts.allowDuplicates;
    const tokens = String(text || "")
      .split(/[\n\r\t,;|/\\·•ㆍ،，、]+/g)
      .map((v) => v.trim())
      .filter(Boolean);

    if (allowDuplicates) return tokens;

    const seen = new Set();
    const out = [];
    for (const token of tokens) {
      if (!seen.has(token)) {
        seen.add(token);
        out.push(token);
      }
    }
    return out;
  }

  function parseResultEntries(text, options) {
    const opts = options || {};
    const allowDuplicates = !!opts.allowDuplicates;
    const tokens = String(text || "")
      .split(/[\n\r,]+/g)
      .map((v) => v.trim())
      .filter(Boolean);

    if (allowDuplicates) return tokens;
    const seen = new Set();
    const out = [];
    for (const token of tokens) {
      if (!seen.has(token)) {
        seen.add(token);
        out.push(token);
      }
    }
    return out;
  }

  function formatPresetResults(type, results) {
    const list = Array.isArray(results) ? results : [];
    if (!list.length) return "";

    if (type === "team") {
      const mid = Math.ceil(list.length / 2);
      return `${list.slice(0, mid).join(", ")}\n${list.slice(mid).join(", ")}`;
    }

    if (type === "seat") {
      const dead = list.filter((v) => {
        const k = normalizeLabel(v);
        return k === "사망" || k === "die" || k === "eliminate" || k === "x";
      });
      const live = list.filter((v) => {
        const k = normalizeLabel(v);
        return k === "생존" || k === "live" || k === "survive" || k === "o";
      });
      if (dead.length && live.length) return `${dead.join(", ")}\n${live.join(", ")}`;
    }

    return list.join(", ");
  }

  function parsedParticipants() {
    return parseLadderEntries(ui.inputParticipants.value, { allowDuplicates: false });
  }

  function parsedResults() {
    return parseResultEntries(ui.inputResults.value, { allowDuplicates: true });
  }

  function updateCounts() {
    const p = parsedParticipants();
    const r = parsedResults();
    ui.countParticipants.textContent = t("countPeople", { n: p.length });
    ui.countResults.textContent = t("countItems", { n: r.length });
    if (state.applyingPreset) return;
    ui.mismatchAlert.classList.toggle("hidden", !(p.length > 0 && p.length !== r.length));
  }

  function autoFillResults() {
    const p = parsedParticipants();
    const r = parsedResults();
    if (p.length <= r.length) return;
    const out = r.slice();
    for (let i = r.length; i < p.length; i++) out.push(`${t("fillLabel")} ${i + 1}`);
    ui.inputResults.value = out.join(", ");
    updateCounts();
    saveState();
  }

  function autoTrimResults() {
    const p = parsedParticipants();
    const r = parsedResults();
    if (r.length <= p.length) return;
    ui.inputResults.value = r.slice(0, p.length).join(", ");
    updateCounts();
    saveState();
  }

  function clearParticipants() {
    ui.inputParticipants.value = "";
    updateCounts();
    saveState();
  }

  function clearResults() {
    ui.inputResults.value = "";
    updateCounts();
    saveState();
  }

  function loadPreset(type) {
    const data = {
      class: {
        ko: {
          p: ["민준", "서연", "지후", "하린", "도윤", "지우", "예준", "소윤"],
          r: ["1번", "2번", "3번", "4번", "5번", "6번", "7번", "8번"]
        },
        en: {
          p: ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava", "Ethan", "Zoe"],
          r: ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5", "Slot6", "Slot7", "Slot8"]
        }
      },
      team: {
        ko: {
          p: ["민수", "서연", "지후", "하린", "도윤", "지우", "예준", "소윤"],
          r: ["A팀", "A팀", "A팀", "A팀", "B팀", "B팀", "B팀", "B팀"]
        },
        en: {
          p: ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava", "Ethan", "Zoe"],
          r: ["Team A", "Team A", "Team A", "Team A", "Team B", "Team B", "Team B", "Team B"]
        }
      },
      seat: {
        ko: {
          p: ["민준", "서연", "지후", "하린", "도윤", "지우", "예준", "소윤"],
          r: ["생존", "사망", "생존", "사망", "생존", "사망", "생존", "사망"]
        },
        en: {
          p: ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava", "Ethan", "Zoe"],
          r: ["Survive", "Eliminate", "Survive", "Eliminate", "Survive", "Eliminate", "Survive", "Eliminate"]
        }
      }
    };
    const pack = (data[type] && data[type][state.locale]) || data[type].ko;
    state.applyingPreset = true;
    try {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      ui.inputParticipants.value = pack.p.join("\n");
      ui.inputResults.value = formatPresetResults(type, pack.r);
      buildLadder();
      updateCounts();
      saveState();
    } finally {
      state.applyingPreset = false;
      updateCounts();
    }
  }

  function applyDefaultExampleIfEmpty() {
    const currentParticipants = parsedParticipants();
    const currentResults = parsedResults();
    if (currentParticipants.length > 0 || currentResults.length > 0) return;

    const sample = state.locale === "en"
      ? {
          participants: ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava", "Ethan", "Zoe"],
          results: "Team A, Team A, Team A, Team A\nTeam B, Team B, Team B, Team B"
        }
      : {
          participants: ["민수", "서연", "지후", "하린", "도윤", "지우", "예준", "소윤"],
          results: "A팀, A팀, A팀, A팀\nB팀, B팀, B팀, B팀"
        };

    ui.inputParticipants.value = sample.participants.join("\n");
    ui.inputResults.value = sample.results;
  }

  function getX(col, n) {
    const gap = VIEW_W / n;
    return gap * col + gap / 2;
  }

  function getY(row, maxRows) {
    return (row / maxRows) * VIEW_H;
  }

  function buildLadderData(participants, results) {
    const n = participants.length;
    const comp = Math.max(0, Math.min(6, Number(ui.sliderComplexity.value) || Number(COMPLEXITY_DEFAULT)));
    const rows = Math.max(10, n * 2 + comp * 3);
    const rungs = [];
    const rungSet = new Set();
    const rowLoad = Array(rows + 1).fill(0);

    function canPlaceRung(row, col, allowAdjacent) {
      if (col < 0 || col >= n - 1) return false;
      if (rungSet.has(`${row}:${col}`)) return false;
      if (!allowAdjacent && (rungSet.has(`${row}:${col - 1}`) || rungSet.has(`${row}:${col + 1}`))) return false;
      return true;
    }

    function placeRung(row, col, allowAdjacent) {
      if (!canPlaceRung(row, col, allowAdjacent)) return false;
      rungSet.add(`${row}:${col}`);
      rungs.push({ row, col });
      rowLoad[row] += 1;
      return true;
    }

    function pickBestRowForCol(col, preferredRow, allowAdjacent) {
      let bestRow = -1;
      let bestScore = Number.POSITIVE_INFINITY;
      const maxOffset = Math.min(7, rows - 1);

      for (let offset = 0; offset <= maxOffset; offset++) {
        const candidates = offset === 0 ? [preferredRow] : [preferredRow - offset, preferredRow + offset];
        for (const row of candidates) {
          if (row < 1 || row >= rows) continue;
          if (!canPlaceRung(row, col, allowAdjacent)) continue;
          // Favor rows with lower usage to avoid visual clustering.
          const score = rowLoad[row] * 9 + Math.abs(row - preferredRow);
          if (score < bestScore) {
            bestScore = score;
            bestRow = row;
          }
        }
      }

      if (bestRow !== -1) return bestRow;

      // Fallback: scan all rows and pick least-loaded valid row.
      for (let row = 1; row < rows; row++) {
        if (!canPlaceRung(row, col, allowAdjacent)) continue;
        const score = rowLoad[row] * 10 + Math.random();
        if (score < bestScore) {
          bestScore = score;
          bestRow = row;
        }
      }
      return bestRow;
    }

    // Distribute rung counts evenly per edge (col), then spread along rows.
    const edgeCount = Math.max(1, n - 1);
    const baseTarget = Math.max(2, Math.round(rows * (0.13 + comp * 0.01)));
    const targets = Array.from({ length: edgeCount }, () => {
      const variance = Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? -1 : 1);
      return Math.max(2, Math.min(rows - 1, baseTarget + variance));
    });

    for (let col = 0; col < edgeCount; col++) {
      const target = targets[col];
      const step = rows / (target + 1);
      const colPhase = (Math.random() - 0.5) * step * 0.6;

      for (let k = 1; k <= target; k++) {
        const jitter = (Math.random() - 0.5) * step * 0.2;
        const preferred = Math.max(1, Math.min(rows - 1, Math.round(step * k + colPhase + jitter)));
        const row = pickBestRowForCol(col, preferred, false);
        if (row !== -1) {
          placeRung(row, col, false);
          continue;
        }
        // Rare fallback when adjacency constraints are too tight.
        const relaxedRow = pickBestRowForCol(col, preferred, true);
        if (relaxedRow !== -1) placeRung(relaxedRow, col, true);
      }
    }

    function hasHorizontalMove(startCol) {
      let col = startCol;
      for (let row = 1; row < rows; row++) {
        const left = rungSet.has(`${row}:${col - 1}`);
        const right = rungSet.has(`${row}:${col}`);
        if (left || right) return true;
        if (left) col -= 1;
        else if (right) col += 1;
      }
      return false;
    }

    function forceMoveForStart(startCol) {
      const candidateCols = [];
      if (startCol - 1 >= 0) candidateCols.push(startCol - 1);
      if (startCol <= n - 2) candidateCols.push(startCol);

      const rowsOrder = Array.from({ length: rows - 1 }, (_, i) => i + 1)
        .sort((a, b) => rowLoad[a] - rowLoad[b] || Math.abs(a - rows / 2) - Math.abs(b - rows / 2));

      for (const row of rowsOrder) {
        for (const col of candidateCols) {
          if (placeRung(row, col, false)) return true;
        }
      }

      // Fallback: allow placement without adjacency rule when fully blocked.
      for (const row of rowsOrder) {
        for (const col of candidateCols) {
          if (placeRung(row, col, true)) return true;
        }
      }
      return false;
    }

    // Ensure no route stays perfectly vertical from top to bottom.
    for (let pass = 0; pass < 3; pass++) {
      let allMoved = true;
      for (let startCol = 0; startCol < n; startCol++) {
        if (hasHorizontalMove(startCol)) continue;
        allMoved = false;
        forceMoveForStart(startCol);
      }
      if (allMoved) break;
    }

    rungs.sort((a, b) => (a.row - b.row) || (a.col - b.col));
    const routes = [];

    for (let i = 0; i < n; i++) {
      let col = i;
      const path = [{ row: 0, col }];
      for (let row = 1; row < rows; row++) {
        const left = rungSet.has(`${row}:${col - 1}`);
        const right = rungSet.has(`${row}:${col}`);

        path.push({ row, col });
        if (left) {
          col -= 1;
          path.push({ row, col });
        } else if (right) {
          col += 1;
          path.push({ row, col });
        }
      }
      path.push({ row: rows, col });
      routes.push({ start: i, end: col, pathNodes: path });
    }

    return { n, rows, rungs, routes };
  }

  function drawBase() {
    if (!state.ladderData) return;
    const { n, rows, rungs } = state.ladderData;
    ui.svg.setAttribute("viewBox", `0 0 ${VIEW_W} ${VIEW_H}`);
    ui.gBg.innerHTML = "";
    ui.gRungs.innerHTML = "";
    ui.gActive.innerHTML = "";

    for (let i = 0; i < n; i++) {
      const x = getX(i, n);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", x);
      line.setAttribute("y2", VIEW_H);
      line.setAttribute("stroke", "#cbd5e1");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      ui.gBg.appendChild(line);
    }

    rungs.forEach((r) => {
      const y = getY(r.row, rows);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", getX(r.col, n));
      line.setAttribute("y1", y);
      line.setAttribute("x2", getX(r.col + 1, n));
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "#cbd5e1");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      ui.gRungs.appendChild(line);
    });
  }

  function buildPathD(route) {
    const { n, rows } = state.ladderData;
    return route.pathNodes
      .map((pt, i) => `${i ? "L" : "M"} ${getX(pt.col, n)} ${getY(pt.row, rows)}`)
      .join(" ");
  }

  function paintCompletedPathsDim() {
    ui.gActive.querySelectorAll("path").forEach((p) => {
      p.style.opacity = "0.2";
      p.setAttribute("stroke", "#94a3b8");
      p.setAttribute("stroke-width", "3");
    });
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || "").replace("#", "");
    if (clean.length !== 6) return `rgba(15,23,42,${alpha})`;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function normalizeLabel(text) {
    return String(text || "").trim().toLowerCase();
  }

  function getSemanticColorByLabel(label) {
    const key = normalizeLabel(label);
    const liveSet = new Set(["생존", "o", "live", "survive", "pass", "win", "당첨"]);
    const dieSet = new Set(["사망", "x", "die", "eliminate", "fail", "lose", "탈락"]);
    if (liveSet.has(key)) return "#0f766e";
    if (dieSet.has(key)) return "#be123c";
    return null;
  }

  function getLabelColor(label, fallbackIndex) {
    const semantic = getSemanticColorByLabel(label);
    if (semantic) return semantic;

    const normalized = normalizeLabel(label);
    const counts = new Map();
    for (const value of state.results) {
      const k = normalizeLabel(value);
      counts.set(k, (counts.get(k) || 0) + 1);
    }

    // Keep existing route colors when all labels are unique.
    if ((counts.get(normalized) || 0) <= 1) return PATH_COLORS[fallbackIndex % PATH_COLORS.length];

    const repeatedLabels = Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([k]) => k)
      .sort();

    const palette = ["#0f766e", "#1d4ed8", "#b45309", "#7c3aed", "#0369a1", "#9f1239"];
    const idx = Math.max(0, repeatedLabels.indexOf(normalized));
    return palette[idx % palette.length];
  }

  function applyMatchColor(startIndex, endIndex, color) {
    const topNode = ui.nodesTop.children[startIndex];
    if (topNode) {
      topNode.style.borderColor = color;
      topNode.style.backgroundColor = hexToRgba(color, 0.12);
      topNode.style.color = color;
    }

    const resultNode = document.getElementById(`result-node-${endIndex}`);
    if (resultNode) {
      resultNode.style.borderColor = color;
      resultNode.style.backgroundColor = hexToRgba(color, 0.12);
      resultNode.style.color = color;
      resultNode.classList.add("highlight");
      setTimeout(() => resultNode.classList.remove("highlight"), 700);
    }

    const cell = document.getElementById(`table-result-${startIndex}`);
    const row = document.getElementById(`table-row-${startIndex}`);
    if (cell) {
      cell.style.color = color;
      cell.classList.remove("text-slate-400");
      cell.classList.add("font-bold");
    }
    if (row) {
      row.style.borderColor = hexToRgba(color, 0.35);
      row.style.backgroundColor = hexToRgba(color, 0.08);
    }
  }

  function renderNodes() {
    ui.nodesTop.innerHTML = "";
    ui.nodesBottom.innerHTML = "";
    if (!state.ladderData) return;

    const fontClass = state.ladderData.n > 12 ? "text-[10px]" : "text-[11px]";

    state.participants.forEach((name, i) => {
      const btn = document.createElement("button");
      btn.className = `ladder-node w-12 h-8 ${fontClass} font-medium rounded border border-slate-200 bg-white text-slate-700 shadow-sm truncate px-1 flex-shrink-0`;
      btn.textContent = name;
      btn.title = name;
      btn.addEventListener("click", () => playRoute(i));
      ui.nodesTop.appendChild(btn);
    });

    state.results.forEach((label, i) => {
      const item = document.createElement("div");
      item.className = `result-node w-12 h-8 ${fontClass} font-medium rounded border border-slate-200 bg-white text-slate-700 shadow-sm truncate px-1 flex items-center justify-center flex-shrink-0`;
      item.id = `result-node-${i}`;
      item.textContent = label;
      item.title = label;
      ui.nodesBottom.appendChild(item);
    });

    state.completedRoutes.forEach((idx) => {
      const node = ui.nodesTop.children[idx];
      if (node) node.classList.add("done");
    });
  }

  function renderResultsTable() {
    if (!state.participants.length || !state.ladderData) {
      ui.resultsList.innerHTML = `<div class="col-span-full h-20 flex items-center justify-center text-slate-400"><p class="text-xs">${t("noResults")}</p></div>`;
      return;
    }

    ui.resultsList.innerHTML = "";
    state.participants.forEach((name, i) => {
      const row = document.createElement("div");
      row.className = "p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors";
      row.id = `table-row-${i}`;
      row.innerHTML = `<p class="text-[11px] font-medium text-slate-900 truncate">${name}</p><p id="table-result-${i}" class="mt-1 text-xs font-semibold text-slate-400 truncate">?</p>`;
      ui.resultsList.appendChild(row);
    });
  }

  function drawCompletedStaticPaths() {
    if (!state.ladderData || !state.completedRoutes.size) return;
    state.completedRoutes.forEach((idx) => {
      const route = state.ladderData.routes[idx];
      if (!route) return;
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", buildPathD(route));
      p.setAttribute("stroke", "#94a3b8");
      p.setAttribute("stroke-width", "3");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      p.setAttribute("vector-effect", "non-scaling-stroke");
      p.style.opacity = "0.2";
      ui.gActive.appendChild(p);
    });
  }

  async function playRoute(index) {
    if (!state.ladderData || state.playing || state.completedRoutes.has(index)) return;
    state.playing = true;
    setProgress(true);

    paintCompletedPathsDim();

    const route = state.ladderData.routes[index];
    const color = getLabelColor(state.results[route.end], index);
    const d = buildPathD(route);

    Array.from(ui.nodesTop.children).forEach((node) => node.classList.remove("active"));
    ui.nodesTop.children[index].classList.add("active");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    ui.gActive.appendChild(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.getBoundingClientRect();

    const speed = Math.max(1, Math.min(5, Number(ui.sliderSpeed.value) || Number(SPEED_DEFAULT)));
    const speedRatio = (speed - 1) / 4;
    const baseDuration = 3000 - speedRatio * 1000;
    const lengthFactor = Math.max(0.92, Math.min(1.1, len / 980));
    const duration = Math.max(MIN_ROUTE_DURATION_MS, Math.round(baseDuration * lengthFactor));
    path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    path.style.strokeDashoffset = "0";

    await new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        path.removeEventListener("transitionend", onEnd);
        resolve();
      };
      const onEnd = (event) => {
        if (event.propertyName !== "stroke-dashoffset") return;
        finish();
      };
      path.addEventListener("transitionend", onEnd, { once: true });
      // Fallback in case transitionend doesn't fire on some browsers.
      setTimeout(finish, duration + 80);
    });

    ui.nodesTop.children[index].classList.remove("active");
    ui.nodesTop.children[index].classList.add("done");

    const targetNode = document.getElementById(`result-node-${route.end}`);
    if (targetNode) {
      targetNode.classList.add("highlight");
      setTimeout(() => targetNode.classList.remove("highlight"), 900);
    }

    state.completedRoutes.add(index);

    const cell = document.getElementById(`table-result-${index}`);
    const row = document.getElementById(`table-row-${index}`);
    if (cell) {
      cell.textContent = state.results[route.end];
      cell.classList.remove("text-slate-400");
      cell.classList.add("text-slate-900");
    }
    if (row) row.classList.add("bg-slate-50", "border-slate-200");
    applyMatchColor(index, route.end, color);

    state.playing = false;
    setProgress(false);
    saveState();
  }

  async function togglePlayAll() {
    if (!state.ladderData) return;
    if (state.queue.length > 0) {
      state.queue = [];
      ui.labelPlayAll.textContent = t("playAll");
      ui.btnPlayAll.classList.remove("animate-pulse");
      return;
    }

    const remaining = [];
    for (let i = 0; i < state.participants.length; i++) {
      if (!state.completedRoutes.has(i)) remaining.push(i);
    }
    if (!remaining.length) return;

    state.queue = remaining;
    ui.labelPlayAll.textContent = t("stopAll");
    ui.btnPlayAll.classList.add("animate-pulse");

    while (state.queue.length > 0) {
      const next = state.queue.shift();
      await playRoute(next);
      await new Promise((r) => setTimeout(r, 140));
    }

    state.queue = [];
    ui.labelPlayAll.textContent = t("playAll");
    ui.btnPlayAll.classList.remove("animate-pulse");
  }

  function buildLadder() {
    const participants = parsedParticipants();
    let results = parsedResults();

    if (participants.length < 2) {
      alert(t("minTwo"));
      return;
    }

    if (participants.length > MAX_PARTICIPANTS) {
      alert(t("maxEntries", { n: MAX_PARTICIPANTS }));
      return;
    }

    if (participants.length !== results.length) {
      if (participants.length > results.length) {
        const out = results.slice();
        for (let i = out.length; i < participants.length; i++) out.push(`${t("fillLabel")} ${i + 1}`);
        results = out;
      } else {
        results = results.slice(0, participants.length);
      }
      ui.inputResults.value = results.join(", ");
      updateCounts();
    }

    state.participants = participants;
    state.results = results;
    state.completedRoutes.clear();
    state.queue = [];
    state.playing = false;

    state.ladderData = buildLadderData(participants, results);

    ui.ladderEmpty.classList.add("hidden");
    drawBase();
    renderNodes();
    renderResultsTable();
    setProgress(false);

    saveState();
  }

  function saveState() {
    const payload = {
      locale: state.locale,
      participantsText: ui.inputParticipants.value,
      resultsText: ui.inputResults.value,
      speed: ui.sliderSpeed.value,
      completedRoutes: Array.from(state.completedRoutes),
      ladderData: state.ladderData
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
  }

  function restoreState() {
    ui.sliderComplexity.value = COMPLEXITY_DEFAULT;
    ui.sliderSpeed.value = SPEED_DEFAULT;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        applyDefaultExampleIfEmpty();
        return;
      }
      const saved = JSON.parse(raw);

      ui.inputParticipants.value = saved.participantsText || "";
      ui.inputResults.value = saved.resultsText || "";
      ui.sliderComplexity.value = COMPLEXITY_DEFAULT;
      ui.sliderSpeed.value = SPEED_DEFAULT;

      const participants = parsedParticipants();
      const results = parsedResults();

      if (saved.ladderData && Array.isArray(saved.ladderData.routes) && participants.length >= 2 && participants.length <= MAX_PARTICIPANTS) {
        state.participants = participants;
        state.results = results.slice(0, participants.length);
        state.ladderData = saved.ladderData;
        state.completedRoutes = new Set(Array.isArray(saved.completedRoutes) ? saved.completedRoutes : []);

        ui.ladderEmpty.classList.add("hidden");
        drawBase();
        renderNodes();
        renderResultsTable();
        drawCompletedStaticPaths();

        state.completedRoutes.forEach((idx) => {
          const route = state.ladderData.routes[idx];
          const color = getLabelColor(state.results[route.end], idx);
          const cell = document.getElementById(`table-result-${idx}`);
          const row = document.getElementById(`table-row-${idx}`);
          if (cell && route) {
            cell.textContent = state.results[route.end] || "?";
            cell.classList.remove("text-slate-400");
            cell.classList.add("text-slate-900");
          }
          if (row) row.classList.add("bg-slate-50", "border-slate-200");
          if (route) applyMatchColor(idx, route.end, color);
        });
      }
    } catch (e) {
      applyDefaultExampleIfEmpty();
    }
  }

  function toggleFullscreen() {
    if (ui.fullscreenHint) ui.fullscreenHint.classList.add("hidden");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      return;
    }
    document.exitFullscreen().catch(() => {});
  }

  function showFullscreenHint() {
    if (!ui.fullscreenHint) return;
    ui.fullscreenHint.classList.remove("hidden");
    window.clearTimeout(state.fullscreenHintTimer);
    state.fullscreenHintTimer = window.setTimeout(() => {
      ui.fullscreenHint.classList.add("hidden");
    }, 4200);
  }

  function bindEvents() {
    ui.langKo.addEventListener("click", () => setLocale("ko"));
    ui.langEn.addEventListener("click", () => setLocale("en"));

    ui.inputParticipants.addEventListener("input", () => {
      updateCounts();
      saveState();
    });
    ui.inputResults.addEventListener("input", () => {
      updateCounts();
      saveState();
    });

    ui.btnAutoFill.addEventListener("click", autoFillResults);
    ui.btnAutoTrim.addEventListener("click", autoTrimResults);
    if (ui.btnClearParticipants) ui.btnClearParticipants.addEventListener("click", clearParticipants);
    if (ui.btnClearResults) ui.btnClearResults.addEventListener("click", clearResults);
    ui.btnGenerate.addEventListener("click", buildLadder);
    ui.btnPlayAll.addEventListener("click", togglePlayAll);

    ui.sliderComplexity.addEventListener("input", () => {
      if (ui.sliderComplexity.value === "") ui.sliderComplexity.value = COMPLEXITY_DEFAULT;
      saveState();
      if (state.playing) return;
      if (!state.ladderData) return;
      if (parsedParticipants().length < 2) return;
      state.queue = [];
      ui.labelPlayAll.textContent = t("playAll");
      ui.btnPlayAll.classList.remove("animate-pulse");
      buildLadder();
    });
    ui.sliderSpeed.addEventListener("input", () => {
      if (ui.sliderSpeed.value === "") ui.sliderSpeed.value = SPEED_DEFAULT;
      saveState();
    });

    ui.fullscreenBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);

    ui.presetClass.addEventListener("click", () => loadPreset("class"));
    ui.presetTeam.addEventListener("click", () => loadPreset("team"));
    ui.presetSeat.addEventListener("click", () => loadPreset("seat"));

    // Prevent persistent focus flash on button click.
    document.addEventListener("pointerup", (event) => {
      const btn = event.target && event.target.closest ? event.target.closest("button") : null;
      if (btn && typeof btn.blur === "function") btn.blur();
    });
  }

  restoreState();
  bindEvents();
  applyI18n();
  updateCounts();
  showFullscreenHint();
})();
