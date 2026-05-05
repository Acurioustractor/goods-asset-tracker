# Fleet Connectivity Audit — May 2026

Snapshot taken 2026-05-05. Purpose: explain who is connected, who is dark, why
the dashboard was lying, and what to do about each gap.

## TL;DR

- **38 washing machines deployed across 8 communities** in `assets`, but the
  fleet dashboard only ever showed the 10 Tennant Creek units that had a
  Particle device paired to them.
- **Only 1 machine is currently reporting** (F25 in Tennant Creek). 50 of the
  last 51 events came from F25. The other 9 telemetry-enabled machines have
  been silent for 14–65 days.
- **Palm Island (10) and Maningrida (6) have zero telemetry hardware fitted.**
  They show up in `assets` but no Particle/Openfields device was ever paired,
  so no signals will ever come from them under the current setup.
- **Two bugs were masking the picture:** (1) Leaflet SSR crash blanked the top
  half of `/admin/fleet`; (2) the webhook stored `event_type='zapier-new-wash'`
  instead of `'cycle_complete'`, so KPIs and the daily rollup read zero even
  when F25 was busy.
- **Three "ghost" Particle coreids** sent thousands of events for ~6 months
  but are not in `assets`. Could be devices swapped out, devices fitted at a
  site we forgot to register, or test units. They need triage.

## Where the machines actually are

| Community     | Total | With Particle HW | Reporting | Source of trust |
|---|---:|---:|---:|---|
| Tennant Creek | 21 | 8 | 1 (F25) | `assets` + `usage_logs` |
| Palm Island   | 10 | 0 | 0 | `assets` only |
| Maningrida    | 6  | 0 | 0 | `assets` only |
| Other (test) | 1 | 0 | 0 | `assets` only |
| **Total** | **38** | **8** | **1** | |

### Tennant Creek deployment timeline

- 2025-07-02 — Norman (Norm's House), Barkley Arts, Jimmy, Jimmy's Uncle (4)
- 2025-09-15 → 2025-11-17 — Particle devices come online (4E5, 507, 098, F25, plus 3 ghost coreids)
- 2025-12-03 — 10-machine "GB0-154" shipment lands ("Pending Assignment" except Nicole Frank)
- 2025-12-13 — Nicole Frank assigned to GB0-154-2

### Palm Island deployment timeline

- 2025-07-09 — Rangers Station
- 2025-08-05 — Additional Washers ×2
- 2025-08-12 — Oochiumpa ×3, Workers House, Luella Bligh, Ebs Aunty
- 2025-09-28 — Club Kuta machine

All 10 are tracked manually only — no Particle device, no signal.

### Maningrida deployment timeline

- 2025-10-20 — Maningrida Laundry ×6

All 6 are manual-tracking only.

## How signals flow

```
Particle Photon (washer)
   → Particle Cloud event
   → Zapier (most active path) OR direct Particle Integration webhook
   → POST https://www.goodsoncountry.com/api/webhooks/particle
   → usage_logs row
   → daily_machine_rollups (cron /api/cron/fleet-rollup, every 6h)
   → /admin/fleet (KPI RPC + machine stats RPC)
```

There is also `/api/webhooks/openfields` for the Openfields Solutions feed —
HMAC signed — but no live data has been observed coming through this path
recently.

## Per-machine signal history (live data, 2026-05-05)

| machine_id | first seen | last seen | events | days silent |
|---|---|---|---:|---:|
| F25 (`...4086eb2aba8d4f25`) | 2025-11-17 | **2026-05-05** | 252 | <1 |
| 4E5 (`...7ae01d08f95694e5`) | 2025-09-15 | 2026-04-21 | 79 | 14 |
| 507 (`...c2ba447b66bcd507`) | 2025-09-28 | 2026-03-30 | 30 | 36 |
| **ghost** (`...c4b97878b9a2b323`) | 2025-08-27 | 2026-03-27 | 296 | 39 |
| **ghost** (`...fe6c048ccec66ab1`) | 2025-09-15 | 2026-03-21 | 279 | 45 |
| 098 (`...2db6d32e15e86098`) | 2025-09-19 | 2026-03-01 | 3 | 65 |
| **ghost** (`...689f1dd0daf5987cf2`) | 2025-09-15 | 2025-09-30 | 28 | 217 |
| Norms House (named) | 2026-03-01 | 2026-03-09 | 23 | 57 |
| Nicoles House (named) | 2026-03-01 | 2026-03-09 | 5 | 57 |
| Barkley / 8D1 / Dian / Red Dust (named) | 2026-03-01 | 2026-03-01 | 1 each | 65 |

## Bugs found and fixed

### Bug 1 — Leaflet SSR crash (`/admin/fleet` top half blank)
- File: `v2/src/app/admin/fleet/fleet-map.tsx`
- Cause: top-level `import L from 'leaflet'` ran during server render; Leaflet
  references `window` at module-load → `ReferenceError: window is not defined`
  → React renders fallback only for the upper segment, hiding header, KPI
  cards, map, activity chart.
- Fix: defer Leaflet import to inside `useEffect` so it only ever runs in the
  browser. Commit `cb78634` on `codex/goods-qbe-signoff`.

### Bug 2 — `event_type` drift (KPIs read zero)
- File: `v2/src/app/api/webhooks/particle/route.ts`
- Cause: Zapier forwards Particle wash events with `event="zapier-new-wash"`,
  but `mapEventType()` only knew about `wash_event`. Result: 212 historical
  rows stored as `zapier-new-wash`. The KPI RPC, the machine-stats RPC, and
  the `daily_machine_rollups` materialised view all filter on
  `event_type = 'cycle_complete'` → those 212 rows are invisible to the
  dashboard. F25 has 8 washes this week but "Total Washes" reads 0.
- Fix: add `'zapier-new-wash'` to the `mapEventType` switch (future writes
  normalised on insert) plus a one-shot UPDATE migration to rename the 212
  historical rows + refresh the rollup view. Migration file:
  `supabase/migrations/20260505000001_fleet_event_type_normalisation.sql`.

### Bug 3 — Dashboard hides 28 of 38 deployments
- File: `v2/supabase/migrations/20260322000001_fleet_aggregations.sql`
- Cause: `get_fleet_machine_stats()` ends with `WHERE a.machine_id IS NOT
  NULL`, so any washer without a paired Particle/named telemetry id falls off
  the dashboard. That excludes every Palm Island and Maningrida unit and most
  of the Dec-2025 Tennant Creek shipment.
- Fix: new RPC `get_all_washing_deployments()` (returns every washing-machine
  asset with a derived `connectivity_status` of
  `reporting | lagging | silent | never_reported | no_telemetry_hw |
  pending_assignment`). Migration:
  `supabase/migrations/20260505000002_all_washing_deployments_rpc.sql`. New UI
  component `DeploymentsByCommunity` shows per-community counts + drilldown.

## Things that still need a human decision

### 1. Triage the 3 ghost Particle coreids
These were active for months but are not in `assets`. Until they're claimed,
they're orphan signals.

- `e00fce68c4b97878b9a2b323` — 296 events Aug 2025 → 2026-03-29. Last cycle
  count 48 (heavy daily use). **Likely a real deployed machine somewhere.**
- `e00fce68fe6c048ccec66ab1` — 279 events Sep 2025 → 2026-03-21. Mix of
  cycles + heartbeats.
- `e00fce689f1dd0daf5987cf2` — 28 events Sep 2025 only. Possibly a test or
  swapped-out unit.

Action: Ben to confirm what each coreid was. Once known, INSERT/UPDATE rows
in `assets` so they land on the dashboard.

### 2. Decide the silent-fleet response
9 of 10 telemetry-enabled Tennant Creek machines have stopped reporting. The
named-only ones (Barkley Arts, 8D1, Dian Stokes Sons House, Red Dust) only
ever recorded a single `offline` event on 2026-03-01 — they may have never
had real Particle hardware behind their human-readable `machine_id`. Triage
order:
1. **4E5** (last seen 14d ago) — most recently healthy, easiest to recover.
2. **507** (36d ago).
3. **098** (65d, only 3 events ever).
4. Named-only machines — confirm whether hardware was ever installed.

For each: check Particle Cloud console for last-seen + signal strength,
verify Zapier zap is enabled, then site visit if no remote fix lands.

### 3. Decide whether Palm Island / Maningrida should get telemetry
Currently they don't, by choice or by gap. The wiki note in
`wiki/articles/products/washing-machine.md` says telemetry is "useful for
fleet learning, but it should not be overdescribed as a complete live fleet
system yet" — i.e. selective, not universal. If a Palm Island laundry should
report, hardware needs to be shipped + fitted + paired. Otherwise the
dashboard's `no_telemetry_hw` badge is the correct steady state.

### 4. Stale `machine_commentary` rows
Every row in `machine_commentary` has `created_at = 2026-03-09T21:37:10.532872`
— a one-shot batch run from March 9. The "5 days ago" / "3 days ago" /
"Not reporting this week" notes the dashboard surfaces are *frozen as of
March 9*, not live observations. They should be re-generated on a schedule
(weekly cron) or removed if the operational-notes job has been retired.

## What to do next (ordered by impact)

1. **Apply the two new migrations** (`20260505000001`, `20260505000002`) and
   merge the webhook + UI changes onto `main`. That unblocks accurate KPIs
   and the comprehensive deployment view.
2. **Cherry-pick or merge `cb78634`** so prod stops serving the broken-map
   page.
3. **Triage the 3 ghost coreids** with Ben's knowledge of the field.
4. **Site-visit list** for the 9 silent telemetry machines.
5. **Refresh `machine_commentary`** or kill the stale rows.
6. **Decide telemetry strategy** for Palm Island / Maningrida.
