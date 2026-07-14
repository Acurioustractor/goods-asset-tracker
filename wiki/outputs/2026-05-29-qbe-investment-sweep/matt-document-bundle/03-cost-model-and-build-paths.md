# 03 — Cost Model, Build Paths & Containerisation Economics

**As-of:** 2026-05-30 (model v6 — community fair-wage reframe + locked founder basis)
**Source:** `wiki/outputs/2026-05-29-qbe-investment-sweep/01-cost-model-idiot-index.json` (v6) and `v2/src/lib/data/cost-model-scenarios.json` (v6 build_states)
**Price held flat throughout:** $750/bed (verified — shop `stretch-bed-single`).
**This is the file with the unit-cost levers for the model.**

---

## A. The four manufacturing methods

Each method differs only in *how much of the HDPE leg-making we do ourselves*. Steel, canvas and hardware are the same across all four.

| Method | What Defy does | What we do | Plastic cost/bed | Direct total/bed | Idiot index (plastic) | Verdict | Confidence |
|---|---|---|--:|--:|--:|---|---|
| **1. Buy-Kit** (today) | shred + press + CNC + finish | assemble | 344.05 | **469.79** | 8.6 | Best bought-in path today, no capex | verified |
| **2. Buy-Panels** | shred + press | CNC + assemble | 400.00 | **584.07** | 10.0 | Worst value — avoid (pay press margin, still finish) | verified |
| **3. Factory in-house** | supply bagged shred | press + CNC + assemble | 55.00 | **275.74** | 1.4 | Target state — needs press + CNC capex | verified inputs / modelled total |
| **4. Community-owned** | (waste plastic, no Defy) | collect + press + CNC + assemble | 0.00 | **270.74** | — | Vision state — free feedstock + **$130 fair-wage labour**; ~parity with the factory, margin community-owned | future |

\*Community direct total $270.74 = steel $27 + canvas $93.50 + hardware $5.24 + diesel $15 + free plastic $0 + **$130 fair-wage labour**. v6 reframe: the community state pays a dignified $130/bed fair wage (band $100–160), so it lands at ~parity with the factory ($275.74) — it is NOT the "cheapest" state; the point is that the wage AND the margin stay in community.

### Component build-up per method (all AUD/bed)

| Component | Buy-Kit | Buy-Panels | Factory | Community |
|---|--:|--:|--:|--:|
| HDPE legs | 344.05 (finished kit) | 400.00 (2 panels) | 55.00 (raw shred 20kg @ $2.75) | 0.00 (free waste plastic) |
| Steel poles (DNA Steel) | 27.00 | 27.00 | 27.00 | 27.00 |
| Canvas (Centre Canvas) | 93.50 | 93.50 | 93.50 | 93.50 |
| End caps + screws + bolts | 5.24 | 5.24 | 5.24 | 5.24 |
| Diesel (press + CNC) | — | 5.00 (CNC only) | 15.00 | 15.00 |
| Labour | (Defy assembly billed separately) | 53.33 ($400/day ÷ 7.5) | 80.00 ($400/day ÷ 5) | **130.00 (fair wage)** |
| **Direct total** | **469.79** | **584.07** | **275.74** | **270.74** |
| Capex cumulative to reach state | $2K (bench) | $40K | $200K | $230K |
| Throughput (beds/day) | 10 (assemble only) | 4 | 4 | 5 |
| Margin at $750 | $215* / 29% | $166 / 22% | $474 / 63% | **$479 / 64%** |

\*Buy-Kit margin uses direct-with-assembly-and-freight $534.79 (the margin grid). On a marginal-cost-with-long-haul-freight basis (~$685) the contribution is thinner — see §C.

---

## B. The Idiot Index (Musk first-principles: current price ÷ raw-material floor)

This is the lever map. The higher the index, the more supply-chain markup we could capture in-house.

| Element | Raw floor/bed | Current paid/bed | Idiot index | Biggest lever? | Cost-down path |
|---|--:|--:|--:|:--:|---|
| **HDPE kit** (Defy cut+finished) | 40.00 | 344.05 | **8.6** | ✅ **YES** | In-source shred+press+CNC → factory legs ~$150/bed; moves ~$194/bed + captures ~$289 Defy margin |
| HDPE pre-pressed panel (alt) | 40.00 | 400.00 | 10.0 | no | AVOID — pay press margin but still CNC+assemble |
| Steel poles (DNA Steel) | 12.67 | 27.00 | 2.1 | no | Already reasonable; local NT-procurement premium worth keeping |
| Canvas (Centre Canvas) | 38.50 | 93.50 | 2.4 | no | In-house sewing line only at volume; competitive vs $130 self-sew |
| End caps | 2.60 | 3.20 | 1.2 | no | Near cost; bulk-supplier direct |
| Screws | 1.04 | 1.04 | 1.0 | no | Already raw rate |
| Bolts | 0.60 | 1.00 | 1.7 | no | Trivial $ impact |
| Defy assembly labour | 60.00 | 55.95 | 0.9 | no | Competitive; in-sourcing is a jobs/mission move, not a cost move |

**First-principles floor** (every input at raw rate, industry-low labour): **$128.99/bed** vs current Buy-Kit direct $469.79 → **$340.80/bed of supply-chain markup**, of which **$289.05** sits in the HDPE kit alone. (Confidence: modelled. Aspirational floor only — not achievable today.)

**Read:** HDPE is the whole game. Everything else is already within ~2.5x of raw and not worth chasing. Steel and canvas premiums buy local Alice Springs supply and are worth keeping.

---

## C. Honest unit economics — marginal vs fixed (avoid the naive trap)

The naive "fully-loaded at 100 beds" figure of **~$1,780/bed** is arithmetically real but misleading: it divides the fixed annual cost block by an artificially small 100-bed denominator and misclassifies variable long-haul freight as overhead. Separate the two:

### Marginal cost (cost to make one more bed)

| Path | Direct materials | + Assembly | + Local freight | + Long-haul freight | **Marginal/bed** | Confidence |
|---|--:|--:|--:|--:|--:|---|
| Buy-Kit (today) | 469.79 | 40.00 | 25.00 | 150.00 | **684.79** | modelled (verified inputs) |
| Factory (future) | 275.74 | (incl.) | (incl.) | 150.00 | **425.74** | modelled / future |
| Community (future) | 270.74 | (incl.) | (incl.) | 150.00 | **420.74** | modelled / future |

### Fixed annual block (~$109,500/yr, modelled — founder $560/day LOCKED)

| Line | $/yr |
|---|--:|
| Kirmos facility (Sunshine Coast, 50% to beds) | 27,000 |
| Founder production time (30 days × $560) | 16,800 |
| Admin | 14,700 |
| Field travel | 51,000 |
| **Total fixed block** | **109,500** |
| *Excluded deliberately (cost-of-capital, not unit cost):* founder fundraising 50 days ($28K) + commercialisation 25 days ($14K) | *(42,000)* |

### Breakeven volume (at $750 price)

| Path | Marginal | Contribution/bed | Fixed block | **Breakeven beds/yr** |
|---|--:|--:|--:|--:|
| **Factory** | 425.74 | 324.26 | 109,500 | **~338** |
| **Community** | 420.74 | 329.26 | 109,500 | **~333** |
| **Buy-Kit** | 684.79 | 65.21 | 109,500 | **~1,679** |

**Key insight for the model:** on the bought-in Buy-Kit path the per-bed contribution ($65) is too thin to ever cover the fixed block at realistic volume — **in-sourcing the legs is what closes the economics**, dropping breakeven from ~1,679 to ~338 beds/yr.

> **Founder-time basis (LOCKED 2026-05-29):** founder day-rate **$560/day** (the Day-3 fair-market $140K/yr basis; supersedes the earlier $1,000/day), 150 days/yr (30 production / 50 fundraising / 25 commercialisation / 45 governance). Only the 30 production days ($16,800) sit in the bed fixed block; the other 120 days are cost-of-capital + customer-acquisition + ACT-wide, not unit cost.

---

## D. Factory economics & capex (the containerisation question)

Bringing leg-making in-house at our own containerised plant is the core capital decision.

| Metric | Value | Source/confidence |
|---|--:|---|
| Factory direct cost/bed | 275.74 | modelled (verified inputs) |
| In-house legs/bed | 150.00 | plastic $55 + diesel $15 + labour $80 (modelled) |
| Bought-in legs/bed (Defy kit) | 344.05 | verified |
| **Saving per bed (legs)** | **194.05** | the containerisation prize, materials level |
| Defy margin captured/bed | 289.05 | kit $344.05 − raw shred $55 (modelled) |
| **Capex to reach factory (GROSS, low–high)** | **112,000 – 222,000** | modelled (equipment not firm-quoted) |
| Already invested (facility + tooling) | 110,046 | verified — $100K facility + $10,046 Carbatec tooling |
| **Net capital ask (low–high)** | **~2,000 – 111,954** | gross capex − already invested. Quote $112–222K GROSS *or* ~$2–112K NET — never "$90–200K". |

**Capex breakdown to reach factory state** (modelled, equipment not yet firm-quoted):

| Equipment | Low | High |
|---|--:|--:|
| Shredder | 15,000 | 30,000 |
| Hot-press line | 80,000 | 150,000 |
| CNC router | 15,000 | 40,000 |
| Workbench/tools | 2,000 | 2,000 |
| **Total** | **112,000** | **222,000** |

**Factory process** (the containerised plant): raw HDPE shred (20kg/bed @ $2.75/kg incl. delivery) → heat press (190°C, ~5,000 PSI) → CNC router → assemble. Throughput ~4–5 beds/day × ~250 working days ≈ **1,000 beds/yr from one facility**. Diesel ~$15/bed (25L/day ÷ 5 beds); operator labour ~$80/bed ($400/day ÷ 5 beds). The two-container system (shredder container + production container) is mobile and can transfer to community ownership.

### Containerisation payback by volume

| Beds/yr | Annual saving (legs) | Payback on $112K (gross low) | Payback on $222K (gross high) |
|--:|--:|--:|--:|
| 100 | $19,400 | 5.8 yr | 11.4 yr |
| 500 | $97,000 | 1.2 yr | 2.3 yr |
| 1,000 | $194,000 | 0.6 yr | 1.1 yr |

**Decision rule:** capex is only sensible above **~300 beds/yr committed** — buy Defy kits below that. Tie the capital draw to committed volume. (At the $144,525 annual Defy-margin prize at 500 beds/yr, the plant pays for itself inside ~1 year on the low gross ask.)

---

## E. Cost-down trajectory (the staged path)

| Stage | Label | Trigger | Plastic legs/bed | Direct total/bed | Marginal w/ freight | Confidence |
|--:|---|---|--:|--:|--:|---|
| 0 | Defy kits | today ~100/yr, no plant | 344.05 | 469.79 | ~685 | verified |
| 1 | In-source assembly | ~150–300/yr, $2K bench + trained operators | 344.05 | 469.79 | ~660 | target |
| 2 | In-source pressing+CNC (Factory) | ~300–500/yr committed, $112–222K gross capex | 150.00 | 275.74 | ~426 | target / future |
| 3 | Community-owned + free waste plastic | ~1,000/yr, $130/bed fair-wage labour + council-paid feedstock | 0.00 | 270.74 | ~421 | future |

Stage 3 lands at ~parity with the factory (it is not cheaper); the value is community ownership of the margin + dignified paid work. It requires council waste-offset revenue + fair-wage labour funding (employment-grant or co-op) — both future, not contracted.

---

## F. Unit-cost levers for the model (summary)

| Lever | Range | Impact | Best modelled as |
|---|---|---|---|
| **Manufacturing method** | Buy-Kit → Buy-Panels → Factory → Community | Direct cost $270.74 ↔ $584.07/bed | The primary selector |
| **Production location** | Sydney (Defy) → Sunshine Coast facility → on-country | Drives method + freight | Coupled to method + freight |
| **Shipping / freight** | local ~$25 + long-haul ~$150/bed | Variable, not overhead — keep in marginal | Per-bed variable |
| **Labour** | Defy assembly $55.95 → factory $80 → community $130 (fair wage) | Per-bed; jobs/mission trade-off | Per-bed by method |
| **Volume** | 100 → 500 → 1,000 beds/yr | Amortises $109.5K fixed block; sets breakeven | Denominator on fixed block |
| **Price** | held at $750 (verified) | Contribution margin | Hold flat unless testing |
| **Founder rate** | $560/day (LOCKED) | Sets founder production share of the fixed block | Locked input |

**Benchmarks** (do not quote as open-market price): commercial buyer benchmark $801/bed (Centrecorp INV-0291, but grant-funded); counterfactual commercial steel-frame bed AU 2026 $1,500–$2,000 (inferred, no firm quotes).
