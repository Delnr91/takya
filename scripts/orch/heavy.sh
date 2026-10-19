#!/usr/bin/env bash
# Candado de procesos pesados (build, inferencia, FFmpeg largo, pytest pesado): uno a la vez.
# Uso: scripts/orch/heavy.sh npm run build
exec flock /tmp/takya-heavy.lock "$@"
