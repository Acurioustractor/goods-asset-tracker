---
date: 2026-09-03T03:30:00Z
session_name: qbe-750k-raise
branch: feat/raise-stack-and-ruling-x
status: active
---

# Work Stream: qbe-750k-raise

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-03T03:30:00Z
**Goal:** The QBE Stage 2 application (closes Fri 25 Sep 12pm AEST) and the deck carry one model: the $250K ask buys one governed pool and the proof; the unit is one bed; every figure is derived and guarded. Done when Ben has answered the four decisions, the Zoho form answers exist, and the deck's money slides match `raise-stack.ts`.
**Branch:** feat/raise-stack-and-ruling-x (worktree `/Users/benknight/Code/goods-raise-wt`, PR #234 open, NOT merged)
**Test:** cd v2 && npx tsc --noEmit -p tsconfig.json && npx vitest run && npm run check:drift:ci

### Now
[->] Ben reads the one document on the Notion play-space page (3d0ebcf981cf806b918fceff46528300): every Q1 to Q25 answer drafted and marked READY / SUBJECT TO JAY / NEEDS BEN / NEEDS ELOISE, the model in ten sections with seven diagrams. Jay's answers at 2pm change the Q1, Q2, Q8 wording; Eloise's papers close Q4, Q20, Q22. Then the deck's money slides from Part 5 of that page.

### This Session
- [x] 3 Sep: the one document built. Notion play-space page rewritten at the top (crux, Part 1 model with seven diagrams and four real photos, Part 2 the form answered, Part 3 attachments per slot, Part 4 what only people can close, Part 5 diagram-to-slide map); original form and notes kept below a divider.
- [x] 3 Sep: `deliverables/qbe-stage2/qbe-stage2-application-2026-09-03.md` and `deliverables/qbe-stage2/diagrams/build.mjs` (seven SVGs in deck tokens) committed as 2e3daa2 on this branch, not pushed.
- [x] Ruling X (28 Aug) carried into git for the first time, above ruling T, with the CONTEXT/STRATEGY/CLAUDE patches and nine August documents (PR #234).
- [x] `raise-stack.ts` + 19 guards: every funder line with a status, $0 signed derived, QBE tiers ($250K ask, $400K ceiling, $150K smaller), entity route, five questions for Jay.
- [x] `community-loop.ts` + 10 guards: one pool of 200 beds, gross sales by share sold, the facility band, the pressed margin, four gates.
- [x] `bed-ratio.ts` + guards: the unit (one bed, four things) and `scale(amount)` for $150K/$250K/$400K/$750K.
- [x] `deliverables/qbe-750k-strategy-2026-09-02.md` (strategy, stack, form map), `deck-narrative-qbe-2026-09.md`, `deck-slide-text-2026-09-02.md`.
- [x] Notion "QBE final application" page: strategy appended twice under the form (stack, tiers, unit table, questions for Jay).
- [x] GHL: TFFF row $300,000 (invited 31 Aug, due 9 Oct) and BMDF row $100,000 (invited 1 Sep, due 25 Sep) updated with notes and next-action dates.
- [x] Pencil deck (`v2/public/strategy/Goods Final Deck.pen`, gitignored): partner name fixed to Homeland School Company; every "gross sales" figure replaced with cost wording; three new slides drawn: 08C the loop (`JCreO`), 09C impact (`qD5SQ`), 10C the unit (`mX9er`).
- [x] Gates green: tsc, 616 tests, check:drift:ci, production build.

### Next
- [ ] Ben: Q1 contact, Q13 confirmation with every director, Q16 contacts, the Q20 cover note, the exports for Q9/Q11/Q23 (Part 3 of the page).
- [ ] Eloise: ASIC extract and post-AGM board for Q4; Butterfly's three statements; constitution, resolutions, member register.
- [ ] Redraw slides 07, 10, 10C, 12 from the page's diagrams once Jay and Ben have answered; PNGs regenerate with `rsvg-convert -w 2400` from the SVGs.
- [ ] Thu 3 Sep 2pm Sydney, Jay's check-in: the five questions in `raise-stack.ts` JAY_QUESTIONS, entity first.
- [ ] Thu 3 Sep, Eloise: Butterfly's P&L, balance sheet, cashflow (form Q20); the accountant's letter remains the blocker.
- [ ] After Ben decides: slide 10 "Capital with three jobs" from 08B, slide 07 status strip and applicant footer, renumber 11/12 with the decision copy (`deck-narrative-qbe-2026-09.md` has the exact copy).
- [ ] Zoho form answers from the strategy note §4 to §6 (form: https://survey.zohopublic.com/zs/Iqt8SS).
- [ ] BMDF application (due 25 Sep, same day): youth employment, school engagement, plastics; TFFF SmartyGrants MYGOS-FY27 (due 9 Oct): the block, in their resilience language.
- [ ] Ask Nic for the FRRR Community Led Climate Solutions award letter (won per Steph Pearson 16 Jul; no letter or amount in Ben's Gmail): possibly the first signed paper.
- [ ] Update the BMDF GHL contact (record is Sarah Bartak; invitation came from Miranda Campbell).
- [ ] Merge PR #234 only on Ben's explicit word.

### Decisions
- $250K is the QBE ask, $400K the ceiling, $150K the smaller amount (Ben, 2 Sep evening): one pool plus the proof block is easier to say and to grant; every dollar above buys beds at the same ratio.
- TFFF recommended to fund the block, not beds: Katie's invitation names the resilience of organisations; $100K/yr for three years is almost exactly the minimum network block. Ben has not yet ruled.
- The Butterfly Movement Ltd (Goods on Country) recommended as QBE applicant: every external dollar lands there under ruling X; ACT as related entity; fallback ACT with the unsigned inter-entity agreement, said to be weaker.
- $750K is only ever the cost of the beds, never sales or income; no community is named beside a price; QBE is never described as doubling anything; debt is repaid from Goods' margin on buyer orders, never from a community's pool.
- Codex sessions (three Pencil MCP servers, `--agent codexCLI`, from 16:05) are editing the same .pen: they added "QBE 01 to 07" and "PLAN 01" frames and nine copies of the 01 to 11 sequence. This session stopped touching the deck beyond its three frames until Ben picks one builder.

### Open Questions
- UNCONFIRMED: "Alexandra Savas" appears as a Butterfly director in `v2/src/lib/people.ts` (July research) with no register source; not used on the form.
- UNCONFIRMED: whether the deck was saved again after slide 10C was drawn (08C and 09C painted after the 16:29 save and reopen; new nodes do not paint until a save and reopen).
- UNCONFIRMED: TFFF board date (Katie: late November; Nic on the call: first week of November; meeting summary: 25 November).
- UNCONFIRMED: "Luke EV Fleet $20K" and "FRRR Palm $20K" on Ben's Notion note (no second source).
- UNCONFIRMED: whether REAL ($1.995M, Oonchiumpa-led) has been awarded (Ben reported ~$2M received 13 Aug; GHL says committed; no deed on file).
- UNCONFIRMED: the deleted "ARCHIVE — Render test" frame (unsaved test content, not this session's); Cmd+Z in Pencil restores it if wanted.

### Workflow State
pattern: build-then-gate
phase: 3
total_phases: 4
retries: 0
max_retries: 3

#### Resolved
- goal: "Align the final Goods pitch to the QBE final application, draft the $750K strategy and the narrative, then align the deck design"
- resource_allocation: aggressive

#### Unknowns
- applicant_entity: UNKNOWN until Jay answers (3 Sep)
- tfff_use: UNKNOWN until Ben rules (block vs beds)
- deck_builder: UNKNOWN (this session vs Codex)

#### Last Failure
Pencil stopped painting newly inserted nodes mid-session (updates to existing nodes still painted); resolved by Ben closing and reopening Pencil, which also saved the file (571KB at 31 Aug 15:16 became 1.03MB at 16:29).

---

## Context

**Sourced dates.** Final cohort check-in Thu 3 Sep 2 to 3pm Sydney (Zoom). QBE Stage 2 form closes Fri 25 Sep 12pm AEST (Jay, 24 Aug). BMDF application closes Fri 25 Sep; board 19 Nov (Miranda Campbell, 1 Sep). QBE review meeting Wed 7 Oct 9:45 to 10:15 Sydney (booked). TFFF SmartyGrants closes Fri 9 Oct 5pm; board late Nov (Katie Norman, 31 Aug). QBE conditional outcomes Fri 23 Oct; pre-conditions Fri 13 Nov. PA conference Brisbane 7 to 11 Sep; CONTAINED x Goods, Witta, 10 to 12 Sep. Nic said "22 September" on the Dusseldorp call; the sourced date is the 25th.

**The stack today ($0 signed).** TFFF $300K over three years, invited (recommended: the block). BMDF up to $100K, invited (pool three, youth-led). Snow $100K to $150K, ask made, catch-up booked with Sally. Minderoo $100K, ask made. Dusseldorp $50K target ($15K given for CONTAINED in June; 2026 small-grants budget spent, next year possible per Rachel). ALIVE $92K paid for 100 beds (INV-0342), the demand proof, excluded from match. SEFA $300K and White Box $150K repayable, after the measured run, blocked on entity. REAL ~$2M Oonchiumpa-led, excluded, disclose. Pool arithmetic at the $250K ask: 765 beds if every line lands; at the $400K ceiling, 965.

**Money in, one breath.** Philanthropy buys the beds and the block. Debt buys the machines and is repaid by our buyers, never from a community's pool. Communities keep what their pools earn. QBE pays for the proof that lets the debt be written. Nobody is buying shares. Fragility: $450K of repayable finance needs about 460 buyer-bought beds a year for three years at the pressed margin (~$324, modelled); at the kit margin (~$65) it cannot be repaid.

**The unit.** One bed at $750: a bed off the ground (verified); 20kg HDPE, fifty beds a tonne (workpaper); ~6.5 modelled hours of local work, 3.5 of them CNC (modelled); ~$130 fair-wage labour (modelled); up to $750 stays local if sold (target). $150K = 200 beds; $250K = 333; $400K = 533; $750K = 1,000.

**Files.** Strategy: `deliverables/qbe-750k-strategy-2026-09-02.md`. Code: `v2/src/lib/data/raise-stack.ts`, `community-loop.ts`, `bed-ratio.ts` (+ `.guards.test.ts` each). Deck records: `deliverables/deck-narrative-qbe-2026-09.md`, `deck-slide-text-2026-09-02.md`. Peer brief (three rooms): `deliverables/PA-QBE-media-alignment-2026-09-02.md`. Plan: `~/.claude/plans/floating-fluttering-ritchie.md`. Memory: `goods-750k-raise-strategy-2026-09-02`.

**Pencil.** Deck at `v2/public/strategy/Goods Final Deck.pen` (gitignored: `v2/public/strategy/` at .gitignore:219, `*.pen` at :238). Tokens: goods-cream #FBF8F1, goods-ink #2B2A26, goods-terracotta #C45C3E, goods-sand #EDE5D8, goods-sage #DDE2D2; Playfair Display + Inter; slides 1920x1080, layout none. New frames: 08C `JCreO`, 09C `qD5SQ`, 10C `mX9er`. Trap: newly inserted nodes do not paint until a save and reopen; Update on existing nodes paints immediately. `execute` with a different filePath still returns the live document, so a disk copy cannot be read for recovery.

**Tier discipline.** Push, Notion append, Pencil edits and GHL row updates were each done on Ben's explicit "proceed with all 4". Merge of PR #234 needs an explicit verb. Never send anything to a funder.
