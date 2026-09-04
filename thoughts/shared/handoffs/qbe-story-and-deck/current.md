---
date: 2026-09-04T13:10:00Z
session_name: qbe-story-and-deck
branch: feat/qbe-story
status: active
---

# Work Stream: qbe-story-and-deck

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-04T16:20:00Z
**Goal:** Twelve slides whose copy Ben has ruled on, one at a time, in Notion. Then build once in Pencil. Then the QBE form. Done when Ben has said yes to all twelve and the PDF is under 10MB.
**Branch:** `feat/qbe-story`, PR #253, pushed, CI green. Worktree `/Users/benknight/Code/goods-story-wt`.
**Test:** `cd v2 && npx tsc --noEmit -p tsconfig.json && npx vitest run && npm run check:drift:ci && npx next build`
**Map:** GitHub issue #236. **The Notion deck master is the working surface, not this file:**
`https://app.notion.com/p/3d1ebcf981cf817598d8f15ee4f89c32`

### Now
[->] **PASTE-PROMPT: `thoughts/shared/handoffs/qbe-story-and-deck/START-HERE.md`. Open that first.**

[->] **Slide-by-slide copy pass. Slide 1 LOCKED. Slides 2, 3 and 4 drafted and waiting on Ben.**
Do 5 to 12, ONE AT A TIME. Ben says "go" between each.
**Before any of that, read "The mentor call" below. It challenges the ask itself.**

### The mentor call, 4 September — READ FIRST
Ben and Nic met a business mentor. Summary, notes and transcript are in Ben's 4 Sep message and
mirrored into the Notion master. It changes more than any single slide.

**The advisor's central challenge, and it lands on ruling Y.** He named three different things a
funder could be buying and said they are fundamentally different propositions:
1. **Artificial customer.** The grant buys 1,000 beds to get revenue flowing. His words: it
   "feels short term" for a philanthropic investor.
2. **Subsidising operations** on a path to viability. His question: is it a pathway, or is it
   loss-making forever, so the product dies the day the grant stops?
3. **Investing in the plant** so communities manufacture independently. His verdict: *"it would
   feel to me to be investing in the factories … proving the model that they could ultimately
   become self-sufficient and then helping them get there."*

Ruling Y (Ben, 3 Sep) is option 1. The whole deck encodes it: $400,000 = 533 beds, the money buys
beds, full stop. **The advisor says option 1 is the weakest story for this audience.** That is not
a defect in the deck. It is a decision Ben and Nic have to make again.

**The alternative Nic floated, in his own numbers:** two production plants at $150,000 each is
$300,000, plus $200,000 of beds, for a $500,000 raise. Ben's notes carry a second version: 400 beds
at $750 is $300,000, two plants $300,000, $600,000 total. Neither matches the deck.

**Facts said on the call that are NOT in the deck and should be:**
- **Alice Springs Town Council has 20 tonnes of shredded HDPE sitting at the tip with nowhere to
  go.** The best answer we have to "is there feedstock", specific to the first site. Nowhere in the
  deck.
- **A woman from Alice Springs was brought to the Sunshine Coast factory to train as factory lead**
  and to find what has to be simplified for community production. Readiness evidence of exactly the
  kind the form asks for. Nowhere.
- **A production schedule exists.** First 100 beds in Alice Springs in November, nothing across
  December and January, ~100 a month from February, new community in April, May, June, July. The
  form asks for a staged delivery plan under readiness and the deck has no dates.
- **Nic quoted the mentor ~$200 margin a bed**, against the $324 pressed figure in the model. Two
  different margins told to two audiences. Reconcile before either goes near a funder again.
- **Washing machines are being designed backwards from a $2,500 landed home price.** Today they
  sell only to councils and schools. Slide 6 does not mention the roadmap.
- **Phase 1 / 2 / 3** (make on the Sunshine Coast, then manufacturing into community hands, then
  other products from the same panel, washing machines then fridges) is the clearest framing either
  of them said out loud. The deck does not use it.

**The $0-signed line may not be true.** Nic told the mentor: *"we've got funding commitment from
two philanthropic organisations to contribute $100,000 each and we've got conversations open to get
a letter in writing for that final $150,000."* The deck and `raise-stack.ts` both say $0 signed.
**Do not promote a spoken claim into signed capital.** Someone has to check whether those two
$100,000 commitments exist on paper. If they do, the leverage answer changes completely, and
leverage is the criterion the form says the Steering Committee weights most.

**QBE has signalled interest in returnable or repayable finance** for the $750,000 production
phase. A different instrument from the grant we are applying for, and possibly the better door.

**Ben's own note at the end, unresolved:** *"I think there's a slide missing which is why the
product's fucked."* He wants a slide on why the products that arrive today fail: you cannot wash a
mattress, it is expensive, it goes to landfill; washing machines are the wrong product and cost too
much. Slide 2 is the closest thing and it does not do this.

**And the question he left hanging:** *"either we explain more that the products pay for the beds,
the products pay for the production plants, or do we actually [change the ask]"*.

**Their action items:** share questions and documents in the morning; add cash flow to the model;
Nicola to focus on getting communities running facilities; QBE skilled volunteers to complete the
market viability and demand analysis; clarify the pitch so it explains how the products pay for the
beds and the plants.

### This session
- [x] Merged PR #234, then found it carried only the first SEVEN of the raise branch's twenty
      commits. The other thirteen had never been pushed, so **ruling Y had never reached main** and
      `CONTEXT.md` and `deck-road.ts` still said "nine years". All 24 unmerged commits rebased onto
      main, gates green, pushed as **PR #253**, CI green.
- [x] #249 resolved: 39 stale links repointed or retired, seven of them internal admin tools linked
      from an open funder page. #252 filed, an invented testimonial in an unrendered shop component.
- [x] All twelve Pencil frames exported and placed in the Notion master under their slide heading,
      plus the eight model diagrams beside the slides they belong to.
- [x] Slide 1 rewritten, ruled by Ben, rebuilt in Pencil, re-exported, **LOCKED**.
- [x] Slides 2 and 4 drafted in full in Notion, waiting on Ben.
- [x] Every statistic we hold swept from five modules into one picker in Notion, graded A/B/C on
      whether a funder can check it.
- [x] Internal strings removed at source from `qbe-diagrams.ts`: the three-jobs drawing printed a
      funder contact's private reasoning and "Ben has not yet ruled" onto a page bound for QBE.
      Peer's render scripts committed.

### Slide 3 findings, 4 September (not raised with Ben; they live here)

**`road-spine.ts` carries the wrong Kalgoorlie story, and it inverts the meaning.** Stop 1 reads
"A bed arrived, and within a year it was gone. Not stolen and not neglected. Built for a house with
one family in it, put into a house with fourteen." That sentence is not Kalgoorlie. It is the
generic illustration of the import loop from `_archive/2026-07-26/FOUNDATION.md` §1, near enough
word for word, and at some point it was attached to the Kalgoorlie stop. The real Ninga Mia story
is in `story-road.ts` stop 1 (`v2/src/lib/data/story-road.ts:141`), sourced from Notion: the crate
bed went together outside Gloria Turner's tent, it was gone in the morning, and it had been pulled
inside so the family could sleep around it. The proof was choice. So the built slide has a failure
story standing where the first proof belongs. **The fix is in `road-spine.ts`, not only on the
slide** — anything importing the spine inherits it. The FOUNDATION line is still good copy; it
belongs on slide 2 or on the missing product-failure slide.
**Ben confirmed the real story on 4 Sep**, in his words: "it was just that we tried the bed, it was
gone but was in the tent with 4 ladies sleeping on it with Gloria Turner, the first Goods bed
participants." Stop 1 has been rewritten to that and inserted at the top of the Notion master.
**RULED 4 Sep: four.** Applied in `road-spine.ts` (stop 1 rewritten off the FOUNDATION line) and
`story-road.ts` (chapter 4 now says four women on the bed; the two-records paragraph is deleted and
the note records that Ben's ruling supersedes it). `deck-road.ts` renders `stop.what` straight from
the spine, so `/story/road` picks the correction up with no further edit. Gates green: tsc, 669
tests, check:drift:ci. Superseded, for the record: The contemporaneous field recording in
`story-road.ts` says six people in the tent with three on the first mattress; the later team
retelling says six women on it together, and the module keeps the discrepancy deliberately. Ben was
there so the deck follows him, but the pack cannot say six on one surface and four on another.
Waiting on his word to set four everywhere or drop the count from the slide.

**Two of the seven road voices are attached to stops they did not carry.** `road-spine.ts` gives
Utopia to Dorrie Jones, while `story-road.ts` stop 5 says in its own note that Margaret Lloyd
carries that stop. It gives Maningrida to Fred Campbell, who is Oonchiumpa in Alice Springs and
narrates Xavier there; the cleared Maningrida voices are Eric Pascoe and Tehmineh Mason. Not a
consent breach (all seven are on `cleared-voices.ts`), an accuracy one. The slide 3 draft solves it
by only naming a person where their own words are on the slide.

**Only two of the seven stops can carry a real quote today.** Linda Turner and Alfred Johnson have
cleaned public quotes in `curated-quotes.ts`. Dorrie Jones has one in `trip-stories.ts` ("Good for
me and comfy… easy to put together", Arlparra 22 May). Karen Liddle has a cleared video and no text
quote anywhere in the repo. So "give every stop a real quote" is not available without recording
more, which is why the draft names three people and narrates the rest.

### Next
- [ ] Ben rules on slides 2, 3 and 4.
- [ ] Slides 5, 6, 7, 8, 9, 10, 11, 12, one at a time.
- [ ] Fix the Kalgoorlie stop in `road-spine.ts` once Ben has ruled on slide 3 copy.
- [ ] **The ask decision.** Ruling Y against the advisor's plant-first framing. Ben and Nic.
      Nothing downstream is safe until it is settled: slides 6, 7, 10, 11 and 12 all encode ruling Y.
- [ ] Check whether the two $100,000 commitments exist on paper.
- [ ] The missing slide: why the products that arrive today fail.
- [ ] Then Pencil, in ONE pass, from settled copy. The peer session is idle and waiting.

### Decisions
- Slide 1 is locked in Ben's words. He kept "Better health" and "100% Indigenous Directors" after
  I flagged both twice. **His call, and both are checkable claims.** "Better health" is a health
  outcome and the standing ceiling says scabies to RHD is the why, never the result. "100%
  Indigenous Directors" contradicts slide 9, which calls full Indigenous directorship the aim, and
  canon records control still transferring from TABOO with the AGM on 14 September. Nic said it on
  the mentor call, so it is not invented, but the form asks for every director's name so ASIC can
  be checked against it.
- **DGR Item 1 is correct.** ABN Lookup, extracted 6 May: The Butterfly Movement Ltd is an active
  company, ACNC charity, PBI, GST registered, DGR Item 1 since 17 January 2012.
- **Six organisations have bought beds on invoices, not four.** Palm Island Community Company
  (INV-0317, 40 Stretch Beds, $36,300, authorised) and Rotary eClub Outback Australia (INV-0222,
  200 Basket Beds, $82,500, overdue since 24 April 2025) sit in `compendium.ts` and canon and in no
  slide, diagram or module. Slide 4 is rebuilt around all six.
- The deck renders the `working` variant of every diagram deliberately, because the form asks for
  funder names and amounts and the public variant is too thin. That is why internal strings could
  leak, and why the source had to be fixed rather than the render patched.

### Open Questions
- OPEN, and now the biggest: **artificial customer, subsidy, or plant.** The advisor says plant.
  Ruling Y says beds.
- OPEN: do the two $100,000 philanthropic commitments exist in writing?
- OPEN: $200 a bed or $324? Two different margins told to two audiences.
- UNCONFIRMED: the applicant entity. Blocked on Social Impact Hub.
- UNCONFIRMED: 100% Indigenous directorship, until the AGM on 14 September and an ASIC extract.

### Workflow State
pattern: slide-by-slide copy pass
phase: 2
total_phases: 3

---

## What worked this session, and what did not

Written down because Ben asked for it, and because the next session will otherwise repeat all of it.

### What did not work

**I produced far more than was asked, repeatedly, and it cost the session its rhythm.** Ben said
"stop fucking thinking so much", "hurry the fuck up" and "I just want to do one at a fucking time"
inside twenty minutes. Each followed me shipping a large multi-part artifact when he had asked for
one slide. **Next time: he asks for slide N, deliver slide N, stop.** No sweeps, no adjacent
findings, no "while I was in there". Findings go in this ledger, not into his next message.

**Building Pencil frames one at a time was the wrong order.** Copy first in Notion, all twelve,
ruled by Ben, then one Pencil pass. Ben said so explicitly and he was right: a round trip through
the peer session for a single slide is minutes of nothing happening.

**Notion `update_content` search-and-replace is unreliable here, because Ben edits the page while
you work.** Four calls failed on strings that were present when I read them. **Use `insert_content`
with `position: start`; it always works.** Never build a plan that depends on matching text Ben
might have touched. Multi-line matches across block boundaries fail even when the text is unchanged.

**I flagged the "Goods." lockup as the retired brand. It is the approved lockup.**
`src/app/brand/page.tsx` names `goods-on-country-grounded-primary` as the one to use when
introducing the organisation to partners and funders. I raised it as a red finding in front of Ben
before checking the brand page. **Check the asset before calling it a violation.**

**I told Ben to strip the four statistics off slide 2. `supply-context.ts` had exact citations for
most of them**, down to section and page number. I recommended deleting things that were one grep
from being defensible. **Search before recommending removal.**

**Two AskUserQuestion calls with four elaborate options each, while he was asking for speed.** The
first was justified. The second was not.

### What worked

**Checking a claim against canon before it shipped.** The cover nearly read "540 beds on recycled
plastic legs". 363 of the 540 are Basket Beds, which are baskets with zip ties. Caught in draft,
then held structurally in the rebuild by keeping the two sentences in separate paragraphs.

**Reading the git state rather than the PR board.** The board said #234 was green and mergeable. It
was, and merging it moved a third of the work, because thirteen commits had never been pushed.
Ruling Y had been "swept" on 3 September into a branch nobody pushed.

**Counting the buyers instead of trusting the module.** `qbe-story.ts` says four. `compendium.ts`
and `canon.ts` between them hold six. The two missing ones are real invoices with real money.

**Telling the peer session what Ben actually said, verbatim.** It stopped building immediately,
handed over its exports, and found six more leaks on its own once it knew the goal had changed.

**Putting images in front of him.** Nothing moved until the twelve frames and the diagrams were
visible in Notion. Every useful ruling came after that.

### The pattern underneath it

Ben is fast and the work goes slow when it is done as ceremony. The value this session added was
almost entirely **four factual catches**: the unmerged ruling, the Basket Bed overclaim, the two
missing buyers, and the internal strings on a funder page. Everything else was noise around them.
**Next session: find the factual problem, say it in two sentences, fix it, move on.**

---

## Context

### Where the work is
Worktree `/Users/benknight/Code/goods-story-wt`, branch `feat/qbe-story`, **PR #253**, pushed, CI
green.

### The peer session
`qbe presentation delivery`, session id `689fe545-1c59-41f5-954c-e8ac72602719`, addressable via
SendMessage as "qbe presentation delivery". **Idle, holding, Pencil paused on Ben's instruction.**
It owns the `.pen` and has built a new band at y=30000 with twelve frames plus a shell at y=36400.
Send it the settled copy for all twelve in ONE message when the copy pass is done. Its exports and
manifest live in `deliverables/qbe-deck-handoff/`.

### The deck files
- `v2/public/strategy/Goods Final Deck.pen` — gitignored, saved 4 Sep.
- `v2/public/strategy/exports/slide-01..12.png` and `goods-qbe-deck-2026-09-04.pdf` — gitignored.
- `v2/public/strategy/diagrams/` — sixteen rendered PNGs, gitignored.
- `deliverables/qbe-deck-handoff/scripts/render-all.sh` — committed. Reproduces every diagram from
  the guarded modules with no dev server and no gate, and fails the build if an internal string
  reaches the output. Skips the calendar drawing, which names individuals.

### The real QBE form
Ben pasted the actual application on 4 Sep. It is unnumbered, so the repo's "Q1 to Q25" shorthand
does not map onto it. Quote the question text instead. Three facts from it govern everything:
- **$400,000 is the stated maximum** and the pool is split across ten organisations. We are asking
  for the ceiling.
- **"The catalytic effect of the grant, how much additional funding it unlocks, is a core part of
  the Steering Committee's assessment criteria."** The form's own words.
- **Uploads: five files, 10MB each.** The deck PDF must come in under 10MB.

### Traps
- `check:audience` reads `git ls-files`; stage new routes before running the gates.
- The gates rewrite three files under `wiki/canon/`; restore them before committing.
- The main working tree is on `codex/site-audience-alignment` with ~298 modified files from another
  session. Never commit there.
- Pencil does not paint newly inserted nodes until the file is saved and reopened; the peer builds
  every slide as a Copy of a shell for that reason.
- `INVESTORS_PASSWORD` is not in `.env.local`. Start dev with it set or the gated routes redirect.
