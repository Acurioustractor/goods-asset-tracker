# Goods diagrams — generate with the drawing model (the primary method)

The right way to draw a Goods illustration is to **generate it with the latest
Gemini image model** (Nano Banana Pro, `gemini-3-pro-image-preview`), **steered by
the existing `goods-ill-*` reference set** so every new one matches the hand. Not
hand-coded SVG. Consistency comes from two things together: the **locked style
prompt** below, and **attaching the reference images** every time. The text prompt
alone drifts; the references are what lock the style.

Alternatives in the same tier: GPT-image-1 (ChatGPT), Recraft V3 (outputs SVG).
The workflow is the same for all three.

## Two ways to run it

1. **Script (batch, repeatable):** `scripts/gen_goods_illustration.py`. Reads a
   key from `v2/.env.local` (`GEMINI_API_KEY`, free at
   https://aistudio.google.com/apikey). Run it where Google is reachable (your own
   machine; the Claude web session's proxy blocks Google). Example:
   `python scripts/gen_goods_illustration.py --name plastic-loop --aspect 16:9 --out loop.png`
2. **By hand (Gemini app / ChatGPT / Recraft):** attach the steering examples,
   paste the master style prompt + one scene prompt, generate 3-4, keep the best.

## The steering examples — attach these EVERY time

Attach 2-4 from `v2/public/images/brand/` as style references. They teach the model
the hand; skipping them is why generations drift:

- **`goods-styleref-speckle.png`** — **THE anchor. Attach to everything.** Cream
  ground, one warm clay-brown outline, rounded stadium ends with a pole-hole, and
  the dense clay-brown terrazzo speckle that is the recycled-plastic signature. This
  is the locked hand (Ben, "closest we have"); match it above all.
- **`goods-ill-plastic-loop.png`** — the loop shape and the chunky outlined arrows.
- **`goods-ill-plant.png`** — the container plant, roller doors, interior objects.
- **`goods-ill-canvas.png`** / **`goods-ill-poles.png`** — canvas (teal) and steel
  (gold), if the scene has them.

Alternate texture on file: **`goods-styleref-hatch.png`** is the same X-leg in an
engraving / parallel-hatch style on white. We are NOT using it — the speckle is the
recycled-plastic brand signature — but it is kept in case the hatch look is ever
wanted. Do not mix the two in one set; attach the speckle anchor, not the hatch.

## The master style prompt (append to every scene)

> Draw ONE clean flat line illustration on a warm cream (#FBF8F1) background, in the
> exact hand of the attached reference images. One single confident medium-weight
> warm clay-brown (#A8643F) outline, rounded caps and joins, no double or sketchy
> lines. Recycled-plastic surfaces are filled edge to edge with a fine even TERRAZZO
> SPECKLE: many small clay-brown flecks in the same tone as the outline (this dense
> stipple is how recycled plastic reads; sage-green #8B9D77 flecks may lightly accent
> it). Otherwise flat: NO shading, NO engraving hatching, NO parallel-line shading,
> NO gradient, NO 3D, NO drop shadow. Colour ONLY by material: recycled plastic
> clay-brown #A8643F, steel gold #BBA255, canvas teal #5C8A86, place / On Country
> sage #8B9D77. Chunky outlined clay arrows for any flow. Objects are open outlines
> on cream (not filled blocks); a recycled-plastic plank end is a rounded stadium cap
> with a small circular pole-hole, exactly like the reference. NO text, NO labels, NO
> numbers, NO people's faces, NO cultural symbols (no dot-painting, flags,
> boomerangs). The Stretch Bed is X-trestle true: two crossed-plank recycled-plastic
> legs, steel poles through the canvas sleeves into the leg holes, canvas taut and
> structural (never clip-on, woven, timber, or a hammock). Match the attached
> reference images exactly so it reads as one family, one hand. Aspect ratio 16:9.

## Per-diagram scene prompts (paste one, then the master prompt)

- **plastic-loop** — a circular loop showing recycled plastic becoming a bed: a
  pile of shredded HDPE flakes, then a heat press, then a finished Stretch Bed,
  with an arrow returning offcuts from the bed back to the flakes.
- **flywheel** — a circular flywheel of four stages with clockwise arrows: make
  in-house, sell, surplus, fund the next container; a shipping container at the
  centre.
- **containers-fund-containers** — one shipping-container plant, an arrow of
  surplus seeding a second container, then a third; the fleet growing left to
  right. No dollar signs.
- **health-chain** — an ABSTRACT chain of links where a Stretch Bed breaks one
  link. Object-only, no people, no bodies, no sick figures. (Claim ceiling: the
  bed interrupting the chain is the idea; never a claimed health outcome.)
- **how-its-made** — a cross-section of the containerised plant: a shredder, a heat
  press, and a CNC router inside open shipping containers, with pressed
  recycled-plastic sheets stacked.
- **impact-per-bed** — one Stretch Bed at the centre with four simple objects
  around it (a plastic-flake cluster, a small house, a hand, a canvas square), each
  connected to the bed by a short clay line.
- **markup-gap** — a left-to-right transformation: a small pile of raw plastic
  flakes, then the heat press, then a finished speckled recycled-plastic bed leg.

The same list lives in `scripts/gen_goods_illustration.py` (`--name`), so the
script and a by-hand generation produce the same thing.

## Then: labels and numbers (the ONLY place SVG is used)

The model draws no text on purpose (AI text is unreliable and cannot be
canon-checked). Lay the words over the generated picture with an overlay template
(same no-overlap layout: picture centre-band, text in the margins):

- **`assets/overlay-template.svg`** — portable; point its `<image>` at your PNG,
  type the labels, export into a deck. Canon numbers typed by hand (values in-file).
- **`assets/overlay-template.html`** — canon-baking; write `CANON:num:<id>` and run
  `design/brand/kit/render.sh` → PDF/PNG with the number baked and drift-checked.

At most one number, never a dollar figure. This keeps the drawing beautiful and the
words exact.

## Grow the library, don't regenerate ad hoc

Generate a motif or diagram once, keep the best, and save it (to
`v2/public/images/brand/` or the motif set). Reuse it. Regenerating the same thing
every time is the drift habit; generate-once-reuse is what keeps the set one hand.
