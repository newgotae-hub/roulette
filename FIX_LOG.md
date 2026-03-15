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

### Korean team split hero copy simplified

- Updated the Korean `/team-generator/` hero title to `팀 나누기 (랜덤/균형)` and simplified the supporting description.
- Removed the duplicate default results-intro sentence on the Korean page and hid the empty result meta block until generated results need to show mode-specific guidance.

### Team split script cache-busting for stale localized copy

- Added version query parameters to `team-generator` script includes across all localized team split pages.
- This forces browsers to fetch the updated `team-generator-i18n.js` and `team-generator.js` files instead of reusing stale cached copies that could reapply old text after deployment.

### Team split controls simplified and fullscreen workspace tightened

- Removed the roster helper note and the sample/clear helper buttons from the team split input panel, and moved the shuffle action next to the main generate button.
- Added fullscreen-specific workspace layout rules so the hero and guide sections are hidden while the controls and results panels fit the viewport more tightly.
- Updated fullscreen behavior to jump directly to the team split workspace after entering fullscreen and refreshed the team split script URLs again to force clients onto the new layout logic.
- Increased the team split roster textarea height after compacting the top control area so the freed space goes back into the main input field in both normal and fullscreen layouts.
- Further compressed the top control cluster by reducing card padding, label sizes, quick team-count buttons, and summary stat box height so the mode/team-count/participant block takes less vertical space before the roster input.

### Korean team split stat copy and team-count spacing polish

- Changed the Korean stat note from `Excel 두 열 그대로 복사` to `엑셀파일 그대로 복사`.
- Changed the Korean mode summary from `랜덤 / 밸런스` to `랜덤 / 균형`.
- Reworked the team-count quick buttons into a fixed five-column row beside the numeric input so the `2` through `6` buttons fill the remaining width more evenly instead of ending awkwardly after `6`.

### Korean team split hero copy line break and cache refresh

- Changed the Korean hero description to add `엑셀파일에서 그대로 복사붙여넣으세요!` on the next line under the main random/balanced explanation.
- Added `whitespace-pre-line` to the hero description so the newline renders visibly instead of collapsing into one paragraph.
- Refreshed the shared `team-generator` script version across every localized page so browsers fetch the updated Korean i18n copy immediately.

### Team split missing-score copy aligned with average scoring

- Replaced remaining team-generator UI copy that still said blank scores are treated as `0` so it now explains that missing scores use the average of the entered scores.
- Fixed the broken Korean newline inside `assets/js/team-generator-i18n.js` so the localized team-generator bundle parses correctly again.
- Refreshed the shared `team-generator` script version across every localized page so stale cached `0`-score copy is invalidated after deployment.

### 2026-03-15 - Team split roster textarea enlarged

- Increased the team-generator roster textarea height across all localized pages so the left input panel uses more of the available vertical space in normal view.
- Raised the fullscreen roster textarea clamp as well so the expanded layout keeps the larger input area instead of shrinking back too aggressively.

### 2026-03-15 - Team split normal-mode roster textarea reduced

- Reduced the normal team-generator roster textarea height across all localized pages so the default layout no longer pushes the input panel too far below the fold.
- Kept the larger fullscreen roster clamp unchanged, since that expanded layout was already using the extra vertical space correctly.

### Dice and coin reduced-motion animation fallback now keeps visible motion

- Identified that both dice and coin pages were skipping their animation loops entirely when `prefers-reduced-motion` was active, which made the motion appear missing.
- Replaced that instant-result fallback with a shorter and lower-intensity animation path across all localized dice and coin pages.
- Updated the Korean reduced-motion note so it now explains that motion becomes shorter and simpler instead of disappearing.
- Root-cause notes: [DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md](/home/user/roulette/DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md)

### Footer contact links now open Userback first

- Updated the shared third-party loader so footer `문의하기` / `Contact` links open the Userback widget on plain left-click before falling back to the existing contact page.
- Added lazy Userback loading for pages that did not previously boot the widget, while keeping modifier-click and other default link behaviors intact.
