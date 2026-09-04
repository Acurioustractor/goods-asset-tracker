#!/usr/bin/env bash
# Render the QBE model drawings from the guarded modules and rasterise them for the Pencil deck.
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
# THE DECK-SAFE GUARD. These drawings' `working` variant is written for us, not for the funder, and
# internal decision state has leaked into it before: on 4 Sep 2026 the three-jobs drawing was about
# to print "Recommended: the organisation, not beds. Ben has not yet ruled." onto a slide going to
# QBE, and the entity drawing dated itself "ruling X, 28 Aug". Both were fixed at source.
#
# So this script does not patch strings. It renders from the real module and then READS THE RENDERED
# OUTPUT for a list of phrases that must never reach a funder. If one survives, the render fails and
# no PNG is written. Fix the wording in qbe-diagrams.ts; do not add an exception here.
#
# Usage: ./render-all.sh /path/to/goods-story-wt/v2 /path/to/output/dir
set -euo pipefail
V2="${1:?usage: render-all.sh <story-worktree>/v2 <outdir>}"
OUT="${2:?usage: render-all.sh <story-worktree>/v2 <outdir>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Drawings that are working artifacts and never belong on a funder surface.
# the-calendar names individuals and internal scheduling.
SKIP="the-calendar"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

STORY_V2="$V2" node "$HERE/render-diagrams-full.mjs" "$TMP/svg"
STORY_V2="$V2" node "$HERE/render-diagram-bodies.mjs" "$TMP/body"

# ---------------------------------------------------------------------------
# Read the rendered text back and refuse to rasterise anything that leaks.

python3 - "$TMP" "$SKIP" <<'PY'
import glob, os, re, sys

tmp, skip = sys.argv[1], set(sys.argv[2].split())

# Phrases that must never reach a funder: internal decision state, who has and has not ruled,
# our own ruling shorthand, and the CRM the pipeline lives in.
BANNED = [
    "not yet ruled",
    "Recommended: the organisation",
    "ruling X",
    "ruling Y",
    "HighLevel",
    "NEEDS BEN",
    "SUBJECT TO JAY",
]
# Repo vocabulary: fine in a working note, wrong on a slide. Reported, does not fail the build.
WARN = [".ts", "canon.ts", "workpaper.ts"]

def visible(path):
    return " ".join(re.findall(r">([^<>]+)<", open(path).read()))

# Case-insensitive: the kicker line is uppercased when it is drawn, so "bed-ratio.ts" reaches the
# page as "BED-RATIO.TS". A case-sensitive scan misses every one of them.
def find(haystack, needle):
    return haystack.lower().find(needle.lower())

fail = []
warn = []
for path in sorted(glob.glob(os.path.join(tmp, "svg", "*--working.svg")) +
                   glob.glob(os.path.join(tmp, "body", "*-body.svg"))):
    name = os.path.basename(path)
    did = name.split("--")[0].replace("-body.svg", "")
    if did in skip:
        continue
    text = visible(path)
    for phrase in BANNED:
        i = find(text, phrase)
        if i >= 0:
            fail.append(f"  {name}: {phrase!r} in ...{text[max(0,i-60):i+80].strip()}...")
    for phrase in WARN:
        i = find(text, phrase)
        if i >= 0:
            warn.append(f"  {name}: {phrase!r} in ...{text[max(0,i-50):i+40].strip()}...")

for w in warn:
    print("WARN, repo vocabulary on a funder surface:\n" + w)

if fail:
    print("\nDECK-SAFE GUARD FAILED. These would have gone to the funder:\n")
    print("\n".join(fail))
    print("\nFix the wording in v2/src/lib/diagrams/qbe-diagrams.ts. Do not add an exception here.")
    sys.exit(1)

print("deck-safe guard: clean")
PY

# ---------------------------------------------------------------------------

mkdir -p "$OUT"
FONTS='<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900&family=Inter:wght@100..900&family=Roboto+Mono:wght@100..700&display=block" rel="stylesheet">'
STYLE='<style>html,body{margin:0;padding:0;background:#FBF8F1}svg{display:block}</style>'

for f in "$TMP"/svg/*--working.svg; do
  id="$(basename "$f" --working.svg)"
  case " $SKIP " in *" $id "*) continue ;; esac
  { printf '<!doctype html><meta charset="utf-8">%s%s\n' "$FONTS" "$STYLE"; cat "$f"; } > "$TMP/$id.html"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=3 \
    --window-size=1600,900 --virtual-time-budget=8000 --screenshot="$OUT/$id.png" "file://$TMP/$id.html" >/dev/null 2>&1
done

for f in "$TMP"/body/*-body.svg; do
  id="$(basename "$f" -body.svg)"
  case " $SKIP " in *" $id "*) continue ;; esac
  H=$(python3 -c "import json;print(json.load(open('$TMP/body/meta.json'))['$id']['h'])")
  { printf '<!doctype html><meta charset="utf-8">%s%s\n' "$FONTS" "$STYLE"; cat "$f"; } > "$TMP/$id-body.html"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=3 \
    --window-size=1600,"$H" --virtual-time-budget=8000 --screenshot="$OUT/$id-body.png" "file://$TMP/$id-body.html" >/dev/null 2>&1
done

python3 - "$TMP/body/meta.json" "$SKIP" <<'PY'
import json, sys
m = json.load(open(sys.argv[1]))
skip = set(sys.argv[2].split())
print("\nbody aspect ratios, for the Pencil frame at width 1720:")
for k, v in m.items():
    if k in skip:
        continue
    print(f"  {k:20s} aspect {v['aspect']:>6}  ->  1720 x {round(1720/v['aspect'])}")
PY
echo "done -> $OUT"
