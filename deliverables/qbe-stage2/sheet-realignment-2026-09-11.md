# Realigning the live sheet to the corrected model

Read 11 September 2026 from
[Goods on Country, Management and finance](https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit),
last modified 10 September.

**Why this is a brief and not a set of edits.** The only write tool available here replaces a file's
whole content, and this workbook carries 42,429 formulas. Flattening them to push a handful of
numbers would cost more than it fixes. Every change below is written so Codex or Ben can apply it
by finding the label, with the reason attached so nobody has to re-derive it.

The code is done. Six guarded modules now hold what the sheet should say:
`demand-and-buyers.ts`, `community-economics.ts`, `the-year-and-the-raise.ts`, `three-year-plan.ts`,
`defy-supply.ts` and `production-scenarios.ts`. 673 tests.

---

## Eleven cells that are wrong

Worst first. The first four are one ruling that never reached the sheet.

### 1. Availability is 100% and Ben set it to 80%

**Calculator, "Availability".** Reads `100%`. The note beside it says availability starts at 100%
if the site has no chosen rate. The Harvest has a chosen rate: Ben set **80%** on 10 September 2026.

Everything below follows from this one cell.

### 2. Working days a month is 20, and 16 of them run

**Calculator, "Working days / month".** Reads `20`. Twenty is the planning month. At 80%
availability **sixteen** of those days actually run, and sixteen is the number every capacity
figure in the repo is built on.

Either set this to 16, or leave 20 and let the availability cell do the work. Do not do both, or
the month gets discounted twice.

### 3. Beds a month reads 60, and the line makes 48

**Calculator, "Beds / month".** Reads `60`, which is three beds a day times twenty days at full
availability. The operating figure is **48**.

### 4. Equipment ceiling on the Home tab reads 60

**Home, "Equipment ceiling".** Reads `60`. Same arithmetic, same fix. The caption already says the
ceiling assumes full availability, so either show 48 beside it as the operating rate, or relabel
this one "ceiling at 100%" and put the operating number on the tile.

**Facility plan, row "Beds / month after downtime", is blank.** That is exactly the cell 48 belongs
in, and filling it resolves items 3 and 4 without touching the ceiling.

### 5. The 143 is still there, and Ben rejected it

**Home, "With estimated recovery, 143"** and **"Plastic sets incl estimated recovery, 143"**.

Ben, 11 September: *"this si not rigith, i thinght it was about 90 bedS"*. He was right. The
defensible counts are **81 leg sets cut** and **87 with the weighed shred**. The 143 assumes about
1,150 kg of unweighed offcuts are recovered, and nobody has weighed them.

Either delete the 143 or relabel it as an unweighed scenario and move it out of the headline. It
currently sits on the Home tab beside two real counts, which reads as a third real count.

### 6. Decision D06 still says 40 kg

**Row "HDPE in a finished bed"**, note reads: *"Definition conflict remains against D06's 40 kg."*

There is no conflict left. Ben ruled **36 kg** on 9 September, and the sheet already carries 36 in
four places as gross press input. D06 is the last survivor of the 40. Sweep the note and the
decision.

The settled pair, for the note: **36 kg of shred is pressed for one bed, 21 kg for the leg sheet
and 15 for the tab sheet. 20 kg ends up in the finished bed.**

### 7. The Calculator has no way to choose where the plastic comes from

**Calculator, "Plastic, $55.00 / bed".**

That is our own pressing, and it is one of three real options. The other two are now invoiced:

| Where the plastic comes from | Per bed | Source |
|---|---:|---|
| Pressed here from our own shred | $40 to $55 | Modelled. No invoice carries it. |
| Panels from Defy, routed here | $254.45 | INV-2021, 11 September 2026 |
| Finished kit from Defy | $344.05 | INV-1602, reconciled exactly |

The choice is not cosmetic. It sets both the bed cost and the line speed, because bought plastic
lifts the line from the press ceiling of three a day to the assembly ceiling of five.

**Add a supply-path selector to the Calculator** and drive the plastic cell from it.
`production-scenarios.ts` holds the whole matrix.

### 8. Nothing in the sheet carries the second press decision

The decision worth the most money in the next fortnight is absent. Panels and a second press reach
the same 80 beds a month and cost the same across the 400 when shred lands at about **$3.16 a
kilogram**. Below that the press wins.

The only prices a kilogram we hold are **$6.87** and **$7.34**, both for finished pressed panel.
Quotes QU0494 and QU0495 carry the bag price and neither has been opened.

### 9. The Money tab has no Defy purchases in it

The cash forecast runs from December 2026. Two Defy commitments sit before it and neither appears:

| What | Amount | When |
|---|---:|---|
| INV-2021, 25 sheets | $10,496.20 inc GST | Due 18 September 2026 |
| The rest of the 105 sheets, 80 more | about $32,000 ex GST | Late October to early November |
| 8 bulka bags of shred | unpriced | Same delivery |

**18 September is also the day the shred runs out**, on Nic's own figure of 450 kg a week with
three weeks left as at 28 August.

### 10. The funding schedule has no job column, which is how the double count happened

**Money, "Funding schedule, all three years".** Seven rows, each with an amount, a receipt month
and a stage. None says what the money is for.

That is exactly the gap that let Tim Fairfax be counted against beds and against operating at the
same time, which overstated the year by $99,500 until it was caught on 11 September.

**Add a Job column** with four values: plant, beds, facilitation, operating. Then a funder can
appear twice only if the split is deliberate, the way Brian M. Davis does.

| Funder | Amount | Job |
|---|---:|---|
| QBE | $300,000 | Plant |
| Tim Fairfax year 1 | $100,000 | Operating |
| Brian M. Davis | $60,000 | Beds |
| Brian M. Davis | $40,000 | Facilitation |
| Snow | $100,000 | Beds |

### 11. December receipts read $700,000 and the asks total $600,000

**Money, December 2026 receipts: $700,000.** That is QBE $300,000, Tim Fairfax $100,000,
Brian M. Davis $100,000 and **Sefa $200,000** as a possible loan.

Sefa is not in the raise. It is recorded as blocked on the entity and cannot proceed while the bed
cost is modelled. Carrying it inside the same total as four grant asks makes the December position
look $200,000 stronger than the raise supports.

Keep the row, move it below a subtotal, and label the subtotal **asks** and the line below it
**proposed borrowing**.

---

## Four tabs the sheet does not have yet

Each one already exists as a guarded module, so this is transcription. None of it needs new modelling.

| New tab | From | What it settles |
|---|---|---|
| **The year and the raise** | `the-year-and-the-raise.ts` | The year needs $747,950, $600,000 is asked, $0 secured, gap $147,950. Carries the double count correction so it cannot come back. |
| **Three years** | `three-year-plan.ts` | 628 beds a year carries the organisation. Year one 400 at 64%, year two 628 at 100%, year three 900 at 143%. This is the Tim Fairfax answer and it has never existed anywhere. |
| **Supply and capacity** | `production-scenarios.ts` + `defy-supply.ts` | The four ways to run the line, what each consumes, and the $3.16 break-even. |
| **Buyers and demand** | `demand-and-buyers.ts` | 320 beds paid, $273,966, four buyers. 20 beds of owned demand against 758 of conversation. |

---

## What to fix first

1. **The availability ruling**, items 1 to 4. One cell drives three others and every capacity number
   in the workbook is wrong until it is set.
2. **The 143**, item 5, because it sits on the Home tab where anybody opening the sheet sees it.
3. **The job column**, item 10, because it is the control that stops the double count recurring.
4. Everything else.

Nothing here changes a formula. Items 7 and 8 add a selector and a tab; the rest are values, labels
and one column.
