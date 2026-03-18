#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { FOOTER_LABELS } = require('./legal-shared');
const { EDITORIAL_LABELS, TOOL_EDITORIAL_COPY } = require('./tool-editorial-copy');

const ROOT = process.cwd();
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const TOOLS = ['roulette','luckydraw','ladder','coinflip','dice'];
const GUIDE_PANEL_COPY = {
  en: {
    title: 'Guides and policy links',
    body: 'Review the guide hub and site policies before using this tool for public draws, classrooms, or events.',
    guides: 'Guide Hub'
  },
  ja: {
    title: 'ガイドとポリシー',
    body: '公開抽選や授業、イベントで使う前に、この言語のガイド集とサイトのポリシーページを確認してください。',
    guides: 'ガイド集'
  },
  'zh-cn': {
    title: '指南与政策链接',
    body: '如果你要把这个工具用于公开抽签、课堂或活动，请先查看本语言的指南中心和站点政策页面。',
    guides: '指南中心'
  },
  'zh-tw': {
    title: '指南與政策連結',
    body: '如果你要把這個工具用於公開抽籤、課堂或活動，請先查看本語言的指南中心與網站政策頁面。',
    guides: '指南中心'
  },
  es: {
    title: 'Guías y políticas',
    body: 'Si vas a usar esta herramienta en sorteos públicos, clases o eventos, revisa primero la guía local y las páginas de políticas del sitio.',
    guides: 'Centro de guías'
  },
  fr: {
    title: 'Guides et politiques',
    body: 'Si vous utilisez cet outil pour un tirage public, un cours ou un événement, consultez d’abord le hub de guides local et les pages de politique du site.',
    guides: 'Hub des guides'
  },
  de: {
    title: 'Leitfäden und Richtlinien',
    body: 'Wenn du dieses Tool für öffentliche Auslosungen, Unterricht oder Events nutzt, prüfe zuerst den lokalen Guide-Hub und die Richtlinienseiten der Website.',
    guides: 'Guide-Hub'
  },
  'pt-br': {
    title: 'Guias e políticas',
    body: 'Se você vai usar esta ferramenta em sorteios públicos, aulas ou eventos, veja primeiro o hub de guias local e as páginas de políticas do site.',
    guides: 'Hub de guias'
  },
  hi: {
    title: 'गाइड और नीतियाँ',
    body: 'अगर आप इस टूल का उपयोग सार्वजनिक ड्रॉ, कक्षा या इवेंट में करने वाले हैं, तो पहले स्थानीय गाइड हब और साइट की नीतियाँ देखें।',
    guides: 'गाइड हब'
  },
  ar: {
    title: 'الأدلة والسياسات',
    body: 'إذا كنت ستستخدم هذه الأداة في سحب عام أو فصل دراسي أو فعالية، فراجع أولاً مركز الأدلة المحلي وصفحات سياسات الموقع.',
    guides: 'مركز الأدلة'
  },
  ru: {
    title: 'Руководства и политики',
    body: 'Если вы используете этот инструмент для публичных розыгрышей, занятий или мероприятий, сначала откройте локальный центр руководств и страницы политик сайта.',
    guides: 'Центр руководств'
  },
  id: {
    title: 'Panduan dan kebijakan',
    body: 'Jika alat ini akan dipakai untuk undian publik, kelas, atau acara, lihat dulu pusat panduan lokal dan halaman kebijakan situs.',
    guides: 'Pusat panduan'
  },
  tr: {
    title: 'Rehberler ve politikalar',
    body: 'Bu aracı herkese açık çekilişler, sınıflar veya etkinlikler için kullanacaksanız önce yerel rehber merkezini ve sitenin politika sayfalarını inceleyin.',
    guides: 'Rehber merkezi'
  },
  it: {
    title: 'Guide e politiche',
    body: 'Se userai questo strumento per estrazioni pubbliche, lezioni o eventi, consulta prima il centro guide locale e le pagine di policy del sito.',
    guides: 'Centro guide'
  },
  vi: {
    title: 'Hướng dẫn và chính sách',
    body: 'Nếu bạn dùng công cụ này cho quay số công khai, lớp học hoặc sự kiện, hãy xem trước trung tâm hướng dẫn bản địa và các trang chính sách của trang web.',
    guides: 'Trung tâm hướng dẫn'
  },
  th: {
    title: 'คู่มือและนโยบาย',
    body: 'หากคุณจะใช้เครื่องมือนี้กับการจับรางวัลสาธารณะ ห้องเรียน หรืออีเวนต์ ควรดูศูนย์คู่มือภาษาท้องถิ่นและหน้านโยบายของเว็บไซต์ก่อน',
    guides: 'ศูนย์คู่มือ'
  },
  nl: {
    title: 'Gidsen en beleid',
    body: 'Als je deze tool gebruikt voor openbare lotingen, lessen of evenementen, bekijk dan eerst de lokale gidsenhub en de beleidspagina’s van de site.',
    guides: 'Gidsenhub'
  }
};

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractBetween(source, startToken, endToken, from = 0) {
  const s = source.indexOf(startToken, from);
  if (s < 0) return null;
  const e = source.indexOf(endToken, s);
  if (e < 0) return null;
  return source.slice(s, e);
}

function evalI18nFromSnippet(snippet) {
  if (!snippet) return null;
  let code = snippet;
  code = code.replace(/\bconst\s+i18n\s*=/, 'var i18n =');
  const context = {};
  try {
    const script = new vm.Script(`${code}\ni18n;`);
    const out = script.runInNewContext(context, { timeout: 2000 });
    return out && typeof out === 'object' ? out : null;
  } catch {
    return null;
  }
}

function extractFunctionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return null;
  const open = source.indexOf('{', start);
  if (open < 0) return null;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return null;
}

function parseUiMap(source) {
  const map = new Map();
  const re = /(\w+)\s*:\s*document\.getElementById\((['"])([^'"]+)\2\)/g;
  let m;
  while ((m = re.exec(source))) map.set(m[1], m[3]);
  return map;
}

function parseApplyMappings(fnBody, uiMap) {
  const out = { textById: new Map(), placeholderById: new Map(), metaById: new Map(), titleKey: null };
  if (!fnBody) return out;

  let m;
  const reTitle = /document\.title\s*=\s*t\((['"])([^'"]+)\1\)/g;
  while ((m = reTitle.exec(fnBody))) out.titleKey = m[2];

  const reUiText = /(?:if\s*\([^)]*\)\s*)?ui\.(\w+)\.textContent\s*=\s*t\((['"])([^'"]+)\2\)/g;
  while ((m = reUiText.exec(fnBody))) {
    const id = uiMap.get(m[1]);
    if (id) out.textById.set(id, m[3]);
  }

  const reDirectText = /document\.getElementById\((['"])([^'"]+)\1\)\.textContent\s*=\s*t\((['"])([^'"]+)\3\)/g;
  while ((m = reDirectText.exec(fnBody))) out.textById.set(m[2], m[4]);

  const reSetText = /setText\((['"])([^'"]+)\1\s*,\s*(['"])([^'"]+)\3\)/g;
  while ((m = reSetText.exec(fnBody))) out.textById.set(m[2], m[4]);

  const reUiPlaceholder = /ui\.(\w+)\.placeholder\s*=\s*t\((['"])([^'"]+)\2\)/g;
  while ((m = reUiPlaceholder.exec(fnBody))) {
    const id = uiMap.get(m[1]);
    if (id) out.placeholderById.set(id, m[3]);
  }

  const reMeta = /ui\.(\w+)\.setAttribute\((['"])content\2\s*,\s*t\((['"])([^'"]+)\3\)\)/g;
  while ((m = reMeta.exec(fnBody))) {
    const id = uiMap.get(m[1]);
    if (id) out.metaById.set(id, m[4]);
  }

  const reMeta2 = /document\.getElementById\((['"])([^'"]+)\1\)\.content\s*=\s*t\((['"])([^'"]+)\3\)/g;
  while ((m = reMeta2.exec(fnBody))) out.metaById.set(m[2], m[4]);
  const reMeta3 = /document\.getElementById\((['"])([^'"]+)\1\)\.setAttribute\((['"])content\3\s*,\s*t\((['"])([^'"]+)\4\)\)/g;
  while ((m = reMeta3.exec(fnBody))) out.metaById.set(m[2], m[5]);

  return out;
}

function replaceOpenTagAttr(html, id, attr, value) {
  const re = new RegExp(`<([a-zA-Z0-9:-]+)([^>]*\\bid=["']${escRe(id)}["'][^>]*)>`, 'i');
  return html.replace(re, (all, tag, attrs) => {
    const attrRe = new RegExp(`\\s${escRe(attr)}=("[^"]*"|'[^']*')`, 'i');
    const enc = `"${escAttr(value)}"`;
    let nextAttrs;
    if (attrRe.test(attrs)) nextAttrs = attrs.replace(attrRe, ` ${attr}=${enc}`);
    else nextAttrs = `${attrs} ${attr}=${enc}`;
    return `<${tag}${nextAttrs}>`;
  });
}

function replaceElementText(html, id, text) {
  const re = new RegExp(`(<([a-zA-Z0-9:-]+)[^>]*\\bid=["']${escRe(id)}["'][^>]*>)([\\s\\S]*?)(</\\2>)`, 'i');
  return html.replace(re, `$1${escHtml(text)}$4`);
}

function replaceMetaById(html, id, content) {
  const re = new RegExp(`(<meta[^>]*\\bid=["']${escRe(id)}["'][^>]*\\bcontent=)(["']).*?\\2(?=\\s*\\/?>(?:\\s|$))([^>]*>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1"${escAttr(content)}"$3`);
  const re2 = new RegExp(`(<meta[^>]*\\bid=["']${escRe(id)}["'][^>]*)(>)`, 'i');
  return html.replace(re2, `$1 content="${escAttr(content)}"$2`);
}

function replaceMetaByName(html, name, content) {
  const re = new RegExp(`(<meta[^>]*\\bname=[\"']${escRe(name)}[\"'][^>]*\\bcontent=)([\"']).*?\\2(?=\\s*\\/?>(?:\\s|$))([^>]*>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1\"${escAttr(content)}\"$3`);
  return html;
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escHtml(title)}</title>`);
}

function replaceHtmlLang(html, locale) {
  return html.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${locale}"`);
}

function localePrefix(locale) {
  return locale === 'ko' ? '' : `/${locale}`;
}

function localizeToolLinks(html, locale) {
  return html.replace(/(href=["'])\/(?:ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl\/)?(roulette|luckydraw|ladder|coinflip|dice)\/?(["'])/gi, (_m, p1, tool, p3) => {
    return `${p1}/${locale}/${tool}/${p3}`;
  });
}

function applyStaticLocalization(html, dict, mapping, tool) {
  if (!dict) return html;
  let out = html;

  if (mapping.titleKey && dict[mapping.titleKey]) out = replaceTitle(out, dict[mapping.titleKey]);

  for (const [id, key] of mapping.metaById.entries()) {
    if (dict[key]) out = replaceMetaById(out, id, dict[key]);
  }
  for (const [id, key] of mapping.textById.entries()) {
    if (dict[key]) out = replaceElementText(out, id, dict[key]);
  }
  for (const [id, key] of mapping.placeholderById.entries()) {
    if (dict[key]) out = replaceOpenTagAttr(out, id, 'placeholder', dict[key]);
  }

  // Tool-specific state-based defaults to avoid Korean flash in initial HTML.
  if (tool === 'coinflip') {
    if (dict.assetLoading) out = replaceElementText(out, 'asset-status', dict.assetLoading);
    if (dict.bannerReady) out = replaceElementText(out, 'banner', dict.bannerReady);
  }
  if (tool === 'dice') {
    if (dict.assetLoading) out = replaceElementText(out, 'asset-status', dict.assetLoading);
    if (dict.bannerReady) out = replaceElementText(out, 'banner', dict.bannerReady);
  }
  if (tool === 'ladder') {
    if (dict.maxEntries) out = replaceElementText(out, 'participants-limit-hint', String(dict.maxEntries).replace('{n}', '15'));
  }
  if (tool === 'roulette') {
    if (dict.bannerReady) out = replaceElementText(out, 'banner', dict.bannerReady);
  }

  if (dict.title || dict.seoTitle) {
    const base = String(dict.title || dict.seoTitle || '').replace(/\s+\|\s+.*/, '').trim();
    if (base) {
      out = replaceMetaByName(out, 'keywords', `${base}, random picker, randomly pick`);
    }
  }

  out = replaceElementText(out, 'add-shortcut-btn', 'Add to Home');

  return out;
}

function injectGuidePanel(html, locale) {
  const prefix = localePrefix(locale);
  const guidesHref = `${prefix}/guides/`;
  html = html.replace(/\n\s*<div data-guide-panel="1">[\s\S]*?<\/div>\n(?=\s*<\/div>\n\s*<\/section>\n\s*<!-- adsense-content-end -->)/, '\n');
  if (html.includes(`href="${guidesHref}"`)) return html;

  const copy = GUIDE_PANEL_COPY[locale];
  const labels = FOOTER_LABELS[locale];
  if (!copy || !labels) return html;

  const panel = `
        <div data-guide-panel="1">
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escHtml(copy.title)}</h2>
          <p class="mt-3 text-sm md:text-base text-slate-600">${escHtml(copy.body)}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="${guidesHref}" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors">${escHtml(copy.guides)}</a>
            <a href="${prefix}/about/" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors">${escHtml(labels.about)}</a>
            <a href="${prefix}/privacy/" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors">${escHtml(labels.privacy)}</a>
            <a href="${prefix}/contact/" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors">${escHtml(labels.contact)}</a>
          </div>
        </div>`;

  return html.replace(/\n      <\/div>\n    <\/section>\n    <!-- adsense-content-end -->/, `${panel}
      </div>
    </section>
    <!-- adsense-content-end -->`);
}

function buildEditorialPanel(locale, tool) {
  const labels = EDITORIAL_LABELS[locale];
  const copy = TOOL_EDITORIAL_COPY[locale] && TOOL_EDITORIAL_COPY[locale][tool];
  if (!labels || !copy) return null;

  return `
        <div data-tool-editorial="1" data-editorial-tool="${escAttr(tool)}" class="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 md:p-8">
          <h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">${escHtml(labels.title)}</h2>
          <p class="mt-3 text-sm md:text-base text-slate-600">${escHtml(copy.intro)}</p>
          <div class="mt-5 grid gap-3 md:grid-cols-2 text-sm">
            <article class="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              <h3 class="font-semibold text-slate-900">${escHtml(labels.fit)}</h3>
              <p class="mt-2 leading-6">${escHtml(copy.fit)}</p>
            </article>
            <article class="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              <h3 class="font-semibold text-slate-900">${escHtml(labels.avoid)}</h3>
              <p class="mt-2 leading-6">${escHtml(copy.avoid)}</p>
            </article>
            <article class="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              <h3 class="font-semibold text-slate-900">${escHtml(labels.checklist)}</h3>
              <p class="mt-2 leading-6">${escHtml(copy.checklist)}</p>
            </article>
            <article class="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
              <h3 class="font-semibold text-slate-900">${escHtml(labels.mistakes)}</h3>
              <p class="mt-2 leading-6">${escHtml(copy.mistakes)}</p>
            </article>
          </div>
        </div>`;
}

function injectEditorialPanel(html, locale, tool) {
  const panel = buildEditorialPanel(locale, tool);
  if (!panel) return html;

  html = html.replace(/\n\s*<div data-tool-editorial="1"[\s\S]*?<\/div>\n(?=\s*<div(?: data-guide-panel="1")?|\s*<\/div>\n\s*<\/section>\n\s*<!-- adsense-content-end -->)/, '\n');

  if (/\n\s*<div data-guide-panel="1">/.test(html)) {
    return html.replace(/\n\s*<div data-guide-panel="1">/, `${panel}\n        <div data-guide-panel="1">`);
  }

  if (locale === 'ko') {
    const otherToolsPattern = /\n\s*<div>\n\s*<h2 class="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">다른 도구도 [^<]*<\/h2>/;
    if (otherToolsPattern.test(html)) {
      return html.replace(otherToolsPattern, `${panel}$&`);
    }
  }

  return html.replace(/\n      <\/div>\n    <\/section>\n    <!-- adsense-content-end -->/, `${panel}
      </div>
    </section>
    <!-- adsense-content-end -->`);
}

const ladderI18nSrc = fs.readFileSync(path.join(ROOT, 'assets/js/i18n.js'), 'utf8');
const ladderI18n = evalI18nFromSnippet(extractBetween(ladderI18nSrc, 'const i18n =', 'window.RLTI18N = i18n;'));
const ladderJs = fs.readFileSync(path.join(ROOT, 'assets/js/ladder.js'), 'utf8');
const ladderUi = parseUiMap(ladderJs);
const ladderApply = parseApplyMappings(extractFunctionBody(ladderJs, 'applyI18n'), ladderUi);

const lottoJs = fs.readFileSync(path.join(ROOT, 'assets/js/lotto.js'), 'utf8');
const lottoI18n = evalI18nFromSnippet(extractBetween(lottoJs, 'const i18n =', 'const localeNames ='));
const lottoUi = parseUiMap(lottoJs);
const lottoApply = parseApplyMappings(extractFunctionBody(lottoJs, 'applyI18n'), lottoUi);

let changed = 0;
for (const locale of LOCALES) {
  for (const tool of TOOLS) {
    const file = tool === 'roulette'
      ? path.join(ROOT, locale, 'index.html')
      : path.join(ROOT, locale, tool, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const orig = html;

    let dict = null;
    let mapping = null;

    if (tool === 'ladder') {
      dict = (ladderI18n && (ladderI18n[locale] || ladderI18n.en)) || null;
      mapping = ladderApply;
    } else if (tool === 'luckydraw') {
      dict = (lottoI18n && (lottoI18n[locale] || lottoI18n.en)) || null;
      mapping = lottoApply;
    } else {
      const i18n = evalI18nFromSnippet(extractBetween(html, 'const i18n =', 'function t('));
      const uiMap = parseUiMap(html);
      let applyBody = extractFunctionBody(html, 'applyI18n');
      if (!applyBody) applyBody = extractFunctionBody(html, 'applyStaticI18n');
      const applyMap = parseApplyMappings(applyBody, uiMap);
      dict = (i18n && (i18n[locale] || i18n.en)) || null;
      mapping = applyMap;
    }

    html = replaceHtmlLang(html, locale);
    html = localizeToolLinks(html, locale);
    html = applyStaticLocalization(html, dict, mapping, tool);
    html = injectGuidePanel(html, locale);
    html = injectEditorialPanel(html, locale, tool);

    if (html !== orig) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }
}

for (const tool of TOOLS) {
  const file = tool === 'roulette'
    ? path.join(ROOT, 'index.html')
    : path.join(ROOT, tool, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  html = replaceHtmlLang(html, 'ko');
  html = injectEditorialPanel(html, 'ko', tool);

  if (html !== orig) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`static localization updated files: ${changed}`);
