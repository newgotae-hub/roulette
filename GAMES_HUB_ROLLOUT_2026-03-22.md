# Games Hub Rollout

Date: 2026-03-22

## What Changed

- Added a top-level `Games` tab to the main home navigation.
- Created `/games/` and `/en/games/` as a starter game dashboard.
- Added sitemap entries for the new hub pages.

## Launch Shape

- The hub starts with existing interactive experiences so the entry point is useful immediately.
- The page is structured so new game tiles can be added later without changing the URL users start from.

## Validation

- `node scripts/sync-team-generator-locales.js`
- `node scripts/generate-sitemaps.js`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`

