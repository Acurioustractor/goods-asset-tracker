# Financial model Day 9: Three scenarios (Base / Upside / Downside)

> **Date:** 2026-05-12. **Owner:** Ben + Nic + (for endorsement) advisory committee. **Status:** v0.1. Runs the Day 6 cashflow model under three assumption sets to map the range of plausible trajectories. SIH Rec #5 deliverable. **Source script:** `act-global-infrastructure/scripts/report-goods-cashflow-36mo.mjs --scenario {base,upside,downside}`. **Output files:** `data/goods/cashflow-36mo-{base,upside,downside}.{csv,md,json}`.

## Headline comparison

| Metric | Downside | Base | Upside |
|---|---:|---:|---:|
| Opening cash (assumption) | $30K | $50K | $100K |
| Cash first negative | **May 2026** | Jun 2026 | Aug 2026 |
| Trough (worst cash) | **-$171K (Nov 2026)** | -$94K (Aug 2026) | -$15K (Aug 2026) |
| Capital injections total | $650K | $1.2M | $3.54M |
| Year 1 (FY27) revenue | $690K | $1,130K | $1,580K |
| Year 1 close cash | ~$0K | $992K | ~$2.2M |
| Year 3 close cash (36mo) | **$867K** | $3.33M | **$7.96M** |
| Probability of scenario | ~30% | ~30% | ~10-15% |

**The most important finding: the cash trough appears in ALL three scenarios.** The differences are depth and timing. Even in upside (more capital, higher revenue, faster scale), cash dips briefly negative in August 2026 because opening cash is too thin to bridge the working-capital lag in months 1-4.

**This means: opening cash is the most-critical input, regardless of scenario.** Either confirm it's higher than $50K, or actively bridge the months-1-4 gap with founder loan / accelerated invoice collection / pulled-forward capital close.

## Scenario definitions

### Base case (Day 6 default)

Reflects the Day 5 midpoint revenue targets, the Day 7 buffer policy implied operating cost, and the Day 8 capital stack at expected probability close dates.

Key assumptions:
- Opening cash $50K
- Day 5 segment midpoints exactly
- QBE $400K Sep 2026 (full match)
- SEFA $300K Nov 2026
- Anchor philanthropic $500K Jan 2027
- COGS 70% → 45% across years
- Founder time Mid scenario ($140K/yr)
- GM hire Oct 2026, BD Feb 2027
- Plant 2 Oct 2026, Plant 3 Sep 2027

### Upside case

Reflects: Centrecorp tranches roll on time, SEFA closes earlier, anchor donor closes earlier, Butterfly DGR live by Q3 2026, Minderoo + PFI both land, government procurement actually starts converting.

Key changes vs base:
- Opening cash $100K (Snow paid + Centrecorp draft authorised earlier)
- Higher segment ramps (~40% above midpoint)
- COGS efficiency 68% → 40% (SIH advisor validation lands well)
- Extra capital: Butterfly DGR $200K Y1 + PFI $640K Q4 2026 + Minderoo $1.5M Q3 2027
- SEFA + anchor close ~3 months earlier
- Plant 3 deployment earlier, Plant 4 in Year 2
- Extra hire: Operations Lead Year 2
- R&D refund $100K/yr (more activity)

### Downside case

Reflects: QBE match slipped a quarter and reduced to $200K (operating target), SEFA reduced to $150K, anchor delayed to Q2 2027 at $300K, no Minderoo or Butterfly DGR yet, government zero in Y1.

Key changes vs base:
- Opening cash $30K (worse than expected)
- Lower segment ramps (~40% below midpoint)
- COGS efficiency slower: 75% → 55%
- QBE $200K Dec 2026 (not $400K Sep)
- SEFA $150K Q1 2027 (not $300K Nov)
- Anchor $300K Q2 2027 (not $500K Jan)
- Founder time All-in scenario ($210K/yr) — more demand on founders during downside
- GM hire deferred to Month 12, BD entirely deferred
- Plant 2 deferred to Month 12 (was Month 6)
- Inventory build deferred
- R&D refund $60K/yr

## FY revenue comparison

| FY | Downside | Base | Upside |
|---|---:|---:|---:|
| FY26 remainder | $58K | $87K | $125K |
| FY27 (Year 1) | $690K | $1,130K | $1,580K |
| FY28 (Year 2) | $1,680K | $2,820K | $4,375K |
| FY29 partial (10mo) | $2,900K | $5,000K | $7,350K |

## What triggers a move between scenarios

The scenarios are not static — they're operating modes. The framework: monitor specific leading indicators, and shift posture when they trip.

### Triggers to move from Base to Downside

| Trigger | Date by | Source signal |
|---|---|---|
| Opening cash < $50K confirmed | 1 Jun 2026 | Verify with bookkeeper this week |
| INV-0314 Centrecorp still DRAFT | 30 Jun 2026 | Xero status check weekly |
| SEFA term sheet not signed | 31 Aug 2026 | SEFA conversation cadence |
| QBE Stage 2 match raised < $400K | 31 Aug 2026 | QBE program milestone |
| 0 signed institutional commercial LOIs | 31 Aug 2026 | Pipeline status weekly |
| Plant 2 deployment plan deferred | 30 Sep 2026 | Plant 2 capex schedule |

**Action on Downside trigger:** invoke Buffer Policy BELOW_FLOOR response (defer capex, pause hiring, accelerate collections, weekly cash report to advisory).

### Triggers to move from Base to Upside

| Trigger | Date by | Source signal |
|---|---|---|
| Minderoo catalytic confirmed | 31 Dec 2026 | Minderoo conversation status |
| 2+ anchor philanthropic LOIs signed | 31 Dec 2026 | Donor pipeline |
| Butterfly DGR live | 30 Sep 2026 | Charity transition timing |
| First government procurement contract signed | 30 Jun 2027 | Supply Nation + panel registrations |
| PFI repayable confirmed | 31 Mar 2027 | EOI → application |

**Action on Upside trigger:** invest in growth — extra plant deployment, second BD hire, faster geographic expansion.

## Buffer-state trajectory by scenario

How the buffer state evolves across the 14 critical first months of each scenario:

| Month | Downside | Base | Upside |
|---|---|---|---|
| May 2026 | NEGATIVE | BELOW_FLOOR | BELOW_FLOOR |
| Jun 2026 | NEGATIVE | NEGATIVE | BELOW_FLOOR |
| Jul 2026 | NEGATIVE | NEGATIVE | BELOW_FLOOR |
| Aug 2026 | NEGATIVE | NEGATIVE | NEGATIVE |
| Sep 2026 | NEGATIVE | BELOW_TARGET | OK (QBE+SEFA both land) |
| Oct 2026 | NEGATIVE | BELOW_TARGET | OK |
| Nov 2026 | NEGATIVE (trough) | BELOW_FLOOR | OK |
| Dec 2026 | BELOW_FLOOR | BELOW_TARGET | OK |
| Jan 2027 | BELOW_FLOOR | OK (Anchor lands) | OK |
| Feb 2027 | BELOW_FLOOR | OK | OK |
| Mar 2027 | BELOW_FLOOR | OK | OK (Plant 3 prep) |
| Apr 2027 | BELOW_TARGET | OK | OK |

**Insight: the trough is structural in months 5-11 in the Base case** and **months 4-22 in the Downside case**. Even Upside has 4 months below floor or negative. Buffer policy is essential operational discipline through the whole first half of Year 1.

## What this tells the investor / board / advisory committee

A defensible, honest story:

1. **Goods is in a structurally cash-tight period from May 2026 to ~Sep 2026.** Not a hypothetical risk; a real and observable trough.
2. **The capital stack we're building exists specifically to bridge this trough.** QBE $400K, SEFA $300K, anchor $500K — collectively $1.2M is the lifeline.
3. **In all three scenarios, the business is viable past Year 1** with the capital stack landing. Differences are operating margin and Year 3 reserves, not survival.
4. **The downside case still closes Year 3 with $867K cash.** That's a survivable downside, not catastrophic.
5. **The upside case closes Year 3 with $7.96M.** That's a stretch-target growth trajectory.
6. **The base case closes Year 3 with $3.33M.** That's the realistic expected outcome.

The honesty of the trough story is a strength. It demonstrates founder discipline (we know we'll be tight; we have a policy for it) and capital-stack design (the stack matches the trough).

## Recommended response framework (links Day 7 buffer policy to Day 9 scenarios)

Cross-reference Day 7 (Buffer Policy) state matrix with Day 9 scenario monitoring:

| Scenario | Default buffer state Year 1 | Decision posture |
|---|---|---|
| **Base** | BELOW_TARGET trending OK | Execute plan; tight discipline through Aug-Oct 2026 |
| **Upside** | OK from Sep 2026 | Confirm operating discipline; reinvest growth proceeds |
| **Downside** | BELOW_FLOOR for most of Year 1 | Active deferment / acceleration; founder bridge if needed |

Define monthly check points: 1st of every month, founders review buffer state + scenario triggers. If 2+ Downside triggers tripped, formally invoke Downside operating posture.

## What's still open for Day 10

- **Day 10:** Butterfly impact tab. Side-by-side comparison: Goods Pty Ltd standalone vs Goods Pty Ltd + Butterfly DGR combined. Models the financial impact of the charity transition: extra revenue lines (DGR donations, subsidised-access), cost re-allocations, and the entity-by-entity P&L. This closes the 8-week Week 2 phase.

## Open decisions in Ben's court

1. **Confirm opening cash at 1 May 2026** (the most-sensitive input across all scenarios)
2. **Endorse the three scenarios** — are the assumptions defensible? Are the trigger conditions right?
3. **Buffer-state communication cadence with advisory committee** — monthly cash report at minimum, weekly during BELOW_FLOOR
4. **Decide which scenario to lead with externally** — Base for investor decks; Downside for governance/SEFA conversations
5. **First check-in date** — when do Ben + Nic formally review which scenario is in play?

## Cross-references

- [[2026-05-12-financial-model-day6-cashflow-36mo]] — base case detail
- [[2026-05-12-financial-model-day7-buffer-policy]] — the response framework
- [[2026-05-12-financial-model-day8-capital-stack]] — the capital stack each scenario uses
- [[2026-05-12-financial-model-day5-revenue-segments]] — segment ramps
- [[2026-05-12-financial-model-scope]] — Week 2 Day 9 step
- Source scripts: `report-goods-cashflow-36mo.mjs` (now scenario-aware)
- Output CSVs: `data/goods/cashflow-36mo-{base,upside,downside}.csv`
- [[../articles/governance/ai-human-in-loop-policy]] — applies before external sharing
