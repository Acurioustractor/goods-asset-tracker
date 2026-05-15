---
date: 2026-05-15T17:30:00+10:00
session_name: admin-operations-refactor
branch: main
status: shipped
---

# Work Stream: admin-operations-refactor

## Ledger
**Updated:** 2026-05-15T17:30:00+10:00
**Goal:** Refactor the bloated 50-page Goods admin into a focused operations register that tracks the things that actually matter — assets, communities, production costs — and unblock the Utopia trip (week of 2026-05-19).
**Branch:** main (PR #19 squash-merged as commit `8fd72cc`)
**Live URL:** https://goodsoncountry.com
**Test:** `cd v2 && npm run dev` (localhost:3000); `npm run build` clean

### Now
[->] Walk through the live admin on phone during the Utopia trip; log new demand against communities as it comes up.

### This Session

**Database**
- [x] `communities` + `community_demand` tables created (27 communities, 7 demand records seeded from `compendium.ts` + `expansion-targets.ts`)
- [x] `community_rollup` view: joins assets + demand + crm_deals into a single per-community read
- [x] `assets.community_id` FK to `communities(id)`; 561/561 assets backfilled cleanly (Mt Isa/Mount Isa, Alice Homelands/Alice Springs aliases resolved)
- [x] Migrations: `20260515000001_communities_table.sql`, `20260515000002_assets_community_fk.sql` (both applied via `exec_sql` RPC)

**Admin UI**
- [x] `/admin/communities` rebuilt DB-backed: per-community KPIs, demand-vs-deployed gap, sortable table, links to drill-in
- [x] `/admin/communities/[id]` drill-in: KPIs, inline-editable demand (server actions), assets, washing machines (with last-seen + alert badges, linked to fleet), CRM deals, compendium + Empathy Ledger stories
- [x] `/admin/assets/batch/[batch]`: bulk-allocate page; one click + dropdown to send all 107 GB0-156 beds to Utopia in a single transaction
- [x] `/admin/production` CostPerBatchCard: canonical $149.20 BOM + per-batch margin + actual supplier spend from Xero ACCPAY (Defy/Centre Canvas/DNA Steel) with variance vs canonical + supplier-quote drift chips
- [x] `/admin/fleet` machines now link to canonical community drill-ins
- [x] Sidebar refactor: 50 items → 16 items in 3 groups (Operations / Pipeline & Revenue / Content)
- [x] Mobile polish on field-team-critical pages (44px tap targets, low-value columns hide progressively)

**Archive**
- [x] 27 static deck pages moved to `_archive/2026-05-15-admin-decks/` with `RESTORE.md` (~14,160 lines out of active build, route count 122 → 106)
- [x] Stale links in dashboard + crm-summary-card updated to point at surviving pages

**Backfills & scripts** (all idempotent, re-runnable)
- [x] `v2/scripts/seed-communities.mjs` — seeds canonical community + demand records
- [x] `v2/scripts/backfill-asset-community-id.mjs` — `assets.community` → `community_id` (561/561 matched)
- [x] `v2/scripts/backfill-deal-community-id.mjs` — `crm_deals.metadata.community_id` (9 deals matched, 33 funder/supplier deals correctly skipped)

**Ops & infra**
- [x] Vercel env vars added across Production + Preview + Development: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (added Preview scope), `ACT_INFRA_SUPABASE_URL`, `ACT_INFRA_SUPABASE_KEY` (new, all three envs)
- [x] `/dashboard/feedback` marked `force-dynamic` to unblock Vercel static prerender (was missing Supabase env at build time)

**PR & merge**
- [x] PR #19 updated (was draft, scope-stale "QBE intake workflow"); new title + body covering full branch scope
- [x] Vercel preview rebuilt clean after env-var fix; visually validated on preview URL
- [x] PR #19 squash-merged as `8fd72cc` on main
- [x] Production deployed and serving live at goodsoncountry.com

**Commits on main (this session, as 1 squash commit)**
- `8fd72cc` — feat(goods): asset register + admin operations refactor + QBE intake + fleet diagnostics (#19)

### Previous Sessions
- [x] Asset register + site rewrite + Canberra Airport landing page (`3cc89db`)
- [x] Brand-voice + visual polish round two (`e16e2f8`)
- [x] /stories doorway (`ed991f3`)
- [x] Earlier on this branch: fleet diagnostics, QBE intake workflow, grants archive
- [x] 2026-03-27: Unified CRM + Production command center, procurement strategy, Tim Cook supply chain model. Archived at `2026-03-27.md` in this folder.

### Next

**Operational (during/after the Utopia trip)**
- [ ] Field team: scan QR on each delivered bed, flip status `allocated` → `deployed`, capture GPS at `/bed/{id}`
- [ ] Log any new demand requests directly against `/admin/communities/[id]` via the inline form (no more compendium.ts edits)
- [ ] Confirm Vercel production env has all needed keys after the merge (we added Preview + ACT_INFRA_*; Prod was already populated for most)

**Build (next session candidates, by leverage)**
- [ ] BUILD: Real per-batch COGS — line-item batch codes in Xero so we can compute true per-unit COGS per batch instead of the lifetime average. Currently the cost card shows lifetime $/bed; we want per-batch precision.
- [ ] BUILD: Mobile-friendly card layout for `/admin/communities` index table (currently hides columns at sm/md/lg; field team would prefer cards)
- [ ] BUILD: Stories surface on `/admin/stories` (currently 90 lines; could pull EL stories + compendium voices into a unified editor surface)
- [ ] BUILD: Production journal `cost_idea` entries surfaced on cost-per-batch card
- [ ] BUILD: Wiki-export the 27 archived decks to markdown in `wiki/outputs/admin-archive/` (or delete entirely once it's clear nothing was lost)

**Actions (outside the codebase)**
- [ ] ACTION: Send Gmail drafts still pending (DEWR follow-up + Rotary chase)
- [ ] ACTION: Register on austender.gov.au if not done
- [ ] ACTION: Start Supply Nation application via Oonchiumpa

### Decisions

**This session**
- Communities are now a first-class DB entity (not just typed `compendium.ts` data) ✓
- `assets.community_id` FK + `community_rollup` view = single source of truth for "what's at community X" ✓
- Bulk batch allocate is the only sane field-team flow for 100+ beds at a time; per-bed scan still works for finer placement ✓
- Static deck pages move OUT of `/admin/` and into `_archive/` rather than being deleted (workflow rule: archive = move, not delete) ✓
- `/admin/communities` is the new home; `/admin/network` was a stub and is archived ✓
- Mobile polish: hide low-value columns progressively rather than card layouts (faster to ship, info still scannable) ✓
- Xero ACCPAY actual $/bed is a *directional* signal vs canonical $149.20, not per-unit truth (no batch tagging in Xero yet) ✓
- ACT_INFRA Supabase access uses the anon key (read-only) — safer to commit to env vars than service role ✓
- Squash-merge over rebase-merge: branch was 30 commits old with duplicate fleet work already on main; squash collapses cleanly ✓

**From earlier sessions (still load-bearing)**
- COGS per Stretch Bed = $149.20 (Defy $45 + Steel $36 + Canvas $65 + Caps $3.20) ✓
- Margin at institutional price ($560) = 73% ✓
- Supply Nation Certification is FREE and gives 3x more contracts ✓
- IBA Business Loan up to $5M with 30% grant component ✓
- 200 beds @ $560 = $112K — under $125K Commonwealth threshold ✓

### Open Questions

**New this session**
- UNCONFIRMED: Will the field team actually use `/admin/communities/[id]` to log demand, or stick to text messages? (Test during Utopia trip.)
- UNCONFIRMED: Production env had most Supabase keys but `ACT_INFRA_SUPABASE_URL/KEY` are new — verify `/admin/production` cost-per-batch card renders correctly on prod.

**Carried over (still unresolved)**
- UNCONFIRMED: PICC bed price $750 vs $560 — is $750 inc GST?
- UNCONFIRMED: Groote/WHSAC — has Simone been contacted? What's the procurement pathway?
- UNCONFIRMED: REAL Fund EOI status — any response from DEWR?
- UNCONFIRMED: Rotary $82.5K — any payment plan or dispute?
- UNCONFIRMED: Oonchiumpa ownership structure — does it meet 51% threshold for July 1 IPP change?
- UNCONFIRMED: Is Goods/ACT registered on AusTender?
- UNCONFIRMED: Supply Nation application started?

### Key file locations (post-refactor)

| What | Where |
|---|---|
| Canonical communities | `communities` table (Supabase) + `v2/scripts/seed-communities.mjs` |
| Demand records | `community_demand` table + inline edit on `/admin/communities/[id]` |
| BOM (canonical $149.20) | `v2/src/lib/data/supplier-quotes.ts` |
| Actual supplier spend | `v2/src/lib/data/supplier-cost-actuals.ts` (queries ACT-infra Xero mirror) |
| Sidebar | `v2/src/app/admin/admin-sidebar.tsx` |
| Bulk-allocate API | `v2/src/app/api/admin/assets/batch/[batch]/allocate/route.ts` |
| Community drill-in | `v2/src/app/admin/communities/[id]/page.tsx` + sibling components |
| Field placement form | `v2/src/app/bed/[id]/install-logger.tsx` |
| Archived decks (27 pages) | `_archive/2026-05-15-admin-decks/` + `RESTORE.md` |
| Prior handover | `thoughts/shared/handoffs/network-consolidation/2026-03-27.md` |
| Asset-mgmt narrative handover | `wiki/outputs/2026-05-15-asset-management-handover.md` |

### Workflow State
pattern: research-build-ship
phase: 5
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "Refactor admin to focus on assets / communities / production costs"
- merged_to_main: true
- production_live: true
- env_vars_added: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY/SERVICE_ROLE_KEY (Preview), ACT_INFRA_SUPABASE_URL/KEY (all envs)

#### Unknowns
- field_team_demand_logging: PENDING_TRIP_TEST
- prod_cost_card_renders: PENDING_PROD_VERIFY
- picc_bed_price_gst: UNKNOWN
- groote_contact_status: UNKNOWN
- real_fund_eoi_response: UNKNOWN
- rotary_payment_status: UNKNOWN

#### Last Failure
- Vercel preview build initially failed on `/dashboard/feedback` static prerender (missing Supabase env). Resolved by `force-dynamic`. Then preview runtime 500'd from middleware missing Supabase env on Preview scope. Resolved by adding env vars via `vercel env add`. Production env had Supabase keys already; we only added ACT_INFRA_* there.
