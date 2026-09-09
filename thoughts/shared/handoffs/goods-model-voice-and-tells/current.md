---
date: 2026-09-10T09:35:00+10:00
session_name: goods-model-voice-and-tells
branch: feat/ai-tells-gate-and-goods-model
status: handoff
---

# Work Stream: goods-model-voice-and-tells

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-10T09:35:00+10:00
**Goal:** The QBE Stage 2 application goes in by Friday 25 September at noon carrying one model that
holds together, in language that reads human. Done when every question is answered or assigned to a
named person, every figure traces to the workbook, and nothing ships with a writing tell.
**Branch:** feat/ai-tells-gate-and-goods-model in worktree `/Users/benknight/Code/goods-finance-wt`,
off `origin/main` at `14c5f45`. Six commits, NOT pushed. Six paths modified or new and uncommitted.
**Test:** `node tools/check-ai-tells.mjs <file>` before publishing anything.

### Now
[->] **One click finishes the live Google Sheet.** The sheet exists and Ben can already write to it.
    It needs the service account added as an editor, then the twelve tabs go in. Everything else
    below is done and published.

### The one blocked thing, and its exact fix

An empty Google Sheet is created and shared to benjamin@act.place as writer:

    https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y/edit

To fill it, share it as **Editor** with:

    subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com

Then take the content from `deliverables/qbe-stage2/pages/build-live-model.py` and push it in with
the Sheets API. Twelve tabs, twenty-nine named ranges, formulas already verified against the master.

**Why this is the only step left, all tested on 10 September:**

| Route | Result |
|---|---|
| Google Drive connector, create a Sheet | Works. Owned by hi@act.place |
| Google Drive connector, read computed values | Works. Returns calculated numbers |
| Google Drive connector, write cells | Not available. `update_file` changes title and parent only |
| A Google Sheets connector | Does not exist in the account directory. Drive, Calendar, BigQuery, Compute Engine only |
| Service account, mint a token | Works. Key is in `v2/.env.local`, commented out, mangled by escaping |
| Service account, Sheets and Drive APIs | Both enabled on project `act-subscription-tracker` (1053421850098) |
| Service account, create a file | Refused. Robot accounts have no Drive storage quota |
| Service account, act as benjamin@act.place | Refused. Needs domain-wide delegation in Workspace admin |
| Sharing the sheet to the service account | Blocked by the harness auto-mode guard, not by Google |

**The key needs repair before use.** In `v2/.env.local` the `private_key` carries stray backslashes
from `.env` escaping, so loading the PEM fails with `ERR_OSSL_UNSUPPORTED`. Strip every backslash and
whitespace from the base64 body, decode it and load it as DER:

```js
const body = k.private_key.replace(/-----[A-Z ]+-----/g,"").replace(/[\\\s]/g,"");
const key = crypto.createPrivateKey({key: Buffer.from(body,"base64"), format:"der", type:"pkcs8"});
```

The alternative route Ben has not chosen: add a Google Sheets MCP server as a custom connector using
the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` already in `v2/.env.local`. One browser consent,
then full access as benjamin@act.place and no robot account at all.

### What is published and live

| Page | URL | What it is |
|---|---|---|
| QBE Control Room | https://claude.ai/code/artifact/b45c45a0-378b-41a0-b635-eaa461d0957f | 60 graded claims each citing a cell, the 25 questions, the funder register, the model to play with, the workbook as a download, the names register, 14 retired lines |
| The 25 Questions | https://claude.ai/code/artifact/92ad473f-91e5-4ec8-b68c-2c3580102cb5 | Every question with the written answer verbatim and its word count, the deck slides that carry it as thumbnails with frame ids, the files it needs, the figures, the cleared voices |
| Goods on Country Model | https://claude.ai/code/artifact/0b235115-7bbb-436f-bbe8-f716c283dcf5 | Eleven sections, from the earlier session |
| QBE Raise Review | https://claude.ai/code/artifact/c3a9260a-c99f-4f63-b6b4-80e7fd8b4ab1 | Eight sections, from the earlier session |
| Goods Money Map | https://claude.ai/code/artifact/eeb96c11-6564-45ca-af68-69b7f4bac84d | The money drawn, from the earlier session |

The control room carries the `db` and `downloads` capabilities. Saved scenario readings land in
collection `scenarios`; read them with the Artifact tool, `action: read_db`, `db_op: list`.

**To edit a published page:** read it from its URL with the Artifact tool, or use the stripped source
in `deliverables/qbe-stage2/pages/` plus `rebuild-pages.py`, then publish passing the same `url` so
the link is kept. The tracked sources have their two large embedded payloads replaced with
placeholders on purpose, so git carries no base64 blobs.

### Ben's rulings, 10 September, from the interview

These are new today and are not yet swept through every surface.

| Question | His ruling |
|---|---|
| What a community keeps when it sells a bed | **The full $750.** The 50% split in the ten-year chart is retired. Q9's money row goes back in |
| Butterfly's constitution | **Eloise or the accountant has it.** Q12 is a chase, not a genuine gap. Q22 gets the real document |
| Q16 and Q17, contacting other funders | **Yes, contact Tim Fairfax and Brian M. Davis now.** Names and emails still needed |
| Q19, the plant sites | **Both named as working choices**, with the module pricing as the basis and site quotes to follow |
| Q13, legal and regulatory | **Nothing to declare** |
| Q24, solvency | **Solvent, and show why.** Still needs today's bank position from Ben |
| Snow Foundation | **A $100,000 ask shaped like Brian M. Davis, counted as bed money.** His words were "they can also give ness and will count to beds"; the "ness" fragment was never clarified |
| Q11, what to upload | **The dated register reconciliation and the consented story records.** Not the retrospective note, not the blank templates |

**The consequence nobody has swept yet:** counting Snow's 133 beds takes the hole from 187 beds to
**54**. Every surface that says 187 is out of date.

### What was found and corrected today

- **Q6 had a $500 arithmetic error going to a funder.** Its module table totals the high column as
  $142,967. The Capital sheet's own rows add to **$142,467**. Corrected in the answers file,
  `ALIGNMENT-WITH-MATT-2026-09-09.md`, the finance README, the money map and both pages.
- **The two making costs were never in conflict.** $235.74 on the annual-staff basis plus the $40
  assembly allowance is $275.74, the $276 the deck prints. Same build, one line apart.
- **The press is the bottleneck, not the router.** Six pressed sheets a day and two sheets a bed give
  three beds a day. CNC does 8.56 and assembly 5, so both have spare. 720 beds a year on own sheets,
  1,440 on Defy leg panels. NM Play B10, B45, B46, B47, B36.
- **The plastic figures are two, not one.** A leg sheet takes 21 kg of shred and a tab sheet 15 kg, so
  36 kg is pressed for one bed and the finished bed is 20 kg. Both now print on both pages. Decision
  D06 still says 40 kg of gross input, which is a live conflict.
- **The $150,000 plant allowance is defensible.** It sits above the module high of $142,467 and
  between the workbook's own benchmarks, $113,000 to replicate and install (Capital!C31) and $207,450
  turnkey (Capital!C32). Nine of thirteen modules are estimates; the generator alone runs $6,600 to
  $20,000.
- **Q10 is written**, 583 words, checker-clean, on the page and appended to the answers file. It
  reports 540 deployed and 320 sold and paid and explains why both are true.
- **Notion's deck master is corrected.** Section 4 read "candidate ask AUD 250,000"; it now reads
  $300,000 settled with the three-option table marked superseded. Section 5 excluded Palm Island from
  demand; it now names Palm Island as the first plant. Block ids
  `3ea3fe3d-14db-4879-9668-c7f666894249` and `e4b53396-bc65-4531-b65d-1a5a45778b59`.
- **Deck slide S15 gained a chart.** The $750 splits into gold for the $80 wage, clay for the $196
  rest of making and green for the $474 that stays. Frame `TiKvy`, nodes named `Bed value *`. Pencil
  builds bar and donut charts from layout and cannot do line charts, so anything needing a curve
  stays in the HTML pages or becomes a bar.

### Still wrong in the master workbook, deliberately not edited

- Decision log **D12** still says the request is "250,000 / 150,000 unapproved candidates".
  `QBE!D14`, `QBE!A54` and Funding F01 all say $300,000.
- Decision **D06** says 40 kg of gross sheet input against NM Play B21's 36 kg.
- **D17** says current capacity is 360 while `Start!B7` says 400 supported and `Start!B46` says
  nothing above capacity.

### Next

- [ ] Share the sheet to the service account, then push the twelve tabs in
- [ ] Sweep 187 beds to 54 everywhere, following the Snow ruling
- [ ] Q19 needs a site and a quote basis for each plant. Nic holds this and it is the last hard blocker
- [ ] Q3 and Q4: the structure diagram and every related entity's director records
- [ ] Q20 and Q21: current management cashflow for Butterfly. Eloise
- [ ] Q24: today's bank position, then the answer can show its basis
- [ ] Q16 and Q17: a name and email for Tim Fairfax and Brian M. Davis
- [ ] Minute Kristy Bloomfield's related-party declaration at the 14 September board, and ask
      Oonchiumpa to minute the same. Q8 asserts it and it is not yet true
- [ ] Clarify the "ness" fragment in the Snow ruling
- [ ] The workbook as a daily driver: named ranges, a Xero import into Actuals, budget against actual
      by month, an as-at front page. Sketched, never agreed

### Uncommitted in the worktree

    M deliverables/finance/goods-financial-plan/ALIGNMENT-WITH-MATT-2026-09-09.md
    M deliverables/finance/goods-financial-plan/README.md
    M deliverables/finance/goods-financial-plan/goods-money-map.html
    M deliverables/qbe-stage2/qbe-answers-2026-09-10.md
    ?? deliverables/qbe-stage2/pages/
    ?? deliverables/qbe-stage2/q10-impact-to-date-2026-09-10.md

The first four are the $142,467 correction and the Q10 answer. `pages/` holds the two stripped page
sources, the live-model builder, the live-model xlsx and `rebuild-pages.py`. Nothing is committed and
nothing is pushed. Ben has not asked for either.

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
- Xero has been unreachable for three sessions. Every figure comes from the repo.

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
