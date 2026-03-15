#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const TOOLS = ['index.html', 'roulette/index.html', 'ladder/index.html', 'luckydraw/index.html', 'coinflip/index.html', 'dice/index.html'];
const LOCALIZED_LEGAL = new Set(['en', 'ja', 'zh-cn', 'zh-tw']);
const TERMS_LABELS = {
  ko: '이용약관',
  en: 'Terms',
  ja: '利用規約',
  'zh-cn': '条款',
  'zh-tw': '條款',
  es: 'Términos',
  fr: 'Conditions',
  de: 'AGB',
  'pt-br': 'Termos',
  hi: 'नियम',
  ar: 'الشروط',
  ru: 'Условия',
  id: 'Ketentuan',
  tr: 'Koşullar',
  it: 'Termini',
  vi: 'Điều khoản',
  th: 'เงื่อนไข',
  nl: 'Voorwaarden'
};
const PRIVACY_LABELS = {
  ko: '개인정보처리방침',
  en: 'Privacy',
  ja: 'プライバシー',
  'zh-cn': '隐私',
  'zh-tw': '隱私',
  es: 'Privacidad',
  fr: 'Confidentialité',
  de: 'Datenschutz',
  'pt-br': 'Privacidade',
  hi: 'प्राइवेसी',
  ar: 'الخصوصية',
  ru: 'Конфиденциальность',
  id: 'Privasi',
  tr: 'Gizlilik',
  it: 'Informativa privacy',
  vi: 'Riêng tư',
  th: 'ความเป็นส่วนตัว',
  nl: 'Privacybeleid'
};
const ABOUT_LABELS = {
  ko: '소개',
  en: 'About',
  ja: '紹介',
  'zh-cn': '关于',
  'zh-tw': '關於',
  es: 'Acerca de',
  fr: 'À propos',
  de: 'Über uns',
  'pt-br': 'Sobre',
  hi: 'परिचय',
  ar: 'حول',
  ru: 'О сервисе',
  id: 'Tentang',
  tr: 'Hakkında',
  it: 'Info',
  vi: 'Giới thiệu',
  th: 'เกี่ยวกับ',
  nl: 'Over'
};
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
  ar: 'اتصال',
  ru: 'Контакты',
  id: 'Kontak',
  tr: 'İletişim',
  it: 'Contatto',
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

function replaceFooterLink(html, id, href, label) {
  const pattern = new RegExp(`(<a[^>]*id="${id}"[^>]*href=")[^"]*("([^>]*)>)([\\s\\S]*?)(</a>)`, 'i');
  if (!pattern.test(html)) return html;
  return html.replace(pattern, `$1${href}$2${label}$5`);
}

let changed = 0;
for (const rel of TOOLS.concat(LOCALES.flatMap((locale) => TOOLS.map((tool) => `${locale}/${tool}`)))) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const locale = fileLocale(rel);
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  html = replaceFooterLink(html, 'footer-terms', targetHref(locale, 'terms'), TERMS_LABELS[locale] || TERMS_LABELS.en);
  html = replaceFooterLink(html, 'footer-privacy', targetHref(locale, 'privacy'), PRIVACY_LABELS[locale] || PRIVACY_LABELS.en);
  html = replaceFooterLink(html, 'footer-about', '/about/', ABOUT_LABELS[locale] || ABOUT_LABELS.en);
  html = replaceFooterLink(html, 'footer-contact', targetHref(locale, 'contact'), CONTACT_LABELS[locale] || CONTACT_LABELS.en);
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
