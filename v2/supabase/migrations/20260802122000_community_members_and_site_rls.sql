-- Who may open a community's production site, and what RLS actually enforces.
--
-- TWO REAL PROBLEMS THIS FIXES, both verified against the live database
-- on 2026-08-02.
--
-- 1. production_inventory and production_journal never had RLS enabled at all.
--    The 20260313000001 migration created them and stopped. An anonymous
--    request with the publishable key returns inventory rows today. Enabling
--    RLS is the fix; the policies below are what replaces the nothing.
--
-- 2. production_shifts had RLS, but every policy was USING (true) for the
--    authenticated role. Any logged-in person could read and write every
--    site's production data. That is survivable with one site and one operator
--    and is not survivable the moment a second community logs in.
--
-- NON-REGRESSION: every profile that exists today is seeded as Goods staff, so
-- nobody who has access loses it. New profiles default to false and get their
-- access from community_members instead.

alter table public.profiles
  add column if not exists is_goods_staff boolean not null default false;

comment on column public.profiles.is_goods_staff is
  'Goods team. Sees every production site, including sites in no community (the farm). '
  'Community operators are granted through community_members instead.';

-- Everyone who already had unrestricted access keeps it.
update public.profiles set is_goods_staff = true where is_goods_staff = false;

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  community_id text not null references public.communities(id) on delete cascade,
  role text not null default 'operator'
    check (role in ('operator', 'lead', 'viewer')),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (profile_id, community_id)
);

create index if not exists community_members_profile_idx
  on public.community_members (profile_id) where status = 'active';
create index if not exists community_members_community_idx
  on public.community_members (community_id) where status = 'active';

comment on table public.community_members is
  'A person''s standing in a community. operator logs production, lead also '
  'resolves maintenance and sets goals, viewer reads only. Membership grants '
  'access to that community''s production sites and NOTHING on the Empathy '
  'Ledger side: consent and story ownership stay with the storyteller.';

-- ─── Access predicate ───────────────────────────────────────────────────────
-- SECURITY DEFINER so the policies can read profiles and community_members
-- without those tables' own policies recursing.

create or replace function public.can_access_site(target_site text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_goods_staff = true
  )
  or exists (
    select 1
    from public.production_sites s
    join public.community_members m on m.community_id = s.community_id
    where s.id = target_site
      and m.profile_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function public.can_write_site(target_site text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_goods_staff = true
  )
  or exists (
    select 1
    from public.production_sites s
    join public.community_members m on m.community_id = s.community_id
    where s.id = target_site
      and m.profile_id = auth.uid()
      and m.status = 'active'
      and m.role in ('operator', 'lead')
  );
$$;

revoke all on function public.can_access_site(text) from public;
revoke all on function public.can_write_site(text) from public;
grant execute on function public.can_access_site(text) to authenticated;
grant execute on function public.can_write_site(text) to authenticated;

-- ─── community_members RLS ──────────────────────────────────────────────────

alter table public.community_members enable row level security;

drop policy if exists community_members_select on public.community_members;
create policy community_members_select on public.community_members
  for select to authenticated
  using (
    profile_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_goods_staff = true)
  );

-- Granting membership is a Goods-staff act, done through the service role.
drop policy if exists community_members_service_write on public.community_members;
create policy community_members_service_write on public.community_members
  for all to service_role using (true) with check (true);

-- ─── production_sites RLS ───────────────────────────────────────────────────

alter table public.production_sites enable row level security;

drop policy if exists production_sites_select on public.production_sites;
create policy production_sites_select on public.production_sites
  for select to authenticated
  using (public.can_access_site(id));

drop policy if exists production_sites_service_write on public.production_sites;
create policy production_sites_service_write on public.production_sites
  for all to service_role using (true) with check (true);

-- ─── production_shifts: replace the USING (true) policies ───────────────────

drop policy if exists "Authenticated users can read production shifts" on public.production_shifts;
drop policy if exists "Admin can insert production shifts" on public.production_shifts;
drop policy if exists "Admin can update production shifts" on public.production_shifts;

create policy production_shifts_select on public.production_shifts
  for select to authenticated using (public.can_access_site(site_id));
create policy production_shifts_insert on public.production_shifts
  for insert to authenticated with check (public.can_write_site(site_id));
create policy production_shifts_update on public.production_shifts
  for update to authenticated
  using (public.can_write_site(site_id)) with check (public.can_write_site(site_id));

-- ─── production_inventory and production_journal: RLS from zero ─────────────

alter table public.production_inventory enable row level security;
alter table public.production_journal enable row level security;

-- Close the anonymous read path explicitly as well as through RLS.
revoke all on public.production_inventory from anon;
revoke all on public.production_journal from anon;
revoke all on public.production_shifts from anon;

drop policy if exists production_inventory_select on public.production_inventory;
create policy production_inventory_select on public.production_inventory
  for select to authenticated using (public.can_access_site(site_id));
drop policy if exists production_inventory_insert on public.production_inventory;
create policy production_inventory_insert on public.production_inventory
  for insert to authenticated with check (public.can_write_site(site_id));

drop policy if exists production_journal_select on public.production_journal;
create policy production_journal_select on public.production_journal
  for select to authenticated using (public.can_access_site(site_id));
drop policy if exists production_journal_insert on public.production_journal;
create policy production_journal_insert on public.production_journal
  for insert to authenticated with check (public.can_write_site(site_id));
drop policy if exists production_journal_update on public.production_journal;
create policy production_journal_update on public.production_journal
  for update to authenticated
  using (public.can_write_site(site_id)) with check (public.can_write_site(site_id));

-- ─── site_maintenance_requests RLS ──────────────────────────────────────────

alter table public.site_maintenance_requests enable row level security;

drop policy if exists site_maintenance_select on public.site_maintenance_requests;
create policy site_maintenance_select on public.site_maintenance_requests
  for select to authenticated using (public.can_access_site(site_id));
drop policy if exists site_maintenance_insert on public.site_maintenance_requests;
create policy site_maintenance_insert on public.site_maintenance_requests
  for insert to authenticated with check (public.can_write_site(site_id));
drop policy if exists site_maintenance_update on public.site_maintenance_requests;
create policy site_maintenance_update on public.site_maintenance_requests
  for update to authenticated
  using (public.can_write_site(site_id)) with check (public.can_write_site(site_id));
