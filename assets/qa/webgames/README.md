# Webgames QA

This folder holds lightweight QA fixtures for the Games hub.

The review workflow is intentionally hook-driven:

- `window.QA_READY === true`
- `window.render_game_to_text()` returns the current game state
- `window.advanceTime(ms)` advances the simulation deterministically
- `window.reset()` restores a clean starting state

The QA runner prefers the real game route when it exists and falls back to the
local contract harness only when the production page is not present yet.

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

Strict route validation:

```bash
node scripts/qa-webgames.js --scenario snake --strict
```

The strict mode is meant for the review phase after the real game page has been
added. The fallback harness is only there so the QA flow itself can be validated
before the production game lands.

Number Merge uses the same hook-driven contract while the real route is still
coming together.

Snake v1.1 uses a slightly richer contract so the runner can validate mode,
timer/timeLeft, and bonus state from `render_game_to_text()` without touching
the actual product pages.
