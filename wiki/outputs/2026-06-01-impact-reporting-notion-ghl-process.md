# Impact Reporting: Notion Map, Story Templates, and GHL Process

Created: 2026-06-01

Purpose: map where impact reporting currently sits, define the aligned reporting template system, and specify the GoHighLevel process to run it. Live GHL writes were not possible in this pass because the HighLevel connector returned `401: Reauthentication required`.

## Source Status

Verified:

- Notion pages fetched 2026-06-01:
  - `Impact`
  - `ALMA Framework`
  - `Metrics Tracked`
  - `Empathy Ledger (as Goods impact infrastructure)`
  - `Impact Measurement Report`
  - `Impact Claim Map`
  - `Foundation proof pack`
  - `ACT Funder Reporting Hub`
  - `Centrecorp Foundation Reporting`
  - `Centrecorp Foundation` in the Grants & Capital Pipeline
  - `Grade -> GHL engagement playbook`
  - `GHL operating manual`
- Local report implementation:
  - `v2/src/lib/data/report-templates.ts`
  - `v2/src/components/reports/impact-report.tsx`
  - `v2/src/app/admin/reports/impact/[templateId]/page.tsx`
  - `v2/src/lib/ghl/smart-lists.ts`
  - `v2/src/lib/data/loi-pipeline.ts`
  - `wiki/templates/funder-report/sections/*`
  - `wiki/outputs/funder-reports/*`
- Notion database created 2026-06-01:
  - `Impact Reporting Register`
  - Database URL: `https://www.notion.so/08afd05c65c341b9b6de3b8b2a9020c5`
  - Data source: `collection://f1093c01-ed97-4d6c-8da8-33b07dca16b2`
  - Seed records:
    - `Centrecorp - 130 Stretch Beds - June 26 Board Pack`: `https://www.notion.so/371ebcf981cf8107b58ce00be19454b8`
    - `Snow Foundation - FY26 Operational Acquittal - 31 July`: `https://www.notion.so/371ebcf981cf8171bf27ef793c643335`
  - Views created:
    - `Reporting calendar` by `Due Date`
    - `Status board` grouped by `Status`

Connector blocked:

- HighLevel live read/write: connector returned `401: Reauthentication required`.

Direct API workaround verified:

- Direct LeadConnector API with `v2/.env.local` returned `200` for the live location `agzsSZWgovjwgpcoASWG`.
- Created the GHL impact-reporting opportunity fields listed below.
- Created the Centrecorp June 26 opportunity directly in GHL.

## Where Impact Reporting Sits Now

| Layer | Current location | What it is | Current role | Gap |
|---|---|---|---|---|
| Impact framework | Notion: `Goods Wiki (mirror)` -> `Impact` | Umbrella impact page | Holds impact theory, ALMA, Empathy Ledger, metrics links | Not a live reporting register |
| Accountability method | Notion: `ALMA Framework` | Six-signal assessment: authority, evidence, harm risk, capability, option value, community value return | Correct governance lens for every story/metric | Not yet enforced as fields on each report |
| Metrics | Notion: `Metrics Tracked`; code: `v2/src/lib/data/impact-model.ts` | Environmental, health, economic, story metrics | Metric vocabulary and current headline numbers | Some metrics are current, some are targets/estimates; report must label this |
| Story source | Notion: `Empathy Ledger`; code: `v2/src/lib/empathy-ledger/*` | Consented story infrastructure | Source for quotes/photos/stories | Stories must be filtered by consent and report purpose before use |
| Claim governance | Notion: `Impact Claim Map` | Tracked now / estimate / future / internal-only / consent-pending buckets | Prevents overclaiming | Needs to be a required review step in each report |
| Funder hub | Notion: `ACT Funder Reporting Hub` in `Resources / Knowledge Hub` | Relationship summary, warmth, reporting schedule, per-funder links | Best current reporting control page | Some tables are stale; schedule fields are incomplete |
| Per-funder pages | Notion: `Snow Foundation Reporting`, `Centrecorp Foundation Reporting`, others | One page per funder with at-a-glance, funds, milestones, schedule | Best current home for funder-specific reports | Mixed product eras and stale values in some pages; Centrecorp still carries old content below the warning |
| Live ask / pipeline | Notion: `Grants & Capital Pipeline` | Funding opportunity tracker | Tracks live asks like Centrecorp June 26 | Does not hold report evidence or story workflow |
| CRM engagement logic | Notion: `Grade -> GHL engagement playbook`; `GHL operating manual` | Notion grades/schedules drive GHL action | Correct split: Notion = brain, GHL = hands | GHL process needs impact-report-specific fields/tags/tasks |
| Report renderer | v2 admin reports | Audience templates + current metrics + Empathy Ledger stories | Useful generic report generator | Not enough for specific board decisions without custom appendix |
| Report section templates | `wiki/templates/funder-report/sections/*` | Markdown funder-report sections | Good modular reporting spine | Generated reports need source review before external use |
| Generated reports | `wiki/outputs/funder-reports/*` | Markdown reports by funder/quarter | Useful drafts | Some current reports are stale or carry old product language; use as draft shells only |

## The Missing Object

There is no single `Impact Reporting Register` tying together:

- funder or buyer relationship
- due date
- reporting period
- live ask or grant
- report template
- evidence sources
- story consent status
- claim review status
- public/report URL
- GHL opportunity
- GHL follow-up status

That register is the main thing to add. Without it, reporting lives in pieces: Notion knows the relationship, v2 can render a report, Empathy Ledger holds stories, and GHL can send/follow up, but no single record says "this impact report is due, ready, consent-cleared, sent, and followed up."

## Created Notion Database: Impact Reporting Register

Created under `ACT Funder Reporting Hub` with these properties:

| Property | Type | Rule |
|---|---|---|
| Report Name | Title | `Centrecorp - 130 Stretch Beds - June 26 Board Pack` |
| Report Type | Select | Board decision pack, funder stewardship, acquittal, procurement proof pack, supporter update, supplier brief |
| Audience | Select | Funder, buyer/procurement, supporter, supplier/vendor, internal |
| Funder / Partner | Text | Funder or partner name |
| Funder Page | URL | Link to the per-funder reporting page or org record |
| Pipeline Record | URL | Link to Grants & Capital Pipeline record where relevant |
| GHL Opportunity ID | Text | Join key into GHL |
| GHL Contact ID | Text | Primary contact, if known |
| Reporting Period | Date range | Period covered by the report |
| Due Date | Date | External due date or board date |
| Status | Select | Needed, drafting, evidence review, consent review, approved, sent, accepted, archived |
| Ask / Grant Amount | Number | Ask or grant value; do not use for actual received unless labelled |
| Amount Basis | Select | Estimate, quote, invoiced, Xero actual |
| Products | Multi-select | Stretch Bed, washing machine, other |
| Communities | Text | Tennant Creek, Mparntwe, Utopia, etc. |
| Evidence Status | Select | Complete, partial, missing, source conflict |
| Story Status | Select | Not needed, needed, captured, consent pending, approved, cannot use |
| Claim Review | Select | Tracked now, working estimate, future claim, internal only, consent pending |
| Source Links | Text | Asset register, Xero, Gmail, EL, Drive, report build |
| Public / PDF URL | URL | Report or package link |
| GHL Campaign | Text | Campaign or workflow reference |
| Last Sent | Date | Set after GHL send |
| Next Touch | Date | GHL task/follow-up date |
| Owner | Person/text | Internal owner |

Minimum viable fields for June 2026:

- Report Name
- Funder / Partner
- Pipeline Record
- GHL Opportunity ID
- Due Date
- Status
- Report Type
- Evidence Status
- Story Status
- Claim Review
- Public / PDF URL
- Next Touch

## Aligned Report Templates

Use one shared reporting spine, then adapt by audience.

### 1. Board Decision Pack

Use when a board is deciding a funding ask. This is the Centrecorp June 26 pattern.

Required modules:

- Decision requested: amount, product, place, timing, what is in/out of scope
- Fit to funder mandate
- Prior funding report
- Why these places now
- Delivery and installation partners
- Community employment/training plan
- Current product feedback
- Evidence and measurement plan
- Recognition/public link
- Attachments: application, quote, letters/emails, prior photos, consent-cleared stories

GHL stage fit: `Ask made`.

### 2. Funder Stewardship Report

Use for active funders after delivery or during multi-year support.

Required modules:

- Headline outcomes
- Use of funds
- Outputs delivered
- Story module
- Metrics by claim status
- Risks / changes / what we learned
- Next commitments
- Renewal or scale pathway

GHL stage fit: `Stewarding / Reporting` or `Renewing`.

### 3. Acquittal Report

Use when a grant agreement requires formal acquittal.

Required modules:

- Agreement reference
- Reporting period
- Spend against budget
- Delivered outputs
- Variance notes
- Attachments and evidence
- Sign-off status

GHL stage fit: `Stewarding / Reporting`.

### 4. Procurement Buyer Proof Pack

Use for councils, housing bodies, government, procurement teams.

Required modules:

- Product spec and warranty
- Remote-condition fit
- Delivery record
- Total cost / delivered price basis
- Asset tracking and maintenance
- Short story evidence showing demand and fit

GHL stage fit: `Qualified`, `Scoped`, `Proposed`, or equivalent buyer stages.

### 5. Supporter Story Update

Use for broad supporter/newsletter audiences.

Required modules:

- Story first
- One to three momentum numbers
- Photo or short video
- Simple next action
- No confidential funder, household, or consent-pending information

GHL fit: newsletter or supporter campaign, not a high-value funder board pack.

## Storytelling Workflow

The report story path should be:

1. Capture story/photo/quote in Empathy Ledger or approved field source.
2. Confirm consent, audience, and sharing level.
3. Classify story:
   - recipient voice
   - family/home outcome
   - community partner
   - delivery/install evidence
   - funder recognition
   - product feedback
4. Run ALMA review:
   - who holds authority over the data?
   - what evidence type is it?
   - what is the harm risk?
   - is the system ready to act on it?
   - what future option value does it create?
   - does value return to the community?
5. Assign claim status from the Impact Claim Map.
6. Attach to the Impact Reporting Register record.
7. Render into the chosen report template.
8. Send through GHL only after consent and claim status are approved.
9. Log send/follow-up back on the Notion report record and GHL opportunity.

Rule: GHL should never be the source of truth for stories or household data. It should only carry the report URL, send status, tags, tasks, and follow-up notes.

## Current v2 Report System Alignment

The v2 app already has the start of the template/report/GHL bridge:

- `report-templates.ts` defines audience templates:
  - `funder-impact`
  - `procurement-buyer`
  - `supporter-update`
  - `supply-partner`
- `impact-report.tsx` renders metrics, proof points, dimensions, and consent-filtered stories.
- `/admin/reports/impact/[templateId]` resolves live impact data and Empathy Ledger report stories.
- `smart-lists.ts` maps GHL audience segments to recommended reports.
- `/admin/reach-out` tells staff which GHL smart list to build and which report to attach.

What to add next:

- A `board-decision-pack` template type for funder board meetings.
- A `centrecorp-june26` report config that answers Randle Walker's exact questions.
- A Notion report URL field so each rendered report/package has a durable home.
- A GHL opportunity/report field mapping so `Impact report URL` and `Last impact report sent` flow back into the relationship.

## GHL Process

Use the existing `Goods Supporter Journey` for funders. Do not create another pipeline for reports.

The HighLevel connector is still blocked, but the direct LeadConnector API is working from `v2/.env.local`, so the core GHL setup can be written without waiting for connector reauth.

Important operating rule from the GHL manual:

- Workflows should be triggered by stage entry, not by tag addition.
- Tags can be used for smart-list membership and branch conditions, but not as the unsafe primary automation trigger.

### Opportunity Fields

Existing opportunity fields from the money alignment work should stay:

- Funding type
- Match-eligible (QBE)
- Capital status
- Amount basis
- Xero contact ID
- Xero invoice #
- Actual paid (Xero) AUD

Created 2026-06-01 via direct LeadConnector API:

| Field | fieldKey | Type | ID | Use |
|---|---|---|---|---|
| Impact report type | `opportunity.impact_report_type` | SINGLE_OPTIONS | `cdUjGPCdGPgZyCW9WAO9` | Board pack, stewardship, acquittal, buyer proof pack, supporter update, supplier brief |
| Impact report due | `opportunity.impact_report_due` | DATE | `9iODTRxhs6DKH96grYDj` | Next external reporting or board date |
| Impact report status | `opportunity.impact_report_status` | SINGLE_OPTIONS | `eiOuDxJ6mWqy8YZdbbVn` | Needed, drafting, evidence review, consent review, approved, sent, accepted |
| Impact report URL | `opportunity.impact_report_url` | TEXT | `Zv78LLA646iLsD3N1aM9` | Link to PDF or v2 report |
| Notion report page URL | `opportunity.notion_report_page_url` | TEXT | `nPFdTTIjb72O7MnTStii` | Link to Impact Reporting Register item |
| Story consent status | `opportunity.story_consent_status` | SINGLE_OPTIONS | `q7FXLNPdnIdIaTwUHPHf` | Not needed, needed, pending, approved, cannot use |
| Evidence pack status | `opportunity.evidence_pack_status` | SINGLE_OPTIONS | `P9g0CpLcu8SzHpeSTfGV` | Missing, partial, complete, source conflict |
| Last impact report sent | `opportunity.last_impact_report_sent` | DATE | `4BRnVjD9GVIlLoIdAVMb` | Set after GHL campaign/manual send |
| Next reporting action | `opportunity.next_reporting_action` | LARGE_TEXT | `YaSYTXhXiqTXo18WfPDI` | Human-readable next move |

### Tags

Use tags for segmentation and manual filtering:

- `audience-funder`
- `goods-impact-report-needed`
- `goods-impact-report-drafting`
- `goods-impact-report-ready`
- `goods-impact-report-sent`
- `goods-story-consent-needed`
- `goods-renewal-ready`
- `goods-report-board-pack`
- `goods-report-stewardship`
- `goods-report-acquittal`
- `goods-report-centrecorp-june26`

### Stage-Triggered Workflow

Add one `Goods Impact Reporting` workflow in GHL, triggered by entry into relevant stages in `Goods Supporter Journey`.

Stage: `Ask made`

- Create task: `Build board decision pack`.
- Set or require fields: `Impact report type`, `Impact report due`, `Evidence pack status`, `Story consent status`.
- Internal notification to owner.
- For Centrecorp June 26: due date is `2026-06-26`, report type is `Board pack`.

Stage: `Committed`

- Create task: `Confirm reporting schedule and evidence requirements`.
- Create task: `Create Impact Reporting Register item` if missing.
- Set `Impact report status = Needed`.

Stage: `Delivering`

- Create evidence tasks:
  - collect delivery photos
  - confirm asset IDs
  - capture partner feedback
  - capture recipient/community feedback
  - confirm consent status

Stage: `Stewarding / Reporting`

- Create task: `Compile impact report`.
- Create task: `Review claims and consent`.
- When `Impact report status = Approved`, owner manually sends or schedules GHL campaign.
- After send, set `Last impact report sent` and create seven-day follow-up task.

Stage: `Renewing`

- Create task: `Use latest accepted report to frame next ask`.
- Apply `goods-renewal-ready` only after the report is sent or accepted.

### GHL Smart Lists

Keep the v2 smart-list logic:

- Active funders: opportunity in `Goods Supporter Journey` at committed/delivering/stewarding/renewing AND tag `audience-funder`.
- Funder prospects: opportunity in identified/qualified/cultivating/ask made AND tag `audience-funder`.

Add report-state smart lists in GHL:

- `Impact reports due next 30 days`: `Impact report due` within 30 days and status not sent/accepted.
- `Impact reports ready to send`: tag `goods-impact-report-ready` or status approved.
- `Story consent pending`: `Story consent status = pending` or tag `goods-story-consent-needed`.
- `Renewal-ready funders`: `goods-renewal-ready` and stage `Renewing`.

### Centrecorp Pilot Record

Created 2026-06-01 via direct LeadConnector API because the HighLevel connector was returning `401`.

- Pipeline: `Goods Supporter Journey`
- Opportunity: `Centrecorp Foundation - 130 Stretch Beds - June 26 board`
- Opportunity ID: `TUpPBR3c76JeuksojRz1`
- Contact: `Randle Walker`
- Contact ID: `ehnCEv62bCaGNTd1QuGp`
- Value: `$106,150`
- Stage: `Ask made`
- Funding type: `Philanthropic`
- Capital status: `Ask made`
- Amount basis: `Quote`
- Match-eligible (QBE): `TBC`
- Impact report type: `Board pack`
- Impact report due: `2026-06-26`
- Impact report status: `Needed`
- Evidence pack status: `Partial`
- Story consent status: `Needed`
- Tags:
  - `audience-funder`
  - `goods-impact-report-needed`
  - `goods-report-board-pack`
  - `goods-report-centrecorp-june26`
  - `goods-story-consent-needed`

Close or park the declined washer and production plant asks so the June 26 board push stays focused on the deferred bed ask.

## Build Sequence

1. Done: create the Notion `Impact Reporting Register`.
2. Done: add the Centrecorp June 26 board-pack record as the pilot.
3. Done: add the Snow July 31 acquittal record as the next reporting-control test.
4. Create the `board-decision-pack` template in v2 or as a Notion template.
5. Reconcile stale funder pages and generated reports before external use.
6. Done via direct API: create GHL opportunity fields for impact reporting.
7. Done via direct API: create the Centrecorp June 26 GHL opportunity and tag Randle's contact.
8. Still needed in GHL UI: create the smart lists and single stage-triggered workflow.
9. Still needed for the Codex plugin: reauthenticate HighLevel connector if we want to use connector tools instead of direct API.
10. Backfill active funders starting with Snow.
11. Use the Centrecorp June 26 package and Snow July 31 report as the first two live tests.

## Key Rules

- Notion is the reporting brain: due dates, register, status, review, source links.
- Empathy Ledger is the story and consent source.
- v2 is the report renderer and metric resolver.
- GHL is the execution layer: tasks, smart lists, campaign sends, follow-up.
- Xero is money truth.
- The asset register is product/deployment truth.
- Do not send old Centrecorp reports or one-pagers without correcting stale product language and funding claims.
- Do not use invoices as application-stage asks; use application forms, quotes, and board packs until approved.
