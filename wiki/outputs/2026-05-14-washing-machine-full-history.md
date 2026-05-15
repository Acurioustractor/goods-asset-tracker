---
title: Washing Machine Full History — Bought, Promised, Delivered, Where They Are
date: 2026-05-14
status: live
audience: Ben + Nic, sense-check before the trip
sources: Xero (act-infra), Supabase v2 (assets + usage_logs), Gmail (Nov 2023 - May 2026)
---

# Washing Machine Full History

Single timeline pulling every dollar spent, every email promised, every register entry, every photo. Source-marked so you can sense-check before the trip.

## At-a-glance numbers

| | Count | $ |
|---|---:|---:|
| Machines purchased from 1300 Washer (Speed Queen distributor) | **14** | **$41,930** |
| Other WM-related Xero spend (Openfields telemetry, Snap Laundromat, The Washing Machine Project) | — | **+$7,371** |
| Total WM-related ACCPAY spend (cradle to grave) | | **~$49,301** |
| Machines invoiced to communities (ACCREC, PAID + AUTHORISED) | **13 new + 4 BHAC upgrades + 4 dryers** | $90,330 |
| Asset register rows | **41** (incl 1 retired duplicate, 9 phantom batch) | — |
| Distinct physical devices in telemetry | **13** | — |
| Devices reporting in last 7 days | **3** | — |
| Photos in register (`photo` field non-null) | **6** | — |

## The unified timeline

### Pre-history (before our Xero record starts)

- **2023-11-06** — Bank SPEND $6 to "Liquid Laundry" (probably a coin laundromat receipt; ignore).
- **2023-12-04** — Bank SPEND **$1,565 to "The Washing Machine Project"** (Sydney NGO, probably initial knowledge transfer / mentorship payment, not hardware).
- **2024-08-22** — Bank RECEIVE $600 from "Nicholas Marchesi" with reference "Washing machine" (Nic personally reimbursed something — origin unknown).

### Early 2025 — supplier hunt

- **2025-03-12** — Nic & Alice Kuepper @ Winnings first conversation. Alice introduces James Moore (Winnings expert) → recommends **Speed Queen** via their RAP partnership.
- **2025-04-15** — Goods × QIC follow-up: Nic describes plan as "speed queen 4000 with 5-year warranty machines" (these are AWNA-class).
- **2025-04-22 — 2025-05-01** — Speed Queen Australia (Craig "Craige", retail@; Jordan, sales@) onboarded; Nic visits Speed Queen warehouse and lands on **Speed Queen AWNA 62 Black** as the base unit, $2,995 ex GST.

### May 2025 — first hardware in the door

- **2025-05-01** — **INV-0227 Snow Foundation: $110,000 paid** as Q2 2025 program grant. Line items: $20K WM V1 R&D, $20K Mattress V2 R&D, $12K Training, $48K Community Engagement (4 trips). This is the **R&D budget**, not the machine purchases themselves. R&D scope: "Design and field-test simplified, rugged washing machine for remote conditions."
- **2025-05-12** — **I0014374 1300 Washer ACCPAY $2,995 PAID** — 1 machine (sample / first build).
- **2025-05-12** — **I0014375 1300 Washer ACCPAY $14,975 PAID** — 5 machines (= 5 × $2,995). All shipped to Defy Design, 5-7 Byrnes St, Botany, NSW.
- **2025-05-29** — **I0014517 1300 Washer ACCPAY $14,975 PAID** — another 5 machines. Also to Defy Botany.

**Running purchase total at end of May 2025: 11 machines, $32,945.**

### June–July 2025 — first invoiced outflows

- **2025-06-10 / 2025-06-17** — Nic + Craige tense pricing dispute ("Adjusted invoice" thread); Speed Queen wants to know if usage is domestic or commercial. Nic confirms residential/domestic.
- **2025-06-17** — Sally Grimsley-Ballard (Snow) emails "BHAC Laundry pics" — **introduces the BHAC/Maningrida deal**: "Goods/BHAC/Snow Laundry" — 3-way partnership.
- **2025-06-29** — **INV-0240 Snow Foundation ACCREC $16,600 PAID**:
  - **2** new "Goods Indestructible Washing Machine v1" @ $4,000
  - **4** upgrades of BHAC's existing Speed Queens @ $1,300 (re-skinning + parts + labour)
  - **4** LG Giant C 10kg commercial dryers @ $3,100
  - $7,000 project mgmt / install / shipping
  - $-17,509 "TBC Other Funding (ACT to cover)" — Snow paid 50%, ACT covered the rest
- **2025-07-02** — **First TC register entries** appear in asset register, supply_date today: Norman (GB0-113), Jimmy (GB0-132), Jimmy's Uncle (GB0-133), Barkley Arts (GB0-125), PI Rangers Station (GB0-135). **All 4 TC entries have photos** (`20250702-IMG_*.jpg`) → physical proof.
- **2025-07-08** — INV-0241 Bawinanga ACCREC $16,600 **VOIDED** — same line items as INV-0240. Snow paid via INV-0240 instead of Bawinanga directly. Voiding is correct.
- **2025-07-14** — **I0014891 1300 Washer ACCPAY $8,985 PAID** — 3 machines (= 3 × $2,995). Delivery to **Defy Design Botany**.
- **2025-07-17** — INV-0244 Winnings ACCREC $2,160 **VOIDED** — SpeedQueen 24% rebate for 3 machines. Same VOIDED-rebate pattern as INV-0236/0237.

**Running purchase total at end of July 2025: 14 machines, $41,930. This is the total we have firm evidence for.**

### August 2025 — Palm Island wave

- **2025-08-?? (supply_date 2025-08)** — **8 register entries** added: PI Workers House (137), PI Luella Bligh (138), PI Ebs Aunty (139), PI Additional Washers x2 (143-1/2), Oonchiumpa x3 (now correctly tagged Alice Springs). **None of these 8 have photos** → no physical verification.
- **2025-08-11** — Centrecorp (Randle Walker) replies "Centrecorp has delivered around 2500 washing machines across Central Australia since COVID". Worth asking Randle directly if any of our register entries were Centrecorp-funded.
- **2025-08-21** — **INV-0008 Openfields Solutions ACCPAY $5,800 PAID** — first telemetry pipeline payment (Openfields built the cellular gateway integration).

### September 2025 — PI Club Kuta + telemetry boots up

- **2025-09-28 (supply_date)** — **GB0-147 Club Kuta machine** added (PI, with photo `photo 11.heic`).
- **2025-09** — first Particle coreid telemetry events appear (c4b9 from 2025-08-27, fe6c + 7ae0 + 9f1d from 2025-09-15, 098 from 2025-09-19).
- **2025-09-28 to 2025-10-08** — Nic + Bawinanga (Phillip Allan) coordinate **MNG laundromat refit**. Phillip Allan email 2025-10-08: "We have received and stored at our yard all, your materials x 4 pellets, plus the **two washing Machine pellets** ready for your arrival in MNG on the 11/10" → confirms **2 new machines + 4 BHAC upgrades** physically arrived in MNG by Oct 11, 2025.

### October 2025 — Maningrida deployment

- **2025-10-11 to 2025-10-14** — MNG site visit. Refit completed.
- **2025-10-?? (supply_date 2025-10)** — All 6 `GB0-150-*` register rows added to TC, all named identically "Maningrida Laundry". **No photos in register.** Match: 2 new + 4 BHAC upgrades = 6 ✓
- **2025-10-21** — **INV-0282 Julalikari Council ACCREC $19,800 PAID** — 4 Goods Indestructible Washing Machine v1 @ $4,500, delivered to Tennant Creek. **Outflow accounted for the 4 TC machines: probably the named-suffix devices F25, 4E5, 507, 8D1.**

**Now we can reconcile most of the 14 machines:**
- 2 to Maningrida (BHAC) via Snow grant (INV-0240)
- 4 to Tennant Creek via Julalikari (INV-0282)
- Remaining: 8 machines from the 14 — almost certainly went to Tennant Creek (Norman, Jimmy, Jimmy's Uncle, Barkley Arts) and to Wilya Janta direct + the 4 named-suffix devices.

### December 2025 — the GB0-154-* batch (10 register entries, mostly phantom)

- **2025-12-13 (supply_date)** — **10 entries created** in the asset register: `GB0-154-1` through `GB0-154-10`, all tagged Tennant Creek, status=deployed, name="Pending Assignment". Same note: "Washing machine batch for communities".
- **The problem:** there is **no corresponding Xero invoice for a 10-machine batch on or near this date.** Either:
  - (a) These were pre-allocated register entries for an *anticipated* batch that mostly didn't physically materialise, OR
  - (b) They came from Centrecorp / Snow direct procurement (Snow buys, ships to TC, we register), OR
  - (c) They were drawn down from the 14 already-purchased machines that hadn't been allocated yet.
- **Only `GB0-154-2` (Nicole Frank) has any evidence of being real**: it has a photo (`ticket-photos/deliveries/...`) AND produced 5 telemetry events between 2026-03-01 and 2026-03-09.
- **The other 9 `GB0-154-*` rows** have no photos and zero telemetry ever. **They look like phantom batch placeholders.**

### January 2026 — Our Community Shed

- **2026-01-20** — **INV-0308 Our Community Shed ACCREC $6,765 PAID** — 1 Goods Indestructible Washing Machine v1 @ $5,500 + $650 transport/install. **Owner: Michelle (chair@ourshed.org), coordinator: Lucy (coordinator@ourshed.org).** Earlier email Jan 20: "generous offer to purchase a Goods Washing Machine for the [community]…"

### February 2026 — Anyinginyi quote (status: quote only)

- **2026-02-09** — Tony Miles (Executive Manager, Piliyintinji-ki Stronger Families, Anyinginyi Health) → **Nic sends QUOTE for 4 Goods v1 Machines, delivery to Tennant Creek** + Rotary grant pathway (Pene Curtis, Rotary E-Club of Outback Australia). **No invoice issued — still in the grant pipeline as of April 2026.** This is **NOT yet machines we've delivered.**

### March 2026 — TC named-suffix devices appear in register

- **2026-03-?? (supply_date 2026-03)** — **8 register entries** added for the TC named-suffix devices: `GB0-WM-098`, `4E5`, `507`, `8D1`, `DSS`, `F25`, `RD`, `PARTICLE-01`. **The supply_date is suspiciously late** — these devices already had telemetry events going back to **2025-08–2025-12**. So the asset register was backfilled in March 2026 with these names, but the physical machines have been broadcasting for 6+ months prior.
- **2026-03-01** — One-off offline events from 6 "named site" devices (Norms House, Nicoles House, Barkley Arts, DSS, RD, 8D1) — looks like a **telemetry pipeline cutover from named to coreid**.
- **2026-03-09** — All 6 "named site" devices stop reporting. **Backend pipeline change broke them.**

### April–May 2026 — Homeland School + orphan investigation

- **2026-04-25** — Our Community Shed CBF NT grant attempt → DECLINED.
- **2026-05-05** — Telemetry orphans (`c4b9`, `fe6c`, `9f1d`) backfilled into asset register as `GB0-WM-ORPHAN-*` rows tagged Palm Island, status=under_investigation.
- **2026-05-05** — Nic Sharah @ Homeland School Co. thread re: 2 machines + 40 beds.
- **2026-05-13** — F25 still reporting actively (most recent event).
- **2026-05-14** — `GB0-WM-PARTICLE-01` confirmed duplicate of `GB0-WM-4E5`, retired. Oonchiumpa 3 records correctly retagged to Alice Springs. 3 orphan records correctly retagged to Tennant Creek.
- **2026-05-18** — **INV-0303 Homeland School Co. ACCREC $40,000 AUTHORISED** (not yet paid): 2 "Goods. Indestructible Washing Machine v1.1" @ $4,500 + 40 Stretch Beds @ $750 + $5,900 freight BNE→DRW→MNG.

## Photo audit (only 6 of 41 register rows have a photo)

| Asset | Photo file | Date | Confidence |
|---|---|---|---|
| `GB0-113` Norman | `20250702-IMG_8072.jpg` | 2025-07-02 | ✅ Real |
| `GB0-132` Jimmy | `20250702-IMG_8034.jpg` | 2025-07-02 | ✅ Real |
| `GB0-133` Jimmy's Uncle | `20250702-IMG_8057.jpg` | 2025-07-02 | ✅ Real |
| `GB0-125` Barkley Arts | `photo.heic` (no date in filename) | 2025-07-02 | ✅ Real |
| `GB0-147` Club Kuta machine (PI) | `photo 11.heic` | 2025-09-28 | ✅ Real |
| `GB0-154-2` Nicole Frank | `ticket-photos/deliveries/delivery_...` (Supabase Storage) | 2025-12-13 | ✅ Real |

**35 register rows have NO photo.** All Maningrida (6), most Palm Island (9 of 10 — only Club Kuta has one), all GB0-154 batch except Nicole, and all the named-suffix TC machines (098, 4E5, 507, etc.) lack visual proof of installation.

## Promised vs delivered (open commitments)

| Commitment | Source | Status |
|---|---|---|
| 2 machines to Homeland School Co. (Maningrida area, with 40 beds) | INV-0303 May 2026 | **AUTHORISED, not paid** |
| 4 machines to Anyinginyi (TC) — Stronger Families program | Quote Feb 2026 + Rotary grant in flight | **Quote only, no invoice** |
| 1 machine to Our Community Shed (TC) via CBF NT grant | Discussion Jan-Apr 2026 | **Grant declined**; deal still open via alt funding |

## Reconciled fleet — what we actually have on the ground

Cross-referencing **purchases (14)** + **BHAC upgrades (4)** + **telemetry evidence (13)** + **photo evidence (6)**:

| Where | Best estimate of real machines | Asset register count | Gap (likely phantom) |
|---|---:|---:|---:|
| **Tennant Creek** | 10–12 (4 photo-confirmed + 3 active telemetry + 5 named-suffix with brief telemetry) | 21 deployed + 3 under_invest. | ~9–11 (the GB0-154-1,3..10 batch) |
| **Maningrida (BHAC)** | 6 (2 new + 4 BHAC upgrades, physically confirmed arrived Oct 2025 per Phillip Allan email) | 6 deployed | 0 — but no telemetry working |
| **Palm Island** | 1–10 (only Club Kuta photo-confirmed) | 7 deployed | unknown — full PI site visit needed |
| **Alice Springs (Oonchiumpa)** | 3 (record-only, needs physical check this trip) | 3 deployed | 0 if confirmed this trip |
| **Retired** | n/a | 1 | — |
| **Total likely real** | **20–31** | **41** | **10–21** |

## Headline answer to "how many machines do we have"

- **Confidently bought from a known supplier:** 14 (Speed Queen via 1300 Washer, May–July 2025).
- **Plus owned-by-BHAC-but-we-skinned-them:** 4 (these are NOT our hardware; we just upgraded their cabinets).
- **Plus possible-but-unverified extras:** up to ~10 (the GB0-154 batch + any Centrecorp / Snow direct procurement we never invoiced).
- **Most defensible "Goods owns" number:** **14 machines.**
- **Most defensible "Goods has touched / re-skinned / branded" number:** **18 machines (14 + 4 BHAC upgrades).**

## Action items for the trip / immediate follow-ups

1. **Eyes-on confirmation in Tennant Creek** — walk every entry, take a photo, attach via `/admin/assets/{id}` page. The 9 `GB0-154-*` Pending Assignment rows are the priority — confirm real or retire.
2. **Eyes-on confirmation in Maningrida** (separate trip) — BHAC laundromat, 6 machines. Take photos. Fix cellular gateway / Particle telemetry while there.
3. **Eyes-on confirmation in Palm Island** (separate trip) — only Club Kuta is photo-confirmed. PICC visit overdue.
4. **Email Craige @ Speed Queen Laundry** for full FY25–FY26 order history. Resolve the 14-vs-25-rebate-machines discrepancy.
5. **Email Randle @ Centrecorp Foundation** to ask whether Centrecorp has funded any of the GB0-154 batch or other entries.
6. **Email Sally @ Snow Foundation** to confirm whether the Q2 2025 R&D grant (INV-0227 $110K) included any direct Snow-procured Speed Queen units.
7. **Investigate the 2026-03-09 telemetry pipeline break** — 6 named devices died on the same day. Refer to Openfields Solutions invoice INV-0008.

## Sources

- Asset register: Supabase v2 `public.assets` (project `cwsyhpiuepvdjtxaozwf`), pulled 2026-05-14.
- Telemetry: Supabase v2 `public.usage_logs`, 1,894 events pulled 2026-05-14.
- Xero invoices + bank txns: ACT infra Supabase (`tednluwflfhxyucgwigh`) `xero_invoices` and `xero_bank_transactions`, pulled 2026-05-14.
- Email threads: Gmail searches for "1300 Washer", "Speed Queen", "Sally Grimsley", "Bawinanga", "Anyinginyi", "Defy Design", "Openfields", May 2023 — May 2026.
- Companion docs: `wiki/outputs/2026-05-14-washing-machine-reconciliation.md`, `wiki/outputs/2026-05-14-washing-machine-master-ledger.md`.
