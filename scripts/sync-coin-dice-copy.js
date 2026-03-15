#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ALL_LOCALES, NON_KO_LOCALES } = require('./legal-shared');
const { COIN_DICE_COPY } = require('./coin-dice-copy-data');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = ['coinflip', 'dice'];
const RELATIVE_FILES = TOOLS.concat(
  NON_KO_LOCALES.flatMap((locale) => TOOLS.map((tool) => `${locale}/${tool}/index.html`))
).map((rel) => (rel.endsWith('.html') ? rel : `${rel}/index.html`));

function indentJson(value, spaces) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${' '.repeat(spaces)}${line}`))
    .join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
    throw new Error('Could not locate inline i18n block.');
  }
  const blockSource = source.slice(start, nextBlockIndex).trim();
  const data = Function(`"use strict"; ${blockSource}; return i18n;`)();
  return { data, start, nextBlockIndex };
}

function replaceElementTextById(source, id, nextText) {
  const pattern = new RegExp(`(<([a-z0-9:-]+)[^>]*\\bid="${id}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'i');
  if (!pattern.test(source)) {
    return source;
  }
  return source.replace(pattern, `$1${escapeHtml(nextText)}$4`);
}

function replaceHtmlBetweenMarkers(source, startMarker, endMarker, nextContent) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not find markers ${startMarker} / ${endMarker}.`);
  }
  return `${source.slice(0, start)}${nextContent}${source.slice(end + endMarker.length)}`;
}

function buildTryOtherLinks(locale, labels, tool) {
  const prefix = pagePrefix(locale);
  const links = [
    { href: `${prefix || ''}/`, label: labels.spin },
    { href: `${prefix}/luckydraw/`, label: labels.lotto },
    { href: `${prefix}/ladder/`, label: labels.history }
  ];
  if (tool === 'coinflip') {
    links.push({ href: `${prefix}/dice/`, label: labels.dice });
  } else {
    links.push({ href: `${prefix}/coinflip/`, label: labels.coin });
  }

  return links
    .map(
      ({ href, label }) =>
        `            <a href="${href}" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors">${escapeHtml(label)}</a>`
    )
    .join('\n');
}

function buildAdsenseSection(locale, tool, labels, content, sectionLabels) {
  const faqItems = content.faq
    .map(
      ({ q, a }) => `            <details class="rounded-lg border border-slate-200 p-3">
              <summary class="cursor-pointer text-sm font-medium text-slate-900">${escapeHtml(q)}</summary>
              <p class="mt-2 text-sm text-slate-600">${escapeHtml(a)}</p>
            </details>`
    )
    .join('\n');

  const howToItems = content.howTo.map((item) => `            <li>${escapeHtml(item)}</li>`).join('\n');
  const tryOtherLinks = buildTryOtherLinks(locale, labels, tool);
  const whatIsParagraphs = content.whatIs
    .map((item) => `          <p class="mt-3 text-sm md:text-base text-slate-600">${escapeHtml(item)}</p>`)
    .join('\n');

  return `<!-- adsense-content-start -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16" data-adsense-content="v2">
      <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        <div>
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escapeHtml(sectionLabels.howTo)}</h2>
          <ul class="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
${howToItems}
          </ul>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escapeHtml(sectionLabels.whatIs)}</h2>
${whatIsParagraphs}
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escapeHtml(sectionLabels.faq)}</h2>
          <div class="mt-3 space-y-2">
${faqItems}
          </div>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escapeHtml(sectionLabels.tryOtherTools)}</h2>
          <div class="mt-3 flex flex-wrap gap-2 text-sm">
${tryOtherLinks}
          </div>
        </div>
      </div>
    </section>
    <!-- adsense-content-end -->`;
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

  return `  <nav aria-label="${escapeHtml(heading)}" style="padding:16px 20px;border-top:1px solid rgba(15,23,42,.08);background:#fff">
    <strong style="display:block;margin-bottom:8px;font-size:12px;color:#334155">${escapeHtml(heading)}</strong>
${linkHtml}
  </nav>`;
}

function replaceRelatedToolsNav(source, navHtml) {
  const pattern = /\n  <nav aria-label="[^"]+" style="padding:16px 20px;border-top:1px solid rgba\(15,23,42,.08\);background:#fff">[\s\S]*?\n  <\/nav>/;
  if (pattern.test(source)) {
    return source.replace(pattern, `\n${navHtml}`);
  }
  const bodyClose = '\n</body>';
  if (!source.includes(bodyClose)) {
    throw new Error('Could not find related tools nav block or body close tag.');
  }
  return source.replace(bodyClose, `\n${navHtml}${bodyClose}`);
}

let changed = 0;

for (const rel of RELATIVE_FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;

  const source = fs.readFileSync(file, 'utf8');
  const locale = rel.split('/')[0] && ALL_LOCALES.includes(rel.split('/')[0]) ? rel.split('/')[0] : 'ko';
  const tool = rel.includes('/dice/') || rel === 'dice/index.html' ? 'dice' : 'coinflip';
  const localeCopy = COIN_DICE_COPY[locale];
  if (!localeCopy) throw new Error(`Missing copy data for locale ${locale}.`);
  const content = localeCopy[tool];
  const sectionLabels = localeCopy.sections;
  if (!content || !sectionLabels) throw new Error(`Missing ${tool} content for locale ${locale}.`);

  const { data, start, nextBlockIndex } = loadI18n(source);
  for (const lang of ALL_LOCALES) {
    const entry = data[lang];
    const langCopy = COIN_DICE_COPY[lang] && COIN_DICE_COPY[lang][tool];
    if (!entry || !langCopy) continue;
    entry.heroSubtitle = langCopy.heroSubtitle;
    entry.guideSubtitle = langCopy.guideSubtitle;
    entry.guideStep1Title = langCopy.steps[0].title;
    entry.guideStep1Body = langCopy.steps[0].body;
    entry.guideStep2Title = langCopy.steps[1].title;
    entry.guideStep2Body = langCopy.steps[1].body;
    entry.guideStep3Title = langCopy.steps[2].title;
    entry.guideStep3Body = langCopy.steps[2].body;
  }

  let nextSource = `${source.slice(0, start)}const i18n = ${indentJson(data, 12)};\n\n            ${source.slice(nextBlockIndex)}`;
  nextSource = replaceElementTextById(nextSource, 'hero-subtitle', content.heroSubtitle);
  nextSource = replaceElementTextById(nextSource, 'guide-subtitle', content.guideSubtitle);
  nextSource = replaceElementTextById(nextSource, 'g1t', content.steps[0].title);
  nextSource = replaceElementTextById(nextSource, 'g1b', content.steps[0].body);
  nextSource = replaceElementTextById(nextSource, 'g2t', content.steps[1].title);
  nextSource = replaceElementTextById(nextSource, 'g2b', content.steps[1].body);
  nextSource = replaceElementTextById(nextSource, 'g3t', content.steps[2].title);
  nextSource = replaceElementTextById(nextSource, 'g3b', content.steps[2].body);

  const currentEntry = data[locale];
  const labels = {
    spin: currentEntry.navSpin,
    lotto: currentEntry.navLotto,
    history: currentEntry.navHistory,
    coin: currentEntry.navCoin,
    dice: currentEntry.navDice
  };
  const adsenseHtml = buildAdsenseSection(locale, tool, labels, content, sectionLabels);
  nextSource = replaceHtmlBetweenMarkers(nextSource, '<!-- adsense-content-start -->', '<!-- adsense-content-end -->', adsenseHtml);
  nextSource = replaceRelatedToolsNav(nextSource, buildRelatedToolsNav(locale, labels, sectionLabels.relatedTools));

  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource, 'utf8');
    changed += 1;
  }
}

console.log(`synced coinflip/dice copy in files: ${changed}`);
