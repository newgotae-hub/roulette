#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
STRICT="0"
if [[ "${1:-}" == "--strict" ]]; then
  STRICT="1"
fi
echo "== SEO Report =="
MAIN_COUNT=$(grep -c "<loc>" sitemap-main.xml || true)
LOCALE_COUNT=$(grep -c "<loc>" sitemap-locales.xml || true)
PAGE_COUNT=$(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" | wc -l)
MISS_CANON_LIST=$(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" -print0 | xargs -0 rg --files-without-match "rel=\"canonical\"" || true)
MISS_OG_IMAGE_LIST=$(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" -print0 | xargs -0 rg --files-without-match "property=\"og:image\"" || true)
MISS_CANON=$(printf "%s\n" "$MISS_CANON_LIST" | sed '/^$/d' | wc -l)
MISS_OG_IMAGE=$(printf "%s\n" "$MISS_OG_IMAGE_LIST" | sed '/^$/d' | wc -l)
echo "sitemap-main urls: $MAIN_COUNT"
echo "sitemap-locales urls: $LOCALE_COUNT"
echo "locale pages: $PAGE_COUNT"
echo "missing canonical tags: $MISS_CANON"
echo "missing og:image tags: $MISS_OG_IMAGE"
if [[ "$STRICT" == "1" ]]; then
  if [[ "$MISS_CANON" -ne 0 || "$MISS_OG_IMAGE" -ne 0 ]]; then
    echo "STRICT FAIL: SEO required tags missing"
    exit 1
  fi
fi
