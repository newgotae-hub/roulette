#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'fr', 'de', 'pt-br', 'hi', 'ar', 'ru', 'id', 'tr', 'it', 'vi', 'th', 'nl'];
const PINNED_MODEL_VIEWER_URL = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
const FLOATING_MODEL_VIEWER_URL = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
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

function validateDiceCoin3DRuntime(page, findings) {
  const isDicePage = /^\/(?:(?:en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?dice\/$/.test(page.pagePath);
  const isCoinPage = /^\/(?:(?:en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?coinflip\/$/.test(page.pagePath);
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
    if (!page.html.includes('Name Picker')) {
      findings.push(`${page.pagePath}: page should mention "Name Picker".`);
    }
    if (hasEmptySoftwareApplicationDescription(page.html)) {
      findings.push(`${page.pagePath}: SoftwareApplication description must not be empty.`);
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

  const isToolIndex = page.pagePath === '/' || /^\/(?:en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/$/.test(page.pagePath);
  const isToolPage = /^\/(?:(?:en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?(?:luckydraw|ladder|coinflip|dice)\/$/.test(page.pagePath);
  const isLegalPage = /^\/(?:(?:en|ja|zh-cn|zh-tw)\/)?(?:contact|privacy|terms)\/$/.test(page.pagePath);
  if ((isToolIndex || isToolPage) && !hasSafeCanonicalPatch(page.html)) findings.push(`${page.pagePath}: missing safe query normalization patch.`);
  if (isLegalPage && !hasSafeLegalPatch(page.html)) findings.push(`${page.pagePath}: missing legal page query normalization patch.`);
  if (page.pagePath === '/about/' && !hasSafeAboutPatch(page.html)) findings.push(`${page.pagePath}: missing about page query normalization patch.`);
  validateDiceCoin3DRuntime(page, findings);
  validateEnglishAcquisitionSignals(page, findings);

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

if (!TEAM_GENERATOR_I18N_SOURCE.includes('"seoTitle":"Random Team Generator | Balanced Team Splitter"')) {
  findings.push('assets/js/team-generator-i18n.js: missing English random team generator SEO title.');
}

if (!TEAM_GENERATOR_I18N_SOURCE.includes('"heroTitle":"Random Team Generator and Balanced Team Splitter"')) {
  findings.push('assets/js/team-generator-i18n.js: missing English team-generator hero title update.');
}

for (const rel of ['assets/js/lotto.js', 'assets/js/ladder.js', 'scripts/sync-roulette-entrypoints.js', 'scripts/seo-hosting-patch.js']) {
  const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (hasUnsafeSyncLangLinks(source)) findings.push(`${rel}: source still appends ?lang= to non-tool links.`);
}

if (findings.length) {
  console.error('SEO validation failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.size} HTML files.`);
