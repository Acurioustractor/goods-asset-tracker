-- Content system — Phase 2: the people + quotes layer.
-- storytellers = the reconciliation entity (who is in the imagery, their consent,
-- their portrait, their community). quotes = one home for the words, replacing
-- the hand-edited TS quote stores, linked to a storyteller + community.
--
-- Design: wiki/outputs/2026-07-03-content-system-design.md §4
--
-- Consent default is RED everywhere = default-deny; the cleared-voices allowlist
-- promotes the 32 cleared names to gated. RLS on, no policies (service role only).

create extension if not exists pgcrypto;

create table if not exists public.storytellers (
  id                   uuid primary key default gen_random_uuid(),
  el_uuid              uuid,                       -- link to the EL storyteller (nullable)
  display_name         text not null,
  aliases              text[] not null default '{}',
  slug                 text unique,
  role                 text,                       -- 'Elder', 'Health Practitioner', ...
  community_id         uuid references public.communities(id),
  is_elder             boolean not null default false,
  portrait_content_id  uuid references public.content_items(id),  -- the chosen public portrait
  consent_tier         text not null default 'red' check (consent_tier in ('public', 'gated', 'red')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists storytellers_community_idx on public.storytellers (community_id);
create index if not exists storytellers_consent_idx   on public.storytellers (consent_tier);

create table if not exists public.quotes (
  id             uuid primary key default gen_random_uuid(),
  storyteller_id uuid references public.storytellers(id) on delete cascade,
  community_id   uuid references public.communities(id),
  text           text not null,
  context        text,
  theme          text,
  source         text,                            -- 'curated' | 'el' | 'transcript' | 'trip'
  el_ref         text,                            -- EL quote/transcript id if EL-sourced
  quotability    smallint,
  canon_slot     text,
  consent_tier   text not null default 'red' check (consent_tier in ('public', 'gated', 'red')),
  created_at     timestamptz not null default now()
);
create index if not exists quotes_storyteller_idx on public.quotes (storyteller_id);
create index if not exists quotes_consent_idx     on public.quotes (consent_tier);

create or replace function public.storytellers_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists storytellers_touch on public.storytellers;
create trigger storytellers_touch before update on public.storytellers
  for each row execute function public.storytellers_touch_updated_at();

alter table public.storytellers enable row level security;
alter table public.quotes       enable row level security;
