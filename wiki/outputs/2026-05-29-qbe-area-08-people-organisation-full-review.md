# QBE Area 08 - People & Organisation Full Review

Date: 2026-05-29
Status: Built for founder review
Diagnostic area: 08 - People and Organisation
Primary question: Does the enterprise optimise its structure, capabilities and staffing to deliver the strategic objectives and vision?

## Meeting-ready read

Area 08 should be presented as a strong capability story with a serious capacity constraint.

Goods has unusually strong founder capability, practical product/build knowledge, community partner relationships and the beginnings of production transfer. The risk is not that the work lacks people around it. The risk is that too much of the operating system still depends on Ben and Nic holding relationships, product judgement, procurement, production, reporting, funder narrative and sales follow-up at once.

The clean line for QBE is: "We have proved the model with a very lean team. The next phase is not to build a heavy head office; it is to move repeatable operating work off the founders into a GM/ops role, a sales-ops/procurement role, production leadership, finance support and community-held production capacity."

## Diagnostic summary

The diagnostic credits Goods with:

- Two highly capable, complementary cofounders with experience across community engagement, product development and organisational scaling.
- Production capability transferred from founders toward a low-skilled operator model in the current production facility, showing the model can scale without relying only on founders for production.
- Strong partnerships, including Oonchiumpa Consultancy and Services, an Alice Springs based 100% Aboriginal-staffed organisation, and active conversations with community partners including Palm Island Community Company.

The diagnostic gaps are:

- The two founders are the only workers on the project, which is the most significant capacity constraint.
- Priority hires are a General Manager and a Business Development or sales-operations lead.
- Sales operations and procurement are identified skills gaps; the founders are not positioned to manage scaled institutional procurement processes alone.
- Founder compensation is ad hoc through contractor distributions and no fixed salary; investor-ready financials should model fair-market founder FTE cost even if not drawn.

## What is verified

Verified from Notion/wiki:

- The QBE Area 08 Notion database page exists and frames the gap as a Ben/Nic bottleneck with GM and business development/procurement capacity missing.
- The older Notion mirror "8. People and Organisation" maps Goods as a program inside ACT with Ben/Nic, ACT shared services, Oonchiumpa, production contractors, design/engineering partners and funder/advisor support.
- The Notion Oonchiumpa materials show a live Alice Springs partner pathway, not a complete Goods-owned production plant.
- `wiki/articles/enterprise/08-people-and-organisation.md` separates founder leadership, ACT shared services, community partners, production partners/operators, design/technical partners and advisory support.
- `wiki/articles/communities/alice-springs-oonchiumpa.md` identifies Oonchiumpa as a live pathway with strong relationship evidence and unresolved details around plant location, operator structure, funding, ownership/revenue relationship, staffing and training.
- `wiki/articles/sources/production-facility-guide.md` gives useful production-flow evidence but is marked as needing review.

Verified from active `v2/` code:

- `v2/src/lib/data/team.ts` lists two public founder profiles: Nic Marchesi and Ben Knight.
- `/admin/team` renders a team manager from the `team_members` table plus advisory/support cards from `v2/src/lib/data/compendium.ts`.
- `v2/src/lib/data/compendium.ts` currently has 13 advisory-board/support-network rows. Area 07 already flagged that this should be split into formal advisory roles versus broader support network.
- `/about` describes a small Goods team and public impact metrics. It is useful proof but should be reconciled before investor use.
- `/partners/oonchiumpa` gives a strong Oonchiumpa public proof surface, including partner context, photo/video evidence and delivery figures. It should be used with consent and number discipline.
- `/admin/production`, `/admin/deals` and `/admin/communities` show the operating load that future roles would need to hold.
- `v2/src/lib/data/grant-content.ts` contains stale/high-risk grant identity material and should not be treated as current people/governance proof without review.

Verified from direct v2 Supabase query at 2026-05-28T20:12Z:

- `team_members`: 0 rows. The live team database is not yet a staffed organisation register.
- Static public team file: 2 founders.
- Advisory/support compendium in code: 13 rows, requiring advisory/support split.
- `production_shifts`: 19 rows; operators recorded as Ben/Ben Knight for 18 shifts and Joey for 1 shift; 94 sheets produced; latest recorded shift 2026-03-12.
- `production_inventory`: 1 latest snapshot dated 2026-03-27, with operator "Admin Update", 4 beds possible, 9 steel poles, 200 canvas ready, 150 tabs ready, 168 legs ready and 60kg raw plastic.
- `communities`: 27 rows, including 7 active, 3 administrative, 1 exploring, 1 testing and 15 prospects.
- Partner rollup includes Oonchiumpa, PICC, Wilya Janta and other community/organisation relationships.
- `community_demand`: 885 total open-demand quantity across 7 rows.
- `assets`: 561 rows, 674 total quantity.
- `crm_deals`: 43 rows, 23 active and 20 won; active pipeline AUD 3,418,697.80 and active weighted pipeline AUD 604,040.
- `orders`: 30 rows; `tickets`: 1 row; open alerts: 11.

## Website/admin proof reviewed

Local screenshots were captured from the running app on `http://localhost:3017`:

- `output/playwright/qbe-area08/admin-team.png` - team/advisory admin surface.
- `output/playwright/qbe-area08/about-team.png` - public team/about proof.
- `output/playwright/qbe-area08/partners-oonchiumpa.png` - Oonchiumpa partner proof surface.
- `output/playwright/qbe-area08/admin-production.png` - production operations and operator evidence.
- `output/playwright/qbe-area08/admin-deals.png` - sales/funding/procurement pipeline surface.
- `output/playwright/qbe-area08/admin-communities.png` - community/partner demand and delivery surface.

Routes reviewed locally:

- `/admin/team` returned 200.
- `/about` returned 200.
- `/partners/oonchiumpa` returned 200.
- `/admin/production` returned 200.
- `/admin/deals` returned 200.
- `/admin/communities` returned 200.
- `/production` returned 307, which means it is redirected or gated in the current local flow.

## Now/next org chart

### Current state

| Layer | Who/what | Current role | Evidence | Risk |
|---|---|---|---|---|
| Founder leadership | Ben Knight and Nic Marchesi | Product vision, community relationships, production judgement, sales/funder narrative, reporting and operating decisions | Static team file, diagnostic, wiki Area 08 | Founder bottleneck across too many functions |
| ACT shared services | ACT infrastructure, finance/admin/story tooling | Shared platform and support around Goods | Wiki, admin/reporting systems | Informal subsidy can hide true FTE cost |
| Community partners | Oonchiumpa, PICC, Wilya Janta and others | Local relationship, demand, delivery context and future production pathway | Notion/wiki, `/partners/oonchiumpa`, community rollup | Do not describe partners as staff or Goods-controlled |
| Production operators/cohort | Current production logs mostly Ben; one Joey shift; Oonchiumpa pathway emerging | Production work, training pathway and operator model | `production_shifts`, production guide | Transfer is promising but not yet independently proven at scale |
| Advisory/support network | Aboriginal leaders, product/manufacturing, philanthropy, social enterprise and technical supporters | Advice, connections, design/product and funding support | Compendium, advisory wiki, Area 07 | Support network is not a formal board or staff team |
| Systems/admin | Supabase, admin routes, Notion/wiki, EL, GHL, Stripe/Xero | Captures work and makes some operations repeatable | Code and data queries | Systems still need owners, rhythms and cleanup |

### First scale hires or contracted roles

| Role | Why this role first | What moves off founders |
|---|---|---|
| General Manager / Operations Lead | Converts founder-held operating judgement into weekly cadence, delivery discipline and accountable follow-up | Weekly operating rhythm, order flow, production coordination, logistics, support queue, admin hygiene |
| Business Development / Sales-Ops / Procurement Lead | Converts warm relationships into institutional buyer progress, LOIs and procurement-ready materials | Buyer follow-up, pipeline hygiene, procurement packs, LOI tracking, buyer reporting, contract/admin coordination |
| Production Lead / Trainer | Turns production transfer into repeatable training, QA and capacity planning | Shift rhythm, operator training, stock checks, QA, equipment readiness, production SOPs |
| Finance / fractional CFO or accountant support | Makes fair-market FTE cost, cashflow and investor reporting defensible | Founder FTE costing, monthly accounts, 3-statement model review, board/funder reporting |
| Community Relationship / Data Consent Coordinator | Protects community trust while delivery and story volume grows | Partner follow-up, consent checks, EL/story admin, photo/video use review, community feedback loop |

### Community production operating model

| Function | ACT/Goods role | Community/partner role | Boundary |
|---|---|---|---|
| Product/IP/quality | Product standard, safety, warranty, QA and improvement loop | Local use feedback, repair insights, operator input | Goods must not give away quality accountability before the QA system is mature |
| Production operations | Training package, production SOPs, tooling specs, materials sourcing and reporting template | Local operators, production lead, plant rhythm and employment pathway | Current state is target/future unless staffing, plant and contracts are signed |
| Sales/demand | Institutional buyer pipeline, funder contracts, buyer reporting and freight/support terms | Local demand intelligence, community-level prioritisation and installation context | Do not make community partners responsible for institutional procurement unless agreed |
| Ownership/benefit pathway | Entity option memo, licence/benefit-share design, mission protection | Local enterprise ownership or co-ownership pathway when ready | Ownership transfer needs legal, finance and governance triggers |
| Data/story | Consent rules, EL/Supabase systems, reporting guardrails | Community consent, story review and local accountability | Raw story/household data remains internal unless explicitly consented |

## Role-to-system map

| System or surface | Current owner pattern | Next owner | What they should do weekly |
|---|---|---|---|
| `/admin/deals` / GHL | Founder-held | BD/sales-ops lead | Update stage, next action, amount, units, procurement blocker and LOI status |
| `/admin/communities` | Founder/admin-held | GM/ops lead + community coordinator | Check open demand, delivery status, partner notes and next community action |
| `/admin/production` | Founder/production-held | Production lead/trainer | Update shifts, stock, QA, capacity and training notes |
| `/admin/team` | Empty live table plus static compendium | GM/ops lead | Keep current team, contracted roles, advisors and planned roles distinct |
| `/admin/reports` | Founder/reporting-held | GM/ops + finance/reporting owner | Produce draft buyer/funder/internal reports for founder review |
| Xero/financial model | Founder/accountant-held | Finance/CFO support | Reconcile, update cashflow, model founder FTE cost and flag runway risk |
| Notion/wiki | Founder/Codex-supported | Founder + GM/ops | Keep artifact register current and mark claims verified/target/future |
| Empathy Ledger/story admin | Founder/ACT/EL-held | Community/data consent coordinator | Check consent, pending review, public story status and withdrawal risk |

## Founder capacity risk note

### Evidence of risk

- Live `team_members` table has 0 rows, while public static team has 2 founders.
- Production shifts show 18 of 19 recorded shifts by Ben/Ben Knight.
- Active pipeline is large relative to current team: 23 active deals and AUD 3.42m active pipeline at query time.
- Community/admin surface is broad: 27 community rows, 885 open-demand quantity, 561 asset rows, 30 orders, 11 open alerts and funder/buyer/reporting obligations.
- The diagnostic explicitly identifies the founders as the only workers on the project and names this as the most significant capacity constraint.

### What could fail if not fixed

- Warm buyer relationships do not become signed LOIs in time for QBE/SEFA matched-funding evidence.
- Procurement and institutional buyer processes stall because founders are holding too many threads.
- Production transfer remains anecdotal because operators, shifts, QA and training are not documented enough.
- Founder compensation remains invisible in the model, making margin and runway look better than they really are.
- Community trust is stressed if delivery, story consent, support and follow-up are not owned clearly.
- Admin dashboards become impressive but stale if no human owns data hygiene.

### Mitigation

- Write and approve GM/ops and BD/sales-ops role briefs.
- Model founder FTE at fair-market rate in the GOC-only financial model, even if not drawn.
- Make `/admin/team` a real operating-capacity register with current, contracted, advisory and planned-role statuses.
- Move pipeline hygiene, procurement packs and LOI tracking into a weekly BD operating rhythm.
- Move production shifts, QA, stock and training evidence into a weekly production rhythm.
- Separate advisory board, support network, community partner and staff roles.
- Create a 90-day delegation plan for work that must move off Ben/Nic before Stage 2 capital.

## GM / Operations Lead role brief v0.1

Purpose: turn Goods from founder-held operating intensity into a disciplined weekly operating system without losing community trust or product judgement.

Accountabilities:

- Run the weekly operating rhythm across production, fulfilment, delivery, support, inventory, reporting and admin hygiene.
- Keep `/admin/communities`, `/admin/production`, orders, support tickets and alerts current.
- Convert SOPs into actual repeatable practice: who updates what, by when, and what gets escalated.
- Coordinate production readiness, freight, installation/handover and buyer/community follow-up.
- Prepare monthly management snapshots for founders/advisors: delivery, production, cash blockers, risk and decisions needed.
- Protect founder time by escalating only decisions that genuinely need founder judgement.

First 90 days:

- Clean the operating dashboard and define the weekly data update rhythm.
- Create a live owner map for orders, production, delivery, support, buyer follow-up and community follow-up.
- Build a simple production/delivery readiness checklist.
- Produce the first internal monthly management pack.
- Identify which founder tasks can be fully delegated by month three.

Required capability:

- Practical operations management, not corporate bureaucracy.
- Comfort with messy early-stage systems, remote delivery and community partner contexts.
- Strong admin discipline, clear escalation habits and respect for consent/community boundaries.

## Business Development / Sales-Ops / Procurement role brief v0.1

Purpose: convert warm institutional demand into signed commitments, procurement-ready buyer materials and repeatable sales operations.

Accountabilities:

- Own pipeline hygiene across sales, funding, partnership and procurement deals.
- Maintain buyer segment map, LOI tracker and procurement status.
- Prepare buyer packs: Stretch Bed price, freight, warranty, support, contracting party, delivery lead time, reporting and procurement pathway.
- Run weekly follow-up on the closest institutional buyers/funders.
- Translate funder/buyer requirements into clear asks for founders, finance, legal and operations.
- Keep QBE matched-funding evidence current and separate warm conversations from signed commitments.

First 90 days:

- Segment the pipeline into 3-4 priority buyer/funder groups.
- Identify the 10 highest-probability commitments and their exact next actions.
- Build a buyer sheet and LOI status tracker.
- Reconcile `/admin/deals` with Notion/QBE evidence requirements.
- Produce a weekly deal-closing report for founders and advisors.

Required capability:

- Institutional sales, procurement, government/nonprofit contracting or B2B sales-ops experience.
- Strong follow-up discipline and comfort with paperwork.
- Ability to avoid overclaiming demand until there is a signed LOI, order or contract.

## Founder FTE costing sheet need

The diagnostic is explicit that founder compensation should be modelled at fair-market rate even if not drawn. This belongs in Area 04, but Area 08 should own the role logic.

Minimum costing sheet:

| Role | Current holder | Current payment basis | Fair-market FTE assumption | Drawn vs not drawn | Model treatment |
|---|---|---|---|---|---|
| Founder/product/community lead | Ben | Ad hoc/contractor distributions | To be set with accountant | Separate actual cash from economic cost | Include as normalised operating cost |
| Founder/product/operations lead | Nic | Ad hoc/contractor distributions | To be set with accountant | Separate actual cash from economic cost | Include as normalised operating cost |
| GM/ops lead | Future hire/contract | Not yet hired | To be set | Future operating cost | Include in scale scenario |
| BD/sales-ops/procurement lead | Future hire/contract | Not yet hired | To be set | Future operating cost | Include in QBE/scale scenario |
| Production lead/trainer | Future/local role | Not yet hired | To be set | Future operating cost | Include once production pathway is funded |

## Useful vs noise

Useful for the meeting:

- Current/next org chart.
- Founder capacity risk note with evidence from live data.
- GM/ops and BD/sales-ops role briefs.
- Production shift data showing both production activity and founder dependency.
- Oonchiumpa partner page and wiki material, carefully framed as partner pathway and future capacity.
- `/admin/team` screenshot as proof of the current gap, not proof of a staffed team.
- `/admin/deals`, `/admin/communities` and `/admin/production` screenshots to show what future roles will actually operate.
- Founder FTE costing requirement tied back to Area 04 financial model.

Noise or high-risk material:

- Treating the `team_members` table as proof of a current team; it has 0 rows.
- Treating all 13 compendium advisory/support rows as a formal advisory board.
- Presenting Oonchiumpa, PICC, Wilya Janta or other partners as Goods staff.
- Presenting a community production plant, local ownership model or permanent on-country manufacturing as already complete.
- Using stale `grant-content.ts` identity/legal/impact statements without review.
- Presenting public about-page metrics or Oonchiumpa delivery numbers without reconciling them to the current source of truth.
- Letting role briefs imply funded positions before funding and contracts exist.

## Claim discipline

Public/verified claims:

- Goods is currently founder-led by Ben/Nic.
- Goods has a strong partner network, including Oonchiumpa, PICC, Wilya Janta and others.
- Goods has production, delivery, asset, community, deal and reporting systems that make the next operating roles concrete.
- The live team database is not yet a staffed organisation register.
- Production logs show founder-heavy production work with early transfer evidence.

Target claims:

- Goods intends to hire or contract GM/ops and BD/sales-ops/procurement capacity.
- Goods intends to build production lead/trainer and community coordinator roles as the production pathway matures.
- Goods intends to make partner/community production capacity real through training, SOPs, QA and ownership/benefit-share design.

Internal-only or future claims:

- Any claim that founders have been fully replaced in production.
- Any claim that community ownership or local plant operation is structurally complete.
- Any individual compensation, salary or contractor payment details.
- Any unsupported claim that partners are legally bound to operate production.

## Admin/site cleanup needed

1. Make `/admin/team` a real capacity register:
   - Current founders.
   - Current contractors.
   - Advisory group.
   - Support network.
   - Community partners.
   - Planned roles.
   - Each row should have status, role type, scope, start date or target date, owner and evidence link.

2. Split advisory board from support network in `v2/src/lib/data/compendium.ts`:
   - Formal advisors/directors.
   - Supporters/mentors.
   - Partner organisations.
   - Technical/product partners.

3. Refresh `/about` public team language:
   - Keep founder-led truth.
   - Avoid implying a large staff team.
   - Link the next-phase story to partner capacity and planned roles.

4. Reconcile `/partners/oonchiumpa` figures:
   - Confirm public delivery figures against live data and consent-cleared evidence.
   - Keep Oonchiumpa as partner proof, not as a completed Goods-owned plant.

5. Add production-transfer evidence:
   - Operator names/status.
   - Training level.
   - QA sign-off.
   - Shifts completed.
   - Beds/sheets/components produced.

6. Mark or remove stale grant-content:
   - `v2/src/lib/data/grant-content.ts` should not be used as live organisation/legal proof until refreshed.

## First artifacts to build from this page

1. One-page now/next org chart for QBE and advisors.
2. GM/ops role brief.
3. BD/sales-ops/procurement role brief.
4. Founder capacity risk note.
5. Founder FTE costing assumptions sheet for Area 04.
6. `/admin/team` cleanup spec to separate staff, advisors, support network and partners.

## Meeting talk track

"The diagnostic is right that people and organisation is a partial maturity area. Goods has founder capability, community trust and partner capacity, but the next phase has to make that capacity legible and less founder-dependent. Our response is a now/next org chart, two priority role briefs, a founder-capacity risk note and a founder FTE costing sheet. We are also cleaning up the website/admin evidence so we can show what is current, what is planned and what is partner-held without overstating the organisation."

## Open founder questions

1. Which GM/ops tasks can Ben/Nic delegate immediately without new funding?
2. Which BD/sales-ops tasks must be delegated before the QBE Stage 2 submission?
3. What fair-market founder FTE rates should the accountant model?
4. Who should be treated as formal advisory group versus support network?
5. Is Oonchiumpa best described as a production partner, local enterprise pathway, training partner or all three with separate stages?
6. What is the minimum proof needed before saying production has moved beyond founder dependency?

## Sources

- QBE Diagnostic Artifact Database Area 08: https://www.notion.so/36eebcf981cf813cbfbbca1709600971
- Older Notion mirror "8. People and Organisation": https://www.notion.so/348ebcf981cf8102ae24e6ea56b1c1ec
- Goods x Oonchiumpa Notion page: https://www.notion.so/36bebcf981cf8020a79de853483e605e
- `wiki/articles/enterprise/08-people-and-organisation.md`
- `wiki/articles/communities/alice-springs-oonchiumpa.md`
- `wiki/articles/sources/production-facility-guide.md`
- `v2/src/lib/data/team.ts`
- `v2/src/lib/data/compendium.ts`
- `v2/src/app/admin/team/page.tsx`
- `v2/src/app/about/page.tsx`
- `v2/src/app/partners/oonchiumpa/page.tsx`
- `v2/src/app/admin/production/page.tsx`
- `v2/src/app/admin/deals/page.tsx`
- `v2/src/lib/data/grant-content.ts`
