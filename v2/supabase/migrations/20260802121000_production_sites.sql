-- Production sites: the place a shift happened.
--
-- Before this migration nothing in the database knew where any production row
-- came from. production_shifts has `operator text` and no place at all, so the
-- 19 existing shifts, the 1 inventory snapshot and every future row were
-- unattributable. That is the thing that blocked a per-community production
-- site, not the Empathy Ledger integration.
--
-- A site is a PLACE that presses, not the facility itself. The facility manual
-- says the log travels with the facility, so the same mobile plant can move
-- from one site to the next; when it does, a new site row is added and the old
-- one is paused. Existing rows are never re-pointed.
--
-- community_id is nullable on purpose. The current site is the farm, which
-- sits in no community, and pretending otherwise would put Maningrida's name
-- on beds that were pressed 3,000km away.

create table if not exists public.production_sites (
  id text primary key,
  name text not null,
  community_id text references public.communities(id) on delete restrict,
  kind text not null default 'mobile_facility'
    check (kind in ('mobile_facility', 'community_facility', 'workshop')),
  status text not null default 'active'
    check (status in ('active', 'planned', 'paused', 'retired')),
  commissioned_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists production_sites_community_idx
  on public.production_sites (community_id);

comment on table public.production_sites is
  'Where production happens. community_id is null when the site is not in a community (the farm).';

insert into public.production_sites (id, name, community_id, kind, status, commissioned_on, notes)
values (
  'the-farm',
  'The Farm',
  null,
  'mobile_facility',
  'active',
  '2026-02-04',
  'The mobile container facility. Pressed, routed and packed the 40 Maningrida Stretch Bed kits (INV-0303); the beds were assembled in Maningrida by young people there. Sits in no community, which is why community_id is null.'
)
on conflict (id) do nothing;

-- Attribute production to a site.
-- DEFAULT 'the-farm' rather than NOT NULL-after-backfill, so the existing
-- shift, inventory and journal forms keep working untouched: they do not send
-- site_id yet and would otherwise start failing the moment this ships.
alter table public.production_shifts
  add column if not exists site_id text not null default 'the-farm'
  references public.production_sites(id) on delete restrict;

alter table public.production_inventory
  add column if not exists site_id text not null default 'the-farm'
  references public.production_sites(id) on delete restrict;

alter table public.production_journal
  add column if not exists site_id text not null default 'the-farm'
  references public.production_sites(id) on delete restrict;

create index if not exists production_shifts_site_idx on public.production_shifts (site_id, shift_date desc);
create index if not exists production_inventory_site_idx on public.production_inventory (site_id, snapshot_date desc);
create index if not exists production_journal_site_idx on public.production_journal (site_id, entry_date desc);

-- Equipment problems. One of the three things an operator opens the app to do,
-- and the only one of the three that had nowhere to go.
create table if not exists public.site_maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.production_sites(id) on delete cascade,
  reported_by uuid references public.profiles(id) on delete set null,
  reporter_name text,
  equipment text not null,
  severity text not null default 'degraded'
    check (severity in ('stopped', 'degraded', 'watch')),
  description text,
  photo_urls text[] not null default '{}',
  voice_note_urls text[] not null default '{}',
  status text not null default 'open'
    check (status in ('open', 'acknowledged', 'resolved')),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default now()
);

create index if not exists site_maintenance_requests_site_idx
  on public.site_maintenance_requests (site_id, status, created_at desc);

comment on table public.site_maintenance_requests is
  'Operator-raised equipment faults. severity stopped = the line is down.';

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists production_sites_updated_at on public.production_sites;
create trigger production_sites_updated_at
  before update on public.production_sites
  for each row execute function public.set_updated_at();
