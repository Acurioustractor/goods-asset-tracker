# Fleet Pipeline History. How Data Has Flowed Since Aug 2025

Reconstructed 2026-05-05 from `usage_logs` event-id forensics, git history, and the webhook route source. Use this to work out where the break actually is.

## Pipeline ledger (TL;DR)

| Stage | Active | Path | First event |
|---|---|---|---|
| **A. Particle → Zapier → Google Sheets** | 2025-08 → today | Devices publish to Particle Cloud → a Zapier zap appends rows to the "Goods Washer" Google Sheet | 2025-08-27 |
| **B. Sheet → `/api/admin/fleet/import-csv` (one-shot)** | 2026-03-11 | Exported the Sheet to CSV, POST-imported into `usage_logs`. Backfilled 938 historical events. | 2026-03-11 |
| **C. Particle → Zapier → `/api/webhooks/particle`** | 2026-03-11 → today | The same Zapier zap was reconfigured (or a new one added) to POST every wash event directly to our Vercel endpoint as `event="zapier-new-wash"`. | 2026-03-11 |
| **D. Openfields Solutions → `/api/webhooks/openfields`** | 2026-03-10 (configured, dormant) | HMAC-signed receiver for an Openfields telemetry partner. Only 3 events have ever landed via this path. | 2026-03 (only 3 events) |
| **E. Hand-keyed seed data** | 2026-03-01 / 2026-03-09 | Ben (or admin) inserted ~30 seeded rows for households without real Particle hardware (Norm's, Nicole's, Barkley, 8D1, Dian Stokes, Red Dust). All have `event_id` prefix `seed_…`. | one-off |

## The forensic evidence

### `event_id` prefix distribution (1,861 rows)

```
938   particle-{hash32}     ← came through CSV import OR live webhook (both generate this prefix)
 32   seed_*                ← hand-keyed seed records, March 1–9
  3   {uuid}                ← Openfields HMAC webhook
  1   test                  ← test event
```

### Event-type composition by month

```
month      cycle_complete   heartbeat   offline   test
2025-08         19              0          0       0    ← Stage A starts (Particle → Zap → Sheet)
2025-09        203              0          0       0    ← steady-state via Sheet
2025-10        200              0          0       0
2025-11        245              0          0       0
2025-12        350              0          0       0    ← peak month
2026-01        319              0          0       0
2026-02        142              0          0       0    ← cliff begins
2026-03        215              9          6       1    ← Stage B (CSV import) + Stage E (seed) + Stage C live starts
2026-04        137              0          0       0    ← only F25 + 4E5 still going
2026-05         15              0          0       0    ← only F25 still going
```

The `heartbeat` and `offline` rows only appear in March because the seed-data writer set those types. **Real Particle telemetry has only ever produced `cycle_complete`** (well, plus the now-normalised `zapier-new-wash`). The fleet has never received real `heartbeat` events through the live path.

### When each pipeline started

The very first event in `usage_logs` is `2025-08-27T23:32:21`, long before our `usage_logs` schema or webhook routes existed. That row landed via Stage B (CSV import) on 2026-03-11. So the actual **physical machines have been running since at least August 2025, but their telemetry only entered our database in March 2026 when we backfilled the Google Sheet.**

## What's actually running right now

```
        ┌───────────────────────────────────┐
        │  Particle Photon (washing machine) │
        └─────────────┬─────────────────────┘
                      │ wash_event published
                      ▼
        ┌───────────────────────────────────┐
        │   Particle Cloud (api.particle.io)│   ← shows device "last seen"; auth token + SIM-billed
        └───────┬─────────────────┬─────────┘
                │                 │
                │  webhook trigger│  webhook trigger
                ▼                 ▼
   ┌────────────────┐    ┌────────────────────────────┐
   │  Google Sheet   │   │  Zapier zap "Goods Washer" │
   │  "Goods Washer"│    └────────────┬───────────────┘
   │  (legacy)       │                │
   └────────────────┘                 │ POST event="zapier-new-wash"
                                      ▼
                ┌──────────────────────────────────────────┐
                │  POST /api/webhooks/particle              │
                │   (Vercel · v2/src/app/api/webhooks/...)  │
                │   maps zapier-new-wash → cycle_complete   │
                └──────────────────┬───────────────────────┘
                                   ▼
                ┌──────────────────────────────────────────┐
                │  Supabase: usage_logs (cwsyhpiuepvdjtxaozwf) │
                └──────────────────┬───────────────────────┘
                                   ▼
                ┌──────────────────────────────────────────┐
                │  /api/cron/fleet-rollup (every 6h)        │
                │  → daily_machine_rollups + alerts          │
                └──────────────────┬───────────────────────┘
                                   ▼
                            /admin/fleet
```

## Where the breakage almost certainly is

We saw this silence cluster in late March / April:

| Date | Coreid | Status |
|---|---|---|
| 2026-03-21 | `…fe6c…` | last event ever (orphan, likely Palm Island) |
| 2026-03-29 | `…c4b9…` | last event ever (orphan, likely Palm Island) |
| 2026-03-30 | `…c2ba447b66bcd507` (507) | last event ever |
| 2026-04-21 | `…7ae01d08f95694e5` (4E5) | last event ever |
| 2026-05-05 | `…4086eb2aba8d4f25` (F25) | **still alive** |

The fact that **F25 still works through Stage C** while four other devices on the same Zapier zap stopped one-by-one, plus the staggered (not simultaneous) timestamps, **rules out Zapier-side and webhook-side failures** as the primary cause:

- If the zap had been disabled, **all** devices including F25 would go silent at the same instant.
- If the webhook URL had been rotated or returned 5xx, same thing, global, not staggered.
- If the Particle Integration had been deleted, same.
- A pure SIM-billing batch lapse would cluster within 24h, not over 31 days.

Staggered, device-specific stops point at **the device end of the chain**, power loss at the household, the Particle SIM running out of pre-paid data per-device, the cellular module crashing, the washing machine itself being unplugged or moved, or community-level connectivity dropping intermittently.

## How to confirm where the break is, without leaving the desk

Three cheap tests, in order:

### Test 1. Is the legacy Google Sheet still receiving rows?

Open the "Goods Washer" Google Sheet (originally connected via Zapier). If new rows are still appearing for the silent coreids → **Zapier is still firing on those devices, but only the Sheet branch is intact, not the webhook branch.** That means the webhook-POST half of the zap got disabled. *Cheap fix: re-enable in Zapier.*

If new rows are NOT appearing for silent coreids → **the devices stopped publishing to Particle Cloud altogether.** The break is upstream, at the Particle SIM, the device firmware, or the physical install. *Site visit territory.*

### Test 2. Particle Cloud "last seen" per device

Log into [console.particle.io](https://console.particle.io) and look at the device list. Each device shows its last-seen timestamp from Particle's perspective. Compare to our `last_seen_at`:

- If Particle "last seen" is recent (within a day) and ours is March → **the break is between Particle Cloud and our webhook**, i.e. Zapier or the Particle Integration.
- If Particle "last seen" matches ours (also March) → **the device stopped publishing**. Hardware/SIM/power.

### Test 3. Zapier task history

In the Zapier dashboard look at the zap's "Task History". You'll see one row per fired event. Filter by date around 2026-03-21:

- If tasks are still firing for `…fe6c…` after 2026-03-21 → Zapier sees events but our webhook is not absorbing them. Check our webhook logs in Vercel for 4xx/5xx around those timestamps.
- If tasks stop firing for that coreid on 2026-03-21 → Zapier never received those events, which means Particle Cloud never sent them, which means the device went dark.

## What to fix in this codebase regardless

These are independent of the silence-cluster cause and worth doing because they'd have caught this earlier:

1. **Active heartbeat-loss alerting.** Currently `alerts` only fills via the rollup cron and only contains stale March entries. Add a job that runs every 6h: for every `assets` row with `machine_id IS NOT NULL`, if `last_seen_at` < 36h ago, raise a `machine_silent` alert (resolved=false).
2. **Round-trip Particle Cloud read-back.** A nightly cron that authenticates to Particle's REST API, fetches each registered coreid's last-seen timestamp, and writes it to a `particle_device_status` table. When that table's `cloud_last_seen` diverges from our `usage_logs.last_seen_at` by more than 24h, you know the break is between Particle Cloud and us, not at the device.
3. **Webhook receipt log.** The webhook currently `console.error`s on insert failures and otherwise silently absorbs everything. A lightweight `webhook_receipts` table (one row per POST regardless of validity) lets you confirm "did we receive anything from Zapier in the last 24h?" without scrolling Vercel logs.
4. **Stop using `event_id` prefixes for source attribution.** The `particle-{hash}` prefix is generated by both the live webhook and the CSV import, so we can't tell them apart after the fact. Add a `source` column to `usage_logs` (`'webhook' | 'csv-import' | 'seed' | 'openfields'`) for clean provenance.
5. **Migrate the named placeholders to real coreids when hardware lands.** Norm's House, Nicole's House, Barkley Arts, 8D1, Dian Stokes Sons House, Red Dust currently have `machine_id` set to a human-readable string. When they get Particle devices, swap `machine_id` to the actual coreid and the dashboard light goes on automatically.

## So, working back from now

If you want to revive the dead machines, run **Test 1** first (5 minutes, no auth needed beyond the Sheet), that single check splits "device problem" from "pipeline problem" cleanly. Tell me which result you see and we'll decide whether the next move is Zapier triage or a Tennant Creek site visit.
