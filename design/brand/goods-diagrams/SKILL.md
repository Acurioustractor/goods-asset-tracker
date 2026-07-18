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
Gemini, "Nano Banana Pro"), steered by the reference set so every new illustration
matches the hand. The locked hand is **`goods-styleref-speckle.png`** (Ben,
"closest we have"): warm cream ground, one clay-brown outline, rounded stadium ends
with a pole-hole, and a dense clay-brown terrazzo speckle for recycled plastic.
`goods-ill-plastic-loop.png` shows the same hand carrying a full loop with chunky
arrows. Those are the target and the method.

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
- **Speckle:** recycled-plastic surfaces carry a **dense fine terrazzo stipple in
  the clay `#A8643F` tone** (sage `#8B9D77` may lightly accent it) — the signature
  in `goods-styleref-speckle.png`. It is how plastic reads as recycled. Flat fill,
  never engraving hatch or parallel-line shading.
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

## Add the labels (overlay them on the generated picture)

The model draws no text on purpose (AI text is unreliable and can't be
canon-checked). Lay the exact words over the generated picture with one of the two
overlay templates. Both share the same no-overlap layout: the picture sits in a
centre band on the same cream, eyebrow + title in the top margin, caption + one
number in the bottom margin — the zones are physically separate, so labels can't
collide the way hand-placed ones used to.

- **`assets/overlay-template.svg`** — the portable one. Point its `<image>` at your
  PNG, overwrite the bracketed text, delete unused label slots, export straight into
  a deck. Canon numbers are typed by hand (current values are listed in the file).
- **`assets/overlay-template.html`** — the canon-baking one. Use it when the caption
  carries a canon figure: write `CANON:num:<id>` and run
  `design/brand/kit/render.sh <file>` → PDF + preview PNG with the number baked from
  `canon.ts`. render.sh refuses to ship an unknown id or a drifted number — that
  refusal is the reason to prefer HTML when a number is involved.

Rules for the label layer: uppercase mono, ink; eyebrow in terracotta; at most one
number and never a dollar figure; no em dashes. Then QA — hold it beside
`goods-styleref-speckle.png` and the standing rules, and fix.

For a multi-part picture (the loop's COLLECT / PRESS / A BED), both templates carry
commented point-label slots you move under each part. If a diagram genuinely needs
exact connective **arrows** drawn in vector (not baked into the generated picture),
the arrow / `#hand`-filter conventions live in `references/build-and-assemble.md`.

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
