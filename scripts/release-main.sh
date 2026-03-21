#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"

usage() {
  cat <<'EOF'
Usage:
  scripts/release-main.sh -m "Commit message" [--dry-run] [--] [pathspec...]

Behavior:
  - runs generate-sitemaps.js
  - runs adsense-readiness-check.js
  - runs validate-seo.js
  - runs git diff --check
  - stages intended changes (all changes by default, or provided pathspecs)
  - commits with the supplied message
  - calls scripts/deploy-main.sh

Guardrails:
  - refuses to run without a commit message
  - refuses to run on an empty worktree
  - ignores transient artifacts such as test-results and .playwright-cli
EOF
}

die() {
  echo "release-main: $*" >&2
  exit 1
}

message=""
dry_run="0"
declare -a pathspecs=()

while (($#)); do
  case "$1" in
    -m|--message)
      shift || die "missing value for --message"
      message="${1:-}"
      ;;
    --dry-run)
      dry_run="1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      while (($#)); do
        pathspecs+=("$1")
        shift
      done
      break
      ;;
    *)
      pathspecs+=("$1")
      ;;
  esac
  shift || true
done

[[ -n "${message// }" ]] || die "commit message is required. Use -m \"...\"."

cd "${repo_root}"

worktree_status="$(git status --porcelain)"
[[ -n "${worktree_status}" ]] || die "worktree is clean; nothing to release."

ignored_hits="$(git status --ignored --porcelain -- test-results .playwright-cli 2>/dev/null || true)"
if [[ -n "${ignored_hits}" ]]; then
  echo "release-main: ignoring transient artifacts under test-results/.playwright-cli" >&2
fi

echo "== Release preflight =="
node "${script_dir}/generate-sitemaps.js"
node "${script_dir}/adsense-readiness-check.js"
node "${script_dir}/validate-seo.js"
git diff --check

echo "== Staging =="
if ((${#pathspecs[@]})); then
  git add -- "${pathspecs[@]}"
else
  git add -A .
fi

git reset --quiet -- .playwright-cli test-results 2>/dev/null || true

staged_status="$(git diff --cached --name-only)"
[[ -n "${staged_status}" ]] || die "nothing staged after filtering; aborting."

echo "Staged files:"
printf '%s\n' "${staged_status}"

if [[ "${dry_run}" == "1" ]]; then
  echo "release-main: dry run complete; skipping commit and deploy."
  exit 0
fi

echo "== Commit =="
git commit -m "${message}"

echo "== Deploy =="
exec "${script_dir}/deploy-main.sh"
