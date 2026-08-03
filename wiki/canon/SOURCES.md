# Goods data sources (the map behind the canon)

Last verified 2026-06-08. This is the reference for which Supabase project holds
what, so the alignment engine always reads the right database. If you are about
to query "Goods data", check here first.

## The one rule

The v2 app database is the **Goods** project, ref `cwsyhpiuepvdjtxaozwf`. For any
v2 data operation use the `.env.local` credentials (curl or psql), NOT the
Supabase MCP. The MCP can see every project in the org and needs an explicit
project_id; pass the wrong one and you silently query someone else's database.

## Projects (Supabase org `zennczhyghoomusnvcpg`)

| Env var (in v2/.env.local) | Project ref | Supabase dashboard name | What lives here | Kept current by |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `cwsyhpiuepvdjtxaozwf` | **Goods** | v2 app: assets register, products, recipients, bed records | `check-asset-drift.mjs` re-derives canon vs live; daily CI once secrets set |
| `EMPATHY_LEDGER_SUPABASE_URL` | `yvnuayzslukamizrlhwb` | Empathy Ledger Enhanced | EL storytellers, stories, media | manual; `el-*` scripts |
| `ACT_INFRA_SUPABASE_URL` | `tednluwflfhxyucgwigh` | Empathy Ledger (NOT a project called "ACT infra") | Goods Xero mirror. **⚠ THE 2026-07-25 "VERIFIED EMPTY" NOTE IS WRONG AS OF 2026-08-03.** The mirror is populated: `xero_transactions` 4,949 rows (synced 2026-08-02), `xero_invoices` 2,293, `xero_bank_transactions` 5,661, `xero_contacts` 1,416. It CAN produce a per-project category split: `xero_transactions.project_code` (e.g. `ACT-GD`) plus `line_items` jsonb carrying `account_code` and Xero tracking. **TWO TRAPS.** (1) FILTER ON STATUS: 136 of 204 ACT-GD FY26 spend rows are `DELETED` ($229,127), almost certainly Dext re-imports; an unfiltered query overstates ~3x. (2) `xero_bank_transactions` is STALE (last sync 2025-12-30) and carries no ACT-GD tracking - do not use it. Canon money figures still come from human `/reconcile` pulls, but the mirror is now good enough for category analysis. Worked example: the FY26 ACT-GD split on the "Xero FY26 Actuals" tab of the GOC entity model workbook (`tools/build-goc-answered-workbook.py`) | manual reconcile (`/reconcile` + accountant); `check-canon-drift.mjs` flags staleness |

## The wrong-project trap

`bhwyqqbovcjoefezgfnq` is **ACT Farmhand**, a different project. It is the one the
CLAUDE.md warning is about. It is NOT Goods. Never query it for Goods data.

Other projects the MCP can see but Goods does not use: Palm Island On Country
Server (`uaxhjzqrdotoahjnxmbj`), Barkly Backbone (`gkwzdnzwpfpkvgpcbeeq`), SMART
Connect (`gokmsihcbejttzimbrlw`), Knight Finances (`qolqnrxdqkctidjeilqt`).

## Footguns

1. **MCP sees all 9 projects.** It requires an explicit project_id. `check-asset-drift.mjs` now refuses to run unless `SUPABASE_URL` is the Goods ref, so the canon can never be validated against the wrong database.
2. **Name mismatch.** `ACT_INFRA_SUPABASE_URL` points at the project Supabase calls "Empathy Ledger"; `EMPATHY_LEDGER_SUPABASE_URL` points at "Empathy Ledger Enhanced". Do not assume the dashboard name matches the env var.
3. **Region.** Goods runs in `ap-northeast-1` (Tokyo); the rest of the org is in Australia. Cosmetic, but note it if you compare hosts.
4. **Money is manual.** The Xero mirror (ACT infra project) is not auto-pulled into canon. That is the standing reconciliation P0 (one accountant-reviewed Goods-only figure).

## How each canon domain stays up to date

- **assets** (beds, washers, communities, plastic): `cwsyhpiuepvdjtxaozwf`, AUTO. `check-asset-drift.mjs` fails on drift. Local now; daily and on every main push once the `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` repo secrets are set.
- **money** (received, receivables, the cuts): `tednluwflfhxyucgwigh` Xero mirror, MANUAL. `check-canon-drift.mjs` enforces cross-file lockstep and flags staleness; the live re-pull is human (`/reconcile`).
- **story / consent** (cleared voices, EL published): `yvnuayzslukamizrlhwb`, MANUAL.

See `canon.ts` for the per-fact `source` and `asAt`, and `needs-signoff.md` /
`artifact-review.md` for the live review queues the loops generate.
