# QBE Canonical Numbers Sheet

Date: 2026-05-29
Local time checked: 2026-05-29 09:57 AEST
Status: Internal source-of-truth sheet for founder review before external use
Purpose: Stop 369+, 496+, 520+, 600+, AU$405K, AU$445K, AU$684K, AU$732K and AU$3M from being mixed without definitions.

## The Rule

Use precise dated numbers when speaking to QBE, SIH, funders or investors. Do not collapse row counts, quantity counts, pipeline values, Xero workpapers and received funding into one headline.

Every external number needs:

- definition;
- source;
- date/time checked;
- evidence label;
- permission to use externally.

## Meeting-Ready Numbers

| Number | Say this | Source | Evidence label | External-use status |
|---:|---|---|---|---|
| 496 | 496 deployed bed units are tracked in the register. This includes current Stretch Beds and legacy Basket Beds. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST; product/status quantity rollup. | verified internal | Usable if "deployed bed units tracked" is stated. |
| 520 | 520 bed asset rows are in the register. This is row count, not shipped quantity. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST. | verified internal | Usable only as "bed asset records", not "delivered beds". |
| 633 | 633 bed units are recorded across Stretch Bed and Basket Bed statuses. This includes deployed, ready, allocated, requested and demo. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST. | verified internal | Do not use as "shipped" or "delivered". |
| 674 | 674 total product quantity is recorded across beds and washing machines. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST. | verified internal | Internal/admin only unless explained. |
| 523 / 524 | 523 deployed asset rows, representing 524 deployed product quantity. Includes beds and machines. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST. | verified internal | Usable only if "all products" is stated. |
| 27 | 27 community records exist in admin; 7 are active, 1 testing, 15 prospect, 3 administrative, 1 exploring. | Direct v2 Supabase `communities`, 2026-05-29 09:59 AEST. | verified internal | Use "community records", not "active communities". |
| 10 | 10 communities are represented in asset records. | Direct v2 Supabase `assets`, 2026-05-29 09:59 AEST. | verified internal | Better external wording than stale "8 communities" if founder accepts. |
| AU$750 | Active Stretch Bed shop product price is AU$750 for `stretch-bed-single`. | Direct v2 Supabase `products`, 2026-05-29 10:00 AEST. | verified internal | Usable as current shop price. |
| AU$732,210.79 | ACT-GD active ACCREC invoices in the ACT infra Xero mirror total AU$732,210.79. | Direct ACT infra Supabase `xero_invoices`, 2026-05-29 09:59 AEST. | verified workpaper | Do not call audited Goods revenue. |
| AU$649,710.79 | Paid amount within those ACT-GD active ACCREC invoices. | Direct ACT infra Supabase `xero_invoices`, 2026-05-29 09:59 AEST. | verified workpaper | Use only with Xero mirror/workpaper caveat. |
| AU$82,500 | Authorised but still due ACT-GD invoice amount. | Direct ACT infra Supabase `xero_invoices`, 2026-05-29 09:59 AEST. | verified workpaper | Use only with invoice/payment status caveat. |
| AU$3,418,698 | Active CRM pipeline value across 23 active deals. | Direct v2 Supabase `crm_deals`, 2026-05-29 09:59 AEST. | verified internal | Internal only. Not committed capital. |
| AU$604,040 | Probability-weighted active CRM pipeline. | Direct v2 Supabase `crm_deals`, 2026-05-29 09:59 AEST. | modelled/internal | Internal only. Not QBE match evidence. |
| AU$898,863 | CRM won deal value across 20 won deals. | Direct v2 Supabase `crm_deals`, 2026-05-29 09:59 AEST. | verified internal | Workpaper only, not audited revenue. |
| 885 | Open demand quantity in community rollup. | Direct v2 Supabase `community_rollup`, 2026-05-29 09:59 AEST. | modelled/internal | Internal only unless source rows are attached. |
| AU$4,254,512 | Open demand value in community rollup. | Direct v2 Supabase `community_rollup`, 2026-05-29 09:59 AEST. | modelled/internal | Internal only. Not pipeline, orders or commitments. |

## Asset Register Reconciliation

| Basis | Count | What it means | Safe wording |
|---|---:|---|---|
| Asset rows | 561 | One database row per tracked asset record. | "561 asset records in the register." |
| Asset quantity | 674 | Sum of `quantity`; some rows represent more than one unit. | "674 product units recorded across statuses." |
| Deployed asset rows | 523 | Rows with `status = deployed`. | "523 deployed asset records." |
| Deployed quantity | 524 | Quantity sum for deployed records. | "524 deployed products tracked." |
| QR URL rows | 558 | Rows with `qr_url`. | "558 asset records have QR URLs." |

Product breakdown:

| Product | Rows | Quantity | Deployed quantity | Notes |
|---|---:|---:|---:|---|
| Stretch Bed | 157 | 270 | 133 | Current flagship. Quantity includes requested/allocated/ready/demo as well as deployed. |
| Basket Bed | 363 | 363 | 363 | Legacy/open-source bed. Good historical proof, but do not imply current Stretch Bed production. |
| Washing Machine | 41 | 41 | 28 | Prototype/fleet proof, not for direct sale. |
| Total | 561 | 674 | 524 | Includes all tracked products. |

Status breakdown by quantity:

| Status | Quantity | Comment |
|---|---:|---|
| Deployed | 524 | Live deployed product proof. |
| Ready | 20 | Inventory/ready state, not delivered. |
| Allocated | 6 | Allocated, not delivered. |
| Requested | 108 | Demand/request signal, not delivered. |
| Demo | 3 | Demonstration stock. |
| Under investigation | 3 | Machine investigation records. |
| Retired | 10 | Retired assets. |

## Community Numbers

| Basis | Count/value | Source | External-use rule |
|---|---:|---|---|
| Community records | 27 | `communities` table | Say "community records" unless cleaned. |
| Active community records | 7 | `communities.status = active` | Usable as admin status, not necessarily delivery footprint. |
| Communities represented in asset records | 10 | Distinct asset community/community_id | Better proof for delivery footprint. |
| Deployed beds in rollup | 496 | `community_rollup` | Matches asset-derived deployed bed quantity. |
| Deployed machines in rollup | 28 | `community_rollup` | Prototype/fleet proof. |
| Open demand quantity | 885 | `community_rollup` | Internal/modelled unless source rows are attached. |
| Open demand value | AU$4,254,512 | `community_rollup` | Internal/modelled; do not call committed revenue. |
| Active community pipeline in rollup | AU$1,236,300 | `community_rollup` | Internal pipeline only. |
| Won community revenue in rollup | AU$236,016 | `community_rollup` | CRM/admin mirror, not audited accounts. |

## Finance Numbers

| Number | Basis | Source | External-use rule |
|---:|---|---|---|
| AU$732,210.79 | ACT-GD active ACCREC invoice total, 17 invoices. | ACT infra Supabase `xero_invoices`, direct query. | Use only as Xero mirror/workpaper figure, not audited Goods revenue. |
| AU$649,710.79 | Paid amount across the same active ACT-GD invoices. | ACT infra Supabase `xero_invoices`, direct query. | Use with "paid in Xero mirror" caveat. |
| AU$82,500 | Authorised/due amount. | ACT infra Supabase `xero_invoices`, direct query. | Use with invoice status caveat. |
| AU$684,911 | May 12 Goods model baseline after excluding Ingkerreke invoices. | `wiki/outputs/2026-05-12-xero-day1-reconciliation.md`; Area 04 review. | Superseded as a live Xero total, but still important model baseline. |
| AU$537,595 | Older SIH diagnostic/revenue anchor. | Diagnostic and earlier workpapers. | Do not use as current. Say superseded. |
| AU$405,685 | Source-trail received funder/program subtotal. | `wiki/articles/capital/funder-register.md`. | Needs finance reconciliation; do not mix with invoice revenue. |
| AU$445K | Older funder/shared copy and QBE prep references. | `v2/src/lib/data/funder-shared-content.ts`; older outputs. | Do not use until reconciled. |
| AU$778,162 | Grant-content boilerplate claim. | `v2/src/lib/data/grant-content.ts`. | Do not use externally. Requires review. |

Recommended finance wording:

"Our finance workpapers show ACT-GD active receivable invoices of AU$732,210.79 in the Xero mirror, including AU$649,710.79 paid and AU$82,500 still due. These are workpaper figures, not accountant-reviewed Goods statutory accounts. The investor pack still needs a Goods-only 3-statement model and accountant-reviewed summary."

## CRM / Capital Pipeline Numbers

| Metric | Current value | Source | External-use rule |
|---|---:|---|---|
| CRM deals | 43 | `crm_deals` | Internal operating proof. |
| Active deals | 23 | `crm_deals` stages lead/qualified/proposal/negotiation | Internal pipeline only. |
| Won deals | 20 | `crm_deals.pipeline_stage = won` | Admin mirror; reconcile to finance before external use. |
| Active pipeline | AU$3,418,698 | `crm_deals.amount_cents` active stages | Do not call committed capital. |
| Active weighted pipeline | AU$604,040 | Amount x probability | Modelled/internal. |
| Won CRM value | AU$898,863 | Won deals | Not audited revenue. |
| Active funding pipeline | AU$3,125,000 | `deal_type = funding`, active stages | Not QBE match evidence. |
| Won funding value | AU$572,140 | `deal_type = funding`, won stage | Reconcile to funder receipts before external use. |
| Won sale value | AU$289,776 | `deal_type = sale`, won stage | Reconcile to invoices/orders before external use. |
| Active units | 41 | Active CRM deals | Not committed units unless deal proof attached. |
| Won units | 491 | Won CRM deals | Useful but reconcile to assets/invoices before external use. |

Important staleness flag:

The active CRM deals queried had `updated_at` values between 2026-03-26 and 2026-03-27. Refresh before using the pipeline in a live demo or investor pack.

## Ecommerce / Orders

| Metric | Current value | Source | External-use rule |
|---|---:|---|---|
| Order rows | 30 | `orders` | Internal only. |
| Cancelled orders | 26 | `orders.status` | Shows test/archive noise. |
| Refunded orders | 1 | `orders.status` | Shows test/archive noise. |
| Paid order rows not cancelled/refunded | 3 | `orders` | Only AU$90 total; not material commercial proof. |
| Open/live paid order total after excluding cancelled/refunded/test notes | AU$90 | `orders` | Do not use as sales proof. |

Recommended wording:

"Stripe/shop is live operationally, but ecommerce order data is not yet a meaningful traction number. Use institutional/buyer/funder proof instead."

## Production / Inventory Numbers

| Metric | Current value | Source | External-use rule |
|---|---:|---|---|
| Production shifts | 19 | `production_shifts` | Internal operating proof. |
| Latest production shift | 2026-03-12 | `production_shifts` | Stale; refresh before demo. |
| Sheets produced logged | 94 | `production_shifts` | Internal proof only. |
| Beds assembled logged | 0 | `production_shifts` | Do not use as production output. |
| Latest inventory snapshot | 2026-03-27 | `production_inventory` | Stale; refresh before investor use. |
| Beds possible in latest inventory | 4 | `production_inventory` | Internal only and stale. |

Recommended wording:

"Production/admin systems exist, but latest production and inventory snapshots need a refresh before being shown as current capacity."

## Product Truth

Use `v2/src/lib/data/products.ts` as product-spec source of truth.

| Product fact | Canonical value | Source |
|---|---|---|
| Flagship product | The Stretch Bed | `STRETCH_BED` static product data |
| Product status | Available | `STRETCH_BED.status` |
| Current shop slug | `stretch-bed-single` | v2 Supabase `products` table |
| Current shop price | AU$750 | v2 Supabase `products.price_cents = 75000` |
| Weight | 26kg | `STRETCH_BED.specs.weight` |
| Load capacity | 200kg | `STRETCH_BED.specs.loadCapacity` |
| Dimensions | 188 x 92 x 25cm | `STRETCH_BED.specs.dimensions` |
| Assembly time | about 5 minutes | `STRETCH_BED.specs.assemblyTime` |
| Tools required | None | `STRETCH_BED.specs.toolsRequired` |
| Design lifespan | 10+ years | `STRETCH_BED.specs.designLifespan` |
| Plastic diverted | 20kg HDPE per bed | `STRETCH_BED.specs.plasticDiverted` |
| Current HDPE supplier | Defy Design, Sydney | `STRETCH_BED.materials.legs.supplier` |
| On-country HDPE | Future/pathway unless tied to a specific operating batch | `STRETCH_BED.materials.legs.supplier` |

Do not use stale Supabase product rows for Basket Bed or Weave Bed copy. The product table still contains inactive legacy rows with old claims such as 40% community share, hardwood/woven cord materials, and `weave_bed`. Those should stay out of external materials.

## Public Copy Replacements

| Current copy | Problem | Replace with |
|---|---|---|
| 369+ beds delivered | Stale public copy in `/pitch`, `/story`, `/community`. | "496 deployed bed units tracked as of 29 May 2026" or founder-approved rounded version. |
| 520+ beds across Australia | Ambiguous: row count, not necessarily delivered quantity. | "520 bed asset records in the register" for admin; use 496 deployed bed units for delivery proof. |
| 600+ beds shipped | Overstates direct deployed proof unless carefully explained. | "633 bed units recorded across deployed, ready, allocated, requested and demo statuses; 496 deployed." |
| $445K grant funding to date | Conflicts with AU$405,685 source-trail subtotal and Xero workpapers. | "Received funding is being reconciled; current source-trail subtotal is AU$405,685." |
| $778,162 in grant funding received | Appears in grant boilerplate and is not safe. | Remove until finance reviewed. |
| ~$3M capital stack target, close mid-2026 | Too definite for current state. | "Blended capital stack under development; active CRM pipeline is internal and not committed capital." |
| Active pipeline / committed buyer pipeline | Pipeline is not a commitment. | "Active pipeline under review; signed LOIs/contracts are still required." |
| DGR1 status | Goods DGR status is not verified; Butterfly pathway is separate. | "Butterfly DGR pathway under legal/governance transition review." |
| Community-owned production / ownership transfer | Future legal pathway, not current state. | "Community ownership pathway; legal/entity/IP structure to be settled." |

## Recommended Meeting Script

"For tomorrow, I would use precise dated numbers. The register currently shows 496 deployed bed units, 520 bed asset records, 633 bed units recorded across all bed statuses, and 674 total product units including washing machines. The Xero mirror shows AU$732,210.79 of ACT-GD active receivable invoices, but those are workpaper figures, not accountant-reviewed Goods accounts. The CRM shows AU$3.42M active pipeline, but that is not committed capital or QBE match evidence. The next artifact is the LOI tracker, because that is what turns pipeline into something QBE can assess."

## Query Evidence

Direct v2 Supabase project queried: `cwsyhpiuepvdjtxaozwf`.

Direct ACT infra Supabase project queried for Xero mirror: `tednluwflfhxyucgwigh`.

No Supabase MCP calls were used.

Queries reviewed:

- `assets`: rows, quantity, product, status, QR URL coverage.
- `communities`: status and state counts.
- `community_rollup`: deployed beds/machines, demand, active pipeline, won revenue.
- `crm_deals`: stage/type counts, active/won values and units.
- `orders` and `order_items`: ecommerce order status and test/noise check.
- `production_shifts` and `production_inventory`: production staleness.
- `products`: active Stretch Bed shop price and stale legacy product rows.
- `xero_invoices`: ACT-GD active ACCREC workpaper totals.
