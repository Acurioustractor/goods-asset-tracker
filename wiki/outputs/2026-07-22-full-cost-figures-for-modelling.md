# Every figure in the bed cost model

**Date:** 2026-07-22
**Purpose:** The complete input set so the community ownership question can be worked as a real model instead of headline numbers.
**Sources:** `v2/src/lib/data/cost-model-scenarios.json` (the locked data), `cost-model-scenarios.ts` (the mapping), `cost-model/engine.ts` (the math). Locked 2026-05-29.

> **Read section 6 first.** Two figures being used in the ownership story do not mean what they have been taken to mean.

---

## 1 · Bill of materials, per bed

Verified from invoices unless marked.

| Item | Cost | Source | Status |
|---|---|---|---|
| HDPE kit from Defy, cut and finished | $344.05 | Defy INV-1602 + INV-1732 | verified |
| Steel poles | $27.00 | DNA Steel Direct, Alice Springs | verified |
| Canvas | $93.50 | Centre Canvas, 3 invoices 2026, 270 covers | verified |
| End caps, 4 at $0.80 | $3.20 | Hardware supplier | verified |
| Screws, 16 at $0.065 | $1.04 | Coastal Fasteners RB20247673190 | verified |
| Bolts, 2 at $0.50 | $1.00 | Coastal Fasteners | **inferred**, rate estimated |
| **Defy kit direct materials** | **$469.79** | | |

Raw inputs if pressing yourself instead of buying the kit:

| Item | Cost | Basis |
|---|---|---|
| HDPE shred, 20kg at $2.75/kg landed | $55.00 | $2.00/kg shred + $0.75/kg delivery, Defy INV-1731 |
| Defy pre-pressed panel, each | $200.00 | INV-1731, 20 panels bulk |

---

## 2 · The four build paths

| | Kits (today) | Panels | Factory | Community |
|---|---|---|---|---|
| Plastic | $344.05 kit | $400.00 (2 panels) | $55.00 shred | **$0.00** collected free |
| Steel | $27.00 | $27.00 | $27.00 | $27.00 |
| Canvas | $93.50 | $93.50 | $93.50 | $93.50 |
| Hardware | $5.24 | $5.24 | $5.24 | $5.24 |
| Diesel | — | $5.00 | $15.00 | $15.00 |
| Labour | $40.00 ($400 ÷ 10/day) | $53.33 ($400 ÷ 7.5) | $80.00 ($400 ÷ 5) | **$130.00** fair wage |
| Freight on materials | $25.00 | — | — | — |
| **Direct total** | **$534.79** | **$584.07** | **$275.74** | **$270.74** |
| Plus long-haul freight | $150.00 | $150.00 | $150.00 | $150.00 |
| **Marginal cost per bed** | **$684.79** | **$734.07** | **$425.74** | **$420.74** |
| **Contribution at $750** | **$65.21** | **$15.93** | **$324.26** | **$329.26** |
| Throughput | 10 beds/day | 4 | 4 | 5 |
| Capital added | $2,000 | $38,000 | $160,000 | $30,000 |

Community labour band: **$100 to $160 per bed**, default $130. At the band edges the community direct total runs **$240.74 to $300.74**.

The community path sits about **$5 below** the factory path. It is economic parity, not cheap labour. Worth being precise about this in the room, because "community production is cheaper" is both wrong and a bad thing to say.

---

## 3 · Machines and capital

**Central factory, to reach the Factory path:**

| Item | Low | High |
|---|---|---|
| Shredder | $15,000 | $30,000 |
| Hot press line | $80,000 | $150,000 |
| CNC router | $15,000 | $40,000 |
| Workbench and tools | $2,000 | $2,000 |
| **Gross total** | **$112,000** | **$222,000** |

Already spent: **$110,046** (facility $100,000 + Carbatec tooling $10,046).
Net ask after that: **$1,954 low, $111,954 high**.

**A standalone community site** (`standalone_site_capex`):

| | Amount |
|---|---|
| Per site, low | $100,000 |
| Per site, mid | $125,000 |
| Per site, high | $150,000 |
| Three sites | $300,000 to $450,000 |

Flagged **unverified** in the data itself: "needs vendor quotes."

---

## 4 · The fixed running block

| Line | Amount/yr |
|---|---|
| Founder time on production, 30 days at $560 | $16,800 |
| Kirmos facility, $2,250/mo at 50% to beds | $27,000 |
| Admin | $14,700 |
| Field travel | $51,000 |
| Rent (location dependent, see below) | $0 to $54,000 |
| **Total at Sydney (rent $0)** | **$109,500** |

**Rent by location:**

| Location | Rent/yr | Inbound freight/bed |
|---|---|---|
| Sydney / Defy | $0 | $0 |
| Sunshine Coast (Kirmos) | $54,000 | $30 |
| On Country | $24,000 | $60 |

Founder day rate is **locked at $560/day, 150 days/yr on Goods = $84,000**, split: production 30d ($16,800), fundraising 50d ($28,000), commercialisation 25d ($14,000), governance and brand 45d ($25,200). Only the production 30 days touches unit cost.

Other operating dials: operator **$400/day** ($50/hr), Kirmos facility $45/hr, local freight $25/bed, long-haul freight $150/bed, containerising saves **$70/bed** on long haul.

---

## 5 · Break-even, overhead absorption, and the ramp

**Break-even = fixed block ÷ contribution per bed:**

| Path | Contribution | Break-even beds/yr |
|---|---|---|
| Kits | $65.21 | **1,679** |
| Panels | $15.93 | 6,874 |
| Factory | $324.26 | **338** |
| Community | $329.26 | 333 |

**Overhead per bed, by volume** (this is why volume matters more than anything else):

| Volume | Kirmos | Founder | Admin | Travel | Freight | **Total/bed** |
|---|---|---|---|---|---|---|
| 100/yr | $270 | $168 | $147 | $510 | $150 | **$1,095** |
| 500/yr | $54 | $33.60 | $29.40 | $102 | $100 | **$219** |
| 1,000/yr | $27 | $16.80 | $14.70 | $51 | $80 | **$109.50** |

**First-principles floor:** a bed at raw market rates is **$128.99**. The Defy kit path direct is $469.79. That is **$340.80/bed of supply-chain markup**, and it is the entire capital case.

Idiot index: kit at **8.6×** the shred floor ($344.05 ÷ $40), **21.5×** the true polymer floor ($344.05 ÷ $16). In-house legs saving is **$194.05/bed**.

**Volume ramp, 3 sites** (marked inferred, per-site capacity 250/yr is an explicit assumption): Year 1 150 beds, Year 2 400, Year 3 600.

**Debt service** (inferred): brokerage $200/bed on ~480 revenue beds/yr = $96,000/yr. Coverage 2.7× to 7.7× on debt of $250K to $500K at 5 to 7%. Floor is ~$91/bed if carrying the full $500K.

---

## 6 · Two corrections that matter for the ownership question

### The "$24,000 a year site bill" is rent only

`ask-surface.ts:205` says a community site has a "site bill ~$24K/yr". That $24,000 is `LOCATIONS.on_country.rentPerYear` in the engine. It is **the rent line and nothing else.**

Run the actual fixed block at an On Country location and it is:

$16,800 + $27,000 + $14,700 + $51,000 + $24,000 = **$133,500/yr**

Now, a genuinely standalone community site would not carry Goods' founder time, Kirmos, or the full field travel. But **nobody has modelled what it does carry.** There is no community-site fixed block anywhere in the data. An operator's wage, diesel, maintenance, insurance, admin, and repairs are all unaccounted for.

**Consequence:** the "75 to 100 beds a year and it stands on its own" claim rests on a $24,000 bill that is rent with nothing else in it. If the real number is even $40,000, break-even moves to about 121 beds a year. At $60,000 it is 182.

**This needs to be built before the ownership routes can be chosen.** It is the single most load-bearing missing number.

### The community site capex has two different figures

- `standalone_site_capex`: **$100,000 to $150,000** per site, marked unverified.
- `build_states.state_5_community.capital_added`: **$30,000**.

These are not reconciled. The $30,000 reads as an increment on top of an existing central factory. The $100-150K reads as a site from scratch. Which one applies decides whether a community can realistically buy in, so it has to be settled.

---

## 7 · What to do with this

To model the ownership routes properly, three numbers are needed and none exist yet:

1. **A real community-site fixed block.** Operator wage, diesel, maintenance, insurance, admin, repairs. Not the rent line.
2. **Vendor quotes on the site capex**, to settle $30,000 versus $100-150K and move it off "unverified".
3. **The 50-bed in-house run.** Zero beds have been pressed in-house. Every figure in the Factory and Community columns is modelled.

Until 1 and 2 land, any ownership route is being priced against an incomplete cost base, and the earlier finding (that a site cannot buy itself out of surplus at 75 to 100 beds a year) is if anything **understated**, because the surplus it was calculated from used a rent-only bill.

---

**Claims status:** BOM is **verified** from invoices, except bolts (inferred). All Factory and Community bed costs are **modelled** from zero in-house beds. Central capex ranges are **modelled**, quotes pending. Standalone site capex is **unverified** and self-flagged. Volume ramp, debt service and per-site capacity are **inferred**. The $133,500 On Country figure and the revised break-evens in section 6 are **arithmetic derived here** from the engine's own formula, not previously published.
