# Team Split Header Parity Follow-up

Date: 2026-03-15
Deployment commit: `560c79b`

## Summary

The localized `/team-generator/` pages did not fully match the shared game-page header used by the other tools. The missing pieces were the desktop fullscreen control group and the mobile language-toggle accessibility label.

This follow-up documents the parity patch that brought the team split pages in line with the existing roulette, lucky draw, ladder, coin flip, and dice page headers.

## Root Cause

The original team split rollout copied the shared navigation tabs and language routing behavior, but it did not include the desktop fullscreen button block that already existed on the other game pages.

The same rollout also omitted the `aria-label` on the mobile language-toggle button, which left the control structurally inconsistent with the other localized tool pages.

## Scope

Updated files:

- `assets/js/team-generator.js`
- `team-generator/index.html`
- `en/team-generator/index.html`
- `ja/team-generator/index.html`
- `zh-cn/team-generator/index.html`
- `zh-tw/team-generator/index.html`
- `es/team-generator/index.html`
- `fr/team-generator/index.html`
- `de/team-generator/index.html`
- `pt-br/team-generator/index.html`
- `hi/team-generator/index.html`
- `ar/team-generator/index.html`
- `ru/team-generator/index.html`
- `id/team-generator/index.html`
- `tr/team-generator/index.html`
- `it/team-generator/index.html`
- `vi/team-generator/index.html`
- `th/team-generator/index.html`
- `nl/team-generator/index.html`

## Changes

### Header controls

- Added the desktop fullscreen button to every localized team split page.
- Added the fullscreen focus hint bubble to every localized team split page.
- Reused the same localized fullscreen labels already present on the existing game pages.
- Added mobile language-toggle `aria-label` values so the team split header matches the other tool headers.

### Team split script

- Added fullscreen element bindings to `assets/js/team-generator.js`.
- Added enter/exit fullscreen label handling.
- Added fullscreen change synchronization so the button label stays correct when the browser fullscreen state changes.
- Added the same temporary fullscreen hint behavior used elsewhere in the product.

## Validation

Validation completed before deployment:

- `node --check /home/user/roulette/assets/js/team-generator.js`
- `git diff --check`
- Verified `id="fullscreen-toggle"` exists on all 18 localized team split pages.
- Verified `id="lang-trigger-mobile"` includes `aria-label` on all 18 localized team split pages.

## Rollout

The patch was committed as `560c79b` with message `Match team split header controls`.

Deployment used the repository-standard script:

- `scripts/deploy-main.sh`

Deployment result:

- SEO validation passed for 129 HTML files.
- Push completed from `ef213be` to `560c79b` on `main`.
