#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ALL_LOCALES,
  NON_KO_LOCALES,
  FOOTER_LABELS
} = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = NON_KO_LOCALES;
const TEAM_GENERATOR_LOCALES = ALL_LOCALES;
const PINNED_MODEL_VIEWER_URL = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
const FLOATING_MODEL_VIEWER_URL = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
const OPERATOR_INSTAGRAM_URL = 'https://www.instagram.com/juntaeko_tr';
const ROBOTS_TXT = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
const THIRD_PARTY_LOADER = fs.readFileSync(path.join(ROOT, 'assets/js/third-party-loader.js'), 'utf8');
const LOCALIZED_LEGAL = new Set(NON_KO_LOCALES);
const LOCALE_PATTERN = NON_KO_LOCALES.map((locale) => locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const ALIAS_REDIRECTS = {
  'ko-kr': 'ko',
  'ja-jp': 'ja',
  'zh-hans': 'zh-cn',
  'zh-hans-cn': 'zh-cn',
  'zh-hk': 'zh-tw',
  'zh-hant': 'zh-tw',
  'zh-mo': 'zh-tw',
  'es-es': 'es',
  'fr-fr': 'fr',
  'de-de': 'de',
  'en-us': 'en',
  'hi-in': 'hi',
  'id-id': 'id',
  'it-it': 'it',
  'ru-ru': 'ru',
  'th-th': 'th',
  'tr-tr': 'tr',
  'vi-vn': 'vi',
  'ar-ae': 'ar',
  'nl-nl': 'nl'
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
    } else if (entry.isFile() && (entry.name === 'index.html' || entry.name === '404.html')) {
      out.push(fullPath);
    }
  }
  return out;
}

function pagePathFromFile(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function extractCanonical(html) {
  const match = html.match(/<link rel="canonical" href="https:\/\/randomly-pick\.com([^"#?]+)"/i);
  return match ? match[1] : null;
}

function extractTeamGeneratorDataMap(source) {
  const start = source.indexOf('const dataMap = ');
  const end = source.indexOf('\n  function normalizeLang');
  if (start === -1 || end === -1) throw new Error('Could not locate team-generator dataMap.');
  return JSON.parse(source.slice(start + 'const dataMap = '.length, end).trim().replace(/;$/, ''));
}

function extractElementTextById(html, id) {
  const match = html.match(new RegExp(`<([a-z0-9:-]+)[^>]*\\bid="${escapeRegExp(id)}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'i'));
  return match ? match[2].replace(/\s+/g, ' ').trim() : null;
}

function extractAttributeById(html, id, attr) {
  const tagMatch = html.match(new RegExp(`<[^>]*\\bid="${escapeRegExp(id)}"[^>]*>`, 'i'));
  if (!tagMatch) return null;
  const attrMatch = tagMatch[0].match(new RegExp(`\\b${escapeRegExp(attr)}="([^"]*)"`, 'i'));
  return attrMatch ? attrMatch[1] : null;
}

function extractCodeById(html, id) {
  const match = html.match(new RegExp(`<code[^>]*\\bid="${escapeRegExp(id)}"[^>]*>([\\s\\S]*?)<\\/code>`, 'i'));
  return match ? match[1].replace(/\r\n/g, '\n').trim() : null;
}

function footerHrefFor(locale, slug) {
  if (!locale || locale === 'ko') return `/${slug}/`;
  return `/${locale}/${slug}/`;
}

function buildTeamGeneratorExampleTable(data) {
  return [`${data.exampleHeaderName}\t${data.exampleHeaderScore}`].concat((data.sampleBalanced || []).slice(0, 4)).join('\n');
}

function buildTeamGeneratorExampleSlash(data) {
  return (data.sampleBalanced || []).slice(0, 4).map((row) => row.replace(/\t+/, ' / ')).join('\n');
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function isNoindex(html) {
  return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
}

function hasRefresh(html) {
  return /<meta http-equiv="refresh"/i.test(html);
}

function hasUnsafeSyncLangLinks(source) {
  const match = source.match(/function syncLangLinks\(\)\s*\{[\s\S]*?\n\s*\}/);
  return !!(match && /searchParams\.set\((['"])lang\1,\s*state\.locale\)/.test(match[0]));
}

function hasSafeCanonicalPatch(html) {
  return html.includes('data-rlt-canonical-patch') && html.includes('supportedLangs');
}

function hasSafeLegalPatch(html) {
  return html.includes('data-rlt-legal-canonical-patch');
}

function hasSafeAboutPatch(html) {
  return html.includes('data-rlt-about-canonical-patch');
}

function hasEmptySoftwareApplicationDescription(html) {
  return /"@type":\s*"SoftwareApplication"[\s\S]*?"description":\s*""/.test(html);
}

function hasConsentRegionDisclosure(html) {
  const eea = /EEA|EWR|EEE|EER|SEE|ЕЭЗ|المنطقة الاقتصادية الأوروبية/i.test(html);
  const uk = /UK|영국|英国|英國|Reino Unido|Royaume-Uni|Vereinigten Königreich|यूनाइटेड किंगडम|المملكة المتحدة|Великобритани|Inggris|Birleşik Krallık|Regno Unito|Vương quốc Anh|สหราชอาณาจักร|Verenigd Koninkrijk|VK/i.test(html);
  const switzerland = /Switzerland|스위스|スイス|瑞士|Suiza|Suisse|Schweiz|Suíça|İsviçre|स्विट्ज़रलैंड|سويسرا|Швейцари|Swiss|Thụy Sĩ|สวิตเซอร์แลนด์|Zwitserland|Svizzera/i.test(html);
  return eea && uk && switzerland;
}

function validateDiceCoin3DRuntime(page, findings) {
  const isDicePage = new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?dice\\/$`).test(page.pagePath);
  const isCoinPage = new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?coinflip\\/$`).test(page.pagePath);
  if (!isDicePage && !isCoinPage) return;

  if (!page.html.includes(PINNED_MODEL_VIEWER_URL)) {
    findings.push(`${page.pagePath}: missing pinned model-viewer runtime (${PINNED_MODEL_VIEWER_URL}).`);
  }
  if (page.html.includes(FLOATING_MODEL_VIEWER_URL)) {
    findings.push(`${page.pagePath}: floating model-viewer runtime must not be deployed.`);
  }

  const requiredAsset = isDicePage ? '/dice.glb' : '/stylized_pirate_coin.glb';
  if (!page.html.includes(requiredAsset)) {
    findings.push(`${page.pagePath}: missing required 3D asset reference ${requiredAsset}.`);
  }
}

function validateEnglishAcquisitionSignals(page, findings) {
  if (page.pagePath === '/' || page.pagePath === '/en/') {
    if (!page.html.includes('hreflang="x-default" href="https://randomly-pick.com/en/"')) {
      findings.push(`${page.pagePath}: x-default should point to /en/ for English-first fallback.`);
    }
  }

  if (page.pagePath === '/en/') {
    const title = extractTitle(page.html);
    if (!/Wheel of Names/i.test(title)) {
      findings.push(`${page.pagePath}: title should target "Wheel of Names".`);
    }
    if (!page.html.includes('Lucky Draw')) {
      findings.push(`${page.pagePath}: page should mention "Lucky Draw".`);
    }
    if (!page.html.includes('Random Name Picker')) {
      findings.push(`${page.pagePath}: page should mention "Random Name Picker".`);
    }
    if (hasEmptySoftwareApplicationDescription(page.html)) {
      findings.push(`${page.pagePath}: SoftwareApplication description must not be empty.`);
    }
  }

  if (page.pagePath === '/en/luckydraw/') {
    const title = extractTitle(page.html);
    if (!/Random Number Generator/i.test(title)) {
      findings.push(`${page.pagePath}: title should target "Random Number Generator".`);
    }
    if (!page.html.includes('Lucky Draw')) {
      findings.push(`${page.pagePath}: page should mention "Lucky Draw".`);
    }
    if (!page.html.includes('Name Picker')) {
      findings.push(`${page.pagePath}: page should mention "Name Picker".`);
    }
    if (hasEmptySoftwareApplicationDescription(page.html)) {
      findings.push(`${page.pagePath}: SoftwareApplication description must not be empty.`);
    }
  }

  if (page.pagePath === '/en/dice/') {
    if (!page.html.includes('tabletop RPGs')) {
      findings.push(`${page.pagePath}: page should include the expanded English dice SEO copy.`);
    }
  }

  if (page.pagePath === '/en/ladder/') {
    const title = extractTitle(page.html);
    if (!/Online Ladder Draw/i.test(title)) {
      findings.push(`${page.pagePath}: title should target "Online Ladder Draw".`);
    }
    if (!page.html.includes('event matchups')) {
      findings.push(`${page.pagePath}: page should include the visible English ladder description.`);
    }
  }

  if (page.pagePath === '/en/team-generator/') {
    const title = extractTitle(page.html);
    if (!/Random Team Generator/i.test(title)) {
      findings.push(`${page.pagePath}: title should target "Random Team Generator".`);
    }
    if (!page.html.includes('"@type": "SoftwareApplication"')) {
      findings.push(`${page.pagePath}: missing SoftwareApplication structured data.`);
    }
    if (!page.html.includes('"@type": "FAQPage"')) {
      findings.push(`${page.pagePath}: missing FAQPage structured data.`);
    }
  }

  if (page.pagePath === '/en/coinflip/') {
    const title = extractTitle(page.html);
    if (!/Flip a Coin!/.test(title)) {
      findings.push(`${page.pagePath}: title should use "Flip a Coin!" phrasing.`);
    }
  }
}

function validateSnakeGamePage(page, findings) {
  const isSnakePage = page.pagePath === '/games/snake/' || page.pagePath === '/en/games/snake/';
  if (!isSnakePage) return;

  const title = extractTitle(page.html);
  if (!/Snake/i.test(title)) {
    findings.push(`${page.pagePath}: title should target "Snake".`);
  }

  if (!page.html.includes('/assets/js/games-snake.js')) {
    findings.push(`${page.pagePath}: missing Snake JavaScript reference.`);
  }

  for (const token of [
    'window.__WEBGAME_QA_READY__ = true',
    'window.QA_READY = true',
    'window.render_game_to_text',
    'window.advanceTime',
    'window.resetGame',
    'window.reset = resetGame'
  ]) {
    if (!SNAKE_GAME_SOURCE.includes(token)) {
      findings.push(`${page.pagePath}: missing Snake QA hook ${token}.`);
    }
  }

  for (const id of ['snake-start', 'snake-pause', 'snake-restart', 'snake-board', 'snake-mode', 'snake-score', 'snake-best', 'snake-target', 'snake-status']) {
    if (!page.html.includes(`id="${id}"`)) {
      findings.push(`${page.pagePath}: missing Snake UI node #${id}.`);
    }
  }

  for (const id of ['guide-title', 'howto-title', 'uses-title', 'related-title']) {
    if (!page.html.includes(`id="${id}"`)) {
      findings.push(`${page.pagePath}: missing editorial heading #${id}.`);
    }
  }

  if (!page.html.includes('snake-controls')) {
    findings.push(`${page.pagePath}: missing on-screen directional controls.`);
  }
  if (!page.html.includes('snake-copy-grid')) {
    findings.push(`${page.pagePath}: missing editorial copy grid.`);
  }
  if (!page.html.includes('<canvas id="snake-board"')) {
    findings.push(`${page.pagePath}: missing canvas game board.`);
  }
}

function validateTrustComplianceSignals(page, findings) {
  const anyLocalizedPath = `(?:${LOCALE_PATTERN})\\/`;
  if (page.html.includes(OPERATOR_INSTAGRAM_URL)) {
    findings.push(`${page.pagePath}: operator footer link should stay on-site, not Instagram.`);
  }

  if (new RegExp(`^\\/(?:(?:${anyLocalizedPath})|)?about\\/$`).test(page.pagePath)) {
    if (!page.html.includes('newgotae@gmail.com')) {
      findings.push(`${page.pagePath}: about page should include direct operator contact.`);
    }
    if (!page.html.includes('localStorage')) {
      findings.push(`${page.pagePath}: about page should mention browser-local processing.`);
    }
    if (!hasConsentRegionDisclosure(page.html)) {
      findings.push(`${page.pagePath}: about page should include consent-region disclosure.`);
    }
    if (!/\/contact\/|\/privacy\/|\/terms\//.test(page.html)) {
      findings.push(`${page.pagePath}: about page should link to the main policy pages.`);
    }
  }

  if (new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?privacy\\/$`).test(page.pagePath)) {
    if (!page.html.includes('localStorage')) {
      findings.push(`${page.pagePath}: privacy page should mention browser storage usage.`);
    }
    if (!hasConsentRegionDisclosure(page.html)) {
      findings.push(`${page.pagePath}: privacy page should mention consent-region disclosure.`);
    }
  }

  if (new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?contact\\/$`).test(page.pagePath)) {
    if (!page.html.includes('Juntae Ko')) {
      findings.push(`${page.pagePath}: contact page should identify the operator.`);
    }
    if (!/\/about\/|\/privacy\/|\/terms\//.test(page.html)) {
      findings.push(`${page.pagePath}: contact page should link to policy pages.`);
    }
  }
}

function validatePublishedGamePages(page, findings) {
  const publishedGamePages = [
    ['/games/snake/', 'Snake', '/assets/js/games-snake.js'],
    ['/en/games/snake/', 'Snake', '/assets/js/games-snake.js'],
    ['/games/number-merge/', 'Number Merge', '/assets/js/games-number-merge.js'],
    ['/en/games/number-merge/', 'Number Merge', '/assets/js/games-number-merge.js'],
    ['/games/brick-breaker/', 'Brick Breaker', '/assets/js/games-brick-breaker.js'],
    ['/en/games/brick-breaker/', 'Brick Breaker', '/assets/js/games-brick-breaker.js']
  ];
  const match = publishedGamePages.find(([pagePath]) => page.pagePath === pagePath);
  if (!match) return;

  const [, titleTerm, scriptRef] = match;
  const title = extractTitle(page.html);
  if (!new RegExp(titleTerm, 'i').test(title)) {
    findings.push(`${page.pagePath}: title should target "${titleTerm}".`);
  }
  if (!page.html.includes(scriptRef)) {
    findings.push(`${page.pagePath}: missing game JavaScript reference ${scriptRef}.`);
  }
}

function localeFromFooterPage(pagePath) {
  if (
    pagePath === '/games/snake/' ||
    pagePath === '/en/games/snake/' ||
    pagePath === '/games/number-merge/' ||
    pagePath === '/en/games/number-merge/' ||
    pagePath === '/games/brick-breaker/' ||
    pagePath === '/en/games/brick-breaker/'
  ) {
    return null;
  }
  if (
    pagePath === '/' ||
    /^\/(?:luckydraw|ladder|coinflip|dice|team-generator|games\/snake|games\/number-merge|games\/brick-breaker)\/$/.test(pagePath)
  ) {
    return 'ko';
  }
  const match = pagePath.match(new RegExp(`^\\/(${LOCALE_PATTERN})(?:\\/(?:luckydraw|ladder|coinflip|dice|team-generator|games\\/snake|games\\/number-merge|games\\/brick-breaker))?\\/$`));
  return match ? match[1] : null;
}

function validateLocalizedFooterFallback(page, findings) {
  const locale = localeFromFooterPage(page.pagePath);
  if (!locale) return;

  const labels = FOOTER_LABELS[locale];
  if (!labels) return;

  const checks = [
    ['footer-terms', labels.terms, footerHrefFor(locale, 'terms')],
    ['footer-privacy', labels.privacy, footerHrefFor(locale, 'privacy')],
    ['footer-about', labels.about, footerHrefFor(locale, 'about')],
    ['footer-contact', labels.contact, footerHrefFor(locale, 'contact')]
  ];

  for (const [id, text, href] of checks) {
    const actualText = extractElementTextById(page.html, id);
    const actualHref = extractAttributeById(page.html, id, 'href');
    if (actualText !== text) {
      findings.push(`${page.pagePath}: ${id} text drifted (${actualText || 'missing'}).`);
    }
    if (actualHref !== href) {
      findings.push(`${page.pagePath}: ${id} href drifted (${actualHref || 'missing'}).`);
    }
  }
}

const TEAM_GENERATOR_TEXT_CHECKS = [
  ['lang-button-label', 'langButton'],
  ['chip-missing', 'chipMissing'],
  ['chip-gap', 'chipGap'],
  ['stat-input-label', 'statInputLabel'],
  ['stat-input-note', 'statInputNote'],
  ['stat-mode-label', 'statModeLabel'],
  ['stat-mode-note', 'statModeNote'],
  ['stat-output-label', 'statOutputLabel'],
  ['stat-output-note', 'statOutputNote'],
  ['howto-3', 'howTo3'],
  ['howto-4', 'howTo4'],
  ['example-title', 'exampleTitle'],
  ['footer-copy', 'footerCopy']
];

const TEAM_GENERATOR_ATTR_CHECKS = [
  ['lang-search', 'placeholder', 'langSearch'],
  ['lang-search-mobile', 'placeholder', 'langSearch'],
  ['lang-trigger', 'aria-label', 'langButtonAria'],
  ['lang-trigger-mobile', 'aria-label', 'langButtonAria'],
  ['roster-input', 'placeholder', 'rosterPlaceholder']
];

function localeFromTeamGeneratorPath(pagePath) {
  if (pagePath === '/team-generator/') return 'ko';
  const match = pagePath.match(new RegExp(`^\\/(${LOCALE_PATTERN})\\/team-generator\\/$`));
  return match ? match[1] : null;
}

function validateTeamGeneratorLocaleSync(page, findings) {
  const locale = localeFromTeamGeneratorPath(page.pagePath);
  if (!locale) return;

  const data = TEAM_GENERATOR_DATA_MAP[locale];
  if (!data) {
    findings.push(`${page.pagePath}: missing team-generator locale data.`);
    return;
  }

  for (const key of ['exampleHeaderName', 'exampleHeaderScore', 'langButtonAria']) {
    if (!data[key]) findings.push(`${page.pagePath}: missing i18n field ${key}.`);
  }

  for (const [id, key] of TEAM_GENERATOR_TEXT_CHECKS) {
    const actual = extractElementTextById(page.html, id);
    if (actual == null) {
      findings.push(`${page.pagePath}: missing text node #${id}.`);
      continue;
    }
    const expected = String(data[key]).replace(/\s+/g, ' ').trim();
    if (actual !== expected) findings.push(`${page.pagePath}: #${id} does not match ${key}.`);
  }

  for (const [id, attr, key] of TEAM_GENERATOR_ATTR_CHECKS) {
    const actual = extractAttributeById(page.html, id, attr);
    if (actual == null) {
      findings.push(`${page.pagePath}: missing ${attr} on #${id}.`);
      continue;
    }
    if (actual !== data[key]) findings.push(`${page.pagePath}: #${id} ${attr} does not match ${key}.`);
  }

  const tableExample = extractCodeById(page.html, 'example-code-table');
  const slashExample = extractCodeById(page.html, 'example-code-slash');
  if (tableExample == null || tableExample !== buildTeamGeneratorExampleTable(data)) {
    findings.push(`${page.pagePath}: localized table example is out of sync.`);
  }
  if (slashExample == null || slashExample !== buildTeamGeneratorExampleSlash(data)) {
    findings.push(`${page.pagePath}: localized slash example is out of sync.`);
  }

  if (locale !== 'en') {
    const forbidden = [
      'Change language',
      'Search language',
      'Input examples',
      'Paste two Excel columns directly',
      'Ready for meetings and chats',
      'Switch based on your event',
      'Choose how many teams to create'
    ];
    for (const phrase of forbidden) {
      if (page.html.includes(phrase)) findings.push(`${page.pagePath}: still contains English static copy (${phrase}).`);
    }
  }
}

function extractLocalHrefs(html) {
  const hrefs = [];
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('//')) continue;
    hrefs.push(href);
  }
  return hrefs;
}

function normalizeHref(href) {
  return href.replace(/[?#].*$/, '');
}

function buildRedirectTargets() {
  const out = new Set(['/roulette/', '/lotto/']);
  for (const locale of LOCALES) {
    out.add(`/${locale}/roulette/`);
  }
  for (const alias of Object.keys(ALIAS_REDIRECTS)) {
    out.add(`/${alias}/coinflip/`);
    out.add(`/${alias}/dice/`);
  }
  return out;
}

function sitemapUrls() {
  const out = new Set();
  for (const file of ['sitemap-main.xml', 'sitemap-locales.xml']) {
    const xml = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const match of xml.matchAll(/<loc>https:\/\/randomly-pick\.com([^<]+)<\/loc>/g)) {
      const urlPath = match[1];
      if (!urlPath.startsWith('/sitemap-')) out.add(urlPath);
    }
  }
  return out;
}

const MAIN_SITEMAP_XML = fs.readFileSync(path.join(ROOT, 'sitemap-main.xml'), 'utf8');
const TEAM_GENERATOR_I18N_SOURCE = fs.readFileSync(path.join(ROOT, 'assets/js/team-generator-i18n.js'), 'utf8');
const SNAKE_GAME_SOURCE = fs.readFileSync(path.join(ROOT, 'assets/js/games-snake.js'), 'utf8');
const TEAM_GENERATOR_DATA_MAP = extractTeamGeneratorDataMap(TEAM_GENERATOR_I18N_SOURCE);

const files = walk(ROOT);
const redirectTargets = buildRedirectTargets();
const sitemaps = sitemapUrls();
const pages = new Map();

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const pagePath = pagePathFromFile(file);
  pages.set(pagePath, {
    file,
    pagePath,
    html,
    canonical: extractCanonical(html),
    noindex: isNoindex(html),
    refresh: hasRefresh(html),
    hrefs: extractLocalHrefs(html)
  });
}

const findings = [];

for (const page of pages.values()) {
  if (page.pagePath === '/404.html') {
    if (!page.noindex) findings.push(`${page.pagePath}: 404 page must remain noindex.`);
    continue;
  }

  if (page.refresh) findings.push(`${page.pagePath}: meta refresh redirect page should not be deployed.`);
  if (page.noindex) findings.push(`${page.pagePath}: noindex page should not be deployed.`);
  if (page.canonical !== page.pagePath) findings.push(`${page.pagePath}: canonical mismatch (${page.canonical || 'missing'}).`);
  if (hasUnsafeSyncLangLinks(page.html)) findings.push(`${page.pagePath}: syncLangLinks adds ?lang= to non-tool links.`);

  const isToolIndex = page.pagePath === '/' || new RegExp(`^\\/(?:${LOCALE_PATTERN})\\/$`).test(page.pagePath);
  const isToolPage = new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?(?:luckydraw|ladder|coinflip|dice)\\/$`).test(page.pagePath);
  const isLegalPage = new RegExp(`^\\/(?:(?:${LOCALE_PATTERN})\\/)?(?:about|contact|privacy|terms)\\/$`).test(page.pagePath);
  if ((isToolIndex || isToolPage) && !hasSafeCanonicalPatch(page.html)) findings.push(`${page.pagePath}: missing safe query normalization patch.`);
  if (isLegalPage && !hasSafeLegalPatch(page.html)) findings.push(`${page.pagePath}: missing legal page query normalization patch.`);
  validateDiceCoin3DRuntime(page, findings);
  validateEnglishAcquisitionSignals(page, findings);
  validateSnakeGamePage(page, findings);
  validatePublishedGamePages(page, findings);
  validateTrustComplianceSignals(page, findings);
  validateLocalizedFooterFallback(page, findings);
  validateTeamGeneratorLocaleSync(page, findings);

  const indexable = !page.refresh && !page.noindex && page.canonical === page.pagePath;
  if (indexable && !sitemaps.has(page.pagePath)) findings.push(`${page.pagePath}: indexable page missing from sitemap.`);

  for (const rawHref of page.hrefs) {
    const href = normalizeHref(rawHref);
    if (redirectTargets.has(href)) {
      findings.push(`${page.pagePath}: internal link points to redirected URL ${href}.`);
      continue;
    }
    if (href.startsWith('/assets/') || href === '/favicon-r.svg') continue;
    if (href.endsWith('.xml') || href.endsWith('.txt') || href.endsWith('.svg') || href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.webp') || href.endsWith('.ico')) continue;
    if (href === '/') continue;
    if (pages.has(href)) continue;
    findings.push(`${page.pagePath}: internal link target missing ${href}.`);
  }
}

if (!/<loc>https:\/\/randomly-pick\.com\/<\/loc>[\s\S]*?<xhtml:link rel="alternate" hreflang="x-default" href="https:\/\/randomly-pick\.com\/en\/"\/>/.test(MAIN_SITEMAP_XML)) {
  findings.push('sitemap-main.xml: root x-default should point to https://randomly-pick.com/en/.');
}

if (!/Sitemap:\s*https:\/\/randomly-pick\.com\/sitemap\.xml/.test(ROBOTS_TXT)) {
  findings.push('robots.txt: Sitemap directive should point to https://randomly-pick.com/sitemap.xml.');
}

if (!TEAM_GENERATOR_I18N_SOURCE.includes('"seoTitle":"Random Team Generator | Balanced Team Splitter"')) {
  findings.push('assets/js/team-generator-i18n.js: missing English random team generator SEO title.');
}

if (!TEAM_GENERATOR_I18N_SOURCE.includes('"heroTitle":"Random Team Generator and Balanced Team Splitter"')) {
  findings.push('assets/js/team-generator-i18n.js: missing English team-generator hero title update.');
}

if (THIRD_PARTY_LOADER.includes("querySelectorAll('#footer-contact, [data-userback-trigger]')")) {
  findings.push('assets/js/third-party-loader.js: footer contact must not be intercepted by Userback.');
}

for (const locale of TEAM_GENERATOR_LOCALES) {
  if (!TEAM_GENERATOR_DATA_MAP[locale]) findings.push(`assets/js/team-generator-i18n.js: missing locale block ${locale}.`);
}

for (const rel of ['assets/js/lotto.js', 'assets/js/ladder.js', 'assets/js/games-snake.js', 'assets/js/games-number-merge.js', 'assets/js/games-brick-breaker.js', 'scripts/sync-roulette-entrypoints.js', 'scripts/seo-hosting-patch.js']) {
  const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (hasUnsafeSyncLangLinks(source)) findings.push(`${rel}: source still appends ?lang= to non-tool links.`);
}

if (findings.length) {
  console.error('SEO validation failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.size} HTML files.`);
