---
title: Session handoff — 2026-05-28 (procurement/cost → QBE readiness → master register)
date: 2026-05-28
branch: feat/site-media-tooling-and-funder-outcomes
resume: read MEMORY.md → [[master-register]] → this file → git status
---

# Session handoff — 2026-05-28

## What this session did (in order)
1. **Bed COGS reconciliation** — corrected `supplier-quotes.ts` BOM vs live Xero. Found admin tooling's "$149 COGS / 80% margin" was materials-only + wrong. Truth: direct materials **$467.75/bed** (HDPE kit $344.05 + canvas $93.50 + steel $27 + caps $3.20), fully-loaded **~$600**, honest margin **~20%** at $750. Fixed `supplier-cost-actuals.ts` (project_code=ACT-GD filter, real suppliers). Doc: `2026-05-28-bed-cogs-xero-reconciliation.md`. [[bed-cogs-reconciliation]]
2. **Utopia trip P&L** — synced live Xero bank data into the ACT-infra mirror (was stale to 31 Mar), itemised the May trip. Bed cost = actual **Defy INV-1602 "107 Beds" = $36,947**. Trip ≈ break-even vs Centrecorp $85,712. Doc: `2026-05-28-utopia-trip-cost-vs-centrecorp.md`. [[trip-cost-and-bank-access]]
3. **Defy invoice deep-dive** — fetched all 35 Defy invoice PDFs from Xero API, extracted what we bought.
4. **QBE documentation deep-dive** — full Stage-2 readiness register vs SIH V4. `2026-05-28-qbe-documentation-deep-dive.md`. [[sih-diagnostic-v4]]
5. **Master Register** — all 15 workstreams, health/target/actions, from a full wiki+codebase+git survey. `2026-05-28-goods-master-register.md`. [[master-register]]
6. **Notion build-out** under Goods. HQ: 3 cost tables, the **Readiness Hub** (self-contained, with §4b public+admin site map), and 4 mirrored doc pages. All IDs in [[master-register]].

## Code changed (uncommitted on `feat/site-media-tooling-and-funder-outcomes`)
- `v2/src/lib/data/supplier-quotes.ts` — corrected BOM ($467.75 direct), `fullyLoadedCostPerBed` $600, honest margin
- `v2/src/lib/data/supplier-cost-actuals.ts` — project filter + real supplier list
- `v2/src/components/production/cost-per-batch-card.tsx`, `admin/production/page.tsx`, `admin/library/page.tsx` — show direct vs fully-loaded; margin off fully-loaded
- Typecheck clean. **Not committed** — commit when ready (Ben hasn't asked yet).
- New docs: 4 in `wiki/outputs/` + 3 survey handoffs in `thoughts/shared/handoffs/`.

## Open threads / decisions (for Ben/Nic)
- **Action tracker** (Readiness Hub §5) — model not yet chosen (Notion DB vs fold into Goods. HQ vs lightweight).
- **Founder FTE %** + fair-market rate → gates the financial model.
- **≤4 market segments** for the QBE research project.
- **Which 3 funders** for binding LOIs by 31 Aug (= the QBE match).
- **Zinus $28,691** (ACT-GD) — bed input (mattresses/toppers?) or other?
- **Canvas/steel actual invoices** live in Notion/paper, not the Xero mirror — pull to firm up cost.
- **GOC-vs-ACT** separation timing; **fleet** connectivity fix-vs-accept; **GM + BD** hires.
- Program shelf (`wiki/articles/program/`) not yet mirrored to Notion (folder of 17).

## Reusable how-to learned
- Real Goods bank/Xero spend needs the act-infra **service-role key** for `xero_transactions` (v2 anon key can't read it). Refresh: `cd act-global-infrastructure && node scripts/sync-xero-to-supabase.mjs transactions --days=90`. Defy invoice PDFs via Xero API `Invoices/{id}/Attachments`. See [[trip-cost-and-bank-access]].
