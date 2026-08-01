# Goods media pipeline — photos, video, tagging, and the staging sweep (2026-07-29)

**Status:** reviewed against the live schema and admin surfaces today. This is the workflow for
getting the missing story media in, tagged three ways (person · community · product), and
staged against the /story/road shot list. Verified counts: 198 Goods-linked media rows,
**0 with location_name** · person-tag table is `media_storytellers` (the real one) ·
`video_links` (50 rows platform-wide) is the ready-made home for Descript links ·
`media_import_sessions` exists for batch imports.

## 1. Photos: the pipeline that already exists

1. **Stage on disk first** (nothing enters the platform unstaged):
   `staging/goods/<community>/<yyyy-mm>-<what>/…` — e.g. `staging/goods/kalgoorlie/2024-10-first-beds/`.
   One folder per stop moment, matching the shot list in §4.
2. **Import** via the admin media surfaces (`/admin/media`, or the project media route so
   `project_id` stamps automatically). Every row gets on entry:
   - `project_id` = Goods project `6bd47c8a…` · `organization_id` = Goods on Country `c312323e…`
   - `alt_text` MANDATORY (the 2,111-image escape hatch is closed; do not reopen it by hand)
   - `visibility='private'` on entry, always. Public is a review decision, not an upload default.
3. **Tag people** in the admin people-tagging flow → writes `media_storytellers` rows. Rule
   from the estate: UNTAGGED means nobody looked, so every import batch ends with a tagging
   pass, even if the tag decision is "no people in frame".
4. **Tag community (location)** → fill `location_name` + `latitude`/`longitude`. The backfill
   for the existing 198 rows uses the canonical place list already in
   `src/app/prototype/pulse-map/data.ts` (name + coords for every Goods community). Batch by
   known clusters via `/admin/bulk-edit` (the July 2026 Palm Island series is one batch).
5. **Tag product** → the `tags` + `media_tags` vocabulary. Proposed Goods product/context tags,
   added once and reused: `basket-bed`, `weave-bed`, `stretch-bed`, `washing-machine`,
   `press`, `workshop`, `delivery`, `check-in`, `community-day`, `on-country`.
6. **Consent + release**: person-tagged photos follow the existing review gates
   (`/admin/media` review, elder pathway where flagged). Ben's attestation covers publication
   the way the existing 149 were done, and the consent evidence reference goes on the row
   (the Maningrida lesson: evidence named once, pointed at from the manifest).

## 2. Video: Descript links are first-class already

No file wrangling needed. Each Descript share link becomes a `video_links` row:
`video_url` + `embed_url`, `platform='descript'`, `title`, `recorded_at`, `project_id`,
`organization_id`, plus the governance columns the table already carries
(`cultural_sensitivity_level`, `requires_elder_approval`, `status`). People in the video link
through `storyteller_media_links`. The road page's existing hosted Descript cuts should each
get a row so both surfaces (Goods site, EL) reference one governed record instead of loose
URLs. `video_projects.source_descript_url` stays for edit-project provenance (1 row today).

## 3. The tagging matrix (every asset, no exceptions)

| Axis | Where it lives | Vocabulary |
|---|---|---|
| Person | `media_storytellers` (+ `storyteller_media_links` for video) | storyteller records; "none in frame" is a recorded outcome |
| Community | `location_name` + coords | canonical list: Kalgoorlie (Wongatha), Tennant Creek (Warumungu), Palm Island (Bwgcolman), Utopia Homelands, Maningrida, Alice Springs (Arrernte), Mount Isa (Kalkadoon), Katherine |
| Product | `tags`/`media_tags` | the ten tags in §1.5 |
| Time | `created_at` is upload time; the real moment goes in `caption`/`recorded_at` | supply-date months from the register as the reference timeline |

## 4. The content sweep: what the story still needs, staged shot by shot

From the gap analysis (44 public photos clustered on July-2026 Palm Island; one video in the
whole cohort; each ROAD voice has exactly one public photo):

| Stop | Photos to dig from Ben's library | Video to cut (Descript) |
|---|---|---|
| 1 Kalgoorlie, Oct 2024 | first deliveries; Gloria's double at the tent; Boulder camp; the register's own screenshots as last resort | 30-60s: Gloria, the bed, what disappeared |
| 2-3 Tennant Creek | the Aug 2025 168-asset run; Dianne at the machine; loading and unloading | Dianne on the machine with a name |
| 4 Palm Island | the Nov-Dec 2024 summer surge (60 assets); Alfred | Alfred, money-enters-here stop |
| 5 Utopia Homelands | anything: 68 assets, zero media | arrival-is-not-the-ending clip |
| 6 Maningrida | done on the Goods side (7/10 in repo); decide if they also enter EL as governed rows | hosted cut exists; give it a `video_links` row |
| 7 Oonchiumpa | Kristy; imagery thin; Karen only after her consent step | Kristy on ownership |
| Cross-cutting | the press, legs, crates, kits (product tags carry these) | one process film: plastic → press → bed |

Sweep definition of done: every staged folder imported · 0 Goods rows with null
`location_name` · every row person-tagged or marked none-in-frame · every product visible in
at least one tagged public photo · every ROAD stop has at least one public photo and one
`video_links` row · consent evidence referenced on everything person-identifiable.

## 5. Order of work

1. Ben: create the staging tree and start the dig against §4 (day-shift, his library).
2. Me (any session): seed the ten product tags; backfill `location_name` on the existing 198
   from known clusters (Ben confirms each cluster before write); add `video_links` rows for the
   existing Descript cuts once Ben pastes the links.
3. Import batches as folders fill; tag in the same sitting as each import.
4. Re-run the gap query after each batch (it is §4's table as SQL); the sweep is done when the
   definition-of-done list is green.
