---
reviewed: 2026-09-12
ruling: Ben, 12 Sep 2026, the flat-pack route, which leaves the making allowance and the contribution provisional; with the 11 Sep correction that separated bed money from operating money
canon: [bed.price, bed.make, bed.contribution, bed.contribution.goodsFreight, bed.freight, bed.costStatus, year.beds, year.running, year.breakEvenBeds, year.needs, year.needsGoodsFreight, year.asked, year.secured, year.gap, year.bedsUnfunded, year.bedsUnfundedAud, year.facilitationEach, plant.count, plant.allowance, plant.secondPress]
sources: [v2/src/lib/data/the-year-and-the-raise.ts, v2/src/lib/data/three-year-plan.ts, v2/src/lib/data/production-route.ts, v2/src/lib/data/capital-stack-flex.ts, v2/src/lib/data/demand-and-buyers.ts, v2/src/lib/data/defy-supply.ts, v2/src/lib/data/sheet-canon.ts, deliverables/qbe-stage2/sheet-realignment-2026-09-11.md]
---

# The money model

> A Goods bed is priced at $750, and that price was never built up from a parts list with a margin
> on top. Four organisations paid between $370 and $800 a bed across five settled invoices, and the
> list price is where that record landed. The $750 does two jobs at once: it covers making the bed
> and it hands the rest to the organisation that gets beds to communities. Both halves are
> provisional today, because Ben's route ruling of 12 September buys leg sheets whose panel yield
> nobody has cut and counted yet. The shape is settled even while the halves move. Bed money and
> operating money are the same dollars seen from two ends, so adding them overstates the year. That
> is how $937,550 was published on 11 September with Tim Fairfax's $100,000 counted twice inside it.

## The price came from buyers

Five settled invoices carry five realised prices. Centrecorp paid $370 a bed on INV-0259 and $560
on INV-0291. Mala'la Health Service Aboriginal Corporation paid $380 on INV-0283. Homeland School
Company paid $750 on INV-0303, the first invoice at the list price. The ALIVE National Centre at
the University of Melbourne paid $800 a bed for 100 beds on INV-0342, the largest bed order settled
so far and the only one above list.

No rule sits behind that ladder. Each price was agreed with a buyer in a particular year, and
$750 is the price Goods now publishes and sells at through the one live retail channel, which is
Stripe and the Stretch Bed only.

That history matters for the model, because it means the price is a market fact first. A cost-plus
bed would move every time the plastic price, the press or the freight moved, and a community
partner would be quoted a different number each quarter for the same object. The price holds still
and the cost moves underneath it.

## What the $750 does

Canon splits the price into two named parts. `bed.make` holds $276 and canon labels it a legacy
making allowance. `bed.contribution` holds $474 and canon labels it a provisional contribution on
that legacy allowance. Together they are the whole of the price, and neither is a measured
production cost today.

The word provisional belongs in the sentence every time those numbers are printed, because the
route changed on 12 September. Goods now presses the tab sheets at Witta, buys the leg sheets,
dispatches flat-packed kits and runs a programme where young people and others assemble and
distribute them in community. The leg panels are bought and nobody has yet counted how many leg
kits a purchased panel yields. Canon's status line for the current route reads exactly this:
"Provisional: bought legs and tab production need costing".

Nic owns that answer, and the evidence already exists. Defy invoice INV-2021 bills 25 sheets of the
105 Nic ordered on 26 August, so the cutting record from those 25 settles the yield without anyone
waiting for a new run.

Until that count lands, $276 is an allowance carried forward and $474 is what that allowance
implies. Neither has been measured against a production run.

## Bed money and operating money are the same dollars twice

Running the organisation costs $297,550 a year before a single bed is made: two founders beyond
their production days; travel to eleven communities; accounting and advice; rent on the Witta shed;
marketing; upkeep on the press and the router.

A bed sold at $750 pays its own making and hands $474 toward exactly that list. So the running
cost is already partly paid by the bed line. Writing "400 beds at $750" beside the full $297,550
charges the organisation twice for the same dollars.

The year needs $747,950 with the buyer paying freight. That figure is 2 plants at the $150,000
allowance, 400 beds at the making allowance, facilitation at $10,000 a community and the whole
$297,550 of running cost. The version published on 11 September was $937,550 because it used the
sale price for the beds instead of the making allowance. The overlap between the two views is
$189,600.

## The worked example: $99,500 on one funder

The funding schedule in the workbook had seven rows carrying an amount, a receipt month and a
stage. None of them said what the money was for.

With no job on a dollar, Tim Fairfax's year-one $100,000 was counted against beds and against
operating at the same time, and $99,500 of the error came from that single line. Katie Norman's
invitation of 31 August names the resilience of organisations, so that money sits on the operating
line alone and nowhere else.

The fix is a job column with four values: plant, beds, facilitation, operating. A funder may then
appear twice only when the split is deliberate, the way Brian M. Davis does with $60,000 for beds
and $40,000 for facilitation out of one $100,000 invitation.

## Freight is the swing

Freight is $150 a bed all up, a factory leg and a community leg. Every invoice so far has put it on
the buyer or absorbed it: Mala'la's shipping was quoted at $3,200 on its own line and discounted in
full on a $4,940 bed order, which is why freight is now a line of its own charged at cost.

If Goods carries freight on 400 beds that is $60,000, and everything downstream moves with it. The
contribution falls from a provisional $474 to a provisional $324. The year needs $807,950 instead
of $747,950. Who carries
freight from year two is on the list of open questions in `three-year-plan.ts`, and it is the one
open question that moves the answer by a whole plant.

## Break-even, and why 628 is provisional

Divide $297,550 of running cost by the provisional $474 a bed contributes and the answer is a
provisional 628 paid beds a year. That is the number where trade carries the organisation and a
grant stops keeping the lights on. Year one plans 400, and the distance between 400 and that
provisional 628 is what the grant covers.

628 inherits every caveat on the $474 it comes from. The contribution is provisional until the leg
panel yield is counted, so break-even is provisional too, and any sentence printing 628 says so.

Freight moves it as well. At the provisional $324 contribution the same running cost needs a
provisional 918 paid beds a year. The workbook figure of 796 is wrong and should not be reused.

## The lines behave differently, which is why they are never pooled

Plant money is the one line where the ask and the cost are the same number. A plant costs $150,000
and a plant grant brings $150,000, so a plant either happens or it does not and it never leaves a
hole. Adding a third plant moves both sides by the same amount, which is why the Commonwealth's
approved Alice Springs money builds capacity without closing any gap.

Facilitation is close to cost neutral. It bills at $10,000 a community and costs about that to
deliver, and $50,000 net has already been billed and settled across ten visits, so it is a price
buyers have tested. Counting it as income without its cost would repeat the mistake that produced
$937,550.

The gap lives in the two hardest lines to raise against. $600,000 is asked across five lines, $0 is
secured, and the gap is $147,950. In beds, 187 of the 400 are unfunded, which is $140,250 of stock
and, at the provisional contribution, about $88,638 of running cost as well. Bed money is the
cheapest way to fund the organisation and the only ask with a product at the end of it.

One capital item sits outside all of it. The second press is about $22,500, quoted by nobody and in
no ask, and it decides whether the 400 beds land in June or August.

## What settles the provisional figures

Three answers close most of this. Nic counts leg kits per purchased panel from the INV-2021 cutting
evidence, which converts the making allowance into a cost. Ben names the site for the second
Commonwealth $150,000, which is worth $147,950 depending on whether it lands on a QBE site. A
ruling on who carries freight from year two chooses between a provisional 628 and a provisional 918.

Related: [[capital/what-may-be-claimed]] · [[trade/what-has-been-bought]] · [[capital/the-blockers]] ·
[[capital/what-we-no-longer-say]] · [[capital/cost-register]] · [[investors/tim-fairfax]]
