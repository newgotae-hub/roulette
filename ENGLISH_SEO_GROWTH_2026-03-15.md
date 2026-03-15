# English SEO Growth Follow-Up

Date: 2026-03-15

## Goal

- Improve English acquisition signals so `/en/` and core English tool pages are more likely to capture generic English search intent.
- Keep the existing Korean root pages indexable while making English the default fallback signal for the homepage.

## Main Issues Found

- The homepage hreflang policy was inconsistent:
  - `/` and `/en/` still pointed `x-default` at `https://randomly-pick.com/`
  - tool subpages already pointed `x-default` at their English URLs
- The English homepage targeted `Wheel of Names` in the title but still used a weaker H1 (`Random Draw Roulette Game`).
- The English lucky-draw page split intent between random numbers and names without aligning title/H1/description tightly enough.
- The English team-generator page had no JSON-LD structured data and used weaker search phrasing than the likely target queries.
- The deploy validator did not guard these English-specific SEO signals.

## Changes Applied

- Switched homepage `x-default` to `https://randomly-pick.com/en/` in:
  - root homepage HTML
  - English homepage HTML
  - sitemap generation logic
  - generated `sitemap-main.xml`
- Rewrote English homepage SEO copy around `Wheel of Names` and `Random Name Picker`:
  - stronger title, description, OG/Twitter copy
  - aligned H1 and hero subtitle
  - filled the previously empty `SoftwareApplication.description`
- Rewrote English lucky-draw SEO copy around `Random Number Generator` plus `Name Picker`:
  - aligned title, meta description, H1, hero subtitle, and structured data name/description
- Reworked English team-generator SEO copy around `Random Team Generator` and `Balanced Team Splitter`:
  - stronger title, meta description, OG/Twitter copy, H1, and hero copy
  - added `BreadcrumbList`, `SoftwareApplication`, and `FAQPage` JSON-LD
  - updated the shared English `team-generator-i18n.js` SEO strings
  - bumped the shared `team-generator` script cache key across all localized team-generator pages so browsers fetch the updated bundle
- Extended `scripts/validate-seo.js` to fail deployment if:
  - `/` or `/en/` stop pointing `x-default` to `/en/`
  - `/en/` stops targeting `Wheel of Names` / `Random Name Picker`
  - `/en/luckydraw/` stops targeting `Random Number Generator`
  - `/en/team-generator/` loses `Random Team Generator` targeting or its required structured data
  - the English team-generator i18n bundle loses its SEO title/hero updates

## Validation

- Ran `node scripts/generate-sitemaps.js`
- Ran `node --check scripts/generate-sitemaps.js`
- Ran `node --check scripts/validate-seo.js`
- Ran `node scripts/validate-seo.js`
- Ran `git diff --check`
- Spot-checked updated English SEO signals with `rg`

## Remaining High-Value Next Steps

- Tighten English exact-match titles for:
  - `/en/coinflip/`
  - `/en/dice/`
  - `/en/ladder/`
- Consider expanding English internal links with more query-aligned anchor text from the homepage guide blocks.
- If Search Console data shows one English page outperforming the rest, expand that page with deeper people-first content before broadening to lower-volume pages.
