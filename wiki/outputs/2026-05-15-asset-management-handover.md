# Asset Management — Handover (2026-05-15)

Resume entry for the asset-register / fleet workstream. Picks up after the
washing-machine reconciliation (2026-05-14) and the GB0-156 sticker design pass.

---

## TL;DR — What's done, what's next

**Done**
- 41 active asset rows in `assets` + 107-row batch GB0-156 staged ready
- Per-machine reconciliation locked in: 4 confirmed-active telemetry IDs, 18 Speed Queen units bought from Xero, 28 deployed register rows, orphans/phantoms tagged
- Admin UI live at `/admin/assets`: filterable table, per-asset edit page, telemetry dot, hidden-by-default retired rows
- Edit API at `PATCH /api/admin/assets/{unique_id}` with whitelist
- `/bed/{id}` made product-aware (renders Stretch Bed OR Pakkimjalki Kari)
- **GB0-156 sticker pack ready for ePrint**: 60×60mm cream-branded vinyl kiss-cut, 107 unique variations, print-ready PDF + CSV manifest + order brief

**Open / next**
1. Place the ePrint order (Step-by-step below)
2. Get the printed stickers to Alice and apply to the 107 HDPE bed legs as they go out
3. Update the 107 `GB0-156-*` register rows in-field: community + place + status `ready → deployed`
4. Bring telemetry orphans (`GB0-WM-ORPHAN-*`) to physical reconciliation — speak with Nic
5. Fleet rollup cron is wired; verify it ticks daily and surfaces stale machines in the dashboard

---

## ePrint order — exact alignment

Upload: `data/new_beds/batch_156/Goods_Batch156_ePrint_VariableData.pdf`
(currently the **cream / 60mm** variant — the recommended one)

| ePrint field | Value |
|---|---|
| Product | QR Code Table Stickers (Vinyl) |
| Width | **60** mm |
| Height | **60** mm |
| Quantity | **107** |
| Variations | **107** (each sticker unique) |
| Vinyl Stock | Polymeric Vinyl - Standard |
| Print Process | 8 COLOUR UV INKS |
| Laminating | No |
| Shape | Rectangle |
| Cut & Supply | Kiss-Cut Individually (Easy Peel) |
| Weeding | No |
| Make file Print Ready | No - File is correct size |
| Production Time | 5 Days (or your choice) |

If their VDP flow asks for a dataset alongside the PDF, also attach:
`data/new_beds/batch_156/Goods_Batch156_ePrint_dataset.csv`

To rerun at a different size or restyle, the script supports flags:

```bash
python3 scripts/generate_batch_eprint_variable.py --style cream    --size 60   # current
python3 scripts/generate_batch_eprint_variable.py --style cream    --size 50
python3 scripts/generate_batch_eprint_variable.py --style charcoal --size 60
python3 scripts/generate_batch_eprint_variable.py --style pink     --size 60
```

Output filenames:
- `Goods_Batch156_ePrint_VariableData.pdf` (cream / default)
- `Goods_Batch156_ePrint_VariableData_charcoal.pdf`
- `Goods_Batch156_ePrint_VariableData_pink.pdf`

Cream uses the real Goods palette (Cream / Sage / Rust / Charcoal from
`v2/src/lib/data/content.ts:1138`). Times-Bold serif "Goods." wordmark,
rust accent rule, charcoal asset ID tracked in caps, tiny
`goodsoncountry.com` footer.

---

## The asset register today

### Counts (post 2026-05-14 reconciliation)
- **Active rows:** 41 (excluding retired)
- **Stretch Beds deployed:** ~28 across communities + 107 staged `status=ready, community='Pending Delivery'` for batch GB0-156
- **Washing machines deployed:** 28 register rows
- **Telemetry-confirmed live machines:** 4 (Norman, Nicole, Dianne Stokes/Red Dust, Barkley Arts)
- **Orphans:** 3 coreids deployed but unmapped (`GB0-WM-ORPHAN-c4b9`, `-fe6c`, `-689f`)
- **Phantoms retired:** GB0-138 (dup of GB0-147), GB0-143-1/2 (never existed)

### Where things live
- **Admin UI:** `/admin/assets` (filter, search, telemetry dot, click ID → edit)
- **Edit form:** `/admin/assets/{unique_id}` (community, place, status, partner, gps, append-only notes)
- **Edit API:** `PATCH /api/admin/assets/{unique_id}` — whitelist: name, community, place, status, notes, partner_name, gps
- **Telemetry mapping:** `v2/src/app/admin/assets/page.tsx` const `TELEMETRY_TO_ASSET`
- **Bed/machine landing:** `/bed/{id}` — auto-detects product type from `assets.product`

### Adding telemetry mappings
When a new coreid surfaces or an orphan gets reconciled, edit
`TELEMETRY_TO_ASSET` in `v2/src/app/admin/assets/page.tsx`. Map both:
- The Particle coreid (`e00fce68...`)
- Any human-named device label from the legacy Openfields pipeline

---

## Generating future batches

`scripts/generate_batch_156.py` is the canonical template. Idempotent — inserts
into `assets`, generates 1024px QR PNGs, lays out an A4 print sheet. Copy it
and swap the batch constants:

```python
BATCH = "157"
COUNT = 50  # however many beds
STATUS = "ready"
COMMUNITY = "Pending Delivery"   # NOT NULL constraint — see assets_table_constraints.md
```

For the ePrint variable-data sheet, just rerun:

```bash
python3 scripts/generate_batch_eprint_variable.py --batch 157 --count 50 --size 60
```

Outputs land in `data/new_beds/batch_157/`. Auto-detects the `qr_png/`
folder produced by `generate_batch_157.py`.

---

## Talking to Nic (still pending)

The "talk to Nic" doc is at:
`wiki/outputs/2026-05-14-washing-machine-talk-to-nic.md`

Headlines to lock with him:
1. Confirm the 3 orphan coreids → physical machines (which community, which house)
2. Confirm the 4 BHAC re-skins (re-stickered existing units, not new buys)
3. Confirm the Dec 15 2025 Speed Queen Laundry invoice was tagged ACT-FM
   (washing-machine fleet maint) not ACT-GD (Goods on Country) — needs Xero retag
4. Confirm GB0-154 batch (5 units) is what went out on the TC Bush Camp trip
   in Dec 2025 (Simon-led)
5. Sign off on the retirement list (GB0-138 dup, GB0-143-1/2 phantoms)

---

## Source-of-truth docs (wiki/outputs/, dated 2026-05-14)

- `asset-register-trip-readiness.md` — pre-trip readiness audit
- `washing-machine-reconciliation.md` — Xero vs telemetry vs register cross-check
- `washing-machine-master-ledger.md` — physical units + buyer/recipient/date
- `washing-machine-full-history.md` — narrative of every machine that ever shipped
- `washing-machine-roll-call.md` — locked-in confirmed-deployed list
- `washing-machine-final-reconciliation.md` — final tallies with provenance
- `washing-machine-talk-to-nic.md` — questions for Nic to close gaps
- `washing-machine-master-listing.md` — regenerable, run `scripts/build_wm_master_listing.py`

---

## Quick resume commands

```bash
# Verify register state
cd v2 && npm run dev
# then open http://localhost:3000/admin/assets

# Regenerate the master listing wiki doc
python3 scripts/build_wm_master_listing.py

# Regenerate stickers (after any design or size change)
python3 scripts/generate_batch_eprint_variable.py --style cream --size 60

# Mint a new bed batch
cp scripts/generate_batch_156.py scripts/generate_batch_NEW.py
# edit BATCH, COUNT, COMMUNITY, then:
python3 scripts/generate_batch_NEW.py
```

---

## Files changed in this session (not yet committed)

Modified:
- `v2/src/app/admin/admin-sidebar.tsx` (scrollbar hide)
- `v2/src/app/admin/layout.tsx` (full-width fix, overflow-x-hidden)
- `v2/src/app/bed/[id]/page.tsx` (product-aware: bed OR washing machine)
- `v2/src/app/globals.css` (`.admin-sidebar-scroll` class)

New (untracked):
- `v2/src/app/admin/assets/` (page.tsx, asset-table.tsx, [unique_id]/*)
- `v2/src/app/api/admin/assets/[unique_id]/route.ts` (PATCH)
- `scripts/generate_batch_156.py`
- `scripts/generate_batch_eprint_variable.py`
- `scripts/generate_batch_leg_stickers.py`
- `scripts/generate_batch_dtf_gangsheet.py`
- `scripts/build_wm_master_listing.py`
- `data/new_beds/batch_156/*` (PDFs, CSV, brief, QR PNGs)
- `wiki/outputs/2026-05-14-*` (7 docs)
- `wiki/outputs/2026-05-15-asset-management-handover.md` (this file)

When ready to commit, suggested message:

> feat(assets): admin register UI + GB0-156 sticker pack
>
> - /admin/assets filterable table with telemetry dot + per-asset edit
> - /bed/{id} product-aware (bed or washing machine)
> - 107 GB0-156 Stretch Bed batch + ePrint-ready variable-data sticker pack
> - Washing-machine reconciliation: 28 deployed register rows, 4 telemetry-live,
>   orphans + phantoms tagged

Don't push without explicit go-ahead.
