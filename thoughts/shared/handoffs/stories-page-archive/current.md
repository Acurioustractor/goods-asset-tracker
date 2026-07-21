---
date: 2026-07-15T00:00:00Z
session_name: stories-page-archive
branch: docs/snow-onepager-assets
status: active
---

# Work Stream: stories-page-archive

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-07-15T00:00:00Z
**Goal:** One page on the site (`/stories`) where every already-told Goods story is available with real copy and photos, each card clickable through to the full story. Not yet linked in nav (deliberate, per Ben).
**Branch:** docs/snow-onepager-assets
**Test:** `cd v2 && npm run build` (exit 0)

### Now
[->] Done for this pass — awaiting Ben's next direction (nav link? more photos? extend to journeyStories/deck narrative sections too?)

### This Session
- [x] Surveyed every "story" already told across Goods Asset Register + empathy-ledger-v2 (55 items catalogued: trip stories, journey stories, impact quote cards, community partnerships, partner deep-dives, origin story, deck narrative, EL DB stories — 3 published + 19 drafts pending cultural review, excluded).
- [x] Confirmed `/stories` already exists and covers most of this — extended it rather than building a competing new page.
- [x] Added 3 new sections to `v2/src/app/stories/page.tsx`: "In Their Own Words" (impactStories quote cards), "Communities" (communityPartnerships grid), "Go Deeper" (links to /story, /field-notes/utopia-may-2026, /partners/oonchiumpa, /partners/centrecorp).
- [x] Wired real photos: Alice Springs, Palm Island, Utopia Homelands community cards (photos existed on disk but `media.ts`'s `communityMedia` map was stale/undefined for them — worked around with a local override map in the page rather than fixing `media.ts` itself).
- [x] Content-quality pass: fixed Gloria Turner's impact quote (was a paraphrase — "The impact of a mattress on overall health" — swapped for her real transcribed quote from `curated-quotes.ts`: "Sleep on a good mattress. For the back, the legs, the muscles.").
- [x] Made previously-dead cards clickable: Elder grid cards, "Other storytellers" compact grid cards, and the 6 new impact-quote cards now link to `/storytellers/[slug]` where a live page exists (verified 4 of 6 against actual build output: alfred-johnson, gloria-turner, dr-boe-remenyi, cliff-plummer), else fall back to `/communities/tennant-creek` (Melissa Jackson, Norman Frank — no live EL storyteller page).
- [x] Ben supplied Boe Remenyi's photo (`~/Downloads/20250809-IMG_0533.jpg`) → copied to `v2/public/images/people/boe-remenyi.jpg`, wired into the impact card and into `storytellerEnrichment['Dr Boe Remenyi']` in `content.ts`.
- [x] Build verified clean after every change (`npm run build`, exit 0, no lint/type errors).

### Next
- [ ] Ben to decide: link `/stories` from nav, or keep it unlinked for now.
- [ ] Real photo gap: Townsville and Maningrida community cards show "Photo coming soon" — no photo folder exists for either (`v2/public/images/community/`). Townsville has 0 beds delivered so may not need one; Maningrida has 18 beds delivered and no photos on file.
- [ ] `media.ts`'s `communityMedia` map is stale (alice-springs/palm-island/townsville hardcoded `undefined` despite real folders existing for two of them) — worked around locally in `stories/page.tsx`, not fixed at the source. Worth fixing `media.ts` directly in a follow-up so other pages benefit too.
- [ ] Melissa Jackson and Norman Frank have no live Empathy Ledger storyteller page — their impact cards link to `/communities/tennant-creek` as a substitute. If/when they get EL pages, update `impactStoryLink` in `stories/page.tsx`.
- [ ] LinkedIn sweep (Ben's and Nic's post history for untold Goods stories) was explicitly deferred/abandoned this session — user said "not worry about that" after export-format concerns. Not resumed.
- [ ] journeyStories (Zelda Hogan, Brian Russell, Ivy, Dianne Stokes, Linda Turner, Patricia Frank) and the deck narrative are NOT yet surfaced as their own section on `/stories` — only referenced elsewhere (FeaturedStories fallback component, deck.ts). Zelda Hogan and Patricia Frank also have no live EL storyteller page (would need the same fallback-link treatment as Melissa/Norman if added).

### Decisions
- Extend existing `/stories` page rather than build a new "archive" route — avoids two competing "all stories" pages. Ben confirmed this approach.
- Excluded from the page: all 19 unpublished/draft Empathy Ledger stories (cultural review pending) and anything Kununurra-related, per the standing consent-gate rule already in project memory. Default-deny.
- When a card's natural destination page doesn't exist (no live EL storyteller page), link to the community page instead of leaving a dead link or guessing a URL.
- Don't invent/guess photos for gaps (Townsville, Maningrida) — show "Photo coming soon" instead.

### Open Questions
- UNCONFIRMED: whether Ben wants journeyStories and deck-narrative content pulled into their own dedicated sections on `/stories` too, or whether the current "Go Deeper" links-out treatment is sufficient.
- UNCONFIRMED: whether to proactively fix `media.ts`'s stale `communityMedia` map now or leave the local override in `stories/page.tsx` as-is.

### Workflow State
pattern: iterative-build-review loop
phase: complete for this pass
retries: 0
max_retries: 3

#### Resolved
- goal: "one page on the site where all told Goods stories are available with good copy and photos, clickable cards, not yet linked from nav"
- resource_allocation: balanced

#### Unknowns
- ben_wants_journey_stories_section: UNKNOWN
- ben_wants_media_ts_fixed_at_source: UNKNOWN

#### Last Failure
(none — all builds passed clean)

---

## Context

### Files touched
- `v2/src/app/stories/page.tsx` — main edits (3 new sections, Link-wrapping existing cards, photo/link lookup maps)
- `v2/src/lib/data/content.ts` — Gloria Turner quote fix; added `storytellerEnrichment['Dr Boe Remenyi']`
- `v2/public/images/people/boe-remenyi.jpg` — new asset, supplied by Ben this session

### Key reusable patterns discovered (for future story-surface work)
- `/storytellers/[slug]` route resolves via `slugify(displayName)` against a **live Empathy Ledger API call** (`getGoodsStorytellers()` / `getProjectStorytellers()`), not local data — so any card linking there needs verification against actual build output (`.next/server/app/storytellers/*.html`) before trusting the link resolves. Static generation only pre-builds a subset; others resolve at request time via the same live source, so absence from the pre-built set is a reasonably strong signal (not proof) that a page won't resolve.
- `communityPartnerships`, `journeyStories`, and `impactStories` in `content.ts` carry **no image field** — all photo resolution happens externally via `media.ts` maps (`storyPersonMedia`, `communityMedia`) or `storytellerEnrichment[name].localPhoto`. `media.ts`'s community map is known-stale; don't trust it without checking the actual `public/images/community/<slug>/` folder contents.
- Full survey of all 55 previously-told Goods stories (with file paths) is in this session's transcript — not re-saved to a separate doc, since the codebase itself (now updated) is the source of truth going forward.
