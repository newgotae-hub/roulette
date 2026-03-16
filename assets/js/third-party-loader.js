(function () {
  var MIN_ADSENSE_CONTENT_UNITS = 400;
  var USERBACK_WIDGET_URL = 'https://static.userback.io/widget/v1.js';
  var USERBACK_OPEN_TIMEOUT_MS = 8000;
  var userbackLoadStarted = false;

  function isLocalQaMode() {
    return window.__TEAM_GENERATOR_LOCAL_QA__ === true ||
      document.documentElement.getAttribute('data-team-generator-qa') === 'true';
  }

  function injectScript(src, attrs, onload, onerror) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (typeof onload === 'function') s.onload = onload;
    if (typeof onerror === 'function') s.onerror = onerror;
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

  function hasUserbackScript() {
    return !!document.querySelector('script[src*="static.userback.io/widget/v1.js"]');
  }

  function loadAds() {
    if (hasAdsScript()) return;
    injectScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1010168647313500', {
      crossorigin: 'anonymous'
    });
  }

  function prepareUserbackConfig() {
    var api = window.Userback;
    if (!api || (typeof api !== 'object' && typeof api !== 'function')) {
      api = {};
      window.Userback = api;
    }
    api.access_token = 'A-vV6YCxc6cQKtRBem24yA3IgC8';
    var lang = window.__rltBootLang || document.documentElement.lang || 'en';
    api.widget_settings = { language: String(lang).toLowerCase().startsWith('ko') ? 'ko' : 'en' };
    return api;
  }

  function hasUserbackOpen() {
    return !!(
      (window.Userback && typeof window.Userback.open === 'function') ||
      typeof window.Userback === 'function'
    );
  }

  function loadUserback() {
    prepareUserbackConfig();
    if (hasUserbackOpen() || userbackLoadStarted || hasUserbackScript()) return;

    userbackLoadStarted = true;
    injectScript(USERBACK_WIDGET_URL, null, function () {
      userbackLoadStarted = false;
    }, function () {
      userbackLoadStarted = false;
    });
  }

  function waitForUserbackReady(callback) {
    var startedAt = Date.now();

    function check() {
      if (hasUserbackOpen()) {
        callback(null);
        return;
      }

      if (Date.now() - startedAt >= USERBACK_OPEN_TIMEOUT_MS) {
        callback(new Error('Userback did not become ready in time.'));
        return;
      }

      window.setTimeout(check, 120);
    }

    check();
  }

  function openUserbackWidget() {
    var api = window.Userback;
    if (!api) return false;

    if (typeof api.open === 'function') {
      api.open();
      return true;
    }

    if (typeof api === 'function') {
      try {
        api('open');
        return true;
      } catch (e) {}
    }

    return false;
  }

  function shouldInterceptContactClick(event) {
    return !event.defaultPrevented &&
      (typeof event.button !== 'number' || event.button === 0) &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
  }

  function fallbackToContactHref(trigger) {
    var href = trigger && trigger.getAttribute ? trigger.getAttribute('href') : '';
    if (!href) return;
    window.location.href = href;
  }

  function bindUserbackTriggers() {
    var triggers = document.querySelectorAll('[data-userback-trigger]');
    var i;

    for (i = 0; i < triggers.length; i += 1) {
      if (triggers[i].getAttribute('data-userback-bound') === 'true') continue;

      triggers[i].setAttribute('data-userback-bound', 'true');
      triggers[i].addEventListener('click', function (event) {
        var trigger = event.currentTarget;

        if (!shouldInterceptContactClick(event)) return;

        event.preventDefault();
        loadUserback();
        waitForUserbackReady(function (error) {
          if (error || !openUserbackWidget()) {
            fallbackToContactHref(trigger);
          }
        });
      });
    }
  }

  function run() {
    if (isLocalQaMode()) {
      document.documentElement.setAttribute('data-adsense-state', 'qa-local');
      document.documentElement.setAttribute('data-adsense-units', '0');
      return;
    }

    var cfg = (document.documentElement.getAttribute('data-third-party') || '').split(',').map(function (v) { return v.trim(); });
    var contentUnitCount = getPublisherContentUnits();
    var hasContent = contentUnitCount >= MIN_ADSENSE_CONTENT_UNITS;

    bindUserbackTriggers();
    document.documentElement.setAttribute('data-adsense-units', String(contentUnitCount));
    document.documentElement.setAttribute('data-adsense-state', hasContent ? 'eligible' : 'suppressed-low-content');

    if (cfg.indexOf('ads') >= 0 && hasContent) loadAds();
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 1500);
  }
})();
