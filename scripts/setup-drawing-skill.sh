#!/usr/bin/env bash
# ============================================================================
# Load the Goods diagrams skill into Claude Code.
#
# WHY: .claude/ is gitignored, so the skill does NOT arrive when you clone/pull.
# The versioned copy lives in design/brand/goods-diagrams/. This copies it into
# .claude/skills/goods-diagrams/ so Claude Code CLI discovers and loads it.
#
# Run from the repo root:  bash scripts/setup-drawing-skill.sh
# Re-run any time to refresh the local skill from the versioned source.
# ============================================================================
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO/design/brand/goods-diagrams"
DST="$REPO/.claude/skills/goods-diagrams"

[ -d "$SRC" ] || { echo "error: $SRC not found (are you in the repo?)"; exit 1; }
mkdir -p "$DST"
cp -R "$SRC/." "$DST/"
echo "Loaded goods-diagrams skill -> .claude/skills/goods-diagrams/"
echo "Start Claude Code in this repo and the skill will be available."
echo "Full story + rules: wiki/outputs/2026-07-18-goods-drawing-system.md"
