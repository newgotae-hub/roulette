# Coinflip / Dice AdSense-Safe Content Pass

Date: 2026-03-15

## Goal

Keep the site stable during AdSense review while reducing two approval risks:

- coinflip / dice pages looking too thin compared with their controls-heavy UI
- locale pages exposing generic raffle copy or English fallback blocks that do not match the actual tool

This pass intentionally avoided structural SEO changes, URL changes, new external scripts, or monetization work.

## What Changed

### 1. Coinflip / dice explainer content was rewritten to match the actual tool

All 36 `coinflip` / `dice` pages now use tool-specific copy for:

- hero subtitle
- guide subtitle
- 3-step guide cards
- `How to Use`
- `What Is This Tool?`
- FAQ

The previous generic raffle-style copy such as:

- `Prepare the input list or values you want to use in ...`
- `Adjust draw options and run settings ...`
- `Are common input separators supported?`

was removed because it was inaccurate for coin flipping and dice rolling.

### 2. Bottom related-tools block was localized everywhere

The small footer nav injected after the main page script now uses locale-aware:

- heading text
- `aria-label`
- tool labels

This fixed the non-English pages that still showed the English `Related tools` heading and English tool names.

### 3. Copy was centralized for safer future edits

New files:

- `scripts/coin-dice-copy-data.js`
- `scripts/sync-coin-dice-copy.js`

The sync script updates:

- inline i18n copy for coinflip / dice
- visible static guide copy
- the lower AdSense content block
- the post-script related-tools nav

This prevents one locale from drifting away while another stays stale.

### 4. AdSense readiness checks were extended

`scripts/adsense-readiness-check.js` now fails deploys if:

- coinflip / dice pages regress back to the old generic raffle copy
- non-English coinflip / dice pages show the English `Related tools` fallback

## Locale Review Scope

Priority locale wording was manually reviewed for:

- `ko`
- `en`
- `ja`
- `zh-cn`
- `zh-tw`
- `es`
- `fr`
- `de`
- `pt-br`
- `ar`
- `ru`
- `tr`
- `nl`

The pass only changed wording that was clearly inaccurate, too generic, or visibly English in the wrong locale.

Examples of terms intentionally preserved because they match common local usage:

- `Yazı Tura`
- `Kop of Munt`
- `Kopf oder Zahl`
- `Würfel werfen`

## Validation

Executed:

- `node scripts/sync-coin-dice-copy.js`
- `node --check scripts/coin-dice-copy-data.js`
- `node --check scripts/sync-coin-dice-copy.js`
- `node --check scripts/adsense-readiness-check.js`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`

Regression scans:

- `generic_draw_copy=0`
- `non_en_related_tools_english=0`
- `localized_related_tools_blocks=36`

Representative manual spot checks:

- `en/coinflip/index.html`
- `ja/coinflip/index.html`
- `tr/dice/index.html`
- root `coinflip/index.html`
- root `dice/index.html`

## Notes for Future Edits

- Keep coinflip / dice copy tool-specific. Do not reuse generic draw / picker / input-list instructions.
- Keep the bottom related-tools nav localized, including `aria-label`.
- Run `node scripts/sync-coin-dice-copy.js` before validation if coinflip / dice copy is edited.
- Do not change dice / coin 3D runtime loading rules while doing copy work.
