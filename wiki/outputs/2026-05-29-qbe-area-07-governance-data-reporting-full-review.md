# QBE Area 07 - Governance, Data & Reporting Full Review

Date: 2026-05-29
Status: Built for founder review
Diagnostic area: 07 - Governance, Data and Reporting
Primary question: Is the enterprise well governed, with the right skilled board, useful data, and effective transparent reporting?

## Meeting-ready read

Area 07 should be presented as a priority governance gap with meaningful foundations already in place.

Goods has founder accountability, a named advisory group, community partner accountability, strong data-sovereignty principles, AI human-review discipline, admin reporting infrastructure and a Butterfly charitable transition pathway. The investor-readiness gap is that this is not yet a formal governance system: the new trading entity needs clear decision rights, independent oversight, board/advisory terms, conflict rules, reporting cadence and practical data/consent controls.

The strongest line is: "We are not pretending advisory support is a board. We have the people and practices around the work; the next phase is to formalise who advises, who decides, who reviews data, and what gets reported monthly, quarterly and annually."

## Diagnostic summary

The diagnostic credits Goods with:

- A Goods-specific advisory committee with monthly cadence and ad hoc engagement.
- Composition including Aboriginal leaders, Zinus, Defy Design and philanthropic supporters.
- Strong practice around community data sovereignty: content shared back to community, story retraction supported and storytellers kept informed about use.
- Recent incorporation of A Curious Tractor Pty Ltd creating a chance to formalise governance for the trading entity.

The diagnostic gaps are:

- Commercial and social-enterprise scale-up experience is missing from the advisory committee.
- A clear governance/accountability structure for the new Pty Ltd is not yet established.
- Annual or periodic external reporting is driven by individual grant requirements rather than a consolidated annual cycle.

Opportunity area: develop governance and accountability structures for improved independent oversight.

## What is verified

Verified from Notion/wiki:

- QBE Area 07 Notion database page exists and is marked as a P0 priority gap.
- `wiki/articles/enterprise/07-governance-data-reporting.md` separates founder accountability, advisory support, community accountability, reporting and data/story governance.
- `wiki/articles/governance/board-structure.md` clearly states that Goods does not yet have a formal independent Goods board.
- `wiki/articles/support-network/advisory-group.md` records monthly advisory rhythm, named advisory members and the commercial/social-enterprise scale gap.
- `wiki/articles/governance/data-sovereignty.md` frames data sovereignty as practice, not slogan.
- `wiki/articles/governance/policies-register.md` separates in-place, draft and missing policies.
- Notion `Data Sovereignty` page states the intent around OCAP, Empathy Ledger, explicit consent and withdrawal.
- Notion `AI Human-in-Loop Policy` page gives a direct pre-send rule for external materials.
- Notion `Butterfly Movement Transition Plan` exists and gives milestones for director transition, governance paperwork, finance/audit, banking/access and ACNC/ASIC updates.

Verified from active `v2/` code:

- `/admin/reports` generates per-funder reports from live data and writes to `wiki/outputs/funder-reports/<slug>/<period>.md`.
- `/admin/funders` lists funder configs and links them to report generation.
- `/admin/team` renders a team manager plus advisory-board cards sourced from `v2/src/lib/data/compendium.ts`.
- `/admin/communities` renders a live community register joined to `community_rollup`, `community_demand` and `crm_deals`.
- `/admin/el-stories` fetches Goods stories from Empathy Ledger and surfaces public/pending/consent review state.
- `v2/src/lib/funders/metrics.ts` resolves report metrics from Goods Supabase, ACT infra Xero and funder configs.

Verified from direct v2 Supabase query at 2026-05-28T19:58Z:

- `community_rollup`: 27 rows, 7 active communities, 1 testing, 1 exploring, 15 prospect and 3 administrative.
- Community rollup totals: 496 deployed beds, 28 deployed machines, 885 open-demand quantity, AUD 4,254,512 estimated open demand, AUD 1,236,300 active pipeline, AUD 236,016 won revenue.
- `community_demand`: 7 rows, 885 total quantity; statuses: 107 allocated, 278 requested, 500 exploring.
- `assets`: 561 rows, 674 total quantity, 558 QR URLs.
- `crm_deals`: 43 rows, 23 active, 20 won; active pipeline AUD 3,418,697.80; active weighted pipeline AUD 604,040; won AUD 898,863; 532 total units.
- `orders`: 30 rows.
- `tickets`: 1 row.
- `alerts`: 11 open.
- `bed_scans`: 54 real non-bot/non-admin scans at query time.
- `production_shifts`: 19 rows.
- `compassion_content`: 0 rows.
- `team_members`: 0 rows. This means the current `/admin/team` proof is mostly static/advisory compendium data, not a live staffed org register.
- Funder report files exist for `centrecorp/2026-Q2.md` and `snow/2026-Q2.md`.

Verified from Empathy Ledger query at 2026-05-28T19:58Z:

- Goods project id: `6bd47c8a-e676-456f-aa25-ddcbb5a31047`.
- 376 Goods stories.
- 134 public Goods stories.
- 376 stories marked explicit consent.
- 221 stories pending elder review.
- 375 storytellers total in the connected Empathy Ledger instance.

## Website/admin proof reviewed

Local screenshots were captured from the running app on `http://localhost:3017`:

- `output/playwright/qbe-area07/admin-reports.png` - funder report generator.
- `output/playwright/qbe-area07/admin-funders.png` - funder register and report entry points.
- `output/playwright/qbe-area07/admin-team.png` - team/advisory display.
- `output/playwright/qbe-area07/admin-communities.png` - community register, demand and pipeline rollup.
- `output/playwright/qbe-area07/admin-el-stories.png` - Empathy Ledger story consent/admin surface.
- `output/playwright/qbe-area07/impact-route.png` - impact route/gate.

Routes reviewed locally:

- `/admin/reports` returned 200.
- `/admin/funders` returned 200.
- `/admin/team` returned 200.
- `/admin/communities` returned 200.
- `/admin/el-stories` returned 200.
- `/impact` returned 307, which is expected for a gated impact route in the current local flow.

## Governance current-state memo

### What exists now

- Founder accountability sits with Ben/Nic.
- A Curious Tractor Pty Ltd is the current trading/company pathway for ACT/Goods work.
- The Butterfly Movement Ltd transition plan is being developed as a possible charitable home/pathway.
- A named advisory board/support network exists and meets monthly, with ad hoc support between meetings.
- Community accountability exists through return visits, Oonchiumpa, Tennant Creek, Palm Island and other partner relationships.
- Data sovereignty practice exists through consent, story review, sharing content back and Empathy Ledger infrastructure.
- Admin reporting exists for funders, communities, assets, deals, stories and impact materials.

### What QBE needs to see

- A one-page governance map: who advises, who decides, who is accountable.
- Advisory group terms of reference, including role boundary: advisory, not fiduciary board.
- Board/advisory skills matrix, including the commercial/social-enterprise scale gap.
- Delegations matrix for product, finance, contracts, procurement, story use, data access, capital and community partnership decisions.
- Conflict-of-interest register and related-party safeguards, especially if Butterfly, ACT/Goods and community operators transact.
- Reporting calendar: monthly management pack, quarterly advisory/board pack, annual impact/finance/stakeholder report.
- Data sovereignty and consent one-pager written as operational rules.
- AI/human pre-send review gate for external claims and board/funder papers.

### Decisions before scale

- Does Goods stay inside ACT Pty Ltd, become a subsidiary, or separate into Goods/community entities?
- Which advisory members become formal directors, if any?
- What independent director or advisor skills are required before repayable capital?
- Who has authority to approve product safety, warranty and quality decisions?
- Who has authority to approve use of stories, photos and household/product data?
- What data can mentors/funders see and what must remain internal?
- What is the standard reporting pack and cadence?
- Who owns conflicts, delegations and the risk register?

## Board/advisory skills matrix v0.1

| Skill area | Current evidence | Status | Next move |
|---|---|---|---|
| First Nations/community governance | Oonchiumpa/Kristy Bloomfield, Dianne Stokes, PICC and partner relationships | Strong but role boundaries need care | Write community/accountability role map |
| Product/manufacturing | Defy Design, Zinus, Stretch Bed production pathway | Strong | Add quality/warranty decision rights |
| Philanthropy/funder judgement | Snow Foundation, SIH, QBE, PIN | Strong | Turn into reporting calendar and governance pack |
| Social enterprise operating experience | Orange Sky/DeadlyScience support | Partial | Clarify advisory terms and role cadence |
| Commercial scale-up | Identified diagnostic gap | Gap | Recruit 1-2 commercial/product scale advisors |
| Finance/accounting oversight | Xero, Standard Ledger, funder reports | Partial | Add independent finance review and monthly pack |
| Legal/impact-investment structure | Mint Ellison pathway, Butterfly plan | Partial | Complete legal/entity option memo and related-party safeguards |
| Data governance/consent | Empathy Ledger, data-sovereignty page, AI human-in-loop policy | Strong direction, still needs operating standard | Write data sovereignty and consent one-pager |
| Risk oversight | Risk register draft | Partial | Board-ready risk register with owner/review cadence |

## Reporting calendar v0.1

| Cadence | Audience | Report | Owner | Evidence source |
|---|---|---|---|---|
| Weekly/fortnightly | Founders/ops | Delivery, support, production, cash and urgent risk check | Ben/Nic | Admin assets, production, support, Xero |
| Monthly | Advisory/management | Management pack: finance, pipeline, delivery, risk, product quality, data/consent issues | Founder + finance/admin owner | `/admin/reports`, `/admin/communities`, `/admin/deals`, Xero |
| Quarterly | Funders/advisory | Funder/stakeholder report and impact update | Ben/Nic + reporting owner | `/admin/reports`, funder configs, Supabase, Xero, Empathy Ledger |
| Six-monthly | Governance review | Board/advisory skills, conflicts, risk, data policy, AI review incidents | Governance owner | policies register, risk register, AI policy |
| Annual | External stakeholders | Impact, finance and stakeholder report | Board/founders | audited/accounts, Supabase, EL, funder reports |
| Event-triggered | Community/story owners | Consent review, story withdrawal, data issue, safety incident | Story/data owner | Empathy Ledger, support tickets, alerts |

## Data sovereignty and consent one-pager v0.1

Plain rule: community stories are not marketing stock.

Operational rules:

- Stories, photos, videos and quotes require explicit, current and recorded consent before external use.
- Withdrawal must be honoured and actioned quickly.
- Storytellers and community partners should see how content is being used.
- Raw household, location, QR, support, health or story data is internal-only unless explicit consent and purpose are clear.
- Aggregate product and impact reporting can be external if it removes household/person identifiers.
- Empathy Ledger is the consent-bearing story infrastructure; Supabase is the operational/product data infrastructure; GHL is contact/follow-up execution, not story or household data source of truth.
- AI may structure or edit but cannot invent community voice or author impact/governance claims.
- Reporting order: community and partners first, funders/investors second, internal dashboards third.

## Useful vs noise

Useful for the meeting:

- The governance current-state memo.
- Board/advisory skills matrix.
- Reporting calendar.
- Data sovereignty and consent one-pager.
- AI human-in-loop policy.
- Butterfly transition plan as evidence of governance work in motion.
- `/admin/reports`, `/admin/funders`, `/admin/communities` and `/admin/el-stories` screenshots.
- Direct data snapshots with dates and source tables.

Noise or high-risk material:

- Presenting the advisory group as a formal board.
- Treating monthly check-ins as board governance unless terms, minutes and authority exist.
- Overusing names from the support network as advisory-board members.
- Showing raw EL, QR, household, story, support or contact records externally.
- Calling the Butterfly transition complete before director changes, ACNC/ASIC updates, audit and handover are done.
- Describing data sovereignty as fully automated if lived processes and consent review still require human action.
- Treating generated funder reports as final without founder/human review.

## Claim discipline

Public/verified claims:

- Goods has a named advisory group/support network.
- Goods has strong data-sovereignty intent and consent practices.
- Goods has an AI human-in-loop policy for external materials.
- Goods has funder-report generation, funder registry and community reporting/admin surfaces.
- Goods has live community, asset, pipeline, story and reporting data.
- Butterfly transition planning is underway.

Partial or target claims:

- Formal independent governance for the new trading entity.
- Board charter and delegations matrix.
- Consolidated annual reporting cycle.
- Independent finance oversight.
- Fully mature data sovereignty operating standard.
- Complete advisory-to-board conversion pathway.

Internal-only claims:

- Raw story records, pending elder-review material, withdrawal details and cultural review notes.
- Household or recipient-linked asset data.
- GHL contact notes and funder/contact relationship details.
- Support tickets and open alerts.
- Draft director-transition documents before approved by relevant boards/directors.

## Do not overclaim

- Do not present advisory input as formal board governance.
- Do not imply the new Pty Ltd has a settled independent governance/accountability structure.
- Do not call Butterfly the Goods charitable home until transition steps are actually complete.
- Do not say all stories/content are public-shareable; 221 EL stories are pending elder review.
- Do not expose raw community, household, contact, story or support data.
- Do not present generated reports as final external reports unless founder-reviewed.

## Artifacts to build for Area 07

1. Governance current-state memo: draft built above.
2. One-page governance map: ACT/Goods/Butterfly/community entities/advisory/board/accountability.
3. Advisory group terms of reference.
4. Board/advisory skills matrix: draft built above, needs founder review.
5. Delegations and decision-rights matrix.
6. Conflict-of-interest register.
7. Reporting calendar: draft built above, needs owner and due-date assignment.
8. Data sovereignty and consent one-pager: draft built above, needs founder/community review.
9. Board-ready risk register with owner/review cadence.
10. Monthly reporting pack template.

## Admin/data cleanup tasks

- Update `/admin/team` source data so the advisory-board list separates advisory members from support-network members. The code currently renders `advisoryBoard` from `compendium.ts`, which includes Adeem and Dr Simon Quilty even though the wiki says they should be support/partner network, not advisory board.
- Populate or intentionally retire `team_members`; the direct query returned zero rows.
- Add a governance status badge or note to `/admin/team`: advisory, not legal board.
- Add data freshness dates to `/admin/reports`, `/admin/funders`, `/admin/communities` and `/admin/el-stories`.
- Add founder review status to generated funder reports.
- Make the reporting calendar visible from `/admin/reports` or Notion.

## Next 7-day build list

1. Convert the governance current-state memo into a one-page founder-reviewed note.
2. Build the board/advisory skills matrix as a Notion table.
3. Draft advisory group terms of reference.
4. Draft the delegations matrix.
5. Draft the reporting calendar and assign owners.
6. Create the data sovereignty and consent one-pager.
7. Clean `/admin/team` advisory/support-network classification.
8. Add a founder-review checkbox/process for generated funder reports.

## Meeting talk track

"Governance, data and reporting is the priority gap we should own plainly. We have real foundations: founder accountability, an active advisory group, First Nations and technical partners, data-sovereignty practice, Empathy Ledger, AI human-review policy and live admin reporting. But we are not calling that a mature board system yet. The next phase is to formalise who advises, who decides, how conflicts and risk are reviewed, what data can be shared, and what reporting cadence QBE, funders, community partners and future investors can rely on."

## Source links

- Area 07 Notion page: https://www.notion.so/36eebcf981cf813e9b6fc95d4e5a703a
- Data Sovereignty Notion page: https://www.notion.so/348ebcf981cf81bbaf25c78d20cdfe2e
- AI Human-in-Loop Policy Notion page: https://www.notion.so/36debcf981cf81f7a004db874035770c
- Butterfly Movement Transition Plan: https://www.notion.so/1d97e1380abf4e7aa0b79e001e5fe2bd
- Older Governance/Data/Reporting mirror: https://www.notion.so/348ebcf981cf81ba820cf585a289a8c9
- Local wiki source: `wiki/articles/enterprise/07-governance-data-reporting.md`
- Board structure source: `wiki/articles/governance/board-structure.md`
- Data sovereignty source: `wiki/articles/governance/data-sovereignty.md`
- Policies register source: `wiki/articles/governance/policies-register.md`
- Advisory group source: `wiki/articles/support-network/advisory-group.md`
- Screenshots: `output/playwright/qbe-area07/`
