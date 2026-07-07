# Asset Tracking Enhancement Plan: Beds, Washers, Pings, People

**Date:** 2026-06-06
**Decision this informs:** where to invest next in the asset register so every bed and machine is tracked from production to household, and the washer fleet is genuinely monitored.
**Provenance:** every figure below comes from read-only, PII-free count queries against the live v2 Supabase register (`cwsyhpiuepvdjtxaozwf`) run 2026-06-06, plus direct code reads. No recipient names, contacts, or GPS values were fetched. Ben authorized the production reads in-session.

---

## 1. Verified current state (the honest snapshot)

### The register
| Measure | Live value (2026-06-06) |
|---|---|
| Total assets | 561 |
| Deployed | 523 (132 Stretch Bed + 363 Basket Bed + 28 Washing Machine) |
| Other states | 20 Stretch ready, 3 demo, 1 allocated, 1 requested; 10 washers retired, 3 under investigation |
| Deployed by community | Tennant Creek 173, Utopia 147, Palm Island 135, Maningrida 24, Kalgoorlie 20, Alice Springs 19, Mount Isa 2, Darwin 2, Canberra 1 |

Note: the live register has moved past the static `asset-canonical.ts` snapshot (reconciled 2026-05-29: TC 159, Maningrida 18, Alice 16, Stretch 133). Run `check-asset-drift.mjs` and re-lock canon as a follow-up.

### The gap Ben asked about: who we have and haven't scanned for
| Field on 523 deployed assets | Populated |
|---|---|
| QR code (`qr_url`) | **523 of 523** (every asset can be scanned today) |
| Supply date | 514 |
| Last check-in date | 197 (set by import; the `checkins` table itself has 0 rows) |
| GPS | 38 |
| Contact household | 27 |
| Recipient name | **1** |
| Recipient consent timestamp | **0** |
| Household size | 0 |
| QR claims ever completed (`user_assets`) | **0** |
| Lifetime QR scans (`bed_scans`) | 244, last on 2026-06-02 |

Reading: **the hardware layer is done (every asset has a QR) and the software layer is built (claim flow, scan logging, GHL sync), but the human layer has never been switched on.** Zero claims, one recipient record, zero consent timestamps. The `overdue_assets` view lists 543 assets, which means "overdue" currently describes everything and therefore nothing.

### The washer fleet: pings are ALIVE
| Measure | Live value |
|---|---|
| Telemetry events (`usage_logs`) | 1,959 |
| Distinct machines pinging | **14** |
| Freshness | `cycle_complete` events same-day (last 2026-06-05 07:37 UTC) |
| Daily rollups | 646 rows (cron pipeline running) |
| Webhook receipts | 97 |
| Deployed washers in register | 28 |
| Washers with a Particle device mapped (`machine_id`) | **5** |

The pipeline: **Particle.io cellular devices on the machines** POST wash events (cycle count, amps, kWh) to `/api/webhooks/particle` (some via Zapier), with a second source at `/api/webhooks/openfields`. An admin route (`/api/admin/fleet/map-device`) links Particle coreids to assets. A fleet cron rolls up daily. The fleet admin page renders KPIs and alerts.

Reading: **telemetry works and is current, but the join to the register is broken.** 14 machines ping, 28 are deployed, only 5 are mapped. That means 14 machines are dark (no telemetry: dead device, no coverage, powered off, or never fitted) and 9 pinging machines cannot be tied to a register asset. The public "14 working machines" figure happens to equal the pinging count but is hardcoded, not live.

---

## 2. The design insight

Nothing fundamental needs inventing. The bones of a great system exist end to end. Three loops need closing:

### Loop 1: Beds, scan-at-delivery
Make the delivery moment the registration moment. The crew member who hands over a bed scans its QR right there, picks the community, and (where the household consents) records household contact. One scan writes: status confirmed deployed, delivery date, GPS from the phone, optional household link with `recipient_consent_at` stamped.
- Build: a lightweight "delivery mode" on the existing `/bed/[id]` page (admin-authenticated), offline-tolerant (queue writes, sync when in coverage), big-buttons-low-text UI for field use.
- The existing public claim flow stays as the household-initiated path; delivery mode is the crew-initiated path. Either one ends the "never scanned for anyone" state.
- Coverage metric becomes trackable: scanned-for-someone / deployed, per community. Today that is 1/523.

### Loop 2: Washers, fix the join then trust the pings
- **This week, no code:** use the existing map-device admin route to map the remaining coreids. Machine list from Particle console vs the 28 register washers. After mapping, every ping lands against a real asset.
- Replace the hardcoded public "14 working" with a live measure: machines with a `cycle_complete` in the last N days. The number then earns its place on the impact page.
- Dark-machine alerting tuned for remote reality: alert after N days of silence (not minutes), route to the community contact, log outcome. A machine that is off for sorry business or a power outage is not a fault; the system should distinguish silence-with-a-known-reason from silence-unexplained (`machine_commentary` table already exists for exactly this).
- Triage the 14 dark machines once mapping is done: dead device vs no coverage vs never fitted vs actually broken. That triage list is the first real output of the fixed join.

### Loop 3: People, consent-first recipient records
The schema is already consent-shaped (`recipient_consent_at` exists and is unused). Apply the Empathy Ledger principle to asset data: a household record exists only with a consent timestamp, visible only to admins, never required for the bed to be delivered.
- `bed_signals` (8 rows today, SMS/WhatsApp inbound) becomes the lightweight check-in channel: a periodic "how is the bed going, reply 1-5" to consented households writes `checkins` rows and `last_checkin_date`, which finally gives `overdue_assets` meaning.
- Hard rule carried over from the enrichment map: recipient and household data is RED class. It never goes to MiniMax or any new third party. M3 builds the tooling; Opus and deterministic scripts touch the data.

---

## 3. Multi-site production support

`production_shifts` already logs shifts, plastic shredded, and beds assembled at the on-country facility. To support beds born at other facilities:
- Stamp origin at birth: `production_site` + batch/shift reference on each asset when it is created, so provenance (which container, which crew, which plastic batch) travels with the bed for life. Serial prefixes per site keep unique_ids legible.
- Each new container facility ships with the same kit: QR printer + the same production logging page pointed at the same register. The register is already multi-site-shaped (single `assets` table keyed by community and now site); no schema fork needed.
- The compounding model from the Cost Lab (containers fund containers) then gets real telemetry: beds-per-site, time-from-production-to-deployment, and plastic-per-site all fall out of the same three tables.
- Washer parallel: any site that refurbishes or stages machines fits the Particle device and maps it before the machine leaves the shed. Mapping at dispatch, not after deployment, prevents the current 5/28 situation recurring.

---

## 4. Monitoring options compared (washers)

| Option | Verdict |
|---|---|
| **Particle retrofit (current)** | Working now: 1,959 events, same-day freshness, cheap, fleet-agnostic. Keep and double down. Weakness is fitting/mapping discipline, which is process, not technology. |
| **Speed Queen Insights** | Real product (cloud monitoring, remote control, error alerts; AU distributor sells it). But it requires networked Quantum-era controls, per-machine connectivity and subscription, and assumes laundromat-style operation. Worth evaluating at the next fleet purchase, not a retrofit play for the current 28. |
| **Manual / SMS only** | Already exists as `bed_signals`. Right channel for households, wrong channel for machine health. Keep as the human complement, not the telemetry source. |

Recommendation: Particle stays the spine. The week-one win is mapping, not new hardware.

---

## 5. The M3 pool's recurring role (GREEN work only)

| Job | Cadence | Class |
|---|---|---|
| Register-vs-canon drift check tooling (extend `check-asset-drift.mjs` to per-community level, with tests) | weekly run | GREEN (code + aggregates) |
| Fleet health report generator: rollups + dark-machine list from `daily_machine_rollups` aggregates (no household data) | weekly | GREEN |
| Test suites for the webhook handlers (`particle`, `openfields`), map-device route, and fleet-rollup cron, same pattern as PRs #88/#89 | once, then maintained | GREEN |
| Delivery-mode UI scaffolding + offline queue logic | once | GREEN (code) |
| Aggregate impact maths (cycles per community per week, kWh, uptime) for funder reporting | monthly | GREEN (anonymised aggregates) |
| Anything touching recipient/household records | never | RED, stays with Opus + deterministic scripts |

---

## 6. Sequenced rollout

**This week (no new code):**
1. Map the remaining Particle coreids via the existing admin route; triage the dark machines.
2. Run `check-asset-drift.mjs`; re-lock `asset-canonical.ts` to the live register.
3. M3 worker: test suites for the particle/openfields webhooks + fleet cron (protects the pipeline before touching it).

**This month:**
4. Live "working machines" metric replaces the hardcoded 14.
5. Delivery-mode scan flow on `/bed/[id]` (crew-initiated registration, offline-tolerant).
6. Dark-machine alerting with community-contact routing and `machine_commentary` reasons.

**This quarter:**
7. Consent-first household check-ins via `bed_signals`, making `overdue_assets` meaningful.
8. Multi-site provenance stamping (`production_site`, batch) ready before the second container comes online.
9. Per-community asset-health dashboard from `community_asset_health` (table exists, currently unused).

## Changelog
- 2026-06-06: Initial plan from live-register snapshot + codebase map. Headline: QR hardware 100%, telemetry alive (14 machines), human linkage layer at zero (0 claims, 1 recipient record, 5/28 washers mapped).
