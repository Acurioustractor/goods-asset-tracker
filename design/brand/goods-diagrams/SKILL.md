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

## The one principle: consistency is structural, not a matter of redrawing

Every Goods diagram must look like it came from one hand. That does not come from
drawing carefully each time. It comes from **never redrawing**: each visual
element (a bed, a plastic flake, a container plant, a hand) is drawn **once**, in
the locked style, and then the *exact same vector* is reused in every diagram.
Diagrams are **composed** from that fixed set, and the arrows, labels and numbers
are added precisely as code. Redrawing an element inline, even well, is the exact
habit that produces the "not quite right" drift. Do not do it.

So there are two different jobs, and they use different methods:

1. **The elements** (objects, scenes, icons) → come from the **motif library**
   (`assets/motifs.svg`). Built once (see `references/build-and-assemble.md`), reused
   forever. AI generation or vectorization is only ever used to *build the
   library*, never to make a finished diagram.
2. **The structure** (arrows, flow lines, labels, numbers, layout) → added as
   **precise code** in the assembly template (`assets/diagram-template.svg`).
   Whole-image AI gets arrows, flow and text wrong, so structure is always drawn
   by hand in code, where it is exact, editable and canon-checkable.

A Goods diagram = **library motifs + code-drawn structure + kit labels.** Nothing
about a diagram is ever freehand-authored from scratch.

## Before you draw: is the library ready?

Check `assets/motifs.svg` for the motif you need.

- **Motif exists** → compose the diagram (see "Assemble" below). This is the
  common, cheap, always-on-brand path.
- **Motif missing** → build it once, the right way, before using it. Read
  `references/build-and-assemble.md` and follow route 1a (hand-drawn / community,
  preferred for Goods) or 1b (locked-style AI generation). Vectorize, normalise,
  add it to the library, *then* compose. Never sketch a missing motif inline to
  "just get this one done" — that is how the set drifts.

The seed set already exists as raster art in `v2/public/images/brand/goods-ill-*`
(bed assembly, canvas, leg, plant, plastic-loop, poles, washing-machine). These
are the style anchors and the first motifs to vectorise.

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

- **`references/style-and-rules.md`** — the full palette + material map + type +
  line spec, and every standing rule with the reason behind it. Read before
  building a motif or judging whether a diagram is on-brand.
- **`references/build-and-assemble.md`** — the motif catalogue (~20 to build), the
  two build routes (1a hand-drawn/community, 1b locked-style AI) with the exact
  locked style prompt, the vectorise-and-normalise steps, and the full arrow /
  label / canon-token assembly conventions. Read before building any motif or
  wiring a new diagram.

## Tools

Consistency lives in the *method*, but these help build the library:
Recraft (generates true editable SVG with a saved custom style), Vectorizer.AI
(cleanest sketch → SVG), Excalidraw (fastest structural-consistency option),
Adobe `image_vectorize` (raster → SVG, available in this environment). Goods'
existing generation pipeline is Gemini (`gemini-3-pro-image-preview`) with the
locked style prompt in `references/build-and-assemble.md`.
