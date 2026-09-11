<!-- GENERATED. Do not edit by hand.
     Regenerate with:  node tools/sheet-canon.mjs prompt > deliverables/qbe-stage2/codex-sheet-brief.md
     The figures come from v2/src/lib/data/sheet-canon.ts, which imports them from guarded modules. -->

# Brief: make the Goods workbook read from one place

Workbook: https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit

You are editing a live workbook with 42,429 formulas that people use daily. **Never replace the
file or rebuild a tab from scratch.** Edit cells in place, and if a change would break a formula,
stop and say so instead of working around it.

## What we are doing and why

Settled figures are currently retyped into cells all over the workbook, and seven of them have
drifted from the source. The fix is structural: put every settled figure on one **Canon** tab,
then point the other tabs at it, so a figure can only be wrong in one place.

**What stays exactly as it is:** scenarios, the bed calculator inputs, yellow input cells, and
anything somebody types into. Only settled figures move to Canon.

## Step 1. Create the Canon tab

Add a tab named exactly `Canon`. Put this in A1 and fill down. Values are authoritative; do not
round, reformat or recalculate them.

| Key | What it is | Value | Unit | Where it comes from |
| --- | --- | --- | --- | --- |
| `bed.price` | Bed price | 750 | AUD | canon stretch-price |
| `bed.make` | Cost to make a bed | 276 | AUD | the-year-and-the-raise |
| `bed.freight` | Freight a bed, all up | 150 | AUD | demand-and-buyers FREIGHT_RULING |
| `bed.contribution` | Contribution a bed, buyer pays freight | 474 | AUD | the-year-and-the-raise |
| `bed.contribution.goodsFreight` | Contribution a bed, Goods pays freight | 324 | AUD | the-year-and-the-raise |
| `bed.pressedKg` | Shred pressed for one bed | 36 | kg | production-scenarios |
| `line.pressPerDay` | Press, beds a day | 3 | beds | production-scenarios |
| `line.cncPerDay` | Router, beds a day | 8.56 | beds | production-scenarios |
| `line.assemblyPerDay` | Assembly, beds a day | 5 | beds | production-scenarios |
| `line.runDaysPerMonth` | Run days a month, at 80% availability | 16 | days | Ben ruling 10 Sep |
| `line.bedsPerMonth` | Beds a month today | 48 | beds | derived |
| `line.bedsPerMonthLifted` | Beds a month at the assembly ceiling | 80 | beds | derived |
| `line.wittaPerYear` | Witta beds a year | 576 | beds | three-year-plan |
| `line.bulkaBagKg` | A bulka bag of shred | 1000 | kg | production-scenarios |
| `plant.count` | Plants in the QBE ask | 2 | count | the-year-and-the-raise |
| `plant.allowance` | Plant allowance | 150000 | AUD | the-year-and-the-raise |
| `plant.modulesLow` | Plant modules, low | 95767 | AUD | Matt Allen modules |
| `plant.modulesHigh` | Plant modules, high | 142467 | AUD | Matt Allen modules |
| `plant.firstYearBeds` | A plant, beds in year one | 200 | beds | three-year-plan |
| `plant.matureBeds` | A plant, beds at maturity | 720 | beds | three-year-plan |
| `plant.secondPress` | A second press | 22500 | AUD | defy-supply |
| `year.beds` | Beds of first stock | 400 | beds | the-year-and-the-raise |
| `year.pools` | Community pools | 4 | count | ruling 7 |
| `year.poolSize` | Beds in a pool | 100 | beds | derived |
| `year.facilitationEach` | Facilitation a community | 10000 | AUD | three-year-plan |
| `year.facilitation` | Facilitation, all four | 40000 | AUD | the-year-and-the-raise |
| `year.running` | Running the organisation | 297550 | AUD | Ben provision 9 Sep |
| `year.breakEvenBeds` | Beds a year that carry the organisation | 628 | beds | three-year-plan |
| `year.needs` | The year needs | 747950 | AUD | the-year-and-the-raise |
| `year.needsGoodsFreight` | The year needs, Goods pays freight | 807950 | AUD | the-year-and-the-raise |
| `year.asked` | Asked across five lines | 600000 | AUD | the-year-and-the-raise |
| `year.secured` | Secured | 0 | AUD | the-year-and-the-raise |
| `year.gap` | Still to find | 147950 | AUD | capital-stack-flex |
| `year.bedSurplus` | Bed money over the making line | 49600 | AUD | capital-stack-flex |
| `year.bedsUnfunded` | Beds unfunded | 187 | beds | the-year-and-the-raise |
| `year.bedsUnfundedAud` | Beds unfunded, at the price | 140250 | AUD | the-year-and-the-raise |
| `plastic.panelPerBed` | Defy panels a bed | 254.45 | AUD | defy-supply INV-2021 |
| `plastic.kitPerBed` | Defy finished kit a bed | 344.05 | AUD | defy-supply INV-1602 |
| `plastic.breakEvenShred` | Shred price where press and panels cost the same | 3.16 | AUD/kg | production-scenarios |
| `trade.bedsPaid` | Beds bought and paid for | 320 | beds | demand-and-buyers |
| `trade.paidNet` | Paid, net | 247770 | AUD | demand-and-buyers |

Freeze row 1. Grey the whole tab or add a note in B2: **written from the repo, do not edit by hand**.

## Step 2. Fix the seven figures that have drifted

Each one: find the cell, replace the number with a reference to Canon, and check what depends on it.

The lookup pattern is:

```
=VLOOKUP("bed.price",Canon!A:C,3,FALSE)
```

### 1. `bed.pressedKg`, 36 kg

**In the workbook now:** Decision D06 still records 40 kg

**Replace the number with** `=VLOOKUP("bed.pressedKg",Canon!A:C,3,FALSE)`

### 2. `line.runDaysPerMonth`, 16 days

**In the workbook now:** Calculator availability still reads 100% and working days 20

**Replace the number with** `=VLOOKUP("line.runDaysPerMonth",Canon!A:C,3,FALSE)`

### 3. `line.bedsPerMonth`, 48 beds

**In the workbook now:** Home tab equipment ceiling reads 60

**Replace the number with** `=VLOOKUP("line.bedsPerMonth",Canon!A:C,3,FALSE)`

### 4. `year.needs`, 747950 AUD

**In the workbook now:** No tab carries this figure

**Add it** where it belongs, as `=VLOOKUP("year.needs",Canon!A:C,3,FALSE)`. Say where you put it.

### 5. `year.asked`, 600000 AUD

**In the workbook now:** Money tab December receipts read $700,000 including a Sefa line that is ours

**Replace the number with** `=VLOOKUP("year.asked",Canon!A:C,3,FALSE)`

### 6. `plastic.panelPerBed`, 254.45 AUD

**In the workbook now:** Calculator plastic reads $55 with no supply-path choice

**Replace the number with** `=VLOOKUP("plastic.panelPerBed",Canon!A:C,3,FALSE)`

### 7. `plastic.breakEvenShred`, 3.16 AUD/kg

**In the workbook now:** Not in the workbook at all

**Add it** where it belongs, as `=VLOOKUP("plastic.breakEvenShred",Canon!A:C,3,FALSE)`. Say where you put it.

## Step 3. The one that drives three others

Do `line.runDaysPerMonth` first. The Calculator availability cell reads 100% and Ben set 80% on
10 September. That one cell should drive:

- **Beds / month** from 60 to **48**
- **Months needed** for a 400-bed batch from 7 to about **8.3**
- The Home tab **Equipment ceiling**, which should show 60 as the ceiling at 100% and **48** as
  the operating rate. The Facility plan tab already has an empty row called
  **Beds / month after downtime**, which is where 48 belongs.

**If changing availability does not move beds per month, stop.** That means the cell is not wired
into the throughput formula, which is a worse bug than the wrong number. Tell us which it is.

Be careful not to discount the month twice: 20 planning days at 80% is 16 run days. Apply the
80% or change 20 to 16. Doing both lands on 38 beds a month, which is wrong.

## Step 4. Three things the workbook is missing

**A supply-path choice on the Calculator.** The Plastic cell reads $55 a bed, which is one of
three real options. Add a dropdown above it and drive the cell from it:

| Choice | Per bed |
| --- | --- |
| Pressed here from our own shred | 55 |
| Panels from Defy, routed here | 254.45 |
| Finished kit from Defy | 344.05 |

**The year, on the Money tab, above the funding schedule.** Four rows, referencing Canon:
`year.needs`, `year.asked`, `year.secured`, `year.gap`.

**A Job column on the funding schedule**, with four values: plant, beds, facilitation, operating.

| Funder | Amount | Job |
| --- | --- | --- |
| QBE | 300000 | plant |
| Tim Fairfax year 1 | 100000 | operating |
| Brian M. Davis | 60000 | beds |
| Brian M. Davis | 40000 | facilitation |
| Snow | 100000 | beds |

Brian M. Davis splits into two rows deliberately. Add a check that flags any funder appearing
twice with the same job: that is the error that overstated the year by $99,500, when Tim Fairfax
was counted against beds and against operating at once.

Also move the **Sefa** line below a subtotal. Label the subtotal **Asks** and the line under it
**Proposed borrowing**. Sefa is a loan we have not applied for and its $200,000 is our number,
so December asks should read $500,000 with Snow untimed.

## Step 5. Tell us what you found

Report back with: which cells you changed, anything that did not behave as described, and any
formula that broke. Do not fix a broken formula by hardcoding a number.

## How to verify

Once the workbook is shared with the service account we run `node tools/sheet-canon.mjs check`,
which reads the Canon tab back and fails on anything out of step. Until then, spot-check three:
beds per month should read 48, the Plastic cell should follow the dropdown, and the Money tab
should show a gap of 147950.
