# Fleet Revival. Why the Records Stopped, and What to Try Next

Snapshot 2026-05-05. Diagnostic findings from `usage_logs` for every machine that has ever sent telemetry, sorted by hypothesis-confidence and recoverability.

## The shape of the silence

The fleet did not slowly fade, it died in two distinct waves.

### Wave 1. Early March 2026

| Date | What happened |
|---|---|
| **2026-03-01** | A bulk job wrote a single `event_type='offline'` row for **5 machines** that had never sent real telemetry: Barkley Arts, 8D1, Dian Stokes Sons House, Red Dust, plus 098. This is a *status sweep*, not real data. Treat these as never-connected. |
| **2026-03-09** | A second bulk job stamped Norman's House and Nicole Frank's House with their last `cycle_complete` rows + a couple of heartbeats, then they fell off. Both ran firmware `v6`. They were *real machines that briefly worked* in early March, then stopped. |

### Wave 2. Late March → April 2026 (the "fleet event")

| Date | machine_id | Asset | Events lost | Notes |
|---|---|---|---:|---|
| **2026-03-21** | `e00fce68fe6c048ccec66ab1` | orphan (likely Palm Island) | 397 events ended | Sudden stop. Last event was a heartbeat (network OK at the time). |
| **2026-03-29** | `e00fce68c4b97878b9a2b323` | orphan (likely Palm Island) | 550 events ended | Largest single fleet member. Cycled from cyc=44 → 48 in 3 days, then nothing. |
| **2026-03-30** | `e00fce68c2ba447b66bcd507` | TC `GB0-WM-507` (or PI Club Kuta) | 30 events ended | Always low-volume; possibly always intermittent. |
| **2026-04-21** | `e00fce687ae01d08f95694e5` | TC `GB0-WM-4E5` | 342 events ended | Healthy until W15, dropped off in W16 (mid-April). |

**Three machines died within nine days of each other in late March, then 4E5 followed three weeks later.** This is the single most important clue. A fleet-wide silence cluster of that size is almost never random hardware failure, it's almost always one of:

- **Particle SIM expiry / data plan lapse** for a batch of devices on the same activation date. Particle SIMs renew per-device; if they were registered on a single Particle account, a billing failure or pre-paid block exhaustion would cut all of them off.
- **A Particle Cloud webhook integration was disabled or rotated.** If the integration that POSTs to `goodsoncountry.com/api/webhooks/particle` was deleted, paused, or its URL changed, every active device would stop landing here even though the devices themselves are still publishing to Particle Cloud.
- **A Zapier zap was paused.** Most live events come through `event_type='zapier-new-wash'` (now normalised to `cycle_complete`). If the Zapier task was disabled around 2026-03-21, that path stops without any device-level cause.
- **Coordinated firmware push gone wrong.** The dead devices report firmware version `6`. F25, the only survivor, has rows with both `6` and `v6`. Norman + Nicole had `v6` but stopped earlier, so firmware version isn't a clean predictor either way, but worth checking the OTA history.

Order of investigation, cheapest-first:

1. **Check Particle Cloud console** for each silent coreid. Look at "Last seen", if Particle still shows them publishing events, the problem is between Particle and our webhook (Zapier zap or webhook integration). If Particle also shows them dark, the problem is at the device.
2. **Check the Zapier dashboard**, was the relevant zap turned off, paused for too many errors, or has it been silently rate-limited? Zaps can pause themselves after consecutive failures.
3. **Check Particle Integrations**, does the `wash_event` webhook still point at `https://www.goodsoncountry.com/api/webhooks/particle`? Has it been deleted or its event filter narrowed?
4. **Check Particle SIM billing** for the affected account.
5. **Site visit / community check-in**, only after the above are clean.

## Per-machine revival cards

### F25. `e00fce684086eb2aba8d4f25`. Tennant Creek
**Status: HEALTHY.** 467 cycle events, latest 2026-05-05, firmware `6`/`v6`. This is the control case, whatever is working for F25 is the baseline to recreate for the others. Worth confirming whether F25 is on a separate Particle account/SIM plan or different network from the dead machines.

### 4E5. `e00fce687ae01d08f95694e5`. Tennant Creek (`GB0-WM-4E5`)
**Status: SILENT 13d.** 340 cycle events, last 2026-04-21. Most-recently healthy of the dead, easiest revival target.
- Step 1: Particle Cloud "last seen" check.
- Step 2: If Particle shows it still publishing → Zapier/webhook fault.
- Step 3: If Particle is also dark → power/connectivity check at the household.

### 507. `e00fce68c2ba447b66bcd507`. TC `GB0-WM-507` (or PI Club Kuta?)
**Status: SILENT 35d.** Only 29 cycle events ever, this device was never reliable. Possible faulty install or community wifi was always marginal.
- First: Ben to confirm whether 507 is physically in TC or was originally Club Kuta on Palm Island (the same-day-as-supply pattern is suspicious).
- Then: standard Particle/Zapier/site triage as for 4E5.

### Norman / Norm's House. `Norms House` (named id). TC `GB0-113`
**Status: SILENT 56d.** 21 cycle events + 2 heartbeats over 2026-03-01 → 2026-03-09 on firmware `v6`. **This is a real machine that briefly worked and stopped.** Note: the `machine_id` here is the human-readable string `Norms House`, not a Particle coreid, so the Particle device is publishing under a different identifier. Revival means tracing what coreid Norman's actual device has.

### Nicole Frank / Nicoles House. `Nicoles House` (named id). TC `GB0-154-2`
**Status: SILENT 56d.** 3 cycle events + 2 heartbeats over the same March 1–9 window, also firmware `v6`. Same situation as Norman's. The machine_id is symbolic; we need to know the actual Particle coreid behind it.

### 098. `e00fce682db6d32e15e86098`. TC `GB0-WM-098`
**Status: SILENT 64d.** Only 3 events, last on 2026-03-01, last event type `offline`. Likely the device was never in regular service, or was in a community where wifi was lost long ago.

### Barkley Arts / 8D1 / Dian Stokes Sons House / Red Dust
**Status: PLACEHOLDER ONLY.** Each has exactly one row in `usage_logs`, an `offline` event from the 2026-03-01 batch sweep. **No real Particle device ever ran behind these `machine_id` values.** They are intent-to-telemeter, not actual telemetry.
- Decision: either install Particle hardware on these machines and link the new coreid into `assets.machine_id`, or NULL out the `machine_id` so they correctly appear as `no_telemetry_hw`.

### Three orphan coreids (likely Palm Island)
**Status: ORPHANS.** `c4b9…` (550 events), `fe6c…` (397), `689f…` (38). All on firmware `6`, all in the late-March silence cluster except `689f` which only ran two weeks in Sept 2025. See the alignment doc, these need to be assigned to specific Palm Island households before revival can be planned.

### Maningrida (6 assets, no telemetry hardware ever)
**Status: NEVER CONNECTED.** No coreid has ever first-appeared in October 2025 when the 6 Maningrida machines were supplied. This is a hardware/process gap, not a revival issue. Different problem class, would need a new shipment with Particle devices fitted before commissioning.

## What needs to change in the system to prevent the next silent fleet

1. **Heartbeat-loss alerts**, currently the `alerts` table only fills on the daily rollup cron. If a machine goes silent for >36h, an alert should fire automatically with the `last_seen_at` and the suspected community. Today's alerts list is from the March batch and doesn't reflect April / May silence.
2. **Webhook failure logging**, if Particle Cloud is publishing but our webhook is rejecting (4xx/5xx), we should log it. Currently `console.error` only fires in serverless logs that nobody is reading.
3. **Particle Cloud read-back**, a daily cron that calls Particle's REST API for every registered coreid and writes the cloud-side "last seen" alongside the local "last received". If they diverge, you know it's a webhook problem, not a device problem.
4. **SIM-expiry monitoring**, a calendar reminder for the renewal date of every Particle SIM, plus a process for renewing in bulk so no future cluster goes dark together.

## Open questions for Ben

1. Did anything change around **2026-03-21** in Particle Cloud, Zapier, or the webhook config? That's the start of the cluster.
2. Are F25's Particle SIM and account on the **same plan / billing** as 4E5, 507, c4b9, fe6c, or different?
3. Are Norman's and Nicole Frank's machines actually on Particle hardware? Their `machine_id` is the human household name, not a coreid, that suggests data was being keyed in by a person rather than streamed from a device.
4. Is the **Zapier zap** still enabled? If yes, when was it last triggered (visible in Zapier task history)?
