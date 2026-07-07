# QBE Cross-Area Alignment Review

Date: 2026-05-29
Status: Internal synthesis for founder review
Scope: QBE Diagnostic Artifact Database Areas 01-10, with full local review artifacts completed for all ten areas.

## Bottom line

Yes, the 10-area diagnostic build is now complete as an internal review set. All ten areas have local full-review artifacts, and the Notion database row for Area 10 has been updated from Drafting to Built - needs review.

The cross-area story is strong. Goods has real traction across product proof, field deployment, asset tracking, community evidence, funder relationships, cost modelling, admin/reporting infrastructure and legal/governance work in motion. The main work now is not inventing more story. It is tightening the story so every claim is tied to the right evidence label: verified, modelled, target, future or internal-only.

## Traction synergy

| Synergy | Areas reinforcing it | What it proves | How to use it |
|---|---|---|---|
| Stretch Bed is the anchor proof | 01 Vision, 02 Impact, 03 Business Model, 04 Finance | Live product, public shop, product specs, deployed asset base, cost model. | Make Stretch Bed the first investor proof point. Keep washers/fridges secondary. |
| Asset register turns delivery into evidence | 02 Impact, 06 Process, 07 Reporting | Assets, QR URLs, scans, deployment status, funder reports and community rollups exist in live systems. | Use screenshots and dated counts as proof of operating maturity. |
| Admin stack is credible but not magic | 02, 04, 05, 06, 07, 08 | Admin routes expose assets, deals, production, reports, funders, team, Xero, support and stories. | Present as "working operating backbone", not "fully automated system". |
| Finance and business model now connect | 03 Business Model, 04 Finance, 05 Risk | AU$750 public price, AU$600 low-volume cost model, Xero workpapers, scenarios, buffer policy. | Build the investor pack around contribution margin, working capital and scenario discipline. |
| QBE readiness has a clear critical path | 03, 04, 05, 08, 10 | Buyer segment map, LOI need, cashflow timing, founder capacity, matched-funding evidence. | Treat LOIs and use-of-funds as the main Stage 2 gating artifact. |
| Governance/legal/people gaps tell one story | 07 Governance, 08 People, 09 Legal | Advisory exists but is not a board; founders are bottleneck; entity/IP/community ownership still need papering. | Be explicit that the next phase funds operating maturity, not vague scale. |
| Community ownership is powerful but must stay future-labelled | 01, 03, 05, 08, 09 | The intent is consistent across vision, business model, risk, people and legal. | Say "pathway", "target", "designed to move toward"; do not say it is complete. |
| Butterfly can strengthen the capital story | 04, 07, 09, 10 | Confirmed DGR home (from FY2026-27, gifted from TABOO), public-benefit vehicle, governance handover, finance upside. | Use as the confirmed DGR pathway but treat the vehicle as operational from FY2026-27, after the handover and related-party safeguards are complete. |
| Area 10 now ties the evidence together | 01-10 | Investor pack, LOI tracker, QBE matched-funding checklist and use-of-funds budget now have a clear source map. | Use Area 10 as the meeting spine, with each pack module linked back to one diagnostic area. |

## The best investor narrative now

Goods is not at zero. It has shipped product, tracked assets, community evidence, revenue/funder history, a working website/admin stack, a v0.1 finance model and a clear pathway to community production. The QBE phase is about converting that evidence into investor-ready discipline:

- one flagship product proof point;
- one clean buyer/funder pipeline;
- one Goods-only financial model;
- one legal/entity map;
- one governance/reporting rhythm;
- one founder-reviewed claim set.

## Cross-area contradictions and required changes

| Issue | Where it appears | Why it matters | Required change |
|---|---|---|---|
| Product/deployment counts conflict | Public/site/funder copy uses 400+, 496 deployed, 520+, 600+, 633 bed assets, 674 total assets. | Investors will test the numbers quickly. | Create one canonical count table with date, source, row vs quantity, deployed vs tracked, Stretch Bed vs Basket Bed. |
| DGR/entity claims conflict | `grant-content.ts`, older Notion mirror, funder pages vs Area 09 register check. | Legal trust risk. | Quarantine stale DGR/ACNC claims; make The Butterfly Movement Ltd the only DGR pathway (from FY2026-27), caveated as handover/legal-review dependent; never claim DGR via Goods / A Curious Tractor / A Kind Tractor. |
| "ACT Foundation / ACT Ventures" language is stale | Older Notion/wiki and some content assumptions. | Confuses legal structure and contracting party. | Replace with the confirmed entity names: Nicholas Marchesi sole trader (current operating entity), A Curious Tractor Pty Ltd (ACN 697 347 676, t/a Goods on Country, the go-forward trading company), The Butterfly Movement Ltd (DGR home from FY2026-27), future community entities. A Kind Tractor Ltd is dormant and not used. |
| Community ownership is over-stated in places | "We don't license. We transfer"; "40% community share"; "community-owned asset" wording. | Can turn mission intent into an unsupported legal claim. | Use "community ownership pathway" until entity, IP, licence and benefit-share agreements are signed. |
| "Made On-Country" can overclaim current production | Public/process/funder copy vs current Defy/Sydney and production evidence. | Undermines production credibility. | Say "designed for on-Country production" or "on-Country production pathway" unless a specific batch was made locally. |
| Impact page provenance is too strong | Area 02 flags "Every number is live" and mixed live/modelled metrics. | Directly repeats diagnostic criticism. | Add provenance labels to `/impact`; separate tracked, modelled, target and future claims. |
| Orders/revenue proof is noisy | Area 03 and 04: order rows include tests/legacy/cancelled; Xero is workpaper, not audited accounts. | Could inflate commercial traction. | Do not use raw order totals externally; build Goods-only accountant-reviewed financial pack. |
| Active pipeline is not committed capital | Areas 03, 05, 08, 10. | QBE Stage 2 requires matched funding evidence, not warm interest. | Build LOI tracker with status: target, warm, verbal, draft LOI, signed LOI, contract, cash. |
| Team/advisory proof is blurred | `/admin/team`, compendium, Area 07/08. | Advisory support can look like formal board/staff. | Split staff, contractors, advisors, support network, community partners and planned roles. |
| Production and inventory data is stale | Area 05/06/08: latest production shift 2026-03-12, inventory 2026-03-27. | Weakens readiness claim if shown unframed. | Refresh production shift/inventory before any meeting/demo; add stale-data flags. |
| Telemetry claims are immature | Area 02/06. | Predictive maintenance is a future claim, not fleet-wide proof. | Keep washer telemetry as prototype/partial until fleet reconciliation is done. |
| Contracting party is unclear | `/terms`, buyer sheet, Area 09. | Buyers/funders need to know who signs, invoices, warrants and reports. | Add contracting-party checklist and legal identity source-of-truth before external buyer sheets. |

## Website/admin changes required

### P0 before sharing investor/funder material

1. Quarantine or fix `v2/src/lib/data/grant-content.ts`.
   - Remove stale A Kind Tractor/DGR eligibility claims.
   - Add legal-review status before grant composer output can be trusted.

2. Fix claim provenance on `/impact`.
   - Replace "Every number is live" with tracked/modelled/target/future labels.
   - Do not claim wellbeing or health outcomes as measured.

3. Create a canonical count source.
   - Choose exact meeting numbers: deployed beds, tracked bed assets, total product quantity, active communities, open demand, pipeline.
   - Include date and source for each.

4. Clean investor/funder page language.
   - Caveat DGR status as via The Butterfly Movement Ltd, operational from FY2026-27, subject to handover/legal due diligence.
   - Remove or explain "600+ beds" and "DGR1 status" claims (DGR is never via Goods / A Curious Tractor / A Kind Tractor directly).

5. Build LOI tracker.
   - This is the Area 10 critical artifact and the bridge across business model, risk, people and capital.

### P1 next

6. Update `/terms` and buyer sheets with confirmed contracting party.
7. Split `/admin/team` roles into staff, contractors, advisors, support network, community partners and planned hires.
8. Refresh `/admin/production` data and add stale indicators.
9. Add an SOP/source-of-truth matrix to `/admin/library` or Notion.
10. Create IP register for Stretch Bed, Basket Bed, washing machine, plant, brand, data and story assets.

## Area-by-area status

| # | Area | Status | Biggest useful artifact | Still missing |
|---|---|---|---|---|
| 01 | Vision & Ambition | Full review built | Founder narrative + operating model | Final founder-authored 1-3 page narrative and diagram |
| 02 | Social Objective & Impact | Full review built | Public vs internal impact claim map | Impact provenance labels and Theory of Change graphic |
| 03 | Business Model | Full review built | Buyer segment map + Stretch Bed buyer sheet | LOI tracker and market sizing |
| 04 | Financial Management | Full review built | Finance evidence + cost ladder | Accountant-reviewed Goods-only 3-statement model |
| 05 | Strategic Planning & Risk | Full review built | Risk register + scenario table | Owner/review cadence and board-grade register |
| 06 | Process & Technology | Full review built | Operating systems map + SOP index | SOP ownership and stale-data checklist |
| 07 | Governance, Data & Reporting | Full review built | Governance memo + reporting calendar | Formal board/advisory terms, delegations, conflicts |
| 08 | People & Organisation | Full review built | Now/next org chart + role briefs | GM/BD role approval, founder FTE costing |
| 09 | Legal Structure | Full review built | Current legal reality + entity option memo | Legal review, IP register, contracting-party checklist |
| 10 | Investors & Capital Raising | Full review built | Investor pack skeleton + LOI tracker design + QBE evidence checklist + use-of-funds budget skeleton | Founder-authored pack, signed LOIs, confirmed QBE terms, cleaned funder copy |

## Area 10 now absorbs the cross-area work

Area 10 is not another generic investor page. It is the integration point for the whole diagnostic:

- Area 01 supplies the 1-page founder story.
- Area 02 supplies claim discipline and impact proof.
- Area 03 supplies buyer segments and the Stretch Bed buyer sheet.
- Area 04 supplies finance model, cost ladder and use-of-funds logic.
- Area 05 supplies risk register and scenario response.
- Area 06 supplies operating systems and SOP evidence.
- Area 07 supplies governance/reporting/calendar/data safeguards.
- Area 08 supplies role plan and founder capacity risk mitigation.
- Area 09 supplies legal/entity/IP/mission-protection caveats.

The Area 10 artifact now defines the first QBE Stage 2 evidence checklist with columns:

- evidence required;
- diagnostic area source;
- current proof;
- status;
- owner;
- external-use wording;
- gap before sharing.

## Recommended meeting framing

"We have completed the internal artifact build for all ten diagnostic areas. The work shows real traction: product in field, asset tracking, community stories, cost model, finance workpapers, admin reporting, partner proof, legal/governance work underway, and a capital stack pathway. The next job is to turn the Area 10 integration into external material: a founder-authored investor pack, LOI tracker, QBE matched-funding evidence file and use-of-funds budget. We are also cleaning the site/admin claim layer so public copy only says what the evidence can carry."

## Immediate next actions

1. Create canonical numbers sheet.
2. Create LOI tracker and QBE matched-funding checklist in Notion/admin.
3. Confirm QBE Stage 2 cap, eligible match rules and evidence format with SIH/QBE.
4. Quarantine stale legal/DGR grant content.
5. Clean investor/funder page language in `funder-shared-content.ts`, `funder-pages.ts` and `grant-content.ts`.
6. Update impact provenance copy.
7. Refresh production/inventory data.
8. Write contracting-party checklist.
9. Build the first founder-authored investor pack from the Area 10 skeleton.

## Sources reviewed

- `wiki/outputs/2026-05-28-qbe-area-01-vision-full-review.md`
- `wiki/outputs/2026-05-28-qbe-area-02-impact-full-review.md`
- `wiki/outputs/2026-05-28-qbe-area-03-business-model-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-04-financial-management-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-05-strategic-planning-risk-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-06-process-technology-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-07-governance-data-reporting-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-08-people-organisation-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-09-legal-structure-full-review.md`
- `wiki/outputs/2026-05-29-qbe-area-10-investors-capital-raising-full-review.md`
- `wiki/articles/enterprise/10-investors-capital-raising.md`
- QBE Diagnostic Artifact Database Area 10: https://www.notion.so/36eebcf981cf81329a11e33e2d121bf9
