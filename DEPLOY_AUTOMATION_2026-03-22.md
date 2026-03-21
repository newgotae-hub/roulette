# Deploy Automation 2026-03-22

This note documents the repo's current one-shot release path and the rules around it.

## What is already automated

- `scripts/release-main.sh` stages, commits, validates, and then hands off to the deploy push path.
- `scripts/release-main.ps1` is a PowerShell wrapper that calls the Bash release script through Git Bash.
- `scripts/release-main.sh` runs the release preflight checks before anything is committed:
  - `scripts/generate-sitemaps.js`
  - `scripts/adsense-readiness-check.js`
  - `scripts/validate-seo.js`
  - `git diff --check`
- The release script stages intended changes, ignores transient artifacts such as `test-results/` and `.playwright-cli/`, commits with the supplied message, and then calls `scripts/deploy-main.sh`.
- `scripts/deploy-main.sh` remains the underlying deployment push path. It performs the final validation pass and then pushes with `scripts/git-with-live-vscode-auth.sh`.
- GitHub Pages deployment is still automated from `push` to `main` via `.github/workflows/deploy-pages.yml`.
- The SEO audit workflow is still automated from `push` to `main` via `.github/workflows/seo-audit.yml`.

## Safe one-shot release usage

Use the release wrapper when you want to stage, commit, and deploy in one pass.

### Bash

```bash
scripts/release-main.sh -m "Your commit message"
```

### PowerShell

```powershell
scripts/release-main.ps1 -Message "Your commit message"
```

### Dry run

Use dry run first when you want to preview what will be staged and validated:

```bash
scripts/release-main.sh -m "Your commit message" --dry-run
```

```powershell
scripts/release-main.ps1 -Message "Your commit message" -DryRun
```

### Pathspecs

Both wrappers accept optional pathspecs after `--` if you want to release only part of the worktree.

```bash
scripts/release-main.sh -m "Your commit message" -- games/index.html en/games/index.html
```

```powershell
scripts/release-main.ps1 -Message "Your commit message" -- games/index.html en/games/index.html
```

### Guardrails

- Do not use the release wrapper on a clean worktree; it refuses to run when there is nothing to release.
- Do not use it if staged changes already exist in the index; commit, stash, or clear them first.
- Do not rely on it to clean up tracked files that are outside your intended release scope.
- Keep transient QA artifacts out of release commits; the wrapper already filters `test-results/` and `.playwright-cli/`.

## Repo rules

- For deployment pushes in this repo, `scripts/deploy-main.sh` is still the required push path.
- For other authenticated git commands, use `scripts/git-with-live-vscode-auth.sh <git args...>`.
- The repo still expects fixes to be documented in `FIX_LOG.md`.
- If a release change needs more explanation than the fix log can hold, add a dedicated dated note and link it from `FIX_LOG.md`.

## Recommended workflow

1. Make the intended file changes.
2. Run the release wrapper with a commit message.
3. Let the wrapper run validation, stage the intended files, commit, and call `scripts/deploy-main.sh`.
4. Let GitHub Pages and the SEO audit workflows finish on the resulting `main` push.

## Why the split matters

- `scripts/release-main.sh` is the ergonomic release command for humans and subagents.
- `scripts/deploy-main.sh` remains the canonical authenticated push path and is still useful on its own when the commit already exists.
- Keeping the split avoids duplicating auth logic and keeps the final push behavior centralized in one place.
