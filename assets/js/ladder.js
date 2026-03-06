(function () {
  const { detectLocale } = window.RLTUtils;
  const dict = window.RLTI18N;
  const Random = window.RLTRandom || {
    bool: () => Math.random() >= 0.5,
    float: () => Math.random(),
    shuffle: (list) => {
      const out = Array.isArray(list) ? list.slice() : [];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[j];
        out[j] = tmp;
      }
      return out;
    }
  };

  const VIEW_W = 1000;
  const VIEW_H = 800;
  const STORAGE_KEY = "rlt-ladder-state";
  const MAX_PARTICIPANTS = 15;
  const COMPLEXITY_DEFAULT = "3";
  const SPEED_DEFAULT = "1";
  const MIN_ROUTE_DURATION_MS = 2000;
  const ARRIVAL_ADVANCE_MS = 500;
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
    navCoin: document.getElementById("nav-coin"),
    navDice: document.getElementById("nav-dice"),
    mnavCoin: document.getElementById("mnav-coin"),
    mnavDice: document.getElementById("mnav-dice"),
    fullscreenHint: document.getElementById("fullscreen-hint"),
    fullscreenHintText: document.getElementById("fullscreen-hint-text"),
    langTrigger: document.getElementById("lang-trigger"),
    langButtonLabel: document.getElementById("lang-button-label"),
    langCurrentFlag: document.getElementById("lang-current-flag"),
    langMenu: document.getElementById("lang-menu"),
    langSearch: document.getElementById("lang-search"),
    langList: document.getElementById("lang-list"),
    langTriggerMobile: document.getElementById("lang-trigger-mobile"),
    langCurrentFlagMobile: document.getElementById("lang-current-flag-mobile"),
    langMenuMobile: document.getElementById("lang-menu-mobile"),
    langSearchMobile: document.getElementById("lang-search-mobile"),
    langListMobile: document.getElementById("lang-list-mobile"),
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
    participantsLimitHint: document.getElementById("participants-limit-hint"),
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
    btnPlayAllFooter: document.getElementById("btn-playall-footer"),
    labelPlayAllFooter: document.getElementById("label-playall-footer"),
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
  const LANG_OPTIONS = ["ko", "en", "ja", "zh-cn", "es", "fr", "de", "pt-br", "hi", "ar", "ru", "id", "tr", "it", "vi", "th", "nl"];
  const SUPPORTED_LOCALES = [...LANG_OPTIONS, "zh-tw"];
  const LANG_SET = new Set(SUPPORTED_LOCALES);
  const localeNames = {
    ko: { native: "한국어", en: "Korean", flag: "kr" },
    en: { native: "English", en: "English", flag: "us" },
    ja: { native: "日本語", en: "Japanese", flag: "jp" },
    "zh-cn": { native: "简体中文", en: "Chinese", flag: "cn" },
    "zh-tw": { native: "繁體中文", en: "Chinese (Traditional)", flag: "tw" },
    es: { native: "Español", en: "Spanish", flag: "es" },
    fr: { native: "Français", en: "French", flag: "fr" },
    de: { native: "Deutsch", en: "German", flag: "de" },
    "pt-br": { native: "Português (Brasil)", en: "Portuguese (Brazil)", flag: "br" },
    hi: { native: "हिन्दी", en: "Hindi", flag: "in" },
    ar: { native: "العربية", en: "Arabic", flag: "ae" },
    ru: { native: "Русский", en: "Russian", flag: "ru" },
    id: { native: "Bahasa Indonesia", en: "Indonesian", flag: "id" },
    tr: { native: "Türkçe", en: "Turkish", flag: "tr" },
    it: { native: "Italiano", en: "Italian", flag: "it" },
    vi: { native: "Tiếng Việt", en: "Vietnamese", flag: "vn" },
    th: { native: "ไทย", en: "Thai", flag: "th" },
    nl: { native: "Nederlands", en: "Dutch", flag: "nl" }
  };
  if (!LANG_SET.has(state.locale)) state.locale = "en";

  function t(key, vars) {
    const pack = dict[state.locale] || dict.en;
    let text = pack[key] || dict.en[key] || dict.ko[key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        text = text.replace(`{${k}}`, vars[k]);
      });
    }
    return text;
  }

  function getLocaleFlagUrl(locale) {
    const row = localeNames[locale];
    const code = row && row.flag ? row.flag : "us";
    return `https://flagcdn.com/w20/${code}.png`;
  }

  function getLocaleLabel(locale) {
    const row = localeNames[locale];
    if (!row) return locale;
    return `${row.native} (${row.en})`;
  }

  function renderLanguageList(query, listEl) {
    const target = listEl || ui.langList;
    if (!target) return;
    const q = String(query || "").trim().toLowerCase();
    const filtered = LANG_OPTIONS.filter((code) => {
      if (!q) return true;
      const row = localeNames[code];
      const haystack = `${code} ${row.native} ${row.en}`.toLowerCase();
      return haystack.includes(q);
    });
    target.innerHTML = filtered.map((code) => {
      const active = state.locale === code;
      const row = localeNames[code] || { native: code, en: code };
      return `
        <button type="button" data-lang="${code}" class="w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${active ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"}">
          <span class="inline-flex items-center gap-2">
            <img src="${getLocaleFlagUrl(code)}" alt="${row.en}" class="w-4 h-3 rounded-[2px] object-cover border border-slate-200">
            <span>${getLocaleLabel(code)}</span>
          </span>
        </button>
      `;
    }).join("");
  }

  function syncLangLinks() {
    const toolPathRegex = /^\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?(roulette|luckydraw|ladder|coinflip|dice)\/?$/i;
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;
      const m = url.pathname.match(toolPathRegex);
      if (m) {
        const tool = m[2].toLowerCase();
        url.pathname = state.locale === "ko" ? `/${tool}/` : `/${state.locale}/${tool}/`;
        url.searchParams.delete("lang");
        a.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
        return;
      }
      if (state.locale === "ko") url.searchParams.delete("lang");
      else url.searchParams.set("lang", state.locale);
      a.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  }

  function toolPath(tool) {
    return state.locale === "ko" ? `/${tool}/` : `/${state.locale}/${tool}/`;
  }

  function openLangMenu() {
    if (!ui.langMenu || !ui.langSearch) return;
    ui.langMenu.classList.remove("hidden");
    renderLanguageList(ui.langSearch.value, ui.langList);
    window.setTimeout(() => ui.langSearch.focus(), 0);
  }

  function openLangMenuMobile() {
    if (!ui.langMenuMobile || !ui.langSearchMobile) return;
    ui.langMenuMobile.classList.remove("hidden");
    renderLanguageList(ui.langSearchMobile.value, ui.langListMobile);
    window.setTimeout(() => ui.langSearchMobile.focus(), 0);
  }

  function closeAllLangMenus() {
    if (ui.langMenu) ui.langMenu.classList.add("hidden");
    if (ui.langMenuMobile) ui.langMenuMobile.classList.add("hidden");
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

  function setPlayAllUi(active) {
    const text = active ? t("stopAll") : t("playAll");
    if (ui.labelPlayAll) ui.labelPlayAll.textContent = text;
    if (ui.labelPlayAllFooter) ui.labelPlayAllFooter.textContent = text;
    if (ui.btnPlayAll) ui.btnPlayAll.classList.toggle("animate-pulse", active);
    if (ui.btnPlayAllFooter) ui.btnPlayAllFooter.classList.toggle("animate-pulse", active);
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
    if (ui.navCoin) ui.navCoin.textContent = t("navCoin");
    if (ui.navDice) ui.navDice.textContent = t("navDice");
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
    if (ui.participantsLimitHint) ui.participantsLimitHint.textContent = t("maxEntries", { n: MAX_PARTICIPANTS });
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
    setPlayAllUi(state.queue.length > 0);
    ui.emptyMain.textContent = t("emptyMain");
    ui.emptySub.textContent = t("emptySub");
    ui.resultTitle.textContent = t("resultTitle");
    ui.noResults.textContent = t("noResults");
    ui.footerTerms.textContent = "Terms";
    ui.footerPrivacy.textContent = "Privacy";
    ui.langButtonLabel.textContent = "LANGUAGE";
    ui.langSearch.placeholder = "Search language";
    if (ui.langSearchMobile) ui.langSearchMobile.placeholder = "Search language";
    ui.langCurrentFlag.src = getLocaleFlagUrl(state.locale);
    ui.langCurrentFlag.alt = (localeNames[state.locale] && localeNames[state.locale].en) || state.locale;
    if (ui.langCurrentFlagMobile) {
      ui.langCurrentFlagMobile.src = getLocaleFlagUrl(state.locale);
      ui.langCurrentFlagMobile.alt = (localeNames[state.locale] && localeNames[state.locale].en) || state.locale;
    }

    updateCounts();
    setProgress(false);
    updateFullscreenButton();
    renderLanguageList(ui.langSearch.value, ui.langList);
    if (ui.langListMobile) renderLanguageList(ui.langSearchMobile ? ui.langSearchMobile.value : "", ui.langListMobile);
    syncLangLinks();
    document.documentElement.classList.remove("i18n-pending");
  }

  function setLocale(locale) {
    if (!LANG_SET.has(locale)) return;
    state.locale = locale;
    try {
      localStorage.setItem("rlt-lang", locale);
    } catch (e) {}
    try {
      const url = new URL(window.location.href);
      const currentToolMatch = url.pathname.match(/^\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?(roulette|luckydraw|ladder|coinflip|dice)\/?$/i);
      if (currentToolMatch) {
        const tool = currentToolMatch[2].toLowerCase();
        const nextPath = locale === "ko" ? `/${tool}/` : `/${locale}/${tool}/`;
        window.location.assign(`${nextPath}${url.hash}`);
        return;
      } else {
        if (locale === "ko") url.searchParams.delete("lang");
        else url.searchParams.set("lang", locale);
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
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
    const chunks = String(text || "")
      .split(/[\n\r,]+/g)
      .map((v) => v.trim())
      .filter(Boolean);
    const tokens = [];

    for (const chunk of chunks) {
      const pattern = /(.+?)\s*[\(（]\s*(\d+)\s*[\)）]/g;
      let cursor = 0;
      let hasCountPattern = false;
      let match;

      while ((match = pattern.exec(chunk)) !== null) {
        hasCountPattern = true;
        const prefix = chunk.slice(cursor, match.index).trim();
        if (prefix) tokens.push(prefix);

        const label = (match[1] || "").trim();
        const count = Number(match[2]);
        if (label && Number.isFinite(count) && count > 0) {
          for (let i = 0; i < count; i++) tokens.push(label);
        }
        cursor = match.index + match[0].length;
      }

      if (!hasCountPattern) {
        tokens.push(chunk);
        continue;
      }

      const suffix = chunk.slice(cursor).trim();
      if (suffix) tokens.push(suffix);
    }

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
        return k === "사망" || k === "die" || k === "eliminate" || k === "x" || k === "脱落";
      });
      const live = list.filter((v) => {
        const k = normalizeLabel(v);
        return k === "생존" || k === "live" || k === "survive" || k === "o" || k === "生存";
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
    const out = buildBalancedResults(r, p.length);
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
        ja: {
          p: ["太郎", "花子", "健太", "美咲", "翔太", "葵", "大輝", "結衣"],
          r: ["1番", "2番", "3番", "4番", "5番", "6番", "7番", "8番"]
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
        ja: {
          p: ["太郎", "花子", "健太", "美咲", "翔太", "葵", "大輝", "結衣"],
          r: ["Aチーム", "Aチーム", "Aチーム", "Aチーム", "Bチーム", "Bチーム", "Bチーム", "Bチーム"]
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
        ja: {
          p: ["太郎", "花子", "健太", "美咲", "翔太", "葵", "大輝", "結衣"],
          r: ["生存", "脱落", "生存", "脱落", "生存", "脱落", "生存", "脱落"]
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
      const mobile = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
      ui.inputParticipants.value = mobile ? pack.p.join(", ") : pack.p.join("\n");
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
    let force = false;
    if (arguments && arguments.length > 0) force = !!arguments[0];
    const currentParticipants = parsedParticipants();
    const currentResults = parsedResults();
    if (!force && (currentParticipants.length > 0 || currentResults.length > 0)) return;

    const localizedResults = {
      ko: "A팀(3), B팀(3)",
      en: "Team A(3), Team B(3)",
      ja: "Aチーム(3), Bチーム(3)",
      "zh-cn": "A队(3), B队(3)",
      "zh-tw": "A隊(3), B隊(3)",
      es: "Equipo A(3), Equipo B(3)",
      fr: "Équipe A(3), Équipe B(3)",
      de: "Team A(3), Team B(3)",
      "pt-br": "Time A(3), Time B(3)",
      hi: "टीम A(3), टीम B(3)",
      ar: "فريق A(3), فريق B(3)",
      ru: "Команда A(3), Команда B(3)",
      id: "Tim A(3), Tim B(3)",
      tr: "Takım A(3), Takım B(3)",
      it: "Squadra A(3), Squadra B(3)",
      vi: "Đội A(3), Đội B(3)",
      th: "ทีม A(3), ทีม B(3)",
      nl: "Team A(3), Team B(3)"
    };

    let sample;
    const mobile = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
    if (state.locale === "ja") {
      sample = {
        participants: mobile ? ["太郎", "花子", "健太", "美咲", "翔太", "葵"] : ["太郎", "花子", "健太", "美咲", "翔太", "葵", "大輝", "結衣"],
        results: localizedResults.ja
      };
    } else if (state.locale === "ko") {
      sample = {
        participants: mobile ? ["민수", "서연", "지후", "하린", "도윤", "지우"] : ["민수", "서연", "지후", "하린", "도윤", "지우", "예준", "소윤"],
        results: localizedResults.ko
      };
    } else {
      sample = {
        participants: mobile ? ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava"] : ["Alex", "Emma", "Liam", "Mia", "Noah", "Ava", "Ethan", "Zoe"],
        results: localizedResults[state.locale] || localizedResults.en
      };
    }

    ui.inputParticipants.value = mobile ? sample.participants.join(", ") : sample.participants.join("\n");
    ui.inputResults.value = sample.results;
  }

  function isMobileViewport() {
    return !!(window.matchMedia && window.matchMedia("(max-width: 1023px)").matches);
  }

  function applyMobileDefaultLadderAlways() {
    if (!isMobileViewport()) return;
    applyDefaultExampleIfEmpty(true);
    updateCounts();
    buildLadder();
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
    const comp = Math.max(0, Math.min(6, Number(ui.sliderComplexity.value) || Number(COMPLEXITY_DEFAULT)));
    const rows = Math.max(10, n * 2 + comp * 2);
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
        const score = rowLoad[row] * 10 + Random.float();
        if (score < bestScore) {
          bestScore = score;
          bestRow = row;
        }
      }
      return bestRow;
    }

    // Distribute rung counts evenly per edge (col), then spread along rows.
    const edgeCount = Math.max(1, n - 1);
    const baseTarget = Math.max(2, Math.round(rows * (0.11 + comp * 0.009)));
    const targets = Array.from({ length: edgeCount }, () => {
      const variance = Random.bool() ? 0 : (Random.bool() ? -1 : 1);
      return Math.max(2, Math.min(rows - 1, baseTarget + variance));
    });

    for (let col = 0; col < edgeCount; col++) {
      const target = targets[col];
      const step = rows / (target + 1);
      const colPhase = (Random.float() - 0.5) * step * 0.6;

      for (let k = 1; k <= target; k++) {
        const jitter = (Random.float() - 0.5) * step * 0.2;
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

  function hasDuplicateResultLabels() {
    const counts = new Map();
    for (const value of state.results) {
      const key = normalizeLabel(value);
      counts.set(key, (counts.get(key) || 0) + 1);
      if ((counts.get(key) || 0) > 1) return true;
    }
    return false;
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
    const routeStrokeColor = hasDuplicateResultLabels() ? "#0f172a" : color;
    const d = buildPathD(route);

    Array.from(ui.nodesTop.children).forEach((node) => node.classList.remove("active"));
    ui.nodesTop.children[index].classList.add("active");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", routeStrokeColor);
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
    const baseDuration = 4100 - speedRatio * 2100;
    const lengthFactor = Math.max(0.92, Math.min(1.1, len / 980));
    const duration = Math.max(MIN_ROUTE_DURATION_MS, Math.round(baseDuration * lengthFactor));
    path.style.transition = `stroke-dashoffset ${duration}ms linear`;
    path.style.strokeDashoffset = "0";

    await new Promise((resolve) => {
      let done = false;
      const startedAt = performance.now();
      const finish = () => {
        if (done) return;
        done = true;
        path.removeEventListener("transitionend", onEnd);
        clearTimeout(hardFallbackTimer);
        resolve();
      };
      const onEnd = (event) => {
        finish();
      };
      path.addEventListener("transitionend", onEnd, { once: true });
      const earlyArrivalMs = 900 + ARRIVAL_ADVANCE_MS;
      const tick = (now) => {
        if (done) return;
        if (now - startedAt >= Math.max(0, duration - earlyArrivalMs)) {
          finish();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      // Hard fallback in case browser throttles animation frames heavily.
      const hardFallbackTimer = setTimeout(finish, duration + 120);
    });

    ui.nodesTop.children[index].classList.remove("active");
    ui.nodesTop.children[index].classList.add("done");

    const cell = document.getElementById(`table-result-${index}`);
    const row = document.getElementById(`table-row-${index}`);
    if (cell) {
      cell.textContent = state.results[route.end];
      cell.classList.remove("text-slate-400");
      cell.classList.add("text-slate-900");
    }
    if (row) row.classList.add("bg-slate-50", "border-slate-200");
    applyMatchColor(index, route.end, color);

    state.completedRoutes.add(index);

    state.playing = false;
    setProgress(false);
    saveState();
  }

  async function togglePlayAll() {
    if (!state.ladderData) return;
    if (state.queue.length > 0) {
      state.queue = [];
      setPlayAllUi(false);
      return;
    }

    const remaining = [];
    for (let i = 0; i < state.participants.length; i++) {
      if (!state.completedRoutes.has(i)) remaining.push(i);
    }
    if (!remaining.length) return;

    state.queue = remaining;
    setPlayAllUi(true);

    while (state.queue.length > 0) {
      const next = state.queue.shift();
      await playRoute(next);
      await new Promise((r) => setTimeout(r, 0));
    }

    state.queue = [];
    setPlayAllUi(false);
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
        results = buildBalancedResults(results, participants.length);
      } else {
        results = results.slice(0, participants.length);
      }
    }
    results = interleaveResults(results);
    results = Random.shuffle(results);
    ui.inputResults.value = results.join(", ");
    updateCounts();

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

  function buildBalancedResults(results, targetLength) {
    const out = Array.isArray(results) ? results.slice() : [];
    if (targetLength <= out.length) return out.slice(0, targetLength);

    if (!out.length) {
      for (let i = 0; i < targetLength; i++) out.push(`${t("fillLabel")} ${i + 1}`);
      return out;
    }

    const order = [];
    const counts = new Map();
    for (const value of out) {
      if (!counts.has(value)) {
        counts.set(value, 0);
        order.push(value);
      }
      counts.set(value, counts.get(value) + 1);
    }

    while (out.length < targetLength) {
      let pick = order[0];
      let minCount = counts.get(pick);
      for (let i = 1; i < order.length; i++) {
        const label = order[i];
        const c = counts.get(label);
        if (c < minCount) {
          pick = label;
          minCount = c;
        }
      }
      out.push(pick);
      counts.set(pick, counts.get(pick) + 1);
    }
    return out;
  }

  function interleaveResults(results) {
    const list = Array.isArray(results) ? results.filter((x) => String(x || "").trim()) : [];
    if (list.length <= 2) return list;

    const order = [];
    const buckets = new Map();
    for (const value of list) {
      if (!buckets.has(value)) {
        buckets.set(value, []);
        order.push(value);
      }
      buckets.get(value).push(value);
    }
    if (order.length <= 1) return list;

    const out = [];
    let added;
    do {
      added = false;
      for (const label of order) {
        const bucket = buckets.get(label);
        if (!bucket || !bucket.length) continue;
        out.push(bucket.shift());
        added = true;
      }
    } while (added);
    return out;
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
      const results = interleaveResults(parsedResults());

      if (saved.ladderData && Array.isArray(saved.ladderData.routes) && participants.length >= 2 && participants.length <= MAX_PARTICIPANTS) {
        state.participants = participants;
        state.results = results.slice(0, participants.length);
        ui.inputResults.value = state.results.join(", ");
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
    if (ui.langTrigger) {
      ui.langTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (ui.langMenu && ui.langMenu.classList.contains("hidden")) openLangMenu();
        else closeAllLangMenus();
      });
    }
    if (ui.langSearch) ui.langSearch.addEventListener("input", () => renderLanguageList(ui.langSearch.value, ui.langList));
    if (ui.langList) {
      ui.langList.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-lang]");
        if (!btn) return;
        setLocale(btn.getAttribute("data-lang"));
        closeAllLangMenus();
      });
    }
    if (ui.langTriggerMobile) {
      ui.langTriggerMobile.addEventListener("click", (event) => {
        event.stopPropagation();
        if (ui.langMenuMobile && ui.langMenuMobile.classList.contains("hidden")) openLangMenuMobile();
        else closeAllLangMenus();
      });
    }
    if (ui.langSearchMobile) ui.langSearchMobile.addEventListener("input", () => renderLanguageList(ui.langSearchMobile.value, ui.langListMobile));
    if (ui.langListMobile) {
      ui.langListMobile.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-lang]");
        if (!btn) return;
        setLocale(btn.getAttribute("data-lang"));
        closeAllLangMenus();
      });
    }
    document.addEventListener("click", (event) => {
      const inDesktop = ui.langMenu && (ui.langMenu.contains(event.target) || (ui.langTrigger && ui.langTrigger.contains(event.target)));
      const inMobile = ui.langMenuMobile && (ui.langMenuMobile.contains(event.target) || (ui.langTriggerMobile && ui.langTriggerMobile.contains(event.target)));
      if (inDesktop || inMobile) return;
      closeAllLangMenus();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllLangMenus();
    });

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
    if (ui.btnPlayAllFooter) ui.btnPlayAllFooter.addEventListener("click", togglePlayAll);

    ui.sliderComplexity.addEventListener("input", () => {
      if (ui.sliderComplexity.value === "") ui.sliderComplexity.value = COMPLEXITY_DEFAULT;
      saveState();
      if (state.playing) return;
      if (!state.ladderData) return;
      if (parsedParticipants().length < 2) return;
      state.queue = [];
      setPlayAllUi(false);
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
  applyMobileDefaultLadderAlways();
  bindEvents();
  applyI18n();
  updateCounts();
  showFullscreenHint();
})();
