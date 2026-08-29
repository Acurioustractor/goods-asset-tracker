-- Close the public-API exposure on the Goods project.
--
-- Applied to cwsyhpiuepvdjtxaozwf on 2026-08-30 as raw SQL, on Ben's explicit
-- instruction, and captured here afterwards so a migration replay or `db reset`
-- cannot reintroduce it. Recorded in the ledger with `supabase migration repair
-- --status applied 20260830000000`.
--
-- Findings and verification: thoughts/shared/ghl/2026-08-29-URGENT-goods-db-exposure.md
-- in act-regenerative-studio. Every item below was confirmed by direct query against
-- information_schema and pg_policies before and after.
--
-- What was open:
--   * public.exec_sql(text) was SECURITY DEFINER and executable by `anon` via
--     /rest/v1/rpc/exec_sql — arbitrary SQL as the function owner for anyone holding
--     the anon key, which is public by design for client-side use.
--   * `anon` held DELETE/INSERT/SELECT/TRUNCATE/UPDATE on assets, bed_signals,
--     xero_tokens, user_assets and profiles.
--   * RLS was OFF on bed_signals and xero_tokens.
--   * `assets` carried INSERT and UPDATE policies to {public} WITH CHECK (true).
--
-- What was exposed: 609 asset rows holding 40 GPS coordinates, 27 household contacts
-- and 3 recipient names for Aboriginal and Torres Strait Islander households in remote
-- communities — readable and overwritable by anyone with the anon key.

-- 1. Arbitrary SQL execution. Highest priority.
--
-- service_role and postgres keep their own explicit grants, so the three admin helpers
-- that call this with the service-role key still work:
--   v2/scripts/apply-bed-scans-migration.mjs, setup-admin.mjs, setup-admin-auth.ts
revoke execute on function public.exec_sql(text) from anon, authenticated, public;

-- 2. The anonymous write surface.
--
-- SELECT on assets is deliberately NOT revoked: the public site reads the register
-- through the anon key and the "Public assets read" policy stays in place.
revoke insert, update, delete, truncate on table public.assets      from anon, authenticated;
revoke all                              on table public.xero_tokens from anon, authenticated;
revoke all                              on table public.bed_signals from anon, authenticated;

drop policy if exists "Public assets insert" on public.assets;
drop policy if exists "Public assets update" on public.assets;

-- Safe to enable: every bed_signals reader and writer goes through
-- createServiceClient (api/bed/[id]/name, api/bed/[id]/signal, api/cron/sms-dispatch,
-- api/cron/pulse-watch, and the admin pages), and service_role bypasses RLS.
-- xero_tokens is service-role only, so a bare enable with no policy is correct there.
alter table public.bed_signals enable row level security;
alter table public.xero_tokens enable row level security;

-- Still open after this migration, tracked in the URGENT doc:
--   * anon and authenticated still hold INSERT/UPDATE/DELETE/TRUNCATE on profiles and
--     user_assets. RLS gates the first three; TRUNCATE is NOT subject to RLS. With
--     exec_sql shut there is no PostgREST route to reach it, so this is a standing
--     grant rather than an open door, but it should not stand. The revoke is
--     deliberately NOT in this file, because this file is recorded in the ledger as
--     applied and every statement in it has actually run:
--       revoke truncate on table public.profiles, public.user_assets
--         from anon, authenticated;
--   * 8 SECURITY DEFINER views at advisor level ERROR (community_rollup, user_beds_view,
--     overdue_assets, unread_messages_view, pending_requests_view, community_asset_health,
--     active_tickets_summary, webhook_receipts_daily).
--   * 9 anon-executable SECURITY DEFINER functions: can_access_site, can_write_site,
--     get_tables, handle_new_user, refresh_daily_machine_rollups and four fleet-stats ones.
--   * Every "Staff can manage" policy tests auth.role() = 'authenticated', so any
--     signed-in account of any kind is staff. Needs a real is_goods_staff() predicate.
--   * Column-level grants so gps, contact_household and recipient_name leave the
--     public read surface entirely.
