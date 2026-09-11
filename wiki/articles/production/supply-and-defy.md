---
reviewed: 2026-09-12
ruling: Ben, 12 September 2026, buy the leg sheets and press only the tab sheets at Witta
canon: [plastic.panelEach, plastic.kitsPerPanel, plastic.kitPerBed, plastic.breakEvenShred, line.bulkaBagKg, bed.pressedKg, plant.secondPress]
sources: [v2/src/lib/data/defy-supply.ts:19-201, v2/src/lib/data/production-route.ts:12-23, v2/src/lib/data/production-scenarios.ts:29-51, deliverables/finance/goods-financial-plan/DEFY-ORDERS-2026-09-09.md, deliverables/finance/defy/inv-2021-and-the-witta-trade-2026-09-11.md]
---

# Supply and Defy

> Defy Manufacturing supplies the plastic the flat-pack route is built on, and the clock on that supply is tighter than anything in the factory. INV-2021 is $10,496.20 including GST and falls due on 18 September. It covers 25 sheets of the 105 Nic asked Sam Davies for on 26 August, so 80 sheets are still to come. The same 18 September is the day Witta's shred runs out on Nic's own figure of 450 kg a week. The two quotes that carry the shred price, QU0494 and QU0495, have not been opened, and that single fact is what holds up the press decision. One more thing is unresolved underneath all of it: the guarded modules size a bulka bag at 1,000 kg and the Defy invoices name 600 kg bags, and nobody has settled which is right.

## INV-2021, read off the invoice

| | |
|---|---|
| Supplier | Defy Manufacturing Pty Limited, ABN 48 644 178 423 |
| Billed to | A Curious Tractor |
| Reference | 105 x 19mm Panels |
| Issued | 11 September 2026 |
| Due | 18 September 2026 |
| Sheets | 25, at 1200 by 2400 by 19 mm |
| List price a sheet | $446.10 |
| Scale discount | 20%, worth $2,230.50 |
| Net price a sheet | $356.88, so a panel line of $8,922 |
| Cutting | to 800 by 1200 at $20 a sheet, $500 |
| Pallets | 2 at $60, $120 |
| Subtotal | $9,542 |
| GST | $954.20 |
| **Total** | **$10,496.20** |
| Terms | Work commences after receipt of payment. Card payments carry a 1.7% Stripe fee. |

Read from `defy-supply.ts:19-44`. A 1200 by 2400 sheet cuts into three 800 by 1200 panels, so the delivery is 75 panels and each one costs $127.23 ex GST all in (`defy-supply.ts:47-50, 104-105`).

What that does not establish is leg yield. `plastic.kitsPerPanel` reads "Needs panel yield", and the earlier two-panels-a-bed inference is withdrawn, because panel dimensions give panel mass and say nothing about how many complete leg sets a cutter gets out of one (`defy-supply.ts:94-98`). Until Nic counts it, the cost of a kit stays provisional and `plastic.breakEvenShred` stays at "Needs route costing". See [[the-flat-pack-route]], and [[capital/what-we-no-longer-say]] for the retired panel arithmetic.

## The 105, and why it read as panels

The 105 counts sheets. Nic asked Sam Davies on 26 August 2026 for "another 105 sheets and 8 bulka bags", so this invoice is 25 of that parent order and **80 sheets are still to come** (`defy-supply.ts:58-63`).

Sam's covering note calls it "another 25 panels". He uses panel and sheet interchangeably, which is where the confusion came from, and it is worth saying out loud in any conversation about the remaining 80, because 80 sheets and 80 panels differ by a factor of three.

## The production slot, which may already have gone

Sam wrote on 27 August that Defy needed the order confirmed and the deposits paid by **4 September** to hold the production slot, then held it seven more days from 28 August. Both quotes complete **late October to early November**. Xanthe Mitchell runs panel operations and had still to confirm the timing (`defy-supply.ts:65-67`).

The 4 September date has passed. Whether the slot stands is the first question to ask.

## The shred runs out on the day the invoice falls due

Nic told Defy on 28 August that Witta burns about **450 kg of shred a week** and had **three weeks of stock**. Three weeks from 28 August is **18 September**, which is the due date on INV-2021 (`defy-supply.ts:69-75`).

Each dispatched kit sends 15 kg through the press as tab sheet, so the burn rate and the press rate move together. There is no shred order placed behind the eight bulka bags in the parent order, because the two quotes that price them have not been opened.

## QU0494 and QU0495 are unopened, and that is the blocker

Both quotes were attached to Sam's email of 27 August. They carry the shred price for the eight bulka bags. Neither has been opened, and the shred invoice attached on 28 August, which would give a cost a kilogram, is not in the repo either (`deliverables/finance/defy/inv-2021-and-the-witta-trade-2026-09-11.md`).

Nothing else can move until they are. Comparing a $22,500 second press against buying more leg panels needs a current price a kilogram on one side of the sum, and there is no current price a kilogram. That is the whole of the press decision, and it is waiting on two unopened attachments. Owner: Ben or Nic. See [[the-second-press]].

## A bulka bag is 1,000 kg in the modules and 600 kg on the invoices

This is unresolved and is written here so nobody quietly picks a side.

- `line.bulkaBagKg` is **1,000 kg**, set in `production-scenarios.ts:29` and `defy-supply.ts:78`, where the comment traces it to a reckoning of 21 bags for 22,680 kg.
- The Defy order review of 9 September reads INV-1940 as "3 x 600 kg bags jungle shred at $1.80/kg", and its price table lists "Jungle mix shred, bulka bag **600 kg**" against INV-1731, QU0467 and INV-1940 (`deliverables/finance/goods-financial-plan/DEFY-ORDERS-2026-09-09.md:16, 46`).

The gap is a factor of 1.67 and it lands on three live numbers. Eight bags in the parent order is either 8,000 kg or 4,800 kg. At 450 kg a week that is either 17.8 weeks of cover or 10.7. At 15 kg a kit it is either 533 kits of tab pressing or 320.

Settling it needs a weighbridge docket or a packing slip, and the shred invoice of 28 August would probably do it. Until then, say the range and its source.

## The other supply path, still open

Defy can supply finished leg kits instead of raw panels. The kit price is **$344.05 a kit**, verified on INV-1602 and INV-1732 (`defy-supply.ts:108-109`). That is scenario E in `production-scenarios.ts:49-50`: Defy supplies the legs finished, Witta still presses the tab sheet, and the kit still goes out flat for assembly in community.

The kit price covers supplier legs alone. Factory tab production and the other bed parts sit outside it, so it is never a complete kit cost.

## What to ask Defy now

From `defy-supply.ts:196-201`:

1. Confirm the remaining 80 sheets of the 105 and the current production slot.
2. Confirm how many complete leg sets come from one 800 by 1200 panel.
3. Confirm current shred prices and the quantities and timing on QU0494 and QU0495.
4. Confirm what the finished leg-kit price includes, because factory tabs and the other bed parts stay separate.

## Related

[[the-flat-pack-route]] · [[capacity-and-the-line]] · [[the-second-press]] · [[capital/cost-register]]

## Sources

- `v2/src/lib/data/defy-supply.ts` lines 19 to 201. INV-2021, the parent order, the slot terms, the shred clock, the supply paths.
- `v2/src/lib/data/production-route.ts` lines 12 to 23. Tab shred a kit, panel yield status, shred break-even status.
- `v2/src/lib/data/production-scenarios.ts` lines 29 to 51. The bulka bag constant and the five scenarios.
- `deliverables/finance/goods-financial-plan/DEFY-ORDERS-2026-09-09.md`. Defy order history and the 600 kg bag readings.
- `deliverables/finance/defy/inv-2021-and-the-witta-trade-2026-09-11.md`. The 11 September read of the invoice and the three missing documents. Its panel-premium and press-payback arithmetic is superseded by the 12 September route ruling.
