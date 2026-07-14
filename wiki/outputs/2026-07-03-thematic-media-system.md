# Thematic Media System for Goods on Country

**Date:** 2026-07-03
**Owner:** Ben (with Claude)
**Purpose:** One canonical way to organise every Goods photo, video and overlay by theme, bind each theme to the investment point and story beat it must prove, pin an always-available canon video per theme, and name exactly what we still need to shoot.

**Voice rules applied:** zero em dashes, no arrows in prose, straight quotes, "On Country" capitalised, units without a space (20kg), "designed in community" not the banned term.

**Source maps synthesised:** the media inventory (36 videos in `content_items`), the canon slot taxonomy (`design/canon-slots.json`, `design/image-canon.json`, `design/canon-resolved.json`), the 10 main thematics (from `impact-model.ts`, `content.ts`, `curated-quotes.ts`, `COMPENDIUM_MARCH_2026.md`), the 12-point QBE investment spine (from `content.ts` L591-748 and the investor-asset-alignment doc), and the linear story arc (from `v2/src/app/story/page.tsx` and `v2/src/lib/data/trip-stories.ts`).

---

## 1. The canonical MAIN THEMATICS taxonomy

Ten low-overlap themes. Every media item carries one primary theme. Place (community) and voice (storyteller) work as companion facets, not extra primary themes. Two brand-voice constraints ride with every tag: zero em dashes anywhere, and the scabies-to-RHD pathway is a "why" only, never a claimed health outcome (the `impact-model.ts` claim ceiling).

| # | Theme | What it holds |
|---|-------|---------------|
| 1 | **The Product** | The Stretch Bed and the wider range (Pakkimjalki Kari washing machine, fridge concept, archived Basket Bed). Hero shots, detail, X-trestle assembly, no-tools setup. |
| 2 | **Plastic to Plant** | The circular material loop. Community-collected HDPE shredded, pelletised and pressed into bed components. Waste diverted On Country. |
| 3 | **On-Country Manufacturing** | The making located On Country. The container production plant, CNC cutting, assembly and QC, and the circuit deployment model. |
| 4 | **Rest & Health** | Beds and washing machines as health hardware, not furniture. Off-the-ground washable sleep and clean bedding as the scabies-to-RHD why (a why only). |
| 5 | **Dignity, Safety & Belonging** | A bed as safety, belonging and dignity. Overcrowding, cultural gatherings, family. Framed as a need, not charity. |
| 6 | **Community-Led Design & Self-Determination** | Designed in community with the people who use it, from naming and testing through to who holds the story and the data. "Never been asked" becomes "named it and built it." |
| 7 | **Jobs & Community Ownership** | Real paid jobs On Country, young people building the product, and the arc toward community-owned enterprise. "Our job is to become unnecessary." |
| 8 | **The Freight Tax & Cost Curve** | The economics through-line. The remoteness freight premium that makes goods unaffordable, and the cost-down as production in-sources On Country. |
| 9 | **Storytellers & Voices** | Consent-cleared portraits, interviews and quotes. The faces and voices of community members, Elders, health workers and funders. |
| 10 | **Communities & Country** | Place-based media grouped by community and Country (Palm Island, Tennant Creek, Utopia, Katherine, Groote) and the surrounding landscape. |

---

## 2. Theme to investment, story, canon media and overlay

Each theme is bound to the investment point it proves (with whether we already have the asset), the story beat it carries, the canon image slot(s) and canon video slot that should represent it, and the overlay that showcases it. Canon slot keys come from `design/canon-slots.json` (all 40 slots are filled). Video slot resolution is from `design/canon-resolved.json`.

| Theme | Investment point it proves (have asset?) | Story beat | Canon IMAGE slot(s) | Canon VIDEO slot (current resolution) | Overlay that showcases it |
|-------|-------------------------------------------|-----------|---------------------|----------------------------------------|----------------------------|
| **1. The Product** | Flagship product stands up: X-trestle tension, ~5 min no tools, 200kg, 10+ yr life (HAVE) | "The Product, the Stretch Bed" | `product-hero`, `product-in-use`, `product-anatomy` (ill), `assembly-sequence` (ill), `kids-building` | `video-build` then `stretch-bed-desktop.mp4` / `stretch-bed/assembly.mp4` (local exist) | Assembly timelapse overlay, "a bed in the time it takes to drink a cup of tea" (TO MAKE) |
| **2. Plastic to Plant** | Plastic-to-product loop: 20kg HDPE diverted per bed, collected and pressed On Country (HAVE) | "The Build, on-Country recycling plant" | `plastic-feedstock`, `pressed-sheets`, `shredder`, `plastic-loop` (ill) | `video-plant` then `recycling-plant-desktop.mp4` (LOCAL, pinned, the working model) | Shred, press, cut process overlay over the plant background (TO MAKE) |
| **3. On-Country Manufacturing** | Production plant real and largely paid: $110,046 press capex, ~30 beds/week, mobile two-container system (HAVE); also the SEFA loan-servicing asset | "The Build in practice, young people make the beds (Alice, Oonchiumpa)" | `plant-hero`, `plant-panorama`, `plant-the-one-move` | `video-plant` (`recycling-plant-desktop.mp4`) plus `building-together-desktop.mp4` for on-Country assembly | Alice-build overlays, "the boys/girls, building" (TO MAKE; EL tags `cohort:boys\|girls` + `use:assembly` + `event:alice-build`) |
| **4. Rest & Health** | Multi-product platform: same facility produces washing machines, Pakkimjalki Kari, named by Elder Dianne Stokes (GAP) | "The Cascade, why a washing machine is a health intervention" plus "Pakkimjalki Kari washing machine" | `washing-machine` (photo) | NONE (no washing-machine video exists); interim fall back to `video-community` | Six-step cascade line-art overlay, claim-ceiling safe (TO MAKE, goods-illustrations brand line) |
| **5. Dignity, Safety & Belonging** | Proof of delivery at scale: beds in use, a warm face-clear human hero (GAP on the human hero); demand pull de-risks it | "Before / After, the change is the point" plus "Sitting with Elders, Frankie Holmes OAM and Donald Thompson OAM" | `community-delivery`, `listening-first` | `video-testimony` (Jaquilane blocked, see note) or `utopia-community-setup.mp4` | Matched before/after overlay (floor mattress then same person on bed) plus Elder-on-bed overlay (TO MAKE) |
| **6. Community-Led Design & Self-Determination** | Locally led governance: Oonchiumpa (100% Aboriginal-owned) lead partner, PICC delivering, 51% ownership path under review (GAP on the imagery) | "The connectors, local teams lead the deliveries (Fred and Decon)" | `listening-first`, `community-ownership` (ill), `area-07-governance` (ill), `area-09-ownership` (ill) | `video-community` (`community-desktop.mp4`) plus `karen-liddle-on-beds.mp4` (verify consent) | Design-in-community, around-the-fire overlay, plus driving-drone connectors overlay (TO MAKE) |
| **7. Jobs & Community Ownership** | Community ownership is the endgame: plant built to transfer, "our job is to become unnecessary." The recoverable-grant thesis (GAP) | "The Model, commerce not charity, the ownership handover" | `community-ownership` (ill), `kids-building`, `area-09-ownership` (ill) | `video-build` then `building-together-desktop.mp4`; `mykel-building-the-bed.mp4` (Mykel cleared) | Ownership-handover overlay, local operators running the plant (TO MAKE, the single highest-value ownership asset) |
| **8. The Freight Tax & Cost Curve** | Unit economics work: cost per bed ~$685 to ~$426 to ~$421, break-even ~338 beds/yr (charts HAVE); THE ASK ($400K by 31 Aug, 1:1 match) has no motion piece (GAP) | "The Problem, freight tax" plus "Impact, this is working" | `cost-curve`, `breakeven`, `sankey`, `where-750` (charts), `map` for freight distance | `utopia-delivery-road.mp4` (remoteness proof); no data-motion video exists | THE ASK match-progress overlay, "$0 of $400K, weeks remaining," ideally a live countdown (TO MAKE, highest investment-value overlay) |
| **9. Storytellers & Voices** | Real unmet demand pull: a named consent-cleared community member with their bed, short to-camera testimony (GAP) | "The Voice, Norman Frank names the need" plus "Community Voices, what the beds mean" | `storyteller-mykel`, `storyteller-linda-turner`, `storyteller-alfred-johnson`, `storyteller-norman-frank` (all RED) | `video-testimony` (Jaquilane blocked, see note) | `jaquilane-overlay` (HAVE, consent-blocked) plus per-voice to-camera overlays: Norman Frank, Cliff Plummer, Alfred Johnson (TO MAKE) |
| **10. Communities & Country** | Proof of delivery at scale: 496 beds across 9 communities, every unit QR-tracked (HAVE, map/chart) | "Impact, this is working (live map)" plus "From town to the homelands (region map)" | `map` (chart), `community-delivery` | `video-community` (`community-desktop.mp4`) plus `utopia-delivery-road.mp4` | Region-map plus driving-drone overlay, the truck on the Sandover road (TO MAKE) |

**Consent note carried through the table:** `jaquilane-testimony.mp4` and `jaquilane-overlay-desktop.mp4` are the only testimony and only overlay assets we hold, and there is a live conflict in the source maps. The inventory map says Jaquilane is NOT consent-cleared and the clip is wired LIVE on `/story` (an active consent risk, pull or clear). The canon map records the file as "consent CLEARED 2026-07-03." Resolve this conflict before any further use. Treat as blocked until a single source of truth confirms clearance.

---

## 3. The "canon video" concept, always-available per theme

**The premise correction:** canon is already NOT image-only. `type: "video"` is a first-class media type in `design/canon-slots.json` alongside photo, illustration, chart and logo. There is a dedicated "Video" group with five slots (`video-hero`, `video-build`, `video-testimony`, `video-plant`, `video-community`), and all five are filled. In the index layer, `content_items.canon_slot` already exists on video rows and `media_type` is set to `video` (verified in `v2/scripts/content-index.mjs`, PASS 2 crawls `public/video/**` with checksum identity and maps `canon_slot` by checksum then url).

**The real gap (always-available):** of the five video slots, only `video-plant` resolves to a pinned LOCAL file (`v2/public/video/recycling-plant-desktop.mp4`). The other four (`video-hero`, `video-build`, `video-testimony`, `video-community`) resolve to REMOTE Empathy Ledger URLs (source `el-pick`). Remote picks are not always-available: they break if EL is down or a consent flag flips, and `canon.ts` records that EL has 0 published stories. Note `video-hero` even has a local seed (`hero-desktop.mp4`), but the EL pick overrides it because resolver precedence #2 (EL pick) beats #3 (seed).

**Resolver precedence** (from `v2/scripts/canon-resolve.mjs`), per slot:
1. Local entry in `design/image-canon.json` tagged with the slot key. Source `local`.
2. EL pick in `v2/data/canon-el-picks.json`. Source `el-pick` (remote empathyledger.com URL).
3. Slot `seed`.
4. Empty.

**How to pin an always-available canon video per theme:** add an entry to `design/image-canon.json` with the slot key plus a local `canonicalPath` under `v2/public/video/**`, then re-run `canon-resolve.mjs`. Precedence #1 (local) beats the EL pick, so the slot pins to the local file. All five intended local files already exist on disk (verified in the canon map): `hero-desktop.mp4`, `mykel-building-the-bed.mp4`, `jaquilane-testimony.mp4` (RED, clearance in conflict), `recycling-plant-desktop.mp4` (already pinned) and `community-desktop.mp4`. Pinning is purely adding `image-canon.json` entries. No assets are missing.

**Recommended pins** (copy the `video-plant` model to the other four):

| Slot | Pin to local file | Theme it serves | Consent |
|------|-------------------|-----------------|---------|
| `video-plant` | `recycling-plant-desktop.mp4` (already pinned) | Plastic to Plant, On-Country Manufacturing | Public, no faces |
| `video-hero` | `hero-desktop.mp4` (seed exists, EL currently overrides) | brand cover, cross-theme | Public |
| `video-community` | `community-desktop.mp4` | Communities & Country, Self-Determination | Verify, community ambience |
| `video-build` | `building-together-desktop.mp4` | Jobs & Community Ownership, The Product | Verify |
| `video-testimony` | `jaquilane-testimony.mp4` | Storytellers & Voices | BLOCKED until consent conflict resolved; do not pin yet |

**How the thematic system indexes videos (not `media.ts`):** `media.ts` manages images only. It holds no video entries (all `processVideo` slots are undefined) and site videos are referenced by direct `/video/` path via the Hero component `videoSrc` prop. So a thematic system must index videos itself through `content_items` (canon_slot, media_type, media_subtype, tags), which the indexer already does. Do not route videos through `media.ts`.

---

## 4. GAP LIST, the videos and overlays we still need to shoot

This is the key deliverable: what other videos we need, by theme, prioritised. HIGH means it blocks a funder-facing investment point or the emotional heart of the story. The pattern from the inventory: supply-side arguments (plant, plastic loop, product, cost curve) are well covered by consent-safe no-face and chart assets. The demand-side and ownership-side arguments, the emotional heart, are the gaps.

**HIGH priority (blocks the pitch or the story heart)**

1. **Storytellers & Voices, plus cross-cutting consent.** No consent-cleared, face-clear human hero exists. `community-testing-bed-golden-hour.jpg` is the number-one unlock, blocked only by consent. Clear it. Also resolve the `jaquilane` consent conflict, and clear the 22 EL videos (all currently RED, none carry consentObtained plus elderApproved), which unlocks 22 of the 36 videos and the only overlay. NEED: consent clearance sweep, then short to-camera testimonies from Norman Frank, Cliff Plummer and Alfred Johnson.
2. **Jobs & Community Ownership.** No photograph or video of the community-ownership handover exists, only a chart, despite it being the core of the recoverable-grant thesis. NEED: a real handover or local-operators-running-the-plant clip.
3. **Rest & Health.** The washing machine (Pakkimjalki Kari, 16 in community) has photos in `media.ts` but zero video, so a whole product line is video-dark and the multi-product investment point is unproven. NEED: a washing-machine-in-use clip plus a Dianne Stokes on-camera clip (she named it).
4. **The Freight Tax & Cost Curve.** THE ASK, the single most persuasive frame ($400K by 31 Aug, 1:1 match), has no motion piece and no live countdown. NEED: a short motion piece stating the ask and the match, and a match-progress overlay ($0 of $400K, weeks remaining). Re-verify the four finance charts to the current $475K / SEFA $300K spine before use.
5. **Dignity, Safety & Belonging.** No matched before/after asset exists (floor mattress, then the same person on a Stretch Bed, same room, same morning), the single visual that makes the case fastest. NEED: a matched before/after video or overlay pair.
6. **Overlay library (cross-cutting).** Only one overlay is tagged (`jaquilane-overlay`) and it is consent-blocked, so the system has effectively zero usable overlay layers to composite over background footage. NEED: build a reusable overlay set (see section 5).

**MEDIUM priority (deepens a theme, background often already exists)**

7. **Plastic to Plant.** The `recycling-plant-desktop.mp4` background exists but there is no overlay layer. NEED: a shred, press, cut process overlay to composite over it.
8. **On-Country Manufacturing.** NEED: the Alice-build overlays ("the boys/girls, building," EL tags `cohort:boys|girls` + `use:assembly` + `event:alice-build`) and a CNC/press process reel.
9. **The Product.** NEED: an assembly timelapse overlay ("a bed in the time it takes to drink a cup of tea") and a mobile variant of `stretch-bed/assembly.mp4` (it currently has desktop plus poster only).
10. **Community-Led Design & Self-Determination.** NEED: design-in-community around-the-fire footage with Elders and partners, plus the Fred and Decon connectors clip and a driving-drone shot. Verify Karen Liddle named-clearance before funder use.
11. **Communities & Country.** NEED: a representative clip per community for the per-community cards, a region/road drone shot for the Sandover road, and the interactive live deployment map wired from the assets table.

**Verification gates on existing partner clips (before funder or public use)**

12. Centrecorp/Utopia clips (`utopia-bed-building`, `utopia-community-setup`, `utopia-delivery-road`, `utopia-good-news-full`) and Oonchiumpa clips (`karen-liddle-on-beds`, `mykel-building-the-bed`) are field-authentic and high-value, but named-person and Elder clearance (Karen Liddle, the Utopia footage) was not confirmable from the inventory. Verify each before funder or public use. Mykel is cleared per memory. Ampilatwatja Elder full names to confirm before crediting by name.

---

## 5. OVERLAY inventory

**What we have today (1, unusable):**

- `jaquilane-overlay-desktop.mp4` (plus `jaquilane-overlay-mobile.mp4` and `jaquilane-poster.jpg`). This is the ONLY overlay tagged in `content_items` (media_subtype `overlay`). It is consent-blocked: Jaquilane clearance is in conflict across the source maps. Effectively zero usable overlays exist today.

**Overlays to make (mapped to the themes they showcase):**

| Overlay to make | Theme | Priority | Notes |
|-----------------|-------|----------|-------|
| THE ASK match-progress, "$0 of $400K, weeks remaining," live countdown | The Freight Tax & Cost Curve | HIGH | Highest investment value, the ask has no motion asset |
| Community-ownership handover, local operators running the plant | Jobs & Community Ownership | HIGH | Core recoverable-grant thesis, no asset exists |
| Matched before/after, floor mattress then same person on the bed | Dignity, Safety & Belonging | HIGH | The fastest case-maker |
| Per-voice to-camera testimony overlays (Norman Frank, Cliff Plummer, Alfred Johnson) | Storytellers & Voices | HIGH | Consent-cleared voices only |
| Six-step scabies-to-RHD cascade, brand line-art, claim-ceiling safe | Rest & Health | HIGH | Replaces the current CSS box-and-arrow, goods-illustrations line |
| Shred, press, cut process overlay over the plant background | Plastic to Plant | MEDIUM | Background exists, overlay missing |
| Alice-build overlays, "the boys/girls, building" | On-Country Manufacturing | MEDIUM | EL tag placeholders already scaffolded |
| Assembly timelapse, "a bed in a cup of tea" | The Product | MEDIUM | |
| Design-in-community around-the-fire, plus driving-drone connectors | Community-Led Design & Self-Determination | MEDIUM | Verify named-person clearance |
| Region-map plus driving-drone, the truck on the Sandover road | Communities & Country | MEDIUM | |

**Convention:** tag overlays with `media_subtype = "overlay"` in `content_items` (the `jaquilane-overlay` row already uses this). Distinguish layer roles with `media_subtype` values: `overlay`, `background`, `testimony`, `how-to`. This keeps overlays queryable without a new column.

---

## 6. BUILD PLAN for the admin UI

Reuse the existing `content_items` table and the existing admin surface at `v2/src/app/admin/media-library/`. No new tables. The columns already present cover the whole system: `canon_slot`, `media_type`, `media_subtype`, `tags`, `consent_tier`, `starred`, `rating`, `archived_at`, `community_id`, `storyteller_id` (verified in `curation.ts` and `content-index.mjs`).

**Where "theme" lives (no schema change):** store theme as a reserved tag, `theme:<id>` (for example `theme:plastic-to-plant`), in the existing `tags[]` array. Seed a static `THEMES` map in code that also links each canon-slot group to its theme, so the indexer can auto-suggest a theme from an item's `canon_slot` and the UI can offer one-click tagging. Overlays are already distinguished by `media_subtype = "overlay"`, so no new field is needed there either.

**Three UI pieces, all extending the current media-library page:**

1. **Thematic view.** Group tiles by theme (from the `theme:*` tag, falling back to the canon-slot group). Filters: `media_type = video`, `media_subtype = overlay`, `consent_tier`, and starred/rating. This is the "browse the library by theme" surface.
2. **Canon-video pins.** A control on each video tile to pin a local video to a video slot. On pin, it writes the `image-canon.json` entry (or calls `canon-assign.mjs`) and sets `canon_slot` on the `content_items` row, then the operator re-runs `canon-resolve.mjs`. Each of the five video slots shows a badge: LOCAL (always-available, green) or EL-REMOTE (amber, breaks if EL is down). `video-plant` is the reference implementation.
3. **Gap dashboard.** A per-theme matrix of three cells: canon image present, canon video pinned local, overlay present (red, amber, green), read straight from `content_items` (canon_slot set, media_type, media_subtype = overlay, consent_tier). This surfaces "what to shoot" and is the operational face of the gap list in section 4.

**Scripts:** reuse `canon-assign.mjs` (write winner) and `canon-resolve.mjs` (resolve slots), and `content-index.mjs` (already maps `canon_slot` and preserves curation). Add at most a thin wrapper, `content:pin-video`, if pinning a video through `canon-assign.mjs` needs a video-specific path. No new pipeline.

**Guardrails to keep:** the indexer already never overwrites star/rating/archive/tags on local rows and refreshes only crawl columns; EL rows refresh consent_tier/url/poster/tags/title but preserve curation. Keep the consent gate hard: no funder-facing or public use of any item whose `consent_tier` is not cleared, and hold the `jaquilane` assets until the clearance conflict is resolved.

---

## Summary

The 10-theme taxonomy is stable and each theme is now bound to the investment point it proves, the story beat it carries, and the canon image, canon video and overlay that should represent it. Canon already supports video as a first-class media type with five slots, but only `video-plant` is pinned to an always-available local file. Pinning the other four is purely a matter of adding local entries to `design/image-canon.json` (all files exist). The supply-side story (plant, plastic loop, product, charts) is well covered. The gaps are the demand-side and ownership-side heart of the pitch: no consent-cleared human hero, no ownership-handover asset, no washing-machine video, no motion piece for THE ASK, no matched before/after, and effectively zero usable overlays. Consent clearance (the human hero, the Jaquilane conflict, the 22 RED EL videos) is the single largest unlock. The admin UI can deliver a thematic view, canon-video pins and a gap dashboard entirely on the existing `content_items` table with no new tables.
