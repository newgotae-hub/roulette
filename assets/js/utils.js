(function () {
  const DELIMITER_RE = /[\s,;|/\\·•ㆍ،，、]+/g;
  const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh-cn", "zh-tw", "es", "fr", "de", "pt-br", "hi"];

  function normalizeLocale(raw) {
    const v = String(raw || "").toLowerCase().replace("_", "-");
    if (!v) return "";
    if (v === "zh" || v.startsWith("zh-cn") || v.startsWith("zh-hans")) return "zh-cn";
    if (v.startsWith("zh-tw") || v.startsWith("zh-hk") || v.startsWith("zh-hant")) return "zh-tw";
    if (v.startsWith("pt-br")) return "pt-br";
    if (v.startsWith("ko")) return "ko";
    if (v.startsWith("en")) return "en";
    if (v.startsWith("ja")) return "ja";
    if (v.startsWith("es")) return "es";
    if (v.startsWith("fr")) return "fr";
    if (v.startsWith("de")) return "de";
    if (v.startsWith("hi")) return "hi";
    return v;
  }

  function splitByDelimiters(text) {
    return String(text || "")
      .split(DELIMITER_RE)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function uniqueKeepOrder(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
    return out;
  }

  function parseEntries(text, options) {
    const opts = options || {};
    const allowDuplicates = !!opts.allowDuplicates;
    const tokens = splitByDelimiters(text);
    return allowDuplicates ? tokens : uniqueKeepOrder(tokens);
  }

  function detectLocale() {
    const params = new URLSearchParams(window.location.search);
    const forced = normalizeLocale(params.get("lang"));
    if (SUPPORTED_LOCALES.includes(forced)) {
      try {
        window.localStorage.setItem("rlt-lang", forced);
      } catch (e) {}
      return forced;
    }

    let saved = null;
    try {
      saved = normalizeLocale(window.localStorage.getItem("rlt-lang"));
    } catch (e) {}
    if (SUPPORTED_LOCALES.includes(saved)) return saved;

    const navs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (const nav of navs) {
      const cand = normalizeLocale(nav);
      if (SUPPORTED_LOCALES.includes(cand)) return cand;
    }
    return "en";
  }

  function downloadText(filename, content, mime) {
    const blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function formatNow(locale) {
    const now = new Date();
    return now.toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  window.RLTUtils = {
    parseEntries,
    detectLocale,
    downloadText,
    formatNow
  };
})();
