---
date: 2026-09-10T17:45:00+10:00
session_name: goods-model-voice-and-tells
branch: feat/ai-tells-gate-and-goods-model
status: active
---

# Work Stream: goods-model-voice-and-tells

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-10T17:45:00+10:00
**Goal:** The QBE Stage 2 application goes in by Friday 25 September at noon carrying one model that
holds together, in language that reads human. Done when every question is answered or assigned to a
named person, every figure traces to the workbook, and nothing ships with an AI tell.
**Branch:** feat/ai-tells-gate-and-goods-model in worktree `/Users/benknight/Code/goods-finance-wt`,
off `origin/main` at `14c5f45`. Six commits, NOT pushed, no PR.
**Test:** `node tools/check-ai-tells.mjs <file>` · `cd v2 && npm run check:tells`

### Now
[->] Ben's next block, named 10 September before a clear, in his order: **review all three artifacts**,
    then **build the charts and visualisations that align the deck**, then **turn the workbook into a
    management daily driver**. The workbook audit is done and sits under "The workbook as it stands".
    Q10's evidence is still owed and is the smaller job.

### This Session
- [x] Seven QBE answers rebuilt on the plants ask and checker-clean: Q5, Q6, Q7, Q8, Q9, Q18, Q23
- [x] Q9's attachment written: `deliverables/qbe-stage2/q9-impact-of-the-new-funds-2026-09-10.md`
- [x] Brian M. Davis payment condition settled from both primary documents
- [x] Consent precedence ruled: the repo registry wins over Empathy Ledger
- [x] Hours per bed settled at 2; the 3 September figure of 6.5 is withdrawn
- [x] The built deck verified against the current ask by exporting all 19 frames and reading them
- [x] Pencil capability reviewed; `PENCIL.md` gained components, PDF export, icons, restore path
- [x] 246 dead root frames MOVED into `GL2zw`; root 265 -> 20; live board unchanged
- [x] Deck PDF built for Q23: 19 pages, 4.7MB, inside the upload cap

### Next
- [ ] Review the three artifacts end to end with Ben, jumping between them
- [ ] Charts and visualisations for the deck, so the deck and the artifacts show the same shapes
- [ ] The workbook as a daily driver: readable numbers, real actuals, named ranges, an as-at view
- [ ] Q10's evidence, then the remaining NEEDS BEN and NEEDS ELOISE answers
- [ ] Minute Kristy's related-party declaration at the 14 September board, and ask Oonchiumpa to
      minute the same. Q8 asserts it and it is not yet true.
- [ ] Nic owes a site and a quote basis for each plant before the $150,000 allowance is defended
- [ ] Story scroll from the consented voices; housing sovereignty leads, recycling does not
- [ ] Website journeys: community, buyer, funder, supporter
- [ ] Public site copy has never been through the tells checker

### Decisions
- **Price model, never cost-plus.** $750 at the door, $276 to make, $474 stays, freight on top.
- **QBE asks $300,000 to build two plants**, $150,000 for one. The 3 September ask of $400,000 for
  533 beds is withdrawn. Beds are paid by Tim Fairfax and Brian M. Davis.
- **Tim Fairfax is operating support**, unrestricted, which releases $100,000 of bed money = 133 beds.
- **The repo registry wins on consent** (Ben, 10 Sep). `storyteller-registry.ts` governs what may be
  printed. Karen Liddle, Mykel and Fred Campbell are cleared. Empathy Ledger's rows are never a veto.
- **A bed carries 2 hours of paid making**, 20 kg of HDPE, up to $750 kept locally when the community
  sells it, and one person off the floor. Health is the reason, never a claimed outcome.
- **The BMD full-funding condition lives in the budget template**, sheet INSTRUCTIONS cell B16, not
  in the Grant Conditions PDF. Cite the template.
- **Judgement is not a control for AI tells.** A gate is. Quotations are exempt and never rewritten;
  keeps are recorded in `tools/ai-tells-allow.txt`, never argued in a session.
- **Archive means move.** The 246 dead frames are inside `GL2zw`, recoverable one `Move` at a time.

### Open Questions
- UNCONFIRMED: **The 50% share** paid to Goods in the ten-year chart is a split no community has
  agreed. It keeps less local ($375) than a bed Goods sells itself ($474). Ben rules or moves it.
  Q9's document leaves the money row out until he does.
- UNCONFIRMED: **"Ntjillaburra" does not exist** in the ledger. Needs Nic, or Ben meant Oonchiumpa.
- UNCONFIRMED: **Margaret Lloyd's location.** Empathy Ledger says Palm Island, the registry says
  Utopia homelands. The page follows the registry.
- UNCONFIRMED: **ALIVE's money.** The page uses $75,000 for 100 beds; the reckoning records $101,200
  received and $66,000 owed, so the order is bigger than the beds.
- UNDECIDED: **charts.** The deck carries data as text and rectangles. Pencil builds bar and donut
  charts from layout. Our charts currently live in the HTML artifacts. Nobody chose that split.
- UNCONFIRMED: **Tim Fairfax's board date.** Katie said late November, Nic said the first week, a
  meeting summary said 25 November. Say late November until a primary source says otherwise.
- The Xero connector has been unreachable for two sessions. Every figure comes from the repo.

### Workflow State
pattern: sequential
phase: 5
total_phases: 8
retries: 0
max_retries: 3

#### Resolved
- goal: "the QBE application answers, the story scroll, the website journeys, in that order"
- resource_allocation: balanced
- consent_record_precedence: the repo registry wins (Ben, 10 Sep)
- qbe_ask: $300,000 for two plants, $150,000 for one (Ben, 9 Sep)

#### Unknowns
- community_revenue_share: UNKNOWN (the 50% split)
- ntjillaburra_identity: UNKNOWN
- deck_charts: UNDECIDED

#### Last Failure
(none)

---

## Context

### Paste this to resume

> Read `thoughts/shared/handoffs/goods-model-voice-and-tells/current.md` first. It is the single
> entry point; everything else is named from it. Then read the four answers below under "The model,
> aligned", which is the whole current picture in one screen.
>
> The work lives in the worktree `/Users/benknight/Code/goods-finance-wt` on
> `feat/ai-tells-gate-and-goods-model`, six commits, not pushed. The main tree is on another
> session's branch with about 640 modified files; do not commit there.
>
> Before writing any prose for a slide, a funder document or a public page, run
> `node tools/check-ai-tells.mjs <file>`. Never defend a flagged phrase by where it came from.
> Delete it and rewrite. Quotations are exempt.
>
> The queue, in Ben's order: finish the QBE answers, then the story scroll, then the website
> journeys. QBE closes Friday 25 September at noon.

### The model, aligned

Four questions, four answers. Every figure below is a cell in
`deliverables/finance/goods-financial-plan/Goods-financial-plan.xlsx`.

**What is a bed worth?** $750 at the factory door. $276 to make, with $80 of factory labour inside
it. $474 stays with Goods. Freight is charged on top at cost, its own line per community, paid by
whoever buys the bed. Never cost-plus, and never divide the organisation by beds.

**What is being asked for, and by whom?** The Butterfly Movement Ltd, trading as Goods on Country,
is the applicant and the recipient. Directors are Kristy Bloomfield, Audrey Deemal and Jeremy
Donovan. QBE is asked for $300,000 to build two plants at $150,000 each, working choices Palm Island
and Maningrida, with $150,000 for one plant as the smaller case. Beds are a separate ask: 400 of
first stock, of which Tim Fairfax covers 133 and Brian M. Davis 80, leaving 187 to find. Alice
Springs is funded by DEWR and NIAA through Oonchiumpa and sits outside the raise. ALIVE's 100 beds
are paid and outside the 400.

**What already runs without any of it?** 320 beds sold and paid across ten invoices, $343,481 all
time. FY26 Goods receipts were $653,246, of which Snow was $375,000, or 57%. There is no Snow ask
this year and nothing in the plan replaces the other $275,000. That relationship is worth more than
any single line on the asks table.

**What does one bed do?** Two hours of paid making, 20 kilograms of HDPE kept in use, up to $750
kept in the community when the community sells it, and one person off the floor. Health is the
reason the hardware exists and is never claimed as an outcome.

### The calendar that governs everything

| When | What |
|---|---|
| Mon 14 September | Butterfly board. Minute Kristy's related-party declaration. |
| Fri 25 September, noon | QBE Stage 2 closes. Brian M. Davis closes the same day. |
| 6 and 7 October | QBE interviews |
| 23 October | QBE conditional outcomes |
| 9 October | Tim Fairfax SmartyGrants deadline |
| 13 November | QBE preconditions date |
| 19 November | Brian M. Davis board |
| Late November | Tim Fairfax decides |

The last three are the problem, and Q18 now asks QBE about it rather than leaving it in a note.

### The workbook as it stands, audited 10 September

`deliverables/finance/goods-financial-plan/Goods-financial-plan.xlsx`, 953KB, 28 sheets, 42,429
formulas and 49,676 values. It is a good forecast model. It is not yet something you could run the
business off on a Tuesday morning, and these are the reasons, in the order they bite.

**No number in it can be read without recalculating first.** The file is saved with no cached
values, deliberately, so that Excel recomputes on open. The cost is that `openpyxl` with
`data_only=True` returns `None` for every formula cell, including the whole `Statements` roll-up.
Any agent reading a figure must first recalculate a copy. LibreOffice is installed at
`/opt/homebrew/bin/soffice` and is the way:
`soffice --headless --convert-to xlsx --outdir <tmp> <copy>`.

**No actuals have ever been entered.** The `Actuals` sheet has exactly the right shape, with month,
actual receipts, actual payments, actual closing cash, entity and source, reviewed date, forecast
receipts, forecast payments, net cash variance and a reconciliation note. Columns C, D and E are
empty. Everything the business has actually done sits in `FY26`, `FY26 cash` (6,520 values), `FY26
invoices` (7,185 values) and `Butterfly FY26`, which are Xero extracts, not a running ledger. The
Xero connector has been unreachable for two sessions, so there is no refresh path either.

**Zero defined names.** Across 28 sheets, every formula is positional: `'Monthly forecast'!D31`,
`SUMIFS('Cash schedule'!$AQ$6:$AQ$18...)`. Insert one row anywhere and the model quietly changes
meaning. Named ranges are the single cheapest fix and they are what makes roll-ups safe.

**The roll-up is annual, not as-at.** `Statements` aggregates to Year 1, 2 and 3 off the `Cash
schedule`. There is no view that answers "where are we today", which is the question a daily driver
exists to answer.

What is already right and should not be rebuilt: the input convention is documented on `Alignment`
under "How to use this workbook", blue cells are inputs, `Source records` holds 6,100 rows of
provenance, `Evidence and decisions` is a decision log, `Source map` maps figures to their origin,
and `build-plan-sheet.py` regenerates `Plan to July 2027`. The bones are sound.

**The likely shape of the work**, to be agreed with Ben rather than assumed: name the ranges,
build one Xero-to-Actuals import so the month closes without typing, add a budget-versus-actual
variance roll-up by month, and put an as-at dashboard on the front. Research what a small
manufacturer's management pack normally carries before designing it.

### Which file wins

`canon.ts` and `asset-canonical.ts` for figures. `/DECISIONS.md` for judgements. `/CONTEXT.md` for
language. `/STRATEGY.md` names the order. Inside this stream: the workbook for money, the repo
storyteller registry for consent, and `tools/ai-tells-allow.txt` for permitted phrases.

### The three artifacts

| Page | URL | What it is |
|---|---|---|
| Model | `0b235115-7bbb-436f-bbe8-f716c283dcf5` | The whole model, eleven sections, section 11 live |
| QBE review | `c3a9260a-c99f-4f63-b6b4-80e7fd8b4ab1` | Everything the raise needs, eight sections |
| Money map | `eeb96c11-6564-45ca-af68-69b7f4bac84d` | The money, with a live play section |

All three publish from `deliverables/finance/goods-financial-plan/*.html`. Republish by passing the
same `url`. Watches drop overnight; that is normal.

### The model page, eleven sections

1 Mission (five layers, capital aligned to jobs, six community voices) · 2 Impact · 3 Last year from
Xero · 4 One bed · **5 The trade that is already running (new)** · 6 Paid for · 7 Making · 8 To July
2027 · 9 Investing · 10 Asks · 11 Play.

### What section 5 says, and why it matters most

Goods has sold and been paid for **320 beds across ten invoices, $343,481 all time**. FY26 Goods
receipts were **$653,246**, of which **Snow was $375,000, or 57%**. Since 1 July, **$116,200** has
landed (ALIVE $101,200, Julalikari $15,000). The raise is not what keeps the lights on.

**The real hole in next year:** there is no Snow ask this year, and nothing in the plan replaces the
other $275,000. That is worth more than any single ask on the list and it is a relationship, not a
spreadsheet line.

### Seven finance faults fixed on the model page

1. Tim Fairfax counted as 133 beds in one section and zero in another.
2. The cost-per-bed curve was hardcoded and its caption contradicted the 628-bed break-even. Now
   computed live, drawing both crossings: 628 with freight on top, 796 if Goods carries it.
3. The asks table totalled $950,000 against 413 beds, Minderoo included.
4. The ten-year chart called Witta "unchanged" while it halves from 880 to 400.
5. The 50% share was unexplained and is backwards for a model about keeping money local.
6. 713 beds made against 510 paid for was unexplained. Now named: ~120 catalytic gap, ~83 July stock.
7. Freight defaults to nothing recovered, contradicting section 4's own rule. Said out loud.

### Community voices, and the scoping that Ben asked for

Six quotes, one per layer, all **external tier in `v2/src/lib/data/storyteller-registry.ts`**, which
is the record that governs what may be printed: Margaret Lloyd, Katrina Bloomfield, Tehmineh Mason,
Mykel, Karen Liddle, Shayne Bloomfield. Fred Campbell carries health in section 2.

**Empathy Ledger, scoped to project `6bd47c8a-e676-456f-aa25-ddcbb5a31047`** (project
`yvnuayzslukamizrlhwb`, read with the Supabase MCP and an explicit project_id):

- 44 storytellers via the join table `project_storytellers`. There is no project column on
  `storytellers`.
- 390 stories via `stories.project_id`, but **351 are archived photo captions** from the production
  team. 39 human stories. 13 public, 11 of those Maningrida film-frame captions.
- **Nothing in Empathy Ledger's own tables is approved for public display.** All 110 Goods
  `extracted_quotes` are `approval_status='pending'` with `public_display_consented=false`; all 486
  `storyteller_quotes` have `approved_at IS NULL`.
- Themes, Goods-scoped: housing_sovereignty and community_resilience lead;
  environmental_stewardship is the smallest. **The community does not talk about recycling.** The
  story scroll should not lead with it.

Three name findings:
- **Karen Little is Karen Liddle.** Alice Springs / Atnarpa. Goods is her only project.
- **Kristy Bloomfield has no Goods story and no Goods-scoped quote.** Her twenty quotes trace to The
  Homestead, Law Student Workshops and Caterpillar Dreaming. Quoting her for Goods is a
  project-scope error. A separate "Kirsty Bloomfield" row exists and is not her.
- **"Ntjillaburra" returns nothing** across twelve tables.

### The AI-tells gate

`tools/check-ai-tells.mjs`, nineteen rules from WP:AITELLS, ERROR and WARN tiers, default deny.
`tools/ai-tells-allow.txt` holds each permitted phrase with its reason. Wired as `npm run
check:tells` from `v2/` and into `check:drift`.

Two design points that must survive: **quotations are exempt and never rewritten**, and **keeps are
recorded on disk, not argued in a session**.

State: model, QBE review, money map and the deck all at **zero errors**. The Notion deck master has
**zero em dashes** and still carries ~72 negative parallelisms in its working notes, which were not
the ask.

### The deck

`v2/public/strategy/Goods Final Deck.pen`, gitignored, main working tree. The live sequence is the
**19 frames inside board `BEXfI`, "QBE 2026 — CLEAN BUILD"**. On 10 September the 246 dead root
frames were moved into `GL2zw`, `_ARCHIVE 2026-09-10`, so the root now holds 20 children: the board,
the 18 components and the archive. Nothing was deleted; `Move("<id>", document)` puts one back, and
a whole-file backup sits beside the deck.

The deck carries this request, checked by exporting all 19 frames on 10 September: $300,000, two
plants at $150,000, Palm Island and Maningrida, 2,193 words, zero tells errors. The PDF for Q23 is
`v2/public/strategy/exports/Goods-on-Country-QBE-deck-2026-09-10.pdf`, 19 pages, 4.7MB.

**Eight slide archetypes and nine components exist and are used by nothing.** A census returns zero
`ref` nodes, so every slide is hand-built. Copying a reusable node makes a connected instance and
paints immediately. Ids and the method are in `.claude/skills/deck-slide/PENCIL.md`.

To read the deck's printed copy without opening every frame, export it and run the checker:

```js
Export(["LDM1K","nYkbR","T814io","S28Ukn","LP8Uy","i3mL7v","MYAVQ","XRUz9","mDhny","esUr4",
"ZZ4GO","LX4ci","COJmo","nfPKg","TiKvy","F93w1o","rknzM","tVcLc","H5N2zG"],
"html-css","<scratchpad>/deck-text.html")
```

That is 2,199 words of real slide copy and it never has to enter context.

S17 (`rknzM`) changed this session: text node `o58zVR` now reads "Photographs show work already done.
No future site is pictured." Re-exported at 1.5x and swapped on the Notion deck master.

### Traps learned this session

- **`ntn api --file <path>` is a file upload, not a request body.** Using it for a PATCH returns
  "400 validation_error: Too many files" and writes nothing. Use `-d '<json>'`. Keep
  `stdin=DEVNULL` on every write or the call hangs forever.
- **A slide's copy lives in several blocks on the Notion deck master.** Sweeping the image is not
  enough; S17's footer sat in two more blocks. Search the page for the retired string.
- **An em dash can arrive through a page mention.** Its plain_text comes from the linked page's
  title, so no block patch can reach it. Rename the page.
- **Pencil `Get(document)` without a visitor is rejected.** `Copy` paints immediately, `Insert` does
  not until save and reopen.
- **python http.server sends HTML without a charset**, so local previews show mojibake that the
  published artifact never had. Prepend `<!doctype html><meta charset="utf-8">` to a preview copy.
- **Playwright screenshots must be written inside the repo root**; the scratchpad is outside the
  allowed roots.
- The Xero MCP was unreachable all session.

### Where the work lives now

**Everything is committed in a worktree, not in the main tree.**

| | |
|---|---|
| Worktree | `/Users/benknight/Code/goods-finance-wt` |
| Branch | `feat/ai-tells-gate-and-goods-model`, off `origin/main` at `14c5f45` |
| Commits | Six. The gate, the model and the trade, the handoff, the QBE answers, the Brian M. Davis correction, this record. |
| Pushed | **No.** No PR. Ben has not asked. |

The `.claude/` directory is gitignored at `.gitignore:99`, so all 44 project skills, `deck-slide`
included, live only in the main working tree. That is policy, not an accident, and changing it is
Ben's call.

The files were **moved** out of the main working tree, so there is one copy and it is tracked.
The artifacts now publish from
`/Users/benknight/Code/goods-finance-wt/deliverables/finance/goods-financial-plan/*.html`.
Republishing works from any session by passing the artifact `url`, so the path change costs nothing.

Why a worktree: the main tree sits on `feat/empathy-ledger-accountability-events` with about 640
modified files belonging to other sessions, and `v2/package.json` there carries two script entries
(`reconcile:washers`, `dev:local-admin`) that are not ours. Committing in the main tree would have
swept those up. The worktree took a clean `package.json` from `origin/main` and only the
`check:tells` lines were added to it.

The workbook backups in `deliverables/finance/goods-financial-plan/archive/` are deliberately
untracked, by a `.gitignore` in that directory. They are eight point-in-time copies of the same
workbook, 5.9 MB, and git now carries that history properly.
