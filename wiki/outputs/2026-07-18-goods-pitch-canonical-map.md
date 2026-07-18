# Goods pitch — the canonical map (single source of truth)

**Generated:** 2026-07-18 · **This file is the index for the whole pitch effort.** If a
deck, diagram, number or photo is not pointed to here, it is not canonical. One deck,
one plan, one visual system. Read this before touching any pitch artifact.

---

## 1. THE deck (canonical)

**`v2/public/deck-slides/goods-simple-deck.pdf`** — the simple deck, one idea per
slide, ask last. Source: **`v2/public/deck-slides/slides-source.html`** (edit the HTML,
re-render, done). This is the deck we present and finish. Everything else supports it
or is retired.

| # | Slide | The one message | Visual (now) | Hand-drawn swap (later) |
|---|-------|-----------------|--------------|--------------------------|
| 1 | Main idea | From waste to ownership | Type | — |
| 2 | Why | A bed is health hardware, not furniture | CSS chain pills | `health-chain` |
| 3 | Problem | $3M of washing machines dumped near Alice each year | Type + stat | — |
| 4 | Product | The Stretch Bed (26kg · 200kg · ~5min · 10yr) | Spec cards | `x-leg` (inset) |
| 5 | Circular | Local waste becomes a bed; 20kg/bed | CSS step arrows | `plastic-loop` |
| 6 | Model | WASTE → PRODUCT → SKILL → WORK → OWNERSHIP | CSS step chips | (5-step, keep CSS) |
| 7 | Proof | Already shipped, every one trackable: 496 · 9 · 16 · 2,660kg | Stat cards | — |
| 8 | Impact | Every bed carries a fixed impact payload | CSS payload row | `impact-per-bed` |
| 9 | Ask | AU$400,000, matched one to one, signed by 31 Aug 2026 | Type + buckets | — |
| 10 | Anchor | Fair wages cost the model nothing | Two figures | — |
| 11 | Best case | One signed round seeds a fleet that funds itself | Type + stats | `flywheel` |

Present order is the slide order: the ask sits last, after the anchor line and the best
case have earned it.

## 2. Retired — do NOT use or build on

- **`design/brand/claude-design/invest-deck-full.html`** — the old dense 16-slide
  deck. Different message, retired wording ("catalytic capital raise"), stock photos.
  **RETIRED.** A banner at the top of the file says so. Its only reusable parts are the
  5 cleared photo pages (see §5), which can move to the simple deck if we want photo
  breathers.

## 3. The plan behind the deck

- **`wiki/outputs/2026-07-17-investment-deck-alignment.md`** — the overview: the one
  job, the architecture, the impact model (IMP five-dimensions, logic model), **§5 the
  diagram plan**, **§9 the sequenced next actions**.
- **`wiki/outputs/2026-07-17-simplest-message-and-deck-images.md`** — the simplest
  message (the one line, the 20-second spine, the funder impact message, the ask) and
  this exact 11-slide image set.
- **The one job:** convert the warmest existing funders into the first **~AU$400K of
  signed, match-eligible capital before 31 August 2026** (the QBE Catalysing Impact
  match is an output of money raised first). Everything serves that.
- **The honest verdict to design against:** strong proof, unproven economics, unsigned
  money. The deck wins by showing the gaps, not papering over them.

## 4. The diagrams — CSS now, hand-drawn later (Ben's call, 2026-07-18)

The simple deck's diagram slides currently use clean CSS visuals, and **they stay** for
now. The hand-drawn illustrations are a later polish, swapped in slide by slide once
generated. The system to make them is built and locked:

- **Skill / rules:** `design/brand/goods-diagrams/` (SKILL.md + references + overlay
  templates). The `.claude/skills/goods-diagrams/` copy is the working one.
- **Prompts + slide text:** `wiki/outputs/2026-07-18-goods-image-generation-pack.md` —
  every scene prompt paired with its label text.
- **Generator:** `scripts/gen_goods_illustration.py` (`--all` for one run,
  `--transparent` for no-background).
- **Style anchor (locked hand):** `v2/public/images/brand/goods-styleref-speckle.png`.
- **Overlay (labels onto a generated PNG):** `design/brand/goods-diagrams/assets/`
  `overlay-template.svg` / `.html`.
- **Gate:** generation needs Google/OpenAI, which are blocked inside the Claude web
  session. Ben runs `python scripts/gen_goods_illustration.py --all` on his machine;
  then we drop the PNGs onto slides 2, 5, 8, 11 (and 4 inset) via the overlay.

## 5. Photography (consent-gated)

- **Consent SOT:** `wiki/outputs/2026-07-17-cleared-photos-for-deck.md` (the 32 cleared
  voices, default-deny; scene photos are consent-free). Final gate before any external
  send: confirm consent + Elder approval + correct naming.
- **Built, reusable:** 5 full-bleed photo pages (Dianne, Stretch Bed, Mykel, the plant,
  a rest/close) currently parked in the retired deck. Move them into the simple deck
  only if we decide we want photo breathers between the idea slides.

## 6. Numbers

- **SOT:** `design/canon-numbers.json` (generated from `v2/src/lib/data/canon.ts`).
  Reference in artifacts as `CANON:num:<id>`; `render.sh` bakes the value and refuses a
  stale one. Every number wears an honest label: ● verified · ● modelled · ● target.
  Beds shown split (133 Stretch + 363 Basket = 496), never blended.

## 7. Compliance (every slide, every time)

- **Banned words:** empower, beneficiaries, ecosystem, scalable solution, catalytic
  (only inside "QBE Catalysing Impact"), unlock, journey, transformational,
  game-changing.
- **Claim ceiling:** scabies → RHD is the *why*, never a claimed health outcome.
- **Ownership is a pathway** ("moving into their hands"), never claimed complete.
- No charity framing. No em dashes.

## 8. Open reconciliations (honest loose ends)

1. **Slide 12 (the-machine)** exists as `goods-slide-12-the-machine.png/.svg` but is
   NOT in `slides-source.html` or the PDF (both 11 slides). Decide: fold it in as the
   canonical slide 12, or drop it. Until decided, the deck is 11 slides.
2. **11 vs 17 slides:** the simple 11-slide deck is canonical. The 17-slide architecture
   in the overview §3 is the optional "diligence-room" superset (team, risk, IMP table,
   unit economics), not the pitch.
3. **Hand-drawn diagrams not yet generated** (§4 gate). CSS diagrams hold until then.

## 9. What "finished" looks like, and the sequence

- **Now (done):** the 11-slide CSS deck is presentable and compliance-passed.
- **Next (Ben's sequence, overview §9):** lock numbers → resolve the slide-12 question →
  optional photo breathers → run the diagram generation → swap hand-drawn in slide by
  slide → re-render the PDF.
- **The finish line:** one canonical PDF, simplest message, ask last, in the locked
  hand, every number labelled, consent gate cleared.
