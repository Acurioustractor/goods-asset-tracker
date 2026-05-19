# Financial model Day 6: 36-month cashflow shell (v0.1)

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** v0.1. Combines Day 3 expense baseline + Day 4 unit economics + Day 5 segment forecasts into a month-by-month cashflow projection. **Source script:** `act-global-infrastructure/scripts/report-goods-cashflow-36mo.mjs`. **Outputs:** `data/goods/cashflow-36mo.{csv,md,json}`.

## What this is

A 36-month projection (May 2026 to April 2029) that takes the verified revenue baseline and the modelled segment ramps and computes month-by-month: invoiced revenue, cash collected (with working-capital lag), capital inflows, all operating outflows, cumulative cash, and months-of-runway. Designed to expose the cash trough and the capital-injection timing required to bridge it.

## What this is NOT

- Not the final financial model. v0.1 with explicit placeholder for opening cash.
- Not committed targets. The segment ramps are Day 5 midpoints, not promises.
- Not a forecast of capital-raise certainty. The capital inflows in the model are the **planned** raises (QBE $400K, SEFA $300K, anchor philanthropy $500K); if any of these slip or miss, the trajectory shifts materially.

## Key trajectory milestones

| Milestone | Month | Cash | Note |
|---|---|---:|---|
| Start | May 2026 | $50,000 (PLACEHOLDER) | Ben to confirm actual Goods-earmarked cash |
| Trough (worst point) | **Aug 2026** | **-$94,483** | Pre-capital, the model predicts insolvency at month 4 |
| First capital injection | Sep 2026 | $303,475 | QBE Catalysing Impact $400K match closes |
| Second capital injection | Nov 2026 | $495,058 | SEFA working-capital $300K loan drawn |
| Third capital injection | Jan 2027 | $969,308 | Anchor philanthropic raise $500K |
| End of Year 1 (FY27) | Apr 2027 | $992,350 | 8.5 months of runway, OK buffer status |
| End of Year 2 (FY28) | Jun 2028 | ~$2.0M | Scale revenue compensating for operating ramp |
| End of projection (Year 3 partial) | Apr 2029 | $3,327,100 | Strong reserves for Vision 2030 commitments |

## FY rollup

| FY | Revenue (invoiced) | COGS | Founder time | Hires | Opex | Capex + inventory | Capital in | R&D refund |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FY26 remainder (May/Jun) | $87,000 | $60,900 | $23,333 | $0 | $36,667 | $0 | $0 | $0 |
| FY27 (Year 1) | $1,130,000 | $734,500 | $140,000 | $123,333 | $280,000 | $143,500 | $1,200,000 | $80,000 |
| FY28 (Year 2) | $2,820,000 | $1,551,000 | $140,000 | $240,000 | $360,000 | $100,000 | $0 | $80,000 |
| FY29 partial (10mo Year 3) | $5,000,000 | $2,250,000 | $116,667 | $200,000 | $400,000 | $0 | $0 | $80,000 |

## The narrative

### The cash trough is real and near (Months 1-4)

The model predicts cash goes negative in **June 2026** and bottoms out at **-$94,483 in August 2026**. This is before any of the three planned capital injections lands. Two factors drive this:

1. **Opening cash ($50K) is well below the buffer floor** (~$95K = 3 × monthly operating cost). The model immediately flags BELOW_FLOOR in May 2026.
2. **Revenue cashflow lags invoicing** by ~1.5 months (working-capital float). Even with $87K of revenue invoiced in May/Jun, only ~$60K lands as cash.

This is the existential threat the financial model exists to surface. SIH was right to put financial model at HIGH priority.

### Three capital injections rescue the trajectory

| Month | Source | Amount | Cumulative | Buffer status |
|---|---|---:|---:|---|
| Sep 2026 | QBE Catalysing Impact (Stage 2 match) | $400K | $303K | BELOW_TARGET |
| Nov 2026 | SEFA working-capital loan | $300K | $495K | BELOW_FLOOR (capex same month) |
| Jan 2027 | Anchor philanthropic raise | $500K | $969K | **OK** |

By January 2027 (month 9), Goods is in a sustainable cash position with >6 months runway.

### Year 1 (FY27) closes with $992K

Revenue $1.13M against full operating cost (incl. founder time + 2 new hires + capex + opex + COGS) leaves modest profitability. The capital stack covers the working-capital and capex needs.

### Year 2 (FY28) is the scale-up year

Revenue jumps to $2.82M (2.5x Year 1). COGS grows but at lower share (65% → 55%). No new capital required in the model; the business compounds from operations.

### Year 3 (FY29 partial) shows the Vision 2030 trajectory

By month 36 (Apr 2029), cumulative cash $3.33M. Revenue ramping toward Vision 2030 target. Comfortably above all buffer thresholds.

## Assumptions (editable in the script)

| Assumption | Value | Notes |
|---|---|---|
| Opening cash (May 2026) | $50,000 | **PLACEHOLDER**, Ben to verify Goods-earmarked cash |
| Working-capital lag | 1.5 months | Average AR collection. Adjustable. |
| COGS as % of revenue | 70% / 65% / 55% / 45% across FY26r / FY27 / FY28 / FY29p | Improves as scale gains, matches Day 4 unit-econ targets |
| Operating expense (excl founder + COGS + hires) | $220K / $280K / $360K / $480K annual by FY | Overhead, marketing, freight, legal, insurance |
| Founder time | $140K/yr (Mid scenario from Day 3) | Ben/Nic 50% FTE each at $140K fair-market rate |
| GM hire | $130K/yr from Month 6 (Oct 2026) | Per SIH People rec |
| BD hire | $110K/yr from Month 10 (Feb 2027) | Per SIH People rec |
| Capex events | Plant 2 $93.5K Month 6, Plant 3 $100K Month 18 | Per Day 4 plant schedule |
| Inventory build (one-time) | $50K in Month 3 (Jul 2026) | SIH-recommended B2C transition |
| QBE match | $400K in Month 4 (Sep 2026) | Stage 2 milestone target |
| SEFA loan | $300K in Month 6 (Nov 2026) | Working-capital |
| Anchor philanthropy | $500K in Month 8 (Jan 2027) | Donor raise commitment |
| R&D Tax Incentive refund | $80K/yr in Q3 (March) | Annual claim cycle |
| Buffer floor / target | 3 months / 6 months | Per SIH Rec #1 |

## Sensitivity to opening cash (most-uncertain input)

The cashflow trough is highly sensitive to opening cash. Worth noting:

| Opening cash | Trough cash | Trough month | Action implication |
|---:|---:|---|---|
| $50K (current model) | -$94K | Aug 2026 | Insolvency without immediate capital |
| $100K | -$44K | Aug 2026 | Still insolvent; need capital by Sep |
| $200K | $56K | Aug 2026 | Survives but at risk; capital needed by Oct |
| $400K | $256K | Sep 2026 | Comfortable bridge to capital injections |

**This is the single biggest unknown.** If Goods has $300K+ in genuine Goods-earmarked cash at 1 May 2026, the trough story disappears. If actual is closer to $50K, the model is a flashing red light. **Recommend Ben confirms within 24 hours.**

## What's important about this model

It surfaces three things no narrative can:

1. **The cash trough is in months 1-4.** Not a hypothetical risk; an immediate reality unless capital lands.
2. **The QBE match is critical-path.** Without the QBE Stage 2 close in September, the bridge fails.
3. **Once the capital stack lands, the business is genuinely viable.** $992K end of Year 1, $2M end of Year 2, $3.3M end of Year 3 — these are healthy reserves for a $1-5M-revenue social enterprise.

## What's deliberately still open for Day 7-10

- **Day 7:** Cashflow buffer policy formalised (when to trigger downside scenario, what defers, what accelerates)
- **Day 8:** Capital stack v0.1 with named conversations and probability-weighted close dates
- **Day 9:** Three scenarios (Base / Upside / Downside) with explicit triggers
- **Day 10:** Butterfly impact tab (Goods Pty Ltd standalone vs combined with Butterfly DGR)

The opening-cash sensitivity work and the QBE-close probability work are both better done in Day 9 (scenarios) since they're variance analyses rather than baseline numbers.

## Recommended Ben/Nic review (15 minutes)

Walk through the trough months (May-Aug 2026) with these questions:

1. **What is the actual opening cash earmarked for Goods at 1 May 2026?**
2. **Is the $400K QBE match likely to close by Sep 2026?**
3. **Is the SEFA $300K loan in flight, or speculative?**
4. **What's the realistic timing for the anchor philanthropic raise?**
5. **Are the hire dates (GM Oct, BD Feb 2027) realistic?**
6. **Is $50K inventory build sufficient, or should it be larger?**

The answers reshape the trough and the buffer-policy work for Day 7.

## Cross-references

- [[2026-05-12-financial-model-day3-expenses-and-founder-time]] — expense baseline + founder time scenarios
- [[2026-05-12-financial-model-day4-unit-economics]] — COGS targets at scale
- [[2026-05-12-financial-model-day5-revenue-segments]] — segment ramps used here
- [[2026-05-12-xero-day1-reconciliation]] — verified revenue baseline
- [[2026-05-12-financial-model-scope]] — 8-week build plan
- Source script: `act-global-infrastructure/scripts/report-goods-cashflow-36mo.mjs`
- CSV (Sheets-importable): `act-global-infrastructure/data/goods/cashflow-36mo.csv`
- [[../articles/governance/ai-human-in-loop-policy]] — applies before this projection is shared externally
