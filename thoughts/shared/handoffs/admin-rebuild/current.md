---
date: 2026-09-17T12:35:00+10:00
session_name: admin-rebuild
branch: main
status: active
---

# Work Stream: admin-rebuild

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-17T12:35:00+10:00
**Goal:** Ben, 17 September: "review it all systemically, delete fluff, and build the right system from the ground up." Done when the admin is something he can sit down at.
**Branch:** `main` in `../goods-ledger-wt`. **Both PRs landed.** One small branch open: `docs/vicki-wade-counts-everywhere` (`e798103`, not pushed).
**Test:** `cd v2 && npx vitest run && npm run check:drift && npm run build && npm run smoke:admin`

### Now
[->] **Nothing in flight. Next session is Ben's walk through the admin to see how it feels.**
Start the dev server (`cd v2 && npm run dev -- -p 3013`), open `http://localhost:3013/admin`,
and go through it as a person doing a day's work. The question is whether 14 verbs and two
hubs is the right shape, not whether it renders: `npm run smoke:admin` already proves 75 of 75
surfaces render.

### Shipped today
- [x] **PR #282 merged** (`8b82463`), 67 commits: the admin rebuild, the four spines, the
  Empathy Ledger cross-system work, and the Snow and procurement work from the morning.
- [x] **PR #285 merged** (`354406e`): six dead `/pitch` links on a funder page, found by
  verifying #282 live in a browser. Every gate had passed over them.
- [x] Verified both live on production at their merge commits, in a real browser, after
  waiting out a `x-vercel-cache: HIT` that served the pre-merge text and looked like a
  failed deploy.

### What the admin is now
85 routes to **46** · sidebar 52 links and a 38-item drawer to **14 verbs** · ⌘K from 74 page
titles to **~850 records** · 5 dead links to 0, guarded · **75 of 75** surfaces render ·
`check:drift` from 9 checks to **13**.

The raise hub is the one to look at first with QBE eight days out: Board, The stack, The unit,
The ask, Readiness, Funders, LOI tracker, Pipeline. `/admin` opens with what is due.

### Next
- [ ] **Ben's walk through the admin.** The point of the next session.
- [ ] Push `docs/vicki-wade-counts-everywhere`. Small, one file pair, no rush.
- [ ] Two Notion edits in the QBE document, both in one sentence of the measurement passage:
  **thirty-seven → thirty-eight** and **191 → 192**. Ben has these.
- [ ] Put the Queensland and Western Australia board-test question to the Industry Capability
  Network. Whether Goods on Country Ltd's 100% Indigenous board satisfies it is the single
  unresolved thing in the procurement model.
- [ ] 9 routes still `absorbed`. Most are create forms and per-item documents that should stay,
  so the real floor is about 42.

### Decisions
- **Aunty Vicki Wade counts everywhere (Ben, 17 Sep).** The number is 38 on every surface and
  in every application, with no carve-out for practitioner voices. In `canon.ts` now.
- **The sidebar is verbs.** Nobody opens an admin to visit a page; they open it to do a thing.
- **Only GREEN canon facts cross into another system.** Writing into another database is
  auto-publishing. `assertFeedable` throws on amber and red.
- **The same word is not the same measure.** Beds deployed is not beds in inventory; voices
  cleared for external use is not storytellers with a transcript. A near-miss written into a
  null is worse than the null.
- **Consent attaches to the voice, never to the whole person (Ben, 17 Sep, on Jimmy Frank).**
  A tier governs a story, never whether we may write to a partner about the work they partner on.
- **The consent authority is the `consents` table**, not `extracted_quotes`. 206 in-person,
  self-spoken records on 14 September.

### Open Questions
- UNCONFIRMED: whether 46 routes still feels like too many once Ben walks it. The nine
  `absorbed` are the only cut left that does not delete a working surface.
- UNCONFIRMED: Dorrie Jones and Ray Nelson have no Empathy Ledger record at all, so two of the
  32 storytellers cannot be cross-checked for consent.

### The thing worth carrying forward

**grep is not the authority on whether code is used. The compiler is.** Three times in one day my
dead-code detection said a file was unimported and it was live: a relative path the pattern missed
(`./data/team`, feeding /admin/people), a whole directory deleted for two files inside it
(`components/model`, breaking the public pitch), and a dynamic import (`community-map`, the
communities map). tsc caught all three before anything shipped, which is the only reason none of
them landed.

The same shape appeared in the data: the guards written that morning caught `Galiwinku` against
`Galiwin'ku` as two places, `Santa` and `Teresa` as two invented communities, Warlpiri resolving
Lajamanu to Yuendumu, two people holding two consent records each, and me citing an amber canon
fact as the basis for a figure crossing into another system.
