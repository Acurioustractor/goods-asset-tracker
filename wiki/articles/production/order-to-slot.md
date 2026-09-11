---
reviewed: 2026-09-12
ruling: Ben 12 Sep 2026 · the flat-pack route · tab sheets pressed at Witta · leg sheets bought · flat-packed kits dispatched for young people and others to assemble in community
canon: [trade.bedsPaid, bed.price, line.pressPerDay, line.pressedSheetsPerKit, line.runDaysPerMonth, line.bedsPerMonth, line.cncPerDay, line.bedsPerMonthLifted, line.wittaPerYear, line.bulkaBagKg, bed.pressedKg, bed.costStatus, plastic.kitsPerPanel]
sources: [v2/src/lib/data/production-route.ts:1-32, v2/src/lib/data/production-scenarios.ts:15-100, v2/src/lib/data/demand-and-buyers.ts:366-460, v2/src/lib/data/defy-supply.ts:19-75, v2/src/app/admin/production/page.tsx:20-52 and 102-110, v2/src/lib/data/bed-owners.ts:1-22, Supabase cwsyhpiuepvdjtxaozwf tables production_shifts + production_inventory + production_journal + crm_deals + assets + order_items + orders read 12 Sep 2026]
---

# Order to slot

> Centrecorp paid for 167 beds. 147 of them are in households and 20 are made and waiting at Alice
> Springs, and settling that took a person reading two invoices against two batches in the register
> by hand. Nothing in the system holds the join. A paid order carries a Xero invoice number and no
> batch. A made bed carries its batch inside its own id and no order. The same reconciliation would
> be done the same way again tomorrow. What is owed is a path where a committed order of kits
> becomes press days, run days, shred kilograms and bought leg panels with a date on them. Two
> things have to exist first: a foreign key from a paid order to a made bed, and a shift log that
> somebody is filling in.

## What a committed order does today

320 beds have been bought and paid for by four organisations across five settled invoices. Each
order was quoted by hand, made against somebody's memory of what was promised, delivered, and
reconciled by hand months later. The quoting, the making and the delivering all happened. The join
between them lives in a head.

Read the columns and the gap is plain. `crm_deals` holds the institutional orders: title, units,
amount in cents, maker, delivery status, and `xero_invoice_number`. It has no batch column and no
asset column. The `assets` register holds the beds: `unique_id`, product, community, status,
quantity, household fields. It has no order column and no invoice column. The batch is not a column
anywhere. It lives inside the id string, so `GB0-156-40` is unit 40 of batch 156, and the
/admin/production page recovers it with a regular expression over `unique_id`.

The retail path has the column and nothing in it. `order_items.asset_id` exists, the table holds 31
rows, and not one of them carries an asset id. One of those rows is the one real outside customer,
a single Stretch Bed at $750 paid on 8 September and still unshipped. That order points at no bed.

## The reconciliation that had to be done by hand

Three Centrecorp numbers were in circulation until 11 September: 167 on the invoices, 147 in the
register, 130 on a deck slide. Closing that took reading INV-0259 against batch GB0-148, which is
60 units all deployed at Utopia Homelands, and INV-0291 against batch GB0-156, which is 107 units
split 79 deployed at Utopia, 8 deployed at Alice Springs and 20 made and waiting there.

Two traps sat inside it. Utopia's community total is also 147 and it is a different 147, because it
holds 8 Stretch Beds from batch GB0-152 that Centrecorp never paid for. And the 130 is quote
QU-0014 from May 2026, which was never paid. Neither trap is visible from a single table. Both were
caught by a person holding two documents side by side.

The result is settled and Centrecorp's beds are delivered, so they are never counted as demand
again. The method is what has not changed.

## What a slot would say

Take the largest bed order settled so far, the 100 Stretch Beds ALIVE bought on INV-0342. A
production slot for that order would print six lines, and every input for five of them already
exists in a guarded module.

Press days. 1 pressed tab sheet per kit, and the press does 6 sheets on a productive day, so 100
kits is about 17 press days.

Run days. 16 run days a month, being 20 planning days at 80% availability, which puts the factory
at 96 kits a month. A 100-kit order is a month and a few days of the whole line. The router will
take 8.56 kits a day if it is fed, so the ceiling with a second press is 136 kits a month, and the
modelled year at Witta is 1,152 kits.

Shred. 15 kg of tab shred per dispatched kit, so 1,500 kg for this order, which is one and a half
bulka bags if a bag is the 1,000 kg the modules carry, and two and a half if it is the 600 kg the
Defy invoices name. Which one is right is unsettled, and [[production/supply-and-defy]] holds it
open. Witta burns about 450 kg a week, and the stock Nic counted on 28 August runs out on
18 September.

Bought leg panels. This is the line that cannot be filled today. Canon's value for leg kits per
purchased panel reads "Needs panel yield", because nobody has cut and counted an 800 by 1200 panel
into leg sets. Defy invoice INV-2021 already delivered 25 sheets of the 105 Nic ordered on
26 August, so the evidence is on the floor. Nic owns the count.

Cost. The cost of the order is provisional while that yield is open. Canon's status line for the
current route reads "Provisional: bought legs and tab production need costing", and any slot that
prints a dollar figure prints that word beside it.

A date. Kits a month against the week the buyer was promised. That line is the point of the whole
exercise, and it is the one nobody can produce from a table today.

## What has to exist

**A foreign key from a paid order to a made bed.** Two ends, and both are small. On the retail
side, populate `order_items.asset_id` when a bed is allocated, since the column is already there.
On the institutional side, give `crm_deals` a batch and let a batch hold many orders, because
GB0-156 served one invoice and GB0-152 served none. Then the Centrecorp question is a join and not
a fortnight of reading.

**A restarted shift log.** /admin/production is built and the tables behind it are real. They hold
19 shifts, dated between 4 February and 12 March 2026, 16 of which were entered in a single
backfill on 14 March. There is one inventory count, 27 March, recording 60 kg of raw plastic. The
production journal has no entries at all. So the log is six months stale and it is not empty, which
is a much easier thing to fix. Six sheets a day and 28 kg of shred on 12 March are real numbers
from a real day, recorded by Ben, and they are the shape of what the line needs to keep recording.

Together those two give the third thing: paid hours against completed beds, which is the only
honest way back to a measured cost per bed and the replacement for the withdrawn labour estimates
in [[production/what-a-funder-sees]].

## Why this sits next to the money

QBE asks what the money makes and when. Brian M. Davis splits its $100,000 invitation into beds and
facilitation, so it will ask which beds. A slot that names press days, shred and a dispatch week is
the difference between answering from a record and answering from memory. The modules already carry
every rate the slot needs. What is missing is the key that ties a buyer's money to a bed somebody
sleeps on.

Related: [[production/the-flat-pack-route]] · [[production/capacity-and-the-line]] ·
[[production/instruments-and-jobs]] · [[production/what-a-funder-sees]] · [[capital/the-money-model]] ·
[[capital/cost-register]] · [[products/stretch-bed]]
