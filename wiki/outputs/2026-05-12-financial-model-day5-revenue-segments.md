# Financial model Day 5: Revenue model by segment (v0.1)

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** v0.1. Anchored on the verified Xero-clean revenue baseline ($684,911 cumulative, post-Ingkerreke). **Source data:** `act-global-infrastructure/data/goods/{pnl-summary,top-contacts,account-transactions}.json`. **Builds on:** [[2026-05-12-financial-model-day4-unit-economics]].

## What this is

A 7-segment revenue model that maps every $ Goods has earned to date against the channels where future revenue will come from. Each segment has: verified evidence, pipeline status, Year 1 / Year 3 / Vision 2030 targets, expected margin profile, and sales effort. Replaces the 4-segment model currently in `v2/src/lib/data/impact-model.ts` REVENUE_SEGMENTS.

## Verified revenue to date (from corrected Xero baseline)

Grouped by the segments below:

| Segment | Verified contacts | Verified $ to date | % of revenue |
|---|---|---:|---:|
| **1. Donor-funded institutional distribution** | Snow Foundation, Centrecorp Foundation, Vincent Fairfax, Rotary Eclub | $611,461 | 89.3% |
| **2. Direct institutional commercial** | Mala'la Health, Julalikari Council, Our Community Shed | $45,499 | 6.6% |
| **3. Corporate sponsorship / RAP** | QIC Limited | $12,000 | 1.8% |
| **4. Community / maker partners (commercial)** | Red Dust Role Models | $15,950 | 2.3% |
| **5. Government procurement** | (none yet) | $0 | 0% |
| **6. Direct retail / B2C** | (none yet) | $0 | 0% |
| **7. Adjacent markets** | (none yet) | $0 | 0% |
| **Total** | | **$684,911** | **100%** |

## The 7 segments in detail

### Segment 1: Donor-funded institutional distribution

The Centrecorp pattern. A philanthropic donor grants funding to Goods, with the grant earmarked for community bed deployment. Recipient communities pay $0; donor pays cost + freight + delivery + project work. Currently classified as `income_type = grant` in Xero.

| Metric | Value |
|---|---|
| Verified to date | $611,461 across 4 donors |
| Top contacts | Snow Foundation ($271K, mostly R&D / WISE wage contributions), Centrecorp Foundation ($208K, 109 beds Utopia Homelands), Rotary Eclub Outback ($82.5K Basket Beds), Vincent Fairfax Family Foundation ($50K) |
| Sales effort | HIGH (long cycle, foundation-development work, but high $/conversation) |
| Margin profile | Donor covers full delivered cost; surplus is the gap between grant amount and actual delivered cost. Centrecorp $208K / 109 beds = $1,908/bed avg gross. |
| Year 1 target | **$400K-$600K** (continuation + new foundations) |
| Year 3 target | **$1.2M-$2M** |
| Vision 2030 | **$4M-$8M** |
| Pipeline | Centrecorp Foundation $212K remaining + plant quote $93.5K; additional foundations in conversation |
| Notes | This is the strongest single proof point. Demonstrates institutional trust at scale. Powers the "anchor donor" story for SEFA / IBA / QBE Stage 2. Strongly correlated with Butterfly DGR pathway (next-stage donors may prefer the DGR vehicle). |

### Segment 2: Direct institutional commercial

Aboriginal Community Controlled Organisations, councils, community corporations buying beds from their own operational budgets. Real commercial transactions at institutional rate $560/bed.

| Metric | Value |
|---|---|
| Verified to date | $45,499 across 3 customers (excluding Ingkerreke which was misclassified) |
| Top contacts | Julalikari Council Aboriginal Corporation ($19,800, 4 washing machines), Our Community Shed Incorporated ($20,265, beds + washing machine), Mala'la Health Service Aboriginal Corporation ($5,434, basket bed + shipping) |
| Sales effort | MEDIUM (procurement pathway, relationship-led, smaller transactions) |
| Margin profile | Institutional rate $560/bed. Per Day 4 unit econ: ~1.8% Y0, ~14.5% Y1, ~37% Y3. |
| Year 1 target | **$200K-$400K** |
| Year 3 target | **$1M-$2M** |
| Vision 2030 | **$3M-$6M** |
| Pipeline | Miwatj Health 8-clinic fleet (EOI), NPY Women's Council 200-350 beds ($150K-$262K, LOI being requested), WHSAC / Groote Eylandt 500 beds + 300 washers ($1.5M+, procurement pathway open), Homeland Schools $34K in conversation, PICC 40 beds $36K (INV-0317 AUTHORISED) |
| Notes | The "transition to commercial sustainability" story lives here. Currently small ($45K) but pipeline is significant. Conversion from EOI to signed LOI is the gating activity. |

### Segment 3: Government procurement

NT and QLD government housing, health, and remote services programs. NDIS-adjacent.

| Metric | Value |
|---|---|
| Verified to date | $0 (no government contracts converted yet) |
| Sales effort | HIGH (slow procurement cycles, panels, social-procurement registration) |
| Margin profile | Institutional rate $560 with potential social-procurement premium |
| Year 1 target | **$0-$100K** (panels still in registration stage) |
| Year 3 target | **$500K-$2M** |
| Vision 2030 | **$5M-$15M** (NT Remote Housing alone is $4B over 10yr) |
| Pipeline | NT Remote Housing Infrastructure Panel (register when furniture panel opens), QLD QPP 2026 social procurement preference, Supply Nation certification (CRITICAL, gates 3x more contracts at $2.3B of $3.8B), NIAA conversations |
| Notes | Largest by long-term TAM. Slowest to convert. Gating events: Supply Nation certification (via Oonchiumpa partnership), NT panel openings, social-procurement category creation. Defensive timeline. |

### Segment 4: Corporate sponsorship / RAP

Corporate clients sponsoring beds for community deployment as part of their Reconciliation Action Plan, NAIDOC week activations, employee engagement.

| Metric | Value |
|---|---|
| Verified to date | $12,000 (QIC LIMITED INV-0232) |
| Sales effort | MEDIUM (corporate cycles, relationship + brand storytelling) |
| Margin profile | Premium pricing ($750+ per bed including engagement work and storytelling) |
| Year 1 target | **$50K-$150K** |
| Year 3 target | **$300K-$600K** |
| Vision 2030 | **$1M-$3M** |
| Pipeline | QIC interest in 50-bed NAIDOC build, broader corporate RAP outreach yet to launch |
| Notes | Cross-promotional value (brand + impact story) often exceeds the revenue itself. Good fit for staff team-build / NAIDOC week activations. |

### Segment 5: Community / maker partners (commercial)

Other community-focused organisations buying beds or supplies for their own programs (not for redistribution to homes).

| Metric | Value |
|---|---|
| Verified to date | $15,950 (Red Dust Role Models Limited INV-0255: basket bed v1 raw materials package) |
| Sales effort | LOW-MEDIUM (relationship-led, opportunistic) |
| Margin profile | Similar to direct institutional commercial; sometimes raw materials only (lower per-unit value) |
| Year 1 target | **$30K-$80K** |
| Year 3 target | **$100K-$250K** |
| Vision 2030 | **$300K-$800K** |
| Pipeline | Open-ended — depends on outreach to youth/Indigenous programs and maker spaces |
| Notes | Not a major channel but a useful "validation" channel — proves the product fits adjacent community-services contexts. |

### Segment 6: Direct retail / B2C

E-commerce sales. Camping, emergency/cyclone, gifting, sponsored-bed-for-community (donor purchases a bed that gets sent to a remote household).

| Metric | Value |
|---|---|
| Verified to date | $0 (no retail launch yet) |
| Sales effort | LOW per transaction, HIGH up-front infrastructure (Stripe, fulfilment, inventory) |
| Margin profile | Retail rate $600+ per bed with thin margin per-unit at current cost; better as cost reduces |
| Year 1 target | **$50K-$150K** |
| Year 3 target | **$250K-$700K** |
| Vision 2030 | **$1M-$2M** |
| Pipeline | Stripe integration exists in v2/ (Stretch Bed `/shop/stretch-bed-single`). Standing inventory required (currently campaign-based production). |
| Notes | Standing inventory is the gating dependency. SIH explicitly recommended this transition in the diagnostic ("transition plan to a product-sales model"). Sponsored-bed model could power the Butterfly DGR donor side (donor buys, charity routes to community). |

### Segment 7: Adjacent markets (TBD QBE market scan)

Disaster recovery procurement, refugee / humanitarian aid, agribusiness (remote worker accommodation), aged care, NDIS.

| Metric | Value |
|---|---|
| Verified to date | $0 |
| Sales effort | TBD |
| Margin profile | TBD |
| Year 1 target | **Not in baseline** (TBD QBE volunteer market scan) |
| Year 3 target | $200K-$1M (speculative) |
| Vision 2030 | Could be material; depends on QBE scan |
| Pipeline | TBD |
| Notes | This is the SIH-proposed QBE Skilled Volunteering Project deliverable. Volume to size opportunistically once the market-scan output arrives. Top-down quantification is the missing input. |

## Year 1 base case roll-up (subject to revision)

| Segment | Year 1 low | Year 1 high | Year 1 midpoint |
|---|---:|---:|---:|
| 1. Donor-funded institutional | $400K | $600K | **$500K** |
| 2. Direct institutional commercial | $200K | $400K | **$300K** |
| 3. Corporate sponsorship / RAP | $50K | $150K | **$100K** |
| 4. Community / maker partners | $30K | $80K | **$55K** |
| 5. Government procurement | $0 | $100K | **$50K** |
| 6. Direct retail / B2C | $50K | $150K | **$100K** |
| 7. Adjacent markets | $0 | $50K | **$25K** |
| **Year 1 total midpoint** | $730K | $1,530K | **$1,130K** |

The Year 1 target of **$1,100K** in `v2/src/lib/data/impact-model.ts` is sane against this midpoint sum. Lower bound ($730K) is concerning; upper bound ($1.53M) is the stretch.

## Beds-vs-grants composition by Year

A useful frame: how much of revenue is "bed delivery" vs "general operations / R&D funding"?

| Year | Grant (bed-funded delivery) | Grant (R&D / wage) | Direct commercial | Total |
|---|---:|---:|---:|---:|
| FY25 (actual) | $128K (Snow + Centrecorp + VFFF earmarked for beds) | $110K (Snow R&D) | $12K | **$250K** |
| FY26 YTD (actual) | $290K (Centrecorp + Snow + Rotary bed-earmarked) | $84K | $61K | **$435K** |
| Year 1 (Jul 2026 onward, target midpoint) | $500K + $100K corporate-sponsored + $25K retail-sponsored | $0 (assumption) | $300K + $55K + $50K | **$1,130K** |

By Year 3 the commercial+sponsored share should dominate. By Vision 2030 grant should be < 20%.

## Sales effort allocation by segment (informs hiring case)

| Segment | Hours/week needed at Year 1 scale | Primary owner |
|---|---:|---|
| 1. Donor-funded institutional | ~15 | Ben (relationship + writing) |
| 2. Direct institutional commercial | ~20 | NEW Business Development hire |
| 3. Corporate sponsorship / RAP | ~5 | NEW BD hire (light touch) |
| 4. Community / maker partners | ~3 | Nic |
| 5. Government procurement | ~5 | NEW BD hire + Sally / Oonchiumpa |
| 6. Direct retail / B2C | ~5 | NEW GM (operationalise) |
| 7. Adjacent markets | ~2 | Deferred |
| **Total** | **~55 hrs/week** | **2 founders + GM + BD = covered** |

Supports the SIH People-section recommendation: GM + BD hires are needed by Year 1.

## Critical assumptions to test

1. **Centrecorp tranche velocity.** $212K remaining of $420K — will this complete within Year 1?
2. **Conversion rate from EOI to signed LOI** in Segment 2 (institutional commercial). Currently 0 signed LOIs in pipeline. SIH explicitly flagged this gap.
3. **Butterfly DGR live by Q1 Year 1** so Segment 1 has a clean vehicle for next-wave donors who specifically want DGR.
4. **Standing inventory by Q1 Year 1** so Segment 6 (B2C) can sell.
5. **Supply Nation certification** to unlock Segment 5 (government) at any meaningful volume.

## What to update in v2 to reflect this

The `REVENUE_SEGMENTS` array in `v2/src/lib/data/impact-model.ts` currently has 4 segments with `projectedShare` percentages. To reflect this Day 5 v0.1:

1. Expand from 4 to 7 segments (or consolidate Day 5's 7 into the existing 4 with sub-notes — e.g. "B2B" becomes "Institutional procurement, donor-funded + direct commercial")
2. Update `projectedShare` percentages to reflect Year 1 midpoint:
   - Donor-funded institutional: 44%
   - Direct institutional commercial: 27%
   - Corporate / RAP: 9%
   - Community / maker: 5%
   - Government: 4%
   - Direct retail: 9%
   - Adjacent: 2%
3. Update each `currentEvidence` field with the verified $ amounts from this Day 5 doc
4. Tag provenance: `verified` for evidence-backed shares, `modelled` for forecast shares

I'd recommend doing this update **after** Ben/Nic FTE % declarations land (Day 3 gate) and **before** Day 6 (36-month cashflow shell) — that way the cashflow model can use the verified segment splits.

## Gating questions to close

1. **Ben/Nic:** are the Year 1 midpoint targets ($500K donor / $300K direct commercial / $100K corporate / $100K retail) achievable from current relationships? Or which segment is most likely to underperform?
2. **Ben:** how much of the $212K remaining Centrecorp commitment converts in calendar 2026 vs spills into FY27?
3. **Ben:** what's the realistic timeline for Butterfly DGR (Q1 / Q2 / Q3 of Year 1)?
4. **Bookkeeper:** confirm the FY25 R&D vs grant split on Snow Foundation (INV-0227 $110K was hypothesised as R&D-style but Xero classifies as grant — does R&D Tax Incentive eligibility change the categorisation?).

## What's deliberately still open for Day 6-10

- **Day 6:** 36-month cashflow shell. This will use Day 5 segment forecasts × Day 4 unit economics × Day 3 expense baseline.
- **Day 7:** Cashflow buffer policy explicit (3 months min, 6 months target post-raise).
- **Day 8:** Capital stack v0.1. Verified funders + active conversations.
- **Day 9:** Three scenarios (base / upside / downside).
- **Day 10:** Butterfly impact tab (side-by-side without vs with the charity).

## Cross-references

- [[2026-05-12-financial-model-day4-unit-economics]] — per-bed cost stack
- [[2026-05-12-financial-model-day3-expenses-and-founder-time]] — expense baseline
- [[2026-05-12-xero-day1-reconciliation]] — verified revenue baseline
- [[2026-05-12-financial-model-scope]] — full 8-week plan
- `v2/src/lib/data/impact-model.ts` REVENUE_SEGMENTS — current 4-segment model, to be updated
- `act-global-infrastructure/data/goods/top-contacts.json` — verified contact-level data
- [[../articles/governance/ai-human-in-loop-policy]] — applies before these numbers go external
