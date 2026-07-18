# Goods diagrams — assembly conventions + the optional vector path

> **Read `references/generate.md` first.** The picture is *generated* with the
> drawing model, not hand-built in SVG. This file has two uses. **(A) Always
> relevant:** Part 4's label / arrow / canon-number conventions — the thin SVG kit
> layer you add *over* a generated image. **(B) Optional, secondary:** Parts 1–3,
> the SVG motif library and vectorise route, for the rare diagram that must be
> programmatic / exactly editable vector rather than a generated picture. Do not
> reach for Parts 1–3 by default; generation is the method.

Two separate jobs. Building a motif is rare and careful; assembling a diagram is
common and cheap. Keep them separate.

## Part 1 — The motif catalogue (optional vector path — build these ~20 once)

The library is the single source of truth for Goods visuals, the way `products.ts`
is for specs. Build it once; every diagram reuses it. The seven marked SEED
already exist as raster art in `v2/public/images/brand/goods-ill-*` and are the
first to vectorise.

**Objects / materials**
- `motif-bed` — the assembled Stretch Bed, X-trestle true (SEED: `goods-ill-assembly`)
- `motif-x-leg` — one recycled-plastic X-trestle leg, speckled (SEED: `goods-ill-leg`)
- `motif-pole` — a galvanised steel pole (SEED: `goods-ill-poles`)
- `motif-canvas` — a canvas sheet / roll, teal (SEED: `goods-ill-canvas`)
- `motif-flake` — a small pile of shredded HDPE flakes, speckled
- `motif-sheet` — a pressed recycled-plastic sheet, speckled
- `motif-press` — the heat press
- `motif-plant` — the containerised plant, roller doors open (SEED: `goods-ill-plant`)
- `motif-washer` — Pakkimjalki Kari, boxy Speed Queen silhouette (SEED: `goods-ill-washing-machine`)
- `motif-loop` — the plastic recycle loop (SEED: `goods-ill-plastic-loop`)

**People-through-hands / place**
- `motif-hand` — a single working hand (never a face)
- `motif-hands-cupped` — two cupped hands (for ownership: house-in-hands)
- `motif-house` — a simple neutral house / shelter shape
- `motif-country` — a horizon-and-sun line (place; no cultural symbols)
- `motif-key` — a key or simple title document (the handover)
- `motif-truck` — a delivery truck / ute

**Concept glyphs**
- `motif-chain-link` — one link of the health chain (abstract)
- `motif-water-drop` — a wash / water drop (canvas, washing)
- `motif-container-block` — a single shipping container (for the fleet / flywheel)
- `motif-number-badge` — an empty circle badge to seat one canon number

Each motif: same canvas box (e.g. 200×200), same clay line weight, palette-token
colours, transparent background, named `motif-<name>`, no text inside.

## Part 2 — Two routes to build a motif

Pick one route and use it for the *whole* set, so the set is one hand. For Goods,
**route 1a is preferred**: real hand-drawn, community-authored art gives a genuine
"one hand" and clean provenance for culturally-weighted imagery. Reserve route 1b
for speed and gap-filling.

### Route 1a — hand-drawn / community, then vectorise (preferred)

1. In one sitting, hand-draw all ~20 motifs in the locked style (you, or commission
   one community artist for a session). iPad/Procreate or pen on paper. Same pen,
   same weight, same cream feel throughout, so they match.
2. Vectorise each: **Vectorizer.AI** (cleanest, fewest nodes) or Adobe
   `image_vectorize` (available here; needs a public image URL). Recraft's
   vectoriser also works.
3. Normalise: same canvas box, snap to the clay line weight, recolour to the
   palette tokens, transparent background, remove stray nodes, name it.

### Route 1b — locked-style AI generation, then vectorise (fast)

1. Generate each motif with the **locked style prompt** below, holding the style
   constant. Best tools: **Recraft** (make a Custom Style from the `goods-ill-*`
   set + up to 5 refs, save it, reuse on every generation; outputs real SVG),
   **Midjourney** (`--sref <goods-ill url>` + a fixed `--sw`, pin `--sv`), or
   Goods' existing **Gemini** pipeline. Generate 3-4 variations, keep the best.
2. Vectorise (skip if Recraft already gave clean SVG) and normalise as in 1a.

**The locked style prompt (the style DNA, reuse verbatim):**

> A single [MOTIF] as a clean flat line illustration on a warm cream (#FBF8F1)
> background. One consistent medium-weight clay-terracotta (#A8643F) outline,
> rounded caps and joins, single confident line, no shading, no gradients, no 3D,
> no drop shadow. Recycled-plastic surfaces carry small sage-green (#8B9D77)
> terrazzo flecks. Colour by material only: plastic clay #A8643F, steel gold
> #BBA255, canvas teal #5C8A86, place/Country sage #8B9D77. Minimal, warm,
> honest, hand-drawn feel but clean and even. No text, no labels, no numbers, no
> people's faces, no cultural symbols. Match the style of the reference set
> exactly so it reads as one family.

Plus the relevant guardrails from `references/style-and-rules.md` (X-trestle true;
hands not faces; no cliché; abstract health chain). Full worked prompts for the
product set are in `wiki/outputs/2026-06-03-goods-brand-guide/IMAGE-PLAN.md`.

## Part 3 — Store the library

Commit the normalised motifs to the repo so they are versioned and importable:

- As an **SVG sprite** `assets/motifs.svg`: one `<symbol id="motif-bed" viewBox=…>`
  per motif. Reference with `<use href="motifs.svg#motif-bed">`. This is the
  default and matches the existing `<symbol>`/`<use>` pattern.
- Or as **React SVG components** under `v2/src/components/diagrams/motifs/` if a
  diagram needs to live in the app.

The library, not any single diagram, is the thing maintained. `assets/motifs.svg`
ships with the skill as a scaffold: each symbol is a labelled placeholder until you
drop the real vectorised art in. Replace the placeholders; keep the ids.

## Part 4 — Assemble a diagram

Start from `assets/diagram-template.svg`. It carries the cream ground, palette
tokens, the hand-drawn arrow filter (`#hand`), the text styles, and the canvas
sizes. Then:

**Motifs.** Inline the `<symbol>`s you need from `assets/motifs.svg` into the
diagram's `<defs>`, then place them with `<use href="#motif-flake" x=… y=… width=… />`.
Inline rather than external-file reference: `<use href="motifs.svg#id">` to a
separate file does not render or export reliably, and inlining makes the diagram
self-contained (exports cleanly to PDF / Adobe Express). Position and scale only;
never edit motif paths. If a motif is missing, build it (Part 2) first. A tiny
inliner script (read the diagram, copy each referenced `motif-*` symbol from
`motifs.svg` into `<defs>`) is worth adding once you have real art.

**Arrows and flow lines.** Draw as `<path>` with `filter="url(#hand)"`, the clay
stroke, rounded caps, `fill="none"`. The `#hand` filter gives the line a
hand-drawn wobble that matches the motifs while letting you place it anywhere.
Conventions:
- Forward flow: solid clay arrow.
- Return / feedback (offcuts, learning, surplus recycling): dashed clay arrow
  (`stroke-dasharray="2 9"`), coloured sage or green if it carries that meaning.
- Arrowheads: two short strokes off the path end, same stroke; keep them small.
- Keep flow left-to-right or clockwise. One flow direction per diagram.

**Labels and one number.** Add as kit text: uppercase mono, ink, ~0.12em tracking,
placed clearly beside (not on) the motif. Eyebrow/title in terracotta. At most one
canon number (never dollars), seated in `motif-number-badge` or as a chip.

**Canon tokens (never retype a figure).** Write `CANON:num:<id>` where a canon
number goes (`CANON:num:plastic-kg` → `2,660kg`, `CANON:num:beds-deployed` →
`496`). `design/brand/kit/render.sh` bakes the current value from
`design/canon-numbers.json` and refuses to render if it has drifted from
`canon.ts`. This is how a diagram cannot ship a stale number. Non-canon facts
(20KG PER BED spec class, NO TOOLS, 5 MINUTES) are hand-written.

**Render.** `design/brand/kit/render.sh <file>` → PDF + preview PNG with images
resolved, or export the SVG straight into a deck. Re-render after any motif or
number change.

**QA.** Render, hold it beside the `goods-ill-*` set and the rules in
`style-and-rules.md`, fix. Because every element is a reused motif and every
diagram inherits the template, the only things that can be wrong are placement and
labels, both cheap to fix.

## The catalogue of diagrams to draw (from the illustration map)

Priority order, so the library is built against real need:
1. **Health chain** (abstract, a bed breaks a link) — deck slide 3 + /impact + /story.
2. **The plastic loop** (collect, shred, press, bed, offcuts return) — /process.
3. **Containers fund containers** (container 1 surplus seeds container 2, then 3) — deck, Cost Lab.
4. **How it's made** (the container plant cross-section) — /process.
5. **The model / flywheel** (make, sell, surplus, fund the next) — deck.
6. **Impact per bed** (one bed, its fixed payload) — deck, /impact.
7. **Markup gap** (raw flake, press, finished leg) — Cost Lab, wiki.
8. **Plant travels then transfers** (container moves on Country, keys change hands) — /partner.

See `wiki/outputs/2026-06-06-goods-illustration-map.md` for the full map and
`wiki/outputs/2026-07-17-model-explanation-research.md` for the model framing the
flywheel and markup-gap diagrams carry.
