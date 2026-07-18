---
name: goods-diagrams
description: >
  Draw Goods on Country explainer diagrams and illustrations in the locked brand
  style, by composing from a reusable motif library instead of hand-coding
  one-off SVG shapes (which always drift and look slightly wrong). Use this
  whenever you are making ANY diagram, illustration, explainer, icon, flow, loop,
  cycle, or concept visual for Goods: the plastic loop, the model / flywheel,
  containers-fund-containers, the health chain, how-it's-made, impact-per-bed, the
  ask, a deck-slide graphic, a website illustration, a guide step, a stat visual.
  Trigger even when the user only says "draw", "diagram", "illustrate", "make a
  visual", "explain this with a picture", or "a graphic for X" in a Goods context.
  The locked style, palette, material→colour map, standing rules, motif library
  and assembly template all live here. Consult this before drawing anything Goods,
  and never hand-author bespoke icon paths inline.
---

# Goods on Country — explainer diagrams

## The one principle: draw with the model, never hand-code the picture

Every Goods diagram must look like it came from one hand, and hand-coding SVG
shapes never gets there: each element drifts slightly and the whole thing reads as
"not quite right". The picture is **drawn by a real image model** (the latest
Gemini, "Nano Banana Pro"), steered by the existing `goods-ill-*` reference set so
every new illustration matches the hand. The proof is
`v2/public/images/brand/goods-ill-plastic-loop.png`: a full loop diagram, clay
line, sage flecks, chunky arrows, drawn by the model. That is the target and the
method.

So there are two jobs, and they use different tools:

1. **The picture** (the objects, the scene, the loop, even simple arrows) → is
   **generated** with the drawing model, steered by the reference set. This is the
   primary method: read **`references/generate.md`** first. Never hand-author the
   picture in SVG; that is the drift habit we are leaving behind.
2. **The precise labels and numbers** (and any exact connective arrow the model
   cannot place reliably) → are added **over** the generated image in the kit
   (`assets/diagram-template.svg`), because AI text is unreliable and cannot be
   canon-checked. This is the only place SVG is used.

A Goods diagram = **a model-drawn illustration + a thin kit layer of exact labels.**

## Before you draw

1. **Generate the picture.** Read `references/generate.md`. Attach 2-4 of the
   `goods-ill-*` reference images, paste the master style prompt + the scene, and
   generate (Gemini / ChatGPT / Recraft, or `scripts/gen_goods_illustration.py`).
   Generate 3-4, keep the best, and save it so it is reused, not regenerated.
2. **Add the labels** over it in the kit (see "Assemble" below), with at most one
   canon number, never a dollar figure.

An optional, secondary path exists for cases that genuinely need exact, editable,
recombinable **vector** pieces rather than a generated picture (an SVG motif
library composed by code): it is documented in `references/build-and-assemble.md`.
Default to generation; reach for the vector path only when a diagram must be
programmatic. The `goods-ill-*` set is the style anchor for both.

## The locked style (summary — full spec in references/style-and-rules.md)

- **Ground:** cream `#FBF8F1`.
- **Line:** clay `#A8643F`, one medium weight, rounded caps and joins, single
  confident pass (not a sketchy double line). This is the line in the existing
  `goods-ill-*` set — match it exactly.
- **Accents / fills:** the **material→colour map** — plastic/HDPE = clay
  `#A8643F`, steel = gold `#BBA255`, canvas = teal `#5C8A86`, On Country / place =
  sage `#8B9D77`, surplus / community = green `#5E7A4C`, factory / contribution =
  olive `#7E9A68`, brand keyline = terracotta `#C45C3E`. Colour carries meaning;
  never colour a thing off-map.
- **Speckle:** recycled-plastic surfaces carry small sage `#8B9D77` flecks (the
  terrazzo signature). It is how plastic reads as recycled.
- **Labels:** uppercase, mono, ink `#2B2A26`, letter-spacing ~0.12em; eyebrows in
  terracotta. Added in the template, **never inside the illustration**.
- **Tokens:** everything derives from `design/brand/tokens.css` (the single source
  of truth). Do not re-encode hex values; pull them.

## The standing rules (full version + the why in references/style-and-rules.md)

These are non-negotiable because they protect people and the truth:

- **One idea, one image.** If the caption needs an "and", it is two diagrams.
- **Hands, not faces.** No identifiable people, ever. Community authorship is
  shown through hands and the work, not portraits.
- **At most one canon number** per diagram (the `20KG PER BED` / `NO TOOLS` /
  `5 MINUTES` class), pulled from canon, **never a dollar figure**.
- **No text baked into a generated motif.** Labels are kit text, so they stay
  precise, editable and canon-checked.
- **No em dashes.** Colons, periods, parentheses.
- **The claim ceiling.** Scabies → rheumatic heart disease is the *why*, never a
  claimed outcome. The health-chain diagram stays abstract (chain links, a bed
  breaking a link); never draw sick people, children, or a body.
- **X-trestle drawn true.** Two crossed-plank legs, poles through the canvas
  sleeves into the leg holes, canvas structural. Never clip-on, woven, or timber.
- **No cultural cliché.** No dot-painting, flags, boomerangs, faces, or symbols in
  place/ownership motifs. Keep them neutral (house-in-hands, horizon line).

## Assemble a diagram

1. Copy `assets/diagram-template.svg` to your working file. It carries the cream
   ground, the palette tokens, the hand-drawn arrow filter, the label/eyebrow/
   number text styles, and the three canvas sizes (16:9 slide, 4:3, 1:1).
2. Inline the motif symbols you use from `assets/motifs.svg` into the diagram's
   `<defs>`, then place them with `<use href="#motif-bed">`. Inline rather than
   reference the external file: external `<use href="motifs.svg#id">` does not
   render or export reliably, and inlining keeps the diagram self-contained (it
   exports cleanly to PDF / Adobe Express). Do not edit the motif paths; only
   position and scale them. See `assets/example-plastic-loop.svg`.
3. Draw the **arrows and flow lines** as `<path>` elements with
   `filter="url(#hand)"` and the clay stroke, so they read hand-drawn but sit
   exactly where you place them. Full arrow + connector conventions are in
   `references/build-and-assemble.md`.
4. Add **labels and one canon number** as kit text (uppercase mono). Reference
   canon figures with the `CANON:num:<id>` token so `render.sh` bakes the current
   value and refuses to ship a stale one.
5. Render with `design/brand/kit/render.sh <file>` → PDF + preview PNG, or export
   the SVG directly for a deck.
6. QA: render, eyeball against the `goods-ill-*` set and the rules above, fix. Because
   every element is a reused motif and every diagram inherits the same template,
   drift is impossible by construction.

A worked example is in `assets/example-plastic-loop.svg`.

## When to read the references

- **`references/generate.md`** — **read this first, it is the primary method.** How
  to draw the picture by generating it with the latest Gemini image model, steered
  by the `goods-ill-*` reference set: which reference images to attach, the master
  style prompt, and a per-diagram scene prompt for each one in the catalogue. This
  is where every new illustration starts.
- **`references/style-and-rules.md`** — the full palette + material map + type +
  line spec, and every standing rule with the reason behind it. Read before
  generating or judging whether a diagram is on-brand.
- **`references/build-and-assemble.md`** — the label/assembly conventions (arrows,
  eyebrows, canon-number tokens) for the thin SVG layer added over a generated
  image, plus the optional secondary vector path (the motif catalogue and the
  vectorise-and-normalise route) for the rare diagram that must be programmatic.

## Tools

Consistency lives in the *method*, but these help build the library:
Recraft (generates true editable SVG with a saved custom style), Vectorizer.AI
(cleanest sketch → SVG), Excalidraw (fastest structural-consistency option),
Adobe `image_vectorize` (raster → SVG, available in this environment). Goods'
existing generation pipeline is Gemini (`gemini-3-pro-image-preview`) with the
locked style prompt in `references/build-and-assemble.md`.
