# AdSense Approval Pass - 2026-03-15

## Goal

The priority for this pass was not revenue expansion. The goal was to reduce AdSense approval risk by improving trust, lowering unnecessary script noise, and adding more clearly useful English content.

## Highest-risk findings addressed

### 1. Userback was auto-loading on 54 pages

- Before this pass, `index`, `ladder`, and `luckydraw` pages across locales still shipped `data-third-party="ads,userback"`.
- The shared loader also auto-booted Userback whenever that mode was present.
- This support widget was not required for core site use and added a non-essential third-party script during review.

### 2. English-first review surface still looked tool-heavy

- The site already had Korean guide pages, but the English-first surface had no matching English guide hub or long-form support articles.
- That made the English side more likely to read as a collection of utilities instead of a site with supporting editorial value and operational guidance.

### 3. Guide pages themselves were missing trust links

- Existing guide pages had useful content, but they did not surface About, Privacy, Terms, and Contact links directly on-page.
- For approval review, that weakened the trust surface on some of the clearest long-form pages.

### 4. Deployment did not enforce AdSense readiness

- `scripts/deploy-main.sh` only ran `validate-seo.js`.
- The dedicated AdSense readiness checker existed but was not part of the required deploy path.

## Implemented changes

### Shared script/runtime

- [assets/js/third-party-loader.js](/home/user/roulette/assets/js/third-party-loader.js)
  - Removed idle Userback auto-load from the shared third-party loader.
- [scripts/seo-hosting-patch.js](/home/user/roulette/scripts/seo-hosting-patch.js)
  - Stopped generating `userback` into page-level `data-third-party` modes going forward.

### Deployed HTML cleanup

- Home, ladder, and lucky-draw pages across locales now use `data-third-party="ads"` instead of `ads,userback`.
- Residual scan after the change:
  - deployed HTML pages with `userback` mode: `0`

### English content-depth improvement

- Added:
  - [en/guides/index.html](/home/user/roulette/en/guides/index.html)
  - [en/guides/fair-random-draw/index.html](/home/user/roulette/en/guides/fair-random-draw/index.html)
  - [en/guides/event-draw-checklist/index.html](/home/user/roulette/en/guides/event-draw-checklist/index.html)
  - [en/guides/winner-records/index.html](/home/user/roulette/en/guides/winner-records/index.html)
- Added English guide-hub links on:
  - [en/index.html](/home/user/roulette/en/index.html)

### Korean guide-page trust reinforcement

- Updated:
  - [guides/index.html](/home/user/roulette/guides/index.html)
  - [guides/fair-random-draw/index.html](/home/user/roulette/guides/fair-random-draw/index.html)
  - [guides/event-draw-checklist/index.html](/home/user/roulette/guides/event-draw-checklist/index.html)
  - [guides/winner-records/index.html](/home/user/roulette/guides/winner-records/index.html)
- Added:
  - `hreflang` pairing between Korean and English guide counterparts
  - direct About / Privacy / Contact links on the guide surfaces

### Sitemap and deployment enforcement

- [scripts/generate-sitemaps.js](/home/user/roulette/scripts/generate-sitemaps.js)
  - Added English guide pages to generated sitemap output.
- [scripts/adsense-readiness-check.js](/home/user/roulette/scripts/adsense-readiness-check.js)
  - Now fails if Userback auto-load returns.
  - Now fails if required English guide pages are missing.
  - Now fails if the Korean or English homepage loses guide-hub links.
  - Now fails if guide pages lose direct trust links.
  - Now also checks `footer-about` on ad-enabled pages.
- [scripts/deploy-main.sh](/home/user/roulette/scripts/deploy-main.sh)
  - Now runs the AdSense readiness check before the SEO validator and push.

## Validation performed

- `node scripts/generate-sitemaps.js`
- `node scripts/adsense-readiness-check.js`
- `node scripts/validate-seo.js`
- `git diff --check`

## Validation outcome

- AdSense readiness:
  - `audited ad-enabled pages: 90`
  - `minimum content units: 497 (zh-tw/coinflip/index.html)`
  - `passed`
- SEO validator:
  - `passed for 133 HTML files`
- Residual checks:
  - deployed HTML `userback` modes: `0`
  - English guide files present: `4`
  - English homepage links to English guides: `4`

## Remaining approval risks after this pass

### Still acceptable but worth noting

- Coin flip and dice remain relatively simple tool pages compared with the homepage and guide pages. They are no longer the primary concern, but they are still thinner than the strongest surfaces.
- Most long-form guide content is still concentrated in Korean and English only. That is acceptable for approval, but it means not every locale has the same editorial depth.
- The site still relies on many near-parallel localized tool pages. This is structurally fine, but future approval-oriented work should keep strengthening the original guide/help content rather than just adding more mirrored utility pages.

## Recovery rules

1. Run [scripts/adsense-readiness-check.js](/home/user/roulette/scripts/adsense-readiness-check.js) before any approval-sensitive deploy.
2. If `userback` mode reappears in HTML, remove it before deploy.
3. If English guide pages drift out of sitemap or homepage links, restore them before deploy.
4. If a new approval issue is found, document it in [FIX_LOG.md](/home/user/roulette/FIX_LOG.md) and this follow-up family of docs before closing the task.
