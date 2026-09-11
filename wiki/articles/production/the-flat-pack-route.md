---
reviewed: 2026-09-12
ruling: Ben, 12 September 2026, press the tab sheets only, buy the leg sheets, and dispatch flat-packed kits for young people to assemble in community
canon: [line.pressSheetsPerDay, line.pressedSheetsPerKit, line.assemblyPerDay, bed.pressedKg, bed.costStatus, plastic.kitsPerPanel, plastic.panelEach, plastic.kitPerBed, plastic.breakEvenShred, bed.price, bed.make, bed.contribution, bed.freight, bed.contribution.goodsFreight, year.breakEvenBeds]
sources: [v2/src/lib/data/production-route.ts:1-32, v2/src/lib/data/production-scenarios.ts:1-100, v2/src/lib/data/defy-supply.ts:19-98, v2/src/lib/data/three-year-plan.ts:27-48, deliverables/qbe-stage2/codex-flatpack-route-receipt.md]
---

# The flat-pack route

> Ben ruled on 12 September 2026 that Witta presses the tab sheets and nothing else. The leg sheets are bought from Defy, cut, packed with the tabs and the rest of the kit, and dispatched flat. Young people and others assemble and distribute the beds in community. The factory's job ends at the loading dock, so assembly stops being an hour on a Queensland factory clock and becomes paid work in the place the bed lands. The ruling also takes the cost of a bed back to provisional, because nobody has counted how many leg sets come out of a bought 800 by 1200 panel. Until Nic reads the cutting evidence on the 25 sheets already invoiced, the $276 making allowance, the $474 contribution and the 628-bed break-even are all legacy arithmetic wearing a new route.

## The ruling

> Ben, 12 September 2026: press the tab sheets only, buy the leg sheets, and dispatch flat-packed kits for young people to assemble in community.

That sentence is `ROUTE_RULING` in `v2/src/lib/data/production-route.ts:7`. The module was written the same day and carries today's ruling in code, so it is the current route and not a proposal.

## What Witta does

Witta presses tab sheets. The line presses 6 tab sheets on a productive day and every dispatched kit takes 1 of them (`production-route.ts:9-10`). Each kit sends 15 kg of shred through the press as tab sheet. That 15 kg is a planning input from Capacity B39, entered by Ben on 9 September, and the sheet has still to be weighed (`production-route.ts:12-14`).

The leg sheets are bought. Defy cuts a 1200 by 2400 sheet into three 800 by 1200 panels, and invoice INV-2021 prices a cut panel at $127.23 ex GST (`defy-supply.ts:47-50, 104-105`). Those panels are routed here and packed flat with the tab sheet, the canvas, the poles and the hardware. Then the kit goes on a truck.

Two working shapes of the same route sit in `production-scenarios.ts:40-51`. Scenario A buys leg panels and cuts them here. Scenario E buys finished leg kits from Defy at $344.05 a kit, verified on INV-1602 and INV-1732. Both press the tabs at Witta and both dispatch flat.

## What community does

Assembly happens in community. `ASSEMBLY_LOCATION` reads "In community" and `FACTORY_ASSEMBLY_LIMIT` is null, which the module spells out as a stage that does not constrain factory dispatch and never as zero output (`production-route.ts:18-20`).

The Stretch Bed makes that possible without a workshop. It is an X-trestle tension design: two galvanised steel poles thread through the canvas long-edge sleeves and the top holes of two crossed HDPE legs, and tensioning pulls the poles deep into the leg holes. The canvas is structural, so a flat kit becomes a bed at the moment somebody tensions it. See [[products/stretch-bed]].

So the last step of making is the step that moves. Young people and others put the beds together and get them to households, and the work is paid where the bed is used. Forty beds have already been made end to end on our own facilities, pressed at Witta and assembled at Gamardi, which is the evidence that the two halves work. Zero community enterprises are trading yet, and that is what this year changes.

## What it replaces

The old route pressed both sheets at Witta and assembled the bed at Witta before it shipped. Three things follow from dropping that.

- **Leg pressing leaves the press.** The press now cooks tabs only, so the shred a kit needs is the 15 kg tab figure. The 36 kg that the workbook carried and the 40 kg recorded at D06 both counted leg pressing, and canon records them as drift (`sheet-canon.ts:62`).
- **Factory assembly leaves the capacity model.** It used to be a stage with a beds-a-day rate that could bind the line. It is now a community programme with no factory ceiling, and the capacity question becomes a press question. See [[capacity-and-the-line]].
- **The shred break-even is withdrawn.** `SHRED_BREAK_EVEN_STATUS` reads "Needs route costing" (`production-route.ts:23`). The retired sum treated buying legs and pressing legs as two ways of making one whole bed. On this route they are complementary: every kit needs bought legs and a pressed tab sheet, so extra leg panels can cover a supply shortage and can never be counted as extra finished kits (`defy-supply.ts:187-188`).

## What it makes provisional

The cost of a bed is the casualty, and canon says so by name. `bed.make` at $276 is labelled a legacy making allowance, `bed.contribution` at $474 is labelled provisional, and `bed.costStatus` reads "Provisional: bought legs and tab production need costing" (`production-route.ts:24`).

One missing number does all of this. `plastic.kitsPerPanel` reads "Needs panel yield": nobody has confirmed how many complete leg sets come off one 800 by 1200 panel. Without that, the bought half of the kit has no cost, so the kit has no cost (`production-route.ts:21-22`, `defy-supply.ts:94-98`).

Write the word in the sentence that prints the number.

- A bed sells at $750. The legacy allowance puts making at $276 and leaves a provisional $474.
- Break-even at 628 paid beds a year is that provisional $474 divided into the running cost, so 628 is provisional too (`three-year-plan.ts:31-37`).
- Freight is $150 on top and every invoice so far has put it on the buyer. If Goods carries it, the contribution is a provisional $324 and break-even moves to 918 beds. The 796 in the workbook is wrong and has no canon key (`three-year-plan.ts:37`).

The old two-panels-per-bed inference is withdrawn with everything built on it. Panel dimensions establish panel mass and never leg yield (`defy-supply.ts:97-98`). Every figure this ruling retired has a row in [[capital/what-we-no-longer-say]], which is the one place that holds the old number, what replaced it and the ruling that did it.

## Who owns the missing number, and what settles it

Nic owns the yield, and the evidence is already in the building. INV-2021 covers 25 sheets cut to 800 by 1200, which is 75 panels in the delivery (`defy-supply.ts:27, 34, 47-50`). Counting the complete leg sets that come off those panels settles `plastic.kitsPerPanel`, and with it the cost of a kit, the contribution a bed makes and the break-even the whole year plan turns on.

Two questions go to Defy alongside it: how many complete leg sets come from one 800 by 1200 panel, and what the finished leg-kit price includes, because factory tabs and the other bed parts stay separate (`defy-supply.ts:196-201`). The supply clock behind that order is in [[supply-and-defy]].

## Related

[[capacity-and-the-line]] · [[supply-and-defy]] · [[the-second-press]] · [[products/stretch-bed]] · [[products/plant-design]] · [[enterprise/06-process-and-technology]]

## Sources

- `v2/src/lib/data/production-route.ts` lines 1 to 32. The ruling in code, written 12 September 2026.
- `v2/src/lib/data/production-scenarios.ts` lines 1 to 100. Five working shapes of the route and what each one does to speed.
- `v2/src/lib/data/defy-supply.ts` lines 19 to 98. INV-2021, panels per sheet, the withdrawn mass inference.
- `v2/src/lib/data/three-year-plan.ts` lines 27 to 48. Contribution, break-even and the freight swing.
- `deliverables/qbe-stage2/codex-flatpack-route-receipt.md`. The workbook correction receipt, 12 September 2026.
