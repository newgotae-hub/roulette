# AdSense game-page editorial expansion

Date: 2026-03-18

## Goal

Increase the perceived editorial value of the main game pages so they no longer read like thin tool wrappers below the interactive area.

## Scope

- Added a new lower-page editorial block to the Korean root pages for:
  - `/`
  - `/luckydraw/`
  - `/ladder/`
  - `/coinflip/`
  - `/dice/`
  - `/team-generator/`
- Added the same style of editorial block to the English pages for:
  - `/en/`
  - `/en/luckydraw/`
  - `/en/ladder/`
  - `/en/coinflip/`
  - `/en/dice/`
  - `/en/team-generator/`

## Content model

Each game page now includes a dedicated editorial section focused on:

- when the tool is a strong fit,
- when another tool is a better match,
- what to confirm before using it publicly,
- common misunderstandings that create trust issues or disputes.

This keeps the page-specific content tied to actual operating decisions instead of adding shallow, repeated FAQ filler.

## Implementation

- Added shared copy in `scripts/tool-editorial-copy.js` for Korean and English game-page editorial sections.
- Extended `scripts/static-localize-html.js` so the lower-page editorial block is injected into the Korean root wheel/number-picker/ladder/coin-flip/dice pages and their English counterparts.
- Extended `scripts/sync-team-generator-locales.js` so Korean and English team-generator pages also gain the same editorial treatment below the main guide section.
- Hardened the static meta replacement logic in `scripts/static-localize-html.js` so malformed localized meta tags are normalized instead of accumulating duplicated text during regeneration.

## Extra cleanup picked up during rollout

While regenerating pages, the improved meta normalizer also cleaned previously malformed duplicated meta-content values in:

- `/fr/coinflip/`
- `/fr/dice/`
- `/fr/ladder/`
- `/it/ladder/`

## Validation

- `node --check scripts/tool-editorial-copy.js`
- `node --check scripts/static-localize-html.js`
- `node --check scripts/sync-team-generator-locales.js`
- `node scripts/static-localize-html.js`
- `node scripts/sync-team-generator-locales.js`
- `node scripts/sync-legal-links.js`
- `node scripts/generate-sitemaps.js`
- `node scripts/adsense-readiness-check.js`
- `node scripts/validate-seo.js`

Final verification state:

- AdSense readiness check passed.
- SEO validation passed for 307 HTML files.
