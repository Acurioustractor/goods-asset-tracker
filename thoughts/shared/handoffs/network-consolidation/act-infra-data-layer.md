# ACT Global Infrastructure — Data + Xero-Ingestion Layer Map

**Scope:** `/Users/benknight/Code/act-global-infrastructure` only. READ-ONLY survey (no writes performed). Live-data figures below came from one `SELECT`-only query against the shared Supabase project on 2026-05-30.

**Supabase project (the "shared" DB this repo feeds):** `tednluwflfhxyucgwigh` (`SUPABASE_SHARED_URL` / `SUPABASE_SHARED_SERVICE_ROLE_KEY`). This is the project that holds all Goods/ACT Xero data — same project the Goods CLAUDE.md and MEMORY.md reference as authoritative for Xero.

---

## (a) Finance + CRM table schemas

### `xero_invoices` — LIVE columns (verified by `SELECT *`, 2026-05-30; 2,227 rows)
The original migration (`20260123000001_xero_integration.sql`) defined a leaner table; production has since drifted **wider** via direct ALTERs. Authoritative live column set:

```
id, xero_id, tenant_id, invoice_number, type, status, contact_id, contact_name,
date, due_date, total, subtotal, total_tax, amount_due, amount_paid, currency_code,
line_items, has_attachments, reference, url, created_at, updated_at, synced_at,
invoice_type, tracking_category_1, tracking_option_1, tracking_category_2,
tracking_option_2, contact_xero_id, project_code, fully_paid_date, metadata,
project_code_source, entity_code, income_type, xero_tenant_id
```

Key column notes (matters for the alignment system):
- **Upsert key is `xero_id`** (the Xero `InvoiceID`), NOT `xero_invoice_id`. The original migration named it `xero_invoice_id UNIQUE`; the live table + the sync script (`onConflict: 'xero_id'`) use `xero_id`. Treat `xero_id` as canonical. *(MEMORY.md already flags this gotcha — confirmed here.)*
- **Two tenant columns, both populated with the same value:** `tenant_id` AND `xero_tenant_id`. The sync writes `XERO_TENANT_ID` into both. 100% of sampled rows = `786af1ed-e3ce-42fc-9ea9-ddf3447d79d0` (Nic Marchesi sole trader).
- `type`: `ACCREC` (receivable/income) | `ACCPAY` (payable/expense). (`invoice_type` is a secondary/legacy duplicate column.)
- `status`: DRAFT/SUBMITTED/AUTHORISED/PAID/VOIDED/DELETED.
- `project_code` (text, e.g. `ACT-ST`, `ACT-HV`… project codes, NOT entity) + `project_code_source` (provenance: `xero_tracking` | `manual…`).
- `entity_code` (legal entity) — added by `20260318000000_entity_model.sql`, **DEFAULT `'ACT-ST'`**. 100% of rows = `ACT-ST` in the sample (i.e. never actually differentiated — see gaps).
- `income_type` (grant/commercial/philanthropy/passive/internal-transfer/unclassified) — added by `20260323000000_rd_and_income_classification.sql`. **Only 104 / 2,227 rows populated (~95% NULL).**
- `tracking_category_1/2` + `tracking_option_1/2`: flattened copies of the Xero tracking categories (in addition to the nested `line_items[].tracking`).
- `line_items` JSONB: `{description, quantity, unit_amount, account_code, tax_type, line_amount, tracking}`.
- `metadata` JSONB: spare Xero data.

### `xero_transactions` — bank transactions
Migration `20260123000001` + later ALTERs. Columns: `xero_transaction_id` (UNIQUE upsert key), `xero_tenant_id`, `type` (RECEIVE/SPEND/TRANSFER), `contact_name`, `bank_account`, `project_code`, `project_code_source`, `total`, `status`, `date`, `has_attachments`, `is_reconciled`, `line_items` JSONB, `entity_code` (DEFAULT ACT-ST), `rd_eligible` bool, `rd_category`, `synced_at`. **Manual-tag guard:** the sync will NOT overwrite `project_code` if existing `project_code_source` starts with `manual` (user override protection).

### `xero_sync_log` — audit trail
`sync_type` (invoices/transactions/contacts/full), `records_synced`, `errors` JSONB, `started_at`, `completed_at`, `status` (running/completed/failed).

### `xero_tokens` — OAuth token store (single row, `id='default'`)
`refresh_token`, `access_token`, `expires_at`, `updated_at`, `updated_by`. Shared between local + CI so the single-use Xero refresh token doesn't desync. (Token also mirrored to `.xero-tokens.json` and `.env.local`.)

### `act_entities` — legal-entity registry (the multi-entity table)
Migration `20260318000000_entity_model.sql`. Columns: `code` (UNIQUE: ACT-ST/ACT-V/ACT-F), `name`, `entity_type` (sole_trader/pty_ltd/clg), `abn`, `xero_tenant_id`, `active_from`, `active_to` (NULL = active), `metadata`. **LIVE CONTENT = exactly ONE row:** `ACT-ST` / "Nicholas Marchesi T/as A Curious Tractor" / ABN 21591780066 / tenant `786af1ed…` / active_from 2024-01-01, active_to NULL. ACT-V and ACT-F exist only as code comments/future plan — **not seeded, no Xero tenant linked.**

### GHL / CRM tables (migration `20260105090233_ghl_sync_schema.sql` + later ALTERs)
- **`ghl_contacts`**: `ghl_id` (UNIQUE), `ghl_location_id`, `first_name`, `last_name`, `full_name` (generated), `email`, `phone`, `company_name`, `tags TEXT[]`, `custom_fields` JSONB, **`projects TEXT[]`** (e.g. `['empathy-ledger','the-harvest']` — slug array, GIN-indexed), `engagement_status`, `sync_status`, `sync_error`.
- **`ghl_opportunities`** — LIVE columns (verified): `ghl_id` (UNIQUE), `ghl_contact_id` (→ ghl_contacts.ghl_id), `ghl_pipeline_id`, `ghl_stage_id`, `name`, `pipeline_name`, `stage_name`, `status` (open/won/lost/abandoned), `monetary_value`, `custom_fields` JSONB, `assigned_to`, `ghl_created_at`, `ghl_updated_at`, `last_synced_at`, **plus later-added: `project_code`, `xero_invoice_id`, `received_date`, `acquittal_due_date`, `acquittal_status`, `pile`, `last_stage_change_at`, `last_status_change_at`.** So opportunities CAN be joined to invoices via `xero_invoice_id` and carry their own `project_code` + grant-acquittal fields.
- **`ghl_pipelines`**: `ghl_id` (UNIQUE), `name`, `stages` JSONB.
- **`ghl_tags`**, **`cultural_protocols`**, **`donations`** (`ghl_contact_id`, `project`, `donation_date`…), **`volunteer_hours`**.
- **`ghl_sync_log`**: sync audit trail (mirror of xero_sync_log pattern).

### `vendor_project_rules` — auto-tagging rules (migration `20260214200000_vendor_rules_and_financials.sql`)
`vendor_name` + default `project_code`, `income_type`, `rd_category`, `entity_code`. Drives the income-type trigger (below).

---

## (b) Xero ingestion mechanism, orgs, cadence

**Entry point:** `scripts/sync-xero-to-supabase.mjs` (`invoices` | `transactions` | `full`). Auth/HTTP via `scripts/lib/finance/xero-client.mjs` (the unified client) — though the main sync script also carries its own inline copy of the OAuth + request logic.

**Mechanism:** Node script, Xero REST API (`api.xro/2.0`, OAuth2 refresh-token flow), upserts into Supabase via `@supabase/supabase-js` service-role key. NOT an edge function, NOT Zapier. Rate-limited ~55 calls/min, 429-backoff. Tracking categories are often omitted by Xero's list endpoint, so for ≤500 records it re-fetches each invoice/txn individually to get `LineItems[].Tracking`.

**Incremental strategy:** default = **modification-date** based (`If-Modified-Since` header, state persisted in `.xero-sync-state.json`) — deliberately so retro edits to OLD invoices (recodes, voids, reconciles) are caught. `--days=N` forces a legacy `Date>=` window for deep backfills. After a `full` run it calls `refresh_mv_project_quarter_position()`.

**Which Xero ORG(s):** **EXACTLY ONE — single-tenant.** `xero-client.mjs` sends one `xero-tenant-id: XERO_TENANT_ID` header; the sync stamps that one value onto every row's `tenant_id`/`xero_tenant_id`. `.env.local` `XERO_TENANT_ID` ends `…79d0` = **`786af1ed-e3ce-42fc-9ea9-ddf3447d79d0` = Nicholas Marchesi sole trader** (matches the org ID in the prompt). Live data confirms 100% of invoices carry that tenant.
- **There is NO ACT Foundation / ACT Ventures Xero org being synced.** No multi-tenant loop exists anywhere in the ingestion path. `act_entities` ACT-V/ACT-F are future placeholders with NULL `xero_tenant_id`.
- The repo's view of the multi-entity future is a **journaling migration, not multi-org ingestion**: `scripts/export-sole-trader-to-pty-mapping.mjs` (+ `generate-marchesi-sole-trader-pnl.mjs`) exist to hand Standard Ledger a CSV to journal-allocate the FY26 sole-trader ledger across to *A Curious Tractor Pty Ltd* (June-2026 cutover). Premise: "every income line in Nic's sole trader was actually ACT income." So today, *all* ACT/Goods money lives in this one sole-trader org and is split only by tags downstream.

**Cadence:** TWO overlapping GitHub Actions cron jobs hit the same single org:
- `.github/workflows/sync-xero.yml` — **daily 06:00 AEST** (`0 20 * * *` UTC), `full --days=90`.
- `.github/workflows/xero-weekly-sync.yml` — **weekly Mon 06:00 AEST** (`0 20 * * 0`), `full --days=90` + missing-receipt detection.
- PM2 (`ecosystem.config.cjs`) also runs adjacent finance jobs: `xero-bank-balances`, `xero-payments-sync` (Mon 06:50), `push-ai-tracking-to-xero`, `ai-router-xero-mode` (writes project_code suggestions back to Xero — the only WRITE-to-Xero path).
- Secrets used by CI: `XERO_CLIENT_ID/SECRET/TENANT_ID/REFRESH_TOKEN` + `SUPABASE_SHARED_URL/SERVICE_ROLE_KEY`.

---

## (c) Project-identification mechanism + reliability

Project attribution is a **best-effort cascade computed at sync time** (`detectProjectCode()` in `sync-xero-to-supabase.mjs`), in priority order:
1. **Xero tracking categories** — categories named `Project` / `Tracking` / `Region` / `Project Tracking`. If the option value starts with `ACT-`, the code is parsed directly; otherwise matched against `projects[].xero_tracking` / `xero_tracking_aliases` from the projects config (`scripts/lib/project-loader.mjs`). Fallback: a `Business Divisions` category maps division name → default code (`a curious tractor`→ACT-IN, `eco-tourism`→ACT-HV, `farm activities`→ACT-FM) only when no Project Tracking is present.
2. **Invoice `Reference`** free-text keyword match (project code / name / tracking value / GHL tags).
3. **Line-item descriptions** keyword match.
4. **Contact name** keyword match (last resort).

**`income_type`** is NOT set by the sync. It's filled by a DB trigger (`auto_tag_invoice_income_type`, migration `20260323000000`) that copies `vendor_project_rules.income_type` when `contact_name` matches a rule — otherwise stays NULL.

**`entity_code`** is NOT set by the sync either — it rides the column DEFAULT `'ACT-ST'`. There is no logic that ever assigns a different entity.

**Reliability — measured, not assumed (live counts 2026-05-30):**
- `project_code`: **2,056 / 2,227 set, 171 NULL (~8% unattributed).** Decent but heuristic — depends entirely on bookkeeper discipline tagging Xero tracking. Text-fallback matching (steps 2–4) is fuzzy and can mis-attribute.
- `income_type`: **104 / 2,227 set (~95% NULL).** Effectively unused — the grant-vs-commercial split that funder reporting depends on is almost entirely *not* coming from this column. (Goods MEMORY notes income_type is "the authoritative revenue classifier" — at the ACT-infra layer it is overwhelmingly empty and would need backfilling.)
- `entity_code`: **100% `ACT-ST`** — provides zero differentiation today.

This is the suspected drift root cause: attribution is ad-hoc tagging at the source (Xero tracking) + a vendor-name trigger that rarely fires, with multiple fuzzy text fallbacks and no entity dimension.

---

## (d) Canonical project ledger?

**Partial / per-project-code only — there is no entity-aware canonical funder-revenue ledger.**
- The closest thing is the materialized view **`mv_project_quarter_position`** (migrations `20260521000100` + `…000200`), described in-code as "single canonical source so Notion and command-center never disagree." It aggregates ACCREC + ACCPAY + bank SPEND/RECEIVE **per `project_code` per quarter**. Refreshed at the end of every `full` sync via `refresh_mv_project_quarter_position()`. Companion view `v_project_lifetime_position` rolls it up to lifetime.
- Plus the older views from the Xero migration: `v_project_financials`, `v_monthly_revenue`, `v_outstanding_invoices`.
- For funder/revenue specifically there are **per-script extractors, not a table**: e.g. `scripts/report-goods-financial-day1.mjs` (the one Goods MEMORY cites), `backfill-funders-json-from-xero.mjs`, `audit-money-in-alignment.mjs`, plus Notion-sync scripts (`sync-finance-to-notion.mjs`, `sync-funder-reporting-to-notion.mjs`). Funder figures get assembled by these and pushed to Notion — Notion is treated as the human-facing source of truth, not a Supabase ledger table.

**Caveats that make the MV non-canonical for money truth:**
1. It keys on `project_code` only — **no `entity_code`, no `income_type`** dimension.
2. It **silently drops every row with NULL/empty `project_code`** (the ~8% unattributed invoices + 95%-NULL income split just vanish from the aggregate).
3. Bank transactions are filtered to a **hard-coded two-account allowlist** (`'NAB Visa ACT #8815'`, `'NJ Marchesi T/as ACT Everyday'`) — any money through a different account is excluded by design.

---

## (e) Gaps that let Goods $ drift

1. **Single-org ingestion, multi-entity reality not modelled in data.** Only Nic's sole-trader Xero org is synced; `entity_code` is uniformly `ACT-ST`. When ACT income legitimately sits in (or moves to) a Pty Ltd / Foundation / Butterfly org, the pipeline has no second tenant and no per-row entity assignment — the sole-trader→Pty split exists only as a one-off CSV export for an external bookkeeper, not as queryable data. Any "Goods $ split across orgs" today is really *one org, split by tags* — and if a second org is ever connected there is no loop to ingest it.
2. **`income_type` ~95% NULL.** The grant/commercial/philanthropy classifier that funder reporting and the Goods cost model lean on is almost entirely unpopulated at this layer (only the vendor-name trigger fills it, and only on ACCPAY-style vendor matches). Grant-vs-commercial revenue truth cannot be derived from `income_type` as-is — it must be backfilled and the rule set expanded.
3. **`project_code` ~8% NULL + heuristic attribution.** Depends on consistent Xero tracking-category tagging; the text/contact-name fallbacks are fuzzy and silently mis-attribute or miss. No reconciliation report flags untagged rows back to a human (beyond ad-hoc audit scripts).
4. **Two competing tenant columns + a column-name drift (`xero_id` vs the migration's `xero_invoice_id`).** Any new consumer that guesses the schema from the committed migration will use the wrong key/columns. The live schema is the truth; the migration is stale.
5. **The "canonical" MV is lossy.** It excludes NULL-project rows and all-but-two bank accounts, and has no entity/income dimension — so totals built from it will systematically differ from a raw `xero_invoices` sum, and there's no single table that reconciles invoice-cash-vs-bank-cash with entity + income tags together.
6. **Two overlapping cron jobs** (daily + weekly) both `full --days=90` against the same org — redundant, and the 90-day window relies on the modification-date incremental state file to catch older retro-edits; a blown `.xero-sync-state.json` would silently narrow coverage.
7. **GHL↔Xero link is loose.** `ghl_opportunities.xero_invoice_id` + `project_code` exist but are populated by separate backfill/seed scripts (`seed-goods-opps-from-xero.mjs`, `align-ghl-opportunities.mjs`, `link-ghl-to-xero-and-win.mjs`), and Xero contact↔GHL contact matching in the sync is fuzzy name/email — so the CRM-to-finance join is best-effort, not enforced.

---

### Key files (all absolute)
- Ingestion: `/Users/benknight/Code/act-global-infrastructure/scripts/sync-xero-to-supabase.mjs`
- Xero client/auth: `/Users/benknight/Code/act-global-infrastructure/scripts/lib/finance/xero-client.mjs`
- Schema — Xero: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260123000001_xero_integration.sql`
- Schema — entity model: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260318000000_entity_model.sql`
- Schema — income/R&D: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260323000000_rd_and_income_classification.sql`
- Schema — GHL/CRM: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260105090233_ghl_sync_schema.sql`
- Canonical-ish MV: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260521000100_mv_project_quarter_position.sql`
- Vendor rules: `/Users/benknight/Code/act-global-infrastructure/supabase/migrations/20260214200000_vendor_rules_and_financials.sql`
- Multi-entity cutover export: `/Users/benknight/Code/act-global-infrastructure/scripts/export-sole-trader-to-pty-mapping.mjs`
- GHL→Supabase sync: `/Users/benknight/Code/act-global-infrastructure/scripts/sync-ghl-to-supabase.mjs`
- Cron: `/Users/benknight/Code/act-global-infrastructure/.github/workflows/sync-xero.yml`, `…/xero-weekly-sync.yml`
