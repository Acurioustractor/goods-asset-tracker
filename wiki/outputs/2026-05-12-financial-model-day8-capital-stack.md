# Financial model Day 8: Capital stack v0.1

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** v0.1. Builds on `wiki/articles/capital/capital-stack.md` (the rationale layer) by adding probability-weighted close dates, cashflow injection mapping, and named-funder status. Designed to be lifted into the Goods Financial Model workbook `Capital stack` tab.

## What this is

A probability-weighted capital stack across 18 months. Each instrument has: target amount, named source, current status, expected close date, use of funds, pricing / covenants, and mission-lock implications. Maps directly into the Day 6 cashflow injection assumptions.

## Critical reconciliation: QBE match math

A key point I want to flag up-front. From memory + the capital-stack article + QBE program docs:

- **QBE Catalysing Impact match** is dollar-for-dollar, **capped at $400K** ($200K is the conservative "operating target" per QBE Stage 2 framing)
- **Goods must raise the match first.** The QBE money lands AFTER (or contingent on) the other capital landing
- **Cashflow model assumption (Day 6):** $400K QBE in Sep 2026
- **Implied requirement:** Goods has already raised ~$400K of non-QBE capital by 31 Aug 2026

This makes the QBE match an **output** of the stack, not an input. Reframing the cashflow model around this is a Day 9 scenarios task.

## Stack by layer (working version)

```
GOODS CAPITAL STACK 2026 v0.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GUARANTEES         Snow Foundation letter of support           non-cash
GRANTS             QBE Foundation match                         up to $400K (match-contingent)
  Philanthropic    Snow Foundation R4                           $132K AUTHORISED (INV-0321)
                   Snow Foundation ongoing                      pipeline
                   Centrecorp Foundation (remaining)            ~$212K (of $420K commitment)
                   Vincent Fairfax Family Foundation R2         TBD pipeline
                   Anchor philanthropic (TBC)                   $500K target
                   First Nations Clean Energy Advice            $40-60K (3 Sep 2026 deadline)
  Butterfly DGR    Donations (post-transition)                  $200K target Year 1
CATALYTIC          Minderoo recoverable / catalytic             $1.5M target (warm)
                   PFI repayable                                $640K (EOI submitted)
DGR DEBT           SEFA working capital (BOLD)                  $300K
SENIOR DEBT        IBA Business Loan                            up to $5M (eligibility ✓)
R&D REFUND         R&D Tax Incentive                            ~$80K annual
COMMUNITY EQUITY   PICC plant purchase pathway                  Year 3-4 TBD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Per-instrument detail

### 1. Snow Foundation R4 (philanthropic)

| Field | Value |
|---|---|
| Amount | $132K AUTHORISED (INV-0321, awaiting payment) + ongoing |
| Status | Committed; awaiting payment per compendium |
| Expected close | Within 30 days |
| Use of funds | Beds + production plant |
| Pricing / covenants | Grant, no return required |
| Mission lock | Aligned to Goods mission via grant terms |
| Probability | 95% (committed, awaiting cash collection) |
| Cashflow input | Should already be modelled as receivable in Day 6 working-capital lag |

### 2. Centrecorp Foundation (remaining commitment)

| Field | Value |
|---|---|
| Amount | ~$212K remaining of $420K total commitment |
| Status | In active discussions for next tranche |
| Expected close | Q3 2026 ($84.7K draft INV-0314 first; remaining tranches Q4 2026 / Q1 2027) |
| Use of funds | More beds for Utopia Homelands; possibly plant quote $93.5K |
| Pricing / covenants | Grant, no return required |
| Mission lock | Strong (Aboriginal Trust, mission-aligned) |
| Probability | 80% on $84.7K draft; 60% on remaining tranches |
| Cashflow input | Reflect in Segment 1 (donor-funded institutional) revenue ramp |

### 3. QBE Catalysing Impact match

| Field | Value |
|---|---|
| Amount | Up to $400K (match-contingent, 1:1 against other capital raised) |
| Status | Contingent on Goods raising the match first |
| Expected close | September 2026 (Stage 2 milestone) |
| Use of funds | Working capital + plant deployment |
| Pricing / covenants | Grant; QBE may want letter of support to other funders |
| Mission lock | Aligned via QBE Catalysing Impact framework |
| Probability | 90% IF match raised; 0% if match not raised |
| Cashflow input | Day 6 has $400K Sep 2026. Conditional on items 1-7 below landing first. |

### 4. SEFA working capital (concessional debt)

| Field | Value |
|---|---|
| Amount | $300K opening line |
| Status | "Outreach this week" per current state; BOLD agreement framework |
| Expected close | Nov 2026 |
| Use of funds | Working capital for institutional B2B cashflow cycle |
| Pricing / covenants | Concessional rate (~4-6%); requires independent director majority; revenue covenant |
| Mission lock | SEFA is impact-investment-focused; mission alignment built in |
| Probability | 70% (LOI / term sheet in flight, governance gates pending) |
| Cashflow input | Day 6 has $300K Nov 2026 |

### 5. Anchor philanthropic raise (TBD)

| Field | Value |
|---|---|
| Amount | $500K target |
| Status | Pipeline; specific funder identified but not yet committed |
| Expected close | January 2027 |
| Use of funds | Working capital + R&D + community capability |
| Pricing / covenants | Grant; possibly via Butterfly DGR vehicle |
| Mission lock | Strong (philanthropic source) |
| Probability | 50% (conversations in flight, no commitment yet) |
| Cashflow input | Day 6 has $500K Jan 2027 |

### 6. Minderoo Foundation catalytic

| Field | Value |
|---|---|
| Amount | $1.5M target (warm) |
| Status | Per funder-shared-content `CAPITAL_STACK`: "In conversation" |
| Expected close | Q2 / Q3 2027 |
| Use of funds | Scale-up of plant network + product expansion |
| Pricing / covenants | Recoverable grant (returns without interest if successful; written off if not) |
| Mission lock | Aligned via Minderoo Catalytic bucket |
| Probability | 30% (large ask; needs strong business case + audited finances) |
| Cashflow input | NOT in Day 6 base case. Upside scenario only. |

### 7. IBA Business Loan (senior debt)

| Field | Value |
|---|---|
| Amount | Up to $5M (eligibility confirmed) |
| Status | Eligibility confirmed; loan application pending business case |
| Expected close | Q3 2027 onward |
| Use of funds | Plant network expansion at scale (Year 2-3 capex) |
| Pricing / covenants | IBA Indigenous business loan; ~4-6% interest; 30% grant component; requires Indigenous ownership structure |
| Mission lock | Goods needs structural Indigenous ownership (Butterfly board + future community-owned entities) |
| Probability | 60% post-Butterfly transition |
| Cashflow input | NOT in Day 6 base case. Year 2-3 scale-up. |

### 8. Butterfly DGR donations (new line, post-transition)

| Field | Value |
|---|---|
| Amount | $200K target Year 1 (post-DGR launch) |
| Status | Charity transition in flight; DGR vehicle not yet live |
| Expected close | Donations would flow once transition completes (Q3/Q4 2026 estimate) |
| Use of funds | Subsidised community access + capability building |
| Pricing / covenants | Grant (DGR-eligible); donors get tax deduction |
| Mission lock | Strongest of any layer; charity purpose IS the lock |
| Probability | 60% on $200K Year 1, depends entirely on transition timing |
| Cashflow input | NOT in Day 6 base case. Important upside / Butterfly-enabled scenario. |

### 9. PFI repayable

| Field | Value |
|---|---|
| Amount | $640K (per capital-stack article) |
| Status | EOI submitted |
| Expected close | Q4 2026 / Q1 2027 |
| Use of funds | Plant deployment infrastructure |
| Pricing / covenants | Repayable grant (no interest, returned on success) |
| Mission lock | Aligned via PFI's impact mandate |
| Probability | 40% (EOI stage, formal application not yet submitted) |
| Cashflow input | NOT in Day 6 base case. |

### 10. R&D Tax Incentive

| Field | Value |
|---|---|
| Amount | ~$80K annual refund |
| Status | Eligible; structural via ACT Pty Ltd incorporation |
| Expected close | Annual claim cycle, refund Q3 each year |
| Use of funds | Working capital |
| Pricing / covenants | Government refundable tax offset; requires R&D activity register |
| Mission lock | None (compliance instrument) |
| Probability | 90% (structurally eligible) |
| Cashflow input | Day 6 has $80K each March |

### 11. First Nations Clean Energy Advice Grant

| Field | Value |
|---|---|
| Amount | $40K-$60K |
| Status | Pipeline, EOI not yet submitted |
| Expected close | Application due 3 Sep 2026 |
| Use of funds | Solar feasibility for Alice Springs plant |
| Pricing / covenants | Grant, no return required |
| Mission lock | Aligned (clean energy + First Nations) |
| Probability | 50% if EOI submitted on time |
| Cashflow input | NOT in Day 6 base case. |

### 12. Vincent Fairfax Family Foundation R2

| Field | Value |
|---|---|
| Amount | TBD (R1 was $50K) |
| Status | Pipeline; relationship live |
| Expected close | 2027 |
| Use of funds | TBC |
| Probability | 50% based on R1 relationship |
| Cashflow input | NOT in Day 6 base case. |

## Capital injection mapping (vs Day 6 cashflow)

The Day 6 cashflow has three planned injections. Reconciliation:

| Month | Day 6 line | Day 8 instrument | Probability | Notes |
|---|---|---|---:|---|
| Sep 2026 | QBE Catalysing Impact match $400K | QBE Foundation match | 90% IF match raised | **Conditional on items 1-7 landing first** |
| Nov 2026 | SEFA working capital $300K | SEFA Item 4 | 70% | LOI / term sheet in flight |
| Jan 2027 | Anchor philanthropic raise $500K | Item 5 (TBD anchor) | 50% | Conversation in flight |
| **Day 6 stack total** | | **$1.2M** | weighted ~58% | Base case unchanged |

## Critical-path dependencies

The whole stack hinges on a few gating events in sequence:

```
1. Confirm opening cash (THIS WEEK)
   ↓
2. Snow INV-0321 paid ($132K) + Centrecorp INV-0314 authorised ($85K)
   ↓ (Brings cash position to floor before any new capital)
3. SEFA term sheet signed (target Aug 2026)
   ↓ (First major commitment)
4. Match capital raised to $400K (by 31 Aug 2026: SEFA + Centrecorp + Snow + anchor donor LOI)
   ↓ (Triggers QBE Stage 2 close)
5. QBE Stage 2 match $400K lands (Sep 2026)
   ↓ (Capital position OK)
6. Plant 2 deployed (Oct/Nov 2026)
   ↓ (Revenue growth gates)
7. Anchor philanthropy lands (Jan 2027)
   ↓ (Bridge to scale operations)
8. Butterfly DGR transitions complete (Q3/Q4 2026)
   ↓ (Unlocks DGR donations + scale-up philanthropy)
9. IBA business loan + Minderoo follow-on (2027)
   ↓ (Year 2 expansion capital)
```

## Three scenarios (sketch; Day 9 expands these)

### Base case (Day 6 default)

- QBE $400K Sep 2026 + SEFA $300K Nov 2026 + Anchor $500K Jan 2027 = $1.2M
- Probability of full stack landing: ~30% (multiplied probabilities ≈ 0.9 × 0.7 × 0.5)
- Cashflow trough -$94K Aug 2026 if opening $50K
- Year 1 close cash $992K
- Year 3 close cash $3.33M

### Upside case

- Base case + Minderoo $1.5M Q3 2027 + Butterfly DGR $200K Year 1 + R&D refund + ongoing Centrecorp tranches
- Year 1 close cash ~$1.4M
- Year 3 close cash ~$5.5M
- Probability of upside: ~10-15%

### Downside case

- QBE delayed by 1 quarter (lands Dec 2026 instead of Sep), SEFA reduced to $150K, anchor delayed to Q2 2027
- Trough deepens to -$200K+ requiring founder bridge or extended cost-cutting
- Year 1 close cash ~$500K
- Probability of downside: ~30%

## What's missing from the stack v0.1

Documentation gaps to close:

1. **Legally binding LOIs.** Currently mostly letters of support, not commitments. SEFA LOI is the priority.
2. **Independent director recruitment.** SEFA covenant requires it. Currently a flagged action in QBE prep.
3. **3-statement integrated financial model.** v0.1 across Days 1-8 is the foundation, but a formal Sheets workbook output is the deliverable.
4. **Investment memo.** Draft state per memory; needs sharpening once Day 9 scenarios and Day 10 Butterfly impact tab land.
5. **Audited or accountant-endorsed financials.** SEFA / IBA covenant requirement; bookkeeper engagement needed.
6. **Governance documents** for the Pty Ltd (board charter, risk policy, conflict-of-interest).

## Recommended updates to v2 funder-shared-content.ts

The `CAPITAL_STACK` array in `v2/src/lib/data/funder-shared-content.ts` currently has 5 lines. Recommend updating to reflect Day 8 stack:

```ts
export const CAPITAL_STACK = [
  { layer: 'Catalytic / match', source: 'QBE Foundation Stage 2', amount: 'up to $400K', status: 'Match-contingent; close target Sep 2026', highlight: true },
  { layer: 'Catalytic recoverable', source: 'Minderoo Catalytic', amount: '$1.5M target', status: 'In conversation' },
  { layer: 'Concessional debt', source: 'SEFA working capital (BOLD)', amount: '$300K', status: 'LOI in flight, close target Nov 2026' },
  { layer: 'Senior debt', source: 'IBA Business Loan', amount: 'up to $5M', status: 'Eligibility confirmed, application pending business case' },
  { layer: 'Anchor philanthropic', source: 'TBD (5+ candidates in conversation)', amount: '$500K target', status: 'Pipeline, close target Q1 2027' },
  { layer: 'Recoverable infrastructure', source: 'PFI repayable grant', amount: '$640K', status: 'EOI submitted' },
  { layer: 'Repeat donor', source: 'Snow Foundation R4', amount: '$132K (INV-0321 authorised) + ongoing', status: 'Awaiting payment + R5 conversation' },
  { layer: 'Repeat donor', source: 'Centrecorp Foundation remaining', amount: '~$212K of $420K total commitment', status: 'Tranches rolling, $84.7K next' },
  { layer: 'DGR donations', source: 'Butterfly Movement Ltd (post-transition)', amount: '$200K Year 1 target', status: 'Transition in due diligence' },
  { layer: 'R&D refund', source: 'R&D Tax Incentive', amount: '~$80K annual', status: 'Structurally eligible' },
  { layer: 'Community equity', source: 'PICC plant purchase pathway', amount: 'TBD', status: 'Year 3-4 design phase' },
];
```

Provenance label per row: most "In conversation" / "Pipeline" / "Match-contingent" are forecasts (provenance: `modelled` or `estimated`); "Authorised" / "Eligibility confirmed" are `verified`.

## Open decisions in Ben's court

1. **Sequence the SEFA LOI conversation this week** (action #4 in QBE prep critical-5)
2. **Confirm Minderoo recoverable bucket eligibility** (warm-warm conversation; status check)
3. **Identify named anchor philanthropic candidates** (currently TBD; need 2-3 named conversations)
4. **First Nations Clean Energy Advice Grant**: decide whether to submit by 3 Sep 2026 deadline
5. **Decide on QBE match conservativeness**: model $400K (stretch) vs $200K (operating target) — Day 9 scenario work
6. **Confirm Vincent Fairfax R2 timeline** with relationship lead

## What's deliberately still open for Day 9-10

- **Day 9:** Three scenarios formalised (Base / Upside / Downside) with explicit operational triggers ("if QBE close slips past Sep, then...")
- **Day 10:** Butterfly impact tab (Goods Pty Ltd standalone vs combined with Butterfly DGR)

## Cross-references

- [[2026-05-12-financial-model-day6-cashflow-36mo]] — the cashflow this stack feeds
- [[2026-05-12-financial-model-day7-buffer-policy]] — the response framework
- [[../articles/capital/capital-stack]] — strategic rationale layer
- [[../articles/capital/blended-finance]] — instrument-level theory
- [[../articles/investors/sefa]] — SEFA-specific profile
- [[2026-05-12-qbe-prep-resume]] — action stack with SEFA / Keith Rovers / surveys items
- `v2/src/lib/data/funder-shared-content.ts` CAPITAL_STACK — needs update
- [[../articles/governance/ai-human-in-loop-policy]] — applies before any of this goes external
