---
reviewed: 2026-09-12
ruling: Ben, 12 Sep 2026, the flat-pack route: press the tab sheets only at Witta, buy the leg sheets, dispatch flat-packed kits, and assemble in community; with the architecture ruling that the guarded modules are the core and the workbook is a view of them
canon: [line.pressPerDay, line.runDaysPerMonth, line.bedsPerMonth, line.wittaPerYear, line.bedsPerMonthLifted, bed.pressedKg, plant.secondPress]
sources: [v2/src/lib/data/production-route.ts, v2/src/lib/data/production-scenarios.ts, v2/src/lib/data/defy-supply.ts, v2/src/lib/data/capital-stack-flex.ts, v2/src/lib/data/sheet-canon.ts, wiki/articles/production/the-flat-pack-route.md, wiki/articles/production/capacity-and-the-line.md, wiki/articles/production/supply-and-defy.md, wiki/articles/production/the-second-press.md, wiki/articles/production/order-to-slot.md, wiki/articles/production/what-a-funder-sees.md, wiki/articles/production/instruments-and-jobs.md, tools/sheet-canon.mjs, tools/check-wiki-canon.mjs]
---

# Production

> The guarded modules in `v2/src/lib/data/` are the core, and every other surface is a view of them: the live Google workbook, the deck, the admin pages, the application answers and these seven articles. A rate changes by changing the module, running its guards and pushing. Under that rule sits Ben's route ruling of 12 September 2026: Witta presses the tab sheets and nothing else, the leg sheets are bought, kits go out flat-packed, and young people and others assemble and distribute them in community. Factory capacity ends at dispatch.

## The architecture rule

The workbook cannot be the core. Nobody can run a test against it, and it had already drifted from
the modules in eleven places, one of them an availability cell still reading 100% four days after
Ben set 80%. A surface anybody can edit and nothing can check will drift again.

So figures flow one way. `v2/src/lib/data/sheet-canon.ts` holds the settled list, every value
imported from a guarded module and none retyped, and `tools/sheet-canon.mjs` pushes it into the
workbook and reads it back to report drift. `tools/check-wiki-canon.mjs` does the same job for
these articles: each one names the canon keys it prints, and it fails by name when the module
underneath moves. [[../program/where-the-raise-lives]] holds the full map of surfaces and owners.

One consequence to carry into every article here. The cost of a bed is provisional. Ben's route
buys the leg sheets in, and nobody has cut a bought 800 by 1200 panel and counted how many leg
sets come out of it. Nic owns that yield, from the cutting evidence on the 25 sheets already
invoiced. Until it lands, the making allowance, the contribution and the break-even derived from
them all say "provisional" in the sentence that prints them.

## What the line does today

6 kits a day, 16 run days a month at 80% availability, 96 kits a month and 1,152 a year. Each
dispatched kit carries 15 kg of tab shred. The router will take more than the press can feed it,
so a second press lifts the modelled line to 136 kits a month for $22,500 that sits in no ask.

## Articles in this folder

- [[the-flat-pack-route]]: the ruling itself, what it changes at the factory and in community, and why it takes the cost of a bed back to provisional.
- [[capacity-and-the-line]]: what the line can make, which constraint binds, and which of those rates are measured and which are planning assumptions.
- [[supply-and-defy]]: the Defy invoice due 18 September, the 80 sheets still to come, the day the shred runs out, and the two unopened quotes holding the press decision.
- [[the-second-press]]: what $22,500 buys, why a loan suits it, and why every near-term bed still comes off the one press at Witta.
- [[order-to-slot]]: the missing join between a paid order and a made bed, and the hand reconciliation standing in for it.
- [[what-a-funder-sees]]: the seven steps from an ask to a bed somebody sleeps on, and the two places the chain breaks today.
- [[instruments-and-jobs]]: which instrument may pay for which job, and the rule the money model types around but does not yet state.

## Related

- [[../capital/the-money-model]]: the price, the two jobs a bed does, and the provisional halves
- [[../capital/capital-stack]]: what plant money buys, and why it never moves the gap
- [[../trade/price-and-freight]]: the price and freight side of the same bed
- [[../products/plant-design]]: the containerised plant a community plant is built from
