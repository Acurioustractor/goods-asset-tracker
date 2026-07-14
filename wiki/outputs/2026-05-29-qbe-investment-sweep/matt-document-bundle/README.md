# Goods on Country — Costing Data Bundle for Unit-Cost Model

**Prepared for:** Matt (QBE Catalysing Impact advisor)
**Prepared by:** Goods on Country
**As-of:** 2026-05-29
**Purpose:** the document bundle requested — quotations, parts lists, materials lists, and costing information — plus this provenance index describing where every figure comes from and how current it is.

---

## Orientation

**Goods on Country** is a social enterprise delivering quality furniture to remote Indigenous communities across Australia. The flagship product is the **Stretch Bed**: a washable, flat-packable bed built from recycled HDPE plastic legs, two galvanised steel poles, and a heavy-duty Australian canvas sleeping surface. It weighs 26kg, carries 200kg, packs to 188×92×25cm, assembles in ~5 minutes with no tools, and diverts ~20kg of HDPE plastic from landfill per bed.

A Stretch Bed can be built four different ways, and **which method we use is the single biggest driver of unit cost.** The four manufacturing methods are:

1. **Buy-Kit (Defy finished kit)** — Defy Design (Sydney) shreds, presses, CNC-routes and finishes the HDPE legs; we assemble. No capital required. This is what we do today.
2. **Buy-Panels (Defy pre-pressed panels)** — Defy shreds + presses; we CNC + assemble. Worst value (we pay press margin but still finish the part).
3. **Factory in-house** — we run the whole chain (raw shred → press → CNC → assemble) at our own containerised plant. Requires capital but collapses the plastic cost.
4. **Community-owned** — same factory, but feedstock is community-collected waste plastic and labour is a **$130/bed fair wage**. Vision state — lands at ~parity with the factory ($270.74 vs $275.74); the wage and the margin stay community-owned.

**The big question for your model:** how does **containerisation** (bringing pressing + CNC in-house at a mobile/owned plant) change the economics? The headline answer is that buying finished HDPE legs from Defy costs **$344.05/bed** against a raw-material floor of ~$40–55/bed — an "idiot index" of 8.6x. In-sourcing the leg-making moves roughly **$194/bed** at the materials level and captures ~$289/bed of supplier margin.

**The unit-cost levers you'll want to model** (all four interact):
- **Production location** — Sydney (Defy) vs Sunshine Coast facility vs on-country plant
- **Manufacturing method** — the 4 methods above (Buy-Kit / Buy-Panels / Factory / Community)
- **Shipping / freight** — long-haul freight (~$150/bed) is variable, not overhead; local freight ~$25/bed
- **Labour** — Defy assembly $55.95/bed vs in-house factory labour $80/bed vs community $130/bed (fair wage)

A note on what "cost" means here. The **marginal** cost to make one more bed today (Defy-kit path, incl. freight) is ~**$685**. The **fully-loaded** planning cost at our current low volume (~100/yr) is ~**$600** (FRRR/Day-4 anchor). A **naive** divide-the-whole-annual-block-by-100-beds calc produces ~$1,780 — that figure is arithmetically real but misleading, because it loads a fixed annual cost block onto an artificially small denominator and miscategorises variable freight as overhead. The model files below separate marginal cost, fixed block, and breakeven so you don't have to untangle that.

---

## Provenance index — every file in this bundle + the live model

| File | What it is | Source | As-of | Confidence | Up-to-date notes |
|---|---|---|---|---|---|
| `README.md` | This provenance index + orientation | Compiled from the files below | 2026-05-29 | — | The map; start here |
| `01-bill-of-materials.md` | Stretch Bed parts/materials list, summed to $469.79 direct materials (Defy-kit path) + bed spec | `v2/src/lib/data/supplier-quotes.ts` (`stretchBedBOM`); `products.ts` (spec) | 2026-05-28 | Mostly **verified** (bolts inferred) | Reconciled to actual invoices via deep OCR 2026-05-28. Current. |
| `02-supplier-quotes.md` | Each supplier quote as a row: price, MOQ, lead-time, validity, Xero ref | `v2/src/lib/data/supplier-quotes.ts` (`supplierQuotes`) | 2026-05-28 | **verified** / **active** (Envirobank pending) | Defy + Centre Canvas quotes valid to 30 Jun / 31 Dec 2026. DNA Steel + Centre Canvas invoices live in Notion, not the Xero mirror. |
| `03-cost-model-and-build-paths.md` | 4 manufacturing methods, idiot index, factory economics, capex, containerisation payback | `wiki/outputs/2026-05-29-qbe-investment-sweep/01-cost-model-idiot-index.json` (v6); `cost-model-scenarios.json` (v6) | 2026-05-30 | **verified inputs / modelled totals** | v6 current: community fair-wage reframe ($270.74, $130/bed wage); founder rate LOCKED at $560/day; fixed block $109,500; breakeven 338/1,679. |
| `04-verified-financials.md` | Verified actuals base: revenue, expenses, AP, GST, capex, founder time, entity | Live Xero cross-check 2026-05-29 (per investment-sweep area-4); `cost-model-scenarios.json` | 2026-05-29 | **verified** actuals, with open accountant items flagged | Honest + conservative. ~89% grant-funded, not audited. Open items listed in-file. |
| `../Goods-Playable-Model-v2.1.xlsx` | **THE interactive model** — playable, balancing 36-month 3-statement (pull a dial, all three statements re-flow) | Goods playable model build (v2 → v2.1) + v6 cost model | 2026-05-30 | mixed (verified actuals + modelled forecast) | The model to open first. Balances every month (recalc-verified, max dev 2e-10); QBE + philanthropy capital injections wired into the cash line; carries a "Founder Inputs to Close" agenda tab. **Supersedes `Goods-Financial-Model.xlsx` (now archived) — the hi@act.place Drive sheet must be replaced with this file.** Companion audited workpaper: `../Goods-3-Statement-Model-v0.3.xlsx`. |

**Companion model files in the parent sweep folder** (`../`), if you want the full working set:
- `Goods-3-Statement-Model-v0.3.xlsx` — audited 3-statement workpaper / trust layer (**v0.3, 2026-05-30**: revenue-reconciliation bridge + breakeven-note correction (378/1,882→338/1,679) + QBE-cap relabel; see `Goods-3-Statement-Model-v0.3.provenance.md`). Its **"Founder Inputs to Close"** tab is the finance-chat agenda.
- `Goods-Investor-Alignment-Tool-2026.xlsx` — capital-raise alignment tool
- _Superseded workbooks (Playable v1/v2, Goods-Financial-Model, 3-Statement v0.1/v0.2, Bed-Cost-Model-v6) are in `../_archive/2026-05-30-superseded-workbooks/` — see its `RESTORE.md`._
- `01-bed-cost-model-reconfigured.md` — the long-form v6 cost narrative
- `area-4-financial-management.md` — the full financial-management deep-dive behind `04-...md`

---

## Confidence labels used throughout

| Label | Meaning |
|---|---|
| **verified** | Tied to a source document — a Xero/Defy/Centre Canvas/Coastal Fasteners invoice, or the canonical Notion BOM. Cited inline. |
| **modelled** | Built up from verified inputs but the total is a calculation, not an invoice (e.g. factory direct cost = verified materials + estimated labour/diesel allocation). |
| **inferred** | Derived from available data, not directly confirmed (e.g. bolt rate estimate). |
| **target / future** | A planned state contingent on capital and/or committed volume, not yet contracted. |
| **unverified** | No second source; flagged for founder confirmation (e.g. founder day-rate, founder days/yr). |

**Do-not-fabricate guarantee:** every dollar figure in this bundle traces to one of the five source files read on 2026-05-29. Nothing here is invented. Where a number is an estimate or a planning anchor, it is labelled as such.
