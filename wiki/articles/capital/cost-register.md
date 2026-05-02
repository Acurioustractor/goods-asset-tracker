# Goods Cost Register

> Working register for Goods costs. This page separates Xero actuals from estimates, quotes and planning assumptions so we can refine unit economics without pretending every number has the same evidence status.

## What Is Connected

The real Xero-linked finance layer lives in ACT global infrastructure, not inside this Goods repo.

| System | What it contains | Goods handling |
|---|---|---|
| ACT global Supabase | `xero_transactions`, `xero_invoices`, `project_monthly_financials`, `projects`, `vendor_project_rules` | Query by project code `ACT-GD` and Xero tracking option `ACT-GD — Goods`. |
| Xero | Source accounting system for invoices, bills, bank transactions and attachments | Synced into ACT global Supabase by the Xero integration. |
| Goods wiki | Human-readable cost register and assumptions | Shows actuals, estimates and review questions in one place. |
| Notion | Human review page | `Goods Cost Register - Xero Actuals, Estimates and Review Queue`. |
| Goods admin app | Finance model, economics dashboard and Xero reconciliation views | Useful operating dashboards, but not yet one clean cost register. |

## Actual Xero Position

Queried from ACT global Supabase on 2 May 2026 for `ACT-GD`.

| Actual source | Result | How to read it |
|---|---:|---|
| `project_monthly_financials` revenue, Feb 2025 to Mar 2026 | `$632,070` | Safer project-level revenue rollup. Needs reconciliation against Goods-only revenue categories. |
| `project_monthly_financials` expenses, Feb 2025 to Mar 2026 | `$85,554` | Safer project-level expense rollup. Use this before raw bill/transaction totals. |
| `project_monthly_financials` net, Feb 2025 to Mar 2026 | `$546,517` | Project rollup net, before human finance review. |
| `xero_transactions` tagged `ACT-GD` | `85` transactions | Bank transaction layer. |
| Goods-related `xero_invoices` found by `ACT-GD` project code or line tracking | `217` invoices | Includes receivable and payable invoices. |
| Payable invoices in that Goods invoice pool | `194` bills | Supplier / cost side. |
| Receivable invoices in that Goods invoice pool | `23` invoices | Customer / funder / buyer side. |
| Receivable invoice total in that Goods invoice pool | `$1,056,826` | Not the same as cash received. Includes unpaid or partially paid invoices. |
| Paid income on those receivable invoices | `$387,476` | Cash received in Xero invoice records. |
| Amount still due on those receivable invoices | `$257,950` | Needs follow-up and status checking. |
| Raw cost-classification pool | `$327,948` across `330` rows | This combines bank transactions and payable bills, so it may double count until bills and payments are matched. Use for category discovery, not final total. |

## Monthly Project Rollup

| Month | Revenue | Expenses | Net | Main expense signals |
|---|---:|---:|---:|---|
| Feb 2025 | `$0` | `$1,275` | `-$1,275` | Tennant Creek Caravan Park |
| Mar 2025 | `$10,749` | `$1,188` | `$9,561` | Byo Group, Town Camp Designs, Platypus Alice Springs |
| Apr 2025 | `$10,040` | `$6,672` | `$3,368` | Byo Group, The Kiva Spa, Department of Primary Hobart |
| May 2025 | `$119,174` | `$9,910` | `$109,264` | Defy Manufacturing, Wild Earth |
| Jun 2025 | `$38,581` | `$993` | `$37,588` | Department of Primary Hobart, Alice Spring Hotel |
| Jul 2025 | `$66,051` | `$21,743` | `$44,308` | Defy Design, Peak Up Transport, Defy |
| Aug 2025 | `$56,665` | `$11,505` | `$45,160` | Defy Design, Defy, Palm Island Barge, Adriana Beach |
| Sep 2025 | `$213,100` | `$25,193` | `$187,907` | Samuel Hafer, Loadshift Sydney |
| Oct 2025 | `$25,234` | `$0` | `$25,234` | No expense lines in rollup |
| Nov 2025 | `$85,712` | `$0` | `$85,712` | No expense lines in rollup |
| Dec 2025 | `$0` | `$306` | `-$306` | Piggyback, Crowne Plaza Alice Springs Lasseters |
| Jan 2026 | `$6,765` | `$2,922` | `$3,843` | RW Pacific Traders, IGA, Shell, Woolworths |
| Feb 2026 | `$0` | `$3,364` | `-$3,364` | NT Government, Thrifty, BP, Esmay |
| Mar 2026 | `$0` | `$484` | `-$484` | Avis |

## Raw Cost Categories To Review

These are generated from Goods-tagged Xero rows using account codes, vendors and descriptions. They are not final accounting categories yet.

| Cost category | Raw classification total | Review note |
|---|---:|---|
| Product materials / COGS | `$177,133` | Dominated by Defy, Defy Manufacturing, Zinus, RW Pacific and materials-style bills. Needs bill/payment de-duplication. |
| Other / review | `$72,162` | Needs manual tagging. Includes vendors like Orange Sky, Joseph Kirmos and several uncategorised account-code rows. |
| Staff and founder time | `$30,108` | Needs decision on payroll, contractor and founder-time treatment. |
| Travel and delivery | `$19,461` | Includes fuel, rental cars, accommodation, taxis and travel-coded rows. |
| Consulting, design and contractors | `$11,402` | Includes subcontractor and consulting-coded rows. Some Defy rows may belong in product materials instead. |
| Freight and logistics | `$8,830` | Includes ePrint, Palm Island Barge, Sea Swift, Loadshift-style signals where coded or inferred. |
| Community engagement / workshops | `$6,442` | Meals, workshops, community visit support and engagement costs need cleaner tagging. |
| Production facility capex / tools | `$2,051` | Minor tools and equipment only in this classification pool. Does not capture all plant capex. |
| Software and systems | `$359` | Likely under-tagged because ACT shared systems may sit under ACT infrastructure rather than Goods. |

## Top Xero Vendors In The Raw Goods Pool

| Vendor | Raw total | Likely cost area |
|---|---:|---|
| Defy Manufacturing | `$71,847` | Product materials, manufacturing, design/build |
| Defy | `$57,444` | Product materials, manufacturing, design/build |
| Orange Sky Australia | `$45,573` | Operations / review |
| Samuel Hafer | `$19,500` | Staff, contractor or operations review |
| Defy Design | `$17,112` | Design, development, manufacturing support |
| Zinus Australia | `$9,882` | Product materials / bedding |
| Joseph Kirmos | `$9,000` | Other / review |
| Bunnings Warehouse | `$7,995` | Tools, materials, supplies |
| Endless Parks | `$7,700` | Operations / review |
| Peak Up Transport | `$7,033` | Freight / logistics |
| Openfields Solutions | `$5,800` | Washing-machine telemetry / technology |
| Byo Group | `$5,409` | Operations / review |
| Loadshift Sydney | `$5,086` | Freight / logistics |
| Department of Primary Hobart | `$5,035` | Operations / review |
| Bionic Group | `$4,705` | Materials / review |
| RW Pacific Traders | `$4,034` | Materials / supplies |
| Trademutt | `$2,973` | Merchandise / uniforms |
| Sea Swift | `$2,554` | Freight / barge logistics |
| Palm Island Barge | `$2,283` | Freight / barge logistics |
| Wild Earth | `$2,093` | Tools / equipment / travel support |

## Account Codes Showing Up

| Xero account | Raw total | Why it matters |
|---|---:|---|
| `412` Consulting & Accounting | `$48,950` | Needs split between design, accounting, contractors and miscoded materials. |
| `429` General Expenses | `$41,282` | Too broad. This is where a lot of Goods detail disappears. |
| `400` Advertising & Marketing | `$38,625` | Needs review: some product/manufacturing rows are coded here. |
| `880` uncategorised in local chart | `$37,250` | Needs account-code mapping. |
| `446` Materials & Supplies | `$30,730` | Product materials. |
| `409` Client to Advise | `$23,928` | Needs cleanup and receipt/accounting review. |
| `700` uncategorised in local chart | `$19,500` | Needs mapping. |
| `493` Travel - National | `$13,958` | Travel and delivery. |
| `486` Sub-contractors | `$13,835` | Contractors and delivery/production labour. |
| `425` Freight & Courier | `$8,830` | Freight and logistics. |

## Estimate Register

| Cost / assumption | Amount | Evidence status | Source / note |
|---|---:|---|---|
| Stretch Bed materials-only cost | `$149.20` per bed | Quote / source data | Defy HDPE legs `$45`, steel poles `$36`, canvas `$65`, end caps `$3.20`. |
| Production cost model | `$550` per bed | Planning model | Sum of production stages: collection, shredding, pressing, CNC, prep, assembly, materials, freight. |
| Year 1 finance model cost | `$520` per bed | Planning assumption | Finance model default. |
| Year 3 target cost | `$350` per bed | Target | Finance model target after learning and scale. |
| Average sale price | `$700` per bed | Planning assumption | Finance model default. |
| Institutional price | `$560` per bed | Xero/pricing reference | Admin strategy page. |
| Retail price | `$600` per bed | Xero/pricing reference | Admin strategy page. |
| PICC price | `$750` per bed | Xero/pricing reference | Admin strategy page. |
| Basket Bed historic price | `$370` | Historic / not current offer | Do not use as current Stretch Bed pricing. |
| Workshop / corporate build | `$6,000` | Pricing reference | Admin strategy page. |
| Delivery line item | `$3,000` | Pricing reference | Admin strategy page. |
| Washing-machine prototype cost | `$4,500-$5,000` per machine | Founder/product estimate | Prototype only. Not resident-scale pricing. |
| Washing-machine target price | `$1,000-$2,000` per machine | Target | Needs engineering and supplier pathway. |
| First production plant investment | `$100,000` | Source-backed estimate | TFN `$80K` plus ACT `$20K` in compendium notes. |
| Scale-up facility cost | `$600,000` each | Finance model assumption | Used for investment model, not actual invoice total. |
| Annual operating costs | `$600,000` | Finance model assumption | Needs Goods-specific P&L and Xero reconciliation. |
| Working capital | `$600,000` | Finance model assumption | Inventory, receivables and production timing. |
| Workforce training | `$400,000` | Finance model assumption | Local production and capability transfer. |
| Technology / logistics | `$250,000` | Finance model assumption | Tracking, systems and logistics support. |
| Impact measurement | `$150,000` | Finance model assumption | Impact reporting, longitudinal evidence and consented story systems. |
| Facility hosting | `$5,000` per week | Source signal | Production circuit model. Needs agreement / actual treatment. |
| Circuit production rate | `~30 beds/week` | Source signal | Production facility circuit model. |
| Road freight benchmark | `$52` per bed | Benchmark | Admin growth/logistics modelling. |
| Barge freight benchmark | `$163` per bed | Benchmark | Admin growth/logistics modelling. |
| Charter freight benchmark | `$455` per bed | Benchmark | Admin growth/logistics modelling. |
| Economics dashboard factory model | `$177` per bed before freight | Interactive model default | Raw plastic, diesel, labour and hardware only. Does not include all overhead. |
| Economics dashboard Defy panels model | `$482` per bed before freight | Interactive model default | Two Defy panels plus diesel, labour and hardware. |
| Economics dashboard Defy kit model | `$433` per bed before freight | Interactive model default | Pre-cut kit, freight, assembly labour and hardware. |
| Economics dashboard community model | `$39` per bed before freight | Narrow model default | Free plastic and volunteer labour assumption. Not a full commercial cost. |

## Xero Export / Data Fields We Need

Because ACT global Supabase already stores Xero data, this is less about exporting CSVs and more about building a clean Goods cost view from the existing tables.

| Field | Source | Why it matters |
|---|---|---|
| Date | `xero_transactions.date`, `xero_invoices.date` | Timing and cashflow. |
| Supplier / payee | `contact_name` | Shows who was paid. |
| Description | `line_items[].description`, `reference` | Lets us classify the spend properly. |
| Invoice / bill / receipt number | `invoice_number`, `xero_id`, `xero_transaction_id` | Accounting proof and de-duplication. |
| Xero account code | `line_items[].account_code` | Separates travel, materials, consulting, subscriptions, capex and general expenses. |
| Project code | `project_code` plus line-item tracking | Separates Goods from wider ACT activity. |
| Entity code | `entity_code` | Separates ACT entities where relevant. |
| Amount ex GST | `subtotal` / line amount where available | Cost model. |
| GST | `total_tax` | Accounting reconciliation. |
| Amount inc GST | `total` | Cash and invoice total. |
| Paid / unpaid | `status`, `amount_paid`, `amount_due` | Separates cash cost from liabilities. |
| Attachment present | `has_attachments` | Shows whether invoice / receipt proof exists. |
| Cost type | Derived review field | Maps actuals to the cost categories above. |
| Related product / facility / community | Manual review field | Ties spend to Stretch Bed, washer, production plant or delivery pathway. |
| Evidence status | Manual review field | Actual, estimate, quote, model assumption or needs review. |
| De-duplication status | Manual review field | Needed so bill plus payment is not counted twice. |

## Review Queue

- Reconcile `project_monthly_financials` expenses of `$85,554` against raw Goods bills and bank transactions.
- De-duplicate the `$327,948` raw classification pool so bills and payments are not double counted.
- Re-tag broad `429 General Expenses`, `409 Client to Advise`, `400 Advertising & Marketing` and unknown account codes.
- Decide whether Defy and Defy Manufacturing are product materials, design/R&D, contractors, or split across multiple categories.
- Confirm which Goods costs are in ACT shared services rather than `ACT-GD`.
- Confirm which salary, contractor and founder-time costs should be attributed to Goods.
- Reconcile the `$387,476` paid income figure with the Goods funder register and product sales.
- Reconcile `$257,950` amount due with the receivables/follow-up pipeline.
- Tie travel and delivery rows to trips, communities and product deliveries.
- Tie freight rows to Palm Island, Sea Swift, Loadshift and other delivery pathways.
- Tie materials rows to Stretch Bed batches and production logs.
- Decide which numbers can be shown to QBE / SIH / PIN and which remain internal finance detail.

## Working Position

We do have direct Xero-linked Goods cost data. It is copied into ACT global Supabase and can be queried by `ACT-GD`.

The missing piece is not the existence of data. The missing piece is a clean Goods cost register that de-duplicates bills and payments, maps messy account codes into useful operating categories, and reconciles actual costs against the unit economics model.

## Sources

- ACT global Supabase, queried 2 May 2026: `xero_transactions`, `xero_invoices`, `project_monthly_financials`, `vendor_project_rules`, project code `ACT-GD`.
- ACT global: `/Users/benknight/Code/act-global-infrastructure/apps/command-center/src/app/api/finance/projects/route.ts`.
- ACT global: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260123000001_xero_integration.sql`.
- ACT global: `/Users/benknight/Code/act-global-infrastructure/config/xero-bank-rules.json`.
- ACT global: `/Users/benknight/Code/act-global-infrastructure/config/xero-chart-import.csv`.
- Goods source: `v2/src/lib/data/supplier-quotes.ts`.
- Goods source: `v2/src/lib/data/impact-model.ts`.
- Goods source: `v2/src/lib/data/compendium.ts`.
- Goods admin source: `v2/src/app/admin/finance-model/page.tsx`.
- Goods admin source: `v2/src/app/admin/economics/page.tsx`.
- Goods admin source: `v2/src/app/admin/strategy/page.tsx`.

## Related

- [[funder-register]]
- [[capital-stack]]
- [[../enterprise/04-financial-management]]
- [[../enterprise/08-people-and-organisation]]
- [[../products/stretch-bed]]
- [[../sources/production-facility-guide]]
