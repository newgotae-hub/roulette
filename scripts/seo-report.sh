#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "== SEO Report =="
echo "sitemap-main urls:" $(grep -c "<loc>" sitemap-main.xml || true)
echo "sitemap-locales urls:" $(grep -c "<loc>" sitemap-locales.xml || true)
echo "locale pages:" $(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" | wc -l)
echo "missing canonical tags:" $(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" -print0 | xargs -0 rg --files-without-match "rel=\"canonical\"" | wc -l)
echo "missing og:image tags:" $(find en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl -type f -name "index.html" -print0 | xargs -0 rg --files-without-match "property=\"og:image\"" | wc -l)
