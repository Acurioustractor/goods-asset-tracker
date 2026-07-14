# QBE Area 10 - Investors And Capital Raising Full Review

Date: 2026-05-29
Status: Internal synthesis for founder review
Diagnostic area: 10 - Investors and capital raising
Notion source: https://www.notion.so/36eebcf981cf81329a11e33e2d121bf9

## Bottom line

Area 10 is the integration point for all other diagnostic areas. Goods has real investor-relevant proof: Stretch Bed product evidence, live asset tracking, admin pipeline surfaces, funder reports, a capital stack v0.1, cost model work, QBE pathway material, and funder-specific pages. The gap is not imagination. The gap is investor-grade evidence control.

For the meeting, the clearest position is:

"We have strong verbal and operational proof. The next phase is to convert it into a founder-authored investor pack, a QBE matched-funding evidence file, an LOI tracker, and a use-of-funds budget where every claim is labelled verified, modelled, target, future, or internal-only."

## Diagnostic summary

The diagnostic says investor readiness is partially developed. Goods has a compelling story when founders explain it directly: clear problem, product traction, replicable operating model, demand across buyers, and a future community ownership pathway. The main investor-readiness gap is concise founder-authored documentation backed by the financial model, projections, risk, governance, legal structure, and impact evidence.

The diagnostic also says equity is not the near-term centre of gravity. Conventional external equity should stay low priority unless the structure evolves toward community ownership. The capital that fits now is grants, philanthropy, recoverable grants, patient working capital, procurement-backed finance, and later community-owned equity.

## What is verified now

| Evidence | Current read | Status |
|---|---|---|
| QBE Diagnostic Artifact Database Area 10 exists in Notion | Page title "10 - Investors & Capital Raising"; status was Drafting before this review. | verified |
| Capital stack wiki exists | `wiki/articles/enterprise/10-investors-capital-raising.md`, `wiki/articles/capital/funder-register.md`, Day 8 capital stack. | verified |
| Funders and investor surfaces exist on the website/admin | `/pitch`, `/admin/funders`, `/admin/deals`, `/admin/reports`, `/admin/library`, `/admin/xero-reconciliation`, `/funders/minderoo`. | verified |
| Funder report outputs exist | `wiki/outputs/funder-reports/centrecorp/2026-Q2.md`, `wiki/outputs/funder-reports/snow/2026-Q2.md`. | verified |
| Live Supabase CRM pipeline can be queried directly | 43 `crm_deals` rows; 23 active; 20 won; active pipeline AU$3,418,698; active weighted AU$604,040; won AU$898,863 at query time 2026-05-28T23:06:57Z. | verified |
| Live asset/admin counts can be queried directly | 561 assets, 523 deployed, 520 bed assets, 41 machine assets, 27 communities, 19 production shifts, 8 bed signals at query time 2026-05-28T23:07:09Z. | verified |
| Latest production shift data is stale | Most recent production shift in Supabase query was 2026-03-12. | verified |
| Protected Minderoo funder page exists | Login and authenticated pages returned HTTP 200 and screenshots were captured. | verified |

## Website and admin proof reviewed

| Route or source | What it proves | Useful | Risk/noise |
|---|---|---|---|
| `/pitch` | Founder/investor style narrative, product proof, community voices, ask, funder support. | Useful as a story scaffold. | Uses stale or conflicting numbers: 369+ beds, $500K ask, retail/sponsor pricing, "advisory board", community ownership language. Needs evidence labels before external use. |
| `/funders/minderoo` | Funder-specific investor brief, ask options, facility plan, buyer pipeline, capital stack, QBE framing. | Strong format for tailored funder pages. | Current copy overclaims DGR1 status, community ownership, QBE unlock, SEFA de-risking, and "existing buyer pipeline" unless backed by signed evidence. |
| `/admin/funders` | Funder registry and report-generation surface. | Useful internal operating proof. | Not an investor artifact by itself. It shows tooling, not commitment. |
| `/admin/reports` | Per-funder reports generated from live data/templates. | Useful for showing reporting capability to Snow/Centrecorp style funders. | Needs claim review before sending any generated report externally. |
| `/admin/deals` | Kanban for sales, funding, partnerships, procurement. | Most useful pipeline surface. | Pipeline value is not committed capital and cannot be counted as QBE match without signed LOIs/contracts. |
| `/admin/xero-reconciliation` | Invoice/payment reconciliation helper from CRM notes. | Useful for finance-operating maturity. | Not accountant-reviewed financials. Treat as workpaper/admin proof. |
| `/admin/library` | Source-of-truth links, funder pages, templates, missing media/content list. | Useful for demoing operational maturity and artifact gaps. | Some counts and shared-content links reflect the same copy-risk issues as funder pages. |
| `v2/src/lib/data/funder-shared-content.ts` | Shared investor stats, buyer pipeline, capital stack, QBE program description. | Useful central place to fix investor copy. | Contains risky claims: 600+ beds, $445K grant funding, ~$3M target, committed buyer pipeline, capital stack close mid-2026. |
| `v2/src/lib/data/funder-pages.ts` | Funder-specific asks and rationale. | Useful reusable structure. | Minderoo page states "DGR1 status" and "fully unlocks QBE match" too strongly. |
| `v2/src/lib/data/grant-content.ts` | Grant boilerplate. | Useful only after legal/finance review. | Contains stale/overstrong DGR, funding, local production, and transfer language flagged by the cross-area review. |

Screenshot evidence captured:

- `output/playwright/qbe-area10/pitch.png`
- `output/playwright/qbe-area10/admin-funders.png`
- `output/playwright/qbe-area10/admin-deals.png`
- `output/playwright/qbe-area10/admin-reports.png`
- `output/playwright/qbe-area10/admin-library.png`
- `output/playwright/qbe-area10/admin-xero-reconciliation.png`
- `output/playwright/qbe-area10/funders-minderoo-login.png`
- `output/playwright/qbe-area10/funders-minderoo.png`

## Current capital story

| Layer | Current evidence | External-use wording |
|---|---|---|
| QBE Stage 2 | Wiki and readiness docs say QBE Stage 2 is match-contingent. Internal docs conflict between up to AU$200K and up to AU$400K; the latest wiki/deep-dive uses up to AU$400K. | "QBE Stage 2 is a matched-funding pathway; confirm the exact cap and eligible match terms before using a number externally." |
| Received funder/program money | Funder register source-trail subtotal AU$405,685. Some pages use AU$445K and older docs use different totals. | "We have received substantial funder/program support; final figure requires finance reconciliation before investor use." |
| CRM won value | Direct Supabase query shows AU$898,863 won across 20 CRM deals. | "CRM won value is an operating/pipeline mirror, not audited accounts." |
| Active pipeline | Direct Supabase query shows AU$3,418,698 active pipeline and AU$604,040 weighted active value. | "Active pipeline is not committed capital. It is useful for prioritisation, not QBE match evidence." |
| QBE match candidates | Snow R4, SEFA, PFI/PRF, IBA, Minderoo, First Australians Capital, TFFF, Centrecorp/procurement-linked capital. | "Named candidates under review; status must be tracked from research to signed LOI." |
| Debt and recoverable capital | SEFA/IBA/Minderoo/PFI are plausible fit only after finance, legal, governance, and repayment tests. | "Patient/recoverable capital may fit confirmed-order working capital once the model, governance, and repayment path are defensible." |
| Community equity | Strong mission fit later. | "Future pathway only. Do not include as 2026 capital unless legal/entity structure is settled." |

## Investor pack skeleton

Build the investor pack as a modular set, not one glossy deck. Each module should point back to the diagnostic area that supports it.

| Pack module | Source areas | Content | Status |
|---|---|---|---|
| 1. Founder story | 01, 05, 10 | Why Goods exists, what is already proven, why this phase matters. | draft needed by founder |
| 2. Product proof | 01, 03, 04, 06 | Stretch Bed specs, photos, product page, assembly, warranty, cost ladder. | partial |
| 3. Impact proof | 02, 07 | Theory of Change, priority metrics, tracked/modelled/future claim map. | partial |
| 4. Market and buyer proof | 03, 10 | Buyer segments, procurement pathways, buyer sheet, demand evidence, QBE market research. | partial |
| 5. Finance summary | 04 | Goods-only model, cashflow, 3-statement gap, founder FTE costing, accountant review. | partial/gap |
| 6. Use of funds | 04, 05, 08, 10 | Inventory, facility, operations, GM/BD/finance capacity, community partner support, impact/reporting, legal. | draft needed |
| 7. Risk and scenarios | 05 | Risk register, scenario response table, downside controls. | partial |
| 8. Operating backbone | 06 | Asset register, QR flow, reports, GHL, admin, SOP index. | partial |
| 9. Governance/reporting/data | 07 | Advisory vs board, reporting calendar, data sovereignty, consent. | partial |
| 10. Team and capacity | 08 | Now/next org chart, GM role, BD/sales ops role, founder bottleneck. | partial |
| 11. Legal/entity/IP | 09 | Contracting party, ACT/Goods/Butterfly/community entity options, mission protection, IP/licence. | partial/gap |
| 12. Ask and close plan | 10 | Target raise, QBE match path, LOI tracker, due dates, next meetings. | draft needed |

## LOI tracker v0.1

This should become a Notion table or admin sheet before any QBE Stage 2 conversation that relies on matched capital.

| Column | Purpose |
|---|---|
| Target organisation | Funder, buyer, lender, grantmaker, partner, or procurement body. |
| Type | buyer, funder, debt, grant, recoverable grant, guarantee, partner, procurement-linked capital. |
| Evidence source | Notion page, email, CRM deal, Xero invoice, signed file, meeting note, source URL. |
| Ask amount | Amount requested or likely. Leave blank if not real. |
| Units/order basis | Bed quantity, washer quantity, facility item, working-capital line, program scope. |
| QBE match eligibility | eligible, likely, unclear, not eligible, needs confirmation. |
| Status | target, research-only, warm, active conversation, draft proposal, verbal support, draft LOI, signed LOI, contract, cash received. |
| Contracting entity | Nicholas Marchesi sole trader (current), A Curious Tractor Pty Ltd (go-forward, t/a Goods on Country), Butterfly Movement Ltd (DGR home from FY2026-27), future community entity. (A Kind Tractor Ltd is dormant and not used.) |
| Current blocker | Finance, legal, governance, impact evidence, buyer approval, source trail, relationship owner, timing. |
| Next action | Specific next touch, document, call, or decision. |
| Owner | Ben, Nic, accountant, legal, advisor, QBE volunteer, other. |
| Due date | Date needed to support 31 Aug QBE match deadline. |
| External wording | The exact sentence we can safely say externally today. |

Status ladder:

1. target
2. research-only
3. warm
4. active conversation
5. draft proposal
6. verbal support
7. draft LOI
8. signed LOI
9. contract
10. cash received

Immediate lanes to track:

| Lane | Why it matters | Current handling |
|---|---|---|
| Snow R4 / Snow follow-on | Existing relationship and credibility. | Track as warm/draft unless current written commitment exists. |
| Centrecorp/Centrebuild | Buyer proof and potential Central Australia capital conversation. | Split receivable/order proof from future capital conversation. |
| SEFA | Patient working capital candidate. | Requires cashflow, governance, repayment, and legal readiness. |
| Minderoo | Tailored funder page exists and catalytic ask drafted. | Needs claim cleanup before sharing; treat as warm/research unless formal opportunity exists. |
| PRF/PFI | Recoverable grant candidate. | Confirm whether formal EOI/application exists before external use. |
| IBA/FAC | Indigenous business finance pathway. | Requires legal/community ownership structure and business plan. |
| TFFF and other philanthropy | Grant support candidates. | Use fit score and current relationship evidence before outreach. |
| NPY/Miwatj/Groote/health buyers | Buyer demand and procurement-linked capital. | Track as buyer/procurement, not funder money, until contracted. |

## QBE matched-funding evidence checklist

| Evidence required | Current proof | Gap before external use |
|---|---|---|
| Confirm exact QBE Stage 2 terms | Internal docs say match required, latest wiki says up to AU$400K; older mirror says AU$200K. | Get QBE/SIH-confirmed cap, eligible match definitions, deadline, and accepted instruments. |
| Signed external commitments | None verified in this review as signed LOIs for Stage 2 match. | Build LOI tracker; secure signed eligible commitments. |
| Source documents | Some wiki/Notion source trails and CRM deals exist. | Attach signed letters/contracts, not just summaries. |
| Amount and timing | CRM has amounts/probabilities; finance docs have scenarios. | Confirm amount, payment timing, restrictions, and whether money counts as match. |
| Legal entity | Confirmed: trading today via Nicholas Marchesi sole trader, migrating to A Curious Tractor Pty Ltd (ACN 697 347 676, t/a Goods on Country) this FY; Butterfly Movement Ltd is the DGR home from FY2026-27. Community entity pathway is future. | Confirm the applicant/contracting entity per grant during migration, plus who receives funds, signs, invoices, warrants, reports, and repays. |
| Finance pack | Cashflow v0.1 and cost model work exist. | Build Goods-only 3-statement model and accountant-reviewed financial summary. |
| Use of funds | Working categories exist. | Turn categories into budget by tranche with owner, timing, and evidence source. |
| Risk and governance | Risk philosophy and governance work exist. | Board/advisory/accountability structure and risk register need external-ready form. |
| Impact evidence | Asset register, QR, /impact, claim map exist. | Produce impact report with tracked/modelled/future labels and no unmeasured health outcomes. |
| Founder-authored narrative | Verbal story is strong; written pack still AI/wiki/admin-heavy. | Ben/Nic rewrite and sign off. |

## Use-of-funds budget v0.1

Use this as the budget skeleton. Do not add final amounts until finance has reconciled the model.

| Use of funds | Why it belongs | Best-fit capital |
|---|---|---|
| Stretch Bed inventory | Lets Goods respond to demand without waiting for each funded batch. | Grants, procurement-backed working capital, patient debt. |
| Materials and freight | Bridges payment timing, bulk purchasing, remote delivery, and replacement risk. | Working capital tied to orders or commitments. |
| Production facility and equipment | Builds on-country/on-pathway production capability and cost reduction. | Grants, philanthropy, government jobs/waste funding, catalytic capital. |
| GM/operations role | Reduces founder bottleneck and makes delivery reliable. | Grant/philanthropy first, then operating revenue. |
| Business development/sales ops | Turns warm buyer demand into orders, LOIs, and procurement pathways. | QBE support, philanthropy, revenue-supported role. |
| Finance/accounting/reporting | Required for repayable capital and funder confidence. | QBE, philanthropy, operating budget. |
| Community partner readiness | Covers training, coordination, local capacity, cultural governance, and partner time. | Grants/philanthropy/community development capital. |
| Impact/data/reporting | Builds claim discipline and community-controlled reporting. | Grants/philanthropy, not fast-repay debt. |
| Legal/entity/IP/mission protection | Needed before debt, DGR donations, community ownership, IP licence, or benefit-share. | Philanthropy, pro bono, legal budget. |
| Working capital buffer | Avoids unsafe debt or emergency founder subsidy. | Patient working capital only if downside case is modelled. |

## Investor FAQ

| Question | Current answer |
|---|---|
| Why not equity? | Conventional external equity is low fit for 2026 because Goods is still resolving legal structure, community ownership, governance, and product-market proof. Equity only becomes interesting later if communities can own it. |
| Is the QBE match secured? | No. QBE Stage 2 is a match-contingent pathway. Signed eligible commitments must be secured and evidenced. |
| Can active pipeline be counted as match? | No. Active pipeline is prioritisation evidence only. Match needs eligible signed commitments or contracts under QBE rules. |
| Is DGR status live? | Not yet. DGR is via The Butterfly Movement Ltd only, operational from FY2026-27 (~1 July 2026), and remains subject to handover, governance, legal, and related-party safeguards. Goods / A Curious Tractor / A Kind Tractor never hold DGR directly. Do not say Goods itself has DGR1 status. |
| Is on-country production already permanent? | No. There is a production pathway and plant/prototype evidence. Permanent on-country/community-owned production is target/future unless tied to a specific operating site and agreement. |
| Are wellbeing outcomes measured? | Delivery, assets, QR tracking, and some stories are tracked. Longitudinal wellbeing and health outcomes should be labelled modelled/target/future unless data exists. |
| Can debt be repaid? | Not yet externally defensible without the Goods-only financial model, confirmed orders, repayment timing, governance, and downside scenarios. |
| Who signs contracts? | Needs a contracting-party checklist from Area 09 before external buyer/funder sheets. |

## Useful versus noise

Useful now:

- Direct founder story and verbal clarity.
- Stretch Bed product proof and current specs from `v2/src/lib/data/products.ts`.
- `/pitch` as a rough story scaffold.
- `/admin/deals` as the live operating pipeline.
- `/admin/reports` and funder report outputs as reporting proof.
- `/admin/library` as the source-and-gap index.
- Capital/funder register and investor alignment wiki pages.
- Direct CRM and asset counts, if dated and labelled as admin workpaper data.

Noise or high-risk until cleaned:

- Any single headline number without source/date.
- "600+ beds" beside direct asset query showing 520 bed assets and 523 deployed assets.
- "Grant funding to date $445K" while the funder register says AU$405,685 source-trail subtotal and other docs have other totals.
- "DGR1 status" on funder pages.
- "Fully unlocks QBE match" or "de-risks SEFA" without signed eligible commitments.
- "Committed buyer pipeline" unless buyer commitment evidence is attached.
- "Advisory board" if the group is advisory/support network, not a formal board.
- "Community-owned" as a current legal state rather than a pathway.
- Production and inventory readiness claims that rely on stale March 2026 admin data.

## Website/admin changes required

P0 before external investor/funder sharing:

1. Fix shared funder stats in `v2/src/lib/data/funder-shared-content.ts`.
   - Replace 600+ with a dated canonical count.
   - Replace $445K with finance-reconciled funding or label it source-trail only.
   - Replace "~$3M capital stack target, close mid-2026" with a staged target and evidence status.

2. Fix Minderoo-specific claims in `v2/src/lib/data/funder-pages.ts`.
   - Remove or caveat "DGR1 status" (DGR is via The Butterfly Movement Ltd only, from FY2026-27, never Goods directly).
   - Change "fully unlocks QBE match and de-risks SEFA" to "could support the match pathway if QBE eligibility and signed terms are confirmed."
   - Change current community ownership wording to a pathway/target unless signed structure exists.

3. Build the LOI tracker and QBE match checklist before any Stage 2 pack.

4. Create a canonical numbers sheet.
   - Deployed assets, bed assets, total assets, delivered beds, sales/orders, received funding, won CRM value, active pipeline, weighted pipeline, communities.
   - Each row needs date, source, definition, and external-use status.

5. Quarantine stale grant boilerplate in `v2/src/lib/data/grant-content.ts` before using generated copy externally.

P1 next:

6. Add "claim label" badges to funder/pitch pages: verified, modelled, target, future.
7. Add "last refreshed" labels to production/inventory/pipeline data.
8. Split advisory/support network from formal governance in pitch/funder pages.
9. Create a founder-reviewed investor FAQ page in Notion and link it from Area 10.
10. Add a route or Notion database view for LOIs with proof links.

## Meeting talk track

"We have now mapped all ten diagnostic areas. The investor/capital area pulls them together. Goods already has proof: product in field, live asset tracking, buyer/funder pipeline, cost model work, funder reports, and a real QBE Stage 2 pathway. What is not yet ready is external investment collateral. We need to turn the operating proof into four artifacts: a founder-authored investor pack, an LOI tracker, a QBE matched-funding evidence checklist, and a use-of-funds budget. We also need to clean the website and funder pages so active pipeline, future community ownership, DGR status, and impact outcomes are never presented as already secured."

## First build tasks

1. Founder edits the one-page investor story in their own voice.
2. Create the LOI tracker with the status ladder above.
3. Confirm QBE Stage 2 match cap and eligible evidence rules with SIH/QBE.
4. Build the use-of-funds table from the finance model, not from narrative.
5. Clean `funder-shared-content.ts`, `funder-pages.ts`, and `grant-content.ts` before sharing any funder link.
6. Create a canonical numbers sheet with date/source/status labels.

## Sources reviewed

- `/Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf` text extract, Area 10.
- `wiki/articles/enterprise/10-investors-capital-raising.md`
- `wiki/articles/capital/funder-register.md`
- `wiki/articles/investors/investor-pipeline.md`
- `wiki/articles/investors/our-investment-needs.md`
- `wiki/articles/investors/alignment-tool.md`
- `wiki/articles/investors/knockout-criteria.md`
- `wiki/outputs/2026-05-12-financial-model-day8-capital-stack.md`
- `wiki/outputs/2026-05-28-qbe-documentation-deep-dive.md`
- `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- `v2/src/lib/data/funder-shared-content.ts`
- `v2/src/lib/data/funder-pages.ts`
- `v2/src/app/pitch/page.tsx`
- `v2/src/app/funders/[slug]/page.tsx`
- `v2/src/app/admin/funders/page.tsx`
- `v2/src/app/admin/deals/page.tsx`
- `v2/src/app/admin/deals/actions.ts`
- `v2/src/app/admin/reports/page.tsx`
- `v2/src/app/admin/library/page.tsx`
- `v2/src/app/admin/xero-reconciliation/page.tsx`
- Direct v2 Supabase query using project `cwsyhpiuepvdjtxaozwf`, not Supabase MCP.
