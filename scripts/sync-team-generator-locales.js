#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, NON_KO_LOCALES } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const I18N_PATH = path.join(ROOT, 'assets/js/team-generator-i18n.js');
const ASSET_VERSION = '20260317-team-results-guide1';
const FLAG_PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const LOCALES = ALL_LOCALES;
const TEXT_IDS = [
  ['nav-spin', 'navSpin'],
  ['nav-lotto', 'navLotto'],
  ['nav-ladder', 'navLadder'],
  ['nav-team', 'navTeam'],
  ['nav-coin', 'navCoin'],
  ['nav-dice', 'navDice'],
  ['mnav-spin', 'mnavSpin'],
  ['mnav-lotto', 'mnavLotto'],
  ['mnav-ladder', 'mnavLadder'],
  ['mnav-team', 'mnavTeam'],
  ['mnav-coin', 'mnavCoin'],
  ['mnav-dice', 'mnavDice'],
  ['lang-button-label', 'langButton'],
  ['hero-badge', 'heroBadge'],
  ['hero-title', 'heroTitle'],
  ['hero-body', 'heroBody'],
  ['chip-teams', 'chipTeams'],
  ['chip-missing', 'chipMissing'],
  ['chip-gap', 'chipGap'],
  ['stat-input-label', 'statInputLabel'],
  ['stat-input-value', 'statInputValue'],
  ['stat-input-note', 'statInputNote'],
  ['stat-mode-label', 'statModeLabel'],
  ['stat-mode-value', 'statModeValue'],
  ['stat-mode-note', 'statModeNote'],
  ['stat-output-label', 'statOutputLabel'],
  ['stat-output-value', 'statOutputValue'],
  ['stat-output-note', 'statOutputNote'],
  ['input-settings-title', 'inputSettingsTitle'],
  ['input-support-hint', 'inputSupportHint'],
  ['mode-label', 'modeLabel'],
  ['mode-random-title', 'modeRandomTitle'],
  ['mode-random-body', 'modeRandomBody'],
  ['mode-balanced-title', 'modeBalancedTitle'],
  ['mode-balanced-body', 'modeBalancedBody'],
  ['team-count-label', 'teamCountLabel'],
  ['team-count-hint', 'teamCountHint'],
  ['participants-label', 'participantsLabel'],
  ['scored-label', 'scoredLabel'],
  ['missing-label', 'missingLabel'],
  ['roster-label', 'rosterLabel'],
  ['roster-hint', 'rosterHint'],
  ['generate-btn-label', 'generateBtn'],
  ['results-title', 'resultsTitle'],
  ['reroll-btn', 'rerollBtn'],
  ['copy-btn', 'copyBtn'],
  ['export-btn', 'exportBtn'],
  ['empty-title', 'emptyTitle'],
  ['empty-body', 'emptyBody'],
  ['howto-title', 'howToTitle'],
  ['howto-1', 'howTo1'],
  ['howto-2', 'howTo2'],
  ['howto-3', 'howTo3'],
  ['howto-4', 'howTo4'],
  ['howto-5', 'howTo5'],
  ['howto-6', 'howTo6'],
  ['battle-guide-title', 'battleGuideTitle'],
  ['battle-guide-body', 'battleGuideBody'],
  ['battle-guide-step1-title', 'battleGuideStep1Title'],
  ['battle-guide-step1-body', 'battleGuideStep1Body'],
  ['battle-guide-step2-title', 'battleGuideStep2Title'],
  ['battle-guide-step2-body', 'battleGuideStep2Body'],
  ['battle-guide-step3-title', 'battleGuideStep3Title'],
  ['battle-guide-step3-body', 'battleGuideStep3Body'],
  ['example-title', 'exampleTitle'],
  ['faq-title', 'faqTitle'],
  ['faq1-q', 'faq1Q'],
  ['faq1-a', 'faq1A'],
  ['faq2-q', 'faq2Q'],
  ['faq2-a', 'faq2A'],
  ['faq3-q', 'faq3Q'],
  ['faq3-a', 'faq3A'],
  ['faq4-q', 'faq4Q'],
  ['faq4-a', 'faq4A'],
  ['related-title', 'relatedTitle'],
  ['related-spin', 'navSpin'],
  ['related-lotto', 'navLotto'],
  ['related-ladder', 'navLadder'],
  ['related-coin', 'navCoin'],
  ['related-dice', 'navDice'],
  ['footer-copy', 'footerCopy'],
  ['footer-terms', 'footerTerms'],
  ['footer-privacy', 'footerPrivacy'],
  ['footer-about', 'footerAbout'],
  ['footer-contact', 'footerContact']
];
const ATTRIBUTE_IDS = [
  ['lang-search', 'placeholder', 'langSearch'],
  ['lang-search-mobile', 'placeholder', 'langSearch'],
  ['roster-input', 'placeholder', 'rosterPlaceholder'],
  ['lang-trigger', 'aria-label', 'langButtonAria'],
  ['lang-trigger-mobile', 'aria-label', 'langButtonAria']
];
const SHARED_ASSET_BLOCK = `  <script>
    (function () {
      try {
        var params = new URLSearchParams(window.location.search);
        var localQa = params.get('qa') === '1';
        var headlessQa = params.get('qa_headless') === '1';
        window.__TEAM_GENERATOR_LOCAL_QA__ = localQa;
        if (!localQa) return;
        document.documentElement.classList.remove('i18n-pending');
        document.documentElement.setAttribute('data-team-generator-qa', 'true');
        if (headlessQa) {
          document.documentElement.setAttribute('data-team-generator-qa-headless', 'true');
        }
        var qaStyles = document.createElement('link');
        qaStyles.rel = 'stylesheet';
        qaStyles.href = '/assets/css/team-generator-qa.css?v=${ASSET_VERSION}';
        document.head.appendChild(qaStyles);
        document.addEventListener('DOMContentLoaded', function () {
          document.documentElement.classList.remove('i18n-pending');
        }, { once: true });
        window.dataLayer = window.dataLayer || [];
        window.tailwind = window.tailwind || {};
      } catch (error) {
        window.__TEAM_GENERATOR_LOCAL_QA__ = false;
      }
    })();
  </script>
  <script defer src="/assets/js/third-party-loader.js"></script>
  <script>
    if (!window.__TEAM_GENERATOR_LOCAL_QA__) {
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P4JDC9CR');
    }
  </script>
  <script>
    (function () {
      if (window.__TEAM_GENERATOR_LOCAL_QA__) return;
      document.write('<script src="https://cdn.tailwindcss.com"><\\\\/script>');
      document.write('<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"><\\\\/script>');
      document.write('<link rel="preconnect" href="https://flagcdn.com" crossorigin>');
      document.write('<link rel="dns-prefetch" href="https://flagcdn.com">');
      document.write('<link rel="preconnect" href="https://fonts.googleapis.com">');
      document.write('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
      document.write('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />');
    })();
  </script>
  <script>
    if (!window.__TEAM_GENERATOR_LOCAL_QA__) {
      tailwind.config={theme:{extend:{fontFamily:{sans:['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','sans-serif']}}}};
    }
  </script>`;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function parseDataMap() {
  const source = fs.readFileSync(I18N_PATH, 'utf8');
  const start = source.indexOf('const dataMap = ');
  const end = source.indexOf('\n  function normalizeLang');
  if (start === -1 || end === -1) throw new Error('Could not locate team-generator dataMap.');
  return JSON.parse(source.slice(start + 'const dataMap = '.length, end).trim().replace(/;$/, ''));
}

function localeFile(locale) {
  return locale === 'ko'
    ? path.join(ROOT, 'team-generator/index.html')
    : path.join(ROOT, locale, 'team-generator', 'index.html');
}

function legalBase(locale) {
  if (!locale || locale === 'ko') return '';
  return `/${locale}`;
}

function targetHref(locale, slug) {
  return `${legalBase(locale)}/${slug}/`.replace('//', '/');
}

function replaceTextById(html, id, value) {
  const pattern = new RegExp(`(<([a-z0-9:-]+)[^>]*\\bid="${escapeRegExp(id)}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'i');
  if (!pattern.test(html)) throw new Error(`Missing text node id="${id}"`);
  return html.replace(pattern, (_, open, tag, _inner, close) => `${open}${escapeHtml(value)}${close}`);
}

function replaceAttributeById(html, id, attr, value) {
  const tagPattern = new RegExp(`<[^>]*\\bid="${escapeRegExp(id)}"[^>]*>`, 'i');
  const tag = html.match(tagPattern);
  if (!tag) throw new Error(`Missing element id="${id}"`);
  let nextTag;
  if (new RegExp(`\\b${escapeRegExp(attr)}="[^"]*"`, 'i').test(tag[0])) {
    nextTag = tag[0].replace(new RegExp(`(${escapeRegExp(attr)}=")[^"]*(")`, 'i'), `$1${escapeAttr(value)}$2`);
  } else {
    nextTag = tag[0].replace(/>$/, ` ${attr}="${escapeAttr(value)}">`);
  }
  return html.replace(tag[0], nextTag);
}

function ensureClassById(html, id, className) {
  const tagPattern = new RegExp(`<[^>]*\\bid="${escapeRegExp(id)}"[^>]*>`, 'i');
  const tag = html.match(tagPattern);
  if (!tag) throw new Error(`Missing element id="${id}"`);
  let nextTag = tag[0];
  if (/\bclass="[^"]*"/i.test(nextTag)) {
    nextTag = nextTag.replace(/\bclass="([^"]*)"/i, (_, classes) => {
      const tokens = classes.split(/\s+/).filter(Boolean);
      if (!tokens.includes(className)) tokens.push(className);
      return `class="${tokens.join(' ')}"`;
    });
  } else {
    nextTag = nextTag.replace(/>$/, ` class="${className}">`);
  }
  return html.replace(tag[0], nextTag);
}

function replaceMetaById(html, id, value) {
  const tagPattern = new RegExp(`<meta[^>]*\\bid="${escapeRegExp(id)}"[^>]*>`, 'i');
  const tag = html.match(tagPattern);
  if (!tag) throw new Error(`Missing meta id="${id}"`);
  if (!/\bcontent="[^"]*"/i.test(tag[0])) throw new Error(`Missing content on meta id="${id}"`);
  const nextTag = tag[0].replace(/\bcontent="[^"]*"/i, `content="${escapeAttr(value)}"`);
  return html.replace(tag[0], nextTag);
}

function replaceMetaByName(html, name, value) {
  const tagPattern = new RegExp(`<meta[^>]*\\bname="${escapeRegExp(name)}"[^>]*>`, 'i');
  const tag = html.match(tagPattern);
  if (!tag) throw new Error(`Missing meta name="${name}"`);
  if (!/\bcontent="[^"]*"/i.test(tag[0])) throw new Error(`Missing content on meta name="${name}"`);
  const nextTag = tag[0].replace(/\bcontent="[^"]*"/i, `content="${escapeAttr(value)}"`);
  return html.replace(tag[0], nextTag);
}

function replaceMetaByProperty(html, property, value) {
  const tagPattern = new RegExp(`<meta[^>]*\\bproperty="${escapeRegExp(property)}"[^>]*>`, 'i');
  const tag = html.match(tagPattern);
  if (!tag) throw new Error(`Missing meta property="${property}"`);
  if (!/\bcontent="[^"]*"/i.test(tag[0])) throw new Error(`Missing content on meta property="${property}"`);
  const nextTag = tag[0].replace(/\bcontent="[^"]*"/i, `content="${escapeAttr(value)}"`);
  return html.replace(tag[0], nextTag);
}

function buildExampleTable(data) {
  const rows = (data.sampleBalanced || []).slice(0, 4);
  return [`${data.exampleHeaderName}\t${data.exampleHeaderScore}`].concat(rows).join('\n');
}

function buildExampleSlash(data) {
  const rows = (data.sampleBalanced || []).slice(0, 4);
  return rows.map((row) => row.replace(/\t+/, ' / ')).join('\n');
}

function syncExampleBlocks(html, data) {
  let seen = 0;
  html = html.replace(/<code(?: id="example-code-(?:table|slash)")?>([\s\S]*?)<\/code>/g, () => {
    seen += 1;
    if (seen === 1) return `<code id="example-code-table">${escapeHtml(buildExampleTable(data))}</code>`;
    if (seen === 2) return `<code id="example-code-slash">${escapeHtml(buildExampleSlash(data))}</code>`;
    return '';
  });
  if (seen !== 2) throw new Error('Expected exactly two example code blocks.');
  return html;
}

function syncResultsPanelStructure(html) {
  html = html.replace(/<p id="results-intro"[^>]*>[\s\S]*?<\/p>/g, '');

  const resultsHeaderPattern = /<div class="flex flex-col gap-3 sm:flex-row sm:items-(?:start|center) sm:justify-between">[\s\S]*?<h2 id="results-title"([^>]*)>([\s\S]*?)<\/h2>[\s\S]*?<div class="flex flex-wrap gap-2">/i;
  if (!resultsHeaderPattern.test(html)) throw new Error('Missing results header structure.');
  html = html.replace(
    resultsHeaderPattern,
    `<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 id="results-title"$1>$2</h2><div class="flex flex-wrap gap-2">`
  );

  return ensureClassById(html, 'empty-body', 'whitespace-pre-line');
}

function syncGuideSectionStructure(html) {
  const guideLeftBlock = `<div><h2 id="howto-title" class="text-xl font-semibold tracking-tight text-slate-900">사용 방법</h2><ul class="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li id="howto-1">Excel에서 이름/점수 두 열을 그대로 복사해 입력창에 붙여넣습니다.</li><li id="howto-2">이름만 있는 목록이면 완전 랜덤, 점수까지 있으면 점수 밸런스를 선택합니다.</li><li id="howto-3">원하는 팀 수를 정하면 예상 팀 크기를 바로 보여줍니다.</li><li id="howto-4">팀이 정해지면 결과 영역의 점수입력 버튼을 눌러 팀원별 점수 입력 상태로 전환합니다.</li><li id="howto-5">경기가 끝난 뒤 각 팀원의 점수를 입력하면 팀 평균과 총점이 실시간으로 갱신됩니다.</li><li id="howto-6">가장 높은 평균을 기록한 팀이 승리 팀으로 표시되며, 결과는 복사나 CSV로 그대로 공유할 수 있습니다.</li></ul><div class="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4 shadow-sm md:p-5"><div class="flex items-start gap-3"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm"><iconify-icon icon="solar:medal-ribbons-star-linear" class="text-xl"></iconify-icon></div><div class="min-w-0"><h3 id="battle-guide-title" class="text-base font-semibold tracking-tight text-slate-900">팀 대결 점수판처럼 활용하기</h3><p id="battle-guide-body" class="mt-1 text-sm leading-6 text-slate-600">이 페이지는 팀을 나누는 용도에서 끝나지 않습니다. 팀이 만들어진 뒤 같은 결과 카드에서 각자 점수를 입력하면, 어느 팀이 이겼는지까지 바로 정리할 수 있습니다.</p></div></div><div class="mt-4 grid gap-3 sm:grid-cols-3"><div class="rounded-xl border border-slate-200 bg-white/90 p-3"><p id="battle-guide-step1-title" class="text-xs font-semibold text-slate-900">1. 팀 생성</p><p id="battle-guide-step1-body" class="mt-1 text-[12px] leading-5 text-slate-600">명단을 붙여넣고 팀 수를 정한 뒤 팀 결과를 먼저 만듭니다.</p></div><div class="rounded-xl border border-slate-200 bg-white/90 p-3"><p id="battle-guide-step2-title" class="text-xs font-semibold text-slate-900">2. 개인 점수 입력</p><p id="battle-guide-step2-body" class="mt-1 text-[12px] leading-5 text-slate-600">경기 후 점수입력 버튼을 눌러 이름 오른쪽 칸에 각자의 점수를 입력합니다.</p></div><div class="rounded-xl border border-slate-200 bg-white/90 p-3"><p id="battle-guide-step3-title" class="text-xs font-semibold text-slate-900">3. 승리 팀 확인</p><p id="battle-guide-step3-body" class="mt-1 text-[12px] leading-5 text-slate-600">팀 평균과 총점이 실시간으로 계산되고, 평균이 가장 높은 팀이 승리 팀으로 강조됩니다.</p></div></div></div></div>`;
  const guidePattern = /<div><h2 id="howto-title"[^>]*>[\s\S]*?(?=\s*<div><h2 id="example-title")/i;
  if (!guidePattern.test(html)) throw new Error('Missing guide how-to block.');
  return html.replace(guidePattern, guideLeftBlock);
}

function syncSharedAssetBlock(html) {
  const sharedBlockPattern = /  <script>\s+    \(function \(\) \{\s+      try \{\s+        var params = new URLSearchParams\(window\.location\.search\);[\s\S]*?  <script>\s+    if \(!window\.__TEAM_GENERATOR_LOCAL_QA__\) \{\s+      tailwind\.config=\{theme:\{extend:\{fontFamily:\{sans:\['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','sans-serif'\]\}\}\}\};\s+    \}\s+  <\/script>/;
  if (!sharedBlockPattern.test(html)) throw new Error('Missing shared asset block.');
  return html.replace(sharedBlockPattern, SHARED_ASSET_BLOCK);
}

function syncPage(locale, data) {
  const file = localeFile(locale);
  let html = fs.readFileSync(file, 'utf8');

  const htmlTag = data.dir === 'rtl' ? `<html lang="${locale}" dir="rtl">` : `<html lang="${locale}">`;
  html = html.replace(/<html\b[^>]*>/i, htmlTag);
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(data.seoTitle)}</title>`);
  html = replaceMetaById(html, 'meta-description', data.seoDesc);
  html = replaceMetaByName(html, 'keywords', data.seoKeywords);
  html = replaceMetaById(html, 'meta-og-title', data.seoOgTitle);
  html = replaceMetaById(html, 'meta-og-description', data.seoOgDesc);
  html = replaceMetaByProperty(html, 'og:locale', data.ogLocale);
  html = replaceMetaById(html, 'meta-twitter-title', data.seoTwitterTitle);
  html = replaceMetaById(html, 'meta-twitter-description', data.seoTwitterDesc);
  html = syncResultsPanelStructure(html);
  html = syncGuideSectionStructure(html);

  for (const [id, key] of TEXT_IDS) {
    html = replaceTextById(html, id, data[key]);
  }
  for (const [id, attr, key] of ATTRIBUTE_IDS) {
    html = replaceAttributeById(html, id, attr, data[key]);
  }
  html = replaceAttributeById(html, 'lang-current-flag', 'src', FLAG_PLACEHOLDER_SRC);
  html = replaceAttributeById(html, 'lang-current-flag-mobile', 'src', FLAG_PLACEHOLDER_SRC);

  html = replaceAttributeById(html, 'footer-terms', 'href', targetHref(locale, 'terms'));
  html = replaceAttributeById(html, 'footer-privacy', 'href', targetHref(locale, 'privacy'));
  html = replaceAttributeById(html, 'footer-copy', 'href', targetHref(locale, 'about'));
  html = replaceAttributeById(html, 'footer-about', 'href', targetHref(locale, 'about'));
  html = replaceAttributeById(html, 'footer-contact', 'href', targetHref(locale, 'contact'));
  html = syncExampleBlocks(html, data);
  html = syncSharedAssetBlock(html);
  html = html.replace(/\/assets\/js\/team-generator-i18n\.js\?v=[^"]+/g, `/assets/js/team-generator-i18n.js?v=${ASSET_VERSION}`);
  html = html.replace(/\/assets\/js\/team-generator\.js\?v=[^"]+/g, `/assets/js/team-generator.js?v=${ASSET_VERSION}`);

  fs.writeFileSync(file, html);
}

function main() {
  const dataMap = parseDataMap();
  for (const locale of LOCALES) {
    const data = dataMap[locale];
    if (!data) throw new Error(`Missing dataMap locale ${locale}`);
    syncPage(locale, data);
  }
  console.log(`Synced ${LOCALES.length} team-generator locale pages.`);
}

main();
