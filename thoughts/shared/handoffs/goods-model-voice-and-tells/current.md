---
date: 2026-09-10T09:35:00+10:00
session_name: goods-model-voice-and-tells
branch: feat/ai-tells-gate-and-goods-model
status: handoff
---

## Locked, 11 September 2026: the four problem areas

The four areas that open the deck each have a typed module in `v2/src/lib/data/`, every figure
carrying what it counts, the period, a source URL and a grade, with the claim ceiling as a constant
and guards enforcing it. 766 tests, typecheck clean, production build passes.

| Area | Module | The line |
|---|---|---|
| Health | `rhd-problem.ts` | NT First Nations RHD 3,398.7 per 100,000; 506 new ARF diagnoses in 2024, 93% First Nations, 211 in children 5 to 14 |
| Environment | `recycling-problem.ts` | 87% of plastic straight to landfill; remote communities outside NT kerbside collection |
| Employment | `employment-problem.ts` | 35% of First Nations 25 to 64 employed in very remote against 62% in cities |
| Ownership | `ownership-problem.ts` | 68.4% Indigenous employment across 3,327 Supply Nation businesses against 3 to 5% |

**All four sources are external.** Before finding them I searched the shared CivicGraph project's
1,459 tables, the Goods v2 project's 75, this repo's wiki and deliverables, the
act-global-infrastructure wiki and `grantscope/data`. None hold RHD, recycling or employment
statistics. The sources are AIHW, DCCEEW, the Census via AIHW and the Supply Nation research brief.
Do not repeat that search.

**The join.** AIHW names household overcrowding as the risk factor for the Strep A to ARF to RHD
chain and defines it by the Canadian National Occupancy Standard, which is the standard the ABS
extract uses across 1,138 ILOCs. So per-community overcrowding is the risk measure itself. Arnhem
Land 70%, Central Australia 49%, against 15% nationally.

**Ready for the sheet.** `deliverables/qbe-stage2/pages/problem-tab-for-sheet.md` is a tab spec for
Codex to push. It reads the modules; the modules stay the source.

**Also fixed today.** `community-need.ts` widened from 9 mapped communities to the full 1,138-ILOC
reference, with the crosswalk as the only way in; Mount Isa persons-per-dwelling corrected from a
hand-typed 3.13 to the ABS 2.91. The employment figure moved off the withdrawn 6.5 hours to the
ruled 2, cutting the public impact tile from 3,510 hours to 1,080.

**The constitution now blocks four things at once:** Q12, Q22, whether Goods meets the 50%
threshold to be an Indigenous business, and IBA eligibility, where the test for a company limited
by guarantee is membership. Eloise has it. It is the highest-value unread document in the
organisation.

**Housekeeping:** `MEMORY.md` is 28KB against a 24.4KB limit and 32 index lines exceed the
one-line rule. It needs an `audit-memory` pass.

## Decision, 10 September 2026: how the funder and community picture gets built

Ben asked for Notion databases holding every funding opportunity, every past and potential
supporter, every community considered for beds with a confidence level, every possible facility
site, and community population and need.

**Ruling: build the decision read `GRANTSCOPE.md` already specifies, assembled from the systems
that own each fact. Do not create a Notion master.** A hand-maintained Notion database would be
the fifth copy of the funder list, and the contract says the system must read what is already
happening, and that maintaining another transactional model is what it exists to avoid.

**Most of it already exists.**

| What was asked for | Where it is | Rows |
|---|---|---|
| Funders, buyers, partners | `outreach-targets.ts` | 52 across 12 categories, last synced 16 March 2026 |
| Amount, stage, next action | GHL | the system of record |
| The live asks | Live sheet, Asks and Funding timing | 11 and 7 |
| Bed counts per community | `community-canonical.ts` | 11, guarded against the register |
| New communities and population | `expansion-targets.ts` | 16, with priority and housing body |
| Need | `community-need.ts` | 13, ABS Census 2021 overcrowding by ILOC |
| The join, with consent per field | `community-record.ts` | one record per community |

The 52 targets split as 28 funders, 10 buyers and 10 delivery partners.

**Four things have no home.** A confidence level against a named claim. Facility readiness for any
community beyond the three on the Facility plans tab. The link between a funder's money and whose
beds it buys. Past buyers as a list someone can work. Today they are ten invoices summarised on a page.

**Where it gets built.** `/admin/communities/[id]` is 901 lines and already renders the asset
register, documented demand, CRM deals, the partner, the production facility, community voices and
a Notion link. `/admin/funders/[slug]` exists alongside it. The work extends those two against the
six questions in `GRANTSCOPE.md`.

Against those six, the page already answers what was requested, what happened, and what the CRM
says. Three are missing. The CRM block does not say on its face that it is internal coordination and
carries no community consent. There is no next open action with a named holder. And there is no
evidence-health read.

**The distinction Ben has to hold.** A confidence level against one named claim is a judgement. The
same column across every community becomes a pipeline stage, which the contract forbids. They look
identical in a table, so confidence is stored against a claim and never as a bare community
attribute.

**Assumption to correct if wrong.** Judgement fields are typed in the admin page, which already
carries forms, and Notion stays where Ben writes prose. Nothing new goes into Notion.

**Open before building.** `outreach-targets.ts` is six months stale, so the funder half of the read
rests on rows that may have closed. Refresh it with the `funding-pipeline` skill before the funder
pages are trusted.

## Decision, 10 September 2026: availability at The Harvest

Ben set availability to **80%** for HARVEST. Enter it on the Facility plans tab, Availability row,
HARVEST column. It was `Capacity!B8` before the redesign and the row order is unchanged.

At 20 planning days and 3 modelled beds a day, the ceiling is 60 beds a month. 80% gives 48 a month
and 576 a year. There is no measured basis for the figure: the Production log is empty, so nothing
has a run-day history yet. The log's run-days column is what replaces this assumption with a
measured rate.

Leave NEW1 and NEW2 blank. They are proposals with no roster, and the sheet's own note says blank
until chosen.

**What follows.** The demand recorded in The plant is 630 beds, being ALIVE 100 in November, 400 of
first stock and Centrecorp 130 from December. At 48 a month that takes 13.1 months and lands about
January 2028. Clearing 630 inside twelve months needs 87.5% availability on one press, which is not
a rate a single-shift line holds. One press cannot deliver 630 inside a year, so the second press
now sets the schedule. At 12 press sheets a day, assembly becomes the limit at 5 beds a day, the
ceiling is 100 a month, and 80% gives 80 a month, which clears 630 in 7.9 months.

Nic was to raise the second 1200 x 1200 press with Sam at Defy on 14 September, per
`DEFY-ORDERS-2026-09-09.md`. That conversation now decides when the 630 can be delivered.

The Calculator tab keeps its own availability and starts at 100% when the site has no chosen rate,
so setting the site figure also corrects the Calculator, which currently shows 400 beds in 7 months.

## Decision, 10 September 2026: how the second press gets paid for

Ben's ruling: **go to Sefa, sized to the press and working capital, not the illustrative $200,000.**
Nic is authorised to pursue it.

The press is unpriced. Nothing in the repo or the sheet quotes a second press at The Harvest. The
two nearest anchors are module M11, a $32,780 Circularity bundle covering pressing, CNC and
finishing for a whole new plant, and the comparison in `DEFY-ORDERS-2026-09-09.md` to roughly
$22,500 of Defy panels. Nic's conversation with Sam at Defy on 14 September is what produces the
number, and the EOI cannot be sized until it exists.

**Why the QBE plants do not solve this.** NEW1 and NEW2 are both marked Proposed, neither has a
planned start date, and their money is not confirmed before 13 November. No part of the 630 is
allocated to them. Every one of those beds comes off The Harvest's one press, so the capacity
problem is independent of the QBE outcome.

**Why a loan fits here.** Repayable capital is allowed for plant, and for stock a buyer has ordered,
and never for gifted first stock. A press lifts The Harvest from 48 beds a month to 80 at the same
80% availability, so it is serviced from Goods' own margin on paid beds. Community resale proceeds
stay outside repayment, per the 8 September ruling.

**What this protects.** The bed hole stays at 54. Q5, Q6 and Q7 stay as written, fifteen days before
QBE closes.

**Open, and needed before an EOI goes anywhere.**

- A quote for the press, from Monday's conversation.
- Affordability, which is Matt review item 8 and still unresolved.
- No EOI has ever been sent. Joel Bird offered to review one on 25 August.

**Consequence for the sheet, once the quote lands.** Funding timing F06 carries Sefa at $200,000 as
a possible receipt in scenario month 1, and that figure is part of the $900,000 of forecast receipts
across 36 months. Re-sizing the loan changes both. Leave F06 alone until there is a real number.

## Latest update: visual Sheets redesign, 10 September 2026

Start on Home (gid=140), then Calculator (142) and Charts (141). Home C7/G7 controls site/month; preserved Production detail (130) follows these selections. The Calculator is an independent scenario, including second-press checkbox and editable availability, with no override of actual capacity. Stock counts, Production log and Cost log are native Sheets tables with filters and typed columns. Supporting notes and advanced assumptions are collapsed, not removed.

See the production-tracker README below for the updated entry routine and verification. Sixteen behavioural checks passed in a temporary copy, which was deleted. Live source counts were preserved and checked formula ranges had no errors. No commits or pushes. Earlier descriptions of the first tabs are superseded by this section.

## Latest update: production tracker, 10 September 2026

The live sheet now starts with The plant (gid=130), Capacity (131), Stock counts (132), Production log (133) and Cost log (134). Start with `deliverables/finance/goods-financial-plan/production-tracker-2026-09-10/README.md` for the entry routine, count qualifications and test evidence. Plant budget and Capacity basis preserve the earlier tables and references.

The 9 September source count is loaded: 81 cut plastic sets, 87 with weighed shred, 143 with estimated recovery. Finished beds and bought parts remain uncounted. The 20 kg net-new shred loop is explicit. The cost log remains empty and does not post automatically into Monthly cash. The original workbooks are unchanged. Tests passed in a separate copy, which was deleted. No commits or pushes.

## Latest update: working original and Matt review, 10 September 2026

The Google Sheet is populated and editable through the Google Drive connector. The service-account sharing blocker below is historical. Start with `deliverables/finance/goods-financial-plan/review-2026-09-10/REVIEW.md` for the current state.

The supplied working original preserves Matt's five entity-model tabs. All 27 Open Items are mapped in the live sheet, with a one-item Review together tab at gid=124. The live factory BOM now includes $80 labour once. The earlier claim that NM plus $40 was the same cost basis was corrected. Named funding tranches now drive monthly receipts and loan service. Snow remains an undated $100,000 ask; no payment date was invented.

Production purchases and labour still need reconciliation into cash. Opening balances and site-specific costs remain open. Original workbooks and the detailed master were preserved. Local Q6/Q18 and page source corrections are uncommitted and unpublished.

# Work Stream: goods-model-voice-and-tells

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-11T17:40:00+10:00
**Goal:** The QBE Stage 2 application goes in by Friday 25 September at noon carrying one model that
holds together. Done when every question is answered or assigned to a named person, every figure
traces to a source, and nothing ships with a writing tell.
**Branch:** feat/ai-tells-gate-and-goods-model in worktree `/Users/benknight/Code/goods-finance-wt`.
**36 commits, pushed 11 September. No PR open.**
**Test:** `cd v2 && ./node_modules/.bin/vitest run && ./node_modules/.bin/tsc --noEmit -p tsconfig.json && npm run build`
**Before publishing anything:** `node tools/check-ai-tells.mjs <file>`

## The landing list, 11 September 2026

The QBE Control Room now opens with it. Sixty-eight claims on that page, **eleven unresolved**, and every
one sits in finances by buyer, costings, the production facility or the ask. Nothing else blocks the
application.

## Walked the nine written answers, 11 September 2026

Three problems, found by reading each answer against what is now locked.

**Q9 contradicted itself and is fixed.** Its impact table carried a money row of up to $750 while
the prose underneath said "the money row is deliberately absent from that table". The table was
updated after Ben's 10 September ruling and the prose was not. It now says the community keeps the
full sale price, that Goods keeps $474 on a bed it sells itself, and that what no community has
settled is how many of its beds it sells and how many it places.

**Q6 states a siting rule no site meets. NEEDS BEN.** It says a plant goes where a community has
200 beds a year of recorded need. The largest open record is Utopia at 150. Groote's 500 is logged
as exploring after one meeting. Maningrida is 65 and Palm Island is 40. Either the rule changes or
the sentence does.

**Q7 says Palm Island is where the recorded demand is largest. It is not. NEEDS BEN.** Palm Island
has 40 beds of open recorded demand, fourth behind Groote, Utopia and Maningrida. What Palm Island
does have is 131 beds already deployed, third of eleven communities, and seven cleared voices, more
than anywhere else. There is a real case for Palm Island going first, and the sentence makes a
different one.

Deployed beds by community, register read 11 September: Tennant Creek 160, Utopia 147, Palm Island
131, Maningrida 58, Kalgoorlie 20, Alice Springs 16, then Kununurra, Mount Isa and Canberra at 2
and Katherine and Darwin at 1. Total 540.

**Google Sheet access confirmed.** `1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y`, "Goods on Country
| Management and finance", owner hi@act.place, reads in full through the Drive connector at 177,823
characters. The service-account blocker is historical and Codex can work against it.

## Where the QBE application stands, 11 September 2026

Both artifacts are current. Q10 was rewritten today because the reconciliation it promised closed.

| State | Count | Which |
|---|---:|---|
| Written and checker-clean | 9 | Q5, Q6, Q7, Q8, Q9, Q10, Q18, Q19, Q23 |
| Document owed | 8 | Q3, Q4, Q11, Q14/Q15, Q19's six files, Q20/Q21, Q22 |
| A person must answer | 5 | Q13, Q16/Q17, Q24, Q25 |
| Not started | 1 | Q12, blocked on Butterfly's constitution |
| Ready, needs its records | 1 | Q1/Q2 |

**Q10 rewritten.** The old answer printed "ten invoices, 320 beds, $343,481" and "Centrecorp, for
Utopia, 130, paid and delivered", and said the reconciliation was still owed. It now reports 320 beds
across five invoices to four organisations settling for $273,966, and reports the reconciliation:
167 bought, 147 deployed, 20 waiting, with the two-different-147s caution carried in the answer
itself. **Q19's trade sentence corrected** the same way.

**Deck slide 12, frame LX4ci, is "Demand and buyers"**, which is the slide S12A and S12B replace. It
is the last place the 130 survives.

## Closed, 11 September 2026: freight, against real numbers

Two estimates were being chosen between. There are three real freight figures and all are Maningrida.

| | Beds | Net | Per bed |
|---|---:|---:|---:|
| Charged to Homeland, Brisbane to Darwin to Maningrida, INV-0303 | 40 | $5,900 | **$147.50 at most** |
| Quoted to Mala'la then discounted in full, INV-0283 | 13 | $3,200 | $246.15 |
| Paid to Sea Swift in that window, bill 5732 2163 022 | 13 | $2,322.17 | $178.63 upper bound |

**Use $150.** It is within $2.50 of what a real 40-bed run was charged. **$100 has no source.** The
Sea Swift bill's only line reads "." so it cannot be shown to carry those 13 beds alone; its per-bed
figure is an upper bound on that run.

**Freight per bed falls with volume**, $147.50 across 40 against $246.15 quoted across 13, to the same
place. No single constant is right at both ends.

**It matters less than it looked.** Under the price model the buyer pays freight at cost on its own
line, so the printed break-even stays at **628** beds. The 796 and 918 figures belong to the case where
Goods carries freight, which is a sensitivity.

## Closed, 11 September 2026: the Centrecorp reconciliation

Q10 owed this since it was written. It ties exactly and nothing is missing.

| Invoice | Beds | Batch | Where they are |
|---|---:|---|---|
| INV-0259 | 60 Basket | GB0-148, 60 units | 60 deployed, Utopia |
| INV-0291 | 107 Stretch | GB0-156, 107 units | 79 deployed Utopia, 8 deployed Alice Springs, **20 ready Alice Springs** |

**Centrecorp bought 167 beds. 147 are in households. 20 are made and waiting at Alice Springs.**
That is the whole gap. 130 is the quantity on quote QU-0014 from May 2026, unpaid, and deck slide S12
prints it as paid and delivered.

**The trap: there are two 147s and they are not the same beds.** Utopia's community total is 147 and
Centrecorp's deployed total is 147. Utopia holds 60 Basket and 79 Stretch from the Centrecorp batches
plus 8 Stretch from batch GB0-152, which Centrecorp never paid for. Centrecorp's 147 includes 8 beds at
Alice Springs and excludes those 8. **Only 139 beds are in both.** Never use one as evidence for the other.

**New, smaller thread: batch GB0-152, 15 units**, 8 at Utopia and 7 at Tennant Creek, supplied December
2025, with no invoice in the buyer record covering it. Gifted stock, or a sale nobody has traced.

**Counting note.** The register is counted in UNITS, not rows: one row can carry a quantity above 1, which
is why 571 deployed rows are 572 units and why a row count gives 176 Stretch Beds against canon's 177.
`check:asset-drift` is green and canon at 540 is right.

**Two closed today** when Xero came back and the invoices were read line by line. ALIVE is $101,200 for
100 beds at $800, settled 20 August, and the $75,000 figure was never on an invoice; the separate $66,000
is a storytelling contract carrying no beds. **One opened**: Centrecorp paid for 167 beds across two
invoices, the register says 147 and deck slide S12 prints 130, which is the quantity on unpaid quote
QU-0014.

**Monday 14 September is the hinge.** The board minutes Kristy's declaration, which closes Q8. Nic asks
Sam at Defy what a press costs, which is the first real number under the $150,000 plant allowance and the
only thing that can size the Sefa approach. One day closes or informs four of the eleven.

**Five of the eleven closed on 11 September** and six are left. The six that stay open after Monday: Snow at 57% untraced to a cell, twelve unpriced cost lines,
opening cash unknown, 36 kg against a stale D06 of 40, capacity 360 against 400, and the four pool
communities.

### Now
[->] Three rulings on S12A and S12B, written at the bottom of the Notion deck master. S12 prints
    130 Centrecorp beds as paid when 130 is a quote quantity; section 5 says ALIVE does not buy
    beds when ALIVE is the largest paid bed order; section 5 keeps Tennant Creek and Groote out of
    the demand schedule when they are 523 of the 778.

### This Session
- [x] Live sheet read path proven through the Google Drive connector. The service-account blocker is historical.
- [x] All five published artifacts corrected: the retired 50% split, the Snow ask on every table, 1,440 beds a year fixed to 1,200 for the assembly ceiling, the FY26 basis named, the plastic figures on the 21 and 15 kg basis.
- [x] Q19 drafted, 538 words, checker-clean, six owed documents named. Nine of 25 answers drafted.
- [x] Availability set at 80%, so 48 beds a month, and the 630 of demand takes 13.1 months on one press. The second press sets the schedule; Sefa is the route, sized to the press.
- [x] Decision read live on `/admin/communities/[id]`: CRM coordination notice, evidence health in six states, no score.
- [x] Framework built: `place-decision`, `place-evidence`, `place-denominator`, `place-feedstock`, `place-framework`. The denominator is community-set and the ABS derivation is unbuildable.
- [x] `community-need.ts` widened to the full 1,138-ILOC reference with a nine-entry crosswalk. Mount Isa persons-per-dwelling corrected from 3.13 to 2.91.
- [x] Employment moved off the withdrawn 6.5 hours to the ruled 2. The public impact tile fell from 3,510 hours to 1,080.
- [x] The four problem areas locked in code with guards: `rhd-problem`, `recycling-problem`, `employment-problem`, `ownership-problem`.
- [x] Funder refresh: FRRR SRC Round 30 closes 17 September, and Butterfly being a charity opens grants a Pty Ltd could not enter.
- [x] Snow reconciled against Xero, which is reachable again.

## Locked, 11 September 2026: demand and buyers

`v2/src/lib/data/demand-and-buyers.ts`, 26 guards, taken line by line from five settled Xero
invoices and the `community_demand` table. The four buyers with real paid trade, what each paid,
and the open demand held apart from it.

| | Beds | Per bed | Paid inc GST | Facilitation |
|---|---:|---:|---:|---:|
| Centrecorp INV-0259, Aug 2025, Basket Bed v1.3 | 60 | $370 | $37,620 | $12,000 |
| Mala'la INV-0283, Oct 2025, Basket Bed v2.1 | 13 | $380 | $5,434 | none |
| Centrecorp INV-0291, Nov 2025, Stretch Bed | 107 | $560 | $85,712 | $18,000 |
| Homeland INV-0303, May 2026, Stretch Bed | 40 | $750 | $44,000 | $8,000 |
| ALIVE INV-0342, Jul 2026, Stretch Bed | 100 | $800 | $101,200 | $12,000 |
| **Total** | **320** | | **$273,966** | **$50,000** |

$247,770 excluding GST, of which $197,060 is bed lines. **$50,000 of community-build and
program-support time has been billed and settled alongside the beds**, which is what puts a
price on the facilitation ask that a buyer has already met.

**Value foregone, $17,390.** $14,190 of in-kind partnership deducted on the Homeland invoice, and
$3,200 of Mala'la shipping quoted on its own line and zeroed. The two are kept apart in the module
because only the first changed a total.

**ALIVE also owes $66,000** on INV-0341, a twelve-month Empathy Ledger contract raised the same day
as the bed order and past its 30 July due date. No beds on it. A receivables list reads worse than
the bed trade does, so the slide's speaker notes carry it.

**Demand, from `community_demand`, seven rows.** 778 open beds once the 107 paid Centrecorp beds
come out: Groote 500 (exploring, one meeting, 64% of the total), Utopia 150 (beds for every child,
no name), Maningrida 65 (Homeland Schools Co., who have paid before), Palm Island 40 (a partner
update), Tennant Creek 20 (Dianne Stokes, offered to self-fund) and Tennant Creek 3 (Norman Frank,
maroon). **Twenty carry a person and money. 758 are conversations.**

The shared project's 4,562-row buyer table stays out until Palm Island's postcode 4895 is fixed.

### Next
- [ ] Ben rules on the three at the top of this ledger, then one Pencil build pass on S12A and S12B.
- [ ] Open the PR when Ben gives the verb. The branch is pushed; the PR is the Tier 3 half.
- [ ] Codex: push the problem tab into the live sheet from `deliverables/qbe-stage2/pages/problem-tab-for-sheet.md`.
- [ ] Butterfly's constitution from Eloise. It blocks Q12, Q22, the 50% Indigenous-business threshold and IBA eligibility.
- [ ] Q19's six documents: a site letter and quote basis per plant and a cash milestone schedule from Nic, Kristy's minute, the applicant cashflow.
- [x] `audit-memory` pass done 11 September: MEMORY.md 26,953 bytes to 9,386, no index line over 200 characters, July and August archived verbatim to `goods-resume-archive-2026-08`.
- [ ] Apply `deliverables/qbe-stage2/fixes/palm-island-buyer-key-2026-09-11.sql` against project `tednluwflfhxyucgwigh`. Reversible, transactional, reads back 21 rows before commit. Blocked in auto mode, so Ben runs it.
- [ ] FRRR SRC Round 30 by 17 September, or Round 31 by 3 December.
- [x] GHL stage corrections written 11 September on Ben's word: Snow first-mover `ZzPJCLAq3nkAo0bG7ot3` moved Ask made to **Identified**; Minderoo `zQZWXJyILdvzwm8OACPr` moved Ask made to **Declined / Parked**, which is the pipeline's word for paused. Both stages set in two places, the pipeline stage and custom field `QbfHdeNpz2JiMe5iRESS`, because the row carries the stage twice.
- [ ] Two GHL dollar figures held until Nic's Defy conversation on Mon 14 September, both flagged to Ben and agreed: **Sefa stays at $300,000** until the press has a price, because the 10 September ruling sizes the loan to the press and the press is still unpriced. **Snow's first-mover row stays at $150,000** against the $100,000 ask ruled on 10 September that moves the bed hole from 187 to 54; the row's own next-action note already asks whether $150,000 is current.
- [ ] Sefa row `hBRVkCMhT93215aqTRRr` disagrees with itself: pipeline stage Cultivating, custom field `QbfHdeNpz2JiMe5iRESS` says "Signal", which is not a stage in this pipeline. Not touched, because only the two stage corrections were authorised.
- [ ] Nic: Centrecorp's position. Section 5 of the deck master says they declined further funding; QU-0014 quotes 130 beds in May 2026.

### Decisions
- Demand and trade are two different records and are never added. A paid invoice says what a buyer did, not what they will do next; a demand record is what somebody said, with a date and a name.
- Recorded demand goes on the slide with its status attached. The distance between the twenty owned beds and the 758 conversations is the facilitation money, and hiding it removes the reason to fund the trips.
- Availability 80% at The Harvest, so 48 beds a month, and the second press sets the schedule.
- Sefa for the second press, sized to the press rather than the illustrative $200,000.
- The funder and community picture is the GrantScope decision read, not a Notion master.
- A bed denominator is set by a community with a rule and a name, never derived from overcrowding.
- The problem section leads with health, and overcrowding is the shared risk measure under all four areas.

### Open Questions
- UNCONFIRMED: freight is $100 in the sheet and $150 in the cost engine, which moves break-even from 796 to 918.
- UNCONFIRMED: GHL holds Snow historical at $397,384.91 against $375,000 published, reconciling to nothing.
- UNCONFIRMED: the 19 May Snow grant letter names A Curious Tractor while INV-0321 sits in the sole trader's ledger.
- UNCONFIRMED: $127,455.12 of Snow FY26 money should be in the A Curious Tractor Pty Ltd Xero org, which nobody has read.
- CONFIRMED 11 September: Palm Island's `goods_communities` row carries postcode 4895, which is Cooktown, and all 17 linked buyers are Cape York and Cooktown bodies. The 21 real ones sit in `gs_entities` under lga_name 'Palm Island', postcode 4816. Repair script written and unapplied.
- CONFIRMED 11 September: the wider table is worse than one row. Of 4,551 links, 3,255 carry an `entity_id` that resolves to nothing and 1,231 more disagree with their community's postcode. Fixing Palm Island does not make the table trustworthy.
- UNCONFIRMED: Utopia has three bed counts. The register says 147, the two Centrecorp invoices say 167, and deck slide S12 says 130. Only the invoice figure was checked this session.
- UNCONFIRMED: nobody has viewed the evidence-health block in a browser beyond the rendered text I read.

### Traps

- **The master workbook is saved with no cached values on purpose.** `openpyxl` with
  `data_only=True` returns `None` for every formula, including the whole `Statements` roll-up.
  Recalculate a copy first: `soffice --headless --convert-to xlsx --outdir <tmp> <copy>`,
  LibreOffice at `/opt/homebrew/bin/soffice`.
- **The writing-tells gate is a gate, not a judgement call.** `node tools/check-ai-tells.mjs <file>`
  before anything is published. Never defend a flagged phrase by where it came from. Quotations are
  exempt. Keeps go in `tools/ai-tells-allow.txt` with a reason.
- **A local page preview needs a charset.** python's `http.server` sends HTML without one, so prepend
  `<!doctype html><meta charset="utf-8">` to a preview copy or the page shows mojibake the published
  artifact never had. Add a cache-busting query when reloading it.
- **`ntn api --file <path>` is a file upload, not a request body.** Use `-d '<json>'` and keep
  `stdin=DEVNULL` on every write or the call hangs.
- **A node added to Pencil with `Insert` does not paint until the file is saved and reopened.**
  `Copy` paints immediately, so build by copying a sibling and overriding its properties.
- **34 external-tier voices with approved quotes** extract cleanly with
  `node --experimental-strip-types` importing `v2/src/lib/data/storyteller-registry.ts`. Palm Island
  has seven, which matters because Palm Island is plant one. Kristy Bloomfield is cleared as a person
  and is never quoted for Goods: her quotes trace to other projects.
- **Xero is reachable again** as of 11 September, after three sessions of it being down. The
  connected org is Nicholas Marchesi sole trader, ABN 21 591 780 066. A Curious Tractor Pty Ltd
  is a SEPARATE org and is not connected; $127,455.12 of Snow FY26 money is probably in it.
- **`v2/` in this worktree now has node_modules and a copied `.env.local`.** The env file is
  gitignored so it does not travel with a worktree, and the build fails on an unrelated admin
  page without it.
- **The problem data is EXTERNAL.** Five internal searches across two Supabase projects, two
  wikis and grantscope/data found no RHD, recycling or employment statistics. AIHW, DCCEEW, the
  Census and Supply Nation hold them. Do not repeat that search.

---

## Paste this into the next session

> Read `thoughts/shared/handoffs/goods-model-voice-and-tells/current.md` first. It is the single
> entry point.
>
> Work in the worktree `/Users/benknight/Code/goods-finance-wt` on
> `feat/ai-tells-gate-and-goods-model`. The main tree is on another session's branch with hundreds of
> modified files; do not commit there.
>
> Two pages are published and are the working surface. Edit them by reading the artifact URL, or from
> the stripped sources in `deliverables/qbe-stage2/pages/` plus `rebuild-pages.py`, then publish with
> the same `url` so the link is kept.
>
> The one blocked thing is the live Google Sheet. It exists, Ben can write to it, and it needs the
> service account `subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com` added as an
> editor. Then push the twelve tabs in with the Sheets API. The handoff records every route that was
> tested and why the others are closed.
>
> Before writing any prose for a slide, a funder document or a public page, run
> `node tools/check-ai-tells.mjs <file>`.
>
> QBE closes Friday 25 September at noon. Eight of 25 answers are written. Q19 is the last hard
> blocker and Nic holds it.

### The model in four answers

**What is a bed worth?** $750 at the factory door. $276 to make, which is $235.74 on the annual-staff
basis plus the $40 assembly allowance, with $80 of paid making inside it. $474 stays with Goods.
Freight is charged on top at cost, its own line per community, paid by whoever buys the bed. A price
model, and the organisation is never divided by beds alone.

**What is being asked for, and by whom?** The Butterfly Movement Ltd, trading as Goods on Country, is
the applicant and the recipient. Directors are Kristy Bloomfield, Audrey Deemal and Jeremy Donovan.
QBE is asked for $300,000 to build two plants at $150,000 each, working choices Palm Island and
Maningrida, with $150,000 for one plant as the smaller case. Beds are separate: 400 of first stock, of
which Tim Fairfax covers 133, Brian M. Davis 80 and a Snow ask 133, leaving 54 to find. Alice Springs
is funded through Oonchiumpa and sits outside the raise.

**What already runs without any of it?** 320 beds sold and paid across ten invoices, $343,481 all
time. FY26 Goods receipts were $653,246, of which Snow was $375,000, or 57%, and that share has never
been traced to a workbook cell. FY26 whole-ledger income was $1,640,724 against $1,472,755 of
expenses, a net $167,970 before founder wages. Never call that a net loss.

**What does one bed do?** Two hours of paid making. 36 kg of shred through the press, 20 kg of it in
the finished bed. The full sale price kept in the community when the community sells it, per Ben on
10 September. One person off the floor. Health is the reason the hardware exists and is never claimed
as an outcome.

### The calendar that governs everything

| When | What |
|---|---|
| Mon 14 September | Butterfly board. Minute Kristy's related-party declaration |
| Fri 25 September, noon | QBE Stage 2 closes. Brian M. Davis closes the same day |
| 6 and 7 October | QBE interviews |
| Thu 9 October | Tim Fairfax SmartyGrants deadline, 5pm |
| 23 October | QBE conditional outcomes |
| 13 November | QBE preconditions date |
| 19 November | Brian M. Davis board |
| Late November | Tim Fairfax decides |

The last three are the problem: both bed funders decide after QBE needs its conditions satisfied.
Q18 puts that question to QBE directly.
