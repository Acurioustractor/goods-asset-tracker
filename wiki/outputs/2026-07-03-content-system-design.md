# Goods Content System — Unified Design

Date: 2026-07-03
Author: content-system architect (Claude)
Status: design for build, MVP scoped to start this week
Voice: plain, grounded, zero em dashes, straight quotes, "On Country" capitalised

---

## TL;DR and the answer to Ben's open question

Ben asked: "Is this all done through Empathy Ledger, and how?"

Answer: No, and it should not be. The right shape is a **hybrid with a single local index**.

Empathy Ledger (EL) stays the backbone for people: storyteller portraits, storyteller-linked
photos and videos, the raw quotes, and per-story consent. But three hard facts rule out "EL alone":

1. The roughly 300 local files (v2/public/images, design pools, the video pools) were **never uploaded into EL**, so EL is not an inventory of all the imagery. It only knows what has been put into it.
2. EL's schema has **no star, no rating, no archive, and no per-storyteller consent flag** exposed to the syndication client. The curation verbs Ben wants have nowhere to live in EL.
3. EL access is fragile: the legacy direct-Supabase REST keys were disabled org-wide 2026-06-17 (confirmed by the inline comment in media-library/page.tsx). Building the whole system on EL writes inherits that operational risk.

So the design is: **one new curation index table on the Goods DB** (`content_items`) that holds
exactly one row per asset regardless of where the bytes live, carrying the star, rating, archive,
tag, and linkage state. The bytes stay where they already are. EL stays the source of truth for
people and consent. The Goods DB becomes the source of truth for curation state and the unified
searchable gallery. Three stores, one index, one gallery.

This is decisive: **hybrid, indexed locally, read-through to EL, curation state never written back to EL.**

---

## 1. Source of truth per data type

Verdict column says where the authoritative record lives and why. "Index" means a row also exists in
the new `content_items` / `storytellers` / `quotes` tables for search and curation, but the value it
points at is owned elsewhere.

| Data type | Bytes / record live in | Curation + search index | Verdict and why |
|---|---|---|---|
| Local photos (~300) | Filesystem (v2/public/images/**, design pools) | `content_items` row (Goods DB) | **Local + index.** No per-file DB row exists today; a file's only identity is its path. The index gives each one a stable id to hang star/tag/archive on. Bytes stay on disk (Vercel serves them, prod FS is read-only). |
| Local videos + overlays | Filesystem (v2/public/video, finals from output/ledger-video) | `content_items` row, media_type video | **Local + index.** Same reasoning. Overlay is just media_type video with subtype `overlay`. Raw footage (media/raw, edit intermediates) does NOT get indexed; it goes offline (see cleanup). |
| EL storyteller photos + videos | Empathy Ledger (media_assets + stories, unioned) | `content_items` row, source='el', pointing at EL cdn_url | **EL is truth, indexed read-through.** EL owns the bytes and consent. We index by EL id + url so EL media appears in the same grid, but we never copy the bytes and never write curation back to EL. |
| Storyteller portraits | Empathy Ledger (avatar + story joins) | `storytellers.portrait_content_id` references a `content_items` row | **EL is truth, portrait chosen locally.** EL holds the portrait image; the local `storytellers` row records which content_item is the chosen public portrait. |
| Quotes | Migrate to `quotes` (Goods DB), sourced from EL + curated-quotes.ts | `quotes` row | **Local table, EL-sourced.** Today quotes are duplicated across 5 hand-edited TS files with no keys. Consolidate into one `quotes` table with FKs. Raw quote text can originate from EL (transcripts, storyteller_quotes); the curated public version lives in the table. |
| Communities | Goods DB `communities` (already canonical) | already relational | **Local Supabase, unchanged.** `communities` is the one properly relational anchor (uuid PK, name_aliases[], lat/lng, partner, contacts). Everything hangs off `communities.id`. |
| Consent | EL per-story gate (stories_for_site) + local cleared-voices name-list | mirrored to `consent_tier` on storytellers, quotes, content_items | **Hybrid, default-deny stays local.** EL owns per-story consent via its stories_for_site function. But EL has no per-storyteller flag, so the 32-name cleared-voices allowlist remains THE gate for portraits and quotes. Seed `storytellers.consent_tier` from it, default RED. |
| Canon picks | design/canon-slots.json (40-slot taxonomy) + `content_items.canon_slot` | `content_items.canon_slot` | **Taxonomy stays as JSON, the pick moves to the index.** The 40-slot purpose taxonomy stays in canon-slots.json. The winner is expressed as `content_items.canon_slot = <slot key>` instead of parallel JSON. canon-resolve/render scripts and the drift lock are kept; they read the index. |

**One-line verdict:** hybrid. EL for people, portraits, quotes-source, per-story consent. Goods DB
`communities` for place. A new Goods DB curation index (`content_items` + `storytellers` + `quotes`)
for the unified gallery, curation verbs, and the quote-portrait-community-consent-canon links.

---

## 2. The curation UX (how Ben goes through everything once)

**Extend `/admin/media-library`.** It is already the modern unified grid: it walks
public/images/** at request time, merges the EL content-hub photo library, reads the dedup map and
the tag store, and exposes a clean `UnifiedItem` shape (id, src, full, source, area, title, tags,
consent, aliases). It is read-only today. We add the three missing verbs and back them with a real
table. Rename the extended surface to `/admin/content` so it is clearly the one gallery.

**Star / archive / tag / rate state lives in the `content_items` table, not JSON.** This is a hard
call, not a preference:

- Vercel prod FS is read-only, so JSON sidecars keyed by path cannot be written live. A Supabase table can.
- Curation must scale to ~300 photos plus ~50 videos plus the EL pool with bulk actions and faceted search. JSON keyed by path does not support multi-select bulk writes or indexed filtering.
- Star, archive, and pin state are currently scattered across localStorage (photo-review), repo JSON (canon-*, partner-dashboard-images), and EL flags. One table ends the scatter.

**The verbs:**

- **Star + rating.** A toggle star and a 0 to 5 rating per item. This is the live re-implementation of the only star UI that exists (photo-review), which is a dead localStorage snapshot today.
- **Archive (soft-delete, never hard-delete).** In-gallery archive sets `content_items.archived_at` instantly (DB write, works in prod). It does NOT touch the file. A separate batched dev script moves the actual file into `_archive/<date>/` with a RESTORE.md and records `archive_path`. This honours the "archive equals move, not delete" rule and the read-only-FS constraint at the same time.
- **Tag.** One uniform namespace:value taxonomy (community:*, participant:*, use:*, theme:*, product:*, subtype:*) written to `content_items.tags` for every item, local or EL. This ends the split where photos wrote EL tags and media-library wrote only local tags through two different APIs.

**Bulk actions.** Multi-select (shift-click range, select-all-in-filter), then bulk star, bulk
archive, bulk tag add/remove. This is how Ben clears 300 items in one sitting.

**Search and filter facets** (all query the one index, so search is finally comprehensive):

- folder / area (the public/images subfolder)
- subject tag (namespace:value)
- community (FK to communities)
- consent tier (public / gated / red)
- canon slot (is it a raise pick, and which)
- star and rating
- media type (image / video / overlay)
- source (local / EL)
- used-where (which page slot or route references this file, from `used_where[]`)
- archived (hidden by default, toggle to review the archive)
- full-text over title, filename, tags, caption

**API.** One route, `POST /api/admin/content-item`, writes curation state (star, rating, archive,
tags, links) to `content_items`. It replaces the per-surface write routes (local-image-tag,
canon-el-pick, dashboard-image).

---

## 3. Video and overlay in the same gallery

Video is a first-class citizen of the same grid, not a separate tool.

- **Local video** (v2/public/video web-ready set, plus any finals promoted from output/ledger-video) is indexed as `content_items` rows with `media_type='video'` and a `poster_url`. Posters are generated with ffmpeg (tools/analyze-video.sh already does frame extraction) and stored alongside the video.
- **EL video** comes from the two EL tables (media_assets and stories) unioned and deduped by url. The press-pack fetcher (getApprovedVideos in press-pack.ts) already implements exactly this union and dedup; reuse it. Indexed as source='el' rows referencing the EL cdn_url and thumbnailUrl.
- **Overlays** (Stretch Bed Overlay and similar) are `media_type='video'` with `media_subtype='overlay'`, so they filter as their own facet but sit in the same grid with the same star / archive / tag verbs.
- The grid shows a poster thumbnail with a play affordance; the lightbox plays the video and offers copy-url / download, matching the current photo lightbox.

Result: one gallery walks every photo, every video, and every overlay, from both local and EL, with
the same curation verbs and the same search.

---

## 4. The unified content model (one schema sketch)

The link chain Ben wants is: a **quote** belongs to a **storyteller**, who has a **portrait**
(a content_item) and a **community**, gated by **consent**, and any content_item can be pinned to a
**canon slot**. One relational model, hung off the existing `communities` anchor. All three new
tables live on the Goods DB (cwsyhpiuepvdjtxaozwf). Read via PostgREST or psql, never the Supabase
MCP, never exec_sql for SELECT.

```sql
-- Existing, unchanged: communities (uuid PK, name_aliases[], lat/lng, partner, contacts)

-- The unified media index. ONE row per asset, wherever the bytes live.
create table content_items (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('local','el')),
  ref           text not null,            -- local: /images/... path ; el: EL media/story id
  url           text not null,            -- servable url (local path or EL cdn_url)
  poster_url    text,                     -- video poster / thumbnail
  media_type    text not null check (media_type in ('image','video')),
  media_subtype text,                     -- 'overlay' | 'portrait' | 'logo' | 'render' | ...
  checksum      text,                     -- md5, folds in image-dedup.json for dup detection
  width int, height int, duration_seconds numeric,
  -- curation verbs
  starred       boolean not null default false,
  rating        smallint check (rating between 0 and 5),
  archived_at   timestamptz,              -- soft-delete; file move is a separate batched step
  archive_path  text,                     -- where the file was moved (_archive/<date>/...)
  tags          text[] not null default '{}',   -- uniform namespace:value taxonomy
  -- linkage
  community_id     uuid references communities(id),
  storyteller_id   uuid references storytellers(id),
  canon_slot       text,                  -- set = this item is the winner for that raise slot
  -- consent (mirrors the EL gate + local cleared-voices for fast filtering)
  consent_tier  text not null default 'gated' check (consent_tier in ('public','gated','red')),
  used_where    text[] not null default '{}',   -- page slots / routes that reference this item
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (source, ref)
);

-- The reconciliation entity. Replaces the 6 name-string stores.
create table storytellers (
  id             uuid primary key default gen_random_uuid(),
  el_uuid        uuid,                     -- link to the EL storyteller (nullable)
  display_name   text not null,
  aliases        text[] not null default '{}',
  slug           text unique,
  role           text,
  community_id   uuid references communities(id),
  is_elder       boolean not null default false,
  portrait_content_id uuid references content_items(id),   -- the chosen public portrait
  consent_tier   text not null default 'red'
                 check (consent_tier in ('public','gated','red')),
  -- default RED = default-deny; seeded from cleared-voices.ts (the 32 cleared become public/gated)
  created_at     timestamptz not null default now()
);

-- One quote table. Replaces curated-quotes, content.quotes, journeyStories,
-- impactStories, compendium.communityVoices.
create table quotes (
  id            uuid primary key default gen_random_uuid(),
  storyteller_id uuid references storytellers(id),
  community_id   uuid references communities(id),
  text          text not null,
  context       text,
  theme         text,
  source        text,                      -- 'curated' | 'el' | 'transcript' | 'trip'
  el_ref        text,                      -- EL quote / transcript id if EL-sourced
  quotability   smallint,
  canon_slot    text,                      -- optional narrative slot pin
  consent_tier  text not null default 'red'
                check (consent_tier in ('public','gated','red')),
  created_at    timestamptz not null default now()
);
```

Notes on the model:

- The FK between `content_items.storyteller_id` and `storytellers.portrait_content_id` is a deliberate two-way link (a portrait item knows its person, a person knows their portrait). Both are nullable; add the FKs after both tables exist.
- **Identity and purpose stay separate columns.** `storyteller_id` is who is in the image; `canon_slot` is what job the image does in the raise. A portrait is never conflated with a purpose slot, which is the mistake the current canon system would invite if slots were identity-keyed.
- **Consent is filterable in one place.** Today it is expressed 5 incompatible ways. Here it is one `consent_tier` enum on the three tables, seeded from and kept consistent with the cleared-voices gate and the EL stories_for_site gate. Default RED everywhere means default-deny survives.
- **Community linkage becomes a FK**, replacing the fuzzy full-text community-to-story matching in community-stories.ts.

The query Ben cannot run today ("show me every cleared portrait and quote for community X") becomes:
select from quotes join storytellers on storyteller_id where community_id = X and consent_tier = 'public',
plus content_items where community_id = X and media_subtype = 'portrait' and consent_tier = 'public'.

---

## 5. Consolidation kill-list

Ten admin surfaces touch media with no shared model. Here is the explicit disposition of each.

**Absorb into the one gallery (`/admin/content`, the extended media-library):**

- **/admin/photos-browser — RETIRE.** It is a strict subset of media-library (browse, search, copy, download). Nothing unique to keep.
- **/admin/photo-review — RETIRE.** Frozen localStorage snapshot with no write-back and stale data. Its star + rating UX is the model we re-implement live against `content_items`, but the tool itself goes.
- **/admin/photos — MIGRATE then RETIRE.** It rides the dead legacy EL Supabase keys, so its bulk-tag and consent writes are probably already broken in prod. Move its one worthwhile idea, the elder-review consent workflow, into the gallery's consent panel (writing `consent_tier`), then retire it.
- **/admin/dashboard-images — FOLD as "slot assign" mode.** Same pattern as canon: assign a consent-cleared item to a named slot. It becomes a mode of the gallery writing a slot map, not a separate tool.
- **/admin/canon — FOLD as "canon slot" mode.** Keep the 40-slot taxonomy (canon-slots.json), keep canon-resolve.mjs and canon-render.mjs and the drift lock. Change only the storage of the pick: a canon pick sets `content_items.canon_slot`, which regenerates canon-resolved.json. Canon stops being a parallel JSON world and becomes a view over the one index.

**Keep, but re-point:**

- **/admin/el-storytellers — KEEP as the People feed.** It is the read-only EL roster with clearance verdicts. It becomes the source that seeds and refreshes the local `storytellers` table, and its roster view can live as the gallery's People tab. Read-only mirror stays.
- **/admin/el-stories — KEEP separate.** This is prose editorial (the words surface), not media curation. Keep it, but move it off the legacy direct-Supabase REST path onto the content-hub API or the proven el-story-media-swap PATCH pattern.

**Keep separate, do NOT fold (different domain):**

- **/admin/assets — KEEP.** Hardware register of physical beds and washers. Not a photo library.
- **/admin/library — KEEP, but RENAME** to something like /admin/directory. It is a link and counts hub, and the twin name with media-library is pure confusion.

**Retire these JSON sidecars once `content_items` is live** (their data migrates into the index):
local-image-tags.json (tags move to content_items.tags), canon-el-picks.json (picks move to
content_items.canon_slot), partner-dashboard-images.json (slot map), image-dedup.json (checksum
moves onto content_items). **Keep** canon-slots.json (the taxonomy definition) and
canon-resolved.json (the generated read artifact that CANON:<slot> tokens consume).

---

## 6. Phased build plan

Each phase names what gets built, on which data store, and the smallest first slice that ships value.

### Phase 0 — MVP curation gallery over the LOCAL pool (this week)

Goal: Ben can start culling the ~300 local photos in one place this week.

- Build: create the `content_items` table on the Goods DB. Write an indexer, scripts/content-index.mjs, that walks v2/public/images/** (checksum, area, existing tags from local-image-tags) and upserts one row per unique image. Extend the media-library client with a star toggle, a 0 to 5 rating, an archive toggle, and multi-select bulk actions. Add POST /api/admin/content-item to write curation state.
- Data store: Goods Supabase `content_items`. Bytes stay on disk.
- Smallest first slice: index ONLY public/images/** (~224 files); add just star and archive plus a "hide archived" filter. No EL, no video, no linkage yet. This alone lets Ben walk every local photo, star keepers, and archive junk.

### Phase 1 — EL ingestion and video

Goal: one grid over everything, both stores, photos and video and overlay.

- Build: extend the indexer to pull EL media via the content-hub API (image and video) and reuse press-pack's getApprovedVideos union of media_assets and stories (dedup by url). Upsert source='el' rows referencing the EL cdn_url, no byte copy. Index local videos with ffmpeg-generated posters. Overlay files get media_subtype='overlay'. Set consent_tier for EL rows from the EL flags and keep the safeImageUrl bucket guard so private-bucket urls are dropped.
- Data store: `content_items` rows referencing EL CDN and local video paths.
- Smallest first slice: EL images read-through into the same grid, plus the ~34 web-ready public/video items with posters.

### Phase 2 — quotes, communities, and people linkage

Goal: a quote tied to a portrait tied to a community tied to consent tied to a canon slot.

- Build: create the `storytellers` and `quotes` tables. Seed storytellers from the EL roster (getGoodsStorytellersWithClearance) plus cleared-voices (the 32 cleared map to public/gated, everyone else stays RED) plus content.storytellerProfiles (portrait and community). Migrate the 5 quote stores into `quotes` with FKs. Set content_items.community_id and storyteller_id. Add the People tab. Make canon picks write content_items.canon_slot and regenerate canon-resolved.json. Retire the JSON sidecars.
- Data store: Goods DB `storytellers` and `quotes`; linkage columns on `content_items`.
- Smallest first slice: seed the storytellers table, link portraits, and migrate curated-quotes for the 32 cleared voices only, so the People tab is real and consent-safe on day one.

---

## 7. The cleanup (how to cull ~300 images safely)

Two steps, both fully reversible, both respecting consent and the canon locks already in place.

**Step A — dedup and heavy-pool archive (dev-time git mv, before Ben touches the gallery).**
The scout verified 49 exact-md5 duplicate copies across the pools. After confirming the deck build's
references, git mv the confirmed dupes and scratch into _archive/<date>/ with a RESTORE.md:
design/deck-assets (near-entirely dupes of public/images), design/_image-originals (dupes of
process/), and the generated-images AI scratch. Separately, move the raw footage OFFLINE, it does not
belong in the web repo: media/raw (1.9GB) and output/ledger-video src and work (about 1GB of raw
clips and render intermediates). Keep only web-ready cuts in public/video. This removes the bulk of
the junk before the human pass even starts.

**Step B — keep/cull pass in the gallery over public/images/** (~224).**
Ben walks the grid, stars keepers, archives junk. In-gallery archive sets content_items.archived_at
instantly (a DB write, works in prod). A batched dev script, scripts/content-apply-archive.mjs, then
reads the archived rows and git mv's the files into _archive/<date>/, writes a RESTORE.md manifest,
and records archive_path on the row. Never git rm.

**Safety rails (all enforced by the apply script and the archive button):**

1. Dry-run report first. The apply script prints what would move before moving anything.
2. Block archive if the item is load-bearing: refuse when content_items.canon_slot is set (a raise pick), when consent_tier = 'red', or when used_where is non-empty (the file is referenced by a live page slot in media.ts). Overriding requires an explicit flag.
3. Batch by date, one git commit per batch, so any move is a plain git revert.
4. The canon lock (40/40 slots filled, drift-checked) and the cleared-voices gate are both honoured by rule 2, so the cull can never quietly remove a canon winner or expose or delete a consent-gated asset.

---

## Appendix — constraints and risks that shaped this design

- **Vercel prod FS is read-only.** Curation STATE lives in the DB so it works live; file MOVES are dev-time git operations applied in batches. This is the single biggest reason star/archive/tag is a table and not a JSON sidecar.
- **EL access path.** Standardise reads on the content-hub API (EMPATHY_LEDGER_API_URL / API_KEY), the live path already used by media-library and canon. Do NOT rebuild on the legacy direct-Supabase REST keys (disabled 2026-06-17). Do NOT write curation state back to EL. The proven el-story-media-swap PATCH pattern remains available if a genuine EL write is ever required, but the design does not depend on it.
- **No per-storyteller consent flag in EL.** The 32-name cleared-voices allowlist stays THE gate. Seed storytellers.consent_tier from it, default RED, treat story and consent data as canon RED (never auto-published).
- **EL media is split across two tables** (media_assets and stories) and must be unioned and deduped by url. press-pack.ts already does this; reuse it rather than re-solving it.
- **Never Supabase MCP for v2, never exec_sql for SELECT.** exec_sql swallows rows. Read via PostgREST (curl with the service role key from v2/.env.local) or psql against cwsyhpiuepvdjtxaozwf. Writes go through the Next.js admin API routes using the service role key server-side.
- **Do not conflate portrait identity with canon purpose.** content_items carries both storyteller_id (identity) and canon_slot (purpose) as separate columns; the model keeps them apart on purpose.
