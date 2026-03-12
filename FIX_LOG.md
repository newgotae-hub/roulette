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
