# Fix Log

This file is the required running log for completed repository fixes.

How to use it:

- Add one dated entry for every completed fix.
- Keep each entry short.
- If deeper notes exist, link the detailed document.

## 2026-03-12

### SEO query canonicalization and indexing cleanup

- Fixed duplicate `?lang=` URL generation from tool-page language sync logic.
- Hardened tool-page query normalization so invalid `lang` values are stripped instead of producing broken paths.
- Added cleanup patches for legal pages and `/about/` so stale query URLs normalize to canonical paths.
- Extended SEO validation to fail on regression patterns.
- Deployed to `main` with commit `eca7bfe`.
- Detailed notes: [SEO_INDEXING_FOLLOWUP.md](/home/user/roulette/SEO_INDEXING_FOLLOWUP.md)

## 2026-03-15

### Team generator page for random and balanced team splits

- Added `/team-generator/` with Excel-friendly roster parsing for `name / score` style input, configurable team count, pure random splits, and score-balanced team assignment.
- Added copy and CSV export for generated team rosters.
- Updated `about/` copy and sitemap generation so the new tool is documented and indexable.

### Team generator summary switched to per-team averages

- Changed the team generator result summary to show per-team average score values instead of total-score gap when comparing uneven team sizes.
- Updated team cards so score mode emphasizes team average first and keeps total score as secondary context.

### Header tabs unified and Korean team label refined

- Added the `/team-generator/` tab to the headers of the main tool pages across locales so the same top-level navigation is exposed everywhere.
- Updated Korean-facing labels from `팀제너레이터` to `팀 나누기` in the header and team page copy.
- Adjusted the team page summary to show both team averages and team totals together.

### Team split localization and header routing rollout

- Extended the shared tool-page header and language-toggle routing so `/team-generator/` follows the same locale switching rules as the other game pages.
- Added localized `/team-generator/` pages for all supported languages with matching header navigation, alternate links, and translated team split copy.
- Added `assets/js/team-generator-i18n.js`, updated sitemap generation to index the localized team split routes, and refreshed the generated sitemap files.

### Team generator missing-score averaging and copy cleanup

- Changed balanced team scoring so participants without an entered score are assigned the average of the provided scores instead of `0`.
- Updated the team generator UI, warnings, and copied text to explain average-score substitution for missing entries.
- Removed explicit "team size differs by at most 1" copy from the Korean team generator page.

### Team split header parity with other game pages

- Added the desktop fullscreen button and focus hint to every localized `/team-generator/` page so its top header matches the other game pages.
- Reused the same locale-specific fullscreen labels already used on the existing tools, including fullscreen exit text wiring in `assets/js/team-generator.js`.
- Added the missing mobile language-toggle `aria-label` values on the localized team split pages so the header controls now line up with the other tool pages.
- Detailed notes: [TEAM_SPLIT_HEADER_PARITY_FOLLOWUP.md](/home/user/roulette/TEAM_SPLIT_HEADER_PARITY_FOLLOWUP.md)

### Team generator shuffle action for result variations

- Added a dedicated shuffle action to the team split result toolbar across localized team-generator pages.
- Wired random-mode shuffle to reshuffle assignments and balanced-mode shuffle to swap nearby members while keeping team sizes fixed and score balance disruption minimal.
