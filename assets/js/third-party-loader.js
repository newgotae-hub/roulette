(function () {
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

  function loadAds() {
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
    if (cfg.indexOf('ads') >= 0) loadAds();
    if (cfg.indexOf('userback') >= 0) loadUserback();
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 1500);
  }
})();
