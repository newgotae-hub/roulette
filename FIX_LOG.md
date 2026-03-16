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

### Dice and coin 3D runtime pinned to a stable `model-viewer` build

- Confirmed the team-split rollout and later favicon-related work did not change the dice/coin roll logic; both pages had been loading `model-viewer` from an unversioned CDN URL since the original GLB integration on `2026-03-02`.
- Pinned every root and localized dice/coin page to `@google/model-viewer@3.5.0` so the uploaded `dice.glb` and `stylized_pirate_coin.glb` no longer depend on whichever runtime version unpkg serves at request time.
- Kept the existing `model-viewer`-based 3D motion path and GLB asset references instead of adding another wrapper-animation workaround.
- Detailed notes: [DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md](/home/user/roulette/DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md)

### Dice and coin 3D runtime guardrail and recovery runbook

- Extended the dice/coin root-cause note with explicit prevention rules and a step-by-step recovery runbook for future regressions.
- Added a deployment validator guard in [scripts/validate-seo.js](/home/user/roulette/scripts/validate-seo.js) so deploys now fail if any dice/coin page drops the pinned `model-viewer` URL or its required GLB asset reference.
- Detailed notes: [DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md](/home/user/roulette/DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md)

### Dice and coin headers restored to full tab parity

- Restored the missing `팀 나누기` / `Team Split` tab to every localized `dice` and `coinflip` page in both desktop and mobile headers.
- Re-aligned the dice/coin header routing regex so those pages once again treat `team-generator` as a first-class tool path during locale switching and local link normalization.
- Re-validated all 108 localized tool pages so every main game header now exposes exactly one desktop `nav-team` tab and one mobile `mnav-team` tab.

### Team split top controls compressed further

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

### 2026-03-15 - Team split result header simplified and shuffle removed

- Removed the separate shuffle action from the team-generator input panel and widened the main generate button to a single full-width primary action.
- Collapsed the result header across all localized team-generator pages so only the title plus `다시 배정` / copy / CSV actions remain above the team cards.
- Removed the extra result intro, warning block, and MODE / TEAM SIZE / TEAM AVG / TEAM TOTAL summary strip to cut the empty vertical space above the results.

### 2026-03-15 - Team split fullscreen restored after cache mismatch

- Restored the team-generator fullscreen button by bumping the shared team-generator script asset version across all localized pages.
- Root cause: the previous deploy changed the team-generator result markup but kept the same JS cache key, so browsers could reuse an older bundle that crashed during initialization before fullscreen wiring was attached.

### Dice and coin reduced-motion animation fallback now keeps visible motion

- Identified that both dice and coin pages were skipping their animation loops entirely when `prefers-reduced-motion` was active, which made the motion appear missing.
- Replaced that instant-result fallback with a shorter and lower-intensity animation path across all localized dice and coin pages.
- Updated the Korean reduced-motion note so it now explains that motion becomes shorter and simpler instead of disappearing.
- Root-cause notes: [DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md](/home/user/roulette/DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md)

### Dice and coin visible rotation moved to shell transforms

- Reworked the dice and coin roll animation so the visible motion is driven by the outer shell transform instead of relying on repeated inner `model-viewer` orientation updates.
- Added wrapper transform helpers and 3D shell styling across all localized dice and coin pages so users can see the roll/flip motion again while keeping the final recorded face consistent.
- Updated the root-cause note to capture the deeper rendering issue in addition to the reduced-motion shortcut.

### Dice and coin motion restored by rolling back to the last known-good build

- Reverted the dice and coin pages to the exact `2026-03-12` implementation from commit `eca7bfe`, per user request to restore the previously working 3D animation code instead of layering on more fixes.
- This rollback removed the later reduced-motion and shell-transform motion experiments from all localized dice and coin pages.
- Updated the investigation note to mark the shell-transform workaround as superseded and record that the final production resolution was a rollback.

### 2026-03-15 - Dice and coin Korean root pages keep 3D model rotation in reduced-motion environments

- Confirmed the rejected shell-transform workaround is no longer present in the Korean root dice and coin pages, so the live roll/flip path stays on the uploaded 3D `model-viewer` assets instead of rotating a flat wrapper.
- Removed the Korean root pages' instant-result `prefers-reduced-motion` shortcut so `/dice/` and `/coinflip/` still run the existing 3D orientation animation path, using shorter timing instead of skipping the roll/flip entirely.
- Hid the outdated reduced-motion note on those root pages because it no longer matches the live behavior.
- Root-cause notes: [DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md](/home/user/roulette/DICE_COIN_MOTION_ROOT_CAUSE_2026-03-15.md)

### 2026-03-15 - Multilingual footer fallback and legal-link parity tightened

- Reused the vetted team-generator locale wording to normalize static footer fallback labels for Terms, Privacy, About, and Contact across the multilingual home, lucky-draw, ladder, coin-flip, and dice pages.
- Extended `scripts/sync-legal-links.js` so localized footer labels and locale-aware legal links can be regenerated consistently instead of drifting page by page.
- Extended `scripts/sync-team-generator-locales.js` so localized team-generator pages now ship the correct static legal-link hrefs as well, instead of relying on runtime rewriting.
- Extended `scripts/validate-seo.js` to fail if any localized tool or team-generator page drifts on footer fallback text or locale-aware legal hrefs.

### 2026-03-15 - AdSense approval pass reduced script noise and added English support content

- Disabled site-wide Userback auto-loading for approval review by removing the `userback` mode from deployed HTML pages and stopping the shared third-party loader from booting the widget on idle.
- Added an English guide hub and three English long-form guide pages so the English-first surface now has original explanatory content beyond the interactive tools themselves.
- Strengthened the existing Korean guide pages with `hreflang` pairing and direct links to About, Privacy, Terms, and Contact so trust signals are visible on guide pages too.
- Added an English guide-links block to the English homepage and updated the sitemap generator so the new English guide pages are indexed and discoverable.
- Extended `scripts/adsense-readiness-check.js` and `scripts/deploy-main.sh` so deploys now fail if Userback auto-load returns, if the English guide set disappears, if homepages lose guide-hub links, or if guide pages lose trust links.
- Detailed notes: [ADSENSE_APPROVAL_PASS_2026-03-15.md](/home/user/roulette/ADSENSE_APPROVAL_PASS_2026-03-15.md)

### 2026-03-15 - Trust surface hardened for AdSense review and operator clarity

- Reversed the shared footer-contact interception so `문의` / `Contact` links now remain direct contact/legal routes instead of opening Userback first on plain left-click.
- Replaced the footer operator Instagram links across the deployed HTML pages with the internal `/about/` page so operator identity and policy links stay on-site.
- Expanded the generated contact and privacy pages in Korean, English, Japanese, Simplified Chinese, and Traditional Chinese with operator identification, direct policy links, browser-storage disclosure, and consent-region wording for EEA, UK, and Switzerland traffic.
- Expanded `/about/` with explicit operator/publisher information, browser-local processing notes, advertising/cookie disclosures, and direct links to contact, privacy, and terms.
- Extended `scripts/validate-seo.js` so deploys fail if footer operator links regress back to Instagram, if footer contact is intercepted again, or if the strengthened about/contact/privacy trust signals disappear.
- Detailed notes: [ADSENSE_TRUST_SURFACE_HARDENING_2026-03-15.md](/home/user/roulette/ADSENSE_TRUST_SURFACE_HARDENING_2026-03-15.md)

### Footer contact links now open Userback first

- Updated the shared third-party loader so footer `문의하기` / `Contact` links open the Userback widget on plain left-click before falling back to the existing contact page.
- Added lazy Userback loading for pages that did not previously boot the widget, while keeping modifier-click and other default link behaviors intact.

### English SEO growth pass for homepage, lucky draw, and team generator

- Switched the homepage `x-default` signal to the English homepage in the HTML and generated sitemap so the English locale is the default fallback for acquisition.
- Rewrote the English homepage, lucky-draw page, and team-generator page around stronger English search terms such as `Wheel of Names`, `Random Number Generator`, and `Random Team Generator`.
- Added structured data to the English team-generator page and filled missing `SoftwareApplication` descriptions on the English homepage and lucky-draw page.
- Extended the SEO validator to fail if the new English-first `x-default`, core English title targets, or English team-generator structured data regress.
- Detailed notes: [ENGLISH_SEO_GROWTH_2026-03-15.md](/home/user/roulette/ENGLISH_SEO_GROWTH_2026-03-15.md)

### Public sitemap endpoint standardized to `sitemap.xml`

- Confirmed live `https://randomly-pick.com/sitemap.xml` and `https://randomly-pick.com/sitemap-index.xml` currently return byte-identical XML, so the issue was not malformed sitemap content.
- Standardized the public crawler-facing sitemap directive in `robots.txt` to `https://randomly-pick.com/sitemap.xml`, since that is the URL Search Console is accepting reliably.
- Extended the SEO validator so future deploys fail if `robots.txt` stops advertising `https://randomly-pick.com/sitemap.xml`.

### 2026-03-15 - Team-generator locale pages resynced and guarded against translation drift

- Repaired the shared team-generator locale bundle so bad locale values such as the Japanese mixed-language stat label and the Traditional Chinese example-title drift were removed.
- Added shared locale keys for localized example headers and language-toggle aria labels, and extended the runtime i18n apply path to keep those fields synced on load.
- Added `scripts/sync-team-generator-locales.js` and used it to resync all 18 team-generator locale pages so visible static HTML no longer falls back to stale English copy.
- Extended `scripts/validate-seo.js` so future deploys fail if team-generator locale HTML drifts from the shared bundle or if obvious English static copy returns on non-English pages.
- Detailed notes: [TEAM_GENERATOR_TRANSLATION_AUDIT_2026-03-15.md](/home/user/roulette/TEAM_GENERATOR_TRANSLATION_AUDIT_2026-03-15.md)

### 2026-03-15 - English SEO copy refreshed for wheel, lucky draw, ladder, dice, and coin flip

- Updated the English coin-flip title across all embedded English locale copies from `Coin a Flip!` to the final user-approved phrasing `Flip a Coin! Heads or Tails`, and tightened the validator to catch casing regressions.
- Expanded the English dice hero copy and duplicated English dice metadata so the page now targets online dice-roller use cases such as board games, classrooms, tabletop RPGs, giveaways, and quick random decisions.
- Reworked the English homepage hero and metadata to emphasize `Wheel of Names`, `Lucky Draw`, and `Random Name Picker` together for stronger English acquisition coverage.
- Renamed the English lucky-draw hero toward `Lucky Draw`, strengthened its metadata and explainer copy for random number, name-picking, raffle, and custom-list intent, and aligned the shared English boot title.
- Added a visible two-line English ladder description plus stronger ladder metadata for giveaway, classroom, random-team, and matchup intent, and extended the validator to guard the new English ladder and dice copy.

### 2026-03-15 - Added full repository handoff TXT for future Codex sessions

- Added `CODEX_HANDOFF_2026-03-15.txt` at the repository root with a detailed handoff covering the product structure, page inventory, code organization, recent major fixes, deployment rules, SEO/i18n architecture, and subsystem-specific cautions.
- Recorded the current deployed commit, validation/deploy workflow, key documentation files, and the main recovery rules for team-generator and dice/coin 3D motion so future agents can continue work without re-discovering recent root causes.

### 2026-03-15 - Expanded multilingual legal coverage and normalized locale wording

- Expanded localized `about`, `contact`, `privacy`, and `terms` generation to all supported locales and updated sitemap generation so the full multilingual legal set is published consistently.
- Added shared multilingual legal/footer constants and translation data, then resynced static footer links, inline tool locale bundles, team-generator locale data, and generated legal pages so non-Korean locales no longer drift between HTML and JS.
- Corrected the most visible awkward locale labels and wording, including Spanish `Términos del servicio`, Turkish `Hakkımızda` / `Kullanım Koşulları` / `Gizlilik Politikası`, Dutch `Over ons`, and Dutch navigation `Teams verdelen`, while also reducing forced English phrasing in localized `about` copy for multiple non-English locales.
- Broadened the SEO validator so localized consent-region wording such as `EEE`, `EWR`, `ЕЭЗ`, `المنطقة الاقتصادية الأوروبية`, `VK`, `スイス`, and `İsviçre` are accepted, and restored the shared `const DICE_GLB_URL = '/dice.glb';` constant to every dice locale page so the full validation pass can complete.
- Detailed notes: [MULTILINGUAL_LEGAL_LOCALE_AUDIT_2026-03-15.md](/home/user/roulette/MULTILINGUAL_LEGAL_LOCALE_AUDIT_2026-03-15.md)

### 2026-03-15 - Coinflip / dice copy localized and made tool-specific for AdSense review

- Added `scripts/coin-dice-copy-data.js` and `scripts/sync-coin-dice-copy.js` so coinflip / dice hero subtitles, guide cards, lower explainer blocks, and bottom related-tools nav can be synced safely across all 36 locale pages from one source.
- Replaced the old generic raffle-style `How to Use` / FAQ copy on coinflip and dice pages with tool-specific guidance covering multi-coin / multi-dice usage, local browser processing, history export, and practical use cases such as classroom activities, games, tie-breaks, and quick random decisions.
- Localized the bottom post-script related-tools block in every coinflip / dice page, including the visible heading and `aria-label`, so non-English pages no longer show an English `Related tools` fallback.
- Extended `scripts/adsense-readiness-check.js` to fail if coinflip / dice pages regress back to generic draw-copy or if non-English pages reintroduce the English related-tools footer.
- Detailed notes: [COIN_DICE_ADSENSE_CONTENT_PASS_2026-03-15.md](/home/user/roulette/COIN_DICE_ADSENSE_CONTENT_PASS_2026-03-15.md)

### 2026-03-16 - Safe AdSense QA pass for localized language fallback and review response prep

- Added `scripts/sync-main-tool-locale-fallbacks.js` and used it to resync all 90 main tool pages (`/`, `luckydraw`, `ladder`, `coinflip`, `dice` across locales) so non-English static HTML no longer falls back to English-only language-menu labels, search placeholders, trigger `aria-label`s, flag metadata, or bottom related-tools headings.
- Updated `assets/js/lotto.js` and `assets/js/ladder.js` so the runtime language menu also localizes the trigger `aria-label`, keeping hydrated UI aligned with the static fallback.
- Extended `scripts/adsense-readiness-check.js` so deploys now fail if non-English main tool pages reintroduce `LANGUAGE`, `Search language`, `Change language`, or English `Related tools`.
- Added a short approval/rejection response playbook and documented the intentionally untouched areas to keep review-period changes low risk.
- Detailed notes: [ADSENSE_SAFE_QA_AND_REVIEW_PLAYBOOK_2026-03-16.md](/home/user/roulette/ADSENSE_SAFE_QA_AND_REVIEW_PLAYBOOK_2026-03-16.md)

### 2026-03-16 - Team split result scoreboard and winner calculation

- Added a `점수입력` action next to `다시 배정` in the team-generator result toolbar and wired it to a per-team score entry panel.
- Added live winner calculation so partial entry shows the current leader, complete entry shows the winner or a first-place tie, and leading teams are highlighted in the result cards.
- Included entered team scores and winner status in copied text / CSV exports, and refreshed the shared team-generator script version across all localized pages so browsers fetch the new scoreboard logic.

### 2026-03-16 - Team split score entry switched to per-player averages

- Reworked `점수입력` so it now sits to the left of `다시 배정` and opens per-player score inputs directly inside each team card instead of taking one score per team.
- Changed team result scoring to use the average of the individually entered player scores as the deciding team score, while also showing each team's entered-score total and input progress.
- Changed winner calculation so the summary and card highlight activate only after all player scores are entered, and refreshed the shared team-generator script version again to invalidate the earlier per-team-score bundle.

### 2026-03-16 - Team split score editor moved below cards

- Moved the per-player score inputs out of the main result cards into a separate score-entry panel rendered below the team cards so the original result card height stays stable.
- Hid the old roster-score badges from the main cards while score-entry mode is active, and reused the right-side score slot inside the lower score-entry cards for the new per-player score inputs.
- Kept team average and total updates live in the main result cards while typing in the lower score-entry panel.
- Refreshed the shared team-generator script version again so browsers do not reuse the earlier in-card score-editor bundle.

### 2026-03-16 - Team split score inputs returned to the member rows

- Removed the separate lower score-entry card grid and moved score entry back into the existing team result cards so each member row can be edited directly on the right side.
- Reused the member-row right slot for the live per-player score input while score-entry mode is open, then keeps the team average and total summary updating in place as values change.
- Refreshed the shared team-generator script version again so browsers fetch the restored inline score-entry behavior immediately.

### 2026-03-16 - Team split inline score inputs compacted to two columns

- Changed the inline per-player score-entry layout so score-input mode now places two member cards per row inside each team result card instead of stacking one person per line.
- Tightened the inline member-row spacing and score-input width so the two-column layout uses less vertical space while still keeping live team average and total updates visible.
- Refreshed the shared team-generator script version again so browsers fetch the compact two-column inline score-entry layout immediately.

### 2026-03-16 - Team split member cards keep two-column layout before score entry

- Changed the team-result member layout so each team card now starts in the same two-column member grid used by score-entry mode, instead of switching from one column to two columns after `점수입력`.
- Locked the member-row spacing and text sizing to the same compact layout in both normal and score-entry states so pressing `점수입력` no longer causes the team card layout to jump.
- Refreshed the shared team-generator script version again so browsers fetch the always-two-column member layout immediately.
