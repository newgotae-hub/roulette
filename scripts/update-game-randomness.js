#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const INLINE_TOOLS = ['roulette', 'coinflip', 'dice'];
const SCRIPT_TOOLS = ['ladder', 'luckydraw'];

function allFiles(tool) {
  const files = [path.join(ROOT, tool, 'index.html')];
  for (const locale of LOCALES) files.push(path.join(ROOT, locale, tool, 'index.html'));
  return files.filter((file) => fs.existsSync(file));
}

function writeIfChanged(file, next) {
  const prev = fs.readFileSync(file, 'utf8');
  if (prev === next) return false;
  fs.writeFileSync(file, next, 'utf8');
  return true;
}

function ensureInsertedBefore(html, needle, block) {
  if (html.includes(block.trim())) return html;
  return html.replace(needle, `${block}${needle}`);
}

function stripScripts(html, scripts) {
  let out = html;
  for (const src of scripts) {
    const re = new RegExp(`\\n\\s*<script src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"><\\/script>`, 'g');
    out = out.replace(re, '');
  }
  return out;
}

function updateRoulette(html) {
  let out = stripScripts(html, ['/assets/js/random.js', '/assets/js/randomness-note.js']);
  out = out.replace(
    /(\n\s*<script>\n\s*\(function \(\) \{\n\s*const state = \{)/,
    '\n    <script src="/assets/js/random.js"></script>\n    <script src="/assets/js/randomness-note.js"></script>$1'
  );
  out = out.replace(/function pickWinner\(\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function applyPendingExclusions)/, `function pickWinner() {
                const count = state.available.length;
                if (count <= 0) return -1;
                return window.RLTRandom ? window.RLTRandom.index(count) : Math.floor(Math.random() * count);
            }
`);
  return out;
}

function updateCoinflip(html) {
  let out = stripScripts(html, ['/assets/js/random.js', '/assets/js/randomness-note.js']);
  out = out.replace(
    /(\n\s*<script>\n\s*\(function \(\) \{\n\s*const state = \{)/,
    '\n  <script src="/assets/js/random.js"></script>\n  <script src="/assets/js/randomness-note.js"></script>$1'
  );
  out = out.replace(/function secureRandomBit\(\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function computeGrid)/, `function secureRandomBit() {
        return window.RLTRandom ? window.RLTRandom.bool() : Math.random() >= 0.5;
      }
`);
  return out;
}

function updateDice(html) {
  let out = stripScripts(html, ['/assets/js/random.js', '/assets/js/dice-orientation.js', '/assets/js/randomness-note.js']);
  out = out.replace(
    /(\n\s*<script>\n\s*\(function \(\) \{\n\s*const state = \{)/,
    '\n  <script src="/assets/js/random.js"></script>\n  <script src="/assets/js/dice-orientation.js"></script>\n  <script src="/assets/js/randomness-note.js"></script>$1'
  );
  out = out.replace(/\n\s*const TOP_FACE_ORIENTATION = \{[\s\S]*?\n\s*\};\n(?=\s*const FACE_SPIN_PROFILE = \{)/, '\n');
  out = out.replace(/function secureRandomInt6\(\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function computeGrid)/, `function secureRandomInt6() {
        return window.RLTRandom ? window.RLTRandom.range(1, 7) : (1 + Math.floor(Math.random() * 6));
      }
`);
  out = out.replace(/function faceTarget\(value\) \{[\s\S]*?\n\s*\}\n(?=\n\s*function settleDieToFace)/, `function faceTarget(value) {
        if (window.RLTDiceOrientation) return window.RLTDiceOrientation.faceTarget(value);
        return value === 1 ? [90, 0, 0] : [0, 0, 0];
      }
`);
  return out;
}

function updateLadder(html) {
  let out = html;
  if (!out.includes('/assets/js/random.js')) {
    out = out.replace(
      '<script src="/assets/js/ladder.js"></script>',
      '<script src="/assets/js/random.js"></script>\n  <script src="/assets/js/randomness-note.js"></script>\n  <script src="/assets/js/ladder.js"></script>'
    );
  }
  return out;
}

function updateLuckyDraw(html) {
  let out = html;
  if (!out.includes('/assets/js/random.js')) {
    out = out.replace(
      '<script src="/assets/js/lotto.js"></script>',
      '<script src="/assets/js/random.js"></script>\n  <script src="/assets/js/randomness-note.js"></script>\n  <script src="/assets/js/lotto.js"></script>'
    );
  }
  return out;
}

let changed = 0;
for (const file of allFiles('roulette')) changed += writeIfChanged(file, updateRoulette(fs.readFileSync(file, 'utf8'))) ? 1 : 0;
for (const file of allFiles('coinflip')) changed += writeIfChanged(file, updateCoinflip(fs.readFileSync(file, 'utf8'))) ? 1 : 0;
for (const file of allFiles('dice')) changed += writeIfChanged(file, updateDice(fs.readFileSync(file, 'utf8'))) ? 1 : 0;
for (const file of allFiles('ladder')) changed += writeIfChanged(file, updateLadder(fs.readFileSync(file, 'utf8'))) ? 1 : 0;
for (const file of allFiles('luckydraw')) changed += writeIfChanged(file, updateLuckyDraw(fs.readFileSync(file, 'utf8'))) ? 1 : 0;

console.log(`updated game pages: ${changed}`);
