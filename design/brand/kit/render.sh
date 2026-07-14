#!/usr/bin/env bash
# ============================================================================
# Goods on Country — Claude Design kit renderer
# Render ANY artifact HTML to a PDF + a quick preview PNG, with all repo-relative
# images resolving (it serves the repo root so ../../ image paths work).
#
#   ./render.sh design/brand/claude-design/invest-deck-full.html
#   ./render.sh <path-to-any-artifact.html>
#   ./render.sh --live-stages design/brand/kit/funder-landscape-onepager.html
#
# --live-stages: for artifacts carrying GHL:stage: tokens, pull the funder
# pipeline live from GHL first (read-only GET via ghl-people-pull.mjs) so the
# status pills show today's real stages. Without it, the last saved pull is
# baked (stamped with its own date), or STALE if no pull has ever been saved.
#
# Outputs <artifact>.pdf and <artifact>-preview.png next to the file.
# ============================================================================
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
PORT="${RENDER_PORT:-8911}"

LIVE_STAGES=0
ARGS=()
for a in "$@"; do
  case "$a" in
    --live-stages) LIVE_STAGES=1 ;;
    *) ARGS+=("$a") ;;
  esac
done
FILE="${ARGS[0]:?usage: render.sh [--live-stages] <artifact.html>}"
ABS="$(cd "$(dirname "$FILE")" && pwd)/$(basename "$FILE")"
REL="${ABS#"$REPO"/}"
NAME="${ABS%.html}"

# If the artifact references canon images by slot (CANON:<slot>) or canon figures
# by id (CANON:num:<canon-id>), bake the current picks from design/canon-resolved.json
# and the formatted figures from design/canon-numbers.json into a resolved copy and
# render that. This is the last link: finishing slots on /admin/canon (or changing a
# figure in canon.ts + regenerating canon-numbers.json) shows up here on next render.
SERVE="$ABS"
if grep -q "CANON:" "$ABS" 2>/dev/null; then
  # Number tokens: refuse to bake from a numbers file that has drifted from canon.ts.
  if grep -q "CANON:num:" "$ABS" 2>/dev/null; then
    node "$REPO/v2/scripts/canon-numbers.mjs" --check >&2
  fi
  node "$REPO/v2/scripts/canon-render.mjs" "$ABS" -o "$NAME.resolved.html" >&2
  SERVE="$NAME.resolved.html"
fi

# Stage tokens (GHL:stage:<funder-key> + the GHL:stages-asat stamp): bake live
# GHL stages (--live-stages, read-only pull) or the last saved pull. Chains on
# the canon-resolved copy when one exists so both token kinds land in one file.
if grep -q "GHL:stage" "$ABS" 2>/dev/null; then
  STAGEFLAGS=()
  if [ "$LIVE_STAGES" = 1 ]; then STAGEFLAGS+=(--live); fi
  node "$REPO/v2/scripts/landscape-stages.mjs" "$SERVE" -o "$NAME.resolved.html" ${STAGEFLAGS[@]+"${STAGEFLAGS[@]}"} >&2
  SERVE="$NAME.resolved.html"
elif [ "$LIVE_STAGES" = 1 ]; then
  echo "render.sh: --live-stages given but $REL has no GHL:stage tokens" >&2
fi

# Refuse to render an artifact that still carries unresolved number or stage tokens
# (a typo'd canon id or unknown funder key would otherwise ship in a funder-facing PDF).
if grep -qE 'CANON:num:|GHL:stage:' "$SERVE" 2>/dev/null; then
  echo "render.sh: unresolved token(s) in $SERVE. Fix the canon id or funder key:" >&2
  grep -oE '(CANON:num:|GHL:stage:)[A-Za-z0-9_-]+' "$SERVE" | sort -u >&2
  exit 1
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
