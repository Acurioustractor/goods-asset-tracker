# Hours, employment and what a plant actually pays for

Written 11 September 2026, working the labour model back to its source before the financial model
gets rebuilt on it. Three findings change things. The hours arithmetic follows them.

---

## 1. The $80 assumes five beds a day. Witta does three.

The basis is recorded in `impact-model.ts`: **$80 of paid making a bed, from $400 a day over five
beds.** Ben's ruling, 10 September.

Five beds a day is the line with the leg panel bought in, or with a second press. **Cooking both
sheets on one press the line runs at three.** The wage does not fall when output falls, because it is
paid by the day.

| At Witta | Beds a year | Making wage a year | Wage a bed |
|---|---:|---:|---:|
| 3 beds a day, today | 576 | $76,800 | **$133.33** |
| 5 beds a day | 960 | $76,800 | $80.00 |

**So the $275.74 make cost is priced at a rate Witta does not currently run at.** At today's three
beds a day the making line is $133.33 and the cost of a bed is about $329 and $421 stays, against $474 as printed.

The canon figure can stand. What has to travel with it is which output the $80 assumes, every time it is printed.

---

## 2. More capacity does not make more jobs at the same plant

This one is uncomfortable and it is better understood now than in an interview.

The wage bill is $400 a day either way. A second press does not add a shift, it makes the same
shift produce more beds. So:

- **Hours stay at 32 a week.** One person, eight hours a day, four days a week.
- **Beds go from 576 to 960.**
- **Cost per bed falls from $133 to $80.**

More capacity buys cheaper beds. It does not buy more employment at that site. **Employment grows by
adding plants, or by adding a second shift, and neither is in the plan today.**

---

## 3. The hours and the rate disagree

$400 a day and $50 an hour, the operator rate recorded in `cost-model-scenarios.json`, is eight
hours. Eight hours over five beds is **1.6 hours a bed**.

Two hours a bed over five beds is ten hours, which makes the rate **$40 an hour**.

One of the three has to move: the day rate, the hourly rate, or the hours. The production log settles
it, and it is empty.

Worth noting alongside: the community build path in the same file prices labour at **$130 a bed**,
band $100 to $160, which is almost exactly the $133 that three beds a day implies. The community
number may be the honest one.

---

## Hours a week, in community and at Witta

**Two different things drive these numbers and they must not be put in one column.**

**The wage per bed depends only on the daily rate.** $400 a day divided by beds a day. Days worked
make no difference to it.

| Beds a day | Wage a bed |
|---|---:|
| 3, cooking both sheets | $133.33 |
| 5, leg panel bought or a second press | $80.00 |

**The hours depend only on how many days you run**, which depends on whether demand or capacity is
the binding thing. At $400 a day and $50 an hour that is an eight-hour day.

| What you are making | Beds a day | Days run | Hours a year | Hours a week | Wage bill |
|---|---:|---:|---:|---:|---:|
| 576 beds, the capacity ceiling at 3 a day | 3 | 192 | 1,536 | 32.0 | $76,800 |
| The same 576 beds at 5 a day | 5 | 115 | 922 | 19.2 | $46,080 |
| 960 beds, the ceiling at 5 a day | 5 | 192 | 1,536 | 32.0 | $76,800 |
| The 630 already spoken for, at 3 a day | 3 | 210 | 1,680 | 35.0 | $84,000 |
| The same 630 at 5 a day | 5 | 126 | 1,008 | 21.0 | $50,400 |

**Witta is capacity-limited today**, with 630 beds of recorded demand against 576 a year at three a
day. So the live numbers are the fourth row: 210 production days, more than the 192 the availability
allowance gives, which is why the 630 takes over a year.

### A community plant

| Beds in year one | Beds a day | Days run | Hours a year | Hours a week | Wage bill |
|---|---:|---:|---:|---:|---:|
| 200 | 5 | 40 | 320 | **6.7** | $16,000 |
| 400 | 5 | 80 | 640 | 13.3 | $32,000 |
| 720 | 5 | 144 | 1,152 | 24.0 | $57,600 |
| 960 | 5 | 192 | 1,536 | 32.0 | $76,800 |

**A plant's first year is 6.7 hours a week of paid making.** That is not a job and it should never be
described as one. It is most of a day a week.

A plant is demand-limited in its first years, so the hours are set by how many beds a community can
sell, and nothing about the equipment changes that.

## The community facility as Ben describes it

Five or six beds a day, 48 weeks, up to five people at about twenty hours a week each. Run through:

**The shape.** 48 weeks at five days is **240 production days**. Five people at twenty hours over
48 weeks is **4,800 hours a year**. That is 20 labour-hours a day across the site.

| | 5 beds a day | 6 beds a day |
|---|---:|---:|
| Beds a year | 1,200 | 1,440 |
| Labour hours a bed | 4.00 | 3.33 |
| Local revenue if the enterprise sells them all | $900,000 | $1,080,000 |

**What the wage bill is, at 4,800 hours.**

| Rate | A year | 5 a day, per bed | 6 a day, per bed |
|---|---:|---:|---:|
| $30 an hour | $144,000 | $120.00 | $100.00 |
| $35 an hour | $168,000 | $140.00 | $116.67 |
| $40 an hour | $192,000 | $160.00 | $133.33 |
| $50 an hour | $240,000 | $200.00 | $166.67 |

### Three things this shape settles

**It lands on the community labour figure the cost model already carries.** `cost-model-scenarios`
prices community labour at **$130 a bed, band $100 to $160**. At six beds a day that band is $30 to
$48 an hour; at five it is $25 to $40. So the staffing shape and the cost model agree without being
made to, which is the strongest kind of agreement.

**It is four hours a bed.** Twenty labour-hours a day over five beds is four hours of paid
work in every bed. The two-hour figure is a Witta number, from $400 a day over five beds with one
person on the line. **A community facility with five people is a different labour model and should
carry its own number.** Four hours a bed is also much closer to the withdrawn 6.5 than to the two.

**It breaks the assembly ceiling, and that is the point.** The five-beds-a-day assembly cap is a
one-or-two-person figure. With five people, assembly stops being the constraint and six a day is
reachable, which is why the 1,440 in the older documents describes a differently staffed line.

### What it does not solve

**The press still has to keep up.** Six beds a day needs six tab sheets and six leg sheets. One press
cooks six sheets. So at six beds a day the leg panels are bought, or there is a second press, or the
plant presses for two shifts. Five people do not change what the press does.

**It is a steady-state plant.** The deck says a plant starts at about 200 beds
and reaches 720 on the same equipment. This shape is 1,200 to 1,440, which is the plant at full tilt
with a full crew. The distance between 200 and 1,200 is several years and a market, and the deck
should not let those two numbers sit near each other without saying so.

**Twenty hours is a real choice that needs saying out loud.** Five people at twenty hours is five
part-time positions, which may be exactly right for a community roster and is not the same claim as
five jobs. Whichever it is, say it in those words.

## So where does the employment in a community actually come from

Making is the part the model prices. It is not the part that employs people.

**Priced today:** the $80 a bed of making, and $40,000 a site for a trainer and WHS officer, which
is Open Item 12 and carries a note that the site scope is open.

**Not priced anywhere:** whoever runs the plant, whoever collects and sorts the plastic, whoever
handles delivery, and any admin. Open Item 3 says non-founder central wages are nil, and site roles
beyond the trainer are not in the model at all.

So the honest employment picture at a plant in year one is about **$56,000 of local wages**, being
$16,000 of making and $40,000 of trainer and WHS, and the second of those is a placeholder.

A community enterprise that employs people properly needs the roles the model has not priced. That
is the gap to name before the financial model is rebuilt, and it is the same gap Q19 names at Q20.

---

## What this means for the four impact areas, per plant

At 200 beds in a plant's first year.

| | Per bed | Year one, 200 beds | Grade |
|---|---|---|---|
| **Recycling** | 36 kg through the press, 20 kg net new shred, 20 kg in the finished bed | 7.2 t pressed, 4 t of new shred consumed, 4 t in beds | Modelled, design mass |
| **Employment** | 2 hours of paid making, $80 | 400 hours, $16,000, plus $40,000 of trainer and WHS | Modelled, never time-studied |
| **Community enterprise** | up to $750 kept on a bed the enterprise sells | up to $150,000 of local revenue | Verified rule, no enterprise trading yet |
| **Health** | a bed off the floor | 200 people off the floor | The reason, never a claimed outcome |

The recycling and enterprise rows are the strongest. The employment row is the weakest and it is the
one funders ask about most, because 400 hours reads as a job until somebody divides it by 48.

---

## What settles all of this

The production log, with its run-days column. Paid hours against completed beds, per day, at working
pace. It opened this week with no entries. Until it has them, every number on this page is an
allowance divided by an assumption.
