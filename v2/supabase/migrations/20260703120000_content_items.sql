-- Content system — Phase 0: the unified curation index.
-- ONE row per asset regardless of where the bytes live (local filesystem now,
-- Empathy Ledger in Phase 1). Carries the curation verbs (star / rating /
-- archive / tags) plus linkage columns filled in later phases. The bytes are
-- never copied here; this is an index, not a store.
--
-- Design: wiki/outputs/2026-07-03-content-system-design.md
--
-- Critic fixes baked in:
--   1. Identity is the content CHECKSUM, not the file path. Archiving git-mv's
--      the file, so a path key would orphan the row. checksum is the stable key
--      for local files; EL rows (null checksum) are keyed by (source, ref).
--   3. consent_tier defaults to the safe side; default-deny stays the rule.
--
-- RLS is ON with no policies: only the service role (server-side admin routes
-- and scripts) can read or write. No anon/authenticated access.

create extension if not exists pgcrypto;  -- gen_random_uuid()

create table if not exists public.content_items (
  id             uuid primary key default gen_random_uuid(),
  source         text not null default 'local' check (source in ('local', 'el')),
  ref            text not null,             -- mutable pointer: local /images/... path, or EL media/story id
  url            text not null,             -- servable url (local path or EL cdn url)
  poster_url     text,                      -- video poster / thumbnail
  media_type     text not null default 'image' check (media_type in ('image', 'video')),
  media_subtype  text,                      -- 'overlay' | 'portrait' | 'logo' | 'render' | ...
  checksum       text,                      -- md5 of bytes; the STABLE identity for local files
  area           text,                      -- top folder under images/ (product, process, people, ...)
  width          int,
  height         int,
  duration_seconds numeric,
  -- curation verbs
  starred        boolean not null default false,
  rating         smallint check (rating between 0 and 5),
  archived_at    timestamptz,               -- soft-delete; the file MOVE is a separate batched step
  archive_path   text,                      -- where the file was moved (_archive/<date>/...)
  tags           text[] not null default '{}',
  -- linkage (FKs added in Phase 2 when storytellers/quotes tables exist)
  community_id   uuid,
  storyteller_id uuid,
  canon_slot     text,                      -- set = this item is the winner for that raise slot
  -- consent mirror for fast filtering; the real gate stays cleared-voices.ts
  consent_tier   text not null default 'gated' check (consent_tier in ('public', 'gated', 'red')),
  used_where     text[] not null default '{}',   -- page slots / routes that reference this file
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- STABLE identity for local files: one row per content hash, survives an archive
-- move. NULL checksums (EL rows) are allowed to repeat (Postgres NULLs distinct).
create unique index if not exists content_items_checksum_uidx
  on public.content_items (checksum);

-- EL rows have no local checksum, so they are keyed by their source ref.
create unique index if not exists content_items_el_ref_uidx
  on public.content_items (source, ref) where source = 'el';

create index if not exists content_items_area_idx     on public.content_items (area);
create index if not exists content_items_archived_idx on public.content_items (archived_at);
create index if not exists content_items_starred_idx  on public.content_items (starred);
create index if not exists content_items_canon_idx    on public.content_items (canon_slot);

-- keep updated_at honest
create or replace function public.content_items_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists content_items_touch on public.content_items;
create trigger content_items_touch before update on public.content_items
  for each row execute function public.content_items_touch_updated_at();

-- Default-deny: RLS on, no policies. Only the service role bypasses RLS.
alter table public.content_items enable row level security;
