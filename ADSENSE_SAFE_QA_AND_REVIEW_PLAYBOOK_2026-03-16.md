# AdSense Safe QA And Review Playbook - 2026-03-16

## Scope

This pass stayed inside the current AdSense-review safety boundary:

- no URL, canonical, hreflang, or sitemap changes
- no ad layout or script changes
- no new external scripts
- no dice / coin 3D runtime changes
- no large-scale translation rewrite

The goal was limited to safe QA, small text/trust cleanup, and a ready-to-use response playbook for either approval or rejection.

## Small fixes applied

### 1. Localized language-menu fallback on main tool pages

The 90 main tool pages (`/`, `luckydraw`, `ladder`, `coinflip`, `dice` across supported locales) were resynced so the static HTML fallback no longer leaves English-only language UI on non-English pages.

Fixed fields:

- visible language button label
- language-search placeholder
- language-toggle `aria-label`
- current-language flag `src` and `alt`
- bottom `Related tools` heading and labels

Source of truth used:

- `assets/js/i18n.js` for shared nav labels
- `scripts/coin-dice-copy-data.js` for localized related-tools headings
- `scripts/sync-main-tool-locale-fallbacks.js` for safe HTML resync

### 2. Runtime language-menu labels aligned in shared JS

`assets/js/lotto.js` and `assets/js/ladder.js` now localize the language-toggle `aria-label` in addition to the button label and search placeholder. This prevents static HTML and hydrated runtime state from drifting apart on those pages.

### 3. AdSense readiness guard widened

`scripts/adsense-readiness-check.js` now fails deployment if non-English main tool pages reintroduce:

- `LANGUAGE`
- `Search language`
- `Change language`
- English `Related tools`

## QA performed

Priority review scope:

- locales: `ko`, `en`, `ja`, `zh-cn`, `zh-tw`, `es`, `fr`, `de`, `pt-br`, `ar`, `ru`, `tr`, `nl`
- pages: home, coinflip, dice, luckydraw, ladder, team-generator, guides hub, about, contact, privacy, terms

Validation run:

- `node scripts/sync-main-tool-locale-fallbacks.js`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`

Additional spot checks:

- representative page-source review for `ja`, `zh-cn`, `tr`
- non-English fallback scan on priority main tool pages
- internal priority-page link scan across 132 page files

Known limitation:

- no browser automation or live console capture was available in this environment, so layout and console checks were limited to source-level QA and static link verification

## Intentionally not changed during review

These were left untouched because changing them during review would add unnecessary risk:

- URL structure
- canonical / hreflang / sitemap
- ad placement and ad density
- external third-party scripts
- dice / coin pinned `model-viewer`
- large copy rewrites on secondary locales
- broader sitewide wording normalization that was not clearly broken

## Approval response checklist

If AdSense approves:

1. Record approval date and account state in `FIX_LOG.md`.
2. Verify that ad code appears only where expected and does not break layout on home, dice, coinflip, ladder, and luckydraw.
3. Decide whether EEA/UK/Switzerland traffic requires a Google-certified CMP before personalized ads expand.
4. Keep copy/UI stable for several days and avoid unrelated churn immediately after approval.

## Rejection response checklist

If AdSense rejects:

1. Save the exact rejection reason text verbatim in a dated repo note.
2. Check whether the reason maps to:
   - low-value content
   - navigation / trust ambiguity
   - policy content mismatch
   - technical crawl/index issue
3. Fix only the smallest set of issues tied to the stated reason.
4. Re-run:
   - `node scripts/validate-seo.js`
   - `node scripts/adsense-readiness-check.js`
   - `git diff --check`
5. Add the remediation summary to `FIX_LOG.md` before the next resubmission.

## Post-review backlog

These are reasonable after the AdSense decision, not during the current review:

1. Browser-level mobile QA for the priority locale/page set when a headless or visual environment is available.
2. Review secondary-locale long-form help copy for softer tone and fewer direct translations where confidence is high.
3. Audit localized boot-time metadata maps for consistency across locale-specific entry pages.
4. Expand non-KR/EN guide depth only after approval, starting with `ja`, `zh-cn`, and `es`.
5. Add a small automated scan for empty FAQ or guide sections if content generation expands again.
