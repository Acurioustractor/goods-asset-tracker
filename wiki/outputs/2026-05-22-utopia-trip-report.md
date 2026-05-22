# Utopia Homelands + Alice Springs Trip Report

**Dates:** 21–22 May 2026
**Batch:** GB0-156 (107 Stretch Beds minted 14 May for this trip)
**Total delivered to community:** **36 beds**

---

## Headline numbers

| Metric | Value |
|---|---|
| Beds placed with households this trip | **36** |
| Beds dropped at Utopia Council & Arts Centre for distribution | **51** |
| Beds held in Alice Springs reserve | 20 |
| **Beds physically transferred to community this trip** | **87** |
| Batch 156 — fully allocated (107 of 107) | 100% ✓ |
| Total Goods deployed all-time | **81** placed + **52** allocated = **133** in community |
| Goods physically at Utopia (this trip) | **79** of batch 156 (28 placed + 51 at council) |
| Goods physically at Alice Springs | 28 (8 placed + 20 reserve) |

**Plastic diverted this trip:** 87 beds × 20kg HDPE = **1,740 kg** (1.74 tonnes) of recycled plastic transferred to community.

---

## Day 1 — Wednesday 21 May 2026

### Utopia Homelands (22 beds, photo-logged with GPS)

Two outstation clusters identified from photo GPS:

| Cluster | GPS centroid | Beds | IDs |
|---|---|---|---|
| Outstation A | -22.085, 134.773 | 8 | GB0-156-38, 40, 93, 95, 97, 98, 104, 106 |
| Outstation B | -22.014, 134.846 | 13 | GB0-156-20, 22, 24, 26, 27, 28, 30, 31, 37, 87, 88, 105, 107 |
| In transit (Plenty Hwy) | -22.969, 133.836 | 1 | GB0-156-96 → **Ray Nelson** |

**Workflow:** field team took photos of each bed sticker on install. Photos were AirDropped to laptop, processed via `scripts/batch-install-from-photos.mjs` — QR codes decoded, EXIF GPS + caption pulled, asset records bulk-PATCHed.

### Alice Springs (8 beds caught up)

Field team delivered 8 beds in Alice Springs without QR-photo capture:
- **Mykel** (1 bed)
- 4 young girls (4 beds)
- 3 other young people (3 beds)

The new scan tracker caught 2 of these passively: GB0-156-102 (named "House 3" by recipient) and GB0-156-103 (scanned but no name). Remaining 6 assigned from next-available batch-156 ready inventory: GB0-156-1, 2, 3, 4, 5, 6.

**Recipient name fix-up:** open `https://www.goodsoncountry.com/admin/alice-fill` — one-time wizard with all 8 rows ready.

---

## Day 2 — Thursday 22 May 2026

### Utopia Homelands (6 beds via WhatsApp)

| Bed | Notes |
|---|---|
| GB0-156-10 | QR decoded, no GPS (WhatsApp strips EXIF) |
| GB0-156-12 | QR decoded, no GPS |
| GB0-156-41 | QR decoded, no GPS |
| GB0-156-43 | QR decoded, no GPS |
| GB0-156-59 | QR decoded, no GPS |
| GB0-156-84 | QR decoded, no GPS |

15 photos sent via WhatsApp — 6 had readable QR codes; 9 were scene/contextual shots. WhatsApp strips GPS metadata on upload, so no location data. Recipient names need to be added via `/admin/assets`.

**Future trip:** AirDrop photos to laptop, don't send via WhatsApp — preserves GPS and caption fields.

---

## What still needs to be done

### Recipient names

| Group | Count needing names | Action |
|---|---|---|
| Day 1 Utopia placed (supply 2026-05-21) | 21 of 22 (only Ray Nelson tagged) | Field notes + memory; bulk edit via `/admin/assets` filtered to Utopia + supply_date=2026-05-21 |
| Day 1 Alice Springs (catch-up) | 8 of 8 | One-time wizard at `/admin/alice-fill` |
| Day 2 Utopia placed (supply 2026-05-22) | 6 of 6 | Add via `/admin/assets` |
| **Utopia Council & Arts Centre drop** | **51** | Convert from `allocated` to `deployed` + add recipient as council/arts centre distributes. Update via `/admin/assets` filtered to status=allocated. Each scan from a recipient phone will surface in `/admin/scans` Missed-installs alert — the new system catches them automatically. |
| Alice Springs reserve | n/a (status=ready, no recipients yet) | These will get individual names as Goods staff or partners place them with families. |

### Photos and stories (for Centrecorp impact deck)

- **34 photos from Day 1** (JPG + HEIC, stored under `Goods Beds Utpoia - QR Codes/`)
  - 23 are sticker close-ups (matched to bed IDs)
  - 11 are scene/wide shots (need manual bed-ID matching)
- **15 photos from Day 2** (WhatsApp JPEG, stored under `Goods Beds Utopia day 2 QR code/`)
  - 6 with QR; 9 scene shots
- **Empty**: video, recipient stories, voiceover, Country acknowledgement

**To-do for impact deck:** sort photos into a hero set; capture one short video of an outstation install; gather 2–3 recipient quotes; assemble in deck template.

---

## How tracking improved on this trip (process notes)

| What worked | What broke | Fix shipped |
|---|---|---|
| QR sticker + close-up photo workflow | iPhone 17 Pro HEIC unreadable in browser | "Most Compatible" iOS setting docs; HEIC fallback in install-bulk page |
| Batch process script (`batch-install-from-photos.mjs`) | exifr ESM import had wrong shape | Fixed `default || namespace` import pattern |
| Bulk PATCH apply scripts | Inventory-allocation guessing for un-photographed beds | Catch-up wizard with passive scan-tracker matching |
| New scan tracker (`bed_scans` table) | n/a — caught 2 ghost installs that would have been invisible | "Missed installs" alert on `/admin/scans` now surfaces the pattern automatically |
| Simplified `/bed/[id]` page | Old 3-card layout had 11+ tap targets | Single RecipientCard with 4 primary actions + chooser sheet |

---

## Data sources

- **Asset register**: live at https://www.goodsoncountry.com/admin/assets (filter: community = Utopia Homelands or Alice Springs)
- **Scan analytics**: https://www.goodsoncountry.com/admin/scans
- **Combined trip map (HTML)**: `/tmp/utopia-trip-full-map.html`
- **Per-bed public page**: https://www.goodsoncountry.com/bed/GB0-156-{N}
- **Photo source folders**:
  - `Goods Beds Utpoia - QR Codes/` (Day 1, 34 photos, AirDrop)
  - `Goods Beds Utopia day 2 QR code/` (Day 2, 15 photos, WhatsApp)
- **Batch processing scripts**:
  - `v2/scripts/batch-install-from-photos.mjs` (QR + EXIF)
  - `v2/scripts/apply-utopia-batch.mjs` (Day 1 PATCH)
  - `v2/scripts/apply-alice-batch.mjs` (Alice catch-up)
  - `v2/scripts/apply-utopia-day2.mjs` (Day 2 PATCH)
  - `v2/scripts/build-full-trip-map.mjs` (combined map)

---

## Centrecorp impact deck — what to build from here

Centrecorp funded this batch (per the $208K + $84.7K committed, 109 beds locked for Utopia). This trip delivers **79 of those 109 to Utopia directly** — 28 placed with households, 51 dropped at the Utopia Homelands Council & Arts Centre for community distribution. That's **72% of the Centrecorp Utopia commitment landed in two days.**

Suggested deck structure:

1. **Headline page**: "79 of 109 Centrecorp Utopia beds delivered, 21–22 May 2026"
2. **Map page**: Embed the combined trip map (Outstation A, B, in-transit shot of Ray's bed, council + arts centre as the hub for 51 more)
3. **Photo grid**: 6–8 hero photos — at least one per outstation, one sticker close-up, one wide shot of an installed bed in a room, one of the council/arts centre drop-off
4. **Recipient voice**: Ray Nelson confirmed; add 2–3 more quotes from the trip
5. **Plastic-diverted metric**: **1,740 kg** HDPE transferred to community across 87 beds this trip
6. **What's next**: 30 of the 109 Centrecorp Utopia beds still to come (a future batch). Plus 20 Alice Springs reserve for ad-hoc placements.
7. **Distribution-stage story**: Council & arts centre drop is a new model — Goods delivers to a trusted community institution, who then places with households. Status flows `ready → allocated (council) → deployed (household)`. /admin/scans automatically catches each recipient's first scan and surfaces it on the Missed-installs alert.
8. **Tracking story**: Every bed has a unique QR → public page. Recipients can pulse-rate, request help, or share photos directly. Centrecorp can verify each bed's life ongoing — recipients open the QR, the activity is logged, the metric stays honest beyond delivery day.

---

*Report generated 2026-05-22 from live production data.*
