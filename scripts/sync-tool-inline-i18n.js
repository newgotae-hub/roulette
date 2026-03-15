#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, NON_KO_LOCALES, FOOTER_LABELS, FOOTER_COPY } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const RELATIVE_FILES = ['index.html', 'coinflip/index.html', 'dice/index.html']
  .concat(NON_KO_LOCALES.flatMap((locale) => ['index.html', 'coinflip/index.html', 'dice/index.html'].map((rel) => `${locale}/${rel}`)));

function indentJson(value, spaces) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${' '.repeat(spaces)}${line}`))
    .join('\n');
}

let changed = 0;

for (const rel of RELATIVE_FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;

  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('const i18n = ');
  const detectLocaleIndex = source.indexOf('function detectLocale()', start);
  const functionTIndex = source.indexOf('function t(', start);
  const nextBlockIndex = [detectLocaleIndex, functionTIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
  if (start === -1 || nextBlockIndex === -1) continue;

  const blockSource = source.slice(start, nextBlockIndex).trim();
  const data = Function(`"use strict"; ${blockSource}; return i18n;`)();

  for (const locale of ALL_LOCALES) {
    const entry = data[locale];
    const labels = FOOTER_LABELS[locale];
    if (!entry || !labels) continue;
    entry.footerTerms = labels.terms;
    entry.footerPrivacy = labels.privacy;
    entry.footerContact = labels.contact;
    if ('footerCopy' in entry) {
      entry.footerCopy = FOOTER_COPY[locale] || FOOTER_COPY.en;
    }
  }

  const nextObject = indentJson(data, 12);
  const nextSource = `${source.slice(0, start)}const i18n = ${nextObject};\n\n            ${source.slice(nextBlockIndex)}`;
  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource, 'utf8');
    changed += 1;
  }
}

console.log(`synced inline tool i18n in files: ${changed}`);
