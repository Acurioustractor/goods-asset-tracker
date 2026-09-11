# Working backwards from the form

11 September 2026. Fourteen days to noon on 25 September.

Every one of the 25 questions sorted by what stands between it and submission, with the money
model and the impact measure read the same way. Published in the two pages:
[The 25 Questions](https://claude.ai/code/artifact/92ad473f-91e5-4ec8-b68c-2c3580102cb5) and the
[QBE Control Room](https://claude.ai/code/artifact/b45c45a0-378b-41a0-b635-eaa461d0957f).

## The 25, by what blocks them

| State | Count | Questions |
|---|---|---|
| Answered and final | 8 | Q5, Q6, Q7, Q8, Q9, Q10, Q18, Q23 |
| Written, held on the siting ruling | 0 | none left |
| Ready, pending a check | 3 | Q1, Q2, and Q19's text |
| A document is owed | 9 | Q3, Q4, Q11, Q14, Q15, Q19, Q20, Q21, Q22 |
| Only a person can answer | 5 | Q13, Q16, Q17, Q24, Q25 |
| Blocked on a missing file | 1 | Q12 |

Nine questions have drafted text. Eight are checker-clean and reconciled to the workbook. Q6 and
Q7 were rewritten on the evening of 11 September against the siting ruling, so nothing is held.
Q19 has text and sits in the document column because of its six attachments.

## What needs work, in the order it unblocks the most

1. **Butterfly's constitution** (Q12, Q22). The only item blocking two questions. Eloise.
2. **Q19's six documents**: a site letter and a quote basis per plant, and a cash milestone
   schedule. Nic. Neither community has agreed to a build, and neither should be told they are in
   a grant application before they have agreed.
3. **Current management cashflow and reconciled opening balances** (Q20, Q21). Eloise. A programme
   forecast is not entity cashflow.
4. **Kristy Bloomfield's related-party minute** (Q8, Q22) at the 14 September board, with a matching
   minute from Oonchiumpa. Ben, Monday.
6. **Structure diagram against the transfer records, and A Curious Tractor's extracts** (Q3, Q4). Ben.
7. **Funder bundle refresh** (Q14, Q15): conditions, recipient, dates. Ben.
8. **Consented record selection for Q11**, with proposed collection labelled as proposed.
9. **Solvency assessment** (Q24) once a current balance has been read. Opening cash is recorded as
   unknown, and unknown is not zero.
10. **The four declarations** (Q13, Q16, Q17, Q25), last.

## The money model

**Corrected 11 September.** The first figure of $937,550 added 400 beds at the $750 sale price to
the full $297,550 running cost. A bed sold at $750 pays its own $276 of making and hands $474 to
the organisation, so the running cost was charged twice. The overlap is $189,600. Guarded in
`v2/src/lib/data/the-year-and-the-raise.ts`, 29 tests.

### How the year is built

| What the year does | Cash out | How it is priced |
|---|---|---|
| Two community plants | $300,000 | $150,000 each, against modules priced $95,767 to $142,467 |
| Making 400 beds | $110,400 | $276 a bed, labour in, freight after |
| Facilitation, four communities | $40,000 | $10,000 each, already billed once at that rate |
| Running the organisation | $297,550 | Founders $151,200, travel $51,000, accounting $50,000, Witta rent $27,000, marketing $10,000, maintenance $8,350 |
| **The year** | **$747,950** | Add $60,000 if Goods carries freight on all 400 |

### The asks against it

| Funder | Amount | Job | Stage |
|---|---|---|---|
| QBE Foundation, Stage 2 | $300,000 | Two plants | Applying, closes 25 September |
| Tim Fairfax Family Foundation | $100,000 | Running the organisation | Invited. Year one of $300,000 over three years |
| Brian M. Davis | $60,000 | 80 beds | Invited |
| Brian M. Davis | $40,000 | Facilitation | Invited |
| Snow Foundation | $100,000 | 133 beds | Not sent |
| **Asked** | **$600,000** | Secured $0 | **Gap $147,950** |

Tim Fairfax was previously counted against beds as well as operating. One invitation, one job.
Fixing it is why the bed gap moved from 54 to 187.

### The Commonwealth plant money

Ben, 11 September, as a director: the $150,000 for the Alice Springs facility is approved and
ready, and a second $150,000 for a Goods facility on the same route is highly likely.

| Scenario | Plants | Needs | Funded | Gap |
|---|---|---|---|---|
| The raise as it stands | 2 | $747,950 | $600,000 | $147,950 |
| Alice Springs in, as a third site | 3 | $897,950 | $750,000 | $147,950 |
| Both land, both on new sites | 4 | $1,047,950 | $900,000 | $147,950 |
| **The second takes a QBE site** | 3 | $897,950 | $900,000 | **$0** |

A plant costs $150,000 and a plant grant brings $150,000, so adding plants never moves the gap.
It only closes when the Commonwealth pays for a plant QBE was already being asked to fund, and
$150,000 of the QBE request moves from plants to beds.

**The disclosure.** If the second $150,000 lands on Palm Island or Maningrida it funds an activity
QBE is being asked to fund, and Q14 and Q15 must carry it as other funding for the same purpose.
If it lands on a third site the application is untouched. Ben names the site, and that answer is
worth $147,950.

### Where the gap lives

| Line | Needed | Asked | Short |
|---|---|---|---|
| Plants | $300,000 | $300,000 | $0 |
| Beds of first stock | 400 | 213 | 187, or $140,250 |
| Facilitation | $40,000 | $40,000 | $0 |
| Running the organisation | $297,550 | $100,000 | $197,550 |

Every dollar of bed money does two jobs: it pays the $276 of making and hands $474 to the
organisation. The 187 unfunded beds are $140,250 of stock and $88,638 of the running cost at the
same time, which is why the bed line and the operating line cannot be added together. It is also
the only ask with a product at the end of it.

The second press is in no ask. About $22,500, and it decides whether the 400 beds land in June or
August.

## How much of the impact measure is finished

| Measure | Grade | Basis |
|---|---|---|
| A person off the floor | Verified | Counted from the asset register, bed by bed, community and date against each |
| Two hours of paid making a bed | Modelled | From the build, not counted in the field |
| 20 kg of plastic in the finished bed | Modelled | 36 kg pressed sits behind it; yield unmeasured |
| Money kept in community | A rule with no trade behind it | The full $750 is settled; no community entity is trading against it yet |

Health stays out of the measures. Scabies to rheumatic heart disease is the reason the work
exists and is never printed as an outcome we claim.
