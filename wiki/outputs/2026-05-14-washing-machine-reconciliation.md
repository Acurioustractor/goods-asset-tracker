---
title: Washing Machine Asset ↔ Telemetry Reconciliation
date: 2026-05-14
status: live
audience: Ben, Nic, field team for Alice + Utopia trip
---

# Washing Machine Reconciliation

Source-of-truth pull from `public.assets` (41 WM records) and `public.usage_logs` (1,894 events, 14 distinct machine_ids — 1 of those is `test123`, discarded).

## Three numbers you actually have

| Number | What it means |
|-------:|---|
| **41** | rows in the asset register tagged as Washing Machine |
| **13** | physical devices that have ever produced a telemetry event |
| **3**  | devices reporting in the last 7 days (F25, 4E5, 507) |

The gap between **41 register entries** and **13 telemetry-confirmed devices** is the question: how many machines do we actually own? Two scenarios:

- **Optimistic:** 38 (or 41) machines exist; 28+ have broken / never-commissioned cellular gateways → connectivity sweep needed.
- **Pessimistic:** the register over-counts. Some "deployed" rows are phantom batch entries (especially Maningrida x6 and TC GB0-154 x9 "Pending Assignment") that may not yet be physically installed.

Only an in-field sweep can tell us which.

## Telemetry-confirmed devices (13)

| machine_id | events | first seen | last seen | silent (d) | Asset match |
|---|---:|---|---|---:|---|
| `e00fce68c4b97878b9a2b323` | 550 | 2025-08-27 | 2026-03-29 | 46 | `GB0-WM-ORPHAN-c4b9` |
| `e00fce684086eb2aba8d4f25` | 495 | 2025-11-17 | 2026-05-13 | **1** | `GB0-WM-F25` |
| `e00fce68fe6c048ccec66ab1` | 397 | 2025-09-15 | 2026-03-21 | 54 | `GB0-WM-ORPHAN-fe6c` |
| `e00fce687ae01d08f95694e5` | 343 | 2025-09-15 | 2026-05-09 | 5 | `GB0-WM-4E5` (= PARTICLE-01) |
| `e00fce689f1dd0daf5987cf2` | 38 | 2025-09-15 | 2025-09-30 | **226** | `GB0-WM-ORPHAN-689f` |
| `e00fce68c2ba447b66bcd507` | 35 | 2025-09-28 | 2026-05-09 | 5 | `GB0-WM-507` |
| `Norms House` | 23 | 2026-03-01 | 2026-03-09 | 66 | `GB0-113` (Norman) |
| `Nicoles House` | 5 | 2026-03-01 | 2026-03-09 | 66 | `GB0-154-2` (Nicole Frank) |
| `e00fce682db6d32e15e86098` | 3 | 2025-09-19 | 2026-03-01 | 74 | `GB0-WM-098` |
| `Red Dust` | 1 | 2026-03-01 | 2026-03-01 | 74 | `GB0-WM-RD` |
| `Dian Stokes Sons House` | 1 | 2026-03-01 | 2026-03-01 | 74 | `GB0-WM-DSS` |
| `8D1` | 1 | 2026-03-01 | 2026-03-01 | 74 | `GB0-WM-8D1` |
| `Barkley Arts` | 1 | 2026-03-01 | 2026-03-01 | 74 | `GB0-125` |

**Pattern:** the 6 "named" devices (Norms House, Nicoles House, Barkley Arts, Red Dust, DSS, 8D1) all stopped reporting on the same day — 2026-03-09. Looks like a backend pipeline change broke them on that date and never got restored. Worth investigating before the trip.

**3 actively reporting now:** F25 (TC, today), 4E5 (TC, 5d ago), 507 (TC, 5d ago). All Tennant Creek. Zero active telemetry from Palm Island or Maningrida.

## Silent machines — 31 records, zero telemetry ever

### Maningrida (6) — entire site dark
- `GB0-150-1` through `GB0-150-6`: all named "Maningrida Laundry"; likely a single commercial 6-bay install. No telemetry ever. Either no cellular gateway commissioned, or commissioned and broken since install.

### Palm Island (10 named records + 3 orphans = 13)
- `GB0-135` Rangers Station, `GB0-137` Workers House, `GB0-138` Luella Bligh, `GB0-139` Ebs Aunty, `GB0-143-1/2` Additional Washers, `GB0-147` Club Kuta — 7 site-named records, none have ever phoned home.
- `GB0-136-1/2/3` "Oochiumpa" — **MIS-TAGGED**: community=Palm Island but place=Alice Springs. Oonchiumpa is in Alice Springs. These should be re-tagged community=Alice Springs (Oonchiumpa hosting).
- 3 orphan coreids (c4b9, fe6c, 689f) currently tagged Palm Island under `status=under_investigation` — the coreid format strongly suggests they're TC physical devices that broadcasted from TC, not PI machines.

### Tennant Creek (12 silent)
- `GB0-132` Jimmy, `GB0-133` Jimmy's Uncle — never reported.
- `GB0-154-1, 3, 4, 5, 6, 7, 8, 9, 10` — 9 of 10 in this 13/12/2025 batch are status=deployed but name=Pending Assignment. **Are they physically deployed, or sitting in storage?** Only `GB0-154-2` (Nicole Frank) has any sign of life.
- `GB0-WM-PARTICLE-01` — **confirmed duplicate** of `GB0-WM-4E5`. Same physical device, same coreid. RETIRE.

## Issues to fix in Supabase (safe, mechanical)

1. **Retire `GB0-WM-PARTICLE-01`** — set `status=retired`, add note "Merged into GB0-WM-4E5 (same coreid e00fce687ae01d08f95694e5)". Stops double-counting.
2. **Re-tag GB0-136-1/2/3** — `community = 'Alice Springs'` (place was Alice Springs all along; PI tag was wrong).
3. **Re-tag the 3 orphans** as TC pending physical confirmation — change `community = 'Tennant Creek'` and note "telemetry orphan, physical location unknown, last broadcast YYYY-MM-DD".

After those three changes: **38 deployed → 36** WM records, with 1 retired and the orphans properly investigated.

## Full-sweep plan for the Alice + Utopia trip (week of 2026-05-19)

A printable checklist organised by location so the team can confirm physical reality:

### Alice Springs / Utopia / Oonchiumpa (3 machines to verify)
- [ ] GB0-136-1, -2, -3 — Oonchiumpa office — confirm physically present, photograph serial plate
- [ ] Update Supabase community to "Alice Springs"

### Tennant Creek (19 records to verify)
- [ ] Re-confirm F25 location (1 actively reporting — known good)
- [ ] Re-confirm 4E5 and 507 location (last reported 5 days ago)
- [ ] Sweep all `GB0-154-*` (10 records) — which are physically installed, which are in storage? Update name field with recipient.
- [ ] Verify "Named" devices (Norms House, Nicoles House, DSS, RD, Barkley Arts, 8D1) — are they still where the asset says? Why did the named telemetry pipeline die on 2026-03-09?
- [ ] Investigate the 3 orphan coreids (c4b9, fe6c, 689f) — match coreids to physical devices

### Palm Island (10 to verify — needs separate trip)
- [ ] Confirm 7 site-named installs (Rangers, Workers, Luella, Ebs Aunty, Additional x2, Club Kuta) are physically present
- [ ] Check cellular gateway / Particle status on each (zero have ever reported)

### Maningrida (6 to verify — needs separate trip)
- [ ] Confirm Maningrida Laundry actually has 6 machines installed (vs register entry being optimistic)
- [ ] Diagnose connectivity — 6 machines, 0 telemetry is suspicious

## Sweep tooling we have

- **Admin UI:** `/admin/assets` — filter `product = Washing Machine`, sort by community. Already live.
- **Per-machine investigation:** `/admin/fleet/[machine_id]` — pre-existing page from previous fleet diagnostic work
- **CSV manifest:** can be generated per-community from `/admin/assets` table (TODO: add export-CSV button to that page if useful for printout)

## Suggested follow-ups (not done in this session)

- Add a "Telemetry" column to `/admin/assets` for WM rows: green dot if seen in last 7d, amber 7-30d, red >30d, gray "never". One join with `usage_logs`, simple to add.
- Build `/admin/assets/audit-print` route that prints a paper checklist per community for the field team.
- Apply the 3 Supabase fixes above (PARTICLE-01 retire, GB0-136 retag, orphans retag) — small, reversible.
