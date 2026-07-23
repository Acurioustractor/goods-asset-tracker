# Area 5 — Diagrams and model drawings

> Inventory of every diagram / model drawing the pitch uses or needs. Compiled 2026-07-20 by
> scanning `design/deck-photos/`, `design/deck-assets/`, `design/brand/goods-diagrams/`,
> `v2/public/images/brand/`, `v2/src/app/admin/system-visuals/`, and the funder deck HTML.
> Canon reference (9f2d7b9): 540 beds / 177 Stretch / 22 washers / 11 communities / 3,540kg HDPE /
> $713,827 Goods-only revenue / $685 marginal today (measured) / $426 in-house model (modelled) /
> break-even 333-338 beds per yr (modelled). Figures below verified by reading each image file.

## A. Money and model charts (computed, cost model v6)

All four verified by opening the PNGs. Sources: `scripts/generate_goods_sankey_money.py`,
`scripts/generate_goods_cost_curve.py` and siblings; deck copies live in `design/deck-photos/`
(synced by `sync-pencil-photos.mjs` from `design/deck-assets/`).

| Diagram | File (deck copy / master) | Shows | Figures on the image | Canon check |
|---|---|---|---|---|
| Break-even | `design/deck-photos/breakeven.png` / `design/deck-assets/goods-breakeven.png` | Contribution lines vs $109,500/yr fixed block; in-house crosses at ~335 beds, buy-kit ~1,679 | "~333-338 beds/yr", $109,500, $750 price, cost model v6 cited | MATCHES canon (modelled, labelled on image) |
| Money Sankey | `design/deck-photos/sankey.png` / `goods-sankey-money.png` | Income statement as a flow at 500 beds/yr in-house: $375,000 revenue -> COGS $137,870 + freight $75,000 + contribution $162,130 -> fixed $109,500 + surplus $52,630 | v6 in-house path, all modelled | MATCHES canon (modelled scenario, labelled) |
| Cost-down curve | `design/deck-photos/cost-curve.png` / `goods-cost-curve.png` | Experience curve: Buy-Kit $684.79 (today) -> Factory $425.74 (modelled target) -> Community $420.74; dashed illustrative tail to ~$390/$360 | $685 measured today, $426 modelled, dashed tail labelled illustrative | MATCHES canon; claims-status labels already printed on the image |
| Where each $750 goes | `design/deck-photos/where-750.png` / `goods-where-750-goes.png` | Two stacked bars, Buy-Kit vs Factory: keeps $65 vs $324 contribution per bed | Marginal $685 vs $426, v6 cited | MATCHES canon |

Also in `design/deck-assets/` (not in the deck-photos sync, verify before reuse):
`goods-anatomy-bed.png`, `goods-bed-anatomy.jpg`, `goods-bed-assembly.jpg`. Related generator
scripts exist for more charts not currently in the deck: idiot index, marginal-vs-fixed,
operating model, scenarios, cost explainers, theory of change (`scripts/generate_goods_*.py`).

## B. Explainer diagrams and illustrations (drawn)

| Diagram | File | Shows | Canon check |
|---|---|---|---|
| Assembly sequence | `design/deck-photos/assembly-sequence.png` (manifest source: `v2/public/images/product/stretch-bed-overview.png`) | Full X-trestle tension design explainer: 3 component types, 5 assembly steps (0:00-4:52), "the clever bit" (canvas is structural), no tools | MATCHES product canon (X-trestle, no clip-on language). Verified by reading the image |
| Plastic loop | `design/deck-photos/plastic-loop.jpg` (from `design/deck-assets/goods-plastic-journey.jpg`) | 6-step circular life of the plastic: collect -> shred -> hot-press -> CNC-cut X-legs -> assemble -> into community; "20kg diverted per bed" | Figures fine (20kg is canon). CAUTION: this is the 6-step loop; the signed strategy deck uses a 5-step loop. That conflict is already flagged for Ben (Area 8 / .pen alignment ledger). Do not regenerate until he rules |
| Community ownership pathway | `design/deck-photos/community-ownership.png` (from `goods-community-ownership-v2.png`) | 3 stages: Buy-Kit (today) -> On-Country plant -> Community-owned; "our goal is to become unnecessary" | Framing correct: ownership drawn as a pathway (proposed), not claimed complete. No stale figures |
| Communities map | `design/deck-photos/map.png` (from `v2/public/images/qbe/communities-screen.png`) | Australia map with per-place bed counts | **NEEDS REGEN — STALE.** Shows "496 beds across 9 places"; Tennant 159, Utopia 147, Maningrida 18, no Kununurra, no Katherine. Canon is 540 beds / 11 communities (12 touched) with the 2026-07-19 rulings. It is a screenshot of an older admin screen; re-screenshot after the register sweep, or draw a proper map |
| Area illustrations | `design/deck-photos/area-07-governance.png`, `area-08-people.png`, `area-09-ownership.png`, `area-12-alignment.png` (from `design/generated-images/goods-illustrations/qbe-*/`; `area-05-risk.jpg` is a photo slot) | Brand-style concept illustrations for QBE narrative areas (governance sign-off, jobs on country, plant handover, alignment matrix) | No figures embedded; no canon risk. Source `design/generated-images/` is gitignored / local-only |

## C. Brand illustration library (site + collateral)

`v2/public/images/brand/` — the goods-illustrations hand (cream ground, clay-brown line,
terrazzo speckle for recycled plastic):

- Committed set: `goods-ill-assembly.png`, `goods-ill-canvas.png`, `goods-ill-leg.png`, `goods-ill-plant.png`, `goods-ill-plastic-loop.png`, `goods-ill-poles.png`, `goods-ill-washing-machine.png`, plus product studies (`goods-bed-studio-v3.png`, `goods-leg-studio-v1.png`, `goods-20kg-plastic-one-bed.png`, `goods-canvas-swatch-v1.png`, `goods-plastic-loop-v1.png`) and style refs (`goods-styleref-hatch.png`, `goods-styleref-speckle.png` — the locked hand).
- `v2/public/images/brand/generated/`: `goods-ill-containers-fund-containers.png`, `goods-ill-flywheel.png`, `goods-ill-health-chain.png`, `goods-ill-how-its-made.png`, `goods-ill-impact-per-bed.png`, `goods-ill-markup-gap.png`, `goods-ill-plastic-loop.png`, `goods-ill-x-leg.png`.
- **HELD:** `goods-ill-health-chain.png` stays out of every external cut (oversold causal claim; scabies to RHD is the why only, per the canonical impact model `wiki/outputs/2026-06-18-goods-impact-framework.md`).
- Review surface: `/admin/system-visuals` (`v2/src/app/admin/system-visuals/page.tsx`) inventories every brand image, generated set and deck-photo slot.
- How new diagrams get made: the `goods-diagrams` skill at `design/brand/goods-diagrams/SKILL.md` — picture generated by the image model steered by `goods-styleref-speckle.png`; exact labels and numbers overlaid in the kit (`assets/diagram-template.svg`), never trusted to model-drawn text.

## D. Where they are used

- Funder deck `design/goods-funder-deck.html` and the .pen deck / one-pagers pull the `design/deck-photos/` slots (manifest `_manifest.json`, synced by `sync-pencil-photos.mjs` from `design/canon-resolved.json`). Slots used: assembly-sequence, plastic-loop, community-ownership, map, cost-curve, breakeven, sankey, where-750, area-05/07/08/09/12, logos.
- Deck HTML text was swept to 540/177/20/11/3,540 on 2026-07-20 (Area 8); the four money charts and break-even figures on the images themselves match (verified above). The single stale image is the map.
- Site/admin: brand illustrations appear via `/admin/system-visuals`; cost charts also live natively in `/cost-story` and the cost-model skins (computed in React, not from these PNGs).

## E. Not yet drawn (gaps the pitch still lacks)

1. **Communities map at final canon** — the only NEEDS REGEN item; 540 / 11 with Kununurra and Katherine on it. Highest priority.
2. **QBE match mechanics** — how signed external capital (SEFA et al) stacks to unlock the up-to-$400K QBE tranche; two-bar "evidence vs disbursement" distinction (proposed).
3. **Ownership transfer mechanics** — the community-ownership image is the story arc; there is no diagram of the actual staged transfer (entity, plant title, jobs, margin) once the structure is settled. Blocked on the entity / 51% First Nations ownership decision.
4. **Revenue triangle** — $741,111 site figure vs $713,827 signed carve-out vs AR; Area 2 flags the label conflict, a one-look diagram would settle it for funders (measured, accountant-signed).
5. **Impact model one-pager visual** — the canonical 5 domains + 3 shifts (`2026-06-18-goods-impact-framework.md`) has no drawn form; the health-chain illustration is held, so a claim-safe version (why-framing only) is still missing.
6. **Washer story diagram** — Pakkimjalki Kari has photos but no explainer (why remote machines fail, what the Speed Queen base changes). Prototype status must be labelled (observed/requested only).
7. **Plastic loop, ruled version** — regenerate as 5 or 6 steps once Ben rules on the loop-step conflict; until then the existing image stands.

Status: DRAFT 2026-07-20. One regen flagged (map), zero regens attempted.
