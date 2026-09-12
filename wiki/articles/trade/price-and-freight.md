---
reviewed: 2026-09-12
ruling: Ben, 9 September 2026, the money is a price model and never cost-plus; Ben, 12 September 2026, the flat-pack route
canon: [bed.price, bed.make, bed.contribution, bed.contribution.goodsFreight, bed.freight, bed.costStatus, plastic.kitPerBed, year.running, year.breakEvenBeds, year.needs, year.needsGoodsFreight, year.breakEvenBeds.goodsFreight]
sources: [v2/src/lib/data/the-year-and-the-raise.ts:25-35, v2/src/lib/data/demand-and-buyers.ts:357-362, v2/src/lib/data/demand-and-buyers.ts:469-557, v2/src/lib/data/production-route.ts:1-24, v2/src/lib/data/defy-supply.ts:19-45, v2/src/lib/data/defy-supply.ts:104-121, v2/src/lib/data/three-year-plan.ts:34]
---

# Price and freight

> A bed sells at $750 because that is the price, and the making cost is taken out of it afterwards. A legacy making allowance of $276 covers making the bed and $474 stays with the organisation, and both of those figures are provisional today because the bought leg panel yield is unknown. Five invoices realised five different prices, $370, $380, $560, $750 and $800, with no rule behind any of them, so anybody quoting a sixth invoice has five precedents and no policy. Freight is $150 a bed all up, resting on three data points that are all Maningrida and two of which were never charged to anybody. A price rule and a freight rule are both owed.

## $750 is a price

The bed is sold at $750 and the cost of making it comes out of that price. Reading it the other way round, as a cost plus a margin, produces a different organisation and a different conversation with a buyer (Ben, 9 September 2026).

What the price does:

| Figure | What it is | Status |
| --- | --- | --- |
| $750 | The price of a Stretch Bed | Settled |
| $276 | The making allowance, taken out of the price | Legacy figure, provisional |
| $474 | What one bed hands to the organisation when the buyer pays freight | Provisional |
| $324 | What one bed hands over when Goods carries freight | Provisional |
| $150 | Freight a bed, all up, its own line at cost | Settled on one route |

The contribution is the whole point of the model. Running the organisation costs $297,550 a year before a single bed is made, and at a provisional $474 a bed it takes 628 beds a year to carry that cost. The break-even of 628 beds is derived from the provisional $474, so the break-even is provisional too and is written that way every time it is printed.

## Why the making allowance is provisional

Ben ruled the route on 12 September 2026: press the tab sheets only at Witta, buy the leg sheets, dispatch flat-packed kits to community, and run a programme where young people and others assemble and distribute them. Factory capacity ends at dispatch. That replaced a route where legs were pressed here and beds were assembled here, and it moved the cost of a bed out from under the old figure.

Canon records the status in one line: "Provisional: bought legs and tab production need costing".

The size of the open question is easy to see. One supply path prices a finished Defy leg kit at $344.05 a bed excluding tabs, which is more than the entire $276 making allowance on its own. The current route buys panels instead of finished kits, and invoice INV-2021 proves the panel price: 25 sheets of 19mm HDPE, 1200 by 2400, cut to 800 by 1200 at $20 a sheet, $9,542 net. What the invoice does not prove is how many leg sets come out of one 800 by 1200 panel. Until that yield is known the panel path has no cost per bed, and neither the making allowance nor the contribution can be settled.

**Owner: Nic**, from the cutting evidence on the 25 sheets already invoiced. The 80 remaining sheets of the 105-sheet parent order are still to come, so the evidence for the yield is already sitting in the shed.

Print the word provisional in the sentence that carries $276, $474 or 628. A funder reading a number cannot see a footnote nobody wrote.

## The realised ladder, and the missing rule

Five settled invoices, five prices, in the order they were charged:

| When | Buyer | Per bed | Product as invoiced |
| --- | --- | --- | --- |
| Aug 2025 | Centrecorp Foundation | $370 | Goods Basket Bed v1.3 |
| Oct 2025 | Mala'la Health Service | $380 | Goods Basket Bed v2.1 |
| Nov 2025 | Centrecorp Foundation | $560 | Goods Weave Bed v2.3, which are Stretch Beds |
| May 2026 | Homeland School Company | $750 | Goods Stretch Bed, single |
| Jul 2026 | ALIVE National Centre | $800 | Goods Stretch Bed single |

No policy sits behind that ladder. Product, date and buyer all move at once across the five rows, so nothing in the record isolates what a buyer was willing to pay for the same thing. The first two prices are Basket Beds, a discontinued prototype. The $560 is a Stretch Bed sold under the old line name. The $750 is list price and the $800 is above it.

A person quoting the sixth invoice today has five precedents and no rule. That is the honest description, and it is the reason a price rule is owed: which buyers pay list, what a university pays, what a community organisation pays, and what happens when somebody asks for a hundred.

## Freight: $150 a bed, on three data points

Freight is a route and a volume before it is a rate. The all-up figure is $150 a bed, being $100 for the factory leg and $50 for the community leg. Both the live workbook and the repo cost engine already agree on that total; the old argument came from comparing one leg against the pair.

Every real freight figure Goods holds goes to Maningrida.

| What happened | Beds | Net | Per bed | Who paid |
| --- | --- | --- | --- | --- |
| Charged on INV-0303, Brisbane to Darwin to Maningrida | 40 | $5,900 | $147.50 | Homeland School Company |
| Quoted on INV-0283 and discounted in full | 13 | $3,200 | $246.15 | Nobody. Goods carried it |
| Paid to Sea Swift, bill 5732 2163 022, 29 Sep 2025 | 13 | $2,322.17 | $178.63 | Goods, to the carrier |

Three things that figure cannot do:

- **It cannot travel off this route.** All three points are Maningrida. Quoting freight to Palm Island, Utopia, Tennant Creek or Groote from this evidence is quoting without evidence.
- **It cannot hold across volumes.** The same destination cost $147.50 a bed across 40 beds and was quoted at $246.15 a bed across 13. A single constant misstates both ends.
- **Two of the three were never charged to anybody.** The Mala'la quote was zeroed, so it records what the run was worth and not what a buyer paid. The Sea Swift bill has a single line reading ".", so it cannot be shown to carry only those 13 beds; treat $178.63 as an upper bound on that run.

The $147.50 on INV-0303 is the one figure a buyer actually paid, and two washing machines rode on the same invoice, so even that is a ceiling for the per-bed share.

## Who pays freight moves the answer by a plant

Under the ruled price model the buyer pays freight at cost on its own line, the contribution stays at a provisional $474 and break-even stays at a provisional 628 beds. The constant never enters that calculation.

Where Goods carries freight instead, the contribution falls to a provisional $324 and break-even is a provisional 919 beds. The 796 printed in the workbook was computed on the factory leg alone and is wrong. Across 400 beds the difference is $60,000: the year needs $747,950 with the buyer paying freight and $807,950 with Goods paying it. That case is a sensitivity and no part of it is the plan. See [[capital/capital-stack]].

## What is owed, and who owns it

- **The panel yield.** How many leg sets come from one 800 by 1200 panel, read off the cutting evidence on the 25 sheets already invoiced. Owner: Nic. It settles the making allowance, the contribution and the break-even in one move.
- **A freight rule.** Open Item 9 in the live workbook wants delivery-route quotes and a named payer, and it wants freight recovery shown alongside freight cost. Owners: Nic and Ben.
- **A price rule.** Nothing in any module or any workbook says what the sixth invoice should charge. No owner recorded.

Until the first two land, every sentence that prints $276, $474, $324 or 628 says provisional in the sentence itself.

## Where to check

- `v2/src/lib/data/the-year-and-the-raise.ts`: price, making allowance, both contributions and the double count that produced $937,550.
- `v2/src/lib/data/demand-and-buyers.ts`: `PRICE_LADDER`, `FREIGHT_EVIDENCE` and `FREIGHT_RULING`.
- `v2/src/lib/data/production-route.ts` and `v2/src/lib/data/defy-supply.ts`: the 12 September route, INV-2021 and the unknown yield.
- Xero, Nicholas Marchesi sole trader, ABN 21 591 780 066, read 11 September 2026.

Related: [[trade/what-has-been-bought]] · [[trade/the-four-doors]] · [[products/stretch-bed]] · [[capital/cost-register]]
