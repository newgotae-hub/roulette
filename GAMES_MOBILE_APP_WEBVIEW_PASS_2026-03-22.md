# Games Mobile App-Webview Pass

Date: 2026-03-22

## Scope

- Make the Games hubs easier to use in an app webview on phones.
- Bring the same mobile-first baseline to the current playable trio:
  - `Snake`
  - `Number Merge`
  - `Brick Breaker`
- Push the defaults into the scaffold and release/process docs so future titles inherit them automatically.

## What changed

- Hubs now use `viewport-fit=cover`, safe-area-aware outer spacing, and a faster mobile jump path to the live game cards.
- Current game pages tightened touch behavior, tap targets, and small-screen layout so the first load reads cleanly in a narrow embedded browser.
- `scripts/scaffold-webgame.js` now emits mobile/app-webview-friendly defaults instead of relying on later manual cleanup.
- The release checklist and subagent operating model now treat mobile/app-webview readiness as part of the standard ship bar.

## Release checks

- `node --check scripts/scaffold-webgame.js`
- dry-run scaffold command
- `brick-breaker`
- `brick-breaker-en`
- `snake-v11`
- `snake-v11-en`
- `number-merge`
- `number-merge-en`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`
