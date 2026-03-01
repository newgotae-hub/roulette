(function () {
  const { parseEntries, detectLocale } = window.RLTUtils;
  const dict = window.RLTI18N;

  const VIEW_W = 1000;
  const VIEW_H = 800;
  const STORAGE_KEY = "rlt-ladder-state";
  const MAX_PARTICIPANTS = 15;
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
    fullscreenHintTimer: null
  };

  const ui = {
    navSpin: document.getElementById("nav-spin"),
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
    presetClass: document.getElementById("preset-class"),
    presetTeam: document.getElementById("preset-team"),
    presetSeat: document.getElementById("preset-seat"),
    presetLunch: document.getElementById("preset-lunch"),
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
    ui.navLadder.textContent = t("navLadder");
    ui.navLucky.textContent = t("navLucky");
    ui.fullscreenHintText.textContent = t("fullscreenHint");
    ui.heroTitle.textContent = t("heroTitle");
    ui.heroSub.textContent = t("heroSub");
    ui.presetClass.textContent = t("presetClass");
    ui.presetTeam.textContent = t("presetTeam");
    ui.presetSeat.textContent = t("presetSeat");
    ui.presetLunch.textContent = t("presetLunch");
    ui.labelParticipants.textContent = t("labelParticipants");
    ui.labelResults.textContent = t("labelResults");
    ui.inputParticipants.placeholder = t("phParticipants");
    ui.inputResults.placeholder = t("phResults");
    ui.mismatchText.textContent = t("mismatch");
    ui.btnAutoFill.textContent = t("autoFill");
    ui.btnAutoTrim.textContent = t("autoTrim");
    ui.labelComplexity.textContent = t("complexity");
    ui.labelSpeed.textContent = t("speed");
    ui.btnGenerate.textContent = t("btnGenerate");
    ui.labelPlayAll.textContent = state.queue.length > 0 ? t("stopAll") : t("playAll");
    ui.emptyMain.textContent = t("emptyMain");
    ui.emptySub.textContent = t("emptySub");
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
  }

  function parsedParticipants() {
    return parseEntries(ui.inputParticipants.value, { allowDuplicates: false });
  }

  function parsedResults() {
    return parseEntries(ui.inputResults.value, { allowDuplicates: true });
  }

  function updateCounts() {
    const p = parsedParticipants();
    const r = parsedResults();
    ui.countParticipants.textContent = t("countPeople", { n: p.length });
    ui.countResults.textContent = t("countItems", { n: r.length });
    ui.mismatchAlert.classList.toggle("hidden", !(p.length > 0 && p.length !== r.length));
  }

  function autoFillResults() {
    const p = parsedParticipants();
    const r = parsedResults();
    if (p.length <= r.length) return;
    const out = r.slice();
    for (let i = r.length; i < p.length; i++) out.push(`${t("fillLabel")} ${i + 1}`);
    ui.inputResults.value = out.join("\n");
    updateCounts();
    saveState();
  }

  function autoTrimResults() {
    const p = parsedParticipants();
    const r = parsedResults();
    if (r.length <= p.length) return;
    ui.inputResults.value = r.slice(0, p.length).join("\n");
    updateCounts();
    saveState();
  }

  function loadPreset(type) {
    const data = {
      class: {
        ko: { p: ["참가자1", "참가자2", "참가자3", "참가자4", "참가자5"], r: ["1번", "2번", "3번", "4번", "5번"] },
        en: { p: ["Player1", "Player2", "Player3", "Player4", "Player5"], r: ["Slot1", "Slot2", "Slot3", "Slot4", "Slot5"] }
      },
      team: {
        ko: { p: ["민수", "서연", "지후", "하린", "도윤", "지우"], r: ["A팀", "A팀", "A팀", "B팀", "B팀", "B팀"] },
        en: { p: ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava"], r: ["Team A", "Team A", "Team A", "Team B", "Team B", "Team B"] }
      },
      seat: {
        ko: { p: ["참가자1", "참가자2", "참가자3", "참가자4"], r: ["생존", "사망", "생존", "사망"] },
        en: { p: ["Player1", "Player2", "Player3", "Player4"], r: ["Survive", "Eliminate", "Survive", "Eliminate"] }
      },
      lunch: {
        ko: { p: ["A", "B", "C", "D"], r: ["결제", "무료", "무료", "무료"] },
        en: { p: ["A", "B", "C", "D"], r: ["Pay", "Free", "Free", "Free"] }
      }
    };
    const pack = (data[type] && data[type][state.locale]) || data[type].ko;
    ui.inputParticipants.value = pack.p.join("\n");
    ui.inputResults.value = pack.r.join("\n");
    updateCounts();
    saveState();
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
    const comp = Number(ui.sliderComplexity.value);
    const rows = Math.max(10, n * 2 + comp * 3);
    const rungs = [];

    for (let row = 1; row < rows; row++) {
      let prevPlaced = false;
      for (let col = 0; col < n - 1; col++) {
        if (prevPlaced) {
          prevPlaced = false;
          continue;
        }
        const chance = 0.18 + comp * 0.03;
        if (Math.random() < chance) {
          rungs.push({ row, col });
          prevPlaced = true;
        }
      }
    }

    const rungSet = new Set(rungs.map((r) => `${r.row}:${r.col}`));
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
    const color = PATH_COLORS[index % PATH_COLORS.length];
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

    const speed = Number(ui.sliderSpeed.value);
    const duration = Math.max(550, len * (0.65 - speed * 0.08));
    path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    path.style.strokeDashoffset = "0";

    await new Promise((resolve) => setTimeout(resolve, duration + 30));

    ui.nodesTop.children[index].classList.remove("active");
    ui.nodesTop.children[index].classList.add("done");

    const targetNode = document.getElementById(`result-node-${route.end}`);
    if (targetNode) {
      targetNode.classList.add("highlight");
      setTimeout(() => targetNode.classList.remove("highlight"), 900);
    }

    state.completedRoutes.add(index);
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
      await new Promise((r) => setTimeout(r, 160));
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
      ui.inputResults.value = results.join("\n");
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
    ui.sliderComplexity.value = "3";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (saved.locale === "ko" || saved.locale === "en") state.locale = saved.locale;
      ui.inputParticipants.value = saved.participantsText || "";
      ui.inputResults.value = saved.resultsText || "";
      ui.sliderSpeed.value = saved.speed || "3";

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
        drawCompletedStaticPaths();
      }
    } catch (e) {}
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
    ui.btnGenerate.addEventListener("click", buildLadder);
    ui.btnPlayAll.addEventListener("click", togglePlayAll);

    ui.sliderComplexity.addEventListener("input", () => {
      if (ui.sliderComplexity.value === "") ui.sliderComplexity.value = "3";
      saveState();
    });
    ui.sliderSpeed.addEventListener("input", saveState);

    ui.fullscreenBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);

    ui.presetClass.addEventListener("click", () => loadPreset("class"));
    ui.presetTeam.addEventListener("click", () => loadPreset("team"));
    ui.presetSeat.addEventListener("click", () => loadPreset("seat"));
    ui.presetLunch.addEventListener("click", () => loadPreset("lunch"));
  }

  restoreState();
  bindEvents();
  applyI18n();
  updateCounts();
  showFullscreenHint();
})();
