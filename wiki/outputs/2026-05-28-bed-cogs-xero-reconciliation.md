# Bed COGS — canonical BOM vs live Xero actuals reconciliation

**Date:** 2026-05-28
**Author:** Claude (Goods session), corrected with Ben's domain input
**Question:** What does a Stretch Bed actually cost to make, and does the codebase tell the truth about it?

## Sources (all verified directly)

| Source | What | How |
|---|---|---|
| Notion **"BOM - StretchBed v2"** DB (under StretchBed HQ → Goods. HQ) | canonical per-bed material costs | Notion MCP |
| Notion **FRRR follow-up** (grant application) | production cost at 100 units | Notion MCP |
| ACT-infra Supabase `xero_invoices` (`tednluwflfhxyucgwigh`) | Goods supplier ACCPAY | `curl`, creds in `v2/.env.local` |
| v2 Supabase `assets` (`cwsyhpiuepvdjtxaozwf`) | bed register / denominator | `curl` |
| financial-model Day 4 (2026-05-12) | unit economics by volume | `wiki/outputs/` |

## Headline

The codebase advertised **"$149.20 COGS / 80% margin"** in the admin tooling. That is **materials-only, and the unit costs were wrong**. The truth:

- **Direct materials ≈ $168.70/bed** (corrected): HDPE legs $45 + steel $27 + canvas $93.50 + end caps $3.20.
- **Fully-loaded production cost ≈ $550–650/bed at ~100 units** (FRRR application + financial model). Margin at the $750 website price is therefore **~20%, not 80%.**
- A true *per-unit* COGS is **not recoverable from Xero** — Goods supplier invoices are lump-sum account-coded ("Defy Manufacturing — Materials & Supplies — ACT-GD"), not itemised per component.

## The canonical BOM (Notion "BOM - StretchBed v2")

| Component | Source | $/bed | Supplier |
|---|---|--:|---|
| Gal Pipe (steel) | Alice Springs | **27** | DNA Steel Direct — sales@dnasteeldirect.com.au, 08 8953 7355 |
| Canvas | Alice Springs | **93.50** | Centre Canvas — Wayne, 4 Smith St, 08 8952 2453 |
| BedLeg Sheet Press (HDPE) | Container 1 (facility) | — (made from waste) | Defy / on-country facility |

`supplier-quotes.ts` had **steel $36** (2×$18) and **canvas $65** — both wrong. Now corrected to $27 and $93.50.

## Where the real supply chain lives (Ben, 2026-05-28)

- **Canvas** → Centre Canvas, Alice Springs. Invoices in **Notion**. In Xero there is ONE genuine invoice ("Canvas stretcher covers" $10,285, INV ADG 6524337) but it's **mis-tagged ACT-IN**; the same Xero contact ("Centre Canvas And Upholstery") is also polluted with **Canva software-subscription** lines (a contact-name collision — $4,715 + $10,285).
- **Steel** → DNA Steel Direct, Alice Springs (**real** — my earlier "phantom" call was wrong). Invoices in Notion, not the Xero mirror. Brisbane Steel ($186) + Steelmart ($1,453) are separate Goods-tagged steel buys.
- **Defy** → splits two ways: (a) full-bed **development** (R&D, not per-unit) and (b) **plastic-shred production** for the Sunshine Coast facility. The ~$180k is NOT pure bed BOM.
- **Joseph Kirmos** → Sunshine Coast facility **labour**, "Provision of Labour" @ **$4,500/invoice** (~monthly). 6 invoices; only 3 tagged ACT-GD ($11,738).
- Plus facility **fuel**, freight and overhead.

## The live actuals fetcher (`supplier-cost-actuals.ts`) — fixed

Was wrong three ways; now:
1. Added `project_code=eq.ACT-GD` filter → removes ~$25k of ACT-IN Canva spend that was leaking in.
2. `BOM_SUPPLIERS` corrected to what's actually capturable in ACT-GD: Defy, Defy Manufacturing, Brisbane Steel Supplies, Steelmart.
3. Documented that DNA Steel + Centre Canvas are **real but off this mirror** (Notion) — so the figure is a **lower bound**.

Verified Goods-tagged bed-supplier spend = **$181,575** (37 invoices). All-in directional $/bed = $352 over 516 register beds — but incomplete (no Alice Springs canvas/steel) and the denominator includes Basket beds. Directional only.

## Open / next
1. **Bottom-up facility model** — derive $/bed from first principles: direct materials + (Joseph Kirmos labour + Defy shred + fuel + facility overhead) ÷ throughput (FRRR: ~30 beds/wk deployed; model: ~15/mo). Needs Ben's split of Defy dev-vs-production and a throughput assumption.
2. Pull the Notion canvas/steel **invoices** to verify $27 / $93.50 against actuals and get volumes.
3. Re-tag the canvas invoice ACT-IN → ACT-GD in Xero (and split the Canva-software contact out).

## Changes shipped (code)
- `supplier-quotes.ts`: corrected steel ($27) + canvas ($93.50); reinstated DNA Steel + Centre Canvas as real with contacts; renamed materials concept to `stretchBedDirectMaterials` ($168.70); added `fullyLoadedCostPerBed` ($600) with provenance; `supplierSummary` margin now runs off fully-loaded cost (~20%).
- `supplier-cost-actuals.ts`: `project_code=ACT-GD` filter + corrected supplier list + honest comments.
- `cost-per-batch-card.tsx`, `production/page.tsx`, `library/page.tsx`: show direct materials vs fully-loaded cost; margin headline uses fully-loaded.
