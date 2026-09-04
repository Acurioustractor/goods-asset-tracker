---
date: 2026-09-04T11:20:00Z
session_name: qbe-story-and-deck
branch: feat/qbe-story
status: active
---

# Work Stream: qbe-story-and-deck

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-04T11:20:00Z
**Goal:** The story of the model is live as the public `/pitch/model` and the gated `/sites/qbe/story`; the Pencil deck is rebuilt to twelve slides that match it; every link on the site points at the right surface. Done when merged, live, deck saved and links green.
**Branch:** `feat/qbe-story` in worktree `/Users/benknight/Code/goods-story-wt`, eight commits, stacked on `feat/raise-stack-and-ruling-x` (PR #234, NOT merged), NOT pushed.
**Test:** `cd v2 && npx tsc --noEmit -p tsconfig.json && npx vitest run && npm run check:drift:ci && npx next build`
**Map:** GitHub issue #236. Fifteen tickets. Open the map first, not this file.

### Now
[->] #249 is done and committed, waiting on the merge chain. Nothing else is claimed. The frontier is now three of Ben's (#237 read the crux and the public answers aloud, #238 land PR #234, #243 read the deck review table) plus #250, one signed letter, which is also his to send. The next one that is mine is #248, wire the model page in, and it is BLOCKED: `PITCH_APPENDICES` still has no render site, so the public model page has no public inbound link.

### This Session
- [x] `/pitch/model` (public) and `/sites/qbe/story` (gated) built from ONE component with an `audience` switch. Eighteen chapters on the working copy, fifteen public.
- [x] `lib/diagrams/kit.ts` + `qbe-diagrams.ts`: one typed SVG renderer, nine drawings read from the guarded modules, each downloading as SVG or PNG for the deck. Supersedes `deliverables/qbe-stage2/diagrams/build.mjs`.
- [x] `qbe-story.ts`, `qbe-faq.ts` (23 questions), `deck-plan.ts` (the twelve slides), `qbe-form.ts` (the form audit). All guarded by `qbe-story.guards.test.ts`.
- [x] The crux line changed on Ben's ruling to "The first money buys beds for a community. The community sells them, and the money stays there to build the next thing." Swept through both pages, the repo copy of the QBE page, and the Notion page's first block.
- [x] Four explorers: any amount, pool mix, the snowball, who pays.
- [x] The four overviews Ben asked for: the buying story (every buyer on an invoice), who has said yes, the lenders and other options, and plan B if the grant does not come.
- [x] Wayfinder map #236 charted; #247 (link inventory) and #240 (deck review table) resolved and closed.
- [x] `deliverables/deck-review-2026-09.md`: every frame of the .pen, one row each.
- [x] #249 every link that sent a reader through a redirect. A full scan of `next.config.ts` sources found thirty-nine, not the inventory's eleven; eight were public evidence links on `/register`.
- [x] Gates green: tsc, 661 tests, `check:drift:ci`, eslint, `next build`. Both routes verified at 200.

### Next
- [ ] #237 Ben reads the crux and the twenty-two public answers aloud, strikes anything he would not say.
- [ ] #238 Land PR #234 (ruling X + the three money modules) so the story can follow.
- [ ] #243 Ben reads `deliverables/deck-review-2026-09.md` and rules keep, fix or cut per frame.
- [ ] #250 One signed letter before the form closes. The single highest-value action available.
- [x] #249 Repoint the stale links. Thirty-nine resolved, seven retired, gates green (`a8c224b`). Open until merged.
- [ ] Then: #239 story PR live, #244 rebuild frames 07 to 12, #245 export and guard, #246 PDF, #248 wire the model page in, #251 grill the ask against the fallback.

### Decisions
- Ben, 4 Sep, eleven decisions in one round, all in the map's Notes. The load-bearing ones: land PR #234 first; the public page names no foundation or lender until a letter exists; `/pitch/model` stays noindex until after 25 Sep; one builder for the deck (this session), review table before any frame is edited; the deck keeps its spine and frames 07 to 12 take the page's drawings; Tim Fairfax runs the organisation, not beds; the first pool is written as "Mparntwe, with Oonchiumpa, once they have seen the design".
- The crux line keeps its subject. "We buy beds" read as Goods being the customer and never said who pays or who receives. A summary line names who pays, who receives and who sells.
- An answer can be finished and still improvable. That is not a gap. Two of my own guards caught this and the model was corrected, not the guards.
- The LGANT frames in the same .pen are a second deck for a real event on 22 September. Out of scope for this map, unreviewed, and flagged so it is not lost.
- A redirect stays even when the last link through it is gone. Bookmarks and anything already sent externally still need it; #249 removed the hops inside the app, not the safety net. Nothing was promoted to 308.
- A link label that names a retired surface is itself a stale pointer. "The cost story" on `/register` became "The road to ownership", in `money-pointer.tsx`'s own words. Labels that still describe their destination were left alone.
- The inventory was a floor, not a ceiling. Grepping `next.config.ts`'s redirect sources against `src/` found twenty-eight links the file-by-file read had missed. Do the machine scan first next time.

### Open Questions
- UNCONFIRMED: whether the deck's `.pen` has been saved since 3 Sep 17:12. Other sessions have edited it; run `mcp__pencil__get_app_state` before any deck read.
- UNCONFIRMED: the applicant entity. Q1b, Q2 and Q8 have two versions until Social Impact Hub answers.
- UNCONFIRMED: whether `INVESTORS_PASSWORD` is set on Vercel. It is used by `/investors` already, so probably, but verify before claiming the gated route works in production.
- OPEN: who runs the line at the first site and who pays them. The biggest single dial in the model, and one of the four gates.
- OPEN: the accountant's letter, blocked on the cost-of-goods problem in the historic books.
- OPEN: an invented testimonial attributed to "Community Enterprise Partner" sits in `src/components/shop/enterprise-opportunity.tsx`. No such speaker is in `cleared-voices`, the component is rendered nowhere, and it is one import away from a public surface. Filed as #252 for Ben; found by #249.
- OPEN: `conditional-chrome.tsx` still lists `/pitch/investor-lab`, `/pitch/miro-board` and `/deck` as standalone prefixes. All three are redirects. Dead but harmless; belongs with the `/pitch/model` chrome question.

### Workflow State
pattern: wayfinder-map
phase: 2
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "Finish the story of the model, then the deck in Pencil, then align every link"
- resource_allocation: aggressive

#### Unknowns
- applicant_entity: UNKNOWN until Social Impact Hub answers
- deck_frames_verdict: UNKNOWN until Ben reads the review table (#243)
- snowball_in_deck: UNKNOWN, Ben's call in the reading

#### Last Failure
(none)

---

## Context

### Start here

1. Open the map: https://github.com/Acurioustractor/goods-asset-tracker/issues/236. It carries the destination, Ben's eleven settled decisions, the fog and what is out of scope. Do not relitigate anything in its Notes.
2. Take the first frontier ticket that is not Ben's. Claim it by assigning it before any work.
3. Resolve exactly one ticket, then stop. Research tickets are the exception.

### Where the work is

Worktree `/Users/benknight/Code/goods-story-wt`, branch `feat/qbe-story`, five commits:

| Commit | What |
|---|---|
| `0ee258f` | The story page, the diagram kit, the FAQ, the first guards |
| `14a4361` | First person, the public/working split, the audience switch |
| `e8255ea` | The crux keeps its subject |
| `a23f630` | The deck review table |
| `69962ca` | The twelve-slide plan and the four overviews |
| `08ed88e` | The form audit, question by question |
| `925459f` | The continuity ledger for this stream |
| `a8c224b` | Every stale link repointed or retired (#249) |

Stacked on `feat/raise-stack-and-ruling-x` (worktree `../goods-raise-wt`, PR #234, seventeen commits, not merged) because it imports `raise-stack.ts`, `community-loop.ts` and `bed-ratio.ts` from there. **Neither branch is pushed.**

### The shape of it

One component renders both surfaces:

- `v2/src/app/sites/qbe/story/qbe-story.tsx` takes `audience: 'public' | 'working'`.
- `/pitch/model` is public, first person, no internal notes: no form questions, no deck frames, no named foundation or lender, no open decisions, no calendar, no form audit.
- `/sites/qbe/story` is the working copy behind the investors gate, with all of it.
- `cruxFor`, `chaptersFor`, `faqFor`, `diagramsFor` and every drawing take the audience. Guards assert the public surface carries no internal token.

Data, all guarded by `v2/src/lib/data/qbe-story.guards.test.ts`:

| Module | Holds |
|---|---|
| `qbe-story.ts` | Chapters, the crux, the problem, the proof runs, the buying story, who has said yes, the lenders, plan B, the outcomes, the honest rules, the calendar |
| `qbe-faq.ts` | 23 questions with status, who asks, source; `working: true` hides one, `publicAnswer` swaps another |
| `deck-plan.ts` | The twelve slides, each naming the form question, the chapter, the drawing, the existing frame and its verdict |
| `qbe-form.ts` | The form audit: 26 rows across 25 numbers, what each is really testing, the gap, the owner, the upload slot |
| `lib/diagrams/kit.ts` | The SVG renderer: frame, panel, chainRow, columns, layers, timeline, band |
| `lib/diagrams/qbe-diagrams.ts` | Nine drawings, each a function of the audience |

### Running it locally

The gate password is not in `.env.local`, so the investors routes always redirect unless dev is started with it set:

```
cd /Users/benknight/Code/goods-story-wt/v2
INVESTORS_PASSWORD=OnCountry-E1C4AC npx next dev -p 3010
```

Then `http://localhost:3010/pitch/model` (public) and `http://localhost:3010/sites/qbe/story` (cookie `investors_auth=OnCountry-E1C4AC`).

### Traps this effort has already paid for

- `check:audience` reads `git ls-files`, so a new route that is not staged fails as "no page.tsx". Stage before running the gates.
- `check:qbe-guardrails` reads test titles. "QBE … doubles" on a line with no negation word fails, even inside an `it(...)`.
- Never put an invoice id in a React key on a public page. It rides in the payload.
- Pencil does not paint newly inserted nodes until the file is saved and reopened.
- `Get(document, visit)` in Pencil visits the root's children at depth 0, not 1. A nested `Get` inside a visitor over 249 frames interrupts.
- Other sessions have edited the same `.pen`. Check `get_app_state` before every deck read or edit.
- The main working tree is on `codex/site-audience-alignment` with another session's ~280 modified files. Do not commit there.
- The gates regenerate three files under `wiki/canon/`. Restore them before committing.

### The deck, as it stands

`v2/public/strategy/Goods Final Deck.pen`, gitignored, 249 top-level nodes. The review is in `deliverables/deck-review-2026-09.md`. Fifteen live frames (six keep, nine fix), seven optional, eleven MODEL, twenty frames another session added that contradict ruling Y and are cut, about 140 stacked copies and loose root nodes, and a separate 23-frame LGANT deck for the Darwin symposium on 22 September.

Frame 02 no longer exists; a copy (`Yzth3`) must be rescued into the live row before the duplicates are deleted.

The twelve-slide plan is `deck-plan.ts`. Slide to form question: 1 → Q6; 4 → Q10, Q14, Q19; 5 → Q19; 6 → Q5, Q6, Q7; 7 → Q6, Q8; 8 → Q10 to Q12; 9 → Q1b, Q2, Q3, Q4, Q22; 10 → Q14, Q16, Q18; 11 → Q7, Q18; 12 → Q5, Q7.

### The form, in one paragraph

Twenty-five questions, closing Friday 25 September at noon. Five decide the outcome: the amount, the use of funds, the smaller amount, the other funders, and how the grant is catalytic. Nothing is signed, and leverage is the program's core criterion, so one letter would move the answer they weight most (#250). The ask sits at the top of the range, which makes the fallback answer the mitigation (#251). The entity answer sits under two of the highest-weighted questions. The books are the standing blocker. The full audit renders at `/sites/qbe/story#form`.

### Standing rules that govern every word here

First person as Goods on Country. The crux line as ruled. The program cost is only ever the cost of the beds. Nothing is signed and it is said first. A grant never matches, doubles or guarantees (ruling V). No community beside a price (ruling S). Two years on the road, never nine. Ownership is a pathway. No health outcome claimed. Forty beds were pressed at the farm. "Designed in community".

Write funder-facing prose from the transcript, not the repo. Run `/straight` before any funder or public prose, and `/act-voice` before anything a human reads.
