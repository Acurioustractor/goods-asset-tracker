# 6. Process and Technology Maturity

> Goods has unusually strong technical capability for a small team, but the operating system is still emerging. Some parts are live: ecommerce, Stripe, Supabase, GHL integration, internal admin pages, wiki source pages and Empathy Ledger direction. Other parts are draft or partial: production tracking, QR lifecycle data, washing-machine telemetry, Grantscope opportunity matching, Notion review workflow and repeatable partner onboarding. The honest answer is that the architecture is thoughtful, but the daily operating discipline still needs human verification and simplification.

## The Human Version

The technology should buy us more time with people, not replace the people.

That is the core process test. If the system helps Goods:

- know where products are,
- repair things faster,
- reduce landfill,
- respond to community feedback,
- keep funders and partners updated,
- avoid losing evidence,
- make production teachable,
- and stop founders carrying every detail in their heads,

then it is useful.

If the system creates polished dashboards that nobody uses, or drafted language that loses the human story, it is not useful yet.

## Current Maturity Snapshot

| Area | Current status | Evidence | What still needs review |
|---|---|---|---|
| Web/app platform | Live app and `/insiders` wiki surface. | Active public site, synced wiki content and internal admin surfaces. | Browser-check the new wiki pages once the dev server is healthy. |
| Product truth | Structured data translated into readable source pages. | [[../sources/canonical-product-data]] and product wiki pages. | Convert into buyer-ready product sheets. |
| Ecommerce | Live for Stretch Bed only. | Shop/product system and Stripe integration. | Confirm order fulfilment process matches current operations. |
| Supabase | Operational truth layer for products, orders, assets, stories and CRM/deal data where live. | Repo rule names v2 project `cwsyhpiuepvdjtxaozwf`. | Do not use wrong Supabase MCP; verify actual live schema before claims. |
| GHL | Integration exists for orders, support, partnerships, recipients and strategic targets. | Internal integration evidence and the approval-gated CRM/procurement workflow. | Use dry-run and approval before pushing buyer/funder/partner actions. |
| QR and lifecycle tracking | Model exists, raw data sensitive. | [[../sources/community-essential-goods-tracking-model]] and [[../sources/qr-code-data]]. | Create redacted samples and consent rules before external use. |
| Production process | Documented facility guide exists. | [[../sources/production-facility-guide]]. | Confirm current equipment, throughput and photos. |
| Operations handbook | Draft operating manual exists. | [[../sources/operations-handbook]]. | Check against current Stretch Bed process and team roles. |
| Empathy Ledger | Direction for consent-led story infrastructure. | [[../impact/empathy-ledger-impact]] and [[../governance/data-sovereignty]]. | Confirm which stories/media are published or shareable. |
| Grantscope/CivicGraph | Goods client expects workspace data. | [[../program/grantscope-capital-procurement-loop]] documents the expected loop. | Verify/implement the Goods workspace data endpoint before relying on live pulls. |
| Notion | Human review workspace exists. | QBE Working Pack pages and mirrors. | Build per-source and opportunity review cards, not only static pages. |

## What Is Live Now

- Stretch Bed ecommerce and product pages.
- Stripe purchase path for the Stretch Bed.
- Code-backed product truth.
- Wiki source pages and QBE working pack pages.
- Notion mirrors for the connected wiki process.
- GHL integration code for contacts, workflows, support, claims and strategic targets.
- Admin-gated outreach push route with dry-run support.
- Empathy Ledger client direction and local fallback story content.
- Grantscope client contract in Goods.

## What Is Draft, Partial Or Manual

- Production inventory and shift tracking.
- QR-based asset lifecycle records.
- Redacted examples for mentors.
- Washing-machine telemetry as a reliable reporting source.
- B2B buyer pipeline discipline.
- Grant acquittal and funder reporting workflow.
- Partner onboarding process for On-Country production.
- Notion opportunity register.
- Outcome write-back from GHL and Grantscope into wiki/source register.
- Clear distinction between live metrics and candidate metrics.

## QR And Asset Lifecycle Flow

The QR/asset model should be framed as care and repair infrastructure, not surveillance.

| Step | What happens | System | Status |
|---|---|---|---|
| 1 | Product gets unique ID or QR. | Asset/QR infrastructure. | Model exists, raw data sensitive. |
| 2 | Product is delivered or assigned. | Orders/assets/bed journeys. | Needs live schema verification. |
| 3 | Person or partner scans QR for support, repair or feedback. | Support form/user request/GHL only if opted in. | Needs redacted sample flow. |
| 4 | Structured lifecycle fields capture condition. | Asset condition status, serviceability, failure cause and outcome wanted. | Defined in tracking model. |
| 5 | Repair, replace, pickup or dispose pathway is triggered. | Support process and partner operations. | Needs operational owner and SLA. |
| 6 | Aggregated patterns inform product, procurement and waste evidence. | Supabase/wiki/Grantscope. | Use aggregate only for external material. |

Minimum structured fields already named in the tracking model:

- asset condition status,
- serviceability,
- failure cause,
- outcome wanted,
- old item disposition,
- safety risk,
- issue observed date.

Human review needed:

- Who can see household-linked records?
- Who can edit them?
- Who can export them?
- How can a person withdraw story or household-level information?
- What redacted example can mentors see?

## Production Process Flow

The production facility guide is one of the strongest process sources because it describes the work, not just the ambition.

Current documented flow:

1. Collect plastic.
2. Sort HDPE/PP and exclude unsafe materials.
3. Shred plastic.
4. Weigh flakes.
5. Fill tray.
6. Heat and press.
7. Cool sheet.
8. CNC cut parts.
9. Edge finish.
10. Assemble with steel poles and canvas.

What this proves:

- Goods has thought through plant layout, equipment and power constraints.
- The process can be transferred into a teachable operating guide.
- Production is connected to local waste and local jobs.

What still needs checking:

- current equipment status,
- current CNC status,
- bed-per-sheet assumptions,
- current material input per bed,
- current throughput,
- safety procedures,
- photos and diagrams suitable for mentors.

## Operations Flow

The operations handbook shows the early attempt to move from founder-held knowledge into repeatable routines.

Current documented routines include:

- daily order checks,
- order status updates,
- inventory review,
- customer communications,
- fulfilment status flow,
- content audit and story tagging,
- sponsor/community delivery process,
- reporting routines.

What to be careful about:

- Some language still reads like generic ecommerce operations.
- The handbook needs to reflect the current Stretch Bed reality, not old artisan/product assumptions.
- Internal admin instructions should be separated from mentor-facing process evidence.

## GHL And CRM Flow

GHL should be the follow-up engine, not the source of truth.

Current integration can support:

- new order contacts,
- sponsor contacts,
- partnership enquiries,
- support tickets,
- high-priority support,
- recipient claims,
- user messages,
- user requests,
- strategic buyer, capital and partner targets.

Approval rule:

- Discovery can happen in Grantscope/CivicGraph.
- Review happens in Notion.
- Evidence lives in wiki/source pages and Drive.
- Only approved follow-up goes to GHL.
- No raw story, household, QR, asset-level or sensitive contact notes should be pushed.

## Grantscope/CivicGraph Flow

The Goods/Grantscope loop expects a workspace data feed that can return:

- `summary`,
- `buyers`,
- `capital`,
- `communities`,
- `all`.

The client expects buyer targets, capital targets and community proof lines. That is the right shape for matching opportunities to Goods evidence, but it is not yet enough by itself.

Before relying on it:

- verify the workspace data endpoint exists in the active Grantscope/CivicGraph deployment,
- confirm authentication/secret handling,
- confirm returned fields match the Goods client,
- route serious matches into Notion review,
- block direct GHL push until approval.

## Knowledge Operating Rule

Automation should help with aggregation, recall, comparison and drafting. It should not be the final voice.

Allowed uses:

- summarising source documents,
- finding contradictions,
- building review queues,
- drafting first-pass source pages,
- comparing funders to Goods criteria,
- producing admin and reporting drafts.

Human-required uses:

- community story interpretation,
- final external language,
- consent decisions,
- funder claims,
- legal and governance claims,
- finance numbers,
- relationship judgement.

## What Proof Still Needs To Be Added

| Proof item | Why it matters | Where it should live |
|---|---|---|
| Screenshot of order/admin flow | Shows ecommerce operations are real. | Wiki source page or Drive image folder. |
| Redacted QR support example | Shows asset lifecycle system without exposing household data. | [[../sources/qr-code-data]] and Notion review. |
| Production process photos | Makes plant maturity visible. | Drive plus [[../sources/production-facility-guide]]. |
| Simple production process diagram | Helps mentors understand transferability. | [[../products/plant-design]] and this page. |
| GHL dry-run example | Shows approval-gated CRM push. | CRM / Procurement Follow-up Notion page. |
| Grantscope sample opportunity card | Shows signal-to-review workflow. | Notion Opportunity Register. |
| Live-vs-candidate metrics table | Prevents overclaiming impact measurement. | [[../impact/metrics-tracked]]. |
| Data-sharing rule | Prevents accidental exposure of sensitive data. | [[../governance/data-sovereignty]]. |

## Process Risks

- Too much evidence remains in code or local files instead of visible pages.
- Admin dashboards may look more mature than daily operating habits.
- QR/asset tracking could be misread as surveillance if not framed and governed carefully.
- Drafted material can sound too polished and lose the real story.
- GHL can become noisy if unapproved research is pushed into the CRM.
- Grantscope can create too many signals unless the Notion review gate is strict.
- Production process claims can drift unless checked against current equipment and throughput.

## Human Review Questions

- Which systems are actually used weekly?
- Which dashboards are prototypes rather than operating habits?
- What is the current source of truth for orders, assets, support and production?
- What screenshots or redacted samples can be shown safely?
- Who owns production tracking?
- Who owns support and repair follow-up?
- Which GHL workflows are live and which are configured but unused?
- What does a partner need to run production without us present?
- What drafted material must be rewritten in founder voice before sharing?

## Next Outputs

- A redacted QR/asset lifecycle sample.
- A production process photo board.
- A live-vs-draft systems table.
- A partner onboarding checklist.
- A GHL dry-run screenshot or example.
- A Grantscope-to-Notion opportunity card template.
- A one-page data-sharing rule for story, household, contact and asset data.

## Sources

- [[../sources/community-essential-goods-tracking-model]]
- [[../sources/qr-code-data]]
- [[../sources/production-facility-guide]]
- [[../sources/operations-handbook]]
- [[../sources/impact-model-data]]
- [[../governance/data-sovereignty]]
- [[../impact/empathy-ledger-impact]]
- [[../program/grantscope-capital-procurement-loop]]
- Internal Grantscope client and HighLevel/GHL integration evidence, to be translated into redacted examples before mentor review.
- [[../sources/may-2026-founder-working-conversation]].
