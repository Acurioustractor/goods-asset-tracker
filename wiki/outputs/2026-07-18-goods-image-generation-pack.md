# Goods diagram pack — every prompt, every label, in one place

**Purpose.** One sitting, eight on-brand diagrams. Each block below has the **scene
prompt** (what to paste) and the **slide text** (eyebrow, title, caption, one
number) so the picture and the words stay paired. The style is locked by two
things together: the master prompt *and* attaching the reference images every time.

**Two ways to run the whole set:**

1. **Batch, one command** (on your machine — Google is blocked from the Claude
   session, so it runs where you are):
   ```bash
   # add the key once (free at https://aistudio.google.com/apikey)
   echo 'GEMINI_API_KEY=your_key' >> v2/.env.local
   # ONE RUN — all eight, into the brand folder:
   python scripts/gen_goods_illustration.py --all --outdir v2/public/images/brand/generated
   # transparent versions for placing on photos / dark slides:
   python scripts/gen_goods_illustration.py --all --transparent --outdir v2/public/images/brand/generated
   ```
2. **By hand in ChatGPT / Gemini** (5 minutes): attach `goods-styleref-speckle.png`,
   paste one scene prompt + the master prompt, download, next. ChatGPT is strong at
   *rendering text inside the image* — see "Two ways to place the words" below.

---

## Attach these every time (this is what locks the hand)

From `v2/public/images/brand/`:

- **`goods-styleref-speckle.png`** — THE anchor. Attach to all eight.
- **`goods-ill-plastic-loop.png`** — the loop shape and the chunky clay arrows.
- **`goods-ill-plant.png`** — the container plant (for plant / how-it's-made scenes).

## The master style prompt (paste after every scene)

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

---

## The eight diagrams (scene prompt + slide text)

For each: paste the **Scene** then the master prompt. Then put the **Text** over the
finished picture (see "Two ways to place the words").

### 1. The loop  ·  `--name plastic-loop`
- **Scene:** a circular loop showing recycled plastic becoming a bed: a pile of
  shredded HDPE flakes, then a heat press, then a finished Stretch Bed, with an arrow
  returning offcuts from the bed back to the flakes.
- **Eyebrow:** THE LOOP · **Title:** *Waste becomes the bed. Offcuts become the next one.*
- **Caption:** COLLECT · SHRED · PRESS · A BED  ·  **Number:** 20KG OF PLASTIC PER BED
- Deck home: the model / process (near slide 10).

### 2. The flywheel  ·  `--name flywheel`
- **Scene:** a circular flywheel of four stages with clockwise arrows: make in-house,
  sell, surplus, fund the next container; a shipping container at the centre.
- **Eyebrow:** THE MODEL · **Title:** *One container funds the next.*
- **Caption:** MAKE · SELL · SURPLUS · FUND THE NEXT  ·  **Number:** *(none — no dollars)*
- Deck home: the scale model (slide 10).

### 3. Containers fund containers  ·  `--name containers-fund-containers`
- **Scene:** one shipping-container plant, an arrow of surplus seeding a second
  container, then a third; the fleet growing left to right. No dollar signs.
- **Eyebrow:** HOW IT SCALES · **Title:** *The plant travels, then it multiplies.*
- **Caption:** ONE PLANT SEEDS THE NEXT, ON COUNTRY  ·  **Number:** *(none)*
- Deck home: the scale model / ownership (slides 10, 15).

### 4. The health chain  ·  `--name health-chain`
- **Scene:** an ABSTRACT chain of links where a Stretch Bed breaks one link.
  Object-only, no people, no bodies, no sick figures. The bed interrupting the chain
  is the whole idea.
- **Eyebrow:** THE WHY · **Title:** *A washable bed off the ground breaks the first link.*
- **Caption:** SCABIES → STREP A → RHEUMATIC HEART DISEASE  ·  **Number:** *(none)*
- **Claim ceiling:** the pathway is recognised public-health logic and the reason the
  work matters — never a health outcome Goods claims. Keep the drawing abstract.
- Deck home: the problem (slide 3).

### 5. How it's made  ·  `--name how-its-made`
- **Scene:** a cross-section of the containerised plant: a shredder, a heat press, and
  a CNC router inside open shipping containers, with pressed recycled-plastic sheets
  stacked.
- **Eyebrow:** THE PLANT · **Title:** *A whole factory in two shipping containers.*
- **Caption:** SHRED · PRESS · CUT · ON COUNTRY  ·  **Number:** *(none)*
- Deck home: the scale model (slide 10).

### 6. Impact per bed  ·  `--name impact-per-bed`
- **Scene:** one Stretch Bed at the centre with four simple objects around it (a
  plastic flake cluster, a small house, a hand, a canvas square), each connected to
  the bed by a short clay line.
- **Eyebrow:** PER BED · **Title:** *Every bed carries the same fixed payload.*
- **Caption:** PLASTIC DIVERTED · A LOCAL JOB · A BED OFF THE GROUND  ·  **Number:** 20KG DIVERTED PER BED
- Deck home: impact thesis (slide 11).

### 7. The markup gap  ·  `--name markup-gap`
- **Scene:** a left-to-right transformation: a small pile of raw plastic flakes, then
  the heat press, then a finished speckled recycled-plastic bed leg. Value added as
  the plastic transforms.
- **Eyebrow:** THE INSIGHT · **Title:** *Owning the press is the whole business.*
- **Caption:** RAW PLASTIC → PRESS → FINISHED LEG KIT  ·  **Number:** 8.6× MARKUP
- Note: keep the number a ratio (8.6×), not a dollar figure. The dollar detail
  ($40 → $344, saves $194 a bed) already lives on deck slide 4.
- Deck home: the insight (slide 4).

### 8. The leg  ·  `--name x-leg`
- **Scene:** a single recycled-plastic X-trestle bed leg: two crossed planks with
  rounded stadium ends, a small circular pole-hole at each top end, filled with the
  dense clay-brown terrazzo speckle, exactly like the reference.
- **Eyebrow:** THE LEG · **Title:** *One leg. Two crossed planks of recycled plastic.*
- **Caption:** X-TRESTLE TRUE · STEEL POLES THREAD THE HOLES  ·  **Number:** 20KG OF PLASTIC PER BED
- Deck home: the product (slide 6).

---

## Two ways to place the words

The model is told to draw **no text** so the picture stays clean. Then either:

- **Overlay (most control, canon-safe).** Drop the PNG into
  `design/brand/goods-diagrams/assets/overlay-template.svg` (portable, into a deck)
  or `…/overlay-template.html` (write `CANON:num:plastic-kg` and run
  `design/brand/kit/render.sh` — it bakes the current number and refuses a stale one).
  Type the eyebrow / title / caption / number from each block above.
- **Bake it in ChatGPT (fast).** ChatGPT renders text inside images well. Add to the
  scene: *"add the caption 'X-TRESTLE TRUE · STEEL POLES THREAD THE HOLES' in a small
  uppercase monospace clay label under the object; no other text."* Faster, but the
  number is not canon-checked — read it against `design/canon-numbers.json` by eye
  before it goes to a funder. Prefer the overlay whenever a number is on the slide.

## Make a PNG with no background (for photos / dark slides)

- **Generate transparent:** add `--transparent` to the script, or tell
  ChatGPT/Gemini *"transparent background, no cream, output a PNG with alpha."*
- **Strip the cream after:** because it's line + speckle on flat cream, background
  removal is clean — use Canva "remove background", remove.bg, Photoshop, or Adobe's
  remover. (I can run Adobe's `image_remove_background` on any generated PNG in-chat.)
- **When to keep the cream:** on cream slides, keep it — the cream *is* the brand
  ground. Use transparent only when the illustration sits on a photo or a dark panel.

## Simplest route (no code at all)

Open ChatGPT → attach `goods-styleref-speckle.png` → paste one scene + the master
prompt → download → drop into your slide (Canva / Keynote / Google Slides / PowerPoint)
→ add the text from the block. Repeat for the eight. Keep the best, save it, reuse it —
don't regenerate the same diagram twice.
