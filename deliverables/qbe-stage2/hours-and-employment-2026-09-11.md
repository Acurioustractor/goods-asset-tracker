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

At $400 a day, $50 an hour, eight-hour days, and 192 production days a year, being twenty planning
days a month at the 80% availability Ben set.

| | Beds a year | Production days | Making wage | Hours a year | Hours a week |
|---|---:|---:|---:|---:|---:|
| **Witta, 3 beds a day** | 576 | 192 | $76,800 | 1,536 | 32 |
| **Witta, 5 beds a day** | 960 | 192 | $76,800 | 1,536 | 32 |
| **A plant, year one** | 200 | 40 | $16,000 | 320 | **6.7** |
| **A plant at 400** | 400 | 80 | $32,000 | 640 | 13.3 |
| **A plant at 720** | 720 | 144 | $57,600 | 1,152 | 24.0 |
| **A plant at capacity** | 960 | 192 | $76,800 | 1,536 | 32.0 |

**A plant's first year is 6.7 hours a week of paid making.** That is not a job and it should never be
described as one. It is most of a day a week.

Even a plant running at its ceiling is 32 hours a week of making, which is four days.

---

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
