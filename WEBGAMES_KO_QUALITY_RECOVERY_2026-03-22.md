# Webgames KO Quality Recovery

Date: 2026-03-22

## Scope

This pass focused on ship-safe Korean quality recovery instead of adding new games.

Recovered surfaces:

- `/games/`
- `/en/games/`
- `/games/solitaire-mini/`
- `/games/memory-match/`
- `/games/connect-four/`

Supporting runtime fixes:

- `assets/js/games-solitaire-mini.js`
- `assets/js/games-memory-match.js`
- `assets/js/games-connect-four.js`
- `assets/js/games-minesweeper.js`

## What Changed

### 1. Korean launcher copy restored

- Rewrote the Korean Games hub into a clean launcher-style page with only `Home` and `Games` in the top nav.
- Replaced broken Korean text in the page title, meta description, quick-launch cards, and all game-card summaries.

### 2. Solitaire Mini first-play and replay flow restored

- Replaced broken Korean hero, CTA, toolbar, mode labels, hints, and editorial sections with readable UTF-8 Korean copy.
- Kept the app-like restart path obvious: `카드 뽑기`, `자동 정리`, `되돌리기`, `새 게임` remain visible above the board.
- Reconnected the runtime to `window.__SOLITAIRE_MINI_COPY__`.

### 3. Memory Match Korean surface and HUD restored

- Rebuilt the Korean page shell with readable Korean onboarding, stats, and restart labels.
- Preserved the already-landed quick replay controls while cleaning the Korean copy block.
- Updated runtime card labels and directional button fallbacks so Korean no longer drops back to English.

### 4. Connect Four Korean tone and onboarding restored

- Replaced broken Korean nav, hero, board, guide, and related-link copy with readable UTF-8 Korean.
- Kept the first play obvious: column buttons, `새 게임`, `리셋`, and short mode guidance stay above the fold.
- Reconnected the runtime to `window.__CONNECT_FOUR_COPY__`.

## Validation

Focused strict QA:

- `node scripts/qa-webgames.js --strict --scenario solitaire-mini`
- `node scripts/qa-webgames.js --strict --scenario solitaire-mini-en`
- `node scripts/qa-webgames.js --strict --scenario memory-match`
- `node scripts/qa-webgames.js --strict --scenario memory-match-en`
- `node scripts/qa-webgames.js --strict --scenario connect-four`
- `node scripts/qa-webgames.js --strict --scenario connect-four-en`

Repo validation:

- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`

## Release note

This pass is intended as a quality-recovery bundle. New-game launch work should stay behind this pass until Korean locale integrity remains clean across the existing shipped lineup.
