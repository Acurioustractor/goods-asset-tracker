# Fleet Alignment. Assets vs Telemetry, May 2026

Pulled 2026-05-05 to answer: which deployed washing machines are connected, which are dark, which signals are flying around without a registered home, and what to do about each gap.

## Headline gaps

| Direction | Count | Meaning |
|---|---:|---|
| Asset → telemetry | 10 | Asset has a `machine_id` and we have events for it |
| Asset → no telemetry | 0 | Asset has a `machine_id` but zero events ever (likely placeholder name, no real device) |
| Asset has no `machine_id` | 28 | No telemetry hardware fitted, never has been |
| Orphan coreid | 3 | Telemetry rolls in for a coreid not registered in `assets` |

## Every washing-machine asset, telemetry status

| Asset | Community | Name / Household | machine_id | Events | Last seen | Status |
|---|---|---|---|---:|---|---|
| `GB0-150-1` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-150-2` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-150-3` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-150-4` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-150-5` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-150-6` | Maningrida | Maningrida Laundry | `.` | 0 |, | no telemetry HW |
| `GB0-135` | Palm Island | Rangers Station | `.` | 0 |, | no telemetry HW |
| `GB0-143-1` | Palm Island | Additional Washers | `.` | 0 |, | no telemetry HW |
| `GB0-143-2` | Palm Island | Additional Washers | `.` | 0 |, | no telemetry HW |
| `GB0-136-1` | Palm Island | Oochiumpa | `.` | 0 |, | no telemetry HW |
| `GB0-136-2` | Palm Island | Oochiumpa | `.` | 0 |, | no telemetry HW |
| `GB0-136-3` | Palm Island | Oochiumpa | `.` | 0 |, | no telemetry HW |
| `GB0-137` | Palm Island | Workers House | `.` | 0 |, | no telemetry HW |
| `GB0-138` | Palm Island | Luella Bligh | `.` | 0 |, | no telemetry HW |
| `GB0-139` | Palm Island | Ebs Aunty | `.` | 0 |, | no telemetry HW |
| `GB0-147` | Palm Island | Club Kuta machine / Mislam | `.` | 0 |, | no telemetry HW |
| `GB0-WM-098` | Tennant Creek | 098 | `e00fce682db6d32e15e86098` | 3 | 2026-03-01 | named placeholder (only offline batch event) |
| `GB0-WM-4E5` | Tennant Creek | 4E5 | `e00fce687ae01d08f95694e5` | 342 | 2026-04-21 | silent 13d |
| `GB0-WM-507` | Tennant Creek | 507 | `e00fce68c2ba447b66bcd507` | 30 | 2026-03-30 | silent 35d |
| `GB0-WM-8D1` | Tennant Creek | 8D1 | `8D1` | 1 | 2026-03-01 | named placeholder (only offline batch event) |
| `GB0-WM-DSS` | Tennant Creek | Dian Stokes Sons House | `Dian Stokes Sons House` | 1 | 2026-03-01 | named placeholder (only offline batch event) |
| `GB0-WM-F25` | Tennant Creek | F25 | `e00fce684086eb2aba8d4f25` | 468 | 2026-05-05 | **reporting** |
| `GB0-WM-PARTICLE-01` | Tennant Creek | Particle Test Device (Stephen) | `.` | 0 |, | no telemetry HW |
| `GB0-WM-RD` | Tennant Creek | Red Dust | `Red Dust` | 1 | 2026-03-01 | named placeholder (only offline batch event) |
| `GB0-113` | Tennant Creek | Norman | `Norms House` | 23 | 2026-03-09 | silent 56d |
| `GB0-125` | Tennant Creek | Barkley Arts | `Barkley Arts` | 1 | 2026-03-01 | named placeholder (only offline batch event) |
| `GB0-132` | Tennant Creek | Jimmy - Washer | `.` | 0 |, | no telemetry HW |
| `GB0-133` | Tennant Creek | Jimmy’s Uncle - Washer | `.` | 0 |, | no telemetry HW |
| `GB0-154-1` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-10` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-3` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-4` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-5` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-6` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-7` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-8` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-9` | Tennant Creek | Pending Assignment | `.` | 0 |, | no telemetry HW |
| `GB0-154-2` | Tennant Creek | Nicole Frank | `Nicoles House` | 5 | 2026-03-09 | silent 56d |

## Orphan coreids (telemetry without an asset)

These devices were physically installed somewhere and used heavily for months, but `assets` has no row for them. Until we identify them, their wash counts are not credited to any community on the dashboard.

| Coreid | First seen | Last seen | Events | Peak cycle counter | Plausible site |
|---|---|---|---:|---:|---|
| `e00fce68c4b97878b9a2b323` | 2025-08-27 | 2026-03-29 | 550 | 48 | Palm Island, most likely Rangers Station or Aug 5 / Aug 12 wave (timing fits, 7 months of heavy use) |
| `e00fce68fe6c048ccec66ab1` | 2025-09-15 | 2026-03-21 | 397 |, | Palm Island. Aug 12 wave (Oochiumpa / Workers House / Luella Bligh / Ebs Aunty), commissioned 5 weeks after install |
| `e00fce689f1dd0daf5987cf2` | 2025-09-15 | 2025-09-30 | 38 |, | Palm Island, same Sep 15 commissioning batch as `fe6c…`, ran two weeks then died (faulty unit?) |

## Palm Island deployment candidates (no telemetry mapped)

| Asset | Name | Household | Supplied |
|---|---|---|---|
| `GB0-135` | Rangers Station |, | 2025-07-09 |
| `GB0-143-2` | Additional Washers |, | 2025-08-05 |
| `GB0-143-1` | Additional Washers |, | 2025-08-05 |
| `GB0-136-1` | Oochiumpa |, | 2025-08-12 |
| `GB0-136-2` | Oochiumpa |, | 2025-08-12 |
| `GB0-136-3` | Oochiumpa |, | 2025-08-12 |
| `GB0-137` | Workers House |, | 2025-08-12 |
| `GB0-138` | Luella Bligh |, | 2025-08-12 |
| `GB0-139` | Ebs Aunty |, | 2025-08-12 |
| `GB0-147` | Club Kuta machine | Mislam | 2025-09-28 |

## Proposed alignment fixes (require Ben sign-off)

### A. Park the 3 orphan coreids in `assets` so their data is credited

Conservative, creates *new* asset rows tagged `community='Palm Island'` (most likely) and `status='under_investigation'`. Once you identify the household, just `UPDATE assets SET name=..., contact_household=...` on each row.

```sql
INSERT INTO assets (unique_id, id, name, machine_id, community, place, product, status, notes)
VALUES
  ('GB0-WM-ORPHAN-c4b9', 'GB0-WM-ORPHAN-c4b9',
   'Unknown Palm Island washer (550 events Aug 2025 - Mar 2026)',
   'e00fce68c4b97878b9a2b323', 'Palm Island', 'Palm Island, QLD',
   'Washing Machine', 'under_investigation',
   'Telemetry orphan: first signal 2025-08-27, last 2026-03-29, peak cycle counter 48. Likely physical site is one of: Rangers Station / Additional Washers / Oochiumpa / Workers House / Luella Bligh / Ebs Aunty.'),
  ('GB0-WM-ORPHAN-fe6c', 'GB0-WM-ORPHAN-fe6c',
   'Unknown Palm Island washer (397 events Sep 2025 - Mar 2026)',
   'e00fce68fe6c048ccec66ab1', 'Palm Island', 'Palm Island, QLD',
   'Washing Machine', 'under_investigation',
   'Telemetry orphan: first signal 2025-09-15, last 2026-03-21. Same commissioning batch as 689f.'),
  ('GB0-WM-ORPHAN-689f', 'GB0-WM-ORPHAN-689f',
   'Unknown Palm Island washer (38 events Sep 2025 only)',
   'e00fce689f1dd0daf5987cf2', 'Palm Island', 'Palm Island, QLD',
   'Washing Machine', 'under_investigation',
   'Telemetry orphan: ran 2025-09-15 to 2025-09-30 only (38 events) then went permanently silent. Possible faulty unit, swap-out, or test bench.');
```

### B. Cross-check 507, was it originally Palm Island Club Kuta?

`e00fce68c2ba447b66bcd507` first reported on **2025-09-28**, the *same day* `GB0-147 Club Kuta machine / Mislam` was supplied. It is currently registered to `GB0-WM-507` in Tennant Creek. Either:

1. This is coincidence (the supply date and the device's first wifi-handshake landed on the same day in different states), or
2. 507 was installed at Club Kuta and later moved to Tennant Creek, or
3. The asset register's date for Club Kuta is wrong.

Action: **Ben to confirm** before any update. If 507 was genuinely Palm Island originally, we'd remap as:

```sql
-- ONLY IF 507 was actually Club Kuta:
UPDATE assets
  SET machine_id = 'e00fce68c2ba447b66bcd507',
      notes = COALESCE(notes,'') || E'\n2025-09-28 → 2026-03-30 telemetry from coreid 507 (originally registered as GB0-WM-507 in TC).'
  WHERE unique_id = 'GB0-147';
UPDATE assets SET machine_id = NULL WHERE unique_id = 'GB0-WM-507';
```

### C. Decide on 'named placeholder' machine_ids

Eight Tennant Creek assets have a human-readable `machine_id` (Norms House, Nicoles House, Barkley Arts, 8D1, Dian Stokes Sons House, Red Dust). They produced one or two `offline`/`heartbeat` rows from a March 2026 batch sweep, not real telemetry. Options:

- **Leave as-is.** They count as 'silent machines' in current dashboards. Honest about the status.
- **Null out the `machine_id`.** They drop off `get_fleet_machine_stats` and only appear in `get_all_washing_deployments` as `no_telemetry_hw`. Cleaner picture but loses the historical hint that someone *intended* to telemeter them.

Recommendation: leave as-is for now; revisit when you decide whether those households are getting real Particle hardware.

### D. Maningrida

No coreid first-appearance landed in October 2025 when Maningrida was supplied, and no row in `usage_logs` has ever named a Maningrida site or asset. Conclusion: **no Particle device was ever fitted** to a Maningrida machine. If you remember one being commissioned, it never made it to the database, this is a hardware/process gap to chase, not a data fix.
