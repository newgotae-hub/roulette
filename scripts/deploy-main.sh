#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "${script_dir}/validate-seo.js"

exec "${script_dir}/git-with-live-vscode-auth.sh" push origin main "$@"
