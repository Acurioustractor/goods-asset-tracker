# QBE Area 04 - Financial Management: Full Review

Date: 2026-05-29
Status: internal working review - founder/accountant review required before external use
Diagnostic source: `/Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf`
Primary Notion page: https://www.notion.so/36eebcf981cf8167884fc3d5ecda0e32

## Meeting-ready read

The diagnostic is right to keep Financial Management as a priority gap. Goods now has much more finance evidence than the V4 pre-read showed: Xero-linked revenue and expense pulls, a v0.1 financial model, cashflow scenarios, a capital stack, a buffer policy, corrected Stretch Bed COGS, trip-level economics, and admin pages that make the operating data visible.

The remaining investor-readiness gap is not "no finance work exists". It is that the work is still split across ACT, Xero mirrors, wiki pages, Notion and admin dashboards. The next phase needs one accountant-reviewed Goods-only financial pack: 3-statement model, founder FTE costing, receivables/work-capital view, cost ladder, and use-of-funds bridge.

## Diagnostic summary

The diagnostic asks whether the enterprise is financially sustainable: revenue sources and mix, cost structures, cash flow, and assets required.

It recorded:

- Cumulative revenue of about AUD 537,595 at the time of the report.
- Diversified philanthropic backing and earned revenue from project-funded bed deliveries.
- Cross-subsidisation across A Curious Tractor as the practical way the founders have kept momentum through cashflow volatility.
- ACT Pty Ltd incorporation and intended R&D Tax Incentive use as useful structural moves.

It flagged:

- Goods needs a dedicated financial model and reporting separated from broader ACT.
- Founder time is currently uncosted and must be modelled at fair-market rate even if not drawn.
- Goods needs an explicit cashflow buffer policy for working-capital risk because funder timing is volatile.

## What has changed since V4

Use this as the meeting framing:

- The old AUD 537,595 revenue figure is now superseded by later Xero pulls. The May 12 model used AUD 684,911 after Ingkerreke exclusion. A fresh ACT-infra Xero invoice pull on 2026-05-29 shows ACT-GD active ACCREC invoices of AUD 732,210.79 total, of which AUD 649,710.79 is paid and AUD 82,500 is still due. These are not accountant-reviewed Goods statutory accounts.
- The corrected cost ladder is now much stronger: AUD 469.79 direct materials, about AUD 525.74 with Defy assembly before route freight, and AUD 600 fully loaded at low volume.
- The v0.1 financial model exists: P&L actuals, founder-time sensitivity, revenue segments, unit economics, 36-month cashflow, capital stack, buffer policy, and three scenarios.
- The admin app now has useful finance-adjacent proof: Xero reconciliation, cost model, production COGS, trip receipts, funder reports.
- The strongest remaining issue is not a missing spreadsheet. It is finance governance: carve-out, founder time, opening cash, receivables, capex/inventory, shared ACT services, and accountant endorsement.

## Claim discipline

Use these labels consistently.

| Label | External use | Examples |
|---|---|---|
| verified | Usable if source is cited and founder/accountant agrees wording. | ACT-GD Xero invoice rows; corrected supplier BOM inputs; paid invoices; admin route evidence. |
| modelled | Usable only as forecast/assumption. | Founder-time scenarios; 36-month cashflow; unit cost at scale; capital close timing. |
| target | Future operating intent. | 3-statement model, 6-month cash buffer, accountant-reviewed financial summary. |
| internal only | Keep out of public copy until reconciled. | Raw order totals, unaudited ACT-GD carve-out, messy account-code pools, unpaid/draft invoices, old COGS figures. |

## Current finance evidence

### Revenue and receivables

Fresh direct query from ACT-infra Supabase, `xero_invoices`, filtered to `project_code = ACT-GD`, excluding VOIDED/DELETED rows. Queried 2026-05-29 local time.

| Evidence | Current pull | Status |
|---|---:|---|
| Active ACT-GD invoice rows | 271 | verified data pull |
| ACCREC revenue invoice rows | 18 | verified data pull |
| ACCREC total | AUD 732,210.79 | mixed - invoice basis, not statutory revenue |
| ACCREC paid | AUD 649,710.79 | verified invoice cash-received signal |
| ACCREC due | AUD 82,500.00 | verified receivable signal |
| ACCPAY supplier bill rows | 253 | verified data pull |
| ACCPAY total | AUD 423,129.21 | mixed - bill basis, not deduplicated cash cost |
| ACCPAY paid | AUD 296,251.43 | verified invoice paid signal |
| ACCPAY due | AUD 126,877.78 | verified payable signal |

Top paid revenue contacts in the fresh pull:

- The Snow Foundation: AUD 402,929.79 paid.
- Centrecorp Foundation: AUD 123,332 paid.
- Vincent Fairfax Family Foundation: AUD 50,000 paid.
- Our Community Shed Incorporated: AUD 20,265 paid.
- Julalikari Council Aboriginal Corporation: AUD 19,800 paid.
- Red Dust Role Models Limited: AUD 15,950 paid.
- QIC Limited: AUD 12,000 paid.
- Mala'la Health Service Aboriginal Corporation: AUD 5,434 paid.

How to say this:

> Goods now has Xero-backed revenue and receivables evidence, but we are treating it as a finance workpaper, not audited financial statements. The next job is the Goods-only accountant-reviewed carve-out.

### Revenue mix

The Day 5 revenue model grouped the May 12 Xero baseline of AUD 684,911 into seven segments:

- Donor-funded institutional distribution: AUD 611,461 to date, 89.3 percent.
- Direct institutional commercial: AUD 45,499 to date, 6.6 percent.
- Corporate sponsorship / RAP: AUD 12,000 to date, 1.8 percent.
- Community / maker partners: AUD 15,950 to date, 2.3 percent.
- Government procurement: nil verified to date.
- Direct retail / B2C: nil verified launch revenue at the time of the model.
- Adjacent markets: nil verified to date.

Do not overstate commercial sustainability from this. The evidence supports "diversified early revenue with strong donor-funded institutional validation", not "self-sustaining trading business".

### Cost ladder

The current Stretch Bed cost truth is in `v2/src/lib/data/supplier-quotes.ts` and `wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md`.

| Cost layer | Amount per bed | Status | Use |
|---|---:|---|---|
| Direct materials, Defy-kit path | AUD 469.79 | verified/modelled BOM | Use as current bottom-up direct materials. |
| With Defy assembly before route freight | about AUD 525.74 | modelled from invoice rate | Use as internal production planning. |
| Fully loaded low-volume cost | AUD 600 | modelled from FRRR + Day 4 | Use for margin claims. |
| Website price | AUD 750 | verified code/product price | Use with fully loaded cost, not materials-only. |
| Margin at website price | AUD 150 / 20 percent | modelled from AUD 600 | Use carefully; not audited. |

Do not use stale values: AUD 149.20 materials-only, AUD 400, AUD 467.75, AUD 168.70, or AUD 523.70 direct. Those are superseded or context-specific.

### Expense and founder-time position

From the May 12 financial model work:

- Day 2 built a P&L baseline: cumulative revenue AUD 684,911, ACCPAY expenses AUD 350,112, incomplete net before bank-only expense adjustments AUD 334,799.
- Day 3 added bank spend: incremental bank spend AUD 86,499, true operating expense AUD 436,612, operating surplus before founder time AUD 248,299.
- Day 3 modelled founder time at a fair-market default of AUD 140,000 per year for both founders combined in the mid case, producing about AUD 326,667 of founder time over 27 months and an indicative deficit after founder time of about AUD 78,400.

This is the diagnostic's point in practice: Goods can look profitable if founder time, shared ACT services, capex, inventory and bank-only spend are not brought into the model.

### Cashflow, buffer and scenarios

From Day 6, Day 7 and Day 9:

- Base case opening cash placeholder: AUD 50,000.
- Base case trough: about negative AUD 94,483 in August 2026.
- Downside trough: about negative AUD 171,000 in November 2026.
- Upside trough: about negative AUD 15,000 in August 2026.
- Base capital stack model: QBE AUD 400,000 in September 2026, SEFA AUD 300,000 in November 2026, anchor philanthropy AUD 500,000 in January 2027.
- Buffer states now exist: negative, below floor, below target, OK.

The most important open input is opening cash. If opening cash is materially higher, the trough changes. If QBE/SEFA/anchor funding slips, the trough deepens.

## Website and admin proof reviewed

| Surface | What it proves | Useful | Noise / risk |
|---|---|---|---|
| `/admin/xero-reconciliation` | CRM deals with invoice references, paid/authorised/overdue grouping, mismatch checks. | Good for receivables and pipeline-to-Xero hygiene. | Not a statutory ledger; parses notes and CRM amounts. |
| `/admin/cost-model` | Interactive first-principles cost model with verified default inputs and sensitivity sliders. | Good for QBE/SIH cost-advisory work. | Model only; not accountant reviewed. |
| `/admin/production` | Production inventory, cost per batch, supplier actuals, demand/stock position. | Good operating proof. | Latest inventory snapshot can be stale; supplier actuals are lower-bound and directional. |
| `/admin/trip-receipts` | Trip-level asset delivery groups cross-referenced to Xero ACCPAY windows. | Good for showing receipt discipline and missing-cost detection. | Missing receipts do not mean zero cost; some paid personally or through ACT shared accounts. |
| `/admin/reports` | Funder reports generated from live Goods, ACT Xero and Empathy Ledger placeholders. | Good reporting system proof. | Generated reports need human review before external use. |
| `/admin/funders` | Funder configuration and commitments feeding report generation. | Useful for grant/funder reporting operations. | Not a capital-commitment source of truth. |
| `/admin/library` | Internal source hub with BOM/cost cards and media/docs inventory. | Useful for pointing to the corrected cost truth. | Internal library, not investor collateral. |
| v2 `orders` table | Stripe/order plumbing exists. | Useful for proving ecommerce capability. | Current totals are noisy/test/legacy/cancelled and should not be used as revenue. |

## What is useful vs noise

Useful:

- Xero invoice data filtered to ACT-GD, with status and paid/due amounts.
- Day 2-10 financial model outputs as a v0.1 model trail.
- Corrected supplier BOM and `supplier-quotes.ts` as the current product cost truth.
- Cost model and production admin screens as operating proof.
- Trip P&L work for Utopia/Centrecorp as a concrete example of delivery economics.
- Capital stack Day 8 and scenario Day 9 as investor-readiness workpapers.

Noise unless reconciled:

- Old diagnostic AUD 537,595 as if it were current.
- Any margin claim based on materials-only COGS.
- v2 order table totals as revenue.
- Draft/authorised invoices as cash.
- Raw ACCPAY totals without bill/payment and capex/opex treatment.
- Mixed ACT entity coding without an accountant-reviewed carve-out.
- Founder labour excluded from profitability.
- Capital stack targets presented as committed money.

## Artifacts to build

### 1. Goods-only 3-statement model

Build one workbook or Sheets model with:

- P&L actuals by month.
- Balance sheet or working-capital schedule: receivables, payables, inventory, capex, cash.
- Cashflow by month for 36 months.
- Scenario tabs: downside, base, upside.
- Assumptions tab with provenance labels.
- Exportable PDF summary for QBE/PIN/accountant.

Minimum inputs to close:

- Opening cash at 1 May 2026.
- ACT-GD revenue carve-out from ACT-ST.
- Expense classification and de-duplication.
- Receivables and payables ageing.
- Inventory and capex treatment.
- R&D refund treatment.
- GST/tax treatment.

### 2. Founder FTE costing sheet

Make founder time impossible to ignore:

- Ben GOC FTE percent by month.
- Nic GOC FTE percent by month.
- Fair-market replacement rate, default AUD 140,000 per year combined mid case unless accountant changes it.
- Drawn vs undrawn distinction.
- R&D eligibility implication.
- Sensitivity table: conservative, mid, high, all-in.

### 3. Accountant-reviewed financial summary

One clean summary for investor diligence:

- Current verified revenue, receivables, payables and expense basis.
- What is in ACT-ST vs any future entity.
- What is excluded or still under review.
- A sign-off note from accountant/bookkeeper.
- A clear warning that it is management accounts unless formally audited.

### 4. Cost ladder and sensitivity sheet

Tie the supplier truth to the model:

- Direct materials: AUD 469.79.
- Assembly-before-route-freight: about AUD 525.74.
- Fully loaded low-volume: AUD 600.
- Factory target: AUD 275.74 direct cost from `factoryDirectMaterials`.
- Labour/material/freight/throughput sensitivity.
- Current Defy-kit path vs on-country production path.

### 5. Receivables and working-capital tracker

Make this operational, not just modelled:

- Invoice number.
- Contact.
- Amount total, paid, due.
- Status.
- Due date.
- Follow-up owner.
- Link to CRM deal and Xero invoice.
- Whether it counts toward QBE match evidence.

### 6. Use-of-funds bridge

Map the QBE ask and matched capital to actual business needs:

- Inventory and materials.
- Production plant deployment.
- Working capital for institutional delivery timing.
- GM / business-development / finance operations capacity.
- Impact reporting and governance.
- Contingency / cash buffer.

### 7. Finance dashboard cleanup in admin

The admin site already has pieces. The next useful admin artifact is a single finance-readiness view:

- Xero paid / due / overdue.
- Receivables and payables.
- Current cost ladder.
- Founder-time scenario status.
- Cash buffer state.
- Links to the model, accountant pack and source wiki pages.

## Page and link set for the meeting

Show these in order:

1. Area 04 Notion page: https://www.notion.so/36eebcf981cf8167884fc3d5ecda0e32
2. QBE Documentation Readiness Deep Dive: https://www.notion.so/36debcf981cf818e968de440ad7b9203
3. Goods Cost Register: https://www.notion.so/354ebcf981cf8156bebbf2851ecba5e6
4. Goods Capital Stack: https://www.notion.so/355ebcf981cf8129ac06ff254b562a3f
5. Bed COGS reconciliation: `wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md`
6. Financial model Day 2-10 outputs: `wiki/outputs/2026-05-12-financial-model-day*.md`
7. Utopia trip cost workpaper: `wiki/outputs/2026-05-28-utopia-trip-cost-vs-centrecorp.md`
8. Admin proof locally: `/admin/xero-reconciliation`, `/admin/cost-model`, `/admin/production`, `/admin/trip-receipts`, `/admin/reports`

## Exact meeting script

> The diagnostic correctly called finance a priority gap. Since then we have built the workpapers: Xero revenue and expense pulls, a v0.1 cashflow model, founder-time sensitivity, corrected COGS, a capital stack, a buffer policy, and admin dashboards that show the operating data. The gap now is conversion into one accountant-reviewed Goods-only financial pack. We will not overclaim audited profitability, self-sufficiency or committed capital. We can show the real progress, the source evidence, and the exact decisions still needed: opening cash, founder FTE, receivables, payables, capex/inventory, ACT carve-out and accountant endorsement.

## Next build sequence

1. Confirm opening cash and current receivables/payables.
2. Lock Ben/Nic founder FTE assumptions.
3. Build Goods-only 3-statement workbook from Day 2-10 outputs.
4. Ask accountant/bookkeeper to review ACT-GD carve-out, GST, R&D, entity coding, capex/inventory and founder time.
5. Convert the workbook into a 2-page investor financial summary.
6. Add a one-screen finance-readiness dashboard to admin once the model is stable.

