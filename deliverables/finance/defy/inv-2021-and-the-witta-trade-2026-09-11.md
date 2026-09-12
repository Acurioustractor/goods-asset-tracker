# Defy INV-2021, and what it is worth against making it at Witta

Read 11 September 2026 off the invoice. Guarded in `v2/src/lib/data/defy-supply.ts`, 9 tests.

## ⚠ Withdrawn on 12 September 2026

Ben ruled the route on 12 September: press the tab sheets at Witta, buy the leg sheets, dispatch
flat-packed kits to community, and run a programme where young people and others assemble and
distribute them. The factory's job ends at dispatch.

This paper was written the day before, on the retired route where a bed took two pressed sheets and
Witta assembled it. Everything that hangs off "two panels a bed" is withdrawn.

| Withdrawn | Why |
|---|---|
| **$254.45 of plastic a bed**, and the **37 beds** this invoice was said to cover | A kit takes one pressed tab sheet and bought legs. How many complete leg sets come off an 800 by 1200 panel is unknown: `BOUGHT_LEG_PANEL_YIELD` is null in `production-route.ts`, and Nic owns that number |
| **$89.60 a bed** that panels beat the finished kit by, and **$35,840** across the 400 | Both sides of that subtraction needed the yield |
| **67 sheets for ALIVE's 100** and **267 sheets for the 400**, with their costs | Sheet counts were derived from two panels a bed |
| **$199 a bed** panel premium and the **113 beds** that paid a second press back | It priced bought panels against pressing legs here, which is not the route |
| **2 extra beds a day** from buying panels, and the margin on them | Leg panels and tab sheets are parts of the same kit, so panels add no kits |
| **$276 of making** | Canon labels `bed.make` a legacy making allowance. Any sentence printing 276, 474, 628 or 919 carries the word provisional |
| **$3.16 a kilogram** shred break-even | Computed for the old route |
| **36 kg of shred a bed** | Now 15 kg of tab shred a kit, itself a planning input Ben set on 9 September that has still to be weighed |
| **3 beds a day, 48 a month, 8.3 months for the 400, 14.4 tonnes** | The line is 6 kits a day, 96 a month, 4.17 months for the 400, and 6.0 tonnes of tab shred |

What the ruling does not touch: the invoice itself, the parent order and the 80 sheets still to
come, the production slot, the shred running out on 18 September, and the two quotes nobody has
opened. Those stand as read.

## The invoice

Defy Manufacturing Pty Limited to A Curious Tractor, issued 11 September, due 18 September.
Work commences after payment.

| Line | Qty | Each | Amount |
|---|---|---|---|
| 100% recycled HDPE panel, 19mm Jungle Mix, 1200 x 2400, less 20% scale discount | 25 | $356.88 | $8,922.00 |
| Cutting into 800 x 1200 panels | 25 | $20.00 | $500.00 |
| Palletising, 1200 x 1200 | 2 | $60.00 | $120.00 |
| Subtotal | | | $9,542.00 |
| GST | | | $954.20 |
| **Total** | | | **$10,496.20** |

The 20% discount is worth $2,230.50 and is given for scale. That makes it a rate to defend on the
next order.

## The 105 in the reference, resolved

It counts **sheets**. Nic asked Sam Davies on 26 August for "another 105 sheets and 8 bulka
bags". This invoice is 25 of the 105, so **80 sheets are still to come**. Sam's covering
note calls it "another 25 panels", using panel and sheet interchangeably, which is where the
confusion came from.

**The deposit date has passed.** Sam wrote on 27 August that the order had to be confirmed and
deposits paid by **4 September** to hold the production slot, then on 28 August held it for seven
more days. Both quotes, QU0494 and QU0495, complete **late October to early November**, and Xanthe
Mitchell, who runs panel operations, had still to confirm the timing. Ask whether the slot stands.

## ⚠ The shred runs out on the day this invoice falls due

Nic told Defy on 28 August that Witta burns about **450 kg of shred a week** and had **three weeks
of stock**. Three weeks from 28 August is **18 September**, which is the due date on this invoice.

The old reading of that burn, 12.5 beds a week at 36 kg a bed with the press near flat out at three
a day, goes with the route. At the current planning mass of 15 kg of tab shred a kit, 450 kg is
about 30 kits a week, and that mass has never been weighed. Read the date as the hard fact and both
conversions as provisional.

Either way the eight bulka bags in the parent order are not optional. Eight bags at about a tonne
each is 8 tonnes, which is about **eighteen weeks** at the observed burn.

## What it buys

| | |
|---|---|
| Cost of a sheet, all up | $381.68 |
| Cost of a cut panel | $127.23 |
| Mass of a cut panel | about 17.3 kg |
| Cut panels on this invoice | 75 |
| Complete leg sets a panel yields | **not confirmed**, Nic to establish |
| **Plastic cost a bed** | **cannot be stated until the yield is confirmed** |
| **Beds this invoice covers** | **cannot be stated until the yield is confirmed** |

Three cut panels come out of a sheet, and the masses agree: 17.3 kg by three is the 52 kg sheet.
Panel dimensions establish panel mass and nothing else. The old inference that a bed takes two
panels came from matching 34.7 kg against the 36 kg the press was said to put through for one bed,
and both halves of that comparison have gone.

## Where the leg plastic comes from now

These are not three ways to get a whole bed. Legs are bought, tabs are pressed here, and both
belong to the same flat-packed kit. The prices below are supplier leg prices only, with tabs and
the other bed parts on top.

| Path | Leg cost a bed | Kits a day | Limited by |
|---|---|---|---|
| Finished leg kit from Defy | $344.05, verified on INV-1602 and INV-1732 | 6 | Tab press |
| **Leg panels from Defy, routed at Witta** | panel price proven at **$127.23**; a kit's share needs the yield | 6 | Tab press |
| Tab production inside the same route | not a leg cost at all | 6 | Tab press |

The $344.05 is reconciled exactly. Defy's INV-1602 of 30 January 2026 bills $33,588.60 net, which
is 92 leg kits at $344.05 plus 16 made from previously ordered sheets at $121 each. Both figures in
the repo are right, and that invoice contains both.

**The $40 to $55 of raw plastic is withdrawn as a path cost.** It was modelled for the route where
Witta pressed the legs, so it is not the cost of bought legs plus pressed tabs. The current route
needs its own bill of materials before any per-kit plastic figure goes in front of anyone.

## Bought panels do not add kits

Witta is pressing tabs and burning shred. Bought leg panels go alongside that, and they release the
press from leg work, which is the point of buying them. They do not lift the number of kits that
leaves the door, because the press sets that at 6 a day and every kit needs a tab sheet.

Extra panels can cover a supply shortage. They cannot be counted as extra finished kits above what
the tab press dispatches, and the marginal-beds table that used to sit here goes with the old
assembly ceiling.

## What the run costs

| | Sheets | Plastic cost, ex GST |
|---|---|---|
| This invoice | 25 | $9,542 |
| ALIVE's 100, due November | needs the yield | needs the yield |
| The 400 of first stock | needs the yield | needs the yield |
| The 400 as finished leg kits from Defy | | $137,620, legs only |

## Speed, on the one route we now have

| | |
|---|---|
| Kits a month at the tab press | 96 |
| The 400 takes | 4.17 months |
| Router ceiling, kits a month | 136 |

At 16 run days a month under the 80% availability ruling, 6 tab sheets a day and one a kit. Buying
the legs is what keeps the press on tabs. Assembly no longer happens in the factory, so it sets no
ceiling here at all.

## The second press

A second press costs about $22,500 and would take tab pressing toward the router ceiling of 8.56
kits a day, 136 a month. The panel premium and the 113-bed payback are withdrawn with the route
they were computed on.

**The catch is still feedstock.** 400 tab sheets at the 15 kg planning mass is **6.0 tonnes**, about
six bulka bags, and bought leg material sits on top of that. A second press only helps if there is
shred to feed it, and at 450 kg a week eight bulka bags is eighteen weeks of stock. Recovery is not
credited anywhere and collection is costed nowhere in the raise.

## One more thing to check

`supplier-quotes.ts` carries a Defy quote of **$35 for a 1200 x 600 x 18mm sheet**, which is
$2.84 a kilogram. This invoice works out at **$6.87 a kilogram**. That is 2.4 times more, for a
sheet one millimetre thicker.

The old quote has no invoice behind it and is described as base material for future products, so
it may be a different grade or an aspirational number. Worth putting to Sam Davies, because on an
order the size of the 105 the gap is large enough to matter.

## What to ask Defy now

1. Confirm the remaining 80 sheets of the 105, and whether the production slot still stands. The
   4 September deposit date has passed.
2. **Confirm how many complete leg sets come from one 800 by 1200 panel.** Every per-kit plastic
   figure in this paper is blocked on that one answer.
3. Confirm current shred prices, and the quantities and timing on QU0494 and QU0495.
4. Confirm what the finished leg-kit price of $344.05 includes. Factory tabs and the other bed parts
   are separate.
5. The price per kilogram, against the $2.84 in the standing sheet quote.
6. Whether the 20% scale discount holds on the full 105.

## The parent order, priced

| | Sheets or bags | What it carries | Cost, ex GST |
|---|---|---|---|
| 105 sheets | 105 | 315 cut panels; kits **needs the yield** | about $40,100 |
| 8 bulka bags of shred | 8 | about 533 tab sheets at the 15 kg planning mass, provisional | **unpriced here, needs the shred invoice** |

The old closing line, that the parent order and the first-stock run are the same thing at 379 beds
split forty percent bought and sixty percent pressed, rested on two panels a bed. It cannot be
restated until the leg yield is confirmed.

## What is still missing from this analysis

1. **The leg yield.** How many complete leg sets come off an 800 by 1200 panel. Nic owns it, and
   until it lands the cost of a bed on this route cannot be stated.
2. **Quote QU0494 and Quote QU0495**, attached to Sam's email of 27 August. They price the 105
   sheets and the 8 bulka bags, and without them the shred half of the order has no number.
3. **The shred invoice** attached on 28 August, which would give the cost a kilogram.
4. Three Defy bills were paid in August 2026, on the 9th at $2,914.34, the 14th at $16,670.20 and
   the 30th at $8,608.51. Every line description in Xero reads "." so none of them says what it
   bought. One of them is probably the coloured shreds order from early August.

Get the yield from Nic, drop the two quotes and the shred invoice in, and the whole end-of-year
Defy position can be costed.
