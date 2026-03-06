#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const TOOLS = ['index.html', 'roulette/index.html', 'ladder/index.html', 'luckydraw/index.html', 'coinflip/index.html', 'dice/index.html'];
const LOCALIZED_LEGAL = new Set(['en', 'ja', 'zh-cn', 'zh-tw']);
const CONTACT_LABELS = {
  ko: '문의',
  en: 'Contact',
  ja: 'お問い合わせ',
  'zh-cn': '联系',
  'zh-tw': '聯絡',
  es: 'Contacto',
  fr: 'Contact',
  de: 'Kontakt',
  'pt-br': 'Contato',
  hi: 'संपर्क',
  ar: 'تواصل',
  ru: 'Контакты',
  id: 'Kontak',
  tr: 'İletişim',
  it: 'Contatti',
  vi: 'Liên hệ',
  th: 'ติดต่อ',
  nl: 'Contact'
};

function legalBase(locale) {
  if (!locale || locale === 'ko') return '';
  if (LOCALIZED_LEGAL.has(locale)) return `/${locale}`;
  return '/en';
}

function targetHref(locale, slug) {
  return `${legalBase(locale)}/${slug}/`.replace('//', '/');
}

function fileLocale(relPath) {
  const first = relPath.split('/')[0];
  return LOCALES.includes(first) ? first : 'ko';
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

let changed = 0;
for (const rel of TOOLS.concat(LOCALES.flatMap((locale) => TOOLS.map((tool) => `${locale}/${tool}`)))) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const locale = fileLocale(rel);
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  html = html.replace(/id="footer-terms" href="\/terms\//g, `id="footer-terms" href="${targetHref(locale, 'terms')}`);
  html = html.replace(/id="footer-privacy" href="\/privacy\//g, `id="footer-privacy" href="${targetHref(locale, 'privacy')}`);
  html = html.replace(/id="footer-contact" href="\/contact\//g, `id="footer-contact" href="${targetHref(locale, 'contact')}`);
  if (!html.includes('id="footer-contact"') && html.includes('id="footer-about"')) {
    const contactLabel = CONTACT_LABELS[locale] || CONTACT_LABELS.en;
    const contactLink = `\n        <a id="footer-contact" href="${targetHref(locale, 'contact')}" class="text-xs text-slate-400 hover:text-slate-900 transition-colors">${contactLabel}</a>`;
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
