> **SUPERSEDED 12 September 2026** by `codex-sheet-brief.md`, which is generated from the canon
> so its figures cannot be mistyped, and which fixes the workbook structurally instead of patching
> eleven cells that would drift again. Kept for the reasoning.

# Codex prompts for the live sheet

Eleven changes and four new tabs, written as prompts to paste one at a time.
Workbook: [Goods on Country, Management and finance](https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit).

**Do them in order.** Prompt 1 drives three other cells, so anything done before it gets redone.

**The faster path.** Share the workbook with
`subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com` as Editor and none of this
is needed. `tools/sheets.mjs` already authenticates and the Sheets API already answers; the only
error is a permission denial on the file. With the share, `node tools/sheets.mjs find 'Availability'`
prints the exact cell address and `write` changes it, one cell at a time, leaving all 42,429
formulas alone.

---

## 1. The availability ruling

> In the Goods workbook, Calculator tab, find the cell labelled **Availability**. It reads 100%.
> Change it to **80%**. Ben set 80% on 10 September 2026 and the note beside the cell says
> availability starts at 100% only when a site has no chosen rate. The Harvest has one.
>
> Then check every cell that depends on it. **Beds / month** should fall from 60 to **48**, and
> **Months needed** for a 400-bed batch should rise from 7 to about **8.3**. If those do not move,
> the availability cell is not wired into the throughput formula and that is the real bug. Tell me
> which it is.

## 2. Working days, so the month is not discounted twice

> Same tab. **Working days / month** reads 20. Twenty is the planning month and sixteen of those
> days run at 80% availability.
>
> Do not change it to 16 if the Availability cell is already applied downstream, or the month gets
> discounted twice and beds per month drops to about 38. Check which way the formula works, set it
> so the answer is **48 beds a month**, and write a one-line note in the cell beside it saying
> which cell carries the 80%.

## 3. The equipment ceiling on Home

> Home tab, **Equipment ceiling** reads 60. Sixty is the ceiling at full availability and 48 is the
> operating rate.
>
> Relabel this tile **Ceiling at 100%** and add **48** beside it labelled **Operating rate, 80%**.
> On the Facility plan tab there is already a row called **Beds / month after downtime** and it is
> empty. Put 48 in it and point the Home tile at that cell.

## 4. The 143 that Ben rejected

> Home tab shows **With estimated recovery, 143**, and the same 143 appears as **Plastic sets incl
> estimated recovery**.
>
> Ben rejected it on 11 September. The defensible counts are **81 leg sets cut** and **87 with the
> weighed shred**. The 143 assumes about 1,150 kg of unweighed offcuts are recovered and nobody has
> weighed them.
>
> Move it off the Home tab. Keep it on the detailed tab, relabel it **Unweighed recovery scenario,
> not a stock count**, and grey it. It currently sits beside two real counts and reads as a third.

## 5. Decision D06

> Find the row **HDPE in a finished bed**. Its note says "Definition conflict remains against D06's
> 40 kg."
>
> There is no conflict left. Ben ruled 36 kg on 9 September and the workbook already carries 36 in
> four places as gross press input. Update decision D06 to 36 kg and replace the note with:
> **36 kg of shred is pressed for one bed, 21 kg for the leg sheet and 15 for the tab sheet. 20 kg
> ends up in the finished bed.**

## 6. Where the plastic comes from

> Calculator tab, **Plastic** reads $55.00 a bed. That is one of three real options and the other
> two are now invoiced.
>
> Add a dropdown above it called **Plastic supply** with three choices, and drive the Plastic cell
> from it:
>
> | Choice | Per bed | Source |
> |---|---|---|
> | Pressed here from our own shred | $55.00 | Modelled. No invoice carries it. |
> | Panels from Defy, routed here | $254.45 | INV-2021, 11 September 2026 |
> | Finished kit from Defy | $344.05 | INV-1602, reconciled exactly |
>
> The choice also sets the line speed, because bought plastic lifts the line from the press ceiling
> of 3 beds a day to the assembly ceiling of 5. Wire that in too, or add a note saying it is not
> wired yet.

## 7. The second press decision

> Add a block to the Calculator or Facility plan tab called **Panels or a second press**.
>
> Both reach 80 beds a month. Across a 400-bed run they cost the same when shred lands at
> **$3.16 a kilogram**. Below that the press wins, above it the panels do, and a longer run moves
> the line further toward the press because the machine is bought once.
>
> | | Panels | Second press |
> |---|---|---|
> | Cost across the 400 | $40,712 of panels | $22,500 once |
> | Shred a month | 1,728 kg | 2,880 kg |
> | Shred across the 400 | 8.6 tonnes | 14.4 tonnes |
>
> Leave the shred price as an empty yellow input labelled **$ per kg, from quote QU0494 or QU0495**,
> and have the block print which option wins once it is filled. Doing both buys nothing, because
> assembly caps the line at 5 a day whatever feeds it.

## 8. Defy purchases in the cash forecast

> Money tab. The forecast starts in December 2026 and three Defy commitments sit before it.
>
> | What | Amount | When |
> |---|---|---|
> | INV-2021, 25 sheets | $10,496.20 inc GST | Due 18 September 2026 |
> | The remaining 80 sheets of the 105 | about $32,000 ex GST | Late October to early November |
> | 8 bulka bags of shred | unpriced, quotes QU0494 and QU0495 | Same delivery |
>
> Extend the forecast back to September 2026 and add them. Flag 18 September, because that is also
> the day the shred runs out on Nic's own figure of 450 kg a week with three weeks left as at
> 28 August.

## 9. A job column on the funding schedule

> Money tab, **Funding schedule, all three years**. Seven rows carry an amount, a receipt month and
> a stage, and none says what the money is for.
>
> That gap is how Tim Fairfax came to be counted against beds and against operating at the same
> time, which overstated the year by $99,500 until it was caught on 11 September.
>
> Add a **Job** column with four values: plant, beds, facilitation, operating.
>
> | Funder | Amount | Job |
> |---|---|---|
> | QBE | $300,000 | Plant |
> | Tim Fairfax year 1 | $100,000 | Operating |
> | Brian M. Davis | $60,000 | Beds |
> | Brian M. Davis | $40,000 | Facilitation |
> | Snow | $100,000 | Beds |
>
> Brian M. Davis splits into two rows on purpose. Then add a check that flags any funder appearing
> twice with the same job.

## 10. Separate the asks from the borrowing

> Money tab. December 2026 receipts read **$700,000**, which is QBE $300,000, Tim Fairfax $100,000,
> Brian M. Davis $100,000 and **Sefa $200,000** as a possible loan.
>
> Sefa is not in the raise. It is blocked on the entity and cannot proceed while the bed cost is
> modelled. Keep the row, move it below a subtotal, label the subtotal **Asks** and the line under
> it **Proposed borrowing**. December asks should read $500,000 with Snow untimed.

## 11. The year, corrected

> Add to the Money tab, above the funding schedule:
>
> | | |
> |---|---|
> | The year needs | $747,950 |
> | Asked, across five asks | $600,000 |
> | Secured | $0 |
> | Still to find | $147,950 |
>
> With a note: **an earlier figure of $937,550 added 400 beds at the $750 sale price to the full
> $297,550 running cost. A bed at $750 pays its own $276 of making and hands $474 to the
> organisation, so the running cost was charged twice. The overlap is $189,600.**

---

## Four new tabs

Each already exists as a guarded module in the repo, so this is transcription.

### Tab: The year and the raise

> Build a tab from `v2/src/lib/data/the-year-and-the-raise.ts`. It carries the build-up to
> $747,950, the five asks and their jobs, the $147,950 gap, and the double count correction so it
> cannot come back. Include the Commonwealth plant scenarios: a plant costs $150,000 and a plant
> grant brings $150,000, so adding plants never moves the gap. It closes only when new money lands
> on a plant QBE was already being asked to fund.

### Tab: Three years

> Build a tab from `v2/src/lib/data/three-year-plan.ts` for the Tim Fairfax application. The spine
> is that 628 paid beds a year carries the whole organisation. Year one 400 beds and trade covers
> 64%, year two 628 and it covers 100%, year three 900 and it covers 143%. The same $100,000 does a
> different job each year: keeps the lights on, then a reserve, then the handover. Mark every bed
> volume as a target inside measured capacity, never a forecast, and carry the four things nobody
> has ruled on.

### Tab: Supply and capacity

> Build a tab from `production-scenarios.ts` and `defy-supply.ts`. Four ways to run the line, what
> each consumes, and the $3.16 break-even. Machines: press 3 a day, router 8.56, assembly 5.
> Sixteen run days a month.

### Tab: Who has asked

> Build a tab from `who-has-asked.ts` and `sizing-from-experience.ts`. **It must not contain a
> demand total.** Order by act: money moved (320 beds, $273,966, four organisations), then money
> named, then an organisation asked, then a person asked, then raised in a meeting.
>
> Add the sizing block: Palm Island reached one bed per 16.0 people and Tennant Creek one per 15.9,
> independently. Planning range one per 12 to one per 21 across three towns. Utopia held out at one
> per 3 because it is homelands. Every figure labelled a floor, because all three have asked for
> more.
