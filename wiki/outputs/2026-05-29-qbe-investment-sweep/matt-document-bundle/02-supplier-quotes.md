# 02 — Supplier Quotes

**As-of:** 2026-05-28
**Source:** `v2/src/lib/data/supplier-quotes.ts` (`supplierQuotes`)
**Note:** prices are AUD, ex-GST per-component unless stated. "Status" is the quote's standing (active/pending/historical). Xero ref is the source invoice where the rate was verified; `—` means the rate is verified from Notion/grant records, not the ACT-GD Xero mirror.

---

## Supplier quote register

| Supplier | Contact | Component | Unit price (AUD) | MOQ | Lead-time | Valid until | Status | Xero invoice | Notes |
|---|---|---|--:|--:|--:|---|---|---|---|
| **Defy Design** | Sam Davies (sam@defydesign.org) | HDPE Plastic Kit — legs, cut & finished | **344.05** | 50 | 21 d | 2026-06-30 | active | INV-1602 | Current primary supplier, Sydney. Verified ex INV-1602 ("107 Beds", 92 @ $344.05) + INV-1732 ("50 Beds"). Assembly billed separately ~$55.95/bed; freight Sydney→Alice ~$874/shipment. Beds from pre-paid sheets cost only $121/bed (cut+finish labour). |
| **Defy Design** | Sam Davies | HDPE Sheet — raw material (1200×600×18mm) | 35.00 | 20 | 14 d | 2026-06-30 | active | — | Base material for future product expansion (wall panels, shelving, table tops). |
| **Defy Design** | Sam Davies | Production Training Package (on-site) | 6,000.00 | 1 | 30 d | n/a | active | — | Per-session. Jahvan visited Sydney factory Aug 2025. Workforce-development cost, funded by philanthropy/employment grants — not a unit cost. |
| **Defy Design** | Sam Davies | HDPE pre-pressed panel (each; 2 per bed) | 200.00 | — | — | — | active | INV-1731 | 20 panels bulk, 1200×1200×19mm. Buy-Panels path = 2 × $200 = $400/bed of plastic. Worst value (idiot index 10x) — avoid unless our press is down. |
| **DNA Steel Direct** | sales@dnasteeldirect.com.au, 08 8953 7355 | Galvanised steel (gal pipe, 2 poles/bed; 26.9mm OD × 2.6mm wall) | **27.00** | 100 | 7 d | 2026-12-31 | active | — | Alice Springs based — key for NT procurement preference. $27/bed per canonical Notion "BOM - StretchBed v2". Real supplier (confirmed Ben 2026-05-28); invoices live in Notion + grant records, not the ACT-GD Xero mirror. |
| **Centre Canvas** | Wayne, 4 Smith St Alice Springs, 08 8952 2453 | Canvas sleeping surface — cut + hemmed + sewn, washable | **93.50** | 50 | 14 d | 2026-12-31 | active | ADG 6524337 | Alice Springs. **Verified** ex 3 Centre Canvas invoices 2026 (Jan 50 covers + Mar 110 covers × 2 batches, 270 total @ $93.50). Tagged ACT-IN — retag ACT-IN→ACT-GD ($14,915) pending; 2026-03-31 duplicate ($10,285) to reconcile. Earlier "$95/bed" was a Notion working figure; actual flat rate is $93.50. |
| **Hardware supplier** | (multiple) | Round ribbed end caps, 27mm (4/bed) | 0.80 | 500 | 5 d | n/a | active | — | Generic hardware item, multiple suppliers available. |
| **Coastal Fasteners** | — | Frame screws "8-9×41 C3 Trec" (16/bed) | 0.065 | 1,000 | 5 d | n/a | active | RB20247673190 | **Verified** ex Xero 2026-04-16 ($130.94 / 2000 screws = $0.0645/screw). 16/bed × $0.065 = $1.04/bed. Bill tagged ACT-FM (facilities) but same screws used for Goods bed assembly — split-tag pending. |
| **Coastal Fasteners** | — | Frame bolts, M8 galvanised hex (2/bed) | ~0.50 | 200 | 5 d | n/a | active | — | **Estimate** ($0.50/bolt bulk) pending line-item OCR. Ben confirmed 2026-05-28: 2 bolts + 16 screws per bed. = $1.00/bed. |
| **Envirobank** | Marty Taylor / Narelle Anderson | Recycled HDPE (bulk, pellets/flakes) | 0.80 /kg | 1,000 kg | 21 d | n/a | **pending** | — | Active discussions Feb 2026. Alternative/supplementary HDPE feedstock source for when on-country processing starts. |

---

## Reading the supplier picture

- **4 core suppliers** behind a Buy-Kit bed: Defy (plastic), DNA Steel (poles), Centre Canvas (canvas), and generic hardware/Coastal Fasteners. **2 are local to Alice Springs** (DNA Steel + Centre Canvas) — material for NT procurement-preference and local-jobs framing.
- **Defy is the dominant cost and the strategic lever.** Defy offers three things at three price points: finished kit ($344.05/bed), pre-pressed panels ($200 each = $400/bed), and cut+finish-only on our own sheets ($121/bed). Plus raw shred at $2.00/kg + $0.75/kg delivery (verified ex INV-1731). The spread between "finished kit" and "raw shred" ($344.05 vs ~$55) is the in-sourcing prize.
- **Quote validity:** Defy kit + sheet quotes valid to **30 Jun 2026**; DNA Steel + Centre Canvas to **31 Dec 2026**. Hardware/fastener rates have no formal expiry (commodity). **Envirobank is pending**, not a live quote.
- **Open ask to Defy** (for a tighter model): volume quote at 100 / 500 / 1,000 / 5,000 beds/yr — what does the $344.05 kit become? And: is a build-to-supply arrangement cheaper if Goods sources steel + canvas direct and supplies Defy for kit-assembly only?
