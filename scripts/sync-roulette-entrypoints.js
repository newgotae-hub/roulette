#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'fr', 'de', 'pt-br', 'hi', 'ar', 'ru', 'id', 'tr', 'it', 'vi', 'th', 'nl'];
const LANG_PATTERN = '(?:ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)';

const CANONICAL_PATCH = `    <script data-rlt-canonical-patch>
      (function(){
        try {
          var url = new URL(window.location.href);
          var host = url.hostname.toLowerCase();
          var toolPathRegex = /^\\/(?:((${LANG_PATTERN}))\\/)?(roulette|luckydraw|ladder|coinflip|dice)\\/?$/i;
          var rootPathRegex = /^\\/(?:((${LANG_PATTERN}))\\/?)?$/i;
          var toolMatch = url.pathname.match(toolPathRegex);
          var rootMatch = url.pathname.match(rootPathRegex);
          var changed = false;
          if ((toolMatch || rootMatch) && url.searchParams.has('lang')) {
            var qLang = String(url.searchParams.get('lang') || '').toLowerCase();
            var tool = toolMatch ? toolMatch[3].toLowerCase() : 'roulette';
            var nextPath = qLang === 'ko' || qLang === ''
              ? (tool === 'roulette' ? '/' : '/' + tool + '/')
              : (tool === 'roulette' ? '/' + qLang + '/' : '/' + qLang + '/' + tool + '/');
            if (nextPath !== url.pathname) { url.pathname = nextPath; changed = true; }
            url.searchParams.delete('lang');
            changed = true;
          }
          if (host === 'www.randomly-pick.com') {
            url.hostname = 'randomly-pick.com';
            changed = true;
          }
          if (changed) window.location.replace(url.toString());
        } catch (e) {}
      })();
    </script>`;

const SYNC_LANG_LINKS = `            function syncLangLinks() {
                const toolPathRegex = /^\\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\\/)?(roulette|luckydraw|ladder|coinflip|dice)\\/?$/i;
                const rootPathRegex = /^\\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\\/?)?$/i;
                document.querySelectorAll('a[href]').forEach((a) => {
                    const href = a.getAttribute('href');
                    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
                    const url = new URL(href, window.location.origin);
                    if (url.origin !== window.location.origin || !url.pathname.startsWith('/')) return;
                    const toolMatch = url.pathname.match(toolPathRegex);
                    const rootMatch = url.pathname.match(rootPathRegex);
                    if (toolMatch || rootMatch) {
                        const tool = toolMatch ? toolMatch[2].toLowerCase() : 'roulette';
                        url.pathname = state.locale === 'ko'
                            ? (tool === 'roulette' ? '/' : \`/\${tool}/\`)
                            : (tool === 'roulette' ? \`/\${state.locale}/\` : \`/\${state.locale}/\${tool}/\`);
                        url.searchParams.delete('lang');
                        a.setAttribute('href', \`\${url.pathname}\${url.search}\${url.hash}\`);
                        return;
                    }
                    if (state.locale === 'ko') url.searchParams.delete('lang');
                    else url.searchParams.set('lang', state.locale);
                    a.setAttribute('href', \`\${url.pathname}\${url.search}\${url.hash}\`);
                });
            }`;

const SET_LOCALE = `            function setLocale(nextLocale) {
                if (!LANG_SET.has(nextLocale)) return;
                if (state.locale === nextLocale) {
                    closeAllLangMenus();
                    return;
                }
                state.locale = nextLocale;
                try {
                    window.localStorage.setItem('rlt-lang', nextLocale);
                } catch (e) {}
                try {
                    const url = new URL(window.location.href);
                    const toolPathRegex = /^\\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\\/)?(roulette|luckydraw|ladder|coinflip|dice)\\/?$/i;
                    const rootPathRegex = /^\\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\\/?)?$/i;
                    const currentToolMatch = url.pathname.match(toolPathRegex);
                    const currentRootMatch = url.pathname.match(rootPathRegex);
                    if (currentToolMatch || currentRootMatch) {
                        const tool = currentToolMatch ? currentToolMatch[2].toLowerCase() : 'roulette';
                        const nextPath = nextLocale === 'ko'
                            ? (tool === 'roulette' ? '/' : \`/\${tool}/\`)
                            : (tool === 'roulette' ? \`/\${nextLocale}/\` : \`/\${nextLocale}/\${tool}/\`);
                        window.location.assign(\`\${nextPath}\${url.hash}\`);
                        return;
                    } else {
                        if (nextLocale === 'ko') url.searchParams.delete('lang');
                        else url.searchParams.set('lang', nextLocale);
                        window.history.replaceState({}, '', \`\${url.pathname}\${url.search}\${url.hash}\`);
                    }
                } catch (e) {}
                applyStaticI18n();
                updateSpinDurationLabel();
                updateCount();
                drawWheel();
                renderHistory();
                updateFullscreenButton();
                closeAllLangMenus();
            }`;

function writeIfChanged(file, next) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (prev === next) return false;
  fs.writeFileSync(file, next, 'utf8');
  return true;
}

function updateRouletteFile(file) {
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/<script data-rlt-canonical-patch>[\s\S]*?<\/script>/, CANONICAL_PATCH);
  html = html.replace(/function syncLangLinks\(\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function applyStaticI18n)/, `${SYNC_LANG_LINKS}\n`);
  html = html.replace(/function setLocale\(nextLocale\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function normalize)/, `${SET_LOCALE}\n`);
  html = html.replace(/href="\/favicon-r\.svg"/g, 'href="https://randomly-pick.com/favicon-r.svg"');

  for (const locale of LOCALES) {
    const escaped = locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`https://randomly-pick\\.com/${escaped}/roulette/`, 'g'), `https://randomly-pick.com/${locale}/`);
    html = html.replace(new RegExp(`href="/${escaped}/roulette/"`, 'g'), `href="/${locale}/"`);
  }

  return html;
}

let changed = 0;

for (const file of [path.join(ROOT, 'index.html'), path.join(ROOT, 'roulette', 'index.html')]) {
  changed += writeIfChanged(file, updateRouletteFile(file)) ? 1 : 0;
}

for (const locale of LOCALES) {
  const rouletteFile = path.join(ROOT, locale, 'roulette', 'index.html');
  const updated = updateRouletteFile(rouletteFile);
  changed += writeIfChanged(rouletteFile, updated) ? 1 : 0;
  changed += writeIfChanged(path.join(ROOT, locale, 'index.html'), updated) ? 1 : 0;
}

console.log(`synced roulette entrypoints: ${changed}`);
