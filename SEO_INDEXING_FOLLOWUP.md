# SEO Indexing Follow-up

Date: 2026-03-09

## Current state

- Repository changes are implemented and staged with `git add -A`.
- Local validation is passing.
- Commit and deployment have not been executed yet in this turn.

## Search Console issue snapshot from this session

- Alternate page with proper canonical tag: 47
- Page with redirect: 17
- Not found (404): 1
- Discovered, currently not indexed: 31
- Crawled, currently not indexed: 11
- Excluded by `noindex`: 2

## Root causes found

1. Firebase Hosting was the real deployment target, but many redirect rules only existed in `_redirects`.
2. `_redirects` was not the effective production redirect source here; `firebase.json` was.
3. The site was deploying non-canonical HTML pages directly:
   - `roulette/index.html`
   - `*/roulette/index.html`
   - `lotto/index.html`
   - alias locale pages like `ja-jp/coinflip/index.html`, `zh-hk/dice/index.html`
4. Many internal links still pointed to `/roulette/` and `/<locale>/roulette/`, so Google could keep rediscovering non-canonical URLs.
5. There were no indexable pages missing from the sitemap. The problem was not sitemap omission of valid pages, but extra non-canonical pages being deployed and linked.

## What was changed

### Redirects

- Added production redirects to [firebase.json](/home/user/roulette/firebase.json) for:
  - `/roulette` -> `/`
  - `/<locale>/roulette` -> `/<locale>/`
  - `/lotto` -> `/luckydraw/`
  - alias locale `coinflip` and `dice` paths -> canonical locale paths

### Removed deployed non-canonical HTML

- Deleted legacy redirect or duplicate entry pages:
  - `roulette/index.html`
  - `*/roulette/index.html`
  - `lotto/index.html`
  - alias locale `coinflip` and `dice` HTML pages

### Internal linking cleanup

- Replaced internal links from `/roulette/` to `/`
- Replaced internal links from `/<locale>/roulette/` to `/<locale>/`

### Recurrence prevention

- Reworked [scripts/sync-roulette-entrypoints.js](/home/user/roulette/scripts/sync-roulette-entrypoints.js) so it no longer preserves legacy roulette entry files and instead removes them if present.
- Added [scripts/validate-seo.js](/home/user/roulette/scripts/validate-seo.js)
- Updated [scripts/deploy-main.sh](/home/user/roulette/scripts/deploy-main.sh) to run SEO validation before pushing

## Validation results

Commands run:

```bash
node scripts/validate-seo.js
```

Result:

- SEO validation passed for 111 HTML files.
- Canonical mismatch pages: 0
- Meta refresh pages: 0
- `noindex` pages: 1
  - only `404.html`
- Indexable pages missing from sitemap: 0
- Internal links to `/roulette/`, `/<locale>/roulette/`, `/lotto/`, or alias locale redirect paths: 0

## Important interpretation

- "Pages not requested for indexing" check:
  - No valid indexable page was found outside the sitemap.
  - Before the fix, the pages outside the sitemap were all non-canonical or redirect/noindex pages.

## Next actions for the next turn

1. Commit the staged changes.
2. Deploy with:

```bash
scripts/deploy-main.sh
```

3. After deployment, verify a few live URLs:

```text
/roulette              -> 301 -> /
/en/roulette           -> 301 -> /en/
/lotto                 -> 301 -> /luckydraw/
/ja-jp/coinflip        -> 301 -> /ja/coinflip/
/zh-hk/dice            -> 301 -> /zh-tw/dice/
```

4. In Google Search Console, re-run validation for:
   - Alternate page with proper canonical tag
   - Page with redirect
   - Excluded by `noindex`
   - Discovered, currently not indexed
   - Crawled, currently not indexed

## Useful commands for follow-up

```bash
node scripts/validate-seo.js
git status --short
git diff --stat
```
