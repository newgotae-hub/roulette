# Webgames QA

This folder holds lightweight QA fixtures for the Games hub.

The review workflow is intentionally hook-driven:

- `window.QA_READY === true`
- `window.render_game_to_text()` returns the current game state
- `window.advanceTime(ms)` advances the simulation deterministically
- `window.reset()` restores a clean starting state

The QA runner prefers the real game route when it exists and falls back to the
local contract harness only when the production page is not present yet.

The scaffold helper now bakes in mobile/app-webview-safe defaults by default:

- `viewport-fit=cover` in the generated route viewport meta
- safe-area-aware shell padding
- 44px minimum tap targets for the primary controls
- `touch-action` defaults that behave well in embedded browsers

When reviewing a new game scaffold, confirm those defaults are still present
before spending time on deeper gameplay QA.

Release checklist:

- [WEBGAMES_RELEASE_CHECKLIST_2026-03-22.md](C:/Users/newgo/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/%EC%BD%94%EB%94%A9%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EC%BD%94%EB%8D%B1%EC%8A%A4/%EB%9E%9C%EB%8D%A4%EB%A6%AC%ED%94%BD/WEBGAMES_RELEASE_CHECKLIST_2026-03-22.md)

Current scenario:

- `snake.qa.json`
- `snake-en.qa.json`
- `snake-v11.qa.json`
- `snake-v11-en.qa.json`
- `number-merge.qa.json`
- `number-merge-en.qa.json`

Run:

```bash
node scripts/qa-webgames.js --scenario snake
```

Multiple scenarios:

```bash
node scripts/qa-webgames.js --scenario connect-four,solitaire-mini,word-swipe
```

Named scenario groups:

```bash
node scripts/qa-webgames.js --group new-wave
node scripts/qa-webgames.js --group board-pack --locale en
```

Strict route validation:

```bash
node scripts/qa-webgames.js --scenario snake --strict
```

The strict mode is meant for the review phase after the real game page has been
added. The fallback harness is only there so the QA flow itself can be validated
before the production game lands.

Batch behavior:

- grouped runs now keep going after one scenario fails
- the final process exit is still non-zero if any scenario failed
- `test-results/webgames/summary.txt` now starts with total/pass/fail counts
- `--list`, `--scenario`, `--group`, and `--locale ko|en|all` can be combined to trim a release run down to the exact slice you need

Number Merge uses the same hook-driven contract while the real route is still
coming together.

Snake v1.1 uses a slightly richer contract so the runner can validate mode,
timer/timeLeft, and bonus state from `render_game_to_text()` without touching
the actual product pages.

2026-03-22 note:

- Snake v1.1 scenarios now exercise mode switching and the boot/reset contract
  in both locales.
- Number Merge scenarios now cover daily mode entry, undo, and structured
  board/state serialization.
- Brick Breaker scenarios now validate the control loop, pause/resume flow,
  and structured HUD/object state on both locales.
- New scaffolds should be treated as mobile-first and webview-safe from the
  first pass, not as desktop-only shells to be fixed later.
- Release workers can now run `--group new-wave --strict` style batches and get
  a single manifest/summary that names every failing scenario instead of
  stopping on the first one.
