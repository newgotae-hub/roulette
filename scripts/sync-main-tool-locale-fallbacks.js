#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, NON_KO_LOCALES } = require('./legal-shared');
const { COIN_DICE_COPY } = require('./coin-dice-copy-data');

const ROOT = path.resolve(__dirname, '..');
const TOOL_FILES = ['index.html', 'luckydraw/index.html', 'ladder/index.html', 'coinflip/index.html', 'dice/index.html'];
const RELATIVE_FILES = TOOL_FILES.concat(NON_KO_LOCALES.flatMap((locale) => TOOL_FILES.map((rel) => `${locale}/${rel}`)));
const SHARED_TOOL_I18N = Function(
  `const window = {}; ${fs.readFileSync(path.join(ROOT, 'assets/js/i18n.js'), 'utf8')}; return window.RLTI18N;`
)();

const LANGUAGE_BUTTON_LABELS = {
  ko: '언어',
  en: 'LANGUAGE',
  ja: '言語',
  'zh-cn': '语言',
  'zh-tw': '語言',
  es: 'Idioma',
  fr: 'Langue',
  de: 'Sprache',
  'pt-br': 'Idioma',
  hi: 'भाषा',
  ar: 'اللغة',
  ru: 'Язык',
  id: 'Bahasa',
  tr: 'Dil',
  it: 'Lingua',
  vi: 'Ngôn ngữ',
  th: 'ภาษา',
  nl: 'Taal'
};

const LANGUAGE_UI_LABELS = {
  ko: { search: '언어 검색', aria: '언어 변경' },
  en: { search: 'Search language', aria: 'Change language' },
  ja: { search: '言語を検索', aria: '言語を変更' },
  'zh-cn': { search: '搜索语言', aria: '切换语言' },
  'zh-tw': { search: '搜尋語言', aria: '切換語言' },
  es: { search: 'Buscar idioma', aria: 'Cambiar idioma' },
  fr: { search: 'Rechercher une langue', aria: 'Changer de langue' },
  de: { search: 'Sprache suchen', aria: 'Sprache ändern' },
  'pt-br': { search: 'Buscar idioma', aria: 'Alterar idioma' },
  hi: { search: 'भाषा खोजें', aria: 'भाषा बदलें' },
  ar: { search: 'ابحث عن اللغة', aria: 'تغيير اللغة' },
  ru: { search: 'Поиск языка', aria: 'Сменить язык' },
  id: { search: 'Cari bahasa', aria: 'Ganti bahasa' },
  tr: { search: 'Dil ara', aria: 'Dili değiştir' },
  it: { search: 'Cerca lingua', aria: 'Cambia lingua' },
  vi: { search: 'Tìm ngôn ngữ', aria: 'Đổi ngôn ngữ' },
  th: { search: 'ค้นหาภาษา', aria: 'เปลี่ยนภาษา' },
  nl: { search: 'Zoek taal', aria: 'Taal wijzigen' }
};

const LOCALE_FLAGS = {
  ko: { code: 'kr', native: '한국어' },
  en: { code: 'us', native: 'English' },
  ja: { code: 'jp', native: '日本語' },
  'zh-cn': { code: 'cn', native: '简体中文' },
  'zh-tw': { code: 'tw', native: '繁體中文' },
  es: { code: 'es', native: 'Español' },
  fr: { code: 'fr', native: 'Français' },
  de: { code: 'de', native: 'Deutsch' },
  'pt-br': { code: 'br', native: 'Português (Brasil)' },
  hi: { code: 'in', native: 'हिन्दी' },
  ar: { code: 'ae', native: 'العربية' },
  ru: { code: 'ru', native: 'Русский' },
  id: { code: 'id', native: 'Bahasa Indonesia' },
  tr: { code: 'tr', native: 'Türkçe' },
  it: { code: 'it', native: 'Italiano' },
  vi: { code: 'vn', native: 'Tiếng Việt' },
  th: { code: 'th', native: 'ไทย' },
  nl: { code: 'nl', native: 'Nederlands' }
};

function indentJson(value, spaces) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${' '.repeat(spaces)}${line}`))
    .join('\n');
}

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

function pagePrefix(locale) {
  return locale === 'ko' ? '' : `/${locale}`;
}

function loadI18n(source) {
  const start = source.indexOf('const i18n = ');
  const detectLocaleIndex = source.indexOf('function detectLocale()', start);
  const functionTIndex = source.indexOf('function t(', start);
  const nextBlockIndex = [detectLocaleIndex, functionTIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
  if (start === -1 || nextBlockIndex === -1) {
    return null;
  }
  const blockSource = source.slice(start, nextBlockIndex).trim();
  const data = Function(`"use strict"; ${blockSource}; return i18n;`)();
  return { data, start, nextBlockIndex };
}

function replaceTextById(source, id, nextText) {
  const pattern = new RegExp(`(<([a-z0-9:-]+)[^>]*\\bid="${escapeRegExp(id)}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'i');
  if (!pattern.test(source)) return source;
  return source.replace(pattern, `$1${escapeHtml(nextText)}$4`);
}

function replaceAttributeById(source, id, attr, value) {
  const tagPattern = new RegExp(`<[^>]*\\bid="${escapeRegExp(id)}"[^>]*>`, 'i');
  const tag = source.match(tagPattern);
  if (!tag) return source;
  let nextTag = tag[0];
  const attrPattern = new RegExp(`\\b${escapeRegExp(attr)}="[^"]*"`, 'i');
  if (attrPattern.test(nextTag)) {
    nextTag = nextTag.replace(attrPattern, `${attr}="${escapeAttr(value)}"`);
  } else {
    nextTag = nextTag.replace(/>$/, ` ${attr}="${escapeAttr(value)}">`);
  }
  return source.replace(tag[0], nextTag);
}

function replaceRelatedToolsNav(source, navHtml) {
  const pattern = /\n  <nav aria-label="[^"]+" style="padding:16px 20px;border-top:1px solid rgba\(15,23,42,.08\);background:#fff">[\s\S]*?\n  <\/nav>/;
  if (!pattern.test(source)) return source;
  return source.replace(pattern, `\n${navHtml}`);
}

function extractTextById(source, id) {
  const pattern = new RegExp(`<([a-z0-9:-]+)[^>]*\\bid="${escapeRegExp(id)}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'i');
  const match = source.match(pattern);
  return match ? match[2].replace(/\s+/g, ' ').trim() : '';
}

function buildRelatedToolsNav(locale, labels, heading) {
  const prefix = pagePrefix(locale);
  const links = [
    { href: `${prefix || ''}/`, label: labels.spin },
    { href: `${prefix}/luckydraw/`, label: labels.lotto },
    { href: `${prefix}/ladder/`, label: labels.history },
    { href: `${prefix}/coinflip/`, label: labels.coin },
    { href: `${prefix}/dice/`, label: labels.dice }
  ];
  const linkHtml = links
    .map(({ href, label }, index) => {
      const margin = index === links.length - 1 ? '' : ' style="margin-right:12px"';
      return `    <a href="${href}"${margin}>${escapeHtml(label)}</a>`;
    })
    .join('\n');

  return `  <nav aria-label="${escapeAttr(heading)}" style="padding:16px 20px;border-top:1px solid rgba(15,23,42,.08);background:#fff">
    <strong style="display:block;margin-bottom:8px;font-size:12px;color:#334155">${escapeHtml(heading)}</strong>
${linkHtml}
  </nav>`;
}

let changed = 0;

for (const rel of RELATIVE_FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;

  const locale = rel.split('/')[0] && ALL_LOCALES.includes(rel.split('/')[0]) ? rel.split('/')[0] : 'ko';
  const source = fs.readFileSync(file, 'utf8');
  const i18nPayload = loadI18n(source);

  let nextSource = source;
  let currentLabels = null;
  if (i18nPayload) {
    const { data, start, nextBlockIndex } = i18nPayload;
    for (const lang of ALL_LOCALES) {
      const entry = data[lang];
      if (!entry) continue;
      if ('languageButton' in entry) {
        entry.languageButton = LANGUAGE_BUTTON_LABELS[lang] || LANGUAGE_BUTTON_LABELS.en;
      }
    }
    nextSource = `${source.slice(0, start)}const i18n = ${indentJson(data, 12)};\n\n            ${source.slice(nextBlockIndex)}`;
    const currentEntry = data[locale];
    if (currentEntry) {
      currentLabels = {
        spin: currentEntry.navSpin,
        lotto: currentEntry.navLotto,
        history: currentEntry.navHistory,
        coin: currentEntry.navCoin,
        dice: currentEntry.navDice
      };
    }
  }

  const currentFlag = LOCALE_FLAGS[locale];
  const localeUi = LANGUAGE_UI_LABELS[locale] || LANGUAGE_UI_LABELS.en;
  if (currentFlag) {
    nextSource = replaceTextById(nextSource, 'lang-button-label', LANGUAGE_BUTTON_LABELS[locale] || LANGUAGE_BUTTON_LABELS.en);
    nextSource = replaceAttributeById(nextSource, 'lang-search', 'placeholder', localeUi.search);
    nextSource = replaceAttributeById(nextSource, 'lang-search-mobile', 'placeholder', localeUi.search);
    nextSource = replaceAttributeById(nextSource, 'lang-trigger', 'aria-label', localeUi.aria);
    nextSource = replaceAttributeById(nextSource, 'lang-trigger-mobile', 'aria-label', localeUi.aria);
    nextSource = replaceAttributeById(nextSource, 'lang-current-flag', 'src', `https://flagcdn.com/w20/${currentFlag.code}.png`);
    nextSource = replaceAttributeById(nextSource, 'lang-current-flag', 'alt', currentFlag.native);
    nextSource = replaceAttributeById(nextSource, 'lang-current-flag-mobile', 'src', `https://flagcdn.com/w20/${currentFlag.code}.png`);
    nextSource = replaceAttributeById(nextSource, 'lang-current-flag-mobile', 'alt', currentFlag.native);
  }

  if (!currentLabels) {
    const sharedEntry = SHARED_TOOL_I18N[locale] || SHARED_TOOL_I18N.en || {};
    currentLabels = {
      spin: sharedEntry.navSpin || extractTextById(nextSource, 'nav-spin'),
      lotto: sharedEntry.navLotto || extractTextById(nextSource, 'nav-lotto'),
      history: sharedEntry.navLadder || extractTextById(nextSource, 'nav-history'),
      coin: sharedEntry.navCoin || extractTextById(nextSource, 'nav-coin'),
      dice: sharedEntry.navDice || extractTextById(nextSource, 'nav-dice')
    };
  }

  if (currentLabels.spin && currentLabels.lotto && currentLabels.history && currentLabels.coin && currentLabels.dice) {
    const heading = (COIN_DICE_COPY[locale] && COIN_DICE_COPY[locale].sections && COIN_DICE_COPY[locale].sections.relatedTools) || 'Related tools';
    nextSource = replaceRelatedToolsNav(nextSource, buildRelatedToolsNav(locale, currentLabels, heading));
  }

  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource, 'utf8');
    changed += 1;
  }
}

console.log(`Synced main-tool locale fallbacks in files: ${changed}`);
