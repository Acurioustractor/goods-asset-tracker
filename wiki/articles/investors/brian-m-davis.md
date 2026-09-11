---
reviewed: 2026-09-12
ruling: Ben, 12 Sep 2026, the flat-pack route, which leaves the making allowance and the contribution provisional; with the 11 Sep 2026 split that gives every funder one job
canon: [bed.price, bed.make, bed.contribution, bed.pressedKg, year.beds, year.needs, year.facilitation, year.facilitationEach, year.running, year.breakEvenBeds, trade.bedsPaid, trade.paidNet]
sources: [Notion 3d8ebcf981cf81dbb2defb430458ea50, BMD - application forms /BMDCF general grant application questions.docx, BMD - application forms /BMDCF Budget template 3yr - 2026.xlsx, BMD - application forms /BMDCF Grant Conditions.pdf, v2/src/lib/data/capital-stack-flex.ts:117-135, v2/src/lib/data/the-year-and-the-raise.ts:134-147, v2/src/lib/data/production-route.ts:9-24, v2/src/lib/data/impact-model.ts:208-219, v2/src/lib/data/asset-canonical.ts:33, v2/src/lib/data/demand-and-buyers.ts:169-193, wiki/articles/governance/policies-register.md, deliverables/qbe-stage2/asks/brian-m-davis-application-2026-09-11.md]
supersedes: []
---

# Brian M. Davis Charitable Foundation

> Miranda Campbell invited an application on 1 September 2026 for an initial twelve-month grant of
> up to $100,000, due Friday 25 September 2026, the same day as QBE. It is an invitation-only
> process: grants committee in October, board on 19 November. The $100,000 splits by job into
> $60,000 of beds held as community trading stock and $40,000 of facilitation across four
> communities. One line buried in their budget template decides the shape of the whole
> application, because BMDCF pays out a grant only once all funding for the project is confirmed,
> so the project has to be scoped to exactly this grant. One question must not be submitted as it
> stands: the child safety answer, which the policies register records at draft. A youth funder
> reads that answer closely, and overstating it would be worse than naming where it is up to.

## What is due, and when

| | |
|---|---|
| Invitation | Miranda Campbell, 1 September 2026 |
| Amount | Up to $100,000, initial twelve-month grant |
| Due | Friday 25 September 2026 |
| Grants committee | October 2026 |
| Board decides | 19 November 2026 |
| Anticipated start | December 2026, following the board |
| Process | Invitation only. The published question set is a preparation aid for the online form |

## What the money does

| Line | Amount |
|---|---|
| 80 Stretch Beds at $750, held as community trading stock | $60,000 |
| Facilitation in four communities at $10,000 each | $40,000 |
| Total, exclusive of GST | $100,000 |

The drafted initiative name is "Beds made by young people, for their own community". The funding
purpose field allows 30 words: to pay young people in remote communities to make and deliver 80
recycled-plastic beds, and to support four communities to run that work themselves.

The 80 beds are 80 of the 400 beds of first stock, carried on the beds line of the stack at
`capital-stack-flex.ts:117-127`. What stays out of this application is the plant line, the rest of
the bed line and the running of the organisation. Those belong to QBE and to Tim Fairfax. Every
funder in the raise carries one job, and the one time that rule slipped it overstated the year by
$99,500.

## The condition that decides the scope

Sheet INSTRUCTIONS, cell B16 of their budget template: BMDCF only pays out a grant once all funding
for a project has been confirmed. That condition sits in the template and appears nowhere in the
Grant Conditions PDF, so it is easy to miss and it governs everything else.

Scope the project to exactly $100,000. If the project is 80 beds and facilitation in four
communities, then all funding for the project is this grant alone and the condition is satisfied
the moment the board approves it. If the project is written as a slice of the $747,950 year, the
payment waits on QBE, Tim Fairfax and Snow, and the money may not move until 2027.

The form's own dropdown follows from that decision. "Funding relationship, sole funder or partner
funder" is answered sole funder, and it is answered honestly, because the project as scoped has one
funder.

## Their budget template is a three-year workbook

The template runs five year columns with an acquittal side beside them, so a twelve-month request
uses the Year 1 column and leaves the rest empty. What it asks for is worth reading before the
narrative is written, because the application form requires the totals to match the workbook.

- **Itemised income, by year.** Rows for the BMDCF request, government funding, other philanthropic
  sources, cash from our own organisation, in-kind from our own organisation, projected earned
  income from the project, other, and cash and in-kind from project partners.
- **A confirmed column.** Every non-BMDCF income line carries a Yes or No. Unconfirmed income has
  to be updated as results arrive, and an unsuccessful application elsewhere triggers a revised
  budget.
- **Income equal to or higher than expenditure.** The workbook totals it and flags the check.
- **Itemised expenses** under salaries including on-costs, consultant fees, capital and equipment,
  administration and consumables, travel and accommodation, marketing, evaluation naming who
  conducts it, and other. In-kind expense lines auto-populate from the income side and must match.
- **An earned income explanation box**, for the rationale behind any revenue assumption. The bed
  model belongs here.
- **No GST.** Grants from BMDCF are gifts and carry no GST. A GST-registered applicant excludes GST
  from income and expenditure, and the requested amount is exclusive of GST.
- **Periods you choose.** A project year does not have to be a financial or calendar year, and the
  dates are typed at the top of each column.
- **Numbered notes** at the foot of the sheet for any line that needs narrative.

The acquittal columns are the same workbook. Whatever is itemised now is what gets reported
against, so the line items should be ones the production log and Xero can actually produce.

## The answer not to submit yet

The form asks how the organisation adheres to the National Principles for Child Safe Organisations,
and what upholding children's rights looks like in practice. `wiki/articles/governance/policies-register.md`
records the child safety process at draft, with a consultation underway with Fred Campbell.

Do not submit this question until the draft is finished or a completion date is set. A youth funder
reads this answer closely, and a claim beyond the evidence here would be the most expensive
sentence in the application.

The honest answer has three parts, and each is checkable:

1. The draft process itself, its consultation with Fred Campbell and the date it will be finished.
2. That the work happens inside community organisations that hold their own child safe policies and
   screening, with those organisations named.
3. What upholding children's rights looks like in practice: young people are paid at a named rate,
   their images and words are used only with recorded consent, and their own community organisation
   decides what happens locally.

## Why it fits their three priorities

Youth employment, school and community engagement for children and young people, and recycling of
plastics. All three sit in the same bed, and each carries a figure that has to travel with its
basis.

**Youth employment.** Under Ben's 12 September route ruling, tab sheets are pressed at Witta, leg
sheets are bought, and flat-packed kits go to community where young people assemble and distribute
them. The paid youth work is in community, which is exactly the thing this funder buys. The wage
figure behind it is modelled: $80 of paid making a bed, derived from $400 a day over an assumed
five beds a day, recorded at `impact-model.ts:208-219` as two hours a bed and never time-studied.
Print it with that word attached, or print the first fifty beds of measured hours instead once the
production log has them.

**Children and young people.** In Maningrida, 40 beds were pressed at our own facility and
assembled at Gamardi with local young workers, on invoice INV-0303. That is the strongest single
piece of evidence in this application because a buyer paid for it.

**Recycling.** Each dispatched kit carries 15 kg of tab shred pressed at Witta, so 80 kits is about
1,200 kg. That figure is a current planning input from the capacity model and the tab sheet has
still to be weighed. The leg panels are bought recycled HDPE and their mass per kit is not counted
here, because the panel yield is unknown until Nic cuts and counts leg kits from the sheets already
invoiced. An earlier version of this application claimed 20 kg a bed and 1.6 tonnes across 80 beds.
The 20 kg is not retired: it is the recycled HDPE in a whole Stretch Bed and it is still the basis
of the register rollup at `asset-canonical.ts:33`, which carries 3,540 kg across 177 Stretch Beds.
What changed is how much of it goes through our own press. An application about what this factory
diverts uses the 15 kg.

## Outcomes, beneficiaries and evidence

The form asks for three outcomes, each with one or two indicators in 100 words, then a separate
evaluation question about which data sets will show a change. It also asks how many people benefit
directly and indirectly, and for the calculation behind both numbers in the beneficiary
description.

Two rules govern those numbers. There is no demand total and none may be stated, because the
figures that used to be summed are scoped to different populations. Present acts instead, strongest
first: money moved, then money named, then an organisation asking, then a person asking, then a
figure raised in a meeting. And health is the reason for the work and never a measured outcome, so
the chain from skin infection to rheumatic heart disease carries no number in any indicator.

What the indicators can honestly count: beds made, beds delivered and to which households, paid
hours and who was paid, kilograms of shred pressed, and whether a community enterprise has stock it
can sell. Those come from the production log, the asset register and the invoices.

Theory of change is an upload field marked "if applicable". It does not exist as a document, and
three open applications now want one. Nobody is recorded as owning it.

## Partners, referees and support letters

Up to two support letters can be uploaded from delivery partners, and the form asks why we
partnered with each one and how formalised the partnership is. Two letters would materially
strengthen this application, and each of the four communities has to be confirmed with its own
organisation before it is named on a form.

Referees are asked for only when the request is greater than $100,000 a year. This request is at
$100,000, so two referees are optional here. The peer referee that Tim Fairfax requires is a
separate and required field on that form.

## Say the price model out loud

In the budget notes: $750 is the published price every buyer pays. Canon splits it into a $276
legacy making allowance and a $474 provisional contribution that carries the organisation making
the next bed. Both halves are provisional under the flat-pack route until the bought leg panel
yield is counted.

Hiding that split would be worse than explaining it. A funder who reads our published invoices will
find it anyway: four organisations have bought and paid for 320 beds across five settled invoices,
$247,770 net, at realised prices of $370, $380, $560, $750 and $800.

## Sustainability, if the initiative is ongoing

The form asks for a long-term strategy if the initiative continues past the funded period. Running
Goods on Country costs $297,550 a year and a bed hands back a provisional $474, so a provisional
628 paid beds a year carries the organisation with no grant support. The year to June 2027 plans
400. The year after reaches the number. Beyond that the plant moves along the pathway toward
community ownership and the enterprise trades on its own account. Community ownership is a pathway
and is never claimed as complete.

## What the grant conditions commit us to

Their conditions are short and two clauses bite. Funds are used exclusively for the purpose set out
in the application, and any change of purpose, use of funds or timeframe needs BMDCF's approval
first. The grant is subject to an annual review, and BMDCF may reduce, increase or cease
instalments at its discretion following one. An acquittal report is due within three months of the
end of the project, in the same workbook.

## What only Ben can supply

| # | What |
|---|---|
| 1 | The child safety answer. Finish the draft or set a date first |
| 2 | Primary contact details, the annual report link and the ACNC registration link |
| 3 | The four communities, each confirmed with its organisation before being named, and the LGAs they sit in |
| 4 | Direct and indirect beneficiary counts, with the basis for each |
| 5 | Which delivery partners are named, and how formalised each partnership is |
| 6 | Two support letters |
| 7 | A theory of change one-pager, which does not exist as a document |
| 8 | The start date, which follows the 19 November board |

## The full draft

Every question answered against their real form, inside the stated word limits, is at
`deliverables/qbe-stage2/asks/brian-m-davis-application-2026-09-11.md`. It was written before the
12 September route ruling, so the making, recycling and youth-employment figures in it need a pass
against the route above before anything is pasted into SmartyGrants.

Related: [[capital/the-blockers]] · [[investors/qbe-foundation]] · [[investors/tim-fairfax]] ·
[[investors/sefa]] ·
[[investors/snow-foundation]] · [[capital/the-money-model]] · [[governance/policies-register]] ·
[[impact/theory-of-change]] · [[communities/maningrida]] · [[products/stretch-bed]] ·
[[capital/what-we-no-longer-say]]
