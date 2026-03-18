# AdSense all-language game-page editorial rollout

Date: 2026-03-18

## Goal

Extend the lower-page editorial treatment from the Korean and English game pages to every supported locale so all major language surfaces present the same depth signals during AdSense review.

## Scope

- Expanded the shared game-page editorial copy source to all supported locales in `scripts/tool-editorial-copy.js`.
- Regenerated the lower-page editorial blocks for all localized game/tool pages across:
  - `/[locale]/`
  - `/[locale]/luckydraw/`
  - `/[locale]/ladder/`
  - `/[locale]/coinflip/`
  - `/[locale]/dice/`
  - `/[locale]/team-generator/`
- Korean root pages remained covered as part of the same shared editorial system.

Total surface touched by this pass:

- 18 locales
- 6 tool pages per locale family
- 108 tool surfaces carrying editorial lower-page content

## Editorial structure

Each localized lower-page block now explains:

- when the tool is the right fit,
- when another tool is a better match,
- what an operator should confirm before using it,
- which misunderstandings most often damage trust.

This keeps the content tied to actual operating decisions instead of adding thin duplicated filler.

## Implementation details

- `scripts/tool-editorial-copy.js`
  - Added localized section labels and tool-specific editorial copy for all supported locales.
- `scripts/static-localize-html.js`
  - Re-injected the editorial block into every localized wheel, number-picker, ladder, coin-flip, and dice page.
- `scripts/sync-team-generator-locales.js`
  - Re-injected the matching editorial block into every localized team-generator page.
- `scripts/sync-legal-links.js`
  - Re-run after regeneration to normalize localized legal footer labels and hrefs.

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
- Minimum content units rose to `1068` on the thinnest ad-enabled page after rollout.
- SEO validation passed for `307 HTML files`.
