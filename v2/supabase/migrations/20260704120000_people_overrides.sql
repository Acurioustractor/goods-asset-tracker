-- People CRM (/admin/people) — curated display overrides.
-- Editable layer over the aggregated static + live-GHL people, keyed by the
-- aggregator person id (e.g. funder-snow, advisor-kristy, buyer-miwatj).
-- Applied to the Goods project (cwsyhpiuepvdjtxaozwf) 2026-07-04 via MCP.

create table if not exists public.people_overrides (
  person_id  text primary key,
  photo_url  text,
  bio        text,
  featured   boolean not null default false,
  hidden     boolean not null default false,
  notes      text,
  updated_at timestamptz not null default now()
);

alter table public.people_overrides enable row level security;
-- Default-deny: no policies, so only service_role (which bypasses RLS) can
-- read/write. The People CRM is an admin surface reached only via server
-- routes using the service key. Matches the content_items Phase 0 pattern.

comment on table public.people_overrides is
  'Curated display overrides for the People CRM (/admin/people), keyed by the aggregator person id. Editable fields: photo_url, bio, featured, hidden, notes. Service-role only.';
