# ACT-infra → GHL sync + reconciliation map (Xero ↔ GHL for Goods)

**Date:** 2026-05-30 · **Repo surveyed:** `/Users/benknight/Code/act-global-infrastructure` · **Mode:** READ-ONLY (nothing modified) · **Scope:** did NOT call GHL or Xero; all findings from source code, workflows, PM2 config, and the sync-schema migration.

**Verdict (one line):** The drift hypothesis is **CONFIRMED**. There is exactly ONE scheduled, durable, idempotent GHL job — and it runs the **wrong direction** (GHL→Supabase pull). Every Xero→GHL write is a hand-run one-off seed/cleanup script. The only Xero↔GHL "reconciler" is scheduled in PM2 but is **propose-only** (writes a `.md`, never touches GHL) and covers the **Buyer pipeline only** — the Supporter Journey (funder) pipeline, where values actually drifted, has **no reconciler at all**.

---

## (a) Inventory — every script that reads Xero/Supabase and writes to GHL

`source → target` is the EFFECTIVE write target. "Idempotent?" = safe to re-run without dupes. "Scheduled?" = wired to PM2/GitHub Action cron, not just `workflow_dispatch`.

| Script | What it does | Source → Target | Idempotent? | Scheduled? | Status |
|---|---|---|---|---|---|
| `scripts/sync-ghl-to-supabase.mjs` | Pulls ALL GHL pipelines, contacts, opps into Supabase mirror tables (`ghl_pipelines`, `ghl_contacts`, `ghl_opportunities`). **PULL ONLY** — `upsert` into Supabase; no `createOpportunity`/`updateOpportunity`/POST back to GHL. | GHL → Supabase | Yes (`upsert` on `ghl_id`) | **YES** — PM2 `ghl-sync` `0 */6 * * *` + GH Action `sync-ghl.yml` `0 */6 * * *` + `scheduled-syncs.yml` | **LIVE** |
| `scripts/agents/agent-xero-ghl-reconciler.mjs` | Detects Xero↔GHL drift (MISSING_OPP, STAGE_MISMATCH, VOIDED_INVOICE_LIVE_OPP, DRAFT_INVOICE_COMMITTED_DEAL). **Proposes** actions only — output is an LLM `.md` to `thoughts/shared/cockpit/xero-ghl-reconciler/<date>.md`. **Never calls GHL.** L2 autonomy. Filters to `pipeline_name ilike '%goods%'` AND Goods/weave-bed/production-plant line-items → effectively **Buyer pipeline only**. | Supabase (Xero+GHL mirrors) → `.md` file | Yes (read-only analysis) | **YES** — PM2 `agent-xero-ghl-reconciler` `0 5 * * *` daily | **LIVE but inert** (proposes, no writer downstream) |
| `scripts/seed-goods-opps-from-xero.mjs` | Backfill: for each Goods ACCREC Xero invoice with no GHL opp, **create** opp in Buyer pipeline at stage by status (PAID→Paid, AUTHORISED→Invoiced, DRAFT→Proposed; VOIDED→skip). Writes `monetaryValue` on **create only**. Logs `ghl_sync_log` op=`SeedFromXero`. | Xero (Supabase mirror) → GHL **Buyer** | Yes (dedups by `xero_invoice_id`) | **NO** — manual one-off backfill | LIVE script, run on demand |
| `scripts/seed-goods-supporter-journey.mjs` | Seeds the **funder** pipeline with **13 hardcoded funders** + hardcoded `$` values + stages (Snow $402,930, Centrecorp $123,332, TFN $130,000, …). Dedups by opp name. | **Hardcoded constants** → GHL **Supporter Journey** | Yes (skips by name) | **NO** — dated one-off (`2026-05-27` provenance in header) | LIVE script, run on demand |
| `scripts/link-ghl-to-xero-and-win.mjs` | Matches stale GHL opps (60+d) to Xero invoices by `monetary_value` ±$1 + keyword/date scoring; on match writes `xero_invoice_id` + sets opp `status='won'`. Default pipeline `"A Curious Tractor"`. | Xero (mirror) → GHL (status=won + link) | Partial (re-match safe; no value update) | **NO** — manual | LIVE script, run on demand |
| `scripts/cleanup-stale-ghl-opps.mjs` | Marks past-deadline grant opps `status='lost'` (`--apply`); lists 90d-stale for review (never auto-acts on stale). Grant/deadline-driven, not Xero-driven. | `grant_opportunities` (Supabase) → GHL | Yes | **NO** — manual | LIVE script, run on demand |
| `scripts/seed-ghl-grants.mjs`, `scripts/sync-grants-ghl.mjs`, `scripts/link-grants-to-ghl.mjs` | Grant-pipeline seeders/linkers (GrantScope/grant_opportunities → GHL grant opps). | Supabase grants → GHL | Mixed | **NO** | LIVE scripts, one-offs |
| `scripts/seed-goods-buyers-2026-05-27.mjs`, `seed-goods-foundation-pipeline-2026-05-27.mjs`, `seed-goods-alive-beds-prospects-2026-05-27.mjs`, `push-goods-anchors-to-demand-register-2026-05-27.mjs`, `enrich-goods-foundation-contacts-2026-05-27.mjs`, `migrate-goods-demand-signals.mjs`, `goods-dedup-*` | Dated one-off Goods pipeline seeders / dedupers / enrichers. Hardcoded lists, run once. | Hardcoded / Supabase → GHL | Mostly (name/dedup guarded) | **NO** | LIVE scripts, dated one-offs |
| `scripts/sync-notion-changes-to-ghl.mjs` | Notion ACT-Opportunities stage→ GHL `status` (Won/Lost/Archived) when Notion ahead of Supabase mirror. **Status only, not value/stage.** | Notion → GHL | Yes (gated on mirror=open) | **NO** (manual; not in PM2/Action) | LIVE script |
| `scripts/_archive/2026-05-finance-cleanup/push-goods-to-ghl.mjs` | Earlier ad-hoc Goods→GHL push. | Xero/manual → GHL | Unknown | NO | **ARCHIVED** |
| `scripts/_archive/2026-05-finance-cleanup/push-goods-stub-renames-to-ghl.mjs` | One-off stage/stub rename push (the pre-12-stage rename referenced in seed script header). | manual → GHL | NO | NO | **ARCHIVED** |
| `scripts/_archive/2026-05-finance-cleanup/{act-ghl,audit-ghl-ecosystem,analyze-ghl-ecosystem-strategy}.mjs` | Older GHL audit/ecosystem helpers. | GHL read | n/a | NO | **ARCHIVED** |

**Shared writer:** all live writers go through `scripts/lib/ghl-api-service.mjs` (`GHLService` — `createOpportunity`, `updateOpportunity`, `upsertContact`, `addTagToContact`, etc.). `createOpportunity`/`updateOpportunity` are thin REST wrappers (`POST /opportunities/`, `PUT /opportunities/{id}`) with **no built-in dedup** — idempotency lives in each caller (by `xero_invoice_id` or opp name), not in the service.

---

## (b) The reconciler — exists, scheduled, but cannot fix drift

- **Exists:** `scripts/agents/agent-xero-ghl-reconciler.mjs` (git-tracked, committed). Header self-describes as "the single most valuable agent… prevents the $84,700-Production-Plant-DRAFT invisibility pattern." Cron-documented "Daily 05:00 AEST."
- **Scheduled:** YES — `ecosystem.config.cjs` registers `agent-xero-ghl-reconciler` at `0 5 * * *` (whether the PM2 daemon is actually running was not verified — out of scope; survey is repo-only).
- **Behaviour (verified from code):**
  - Reads `xero_invoices` (ACCREC) + `ghl_opportunities` (`%goods%`) from the **Supabase mirror**, indexes opps by `xero_invoice_id`, classifies 4 drift types, builds an LLM prompt, and runs `runAgent()` from `scripts/lib/goods-agent-runtime.mjs`.
  - `goods-agent-runtime.mjs` only does: pick model → completion → **`fs.writeFile(outputPath)`** + log to `api_usage`/`project_knowledge`. **It has no GHL/action-executor call path.** So the reconciler's "auto-apply" actions render as text in a cockpit `.md`; **nothing executes them.**
  - **Value drift:** it `select`s `monetary_value` but **never proposes a value correction** — its only proposed actions are create-missing-opp and move-stage. An opp whose `$` undercounts the paid invoice produces **no drift item** (value mismatch is not one of the 4 detected types). This is the under-counting half of the brief, unhandled.
  - **VOIDED→Lost:** detected as `VOIDED_INVOICE_LIVE_OPP` and routed to **CEO-review only** — by explicit rule it "never auto-moves to Lost." So phantom/voided opps are surfaced for a human, never auto-cleared.
  - **Coverage:** Buyer pipeline only (filters to Goods/weave-bed/production-plant ACCREC line-items; funder grants don't match this filter — see (d)).
- **Cockpit dependency:** output path `thoughts/shared/cockpit/xero-ghl-reconciler/<date>.md` "surfaces to `/projects/goods/cockpit` **when that route exists**" (README hedge) — so even the proposals likely aren't being read.

---

## (c) Is anything scheduled to keep GHL aligned to Xero on a cadence?

**No durable Xero→GHL reconciler runs on a cadence.** Inventory of cadenced jobs touching GHL:

| Cadence mechanism | Job | Direction | Aligns GHL to Xero? |
|---|---|---|---|
| GH Action `sync-ghl.yml` `0 */6 * * *` | `sync:ghl:supabase` + `sync:ghl` (Notion) | GHL → Supabase / Notion | **No** — pulls FROM GHL |
| GH Action `scheduled-syncs.yml` `0 20 * * *` | GHL sync step (same pull) | GHL → Supabase | **No** |
| GH Action `sync-xero.yml` / `xero-weekly-sync.yml` | `sync-xero-to-supabase.mjs` | Xero → Supabase | No (refreshes the Xero mirror only) |
| PM2 `ghl-sync` `0 */6 * * *` | `sync-ghl-to-supabase.mjs` | GHL → Supabase | **No** |
| PM2 `agent-xero-ghl-reconciler` `0 5 * * *` | reconciler | Supabase → `.md` | **Detects only; cannot write GHL** (see (b)) |

So: Xero mirror is refreshed on cadence, GHL mirror is refreshed on cadence, and a detector compares them daily — but **the corrective write back to GHL is 100% manual** (seed/link/cleanup scripts, run by hand). No GitHub Action or PM2 entry executes a Xero→GHL correction.

---

## (d) Coverage gaps

1. **Buyer vs Supporter Journey (the big one).** The reconciler + `seed-goods-opps-from-xero` are **Buyer-pipeline only** — they key off ACCREC invoices with Goods buyer-style line-items. The **Supporter Journey / funder pipeline is fed exclusively by `seed-goods-supporter-journey.mjs`, a one-off with hardcoded funder names and `$` values** (Snow, Centrecorp, VFFF, QIC, TFN…). Once a grant invoice is voided, reattributed, or paid in Xero, **nothing updates the funder opp** — it stays frozen at its 2026-05-27 seed value. This is exactly where the brief says funder values drifted. **Funder pipeline = zero ongoing reconciliation.**
2. **Value sync vs stage sync.** No script reconciles `monetary_value` on an existing opp against Xero. Seed sets value on create only; reconciler ignores value mismatches; `link-ghl-to-xero-and-win` matches BY value but doesn't correct it. → undercounting opps are invisible.
3. **Phantom opps (in GHL, not in Xero).** No detector for "GHL opp with no Xero backing." `cleanup-stale-ghl-opps` keys off grant deadlines/staleness, not Xero absence. Reconciler only iterates Xero→GHL (a phantom opp simply never appears in its Xero-driven loop). → phantoms persist.
4. **Mirror lag compounds.** Reconciler reasons over the **Supabase mirror**, not live GHL/Xero. If the 6-hourly GHL pull or daily Xero pull is stale/failed, drift detection is stale too. No freshness gate.
5. **Multi-entity.** Filtering is by line-item keyword / `%goods%` pipeline name and `entity_code` is not used in the reconciler. Goods spans ACT-ST/ACT-VC + the Butterfly/Pty-Ltd transition; entity-aware reconciliation is absent.
6. **VOIDED never auto-resolves.** By design VOIDED→Lost is CEO-review-only, and since the proposal sink is an unread `.md`, voided invoices effectively never clear their opps.

---

## (e) Root cause — why alignment never sticks

**The architecture has a detector but no durable, scheduled, idempotent *writer* in the Xero→GHL direction, and the one cadenced GHL job points the wrong way.**

Concretely, three compounding causes:

1. **Wrong-direction cadence.** The only scheduled GHL automation is GHL→Supabase pull (`sync-ghl-to-supabase`, 6-hourly). The corrective direction (Xero truth → GHL) has **no cron entry at all** — it lives entirely in hand-run seed/link/cleanup scripts. So GHL is authoritative-by-default and Xero corrections only land when a human remembers to run a script.
2. **The reconciler is a recommender, not an actuator.** It's scheduled and it detects drift, but `goods-agent-runtime` only writes a `.md`; there is no wired path from its "auto-apply" list to `ghl-api-service`/`action-executor`. And its proposals land in a cockpit route that "exists when it exists." Detection without execution = drift re-accumulates between manual cleanups.
3. **Funder values are hardcoded seed data, not derived.** The Supporter Journey pipeline's `$` come from a literal table in a dated one-off script — not from a live Xero query — so they are correct only at seed time and have no mechanism to track void/reattribution/payment. This is the specific reason **funder** values drifted worse than buyer values.

**Net:** the brief's hypothesis (many one-off seed/push scripts, no durable scheduled idempotent reconciler) is **correct**, with the sharpening that a reconciler *file* exists and is even *scheduled* — it just can't write to GHL and doesn't cover funders or value/phantom drift. A durable fix needs: (i) a scheduled Xero→GHL **writer** (idempotent, value+stage+void, Buyer AND Supporter Journey, entity-aware), or (ii) wiring the existing reconciler's auto-apply set through `ghl-api-service` with a mirror-freshness gate, plus replacing the hardcoded funder seed with a live-Xero-derived funder reconciler.

---

### Key file paths (all in `/Users/benknight/Code/act-global-infrastructure`)
- `scripts/agents/agent-xero-ghl-reconciler.mjs` — the reconciler (propose-only, Buyer-only)
- `scripts/lib/goods-agent-runtime.mjs` — proves reconciler only writes `.md`, no GHL call
- `scripts/seed-goods-opps-from-xero.mjs` — Buyer backfill (one-off, idempotent)
- `scripts/seed-goods-supporter-journey.mjs` — funder pipeline seed (one-off, hardcoded $)
- `scripts/sync-ghl-to-supabase.mjs` — the only scheduled GHL job (PULL only)
- `scripts/link-ghl-to-xero-and-win.mjs`, `scripts/cleanup-stale-ghl-opps.mjs` — manual cleanup one-offs
- `scripts/lib/ghl-api-service.mjs` — shared GHL REST client (no built-in dedup)
- `ecosystem.config.cjs` (L580 `ghl-sync`, L883 `agent-xero-ghl-reconciler`) — PM2 cron registrations
- `.github/workflows/sync-ghl.yml`, `.github/workflows/scheduled-syncs.yml`, `.github/workflows/sync-xero.yml` — cadenced syncs
- `supabase/migrations/20260105090233_ghl_sync_schema.sql` — `ghl_opportunities` + `ghl_sync_log` schema (sync log: operation/direction/records_*/triggered_by; direction enum includes `supabase_to_ghl` but no scheduled job writes that direction)
