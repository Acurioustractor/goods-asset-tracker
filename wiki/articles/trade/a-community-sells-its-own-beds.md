---
reviewed: 2026-09-12
ruling: Ben, 10 September 2026. A community keeps the full sale price of its own stock, so the share paid to Goods starts at zero. Ben, 8 September 2026, the workbook review. Community resale proceeds stay outside Goods revenue and outside Goods debt repayment capacity.
canon: [bed.price, plastic.kitPerBed, year.running, bed.costStatus, year.beds, year.pools, year.poolSize]
sources: [v2/src/lib/data/community-economics.ts, v2/src/lib/data/community-loop.ts, v2/src/lib/data/model-language.ts, v2/src/lib/data/offers.ts, v2/src/lib/data/road-ending.ts, v2/src/lib/data/production-route.ts, deliverables/finance/goods-financial-plan/QBE-workbook-review.md, deliverables/finance/goods-financial-plan/goods-model.html]
---

# A community sells its own beds

> "Money kept in community" is a rule until somebody can show the trade underneath it. Here is the trade. A community that holds stock and sells it keeps the whole $750, because Ben ruled on 10 September that the share paid to Goods on a community's own stock starts at zero. On the working model that share is a live input and its value is 0. The arithmetic behind the rule sits in `community-economics.ts`: shred is worth $40 a bed's worth of material, a finished leg kit is worth $344.05, an assembled bed is worth $400 and a sold bed is worth $750. Selling is the biggest step on that ladder and it needs no new machinery. And there are two loops, never one. Catalytic capital pays Goods for a community's first stock. Buyers pay the community enterprise. That second flow never reaches Goods, and drawing the two as a single circle would tell a funder that Goods is repaid out of community sales, which is false.

## The banner that travels with every figure here

> NOTHING HERE HAS BEEN OFFERED TO ANY COMMUNITY. No community sees a price for their own pathway before they have been walked through it in person.

That line is a constant in the module for a reason. Everything below is arithmetic. None of it is an offer, and none of it has been agreed with anybody.

## The ladder

Each rung is what somebody would pay for a bed's worth of material at that stage of processing, and every priced rung is what Goods already pays Defy today, from a named invoice.

| Step | What the community holds | Worth per bed's worth of material |
|---|---|---|
| Collection and baling | Sorted, caged HDPE ready to shred | No purchase price exists. Feedstock enters the cost model at $0 |
| Shredding | HDPE shred | $40, from Defy INV-1731 at $2.00 a kilogram across 20 kg |
| Pressing and CNC | Finished HDPE leg kit, cut and edged | $344.05, from Defy INV-1602 and INV-1732 |
| Assembly | A finished bed, ready to go out | $400, the kit plus $55.95 of assembly labour |
| Sales and delivery | Beds in homes, sold by the community | $750, the Stretch Bed price |

Shred to pressed kit is a jump of about 8.6 times, the largest single step on the ladder. The module's own line about it: this money goes to Sydney now, and we would rather it went to the community doing the work.

The spread a community keeps on a bed it sells but did not make is $350, the retail price less the cost of a finished bed.

## Selling pays better than pressing, on less setup

The source costs five pathways at 450 beds' worth of material a year. Read the last column, then read whether the pathway includes selling. They line up exactly.

| Pathway | Setup | Earns a year | Running a year | Left over | Sells? |
|---|---|---|---|---|---|
| Collect and shred | $56,600 to $103,300 | $18,000 | $51,043 | minus $33,043 | No |
| Collect, shred and sell | $56,600 to $103,300 | $175,500 | $52,843 | $122,657 | Yes |
| Collect, shred and press | $89,380 to $136,080 | $154,822.50 | $71,081 | $83,741.50 | No |
| Sell and deliver only, no plant | $31,800 to $64,000 | $157,500 | $36,800 | $120,700 | Yes |
| The whole chain | $95,767 to $142,467 | $337,500 | $79,333 | $258,167 | Yes |

Two readings matter and the second one is usually missed.

Collect-and-shred is the only pathway that loses money, and the source labels it "today's ask". It loses money because the site floor lands the moment anyone works on a site at all, whether or not the site is selling anything.

Pressing without selling still pays, at $83,741.50 a year. So the case for selling is not that pressing fails. Selling returns more, on less setup, with no extra capital equipment, because the site base is already there.

## The honest way to read that table

The 450 has no derivation. It appears once, in a text label on a hand-typed tab, and nothing else in the workbook produces it. The same workbook's Inputs sheet says 500 beds a year per factory at 0.4 first-year utilisation, which gives 200.

So read break-even instead, which needs no volume assumption:

| Pathway | Beds a year of material before it covers its own running cost |
|---|---|
| Sell and deliver only | about 105 |
| The whole chain | about 106 |
| Collect, shred and sell | about 136 |
| Collect, shred and press | about 207 |
| Collect and shred | about 1,276 |

1,276 is above every plant volume anywhere in the model. Collect-and-shred does not pay for itself at any output a community plant is expected to reach.

## What the 12 September route changes

The pathway figures were read on 11 September from a workbook dated 4 August, and they describe the older route where legs were pressed here and beds were assembled here. Under the ruling of 12 September, Witta presses only the tab sheets, the leg sheets are bought, kits go out flat-packed and assembly happens in community.

Two consequences follow.

The "sell and deliver only, no plant" pathway is the near-term shape for most places. A community that receives flat-packed kits, assembles them and sells them is already doing the assembly rung and the sales rung with no plant at all.

And the pressing rung is the one being re-costed. Canon marks the current route cost "Provisional: bought legs and tab production need costing", because the yield of a bought leg panel is unknown until Nic reads the cutting evidence from the 25 sheets already invoiced. The $344.05 kit price is an invoiced fact. What a community-pressed kit costs against it is the open question.

## The two loops that never join

**Loop one.** A funder puts catalytic capital into Goods. Goods makes and dispatches a pool of beds. The pool arrives in a community as stock it owns. That money has gone from the funder to Goods and it stops there. Goods spent it making beds.

**Loop two.** The community allocates its pool: some beds given where the need is immediate, some sold. Buyers pay the community enterprise. The community decides what that money does next.

No arrow runs from loop two back to loop one. The retired diagram line is recorded in `model-language.ts`, and its reason is exact: one circle puts an arrow from community revenue back to catalytic capital and implies Goods is repaid out of community sales. The full $750 stays with the enterprise, ruled 10 September. Ruling 9 calls these the two kinds of money that never meet, so the drawing is two loops.

The 8 September workbook review states the same rule from the finance side: community resale proceeds remain outside Goods revenue and outside Goods debt repayment capacity. That has a hard consequence for any lender. Money a community earns selling its own stock cannot service a Goods loan. When SEFA asks what percentage of revenue comes from trade, community sales are not part of the answer.

## One pool, and what it reaches

Two pool sizes are in circulation and they belong to two different plans. Say which one you mean. The year being raised for now is 400 beds of first stock in four pools of 100, so a pool this year is $75,000 of stock at the published price, and that is the figure in [[capital/capital-stack]]. The per-pool arithmetic in `community-loop.ts` is drawn on Nic's larger program from the Dusseldorp call of 2 September 2026: 1,000 beds into five pools of 200. Everything in this section is that 200-bed pool, because it is the one the module carries.

That arithmetic is built from canon and labelled at every step.

A pool on that drawing is 200 beds. At $750 each that is $150,000 of stock, and that is a cost to whoever paid for it. It is never income.

If all 200 sell, gross sales are $150,000. A complete community production facility costs $150,000 to $220,000. So one pool sold in full reaches the bottom of that band and no further, before the site floor, an operator or any working stock. Sell three quarters of the pool and it reaches three quarters of the way to the bottom of the band.

The sentence the drawing carries says it plainly: up to $150,000 if all 200 sell at $750, less when beds are given, and a design number until the rules are agreed.

Four gates stand between that arithmetic and anything real, and none of them is closed at any site yet:

1. Buyers. Who is buying the sold beds, named.
2. Rules. Allocation, sales money, resale and stock, agreed and signed.
3. An operator and a place. Who runs the line, where, and who pays them.
4. A measured cost. Fifty beds pressed at production rate, timed and costed.

## Why the third site is in the first community's interest

The shared team behind every site costs the same whether there is one site or five, so every community that joins makes every other community's share smaller. Costed at the 4 August overhead of $109,500, one site carries all of it and five sites carry $21,900 each.

That figure is stale in one direction and the module says so. At the 9 September running cost of $297,550, every share roughly triples. What the shared team actually is, and what a site should fairly carry of it, is a separate and unsettled question.

This arithmetic has not been agreed with any community.

## What this model refuses to say

Three refusals are held as constants so they cannot be quietly dropped.

It never splits money arriving at a community into wages and surplus. That is the community's decision, and a model that guesses it puts a number where a conversation belongs.

It does not cost bought-in feedstock for a pathway that starts partway down the chain.

It does not price a site base for a community that asked for no production modules.

## Where this actually stands

Zero community enterprises are trading today. That is the honest position and it is what this year is meant to change. Five communities have asked for a plant. Community ownership is a pathway, and every sentence about it stays a pathway until a community enterprise has sold a bed and kept the money.

## Related

[[trade/price-and-freight]] · [[trade/facilitation-as-a-line]] · [[trade/enquiry-to-delivered-bed]] · [[trade/what-has-been-bought]] · [[capital/catalytic-capital]] · [[investors/sefa]] · [[communities/overview]]

## Sources

- `v2/src/lib/data/community-economics.ts` lines 57 to 61, the 450 and the banner; lines 80 to 119, the value ladder; lines 141 to 160, the three build paths; lines 181 to 220, the five pathways and the selling spread; lines 232 to 247, the network cost and the three refusals; lines 249 to 264, `earnsPerBed` and `breakEvenBeds`.
- `v2/src/lib/data/community-loop.ts` lines 28 to 60, the pool, the facility band and the site floor; lines 88 to 103, the scenarios and the three drawing sentences; lines 112 to 139, the loop steps and the four gates.
- `v2/src/lib/data/model-language.ts` lines 126 to 133, the retired one-circle diagram and its reason.
- `v2/src/lib/data/offers.ts` lines 50 to 64, the $150,000 to $220,000 facility band.
- `v2/src/lib/data/production-route.ts` line 24, the provisional cost status.
- `deliverables/finance/goods-financial-plan/QBE-workbook-review.md` line 69, community resale proceeds and debt repayment capacity.
- `deliverables/finance/goods-financial-plan/goods-model.html` line 432, the share paid to Goods as a live input starting at zero.
- Source workbook: GOC Bed Unit-Costing Model v2, 4 August 2026, tab "Community Economics", read 11 September 2026.
