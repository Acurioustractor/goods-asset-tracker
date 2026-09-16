---
date: 2026-09-16T14:10:00+10:00
session_name: philanthropy-in-the-story
branch: main
status: shipped
---

# Work Stream: philanthropy-in-the-story

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T14:10:00+10:00
**Goal:** Put the funders who backed Goods from the start into the story on /pitch, and fix what was broken underneath. DONE: PR #271 merged, live on goodsoncountry.com.
**Branch:** main (a169ec8). Worktree removed, branch deleted.
**Test:** `cd v2 && npx vitest run && npm run check:drift:ci && npm run check:storytellers`

### Now
[->] Nothing in flight. Next session picks from Next.

### This Session
- [x] Found the hole: /pitch had 114 Oonchiumpa, 37 QBE, 34 Centrecorp (a BUYER), **0 Snow**, who paid 64% of all philanthropy
- [x] **Consent leak closed.** The 2026-07-21 reattribution COPIED two misfiled quotes onto Kylie Bloomfield and Katherine (DHT) but never deleted them from Georgina Byron. Both source records are tier `hold`, hers is `funder`, tier resolves by NAME, so two community voices were publishable under a funder's name for 8 weeks. Guards added both directions in consent.guards.test.ts
- [x] **FRRR/VFFF double-count off the public /press page.** compendium funding now DERIVES from grants-received.ts. TFN $130k/~$80k → $144,558; QBE Stage 1 $10k → $50k
- [x] **Unsourced "89% from grants" removed** from story-road: grants ($772,788) EXCEED the $713,827 revenue figure printed beside it, so it could never have held. Real share ~76%
- [x] **`src/lib/fleet/` RESCUED.** It was UNTRACKED, in no commit on any branch, sitting in the main tree beside 663 other uncommitted files. Carries `reviewedControllers` (Ben's 14 May map) + resolveWasher + 17 passing tests
- [x] Centrecorp moved out of the footer's "Backed by" into "Buys from us" (they are a buyer, INV-0291, never a grantor)
- [x] Two Descript videos registered (Georgina QOpJepwNzo9, Jahvan 6hVl3CzxdqR) — both cleared for weeks, reachable by nothing
- [x] `/pitch` ch4: SnowArc, full-bleed StickyFilm over the Tingkkarli drone, 9 moments + 3 ways + Georgina closing
- [x] `/pitch` ch6: funder moments inside road stops 2 (Snow) and 4 (FRRR/VFFF + Jahvan)
- [x] `/pitch` ch15: all seven funders in arrival order, NO dollar figures
- [x] Palm Island washers 4 → 5: GB0-138 reinstated (Ben's ruling); canon 22 → 23
- [x] cleared-voices canon **37 → 38** with Aunty Vicki Wade
- [x] PR #271 merged, verified live, 8 stale branches deleted, worktree removed

### Next
- [ ] **PR #235** (`fix/sponsor-server-render`) open 13 days, mergeable UNKNOWN. Its own description says PR #216 should be CLOSED
- [ ] **FRRR Community Led Climate Solutions** — awarded ~16 Jul 2026, Ben says PAID, in NONE of these books. Need the AMOUNT and the RECEIVING ENTITY. Recorded in `GRANTS_AWARDED_OUTSIDE_THESE_BOOKS`; emptying that array is the signal it is resolved
- [ ] **The six quotes in the FRRR acquittal** (`~/Downloads/Backing the Future acquittal report - Updated Sep-25.docx`). Two attributed to unnamed "young participants" exist NOWHERE in the consent record; four attributed to Ivy, Alfred, Jason and Jahvan in wording their records do not carry. Sent to FRRR 22 Mar, passed to VFFF 30 Mar. **Ben has not ruled on this**
- [ ] `feat/ai-tells-gate-and-goods-model` — the AI-tells gate Ben mandated on 10 Sep is STILL not on main
- [ ] Fleet: 9 "Pending Assignment" washers + 8 beds at Tennant Creek counted as deployed with nobody recorded as having them; 3 orphan controllers reporting (chase `c4b9`, 48 cycles then silence)
- [ ] `nic-with-elder-on-verandah.jpg` still unused

### Decisions
- **Catalytic capital, never a graduation story** (Ben): order of arrival is the argument, backing the founder, "bought the option" not "proven". Snow is CURRENT, not historical. A guard fails the build on "stands on its own" / "proven now"
- **No dollar figures on funder surfaces** (Ben): an amount invites the next funder to anchor and turns a record of trust into a league table. `bought` field carries what it paid for instead
- **Centrecorp is a buyer, not philanthropy** (Ben)
- **Palm Island has 5 washers** (Ben): GB0-138 reinstated rather than inventing a row. If the real fifth is a different machine, its note says how to reverse
- Photos stay OUT of the repo until consent is recorded in `content_items` — the repo is public, so `v2/public/images/` publishes the moment a file lands
- Names/quotes resolve from the registry BY SLUG, never typed into a component: the storyteller guard fails the build on a non-external name appearing literally, and caught three drafts

### Open Questions
- UNCONFIRMED: the FRRR Climate Solutions amount and which entity received it (auspice? Our Community Shed is a known DGR1 auspice for ACT)
- UNCONFIRMED: whether the short "Acquitted in March 2026." in `grants-received.ts` `bought` should also go (Ben removed the longer sentence)
- UNCONFIRMED: the section is 11 full screens inside ch4. Ben has not objected, but it is long before a reader reaches ch5

### Workflow State
pattern: sequential
phase: 6
total_phases: 6
retries: 0
max_retries: 3

#### Resolved
- goal: "put the people who backed this from the start into the story, and ship it live"
- resource_allocation: aggressive

#### Unknowns
- climate_solutions_amount_and_entity: UNKNOWN
- frrr_acquittal_quotes_ruling: UNKNOWN

#### Last Failure
(none)

---

## Context

### The thing that took the longest to see
Three separate times a fix existed and had never shipped: the AI-tells gate (on a branch, unmerged), the two Descript videos (cleared in the registry, registered nowhere), and `src/lib/fleet/` (untracked, in no commit at all). The pattern is worth naming: **work here gets done and does not land**, and nothing was watching for it.

### Where the money actually is
`grants-received.ts` is the only reconciled list: 7 lines, $772,788, tied to the books 16 Sep. Only ONE Xero org is connected (`Nicholas Marchesi`, the sole trader file). "Grants Received" account read $0.00 for 1 May–16 Sep 2026. Anything in another entity or auspiced is invisible from here by design.

### Consent architecture, as it now stands
Three tiers, three render paths, no crossing:
- `external` → community `Voice` / `Aside` (name · role · community)
- `funder` → `FunderMomentBlock` / SnowArc funder slot (name · role, labelled as the organisation)
- `internal` → Nic only, explicitly labelled Co-founder
Guards assert each direction. `registryQuote` accepts `primary` OR `approved` — taking only `approved` silently dropped Patricia Frank off the page, which is the worst way for a default-deny gate to fail because it looks like a design choice.

### People now in the pitch
Jahvan Oui, Norman Frank Jupurrurla, Jimmy Frank Jupurrurla (Chief Cultural Officer, Chair of Wilya Janta), Linda Turner, Patricia Frank, Annie Morrison, Dianne Stokes, Dr Boe Remenyi, Aunty Vicki Wade, Georgina Byron AM, Nic Marchesi.

### Photos added this session (all `public` in content_items on Ben's consent)
- `community/tennant-creek/wilya-janta-golden-hour.jpg` — Sally, Georgina, Nic
- `community/tennant-creek/waterhole-group.jpg` — Sally, Jimmy, Linda, Georgina, Patricia (left to right)
- `community/palm-island/panel-carry-aug-2025.jpg` — the pressed panel with "Goods x Snow Foundation" on it, 13 Aug 2025, inside the FRRR workshop dates
- `people/georgina-byron.jpg`, `people/vicki-wade.jpg` — both also listed in `people-portraits.ts`, which is REQUIRED (public/ is not on disk in the Vercel bundle)
- `video/tennant-creek/tingkkarli-drone.mp4` + mobile + poster, cut from the 3 Apr 2025 trip at the house spec

### Stale tooling found
`tools/extract-segments.sh` and the `video-pipeline` SKILL both describe 1920x1080@30fps and write to `deploy/`, which CLAUDE.md says never to touch. What actually ships is 1280x720@25fps desktop and a 404x720 vertical mobile crop. Fix or delete.

### Do not
- Run `git clean` anywhere near the main tree: 664 uncommitted files on `feat/empathy-ledger-accountability-events`
- Delete `feat/placemat-customer-voice`: `[gone]` on the remote but checked out in `../goods-placemat-wt`
