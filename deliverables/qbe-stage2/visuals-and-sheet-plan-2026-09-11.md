# What to draw, and what the sheet has to hold

Written 11 September 2026 against Ben's twelve rulings the same day.

---

# Part one · The visualisations

## The finding that shapes this

The charts already exist. They are in the wrong place. The Goods on Country Model artifact carries
ten built charts: spend by category, the bed split, running costs, full cost against volume, who paid
last year, the funding ladder, capacity against demand, the plant timeline, the cash runway and ten
years of where beds are made.

**The deck carries almost none of them.** Across nineteen frames there is one bar on S15 splitting
$750, the map and tiles on S08, and diagrams on S13, S14, S16 and S17 that carry layout where a chart would carry data. A funder reading the deck never sees a single number move.

So the work is mostly moving proven charts across.

## The seven, in the order I would build them

### 1. Two kinds of money that never meet · RULED, build first

Ben's choice for the single most valuable chart, because it is the most misunderstood thing in the
model. Two lanes that never touch. Catalytic capital pays Goods $750 a bed for first stock. Buyers
pay the community enterprise and that money never reaches Goods. Plants are capital and sit outside
the bed price entirely.

It exists as a diagram in the Model artifact's section 1 and on S13. What it lacks is the money
labelled on each arrow, which is what makes it a chart instead of a picture.

**Data:** all locked. `raise-stack.ts`, `community-loop.ts`, canon.

### 2. The price ladder · the strongest new evidence you have

Five dated points: Centrecorp $370 in August 2025, Mala'la $380 in October, Centrecorp $560 in
November, Homeland $750 in May 2026, ALIVE $800 in July. The $750 list price as a line through it.
Two of the five sit at or above list.

Nothing in the deck shows this today and it is checkable in a minute from invoice numbers. It answers
the question a funder actually has, which is whether $750 is a real price or a hope.

**Data:** `demand-and-buyers.ts`, locked with guards on 11 September, straight from Xero.

### 3. Overcrowding, the household measure · RULED as how need is shown

Arnhem Land 70%, Central Australia 49%, against 15% nationally. AIHW names household overcrowding as
the risk factor in the Strep A to acute rheumatic fever to rheumatic heart disease chain, and the ABS
extract measures it by the same standard across 1,138 communities. So one bar chart carries both the
scale of need and the reason a bed off the floor matters, without claiming a health outcome.

This replaces the demand tally Ben rejected.

**Data:** `abs-iloc-overcrowding.json` and `community-need.ts`, 1,138 ILOCs.

### 4. The capacity wall

630 beds of recorded demand against 48 a month on one press, which lands about January 2028. Against
80 a month on two presses, which clears it in 7.9 months. The chart makes the case for the second
press without a word of argument, and it is why the Sefa conversation exists.

**Data:** locked. The Harvest at 3 beds a day, 20 planning days, 80% availability.

### 5. One bed, where the money goes

$750 into $276 to make with $80 of wage inside it, and $474 that stays. It is on S15 already as a bar
and it is the unit everything else scales from. Keep it, and set the $80 inside the $276 so the eye reads the wage as part of the cost, which is the point.

### 6. Ten years of where beds get made

Witta flat, on-country production growing above it. It is the claim the whole model rests on and it is the only chart that shows the mission instead of the machine. It exists in the Model artifact.

### 7. The funding register, with zero secured

Every line with its amount and its stage, and the secured total at $0. An honest chart that a funder
will trust more than a confident one. It exists as the ladder chart in the Model artifact.

## What I would not draw

A demand pipeline, in any form. Ben ruled the tally out and any chart of 778 beds reads as an order
book whatever the caption says.

---

# Part two · The sheet

## What is there now

Home, Money overview, The plant, Capacity, Stock counts, Production log, Cost log, Calculator,
Charts, Facility plans, Funding timing, Asks, Open Items and Review together, plus Matt Allen's five
preserved entity-model tabs.

## The two Ben ruled urgent

### Production log, with run days

**It exists and it is empty.** That matters more than it sounds: Q19 claims delivery readiness at 48
beds a month, and 48 is an assumption made of 3 beds a day times 20 days times 80% availability. The
run-days column is the thing that replaces an assumption with a measured rate.

Columns it needs: date · site · shift or crew · beds completed · sheets pressed · run hours · days
counted as run days · downtime reason · who recorded it.

The run-days column is the one that does the work. Availability stops being a ruling and becomes
run days divided by planning days.

### Community context and support · has no home anywhere today

Nothing in the sheet, the register or the CRM holds this in one place. One row per community:

place · partner organisation · beds delivered · washing machines · date of last visit · facilitation
paid and by whom · what they asked for next · who said it · consent tier · whether a plant or a pool
is proposed · the local operator, if there is one.

This is the tab that would have prevented today's Palm Island error, because it would have shown at a
glance that Palm Island's case is 131 delivered beds and seven cleared voices, and never was recorded demand.

## The four money surfaces, from the Open Items

### Money in

Funding timing carries the asks. What it does not carry is every receipt as it lands. One row per
receipt: date banked · payer · amount · GST basis · what it was for · which entity received it ·
invoice number · restricted or unrestricted.

**The entity column is the one that matters.** Today's Snow finding came from a figure that spans two
Xero organisations, and no sheet column records which one a dollar landed in.

### Money out

The Cost log exists, is empty, and its own note says it does not post into Monthly cash. Until it
does, the cash runway is a forecast with no actuals underneath it.

One row per payment: date · payee · amount · category · site · whether it is production, plant or
running the organisation · which entity paid.

### Loans

Open Item 8 reads "Nil, with no terms". Repayable capital needs its own rows: lender · amount ·
rate · term · security · repayment source · first repayment date · what it may fund.

**The repayment source column is the guardrail**, because the 8 September ruling says community
resale proceeds are excluded and nothing else in the sheet enforces that.

### Grants

Open Item 6 says restrictions and award evidence are not attached to tranches. Per tranche: funder ·
amount · date of award · conditions in their words · what it may be spent on · reporting due ·
recipient entity · evidence document.

## The three connections the sheet's own guide says are still open

Its Workbook guide names them: production logs do not post into Monthly cash, production costing does
not reach the cash basis, and the opening balance is unknown. The first two are wiring. The third
needs Eloise.

## What I would do first

The community context tab, because it has no home at all and every other surface has one. Then the
production log's run-days column, because Q19 rests on it. The money surfaces are a bigger build and
they depend on Eloise's opening balance to mean anything.
