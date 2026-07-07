# QBE Area 3 — Business Model (meeting page-body)

Date: 2026-05-29
Owner: Ben
Diagnostic score: current 4, target 7, gap 3 (Priority gap)
Notion record: https://www.notion.so/36eebcf981cf81fb8aa8de54f38bdeb4

## Summary

Goods is transitioning from relationship-led, funded delivery to a repeatable product business — and the Stretch Bed is the commercial anchor that makes that real. The bed is a genuine purchasable product at AU$750 (`stretch-bed-single`), with live Stripe checkout that validates price server-side, an admin launch checklist, and QR/asset reporting behind it. We have a clearer cost picture than the diagnostic pre-read assumed: direct materials AU$469.79 on the Defy-kit path, ~AU$534.79 with assembly and freight, AU$600 fully-loaded at today's low volume, and a factory-path direct cost of AU$275.74 (all modelled with source-backed inputs). The honest gap is not demand — the diagnostic validated multiple channels — it is the investor-ready packaging layer: a founder-approved buyer sheet, route pricing, a clean LOI tracker, and top-down market sizing. We should say plainly that the repeatable model is not fully proven yet, and that is exactly what the next phase builds.

## Where we are vs what the diagnostic flagged

The diagnostic asked for four things "still needed before external use": a buyer sheet, route pricing, a clean LOI tracker, and market sizing. Since V4 we have built the analytical scaffolding for the first two — a four-lane buyer segment map (funded community batches, institutional procurement, community-partner/trust pathway, direct ecommerce/sponsor) and a Stretch Bed buyer sheet v0.2 in Notion covering product, price/cost frame, freight bands, what-the-buyer-gets, and offer tiers (pilot 20 / community 50–100 / program 250+). Both are drafts, not founder-signed external collateral. Route pricing exists only as planning bands (road AU$600–700, island/barge AU$715–815, very remote AU$1,005–1,105 per bed) and must not go out as formal quotes until route, stock, warranty/support and contracting party are confirmed. The LOI tracker and market sizing are still genuinely missing — the CRM shows AU$3.42M active pipeline / AU$604,040 weighted, but that is internal only and is NOT committed capital or QBE match evidence. The real work now is founder-authored collateral, signed evidence and cleaned copy — not more narrative.

## Priorities (next builds)

1. Founder-approved Stretch Bed buyer sheet (P0) — price, freight, warranty/support, contracting party, delivery timing, QR reporting on one page. Reconcile old AU$560/600/650 frames to the live AU$750.
2. Price and freight matrix (P0) — road / barge-island / very-remote quoting, labelled modelled, so buyer conversations stop relying on mixed legacy assumptions.
3. Clean LOI tracker (P0) — status ladder target → warm → verbal → draft LOI → signed LOI → contract → cash; this is what converts pipeline into something QBE Stage 2 can assess.
4. Buyer segment model + adjacent market scan (P1) — unit economics and sales effort per lane, then top-down remote-Australia and adjacent (disaster/humanitarian/agribusiness) sizing as the QBE skilled-volunteering project.

## Public copy risk for this area

- "600+ beds" on `/partner` and shared funder content must distinguish legacy Basket Beds from current Stretch Beds (register: 496 deployed bed units, 270 Stretch Bed quantity of which 133 deployed).
- `/partner` shared content implies cost-to-make is well below AU$750 "thanks to On-Country HDPE processing" — tighten: AU$600 fully-loaded is modelled and on-country processing is the pathway, not always current production (current HDPE supplier is Defy, Sydney).
- Do not present order-table totals (AU$90 clean / AU$115,380 noisy with tests, cancelled and legacy `weave_bed` rows) as ecommerce revenue proof.
- Do not blend grants, capital, procurement and product sales into one commercial-revenue claim.
- Do not claim standing inventory (count 0; latest production snapshot 2026-03-27 shows 4 beds possible) or community-owned/on-country production as structurally complete.

## Proof links

- Full review: `wiki/outputs/2026-05-28-qbe-area-03-business-model-full-review.md`
- Canonical numbers: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Cross-area alignment: `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- Cost model (Area 04, forthcoming): `wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md`
- Product truth: `v2/src/lib/data/products.ts`; cost inputs: `v2/src/lib/data/supplier-quotes.ts`
- Live surfaces: `/shop/stretch-bed-single`, `/api/checkout`, `/admin/orders/launch-checklist`, `/admin/cost-model`, `/admin/production`
- Notion record: https://www.notion.so/36eebcf981cf81fb8aa8de54f38bdeb4
