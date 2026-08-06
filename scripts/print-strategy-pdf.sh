#!/usr/bin/env bash
# Render a public/*.html deck to an A4 portrait PDF via headless Chrome.
# Usage: scripts/print-strategy-pdf.sh strategy-makers
set -euo pipefail

NAME="${1:-strategy-makers}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/$NAME.html"
OUT="$ROOT/public/$NAME.pdf"

[ -f "$SRC" ] || { echo "no such file: $SRC" >&2; exit 1; }

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="/Applications/Chromium.app/Contents/MacOS/Chromium"
[ -x "$CHROME" ] || { echo "Chrome not found — install it or use Cmd-P > Save as PDF" >&2; exit 1; }

"$CHROME" --headless --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT" \
  --virtual-time-budget=8000 \
  "file://$SRC"

echo "wrote $OUT"
