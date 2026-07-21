# Goods Final Deck — CLEAN ASSET MANIFEST (2026-07-21)

The final deck may ONLY use assets listed here. Anything not listed is presumed dirty.
Canon: 540 / 177 / 363 / 20 / 11 / 3,540kg / $713,827 / 180°C / $750 / "designed in community".

## Content sources (build FROM, verified clean)
- `wiki/investor/14-playout-plan.md` — the 12-beat spine (blueprint)
- `design/goods-funder-deck-v2.html` + `.provenance.md` — content spine, every figure traced
- `v2/src/lib/data/{deck.ts, cost-story.ts, storyteller-registry.ts, curated-quotes.ts}`
- `design/deck-design-system.html` — component system v2 (post-Ben-reactions)

## Photos (LOCKED set — Ben approved as staged)
- `design/deck-photos/*.jpg` heroes and storytellers ONLY.
- BANNED inside deck-photos: `map.png` (stale 496/9 screenshot — needs regen from current Atlas before any use). The four chart PNGs (`where-750.png`, `breakeven.png`, `cost-curve.png`, `sankey.png`) are RETIRED per Ben 2026-07-21 ("junk") — every chart is redrawn natively in the deck hand.
- `design/system-visuals/illustrations/plastic-loop/goods-20kg-plastic-one-bed.png` — REAL photo (flake pile + pressed X), approved proof asset for beat 5.

## Gemini/AI model drawings — WINNERS (visual review 2026-07-21)
- Plastic journey (beat 5): `generated-images/goods-illustrations/process-anchors/01-plastic-loop-v2.png` — cleanest single-weight loop w/ offcuts-return. (Runner-up: story-spine/01.)
- Container plant (beats 5/8 support): `generated-images/goods-illustrations/process-anchors/02-container-plant.png` — one-container cutaway shred→press→assemble.
- X-trestle mechanism (beat 3): `v2/public/images/brand/generated/goods-ill-x-leg.png` — speckled X + tension arrows.

(Ben 2026-07-21: ONLY the three above are kept. Ownership visual = new concept needed.)

## PHOTO ALIGNMENT METHOD (Ben ruling 2026-07-21 — after two rounds of wrong picks)
**Deck photos come ONLY from `design/canon-resolved.json` (the ratified one-best-image-per-subject index) or Ben's explicit picks. Never ad-hoc path browsing.**

## Beat 3 — HOW THE BED WORKS (Ben ruling 2026-07-21)
- REAL imagery only; generated bed anatomy is BANNED (Gemini cannot hold the X-trestle mechanism exactly).
- THE explainer = `v2/public/images/product/stretch-bed-overview.png` (canon key `assembly-sequence`): parts + 5-step process + the clever bit.
- X glyph `goods-ill-x-leg.png` = small brand motif only, never the mechanism explainer.
- VIDEO: assembly timelapse `design/deck-assets/video/assembly-timelapse-2026-07-04.mov` (local-only, 2026-07-04 shoot) — the moving version.

## Beat 9 — OWNERSHIP (Ben ruling 2026-07-21)
- NOT an illustration: real community build photos (Oonchiumpa and others building beds), `v2/public/images/build/` series; candidates staged in D4 (build-041 / 089 / 113 / 121), Ben picks the hero. Consent check before external send.
- Ownership illustrations D (stages) / E (key in door) PARKED, not banned — possible caption-strip support only.

## Gemini drawings — REJECTED (do not use)
- ANY generated drawing of the bed's assembly/mechanism (see Beat 3 ruling above). `final-deck/03-x-trestle-tension-optionB{,2}.png` rejected.
- `qbe-09-ownership/01-handover.png` + `story-spine/10-handover-curve.png` — rejected by Ben 2026-07-21; beat 9 gets a new concept.
- `design/system-visuals/illustrations/ownership/goods-community-ownership-v1.jpg` — off-brand isometric colour style.
- `v2/public/images/brand/generated/goods-ill-health-chain.png` — chunky chain style mismatch; redraw if the concept is wanted.
- `story-spine/16-nine-communities.png` — stale count in the concept itself.
- Everything in `design/system-visuals/illustrations/_retired-renders/`.
- `story-spine/04-plant-workflow.png` — weaker sketch hand than the container-plant winner.

## Note on final form (research-backed)
Winners are raster explorations. Diagrams that repeat across beats (plastic loop, X-trestle, ownership) get REDRAWN as hand-authored vector/Pencil line-art matching the winner's composition — raster Gemini output is reference, not shipping art. Charts: conclusion-headlines, direct labels, no legends beyond the 540 split, terracotta accent + greys only.

## CONTAMINATED — never re-import (stale 496/133/9/16/2,660/190°C)
- `design/deck/claude-design-artifact.html`
- ALL of `design/brand/claude-design/` deck HTMLs (+ previews, Express exports)
- `design/brand/kit/{next-phase-onepager.resolved, funder-onepager.resolved, canon-build}.html` + `.claude-design-export/`
- `design/deck-photos/map.png` + `v2/public/images/qbe/communities-screen.png`
- `wiki/investor/10-community-counts.md` "canon" column reads 536/173/3,460 — do not source figures from it until corrected.
- `design/goods-funder-deck.html` (old 5.5MB) — on canon but superseded; fallback only.
- Old theory-of-change .pen files — verify in Pencil before any reuse.
