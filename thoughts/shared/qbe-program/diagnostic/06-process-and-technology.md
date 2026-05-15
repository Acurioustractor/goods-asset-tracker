# 6. Process and Technology Maturity

> Goods has strong technical capability and early operating systems, but the actual processes are still startup processes: useful, moving and incomplete. The operating rule is clear: AI should support the human work, not become the voice of the organisation.

## Current maturity

Process maturity is mixed. The team knows the tools, builds quickly and can automate, but many procedures are still being formed while the work is happening.

That is different from saying "fit-for-purpose systems are in place" across the organisation. Some are. Some are drafts. Some are still in Ben and Nicholas's heads.

## What is live

- Next.js ecommerce site for the Stretch Bed.
- Stripe for direct purchases.
- Xero through ACT for finance.
- Supabase for product, order and asset data.
- Goods Wiki and ACT Tractorpedia as internal knowledge bases.
- Empathy Ledger as the consent and story infrastructure.
- Early washing-machine telemetry, with only part of the fleet instrumented.
- Internal admin dashboards for QBE and operational tracking.

## What is still manual

- B2B sales pipeline.
- Production planning and inventory.
- Grant acquittal and funder reporting.
- Manufacturing bottleneck tracking.
- Repeatable partner onboarding.
- Support for someone assembling a bed without calling Nicholas or Ben.
- Clear separation between current metrics and possible future metrics.

## How AI is being used

The current pattern is custom, not off-the-shelf. Ben mostly uses Claude Code and custom agents to hold organisational information, query transcripts, assemble documents and reduce admin load.

The reason is practical: if AI can carry some COO or CFO-style aggregation work, Ben and Nicholas can spend more time on engagement, design, sketching, iteration and community support.

That is the right intent. The risk is that if AI does too much of the public-facing explanation, the heart of the work disappears.

## Automation ideas

- Ecommerce-style order flow adapted to local manufacturing: an order lands online, is made in Alice Springs, and is delivered locally.
- Washing-machine telemetry that can trigger support: low use, power spikes, maintenance checks or simple "is everything okay?" messages.
- Grant reporting and acquittal support.
- Production controls: Kanban, reorder points, bottleneck identification, bolts and consumables ordered before they stop production.
- Sales timing around known community payment cycles, handled carefully so it does not become extractive.

## AI guardrails

AI can summarise and retrieve. Humans need to hold the story, the judgement and the relationship.

For wiki and investor material, that means:

- write from what was actually said or verified
- mark ideas as ideas
- stop presenting dashboards as if they are daily operating habits when they are not
- keep community voice under consent and control
- remove inflated language that makes ordinary work sound grander than it is

## What to build next

- A lean production and inventory system.
- A better B2B sales CRM process.
- A support path for assembly, repairs and feedback.
- A reporting system that starts with community partners, then funders, then internal dashboards.
- A clearer rule for what AI can draft and what Ben or Nicholas must rewrite in their own voice before sharing.

## Sources

- May 2026 founder transcript and notes, user-provided.
- Technical references: `v2/src/app/admin/qbe-program/page.tsx`, `v2/src/lib/empathy-ledger/`, `v2/src/lib/data/impact-model.ts`.
- Operations docs: `v2/docs/OPERATIONS_HANDBOOK.md`, `v2/docs/PRODUCTION_FACILITY_GUIDE.md`.
