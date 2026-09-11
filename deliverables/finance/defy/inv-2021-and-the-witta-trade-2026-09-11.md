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

That burn rate is 12.5 beds a week at 36 kg a bed, which is the press running near flat out at
three a day. It also means the eight bulka bags in the parent order are not optional. Eight bags at
about a tonne each is 8 tonnes, or **222 beds of shred**, and about eighteen weeks of pressing.

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
| Finished kit from Defy | $344.05, verified on INV-1602 | 5 | Assembly at Witta |
| **Panels from Defy, routed at Witta** | **$254.45**, this invoice | 5 | Assembly at Witta |
| Pressed at Witta from our own shred | $40 to $55 of raw plastic, modelled | 3 | One press |

**Panels beat the finished kit by $89.60 a bed and cost nothing in speed.** The router handles 8.56
beds a day, so routing never becomes the constraint. Across the 400 that is $35,840 saved for the
same throughput. If we are buying from Defy at all, we should be buying panels.

The $344.05 is now reconciled exactly. Defy's INV-1602 of 30 January 2026 bills $33,588.60 net,
which is 92 beds at $344.05 plus 16 beds made from previously ordered sheets at $121 each. Both
figures in the repo are right, and that invoice contains both.

**Treat the $40 to $55 as a floor.** It is raw plastic only, modelled, and no invoice carries it.
It excludes press time, power, the labour of shredding and the collection that puts feedstock in
the bag.

## The correction that matters: panels add to the press

Witta is pressing today and burning 450 kg of shred a week. Bought panels do not replace that. They
go through the router alongside it and lift the line from the press ceiling of three beds a day to
the assembly ceiling of five.

**So the question to answer is whether the two beds a day that only bought panels can make are
worth what the panels cost.**

| | |
|---|---|
| Beds a day that exist only because panels were bought | 2 |
| Beds a month | 32 |
| Panels they need | about $8,142 |
| What they sell for | $24,000 |

Even if every other cost of those beds is the full $276 of making, they clear about $220 each. While
assembly has idle capacity, buying panels is a margin decision, and it is clearly positive.

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

**On money the press wins by a wide margin. On time and on feedstock the panels win, because they
arrive in weeks and need no shred at all.** A second press also only helps if there is shred to feed
it, and at 450 kg a week eight bulka bags is eighteen weeks of stock.

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

## What to ask Defy now

1. Confirm the remaining 80 sheets of the 105, and whether the production slot still stands. The
   4 September deposit date has passed.
2. Whether the 20% scale discount holds for a 267-sheet order, which is what the 400 needs.
3. The lead time on 267 sheets. The only lead time on record is 21 days on 50 kits.
4. Whether they will cut to the finished leg profile instead of 800 x 1200, and what that does to
   the $344.05 kit price. If profile cutting costs much less than the $89.60 gap, the kit path
   comes back into play.
5. The price per kilogram, against the $2.84 in the standing sheet quote.

## The parent order, priced

| | Sheets or bags | Beds it makes | Cost, ex GST |
|---|---|---|---|
| 105 sheets | 105 | 157 | about $40,100 |
| 8 bulka bags of shred | 8 | 222 | **unpriced here, needs the shred invoice** |
| **Together** | | **379** | |

Three hundred and seventy nine beds is close enough to the 400 of first stock that the end-of-year
Defy order and the first-stock run are the same thing, split roughly forty percent bought panels
and sixty percent our own pressing.

## What is still missing from this analysis

Three documents, none of them in the repo or the Downloads folder.

1. **Quote QU0494 and Quote QU0495**, attached to Sam's email of 27 August. They price the 105
   sheets and the 8 bulka bags, and without them the shred half of the order has no number.
2. **The shred invoice** attached on 28 August, which would give the cost a kilogram.
3. Three Defy bills were paid in August 2026, on the 9th at $2,914.34, the 14th at $16,670.20 and
   the 30th at $8,608.51. Every line description in Xero reads "." so none of them says what it
   bought. One of them is probably the coloured shreds order from early August.

Drop the two quotes and the shred invoice in and the whole end-of-year Defy position can be costed.
