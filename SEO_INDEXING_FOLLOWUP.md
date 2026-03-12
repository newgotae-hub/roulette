# SEO Indexing Follow-up

Date: 2026-03-12

## Search Console snapshot reviewed in this turn

- Alternate page with proper canonical tag: 68
- Page with redirect: 23
- Excluded by `noindex`: 2
- Not found (404): 1
- Discovered, currently not indexed: 15
- Crawled, currently not indexed: 2

## What was actually broken

1. Tool-page language sync code was appending `?lang=` to non-tool links.
   - This affected links to `/about/`, `/contact/`, `/privacy/`, and `/terms/`.
   - Result: Google kept discovering duplicate URLs such as `/terms/?lang=nl` and `/en/contact/?lang=ru`.
   - These URLs were not the canonical targets, so Search Console reported them as "Alternate page with proper canonical tag".

2. Tool-page query normalization trusted any `lang` value.
   - The old client-side canonical patch used the raw query value without validating it.
   - Result: malformed URLs such as `/roulette/?lang=enWheel` could be rewritten to invalid paths instead of being cleaned safely.
   - That behavior can produce 404 or `noindex` outcomes after the bad redirect chain.

3. Legal/about pages did not self-normalize old `?lang=` URLs.
   - Even after internal links are fixed, Google can keep retrying already-discovered query URLs for some time.
   - Without a cleanup patch on those pages, they remain crawlable duplicates until recrawl settles.

## What was already mostly fixed before this turn

The redirect-class exclusions shown in Search Console are mostly historical from older deployed paths.

- Redirect rules for `/roulette`, `/<locale>/roulette`, `/lotto`, and locale alias paths were already present in production config.
- Legacy redirect HTML pages were already removed from the repository.
- Current local validation shows no deployed redirect HTML, no stray `noindex` pages except `404.html`, and no sitemap omissions for indexable pages.

In other words:

- "Page with redirect" is currently a cleanup/recrawl issue more than a fresh code bug.
- The live code bug that was still generating new bad URLs was the `?lang=` duplication behavior.

## Changes made in this turn

### Stopped generating duplicate `?lang=` links

- Updated [assets/js/lotto.js](/home/user/roulette/assets/js/lotto.js) so `syncLangLinks()` no longer appends `?lang=` to non-tool internal links.
- Updated [assets/js/ladder.js](/home/user/roulette/assets/js/ladder.js) the same way.
- Updated [scripts/sync-roulette-entrypoints.js](/home/user/roulette/scripts/sync-roulette-entrypoints.js) so homepage/root entrypoints generate the same safe behavior.
- Updated [scripts/seo-hosting-patch.js](/home/user/roulette/scripts/seo-hosting-patch.js) so coinflip/dice and other tool HTML are patched with the same safe link handling.

### Hardened query normalization

- Tool-page canonical patch now validates `lang` against the supported locale set before rewriting paths.
- Invalid values now have the `lang` query removed instead of redirecting to broken paths.
- This directly addresses malformed cases like `/roulette/?lang=enWheel`.

### Added cleanup on legal/about pages

- Updated [scripts/generate-legal-pages.js](/home/user/roulette/scripts/generate-legal-pages.js) so legal pages now include a `data-rlt-legal-canonical-patch` script.
- That patch:
  - strips stale `?lang=` parameters
  - redirects supported localized legal targets to the correct locale path
  - sends unsupported legal locales to `/en/.../`, which matches current footer-link policy
- Updated [about/index.html](/home/user/roulette/about/index.html) with a `data-rlt-about-canonical-patch` script that strips stale `?lang=` from `/about/`.

### Added recurrence checks

- Updated [scripts/validate-seo.js](/home/user/roulette/scripts/validate-seo.js) to fail if:
  - any page or source file still has the unsafe `syncLangLinks()` behavior
  - tool/root pages are missing the safe query-normalization patch
  - legal/about pages are missing their cleanup patch

## Generated files refreshed

Commands run:

```bash
node scripts/generate-legal-pages.js
node scripts/sync-roulette-entrypoints.js
node scripts/seo-hosting-patch.js
node scripts/validate-seo.js
```

Observed results:

- `generated localized legal pages for: ko, en, ja, zh-cn, zh-tw`
- `synced roulette entrypoints: updated=18 removed=0`
- `seo hosting patch updated files: 72`
- `SEO validation passed for 111 HTML files.`

## Repository-state validation after the fix

- Canonical mismatch pages: 0
- Meta refresh redirect pages: 0
- `noindex` pages: 1
  - only `/404.html`
- Indexable pages missing from sitemap: 0
- Internal links pointing to redirected legacy URLs: 0
- Unsafe `syncLangLinks()` source/output patterns: 0

## Interpretation for Search Console

What should improve after deploy and recrawl:

- Alternate page with proper canonical tag:
  - should drop, because the site stops minting new `?lang=` duplicates
  - already-known duplicates should gradually disappear after recrawl

- Excluded by `noindex`:
  - malformed query cases should stop being created by the site
  - `404.html` should remain `noindex`, which is correct

- Page with redirect:
  - these should decline more slowly because they are mostly historical discoveries
  - they are not expected to disappear instantly right after deploy

- Discovered/Crawled currently not indexed:
  - these are not automatically proof of a technical bug
  - after duplicate noise is removed, these counts may improve, but Google can still choose not to index some pages

## Next actions

1. Deploy the current repository state.
   - Use `scripts/deploy-main.sh`

2. After deployment, spot-check live examples that previously appeared in Search Console.
   - `/terms/?lang=nl`
   - `/en/contact/?lang=ru`
   - `/about/?lang=de`
   - `/roulette/?lang=enWheel`

3. In Google Search Console, re-run validation for:
   - Alternate page with proper canonical tag
   - Page with redirect
   - Excluded by `noindex`

4. Give Google time to recrawl.
   - The repository is fixed locally.
   - Search Console counts will lag behind the deploy because they reflect crawl history, not just current code.
