#!/usr/bin/env bash
# Puerta de merge: falla si un archivo congelado cambió, desapareció o apareció uno nuevo.
set -uo pipefail
cd "$(dirname "$0")/../.."
fail=0
sha256sum --quiet -c scripts/orch/frozen.sha256 || fail=1
current=$(while read -r p; do [ -n "$p" ] && find "$p" -type f; done < scripts/orch/frozen-paths.txt | LC_ALL=C sort)
expected=$(sed 's/^[0-9a-f]\{64\}  //' scripts/orch/frozen.sha256 | LC_ALL=C sort)
extra=$(LC_ALL=C comm -13 <(printf '%s\n' "$expected") <(printf '%s\n' "$current"))
if [ -n "$extra" ]; then echo "Archivos nuevos en rutas congeladas:"; echo "$extra"; fail=1; fi
[ $fail -eq 0 ] && echo "FROZEN OK" || { echo "FROZEN FAIL"; exit 1; }
