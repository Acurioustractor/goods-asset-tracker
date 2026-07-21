# Empathy Ledger ⇄ Goods — one aligned system

> How EL and Goods work as one seamless system on one philosophy: EL is the source of truth for people, story, media and consent; Goods references and enriches it, and holds the product/operational world. Written 2026-07-20 after the media-migration sense-check. EL-side scripts + reports live in `empathy-ledger-v2/scripts/` and `empathy-ledger-v2/audit/`; the Goods inventory/mapping in `audit/` here.

## The philosophy (settled)

**Files that are story came from EL, and stay in EL. We do not push copies back.** The sense-check that stopped the file migration was right: almost all storytellers, transcripts, and community/people photos originate in Empathy Ledger. Goods is a downstream consumer, not a second home for that media.

- **EL owns:** storytellers (the 33 in `project_storytellers`), stories, transcripts (601 rows), the media *files*, consent, elder review, cultural sensitivity, and nation attribution. EL is where consent is granted and where a community's authority lives.
- **Goods owns:** the asset register, cost model, deals, the website, product/operational media (bed shots, plant, diagrams — no storyteller, no community owner), and a `media_links` layer that *references* EL media and *enriches* it with what Goods knows.
- **The rule:** tag once, in either place; it aligns. Goods never duplicates EL files. New story content enters through EL's own upload flow, never a raw bulk insert.

## What the migration attempt taught us (so we don't repeat it)

1. **Don't bulk-move files into EL.** Of the 296 "new" items, ~124 were web-processed derivatives of EL originals — uploading them would have duplicated. The only genuine gap is the **May 2026 Utopia trip (172 raw photos)**, which EL does not have (EL holds Aug 2025, Nov 2025, Mar 2026 trips). That trip is a separate, consent-gated decision, via EL's upload flow.
2. **`media_assets` inserts via raw REST fail** — not a trigger hang (that was a misdiagnosis). `nation_or_community` is `text[]`; sending a string returns a 400 `malformed array literal`. The array columns are `nation_or_community, cluster_slugs, cultural_tags, depicted_people_text, detected_people_ids, family_names, requires_consent_from`.
3. **`nation_or_community` is nation-level cultural data**, arrays like `{Bwgcolman,Manbarra}` (Palm Island's nations), not place names. It is community-owned; **never inferred** — set only from EL's verified `communities.country_names`.
4. **Place vs nation are different granularities.** Goods tags at the place level (`tennant-creek`); EL wants nation names. Bridge them with the place-level text field `country_or_place` and EL's `communities` table.

## What is aligned now (2026-07-20)

- **EL storage cleaned:** the 275 orphan blobs from the failed run were deleted (0 remain).
- **Nation/community backfilled on EL Goods media** (only where Goods matched by checksum and EL was null; `goods-align-nation-community.py`):
  - `country_or_place` set on **27** media (Utopia 12, Tennant Creek 9, Alice Springs 3, Palm Island 3) — was 0.
  - `nation_or_community` set on **6** with **verified** nations only (Palm Island `{Bwgcolman,Manbarra}`, Alice Springs `{Mparntwe,Arrernte}`) — was 0.
  - **Left null and flagged for community input, not guessed:** Tennant Creek, Utopia nations.
- **Goods side already consistent:** `media_links` references EL media by `el_media` id; the community/person tags Goods holds are the source of the EL enrichment above.

## Data-quality items surfaced (for the EL owner / Ben)

- **Phantom EL rows — 3 verified in the Goods project** (2026-07-21, hardened scan): `20251107-1E5A5974.jpg` (Shayne Bloomfield's portrait), `Mykel Overlay Bed Delivery.mp4`, `Screenshot 2026-02-13 at 1.44.27 pm.png` (a portrait) — DB rows present, storage object returns 400 (bytes gone). The earlier "6 (incl. Kylie/Dianne audio)" count was pre-verification: a HEAD-only probe false-flagged 3 images that actually exist (unpacking-parts/gary/jason), and any audio phantoms would sit under a different project/org (this scan is Goods-project-scoped, 148 rows). Re-run anytime: `node --env-file=v2/.env.local v2/scripts/el-phantom-rows-report.mjs` → `wiki/outputs/2026-07-21-el-phantom-rows-report.json`. Not healable from the Goods repo; EL owner decides per row: re-upload the file, delete the row, or mark broken. NB: 2 of the 3 are the broken portraits (Shayne + a Screenshot) — re-uploading those files fixes both the phantom AND the portrait gap.
- **`media_assets.community_id` FK — migration STAGED** (not applied): `wiki/outputs/2026-07-21-el-media-community-fk.sql` (idempotent add-column + index + optional dry-run backfill from `country_or_place`, Goods-project scoped). Apply is the EL owner's call.
- **3 misfiled storytellers** — a Goods person filed under Snow Foundation / JusticeHub / Oonchiumpa instead of A Curious Tractor.
- **The org split** — A Curious Tractor (people, 39 storytellers, 1978 media, 18 projects) and Goods on Country (147 media, 0 storytellers) are separate sibling orgs. People live under ACT; photos under Goods. "Community ownership" would mean re-homing to community orgs — an EL governance decision.

## The two-way sync (`npm run sync:el`)

`v2/scripts/sync-goods-el.py` keeps Goods and EL aligned in both directions. Read-only by default; `npm run sync:el:apply` writes.

**Goods → EL** (Goods enriches EL for media that lives in both — 72 EL-referenced Goods `media_links`):
- community tag → EL `country_or_place` (place name) + **verified** nation only (never guessed).
- person tag → crm contact name → EL `project_storyteller` id → `media_storytellers` link. Unresolved people are **skipped, not guessed**, and listed (they're in Goods CRM but not yet EL project storytellers — e.g. Margaret Lloyd, Tanya Turner; adding them is an EL-side create).
- Never uploads a duplicate file. New story *files* enter through EL's own upload flow.

**EL → Goods** (surface new EL content in Goods):
- reports EL Goods media not yet referenced by `media_links` (113/148 — mostly EL-only raw media) and EL project storytellers with no Goods CRM match (5), so Goods can reference them.

Run it after adding/tagging storytellers or photos in Goods; it pushes the enrichment to EL and shows what's newly arrived from EL. First run (2026-07-20) pushed 5 storyteller links; place/nation were already aligned so it was idempotent there.

**Live write-through (built):** `POST /api/admin/media-link` calls `lib/data/el-sync.ts` for the tagged item, so tagging in the Media Room reflects in EL immediately — community → EL `country_or_place` + verified nation (Goods-project media only), person → EL `media_storytellers` link (any EL media the person appears in; crm name → project storyteller, unresolved people skipped not guessed). Best-effort: an EL failure never fails the Goods tag, and the response carries an `elSync` note; `npm run sync:el` reconciles the rest (local media, cross-org place). Verified live: community `synced:true`, person `synced:true` (409 = already-linked).

## Verified EL connection (2026-07-21, confirmed by the EL platform side)

- **Canonical platform URL:** `https://empathyledger.com` (apex). `www.` 307-redirects to apex; `https://empathy-ledger-v2.vercel.app` is the same deployment. **`https://empathy-ledger.vercel.app` (v1) is DEAD** — removed from Goods code fallbacks.
- **Data:** Supabase `yvnuayzslukamizrlhwb` (project ref authoritative); a second ref `tednluwflfhxyucgwigh` is LEGACY, do not use. Goods scope = project_id `6bd47c8a-…` (goods-on-country is a PROJECT, not an org). Reads = anon key; enrichment writes = service key, scoped to Goods-project rows only.
- **Content-hub API:** `{EMPATHY_LEDGER_API_URL}/api/v1/content-hub/…`.
- **Media serve:** `https://empathyledger.com/api/media/{media_asset_id}/file` — serves only `media_assets.visibility='public'`; private assets 403 with no external auth path. The serve route handles the bucket, so the source bucket need NOT be public — only the asset's `visibility` flag. **Never point an avatar at a raw `storage/v1/object/…` URL** (that is exactly Shayne's break).
- **Storyteller avatar:** the column is `storytellers.public_avatar_url` (a URL; `profile_image_url` is a computed API field). Best value = a relative `/api/media/{id}/file` for a `visibility='public'` asset. **Set it in the EL admin UI** (`/admin/storytellers/{id}/edit`) or via `PATCH /api/admin/storytellers/{id}` (`avatar_url`) — but that route needs an admin SESSION COOKIE, not an API key, so for Goods it is **UI-only**. **Goods must NOT write `public_avatar_url`** (choosing who represents a person is a consent/representation call gated in the EL platform). Goods' sync/enrichment writes place/nation/`media_storytellers` only — verified it never touches the avatar.

## The seamless flow (target, mostly in place)

1. A photo of a person/community lives in **EL** (uploaded via EL, consent-governed).
2. **Goods** references it in `media_links` (`el_media` + the EL id) and reads it back on community/product/atlas pages, resolving consent from EL.
3. When Goods learns something EL is missing (which community a photo shows), Goods **enriches** EL (`country_or_place`, verified `nation_or_community`, storyteller links) — never re-authoring consent, never guessing a nation.
4. Product/brand media stays local in Goods.

## Next to make it fully seamless (EL-side, not Goods code)

1. A real `media_assets.community_id` FK to `communities.id` (place-level relational link vs today's text field).
2. Community-admin login/roles so a community governs its own story (the fields exist: `default_visibility`, `consent_granted_by`, `requires_consent_from`).
3. Community-verified nation names for Tennant Creek, Utopia and the rest.
4. A decision on the May-2026 Utopia trip (the one genuine content gap).

## How to test

- **EL platform:** run the EL dev server (`:3030`), open `/organisations/c312323e-02d4-493c-8b5f-9f9b15e2b46a` → photo-manager should now show places (Utopia, Tennant Creek, Alice Springs, Palm Island) and the Palm Island / Alice Springs nations on the Goods media.
- **Goods:** run `cd v2 && npm run dev` (`:3000`), open a community or product page — media resolves from `media_links`, including `el_media` items via the EL proxy.
- **Audit anytime:** `cd v2 && npm run audit:model` (0 misalignments); the EL-side reports are in `empathy-ledger-v2/audit/` (collision, migration-plan, nation-community-alignment).
