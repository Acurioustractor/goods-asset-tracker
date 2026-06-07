# Asset-Count Alignment — live register vs every hardcoded copy

**Date:** 2026-05-30 · **Author:** asset-count reconciliation agent
**Live source of truth:** `assets` table, Goods v2 Supabase `cwsyhpiuepvdjtxaozwf` (verified live this session via service-role node script; env `NEXT_PUBLIC_SUPABASE_URL` confirmed pointing at `cwsyhpiuepvdjtxaozwf`).
**Method:** read all 561 rows of `assets` (cols `unique_id, product, status, community, community_id, quantity, machine_id`) and re-ran the exact queries each surface uses. READ-ONLY — no writes.

> **Schema gotcha (load-bearing):** the live `assets` table has **no `type` column** and **no `product_type` column** — the product label lives in **`product`** (`'Stretch Bed' | 'Basket Bed' | 'Washing Machine'`). `v2/src/lib/types/database.ts` Asset interface (lines 219-241) is STALE/wrong: it lists `type`, `product`, `name`, `quantity` but omits the real columns `community_id, gps, machine_id, install_photo_url, recipient_name, theme_tag, …`. Do not trust that interface for queries.

---

## (a) Canonical live counts

### Headline
| Measure | Live value |
|---|---|
| Total rows | **561** |
| Total units (Σ `quantity`) | **674** |
| Deployed rows | **523** |
| Deployed **units** | **524** (523 rows + 1 from the qty=2 Snow/Canberra row) |
| **Deployed BEDS** (status=deployed, product ~bed) | **496 units / 495 rows** |
| **Deployed WASHERS** (status=deployed, product~washing) | **28 units / 28 rows** |
| Communities with ≥1 deployed asset | **9** (Mutitjulu is allocated-only) |
| Distinct communities (any status) | **10** |

The 674-vs-561 gap is almost entirely **one row**: `REQ-CENTRECORP-2026` = Stretch Bed, status `requested`, qty **108** (a Tennant Creek pipeline placeholder, not deployed). Only 3 rows have qty≠1: `REQ-CENTRECORP-2026` (108), `ALLOC-MUTITJULU-001` (6, allocated), `ALLOC-SNOW-2026` (2, deployed Canberra).

### Distinct enum values (do not assume — these are live)
- **status:** `allocated, demo, deployed, ready, requested, retired, under_investigation`
- **product:** `Basket Bed, Stretch Bed, Washing Machine`
- **community:** Alice Springs, Canberra, Darwin, Kalgoorlie, Maningrida, Mount Isa, Mutitjulu, Palm Island, Tennant Creek, Utopia Homelands

### Rows / units by status
| status | rows | units |
|---|---|---|
| deployed | 523 | 524 |
| requested | 1 | 108 |
| ready | 20 | 20 |
| retired | 10 | 10 |
| allocated | 1 | 6 |
| demo | 3 | 3 |
| under_investigation | 3 | 3 |

### Rows / units by product
| product | rows | units |
|---|---|---|
| Basket Bed | 363 | 363 |
| Stretch Bed | 157 | 270 |
| Washing Machine | 41 | 41 |

### product × status (units)
| product | deployed | ready | demo | allocated | requested | retired | under_inv |
|---|--:|--:|--:|--:|--:|--:|--:|
| Basket Bed | 363 | – | – | – | – | – | – |
| Stretch Bed | 133 | 20 | 3 | 6 | 108 | – | – |
| Washing Machine | 28 | – | – | – | – | 10 | 3 |

So **all 363 Basket Beds are deployed; Stretch Beds split** 133 deployed + 20 ready (Alice, builders kept) + 6 allocated (Mutitjulu) + 108 requested (Centrecorp) + 3 demo (Canberra). Deployed beds = 363 Basket + 133 Stretch = **496**.

### community × status (units)
| community | deployed | other |
|---|--:|---|
| Tennant Creek | 173 | requested 108, under_inv 3, retired 7 → total 291 |
| Utopia Homelands | 147 | — |
| Palm Island | 135 | retired 3, demo 1 → total 139 |
| Alice Springs | 19 | ready 20 → total 39 |
| Maningrida | 24 | — |
| Kalgoorlie | 20 | — |
| Mutitjulu | 0 | allocated 6 |
| Canberra | 2 | demo 2 → total 4 |
| Mount Isa | 2 | — |
| Darwin | 2 | — |

### Deployed **beds** by community (the canonical per-community split)
TC **159**, Utopia **147**, Palm Island **131**, Kalgoorlie **20**, Maningrida **18**, Alice Springs **16**, Mount Isa **2**, Canberra **2**, Darwin **1** = **496**.
(Note Tennant Creek deployed-beds 159 > deployed-units-at-TC 173 includes 14 washers; Palm Island 131 beds + 4 washers = 135 deployed units.)

### Deployed **washers** by community
TC **14**, Maningrida **6**, Palm Island **4**, Alice Springs **3**, Darwin **1** = **28** (+ 10 retired, 3 under_investigation = 41 rows total).

### What "deployed" should mean
**`status = 'deployed'`** is the only status that means "physically in a home / in service." Everything else is NOT deployed:
- `ready` = built, not yet placed (20 Alice Stretch Beds builders kept)
- `allocated` = earmarked, not delivered (6 Mutitjulu)
- `requested` = pipeline/order placeholder (108 Centrecorp — must NOT be counted as delivered)
- `demo` = demonstration units (3 Canberra)
- `retired` / `under_investigation` = out of service (washers)

**Canonical headline for public/funder surfaces: 496 beds + 28 washers deployed across 9–10 communities.** Counting by `quantity` (not rows) matters because of the qty=108 row.

---

## (b) Drift table — every hardcoded copy vs live

There are **three different live fetchers that count differently**, plus a pile of static literals. The "520" everywhere comes from the impact fetcher counting **rows with no status filter**.

### The three live fetchers (root cause of disagreement)
| Fetcher | File | What it counts | Beds result | Washers | Communities |
|---|---|---|--:|--:|--:|
| `getAssetStats` / `fetchImpactData` | `v2/src/lib/data/impact-fetcher.ts:55-87` | `ilike product '%bed%'` / `'%washing%'`, **head:true row count, NO status filter, ignores quantity** | **520** ❌ | **41** ❌ | 10 |
| funder `metrics.ts` | `v2/src/lib/funders/metrics.ts:31-104` | `status='deployed'` (or `in [deployed,allocated]`) + `supply_date` period window, row count | **495** (period-scoped) | n/a | per-funder |
| funder partner-map | `v2/src/lib/data/partners.ts:228` | live deployed override else fallback | live deployed | — | — |

**`/impact` and the per-audience impact reports both call `fetchImpactData`**, so they publish the wrong numbers:
- beds-delivered `current = totalBeds = 520` (includes 108-as-1-row Centrecorp `requested`, 20 `ready`, 3 `demo`)
- plastic-diverted = `520 × 20 = 10,400 kg` (should be `496 × 20 = 9,920 kg`)
- washing machines = `41` rows (includes 10 retired + 3 under_investigation; honest deployed = 28, working ≈ 14)
- livesImpacted = `totalAssets(561) × 2.5 ≈ 1,403`

### Static-literal drift
| Location (file:line) | Claims | Live truth | Δ |
|---|---|---|---|
| `lib/data/impact-fetcher.ts:65` (drives /impact + reports) | **520 beds** (rows, all statuses) | 496 deployed | **+24** (108-row + 20 ready + 3 demo etc. counted as delivered) |
| `lib/data/impact-fetcher.ts:66` washers | **41** (all statuses) | 28 deployed / ~14 working | **+13 / +27** |
| `lib/data/impact-fetcher.ts:332` plastic | 520×20 = **10,400 kg** | 496×20 = 9,920 kg | **+480 kg** |
| `app/impact/page.tsx:133` | renders the 10,400 / "1.0t" wrong via fetcher | 9,920 kg | downstream of above |
| `components/layout/impact-banner.tsx:6` | **520+ beds** | 496 deployed | +24 (sitewide footer banner) |
| `app/about/page.tsx:34` | **520+ beds** | 496 | +24 |
| `app/about/page.tsx:35` | **14** washing machines on Country | 28 deployed / 14 working | matches "working", not "deployed" |
| `app/about/page.tsx:36` | **8** communities partnered | 9 deployed / 10 distinct | −1/−2 (stale) |
| `app/about/page.tsx:83` | "over five hundred beds … eight communities" | 496 / 9–10 | prose, stale |
| `app/stories/page.tsx:277` | **520+** beds delivered | 496 | +24 |
| `app/stories/page.tsx:212,276` | `communityCount` = distinct **storyteller places** (live EL, NOT assets) | 10 asset communities | a *fourth* "communities" definition |
| `components/marketing/impact-stats.tsx:21-22` | default **389 beds, 8 communities** | 496 / 9–10 | **−107** (very stale; default when `fetchLive=false`) |
| `app/pitch/page.tsx:408-409` | **496** bed units, **10** communities | 496 / 10 | ✅ correct |
| `app/story/page.tsx:858` | **496** bed units deployed | 496 | ✅ |
| `app/story/page.tsx:88,89` | "400+ Beds" (2024), "8+ communities" | narrative/historical | ok as history |
| `app/community/page.tsx:445` | **496** | 496 | ✅ |
| `lib/data/funder-shared-content.ts:7` | **496** bed units, 10 communities | 496 / 10 | ✅ |
| `lib/data/grant-content.ts:101` | bedsDeployed **496** | 496 | ✅ |
| `lib/data/grant-content.ts:100` | totalAssetsTracked **558** (QR rows) | 561 rows / 674 units | −3 (QR-only subset, labelled) |
| `lib/data/grant-content.ts:102` | washersDeployed **14** ("honest working") | 28 deployed / 14 working | matches "working", labelled |
| `lib/data/grant-content.ts:105,200` | plastic **9,920 / 9,900 kg** | 9,920 kg (496×20) | ✅ (two slightly different literals) |
| `lib/data/compendium.ts:383` | `EXPECTED_DEPLOYED_BEDS = 495` | 496 | **−1** (static canonical const; off by one) |
| `lib/data/compendium.ts:367-375` (`deployments[]`) | per-community summing to **495**; **Canberra beds 1** | live Canberra deployed beds = 2 | Canberra −1; total −1 |
| `lib/data/compendium.ts:626` | plastic = 495×20 = **9,900 kg** | 9,920 kg | −20 kg (rides EXPECTED_DEPLOYED_BEDS) |
| `lib/data/compendium.ts:671,754` | "389 assets tracked", "369 vs 389" | historical 2024 note | ok as history |
| `lib/data/content.ts` `communityPartnerships` (489/509/529/539, +Alice 16 @499) | TC 159, Palm 131, Utopia 147, Maningrida 18, Alice 16, Townsville 0 (sum **471**, subset) | matches per-community where present | curated narrative subset — guarded ≤ canonical |
| `lib/data/content.ts` `communityLocations` (775/786/797/812/828/841/854) | TC 159, Palm 131, Alice 16, Utopia 147, MtIsa 2, Kalgoorlie 20, Maningrida 18 (sum **493**) | matches per-community | **map heatposts — STATIC** (see note) |
| `lib/data/grant-content.ts:112-119` `deployments[]` | TC159/Utopia147/Palm131/Kalg20/Man18/Alice16/MtIsa2/Darwin1 (8 communities, sum 494) | matches; omits Canberra | labelled register pull |
| `lib/data/outreach-targets.ts:202` | "9,225kg+ plastic diverted" | 9,920 kg | stale literal |
| `lib/data/content.ts:1232` pressBoilerplate | "400+ beds … 8+ communities" | 496 / 9–10 | stale prose |

**Map is NOT auto-correcting (contradicts the MEMORY note).** `/communities` → `communities/page.tsx:29` passes the **static** `communityLocations` array to `community-map.tsx`, which renders `loc.bedsDelivered` verbatim (`community-map.tsx:186`). The JSDoc at `content.ts:758-764` describes a "live-map resolver" that overrides `bedsDelivered` — **no such resolver exists in the public communities-map path**. (The live override DOES exist, but only for the *funder* map via `partners.ts:228`.) So the public map shows hand-maintained numbers, not the register.

---

## (c) Status semantics + washer reconciliation

- **Deployed = in a home / in service.** Public + funder headline numbers should be `status='deployed'` only, summed by **`quantity`** (496 beds / 28 washers). The `impact-fetcher` bug is that it (1) drops the status filter and (2) uses `head:true` row counts that ignore `quantity` — by luck the bed row-count (520) is close-ish, but it is wrong in both directions (includes non-deployed rows; would undercount if bulk rows were deployed).
- **The 108 Centrecorp `requested` row** is the single biggest landmine: it's a pipeline placeholder. Any "units"-based sum that doesn't filter status balloons to 674. Any row-based "%bed%" count silently adds it as +1 bed (part of why 520 > 495).
- **Washers 28 deployed vs ~14 working:** `assets` says 28 deployed (TC14/Man6/PI4/Alice3/Darwin1) + 10 retired + 3 under_investigation = 41 rows. Fleet telemetry only confirms ~14 machines actually reporting/working (see `grant-content.ts:102` "honest working", and fleet memory: only F25-class reporting). **These measure different things** — "deployed in the register" (28) vs "telemetry-confirmed working" (≈14). Pick the label per surface: funder/grant copy already uses the honest **14 working**; `/impact` currently shows **41** (wrong — includes retired). Recommend: register-deployed = 28, working = 14, never 41.
- **Communities has FOUR definitions in play:** 9 (deployed-only), 10 (any status incl. Mutitjulu allocated-only), 8 (stale literals), and "storyteller places" (stories page, EL-derived). Standardise on **deployed-only count (9)** or **distinct-community (10)** and label it.

---

## (d) Recommendation — single canonical rollup

**1. Fix `impact-fetcher.ts` to be the one canonical rollup, then make every other surface read it (or its cached output).** Concretely, in `getAssetStats` (`v2/src/lib/data/impact-fetcher.ts:55-87`):
- Filter `.eq('status','deployed')` on the bed and washer counts (or expose both "deployed" and "all" so callers choose explicitly).
- Sum **`quantity`**, not row count — fetch `product,status,quantity,community` and reduce, instead of `head:true`. (Today bulk rows are mis-weighted; the 108 row would flip the number if its status ever changes to deployed.)
- `communitiesServed` should count distinct community **where status='deployed'** (→ 9), not over all rows (→ 10 incl. Mutitjulu).
- Result: beds 496, washers 28, plastic 9,920 kg, communities 9 — replacing the published 520 / 41 / 10,400 / 10.
- For washers, expose `washersDeployed: 28` AND `washersWorking: 14` (telemetry) so copy can choose; never surface 41.

**2. Promote a single exported helper** (e.g. `getCanonicalAssetRollup()`) returning `{ bedsDeployed, washersDeployed, washersWorking, communitiesServed, plasticKg, totalUnits, totalRows }` and have `fetchImpactData`, the impact reports, `/impact`, the impact-banner, about/stories stat blocks, and the `/communities` map all consume it (banner/about/stories can read it server-side or via a small `/api/impact-summary` route). This kills the "every surface counts differently" problem at the source.

**3. Make the `/communities` map actually live** (or relabel it). Either wire `communityLocations` through a deployed-by-community resolver (the data already exists — `DEPLOYED_BEDS_BY_COMMUNITY` above), respecting `staticBedCount` for Mt Isa/Kalgoorlie, OR delete the misleading "live-map resolver" JSDoc at `content.ts:758-764`. Right now it's static and silently drifts.

### Hardcoded copies to KILL / fix (priority order)
1. **`impact-fetcher.ts:65-66`** — add status filter + quantity sum. *This one line-pair is the source of the 520/41/10,400 the team keeps seeing.* (highest impact)
2. **`components/marketing/impact-stats.tsx:21-22`** — `389 beds / 8 communities` default is wildly stale; set to live or to 496/9 and force `fetchLive`.
3. **`components/layout/impact-banner.tsx:6`, `app/about/page.tsx:34,36,83`, `app/stories/page.tsx:277`** — `520+` and `8 communities` → read canonical rollup (or hardcode 496 / 9 with a dated comment until wired).
4. **`compendium.ts:383` `EXPECTED_DEPLOYED_BEDS = 495` → 496**, and **`compendium.ts:375` Canberra beds 1 → 2** (then 626 plastic auto-fixes to 9,920). This const is the static canonical anchor that the content.ts build-guard keys off — bumping it to 496 keeps the guard honest.
5. **`outreach-targets.ts:202`** `9,225kg` → 9,920 kg; **`content.ts:1232`** "400+ beds/8+ communities" → 496/9.
6. **Standardise washers** to deployed 28 / working 14 everywhere; never 41.

### Already correct (keep as the reference pattern)
`pitch/page.tsx:408-409`, `story/page.tsx:858`, `community/page.tsx:445`, `funder-shared-content.ts:7`, `grant-content.ts:101-102,105` are all on 496 / 10 / 9,920 / 14-working — these are the surfaces that were reconciled and should be the template for the rest.

---

### Provenance
All live counts queried directly from `assets` on `cwsyhpiuepvdjtxaozwf` via service-role node script (`v2/tmp-asset-counts.mjs`, deleted after run) on 2026-05-30. Fetcher replication (`520 / 41 / 495-deployed / 496-units`) confirmed by re-running each surface's exact query. Static literals read directly from the cited files. **Telemetry "14 working" washers is from existing code comments + fleet memory, NOT re-verified against the fleet tables this session (Unverified).**
