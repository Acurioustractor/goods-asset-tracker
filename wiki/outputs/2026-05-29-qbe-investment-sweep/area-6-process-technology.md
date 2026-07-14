# QBE Area 6 — Process & Technology

Date: 2026-05-29
Diagnostic status: Strength (with one practical caveat)
Build status: Built — needs founder review
Priority: P1
Owner: Ben

## Summary (say this in the meeting)

Process and technology is one of the areas where Goods is stronger than it looks for an enterprise this size. We can show a live website and admin system, a Supabase asset register with QR-linked product pages, a public per-bed journey, a production dashboard, a washing-machine telemetry pipeline, support forms, GHL contact/outreach integration, Stripe checkout, and a 139-article wiki plus Notion knowledge base — all verified in the active `v2/` codebase and in direct Supabase queries (verified). The diagnostic did not ask us to invent this from scratch; it asked us to make it explainable, documented, and less dependent on Ben and Nic. The honest claim is "a working operating backbone now being converted into SOPs, source-of-truth rules and founder-independent routines" — not "a fully automated operating system" (target). The single most important discipline we have already written down is the AI human-in-loop policy: AI is recall, structuring and editing support, and every external document is human-audited and defendable in Q&A.

## Where we are vs what the diagnostic flagged

The V4 diagnostic flagged three things still needed before external use: SOP ownership, a stale-data checklist, and a founder-dependency reduction plan. Since then the review has produced v0.1 drafts of all three inside this build — an operating systems map (11 systems with owner, evidence source, risk and the next SOP each needs), a two-tier SOP index (7 priority-1 SOPs to write before funder use, 6 priority-2 after), and a founder-dependency reduction table mapping each founder-held activity to a hand-off role and the artifact required. The wiki article `wiki/articles/enterprise/06-process-and-technology.md` already frames the area honestly, and `wiki/articles/governance/ai-human-in-loop-policy.md` is the direct, written response to the diagnostic's AI concern. So the gap is no longer "no plan" — it is that the SOPs are still unwritten and unsigned, dashboards exist but are not all confirmed as used weekly, and production/inventory snapshots are stale (latest production shift 2026-03-12, latest inventory 2026-03-27; verified, internal). The real remaining work is founder-authored, signed and dated collateral, not more narrative.

## Priorities (next builds)

1. Write and assign owners to the 7 priority-1 SOPs (asset reconciliation, QR/claim/support/redaction, support triage, production shift/inventory, QA/delivery handover, GHL approval, AI pre-send checklist) — each with a named owner, not "Ben/Nic".
2. Build the data-freshness / stale-data checklist (route or table, owner, last refreshed, stale threshold, escalation) and refresh production + inventory snapshots before any demo; flag fleet telemetry as "partial" until connectivity reliability is reconciled.
3. Produce the source-of-truth matrix (Supabase vs GHL vs Notion/wiki vs Xero vs Empathy Ledger vs Drive) so GHL is shown as an execution layer, never the source of truth.
4. Assemble the admin evidence pack: 6–8 annotated screenshots (route, what it proves, what it does not prove) plus one redacted QR lifecycle sample — privacy-reviewed before any external share.

## Proof links

- Full review: `wiki/outputs/2026-05-29-qbe-area-06-process-technology-full-review.md`
- Wiki article: `wiki/articles/enterprise/06-process-and-technology.md`
- AI human-in-loop policy: `wiki/articles/governance/ai-human-in-loop-policy.md`
- Cross-area cost model (Area 04 link): `wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md`
- Canonical numbers: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Code evidence: `v2/src/app/admin/assets/page.tsx`, `v2/src/app/admin/scans/page.tsx`, `v2/src/app/bed/[id]/page.tsx`, `v2/src/lib/scans/log-scan.ts`, `v2/src/app/support/page.tsx`, `v2/src/app/api/support/route.ts`, `v2/src/lib/ghl/index.ts`, `v2/src/app/admin/production/page.tsx`, `v2/src/app/admin/fleet/page.tsx`, `v2/src/app/wiki/guides/operations/page.tsx`
- Screenshots: `output/playwright/qbe-area06/`
- Area 06 Notion page: https://www.notion.so/36eebcf981cf81659f6afab915672b57
- QBE Diagnostic Artifact Database: https://www.notion.so/cb3794d427914d72bf1036106d8116f5
- GHL operating manual: https://www.notion.so/36debcf981cf81b08b32e368fca5917f
- Goods x SIH Diagnostic Readiness Hub: https://www.notion.so/36debcf981cf814a8de1cd5da6d3387d

## Numbers safe for this area (verified internal, direct v2 Supabase 2026-05-29)

- 558 asset records carry QR URLs; 496 deployed bed units tracked (Stretch + legacy Basket); 524 deployed product units incl. machines.
- 231 bed_scans rows / 52 real non-bot/non-admin scans; 18 bed_journeys; 19 production_shifts; 1,937 usage_logs; 638 daily_machine_rollups; 75 webhook_receipts; 43 crm_deals; 30 orders; 1 ticket.
- Latest production shift 2026-03-12; latest inventory snapshot 2026-03-27 — both stale, refresh before demo.

## Public-copy risk for this area

Do not say the automated supply chain is complete, predictive maintenance is live across the fleet, or SOPs are complete (all target/future). Do not call GHL the source of truth (execution layer only). Do not present Notion or AI output as founder-authored unless Ben/Nic have reviewed it. Do not share raw QR, household, story, contact, support-ticket or telemetry-receipt data externally (internal only). Do not imply every dashboard is used weekly unless Ben/Nic confirm that operating habit.
