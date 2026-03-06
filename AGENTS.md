# AGENTS.md

## Deployment
- For deployment pushes in this repo, use `scripts/deploy-main.sh` instead of raw `git push origin main`.
- For other authenticated git commands, use `scripts/git-with-live-vscode-auth.sh <git args...>`.
- Reason: Firebase Studio / VS Code terminals can keep a stale `VSCODE_GIT_IPC_HANDLE`, which breaks HTTPS push auth even though the editor is still connected.
