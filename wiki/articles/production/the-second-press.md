---
reviewed: 2026-09-12
ruling: Ben, 10 September 2026, size the SEFA loan to the press and working capital, under the flat-pack route ruling of 12 September 2026
canon: [plant.secondPress, line.pressPerDay, line.cncPerDay, line.bedsPerMonth, line.bedsPerMonthLifted, year.beds, plant.count, plant.allowance, bed.price, bed.make, bed.contribution, year.asked]
sources: [v2/src/lib/data/defy-supply.ts:180-195, v2/src/lib/data/production-scenarios.ts:28-99, v2/src/lib/data/the-year-and-the-raise.ts:282-284, v2/src/lib/data/capital-stack-flex.ts:220-268, v2/src/lib/data/production-route.ts:26-32, deliverables/qbe-stage2/the-four-applications-2026-09-11.md, deliverables/qbe-stage2/real-forms-review-2026-09-12.md, deliverables/qbe-stage2/qbe-answers-2026-09-10.md]
---

# The second press

> A second tab press costs $22,500. The figure is cross-guarded in three modules, no supplier has quoted it, and it sits in none of the $600,000 asked across five lines. What it buys is the idle router: one press makes 6 kits a day against a router that will take 8.56, so a second press lifts the modelled line from 96 kits a month to 136. Ben ruled on 10 September that it goes to SEFA, sized to the press plus working capital and not to the illustrative $200,000. The QBE plants do not cover it, because neither plant has a start date and the money is not confirmed before 13 November, so every near-term bed comes off the one press at Witta. A loan suits it because a press earns the cash that repays a loan, which the first stock of gifted beds does not.

## What it is

$22,500, carried in three places so it cannot drift: `defy-supply.ts:180`, `production-scenarios.ts:28` and `the-year-and-the-raise.ts:282`. Canon exposes it as `plant.secondPress`.

Two things are true about that number at the same time. No supplier quote sits behind it, so it is an estimate with a guard around it. And it appears in no application: the capital ladder lists it as a rung a funder could buy (`capital-stack-flex.ts:238`), while the $600,000 asked across the five funding lines contains no press.

## What it buys

The press is the constraint on the flat-pack route. One press presses 6 tab sheets a day and each dispatched kit takes one, and the router downstream will take 8.56 kits a day (`production-route.ts:9-11`). `factoryKitsADay` takes the lower of the two, so about 2.56 kits a day of router time goes unused, which is roughly 41 kits a month.

A second press buys that back and no more. Two presses feed the router to its entered rate, and the router then caps the line at 136 kits a month against the 96 one press gives (`production-route.ts:26-32`, `production-scenarios.ts:45-46, 52-59`). The lift is 40 kits a month, 480 a year, for $22,500 once.

What it does not buy is stated in the module: a second tab press still needs bought legs, enough shred, and the staff and packing to get a kit out the door. Community assembly sits outside the factory altogether (`production-scenarios.ts:97-98`). The old panel-premium payback of 113 beds is withdrawn with the route it belonged to, because purchased leg panels and pressed tab sheets are complementary parts of one kit and never two ways of making a whole one (`defy-supply.ts:181-188`).

## What it decides

Time on the 400 beds of first stock. At 96 kits a month the run takes 4.17 operating months. At 136 it takes 2.94. That is about five weeks, and `the-year-and-the-raise.ts:283-284` puts it plainly: the press decides whether the 400 beds land in June or August.

It cannot be decided this week. Choosing between a second press and buying more leg panels needs a current shred price a kilogram, and that price sits in quotes QU0494 and QU0495, which nobody has opened. See [[supply-and-defy]].

## Ben's 10 September ruling: it goes to SEFA

The ruling was to size the loan to the press and working capital and wait, because the press was unpriced at the time. It now has a figure. Working capital is the provisional $276 a bed of making cost, so a first ask of $50,000 to $100,000 covers the press plus the making of a first run (`deliverables/qbe-stage2/the-four-applications-2026-09-11.md`).

That sits inside SEFA Backing the Bold, which lends $50,000 to $200,000 to impact-led organisations with traction, Queensland focused. The Queensland stream is open with rolling acceptance and the EOI is drafted and unsent. Asking for $50,000 to $100,000 against a named machine is a stronger application than the illustrative $200,000, and at the provisional $474 a bed, 101 paid beds a year services $200,000 of debt (`capital-stack-flex.ts:267-268`).

Jay's steer makes the send urgent on its own terms. QBE in 2026 wants corporate philanthropy to unlock debt or equity, and the $600,000 Goods is asking for is 100% philanthropy. A live loan conversation changes what the QBE application can say about itself, and sending the EOI beats any wording change.

The EOI carries a cost. It asks for four years of EBITDA and the percentage of revenue that comes from trade, which forces the entity question into the open: Butterfly's FY26 EBITDA is about negative $42,854 against roughly $168,000 in the trading entity (`deliverables/qbe-stage2/real-forms-review-2026-09-12.md`). Butterfly is applicant and recipient under ruling AA, and which entity holds the trade revenue is owned by Ben, Nic and Joel. See [[investors/sefa]] and [[governance/legal-structure]].

## Why the QBE plants do not solve it

QBE Catalysing Impact Stage 2 asks for $300,000 to build 2 community plants at $150,000 each, and closes at noon on Friday 25 September 2026. That money does a different job.

The plants do not make this year's beds. Neither has a start date, and every bed committed for the next twelve months comes off the line at Witta (`deliverables/qbe-stage2/qbe-answers-2026-09-10.md`). QBE's pre-condition date is 13 November, so the money is not confirmed before then even if the application succeeds, and the press question is a September question.

Plant money also never moves the operating gap. A plant costs $150,000 and a plant grant brings $150,000, so adding a plant adds a cost and a source in the same breath (`capital-stack-flex.ts:220-221`). The press is the opposite shape: a small amount of capital against an output the organisation keeps. See [[investors/qbe-foundation]] and [[products/plant-design]].

## Why a loan fits, and where a loan stops

A grant asks what the money achieves. A lender asks whether the money generates enough to repay itself, which is how Joel Bird framed it on 21 August. A press answers the lender's question directly, because the machine produces the beds whose margin services the debt.

Repayable capital has two clean homes here.

- **Plant.** A press, and the equipment in a community plant, both earn from what they make.
- **Stock a buyer has ordered.** An invoice is the repayment source, and four organisations have already bought and paid for 320 beds.

It has one place it cannot go. The 400 beds of first stock are placed into community pools as trading stock, and when a pool sells, the money stays with the community enterprise as local capital (`capital-stack-flex.ts:44-52`, `capital-stack-flex.ts:239`). A bed given away has no repayment source inside it, so first stock has to be grant money. That division is why the four applications are not interchangeable: QBE buys plants, Tim Fairfax buys the organisation, Brian M. Davis buys beds and facilitation, and SEFA lends.

Service comes out of Goods' own margin on paid beds, which is the provisional $474 on a $750 bed. What is still unsettled is which entity that revenue flows through, and that decides where the debt can sit.

## Who owns what

| Action | Owner | What it unblocks |
|---|---|---|
| Open QU0494 and QU0495 | Ben or Nic | The press against panels decision |
| Send the SEFA EOI, drafted and unsent | Ben | The only debt line in the raise |
| Settle which entity holds the trade revenue | Ben, Nic, Joel | The EBITDA and trade-revenue fields on the EOI |

## Related

[[capacity-and-the-line]] · [[the-flat-pack-route]] · [[supply-and-defy]] · [[investors/sefa]] · [[capital/capital-stack]]

## Sources

- `v2/src/lib/data/defy-supply.ts` lines 180 to 195. The $22,500, the withdrawn payback, the additive-panels rule.
- `v2/src/lib/data/production-scenarios.ts` lines 28 to 99. Two-press scenarios and what a press does not solve.
- `v2/src/lib/data/the-year-and-the-raise.ts` lines 282 to 284. The press is in no ask, and what it decides.
- `v2/src/lib/data/capital-stack-flex.ts` lines 220 to 268. The ladder, plant money, and the loan test.
- `deliverables/qbe-stage2/the-four-applications-2026-09-11.md`. The 10 September sizing ruling and the four jobs.
- `deliverables/qbe-stage2/real-forms-review-2026-09-12.md`. The SEFA EOI fields and the entity comparison.
- `deliverables/qbe-stage2/qbe-answers-2026-09-10.md`. The plants have no start date.
