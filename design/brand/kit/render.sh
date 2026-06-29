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

# If the artifact references canon images by slot (CANON:<slot>), bake the current
# picks from design/canon-resolved.json into a resolved copy and render that. This
# is the last link: finishing slots on /admin/canon shows up here on next render.
SERVE="$ABS"
if grep -q "CANON:" "$ABS" 2>/dev/null; then
  node "$REPO/v2/scripts/canon-render.mjs" "$ABS" -o "$NAME.resolved.html" >&2
  SERVE="$NAME.resolved.html"
fi
RELSERVE="${SERVE#"$REPO"/}"

# URL-encode spaces in the relative path
RELURL="${RELSERVE// /%20}"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$REPO" >/dev/null 2>&1 &
SRV=$!
trap 'kill "$SRV" 2>/dev/null || true' EXIT
sleep 1

URL="http://127.0.0.1:$PORT/$RELURL"
# --virtual-time-budget lets webfonts (Adobe Typekit) load before capture, else text
# renders invisible (FOIT). --run-all-compositor-stages-before-draw forces a settled paint.
WAIT="--virtual-time-budget=12000 --run-all-compositor-stages-before-draw"
"$CHROME" --headless=new --disable-gpu $WAIT --no-pdf-header-footer --print-to-pdf="$NAME.pdf" "$URL" >/dev/null 2>&1
"$CHROME" --headless=new --disable-gpu $WAIT --hide-scrollbars --force-device-scale-factor=0.5 \
  --window-size=1920,1080 --screenshot="$NAME-preview.png" "$URL" >/dev/null 2>&1

echo "PDF:     $NAME.pdf"
echo "Preview: $NAME-preview.png  (first artboard only)"
