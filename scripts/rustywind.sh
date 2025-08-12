#!/usr/bin/env bash
set -euo pipefail

bunx rustywind "$@" \
  --custom-regex 'class="([^"]*)"' \
  --custom-regex 'class=\{`((?:[^`]|\n)*)`\}'


