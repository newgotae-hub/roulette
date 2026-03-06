#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"

is_live_socket() {
  local socket_path="${1:-}"

  [[ -n "${socket_path}" && -S "${socket_path}" ]] || return 1

  node - "${socket_path}" <<'EOF' >/dev/null 2>&1
const net = require('net');

const socketPath = process.argv[2];
const client = net.createConnection(socketPath);

const finish = (code) => {
  clearTimeout(timer);
  client.removeAllListeners();
  if (!client.destroyed) {
    client.destroy();
  }
  process.exit(code);
};

const timer = setTimeout(() => finish(1), 250);

client.once('connect', () => finish(0));
client.once('error', () => finish(1));
EOF
}

pick_live_socket() {
  local candidate

  if is_live_socket "${VSCODE_GIT_IPC_HANDLE:-}"; then
    printf '%s\n' "${VSCODE_GIT_IPC_HANDLE}"
    return 0
  fi

  while IFS= read -r candidate; do
    [[ -n "${candidate}" ]] || continue
    if is_live_socket "${candidate}"; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done < <(find /tmp -maxdepth 1 -type s -name 'vscode-git-*.sock' -printf '%T@ %p\n' 2>/dev/null | sort -rn | awk '{print $2}')

  return 1
}

main() {
  local live_socket

  if (($# == 0)); then
    echo "Usage: $0 <git args...>" >&2
    exit 64
  fi

  if ! command -v node >/dev/null 2>&1; then
    echo "node is required to refresh the VS Code git auth socket." >&2
    exit 1
  fi

  if live_socket="$(pick_live_socket)"; then
    export VSCODE_GIT_IPC_HANDLE="${live_socket}"
  else
    echo "No live VS Code git auth socket found. Retry from an attached Firebase Studio terminal." >&2
  fi

  exec git -C "${repo_root}" "$@"
}

main "$@"
