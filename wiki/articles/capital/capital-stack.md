---
reviewed: 2026-09-12
ruling: Ben, 11 Sep 2026, a stack that scales up and down by who is missing
canon: [year.needs, year.needsGoodsFreight, year.asked, year.secured, year.gap, year.running, year.beds, year.pools, year.poolSize, year.facilitation, year.facilitationEach, year.bedSurplus, year.bedsUnfunded, year.bedsUnfundedAud, year.breakEvenBeds, bed.price, bed.make, bed.contribution, bed.contribution.goodsFreight, bed.freight, bed.pressedKg, plant.count, plant.allowance, plant.firstYearBeds, plant.matureBeds, plant.modulesLow, plant.modulesHigh, plant.secondPress, trade.bedsPaid, trade.paidNet]
sources: [v2/src/lib/data/capital-stack-flex.ts, v2/src/lib/data/capital-stack-flex.guards.test.ts, v2/src/lib/data/the-year-and-the-raise.ts, v2/src/lib/data/sheet-canon.ts, deliverables/qbe-stage2/backwards-pass-2026-09-11.md, deliverables/qbe-stage2/real-forms-review-2026-09-12.md]
supersedes: [program/stage-2-funding]
---

# The capital stack, and how it flexes

> The year needs $747,950. $600,000 is asked across five lines, $0 is secured, and the gap is $147,950. Four funders are in flight and they buy different things: QBE buys plants, Tim Fairfax buys the organisation, Brian M. Davis buys beds and facilitation, and SEFA lends, which comes with a repayment test a grant does not have. This article holds each line with its amount, instrument, job and stage, what stops if one drops out, what any amount of money buys, and why plant money never moves the gap. It is built from `v2/src/lib/data/capital-stack-flex.ts` and its 23 guards, which is where the figures live and where they will change first.

## What the year costs

Four jobs, and every dollar in the stack belongs to one of them.

| Job | What it pays for | Amount | The smallest unit a funder can buy | If it stays unfunded |
|---|---|---:|---|---|
| Plant | 2 community plants | $300,000 | One plant, $150,000 | No community makes its own beds this year. Witta keeps making them and the ownership pathway stalls, which is the point of the model. |
| Beds | Making 400 beds of first stock | $110,400 | One bed, $750 | Community enterprises have nothing to sell. |
| Facilitation | Facilitation in 4 communities | $40,000 | One community, $10,000 | Beds arrive without the trips, build days, training and delivery around them. |
| Operating | Running the organisation | $297,550 | A month of the organisation, $24,796 | Carried by trade, at 628 paid beds a year on the provisional contribution below. |
| **The year** | | **$747,950** | | |

The bed line is priced at what a bed costs to make, and the making allowance is provisional. Canon carries $276 as a legacy making allowance and $474 as a provisional contribution, because the route Ben ruled on 12 September buys the leg sheets in and the panel yield on those sheets is not known yet. Nic owns that yield, from the cutting evidence on the 25 sheets already invoiced. Until it lands, every figure derived from $276 or $474 is provisional and says so.

Freight is $150 a bed on top of the $750 price, and every invoice so far has put it on the buyer. If Goods carries freight on all 400, the year needs $807,950 and the provisional contribution a bed makes falls from $474 to $324.

The operating line is priced at $297,550: founders $151,200, travel to communities $51,000, accounting and advice $50,000, Witta rent $27,000, marketing $10,000 and maintenance $8,350.

## Who is asked, and what each one is for

| Line | Amount | Instrument | Job | Stage | In the $600,000 |
|---|---:|---|---|---|---|
| QBE Foundation, Stage 2 | $300,000 | Grant | Two plants | Applying. Closes noon, 25 September | Yes |
| Tim Fairfax Family Foundation | $100,000 | Grant | Operating | Invited. Year one of $300,000 over three years. Due 9 October, 5pm | Yes |
| Brian M. Davis Charitable Foundation | $60,000 | Grant | 80 beds at the published price | Invited. Due 25 September, board 19 November | Yes |
| Brian M. Davis Charitable Foundation | $40,000 | Grant | Facilitation in four communities | Invited, the other half of the same $100,000 invitation | Yes |
| Snow Foundation | $100,000 | Grant | 133 beds | Not sent. One page would send it | Yes |
| Commonwealth, through Oonchiumpa | $150,000 | Government | Alice Springs plant | Approved and ready, a third site outside the QBE request | No |
| Commonwealth, second facility | $150,000 | Government | A plant, site unnamed | Likely, on Ben's judgement as a director | No |
| SEFA, Backing the Bold | $50,000 to $200,000 | Loan | Working capital and the second press | EOI drafted and unsent. Queensland stream open, rolling | No |

Government plant money and the loan sit outside the $600,000 on purpose, and the guards hold them there. Nothing in the raise is secured. Every line is an invitation, an application or a conversation, and an invitation is not an award.

The whole $600,000 is philanthropy, which is the shape Jay warned about for QBE 2026: the programme wants corporate philanthropy to unlock debt or equity. The SEFA EOI is the fix that already exists in draft. See [[../investors/sefa]] and [[the-blockers]].

## What breaks if one drops

The module answers this by removing a line and re-running the arithmetic.

| If this drops | What happens |
|---|---|
| QBE | The plant line goes from $300,000 covered to nothing covered. Two plants do not get built and no community starts making beds this year. |
| Tim Fairfax | The gap widens by exactly their $100,000, to $247,950. Their invitation names the resilience of organisations, so it sits on the operating line alone. |
| Brian M. Davis | 80 beds and all four community facilitations come off at once, because one invitation is doing two jobs. |
| Snow, still unsent | Bed cover falls from $160,000 to $60,000. The beds line stops over-covering and goes $50,400 short, and the surplus that carries the organisation goes to zero. |

As things stand, one line is short: operating, by $197,550.

## Why the beds line is deliberately over-covered

Bed money is asked at the $750 price and the bed cost line is the provisional $276 of making, so the beds line over-covers on purpose and the surplus carries the organisation. That is the provisional $474 doing its job.

$160,000 of bed money against a $110,400 making line leaves $49,600. The operating line is short $197,550. The difference between those two is $147,950, which is the gap seen from the other end.

The same gap in beds: 187 beds of the 400 are unfunded, $140,250 at the published price. Every one of them does two jobs, paying its own making and handing the provisional $474 to the organisation, so bed money is the cheapest way to fund the organisation and the only ask with a product at the end of it.

The $99,500 double count that sat under the old figure came from charging Tim Fairfax against beds and against operating at the same time. One invitation, one job.

## Why plant money never moves the gap

A plant costs $150,000 and a plant grant brings $150,000. Plant money never leaves a hole and never fills one, so adding a plant adds a cost and a source in the same breath.

| Scenario | Plants | Needs | Funded | Gap |
|---|---:|---:|---:|---:|
| The raise as it stands | 2 | $747,950 | $600,000 | $147,950 |
| Alice Springs counted in, as a third site | 3 | $897,950 | $750,000 | $147,950 |
| Both Commonwealth grants land on new sites | 4 | $1,047,950 | $900,000 | $147,950 |
| The second Commonwealth grant takes a QBE site | 3 | $897,950 | $900,000 | none, and $2,050 over |

Only the last row closes it, because it puts new money against a cost that was already funded and moves $150,000 of the QBE request from plants to beds. The guard in `the-year-and-the-raise.guards.test.ts` holds that row at minus $2,050, so it covers the year by a margin too small to plan on. It comes with a duty: if the second $150,000 lands on Palm Island or Maningrida it pays for an activity QBE is being asked to fund, and Q14 and Q15 must carry it as other funding for the same purpose. Naming that site is Ben's, and it is tracked in [[the-blockers]].

A plant costs $150,000 against modules Matt Allen prices at $95,767 to $142,467, so the allowance holds a site cost that no site quote has tested yet. A plant makes 200 beds in its first year and 720 at maturity.

## What any amount buys

Every rung is a real unit at a real price. Nothing here is a share of a total.

| Amount | What it buys | And then |
|---:|---|---|
| $750 | One bed | One household off the floor, and the provisional $474 toward the organisation that makes the next one. |
| $7,500 | Ten beds | Twenty hours of paid making. Each dispatched kit carries 15 kg of tab shred pressed at Witta. |
| $10,000 | Facilitation in one community | The trips, the build days, the training and the delivery. Already billed and paid at this rate. |
| $22,500 | The second press | More tab capacity, on the machine that sets the pace of the line. Quoted by nobody, and in no ask. |
| $75,000 | 100 beds, one community pool | A community enterprise with stock to sell, and $75,000 of local capital when it sells. |
| $150,000 | One community plant | 200 beds in its first year, 720 at maturity, and a local crew paid to run the making. |
| $300,000 | Two plants | What QBE is being asked for: the year two communities start making beds themselves. |

## A loan is a different instrument

Debt carries a repayment test that a grant does not. Joel Bird put it plainly on 21 August: the question is whether the capital drives enough growth to repay it. On the provisional $474 a bed, 101 paid beds a year services $200,000, which is inside one plant's output.

What is unsettled is which entity the revenue flows through, and that decides where the debt can sit. Butterfly's FY26 EBITDA is about negative $42,854 against roughly $168,000 in the trading entity. SEFA's EOI asks for four years of EBITDA and the percentage of revenue from trade, so the form itself forces the entity decision.

## If the gap stays

Four places the rest can come from, trade first:

- **Trade.** 628 paid beds a year carry the organisation with no grant at all, on the provisional contribution. The year plans 400. The distance between those two numbers is the operating shortfall.
- **SEFA Backing the Bold.** $50,000 to $200,000 of debt, which suits the second press and working capital because both have a repayment source in the provisional $474 a bed.
- **Dusseldorp Forum at $50,000 and Minderoo at $100,000.** Both figures are ours. Neither funder has named one.
- **Selling more beds.** The gap is 187 beds at the published price, and four organisations have already bought 320, paid, $247,770 net of GST and $273,966 including GST across five settled invoices.

## What this replaces

This article used to say QBE Stage 2 offered up to $400,000 from a $1 million pool, with matched external investment required by 31 August 2026. All of that is retired.

- The $400,000 and the $1 million pool are gone. The QBE ask is $300,000, two plants at $150,000 each.
- The match is gone. Ruling V: the grant is catalytic and it is not a dollar-for-dollar match.
- The 31 August 2026 match deadline is gone. The date that matters is noon on Friday 25 September 2026, when QBE closes.
- The $2.5 million to $5 million directional ambition is gone, replaced by a costed year at $747,950.

The old figures and the rulings that retired them belong in [[what-we-no-longer-say]].

## Related

- [[the-blockers]], the ten things standing between this stack and four submitted applications
- [[capital-types]] · [[blended-finance]] · [[catalytic-capital]] · [[funder-register]] · [[cost-register]]
- [[../investors/qbe-foundation]] · [[../investors/tim-fairfax]] · [[../investors/sefa]] · [[../investors/snow-foundation]]
- [[../program/key-dates]] · [[../enterprise/10-investors-capital-raising]]
