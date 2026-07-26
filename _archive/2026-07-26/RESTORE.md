# Archived 2026-07-26

## FOUNDATION.md

**Why it moved: it did its job, and what was durable in it is now code.**

Written 2026-07-26 to answer "the why, what and how of Goods, then the audience, then how we work
with communities next". It was always a staging document. Once its genuinely new material was
ported, what remained was a second telling of `/STRATEGY.md` in a different order, and the
documented failure mode in this repo is **five competing narrative spines live at once**. A fourth
strategy document was not worth the drift.

**Where each part went.**

| Section | Now lives in |
|---|---|
| §1 Why, §2 What, §3 How | `/STRATEGY.md` §1 to §7, which already held all of it |
| §4 The audience model | `v2/src/lib/data/audience.ts` + `audience.guards.test.ts` (19 guards) |
| §5 Forward case studies | `nextPhase` on each pathway in `v2/src/lib/data/community-pathways.ts` + `next-phase.guards.test.ts` (17 guards) |
| §5.6 The month-6 ownership test | `v2/src/lib/data/ownership-test.ts` + `ownership-test.guards.test.ts` (23 guards); ruling **Q** in `/DECISIONS.md`; resolution recorded at `/STRATEGY.md` §10 |
| §6 Deck / explainer / business model | `/STRATEGY.md` §8, "The three artifacts, and what they are cut from" |
| §7 What is not settled | `/STRATEGY.md` §9 (the governance cost line was the one genuinely new row) |

**What was NOT carried across, deliberately:** the prose restatements of the north star, the road,
the economics and the entities. Those are `/STRATEGY.md`'s job and duplicating them is what would
have rotted.

**To restore:** `mv _archive/2026-07-26/FOUNDATION.md ./FOUNDATION.md`. Note that doing so
reintroduces the duplication above, so if you want it back, prefer taking the one section you need
rather than the whole file.

**The lesson worth keeping:** the parts of this document that survived are the parts that became
guarded code. The parts that died were prose. That ratio is the point.
