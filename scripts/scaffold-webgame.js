#!/usr/bin/env node
/**
 * Scaffold a new webgame in this repo.
 *
 * Usage:
 *   node scripts/scaffold-webgame.js <slug> [options]
 *   node scripts/scaffold-webgame.js --slug <slug> [options]
 *
 * Options:
 *   --title <text>       Shared default title for both locales
 *   --ko-title <text>    Korean title
 *   --en-title <text>    English title
 *   --summary <text>     Shared summary for both locales
 *   --ko-summary <text>  Korean summary
 *   --en-summary <text>  English summary
 *   --root <path>        Output root, defaults to the repo root
 *   --force              Overwrite existing scaffold files
 *   --dry-run            Print files without writing
 *   --help               Show this message
 *
 * Mobile/app-webview defaults:
 *   - viewport-fit=cover
 *   - safe-area aware outer padding
 *   - 44px minimum tap targets
 *   - touch-action defaults tuned for app webviews
 *
 * Creates:
 *   /games/<slug>/index.html
 *   /en/games/<slug>/index.html
 *   /assets/js/games-<slug>.js
 *   /assets/css/games-<slug>.css
 *   /assets/qa/webgames/<slug>.qa.json
 *   /assets/qa/webgames/<slug>-en.qa.json
 *   /assets/qa/webgames/<slug>-contract.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GRID_SIZE = 4;
const TARGET_SCORE = 10;
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function usage() {
  return [
    'Usage:',
    '  node scripts/scaffold-webgame.js <slug> [options]',
    '',
    'Options:',
    '  --title <text>       Shared default title for both locales',
    '  --ko-title <text>    Korean title',
    '  --en-title <text>    English title',
    '  --summary <text>     Shared summary for both locales',
    '  --ko-summary <text>  Korean summary',
    '  --en-summary <text>  English summary',
    '  --root <path>        Output root, defaults to the repo root',
    '  --force              Overwrite existing scaffold files',
    '  --dry-run            Print files without writing',
    '  --help               Show this message',
    '',
    'Mobile defaults:',
    '  - viewport-fit=cover',
    '  - safe-area aware padding',
    '  - 44px minimum tap targets',
    '  - touch-action tuned for app webviews'
  ].join('\n');
}

function parseArgs(argv) {
  const args = {
    slug: null,
    title: '',
    koTitle: '',
    enTitle: '',
    summary: '',
    koSummary: '',
    enSummary: '',
    root: ROOT,
    force: false,
    dryRun: false,
    help: false
  };
  const positional = [];
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--slug' && next) { args.slug = next; i += 1; }
    else if (arg === '--title' && next) { args.title = next; i += 1; }
    else if (arg === '--ko-title' && next) { args.koTitle = next; i += 1; }
    else if (arg === '--en-title' && next) { args.enTitle = next; i += 1; }
    else if (arg === '--summary' && next) { args.summary = next; i += 1; }
    else if (arg === '--ko-summary' && next) { args.koSummary = next; i += 1; }
    else if (arg === '--en-summary' && next) { args.enSummary = next; i += 1; }
    else if (arg === '--root' && next) { args.root = path.resolve(next); i += 1; }
    else if (arg === '--force') { args.force = true; }
    else if (arg === '--dry-run') { args.dryRun = true; }
    else if (arg === '--help' || arg === '-h') { args.help = true; }
    else if (!arg.startsWith('--')) { positional.push(arg); }
  }
  if (!args.slug && positional.length) args.slug = positional[0];
  return args;
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(root, rel, content, force, dryRun) {
  const absolute = path.join(root, rel);
  if (fs.existsSync(absolute) && !force) return { rel, skipped: true };
  if (dryRun) return { rel, dryRun: true };
  ensureDir(path.dirname(absolute));
  fs.writeFileSync(absolute, content, 'utf8');
  return { rel, wrote: true };
}

function buildCopy({ lang, title, summary }) {
  const ko = lang === 'ko';
  return {
    lang,
    title,
    summary: summary || (ko
      ? `${title}는 랜덤리픽의 새 게임 스캐폴드입니다. 지금은 QA 계약과 화면 골격을 먼저 맞춰 두고, 실제 게임 로직은 다음 작업에서 붙이기 쉽게 정리했습니다.`
      : `${title} is the new Randomly Pick game scaffold. It keeps the QA contract and page structure ready so the real gameplay can be added cleanly in the next pass.`),
    eyebrow: ko ? '지금 바로 플레이' : 'Playable now',
    heroLede: ko
      ? '실플레이 게임과 허브형 대시보드를 동시에 준비하는 가벼운 시작점입니다.'
      : 'A light starting point for a playable game and a practical hub-style dashboard.',
    primaryCta: ko ? '게임 시작' : 'Start game',
    secondaryCta: ko ? '게임 허브로 돌아가기' : 'Back to Games',
    boardTitle: ko ? '게임 보드' : 'Game board',
    start: ko ? '시작' : 'Start',
    pause: ko ? '일시정지' : 'Pause',
    resume: ko ? '계속' : 'Resume',
    reset: ko ? '다시 시작' : 'Reset',
    ready: ko ? '시작 버튼이나 방향키를 누르면 게임이 시작됩니다.' : 'Press Start or any arrow key to begin.',
    playing: ko ? '게임이 진행 중입니다. 방향키, WASD, 스와이프로 움직여 보세요.' : 'The game is running. Move with the arrows, WASD, or swipe controls.',
    paused: ko ? '일시정지 상태입니다. 다시 시작하거나 계속할 수 있습니다.' : 'The game is paused. Resume or restart when you are ready.',
    complete: ko ? '한 판이 끝났습니다. 다시 시작해서 새 라운드를 열어 보세요.' : 'The round is complete. Restart to open a fresh run.',
    hint: ko ? '모바일에서는 보드를 스와이프하고, 데스크톱에서는 방향키와 패드 버튼을 사용하세요.' : 'On mobile, swipe the board. On desktop, use the arrow keys or the pad buttons.',
    howTitle: ko ? '플레이 방법' : 'How to play',
    howLead: ko
      ? '이 스캐폴드는 실제 게임을 넣기 전에 가장 먼저 확인해야 할 구조와 피드백을 제공합니다.'
      : 'This scaffold gives you the structure and feedback loop to verify before the real game logic lands.',
    fitTitle: ko ? 'Randomly Pick에 맞는 이유' : 'Why this fits Randomly Pick',
    fitLead: ko
      ? '대형 브랜드처럼 보이기보다, 기존 사이트의 실용적인 톤을 자연스럽게 이어 주는 것이 목표입니다.'
      : 'The goal is to extend the existing practical tone of Randomly Pick rather than make the game feel like a separate brand.',
    relatedTitle: ko ? '관련 허브' : 'Related hub pages',
    trustTitle: ko ? '신뢰 및 지원' : 'Trust and support',
    footer: ko
      ? `Juntae Ko가 제작한 Randomly Pick의 ${title} 스캐폴드입니다.`
      : `The ${title} scaffold was created for Randomly Pick by Juntae Ko.`,
    nav: ko
      ? [
          { href: '/', label: '홈', active: false },
          { href: '/games/', label: '게임', active: true },
          { href: '/luckydraw/', label: '럭키 드로우', active: false },
          { href: '/ladder/', label: '사다리', active: false },
          { href: '/team-generator/', label: '팀 나누기', active: false },
          { href: '/coinflip/', label: '동전 던지기', active: false },
          { href: '/dice/', label: '주사위', active: false }
        ]
      : [
          { href: '/en/', label: 'Home', active: false },
          { href: '/en/games/', label: 'Games', active: true },
          { href: '/en/luckydraw/', label: 'Lucky Draw', active: false },
          { href: '/en/ladder/', label: 'Ladder Draw', active: false },
          { href: '/en/team-generator/', label: 'Team Split', active: false },
          { href: '/en/coinflip/', label: 'Coin Flip', active: false },
          { href: '/en/dice/', label: 'Dice Roll', active: false }
        ],
    trustLinks: ko
      ? [
          { href: '/about/', label: '소개' },
          { href: '/guides/', label: '가이드' },
          { href: '/privacy/', label: '개인정보처리방침' },
          { href: '/terms/', label: '이용약관' },
          { href: '/contact/', label: '문의' }
        ]
      : [
          { href: '/en/about/', label: 'About' },
          { href: '/en/guides/', label: 'Guides' },
          { href: '/en/privacy/', label: 'Privacy Policy' },
          { href: '/en/terms/', label: 'Terms' },
          { href: '/en/contact/', label: 'Contact' }
        ],
    relatedLinks: ko
      ? [
          { href: '/games/', title: '게임 허브', body: '새 게임을 더 붙이기 쉬운 목록형 대시보드입니다.' },
          { href: '/luckydraw/', title: '럭키 드로우', body: '짧은 추첨이 필요할 때 바로 여는 빠른 도구입니다.' },
          { href: '/dice/', title: '주사위', body: '라운드 진행이나 간단한 확률 확인에 잘 맞습니다.' },
          { href: '/about/', title: '소개', body: '랜덤리픽이 어떤 사이트인지 한눈에 볼 수 있습니다.' },
          { href: '/privacy/', title: '개인정보처리방침', body: '브라우저 저장과 데이터 사용 방식을 설명합니다.' },
          { href: '/contact/', title: '문의', body: '사이트 운영자에게 바로 연락할 수 있습니다.' }
        ]
      : [
          { href: '/en/games/', title: 'Games hub', body: 'A list-style dashboard that can grow with more titles.' },
          { href: '/en/luckydraw/', title: 'Lucky Draw', body: 'A quick tool for short, visible draws.' },
          { href: '/en/dice/', title: 'Dice Roll', body: 'Useful for rounds and light probability checks.' },
          { href: '/en/about/', title: 'About', body: 'A short overview of the site and its purpose.' },
          { href: '/en/privacy/', title: 'Privacy Policy', body: 'Explains browser storage and data use.' },
          { href: '/en/contact/', title: 'Contact', body: 'Reach the site owner directly.' }
        ]
  };
}

function buildPageHtml({ lang, pageTitle, pageDescription, canonical, alternateKo, alternateEn, copy, slug, contract }) {
  const nav = copy.nav
    .map((item) => `<a href="${escapeHtml(item.href)}"${item.active ? ' class="active" aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`)
    .join('');
  const related = copy.relatedLinks
    .map((item) => `<a href="${escapeHtml(item.href)}"><strong>${escapeHtml(item.title)}</strong><br />${escapeHtml(item.body)}</a>`)
    .join('');
  const trust = copy.trustLinks
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('');
  const intro = contract
    ? (lang === 'ko'
      ? '이 페이지는 실제 게임이 아직 준비되지 않았을 때 QA runner가 사용하는 fallback 하네스입니다.'
      : 'This page is the fallback harness used by the QA runner before the production game is ready.')
    : copy.heroLede;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(pageTitle)}${contract ? ' QA Contract Harness' : ''}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="alternate" hreflang="ko" href="${escapeHtml(alternateKo)}" />
  <link rel="alternate" hreflang="en" href="${escapeHtml(alternateEn)}" />
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateEn)}" />
  <link rel="stylesheet" href="/assets/css/games-${escapeHtml(slug)}.css?v=scaffold" />
  <link rel="icon" href="/favicon-r.svg" type="image/svg+xml" />
  <script>
    window.__WEBGAME_COPY__ = ${safeJson(copy)};
    window.__WEBGAME_META__ = ${safeJson({ slug, lang, targetScore: TARGET_SCORE, gridSize: GRID_SIZE, contract: Boolean(contract) })};
  </script>
</head>
<body>
  <main class="wrap">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">R.</div>
        <div>
          <div class="brand-name">Randomly Pick</div>
          <div class="brand-sub">${escapeHtml(lang === 'ko' ? '게임 허브' : 'Games hub')}</div>
        </div>
      </div>
      <nav class="nav" aria-label="${lang === 'ko' ? '주요 메뉴' : 'Primary'}">${nav}</nav>
    </header>
    <section class="hero">
      <span class="eyebrow">${escapeHtml(copy.eyebrow)}</span>
      <h1>${escapeHtml(pageTitle)}${contract ? ' QA Contract Harness' : ''}</h1>
      <p class="lede">${escapeHtml(intro)}</p>
      <div class="actions">
        <a class="button primary" href="#play-area">${escapeHtml(copy.primaryCta)}</a>
        <a class="button" href="${escapeHtml(copy.nav[1].href)}">${escapeHtml(copy.secondaryCta)}</a>
      </div>
      <div class="chips" aria-label="${lang === 'ko' ? '허브 주요 특징' : 'Hub highlights'}">
        <span class="chip">${lang === 'ko' ? '실용적 구조' : 'Practical shell'}</span>
        <span class="chip">${lang === 'ko' ? 'QA 계약 우선' : 'QA contract first'}</span>
        <span class="chip">${lang === 'ko' ? '모바일 최적화' : 'Mobile friendly'}</span>
        <span class="chip">${lang === 'ko' ? '추가 게임 확장 가능' : 'Easy to extend'}</span>
      </div>
    </section>
    <div class="layout" id="play-area">
      <section class="panel" aria-labelledby="board-title">
        <div class="panel-head">
          <h2 id="board-title">${escapeHtml(copy.boardTitle)}</h2>
          <div class="toolbar">
            <button id="game-start" type="button">${escapeHtml(copy.start)}</button>
            <button id="game-pause" type="button">${escapeHtml(copy.pause)}</button>
            <button id="game-reset" type="button">${escapeHtml(copy.reset)}</button>
          </div>
        </div>
        <div class="board-shell">
          <div id="game-board" class="board" role="grid" aria-label="${escapeHtml(copy.boardTitle)}"></div>
        </div>
        <div class="controls snake-controls">
          <div class="pad" aria-label="${lang === 'ko' ? '방향 컨트롤' : 'Directional controls'}">
            <span class="blank"></span>
            <button id="game-up" class="up" type="button" aria-label="${lang === 'ko' ? '위로 이동' : 'Move up'}">▲</button>
            <button id="game-left" class="left" type="button" aria-label="${lang === 'ko' ? '왼쪽으로 이동' : 'Move left'}">◀</button>
            <button id="game-down" class="down" type="button" aria-label="${lang === 'ko' ? '아래로 이동' : 'Move down'}">▼</button>
            <button id="game-right" class="right" type="button" aria-label="${lang === 'ko' ? '오른쪽으로 이동' : 'Move right'}">▶</button>
          </div>
          <div>
            <div class="stats" aria-label="${lang === 'ko' ? '현재 게임 상태' : 'Current game state'}">
              <div class="stat"><span>${lang === 'ko' ? '상태' : 'State'}</span><strong id="game-mode">scaffold</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '점수' : 'Score'}</span><strong id="game-score">0</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '이동' : 'Moves'}</span><strong id="game-moves">0</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '최고' : 'Best'}</span><strong id="game-best">0</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '목표' : 'Target'}</span><strong id="game-target">${TARGET_SCORE}</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '포커스' : 'Focus'}</span><strong id="game-focus">0,0</strong></div>
              <div class="stat"><span>${lang === 'ko' ? '속도' : 'Speed'}</span><strong id="game-speed">0 /s</strong></div>
            </div>
            <div class="status" id="game-status">${lang === 'ko'
              ? '시작 버튼이나 방향키를 누르면 QA 계약 하네스가 진행됩니다.'
              : 'Press Start or any arrow key to move the QA harness forward.'}</div>
            <div class="snake-hint" id="game-hint">${escapeHtml(copy.hint)}</div>
          </div>
        </div>
      </section>
      <aside class="panel" aria-labelledby="guide-title">
        <div class="panel-head"><h2 id="guide-title">${escapeHtml(copy.howTitle)}</h2></div>
        <p>${escapeHtml(copy.howLead)}</p>
        <div class="section" style="margin-top:16px;">
          <div class="section-head"><h2>${lang === 'ko' ? '검토 포인트' : 'Review points'}</h2></div>
          <p>${lang === 'ko'
            ? '실제 게임이 들어오면 이 자리를 이용해 레이아웃, 피드백, QA 계약을 빠르게 점검할 수 있습니다.'
            : 'When the real game lands, use this shell to review layout, feedback, and the QA contract quickly.'}</p>
        </div>
        <div class="section" style="margin-top:16px;">
          <div class="section-head"><h2>${escapeHtml(copy.fitTitle)}</h2></div>
          <p>${escapeHtml(copy.fitLead)}</p>
        </div>
      </aside>
    </div>
    <section class="section">
      <div class="section-head"><h2>${escapeHtml(copy.fitTitle)}</h2></div>
      <div class="copy-grid">
        <div class="copy-card"><strong>${lang === 'ko' ? '가벼운 표면' : 'Light surfaces'}</strong><p>${lang === 'ko' ? '얕은 음영, 차분한 패널, 읽기 쉬운 HUD를 기본값으로 둡니다.' : 'Shallow shadows, calm panels, and a readable HUD are the default.'}</p></div>
        <div class="copy-card"><strong>${lang === 'ko' ? '명확한 상태' : 'Clear state'}</strong><p>${lang === 'ko' ? '점수, 최고점, 목표, 상태가 한 화면에 있어 검수와 개선이 쉽습니다.' : 'Score, best, target, and state stay on one screen for easy review.'}</p></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>${escapeHtml(copy.relatedTitle)}</h2></div>
      <div class="related">${related}</div>
    </section>
    <section class="trust">
      <strong>${escapeHtml(copy.trustTitle)}</strong>
      <div class="links">${trust}</div>
    </section>
    <div class="footer">${escapeHtml(copy.footer)} <a href="${escapeHtml(copy.nav[0].href)}">${lang === 'ko' ? '홈' : 'Home'}</a></div>
  </main>
  <script src="/assets/js/games-${escapeHtml(slug)}.js?v=scaffold"></script>
</body>
</html>`;
}

function buildCss() {
  return `:root{color-scheme:light;--line:rgba(148,163,184,.22);--text:#0f172a;--muted:#475569;--accent:#0f172a;--soft:#eef2ff;--safe-top:env(safe-area-inset-top,0px);--safe-right:env(safe-area-inset-right,0px);--safe-bottom:env(safe-area-inset-bottom,0px);--safe-left:env(safe-area-inset-left,0px)}
*{box-sizing:border-box}
html{min-height:100%;background:#eef2ff}
body{margin:0;min-height:100vh;color:var(--text);font-family:"Noto Sans KR","Noto Sans","Malgun Gothic","Segoe UI",sans-serif;background:radial-gradient(circle at 15% 10%,rgba(59,130,246,.08),transparent 24%),radial-gradient(circle at 82% 0%,rgba(34,197,94,.10),transparent 22%),linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%);-webkit-tap-highlight-color:transparent}
a{color:inherit}
.wrap{max-width:1160px;margin:0 auto;padding:calc(24px + var(--safe-top)) calc(18px + var(--safe-right)) calc(72px + var(--safe-bottom)) calc(18px + var(--safe-left))}
.topbar,.nav,.actions,.chips,.links{display:flex;flex-wrap:wrap}
.topbar{align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}
.brand{display:inline-flex;align-items:center;gap:10px;font-weight:700;letter-spacing:-.03em}
.brand-mark{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#0f172a,#334155);color:#fff;box-shadow:0 10px 22px rgba(15,23,42,.14)}
.brand-name{font-size:1rem}.brand-sub{font-size:.86rem;color:#64748b;font-weight:600;margin-top:2px}
.nav{gap:8px}.nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.74);text-decoration:none;font-size:.92rem;color:#334155;transition:transform .18s ease,border-color .18s ease,background .18s ease,color .18s ease;touch-action:manipulation}.nav a:hover{transform:translateY(-1px);border-color:rgba(15,23,42,.16);color:var(--text);background:#fff}.nav a.active{background:var(--accent);color:#fff;border-color:var(--accent);box-shadow:0 12px 24px rgba(15,23,42,.14)}
.hero,.panel,.section,.trust{border:1px solid var(--line);border-radius:28px;background:rgba(255,255,255,.86);box-shadow:0 24px 56px rgba(15,23,42,.06);backdrop-filter:blur(10px)}
.hero{position:relative;overflow:hidden;padding:28px 24px;margin-bottom:22px}.hero::before{content:"";position:absolute;inset:auto -10% -34% auto;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(34,197,94,.12),rgba(34,197,94,0));pointer-events:none}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 11px;border-radius:999px;background:var(--soft);color:#3730a3;font-size:.78rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 10px;font-size:clamp(2.5rem,6vw,4.6rem);line-height:.96;letter-spacing:-.06em;text-wrap:balance}
.lede{max-width:66ch;margin:0;color:var(--muted);font-size:clamp(1rem,2vw,1.08rem);line-height:1.8}
.actions{gap:10px;margin-top:20px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 15px;border-radius:999px;border:1px solid var(--line);background:#fff;text-decoration:none;font-weight:700;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;touch-action:manipulation}.button:hover{transform:translateY(-1px);border-color:rgba(15,23,42,.16);box-shadow:0 10px 22px rgba(15,23,42,.08)}.button.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.chips{gap:10px;margin-top:14px}.chip{display:inline-flex;align-items:center;min-height:30px;padding:0 11px;border-radius:999px;background:rgba(255,255,255,.76);border:1px solid var(--line);color:#334155;font-size:.86rem;font-weight:600}
.layout{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:16px;align-items:start}
.panel,.section,.trust{background:rgba(255,255,255,.94);box-shadow:0 18px 40px rgba(15,23,42,.06)}.panel{padding:20px}
.panel-head,.section-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:14px}.panel-head h2,.section-head h2{margin:0;font-size:1.3rem;letter-spacing:-.04em}
.toolbar{display:flex;flex-wrap:wrap;gap:10px}.toolbar button{border:1px solid var(--line);background:#fff;color:var(--text);font:inherit;border-radius:16px;min-height:44px;padding:0 14px;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background .18s ease;touch-action:manipulation}.toolbar button:hover,.pad button:hover{transform:translateY(-1px);border-color:rgba(15,23,42,.18)}
.board-shell{display:grid;place-items:center;gap:14px;padding:16px;border-radius:24px;background:linear-gradient(180deg,rgba(248,250,252,.98),rgba(226,232,240,.92));border:1px solid rgba(148,163,184,.18)}
.board{width:min(100%,680px);aspect-ratio:1;border-radius:22px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.tile{border-radius:18px;border:1px solid rgba(148,163,184,.18);background:rgba(15,23,42,.08);display:grid;place-items:center;font-size:clamp(1.05rem,4vw,1.6rem);font-weight:700;color:#0f172a;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}.tile.focus{outline:3px solid rgba(34,197,94,.5);outline-offset:2px}
.controls{display:grid;grid-template-columns:auto 1fr;gap:14px;margin-top:16px;align-items:center}.pad{display:grid;grid-template-columns:repeat(3,52px);gap:8px;justify-content:center;align-items:center}.pad button{border:1px solid var(--line);background:#fff;color:var(--text);font:inherit;border-radius:16px;min-height:48px;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background .18s ease;touch-action:manipulation}.pad .blank{visibility:hidden}.pad .up{grid-column:2}.pad .left{grid-column:1;grid-row:2}.pad .down{grid-column:2;grid-row:2}.pad .right{grid-column:3;grid-row:2}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.stat{padding:14px;border-radius:20px;background:rgba(255,255,255,.9);border:1px solid var(--line)}.stat span{display:block;color:var(--muted);font-size:.84rem;margin-bottom:6px}.stat strong{font-size:1.18rem;letter-spacing:-.04em}
.status,.snake-hint{margin-top:14px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.9);border:1px solid var(--line);color:var(--text);line-height:1.7}.snake-hint{color:var(--muted);font-size:.95rem}
.section{margin-top:18px;padding:22px}.section p{margin:0;color:var(--muted);line-height:1.75}.copy-grid,.related{display:grid;gap:12px}.copy-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.related{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
.step,.copy-card,.related a{padding:16px;border-radius:20px;background:rgba(255,255,255,.9);border:1px solid var(--line);color:var(--text)}.step strong,.copy-card strong{display:block;margin-bottom:8px;color:var(--text)}.related a{text-decoration:none;transition:transform .18s ease,border-color .18s ease}.related a:hover{transform:translateY(-2px);border-color:rgba(15,23,42,.18)}
.trust{margin-top:18px;padding:20px 22px}.links{gap:10px;margin-top:12px}.links a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;text-decoration:none;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.85);font-weight:700;color:#334155;touch-action:manipulation}
.footer{margin-top:28px;padding-top:18px;border-top:1px solid rgba(148,163,184,.18);color:#64748b;font-size:.92rem;line-height:1.7}.footer a{color:#0f172a;text-decoration:none;font-weight:700;touch-action:manipulation}
.snake-mode-row,.snake-meta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.snake-mode-chip{border:1px solid var(--line);background:rgba(255,255,255,.86);color:var(--text);min-height:36px;padding:0 14px;border-radius:999px;font:inherit;font-weight:700;cursor:pointer}.snake-mode-chip[aria-pressed="true"]{background:var(--accent);color:#fff;border-color:var(--accent)}.snake-mode-note{margin-top:10px;color:var(--muted);font-size:.95rem;line-height:1.6}.snake-tag{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;font-size:.82rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;background:#ecfdf5;color:#166534}
@media (max-width: 920px){.layout,.copy-grid{grid-template-columns:1fr}.controls{grid-template-columns:1fr}.pad{justify-content:start}}
@media (max-width: 640px){.wrap{padding:calc(18px + var(--safe-top)) calc(14px + var(--safe-right)) calc(56px + var(--safe-bottom)) calc(14px + var(--safe-left))}.hero{padding:24px 18px 20px;border-radius:26px}.section,.panel,.trust{border-radius:24px}.stats{grid-template-columns:1fr}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
}

function buildGameJs(slug) {
  return `(() => {
  const copy = window.__WEBGAME_COPY__ || {};
  const meta = window.__WEBGAME_META__ || {};
  const boardEl = document.getElementById('game-board');
  const statusEl = document.getElementById('game-status');
  const scoreEl = document.getElementById('game-score');
  const bestEl = document.getElementById('game-best');
  const movesEl = document.getElementById('game-moves');
  const targetEl = document.getElementById('game-target');
  const focusEl = document.getElementById('game-focus');
  const speedEl = document.getElementById('game-speed');
  const modeEl = document.getElementById('game-mode');
  const hintEl = document.getElementById('game-hint');
  const startBtn = document.getElementById('game-start');
  const pauseBtn = document.getElementById('game-pause');
  const resetBtn = document.getElementById('game-reset');
  const buttons = { up: document.getElementById('game-up'), down: document.getElementById('game-down'), left: document.getElementById('game-left'), right: document.getElementById('game-right') };
  const size = Number(meta.gridSize) || ${GRID_SIZE};
  const targetScore = Number(meta.targetScore) || ${TARGET_SCORE};
  const storageKey = 'rlt-${slug}-best-v1';
  const state = { phase: 'ready', score: 0, best: Number(window.localStorage?.getItem(storageKey) || '0') || 0, moves: 0, ticks: 0, focus: { x: 0, y: 0 }, grid: createGrid() };

  function createGrid() { return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => y * size + x + 1)); }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function saveBest() { if (window.localStorage) window.localStorage.setItem(storageKey, String(state.best)); }
  function phaseText() { return state.phase === 'playing' ? (copy.playing || 'Playing') : state.phase === 'paused' ? (copy.paused || 'Paused') : state.phase === 'complete' ? (copy.complete || 'Complete') : (copy.ready || 'Ready'); }
  function phaseButtonText() { return state.phase === 'playing' ? (copy.pause || 'Pause') : state.phase === 'paused' ? (copy.resume || 'Resume') : (copy.start || 'Start'); }

  function renderBoard() {
    if (!boardEl) return;
    boardEl.innerHTML = '';
    state.grid.forEach((row, y) => row.forEach((value, x) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (state.focus.x === x && state.focus.y === y) tile.classList.add('focus');
      tile.textContent = String(value);
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', \`\${copy.boardTitle || 'Game board'} \${x + 1},\${y + 1}: \${value}\`);
      boardEl.appendChild(tile);
    }));
  }

  function syncUi() {
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (bestEl) bestEl.textContent = String(state.best);
    if (movesEl) movesEl.textContent = String(state.moves);
    if (targetEl) targetEl.textContent = String(targetScore);
    if (focusEl) focusEl.textContent = \`\${state.focus.x},\${state.focus.y}\`;
    if (speedEl) speedEl.textContent = \`\${Math.max(1, Math.round(1000 / (180 - Math.min(60, state.score * 2))))} /s\`;
    if (modeEl) modeEl.textContent = meta.contract ? 'scaffold' : 'play';
    if (hintEl) hintEl.textContent = copy.hint || '';
    if (statusEl) statusEl.textContent = phaseText();
    if (startBtn) startBtn.textContent = phaseButtonText();
    if (pauseBtn) pauseBtn.textContent = state.phase === 'paused' ? (copy.resume || 'Resume') : (copy.pause || 'Pause');
    if (resetBtn) resetBtn.textContent = copy.reset || 'Reset';
  }

  function stepFocus(dx, dy) {
    if (state.phase === 'ready') state.phase = 'playing';
    if (state.phase === 'paused') return;
    state.focus = { x: clamp(state.focus.x + dx, 0, size - 1), y: clamp(state.focus.y + dy, 0, size - 1) };
    state.moves += 1;
    state.score += 1;
    state.best = Math.max(state.best, state.score);
    state.grid[state.focus.y][state.focus.x] += 1;
    if (state.score >= targetScore) { state.phase = 'complete'; saveBest(); }
    renderBoard(); syncUi();
  }

  function advanceTime(ms = 0) {
    const steps = Math.max(1, Math.round(Number(ms || 0) / 180));
    if (state.phase === 'paused') return render_game_to_text();
    if (state.phase === 'ready') state.phase = 'playing';
    for (let i = 0; i < steps; i += 1) {
      state.ticks += 1;
      state.score += 1;
      state.best = Math.max(state.best, state.score);
      state.focus.x = (state.focus.x + 1) % size;
      if (state.focus.x === 0) state.focus.y = (state.focus.y + 1) % size;
      state.grid[state.focus.y][state.focus.x] += 1;
    }
    state.moves += steps;
    if (state.score >= targetScore) { state.phase = 'complete'; saveBest(); }
    renderBoard(); syncUi();
    return render_game_to_text();
  }

  function reset() {
    state.phase = 'ready';
    state.score = 0;
    state.moves = 0;
    state.ticks = 0;
    state.focus = { x: 0, y: 0 };
    state.grid = createGrid();
    renderBoard(); syncUi();
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({ slug: ${JSON.stringify(slug)}, phase: state.phase, score: state.score, best: state.best, moves: state.moves, ticks: state.ticks, target: targetScore, focus: \`\${state.focus.x},\${state.focus.y}\`, grid: state.grid.map((row) => row.join(',')).join('|'), qaReady: true });
  }

  function onKeydown(event) {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'w' || key === 'W') { event.preventDefault(); stepFocus(0, -1); }
    else if (key === 'ArrowDown' || key === 's' || key === 'S') { event.preventDefault(); stepFocus(0, 1); }
    else if (key === 'ArrowLeft' || key === 'a' || key === 'A') { event.preventDefault(); stepFocus(-1, 0); }
    else if (key === 'ArrowRight' || key === 'd' || key === 'D') { event.preventDefault(); stepFocus(1, 0); }
    else if (key === ' ' || key === 'Spacebar') { event.preventDefault(); state.phase = state.phase === 'playing' ? 'paused' : 'playing'; syncUi(); }
    else if (key === 'r' || key === 'R') { event.preventDefault(); reset(); }
  }

  function bind() {
    if (startBtn) startBtn.addEventListener('click', () => { if (state.phase === 'ready' || state.phase === 'paused') state.phase = 'playing'; else reset(); syncUi(); });
    if (pauseBtn) pauseBtn.addEventListener('click', () => { if (state.phase === 'ready') state.phase = 'playing'; else if (state.phase === 'playing') state.phase = 'paused'; else if (state.phase === 'paused') state.phase = 'playing'; else reset(); syncUi(); });
    if (resetBtn) resetBtn.addEventListener('click', reset);
    if (buttons.up) buttons.up.addEventListener('click', () => stepFocus(0, -1));
    if (buttons.down) buttons.down.addEventListener('click', () => stepFocus(0, 1));
    if (buttons.left) buttons.left.addEventListener('click', () => stepFocus(-1, 0));
    if (buttons.right) buttons.right.addEventListener('click', () => stepFocus(1, 0));
    window.addEventListener('keydown', onKeydown);
  }

  bind();
  reset();
  window.__WEBGAME_QA_READY__ = true;
  window.QA_READY = true;
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.reset = reset;
  window.resetGame = reset;
})();`;
}

function buildScenario({ slug, lang, title }) {
  const en = lang === 'en';
  return {
    id: en ? `${slug}-en` : slug,
    name: en ? `${title} (English)` : title,
    pageCandidates: en
      ? [`/en/games/${slug}/`, `/en/games/${slug}/index.html`]
      : [`/games/${slug}/`, `/games/${slug}/index.html`],
    fallbackPath: `/assets/qa/webgames/${slug}-contract.html`,
    requiredHooks: ['QA_READY', 'render_game_to_text', 'advanceTime', 'reset'],
    parsedAssertions: [
      { key: 'qaReady', type: 'boolean' },
      { key: 'phase', anyOfValues: ['ready', 'playing', 'paused', 'complete'] },
      { key: 'score', type: 'number', min: 0 },
      { key: 'best', type: 'number', min: 0 },
      { key: 'moves', type: 'number', min: 0 },
      { key: 'ticks', type: 'number', min: 0 },
      { key: 'target', type: 'number', min: 1 }
    ],
    bursts: [
      { label: 'boot', calls: ['window.reset()'] },
      { label: 'advance-east', keys: ['ArrowRight'], advanceMs: 360 },
      { label: 'advance-south', keys: ['ArrowDown'], advanceMs: 360 },
      { label: 'reset', calls: ['window.reset()'] }
    ]
  };
}

function buildContractHtml({ slug, title, copy }) {
  const ko = copy.lang === 'ko';
  const intro = ko
    ? `${title} QA 계약 하네스입니다.`
    : `${title} QA contract harness.`;
  return buildPageHtml({
    lang: copy.lang,
    pageTitle: title,
    pageDescription: intro,
    canonical: ko
      ? `https://randomly-pick.com/games/${slug}/`
      : `https://randomly-pick.com/en/games/${slug}/`,
    alternateKo: `https://randomly-pick.com/games/${slug}/`,
    alternateEn: `https://randomly-pick.com/en/games/${slug}/`,
    copy,
    slug,
    contract: true
  });
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.slug) throw new Error(`Missing slug.\n\n${usage()}`);
  if (!VALID_SLUG.test(args.slug)) {
    throw new Error(`Invalid slug "${args.slug}". Use lowercase letters, numbers, and hyphens only.`);
  }

  const slug = args.slug;
  const fallbackTitle = slugToTitle(slug);
  const koTitle = (args.koTitle || args.title || fallbackTitle).trim();
  const enTitle = (args.enTitle || args.title || fallbackTitle).trim();
  const koCopy = buildCopy({ lang: 'ko', title: koTitle, summary: args.koSummary || args.summary || '' });
  const enCopy = buildCopy({ lang: 'en', title: enTitle, summary: args.enSummary || args.summary || '' });
  const root = path.resolve(args.root || ROOT);

  const files = [
    {
      rel: path.join('games', slug, 'index.html'),
      content: buildPageHtml({
        lang: 'ko',
        pageTitle: koTitle,
        pageDescription: koCopy.summary,
        canonical: `https://randomly-pick.com/games/${slug}/`,
        alternateKo: `https://randomly-pick.com/games/${slug}/`,
        alternateEn: `https://randomly-pick.com/en/games/${slug}/`,
        copy: koCopy,
        slug,
        contract: false
      })
    },
    {
      rel: path.join('en', 'games', slug, 'index.html'),
      content: buildPageHtml({
        lang: 'en',
        pageTitle: enTitle,
        pageDescription: enCopy.summary,
        canonical: `https://randomly-pick.com/en/games/${slug}/`,
        alternateKo: `https://randomly-pick.com/games/${slug}/`,
        alternateEn: `https://randomly-pick.com/en/games/${slug}/`,
        copy: enCopy,
        slug,
        contract: false
      })
    },
    {
      rel: path.join('assets', 'js', `games-${slug}.js`),
      content: buildGameJs(slug)
    },
    {
      rel: path.join('assets', 'css', `games-${slug}.css`),
      content: buildCss()
    },
    {
      rel: path.join('assets', 'qa', 'webgames', `${slug}.qa.json`),
      content: `${JSON.stringify(buildScenario({ slug, lang: 'ko', title: koTitle }), null, 2)}\n`
    },
    {
      rel: path.join('assets', 'qa', 'webgames', `${slug}-en.qa.json`),
      content: `${JSON.stringify(buildScenario({ slug, lang: 'en', title: enTitle }), null, 2)}\n`
    },
    {
      rel: path.join('assets', 'qa', 'webgames', `${slug}-contract.html`),
      content: buildContractHtml({ slug, title: enTitle, copy: enCopy })
    }
  ];

  const outcomes = [];
  for (const file of files) {
    outcomes.push(writeFile(root, file.rel, file.content, args.force, args.dryRun));
  }

  console.log(`Scaffold ${args.dryRun ? 'previewed' : 'generated'} for "${slug}" at ${root}`);
  for (const entry of outcomes) {
    if (entry.skipped) console.log(`- skip  ${entry.rel} (already exists)`);
    else if (entry.dryRun) console.log(`- plan  ${entry.rel}`);
    else console.log(`- write ${entry.rel}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
