# The roadmap: the right content, the right thing on the website, the messaging

**Paste this whole file as the opening prompt of the next session.**

Supersedes `final-mission-brief.md` (2026-07-26), which was written before the pitch rebuild,
the QBE research and the August merges. Its core question still stands and is restated below.

---

## What you are being asked to do

Work out **what content Goods should be making, what should be on the website, and what the
messaging is** — as one roadmap, not three separate efforts.

Do not write another strategy document. Five already exist and a sixth was written and folded
away in a single day on 2026-07-26. New material goes to code first, where guards can hold it.

**Read first, and do not restate them:** `/STRATEGY.md` (§0 says which file wins) ·
`/DECISIONS.md` (newest first, A through W) · `/CONTEXT.md` (the language and the voice rule) ·
`CLAUDE.md`. Then the code that holds what used to be prose: `audience.ts`, `road-spine.ts`,
`pathway-stages.ts`, `road-ending.ts`, `cleared-voices.ts`.

---

## What changed on 2026-08-01 and 02, and why it matters here

Two merges landed (PR #174 and #175, `main` at `93924d5`). Both are live.

**`/pitch/road` is THE deck and it is finished.** The ending was rebuilt in community voice:
a person opens four of five screens, the money is said plainly, and the asset-and-production
model is on a public surface for the first time. `/pitch/simple` is retired and 308s to it
(ruling W). `/deck` was already a redirect. **So the deck question is closed. Do not reopen it.**

**The QBE story changed underneath everything.** Researched from Social Impact Hub and QBE
Foundation primary sources: A Curious Tractor is **one of ten** sharing a pool of **up to $1.1M**;
2025 paid $1.02M across ten, averaging about **$102,000**; grants are "typically $150K to $400K".
The money is **catalytic**, not a dollar-for-dollar match, and there is **no $150K floor**.
Ruling V unlocked a Ben-locked sentence and swept about twenty surfaces. Full research:
`wiki/investor/20-qbe-program-economics.md`. **Any messaging that implies a signature triggers a
matching dollar is wrong and a guard will now fail the build.**

**Goods has no financial identity separate from Nic.** FY26 books show cost of goods sold at
$0.00 and 83.6% of income in an unclassified "Other Revenue" line, so the per-bed story in the
pitch has no counterpart in the accounts. That is a bookkeeping job, not a messaging job, but it
constrains what can honestly be claimed. See
`thoughts/shared/handoffs/2026-08-01-qbe-stage2-reality-and-the-raise.md`.

**The August content month is committed and passing.** Seven drafts, 34/34 in the repo pass
consent, claims and voice. Jahvan Oui is cleared and on main, so his 24 August post is unblocked.

---

## The question that is still open, and it is the one worth the session

**117 public routes. One story told eight different ways. `audience.ts` has never been applied.**

That model was built on 2026-07-26 and names six audiences, what each arrives believing, what
each must never see, and one next action each. Its own header states the failure it exists for:

> EVERY DEAD ARTIFACT WE HAVE BUILT LED WITH THE WRONG THING FOR ITS READER.

Nothing has been laid out against it. **That mapping is the work.** Which route serves which
audience, what each should lead with, and what should stop existing.

Note `/mission` is already just a redirect to `/story`, which is a hint about what most of them
should become.

---

## What is already decided. Do not relitigate.

| | |
|---|---|
| The spine | The road. Seven stops, the model arrives at the end as what the road produced (rulings C, F) |
| The north star | "The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making." Never open with a dollar figure |
| The deck | `/pitch/road`, rulings R and U. Closed |
| Ownership | A pathway. Never claimed complete, present tense, on any surface |
| Health | scabies to RHD is the WHY. No claimed health or justice outcomes at all |
| "co-design" | Never. Designed in community, with community, led by community |
| Consent | A code rule. `cleared-voices.ts`, 35 people, default-deny. Never invent or paraphrase a quote |
| Bed thresholds | Retired as public claims (ruling I). No bed number as a target |
| Community pricing | No dollar figure against a named community's pathway until they have seen it (ruling S) |

---

## The traps, learned expensively

**Work reaches done and never reaches git.** Four times on 2026-08-01: the road page, the
`deck.ts` rewrite it imports, Jahvan's portrait, the whole August content month. Two would have
shipped broken. Check `git ls-files`, never `ls`.

**A clean guard does not mean clean.** `check:voice` misses any string with an embedded double
quote, and had no rule for "leverage" or "enable". `check-qbe-guardrails.mjs` never scanned
`CONTEXT.md`, `STRATEGY.md`, `DECISIONS.md` or `wiki/` until 2026-08-01. Grep by hand.

**Rulings rot when the sweep is not executed.** `18-bmd-partnership.md` said "canon updated
everywhere" while contradicting canon. A ruling with no sweep list is a ruling that will rot.

**Labelling something retired still publishes it.** A chip reading "Retired, do not use" printed
the retired sentence to funders. Retired history belongs in `note` fields no renderer reads.

**Sources beat memory.** Three memory errors were caught in one 2026-07-25 session by reading
the source. The QBE correction came from the program's own page, not from our documents.

---

## Where the content system already is

- **`cleared-voices.ts`** — 35 people, the only consent gate. `check-content-gate.mjs` runs
  consent then claims then voice, and cites the rule it fails on.
- **`check-story-coverage.mjs`** — who has been featured, cadence, and the drafting backlog.
- **`wiki/outputs/ledger/`** — the weekly ledger drafts, including the August month.
- **The `ledger-story` skill** — turns cleared material into ledger posts, field notes and
  funder cuts. Drafts only, never publishes.
- **The `act-voice` skill** — load it before writing anything a human will read.

Both consent gates were broken until 2026-08-02 and are worth understanding rather than
trusting: one checked a coverage queue instead of the allowlist, the other split names on "&"
and tore a cleared pair in half.

---

## Suggested shape, not a plan

1. **Inventory the 117 routes against `audience.ts`.** Who is each for, what does it lead with,
   and is that what that audience came for. This is the deliverable everything else follows from.
2. **Name what retires.** `/pitch/simple` and `/deck` are already gone. The pattern is that most
   of the eight tellings should become one, plus redirects.
3. **Decide the content cadence** beyond August, against cleared voices rather than ambition.
   26 of 32 display-tier voices have been featured; the backlog is real and it is small.
4. **Then messaging**, last, because it should describe what the surfaces actually do.

---

## Live commitments that constrain everything

- **3 September, 2-3pm** — final QBE cohort check-in. Six questions to ask Jay are listed in the
  readiness register.
- **Late September** — QBE Stage 2 closes. No firmer date exists. Never write "14 September":
  that is the Butterfly AGM and canon forbids it by name.
- **31 August** — our own gate for signed letters. $0 signed.
- **Randle Walker has been waiting since 29 June** for the Mparntwe / Tennant Creek split on a
  live $106,150 bed ask. Shortest path to a decision on the largest live order.

---

## Systems

**Notion** — [QBE Stage 2 readiness register](https://app.notion.com/p/4838bece0084484aa1ba3b994c82b790) ·
[Stage 2 financial reality check](https://app.notion.com/p/3afebcf981cf8130afa6f1bbb6ff97e5) ·
Goods x QBE Start Here.

**GHL** — Goods Supporter Journey carries every ask with its amount, legal home and next action.
Six live asks sized. Centrecorp is a bed buyer with a live $106,150 order, not a grant line.

**Xero** — the connected org is Nicholas Marchesi, sole trader. That is the entity problem.
