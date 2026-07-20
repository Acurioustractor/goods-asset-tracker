# The Goods drawing system — history, decisions, and how to continue

**Generated:** 2026-07-18 · **Read this first if you are working on Goods diagrams /
illustrations** (in Claude Code CLI or anywhere). It captures *why* the system is the
way it is, so the hard-won decisions are not re-litigated. The system itself lives in
`design/brand/goods-diagrams/` (the skill) and `2026-07-18-goods-image-generation-pack.md`
(the prompts + text). This doc is the story and the rules behind them.

---

## What we are making

Consistent, warm, hand-drawn-feeling explainer diagrams for the Goods pitch: the plastic
loop, the flywheel, the health chain, how-it's-made, impact-per-bed, the markup gap, the
X-leg. One family, one hand, on the locked brand palette.

## The history (how we got here — do not repeat the dead ends)

1. **Hand-coded SVG was tried and rejected — twice.** The first approach authored the
   illustrations as SVG paths / motif libraries by hand. Ben's verdict: *"the way you
   draw svg graphics are never close enough… research a different way,"* then *"still
   feels fucked and there has to be a better model to draw these."* **Why it failed:**
   every shape drifts a little, there is no single hand, and hand-assembly produced
   overlap/clipping bugs. **Lesson: do not hand-author the picture in SVG. It will drift
   and it will be rejected.**

2. **The pivot: generate the picture with a real image model, steered by references.**
   Consistency does not come from careful hand-drawing; it comes from **(a) a locked
   style prompt + (b) attaching reference images every time**. The model is the latest
   Gemini image model, **`gemini-3-pro-image-preview`** ("Nano Banana Pro"). The text
   prompt alone drifts; the *attached references* are what lock the hand.

3. **The style got locked by two references Ben supplied** ("the closest we have"). The
   winner, **`v2/public/images/brand/goods-styleref-speckle.png`**, is now THE anchor:
   warm cream ground, one confident clay-brown outline, rounded stadium plank-ends with
   a small pole-hole, and a **dense clay-brown terrazzo speckle** filling the plastic.
   This **corrected the prompt**: the earlier prompt said "a few sparse sage-green
   flecks" — wrong. The real signature is a *dense stipple in the line's own brown tone*,
   flat fill, **no engraving hatch**. (`goods-styleref-hatch.png` is the hatch-style
   alternate we are NOT using.)

4. **Text is kept out of the generated image on purpose.** The model is told to draw no
   words. Labels and the one number are added *over* the picture with an overlay
   template, so the words stay exact and canon-checked. AI-rendered text cannot be
   canon-checked and must not be the source of a number on a funder slide.

## The rules (a fresh session must not regress on these)

- **Generate, do not hand-code.** No bespoke SVG illustration paths. Ever.
- **Attach `goods-styleref-speckle.png`** (plus 1–2 of the `goods-ill-*` set) on every
  generation. Skipping references is why output drifts.
- **Recycled plastic = dense clay-brown terrazzo speckle**, flat. Not sparse sage
  flecks, not engraving hatch, not gradients or 3D.
- **One clay-brown outline, rounded caps, cream ground. Colour only by material:**
  plastic clay `#A8643F`, steel gold `#BBA255`, canvas teal `#5C8A86`, place/On Country
  sage `#8B9D77`.
- **X-trestle drawn true:** two crossed recycled-plastic planks, steel poles through the
  canvas sleeves into the leg holes, canvas structural. Never clip-on, woven, or timber.
- **Text is overlaid, never baked as canon.** At most one number per diagram, never a
  dollar figure baked in. Honour the claim ceiling (scabies→RHD is the *why*) and the
  banned-words list.

## The system (what exists, where)

| Piece | Path | What it is |
|-------|------|------------|
| The skill | `design/brand/goods-diagrams/` | SKILL.md + references (generate / style-and-rules / build-and-assemble) + assets (overlay templates). The rules and workflow. |
| The prompt + text pack | `wiki/outputs/2026-07-18-goods-image-generation-pack.md` | All 8 scene prompts, each paired with its exact slide text, plus the master style prompt and the simple how-tos. |
| The generator | `scripts/gen_goods_illustration.py` | Calls Gemini with the locked prompt + references. `--all` = one run of all 8; `--transparent` = no background. |
| The style anchor | `v2/public/images/brand/goods-styleref-speckle.png` | THE locked hand. Attach to every generation. |
| Overlay templates | `design/brand/goods-diagrams/assets/overlay-template.svg` / `.html` | Drop a generated PNG in, type the labels, export. The `.html` one bakes canon numbers via `render.sh`. |

The eight diagrams and their deck homes are in the generation pack. The pitch's single
source of truth is `2026-07-18-goods-pitch-canonical-map.md`.

## The blocker (why generation is not done yet)

Image generation needs Google (Gemini) or OpenAI. **Both are blocked by the Claude web
session's egress proxy** (they return no connection). So the illustrations cannot be
generated from a claude.ai session — they must be generated where Google is reachable:
**your machine, via Claude Code CLI or a plain terminal.** Everything else (the prompts,
the style lock, the overlay, the deck slots) is done and waiting for that one run.

## How to continue in Claude Code CLI (on your machine)

```bash
# 1. get this branch
git fetch origin claude/investment-deck-alignment-y3qc43
git checkout claude/investment-deck-alignment-y3qc43

# 2. load the skill into Claude Code (.claude/ is gitignored, so restore it):
bash scripts/setup-drawing-skill.sh        # copies design/brand/goods-diagrams -> .claude/skills/

# 3. add a Gemini key (free at https://aistudio.google.com/apikey)
echo 'GEMINI_API_KEY=your_key' >> v2/.env.local

# 4. ONE RUN — generate all eight diagrams:
python scripts/gen_goods_illustration.py --all --outdir v2/public/images/brand/generated
#    (add --transparent for no-background versions)

# 5. put labels on: open design/brand/goods-diagrams/assets/overlay-template.svg,
#    point it at a generated PNG, type the caption from the generation pack, export.
```

A fresh Claude Code session in this repo should read, in order:
`2026-07-18-goods-pitch-canonical-map.md` (what the pitch is) → this file (the drawing
story and rules) → the generation pack (the prompts) → the skill.

## Current state and the next move

- **Done & locked:** the style, the anchor reference, the prompt+text pack, the
  generator (`--all`), the overlay templates, the deck's diagram slots.
- **Deck now:** the canonical simple deck keeps its clean CSS diagrams (Ben's call,
  2026-07-18) until the illustrations exist.
- **Next:** run the generation on your machine, then swap the hand-drawn illustrations
  onto slides 2, 5, 8, 11 (and the X-leg inset on 4) via the overlay, and re-render.
