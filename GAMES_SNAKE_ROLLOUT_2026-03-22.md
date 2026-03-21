# Games Snake Rollout 2026-03-22

## Scope

- Added a real first playable game to the new Games hub: Snake.
- Kept the hub pages editorially useful and AdSense-safe by making Snake the first primary CTA and leaving the existing quick-pick tools as secondary options.
- Limited implementation to the Games surfaces and sitemap publishing paths.

## Files Changed

- `games/index.html`
- `en/games/index.html`
- `games/snake/index.html`
- `en/games/snake/index.html`
- `scripts/generate-sitemaps.js`
- `progress.md`

## Game Implementation Notes

- The Snake runtime already existed in `assets/js/games-snake.js`, so the rollout focused on the pages that host it.
- The page exposes the QA hooks expected by the web-game workflow: `render_game_to_text()`, `advanceTime(ms)`, `resetGame()`, and `__WEBGAME_QA_READY__`.
- The game uses a square canvas board, keyboard/WASD support, mobile swipe support, score tracking, local best-score storage, and a visible target score.

## Publishing Notes

- `sitemap-main.xml` and `sitemap-locales.xml` now include `/games/` and `/games/snake/` plus the English equivalents.
- The hub pages link Snake first so the Games tab now points to a real playable title rather than a placeholder dashboard.

## Next QA Pass

- Confirm the hub opens Snake first.
- Confirm the board renders and the on-screen controls work.
- Run the deterministic web-game QA loop once the page is live.

## Validation Results

- `node scripts/generate-sitemaps.js`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`
- Playwright smoke test passed for `/games/snake/` with `render_game_to_text()` and `advanceTime(ms)` capturing consistent game state.
- Intentional wall collision produced a visible `Game Over` state, and `Restart` returned the board to a fresh running state.
