# QBE Area 06 - Process & Technology Full Review

Date: 2026-05-29
Status: Built for founder review
Diagnostic area: 06 - Process and Technology Maturity
Primary question: Are fit-for-purpose and efficient processes and supporting technology/systems in place, including continuous improvement?

## Meeting-ready read

Goods should present Area 06 as a relative strength with one practical caveat.

The strength is real: the website, admin system, Supabase asset register, QR scan flow, production tooling, GHL integration, Stripe checkout, Empathy Ledger direction, wiki/Notion knowledge base and washing-machine telemetry pipeline all exist in code or data.

The caveat is equally important: investors should not hear "fully automated operating system". The honest claim is "working operating backbone, now being converted into SOPs, source-of-truth rules, owner rules and founder-independent routines."

## Diagnostic summary

The diagnostic gives Goods credit for:

- Founders being comfortable with custom AI agents and Notion as a knowledge base.
- Plans for IoT-connected washing machines and QR-code product tracking.
- A clear vision for automated supply chain: ecommerce ordering, on-Country manufacture and community delivery.
- Systematised production thinking: components ordering, bottleneck identification and predictive maintenance via telemetry.
- Innovative thinking on aligning supply with remote-community payment cycles.

The diagnostic gap is:

- Production SOPs, customer support, quality assurance and delivery processes need clearer documentation.
- Better process documentation will reduce dependency on Ben/Nic as the team grows.
- AI must be framed as recall, structuring and editing support, not as the author of external collateral.
- All AI-assisted documents going to SIH, QBE, funders or investors need human audit by a core Goods team member who can defend the content in Q&A.

## What is verified

Verified from the active `v2/` codebase:

- 138 App Router page routes.
- 49 admin page routes.
- 70 API route handlers.
- Asset register route: `v2/src/app/admin/assets/page.tsx`.
- QR scan analytics route: `v2/src/app/admin/scans/page.tsx`.
- Public QR journey route: `v2/src/app/bed/[id]/page.tsx`.
- QR scan logger: `v2/src/lib/scans/log-scan.ts`.
- Support flow: `v2/src/app/support/page.tsx` and `v2/src/app/api/support/route.ts`.
- GHL integration: `v2/src/lib/ghl/index.ts`.
- Production admin: `v2/src/app/admin/production/page.tsx`.
- Fleet admin: `v2/src/app/admin/fleet/page.tsx`.
- Public operations/wiki route: `v2/src/app/wiki/guides/operations/page.tsx`.
- Wiki knowledge base has 139 article files under `wiki/articles/`.

Verified from direct v2 Supabase query at 2026-05-28T19:49:16Z:

- 561 asset rows.
- 674 total asset quantity.
- 664 active asset quantity.
- 524 deployed asset quantity.
- 9 deployed communities.
- 558 asset rows with QR URLs.
- Product quantity: 270 Stretch Beds, 363 Basket Beds, 41 Washing Machines.
- Status quantity: 524 deployed, 108 requested, 20 ready, 6 allocated, 3 demo, 3 under investigation, 10 retired.
- 231 `bed_scans` rows total, 52 real non-bot/non-admin scans.
- 18 `bed_journeys` rows.
- 19 `production_shifts` rows.
- 1 `production_inventory` snapshot.
- 0 `production_journal` rows.
- 1,937 `usage_logs` rows.
- 638 `daily_machine_rollups` rows.
- 75 `webhook_receipts` rows.
- 43 `crm_deals` rows.
- 30 `orders` rows.
- 1 `tickets` row.
- 11 open alerts.
- Latest production shift: 2026-03-12, Ben Knight, 6 sheets produced.
- Latest inventory snapshot: 2026-03-27, 4 beds possible, 9 steel poles, 200 canvas ready, 150 tabs ready, 168 legs ready, 60kg raw plastic.
- Latest telemetry usage log: 2026-05-28, Particle machine `e00fce684086eb2aba8d4f25`, cycle_complete.
- Sample QR asset: `GB0-156-40`, Stretch Bed, deployed, Utopia Homelands, QR URL `https://www.goodsoncountry.com/bed/GB0-156-40`.

Verified from Notion/wiki:

- QBE Diagnostic Artifact Database page: `06 - Process & Technology`.
- Goods Master Register says CRM/pipeline, website/v2 and asset register/field ops are operating/live, while operations/knowledge still needs consolidation.
- GHL operating manual exists and defines GHL as the execution layer for contacts, tags, stages, workflows and social.
- Goods x SIH Diagnostic Readiness Hub maps Area 06 to public `/wiki` and per-bed pages, plus admin `/admin/assets`, `/admin/scans`, `/admin/install-bulk` and `/admin/fleet`.
- Wiki article `wiki/articles/enterprise/06-process-and-technology.md` already frames the area honestly: strong architecture, but daily operating discipline still needs human verification and simplification.
- Wiki article `wiki/articles/governance/ai-human-in-loop-policy.md` is the direct response to the diagnostic's AI concern.

## Website/admin proof reviewed

Local screenshots were captured from the running app on `http://localhost:3017`:

- `output/playwright/qbe-area06/admin-assets.png` - asset register, pipeline summary, batch tools.
- `output/playwright/qbe-area06/admin-scans.png` - QR scan analytics and missed-install detection.
- `output/playwright/qbe-area06/bed-gb0-156-40.png` - public QR journey page for a real Stretch Bed.
- `output/playwright/qbe-area06/admin-production.png` - production dashboard.
- `output/playwright/qbe-area06/admin-fleet.png` - washing-machine fleet dashboard.
- `output/playwright/qbe-area06/support-asset.png` - support form tied to a real asset.
- `output/playwright/qbe-area06/wiki-operations.png` - public operations guide surface.

All reviewed local routes returned HTTP 200.

## Operating systems map v0.1

| System | Purpose | Current owner | Evidence source | Risk if missing | Next SOP needed |
|---|---|---|---|---|---|
| Website/shop | Public proof, Stretch Bed sales, funder/buyer pages | Ben/Nic | `v2/src/app`, Stripe routes, product pages | Investor sees story but no transaction pathway | Order to fulfilment SOP |
| Supabase | Operational source for assets, orders, production, CRM snapshots and telemetry | Ben | v2 Supabase direct query | Claims drift or dashboards go stale | Source-of-truth matrix |
| Asset register | Track products, status, community, QR URL and deployment state | Ben/Nic/field lead | `/admin/assets`, `assets` table | Deployed products become invisible | Asset update and reconciliation SOP |
| QR journey | Let people view product journey, claim/feedback/support, and log scans | Ben/Nic | `/bed/[id]`, `bed_scans`, `bed_journeys` | QR data looks like surveillance or is not acted on | Redacted QR lifecycle sample and consent rule |
| Support flow | Capture support, repair, safety and removal requests | Ben/Nic | `/support`, `/api/support`, tickets/checkins/alerts logic | Complaints become relationship risk | Support triage and SLA SOP |
| Production tooling | Track shifts, inventory, demand and batch costing | Ben/production lead | `/admin/production`, production tables | Production knowledge remains founder-held | Shift, inventory, QA and batch close SOP |
| GHL | Contact/outreach execution, follow-up and workflows | Ben/comms ops | `v2/src/lib/ghl/index.ts`, GHL manual | Contacts duplicate, workflows fire incorrectly | GHL approval and tagging SOP |
| Empathy Ledger | Consent-led story/media infrastructure | Ben/Nic/EL | EL integration/fallback content, wiki governance pages | Community content is overused or misused | Consent and media-release SOP |
| Fleet telemetry | Washing-machine usage and connectivity evidence | Ben/field ops | `/admin/fleet`, `usage_logs`, `daily_machine_rollups`, `webhook_receipts` | Predictive-maintenance claims overstate reality | Fleet incident and connectivity SOP |
| Wiki/Notion | Knowledge base, QBE artifacts, review workspace | Ben | 139 wiki articles, Notion QBE database | Evidence stays scattered and unaudited | Artifact review and publish SOP |
| AI human-in-loop | Controls AI-assisted external materials | Ben/Nic | `ai-human-in-loop-policy.md` | Polished documents contain aspirational-as-active claims | Pre-send review checklist |

## SOP index to build

Priority 1 before external/funder use:

- Asset update and reconciliation SOP.
- QR scan, claim, support and redaction SOP.
- Support triage and escalation SOP.
- Production shift and inventory SOP.
- QA and delivery handover SOP.
- GHL contact, tag and workflow approval SOP.
- AI human-in-loop pre-send checklist.

Priority 2 after meeting:

- Fleet telemetry incident SOP.
- Empathy Ledger story/media consent SOP.
- Admin dashboard refresh and stale-data checklist.
- Notion/wiki artifact publishing SOP.
- Partner onboarding SOP for on-Country production.
- Data export and access control SOP.

## Founder-dependency reduction plan

The practical question is not "what tools exist?" It is "what happens when Ben/Nic are not in the room?"

| Founder-held activity | Current evidence | Hand off to | Artifact needed |
|---|---|---|---|
| Explain the whole operating model | Diagnostic and Notion pages | GM / investor lead | 1-page operating systems map |
| Interpret asset/QR data | `/admin/assets`, `/admin/scans`, Supabase | Field ops lead | Asset reconciliation SOP |
| Decide support response | `/support`, tickets/checkins/alerts | Support/ops lead | Support triage matrix |
| Explain production status | `/admin/production`, inventory snapshot | Production lead | Shift and inventory SOP |
| Manage GHL safely | GHL manual, integration code | Sales/comms ops | GHL approval checklist |
| Decide what external claims are defensible | AI policy and claim labels | Founder + reviewer | Pre-send claim audit |
| Translate telemetry into public claims | Fleet dashboard and telemetry docs | Field ops + founder | Fleet evidence note |

## Useful vs noise

Useful for the meeting:

- The operating systems map.
- Screenshots of live admin pages.
- Direct Supabase counts with dates.
- A redacted example asset journey (`GB0-156-40` works as a local sample, but public sharing still needs privacy review).
- The AI human-in-loop policy.
- The GHL operating manual, because it shows discipline around automation.
- The public `/wiki/guides/operations` route, because it makes process visible without exposing raw admin data.

Noise or high-risk material:

- Raw admin screenshots without a short explanation of what decision they support.
- Raw QR scan logs, household data or recipient-level information.
- Telemetry screenshots that imply the fleet is fully reporting. The fleet pipeline exists, but reporting reliability is still mixed.
- Old/stale compendiums and duplicated washing-machine docs.
- AI-generated collateral that has not been founder reviewed.
- Dashboards that are technically live but not yet used weekly.
- Notion pages that mirror claims without provenance labels.

## Claim discipline

Public/verified claims:

- Goods has a live website and admin system.
- Goods has an asset register with QR-linked product pages.
- Goods has direct Stretch Bed ecommerce.
- Goods has production, fleet, CRM, support and reporting routes in the v2 app.
- Goods has live operational data in Supabase for assets, scans, production, deals, orders and telemetry.
- Goods has an AI human-in-loop policy responding directly to the diagnostic.

Modelled or target claims:

- Automated supply chain from ecommerce order to on-Country manufacture to community delivery.
- Predictive maintenance via product telemetry.
- Fully repeatable partner-run production.
- Founder-independent operating model.
- Complete SOP coverage.

Internal-only claims:

- Household or recipient-level QR data.
- Raw contact data in GHL.
- Raw support tickets.
- Raw telemetry receipts and machine IDs.
- Unreviewed AI-drafted materials.

## Do not overclaim

- Do not say automated supply chain is complete.
- Do not say predictive maintenance is live across the washing-machine fleet.
- Do not say SOPs are complete.
- Do not say GHL is the source of truth. Treat it as an execution/follow-up layer.
- Do not present Notion or AI output as founder-authored unless Ben/Nic have reviewed it.
- Do not share raw QR, household, story or contact data externally.
- Do not imply every dashboard is used weekly unless Ben/Nic confirm that operating habit.

## Artifacts to build for Area 06

1. Operating systems map: built in draft above; turn into a visual one-pager.
2. SOP index: build as a Notion database or table with workflow, owner, status, link and next action.
3. Founder-dependency reduction plan: convert the table above into a transition plan for GM, sales/ops and production lead roles.
4. Source-of-truth matrix: Supabase vs GHL vs Notion/wiki vs Xero vs Empathy Ledger vs Drive.
5. Redacted QR lifecycle sample: show one product's lifecycle without household/private data.
6. Admin evidence pack: 6-8 annotated screenshots with route, what it proves and what it does not prove.
7. AI pre-send checklist: a compact checklist based on `wiki/articles/governance/ai-human-in-loop-policy.md`.
8. Data freshness checklist: route/table, owner, last refreshed, stale threshold and escalation.

## Suggested Notion build

Create or update Area 06 with these sections:

- Diagnostic summary.
- Current evidence.
- Operating systems map.
- SOP index.
- Founder-dependency reduction plan.
- What is useful vs noise.
- Claim discipline.
- Screenshots and real links.
- Next 7-day build list.

Suggested database properties:

- Build Status: Built - needs review.
- Diagnostic Status: Strength.
- Evidence Status: Mixed.
- Claim Labels: verified, modelled, target, future, internal only.
- Priority: P1.
- Timing: Ongoing.
- Evidence Artifact: Operating systems map + admin proof pack.
- Decision Artifact: SOP index + founder-dependency reduction plan + source-of-truth matrix.
- Primary Gap: live systems need SOPs, owner rules, data freshness checks and founder-dependency reduction.

## Next 7-day build list

1. Annotate the seven screenshots into a meeting proof pack.
2. Turn the operating systems map into a clean one-page diagram.
3. Build the SOP index in Notion with owner/status fields.
4. Create the source-of-truth matrix.
5. Create one redacted QR lifecycle sample.
6. Apply the AI pre-send checklist to the current investor/funder materials.
7. Mark fleet telemetry as "partial" until connectivity/reporting reliability is resolved.

## Meeting talk track

"Process and technology is one of the areas where Goods is stronger than it looks for an enterprise this size. We can show the live website, admin system, asset register, QR pages, production dashboard, fleet telemetry pipeline, support forms, CRM integration and Notion/wiki knowledge base. The diagnostic did not ask us to invent this from scratch. It asked us to make it explainable, documented and less dependent on founders. That is the next phase: turn the live system into SOPs, owner rules, redacted proof examples and a clean AI human-review discipline so every external claim is defensible."

## Source links

- Area 06 Notion page: https://www.notion.so/36eebcf981cf81659f6afab915672b57
- QBE Diagnostic Artifact Database: https://www.notion.so/cb3794d427914d72bf1036106d8116f5
- Goods Master Register: https://www.notion.so/36debcf981cf8187a1a2ead1bccd2204
- GHL operating manual: https://www.notion.so/36debcf981cf81b08b32e368fca5917f
- Goods x SIH Diagnostic Readiness Hub: https://www.notion.so/36debcf981cf814a8de1cd5da6d3387d
- Older Process and Technology Maturity wiki mirror: https://www.notion.so/348ebcf981cf81c6bfcec1f97c47ed98
- Local wiki source: `wiki/articles/enterprise/06-process-and-technology.md`
- AI human-in-loop policy: `wiki/articles/governance/ai-human-in-loop-policy.md`
- Screenshots: `output/playwright/qbe-area06/`
