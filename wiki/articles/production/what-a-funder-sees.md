---
reviewed: 2026-09-12
ruling: Ben 12 Sep 2026 · the flat-pack route · with the standing claim ceiling of 18 Jun 2026 that scabies to rheumatic heart disease is the reason and never a measured outcome
canon: [trade.bedsPaid, trade.paidNet, bed.price, bed.contribution, bed.pressedKg, bed.costStatus, plastic.kitPerBed, plant.allowance, year.beds]
sources: [v2/src/lib/data/impact-model.ts:70-90 and 219-320 and 420-520, v2/src/lib/data/asset-canonical.ts:33, v2/src/lib/data/community-economics.ts:60-115, v2/src/lib/data/demand-and-buyers.ts:366-460, v2/src/lib/data/bed-need-and-order.ts:200-235, v2/src/lib/data/capital-stack-flex.ts:228-245, v2/src/app/admin/production/page.tsx:20-52, Supabase cwsyhpiuepvdjtxaozwf tables crm_deals + assets + order_items read 12 Sep 2026]
---

# What a funder sees

> A funder gives money for a job. The honest answer to what it made runs ask · job · slot · kit ·
> batch · community · a bed somebody sleeps on. Seven steps, and the chain breaks at two of them
> today: an order does not link to an asset, and a deal does not link to a batch. Everything either
> side of those two breaks already exists in a table. One measure at the end is verified, being a
> person off the floor counted from the register, and three are modelled: paid making hours,
> plastic diverted, and money kept in community. Health sits underneath all of it as the reason and
> carries no number.

## The trace that is owed

A QBE plant grant of $150,000 should be followable to a building, a crew and a run. A Brian M.
Davis grant for 80 beds should be followable to 80 kits, the weeks they were pressed, the truck
they went on and the households they reached. The chain has seven links:

1. **The ask.** The amount and the funder, which the raise already holds.
2. **The job.** Plant, beds, facilitation or operating, typed in `capital-stack-flex.ts`.
3. **The slot.** Press days, run days, shred and bought leg panels with a date, which does not exist
   yet and is described in [[production/order-to-slot]].
4. **The kit.** A flat-packed bed dispatched from Witta, 15 kg of pressed tab shred in it.
5. **The batch.** The run it came from, which lives inside the asset id as `GB0-156-40`.
6. **The community.** Where the kit went, who assembled it, who was paid for that work.
7. **The bed.** A row in the register with a community, a status and a household beside it.

## Where it breaks, twice

**An order does not link to an asset.** `crm_deals` carries units, an amount, a delivery status and
a Xero invoice number, and nothing that points at a bed. The retail path has the column and it is
empty: `order_items.asset_id` exists across 31 rows and every one of them is null, including the
row behind the one outside customer who paid $750 on 8 September.

**A deal does not link to a batch.** The batch is not a column in either table. It is recovered from
the asset id with a regular expression, so the only way to answer which beds a buyer's money made is
to read invoices against batches by hand. That is how the Centrecorp answer was reached on
11 September: 167 beds paid for, 147 deployed, 20 made and waiting at Alice Springs.

320 beds have been bought and paid for across five settled invoices worth $247,770 net of GST, and
no query connects any of that money to the beds it made. Both breaks are a column and a backfill, and neither needs new
architecture.

## The measure that is verified

A person off the floor, counted from the register. `beds-delivered` is graded verified in
`impact-model.ts` because it reads rows in the `assets` table, and the canonical rollup holds 540
beds deployed across eleven communities. Utopia is 147 confirmed. Maningrida has 8 washing machines.
Those are counts of objects in places, checkable one row at a time, and the register is the
strongest evidence Goods holds.

It counts beds and not people, and the four-question household count in `bed-need-and-order.ts` is
what would turn it into a count of people: how many sleep here, how many have a bed of their own,
how many sleep on the floor, and who would use a new bed first. No community has done that count.
Ben's rule stands that it is done by a local person who is paid for the work, the household register
stays with the community organisation, and Goods receives a total and a delivery list.

## The three that are modelled

**Paid making hours.** Two hours a bed, Ben's ruling of 10 September, graded modelled in the code
because no bed has been time-studied. The seven-stage table that carried 6.5 hours is withdrawn and
kept visible so nothing sums it back in. A measured figure needs paid hours against completed beds,
which is the shift log in [[production/order-to-slot]], stale since March.

**Plastic diverted.** Computed as Stretch Beds times 20 kg of HDPE, graded modelled, and the
canonical rollup carries 3,540 kg on that basis. The factory side of it now has its own figure: 15
kg of tab shred per dispatched kit under the flat-pack route, since the legs are bought sheets and
the press only does tabs.

**Money kept in community.** The price model says a bed sold at $750 hands a provisional $474 to the
organisation that makes the next one, and the community economics ladder prices each step a
community could hold: $40 of shred, $344.05 for a finished leg kit cut and edged, $400 for an
assembled bed, $750 for a bed sold locally. Every rung is what Goods already pays Defy today, from a
named invoice. The rule is settled and the trading enterprise behind it is not: zero community
enterprises are trading yet, and that is what this year changes. The figures also carry their own
banner, which is that nothing on the ladder has been offered to any community, and no community sees
a price for its own pathway before somebody has walked them through it in person. Community
ownership stays a pathway.

## Health carries no number

Off-the-ground washable sleep sits inside the documented chain from scabies to rheumatic heart
disease, and that chain is why a bed and a washing machine are health hardware. It is the reason for
the work and it is never a measured outcome. The modelled sleep-nights proxy was removed from the
impact model in June for claiming an outcome the evidence cannot carry, and a health figure returns
only when a clinical partner produces one and it is attributed to them.

## What a report would say once the two links exist

For QBE, at the end of a funded year: your $150,000 built the plant at the named site, its first
run was batch GB0-nnn, those kits were pressed over these weeks, assembled by these young people,
and they are in these households in this community, which the register can show you row by row.

For Brian M. Davis: your 80 beds are these 80 rows. Their making was paid at the provisional cost
that canon still marks "Provisional: bought legs and tab production need costing", and here is the
cutting evidence that settled it.

Neither sentence is writable today, and neither is far away. Populate `order_items.asset_id`, give
an order a batch, and restart the shift log. The 400 beds of first stock this year are the run that
proves whether the trace holds under load.

Related: [[production/order-to-slot]] · [[production/instruments-and-jobs]] ·
[[production/the-flat-pack-route]] · [[impact/metrics-tracked]] · [[impact/theory-of-change]] ·
[[capital/the-money-model]] · [[communities/alice-springs-oonchiumpa]]
