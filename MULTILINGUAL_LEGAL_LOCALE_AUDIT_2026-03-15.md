# 2026-03-15 Multilingual Legal Coverage and Locale Wording Audit

## Goal

This pass addressed the second-priority multilingual AdSense approval risk and a follow-up locale quality review:

- expand localized legal/trust pages beyond the original small subset of locales
- remove visibly awkward or overly literal footer/legal wording in non-Korean locales
- keep generated locale pages, shared i18n bundles, and validators aligned so future deploys do not drift

## What Changed

### 1. Localized legal pages now exist for all supported locales

The legal-page generator was expanded from the original limited locale set to all supported locales:

- `about`
- `contact`
- `privacy`
- `terms`

Affected generator/data files:

- `scripts/legal-shared.js`
- `scripts/legal-translations.js`
- `scripts/generate-legal-pages.js`
- `scripts/generate-sitemaps.js`

This also updated `sitemap-locales.xml` so the full localized legal set is discoverable.

### 2. Footer/legal text is now centralized and synced

Shared locale footer labels now come from `scripts/legal-shared.js` and are pushed into:

- generated legal pages
- static footer links in tool pages via `scripts/sync-legal-links.js`
- inline tool locale bundles via `scripts/sync-tool-inline-i18n.js`
- team-generator bundle via `scripts/sync-team-generator-footer-i18n.js`
- team-generator locale pages via `scripts/sync-team-generator-locales.js`

This removed prior drift where static HTML, inline JS locale maps, and generated legal pages were using different wording.

### 3. Locale wording was normalized toward idiomatic usage

The most visible awkward or shortened legal/footer terms were corrected, including:

- Spanish: `Términos` -> `Términos del servicio`
- Turkish: `Hakkında` -> `Hakkımızda`
- Turkish: `Kullanım koşulları` -> `Kullanım Koşulları`
- Turkish: `Gizlilik politikası` -> `Gizlilik Politikası`
- Dutch: `Over` -> `Over ons`
- Dutch nav: `Teams Delen` -> `Teams verdelen`

In addition, the localized `about` copy for extra locales was revised to reduce forced English phrasing in the tool list where a natural local generic term was clearer, especially for:

- team split
- coin flip
- dice roll

Locales explicitly revised in `ABOUT_I18N`:

- `es`
- `fr`
- `de`
- `pt-br`
- `hi`
- `ar`
- `ru`
- `id`
- `tr`
- `it`
- `vi`
- `th`
- `nl`

The intent was not to rename product routes, but to make the visible descriptive copy read more naturally for local users.

### 4. Validation rules were widened for real localized consent wording

`scripts/validate-seo.js` now accepts the actual localized consent-region strings used in generated legal pages, including:

- `EEA`
- `EWR`
- `EEE`
- `EER`
- `SEE`
- `ЕЭЗ`
- `المنطقة الاقتصادية الأوروبية`
- localized UK variants such as `VK`
- localized Switzerland variants such as `スイス` and `İsviçre`

This prevents false negatives when the page is correct but the validator only understands English-region tokens.

### 5. Dice validator blocker fixed during this pass

While closing the multilingual validator loop, the dice-page validator exposed a missing shared 3D asset constant. The following constant was restored to every dice locale page:

```js
const DICE_GLB_URL = '/dice.glb';
```

This was a validation blocker rather than a translation issue, but it had to be fixed to complete the full revalidation pass.

## Audit Notes

The locale wording review focused on strings that are:

- directly visible in navigation or footers
- used in legal/trust surfaces
- likely to affect user trust or AdSense review impressions

The review intentionally prioritized obvious low-quality signals over aggressive rewriting of all product terminology. Some tool names such as `Lucky Draw` and `Ladder Draw` remain as product-style names in localized descriptive copy where that is clearer than inventing a forced local equivalent.

## Validation Run

Executed successfully:

- `node scripts/generate-legal-pages.js`
- `node scripts/sync-legal-links.js`
- `node scripts/sync-team-generator-footer-i18n.js`
- `node scripts/sync-team-generator-locales.js`
- `node scripts/sync-tool-inline-i18n.js`
- `node scripts/generate-sitemaps.js`
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`

Final result:

- `SEO validation passed for 189 HTML files.`
- `AdSense readiness check passed.`

## Follow-up Guidance

If multilingual approval risk is reviewed again later, the next pass should inspect:

1. whether more localized long-form guides are needed beyond Korean and English
2. whether localized about/legal copy should use more market-native product naming for `Lucky Draw` and `Ladder Draw`
3. whether shared locale bundles outside the legal/footer surface need a second idiomatic copy pass
