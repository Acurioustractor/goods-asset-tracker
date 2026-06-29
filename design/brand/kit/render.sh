#!/usr/bin/env bash
# ============================================================================
# Goods on Country — Claude Design kit renderer
# Render ANY artifact HTML to a PDF + a quick preview PNG, with all repo-relative
# images resolving (it serves the repo root so ../../ image paths work).
#
#   ./render.sh design/brand/claude-design/invest-deck-full.html
#   ./render.sh <path-to-any-artifact.html>
#
# Outputs <artifact>.pdf and <artifact>-preview.png next to the file.
# ============================================================================
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
PORT="${RENDER_PORT:-8911}"

FILE="${1:?usage: render.sh <artifact.html>}"
ABS="$(cd "$(dirname "$FILE")" && pwd)/$(basename "$FILE")"
REL="${ABS#"$REPO"/}"
NAME="${ABS%.html}"

# URL-encode spaces in the relative path
RELURL="${REL// /%20}"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$REPO" >/dev/null 2>&1 &
SRV=$!
trap 'kill "$SRV" 2>/dev/null || true' EXIT
sleep 1

URL="http://127.0.0.1:$PORT/$RELURL"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$NAME.pdf" "$URL" >/dev/null 2>&1
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=0.5 \
  --window-size=1920,1080 --screenshot="$NAME-preview.png" "$URL" >/dev/null 2>&1

echo "PDF:     $NAME.pdf"
echo "Preview: $NAME-preview.png  (first artboard only)"
