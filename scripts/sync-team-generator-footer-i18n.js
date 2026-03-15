#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, FOOTER_LABELS, FOOTER_COPY } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'assets/js/team-generator-i18n.js');

const source = fs.readFileSync(FILE, 'utf8');
const start = source.indexOf('const dataMap = ');
const end = source.indexOf('\n  function normalizeLang');

if (start === -1 || end === -1) {
  throw new Error('Could not locate team-generator dataMap.');
}

const dataMap = JSON.parse(source.slice(start + 'const dataMap = '.length, end).trim().replace(/;$/, ''));

for (const locale of ALL_LOCALES) {
  const data = dataMap[locale];
  const labels = FOOTER_LABELS[locale];
  if (!data || !labels) continue;
  data.footerTerms = labels.terms;
  data.footerPrivacy = labels.privacy;
  data.footerAbout = labels.about;
  data.footerContact = labels.contact;
  data.footerCopy = FOOTER_COPY[locale] || FOOTER_COPY.en;
}

const nextSource = `${source.slice(0, start)}const dataMap = ${JSON.stringify(dataMap)};${source.slice(end)}`;
fs.writeFileSync(FILE, nextSource, 'utf8');
console.log('synced team-generator footer/legal i18n');
