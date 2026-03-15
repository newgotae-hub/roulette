#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const TOOLS = ['roulette','luckydraw','ladder','coinflip','dice'];
const LANG_PATTERN = '(?:ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)';
const CANONICAL_PATCH = `\n    <script data-rlt-canonical-patch>\n      (function(){\n        try {\n          var url = new URL(window.location.href);\n          var host = url.hostname.toLowerCase();\n          var supportedLangs = /^${LANG_PATTERN}$/i;\n          var m = url.pathname.match(/^\\/(?:((?:${LANG_PATTERN}))\\/)?(roulette|luckydraw|ladder|coinflip|dice)\\/?$/i);\n          var changed = false;\n          if (m && url.searchParams.has('lang')) {\n            var qLang = String(url.searchParams.get('lang') || '').toLowerCase();\n            var tool = m[2].toLowerCase();\n            if (supportedLangs.test(qLang)) {\n              var nextPath = qLang === 'ko' || qLang === '' ? '/' + tool + '/' : '/' + qLang + '/' + tool + '/';\n              if (nextPath !== url.pathname) { url.pathname = nextPath; changed = true; }\n            }\n            url.searchParams.delete('lang');\n            changed = true;\n          }\n          if (host === 'www.randomly-pick.com') {\n            url.hostname = 'randomly-pick.com';\n            changed = true;\n          }\n          if (changed) window.location.replace(url.toString());\n        } catch (e) {}\n      })();\n    </script>\n`;
const SYNC_LANG_LINKS = `      function syncLangLinks() {\n        const toolPathRegex = /^\\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\\/)?(roulette|luckydraw|ladder|coinflip|dice)\\/?$/i;\n        document.querySelectorAll("a[href]").forEach((a) => {\n          const href = a.getAttribute("href");\n          if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;\n          const url = new URL(href, window.location.origin);\n          if (url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;\n          const m = url.pathname.match(toolPathRegex);\n          if (m) {\n            const tool = m[2].toLowerCase();\n            url.pathname = state.locale === "ko" ? \`/\${tool}/\` : \`/\${state.locale}/\${tool}/\`;\n            url.searchParams.delete("lang");\n            a.setAttribute("href", \`\${url.pathname}\${url.search}\${url.hash}\`);\n            return;\n          }\n          url.searchParams.delete("lang");\n          a.setAttribute("href", \`\${url.pathname}\${url.search}\${url.hash}\`);\n        });\n      }\n`;

const pages = [];
for (const t of TOOLS) pages.push(path.join(ROOT, t, 'index.html'));
for (const l of LOCALES) for (const t of TOOLS) pages.push(path.join(ROOT, l, t, 'index.html'));

function patchOne(file) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  // Host/query canonical client-side normalization for tool pages.
  if (html.includes('data-rlt-canonical-patch')) html = html.replace(/<script data-rlt-canonical-patch>[\s\S]*?<\/script>/, CANONICAL_PATCH.trim());
  else html = html.replace('</head>', `${CANONICAL_PATCH}</head>`);

  html = html.replace(/function syncLangLinks\(\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function )/, `${SYNC_LANG_LINKS}`);

  // Remove direct ad script include.
  html = html.replace(/\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-1010168647313500" crossorigin="anonymous"><\/script>\s*/g, '\n');

  // Remove inline Userback block.
  html = html.replace(/\s*<script>\s*window\.Userback\s*=\s*window\.Userback\s*\|\|\s*\{\};[\s\S]*?static\.userback\.io\/widget\/v1\.js[\s\S]*?<\/script>\s*/g, '\n');

  // Ensure deferred third-party loader is present.
  if (!html.includes('/assets/js/third-party-loader.js')) {
    let modes = ['ads'];
    const tag = `\n    <script defer src="/assets/js/third-party-loader.js"></script>\n`;
    html = html.replace(/<html\s+lang="([^"]+)"[^>]*>/i, `<html lang="$1" data-third-party="${modes.join(',')}">`);
    html = html.replace('</head>', `${tag}</head>`);
  } else if (!/data-third-party=/.test(html)) {
    let modes = ['ads'];
    html = html.replace(/<html\s+lang="([^"]+)"[^>]*>/i, `<html lang="$1" data-third-party="${modes.join(',')}">`);
  }

  if (html !== orig) fs.writeFileSync(file, html);
  return html !== orig;
}

let changed = 0;
for (const file of pages) {
  if (!fs.existsSync(file)) continue;
  if (patchOne(file)) changed++;
}
console.log(`seo hosting patch updated files: ${changed}`);
