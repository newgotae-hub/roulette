#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const PAGES = ['index.html', 'roulette/index.html', 'ladder/index.html', 'luckydraw/index.html', 'coinflip/index.html', 'dice/index.html'];
const MIN_CONTENT_UNITS = 400;

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

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

const files = [
  ...PAGES,
  ...LOCALES.flatMap((locale) => PAGES.map((page) => `${locale}/${page}`))
].filter((rel) => fs.existsSync(path.join(ROOT, rel)));

const findings = [];
const summaries = [];

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

  for (const id of ['footer-terms', 'footer-privacy', 'footer-contact']) {
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
