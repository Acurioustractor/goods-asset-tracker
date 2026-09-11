# Goods workbook: current production route

Workbook: https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit

Press tab sheets here, purchase leg sheets, dispatch flat-packed kits. Young people assemble beds in community. Factory assembly is not a production constraint.
One press: 6 kits/day and 96 kits/month. Availability is applied once. Two presses: 136 kits/month, constrained by CNC.
Bought legs and pressed tabs are complementary parts of each kit. Never add them as separate bed outputs.
Purchased-panel yield remains unknown. Missing costs remain text status values, never zero. Existing financial costs and contribution figures are provisional until this route is costed.
Edit the existing workbook in place. Preserve inputs and source records. Canon contains both numeric values and explicit status strings.

| Key | Description | Value | Unit | Source |
| --- | --- | --- | --- | --- |
| bed.price | Bed price | 750 | AUD | canon stretch-price |
| bed.make | Legacy making allowance; current route needs costing | 276 | AUD | the-year-and-the-raise |
| bed.freight | Freight a bed, all up | 150 | AUD | demand-and-buyers FREIGHT_RULING |
| bed.contribution | Provisional contribution, legacy making allowance | 474 | AUD | the-year-and-the-raise |
| bed.contribution.goodsFreight | Provisional contribution with Goods freight | 324 | AUD | the-year-and-the-raise |
| bed.pressedKg | Gross tab shred per dispatched kit | 15 | kg | production-scenarios |
| line.pressPerDay | Tab press, kits a day | 6 | beds | production-scenarios |
| line.cncPerDay | Router, kits a day | 8.56 | beds | production-scenarios |
| line.assemblyPerDay | Assembly location; no factory limit | In community | status | production-scenarios |
| line.runDaysPerMonth | Run days a month, at 80% availability | 16 | days | Ben ruling 10 Sep |
| line.bedsPerMonth | Flat-packed kits a month today | 96 | beds | derived |
| line.bedsPerMonthLifted | Kits a month at the router ceiling | 136 | beds | derived |
| line.wittaPerYear | Current facility kits a year, modelled | 1152 | beds | three-year-plan |
| line.bulkaBagKg | A bulka bag of shred | 1000 | kg | production-scenarios |
| line.pressSheetsPerDay | Tab sheets pressed each productive day | 6 | count | production-route Ben 12 Sep |
| line.pressedSheetsPerKit | Pressed tab sheets per dispatched kit | 1 | count | production-route Ben 12 Sep |
| bed.costStatus | Status of the current route cost | Provisional: bought legs and tab production need costing | status | production-route Ben 12 Sep |
| plastic.panelEach | Invoiced 800 x 1200 panel, ex GST | 127.22666666666667 | AUD | defy-supply INV-2021 |
| plastic.kitsPerPanel | Leg kits per purchased panel | Needs panel yield | status | production-route awaiting cut yield |
| plant.count | Plants in the QBE ask | 2 | count | the-year-and-the-raise |
| plant.allowance | Plant allowance | 150000 | AUD | the-year-and-the-raise |
| plant.modulesLow | Plant modules, low | 95767 | AUD | Matt Allen modules |
| plant.modulesHigh | Plant modules, high | 142467 | AUD | Matt Allen modules |
| plant.firstYearBeds | A plant, beds in year one | 200 | beds | three-year-plan |
| plant.matureBeds | A plant, beds at maturity | 720 | beds | three-year-plan |
| plant.secondPress | A second press | 22500 | AUD | defy-supply |
| year.beds | Beds of first stock | 400 | beds | the-year-and-the-raise |
| year.pools | Community pools | 4 | count | ruling 7 |
| year.poolSize | Beds in a pool | 100 | beds | derived |
| year.facilitationEach | Facilitation a community | 10000 | AUD | three-year-plan |
| year.facilitation | Facilitation, all four | 40000 | AUD | the-year-and-the-raise |
| year.running | Running the organisation | 297550 | AUD | Ben provision 9 Sep |
| year.breakEvenBeds | Beds a year that carry the organisation | 628 | beds | three-year-plan |
| year.needs | The year needs | 747950 | AUD | the-year-and-the-raise |
| year.needsGoodsFreight | The year needs, Goods pays freight | 807950 | AUD | the-year-and-the-raise |
| year.asked | Asked across five lines | 600000 | AUD | the-year-and-the-raise |
| year.secured | Secured | 0 | AUD | the-year-and-the-raise |
| year.gap | Still to find | 147950 | AUD | capital-stack-flex |
| year.bedSurplus | Bed money over the making line | 49600 | AUD | capital-stack-flex |
| year.bedsUnfunded | Beds unfunded | 187 | beds | the-year-and-the-raise |
| year.bedsUnfundedAud | Beds unfunded, at the price | 140250 | AUD | the-year-and-the-raise |
| plastic.panelPerBed | Bought leg panels per kit: cost status | Needs panel yield | status | defy-supply INV-2021 |
| plastic.kitPerBed | Defy finished leg kit, excluding tabs | 344.05 | AUD | defy-supply INV-1602 |
| plastic.breakEvenShred | Shred break-even: withdrawn for old route | Needs route costing | status | production-scenarios |
| trade.bedsPaid | Beds bought and paid for | 320 | beds | demand-and-buyers |
| trade.paidNet | Paid, net | 247770 | AUD | demand-and-buyers |

Verify 400 kits takes 400 / operating monthly capacity months. Zero bought legs must yield zero kits even with abundant shred. Missing route costs must prevent a numeric total. Community assembly is recorded separately.
