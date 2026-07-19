-- media_links: typed junction between a media item (photo/video, wherever it
-- lives) and the entities it shows (person, community, asset, product).
-- Replaces free-text people: tags in local-image-tags.json as the Atlas /
-- admin source of truth. Staged 2026-07-20; Ben applies via
-- scripts/apply-media-links-migration.sh. Idempotent.

create table if not exists media_links (
  id uuid primary key default gen_random_uuid(),
  -- Where the media item lives + how to find it there.
  media_source text not null check (media_source in (
    'local',        -- repo path, e.g. design/deck-photos/...
    'el_media',     -- Empathy Ledger media_assets.id
    'el_story',     -- Empathy Ledger stories.id (videos live in both tables)
    'supabase',     -- Goods storage path
    'external'      -- URL (Descript embed, YouTube, etc.)
  )),
  media_key text not null,                  -- path / id / url per source
  media_type text not null default 'photo' check (media_type in ('photo','video','diagram','document')),
  title text,
  -- What it links to (exactly one target per row).
  target_type text not null check (target_type in ('person','community','asset','product','story')),
  target_key text not null,                 -- crm_contacts.id / communities.id / assets id (GB0-...) / product slug / story slug
  -- Provenance + consent.
  relation text not null default 'shows' check (relation in ('shows','made_by','taken_at','about')),
  consent_status text default 'unknown' check (consent_status in ('cleared','held','unknown','not_required')),
  source text,                              -- backfill origin: local-image-tags | el-media-storytellers | manifest | manual
  notes text,
  created_at timestamptz not null default now(),
  unique (media_source, media_key, target_type, target_key, relation)
);

create index if not exists media_links_target_idx on media_links (target_type, target_key);
create index if not exists media_links_media_idx on media_links (media_source, media_key);

alter table media_links enable row level security;
-- Default deny; service role bypasses RLS. No public policies on purpose.
