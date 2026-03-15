#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { NON_KO_LOCALES } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = NON_KO_LOCALES;
const PAGES = ['index.html', 'roulette/index.html', 'ladder/index.html', 'luckydraw/index.html', 'coinflip/index.html', 'dice/index.html'];
const REQUIRED_GUIDE_FILES = [
  'guides/index.html',
  'guides/fair-random-draw/index.html',
  'guides/event-draw-checklist/index.html',
  'guides/winner-records/index.html',
  'en/guides/index.html',
  'en/guides/fair-random-draw/index.html',
  'en/guides/event-draw-checklist/index.html',
  'en/guides/winner-records/index.html'
];
const REQUIRED_LOCALIZED_LEGAL_FILES = LOCALES.flatMap((locale) => ['about', 'contact', 'privacy', 'terms'].map((slug) => `${locale}/${slug}/index.html`));
const MIN_CONTENT_UNITS = 400;
const COIN_DICE_PAGES = ['coinflip/index.html', 'dice/index.html']
  .concat(LOCALES.flatMap((locale) => ['coinflip/index.html', 'dice/index.html'].map((rel) => `${locale}/${rel}`)));
const BAD_TOOL_COPY_PATTERNS = [
  /Prepare the input list or values you want to use in/i,
  /Adjust draw options and run settings/i,
  /Are common input separators supported\?/i
];

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function contentUnits(value) {
  const text = normalizeText(value);
  let total = 0;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
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

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function getAdSenseUnits(html) {
  const sections = [...html.matchAll(/<section[^>]*data-adsense-content="[^"]+"[^>]*>([\s\S]*?)<\/section>/gi)].map((m) => m[1]);
  if (!sections.length) return 0;
  return contentUnits(stripHtml(sections.join(' ')));
}

function resolveLocalTarget(href) {
  if (!href || !href.startsWith('/')) return null;
  if (href === '/') return path.join(ROOT, 'index.html');
  const cleaned = href.replace(/^\//, '').replace(/\/$/, '');
  return path.join(ROOT, cleaned, 'index.html');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name === 'index.html') {
      out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
    }
  }
  return out;
}

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

const files = [
  ...PAGES,
  ...LOCALES.flatMap((locale) => PAGES.map((page) => `${locale}/${page}`))
].filter((rel) => fs.existsSync(path.join(ROOT, rel)));
const htmlFiles = walk(ROOT);

const findings = [];
const summaries = [];

for (const rel of htmlFiles) {
  const html = readFile(rel);
  if (/<html[^>]*data-third-party="[^"]*\buserback\b/i.test(html)) {
    findings.push(`${rel}: Userback auto-load should stay disabled during AdSense review.`);
  }
}

const thirdPartyLoader = readFile('assets/js/third-party-loader.js');
if (/cfg\.indexOf\('userback'\)\s*>=\s*0\)\s*loadUserback\(\)/.test(thirdPartyLoader)) {
  findings.push('assets/js/third-party-loader.js: Userback must not auto-load during AdSense review.');
}

for (const rel of REQUIRED_GUIDE_FILES) {
  if (!fs.existsSync(path.join(ROOT, rel))) {
    findings.push(`${rel}: required guide page is missing.`);
  }
}

for (const rel of REQUIRED_LOCALIZED_LEGAL_FILES) {
  if (!fs.existsSync(path.join(ROOT, rel))) {
    findings.push(`${rel}: localized trust page is missing.`);
  }
}

for (const rel of COIN_DICE_PAGES.filter((file) => fs.existsSync(path.join(ROOT, file)))) {
  const html = readFile(rel);
  for (const pattern of BAD_TOOL_COPY_PATTERNS) {
    if (pattern.test(html)) {
      findings.push(`${rel}: still contains generic draw copy that does not match coinflip/dice usage.`);
      break;
    }
  }

  if (!rel.startsWith('en/')) {
    if (/>Related tools</i.test(html)) {
      findings.push(`${rel}: non-English coinflip/dice page still shows English related-tools fallback.`);
    }
  }
}

const homepageGuideChecks = [
  ['index.html', '/guides/'],
  ['en/index.html', '/en/guides/']
];

for (const [rel, href] of homepageGuideChecks) {
  const html = readFile(rel);
  if (!html.includes(`href="${href}"`)) {
    findings.push(`${rel}: missing visible guide-hub link (${href}).`);
  }
}

for (const rel of REQUIRED_GUIDE_FILES.filter((file) => fs.existsSync(path.join(ROOT, file)))) {
  const html = readFile(rel);
  const expectedLinks = rel.startsWith('en/')
    ? ['/en/about/', '/en/privacy/', '/en/contact/']
    : ['/about/', '/privacy/', '/contact/'];
  for (const href of expectedLinks) {
    if (!html.includes(`href="${href}"`)) {
      findings.push(`${rel}: missing trust link ${href}.`);
    }
  }
}

for (const rel of files) {
  const html = readFile(rel);
  const hasAds = /<html[^>]*data-third-party="[^"]*\bads\b/i.test(html);
  if (!hasAds) continue;

  if (/<meta[^>]*http-equiv=["']refresh["']/i.test(html)) {
    findings.push(`${rel}: ad-enabled page still contains meta refresh.`);
  }
  if (/<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    findings.push(`${rel}: ad-enabled page contains noindex.`);
  }

  const units = getAdSenseUnits(html);
  if (!/data-adsense-content="/i.test(html)) {
    findings.push(`${rel}: missing data-adsense-content block.`);
  }
  if (units < MIN_CONTENT_UNITS) {
    findings.push(`${rel}: content units ${units} below threshold ${MIN_CONTENT_UNITS}.`);
  }

  for (const id of ['footer-terms', 'footer-privacy', 'footer-about', 'footer-contact']) {
    const match = html.match(new RegExp(`<a[^>]*id=["']${id}["'][^>]*href=["']([^"']+)["']`, 'i'));
    if (!match) {
      findings.push(`${rel}: missing ${id} link.`);
      continue;
    }
    const href = match[1];
    if (!href.startsWith('/')) {
      findings.push(`${rel}: ${id} is not an internal link (${href}).`);
      continue;
    }
    const target = resolveLocalTarget(href);
    if (!target || !fs.existsSync(target)) {
      findings.push(`${rel}: ${id} target does not exist (${href}).`);
    }
  }

  summaries.push({ rel, units });
}

summaries.sort((a, b) => a.units - b.units);
const min = summaries[0];
console.log(`audited ad-enabled pages: ${summaries.length}`);
if (min) console.log(`minimum content units: ${min.units} (${min.rel})`);

if (findings.length) {
  console.error('\nAdSense readiness findings:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('AdSense readiness check passed.');
