# Webgames Release Checklist

This is the lightweight, repeatable release path for Games hub work in this
repo.

## Scope

- Use this for new game launches, hub updates, and QA-only release prep.
- Keep product pages unchanged unless the owning worker explicitly lands a
  product fix.
- QA/ops workers own only:
  - `assets/qa/webgames/`
  - `scripts/qa-webgames.js`
  - QA flow docs such as this file

## Parallel lanes

- Product lane: game/hub workers land route and UI changes.
- QA lane: QA workers validate routes, hooks, screenshots, and scenario
  contracts.
- Release lane: release workers run the repo checks and deploy path after the
  other lanes are green.

## Shared-file freeze

- Once a release candidate is under QA, freeze shared files that affect all
  lanes unless the fix is explicitly about QA/release infrastructure.
- Treat these as shared during the freeze:
  - `scripts/qa-webgames.js`
  - `assets/qa/webgames/*`
  - release/checklist docs
- Do not let product work and QA work edit the same shared file in parallel
  unless the owning worker is intentionally landing that shared change.

## What each worker validates

### Game worker

- Confirms the game route exists for KO and EN.
- Exposes QA hooks:
  - `window.QA_READY === true`
  - `window.render_game_to_text()`
  - `window.advanceTime(ms)`
  - `window.reset()` or `window.resetGame()`
- For richer games, include structured state in `render_game_to_text()`
  so QA can verify mode, timer, bonus, score, or other deterministic fields.
- Mobile-first defaults are part of the release bar:
  - viewport includes `viewport-fit=cover`
  - the shell respects safe-area insets
  - primary controls stay at or above a 44px tap target
  - touch behavior is workable in app webviews, not just desktop browsers
  - the first load reads cleanly in a narrow embedded browser

### Hub worker

- Confirms the Games hub links to the current featured title.
- Checks desktop and mobile layout.
- Confirms the hub still feels like the site, not a separate app shell.

### QA worker

- Runs the browser QA scenarios in `scripts/qa-webgames.js`.
- Uses the real route when present and falls back to the contract harness only
  when the route is missing.
- Checks:
  - hook presence
  - render text
  - reset behavior
  - console errors
  - desktop and mobile screenshots

### Release worker

- Runs the repo release path in this order:
  - `node scripts/qa-webgames.js --scenario <id>`
  - `node scripts/adsense-readiness-check.js`
  - `node scripts/validate-seo.js`
  - `git diff --check`
  - `scripts/deploy-main.sh`
- Never uses raw `git push origin main` for release.

## What to exclude from commits

- `test-results/`
- transient browser artifacts
- `.playwright-cli/`
- local temp screenshots in `C:\temp`
- unrelated user work in the same branch

## Screenshots and artifacts that matter

- Desktop screenshot of the hub
- Mobile screenshot of the hub
- Desktop screenshot of the game route
- Mobile screenshot of the game route
- `test-results/webgames/<scenario>/manifest.json`
- `test-results/webgames/<scenario>/summary.txt`
- Contract harness screenshots when a route is not ready yet

## Recommended release order

1. Land product pages.
2. Run QA on current local routes.
3. Fix only what QA finds.
4. Re-run QA until pass.
5. Release lane runs SEO, AdSense, diff check, and deploy.
6. Deploy with `scripts/deploy-main.sh`.

## Scenario rules

- Snake v1.1 should validate:
  - mode
  - `timeLeft` or `timer`
  - bonus state
- Number Merge should validate:
  - the route exists
  - the game boots
  - reset returns to the same boot state

## Quick checklist

- [ ] KO route exists
- [ ] EN route exists
- [ ] Desktop screenshot looks clean
- [ ] Mobile screenshot looks clean
- [ ] Viewport uses `viewport-fit=cover`
- [ ] Safe-area insets are respected
- [ ] Tap targets are at least 44px
- [ ] Touch controls work in an app webview
- [ ] QA hooks present
- [ ] Reset restores the boot snapshot
- [ ] No console errors
- [ ] `adsense-readiness-check` passed
- [ ] `validate-seo` passed
- [ ] `git diff --check` passed
- [ ] `scripts/deploy-main.sh` completed

## Notes

- If the route is not ready yet, prepare the contract harness and scenario
  first, then run the browser QA against the fallback.
- If a screenshot looks blank or washed out, re-run with a longer virtual time
  budget before calling it a product defect.
- If you need to hand the checklist path to another worker, use the absolute
  Windows workspace path:
  `C:\Users\newgo\OneDrive\바탕 화면\코딩프로젝트\코덱스\랜덤리픽\WEBGAMES_RELEASE_CHECKLIST_2026-03-22.md`
