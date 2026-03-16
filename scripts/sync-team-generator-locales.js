#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, NON_KO_LOCALES } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const I18N_PATH = path.join(ROOT, 'assets/js/team-generator-i18n.js');
const ASSET_VERSION = '20260316-team-score4';
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

  for (const [id, key] of TEXT_IDS) {
    html = replaceTextById(html, id, data[key]);
  }
  for (const [id, attr, key] of ATTRIBUTE_IDS) {
    html = replaceAttributeById(html, id, attr, data[key]);
  }

  html = replaceAttributeById(html, 'footer-terms', 'href', targetHref(locale, 'terms'));
  html = replaceAttributeById(html, 'footer-privacy', 'href', targetHref(locale, 'privacy'));
  html = replaceAttributeById(html, 'footer-copy', 'href', targetHref(locale, 'about'));
  html = replaceAttributeById(html, 'footer-about', 'href', targetHref(locale, 'about'));
  html = replaceAttributeById(html, 'footer-contact', 'href', targetHref(locale, 'contact'));

  html = syncExampleBlocks(html, data);
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
