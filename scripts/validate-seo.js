#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'fr', 'de', 'pt-br', 'hi', 'ar', 'ru', 'id', 'tr', 'it', 'vi', 'th', 'nl'];
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

function isNoindex(html) {
  return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
}

function hasRefresh(html) {
  return /<meta http-equiv="refresh"/i.test(html);
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

if (findings.length) {
  console.error('SEO validation failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.size} HTML files.`);
