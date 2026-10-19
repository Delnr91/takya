#!/usr/bin/env bash
# Genera scripts/orch/frozen.sha256 con el hash de cada archivo congelado (sólo el orquestador).
set -euo pipefail
cd "$(dirname "$0")/../.."
while read -r p; do [ -n "$p" ] && find "$p" -type f -print0; done < scripts/orch/frozen-paths.txt \
  | LC_ALL=C sort -z | xargs -0 sha256sum > scripts/orch/frozen.sha256
wc -l scripts/orch/frozen.sha256
