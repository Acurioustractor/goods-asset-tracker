# GOC entity model — handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-03T07:00:00Z
**Goal:** Answer all 22 open questions in Matt Allen's GOC entity model and give Ben a version of
the whole model he can explain to anyone. DONE — both PRs merged, all surfaces live.
**Branch:** `main` = `231cb2d` (PRs #198, #199 merged). Working tree ON MAIN and clean.
**Test:** `cd v2 && npm test && npm run check:drift:ci && npm run build`

### Now
[->] Nothing in flight in code. The open items are conversations, not commits.

### This Session
- [x] **PR #198 MERGED** — the GOC entity model as code. `tools/build-goc-answered-workbook.py`
      generates all 8 tabs from scratch; `tools/push-xlsx-to-gsheet.py` pushes to the live Sheet.
      The workbook is a BUILD ARTIFACT, gitignored. Figures live in code with their status grades.
- [x] **PR #199 MERGED** — a month of uncommitted working-tree work: GRANTSCOPE.md, the impact
      system (+3,573 lines with tests), August ledger drafts, 20 brand illustrations PNG→JPG,
      the QBE close date sourced to Jay Boolkin 14 July 2026.
- [x] **All 22 open questions answered**, each with the figure to use, a status grade and an owner.
- [x] **The expense split Q10 said needed an accountant was a query.** $337,296 opex /
      $41,547 capex across 380 lines, from the Xero mirror.
- [x] Five cross-linked Notion pages, hub at
      https://app.notion.com/p/3b1ebcf981cf81089414ca80aea46795
- [x] Live Sheet, 8 tabs, formulas evaluating:
      https://docs.google.com/spreadsheets/d/1pMbW1P85ejKVeu-oAYx_SmawbFJHOk3Cb7D7vK-ecF0
- [x] `wiki/canon/SOURCES.md` corrected — it told every session the Xero mirror was empty.

### Next
- [ ] **REPLY TO MATT.** He chased 2026-08-03 06:20 and has not been answered. A full draft
      exists in the 2026-08-03 session transcript. Not sent, not in Gmail drafts.
- [ ] **Share the Sheet** with matt.allen@socialimpacthub.org and malcolm.aikman@socialimpacthub.org.
- [ ] **Two phone calls.** Nic: which entity or card paid for the CNC router, or is it financed?
      Bookkeeper: why were the two Telford Smith lines voided on 23 Dec 2025, and is it one
      machine or two ($19,800 vs $39,600 in opening PP&E)?
- [ ] **Book the measured production week.** ~$2,250, five operator days plus ~125L diesel, and
      the beds still sell. Locks $425.74 and closes three questions at once. Cheapest open item.
- [ ] **The COGS reclassification.** ~$90,852 of Defy manufacturing spend sits in Consulting &
      Accounting and Advertising & Marketing. Worth fixing before Matt builds the P&L on it.
- [ ] Community one-pagers on the production facilities. Utopia is the natural first: their ask
      is the clearest and the module pricing already exists ($56,600-$103,300).

### Decisions
- **Figures live in code, never in the spreadsheet.** The workbook is generated. Editing the
  Sheet for a FACT creates a second source of truth outside the drift guards. Moving a dial
  during a call is fine and expected; that is what the Sheet is for.
- **The generator is self-contained** and deliberately does NOT read Matt's emailed .xlsx. A
  generator whose output depends on which download is on disk is worse than no generator.
- **Sunk plant is $110,046 graded `workpaper`**, not $75,000 `evidenced`. The $75,000 is a
  bill-level hardware subtotal INSIDE it (`cost-model-scenarios.ts:157`). The Known Other Costs
  tab now nests them so they cannot be read as alternatives again.
- **The investor ask is turnkey scope**: ~$275,000 per site fully funded ($207,450 capex +
  $38,387 working capital + $28,791 ramp). The $112K-$222K range is MVF scope on second-hand kit
  and is not what a funder is being asked to buy. Quote one scope and name it.
- **Screenshots do not go in git.** ~13MB of review and QA PNGs ignored; the findings are text.

### Open Questions
- UNCONFIRMED: whether the Telford Smith entry is one machine or two. Decides $19,800 vs $39,600.
- UNCONFIRMED: which entity paid for the CNC router. A Multicam is $30-80K new, so this is a
  larger hole in opening PP&E than the shredder.
- OPEN: demand. No signed FY27 bed orders. 500 beds/yr is a PRODUCTION rate, not a forecast.
- OPEN: three August ledger drafts blocked by the consent gate (Mykel, Dorrie Jones, Jahvan Oui).

---

## The one thing to carry forward

**Goods costs about $280,000 a year to exist, plus about $425 per bed. Beds sell for $750.**

So whole-company break-even is about 860 beds a year, one site plans 500, and therefore:

> **Goods works at three sites. Everything before that is getting to three sites.**

The −$28,791 at one site, the 487-bed all-in break-even and the $800K raise (≈ three sites) are
three ways of saying that. It survives the tagged history being loose because it does not
depend on it.

## The trap in the Xero data

136 of 204 ACT-GD FY26 spend rows carry status `DELETED` ($229,127), almost certainly Dext
re-imports. A query that does not filter on status overstates roughly threefold. And
`xero_bank_transactions` is seven months stale with no ACT-GD tracking — use `xero_transactions`.
Full detail in `wiki/canon/SOURCES.md`.

## How to change a figure

1. Edit `tools/build-goc-answered-workbook.py` — the figure and its status grade sit together.
2. `.venv-sheets/bin/python tools/build-goc-answered-workbook.py`
3. `.venv-sheets/bin/python tools/push-xlsx-to-gsheet.py deliverables/GOC-Entity-Model-Inputs-ANSWERED-2026-08-03.xlsx`

Same URL, updated in place. Sheets auth is Ben's own OAuth desktop client at
`~/.config/goods-sheets-oauth.json`. gcloud ADC is blocked by Google for Drive/Sheets scopes and
the org enforces `iam.disableServiceAccountKeyCreation`, so both other auth routes are dead.
Do not retry them.
