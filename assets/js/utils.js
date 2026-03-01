(function () {
  const DELIMITER_RE = /[\s,;|/\\·•ㆍ،，、]+/g;

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
    const forced = params.get("lang");
    if (forced === "ko" || forced === "en") {
      try {
        window.localStorage.setItem("rlt-lang", forced);
      } catch (e) {}
      return forced;
    }

    let saved = null;
    try {
      saved = window.localStorage.getItem("rlt-lang");
    } catch (e) {}
    if (saved === "ko" || saved === "en") return saved;

    return (navigator.language || "").toLowerCase().startsWith("ko") ? "ko" : "en";
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
