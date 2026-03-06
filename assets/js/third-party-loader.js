(function () {
  var MIN_ADSENSE_CONTENT_UNITS = 400;

  function injectScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] != null) s.setAttribute(k, attrs[k]);
      });
    }
    (document.head || document.body).appendChild(s);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function contentUnits(value) {
    var text = normalizeText(value);
    var total = 0;
    var i;
    var code;

    for (i = 0; i < text.length; i += 1) {
      code = text.charCodeAt(i);
      if (code === 32) continue;
      if (
        (code >= 0x3040 && code <= 0x30ff) ||
        (code >= 0x3400 && code <= 0x4dbf) ||
        (code >= 0x4e00 && code <= 0x9fff) ||
        (code >= 0xac00 && code <= 0xd7af) ||
        (code >= 0xf900 && code <= 0xfaff)
      ) {
        total += 2;
      } else {
        total += 1;
      }
    }

    return total;
  }

  function getPublisherContentUnits() {
    var sections = document.querySelectorAll('[data-adsense-content]');
    var totalUnits = 0;
    var i;

    if (!sections.length) return 0;

    for (i = 0; i < sections.length; i += 1) {
      totalUnits += contentUnits(sections[i].textContent);
    }

    return totalUnits;
  }

  function hasAdsScript() {
    return !!document.querySelector('script[src*="googlesyndication.com/pagead/js/adsbygoogle.js"]');
  }

  function loadAds() {
    if (hasAdsScript()) return;
    injectScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1010168647313500', {
      crossorigin: 'anonymous'
    });
  }

  function loadUserback() {
    window.Userback = window.Userback || {};
    window.Userback.access_token = 'A-vV6YCxc6cQKtRBem24yA3IgC8';
    var lang = window.__rltBootLang || document.documentElement.lang || 'en';
    window.Userback.widget_settings = { language: String(lang).toLowerCase().startsWith('ko') ? 'ko' : 'en' };
    injectScript('https://static.userback.io/widget/v1.js');
  }

  function run() {
    var cfg = (document.documentElement.getAttribute('data-third-party') || '').split(',').map(function (v) { return v.trim(); });
    var contentUnitCount = getPublisherContentUnits();
    var hasContent = contentUnitCount >= MIN_ADSENSE_CONTENT_UNITS;

    document.documentElement.setAttribute('data-adsense-units', String(contentUnitCount));
    document.documentElement.setAttribute('data-adsense-state', hasContent ? 'eligible' : 'suppressed-low-content');

    if (cfg.indexOf('ads') >= 0 && hasContent) loadAds();
    if (cfg.indexOf('userback') >= 0) loadUserback();
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 1500);
  }
})();
