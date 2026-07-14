---
title: QBE Area 03 - Business Model full review
date: 2026-05-28
status: Built - needs founder review
diagnostic_area: "03 - Business Model Clarity and Sustainability"
source_diagnostic: "/Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf"
notion_page: "https://www.notion.so/36eebcf981cf81fb8aa8de54f38bdeb4"
---

# QBE Area 03 - Business Model full review

## Meeting-ready summary

The diagnostic scores business model maturity as a priority gap: current 4, target 7, gap 3. Goods has a real product, validated demand channels, partner/funder proof, live checkout infrastructure, and a clearer COGS model than the diagnostic pre-read had. The missing investor-ready layer is not "does anyone want this?" It is:

- a clean customer segment map with no more than four near-term lanes;
- a product-sales transition plan from funded batches to standing inventory;
- a buyer sheet that answers price, freight, warranty, support, contracting party, delivery timing and QR reporting in one place;
- capacity-to-pay evidence by segment;
- top-down market sizing for remote Australia and adjacent markets.

Use this page to say: Goods is transitioning from relationship-led funded delivery to a repeatable product business. The Stretch Bed is commercially real. The repeatable model is not fully proven yet, and that is exactly what the next phase must build.

## Evidence standard

| Label | Meaning | Use in this area |
|---|---|---|
| `verified` | Source-backed now. | Current Stretch Bed public route, active product row, current specs, admin surfaces, asset register, CRM deal records. |
| `modelled` | Based on a live model or explicit assumption. | COGS, freight bands, scale-cost curves, buyer margins, unit economics. |
| `target` | Intended next state with a plan. | Standing inventory, segment economics, route pricing, LOI conversion. |
| `future` | Not true yet. | Mature resident retail, community-owned production economics, washer/fridge commercial expansion. |
| `internal only` | Useful for thinking, not external copy. | Legacy order rows, messy Xero proxies, cancelled/legacy Stripe orders, old price assumptions not reconciled to the current AU$750 site price. |

## Diagnostic read

The diagnostic says Goods has several validated demand channels: community-controlled health organisations, councils, philanthropy-funded delivery, business/staff purchases, disaster recovery procurement, NDIS and aged-care end users.

It also says Goods needs a transition plan to a product-sales model, including standing inventory, ecommerce, and pricing that reflects margin. It specifically calls for:

- more detailed unit-cost work at different scales;
- clearer understanding of customers' capacity to pay sustainably;
- formalised segmentation around two to three core channels with unit economics, sales effort and projected revenue;
- top-down market quantification for remote Australia and adjacent markets such as agribusiness, disaster recovery, refugee and humanitarian markets.

The diagnostic is not saying the model is weak. It is saying the model needs packaging and evidence discipline.

## What we have now

| Surface | Evidence | Status | Use |
|---|---|---|---|
| `v2/src/lib/data/products.ts` | Canonical product specs: 26kg, 200kg capacity, 188 x 92 x 25cm, about 5 min assembly, no tools, 10+ year design life, 20kg HDPE per bed. | `verified` | Product truth. |
| `/shop/stretch-bed-single` | Public Stretch Bed page with AU$750 display price and Buy Now flow. | `verified` | Buyer/product proof. |
| Supabase `products` | One active customer-facing product: `stretch-bed-single`, `stretch_bed`, AU$750. Active `smoke-test` SKU exists but is hidden/admin-only. | `verified` | Current price/source of truth for checkout. |
| `/api/checkout` | Validates products against Supabase and uses database price, not client-sent price. | `verified` | Ecommerce integrity proof. |
| `/admin/orders/launch-checklist` | Checks Stripe live/test mode, products, webhook, canonical Stretch Bed row, GHL handoff. | `verified` | Launch readiness surface. |
| Supabase `orders` / `order_items` | 30 order rows and 30 item rows, but includes test/legacy/cancelled rows and older product types. | `mixed` | System proof only until cleaned. |
| Supabase `crm_deals` | 43 deals total; 23 active; 20 won; won value AU$898,863; active pipeline AU$3,418,697.80; active weighted AU$604,040. | `verified internal` | Pipeline proof, not signed revenue proof. |
| Supabase `assets` | 561 asset rows, quantity 674; 524 deployed; product quantity: 270 Stretch Bed, 363 Basket Bed, 41 Washing Machine. | `verified` | Delivery/proof base. Use carefully: "600+ beds/products" must distinguish old Basket vs current Stretch Bed. |
| `supplier-quotes.ts` | Direct materials AU$469.79; fully loaded low-volume cost AU$600; website price AU$750; margin AU$150 / 20%. | `modelled with source-backed inputs` | QBE cost and buyer sheet anchor. |
| `/admin/production` | Supply/demand, inventory, production KPI, cost-per-batch and COGS views. Latest inventory snapshot shows 4 beds possible as of 2026-03-27. | `mixed` | Useful operations surface; update before external use. |
| `/admin/cost-model` | Interactive model with verified default inputs from supplier invoices and Notion review. | `modelled` | Scenario tool. Not an audited financial model. |
| Buyer offer sheet in Notion | Pilot/community/program offer tiers; route freight; QR report; open checks. | `draft` | Becomes the buyer sheet artifact. |
| Last-50-bed cost sheet | QBE planning rule: AU$600 per bed plus route freight; delivered-cost bands; finance cleanup list. | `modelled / partial` | Good cost discipline. Last-50 product mix is old Basket/Weave, not current Stretch Bed economics. |

## Buyer segment map

The diagnostic asks for formalised segmentation with unit economics and sales effort. For the next phase, do not run eight lanes at once. Use four core lanes and park adjacent markets for QBE research.

| Segment | Buyer | What they buy | Current evidence | Price/capacity-to-pay question | Next artifact |
|---|---|---|---|---|---|
| 1. Funded community batches | Foundations, trusts, corporates, place-based funders, QBE/Snow-style capital partners. | Beds for delivery into named communities, with QR reporting and impact trail. | Centrecorp, Snow, TFN, FRRR, VFFF, QBE pathway; Notion buyer offer; CRM funding pipeline. | Are they funding product + freight + support + reporting, or only unit cost? | Funder/buyer batch sheet with AU$600 planning cost, route freight, support line and report product. |
| 2. Institutional procurement | ACCHOs, health services, homelands schools, housing providers, councils, Aboriginal organisations. | Stretch Bed batches, later washer pilots. | Diagnostic validated channels; CRM sale/procurement deals; partner page; previous direct institutional revenue in wiki. | What procurement price can they sustain once freight/warranty/support are explicit? | Quote template + payment terms + delivery checklist. |
| 3. Community partner / trust pathway | Aboriginal corporations, royalty trusts, local community companies, production hosts. | Beds, future plant partnership, local production/repair capability. | Oonchiumpa, Centrecorp/Utopia proof, plant pathway, ACT/Goods/Butterfly thinking. | Who pays upfront, who owns inventory/plant, and what benefit stays local? | Community partner offer + ownership trigger map with Area 09 legal. |
| 4. Direct ecommerce / sponsor | Individual supporters, metro/regional buyers, sponsors, remote residents where price is affordable. | Individual Stretch Beds or sponsored beds. | Live shop, AU$750 active product, Stripe checkout, GHL order handoff. | Is this real demand beyond tests and legacy rows? What freight/support promise is included? | Clean launch report: live orders only, exclude tests/legacy/cancelled rows, publish shipping/support terms. |

Park for QBE market scan: disaster recovery, temporary accommodation, agribusiness, refugee/humanitarian and workforce housing. They may be strong margin channels, but should not distract the first investment-readiness story.

## Stretch Bed buyer sheet v0.2

### Offer line

Goods can supply durable, washable, repairable Stretch Beds for remote and regional use, with route-specific freight, warranty/support, QR asset reporting, and a community benefit pathway.

### Product

| Field | Buyer answer | Claim status |
|---|---|---|
| Product | Stretch Bed Single. | `verified` |
| Materials | Recycled HDPE legs, galvanised steel poles, heavy-duty Australian canvas. | `verified` |
| Specs | 26kg; 200kg capacity; 188 x 92 x 25cm; about 5 min assembly; no tools. | `verified` |
| Design life | 10+ year design life. | `verified product claim` |
| Plastic | 20kg HDPE diverted per bed. | `verified product claim` |
| Warranty | 5-year warranty appears in project/product truth, but needs approved public terms and support pathway before a formal quote. | `needs founder/legal approval` |
| Commercial status | For sale now. Washing machine is prototype / register interest. Basket Bed is open-source legacy. | `verified` |

### Price and cost frame

| Line | Current answer | Use externally? |
|---|---|---|
| Public website price | AU$750, backed by active Supabase product row and product page. | Yes. |
| Current low-volume fully loaded planning cost | AU$600 per bed before route-specific freight/support allocation. | Yes, labelled as planning/modelled. |
| Direct materials | AU$469.79 via Defy kit path. | Internal/supporting, not margin headline. |
| Factory direct target | AU$275.74 before overhead/freight/support. | Internal/modelled target only. |
| Older AU$560 / AU$600 / AU$650 / AU$850-AU$1,200 price frames | Exist in old Notion/wiki pages. | Reconcile before external use. Use AU$750 as the current public price until Ben/Nic approve a segment price ladder. |

### Freight and delivery

Route freight is not a fixed public price yet. Use route-specific quoting.

Planning bands from the Last-50-bed sheet:

- Road delivered estimate: AU$600-AU$700 per bed.
- Island/barge estimate: AU$715-AU$815 per bed.
- Very remote estimate: AU$1,005-AU$1,105 per bed.

These are planning ranges and should not be sent as formal quotes until the delivery route, stock position, warranty/support load, payment terms and contracting party are confirmed.

### Buyer gets

- Stretch Beds sized and packed for the agreed delivery route.
- Route freight and delivery plan.
- Basic warranty/support position.
- QR asset reporting for deployment, location, check-in and support.
- Short impact report: products placed, community served, plastic/materials story and follow-up notes.
- Contracting and invoice path after entity/vehicle confirmation.

### Offer tiers

| Tier | Quantity | Use |
|---|---:|---|
| Pilot | 20 beds | One hostel, health service, housing cluster or community route. |
| Community batch | 50-100 beds | Route freight, warranty/support and QR reporting included in scope. |
| Program batch | 250+ beds | Only after contracting party, delivery capacity, inventory policy and governance path are clear. |

### Open checks before sending to buyers

- Confirm whether ACT Pty Ltd, Goods entity, Butterfly/DGR pathway or partner vehicle sends each quote.
- Approve warranty/support wording and terms.
- Reconcile old price ladder to current AU$750 website price.
- Build a freight quote matrix for road, barge/island and very remote routes.
- Decide if buyer price includes margin, sponsored-deployment subsidy or separate support/reporting lines.
- Attach approved product photos and consent-checked community proof.

## Product-sales transition plan

| Phase | What changes | Evidence now | Gap | Artifact |
|---|---|---|---|---|
| 0. Current reality | Relationship-led funded batches plus live ecommerce path. | Shop, Stripe, asset register, partner pages, CRM deals, cost model. | Not yet standing inventory; not a clean ecommerce revenue base. | This Area 03 review. |
| 1. Buyer-ready offer | Standard buyer sheet, price/freight/warranty/support, quote template, proof pack. | Buyer offer sheet draft, cost sheet, product pages. | Needs founder-approved external wording and route pricing. | Stretch Bed buyer sheet PDF/page. |
| 2. Standing inventory | Inventory policy, reorder points, stock funding, fulfilment workflow, lead times. | Admin products inventory, production inventory snapshot. | Latest inventory snapshot is stale and shows only 4 beds possible. | Inventory and working-capital policy. |
| 3. Segment economics | Segment-specific CAC/sales effort, unit economics, projected revenue, LOI targets. | CRM deals and old revenue segmentation. | Deal values and units are incomplete; order table has legacy/test noise. | Buyer segment model + LOI tracker. |
| 4. Market sizing | Top-down remote Australia and adjacent market sizing. | Qualitative demand and diagnostic validated channels. | Not yet built. | QBE skilled-volunteering market scan. |
| 5. Community production | Local plant economics, transfer/ownership triggers, licence/shared service model. | Process/product proof and Oonchiumpa/plant pathway. | Legal/financial mechanism not settled. | Area 09 ownership trigger map + plant P&L. |

## Website and admin review

| Page | Useful | Noise / risk | Action |
|---|---|---|---|
| `/shop` | Clean product catalogue: Stretch Bed available, washer prototype, Basket Bed plans. | "Every purchase supports..." is okay, but do not imply washer/basket direct sales. | Keep. Make Stretch Bed the buyer-proof entry point. |
| `/shop/stretch-bed-single` | Strong buyer proof: AU$750, Buy Now, specs, photos, assembly, impact note. | "Supports community-led manufacturing" should be framed as current pathway/target unless a specific local production batch is evidenced. | Use as primary public product proof. |
| `/stretch-bed` | Good build/spec guide and visual product proof. | Mostly educational, not a buyer sheet. | Link from buyer sheet as technical/product reference. |
| `/partner` | Strong partner/funder doorway, logos, three partnership lanes. | Shared content says cost-to-make is well below AU$750 "thanks to On-Country HDPE processing"; that should be tightened because current AU$600 fully loaded is modelled and on-country processing is the pathway, not always current production. "600+ beds" should clarify includes legacy Basket + current Stretch Bed. | Update copy before investor use. |
| `/partners/centrecorp` | Strong public proof: Utopia delivery story, 60 first beds, 107 next round, videos/photos. | "Upcoming" and next-round status may date quickly. Needs current status before meeting if referenced as locked/delivered. | Use as proof page, but give exact date/status verbally. |
| `/admin/products` | Current source for active products and inventory. Confirms only Stretch Bed customer-facing active plus hidden smoke-test SKU. | Inactive Basket/Weave rows and `weave_bed` type are legacy noise. Inventory count 0 means no standing stock claim. | Keep as admin proof; clean legacy labels later. |
| `/admin/orders` | Proves order admin exists. | Order history is noisy: tests, legacy `weave_bed`/unknown rows, cancelled-but-paid rows, and smoke tests. | Do not use as external revenue proof until reconciled. |
| `/admin/orders/launch-checklist` | Very useful: Stripe live/test checks, webhook, canonical product row, GHL handoff. | Contains manual checks; not all proof is automatic. | Use internally to show ecommerce readiness. |
| `/admin/deals` | Useful active CRM/pipeline board across sales, funding, procurement and partnerships. | Active pipeline value includes grants/capital, not just customer orders. Several active deals have 0 probability or 0 units. | Build LOI tracker and segment-specific deal hygiene. |
| `/admin/production` | Useful ops surface: supply/demand, assets, inventory, cost-per-batch, supplier actuals. | Latest inventory snapshot stale; cost-per-batch includes old product mix; all COGS are not audited. | Update inventory and annotate old vs current product. |
| `/admin/cost-model` | Strong QBE-facing modelling tool with sliders and source-backed defaults. | Model, not audited accounts. | Use for advisory discussion and scenario testing. |

## Supabase evidence snapshot

Queried directly against v2 Supabase project `cwsyhpiuepvdjtxaozwf` on 2026-05-28.

### Products

- Active customer-facing product: `stretch-bed-single`, `stretch_bed`, AU$750, inventory tracked, inventory count 0.
- Active hidden/admin product: `smoke-test`, AU$1.
- Inactive products: washing machine, Basket Bed single/double, legacy `weave-bed-double`.

Interpretation: ecommerce is live, but standing inventory is not proven.

### Orders

- 30 order rows, 30 order item rows.
- Paid payment-status rows total AU$115,380, but the table includes cancelled rows, old `weave_bed`/unknown item types, a smoke test, and likely legacy data.
- Latest rows include AU$30 test-looking orders and a refunded AU$1 smoke test.

Interpretation: orders prove the system exists. They are not clean external revenue proof yet.

### Deals

- 43 deals total.
- 23 active deals.
- 20 won deals.
- Won value AU$898,863.
- Active pipeline AU$3,418,697.80.
- Active weighted pipeline AU$604,040.
- Active units 41; won units 491.
- Active top deals include funding, plant sales, QBE, and PICC 40 beds.

Interpretation: strong pipeline and proof layer, but it needs segmentation. Do not blend grants, capital, product sales and procurement into one commercial revenue claim.

### Assets

- 561 asset rows, total quantity 674.
- 524 deployed.
- Product quantities: 270 Stretch Bed, 363 Basket Bed, 41 Washing Machine.
- Top communities by quantity: Tennant Creek 291, Utopia Homelands 147, Palm Island 139, Alice Springs 39, Maningrida 24, Kalgoorlie 20.

Interpretation: strong delivery proof. Use "600+ beds/products" carefully and distinguish current Stretch Beds from legacy Basket Beds.

### Inventory

- Latest `production_inventory` snapshot is 2026-03-27.
- It shows 4 beds possible, with steel poles as a bottleneck.

Interpretation: this directly supports the diagnostic gap: standing inventory is not proven and needs a working-capital policy.

## Notion and wiki review

| Source | Use | Keep / revise |
|---|---|---|
| Buyer offer sheet | Strong v0.1 of the buyer artifact. | Keep, but update price to current AU$750 public price and label old ranges. |
| Last-50-bed delivered cost sheet | Good planning discipline: AU$600/bed + route freight, external labels, finance cleanup. | Keep. Do not use last-50 as current Stretch Bed unit economics because product mix was Basket/Weave. |
| Goods Cost Register | Useful separation of actuals, estimates, quotes and model assumptions. | Keep. Use only reconciled numbers externally. |
| Old Business Model Clarity pages | Strong narrative and channel logic. | Revise old AU$560/AU$600/AU$650/AU$850-AU$1,200 price ladder against current AU$750. |
| SIH Readiness Hub | Strong map for QBE/SIH. | Keep. Area 03 notes are accurate: cost tool is improving, market sizing is still the QBE project. |
| `wiki/articles/enterprise/03-business-model.md` | Best long-form explanation of mixed current model and future ownership. | Keep. It should remain internal/source unless tightened for public copy. |
| `wiki/outputs/2026-05-12-financial-model-day5-revenue-segments.md` | Revenue segment model and old verified-to-date numbers. | Useful, but reconcile with live CRM and latest Xero before quoting. |
| `wiki/outputs/2026-05-12-financial-model-day4-unit-economics.md` | Scale-cost logic. | Keep modelled label clear. |

## What is useful vs noise in admin

Useful now:

- `products`: current offer, product status and price.
- `orders/launch-checklist`: ecommerce readiness and Stripe/GHL proof.
- `deals`: pipeline operating surface, if segmented by type.
- `production`: inventory, supply/demand and batch-cost working surface.
- `cost-model`: scenario and sensitivity tool.
- `assets`: delivery proof and product/places base.

Noise until cleaned:

- cancelled-but-paid order rows;
- old `weave_bed` and unknown product-type order items;
- active smoke-test SKU if viewed without context;
- inactive Basket/Weave product rows when showing an external person;
- CRM deal totals that blend grants, working capital, procurement and product sales;
- stale inventory snapshots;
- old unit-cost and price assumptions not reconciled to the current AU$750 site price;
- public copy that implies on-country manufacturing is fully complete everywhere.

## Images and media to use

Use:

- product hero and assembled bed images from `/shop/stretch-bed-single`;
- Stretch Bed guide sequence from `/stretch-bed`;
- Centrecorp/Utopia delivery photos and videos after consent/status check;
- process photos showing plastic, sheets, components and assembly;
- admin screenshots as internal proof only: product row, launch checklist, deals, production, cost model.

Avoid or review first:

- any community/person photo without consent status checked;
- any image that shows Basket/Weave while copy says current Stretch Bed;
- images that imply full on-country production if the specific batch was made elsewhere;
- screenshots containing personal customer/order details.

Generated screenshots for this review live in:

`output/playwright/qbe-area03/`

## Near-term build list

| Priority | Artifact | Owner | Why |
|---|---|---|---|
| P0 | Founder-approved Stretch Bed buyer sheet | Ben/Nic | The diagnostic asks for clear product-sales packaging. |
| P0 | Price and freight matrix | Ben/Nic/finance | Buyer conversations cannot rely on old mixed price assumptions. |
| P0 | Clean LOI tracker | Ben/Nic | QBE Stage 2 needs matched-funding evidence and buyer confidence. |
| P0 | Orders cleanup note | Ops/admin | Prevents test/legacy rows being mistaken for revenue proof. |
| P1 | Buyer segment model with unit economics and sales effort | QBE volunteer + Ben/Nic | Converts qualitative demand into investment-ready segmentation. |
| P1 | Standing inventory and working-capital policy | Ben/Nic/finance | Directly answers the diagnostic product-sales transition gap. |
| P1 | Public copy cleanup for `/partner` and shared funder content | Website/admin | Removes on-country/margin overclaim risk. |
| P2 | Adjacent market scan | QBE volunteer | Quantifies disaster, humanitarian, agribusiness and workforce markets. |

## Meeting talk track

1. Goods has a commercial anchor: the Stretch Bed is a real purchasable product at AU$750, with Stripe checkout, product data, admin order handling and QR/asset infrastructure.
2. The current business model is mixed by design: funded batches, institutional procurement, community partner pathways and direct ecommerce serve different buyer realities in remote Australia.
3. The next phase is about discipline: standard buyer sheet, route pricing, inventory policy, LOI tracker, market sizing and segment economics. We should not pretend standing inventory or mature resident retail is already solved.

## Do not overclaim

- Do not say there is standing inventory; current product inventory count is 0 and latest production snapshot shows 4 beds possible.
- Do not present order table totals as clean ecommerce revenue.
- Do not blend grants, debt, procurement and product sales into one revenue claim.
- Do not use old Basket/Weave deliveries as current Stretch Bed unit economics.
- Do not say community ownership or on-country production is structurally complete.
- Do not claim washer/fridge commercial sales. Washer is prototype/register-interest; fridge is future concept.
- Do not use old AU$560/AU$600/AU$650 price frames externally until reconciled with the current AU$750 product row.

