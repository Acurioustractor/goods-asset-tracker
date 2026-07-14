#!/usr/bin/env bash
# Builds design/system-visuals/{real-photos,illustrations,named}/ as a local
# browsing/staging area for reviewing every image used to explain the Goods
# system (bed anatomy, assembly, the plastic loop, ownership, the cost model).
#
# Everything here is a SYMLINK, never a copy: zero disk duplication, always
# reflects the current source file, and safe to gitignore wholesale (see
# .gitignore). Re-run any time after adding/renaming a source image.
#
#   real-photos/   -> the real photography relevant to these concepts
#   illustrations/ -> every AI-generated / rendered candidate, one folder per
#                      concept, including retired/orphaned ones (kept for
#                      reference, not for reuse)
#   named/         -> the resolved picks: one cleanly-named file per concept
#                      that is actually live on the site today
#
# The web review of the same material lives at /admin/system-visuals.

set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
STAGE="design/system-visuals"

rm -rf "$STAGE"
mkdir -p "$STAGE/real-photos" "$STAGE/illustrations" "$STAGE/named"

link() {
  # link <target-relative-to-repo-root> <link-path-relative-to-repo-root>
  local target="$1" link_path="$2"
  if [ ! -e "$ROOT/$target" ]; then
    echo "  MISSING source, skipped: $target" >&2
    return
  fi
  mkdir -p "$(dirname "$ROOT/$link_path")"
  ln -s "$ROOT/$target" "$ROOT/$link_path"
}

echo "Building real-photos/ ..."
for f in \
  v2/public/images/pitch/bed-seq-3-all-parts.jpg \
  v2/public/images/pitch/bed-assembled.jpg \
  v2/public/images/pitch/bed-poles.jpg \
  v2/public/images/pitch/bed-canvas.jpg \
  v2/public/images/pitch/bed-frame-legs.jpg \
  v2/public/images/pitch/bed-seq-1-leg-pole.jpg \
  v2/public/images/pitch/bed-seq-2-legs-pole.jpg \
  v2/public/images/process/container-factory.jpg \
  v2/public/images/product/stretch-bed-hero.jpg \
  v2/public/images/product/stretch-bed-community.jpg \
  v2/public/images/product/stretch-bed-legs.jpg \
  v2/public/images/product/stretch-bed-poles.jpg \
  v2/public/images/product/stretch-bed-detail.jpg \
  v2/public/images/product/stretch-bed-assembly.jpg \
  v2/public/images/product/stretch-bed-in-use.jpg \
  ; do
  link "$f" "$STAGE/real-photos/$(basename "$f")"
done

echo "Building illustrations/ ..."
# Retired renders (superseded by real photos 2026-07-13) — kept for reference.
for f in v2/public/goods-bed-anatomy.jpg v2/public/goods-bed-assembly.jpg v2/public/images/product/stretch-bed-overview.png; do
  link "$f" "$STAGE/illustrations/_retired-renders/$(basename "$f")"
done
# Calibration / studio-render set for bed parts.
for f in v2/public/images/brand/goods-ill-leg.png v2/public/images/brand/goods-ill-poles.png \
  v2/public/images/brand/goods-ill-canvas.png v2/public/images/brand/goods-leg-studio-v1.png \
  v2/public/images/brand/goods-bed-studio-v3.png v2/public/images/brand/goods-canvas-swatch-v1.png \
  v2/public/images/brand/goods-ill-assembly.png; do
  link "$f" "$STAGE/illustrations/_retired-renders/$(basename "$f")"
done
# Plastic loop.
for f in v2/public/images/brand/goods-ill-plastic-loop.png v2/public/images/brand/goods-plastic-loop-v1.png \
  v2/public/images/brand/goods-20kg-plastic-one-bed.png \
  generated-images/goods-illustrations/process-anchors/01-plastic-loop-v2.png \
  generated-images/goods-illustrations/test-batch/01-plastic-loop.png; do
  link "$f" "$STAGE/illustrations/plastic-loop/$(basename "$f")"
done
# Plant / container.
link v2/public/images/brand/goods-ill-plant.png "$STAGE/illustrations/plant/goods-ill-plant.png"
link generated-images/goods-illustrations/process-anchors/02-container-plant.png "$STAGE/illustrations/plant/02-container-plant.png"
# Ownership.
link v2/public/goods-community-ownership.jpg "$STAGE/illustrations/ownership/goods-community-ownership-v1.jpg"
link generated-images/goods-illustrations/qbe-09-ownership/01-handover.png "$STAGE/illustrations/ownership/01-handover.png"
link generated-images/goods-illustrations/test-batch/03-ownership-handover.png "$STAGE/illustrations/ownership/03-ownership-handover-draft.png"
# Theory of change / operating model (computed, not AI-illustrated, but same "diagram" family).
for f in v2/public/theory-of-change.png v2/public/theory-of-change.svg v2/public/operating-model.png v2/public/operating-model.svg; do
  link "$f" "$STAGE/illustrations/theory-of-change/$(basename "$f")"
done
# Orphaned cost-model script family.
for f in v2/public/goods-cost-down.png v2/public/goods-cost-curve.svg v2/public/goods-breakeven.svg \
  v2/public/goods-marginal-vs-fixed.png v2/public/goods-sankey-money.svg v2/public/goods-sankey-plastic.png \
  v2/public/goods-scenarios.png v2/public/goods-idiot-index.svg v2/public/goods-model-engine.png \
  v2/public/goods-fully-loaded-volume.svg v2/public/goods-anatomy-bed.png v2/public/goods-where-750-goes.svg; do
  link "$f" "$STAGE/illustrations/cost-model/$(basename "$f")"
done
for f in generated-images/goods-illustrations/cost-lab-pack/*.png; do
  [ -e "$f" ] && link "$f" "$STAGE/illustrations/cost-model/$(basename "$f")"
done
# Health chain (CLAIMS HOLD — see /admin/system-visuals, do not ship as-is).
for f in generated-images/goods-illustrations/health-chain/*.png; do
  [ -e "$f" ] && link "$f" "$STAGE/illustrations/health-chain/$(basename "$f")"
done
# Journeys / narrative (unplaced).
for f in generated-images/goods-illustrations/journeys/*.png generated-images/goods-illustrations/order-to-country/*.png; do
  [ -e "$f" ] && link "$f" "$STAGE/illustrations/journeys/$(basename "$f")"
done
# Assembly guide (superseded by real photos 2026-07-13, kept for reference).
for f in generated-images/goods-illustrations/assembly-guide/*.png generated-images/goods-illustrations/test-batch/02-assembly-thread-pole.png; do
  [ -e "$f" ] && link "$f" "$STAGE/illustrations/_retired-renders/$(basename "$f")"
done
# Investor deck (QBE areas) — deck-only, not on the live site.
for f in generated-images/goods-illustrations/qbe-05-risk/*.png generated-images/goods-illustrations/qbe-07-governance/*.png \
  generated-images/goods-illustrations/qbe-08-people/*.png generated-images/goods-illustrations/qbe-12-alignment/*.png; do
  [ -e "$f" ] && link "$f" "$STAGE/illustrations/qbe-deck/$(basename "$f")"
done

echo "Building named/ (resolved picks, cleanly named, currently live) ..."
link v2/public/images/pitch/bed-seq-3-all-parts.jpg "$STAGE/named/bed-anatomy.jpg"
link v2/public/images/pitch/bed-assembled.jpg "$STAGE/named/bed-assembly.jpg"
link v2/public/goods-plastic-journey.jpg "$STAGE/named/plastic-loop.jpg"
link v2/public/goods-container-plant.png "$STAGE/named/container-plant.png"
link v2/public/goods-community-ownership-v2.png "$STAGE/named/community-ownership.png"
link v2/public/theory-of-change.png "$STAGE/named/theory-of-change.png"

cat > "$STAGE/named/README.md" <<'EOF'
# Named / final picks

One cleanly-named symlink per concept, pointing at whatever is actually LIVE
on the site today. This folder is the answer to "what do we currently use to
explain the Goods system" — for the full candidate pool (real photos +
illustrations, including what did NOT get picked), see the sibling
`real-photos/` and `illustrations/` folders, or the web review at
`/admin/system-visuals`.

Still open (no file here on purpose):
- **health-chain** — a candidate exists (`illustrations/health-chain/`) but is
  on a CLAIMS HOLD: it asserts a stronger causal claim than
  `v2/src/components/dashboard/health-pathway.tsx` allows. Do not promote
  without a softer regenerate or a /ground pass.
- **cost-model** — the live cost-story page computes its charts with Recharts
  directly; the static export family in `illustrations/cost-model/` is
  orphaned (deck/print/download use only).
- **journeys**, **qbe-deck** — drafted, not placed on any live page
  (qbe-deck is mirrored into the Pencil investor deck separately, see
  `design/deck-photos/`).
EOF

echo "Done. $(find "$STAGE" -type l | wc -l | tr -d ' ') symlinks created under $STAGE/"
