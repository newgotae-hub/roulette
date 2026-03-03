#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.cwd();
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const TOOLS = ['roulette','luckydraw','ladder','coinflip','dice'];

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
  const re = new RegExp(`(<meta[^>]*\\bid=["']${escRe(id)}["'][^>]*\\bcontent=)(["'][^"']*["'])([^>]*>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1"${escAttr(content)}"$3`);
  const re2 = new RegExp(`(<meta[^>]*\\bid=["']${escRe(id)}["'][^>]*)(>)`, 'i');
  return html.replace(re2, `$1 content="${escAttr(content)}"$2`);
}

function replaceMetaByName(html, name, content) {
  const re = new RegExp(`(<meta[^>]*\\bname=[\"']${escRe(name)}[\"'][^>]*\\bcontent=)([\"'][^\"']*[\"'])([^>]*>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1\"${escAttr(content)}\"$3`);
  return html;
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escHtml(title)}</title>`);
}

function replaceHtmlLang(html, locale) {
  return html.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${locale}"`);
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
    const file = path.join(ROOT, locale, tool, 'index.html');
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

    if (html !== orig) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }
}

console.log(`static localization updated files: ${changed}`);
