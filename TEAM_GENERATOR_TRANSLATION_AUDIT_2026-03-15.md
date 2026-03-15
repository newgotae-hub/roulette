# Team Generator Translation Audit 2026-03-15

## Summary

The team-generator locale rollout had two separate translation regressions at the same time:

1. The shared locale bundle `assets/js/team-generator-i18n.js` still contained bad locale values in a few places.
2. The per-locale HTML files had drifted away from the shared locale bundle, so visible static copy stayed in English on many non-English pages.

This follow-up repaired both layers and added a sync/validation loop so the same class of issue fails before deploy.

## Findings

- Non-English team-generator pages still shipped English static HTML in visible sections such as:
  - stat cards
  - language menu labels and placeholders
  - mobile language toggle `aria-label`
  - guide copy
  - example code blocks
- The shared i18n bundle still had locale-specific bad values, including:
  - Japanese `statInputLabel` mixed with Korean text
  - Traditional Chinese `exampleTitle` using simplified Chinese wording
  - Dutch privacy footer label still in English

## Fixes

- Repaired the shared locale bundle in `assets/js/team-generator-i18n.js`.
- Added new shared locale keys for:
  - example headers
  - language toggle aria labels
- Extended runtime i18n application so it also updates:
  - desktop/mobile language toggle `aria-label`
  - localized example code blocks
- Added `scripts/sync-team-generator-locales.js` to rewrite all 18 team-generator pages from the shared locale source.
- Re-synced all locale pages so the static HTML now matches the locale bundle instead of falling back to stale English copy.
- Added team-generator locale checks to `scripts/validate-seo.js` so deploys fail if:
  - static HTML drifts from the locale bundle
  - localized example blocks drift
  - language labels/placeholders drift
  - obvious English static copy returns on non-English team-generator pages

## Validation

- `node scripts/sync-team-generator-locales.js`
- `node scripts/validate-seo.js`
- direct static rescans for obvious English leftovers across all 18 team-generator pages
- manual spot checks on rewritten locale pages:
  - `ja/team-generator/index.html`
  - `es/team-generator/index.html`

## Recovery

If team-generator translations drift again:

1. Update `assets/js/team-generator-i18n.js`
2. Run `node scripts/sync-team-generator-locales.js`
3. Run `node scripts/validate-seo.js`
4. Fix any reported locale drift before deploy
