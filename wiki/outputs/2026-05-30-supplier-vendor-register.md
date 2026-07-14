# Goods — Supplier & Vendor Register (discovery)

**Date:** 2026-05-30
**Purpose:** One authoritative list of everyone Goods buys from / pays — to (a) make them GHL contacts with role + history + contactability, (b) keep the BOM supplier list canonical, (c) underpin the QBE procurement story.
**Sources:** Gmail inbox (ben@/benjamin@act.place) + **Xero (money-out, authoritative — agent-mined, see `2026-05-30-supplier-register-xero.md`)** + `v2/src/lib/data/supplier-quotes.ts` (canonical BOM detail).
**Status:** discovery in progress — NO GHL writes yet. Bulk-add gated on Ben's approval.

---

## Tagging model (for the GHL bulk-add)

- `goods-supplier` = **BOM component supplier** (the emailable production-supply list). `+ goods-supplier-active`/`-pending` `+ supplier-<component>`.
- `goods-vendor` = **non-BOM vendor / service provider** (print, freight, accounting, advisory) — separate tag so it doesn't dilute the supplier list.
- Role captured in a custom field / note: what they supply + last activity + entity tag (ACT-GD/IN/FM) + Xero/invoice ref.

---

## A. BOM component suppliers (the 5 — all already in GHL)

| Supplier | Supplies | Contact | GHL | Notes |
|---|---|---|---|---|
| Defy Design | HDPE kit $344.05/bed (primary) | Sam Davies sam@defydesign.org · +61 422 513 893 · team: Will, Millie (freight), Todd | ✅ `Vk0et07jw3qccBZsqBF8` | Active to 2026-05-28. Books freight via **PeakUp**. |
| DNA Steel Direct | gal pipe $27/bed | sales@dnasteeldirect.com.au · +61 8 8953 7355 | ✅ `oqSDOhRXIaSXgF1c8YZo` | Alice Springs. Phone added 2026-05-30. |
| Centre Canvas | canvas $93.50/cover | Wayne · +61 8 8952 2453 | ✅ `wXv7cRKlIkWUYYE3J0B6` | Alice Springs. Phone added 2026-05-30. Buyer-opp abandoned 2026-05-30. Email still missing. |
| Coastal Fasteners | screws+bolts ~$2/bed | — | ✅ `MUBTp1d7m4pXEoWhWGN6` | Email/phone missing. Bills tagged ACT-FM. |
| Envirobank | future bulk HDPE | Marty Taylor mtaylor@envirobank.com.au · Narelle Anderson nanderson@envirobank.com.au | ✅ `ipZjeDDR9uwHMdXR7KV6` | Pending supplier. Emails now known (add to GHL). |

---

## B. NEW vendors found via Gmail (NOT yet in GHL)

| Vendor | Supplies | Contact(s) | Proposed tag | Last seen | Flag |
|---|---|---|---|---|---|
| Speed Queen Laundry / Winning | **Washing machines** (Speed Queen units) | retail@ + jordan@speedqueenlaundry.com.au · james.moore@ + alice.kuepper@winning.com.au | `goods-supplier` (washer) | 2025-07 | The washer supply chain — important for the fleet/washers product line. |
| Coleman Print | QR stickers (gloss vinyl UV) | Jeremy Bigg jeremy@colemanprint.com.au | `goods-vendor` | 2026-05-20 | $215+gst / 600 stickers. |
| ePrint Online | print / stickers | orders@eprintonline.com.au | `goods-vendor` | 2026-05-14 | Order 221925. (Matches sticker memory.) |
| BOE Design | branding / coaster prototypes | Magnus Murray-Douglass magnus@boedesign.com.au | `goods-vendor`? | 2025-03 | "Smart Recovery Products" — may be a SMART/HCP project, not Goods. Confirm before tagging. |
| Zinus | mattresses / bedding | Daniel Pittman daniel.pittman@zinus.com | advisor? | 2026 | On the Goods advisory group — advisor + potential supplier. |

## C. Service providers / professional (non-BOM)

| Vendor | Role | Contact | Proposed tag |
|---|---|---|---|
| Standard Ledger | Accounting / ASIC company-sec (incorporated ACT Pty Ltd) | Vanessa Ordoñez cosecAU@standardledger.co | `goods-vendor` |
| Social Impact Hub | Advisory (SIH diagnostic + scale-up advisory) | matt.allen@ · jay@ · malcolm.aikman@socialimpacthub.org | `goods-vendor` |
| PeakUp | Freight carrier (Sydney→NT) | (via Defy) | `goods-vendor` |
| Hinterland Aviation | Charter flights to remote communities | info@flyhav.com | `goods-vendor` |

*Also from memory, to confirm in Xero:* Samuel Hafer (design consultancy $19,500), Joseph Kirmos (facility labour ~$4,500/mo).

---

## D. Xero money-out mining (AUTHORITATIVE — by total paid)

Mined from ACT-infra Supabase (`xero_invoices` ACCPAY 2,102 bills + AUTHORISED bank SPEND, all projects). Full detail: `2026-05-30-supplier-register-xero.md`. All Goods money-out booked under entity ACT-ST; project tags spread ACT-GD/IN/FM/HV/MD/OO.

| Supplier | Supplies | Total paid AUD | # | Last | Tags |
|---|---|---:|---|---|---|
| Defy Design | HDPE kits/legs + training | **120,957.90** | 35 | 2026-05-16 | ACT-GD |
| 1300 Washer | **Washing machines** (real washer supplier) | 41,930.00 | 5 | 2025-12-16 | ACT-FM+GD |
| Telford Smith Engineering | **Plastic plant / fabrication (capex)** | ~39,600 | 4 | 2025-12-23 | ACT-IN+GD |
| Zinus Australia | Mattresses / bedding | 28,690.41 | 7 | 2025-09-16 | ACT-GD |
| Bionic Self Storage | Storage | 26,140.00 | 5 | 2026-04-29 | ACT-IN+GD |
| R M Tanner | Triple-axle trailer (one-off) | 19,950.00 | 1 | 2025-05-13 | ACT-GD |
| Samuel Hafer | Design consultancy | 19,500.00 | 1 | 2025-09-11 | ACT-GD |
| Orange Sky Australia | Generators + laundry | 16,458.38 | 13 | 2026-03-12 | ACT-GD/OS/IN |
| Centre Canvas | Canvas surface (BOM) | 15,000.00 | 3 | 2026-03-31 | ACT-IN |
| Oonchiumpa | Consultancy (⚠ contested = not-Goods?) | 14,850.00 | 6 | 2026-02-06 | ACT-OO+GD |
| Joseph Kirmos | Facility labour | 13,500.00 | 6 | 2026-05-06 | ACT-GD+HV |
| Carla Furnishers | Furniture | 11,180.00 | bank | 2025-11-17 | ACT-GD |
| Endless Parks | Design / research | 7,700.00 | 1 | 2025-05-20 | ACT-GD |
| PeakUp Transport | Freight | 7,186.81 | 4 | 2025-07-28 | ACT-GD |
| Carbatec | CNC / woodworking tooling | 6,387.35 | 4 | 2026-01-12 | ACT-GD/HV |
| Openfields Solutions | **Fleet telemetry / IoT** | 5,800.00 | 1 | 2025-08-21 | ACT-GD |
| Smartwood | Timber | ~5,375 | 4 | 2026-01-07 | ACT-HV+GD |
| BOE Design | Design services (IS Goods) | 4,016.05 | 4 | 2025-12-24 | ACT-MD+GD |
| Hinterland Aviation | Air freight | 2,587.74 | 8 | 2026-02-17 | ACT-IN |
| Steelmart / Stratco / Metal Mfrs / Bris Steel | Steel (paid via Xero) | ~4,838 | mixed | 2026-04-07 | ACT-GD/FM |
| ePrint Online | Printing / stickers | 931.41 | 2 | 2026-03-20 | ACT-GD+SM |
| Speed Queen / Winning | Washing machines (minor) | 792.00 | — | — | ACT-GD |
| Coastal Fasteners | Screws / bolts (BOM) | 130.94 | 1 | 2026-04-16 | ACT-FM |

**Not in Xero:** DNA Steel (lives in Notion), Envirobank (still pending), Coleman Print, Standard Ledger.
**Don't double-count:** for bank>bills vendors (Telford Smith, Smartwood, Carla, Loadshift) the bank figure is the true outlay — don't add bank+bills.

---

## E. Consolidated master list, by ROLE (for GHL roles + smart lists)

- **BOM component suppliers** → `goods-supplier` + `supplier-<component>`: Defy (HDPE), DNA Steel (steel), Centre Canvas (canvas), Coastal Fasteners (fasteners), Envirobank (HDPE bulk, pending), + Steelmart/Stratco/Metal Mfrs/Brisbane Steel (Xero-paid steel).
- **Production plant / tooling / capex** → `goods-supplier` + `supplier-plant`: Telford Smith (plant), Carbatec (CNC), Smartwood (timber), R M Tanner (trailer), Joseph Kirmos (labour).
- **Product lines (washers / bedding / furniture)** → `goods-supplier` + `supplier-product`: 1300 Washer, Zinus, Carla Furnishers, Speed Queen/Winning, Orange Sky (also a partner).
- **Logistics / freight** → `goods-vendor` + `vendor-freight`: PeakUp, Hinterland Aviation, (Sea Swift, Sendle, Loadshift — long tail).
- **Tech / fleet** → `goods-vendor` + `vendor-tech`: Openfields Solutions.
- **Professional services / design / advisory** → `goods-vendor` + `vendor-services`: Samuel Hafer, BOE Design, Endless Parks, Social Impact Hub, Standard Ledger, Oonchiumpa (⚠ confirm Goods relevance).
- **Print / signage** → `goods-vendor` + `vendor-print`: ePrint Online, Coleman Print.
- **Storage** → `goods-vendor`: Bionic Self Storage.

---

## F. GHL bulk-add — ✅ DONE 2026-05-30

**Executed:** all 24 rows added/enriched in GHL, verified. Contact IDs in `2026-05-30-ghl-supplier-add-results.md`. 22 created fresh; Social Impact Hub + Zinus matched existing (supplier tags appended, prior tags intact); Envirobank email enriched. Tag model applied: `goods-supplier`(+`-active`,`supplier-<plant/product/steel/component>`) for BOM/plant/product; `goods-vendor`(+`vendor-<print/freight/services/tech>`) for the rest. Excluded Oonchiumpa (contested).

**Still open (light):** email enrichment for the company-only stubs (Telford Smith, 1300 Washer, Carbatec, Smartwood, R M Tanner, Bionic, Carla, Openfields, Samuel Hafer, Endless Parks, Joseph Kirmos, steel merchants) — Xero gave $ + name but not email; mine Gmail/web later if they need to be emailable. Centre Canvas + Coastal still need emails (Ben's data).

### Original proposal (for reference)

Each contact created with: company + best contact name/email/phone, the role tags above, and a NOTE capturing `supplies | total paid | last activity | Xero/entity tag`.

- **Tier 1 — strategic recurring (recommend add all):** the BOM suppliers' gaps + Telford Smith, 1300 Washer, Zinus, Carbatec, Smartwood, Joseph Kirmos, Openfields, PeakUp, Hinterland, Samuel Hafer, BOE Design, Endless Parks, ePrint, Coleman Print, Standard Ledger, Social Impact Hub. (~18 new contacts)
- **Tier 2 — one-offs (optional):** R M Tanner (trailer), Bionic Self Storage, Carla Furnishers, the small steel merchants.
- **Skip / confirm:** Oonchiumpa (contested attribution).
- **Enrich existing:** add Envirobank emails (Marty + Narelle) to its GHL contact.
- **Then Workstream C:** build GHL smart lists `goods-supplier` (emailable production list) + `goods-vendor`.

*Nothing executed. On Ben's scope + go, I create the batch (handling the create-contact name/email rule) and report IDs.*
