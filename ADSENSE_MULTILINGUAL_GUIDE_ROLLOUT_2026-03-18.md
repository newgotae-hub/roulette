# AdSense Multilingual Guide Rollout - 2026-03-18

## Why This Follow-Up Was Added

- The first AdSense response pass improved Korean and English content depth, but non-Korean surfaces still depended too heavily on an English guide hub.
- That left a remaining quality risk for reviewers landing on localized pages: the site could still look like localized utility tools with limited same-language editorial support.

## What Changed

- Added `/<locale>/guides/` hubs for every supported non-Korean locale.
- Added six localized guide pages per locale:
  - tool selection
  - fair random draws
  - event draw checklist
  - winner records
  - classroom usage
  - balanced team generation
- Each localized guide page now includes:
  - localized summary copy
  - localized key-point bullets
  - localized policy links
  - a linked and embedded English reference section for deeper detail
- Updated localized homepage and tool-page guide panels so they point to the locale's own guide hub instead of defaulting to `/en/guides/`.
- Extended sitemap generation and readiness validation so the multilingual guide set is treated as required, not optional.

## Validation

- `node scripts/generate-localized-guides.js`
  - generated `112` localized guide files
- `node scripts/static-localize-html.js`
  - updated `84` localized tool/home files to point at locale guide hubs
- `node scripts/sync-legal-links.js`
  - corrected localized footer-label drift after regeneration
- `node scripts/generate-sitemaps.js`
  - regenerated sitemap files for the multilingual guide set
- `node scripts/adsense-readiness-check.js`
  - passed
- `node scripts/validate-seo.js`
  - passed for `307 HTML files`

## Remaining Limitation

- This pass materially improves multilingual editorial depth and discovery, but AdSense approval still cannot be guaranteed because Google's review remains external to the repo.
- If another review still flags low-value content, the next likely escalation would be deeper per-tool original body content on non-Korean pages rather than more routing or sitemap work.
