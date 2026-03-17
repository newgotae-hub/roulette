# Team Generator Score Entry Tracking (2026-03)

## Scope

This document consolidates the `team-generator` score-entry, winner-calculation, locale, QA, and results-panel cleanup work shipped on `main` during 2026-03-16 to 2026-03-17.

Use this file as the single traceability reference when you need to answer any of the following:

- When did a specific score-entry behavior change?
- Which commit introduced or reverted a layout decision?
- Which files must be updated together for future work?
- Which QA artifacts prove the current localized behavior?

## Current Production Behavior

As of the latest 2026-03-17 cleanup patch in this document:

- `team-generator` creates random teams from names only, or more balanced teams when names and roster scores are provided.
- The result toolbar exposes `점수입력` / localized score-entry actions next to reroll actions.
- Score entry is inline inside each member row, not in a separate panel.
- Match winner logic uses the average of individually entered player scores per team.
- Team total is shown as a supporting metric.
- Team cards stay in a stable two-column member layout before and after score-entry mode.
- The empty state now explains the flow in two steps: generate teams first, then enter post-match scores.
- The results header no longer shows a separate `resultsIntro` guidance line; the score-entry explanation lives only in the empty state and runtime result meta copy.
- The inline member-row score slot uses a fixed-width, centered pill for both read-only score badges and editable score inputs so the right edge stays visually aligned.

## Related Commits

| Date | Commit | Summary | Tracking note |
| --- | --- | --- | --- |
| 2026-03-16 | `7087d1e` | `feat(team-generator): add team score entry winner calc` | Initial team result scoreboard and winner calculation from score-entry mode. |
| 2026-03-16 | `cc1a8fb` | `fix(team-generator): use player score averages` | Switched from one score per team to per-player inputs and team-average winner logic. |
| 2026-03-16 | `605e0b3` | `fix(team-generator): move score editor below cards` | Temporary version that moved score inputs below the result cards. |
| 2026-03-16 | `ab9e6a8` | `fix(team-generator): refresh score editor cache` | Cache refresh/supporting deploy step for the lower-panel score editor release. |
| 2026-03-16 | `462f28c` | `fix(team-generator): restore inline score entry` | Returned score entry from the lower panel back into the member rows. |
| 2026-03-16 | `8f66462` | `fix(team-generator): compact inline score layout` | Reduced vertical space by compacting inline score-entry rows. |
| 2026-03-16 | `ff2e7e2` | `fix(team-generator): keep member grid stable` | Locked the team member list to two columns even before score-entry mode. |
| 2026-03-16 | `fda9b7b` | `fix(team-generator): keep score entry fully inline` | Removed the extra score-entry header panel above the cards. |
| 2026-03-16 | `2d04c35` | `fix(team-generator): lock score entry card height` | Prevented card growth when toggling score-entry mode. |
| 2026-03-16 | `432a57f` | `fix(team-generator): localize score entry copy` | Filled score-entry runtime translations for all supported locales. |
| 2026-03-16 | `ce38c36` | `Polish team generator score entry and locale QA` | Stabilized the implementation and added deterministic local QA. |
| 2026-03-16 | `8b0d399` | `Update team generator copy across locales` | Updated hero/runtime copy across locales to explain score-entry and winner flow. |
| 2026-03-17 | `99bd65c` | `Improve team generator results panel guidance` | Added always-visible results guidance and two-step empty-state flow in all locales. |
| 2026-03-17 | `(latest cleanup patch)` | Remove repeated results guidance and refine score slot alignment | Deleted `resultsIntro` markup across locales, kept only the empty-state flow, and tightened the inline score-slot sizing/alignment plus QA coverage. |

## Files To Track Together

If this feature changes again, these files should be treated as a single unit:

- UI runtime: `assets/js/team-generator.js`
- Locale data and runtime text binding: `assets/js/team-generator-i18n.js`
- Korean/base page template: `team-generator/index.html`
- Localized pages:
  - `en/team-generator/index.html`
  - `ja/team-generator/index.html`
  - `zh-cn/team-generator/index.html`
  - `zh-tw/team-generator/index.html`
  - `es/team-generator/index.html`
  - `fr/team-generator/index.html`
  - `de/team-generator/index.html`
  - `pt-br/team-generator/index.html`
  - `hi/team-generator/index.html`
  - `ar/team-generator/index.html`
  - `ru/team-generator/index.html`
  - `id/team-generator/index.html`
  - `tr/team-generator/index.html`
  - `it/team-generator/index.html`
  - `vi/team-generator/index.html`
  - `th/team-generator/index.html`
  - `nl/team-generator/index.html`
- Locale sync utility: `scripts/sync-team-generator-locales.js`
- Local QA harness: `assets/qa/team-generator-local-harness.html`
- Local QA stylesheet: `assets/css/team-generator-qa.css`
- Locale QA runner: `scripts/qa-team-generator-locales.js`
- Log index: `FIX_LOG.md`

## Latest QA Evidence

The latest deterministic locale QA artifacts are here:

- `test-results/team-generator-local-qa-dom/summary.txt`
- `test-results/team-generator-local-qa-dom/manifest.json`

The latest known pass state for this work:

- 18 locale DOM audit: PASS
- `results-intro` nodes across localized HTML + QA harness: PASS (removed)
- `node --check assets/js/team-generator.js`: PASS
- `node --check assets/js/team-generator-i18n.js`: PASS
- `node --check assets/css/team-generator-qa.css`: not applicable
- `node --check scripts/sync-team-generator-locales.js`: PASS
- `node --check scripts/qa-team-generator-locales.js`: PASS
- `node scripts/adsense-readiness-check.js`: PASS
- `node scripts/validate-seo.js`: PASS

## Operational Rules For Future Changes

When modifying this feature later:

1. Update locale text in `assets/js/team-generator-i18n.js` first.
2. If the results header or empty state changes, update both:
   - `team-generator/index.html`
   - `assets/qa/team-generator-local-harness.html`
3. If localized HTML structure must change, run `node scripts/sync-team-generator-locales.js`.
4. If dynamic score-entry behavior changes, review `scripts/qa-team-generator-locales.js` so the QA runner still verifies the intended state.
5. If the score slot spacing or alignment changes, review both `assets/js/team-generator.js` and `assets/css/team-generator-qa.css` together so local QA still reflects the shipped layout.
6. Re-run:
   - `node scripts/qa-team-generator-locales.js`
   - `node scripts/adsense-readiness-check.js`
   - `node scripts/validate-seo.js`
7. Add a new dated entry to `FIX_LOG.md`.
8. Deploy with `scripts/deploy-main.sh`.

## Notes

- The repository can contain unrelated untracked QA scratch paths such as `test-results/.last-run.json` and `test-results/team-generator-local-qa/`. They were not required for the shipped score-entry behavior.
- The always-visible `resultsIntro` guidance that briefly shipped in `99bd65c` was intentionally removed in the latest cleanup patch because it duplicated the empty-state flow and could appear multiple times if locale sync drifted.
- This document is intended as the history index for the score-entry feature line. New follow-up fixes should add both a fresh `FIX_LOG.md` entry and, if the change is substantial, a short append/update here.
