# The story page on the road spine — handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume. Keep it short. -->
**Updated:** 2026-07-25 (late). **Branch `feat/story-road` PUSHED, 5 commits, CI GREEN, preview verified live. NO PR opened — that needs Ben's word.** Base is `origin/main` at `ae5c14a`, no drift.

**▶ WHAT IT IS.** `/story/road`, the full Goods history as a page, built from the Notion page Ben
named as the story of record: **"Goods on Country // The Work That Stays (Full History, 2026)"**
(`3a4ebcf981cf81199636e03a290597fa`, working narrative edition 21 July). It **ships alongside
`/story`, it does not replace it.** Switching over is a redirect and Ben's call once he has walked
both.

**▶ PREVIEW:** https://goods-on-country-buxnoaho4-benjamin-knights-projects.vercel.app/story/road
Add **`?review=1`** to see the gap markers; they are hidden by default (verified both ways live).

**▶ THE ARCHITECTURE, and the one thing not to undo.** Prose lives in
`v2/src/lib/data/story-road.ts`, markup in `v2/src/app/story/road/page.tsx`. The existing `/story`
hardcodes 1,178 lines of prose into JSX, which is precisely why its copy sits outside every prose
guard in the repo. **Do not put words back in the page.**

It is the **same road as the deck at a different length** — same seven stop ids as `deck.ts`, with
`story-road.spine.test.ts` asserting the two lists stay identical. A shared `road-spine.ts` that
both import would be cleaner; it was not done because `deck.ts` was under concurrent edit.

---

## The two CI failures, because both are instructive

**1. A clip that 404s in production.** `v2/.gitignore:45` ignores `public/video/*.mp4`. That glob
matches **only the top level**, so `/video/partners/**` and `/video/stretch-bed/**` ARE tracked and
the top-level cuts are NOT. `recycling-plant-desktop.mp4` played perfectly in dev and 404d on
Vercel; confirmed live. Stop 6 now uses the hosted Descript cut instead.

**The test that caught it is doing more than its name says.** "Media exists on disk" is really a
**gitignore guard**: CI runs on a fresh checkout, so *exists on disk* there means *tracked by git*.
Keep it. It is the only thing standing between a local-only asset and a broken public page.

**2. A guard built against uncommitted work.** The spine test asserted story stops match the deck's
stops. **The deck's road spine is NOT on main** — it exists only in another session's working tree,
which is what I read when writing the test. On main `deckSlides` has **zero** slides of kind
`'stop'`, so CI compared seven ids to an empty list and failed correctly. The assertion is now
conditional on the deck having a road: **the day the deck rebuild merges, it starts enforcing.**
This is ruling H's lesson from the other direction — not building *on* unmerged work, but building
a *guard against* it.

---

## The Maningrida photos: the trap worth knowing

Ben asked where they were, and he was right that they existed. **They had never reached any public
surface because `design/starred-images/` is gitignored (`.gitignore:80`).** Local-only on one
machine: not in the repo, not in Empathy Ledger (all 149 Goods media rows checked, `location_name`
is null on every one), not in `public/`. Every search by path found nothing.

Consent was never the blocker. **Ben's 2026-07-21 ruling (`CONTEXT.md:77`)** records the 10
Maningrida/Gamardi photos as consent obtained and evidenced, **cleared for external use including
the children, the Elder and the identifiable faces.**

7 of the 10 are now in `v2/public/images/community/maningrida/` and on the page. Originals stay at
`design/deck-photos/maningrida-trip/`.

**STILL OPEN on that ruling, and it is a Ben job:** the consent evidence is not pointed at from the
repo. When he names where it lives (registry entry, EL consent record, signed form), the reference
goes on the manifest rows so a later session can verify rather than trust.

---

## Corrections applied AGAINST the Notion source

Do not let these regress by "syncing with Notion".

- The page calls **$713,827 "accountant-signed"**. **Ruling H says it is not.** Figure kept,
  adjective is `workpaper`, and a test fails if the affirmative claim returns.
- The page states **20 washing machines**; canon is **22** (Ben 2026-07-21, per-community).
- The page's **founder-confirmed post-register update (560 / 197 / 3,940kg) is deliberately unused.**
  Its own header says figures pending register sync must not be restated as audited results, and it
  names the register as the public audit surface. Canon follows the register: **540 / 177 / 3,540**.
- **Break-even is deliberately absent** from the economics section. Notion's 1,679 and 333-338
  predate the July work that re-cut the fixed block into three pots; the honest denominator is now
  a BAND. Do not reinstate a single break-even number.

---

## Gap markers are a review tool, not public copy

They render in development, or on `?review=1`. **Not hidden** — `storyGaps()` still enumerates every
one and the tests still hold them, so what is missing stays counted. It is just not published: the
text discusses editorial state, and one gap named a person's internal consent tier. A test now fails
if repo paths, file names, consent tiers or ruling letters appear in gap text. That detail belongs
in `note` fields, which never reach the DOM.

**TRADEOFF, reversible in one line:** reading `searchParams` turned the route from static to
server-rendered on demand. Worth it while the page is under review, because Vercel previews build as
production and the gaps would otherwise be invisible exactly where they are wanted. **Drop the
`searchParams` after sign-off and it goes static again.**

---

## State of the road

| Stop | Photo | Voice | Video |
|---|---|---|---|
| 1 Kalgoorlie | ✓ +3 | Gloria Turner | |
| 2 Tennant Creek | ✓ | Linda Turner, Annie Morrison, Gary, Norman Frank | |
| 3 The machine with a name | ✓ +3 | Dianne Stokes, Dr Boe Remenyi, Patricia Frank | gap |
| 4 Palm Island | ✓ | Ivy Johnson, Alfred Johnson, Daniel Patrick Noble | |
| 5 Utopia | ✓ | Margaret Lloyd, Ray Nelson | ✓✓ |
| 6 Farm + Maningrida | ✓ +6 | **NONE** | ✓✓ |
| 7 Oonchiumpa | ✓ +2 | Mykel, Kristy Bloomfield, Karen Liddle, Fred Campbell | ✓✓✓ |

**17 named voices across the road**, against the three across twelve slides that ruling C recorded
as a defect. All resolve through `storyteller-registry.ts` at render time; anything not tier
`external` is dropped, so consent is enforced where it is recorded.

**Margaret Lloyd carries Utopia.** Her line was cleared and unused on every existing surface.

---

## NEXT — every open item needs a person, not code

| Open | Who |
|---|---|
| **Walk the preview, then decide whether `/story/road` replaces `/story`** | Ben |
| Open a PR (not done; needs an explicit verb) | Ben |
| **A Maningrida voice.** Confirmed 2026-07-25 there is none. The only East Arnhem registry record is tier `hold` and must not be reached for. **Field job, not a data job.** | Field |
| Where the Maningrida consent evidence lives, so the manifest can reference it | Ben |
| A Basket Bed photo (the stop that corrects it cannot show it) | Field/archive |
| A closing image that reads as transfer rather than delivery | Field |
| Once the deck rebuild lands, extract a shared `road-spine.ts` and make the spine assertion unconditional | Any session |

**Gates at push:** tsc 0 · 284 tests · build clean · drift 9/9 · voice + storyteller guards pass ·
CI green · preview verified live (page 200, all Maningrida photos 200, 5 clips 200).

**Left alone:** another session has uncommitted WIP in `check-qbe-guardrails.mjs`,
`cost-model/engine.ts`, `cost-story.ts`, `deck.ts`, `pitch/deck/deck-public.tsx`,
`pitch/deck/page.tsx`. Nothing here touches those files.
