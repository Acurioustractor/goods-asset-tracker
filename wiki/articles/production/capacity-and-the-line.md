---
reviewed: 2026-09-12
ruling: Ben, 10 September 2026, availability at 80%, carried into the flat-pack route ruling of 12 September 2026
canon: [line.pressPerDay, line.pressSheetsPerDay, line.pressedSheetsPerKit, line.cncPerDay, line.runDaysPerMonth, line.bedsPerMonth, line.bedsPerMonthLifted, line.wittaPerYear, line.assemblyPerDay, bed.pressedKg, year.beds, plant.secondPress]
sources: [v2/src/lib/data/production-route.ts:9-32, v2/src/lib/data/production-scenarios.ts:16-67, v2/src/lib/data/three-year-plan.ts:43-48, v2/src/lib/data/sheet-canon.ts:65-76, deliverables/qbe-stage2/sheet-realignment-2026-09-11.md, deliverables/qbe-stage2/qbe-answers-2026-09-10.md]
---

# Capacity and the line

> Witta presses 6 tab sheets a day and each dispatched kit takes one of them, so the line makes 6 kits a day. Twenty planning days at 80% availability give 16 run days, which is 96 kits a month and 1,152 a year. The router will take 8.56 kits a day, so the press is the constraint and about 41 kits a month of router time sits idle. The live workbook has not caught up: its Calculator still reads 100% availability, and until that cell is set every capacity number the sheet derives runs a quarter above what the line can make. None of these rates is measured. The daily production log opened in the week of 10 September with no entries in it, so 80% is a planning assumption until the log replaces it.

## What the line can do

| | | Where it comes from |
|---|---|---|
| Tab sheets pressed a productive day | 6 | `production-route.ts:9` |
| Pressed tab sheets per dispatched kit | 1 | `production-route.ts:10` |
| Kits a day | 6 | `factoryKitsADay`, `production-route.ts:26-29` |
| Run days a month | 16 | 20 planning days at 80%, `production-route.ts:15-17` |
| Kits a month | 96 | `factoryKitsAMonth`, `production-route.ts:30-32` |
| Kits a year, modelled | 1,152 | `three-year-plan.ts:43` |
| Router, kits a day | 8.56 | `production-route.ts:11` |
| Kits a month at the router ceiling | 136 | two presses, `production-scenarios.ts:56-59` |
| Assembly | In community | `production-route.ts:18-20` |
| Shred through the press per kit | 15 kg | `production-route.ts:12-13` |

The press sets the pace. `factoryKitsADay` takes the lower of the press rate and the router rate, so one press gives 6 and the router's 8.56 never binds (`production-route.ts:26-29`).

The flat-pack ruling doubled the kit rate without buying anything. The press has always made six sheets a day. Under the old route a bed took two of them, one for the legs and one for the tabs, so the line ran at three beds a day. Buying the leg sheets leaves one pressed sheet in each kit, so the same six sheets now leave the building as six kits. See [[the-flat-pack-route]].

## The 80% ruling, and the cell that never got it

Ben set availability at 80% on 10 September 2026 (`production-scenarios.ts:20-21`). Twenty planning days a month at that rate give 16 run days, and 16 is the number every capacity figure in the repo is built on.

The live workbook still runs at full availability. From the realignment read of 11 September against **Goods on Country, Management and finance** (`1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y`):

- **Calculator, "Availability"** reads `100%`. The note beside it says availability starts at 100% when a site has no chosen rate. Witta has one, and it is 80%.
- **Calculator, "Working days / month"** reads `20`, and 16 of those days run.
- **Calculator, "Beds / month"** and **Home, "Equipment ceiling"** both read `60`, which was three beds a day at full availability on the old route.

Canon records the mismatch by name: `line.runDaysPerMonth` carries the drift note "Calculator availability still reads 100% and working days 20" (`sheet-canon.ts:68`).

The size of the error is a quarter. At six sheets a day, twenty days at full availability prints 120 kits a month where the line makes 96. That is 24 kits a month and 288 kits a year of capacity the sheet claims and the line cannot deliver, and every figure the workbook derives from that cell inherits it: monthly output, annual output, run length for the 400, shred burn and any cash date built on them.

One caution when it is fixed. Set the availability cell or set the working-days cell to 16, and never both, or the month is discounted twice.

## What the line cannot deliver, and by how much

**It cannot use the router it has.** The press does 6 kits a day against the router's 8.56, so about 2.56 kits a day of router time goes unused, which is roughly 41 kits a month. That idle capacity is what [[the-second-press]] buys back.

**A second press does not double the line.** `factoryKitsADay` caps two presses at the router, so two presses model 136 kits a month against 96. The lift is 40 kits a month, and it costs $22,500 (`production-scenarios.ts:28, 52-59`).

**It is not what is short this year.** The year plans 400 beds of first stock, which is 4.17 run months at 96 a month. Against 1,152 a year the line has room, and the constraint on this year is money and orders. The gap is 187 unfunded beds, and the supply clock in [[supply-and-defy]] is tighter than the press.

**It cannot carry three years alone.** The Tim Fairfax plan targets 628 beds in FY28 and 900 in FY29, and the FY29 capacity line counts two mature plants plus a third in its first year on top of Witta (`three-year-plan.ts:96-122`). Those bed volumes are targets that fit inside modelled capacity. They are not forecasts, and no buyer has ordered year two or year three (`three-year-plan.ts:166-167`).

**None of it is measured.** The 6 a day and the 8.56 a day are entered rates from the model, and the 15 kg tab sheet has still to be weighed. From the Q19 answer of 10 September:

> The daily production log opened this week and has no entries in it, so the availability allowance is a planning assumption, and the log is what will replace it with a measured rate.

What is measured is the work already done. 540 beds sit on the register across eleven communities, and 40 of those were pressed at Witta and assembled at Gamardi with the Maningrida crew, paid for and delivered.

## Related

[[the-flat-pack-route]] · [[supply-and-defy]] · [[the-second-press]] · [[products/plant-design]] · [[communities/maningrida]]

## Sources

- `v2/src/lib/data/production-route.ts` lines 9 to 32. Press rate, router rate, run days, the capacity functions.
- `v2/src/lib/data/production-scenarios.ts` lines 16 to 67. The availability ruling and the five scenarios.
- `v2/src/lib/data/three-year-plan.ts` lines 43 to 48 and 96 to 122. Witta a year, and the three-year targets.
- `v2/src/lib/data/sheet-canon.ts` lines 65 to 76. The canon keys and the recorded workbook drift.
- `deliverables/qbe-stage2/sheet-realignment-2026-09-11.md`. The eleven wrong cells, read 11 September 2026.
- `deliverables/qbe-stage2/qbe-answers-2026-09-10.md`. Q19 delivery answer and the production log.
