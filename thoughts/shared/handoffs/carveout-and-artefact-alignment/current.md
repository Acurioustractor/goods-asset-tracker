---
date: 2026-09-17T00:00:00Z
session_name: carveout-and-artefact-alignment
branch: feat/empathy-ledger-accountability-events
status: active
---

# Work Stream: carveout-and-artefact-alignment

## Ledger
**Updated:** 2026-09-17
**Goal:** Get every application's finance and artefact needs into one scoped ask, and finish
the five live applications. Done when QBE and Brian M. Davis are submitted by 25 Sep 12pm.
**Branch:** feat/empathy-ledger-accountability-events (48 behind main, nothing committed)
**Test:** docs and Notion only, no build. Voice check by hand, `tools/check-ai-tells.mjs` is
NOT on this branch (it lives on `feat/ai-tells-gate-and-goods-model`).

### Now
[->] Work the QBE artefact list one at a time, writing each Notion row as it clears and
flagging every time one also closes a row on BMD, TFFF or SEFA.

### This Session
- [x] Reconciled the FY26 Goods carve-out. **Ben's 5 Sep file was $590,091.45 of which
      $276,131.72 (46.8%) is philanthropy invoiced as sales.** Real FY26 Goods trading income
      is **$313,959.73 ex GST, 13 invoices, 7 organisations**. Xero ACT-GD trading cut is
      $281,410.92, so **$32,548.81 of trade does not carry the Goods code**.
- [x] **Email SENT to Dijane at Standard Ledger** with six diagnostic questions and a six-item
      scope. Letter approved at $300 + GST, addressed To whom it may concern so one PDF serves
      five applications. Vanessa and Nic copied.
- [x] Pulled the full applications database and Artefact Register. Counts cross-check against
      the Notion page (QBE 24, TFFF 14, BMD 11, SEFA 9).
- [x] **Ten Notion artefact rows updated** with new findings.
- [x] Drafted both Brian M. Davis support letters.

### Next
- [ ] One email to Eloise and Zandra: was the audited FY26 set signed off at the 14 Sep board
      meeting? It decides whether QBE gets the audited or unaudited version.
- [ ] Rule on the two open questions that block three artefact rebuilds: the washing machine
      count, and 399 v 400 beds.
- [ ] Chase the ASIC name lodgement, or write "The Butterfly Movement Ltd, trading as Goods on
      Country" on the forms.
- [ ] Settle the AGM date.
- [ ] Ben's eight quick artefacts, all under thirty minutes each: contact schedule, annual
      report decision, peer referee, BMD budget template, charity registration pack, Catalysing
      Impact letter entity check, funder bundle, attach the funder model workbook.
- [ ] Send the two BMD support letters to Nic Sharah and Kristy Bloomfield for their own words.

### Decisions
- **Certify trading income only, grants on a separate line.** Including the $55,197 as Standard
  Ledger proposed would make "Goods income" 51.3% grants, double-counted against the $772,788
  grants figure in the same pack.
- **Never adjust Xero to match the carve-out file.** The file is a customer-name filter, the
  code is the ledger. Coding is corrected first, then the letter is written.
- **$713,827 comes off all five applications** until Standard Ledger rules on whether the June
  cut swept in more foundation invoices. Lead with the paid bed trade instead.
- **Support letters are delivery-partner letters, not referees.** Referees are explicitly not
  required below $100,000 and the BMD ask is $99,750. Explicit about the role, indicative about
  the number, conditional on award.
- **Kristy Bloomfield's letter declares her Goods on Country directorship.** Arm's length
  alternative from the same organisation is Tanya Turner.

### Open Questions
- UNCONFIRMED: was the audited FY26 set signed off on 14 Sep? Eloise on 7 Sep said the audit
  "might be complete by the 25th"; Zandra on 8 Sep said it should be done that week. The key
  dates table still says 1 October.
- UNCONFIRMED: **AGM date.** Notion, the QBE answers, artefact 05 and TFFF's blocker text all
  say 12 October. The live board thread on 16 Sep has Zandra saying "definitely Thursday the
  15th or Friday the 16th", Audrey confirming the 16th, unresolved that day.
- UNCONFIRMED: the $32,548.81 gap. Red Dust $14,500 plus Our Community Shed $18,422.73 is
  $32,922.73, which is $374 off, so not cleanly those two.
- UNCONFIRMED, hypothesis only: $713,827 less the file is $123,735.55, and the remaining FY26
  foundation invoices total about $124,300 (Regional Arts, Dusseldorp, Just Reinvest, Social
  Impact Hub). If that is what June swept in, retire the figure permanently.
- OPEN, Ben's call: washing machine count (blocks artefacts 04 and 11) and 399 v 400 beds
  (blocks 11 and 12).

### Workflow State
pattern: sequential
phase: 2
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "align every application's needs, finish the live applications"
- resource_allocation: balanced

#### Unknowns
- audit_signed_off: UNKNOWN
- agm_date: UNKNOWN
- asic_name_change: UNKNOWN

#### Last Failure
(none)

---

## Context

### Verified facts established this session

**Xero.** Only ONE organisation is connected: **Nicholas Marchesi** sole trader, org id
`786af1ed-e3ce-42fc-9ea9-ddf3447d79d0`. A Curious Tractor Pty Ltd is NOT connected, so the ACT
P&L and balance sheet cannot be checked from here. FY26 total income $1,640,724.46, net profit
$167,969.63, **cost of sales $0.00**, Other Revenue $1,371,344.10 which is 83.58% of income.

**The carve-out.** Trading by buyer, ex GST: Centrecorp $112,120.00 (INV-0259, INV-0291),
Ingkerreke $93,727.00 (INV-0275 to INV-0278), Homeland School Company $38,710.00 (INV-0303),
Julalikari $31,540.00 (INV-0282, INV-0335), Our Community Shed $18,422.73 (INV-0260, INV-0308),
Red Dust $14,500.00 (INV-0255), Mala'la $4,940.00 (INV-0283). Total **$313,959.73**.
Grants inside the file: Snow $225,040.80 (INV-0258, INV-0268, INV-0321), Vincent Fairfax
$50,000.00 (INV-0253), John Villiers $1,090.92 (INV-0327). Total **$276,131.72**.

**ABN Lookup, checked 17 Sep, 22 155 132 684.** Entity name is still **THE BUTTERFLY MOVEMENT
LTD**. "Goods on Country" is a registered business name from 23 July 2026, not the company
name. DGR from 17 Jan 2012, income tax exemption 31 Jan 2012, GST concession 31 Jan 2012, FBT
exemption 29 Mar 2012. Those four dates answer Mazda's DGR and ITEC field today.

**Already in the inbox, not missing.** Eloise sent `2026 Financial Report - Taboo Foundation.pdf`
on 7 Sep and confirmed Nic has charity Xero access. Zandra circulated the 14 Sep board minutes
on 14 Sep, August minutes 1 Sep, July minutes 24 Jul, and a board resolution with the agenda on
17 Jul. Zandra sends from `alexandraemcgee@gmail.com` as well as her CBRE address, which is
part of why these did not read as delivered.

**ALIVE is inside the 320 paid beds, not additional.** The BMD answers record 100 beds paid up
front by the ALIVE National Centre at the University of Melbourne in August 2026. With
Centrecorp 167, Homeland 40 and Mala'la 13 that is exactly 320. Ben confirmed 17 Sep the
remittance is in and the roll-out runs over six months.

**The debt lane.** Eight lanes worth about $1,710,000 all list the same missing item in
different words: SEFA $150K, Invest NT $400K, CEFC via NAB $250K, Bank Australia $250K, White
Box SELF $250K, Tripple $250K, LendForGood $100K, Metro Finance $60K. One A Curious Tractor
financial pack unblocks all of them. The four-year P&L artefact was moved from Ben to Standard
Ledger for this reason.

### Traps to carry forward
- **BMD pays only when all project funding is confirmed.** Their $99,750 is contingent.
- **Mazda's 66 beds must be distinct from BMD's 133.** Two applications five days apart.
- **Anita's 23 July condition** gates BMD: a dated Butterfly board resolution on the 12 Sep
  ruling before the full Board sees it. Committee October, Board 19 November.

### Files written this session (both UNTRACKED, nothing committed)
- `thoughts/shared/reviews/2026-09-17-goods-fy26-carveout-reconcile.md`: the reconcile, the
  application and artefact review, and the sent email in section 9.
- `thoughts/shared/drafts/2026-09-17-bmd-support-letters.md`: both letters.

### Notion rows updated (10)
ASIC and ACNC extracts · Charity registration and DGR · Sole-trader trading record FY24 to FY26
· Four-year P&L FY23 to FY26 (owner moved to Standard Ledger) · Board resolutions and minutes
(Missing to Partial) · FY26 financial statements · Management accounts to 15 September ·
Organisation structure and staffing (AGM conflict) · Private funder bundle (ALIVE) · Support
letters.
