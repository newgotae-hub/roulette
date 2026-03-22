# WEBGAMES 14-GAME WAVE

Date: 2026-03-22
Scope: shared release surface integration for the current webgame wave

## What This Wave Includes

- `sudoku-mini` as the newest published game on the shared release surfaces
- `connect-four` daily mode and replay depth
- `snake` and `reaction-tap` polish already landed in the product layer
- QA-group improvements for repeatable scenario coverage and stricter contract checks

## Shared Surface Targets

- `scripts/generate-sitemaps.js`
- `scripts/validate-seo.js`
- `scripts/adsense-readiness-check.js`

## Release Intent

This wave keeps the site aligned across:

- sitemap generation
- SEO validation
- AdSense readiness validation
- future release-worker checks

The goal is to make `sudoku-mini` visible everywhere the other published games already appear, while keeping the validation surface in sync with the new wave size.

## Notes

- This document is intentionally short and operational.
- Product and QA work for the games themselves lives in the existing game and QA files.
- Shared sitemap/XML regeneration is still expected as part of the normal release flow when the sitemap outputs are refreshed.
