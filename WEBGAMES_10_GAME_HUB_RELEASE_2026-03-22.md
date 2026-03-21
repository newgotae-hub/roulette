# Webgames 10-Game Hub Release

Date: 2026-03-22

## Scope

- Restored `en/games/index.html` after the worktree deletion.
- Re-centered the Korean and English Games hubs on the same 10-title lineup:
  `snake`, `number-merge`, `brick-breaker`, `memory-match`, `minesweeper`,
  `reaction-tap`, `color-lines`, `bubble-pop`, `sequence-flash`, and
  `sliding-puzzle`.
- Kept the hub tone aligned with the rest of Randomly Pick: light surfaces,
  practical copy, and a dashboard/list structure instead of a standalone
  microsite.

## Shared Integration

- `scripts/generate-sitemaps.js` already includes the 10 live game routes in
  `sitemap-main.xml` and `sitemap-locales.xml`.
- `scripts/validate-seo.js` now validates the expanded published-game set and
  recognizes the game pages in the localized footer-fallback checks.
- Product and QA files for the new games remain part of the release set, but
  this pass did not edit those product pages.

## Release Notes

- Keep transient QA artifacts out of the branch.
- Stage the new game product routes and QA fixtures together with the shared
  hub/SEO files before deployment.
