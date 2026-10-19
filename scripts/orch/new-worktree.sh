#!/usr/bin/env bash
# Uso: scripts/orch/new-worktree.sh <agente> <rama> [base=contracts-v1]
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
wt="$(dirname "$root")/takya-wt"
agent="$1"; branch="$2"; base="${3:-contracts-v1}"
mkdir -p "$wt"
git -C "$root" worktree add "$wt/$agent" -b "$branch" "$base"
echo "worktree: $wt/$agent  rama: $branch"
