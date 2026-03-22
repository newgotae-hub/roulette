# Fix Log

This file is the required running log for completed repository fixes.

How to use it:

- Add one dated entry for every completed fix.
- Keep each entry short.
- If deeper notes exist, link the detailed document.

## 2026-03-22

### Korean webgame quality recovery for Solitaire Mini, Memory Match, Connect Four, and the Games launcher

- Rebuilt the Korean `games/solitaire-mini/`, `games/memory-match/`, and `games/connect-four/` pages with clean UTF-8 copy so the first-play surfaces, onboarding text, and restart/replay actions no longer ship with mojibake or broken labels.
- Restored the locale-copy runtime wiring for `games-solitaire-mini`, `games-connect-four`, `games-minesweeper`, and tightened `games-memory-match` so Korean HUD labels, directional controls, and card names stay localized instead of falling back to broken or English strings.
- Kept the Games hub pair ship-safe in launcher form, with the Korean hub copy rebuilt and the English hub staying aligned on the same compact `Home` + `Games` launcher structure.
- Detailed notes: [WEBGAMES_KO_QUALITY_RECOVERY_2026-03-22.md](WEBGAMES_KO_QUALITY_RECOVERY_2026-03-22.md)

### Games hub simplified into a launcher and restart entry points promoted

- Reduced `games/index.html` and `en/games/index.html` to a launcher-style Games hub with only `Home` and `Games` in the top nav, a compact heading, and the live game card grid instead of the older hero, lineup, and note-heavy layout.
- Promoted quicker replay entry points on the weaker-feeling game pages by wiring top-action restart controls for `Bubble Pop`, `Memory Match`, and `Reaction Tap`, so replay is easier to hit on mobile without scrolling back to deeper controls.
- Detailed notes: [GAMES_HUB_LAUNCHER_REPLAY_PASS_2026-03-22.md](GAMES_HUB_LAUNCHER_REPLAY_PASS_2026-03-22.md)

### Shared release surfaces updated for the 14-game wave

- Added `sudoku-mini` to the shared release-surface game lists so sitemap generation, SEO validation, and AdSense readiness checks all recognize it as a published game.
- Documented the current wave in [WEBGAMES_14_GAME_WAVE_2026-03-22.md](C:/Users/newgo/OneDrive/바탕 화면/코딩프로젝트/코덱스/랜덤리픽/WEBGAMES_14_GAME_WAVE_2026-03-22.md), including the new `sudoku-mini` release plus the recent Connect Four daily-mode, Snake/Reaction polish, and QA-group improvements.

### Release automation one-shot path documented

- Documented the new `scripts/release-main.sh` and `scripts/release-main.ps1` release wrappers so future deploys can stage, commit, validate, and hand off to the existing push path in one command.
- Clarified that `scripts/deploy-main.sh` remains the underlying deployment push path and the source of the repo's authenticated git push behavior.
- Detailed notes: [DEPLOY_AUTOMATION_2026-03-22.md](DEPLOY_AUTOMATION_2026-03-22.md)

### Reusable webgame scaffold helper added

- Replaced the placeholder scaffold script with a reusable generator for new webgame routes, assets, and QA fixtures.
- Made the helper safe by default: it skips existing files unless `--force` is passed and supports `--dry-run` preview mode.
- Added usage/help output and a small QA contract convention so future game subagents can generate consistent starter files quickly.

## 2026-03-22

### Webgames subagent operating model documented

- Added a durable operating model for future webgame work so the Lead can split hub, game, QA, and release responsibilities across subagents without creating file conflicts.
- Grounded the playbook in the repo?셲 actual webgame paths and release tools: `games/`, `en/games/`, `assets/js`, `assets/css`, `assets/qa/webgames`, `scripts/qa-webgames.js`, and `scripts/deploy-main.sh`.
- Linked the release playbook to the existing Games hub and Snake/Number Merge rollout pattern so future game work can reuse the same QA and deploy loop.
- Detailed notes: [WEBGAMES_SUBAGENT_OPERATING_MODEL_2026-03-22.md](C:/Users/newgo/OneDrive/바탕 화면/코딩프로젝트/코덱스/랜덤리픽/WEBGAMES_SUBAGENT_OPERATING_MODEL_2026-03-22.md)

### Snake refit for lighter Randomly Pick tone

- Softened the Snake shell so it reads like a tab inside Randomly Pick instead of a separate neon microsite, with lighter backgrounds, calmer typography, and less standalone branding.
- Refined the page copy in both Korean and English to be more practical and editorial, while keeping the gameplay loop, target score, and site navigation intact.
- Preserved the Snake QA contract hooks and updated the HUD/status flow so the game still exposes the same review-friendly runtime signals.
- Validated the JavaScript syntax, Snake QA scenarios, SEO, AdSense readiness, and diff cleanliness after the tone pass.

### Korean Snake HUD and utility copy localized

- Removed the remaining English HUD labels and helper copy from the Korean Snake page so the stat row, board label, directional aria labels, and usage copy now read naturally in Korean.
- Left the English Snake page untouched so the locale split stays clean and predictable.
- Re-ran the Snake QA flow plus SEO and AdSense checks after the copy cleanup to confirm the page still passes review gates.

### Korean Snake shell labels localized

- Localized the visible Korean-page shell labels that were still in English, including the top nav, eyebrow, and mobile hint/section framing so the page now reads consistently as a Korean route.
- Preserved the English Snake page as-is and kept the same QA/runtime hooks and gameplay behavior.
- Re-ran the focused Snake QA, SEO, AdSense, and diff checks after the shell copy update.

### Korean Snake runtime copy fallbacks removed

- Added the missing localized runtime copy keys on the Korean Snake page so the mobile hint, running tag, and collision statuses no longer fall back to English after JS boot.
- Mirrored the same runtime keys on the English Snake page so both locale blocks stay explicit and the shared Snake runtime no longer depends on defaults for those fields.
- Re-ran the focused Snake QA, SEO, AdSense, and diff checks after the runtime-copy fix.

### Webgames QA flow added for Snake

- Added a lightweight browser QA runner for the Games hub that validates Snake on both the Korean and English routes without a manual full-playthrough.
- Added a local fallback contract harness plus scenario fixtures under `assets/qa/webgames/`, and taught the runner to record deterministic snapshots and screenshots in `test-results/webgames/`.
- Added the minimal runtime hook aliases needed for the real Snake page to satisfy the QA contract cleanly.
- Detailed notes: [WEBGAMES_QA_FLOW_2026-03-22.md](/home/user/roulette/WEBGAMES_QA_FLOW_2026-03-22.md)

### Snake launched as the first real Games hub title

- Replaced the Games hub starter placeholder with a real first playable title: Snake.
- Added localized `/games/snake/` and `/en/games/snake/` pages that host the existing Snake runtime, plus updated the hub cards and CTAs so Snake is the first primary action.
- Updated sitemap generation so the new hub and game routes are published and indexable.
- Verified the runtime with a browser QA loop, including movement, pause/resume, wall-collision game over, and restart behavior.
- Detailed notes: [GAMES_SNAKE_ROLLOUT_2026-03-22.md](/home/user/roulette/GAMES_SNAKE_ROLLOUT_2026-03-22.md)

### Games hub entrypoint added

- Added a new top-level `Games` tab to the main home navigation and created `/games/` plus `/en/games/` as a starter dashboard for selecting quick games later.
- Updated sitemap generation so the new hub pages are recognized and published in the sitemap outputs.
- Re-synced `team-generator` locale pages, then re-ran SEO and AdSense readiness checks to confirm the deploy path stayed clear.
- Detailed notes: [GAMES_HUB_ROLLOUT_2026-03-22.md](/home/user/roulette/GAMES_HUB_ROLLOUT_2026-03-22.md)

### Team-generator placeholder drift resynced

- Regenerated all localized `team-generator` pages from the shared i18n source so the `#roster-input` placeholder once again matches `rosterPlaceholder` across every locale.
- Re-ran `scripts/validate-seo.js` after the sync and confirmed the deploy blocker is clear again.

## 2026-03-18

### All-language rollout of lower-page game editorials

- Extended the lower-page editorial blocks for wheel, number-picker, ladder, coin-flip, dice, and team-generator pages to every supported locale instead of keeping the richer treatment only on Korean and English surfaces.
- Regenerated 108 localized tool surfaces from the shared editorial source so each language now exposes tool-fit guidance, misuse cases, operator checks, and common trust-breaking mistakes below the interactive UI.
- Re-ran localized legal-link normalization, sitemap generation, AdSense readiness checks, and SEO validation after the full locale rollout.
- Detailed notes: [ADSENSE_ALL_LANGUAGE_GAME_PAGE_EDITORIAL_ROLLOUT_2026-03-18.md](/home/user/roulette/ADSENSE_ALL_LANGUAGE_GAME_PAGE_EDITORIAL_ROLLOUT_2026-03-18.md)

### Game-page editorial expansion below the interactive tools

- Added lower-page editorial sections to the Korean and English wheel, number-picker, ladder, coin-flip, dice, and team-generator pages so each page now explains fit, misuse cases, pre-run checks, and common trust-breaking mistakes.
- Centralized the new Korean/English copy in `scripts/tool-editorial-copy.js` and extended the HTML sync scripts so the sections are regenerated instead of hand-edited page by page.
- Hardened `scripts/static-localize-html.js` meta replacement so malformed localized meta tags are normalized during regeneration instead of accumulating duplicated fragments.
- Re-synced legal footer labels and revalidated the rollout after regeneration.
- Detailed notes: [ADSENSE_GAME_PAGE_EDITORIAL_EXPANSION_2026-03-18.md](/home/user/roulette/ADSENSE_GAME_PAGE_EDITORIAL_EXPANSION_2026-03-18.md)

### AdSense multilingual guide rollout and locale guide-hub promotion

- Added localized guide hubs and six localized guide pages for every supported non-Korean locale so guide discovery no longer depends on English-only routing outside Korean.
- Generated locale guide articles with localized summaries plus embedded English reference sections, and linked each locale hub/article back to the matching localized policy pages.
- Switched localized homepage/tool guide panels from `/en/guides/` to each locale's own `/[locale]/guides/` hub.
- Extended sitemap generation and AdSense readiness checks so the full multilingual guide set is required before deployment.
- Re-synced localized legal footer labels after regeneration and revalidated the expanded site.
- Detailed notes: [ADSENSE_MULTILINGUAL_GUIDE_ROLLOUT_2026-03-18.md](/home/user/roulette/ADSENSE_MULTILINGUAL_GUIDE_ROLLOUT_2026-03-18.md)

### AdSense low-value-content response across guides, tool pages, and localized discovery

- Added three new original Korean/English guide pairs covering tool selection, classroom usage, and balanced team generation.
- Expanded the Korean and English home/about/guide-hub pages with stronger editorial, trust, and tool-selection content.
- Rewrote the Korean `luckydraw`, `ladder`, `coinflip`, and `dice` lower-page sections around tool-specific use cases instead of generic repeated copy.
- Extended localized tool pages to expose an English guide hub and localized About/Privacy/Contact links so non-Korean surfaces also point to substantive content.
- Updated the sitemap generator and AdSense readiness checks to require the expanded guide set and visible guide-hub links before deployment.
- Detailed notes: [ADSENSE_LOW_VALUE_CONTENT_RESPONSE_2026-03-18.md](/home/user/roulette/ADSENSE_LOW_VALUE_CONTENT_RESPONSE_2026-03-18.md)

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
- Updated Korean-facing labels from `??쒕꼫?덉씠?? to `? ?섎늻湲? in the header and team page copy.
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

- Updated the Korean `/team-generator/` hero title to `? ?섎늻湲?(?쒕뜡/洹좏삎)` and simplified the supporting description.
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

- Restored the missing `? ?섎늻湲? / `Team Split` tab to every localized `dice` and `coinflip` page in both desktop and mobile headers.
- Re-aligned the dice/coin header routing regex so those pages once again treat `team-generator` as a first-class tool path during locale switching and local link normalization.
- Re-validated all 108 localized tool pages so every main game header now exposes exactly one desktop `nav-team` tab and one mobile `mnav-team` tab.

### Team split top controls compressed further

- Further compressed the top control cluster by reducing card padding, label sizes, quick team-count buttons, and summary stat box height so the mode/team-count/participant block takes less vertical space before the roster input.

### Korean team split stat copy and team-count spacing polish

- Changed the Korean stat note from `Excel ????洹몃?濡?蹂듭궗` to `?묒??뚯씪 洹몃?濡?蹂듭궗`.
- Changed the Korean mode summary from `?쒕뜡 / 諛몃윴?? to `?쒕뜡 / 洹좏삎`.
- Reworked the team-count quick buttons into a fixed five-column row beside the numeric input so the `2` through `6` buttons fill the remaining width more evenly instead of ending awkwardly after `6`.

### Korean team split hero copy line break and cache refresh

- Changed the Korean hero description to add `?묒??뚯씪?먯꽌 洹몃?濡?蹂듭궗遺숈뿬?ｌ쑝?몄슂!` on the next line under the main random/balanced explanation.
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
- Collapsed the result header across all localized team-generator pages so only the title plus `?ㅼ떆 諛곗젙` / copy / CSV actions remain above the team cards.
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

- Reversed the shared footer-contact interception so `臾몄쓽` / `Contact` links now remain direct contact/legal routes instead of opening Userback first on plain left-click.
- Replaced the footer operator Instagram links across the deployed HTML pages with the internal `/about/` page so operator identity and policy links stay on-site.
- Expanded the generated contact and privacy pages in Korean, English, Japanese, Simplified Chinese, and Traditional Chinese with operator identification, direct policy links, browser-storage disclosure, and consent-region wording for EEA, UK, and Switzerland traffic.
- Expanded `/about/` with explicit operator/publisher information, browser-local processing notes, advertising/cookie disclosures, and direct links to contact, privacy, and terms.
- Extended `scripts/validate-seo.js` so deploys fail if footer operator links regress back to Instagram, if footer contact is intercepted again, or if the strengthened about/contact/privacy trust signals disappear.
- Detailed notes: [ADSENSE_TRUST_SURFACE_HARDENING_2026-03-15.md](/home/user/roulette/ADSENSE_TRUST_SURFACE_HARDENING_2026-03-15.md)

### Footer contact links now open Userback first

- Updated the shared third-party loader so footer `臾몄쓽?섍린` / `Contact` links open the Userback widget on plain left-click before falling back to the existing contact page.
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
- Corrected the most visible awkward locale labels and wording, including Spanish `T챕rminos del servicio`, Turkish `Hakk캇m캇zda` / `Kullan캇m Ko힊ullar캇` / `Gizlilik Politikas캇`, Dutch `Over ons`, and Dutch navigation `Teams verdelen`, while also reducing forced English phrasing in localized `about` copy for multiple non-English locales.
- Broadened the SEO validator so localized consent-region wording such as `EEE`, `EWR`, `?葵?`, `碼???慢?馬 碼?碼?魔巒碼膜?馬 碼?粒?邈?磨?馬`, `VK`, `?밤궎??, and `캅svi챌re` are accepted, and restored the shared `const DICE_GLB_URL = '/dice.glb';` constant to every dice locale page so the full validation pass can complete.
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

- Added a `?먯닔?낅젰` action next to `?ㅼ떆 諛곗젙` in the team-generator result toolbar and wired it to a per-team score entry panel.
- Added live winner calculation so partial entry shows the current leader, complete entry shows the winner or a first-place tie, and leading teams are highlighted in the result cards.
- Included entered team scores and winner status in copied text / CSV exports, and refreshed the shared team-generator script version across all localized pages so browsers fetch the new scoreboard logic.

### 2026-03-16 - Team split score entry switched to per-player averages

- Reworked `?먯닔?낅젰` so it now sits to the left of `?ㅼ떆 諛곗젙` and opens per-player score inputs directly inside each team card instead of taking one score per team.
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

- Changed the team-result member layout so each team card now starts in the same two-column member grid used by score-entry mode, instead of switching from one column to two columns after `?먯닔?낅젰`.
- Locked the member-row spacing and text sizing to the same compact layout in both normal and score-entry states so pressing `?먯닔?낅젰` no longer causes the team card layout to jump.
- Refreshed the shared team-generator script version again so browsers fetch the always-two-column member layout immediately.

### 2026-03-16 - Team split score entry now opens with no extra header panel

- Removed the extra `????먯닔 ?낅젰` guidance/status box that had been inserted above the result cards when score-entry mode opened.
- Kept score-entry mode fully inline so pressing `?먯닔?낅젰` now only swaps the member-row right side into number inputs without moving the surrounding result layout.
- Refreshed the shared team-generator script version again so browsers fetch the no-header inline score-entry behavior immediately.

### 2026-03-16 - Team split score entry no longer changes card height

- Fixed each member row to the same height in normal mode and score-entry mode by reserving a constant right-side score slot.
- Reserved the team-card summary and winner-pill space so pressing `?먯닔?낅젰` no longer makes the card grow slightly before scores are entered.
- Simplified the match-score summary line to average plus total only, avoiding progress text wrapping that could stretch the card.

### 2026-03-16 - Team split score entry translations filled for all locales

- Replaced the non-Korean score-entry runtime fallback so each supported locale now shows localized score-entry labels, placeholders, winner states, and export text.
- Kept the score-entry UI behavior unchanged while removing the remaining English-only strings from non-English team-generator pages.
- Refreshed the shared team-generator script version again so browsers fetch the updated locale strings immediately.

### 2026-03-16 - Team generator local QA mode for score-entry screenshots

- Added a `?qa=1` local QA mode for `team-generator` pages that skips remote GTM, Tailwind CDN, Iconify, and Google Fonts in favor of a dedicated local QA stylesheet.
- Added a deterministic `?qa_autofill=1&qa_case=score-entry` flow so local screenshots can render the same generated teams and member score-entry state across all locales.
- Added a locale screenshot script to capture all team-generator QA pages from a local static server and refreshed the shared asset version again.

### 2026-03-16 - Team generator locale QA switched to deterministic DOM audit

- Replaced the unstable screenshot-only locale verification path with a Chromium DevTools WebSocket DOM audit in `scripts/qa-team-generator-locales.js`.
- Added a local QA harness plus `qa_headless=1` handling so score-entry UI state can be checked without remote assets or render-dependent layout churn, while localized static labels are verified from each locale HTML source.
- Wrote the latest 18-locale audit results to `test-results/team-generator-local-qa-dom/manifest.json` and `test-results/team-generator-local-qa-dom/summary.txt`, and refreshed the shared team-generator locale asset block so local QA pages honor the headless flag.

### 2026-03-16 - Team generator hero copy updated for all locales

- Updated the main `heroBody` copy in all 18 team-generator locales so the description now explains random-only input, score-balanced input, Excel paste support, and post-match winner detection from individual score entry.
- Matched the runtime `resultMetaDefault` message to the same feature explanation across all locales, and refreshed the Korean fallback in `assets/js/team-generator.js` to stay consistent if localized config is unavailable.
- Extended `scripts/qa-team-generator-locales.js` to verify the localized `hero-body` source text and the runtime `resultMetaDefault` message in addition to the existing score-entry audit.

### 2026-03-17 - Team generator results panel now surfaces score-entry flow in all locales

- Added an always-visible `resultsIntro` line beside the team-results heading so every locale now explains that score entry reveals team average, total, and the winner before any teams are generated.
- Reworked the empty-state copy into a two-step flow with preserved line breaks, making the core path explicit: generate teams first, then enter post-match player scores to decide the winner.
- Extended `scripts/sync-team-generator-locales.js` and `scripts/qa-team-generator-locales.js` so the new results-panel structure is synced across all 18 locale pages, while QA now validates the static localized copy from each HTML source and the dynamic score-entry UI from the local harness.
- Detailed notes: [TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md](/home/user/roulette/TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md)

### 2026-03-17 - Team generator results intro removed and inline score slot aligned

- Removed the duplicated `resultsIntro` guidance line from the team-results header, cleared the synced `resultsIntro` markup from all locale pages and the QA harness, and kept the score-entry explanation only in the two-step empty state.
- Refined the inline member-row score slot so score badges and score inputs share the same clearer fixed-width pill, centered numerals, and steadier padding instead of the smaller awkward right-side box.
- Updated `scripts/qa-team-generator-locales.js` so locale QA now fails if any `results-intro` markup comes back, refreshed the team-generator asset version to `20260317-team-results-clean2`, and re-ran the 18-locale DOM audit plus AdSense/SEO validation.
- Detailed notes: [TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md](/home/user/roulette/TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md)

### 2026-03-17 - Team generator guide section expanded for team battle flow

- Reworked the `?ъ슜 諛⑸쾿` list so it now explains the full flow after team generation: open `?먯닔?낅젰`, enter each member's post-match score, and use the live average/total update to identify the winning team.
- Added a new guide card under the how-to list that frames the page as a lightweight team battle scoreboard, with a three-step explanation for creating teams, entering personal scores, and checking the winner.
- Localized the expanded guide copy for all 18 team-generator locales, updated locale sync and QA so the new guide IDs are validated from each locale HTML source, and refreshed the shared asset version to `20260317-team-results-guide1`.
- Detailed notes: [TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md](/home/user/roulette/TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md)

### 2026-03-17 - Team generator guide section layout refined for cleaner spacing

- Rebuilt the upper guide area into a tighter two-column editorial layout: the how-to flow now sits in six compact step cards, while the battle guide and input examples stack in a separate right column.
- Removed the awkward extra whitespace caused by the older plain list plus loose card stack, tightened the example-card spacing, and added subtle separators/background treatment so the section feels more deliberate without leaving the existing site design language.
- Resynced all 18 locale pages with the new guide layout, refreshed the shared asset version to `20260317-team-results-guide2`, and reran the locale DOM audit plus AdSense/SEO validation.
- Detailed notes: [TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md](/home/user/roulette/TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md)

### 2026-03-17 - Team generator score-entry history consolidated for traceability

- Added [TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md](/home/user/roulette/TEAM_GENERATOR_SCORE_ENTRY_TRACKING_2026-03.md) as the single history index for score-entry, winner calculation, locale rollout, QA, and results-panel guidance work.
- Recorded the related commit chain from `7087d1e` through `99bd65c`, the files that must be updated together, the latest QA artifact paths, and the repeatable validation/deploy workflow for future follow-up changes.

### 2026-03-18 - Game pages hardened with direct guide links and visible review signals

- Added `scripts/tool-editorial-meta.js` and extended the lower-page editorial blocks so every major game page now surfaces direct localized guide links plus a visible `Reviewed and updated: 2026-03-18` style trust signal.
- Extended both `scripts/static-localize-html.js` and `scripts/sync-team-generator-locales.js` so the same editorial treatment now covers Korean root pages and all localized `team-generator` pages alongside the other game tools.
- Re-ran static page generation, legal-link sync, sitemap generation, and AdSense/SEO verification; the post-change readiness audit now reports `minimum content units: 1151` on the thinnest ad-enabled page.
- Detailed notes: [ADSENSE_REVIEW_SIGNAL_HARDENING_2026-03-18.md](/home/user/roulette/ADSENSE_REVIEW_SIGNAL_HARDENING_2026-03-18.md)

### 2026-03-22 - Webgames QA flow extended for Number Merge and current Snake v1.1

- Added hook-driven QA fixtures for `number-merge` and `number-merge-en` under `assets/qa/webgames/`, plus a matching fallback contract harness so the scenario can be validated before any future route drift.
- Updated `assets/qa/webgames/README.md` and `WEBGAMES_QA_FLOW_2026-03-22.md` to document the new Number Merge scenario contract alongside the existing Snake flow.
- Ran browser QA against the current local Snake routes and the live Number Merge routes; Snake passed on both locales, while Number Merge currently fails the reset contract because the final reset snapshot does not match the boot snapshot.

### 2026-03-22 - Snake v1.1 QA contract prepared for mode/timer/bonus validation

- Extended `scripts/qa-webgames.js` so scenarios can assert parsed `render_game_to_text()` fields, including required keys, type checks, and allowed values.
- Added `snake-v11.qa.json` and `snake-v11-en.qa.json` so the next Snake pass can verify `mode`, `timeLeft` or `timer`, and bonus state without touching the product pages.
- Added `snake-v11-contract.html` as a deterministic QA fallback harness and updated the webgames QA notes so the new contract is documented for the next worker handoff.

### 2026-03-22 - Webgames release checklist documented for repeatable QA and deploy flow

- Added [WEBGAMES_RELEASE_CHECKLIST_2026-03-22.md](/home/user/roulette/WEBGAMES_RELEASE_CHECKLIST_2026-03-22.md) as the lightweight release checklist for future game launches, including worker responsibilities, required screenshots, exclusions, and the release-worker command order.
- Linked the checklist from `assets/qa/webgames/README.md` so QA and release workers can reach it from the existing webgames fixture area.

### 2026-03-22 - Snake v1.1 shipped with modes, bonus apple, and mobile polish

- Added a small Snake mode system with `Classic`, `Timed`, and `Wrap` chips so the game feels less one-note while staying easy to validate.
- Added a deterministic bonus-apple reward loop, compact mode/reward/timer HUD badges, and a calmer mobile control treatment so the page feels more complete without becoming a separate microsite.
- Kept the QA hooks intact and simplified `render_game_to_text()` so reset comparisons stay deterministic while still exposing mode, timer/timeLeft, and bonus state for review automation.

### 2026-03-22 - Snake v1.1 QA contract serialized for parsed mode/timer/bonus checks

- Switched `render_game_to_text()` to a JSON payload so the QA runner can parse `mode`, `timeLeft`/`timer`, and bonus state directly on boot and after bursts.
- Preserved the visible HUD and gameplay behavior while making the serialized state contract deterministic for both the Korean and English Snake routes.
- Re-ran the v1.1 QA scenarios on `/games/snake/` and `/en/games/snake/` after the serialization change; both passed.

### 2026-03-22 - Number Merge shipped as the second Games title

- Added `/games/number-merge/` and `/en/games/number-merge/` as a first-party tile-merge puzzle with keyboard, swipe, undo, local best tracking, and editorial help sections that match the existing Randomly Pick tone.
- Added shared `games-number-merge` JS/CSS assets plus deterministic QA hooks so the release runner can validate both locales without relying on manual play.
- Updated the Games hubs, QA fixtures, and sitemap generation so the new title ships as part of the current Games expansion instead of as an orphaned page.

### 2026-03-22 - Webgames parallel workflow and scaffold support documented

- Added `.gitignore` exclusions for `.playwright-cli/` and `test-results/` so webgame QA artifacts stay out of release commits by default.
- Added the subagent operating model, release checklist, and parallel roadmap notes so future workers can split game production, QA, and release tasks without rediscovering the process.
- Added `scripts/scaffold-webgame.js` as the dry-run-friendly starter for new Games entries, and linked the updated workflow from the existing webgames QA notes.

### 2026-03-22 - Brick Breaker published on the Games hubs and release path

- Promoted `Brick Breaker` from a queued card to a live playable Games title on both `games/index.html` and `en/games/index.html`, so the hub now surfaces three playable cards instead of two plus a placeholder.
- Added the Korean and English Brick Breaker routes to sitemap generation and widened SEO validation so the published game trio (`Snake`, `Number Merge`, `Brick Breaker`) is checked consistently during release.
- Added [GAMES_BRICK_BREAKER_ROLLOUT_2026-03-22.md](/home/user/roulette/GAMES_BRICK_BREAKER_ROLLOUT_2026-03-22.md) as the short rollout note for integration scope and release checks.

### 2026-03-22 - Arcade and reflex feel pass tightened restart flow, feedback, and mobile immediacy

- Upgraded the current arcade/reflex slice without touching the hub or release surfaces: `Snake` now supports instant direction-led restarts after failure, `Brick Breaker` restarts cleanly from board taps and adds stronger hit/life haptics, and `Bubble Pop` now pays out a clearer board-clear bonus while letting finished rounds restart directly from the board.
- Tuned the reaction-heavy games for quicker app-like feel: `Reaction Tap` now shortens fast-hit feedback windows and adds clearer haptic states, `Sequence Flash` adds a one-use per round replay cue through the main action button, and `Memory Match` now supports faster post-clear replay flow with stronger match/miss pulses.
- Verified the six touched runtimes with `node --check`, strict webgame QA for `snake-v11`, `brick-breaker`, `bubble-pop`, `reaction-tap`, `sequence-flash`, and `memory-match`, plus `git diff --check` before deploy.

### 2026-03-22 - Games mobile and app-webview defaults tightened across hub, titles, and scaffold

- Tightened the Games hubs for phones with `viewport-fit=cover`, safe-area-aware shell padding, and quicker mobile access to the live game cards so the tab feels less top-heavy inside an app webview.
- Carried the same mobile-first baseline into the current game trio (`Snake`, `Number Merge`, `Brick Breaker`) and their QA/docs updates so tap targets, touch behavior, and narrow-shell layout are part of the release bar instead of a later polish pass.
- Updated the scaffold and webgames workflow docs so new titles inherit the same app-webview-safe defaults from the start; rollout notes live in [GAMES_MOBILE_APP_WEBVIEW_PASS_2026-03-22.md](/home/user/roulette/GAMES_MOBILE_APP_WEBVIEW_PASS_2026-03-22.md).

### 2026-03-22 - Games hub restored for the full 10-title lineup

- Restored the deleted English hub page at `en/games/index.html` and re-synced both Games hubs so they present the full 10-title lineup with the same practical Randomly Pick tone.
- Updated `scripts/validate-seo.js` so the expanded game routes are recognized in published-page validation and localized footer checks, keeping the new live game set inside the shared release contract.
- Added [WEBGAMES_10_GAME_HUB_RELEASE_2026-03-22.md](/home/user/roulette/WEBGAMES_10_GAME_HUB_RELEASE_2026-03-22.md) as the short rollout note for this integration pass.

### 2026-03-22 - Shared release surfaces widened for the 13-game local wave

- Extended `scripts/generate-sitemaps.js` and `scripts/validate-seo.js` so `connect-four`, `solitaire-mini`, and `word-swipe` are treated as published Games routes alongside the earlier 10-title set.
- Added lightweight release-file presence checks to `scripts/adsense-readiness-check.js` so both locale HTML routes and runtime assets for the 13 local games stay inside the shared release contract.
- Added [WEBGAMES_13_GAME_WAVE_2026-03-22.md](/home/user/roulette/WEBGAMES_13_GAME_WAVE_2026-03-22.md) as the rollout note for this metadata/docs pass.

### 2026-03-22 - Connect Four, Solitaire Mini, and Word Swipe released as Games titles 11-13

- Shipped the Korean and English product pages, runtimes, and QA fixtures for `connect-four`, `solitaire-mini`, and `word-swipe`, and kept the Games hubs aligned with the now-live 13-title lineup.
- Ran strict QA on all six new locale routes, regenerated sitemaps, and passed both `validate-seo.js` and `adsense-readiness-check.js` before deploy.
- Updated the Games-specific trust-link validation so release checks match the actual Games site-link structure instead of the older tool-footer-id contract; rollout details live in [WEBGAMES_13_GAME_WAVE_2026-03-22.md](/home/user/roulette/WEBGAMES_13_GAME_WAVE_2026-03-22.md).

### 2026-03-22 - Gameplay quality pass documented for the current live wave

- Captured the current quality wave in [WEBGAMES_GAMEPLAY_QUALITY_PASS_2026-03-22.md](/home/user/roulette/WEBGAMES_GAMEPLAY_QUALITY_PASS_2026-03-22.md), covering Memory Match daily/first-play polish, Bubble Pop interaction and chain feedback, Color Lines KO cleanup with daily/replay tuning, Word Swipe puzzle depth and clarity, and the shared QA perf/visual probes now used by the release lane.
- Kept the note release-oriented so future workers can trace what shipped without needing to rediscover the per-game feel improvements or the shared webgame QA expectations.

### 2026-03-22 - Games hub simplified into a launcher and weak replay entry points promoted

- Simplified `games/index.html` and `en/games/index.html` into launcher-style hubs with only `Home` and `Games` in the top nav, a compact heading, and the live game card grid instead of the older hero, lineup, and note-heavy layout.
- Promoted replay/restart entry points for the weaker-feeling game pages by wiring quick actions into the top hero actions for `Bubble Pop`, `Memory Match`, and `Reaction Tap`, so mobile users can immediately restart without scrolling back to in-panel toolbars.
- Added [GAMES_HUB_LAUNCHER_REPLAY_PASS_2026-03-22.md](/home/user/roulette/GAMES_HUB_LAUNCHER_REPLAY_PASS_2026-03-22.md) as the short rollout note for the launcher simplification and replay-entry polish pass.

### 2026-03-22 - Games quality recovery pass focused on Solitaire Mini and launcher clarity

- Reworked the Korean and English Games hubs into cleaner launcher-style dashboards with empty left/right rail shells so future banner placements have structure without turning the hub into a separate ad-heavy microsite.
- Rebuilt the Korean Solitaire Mini surface so the copy, CTA order, and button labels are readable again, and repaired the runtime enough for strict KO/EN webgame QA to pass instead of shipping a broken-looking card page.
- Kept only the ship-safe gameplay polish from this wave: faster Snake restart flow, Brick Breaker last-life aim/paddle help, Bubble Pop recommendation feedback, and Reaction Tap score bonus tuning; rollout details live in [WEBGAMES_QUALITY_RECOVERY_PASS_2026-03-22.md](/home/user/roulette/WEBGAMES_QUALITY_RECOVERY_PASS_2026-03-22.md).
