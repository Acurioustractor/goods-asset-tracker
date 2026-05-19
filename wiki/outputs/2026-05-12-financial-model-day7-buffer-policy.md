# Financial model Day 7: Cashflow buffer policy

> **Date:** 2026-05-12. **Owner:** Ben + Nic + (future) board/advisory committee. **Status:** v0.1. Builds on [[2026-05-12-financial-model-day6-cashflow-36mo]]. **Purpose:** define the operational decision rules that pair with the 36-month cashflow shell. SIH Rec #1 explicit requirement.

## What this is

A four-state runway framework with explicit triggers, decision rules, and communication protocols. When cash drops to each state, the policy spells out exactly what defers, what slows, what accelerates, who decides, and who gets told.

## Why this matters

A cashflow projection without a decision policy is just a chart. The financial discipline lives in **how the team responds** to the trajectory in real time. SIH's diagnostic was explicit: "Goods would benefit from an explicit cashflow buffer policy for working-capital risk, given recent volatility in funder timing."

The Day 6 cashflow shows the trajectory swings between states multiple times in Year 1:

| Period | Buffer state | Driver |
|---|---|---|
| May-Aug 2026 (months 1-4) | **NEGATIVE** | Opening cash too low, pre-capital |
| Sep-Oct 2026 | BELOW_TARGET | QBE landed, but still <6 months |
| Nov 2026 | BELOW_FLOOR | Plant 2 capex same month as SEFA loan |
| Dec 2026 | BELOW_TARGET | Stabilising |
| Jan 2027 onward | OK | Anchor philanthropy + scale revenue |

Each transition is a decision point. The policy defines who decides what, when.

## The four buffer states

```
[ NEGATIVE ]  cash < $0
     ↓ trigger: actual insolvency
     ↓
[ BELOW_FLOOR ]  0 ≤ cash < 3 months of operating cost
     ↓ trigger: tight squeeze, near-term capital needed
     ↓
[ BELOW_TARGET ]  3 months ≤ cash < 6 months operating cost
     ↓ trigger: lean management, slow non-essential growth
     ↓
[ OK ]  cash ≥ 6 months operating cost
        normal operations, can invest in growth
```

### State 1: NEGATIVE (cash < $0)

**What it means:** Goods is technically insolvent. Bills can't be paid in order.

**Immediate triggers (within 24 hours):**
- Halt all non-essential discretionary spending (travel, marketing, new hires, capex)
- Director-loan or bridge funding from founders or related-parties to bring cash positive
- Communicate state to advisory committee + SEFA / current loan holders
- Escalate to lawyers (Mint Ellison) if state persists >48 hours

**Mandatory defer (until cash positive):**
- Any planned capex
- Any new hire start dates
- Plant deployment commitments
- Discretionary travel / events / sponsorship

**Mandatory accelerate:**
- Outstanding invoice collection (accounts receivable)
- Pending grant drawdowns
- In-flight capital-raise close

**Who decides:** Founders unilaterally (with notification to advisors). At this state, speed > consensus.

**Communication:** Within 24 hours to: advisory committee, SEFA / IBA / loan holders, accountant, Mint Ellison.

### State 2: BELOW_FLOOR (0 ≤ cash < 3 months)

**What it means:** Runway is too short to recover from a single bad month or a missed capital event.

**Immediate triggers (within 1 week):**
- Defer any new capex
- Pause new hiring decisions (existing offers stand if signed)
- Accelerate cash-collection activities
- Update capital-raise close-date probability assessments
- Notify advisory committee

**Defer / slow:**
- New plant deployment commitments
- Sponsored R&D work that doesn't drive near-term revenue
- Geographic expansion to new communities
- Marketing spend beyond minimum

**Accelerate:**
- Close any in-flight capital-raise milestones
- Direct outreach to anchor donors / SEFA / IBA for bridge capital
- Invoice all draft Xero invoices (e.g. resolve INV-0314 Centrecorp draft)
- B2C launch if standing inventory exists

**Who decides:** Founders together; advisory committee informed within 1 week.

**Communication:** Weekly cash report to advisory committee until state changes.

### State 3: BELOW_TARGET (3 months ≤ cash < 6 months)

**What it means:** Adequate working capital but not enough to absorb a major adverse event.

**Posture:** Lean management. Continue planned operations but defer non-critical growth investments.

**Continue:**
- All committed operations
- Planned hires within budget
- Active capital-raise activities

**Defer (but plan for):**
- New plant deployment beyond next one
- Major geographic expansion
- Non-critical R&D investment

**Accelerate:**
- Capital-stack close to bring cash to OK state
- Diversification of revenue segments to reduce concentration risk

**Who decides:** Founders, with monthly review against advisory committee at standard cadence.

**Communication:** Monthly cash report; quarterly review with advisory committee.

### State 4: OK (cash ≥ 6 months)

**What it means:** Healthy reserves. Can invest in growth confidently.

**Posture:** Normal operations + invest in growth.

**Continue:**
- All planned operations and growth investments
- Active capital-raise for next stage

**Initiate / accelerate:**
- New plant deployments per Day 4 schedule
- New community partnerships
- R&D investment (next products in product roadmap)
- Inventory build-up beyond minimum

**Who decides:** Standard governance — founders execute, advisory committee oversight.

**Communication:** Monthly cash report; standard quarterly board / advisory review.

## Application to current state (May 2026)

Per the Day 6 projection, **Goods is in BELOW_FLOOR or NEGATIVE state immediately**. The policy implications:

### Immediate actions (this week)

1. **Confirm actual opening cash** at 1 May 2026 (the placeholder is $50K; if actual is materially higher, state may be BELOW_TARGET instead of NEGATIVE)
2. **Halt any non-essential spending** until cash position confirmed
3. **Accelerate invoice collection** — INV-0314 Centrecorp draft ($84,700) is the largest single lever; converting from DRAFT to PAID would shift the trajectory
4. **Update QBE close probability** — model assumes Sep 2026 close at 100%. Confirm with PIN team.
5. **Confirm SEFA loan timeline** — model assumes Nov 2026 draw. Realistic?
6. **Notify advisory committee** of the cash position and the runway projection

### Pre-emptive defer list (in case opening cash is genuinely $50K)

These would be deferred under the policy if BELOW_FLOOR state is confirmed:

- New plant deployment (Plant 2 currently scheduled Month 6 = Oct 2026)
- Standing inventory build ($50K Month 3 = Jul 2026)
- GM hire (currently Month 6 = Oct 2026) — at minimum push to after QBE close
- BD hire (currently Month 10 = Feb 2027) — push to after capital position OK

### Pre-emptive accelerate list

- INV-0314 Centrecorp invoice authorisation (currently DRAFT; converts to AUTHORISED → PAID = $84.7K cash inflow)
- Snow Foundation INV-0321 ($132K AUTHORISED, awaiting payment per compendium) — chase
- B2C web sales activation (if any beds in inventory)
- QBE Stage 2 milestones to close the match earlier than Sep if possible

## Communication cadence

| State | Cash report frequency | Advisory committee review | Investor / lender comms |
|---|---|---|---|
| NEGATIVE | Daily | Emergency call within 48 hrs | All within 24 hrs |
| BELOW_FLOOR | Weekly | Standing weekly check-in | Monthly proactive update |
| BELOW_TARGET | Monthly | Quarterly + ad-hoc | Quarterly per covenant requirements |
| OK | Monthly | Quarterly | Per agreed covenant requirements |

## Calculation method

The buffer state is computed from the Day 6 cashflow model. Per month:

```
monthsOfRunway = currentCash / currentMonthlyOperatingCost
```

Where `currentMonthlyOperatingCost = COGS + founder time + hires + opex` (excluding one-time capex / inventory build / capital inflows).

The script `report-goods-cashflow-36mo.mjs` outputs the buffer status per month. Conditional formatting in the Google Sheets workbook should mirror this:
- NEGATIVE: red fill
- BELOW_FLOOR: orange fill
- BELOW_TARGET: yellow fill
- OK: green fill

## What this policy is NOT

- Not a substitute for the cashflow model itself. The model gives the trajectory; the policy is the response.
- Not a board-level governance document. That requires Mint Ellison legal review + advisory committee endorsement.
- Not a public investor document. The buffer math goes in investor decks; the response framework is internal.

## What this policy IS

- A pre-committed decision rulebook so that under stress, the founders are operating from agreed principles rather than ad-hoc reactions.
- A communication contract with the advisory committee, SEFA, IBA, and any future capital partners.
- A discipline mechanism: "if cash < X, then Y" replaces "let's see how it goes."

## Recommended adoption path

1. **This week:** Ben + Nic review and adapt this v0.1 to their preferences
2. **Within 2 weeks:** Advisory committee endorsement at next standing meeting
3. **Within 30 days:** Build the conditional-formatting in the Google Sheets workbook `Cashflow 36mo` tab
4. **Within 60 days:** Add to investor pre-read pack as evidence of operational discipline
5. **Quarterly:** Review the thresholds (3 months / 6 months) against actual operating cost — they should scale as the business scales

## Connection to other diagnostic recommendations

This buffer policy is the operational delivery of **SIH Rec #5 (Strategic Planning + Risk Management)**:

> "Scenario planning for the upcoming raise, tied to operational decisions such as deferring further plant build or compressing geographic scope, could be more clearly and explicitly articulated."

It also feeds **SIH Rec #4 (Governance)**:

> "Advisory committee skills mix and formal governance for the new Pty Ltd will both be required by prospective investors."

The buffer policy is exactly the kind of document the advisory committee should endorse and oversee.

## Cross-references

- [[2026-05-12-financial-model-day6-cashflow-36mo]] — the projection this policy responds to
- [[2026-05-12-financial-model-day3-expenses-and-founder-time]] — operating cost basis
- [[2026-05-12-financial-model-scope]] — Week 1 Day 7 step
- [[2026-05-12-qbe-prep-resume]] — action #28 (risk register) is the natural sibling
- [[../articles/governance/risk-register]] — the cash-runway risk should land here when updated
- [[../articles/governance/ai-human-in-loop-policy]] — applies before this is shared with advisory committee or investors
