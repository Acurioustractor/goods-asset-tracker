# The next phase: one mission, one strategy, one pitch

**Paste this whole file as the opening prompt of the next session.**

---

## What you are being asked to do

Bring the mission, the strategy and the pitch into **one coherent thing**, and make the surfaces
match it. Not to write another strategy document. Four already exist and a fifth was written and
deleted in a single day on 2026-07-26, which is the mistake to learn from rather than repeat.

**Read first, in this order, and do not restate them:** `/STRATEGY.md` (§0 says which file wins),
`/DECISIONS.md` (newest first; A through R), `/CONTEXT.md` (the language). Then the code that now
holds what used to be prose: `road-spine.ts`, `deck-road.ts`, `audience.ts`, `ownership-test.ts`,
`pathway-stages.ts`, and `nextPhase` on each record in `community-pathways.ts`.

---

## Where it actually stands

**The spine is settled.** The road: seven stops and the gap, voices leading, model at the end
(rulings C and F). It is defined once, in `road-spine.ts`.

**The deck exists and is canonical.** `/pitch/road`, ruling R. Every figure resolves from canon and
renders its own claim label, so a modelled number is visibly modelled to the funder. A guard fails
if the model, economics or ask slide is ever moved before the last road stop.

**The claim ceiling is enforced in code, not policy.** `ownershipClaimLine()` derives the ownership
sentence rather than asserting one. `cleared-voices.ts` gates every name. Guards stop any surface
claiming ownership is complete.

**What is honest and unfinished:** the process is proven (40 Maningrida beds pressed end to end)
but the per-bed cost at a sustained rate is not measured. The honest denominator is 234 to 529 beds
a year and where it lands is decided by one question: who pays the person who runs the line.

**The money position:** $0 signed, always stated first. Grants at ask made $607.5K, repayable at
cultivating $710K, either column alone clearing the $400K QBE match twice over. **The match is
short of paper, not short of candidates.**

---

## ▶ THE JOB THIS PHASE: a full public site review

**Ben, 2026-07-26:** explain the mission, the focus and the business plan **very plainly**, and work
out how that explanation is distributed across the whole site, laid out for the best chance of
engaging people in the new model.

**117 public routes.** Not a typo, and not counting admin or API.

| Segment | Routes | |
|---|---|---|
| `/wiki/*` | 15 | Product, manufacturing, guides |
| `/pitch/*` | 12 | Funder surfaces. `/pitch/road` is canonical (ruling R) |
| `/portal/*`, `/partners/*` | 10 | Gated |
| `/sites`, `/shop`, `/production`, `/export`, `/design` | 20 | Mixed internal and public |
| Everything else | ~60 | Story, explainer, community, funders, insiders |

**The problem is not that pages are wrong.** Every one reads from canon, which is exactly why the
sprawl was hard to notice. The problem is that **the same story is told at 8 different lengths in 8
places and nobody can say which one to send anyone.** `/about`, `/the-work`, `/process`,
`/stretch-bed`, `/story`, `/story/road`, `/cost-story` and `/impact` all overlap. `/mission` is
already just a redirect to `/story`, which is a hint about what most of them should become.

**The tool for this already exists and has never been applied.** `audience.ts` names six audiences,
what each arrives believing, what each must never see, and one next action each. **Nothing has been
laid out against it.** That mapping is the review.

**How to run it, and the order matters:**

1. **Inventory against the audience model.** Every public route gets exactly one primary audience
   from `AUDIENCES`, or it is a candidate for retirement. Routes serving nobody, or three people at
   once, are the finding.
2. **Pick one canonical surface per audience.** There are six audiences. There should be roughly
   six front doors, not sixty.
3. **Write the plain explanation once.** Mission, focus and business plan, in the plainest possible
   language, as ONE piece of content that the canonical surfaces cut from. Not eight versions.
4. **Retire the rest on the `/pitch/control-room` pattern**: `redirect()` plus a dated comment
   saying what it was and why it went. Never delete; old links keep working.
5. **Record it as a ruling** in `/DECISIONS.md` with a sweep list, because an undated docstring is
   what caused the three-decks problem.

**Do not write new pages until steps 1 and 2 are done.** The instinct will be to build a better
explainer. There are already eight.

---

## The five things that will decide this phase

Ranked by what they change, not by effort.

**1. Nothing has transferred anywhere.** Ownership is a pathway and the month-6 test currently
returns *no site is yet eligible*. Oonchiumpa is the first testable site. **Checkpoint 3, that a
community-controlled entity invoices the buyer directly, is not a measurement today. It is a
decision nobody has made, and Oonchiumpa has not been asked.** That conversation is worth more than
any artifact in this repo.

**2. The pitch and the attachment are two different narratives.** `/pitch/road` renders the road
spine; `/pitch/simple` renders an older slide source into `goods-simple-deck.pdf`. A funder gets
one of each. Repointing the PDF pipeline at the road spine is real work and it is the highest-value
build left.

**3. The site review above.** It is item three by sequence and item one by priority, because until
it is done nobody can answer "where do I send this person".

**4. Sweep lists rot, four times out of four.** Rulings D, O, Q and R all had lists that were
to-dos rather than records. A retired capex band was still in the presenter talk track a day after
the ruling that retired it. **The fix is `check:rulings`: a script that greps for retired figures
and phrases and fails CI, the way `check:drift` protects canon.** Until it exists, grep by hand
before trusting any "swept" note.

**5. Two of four pathways cannot be priced, and neither is fixable by estimating harder.** Tennant
Creek waits on a partner's decision. Palm Island returns $0 because the model has no governance
cost line, which is recorded as the wrong answer. Building that line unlocks pricing for the stage
most communities actually start at.

---

## How to work

**Do not write a strategy document.** New material goes into typed, guarded code. A guarded module
cannot drift; a paragraph will. Write prose only for what code cannot hold: judgement, reasoning,
what a human decided and why, and that goes in `/DECISIONS.md` **with a sweep list written at the
same time as the ruling.**

**Branch before the first commit of a new topic.** If the current branch is about something else,
`git worktree add` off `origin/main`. Never `reset --hard` in the main tree: another session
usually has uncommitted work there.

**Gates run once, at the end.** `tsc`, tests, `check:drift`, `check:voice`, build, together.

**Judge per instance, never find-and-replace.** "Plant" describing the real containerised facility
is correct; "the plant" as the thing offered to a community is retired. A quote recording what
someone actually said or offered stays, even when it uses retired language, because rewriting it
falsifies the record.

**Claim guards must read the assertions, not the prohibitions.** `mustNeverSee` and `neverSay`
contain the words of the claims they forbid. This trap has been hit twice.

---

## What must never happen

- Ownership claimed complete, in any tense, on any surface.
- scabies to RHD as a claimed health outcome. It is the why.
- A modelled figure presented as measured, or a bed number offered as a threshold.
- The charity's Aboriginal directors presented as satisfying the 51% First Nations ownership test.
  That tests the **supplier**, which is the company. It ends the relationship.
- The revenue carve-out called signed. It is a workpaper; no signed document exists.
- "Co-design". The products are designed **in community, led by community**.
- A figure typed by hand rather than resolved from canon.

---

## Open, human-gated, not code

- Ask Jay what SIH accepts as match paper. Worth more than the rest of the sequencing together.
- Put the seller-of-record direction to Oonchiumpa, and to MinterEllison as a legal question.
- Who pays the line supervisor. The biggest dial in the model.
- The baler question, which is the whole width of the Utopia capex band.
- Add a Transfer stage to the GHL pipeline. The centre of the pitch, untracked in the CRM the team
  actually uses.
- `feat/story-road` has no PR and needs Ben to walk the page.
- `/pitch/deck` is under another session's edit; when it lands it either redirects to `/pitch/road`
  or replaces it, and that is a decision, not a merge.

---

## The one-line brief

> The road is settled, the deck is built, and the claims are guarded in code. **What is not settled
> is who the site is for.** 117 public routes tell one story eight ways, and the audience model that
> would sort them has never been applied. This phase is one plain explanation of the mission, the
> focus and the model, laid out across a site cut down to roughly one front door per audience.
>
> The other thing not settled, and it is not a code problem: **nothing has actually transferred
> anywhere yet.**
