# Webgames 13-Game Wave - 2026-03-22

## Scope

This rollout ships the 13-game local Games wave with the new titles:

- `connect-four`
- `solitaire-mini`
- `word-swipe`

The product pages, runtimes, QA fixtures, and Games hub entries for these titles were already landed in parallel. This document covers the integration/release pass that made the three games part of the live shared release surface.

## What Changed

- Included the new Korean and English game routes, runtimes, and QA fixtures for `connect-four`, `solitaire-mini`, and `word-swipe` in the release set.
- Added the three new slugs to `scripts/generate-sitemaps.js` so sitemap regeneration includes their Korean and English game routes.
- Added the three new published game definitions to `scripts/validate-seo.js` so title and runtime-script validation now covers the full 13-game set.
- Adjusted localized trust-link validation in `scripts/validate-seo.js` so Games hub/detail pages are checked against their actual Games-specific site-link structure instead of the older tool-footer-id contract.
- Added lightweight release-file existence checks in `scripts/adsense-readiness-check.js` for all 13 local game routes and runtime assets.

## Validation Notes

Checks run in the final release pass:

- `node scripts/qa-webgames.js --strict --scenario connect-four`
- `node scripts/qa-webgames.js --strict --scenario connect-four-en`
- `node scripts/qa-webgames.js --strict --scenario solitaire-mini`
- `node scripts/qa-webgames.js --strict --scenario solitaire-mini-en`
- `node scripts/qa-webgames.js --strict --scenario word-swipe`
- `node scripts/qa-webgames.js --strict --scenario word-swipe-en`
- `node scripts/generate-sitemaps.js`
- `node scripts/adsense-readiness-check.js`
- `node scripts/validate-seo.js`
- `git diff --check`
- `scripts/deploy-main.sh`

## Outcome

- The 13-game wave released with `connect-four`, `solitaire-mini`, and `word-swipe` added to the live Games set.
- Shared sitemap, SEO, and AdSense release surfaces now recognize the full 13-title local lineup.
