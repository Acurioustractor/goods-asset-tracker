# Goods pitch — the canonical map (single source of truth)

**Generated:** 2026-07-25 · **Supersedes** `2026-07-18-goods-pitch-canonical-map.md`.

**Read this before touching any pitch artifact.** If a deck, diagram, number or photo is not
pointed to here, it is not canonical.

---

## 0. Why this file exists a second time

The 2026-07-18 map opened with "One deck, one plan, one visual system." Six more deck
artifacts were built after it:

| Date | Artifact | What happened |
|---|---|---|
| 18 Jul | 14-slide `slides-source.html` + PDF | declared canonical, then drifted to STALE canon (536/9/18/3,460) |
| 22 Jul | `design/Goods_Deck_SHIP.pen` | superseded in 2 days |
| 24 Jul | `design/Goods_Final_Deck.pen` | never aligned to the settled model |
| 24 Jul | `Goods_Final_Deck.pen` + `_SHARE.pen` | archived to `_archive/2026-07-24-superseded-final-decks/` |
| 24 Jul | `Goods_Funder_Pathways_Deck.pen` | a single FLATTENED rectangle. Not editable. Dead end. |
| 24 Jul | `/pitch/funder-pathways` | the first surface built on the new model |

**The diagnosis was never a deck problem. It was a model problem that kept invalidating decks.**
Each deck was a product deck with an ownership slide bolted on, while the model underneath moved.

The Notion business plan **"Communities Choose What They Need"** (2026-07-25) settled it: the unit
of the story is **the pathway a community chooses**, not the bed. That is why a deck built now is
the first one that should survive contact with next week.

**If you are about to build deck number seven: don't. Re-cut the spine below instead.**

---

## 1. THE deck (canonical)

**`v2/public/deck-slides/goods-simple-deck.pdf`** — 12 slides. 10 beats plus the open and close.
Source: **`v2/public/deck-slides/slides-source.html`**.

```bash
# render (PNGs + PDF)
NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-deck.mjs
# overflow gate — RUN THIS BEFORE EVERY RENDER
NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/check-deck-overflow.mjs
```

The overflow gate exists because a `.slide` is a fixed 1600x900 box with `overflow:hidden`:
content that spills is **silently cropped out of the PNG and the PDF**. Three slides were
losing the last line of their argument that way. The gate catches height, width, edge spill,
and flow content colliding with the absolutely-positioned wordmark/tag.

| # | Slide | The one message |
|---|-------|-----------------|
| 1 | The line | The goal was never a bigger Goods. It is a plant that belongs to the people sleeping on the beds. |
| 2 | The object | The first bed disappeared overnight (Ninga Mia) |
| 3 | The default | The hardware kept arriving. The question never did. |
| 4 | What they chose | The Stretch Bed |
| 5 | Proof | 540 / 22 / 11 / 3,540kg / $713,827, and every one trackable |
| 6 | **The Pathway Board** | **THE ONE DIAGRAM.** Six stages, nine modules, what the community holds |
| 7 | Four boards | The same menu. Four communities, four different orders. |
| 8 | The making | The making is the first thing we hand over |
| 9 | The hinge | Pressing on Country is the whole argument ($65 → $324) |
| 10 | Three doors | Give / Buy / Lend / Own. All end in the same place. |
| 11 | The ask | AU$400,000 signed by 31 August. QBE matches it. |
| 12 | The close | Leave the making with us |

**Ask sits last. Opens and closes on the handover line. Never opens on a dollar.**

`DECK_PLAN` in `v2/src/lib/data/pitch-cockpit.ts` mirrors this order and carries the WHY and the
talk track per slide. **Change `slides-source.html` and `DECK_PLAN` together** — `/pitch/simple`
joins them by slide number, so a mismatch silently mislabels the presenter notes.

## 2. The ONE diagram rule

The model carries four structural ideas: six stages, nine modules, three entities, four money
lanes. **A funder meeting holds one picture.** Show four and they remember none and ask "so what
do I fund?"

The Pathway Board (slide 6) collapses stages + modules + what-the-community-holds into a single
readable object. It is rendered natively from `pathway-stages.ts`, so it cannot drift from the
data. If a hand-drawn version is wanted later: Gemini generates the composition, then it gets
redrawn as vector. Raster output is reference, never shipping art.

## 3. Stages and modules — ONE source of truth

**`v2/src/lib/data/pathway-stages.ts`**. Locked 2026-07-25 after **three** competing models were
found live simultaneously:

- Notion business plan: Listen / Shape / Resource / Deliver / Transfer / Grow (6)
- `/pitch/funder-pathways`: Yarn / Shape / Price / Agree / Deliver / Grow (6)
- `community-pathways.ts`: listen / map / choose / approve / fund / deliver / learn (7)

**The ruling:** **Yarn / Shape / Resource / Deliver / Transfer / Grow.** "Yarn" is truer to the
room than "Listen". "Price" reads transactional on a public surface. "Transfer" stays because it
is the word that carries the handover.

**The gap that closed:** the operating model had **no transfer step at all**. The thing the entire
pitch centres on was not tracked anywhere in the system. It is now operating step 7, and every
operating step rolls up to one of the six public stages via `publicStage`.

**Nine modules, not eight.** The Notion plan said "nine modules" over an eight-row table for four
days. **Money** is the ninth: repayable loans, working capital and site capital are things a
community selects, and naming it makes the third money lane visible inside the board.

## 4. Numbers (canon)

**540 beds** = 363 Basket + 177 Stretch · **22 washers** · **11 communities** · **3,540kg**
(177 Stretch × 20kg; Basket counts zero) · **$713,827** Goods-only FY26 YTD (accountant-signed
carve-out).

SOT is `v2/src/lib/data/canon.ts`. Every figure wears a label: ● verified · ● modelled · ● target.

The money spine (`cost-story.ts`): the bed is per-unit, the block is per-year, never mix them.
$65 stays today → $324 pressed · block $109,500/yr · break-even 338 · handover at roughly
75 to 100 beds/yr. **The $324 is modelled, not measured. Say so, every time. The measured run is
what the money buys.**

## 5. The map (resolved 2026-07-25)

Chrome-free exports now exist and the old admin screenshot is gone:

```bash
cd v2 && npm run dev
NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-map-export.mjs 3000
```

Writes `design/deck-photos/map-{deployed,need,ask}.png` from the `/export/map/*` routes.

**Both old objections are closed.** (1) No app chrome: no Menu button, no search box, and the
Next dev-mode badge is suppressed by the script (it otherwise lands in the deck as a black
circle). (2) **The washer convention now reconciles:** per-community labels sum 8 + 4 + 9 + 1 = 22,
matching the header. The previous 32-vs-20 split is gone.

The old `design/deck-photos/map.png` is moved to `map-admin-screenshot-SUPERSEDED.png.bak`.
Do not resurrect it.

## 6. Imagery rulings (from `design/deck-clean-manifest.md`, still current)

- **Gemini winners, the only three kept:** plastic loop
  (`process-anchors/01-plastic-loop-v2.png`), container plant
  (`process-anchors/02-container-plant.png`), X-leg motif (`goods-ill-x-leg.png`).
- **Gemini BANNED for the bed mechanism.** It cannot hold the X-trestle. THE explainer is the real
  photo `v2/public/images/product/stretch-bed-overview.png`.
- **Ownership is real photographs**, not illustration: `v2/public/images/build/`. The generated
  handover concepts were rejected twice.
- **The four chart PNGs are RETIRED** (`where-750`, `breakeven`, `cost-curve`, `sankey`). Charts
  are redrawn native in the deck hand.
- Photos come from `design/canon-resolved.json` or Ben's explicit picks. Never ad-hoc browsing.
- Maningrida trip photos and all Dianne Stokes material: consent cleared.

## 7. Video (one in the room, two at most)

- `partners/oonchiumpa/mykel-building-the-bed.mp4` — **the pick.** The making is stage 4 into 5.
- `partners/oonchiumpa/karen-liddle-on-beds.mp4` — community voice.
- `partners/centrecorp/utopia-bed-building.mp4`, `utopia-delivery-road.mp4`
- `design/deck-assets/video/assembly-timelapse-2026-07-04.mov` — the 5-minute build.

## 8. Surfaces — which one to send

**`/pitch/funder-pathways` is THE funder surface.** It carries `CanonicalPitchNotice`.
`/pitch/simple` is the live deck (auto-picks-up a re-render; the PDF is just the export).

Eleven `/pitch/*` routes plus `/deck` exist and **none of them carry stale figures** — they all
read from canon, which is exactly why the sprawl was hard to notice. The fix was signposting, not
warnings: `/pitch`, `/pitch/document` and `/pitch/community-narrative` now carry
`OtherPitchSurfaceNotice` pointing at the canonical one.

`/deck` is deliberately left alone: it is a fullscreen keyboard presenter and a banner would break
the presentation. The remaining routes (`control-room`, `investor-lab`, `workshop`, `miro-board`,
`photo-review`) are internal working tools, not funder-facing.

## 9. Compliance (every slide, every time)

- **Banned words:** empower, beneficiaries, ecosystem, scalable solution, catalytic (only inside
  "QBE Catalysing Impact"), unlock, journey, transformational, game-changing.
- **No em dashes.** No charity framing. Never "co-design" (it is *designed in community*).
- **Claim ceiling:** scabies → RHD is the *why*, never a claimed health outcome.
- **Ownership is a pathway**, never claimed complete.
- Facility demand is **interest and requests**, never signed agreements.
- REAL is **applied, not secured**, at ~$2M over 3 years.
- The inter-entity agreement is **being formalised, completion in progress** — never present tense.

## 10. Open loose ends (honest)

1. **$0 of the $475K stack is signed** as at 2026-07-25, against a 31 August deadline. This is the
   only thing on the list that actually matters.
2. **The $324 is modelled.** The measured run converts it. Until then, never soften it.
3. **Butterfly receipting:** confirm the mechanics before printing "tax-deductible today" on any
   donor-facing surface. A wrong deductibility claim is an ATO problem, not a copy problem.
4. **Brand vs entity:** the master brand is "Goods." and the charity arm is "Goods on Country",
   but the legal entities are The Butterfly Movement Ltd and A Curious Tractor Pty Ltd. Reconcile
   the names against the entity doors before external print.
5. **Maningrida consent evidence** is cleared by Ben ruling but the evidence itself is not yet
   pointed at from the repo. Name where it lives so a future session can verify rather than trust.
6. The old `.pen` decks are archived, not deleted. `Goods_Funder_Pathways_Deck.pen` is flattened
   artwork and cannot be edited: rebuild from `slides-source.html` if a Pencil version is wanted.

## 11. What "finished" looks like for next week

The deck renders clean at 12/12 on the overflow gate, the map is chrome-free at canon, the
stage/module language is identical across Notion, the website and the deck, and every figure in
the room can be traced to `canon.ts` or `cost-story.ts` with its honesty label attached.

**Three artifacts, one model:** Notion is the diligence read · the 12-slide deck is the room ·
the Pathway Board is what gets left on the table.
