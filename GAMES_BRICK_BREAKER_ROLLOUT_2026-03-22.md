# Games Brick Breaker Rollout

Date: 2026-03-22

## Scope

- Publish `Brick Breaker` as the third playable Games title.
- Keep `Snake`, `Number Merge`, and `Brick Breaker` aligned on the Games hubs.
- Include Brick Breaker in sitemap and SEO validation so the release path treats it like the other shipped games.

## Integration Notes

- `games/index.html` and `en/games/index.html` now link directly to the live Brick Breaker routes instead of treating the title as a queued card.
- `scripts/generate-sitemaps.js` now includes both `/games/brick-breaker/` and `/en/games/brick-breaker/`.
- `scripts/validate-seo.js` now recognizes the published game trio and verifies that each page still exposes the expected game script reference.

## Release Checks

- `brick-breaker`
- `brick-breaker-en`
- `snake-v11`
- `snake-v11-en`
- `number-merge`
- `number-merge-en`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`
