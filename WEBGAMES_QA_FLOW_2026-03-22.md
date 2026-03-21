# Webgames QA Flow

This note records the lightweight QA flow added for the first Games hub title,
Snake, plus the queued Number Merge scenario contract and the v1.1 Snake
assertion path.

## What changed

- Added `scripts/qa-webgames.js`, a small CDP-based browser QA runner that:
  - prefers the production route when it exists
  - falls back to a local contract harness when the page has not landed yet
  - records snapshots and screenshots under `test-results/webgames/`
- Added `assets/qa/webgames/` fixtures:
  - `snake.qa.json`
  - `snake-en.qa.json`
  - `snake-contract.html`
  - `snake-v11.qa.json`
  - `snake-v11-en.qa.json`
  - `snake-v11-contract.html`
  - `number-merge.qa.json`
  - `number-merge-en.qa.json`
  - `number-merge-contract.html`
- Added a tiny runtime hook alias so the real Snake page can satisfy the QA
  contract with `window.QA_READY` and `window.reset()` in addition to the
  existing internal hooks.

## Route contract

- Korean: `/games/snake/`
- English: `/en/games/snake/`

The runner validates both routes and can be extended with more locales or more
games later.

## Hook contract

- `window.QA_READY === true`
- `window.render_game_to_text()`
- `window.advanceTime(ms)`
- `window.reset()`

Snake v1.1 scenarios additionally expect `render_game_to_text()` to surface
parsed keys for `mode`, `timeLeft` or `timer`, and bonus state.

The production Snake runtime also keeps the existing internal hooks
`__WEBGAME_QA_READY__` and `resetGame` so older QA paths continue to work.

## Notes

- The QA harness is intentionally small and deterministic.
- This is infrastructure only; it does not change the actual game rules.
- If Snake changes later, keep the runner and runtime aliases in sync instead of
  manually playing the game during review.
