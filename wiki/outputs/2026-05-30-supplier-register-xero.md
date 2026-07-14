# Goods on Country — Supplier / Vendor Register (Xero, money-out)

**Generated:** 2026-05-30
**Source:** ACT-infra Supabase `tednluwflfhxyucgwigh`, tables `xero_invoices` (type=`ACCPAY` = bills / money-out) + `xero_transactions` (type=`SPEND` = bank spend). Pulled read-only via PostgREST with the service-role key from `/Users/benknight/Code/act-global-infrastructure/.env.local`.
**Scope:** ALL projects (not filtered to ACT-GD) so cross-tagged Goods bills are caught — e.g. Centre Canvas tagged `ACT-IN`, Coastal Fasteners `ACT-FM`, Carbatec/Smartwood `ACT-HV`. The broad supplier scan was then narrowed to the `project_code=ACT-GD` money-out universe (the canonical Goods tag) for the "new suppliers" discovery.
**Entity:** every Goods-related bill is booked under `entity_code = ACT-ST` (Foundation) — zero in ACT-VC. Consistent with the known "all Goods revenue in ACT-ST" finding.

## Methodology / how to read the numbers
- **`bill_paid`** = sum of `xero_invoices.amount_paid` for ACCPAY bills (authoritative for any supplier that has bills). `bill_count` includes AUTHORISED-but-unpaid and excludes nothing except where noted (VOIDED bills carry `amount_paid = 0` so they don't inflate paid).
- **`bank_spend`** = sum of `xero_transactions.total` where `type=SPEND` AND `status=AUTHORISED`. DELETED bank-spend rows were EXCLUDED because they represent the bill-payment that was later migrated into an ACCPAY bill (double-count guard).
- **Double-count caveat:** for suppliers that have BOTH bills and AUTHORISED bank rows, the bank row usually *is* the payment of that bill — so do NOT simply add the two columns. The exceptions are **bank-only / bank-incremental** suppliers (Samuel Hafer, Telford Smith, Bionic Self Storage, Smartwood, Dept of Primary Hobart, Carla Furnishers whose bills were VOIDED) where the bank figure is the truer spend. These are flagged per-row.
- Bank accounts seen: `NAB Visa ACT #8815` and `NJ Marchesi T/as ACT Everyday`.

---

## A. Confirmed BOM / production suppliers (the known list)

### Defy Design / "Defy Manufacturing" — HDPE plastic kits + production training
- **bill_paid $120,957.90** across **35 ACCPAY bills** (2025-06-02 → 2026-03-31). bank_spend (AUTHORISED, mostly the same payments) $94,266.53 / 18 txns. Last activity 2026-05-16.
- Tags: entity ACT-ST; project **ACT-GD** (one late bill ACT-IN, 2026-05-16 $197.28).
- Key invoices: **INV-1602 $36,947.46 PAID** (2026-01-30 — the "107 Beds" kit run), INV-1507 $16,500 AUTHORISED-unpaid (2025-11-19 — verified elsewhere as the discontinued Weave Bed, NOT Stretch), INV-1362 $10,316.32, plus the 2026-03-27 pair $18,922.75 + $8,525 AUTHORISED-unpaid.
- Largest supplier by a wide margin. **AUTHORISED-unpaid bills outstanding to Defy** ≈ $59k face (INV-1503, 1507, 1637, 1657, the two Mar-27 bills, etc.) — but several of those have a matching AUTHORISED bank payment, so true open AP is lower; reconcile before quoting an AP figure.

### Centre Canvas ("Centre Canvas And Upholstery") — canvas sleeping surface
- **bill_paid $15,000** / 3 ACCPAY bills, **all tagged `ACT-IN`** (the known mistag — retag ACT-IN→ACT-GD pending). bank_spend $4,715 (2026-01-30, this one tagged ACT-GD).
- Bills: $4,715 PAID (2026-01-29), **ADG 6524337 $10,285 PAID (2026-03-31)**, and a **DUPLICATE $10,285 VOIDED (2026-03-31)** — confirms the duplicate flagged in `supplier-quotes.ts` was voided, so net is correct.
- Last 2026-03-31.

### Coastal Fasteners — frame screws/bolts (BOM)
- **bill_paid $130.94** / 1 ACCPAY bill **RB20247673190** (2026-04-16), tagged **ACT-FM** (Facilities) — matches the note in `supplier-quotes.ts` ($130.94 / 2000 screws). Only one bill on file.

### DNA Steel Direct — galvanised steel poles (BOM)
- **NOT FOUND in the Xero mirror.** Consistent with `supplier-quotes.ts` note: DNA Steel invoices live in Notion + grant records, not the ACT-GD Xero mirror. (Other steel suppliers DO appear — see Steelmart/Stratco/Metal Manufactures/Brisbane Steel below — but none named DNA Steel.)

### Envirobank — recycled HDPE (bulk)
- **NOT FOUND.** Status in `supplier-quotes.ts` is `pending` (discussions Feb 2026), so no spend yet — consistent.

---

## B. Other vendors from the email/known list — confirmed in Xero

| Vendor | bill_paid | bank_spend(AUTH) | total bills/txns | last | tag(s) | note |
|---|---|---|---|---|---|---|
| Samuel Hafer | $0 | **$19,500** | 0 bills / 1 bank | 2025-09-11 | ACT-GD | Design consultancy, single bank payment (no bill). Bank-only. |
| PeakUp / Peak Up Transport | $7,186.81 | $7,033.04 | 4 bills / 1 bank | 2025-07-28 | ACT-GD | Freight Sydney→remote. Bank row ≈ the bill payment. |
| Joseph Kirmos | $13,500 | $2,737.50 | 6 bills / 1 bank | 2026-05-06 | ACT-GD + ACT-HV | Facility labour. INV-004..007 @ $4,500; later invoices tagged ACT-HV. |
| BOE Design | $4,016.05 | $750 | 4 bills / 1 bank | 2025-12-24 | ACT-MD + ACT-GD | Design services. Mostly tagged ACT-MD. |
| Hinterland Aviation | $2,587.74 | $389.64 | 8 bills / 2 bank | 2026-02-17 | **ACT-IN** | Remote air freight/charter. All bills tagged ACT-IN. |
| ePrint Online ("ePrint") | $931.41 | $664.50 | 2 bills / 1 bank | 2026-03-20 | ACT-GD + ACT-SM | Printing (stickers/labels). |
| Speed Queen / Winning ("Winning Appliances") | $0 | $792 | 0 / 1 bank | 2025-06-18 | **ACT-FM** | Single Speed-Queen-related bank spend. Bank-only. |
| Social Impact Hub | $0 | $0 | 1 bill AUTHORISED-unpaid ($10,000) | 2026-03-30 | **ACT-CP** | Advisory bill raised, not yet paid; tagged ACT-CP not Goods. |
| Coleman Print | **NOT FOUND** | — | — | — | — | No contact matching /coleman/ in ACCPAY or bank spend. |

---

## C. NEW suppliers discovered (not on the known list) — money-out tagged to Goods

These surfaced from the broad `project_code=ACT-GD` (and cross-tag) scan. Many are field-trip / vehicle / freight / equipment, but several are material or capex-relevant.

### Material / equipment / capex (relevant to the BOM & plant story)
| Vendor | bill_paid | bank_spend(AUTH) | bills/txns | last | tag(s) | likely supplies |
|---|---|---|---|---|---|---|
| **1300 Washer** | $41,930.00 | $13,980 | 5 / 1 | 2025-12-16 | ACT-FM + ACT-GD | Washing machines / laundry equipment (the washer programme). Largest non-Defy spend. |
| **Zinus Australia** | $28,690.41 | $0 | 7 / 0 | 2025-09-16 | ACT-GD | Mattresses / bedding (resale or benchmark). Line items sparse. |
| **Telford Smith Engineering** | $19,800.00 | **$39,600** | 2 / 2 | 2025-12-23 | ACT-IN + ACT-GD | Fabrication / plastic-processing plant (capex). Bank $39.6k > bills → bank-incremental; treat **~$39.6k** as the real outlay. |
| **R M Tanner** | $19,950.00 | $0 | 1 / 0 | 2025-05-13 | ACT-GD | "Triple Axle Tiny House" trailer — transport/logistics capex. |
| **Carla Furnishers** | $0 (bills VOIDED) | **$11,180** | 2 (voided) / 1 | 2025-11-17 | ACT-GD | Furniture/furnishings. Bills voided; **$11,180 paid via bank** is the real spend. |
| **Carbatec** (Brisbane + QLD Warehouse) | $6,387.35 | $10,045.05 | 4 / 4 | 2026-01-12 | ACT-GD (+ACT-HV) | Woodworking / CNC tooling & workshop hardware (production tooling). |
| **RW Pacific Traders** | $6,234.00 | $6,200 | 2 / 2 | 2026-01-14 | ACT-GD | Materials & supplies. |
| **Openfields Solutions** | $5,800.00 | $0 | 1 / 0 | 2025-08-21 | ACT-GD | Fleet telemetry / IoT (washer monitoring — matches the `/api/webhooks/openfields` endpoint). |
| **Endless Parks** | $7,700.00 | $0 | 1 / 0 | 2025-05-20 | ACT-GD | "Design & Research Intro Batch 250 units" — early design/research batch. |
| **Smartwood** | $2,710.34 | $5,375.37 | 2 / 2 | 2026-01-07 | ACT-HV + ACT-GD | Timber / materials. Bank > bills → ~$5.4k real. |
| **Stratco** | $2,509.82 | $2,240.82 | 4 / 1 | 2025-10-20 | ACT-FM + ACT-GD | Steel / building materials. |
| **Steelmart** | $1,453.10 | $0 | 1 / 0 | 2026-04-07 | ACT-GD | Steel ("Steelmart - Materials"). |
| **Metal Manufactures** | $688.56 | $395.77 | 2 / 1 | 2025-10-06 | ACT-GD | Steel / metal supply. |
| **Brisbane Steel Supplies** | $185.70 | $185.70 | 1 / 1 | 2026-01-06 | ACT-GD | Steel. |

> Steel note: DNA Steel (the BOM steel supplier) is absent, but **Steelmart + Stratco + Metal Manufactures + Brisbane Steel** are the steel actually paid for through Xero — relevant if reconciling the $27/bed gal-pipe BOM line to real spend.

### Storage / freight / logistics / vehicle / services (operational, not BOM)
| Vendor | bill_paid | bank_spend(AUTH) | bills/txns | last | tag(s) | supplies |
|---|---|---|---|---|---|---|
| Bionic Self Storage / Bionic Group | $26,140.00 | $14,795 | 5 / 2 | 2026-04-29 | ACT-IN + ACT-GD | Storage rental (significant). |
| Orange Sky Australia | $16,458.38 | $1,096 | 13 / 6 | 2026-03-12 | ACT-GD/ACT-OS/ACT-IN | Generators (2× $3,300) + laundry-trailer partner. |
| Oonchiumpa Consultancy and Services | $14,850.00 | $19,305 | 6 / 1 | 2026-02-06 | ACT-OO + ACT-GD | Consultancy/services. **Attribution review** — memory flags Oonchiumpa/Ingkerreke as not-Goods (Xero retag pending); some of this may not belong to Goods. |
| Byo Group | $8,640.61 | $2,717.88 | 14 / 3 | 2025-08-01 | ACT-GD | Supplies / merchandise. |
| Crust Mechanical Repairs | $8,451.00 | $0 | 1 / 0 | 2025-02-14 | ACT-GD | Vehicle / mechanical repairs. |
| RAC Automotive Services | $5,668.96 | $0 | 1 / 0 | 2025-06-19 | ACT-GD | Vehicle service. |
| Department of Primary Hobart | $0 | $2,825 | 0 / 2 | 2025-06-20 | ACT-GD | Govt fees/permits (TAS). Bank-only. |
| Sea Swift | $2,554.39 | $0 | 1 / 0 | 2025-09-29 | ACT-GD | Barge freight (remote). |
| Sendle | $1,961.20 | $15.36 | 7 / 1 | 2025-08-11 | ACT-GD + ACT-IN | Parcel shipping. |
| Loadshift Sydney | $1,243.59 | $6,330.05 | 2 / 2 | 2025-12-11 | ACT-GD + ACT-MY | Freight brokerage. Bank > bills. |
| Reddy Express | $965.37 | $362.03 | 12 / 3 | 2026-03-11 | ACT-GD + ACT-FM | Freight. |

> Plus a long tail of clearly NON-supplier field-trip incidentals tagged ACT-GD (fuel: BP/Caltex/EG Fuelco; meals/cafes; roadhouses; hotels/Airbnb; Avis/Thrifty/Budget/SIXT car hire; Qantas/Virgin flights; Bunnings/IGA/Woolworths). These are travel & subsistence for community delivery trips, NOT vendors of the product — excluded from the supplier register but visible in the raw ACT-GD money-out scan.

---

## D. Not found (searched, absent)
- **DNA Steel Direct** — not in Xero mirror (lives in Notion/grant records per supplier-quotes.ts). ✔ expected.
- **Envirobank** — no spend (pending supplier). ✔ expected.
- **Coleman Print** — no contact match in ACCPAY or bank spend.
- **Standard Ledger** — no contact match in the Goods/ACT-ST money-out universe scanned.
- **Hinterland Aviation** found (air charter) — note this is the only "Hinterland" match; there was no separate aviation vendor missed.

---

## E. Data caveats
1. Figures are **inc-GST cash/bill basis** from the live Xero mirror — do NOT cross-overwrite the ex-GST grant-commitment figures on the funder pages.
2. `bank_spend` AUTHORISED rows overlap bill payments for billed suppliers; only treat bank as additive for the flagged bank-only/bank-incremental vendors.
3. Oonchiumpa attribution is contested (memory: Ingkerreke/Oonchiumpa excluded from Goods, retag pending) — verify before counting its ~$15–19k as a Goods supplier cost.
4. Project tags are spread (ACT-GD, ACT-IN, ACT-FM, ACT-HV, ACT-MD, ACT-OS, ACT-CP, ACT-MY) — a single clean "Goods supplier spend" total requires deciding which tags count.
