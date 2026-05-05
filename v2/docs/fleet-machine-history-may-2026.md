# Machine-by-machine Telemetry History

Pulled from `usage_logs` 2026-05-05. 1,861 events across 14 distinct `machine_id` values, spanning 2025-08-27 → 2026-05-05 (8 months 8 days).

Each section below tells the life story of one device — when it first appeared, when it stopped, how busy it was, and any clues (firmware, asset linkage, peak cycle counter) that might help identify the physical machine.

## Forensic timeline — first-appearance vs known deployments

Signals never appeared in a community before that community received a shipment. Lining up first-seen dates with the asset-register supply dates gives strong hints about which physical machine each coreid was bolted to.

| First-seen telemetry | Same-day / nearby deployment events | Plausible attribution |
|---|---|---|
| **2025-08-27** — `e00fce68c4b97878b9a2b323` | Palm Island Additional Washers (Aug 5) + Oochiumpa wave (Aug 12) already on-country | **Palm Island** — first device to come online, possibly Rangers Station or Workers House |
| **2025-09-15** — `e00fce68fe6c048ccec66ab1`, `e00fce687ae01d08f95694e5` (4E5), `e00fce689f1dd0daf5987cf2` | 8-day window after Palm Island full deployment; 4E5 is currently registered to TC | Three devices coming up the same day suggests a coordinated install. **fe6c… and 689f… are likely Palm Island**; 4E5 was either also Palm originally or a TC unit installed in parallel |
| **2025-09-19** — `e00fce682db6d32e15e86098` (098) | TC, currently registered `GB0-WM-098` | Tennant Creek (consistent with current registration) |
| **2025-09-28** — `e00fce68c2ba447b66bcd507` (507) | **Same day as Palm Island Club Kuta deployment (GB0-147)** | Strong coincidence — 507 may have started life as Club Kuta and later been re-tagged to TC |
| **2025-11-17** — `e00fce684086eb2aba8d4f25` (F25) | TC after Tennant 2025-12 wave was being prepped | Tennant Creek — the only one reliably reporting today |
| **2026-03-01 (offline only)** — Barkley / 8D1 / Dian / Red Dust | Single 'offline' event each from a March 1 batch sweep | These are *named placeholders* — no real Particle device ever sat behind these `machine_id`s |
| **2026-03-09** — Norms / Nicoles | Inferred restart batch | Likely March-9 commentary job, not actual telemetry from the unit |

### What this suggests for "we had at least 4 in Palm Island"

The 3 ghost coreids (`c4b9`, `fe6c`, `689f`) line up with Palm Island timing exactly. Possible 4th candidate: **507** — its first signal on 2025-09-28 is *literally the same day* Club Kuta (GB0-147) was supplied. If 507 was originally a Palm Island device, that gives **4 Palm Island machines with telemetry history**, matching your recollection.

### What this suggests for Maningrida

Maningrida's 6 washers were supplied 2025-10-20. **No new coreid first-appears in October** — so on this evidence, no Particle device was ever fitted in Maningrida. If you remember one, it might have been planned but not commissioned, or it could have come up briefly enough to not survive the early-data losses.

### What this suggests for Tennant Creek

F25 (Nov 17), 4E5 (Sep 15), 098 (Sep 19) all align with TC. Plus the named-only entries (Norms / Nicoles / Barkley / 8D1 / Dian / Red Dust) which only ever produced `offline` or `heartbeat` rows from batch jobs — those probably never had Particle hardware bolted in.

---
## `e00fce68c4b97878b9a2b323`

- **Particle coreid** · 550 events over 213d span · last reported 36d ago
- **Window:** 2025-08-27 23:32:21Z → 2026-03-29 11:36:45Z
- **Event mix:** cycle_complete=550
- **Firmware versions seen:** 2, 3, 6
- **Linked asset:** *(none — orphan / not in `assets` table)*
- **Peak cycle counter:** 48
- **Monthly activity:**
  - 2025-08:   19 events  ███████████████████
  - 2025-09:   94 events  ████████████████████████████████████████████████████████████
  - 2025-10:   59 events  ███████████████████████████████████████████████████████████
  - 2025-11:   84 events  ████████████████████████████████████████████████████████████
  - 2025-12:  100 events  ████████████████████████████████████████████████████████████
  - 2026-01:   96 events  ████████████████████████████████████████████████████████████
  - 2026-02:   44 events  ████████████████████████████████████████████
  - 2026-03:   54 events  ██████████████████████████████████████████████████████
- **First 5 events:**
    - `2025-08-27 23:32:21Z`  cycle_complete  fw=2 · 0.27kWh
    - `2025-08-28 00:02:21Z`  cycle_complete  fw=2 · 0.27kWh
    - `2025-08-28 06:19:41Z`  cycle_complete  fw=2 · 0.27kWh
    - `2025-08-28 06:49:41Z`  cycle_complete  fw=2 · 0.27kWh
    - `2025-08-29 04:20:22Z`  cycle_complete  fw=2 · 0.27kWh
- **Last 5 events:**
    - `2026-03-27 07:14:54Z`  cycle_complete  fw=6 · cyc=44 · 14.95kWh
    - `2026-03-28 07:01:44Z`  cycle_complete  fw=6 · cyc=45 · 15.74kWh
    - `2026-03-29 05:04:05Z`  cycle_complete  fw=6 · cyc=46 · 16.48kWh
    - `2026-03-29 09:42:25Z`  cycle_complete  fw=6 · cyc=47 · 16.79kWh
    - `2026-03-29 11:36:45Z`  cycle_complete  fw=6 · cyc=48 · 17.03kWh

---
## `e00fce684086eb2aba8d4f25`

- **Particle coreid** · 468 events over 168d span · last reported -1d ago
- **Window:** 2025-11-17 04:24:00Z → 2026-05-05 00:59:04Z
- **Event mix:** cycle_complete=466, heartbeat=2
- **Firmware versions seen:** 3, 6, v6
- **Linked asset(s):** GB0-WM-F25
- **Peak cycle counter:** 32
- **Monthly activity:**
  - 2025-11:   33 events  █████████████████████████████████
  - 2025-12:   99 events  ████████████████████████████████████████████████████████████
  - 2026-01:  104 events  ████████████████████████████████████████████████████████████
  - 2026-02:   50 events  ██████████████████████████████████████████████████
  - 2026-03:   74 events  ████████████████████████████████████████████████████████████
  - 2026-04:   93 events  ████████████████████████████████████████████████████████████
  - 2026-05:   15 events  ███████████████
- **First 5 events:**
    - `2025-11-17 04:24:00Z`  cycle_complete  fw=3 · 0.185kWh
    - `2025-11-17 12:19:00Z`  cycle_complete  fw=3 · 0.185kWh
    - `2025-11-18 00:35:30Z`  cycle_complete  fw=3 · 0.185kWh
    - `2025-11-18 01:51:40Z`  cycle_complete  fw=3 · 0.185kWh
    - `2025-11-18 06:56:20Z`  cycle_complete  fw=3 · 0.185kWh
- **Last 5 events:**
    - `2026-05-03 10:08:04Z`  cycle_complete  fw=6 · cyc=4 · 0.73kWh · asset=GB0-WM-F25
    - `2026-05-03 13:28:34Z`  cycle_complete  fw=6 · cyc=5 · 0.98kWh · asset=GB0-WM-F25
    - `2026-05-04 03:43:24Z`  cycle_complete  fw=6 · cyc=6 · 1.48kWh · asset=GB0-WM-F25
    - `2026-05-04 07:01:34Z`  cycle_complete  fw=6 · cyc=7 · 1.73kWh · asset=GB0-WM-F25
    - `2026-05-05 00:59:04Z`  cycle_complete  fw=6 · cyc=8 · 2.33kWh · asset=GB0-WM-F25

---
## `e00fce68fe6c048ccec66ab1`

- **Particle coreid** · 397 events over 187d span · last reported 44d ago
- **Window:** 2025-09-15 00:26:43Z → 2026-03-21 08:52:09Z
- **Event mix:** cycle_complete=396, heartbeat=1
- **Firmware versions seen:** 3, 6
- **Linked asset:** *(none — orphan / not in `assets` table)*
- **Monthly activity:**
  - 2025-09:   48 events  ████████████████████████████████████████████████
  - 2025-10:  102 events  ████████████████████████████████████████████████████████████
  - 2025-11:   53 events  █████████████████████████████████████████████████████
  - 2025-12:   93 events  ████████████████████████████████████████████████████████████
  - 2026-01:   63 events  ████████████████████████████████████████████████████████████
  - 2026-02:   22 events  ██████████████████████
  - 2026-03:   16 events  ████████████████
- **First 5 events:**
    - `2025-09-15 00:26:43Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-15 01:17:33Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-15 04:42:43Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-15 17:08:45Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-17 03:03:03Z`  cycle_complete  fw=3 · 0.27kWh
- **Last 5 events:**
    - `2026-03-10 09:24:34Z`  cycle_complete  fw=6 · 0.27kWh
    - `2026-03-11 00:04:17Z`  cycle_complete  fw=6 · 0.27kWh
    - `2026-03-11 13:05:54Z`  cycle_complete  fw=6 · 0.27kWh
    - `2026-03-12 04:31:08Z`  cycle_complete  fw=6 · 0.27kWh
    - `2026-03-21 08:52:09Z`  heartbeat  fw=6

---
## `e00fce687ae01d08f95694e5`

- **Particle coreid** · 342 events over 217d span · last reported 13d ago
- **Window:** 2025-09-15 09:53:09Z → 2026-04-21 05:48:14Z
- **Event mix:** cycle_complete=340, heartbeat=2
- **Firmware versions seen:** 3, 6, v6
- **Linked asset(s):** GB0-WM-4E5
- **Peak cycle counter:** 22
- **Monthly activity:**
  - 2025-09:   15 events  ███████████████
  - 2025-10:   26 events  ██████████████████████████
  - 2025-11:   72 events  ████████████████████████████████████████████████████████████
  - 2025-12:   56 events  ████████████████████████████████████████████████████████
  - 2026-01:   56 events  ████████████████████████████████████████████████████████
  - 2026-02:   26 events  ██████████████████████████
  - 2026-03:   47 events  ███████████████████████████████████████████████
  - 2026-04:   44 events  ████████████████████████████████████████████
- **First 5 events:**
    - `2025-09-15 09:53:09Z`  cycle_complete  fw=3 · 0.388kWh · asset=GB0-WM-4E5
    - `2025-09-16 13:47:59Z`  cycle_complete  fw=3 · 0.388kWh · asset=GB0-WM-4E5
    - `2025-09-17 11:06:09Z`  cycle_complete  fw=3 · 0.388kWh · asset=GB0-WM-4E5
    - `2025-09-17 22:59:49Z`  cycle_complete  fw=3 · 0.388kWh · asset=GB0-WM-4E5
    - `2025-09-20 02:20:56Z`  cycle_complete  fw=3 · 0.388kWh · asset=GB0-WM-4E5
- **Last 5 events:**
    - `2026-04-18 07:05:24Z`  cycle_complete  fw=6 · cyc=5 · 1.39kWh · asset=GB0-WM-4E5
    - `2026-04-19 00:38:22Z`  cycle_complete  fw=6 · cyc=1 · 0.01kWh · asset=GB0-WM-4E5
    - `2026-04-19 08:16:26Z`  cycle_complete  fw=6 · cyc=1 · 0.08kWh · asset=GB0-WM-4E5
    - `2026-04-20 11:22:21Z`  cycle_complete  fw=6 · cyc=1 · 0.31kWh · asset=GB0-WM-4E5
    - `2026-04-21 05:48:14Z`  cycle_complete  fw=6 · cyc=1 · 0.13kWh · asset=GB0-WM-4E5

---
## `e00fce689f1dd0daf5987cf2`

- **Particle coreid** · 38 events over 15d span · last reported 216d ago
- **Window:** 2025-09-15 04:43:41Z → 2025-09-30 23:34:43Z
- **Event mix:** cycle_complete=38
- **Firmware versions seen:** 3
- **Linked asset:** *(none — orphan / not in `assets` table)*
- **Monthly activity:**
  - 2025-09:   38 events  ██████████████████████████████████████
- **First 5 events:**
    - `2025-09-15 04:43:41Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-16 03:25:52Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-16 04:45:32Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-17 06:42:42Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-17 08:23:12Z`  cycle_complete  fw=3 · 0.27kWh
- **Last 5 events:**
    - `2025-09-28 07:52:14Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-29 08:50:25Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-30 01:20:50Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-30 12:51:23Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-30 23:34:43Z`  cycle_complete  fw=3 · 0.27kWh

---
## `e00fce68c2ba447b66bcd507`

- **Particle coreid** · 30 events over 183d span · last reported 35d ago
- **Window:** 2025-09-28 00:24:30Z → 2026-03-30 02:16:42Z
- **Event mix:** cycle_complete=29, offline=1
- **Firmware versions seen:** 3, 6
- **Linked asset(s):** GB0-WM-507
- **Peak cycle counter:** 4
- **Monthly activity:**
  - 2025-09:    6 events  ██████
  - 2025-10:   13 events  █████████████
  - 2025-11:    3 events  ███
  - 2025-12:    2 events  ██
  - 2026-03:    6 events  ██████
- **First 5 events:**
    - `2025-09-28 00:24:30Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-28 03:26:30Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-28 08:37:40Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-28 09:49:50Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-29 01:47:30Z`  cycle_complete  fw=3 · 0.27kWh
- **Last 5 events:**
    - `2026-03-27 00:15:01Z`  cycle_complete  fw=6 · cyc=1 · 0.51kWh · asset=GB0-WM-507
    - `2026-03-27 01:34:16Z`  cycle_complete  fw=6 · cyc=2 · 0.15kWh · asset=GB0-WM-507
    - `2026-03-27 02:24:31Z`  cycle_complete  fw=6 · cyc=2 · 0.17kWh · asset=GB0-WM-507
    - `2026-03-30 01:36:42Z`  cycle_complete  fw=6 · cyc=3 · 1.75kWh · asset=GB0-WM-507
    - `2026-03-30 02:16:42Z`  cycle_complete  fw=6 · cyc=4 · 1.94kWh · asset=GB0-WM-507

---
## `Norms House`

- **named/identifier** · 23 events over 8d span · last reported 56d ago
- **Window:** 2026-03-01 21:00:00Z → 2026-03-09 21:37:28Z
- **Event mix:** cycle_complete=21, heartbeat=2
- **Firmware versions seen:** v6
- **Linked asset(s):** GB0-113
- **Monthly activity:**
  - 2026-03:   23 events  ███████████████████████
- **First 5 events:**
    - `2026-03-01 21:00:00Z`  cycle_complete  fw=v6 · 0.152kWh · asset=GB0-113
    - `2026-03-01 22:07:00Z`  cycle_complete  fw=v6 · 0.152kWh · asset=GB0-113
    - `2026-03-02 00:14:00Z`  cycle_complete  fw=v6 · 0.152kWh · asset=GB0-113
    - `2026-03-02 01:21:00Z`  cycle_complete  fw=v6 · 0.152kWh · asset=GB0-113
    - `2026-03-02 03:28:00Z`  cycle_complete  fw=v6 · 0.152kWh · asset=GB0-113
- **Last 5 events:**
    - `2026-03-06 03:21:00Z`  cycle_complete  fw=v6 · 0.245kWh · asset=GB0-113
    - `2026-03-06 05:28:00Z`  cycle_complete  fw=v6 · 0.245kWh · asset=GB0-113
    - `2026-03-06 07:35:00Z`  cycle_complete  fw=v6 · 0.245kWh · asset=GB0-113
    - `2026-03-08 08:00:00Z`  heartbeat  fw=v6 · asset=GB0-113
    - `2026-03-09 21:37:28Z`  heartbeat  fw=v6 · asset=GB0-113

---
## `Nicoles House`

- **named/identifier** · 5 events over 8d span · last reported 56d ago
- **Window:** 2026-03-01 21:00:00Z → 2026-03-09 21:37:28Z
- **Event mix:** cycle_complete=3, heartbeat=2
- **Firmware versions seen:** v6
- **Linked asset(s):** GB0-154-2
- **Monthly activity:**
  - 2026-03:    5 events  █████
- **First 5 events:**
    - `2026-03-01 21:00:00Z`  cycle_complete  fw=v6 · 0.1kWh · asset=GB0-154-2
    - `2026-03-02 03:07:00Z`  cycle_complete  fw=v6 · 0.1kWh · asset=GB0-154-2
    - `2026-03-05 21:00:00Z`  cycle_complete  fw=v6 · 1.15kWh · asset=GB0-154-2
    - `2026-03-08 08:00:00Z`  heartbeat  fw=v6 · asset=GB0-154-2
    - `2026-03-09 21:37:28Z`  heartbeat  fw=v6 · asset=GB0-154-2

---
## `e00fce682db6d32e15e86098`

- **Particle coreid** · 3 events over 163d span · last reported 64d ago
- **Window:** 2025-09-19 03:19:34Z → 2026-03-01 14:00:00Z
- **Event mix:** cycle_complete=2, offline=1
- **Firmware versions seen:** 3
- **Linked asset(s):** GB0-WM-098
- **Monthly activity:**
  - 2025-09:    2 events  ██
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2025-09-19 03:19:34Z`  cycle_complete  fw=3 · 0.27kWh
    - `2025-09-24 01:45:54Z`  cycle_complete  fw=3 · 0.27kWh
    - `2026-03-01 14:00:00Z`  offline  asset=GB0-WM-098

---
## `Barkley Arts`

- **named/identifier** · 1 events over 0d span · last reported 64d ago
- **Window:** 2026-03-01 14:00:00Z → 2026-03-01 14:00:00Z
- **Event mix:** offline=1
- **Firmware versions seen:** v6
- **Linked asset(s):** GB0-125
- **Monthly activity:**
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2026-03-01 14:00:00Z`  offline  fw=v6 · asset=GB0-125

---
## `Red Dust`

- **named/identifier** · 1 events over 0d span · last reported 64d ago
- **Window:** 2026-03-01 14:00:00Z → 2026-03-01 14:00:00Z
- **Event mix:** offline=1
- **Linked asset(s):** GB0-WM-RD
- **Monthly activity:**
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2026-03-01 14:00:00Z`  offline  asset=GB0-WM-RD

---
## `Dian Stokes Sons House`

- **named/identifier** · 1 events over 0d span · last reported 64d ago
- **Window:** 2026-03-01 14:00:00Z → 2026-03-01 14:00:00Z
- **Event mix:** offline=1
- **Linked asset(s):** GB0-WM-DSS
- **Monthly activity:**
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2026-03-01 14:00:00Z`  offline  asset=GB0-WM-DSS

---
## `8D1`

- **named/identifier** · 1 events over 0d span · last reported 64d ago
- **Window:** 2026-03-01 14:00:00Z → 2026-03-01 14:00:00Z
- **Event mix:** offline=1
- **Linked asset(s):** GB0-WM-8D1
- **Monthly activity:**
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2026-03-01 14:00:00Z`  offline  asset=GB0-WM-8D1

---
## `test123`

- **TEST** · 1 events over 0d span · last reported 56d ago
- **Window:** 2026-03-09 12:00:00Z → 2026-03-09 12:00:00Z
- **Event mix:** test=1
- **Monthly activity:**
  - 2026-03:    1 events  █
- **First 5 events:**
    - `2026-03-09 12:00:00Z`  test  

---

## Cross-machine timeline (debugging deployment locations)

```
month     | F25  4E5  507  098  c4b9  fe6c  689f  8D1  Bark  Dian  RD  Norm  Nico
----------|---------------------------------------------------------------
2025-08  |                  19                                
2025-09  |      15   6   2  94  48  38                        
2025-10  |      26  13      59 102                            
2025-11  |  33  72   3      84  53                            
2025-12  |  99  56   2     100  93                            
2026-01  | 104  56          96  63                            
2026-02  |  50  26          44  22                            
2026-03  |  74  47   6   1  54  16       1   1   1   1  23   5
2026-04  |  93  44                                            
2026-05  |  15                                                
```
