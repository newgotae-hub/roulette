#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  NON_KO_LOCALES,
  FOOTER_LABELS,
  FOOTER_COPY
} = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = ['index.html', 'roulette/index.html', 'ladder/index.html', 'luckydraw/index.html', 'coinflip/index.html', 'dice/index.html'];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function footerHref(locale, slug) {
  return locale === 'ko' ? `/${slug}/` : `/${locale}/${slug}/`;
}

function fileLocale(relPath) {
  const first = relPath.split('/')[0];
  return NON_KO_LOCALES.includes(first) ? first : 'ko';
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function replaceFooterLink(html, id, href, label) {
  const pattern = new RegExp(`(<a[^>]*id="${id}"[^>]*href=")[^"]*("([^>]*)>)([\\s\\S]*?)(</a>)`, 'i');
  if (!pattern.test(html)) return html;
  return html.replace(pattern, `$1${href}$2${label}$5`);
}

function replaceOperatorLink(html, locale) {
  const href = footerHref(locale, 'about');
  const label = FOOTER_COPY[locale] || FOOTER_COPY.en;
  return html.replace(
    /(<a(?: id="footer-copy")?[^>]*href=")[^"]*(" class="text-xs text-slate-500">)([^<]*Juntae Ko[^<]*)(<\/a>)/i,
    `$1${href}$2${label}$4`
  );
}

let changed = 0;
const allFiles = TOOLS.concat(NON_KO_LOCALES.flatMap((locale) => TOOLS.map((tool) => `${locale}/${tool}`)));

for (const rel of allFiles) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;

  const locale = fileLocale(rel);
  const labels = FOOTER_LABELS[locale] || FOOTER_LABELS.en;
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  html = replaceFooterLink(html, 'footer-terms', footerHref(locale, 'terms'), labels.terms);
  html = replaceFooterLink(html, 'footer-privacy', footerHref(locale, 'privacy'), labels.privacy);
  html = replaceFooterLink(html, 'footer-about', footerHref(locale, 'about'), labels.about);
  html = replaceFooterLink(html, 'footer-contact', footerHref(locale, 'contact'), labels.contact);
  html = replaceOperatorLink(html, locale);

  if (!html.includes('id="footer-contact"') && html.includes('id="footer-about"')) {
    const contactLink = `\n        <a id="footer-contact" href="${footerHref(locale, 'contact')}" class="text-xs text-slate-400 hover:text-slate-900 transition-colors">${labels.contact}</a>`;
    html = html.replace(/(<a id="footer-about"[^\n]+<\/a>)/, `$1${contactLink}`);
  }

  html = replaceAll(html, "setText('footer-terms', 'footerTerms'); document.getElementById('footer-terms') && (document.getElementById('footer-terms').textContent = 'Terms');", "setText('footer-terms', 'footerTerms');");
  html = replaceAll(html, "setText('footer-privacy', 'footerPrivacy'); document.getElementById('footer-privacy') && (document.getElementById('footer-privacy').textContent = 'Privacy');", "setText('footer-privacy', 'footerPrivacy');");
  html = replaceAll(html, "setText('footer-contact', 'footerContact'); document.getElementById('footer-contact') && (document.getElementById('footer-contact').textContent = 'Contact');", "setText('footer-contact', 'footerContact');");
  html = replaceAll(html, "setText(ui.footerTerms, 'Terms');", "setText(ui.footerTerms, t('footerTerms')); ");
  html = replaceAll(html, "setText(ui.footerPrivacy, 'Privacy');", "setText(ui.footerPrivacy, t('footerPrivacy')); ");
  html = replaceAll(html, "setText(ui.footerContact, 'Contact');", "setText(ui.footerContact, t('footerContact')); ");
  html = replaceAll(html, "ui.footerTerms.textContent = 'Terms';", "ui.footerTerms.textContent = t('footerTerms');");
  html = replaceAll(html, "ui.footerPrivacy.textContent = 'Privacy';", "ui.footerPrivacy.textContent = t('footerPrivacy');");
  html = replaceAll(html, "ui.footerContact.textContent = 'Contact';", "ui.footerContact.textContent = t('footerContact');");

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
}

console.log('updated legal links in files:', changed);
