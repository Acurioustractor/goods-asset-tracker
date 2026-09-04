#!/usr/bin/env bash
# Render the nine QBE model drawings from the guarded modules and rasterise them for the Pencil deck.
#
# No dev server and no investors gate: jiti imports the TypeScript modules directly, so every figure
# is read from raise-stack.ts / community-loop.ts / bed-ratio.ts / canon.ts / qbe-story.ts rather
# than typed. Headless Chrome does the rasterising so Playfair Display, Inter and Roboto Mono come
# from Google Fonts and match the app.
#
# Two products per drawing:
#   <id>.png       the whole 16:9 figure, its own kicker/title/footer
#   <id>-body.png  the body only, chrome stripped, for a Pencil slide that carries its own headline
#
# DECK-SAFE COPY. Two strings in the `working` variant are internal and must not reach a funder.
# This script patches them into a temp module before rendering and deletes it afterwards:
#   "Katie Norman named the resilience ... Recommended: the organisation, not beds. Ben has not yet ruled."
#   'ruling X, 28 Aug'
# If either string moves in qbe-diagrams.ts the patch asserts and the render stops. Fix it, do not
# skip it.
#
# Usage: ./render-all.sh /path/to/goods-story-wt/v2 /path/to/output/dir
set -euo pipefail
V2="${1:?usage: render-all.sh <story-worktree>/v2 <outdir>}"
OUT="${2:?usage: render-all.sh <story-worktree>/v2 <outdir>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$V2/src/lib/diagrams/qbe-diagrams.ts"
PATCHED="$V2/src/lib/diagrams/qbe-diagrams.deck.ts"
cleanup() { rm -f "$PATCHED"; rm -rf "$TMP"; }
trap cleanup EXIT

python3 - "$SRC" "$PATCHED" <<'PY'
import sys
src, out = sys.argv[1], sys.argv[2]
t = open(src).read()
reps = [
 ("Katie Norman named the resilience of organisations as the reason for the invitation. Recommended: the organisation, not beds. Ben has not yet ruled.",
  "The invitation names the resilience of organisations as its reason. It points at the organisation rather than at beds; the allocation is not settled."),
 ("working ? 'ruling X, 28 Aug' : '28 August 2026'", "'28 August 2026'"),
]
for a, b in reps:
    assert a in t, "deck-safe patch target moved, fix render-all.sh: " + a[:70]
    t = t.replace(a, b)
open(out, 'w').write(t)
PY

mkdir -p "$OUT"
STORY_V2="$V2" DIAGRAM_MODULE=src/lib/diagrams/qbe-diagrams.deck.ts node "$HERE/render-diagrams-full.mjs" "$TMP/svg"
STORY_V2="$V2" DIAGRAM_MODULE=src/lib/diagrams/qbe-diagrams.deck.ts node "$HERE/render-diagram-bodies.mjs" "$TMP/body"

FONTS='<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900&family=Inter:wght@100..900&family=Roboto+Mono:wght@100..700&display=block" rel="stylesheet">'
STYLE='<style>html,body{margin:0;padding:0;background:#FBF8F1}svg{display:block}</style>'

for f in "$TMP"/svg/*--working.svg; do
  id="$(basename "$f" --working.svg)"
  [ "$id" = "the-calendar" ] && continue   # internal planning calendar, names people, never in the deck
  { printf '<!doctype html><meta charset="utf-8">%s%s\n' "$FONTS" "$STYLE"; cat "$f"; } > "$TMP/$id.html"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=3 \
    --window-size=1600,900 --virtual-time-budget=8000 --screenshot="$OUT/$id.png" "file://$TMP/$id.html" >/dev/null 2>&1
done

for f in "$TMP"/body/*-body.svg; do
  id="$(basename "$f" -body.svg)"
  [ "$id" = "the-calendar" ] && continue
  H=$(python3 -c "import json;print(json.load(open('$TMP/body/meta.json'))['$id']['h'])")
  { printf '<!doctype html><meta charset="utf-8">%s%s\n' "$FONTS" "$STYLE"; cat "$f"; } > "$TMP/$id-body.html"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=3 \
    --window-size=1600,"$H" --virtual-time-budget=8000 --screenshot="$OUT/$id-body.png" "file://$TMP/$id-body.html" >/dev/null 2>&1
done

python3 - "$TMP/body/meta.json" <<'PY'
import json, sys
m = json.load(open(sys.argv[1]))
print("\nbody aspect ratios, for the Pencil frame (width 1720 unless noted):")
for k, v in m.items():
    print(f"  {k:20s} aspect {v['aspect']:>6}  ->  1720 x {round(1720/v['aspect'])}")
PY
echo "done -> $OUT"
