---
title: Asset Register — May 2026 Alice + Utopia Trip Readiness
date: 2026-05-14
status: live
audience: Ben, Nic, field team
---

# Asset Register — Trip Readiness (107 Stretch Beds, week of 2026-05-19)

## Where we stand (Supabase `public.assets`, 561 records)

| Product         | Deployed | Other states                                                      |
|-----------------|---------:|-------------------------------------------------------------------|
| Basket Bed      |      363 | (archived product, all deployed)                                  |
| Stretch Bed     |       45 | + 3 demo, 1 allocated (Lutijuliu), 1 requested (Centrecorp 108), **107 ready (Batch 156)** |
| Washing Machine |       38 | + 3 under investigation (Palm Island orphans, no qr_url)          |

QR coverage: **558 / 561 have a `qr_url`.** The 3 gaps are the Palm Island washing-machine orphans flagged in `fleet-connectivity-audit-may-2026.md`.

## Where the deployed fleet is now

- **Stretch Bed (45 deployed):** Tennant Creek 29 · Utopia 8 · Alice 7 · Canberra 1
- **Basket Bed (363 deployed):** Palm Island 131 · Tennant Creek 130 · Utopia 60 · Kalgoorlie 20 · Maningrida 18 · Mount Isa 2 · Alice 1 · Darwin 1
- **Washing Machines (38 deployed):** Tennant Creek 22 · Palm Island 10 · Maningrida 6

## Batch GB0-156 — the 107 for next week's trip

- IDs `GB0-156-1` to `GB0-156-107`
- Status `ready` · community `Pending Delivery` (update each in-field as it lands)
- QR URL pattern: `https://www.goodsoncountry.com/bed/GB0-156-{n}`
- All 107 rows live in Supabase, all `Stretch Bed`, all `ready`

### Artefacts on disk

```
data/new_beds/batch_156/
  manifest.csv          # 107 rows, all fields
  qr_png/qr_GB0-156-*.png  # 1024px PNG per bed (high error correction for fabric)
  print_sheet.pdf       # A4 landscape, 6 stickers/page, 18 pages total
```

Regenerate any of the above with `python3 scripts/generate_batch_156.py` (idempotent — re-running upserts on `unique_id`).

## New tooling

- **/admin/assets** — filterable register: KPIs · pipeline-by-status · per-row links to the public `/bed/[id]` page and the QR URL. Filter by product, status, community, batch, or text.
- **Downloads served straight from the admin page:**
  - `/api/admin/assets/batch/156/manifest` -> CSV
  - `/api/admin/assets/batch/156/print` -> 18-page PDF

## In-field workflow for the trip

1. Pull a sticker, slap it on the bed base before it leaves the van.
2. Scan the QR with phone -> lands on `goodsoncountry.com/bed/GB0-156-N`.
3. (Optional, next iteration) field-update form on `/admin/assets` lets the driver write `community`, `name`, `place`, `gps` from the scanner page.
4. On return: bulk-update the unallocated rows -> `status=deployed` and assign the correct community.

## Open follow-ups

- Build the in-field "claim/assign" form so drivers can edit `community`/`name` from the QR landing page (the `/bed/[id]` page is read-only today).
- Reconcile the 3 Palm Island washing-machine orphans (`GB0-WM-ORPHAN-*`) — these have no `qr_url` and `status=under_investigation`; either retire or merge them with a real Particle coreid.
- Push a one-row Notion summary into the Goods Cockpit on next sync (this doc is the source — re-run `sync-goods-wiki-to-notion.mjs --file wiki/outputs/2026-05-14-asset-register-trip-readiness.md` to publish).
