---
title: WM Audit — Talk to Nic briefing (one page)
date: 2026-05-14
status: live
audience: Ben + Nic conversation
---

# Washing Machine Audit — Talk to Nic

A single page to walk Nic through. Everything below is **live in Supabase right now**.

## The headline (numbers locked)

- **18 machines bought** from 1300 Washer / Speed Queen — $55,910 total (Xero ACCPAY)
- **+ 4 BHAC machines re-skinned** (BHAC owns, we added cabinets)
- **= 22 Goods has touched** (most-defensible external number)
- Asset register: **28 deployed · 3 under-investigation · 10 retired = 41 total**

## What we got RIGHT (10 locked machines — confirmed real)

| ID | Name | Where | Evidence |
|---|---|---|---|
| GB0-113 | Norman Frank | TC (Wilya Janta) | Photo 2025-07-02 + telemetry today (495 events) |
| GB0-125 | Barkley Arts | TC | Photo 2025-07-02 + telemetry 5d ago (36 events) |
| GB0-132 | Jimmy Frank (nephew of Norman) | TC | Photo 2025-07-02 + brief telemetry (3 events) |
| GB0-WM-DSS | Dianne Stokes | TC | EL storyteller + named telemetry 2026-03 |
| GB0-154-2 | Nicole Frank | TC (Ford Crescent) | Photo + 5 telemetry events Mar 2026 |
| GB0-WM-RD | Red Dust Studios | **Darwin** (corrected) | Brief telemetry |
| GB0-135 | Minga Minga Rangers | Palm Island | Calendar PI trip Aug 2025 |
| GB0-137 | Billow's House | PI (Rodeo Grounds) | Calendar PI trip Aug 2025 |
| GB0-139 | Eb Oui's Aunty | Palm Island | Calendar PI trip Aug 2025 |
| GB0-147 | Klub Cuta (Mislam Sam) | Palm Island | Photo 2025-09-28 + calendar PI ferry trip |

## What we got WRONG (10 cleanups already applied)

| ID | What was wrong | What we did |
|---|---|---|
| GB0-WM-PARTICLE-01 | Duplicate of GB0-WM-4E5 (same coreid) | **Retired** |
| GB0-WM-F25, 4E5, 507, 098, 8D1 | All 5 were duplicate register rows of physical machines already locked under household names | **Retired**, telemetry merged |
| GB0-138 "Klub Kuta (Luella Bligh)" | Same physical machine as GB0-147 | **Retired** |
| GB0-143-1, 143-2 "Additional Washers" | Phantom rows (never existed) | **Retired** |
| GB0-133 "Jimmy's Uncle" / Norman's 2nd | Delivered then went missing | **Retired** |
| GB0-136-1/2/3 spelled "Oochiumpa" | Typo for "Oonchiumpa" | **Fixed** |
| GB0-136-1/2/3 tagged Palm Island | Should be Alice Springs | **Re-tagged** |
| GB0-WM-RD tagged Tennant Creek | Should be Darwin | **Re-tagged** |
| 3 TC orphan coreids tagged Palm Island | Should be Tennant Creek | **Re-tagged**, names + place cleaned |
| GB0-135 "Rangers Station" | Should be Minga Minga Rangers | **Renamed** |
| GB0-137 "Workers House" | Should be Billow's House (Rodeo Grounds) | **Renamed + place updated** |
| GB0-139 "Ebs Aunty" | Should be Eb Oui's Aunty | **Renamed** |
| GB0-147 "Club Kuta machine" | Klub Cuta (Mislam Sam) | **Renamed** |
| GB0-WM-DSS "Dian Stokes Sons House" | Dianne Stokes (EL storyteller) | **Renamed** |
| Dec 15 1300 Washer invoice in Xero | Tagged ACT-FM instead of ACT-GD | **Patched in Supabase mirror** — needs same change in Xero proper |
| /bed/[id] page showed bed content for WM scans | | **Made product-aware** |

## What's STILL OPEN — 4 things for Nic

### 1. Where did the December 2025 TC batch of 10 machines come from?
The asset register shows 10 rows (GB0-154-1 through 10) added on 2025-12-13 during the Wilya Janta "Simon in TC Bush Camp" trip. Calendar confirms the trip was real. **The 6-machine gap between 18-bought and 24-deployed almost entirely turns on where these came from:**
- **Option A:** From existing 1300 Washer stock + Dec 15 invoice (closes most of the gap)
- **Option B:** Centrecorp direct procurement (Randle's 2,500-machine program)
- **Option C:** Snow Foundation direct procurement from Q2 2025 R&D grant
- **Option D:** Some mix of the above

### 2. GB0-133 — Norman Frank's 2nd machine
Currently **retired as "delivered then went missing"**. Two questions:
- Is it really gone, or might it be recovered on the next TC trip?
- Was it ever a separate machine, or is it the same as GB0-113 (i.e., Norman has 1 machine, not 2)?

### 3. The 3 TC orphan coreids — heavy telemetry, no household assigned
| Coreid | Events | Last seen | What we know |
|---|---:|---|---|
| c4b9 | **550** | 46d ago | Heaviest-used machine in fleet — 1.7 loads/day average |
| fe6c | 397 | 54d ago | Real TC household, steady use Sep 2025 → Mar 2026 |
| 689f | 38 | 226d ago | Brief use, then silent — possibly a test rig |

These are real physical machines doing real work. Just no name on them. The c4b9 is doing more washing than any other machine we have — somebody important relies on it.

### 4. Backfill names on 9 "Pending Assignment" rows
GB0-154-1, 3, 4, 5, 6, 7, 8, 9, 10 — all entered 2025-12-13 with no recipient name. Wilya Janta would know who got each one.

## Current state — DEPLOYED (28 rows)

### Tennant Creek (14)
- 📷 GB0-113 **Norman Frank** · 2025-07-02 photo · 🟢 active telemetry today
- 📷 GB0-125 **Barkley Arts** · 2025-07-02 photo · 🟢 5d ago
- 📷 GB0-132 **Jimmy Frank** · 2025-07-02 photo · 🔴 74d
- GB0-WM-DSS **Dianne Stokes** · 🔴 74d
- 📷 GB0-154-2 **Nicole Frank** (Ford Cres) · 🔴 66d
- GB0-154-1, 3, 4, 5, 6, 7, 8, 9, 10 — **9 × "Pending Assignment"** from Dec 2025 bush camp

### Palm Island (4)
- GB0-135 **Minga Minga Rangers**
- GB0-137 **Billow's House** (Rodeo Grounds)
- GB0-139 **Eb Oui's Aunty**
- 📷 GB0-147 **Klub Cuta (Mislam Sam)**

### Maningrida (6) — BHAC laundromat
- GB0-150-1, 2 = **our 2 new builds**
- GB0-150-3, 4, 5, 6 = **BHAC's own Speed Queens, we re-skinned**

### Alice Springs (3) — Oonchiumpa
- GB0-136-1, 2, 3 — **all 3 currently flagged "needs physical verification"** (register supply_date 2025-08-12 is the day Ben was on PI, not Alice — these were probably remote register entries)

### Darwin (1)
- GB0-WM-RD **Red Dust Studios**

## Current state — UNDER INVESTIGATION (3)

All 3 TC orphan coreids — see open question #3 above.

## Current state — RETIRED (10)

| ID | Reason |
|---|---|
| GB0-WM-PARTICLE-01 | Dup of 4E5 |
| GB0-WM-F25 | = Norman (GB0-113) |
| GB0-WM-4E5 | = Nicole (GB0-154-2) |
| GB0-WM-507 | = Barkley (GB0-125) |
| GB0-WM-098 | = Jimmy Frank (GB0-132) |
| GB0-WM-8D1 | Speculative = Norman's 2nd |
| GB0-138 | = Klub Cuta (GB0-147) |
| GB0-143-1 | Phantom (never existed) |
| GB0-143-2 | Phantom (never existed) |
| GB0-133 | Norman's 2nd — missing |

## Where to view + edit

- Live admin register: **`/admin/assets`** (filter `product = Washing Machine`)
- Per-machine edit page: **`/admin/assets/{unique_id}`** (Ben's QR-friendly mobile edit view)
- Master listing (full per-row detail): `wiki/outputs/2026-05-14-washing-machine-master-listing.md`
- Final reconciliation (counts + math): `wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md`
- Full history (timeline of every purchase + trip): `wiki/outputs/2026-05-14-washing-machine-full-history.md`
- Roll-call (one-by-one sense-check): `wiki/outputs/2026-05-14-washing-machine-roll-call.md`

## Nic's homework after the call

1. Confirm Dec 2025 batch funding source (closes the 6-machine gap)
2. Apply Project Tracking = "ACT-GD — Goods" to Dec 15 1300 Washer invoice in Xero proper
3. Sense-check the 10 retired rows — anything wrong?
4. Sense-check the 10 locked rows — anything wrong?
5. Help backfill 9 GB0-154-* names on next TC trip
6. Help identify 3 orphan coreids on next TC trip
