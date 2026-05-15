---
title: Washing Machine Final Reconciliation — magic numbers, locked
date: 2026-05-14
status: live
audience: Ben + Nic
supersedes: 2026-05-14-washing-machine-master-ledger.md (preliminary)
---

# Washing Machine Final Reconciliation

After full Supabase + Xero + Gmail + Calendar audit, plus Ben's sense-checking pass.

## The numbers (locked)

| Source of truth | Count |
|---|---:|
| **Machines we bought** (Xero ACCPAY, 1300 Washer / Speed Queen) | **18** |
| **BHAC machines we re-skinned** (not our hardware) | **+4** |
| **Goods machines deployed in register** (status = deployed) | **22** Goods-built + 6 BHAC-counted = 28 rows |
| Under investigation (TC orphan coreids) | 3 |
| Retired (duplicates + phantoms + missing) | 10 |
| **Total register rows** | **41** |

## Deployed by community (status = deployed)

| Community | Goods machines | BHAC re-skins | Total register rows |
|---|---:|---:|---:|
| Tennant Creek | 14 | 0 | 14 |
| Maningrida (BHAC laundromat) | 2 | 4 | 6 |
| Palm Island | 4 | 0 | 4 |
| Alice Springs (Oonchiumpa) | 3 | 0 | 3 |
| Darwin (Red Dust) | 1 | 0 | 1 |
| **Total** | **24** | **4** | **28** |

## The 6-machine gap (24 deployed Goods vs 18 bought)

**24 Goods-built deployed minus 18 invoiced via 1300 Washer = 6 machines unaccounted for.**

Possible sources for the 6 extras (need Nic to confirm):

1. **Centrecorp direct procurement** — Randle Walker said Centrecorp has delivered ~2,500 machines across Central Australia. They may have purchased some Speed Queens directly for Wilya Janta / Julalikari / Oonchiumpa partners that we register but didn't invoice.
2. **Snow Foundation direct procurement** — possible within the $110K Q2 2025 R&D grant (INV-0227).
3. **Pre-Xero history** — donations / early supply before May 2025 not in our financial records.
4. **Speed Queen / 1300 Washer loan stock** — vendor-provided test units never invoiced.
5. **Math error on the Dec 15 invoice** — $13,980 could be 5 machines at $2,796 each, not 4. That alone closes the gap to 5.

## What's locked

| ID | Name | Community | Telemetry | Notes |
|---|---|---|---|---|
| GB0-113 | Norman Frank | TC (Wilya Janta) | 🟢 today | Photo, locked |
| GB0-125 | Barkley Arts | TC | 🟢 5d | Photo, locked |
| GB0-132 | Jimmy Frank (nephew of Norman) | TC | 🔴 74d | Photo, locked |
| GB0-WM-DSS | Dianne Stokes | TC | 🔴 74d | EL storyteller, locked |
| GB0-154-2 | Nicole Frank | TC (Ford Cres) | 🔴 66d | Photo, locked |
| GB0-WM-RD | Red Dust Studios | Darwin | 🔴 74d | Location corrected, locked |
| GB0-135 | Minga Minga Rangers | Palm Island | ⚪ never | Locked |
| GB0-137 | Billow's House | Palm Island (Rodeo Grounds) | ⚪ never | Locked |
| GB0-139 | Eb Oui's Aunty | Palm Island | ⚪ never | Locked |
| GB0-147 | Klub Cuta (Mislam Sam) | Palm Island | ⚪ never | Photo, locked |

## What's still open (3 rows)

| ID | Community | Telemetry | What we need |
|---|---|---|---|
| GB0-WM-ORPHAN-c4b9 | TC (retagged) | 🔴 46d, 550 events | Identify physical household (this is the heaviest-used machine in the fleet — somebody is doing a lot of washing) |
| GB0-WM-ORPHAN-fe6c | TC (retagged) | 🔴 54d, 397 events | Identify physical household |
| GB0-WM-ORPHAN-689f | TC (retagged) | 🔴 226d, 38 events | Possibly a test rig, possibly real — investigate or retire |

## What's deployed but needs in-field name backfill (12 rows)

| ID range | Community | What's missing |
|---|---|---|
| GB0-154-1, 3-10 (9 records) | TC | Recipient names from the Dec 10-15 2025 Wilya Janta bush camp trip with Simon Quilty |
| GB0-136-1, 2, 3 | Alice Springs (Oonchiumpa) | Physical confirmation that 3 machines exist (vs 1 record entered 3x); update actual install date (register says 2025-08-12 but Ben was on Palm Island that day) |

## What's retired (10 rows)

| ID | Why |
|---|---|
| GB0-WM-PARTICLE-01 | Dup of GB0-WM-4E5 (same coreid) → merged into GB0-154-2 Nicole |
| GB0-WM-F25 | Merged into GB0-113 Norman |
| GB0-WM-4E5 | Merged into GB0-154-2 Nicole |
| GB0-WM-507 | Merged into GB0-125 Barkley |
| GB0-WM-098 | Merged into GB0-132 Jimmy Frank |
| GB0-WM-8D1 | Speculative merge into GB0-133 (then GB0-133 itself retired) |
| GB0-138 | Same physical machine as GB0-147 Klub Cuta |
| GB0-143-1 | Phantom — never existed |
| GB0-143-2 | Phantom — never existed |
| GB0-133 | Norman Frank's 2nd machine — delivered then went missing |

## Xero ledger (the gospel)

| Invoice | Date | $AUD | Machines | Vendor |
|---|---|---:|---:|---|
| I0014374 | 2025-05-12 | 2,995 | 1 | 1300 Washer (Speed Queen) |
| I0014375 | 2025-05-12 | 14,975 | 5 | 1300 Washer |
| I0014517 | 2025-05-29 | 14,975 | 5 | 1300 Washer |
| I0014891 | 2025-07-14 | 8,985 | 3 | 1300 Washer |
| (Dext, no #) | **2025-12-15** | **13,980** | **~4–5** | 1300 Washer (was tagged ACT-FM, corrected to ACT-GD 2026-05-14) |
| **TOTAL** | | **55,910** | **18** | |

## Outflows (invoiced to communities, Xero ACCREC, PAID + AUTHORISED)

| Date | Invoice | To | $ | WMs | Status |
|---|---|---|---:|---:|---|
| 2025-06-29 | INV-0240 | Snow Foundation (for BHAC Maningrida) | 16,600 | 2 new + 4 BHAC upgrades | PAID |
| 2025-10-21 | INV-0282 | Julalikari Council (TC) | 19,800 | 4 | PAID |
| 2026-01-20 | INV-0308 | Our Community Shed (TC) | 6,765 | 1 | PAID |
| 2026-05-18 | INV-0303 | Homeland School Co. (incl 40 beds) | 40,000 | 2 | AUTHORISED |

Total invoiced out: **9 new machines + 4 BHAC upgrades + 4 dryers**.

That leaves **18 − 9 = 9 machines not invoiced out** — these are the Wilya Janta direct, Dianne Stokes, GB0-154 batch, and Palm Island/Oonchiumpa rows that were either donated (Snow R&D grant covered cost), funded internally, or covered by the December bush camp logistics without a formal customer invoice.

## What changed today (2026-05-14)

- **Patched in Xero mirror:** Dec 15 1300 Washer invoice project_code `ACT-FM → ACT-GD`. Nic needs to mirror in Xero proper.
- **Locked 10 machines** as real (calendar + photo + telemetry triangulation).
- **Retired 10 records** as duplicates, phantoms, or confirmed missing.
- **Re-tagged** GB0-136-x community Palm Island → Alice Springs (was mis-tagged); orphans community Palm Island → Tennant Creek.
- **Renamed** GB0-135 → Minga Minga Rangers, GB0-137 → Billow's House, GB0-139 → Eb Oui's Aunty, GB0-147 → Klub Cuta (Mislam Sam), GB0-WM-DSS → Dianne Stokes.
- **Made `/bed/[id]` product-aware** — washing machine QR scans now show machine-themed content instead of bed content.

## Action items for Nic to close the loop

1. Confirm where the **Dec 2025 GB0-154 batch (10 machines)** came from financially. If it's from existing 1300 Washer stock + the Dec 15 purchase, the gap shrinks to ~5 machines. If it's from Centrecorp or Snow direct, it's a separate funding line.
2. Add **Project Tracking = "ACT-GD — Goods"** to the Dec 15 1300 Washer invoice in Xero proper.
3. Confirm GB0-133 status — is it really gone, or might it have been recovered?
4. Identify the 3 TC orphans (c4b9, fe6c, 689f) on the next TC trip — these are real, heavy-use machines that need to be re-attached to households in the register.
5. Backfill names on the 9 GB0-154-* "Pending Assignment" rows on next TC trip.
