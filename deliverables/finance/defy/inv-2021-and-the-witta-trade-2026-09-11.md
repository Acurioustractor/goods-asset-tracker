# Defy INV-2021, and what it is worth against making it at Witta

Read 11 September 2026 off the invoice. Guarded in `v2/src/lib/data/defy-supply.ts`, 27 tests.

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

## ⚠ The reference does not match the lines

The reference reads **105 x 19mm Panels**. The lines bill 25 sheets of 1200 x 2400. Cut to
800 x 1200 that is exactly three panels a sheet with no offcut, so **75 panels, not 105**.

Ask Sam Davies whether 105 is a carried-over quote number or 30 panels are missing. At $127.23 a
panel the difference is $3,816.

## What it buys

| | |
|---|---|
| Cost of a sheet, all up | $381.68 |
| Cost of a cut panel | $127.23 |
| Mass of a cut panel | about 17.3 kg |
| Panels a bed takes | 2 |
| **Plastic cost a bed** | **$254.45** |
| **Beds this invoice covers** | **37**, with one panel spare |

Two panels weigh 34.7 kg against the 36 kg of shred the workbook says goes through the press for
one bed. The two agree, and the difference is the offcut the press figure counts and a cut panel
does not.

## The three ways to get the plastic

| Path | Plastic a bed | Beds a day | Limited by |
|---|---|---|---|
| Finished kit from Defy | $344.05, verified on INV-1602 and INV-1732 | 5 | Assembly at Witta |
| **Panels from Defy, routed at Witta** | **$254.45**, this invoice | 5 | Assembly at Witta |
| Pressed at Witta from our own shred | $40 to $55 of raw plastic, modelled | 3 | One press |

**Panels beat the finished kit by $89.60 a bed and cost nothing in speed.** The router handles 8.56
beds a day, so routing never becomes the constraint. Across the 400 that is $35,840 saved for the
same throughput. If we are buying from Defy at all, we should be buying panels.

**Treat the $40 to $55 as a floor.** It is raw plastic only, modelled, and no invoice carries it.
It excludes press time, power, the labour of shredding and the collection that puts feedstock in
the bag.

## What the run costs

| | Sheets | Plastic cost, ex GST |
|---|---|---|
| This invoice | 25 | $9,542 |
| ALIVE's 100, due November | 67 | about $25,600 |
| The 400 of first stock | 267 | about $101,900 |
| The 400 on finished kits instead | | $137,620 |

## Speed, which is the other half of the decision

| Path | Beds a month | The 400 takes |
|---|---|---|
| Panels from Defy | 80 | 5 months |
| Our own press | 48 | 8.3 months |

At 16 run days a month under the 80% availability ruling. Buying panels is what turns a
press-limited line into an assembly-limited one, and it is the difference between the 400 landing
in winter and landing in spring.

## The second press, priced against the panel premium

A second press costs about $22,500 and takes press capacity to six beds a day, at which point
assembly at five a day becomes the constraint and the line runs exactly as fast as the panel path.

| | |
|---|---|
| Panel premium over pressing our own, a bed | about $199 |
| Beds before a second press pays for itself | 113 |
| Panel premium across the 400 | about $79,800 |
| A second press | $22,500 |

**On money the press wins by a wide margin. On time the panels win, because they arrive next week
and a press has to be bought, installed and fed.**

**The catch is feedstock.** 400 beds pressed in house is 14.4 tonnes of shred, about 21 bulka bags,
and collection is costed nowhere in the raise. The panel path buys that problem away at a known
price. That is the real trade, and it is not obvious which way it goes.

## One more thing to check

`supplier-quotes.ts` carries a Defy quote of **$35 for a 1200 x 600 x 18mm sheet**, which is
$2.84 a kilogram. This invoice works out at **$6.87 a kilogram**. That is 2.4 times more, for a
sheet one millimetre thicker.

The old quote has no invoice behind it and is described as base material for future products, so
it may be a different grade or an aspirational number. Worth putting to Sam Davies, because on a
267-sheet order the gap is large enough to matter.

## What to ask Defy before the next order

1. Whether the 105 in the reference is a quote number or 30 missing panels.
2. Whether the 20% scale discount holds for a 267-sheet order, which is what the 400 needs.
3. The lead time on 267 sheets. The only lead time on record is 21 days on 50 kits.
4. Whether they will cut to the finished leg profile instead of 800 x 1200, and what that does to
   the $344.05 kit price. If profile cutting costs much less than the $89.60 gap, the kit path
   comes back into play.
5. The price per kilogram, against the $2.84 in the standing sheet quote.
