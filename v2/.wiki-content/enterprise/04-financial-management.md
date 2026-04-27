# 4. Financial Management and Performance

> Is the organisation financially sustainable?

## Honest headline

Not yet self-sustaining. Revenue ($537K cumulative, $50K recent year actual) runs below cost base; grants have bridged the gap. The QBE match-funding round and the shift from prototype to commercial production is the bridge to sustainability. Unit economics work at scale; the path is real but not yet walked.

## Financial snapshot

| Line | Value | Source |
|---|---|---|
| Cumulative revenue recorded (ACT-GD cost code) | $537,595 | Xero |
| Recent-year actual revenue | $50,000 | Strategy PD |
| Total philanthropic funding received | $445,685 | Xero |
| Total secured funding (incl. multi-year) | $550,000 | Strategy PD exec summary |
| Outstanding receivable (QBE participation, INV-0289) | $10,800 | Live AR |
| Outstanding unfunded delivery (Tennant Creek 200 v1 beds) | ~$36,000 | Cashflow gap from 2025 |

## Funders (philanthropic capital received)

| Funder | Amount | Purpose |
|---|---|---|
| Snow Foundation | $193,000 | Core program + R&D |
| The Funding Network (TFN) | $130,000 | Production + delivery |
| FRRR + VFFF (joint Backing the Future grant) | $50,000 | Palm Island delivery |
| AMP Spark | $21,900 | Innovation |
| Dusseldorp Forum | $15,000 | Mounty Backyard (Dec 2025) |
| QBE Foundation Stage 1 | $10,000 | Catalysing Impact participation (INV-0289 outstanding) |
| ACT internal / other | Balance to $445K | R&D, ops |

Books of record: Xero at the A Curious Tractor Pty Ltd / ACT-GD cost code level.

## Pricing (verified, from Xero invoices)

| Line | Price |
|---|---|
| Stretch Bed (institutional) | $560 |
| Stretch Bed (retail) | $600 |
| Basket Bed (legacy) | $370 |
| Workshop day | $6,000 |

## Unit economics (at scale targets)

- Production cost at scale (5,000+/yr): ~$350/bed (currently $550-650 at small batch).
- Institutional price: $560-850.
- Gross margin at scale: 50-55%.
- Community profit share (non-negotiable): 40% of net profit.

## Cashflow state

- **Tight.** The outstanding Tennant Creek delivery created a 2025 cashflow gap that has constrained R&D capacity.
- **Grant-paced.** Revenue lumps on funder schedules rather than smooth commercial cashflow; SEFA working capital is designed to solve this.
- **No long-term debt currently on the trading entity.** IBA and SEFA debt is the first planned debt capital.

## Financial systems

- **Accounting:** Xero (ACT-GD cost code separates Goods from wider ACT).
- **Payments (inbound):** Stripe (ecommerce), bank transfer (institutional invoices).
- **Payments (outbound):** Xero payroll + supplier bills.
- **Reporting cadence:** monthly close, quarterly review with advisory group, annual audit.
- **R&D tax incentive:** claimable via trading entity; strategy documented in ACT wiki (`act-global-infrastructure/wiki/finance/rdti-claim-strategy.md`).

## Five-year cashflow model

A 5-year cashflow model exists at the ACT level (`act-global-infrastructure/wiki/finance/five-year-cashflow-model.md`). A Goods-specific integrated 3-statement model is on the immediate build list for the QBE round; the 5-year cashflow input is the starting point.

## Financial sustainability thesis

Goods becomes sustainable when:
1. Container-plant unit economics hit target (production cost < $400/bed, institutional sell $560+).
2. Each plant operates at >60% capacity utilisation (throughput serving multiple community partners).
3. Institutional B2B revenue covers direct costs and overhead; grant funding retreats to R&D-only.
4. Community ownership transfers shift the model from vertically-integrated to license + support.

The QBE blended finance round is the capital needed to cross (1) and (2). Phase 3-4 are the scale-out.

## Gaps we are honest about

1. **No integrated 3-statement model** at Goods granularity (P&L, BS, CF linked). Priority build for QBE round.
2. **Valuation not yet determined.** Required before any equity / convertible conversation.
3. **No CFO.** Finance runs through Ben + ACT shared services; part-time CFO advisor is the 2026 hire.
4. **Financial forecasts beyond 3 years** are directional, not modelled.

## Documents that exist and can be shared

- Most recent Xero P&L (ACT-GD cost code) — available on request.
- Strategy PD with financial section (`v2/docs/GOODS_STRATEGY_PD.md` Parts 5 + 8 + 14).
- Compendium with funding history (`v2/docs/COMPENDIUM_MARCH_2026.md`).
- QBE live admin dashboard with current receivables / payables state (`v2/src/app/admin/qbe-program/page.tsx`).
- 5-year ACT-level cashflow model (wiki reference above).

## Documents that do not yet exist

- Formal audited financial statements (ACT Foundation has its own; Goods-only audit not yet performed).
- 3-statement integrated Goods-specific model.
- Full Board finance pack (linked to governance upgrade in topic 7).

## Source documents

- Strategy PD Part 5 (Business Model / Pricing), Part 8 (Go-to-Market budgets): `v2/docs/GOODS_STRATEGY_PD.md`
- Pricing verified: `v2/src/lib/data/products.ts` and Xero
- Compendium: `v2/docs/COMPENDIUM_MARCH_2026.md`
- RDTI strategy: `act-global-infrastructure/wiki/finance/rdti-claim-strategy.md`
- 5-year cashflow: `act-global-infrastructure/wiki/finance/five-year-cashflow-model.md`
