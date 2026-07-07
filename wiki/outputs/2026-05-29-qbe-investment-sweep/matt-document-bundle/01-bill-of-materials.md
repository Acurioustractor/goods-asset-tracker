# 01 — Stretch Bed Bill of Materials

**As-of:** 2026-05-28 (reconciled to actual invoices via deep OCR)
**Source:** `v2/src/lib/data/supplier-quotes.ts` (`stretchBedBOM`, `stretchBedDirectMaterials`) and `v2/src/lib/data/products.ts` (`STRETCH_BED`)
**Path costed here:** **Buy-Kit (Defy finished kit)** — the current production method. Other methods are in `03-cost-model-and-build-paths.md`.

---

## Product specification (Stretch Bed)

| Attribute | Value | Source |
|---|---|---|
| Weight | 26 kg | `products.ts` (verified) |
| Load capacity | 200 kg | `products.ts` (verified) |
| Dimensions | 188 × 92 × 25 cm | `products.ts` (verified) |
| Assembly time | ~5 minutes, no tools | `products.ts` (verified) |
| Design lifespan | 10+ years | `products.ts` (verified) |
| Plastic diverted | 20 kg HDPE per bed | `products.ts` + Ben confirmed (verified) |
| Materials | Recycled HDPE legs + galvanised steel poles + heavy-duty canvas | `products.ts` (verified) |

The bed is two galvanised steel poles (26.9mm OD × 2.6mm wall, 1950mm) threaded through canvas sleeves, with recycled HDPE legs that click onto the poles.

---

## Bill of materials — Buy-Kit path (direct materials)

| # | Component | Qty / bed | Unit cost (AUD) | Extended (AUD) | Supplier | Source | Confidence |
|---|---|--:|--:|--:|---|---|---|
| 1 | HDPE Plastic Kit (legs, cut & finished) | 1 | 344.05 | 344.05 | Defy Design (Sydney) | Defy INV-1602 (92 kits) + INV-1732 (50 kits) | **verified** |
| 2 | Galvanised Steel (gal pipe, 2 poles) | 1 | 27.00 | 27.00 | DNA Steel Direct (Alice Springs) | Notion "BOM - StretchBed v2"; invoices in Notion | **verified** |
| 3 | Canvas Sleeping Surface (cut+hemmed+sewn) | 1 | 93.50 | 93.50 | Centre Canvas (Alice Springs) | 3 Centre Canvas invoices 2026, 270 covers @ $93.50 | **verified** |
| 4 | Round Ribbed End Caps (27mm) | 4 | 0.80 | 3.20 | Hardware supplier | 4 × $0.80 | **verified** |
| 5 | Frame Screws | 16 | 0.065 | 1.04 | Coastal Fasteners | Xero RB20247673190 (2000 screws @ $130.94) | **verified** |
| 6 | Frame Bolts (M8 est.) | 2 | 0.50 | 1.00 | Coastal Fasteners | Rate estimated, pending line-item OCR | **inferred** |
| | **Direct materials total** | | | **469.79** | | `stretchBedDirectMaterials` (sum of rows) | **verified** (1 line inferred) |

**Sum check:** 344.05 + 27.00 + 93.50 + 3.20 + 1.04 + 1.00 = **$469.79/bed**.

Hardware subtotal (rows 4–6) = $5.24/bed (caps $3.20 + screws $1.04 + bolts $1.00).

---

## What this total does and does not include

| Layer | $/bed | Included here? | Notes |
|---|--:|---|---|
| Direct materials (Buy-Kit) | **469.79** | ✅ Yes | This BOM |
| + Defy assembly labour | 55.95 | ❌ No | Billed separately by Defy (verified, line 2026-03-19). Direct cost with assembly ≈ $525.74. |
| + Local freight | ~25 | ❌ No | Modelled |
| + Long-haul freight (Sydney→remote) | ~150 | ❌ No | Variable cost; ~$874/shipment to Alice Springs. Marginal cost with all freight ≈ $685/bed. |
| + Fixed annual block (facility, founder ops, admin, field travel) | varies by volume | ❌ No | See `03-` and `04-`. Fully-loaded planning anchor ≈ $600/bed at ~100/yr. |

**Use `$469.79` only as the direct-materials figure for the Buy-Kit path.** For margin and unit-economics claims, use the marginal and fully-loaded figures in `03-cost-model-and-build-paths.md` — not this materials-only number.

---

## Key BOM provenance notes

- **HDPE kit ($344.05)** is the swing number for the whole model — verified from two Defy invoices, but it is a Sydney-priced finished part. The raw-material floor for 20kg of HDPE is ~$40–55/bed. Getting a Defy **volume quote** at 500/1,000/5,000 beds/yr is the single highest-value open action.
- **Steel ($27) and canvas ($93.50)** are verified from the canonical Notion BOM and Centre Canvas invoices respectively, but those invoices live in **Notion + grant records, not the ACT-GD Xero mirror** — so they don't show up in a raw Xero pull. (Earlier code figures of steel $36 and canvas $65/$95 were wrong and have been corrected.)
- **Canvas tagging:** the Centre Canvas spend is currently mistagged ACT-IN in Xero ($14,915 retag to ACT-GD pending), and there is a $10,285 duplicate to reconcile. Does not change the per-bed rate.
- **Bolts ($1.00)** is the only inferred line — 2 × ~$0.50 M8 galvanised hex, pending Coastal Fasteners line-item OCR.
