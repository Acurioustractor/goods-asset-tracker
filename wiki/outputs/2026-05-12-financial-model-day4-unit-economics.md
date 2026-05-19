# Financial model Day 4: Stretch Bed unit economics (v0.1)

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** v0.1, MODELLED throughout. Validation at scale is the SIH Priority Advisory Project deliverable (Recommendation #2). **Source:** `PRODUCTION_COST_BREAKDOWN` in `v2/src/lib/data/impact-model.ts`, `BED_PRICING` in `v2/src/app/admin/strategy/page.tsx`. **Period:** baseline as at 2026-05-12.

## What this is

Unit economics for the Stretch Bed at three production volumes. Includes per-stage cost breakdown, scaling assumptions, sensitivity to labour and materials, and a margin matrix across institutional / retail / PICC price points.

## What this is NOT

- Not measured finished-goods cost accounting. The per-stage costs are modelled from current campaign-based production runs. SIH's advisory project (May to July 2026) validates this at scale.
- Not a forecast of demand. The "Year 1: 1,500 beds" is a target volume, not a sold-through commitment.
- Not the operating model decision. On-Country containerised vs centralised production is a question this analysis informs but does not answer; the financial-model scenarios resolve it.

## Current unit cost stack (baseline, modelled at ~15 beds/month)

| Stage | Labour hours | People | Cost (AUD) | Notes |
|---|---:|---:|---:|---|
| Plastic collection & sorting | 0.5 | 1 | $15 | On-Country, community labour |
| Shredding & pelletising | 0.3 | 1 | $10 | Containerised plant |
| Sheet pressing (190°C, 5000 PSI) | 1.0 | 1 | $30 | Containerised press |
| **CNC cutting** | **3.5** | **1** | **$120** | **Largest single cost driver** |
| Canvas & steel prep | 0.5 | 1 | $80 | Cut canvas + steel poles to length |
| Assembly & QC | 0.5 | 2 | $40 | 2-person assembly |
| Materials (steel, canvas, caps, fixings) | 0 | 0 | $180 | Bulk-priced components |
| Freight & logistics | 0.2 | 1 | $75 | Ex-factory to community |
| **Total per bed (current)** | **6.5** | | **$550** | **At ~15 beds/month** |

## Margin at current cost ($550)

| Price point | Price | Gross margin (per bed) | Margin % |
|---|---:|---:|---:|
| Stretch institutional | $560 | $10 | 1.8% |
| Stretch retail | $600 | $50 | 8.3% |
| Stretch PICC rate | $750 | $200 | 26.7% |

**Reality check:** at current cost and institutional price, Goods is at break-even per bed. Retail margin is thin. Only the PICC price band sustains a viable per-unit margin. The thesis for commercial viability rests on **scale reducing cost**.

## Three-volume scenario model

### Volume bands and operating assumptions

| Scenario | Volume | Operating context | Annual output | Annual labour hours |
|---|---:|---|---:|---:|
| **Current** | 15 beds/month | Campaign-based, single facility, intermittent | ~180 | ~1,170 |
| **Year 1 target** | 125 beds/month | Continuous single-facility production, second shift possible | 1,500 | ~9,750 |
| **Year 3 target** | 417 beds/month | Multi-facility (3), automation upgrades, full utilisation | 5,000 | ~32,500 (or much less with automation) |
| **Vision 2030** | 1,000 beds/month | Multi-facility (8), full automation of CNC stage, employment-grant labour offset | 12,000 | TBD |

### Per-stage cost reduction assumptions

How much each stage's per-unit cost can plausibly drop at each volume.

| Stage | Current | Year 1 (1,500/y) | Year 3 (5,000/y) | Vision 2030 (12,000/y) | Source of reduction |
|---|---:|---:|---:|---:|---|
| Plastic collection | $15 | $12 | $5 | $0 | Council waste-management offset; community plastic-collection programs |
| Shredding & pelletising | $10 | $8 | $5 | $3 | Plant utilisation; volume scaling |
| Sheet pressing | $30 | $26 | $18 | $12 | Press utilisation (currently <30%); per-unit fixed-cost spread |
| **CNC cutting** | **$120** | **$95** | **$50** | **$30** | **Toolpath optimisation, multi-head router; SIH advisor to validate** |
| Canvas & steel prep | $80 | $72 | $60 | $50 | Bulk supplier discounts, jig automation |
| Assembly & QC | $40 | $36 | $28 | $20 | Process refinement, parallel-line assembly |
| Materials | $180 | $165 | $135 | $115 | Bulk purchasing (10-15% Y1, 25%+ Y3, supplier consolidation) |
| Freight & logistics | $75 | $65 | $50 | $40 | Container consolidation; on-Country production reduces some freight |
| **Total per bed** | **$550** | **$479** | **$351** | **$270** | |
| **Target in impact-model.ts** | $550 | $520 | $350 | $280 | (modelled targets prior to this analysis) |
| **Variance vs target** | 0 | -$41 (more aggressive) | +$1 (matches) | -$10 (slightly more aggressive) | |

The Y1 number ($479) is **more aggressive** than the $520 target in `impact-model.ts`. Recommend not adjusting the public target until SIH advisor validates this scenario; v0.1 is internal sensitivity work, not a public claim.

### Margin matrix (3 price points × 4 volume scenarios)

Assuming cost reductions land per the table above:

| Volume | Cost/bed | Institutional ($560) | Retail ($600) | PICC ($750) |
|---|---:|---|---|---|
| Current (15/mo) | $550 | $10 (1.8%) | $50 (8.3%) | $200 (26.7%) |
| Year 1 (125/mo) | $479 | $81 (14.5%) | $121 (20.2%) | $271 (36.1%) |
| Year 3 (417/mo) | $351 | $209 (37.3%) | $249 (41.5%) | $399 (53.2%) |
| Vision 2030 (1000/mo) | $270 | $290 (51.8%) | $330 (55.0%) | $480 (64.0%) |

**Reading the matrix:** the path to a sustainable business is volume. At Year 1 institutional pricing, margin lands in the teens. At Year 3, margin sits in the high 30s and the business shape becomes recognisable as a viable social-enterprise manufacturing operation.

## Sensitivity analysis (±20% on key inputs, at Year 1 scenario)

How sensitive is the Year 1 cost target ($479) to the largest input swings?

| Sensitivity | Cost/bed | Institutional margin | Retail margin |
|---|---:|---|---|
| Base Year 1 | $479 | $81 (14.5%) | $121 (20.2%) |
| Labour +20% (all stages) | ~$510 | $50 (8.9%) | $90 (15.0%) |
| Labour -20% (e.g. employment-grant offset) | ~$448 | $112 (20.0%) | $152 (25.3%) |
| Materials +20% (supplier price rises) | ~$512 | $48 (8.6%) | $88 (14.7%) |
| Materials -20% (bulk negotiation success) | ~$446 | $114 (20.4%) | $154 (25.7%) |
| CNC time +20% (validation shows current target too aggressive) | ~$498 | $62 (11.1%) | $102 (17.0%) |
| CNC time -20% (multi-head router achieves better savings) | ~$460 | $100 (17.9%) | $140 (23.3%) |

**The biggest swings come from labour and materials**, each of which can move the institutional margin between 9% and 20%. The CNC time variable has slightly less impact than I expected, because the assembly labour costs and materials cost-of-goods are also significant.

**Critical implication for capital-stack design:** if SIH advisor validates the labour-reduction story (employment grants offsetting cost), Year 1 unit economics work without needing further commercial price increases. If labour costs come in higher than modelled, the path requires either higher prices (toward PICC band) or more grant-funded operating subsidy.

## Operating-model comparison (preliminary, advisor to validate)

| Model | Pros | Cons | Cost implication |
|---|---|---|---|
| **On-Country containerised** (target state) | Mission alignment, community jobs, lower freight to remote, plastic supply local | Higher per-facility setup, smaller per-facility volume, training overhead | Likely 5-15% higher per-unit cost at scale, but enables mission outcomes |
| **Centralised (Alice Springs or similar)** | Bigger volume per facility, single supply chain, easier supervision | High freight to communities, less community employment, plastic transport overhead | Likely 5-10% lower per-unit cost at scale |
| **Hybrid (central manufacturing + on-Country finishing/assembly)** | Best of both | More complex logistics; quality consistency challenges | Mid-range |

**Goods' stated direction is on-Country containerised.** The unit economics says this is achievable with the cost-reduction assumptions in this analysis. The decision is mission-driven, with the economic case being "viable, not optimal." That is the right trade-off given the Theory of Change.

## Gating questions for the SIH advisor

These are the questions the Priority Advisory Project should answer (Recommendation #2 in the SIH diagnostic):

1. **Are the per-stage cost reductions in the Year 1 → Year 3 → Vision 2030 progression achievable?** Particularly CNC ($120 → $30) and materials ($180 → $115).
2. **What is the realistic capex per containerised facility?** Plant 1 cost is known approximately ($93.5K plant quote anchored on Centrecorp); plant 2 and 3 costs at scale need modelling.
3. **What is the breakeven volume per facility?** At what monthly output does a single containerised facility cover its own operating cost (excluding founder time)?
4. **Is the labour-reduction-via-employment-grant story defensible?** What proportion of labour cost can be offset via Work-Integrated Social Enterprise (WISE) funding or similar Indigenous-employment grants?
5. **How sensitive is the model to commodity prices?** Steel and HDPE feedstock costs over the forecast period.
6. **Is the on-Country containerised model economically viable at Year 3 volumes?** Or is hybrid the right structure?

## Implications for the financial model

Once SIH advisor outputs land (target: end of June 2026):

1. **Replace the v0.1 per-stage reduction assumptions** with advisor-validated numbers
2. **Update the `cost-per-unit` metric on /impact** if the verified Year 1 target differs from $520
3. **Lock in the operating-model decision** for the 3-year forecast
4. **Update REVENUE_SEGMENTS projected shares** if margin profile changes by segment
5. **Add a capex schedule** for facilities at $93.5K (current) → $X (Y1) → $Y (Y3)

## Connection to Day 1-3 verified data

| Day 1-3 fact | Day 4 implication |
|---|---|
| FY26 YTD commercial revenue: **$61,449** (post-Ingkerreke exclusion) | At average institutional price $560, that implies ~110 beds commercially sold. Cross-check against asset register count. (Previously $164K implied 294 beds but ~$103K of that was Oonchiumpa-linked, not Goods commercial.) |
| Centrecorp $208K invoiced ($123K paid + $85K draft), 109 beds locked, $420K total commitment | $208K / 109 = $1,908/bed gross revenue on the invoiced portion. Implies grant covers bed cost + freight + project costs + capability work. The $420K total spans additional rounds that will fund further beds. |
| FY26 YTD operating expense (incl. bank SPEND): $316K | Per-bed all-in operating cost at ~110 commercial beds + 109 Centrecorp beds = ~219 beds: ~$1,443/bed all-in. Far above the $479 modelled unit cost because all-in includes overhead, founder time, freight beyond unit, R&D. (Counting Centrecorp 109 beds as "delivered" because those are grant-funded community distributions.) |

The unit cost ($550 current, $479 target Y1) is the **bed cost only**. All-in operating cost per bed (including overhead, founder time, capex) is meaningfully higher. The financial model needs to show both lines clearly.

## Acceptance criteria for Day 4

- [x] Current unit cost stack documented with provenance (MODELLED)
- [x] Three volume scenarios with per-stage reduction assumptions
- [x] Margin matrix at three price points × four scenarios
- [x] Sensitivity analysis on labour, materials, CNC time
- [x] Operating-model comparison
- [x] Gating questions for SIH advisor
- [ ] SIH advisor engaged and producing v0.2 (action: send acceptance email, see [[2026-05-12-sih-advisory-acceptance-draft]])
- [ ] Unit economics validated against actual finished-goods cost accounting (requires bookkeeper engagement)

## Cross-references

- [[2026-05-12-financial-model-day3-expenses-and-founder-time]] — Day 3 expense reconciliation
- [[2026-05-12-financial-model-scope]] — 8-week build plan
- [[2026-05-12-sih-advisory-acceptance-draft]] — what we need from the advisor to take this to v0.2
- `v2/src/lib/data/impact-model.ts` PRODUCTION_COST_BREAKDOWN — source of current cost stack
- `v2/src/app/admin/strategy/page.tsx` BED_PRICING — source of price points
- [[../articles/governance/ai-human-in-loop-policy]] — applies before any of these numbers go external
