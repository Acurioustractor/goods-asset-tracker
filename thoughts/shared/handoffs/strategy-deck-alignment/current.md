---
date: 2026-07-15T04:05:00Z
session_name: strategy-deck-alignment
branch: docs/snow-onepager-assets
status: active
---

# Work Stream: strategy-deck-alignment

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-07-15T04:05:00Z (pre-/clear save)
**Goal:** One aligned, human, provenance-backed strategy system: messaging + deck + photos + storytellers + Notion, all one loop. Substantially DONE and live; remainder is Ben-gated.
**Branch:** docs/snow-onepager-assets (working line; every ship goes via worktree cherry-pick off origin/main — squash-merge divergence means direct PRs from this branch CONFLICT)
**Test:** `cd v2 && npm run build` (exit 0). Ship ritual: commit on branch → cherry-pick to ship/* off origin/main → PR → checks → squash-merge → verify on PRODUCTION (previews work again but prod is the truth).

### Now
[->] Ben eyeballs the swap picker post-fix (hard refresh /admin/deck-builder). Verified 255/255 thumbnails locally on identical code + prod optimizer URLs probe 200; NOT yet eyeballed in his session (he interrupted the browser check, saving to clear instead).
[->] 2026-07-15 (post-/clear): CODEX ULTRA HANDOFF written + fact-checked: `wiki/outputs/2026-07-15-codex-deck-ultra-handoff.md`. Self-contained (Notion inlined, all figures verified against canon by an adversarial pass, 5 discrepancies found + fixed). Paste-ready prompt at the top; deliverables spec = wiki/outputs/2026-07-16-codex-deck-ultra/. Codex scope: strategy + SAFE-EDIT copy only, no pushes; 12 Ben-gated checkpoints named in §15.

### This Session (2026-07-15, all MERGED to main + verified live unless noted)
- [x] **#143** Core-messaging alignment (6-turn spine absorbed Ben's 14 July draft: truck-test hinge, presenter scripts, claims-status labels) + public/builder deck split (/pitch/deck public, /admin/deck-builder internal).
- [x] **#145** Maroon purged from all deck surfaces (Ben's emphatic call; factual demand records kept). #144 closed unmergeable (branch divergence discovered).
- [x] **#146** Photo sweep: 51 Downloads photos vision-catalogued → 48 staged to v2/public/images/community/<place>/ → content:index (68 rows) → deck gaps closed (Turn 2 Kalgoorlie supply-failure series, Turn 5 Oonchiumpa team, people-on-beds closing gallery). 3 Kununurra files HELD local-only.
- [x] **#147** One content system: media-library NOTES (needs Ben's ALTER, see Next), swap widget (photo/video per slide via /api/admin/media-pick), voice pool = all external-tier, /admin/story-atlas.
- [x] **#148** Transcript provenance model IN CODE (v2/src/lib/data/transcript-provenance.ts) + atlas integration: 26 of 41 voices transcript-backed. MAJOR CORRECTION: EL DATABASE holds transcripts for ~27 voices incl. ALL Tennant Creek; the Notion-only "12, zero TC" view was wrong (memory + wiki doc corrected).
- [x] **#149** Gary's fire-and-dirt line VERIFIED verbatim in his 5,264w transcript (Goods context; "Beyond Shadows" was a Notion mis-filing). Spec flag E4 resolved.
- [x] **#150** Narrated deck: presenter scripts as visible first-person narration, place-and-time stamps + dashed thread, LeadVoice pull-quotes with provenance whispers ("recorded January 2025") on the public page.
- [x] **#151** 23 missing gallery images committed (utopia/ was never tracked, build/ partial — sweep agent claimed "committed" unverified) + admin sidebar links (Deck builder, Story atlas).
- [x] **#152 + #153** Picker fixed twice: raw 1-3MB originals → next/image thumbs; then quality 55 → 75 (Next 16 allowlist [75,90] 400ed q55). Verified 255/255 loaded locally + prod optimizer probes 200.
- [x] Notion restructure (Ben approved 3 calls): Start Here SPLIT thin funder-only (internals → QBE operating plan incl. moved child page + Opportunity Register DB); superseded banners (Story Spine, May slide order, Feb Videos+Photos); Descript links + Google Photos rescued to the Shelf; deck = THE story (no Notion fork). Shelf = Ben+Nic front door (39debcf981cf8101bd57fba80c691906); strategy page = deck home (39debcf981cf810da4b1f2180b1f62fa).
- [x] Vercel Preview env FIXED (NEXT_PUBLIC_SUPABASE_* added to Preview via CLI, Ben-authorized; broken 4-15 July).
- [x] PDF leave-behind design/deck-assets/goods-strategy-deck-2026-07-15.pdf (needs regen for narrated-deck copy changes if Ben wants parity — maroon fix IS in it, place stamps are NOT).
- [x] Two-price-tags illustration DRAFT (generated-images/goods-illustrations/two-price-tags/01) + 27s assembly loop (committed, unwired) + Warumungu naming verified (Dianne yes; Norman/Patricia role + bed name = no evidence).

### Next (all Ben-gated)
- [ ] **ALTER paste** (Supabase SQL editor, Goods cwsyhpiuepvdjtxaozwf): `ALTER TABLE content_items ADD COLUMN IF NOT EXISTS notes text;` → media-library comments persist.
- [ ] Kununurra Elder clearance (words/scene/audience/use + registry record) → unlocks deck Variant A + 3 held photos.
- [ ] Two-price-tags illustration: approve / regenerate without the connecting arrow.
- [ ] Mykel registry wording: transcript-verbatim "would've" vs stored "would have".
- [ ] Record Patricia Frank (only load-bearing voice with NO transcript anywhere); also Fred Campbell (24w clip only), Kristy (leads only), Ana - Bega registry entry.
- [ ] Media library: tag 17 unplaced/ photos (rec-centre 12-frame build series: where?), star favourites (drives picker ordering).
- [ ] Deck picks via builder → Export edits → hand to Claude to commit.
- [ ] Optional: regen PDF for narrated-deck parity; wire assembly loop; update strategy Notion page with narrated-deck description.

### Decisions
- Signed 6-turn foundation governs facts/structure/voices; Ben's 14 July draft governs spoken voice + claim hygiene. Deck = 10 slides + paper-only Kununurra variant.
- MAROON banned from deck/story surfaces. Truck test used ONCE. Synthesis sentence never in quote marks.
- Kununurra: NOTHING surfaces (not even "gated" in code — public page is click-to-editable) until her clearance + registry record.
- Media: /admin/media-library = THE tagging surface; picker = local committed media only (EL needs its own consent path); Basket-era photos = history only, never on Stretch surfaces; hardship-with-people indexed but never surfaced.
- Provenance: transcript existing ≠ release granted (EL release states carried everywhere); provenance whispers on the public deck (recorded dates for transcript-backed; silence for curated).
- Ship = worktree cherry-pick pattern, verify on PRODUCTION with content checks (curl 200 on a page ≠ page correct: admin pages 307→login read as 200 via -L; images can 404 while page 200s; picker can fail while API works — check the actual thing).

### Open Questions
- UNCONFIRMED: picker renders in BEN'S browser post-#153 (verified local + probes; he was mid-check at save).
- UNCONFIRMED: whether extension "page never idle" on /admin/deck-builder fully resolves with thumbnails (was megaload-driven; claude-in-chrome injection kept timing out — do not rabbit-hole this again, verify via playwright-on-localhost dev bypass instead).
- Rec-centre assembly series location unknown (Ben to tag).

### Workflow State
pattern: align-build-ship loop (many small verified ships)
phase: complete; next phase = Ben's review queue
retries: 0
max_retries: 3

#### Resolved
- goal: "one connected, real, human strategy system, live"
- resource_allocation: aggressive (ultracode)

#### Unknowns
- picker_in_bens_browser: UNKNOWN (post-#153)

#### Last Failure
Picker thumbnails (2 bugs, both mine, both fixed + verified): raw originals megaload; then q=55 vs Next 16 allowlist.

---

## Context

Full detail lives in (read on demand):
- Memory: `goods-strategy-deck-alignment` topic file (the day's full record incl. Notion IDs, ship gotchas) + corrected `goods-storyteller-provenance-model`.
- Specs: `wiki/outputs/2026-07-15-strategy-deck-core-messaging.md` (message architecture + flags register) · `wiki/outputs/2026-07-15-photo-sweep.md` (photo system + holds) · `wiki/outputs/2026-07-14-storyteller-provenance-model.md` (with 07-15 supersedence note).
- Code anchors: `v2/src/lib/data/deck.ts` (deck words/media/scripts/places) · `transcript-provenance.ts` (per-voice model) · `/admin/deck-builder` (swap widget + Export edits) · `/admin/story-atlas` · `/api/admin/media-pick`.
- Notion: Shelf `39debcf981cf8101bd57fba80c691906` · strategy page `39debcf981cf810da4b1f2180b1f62fa` · thin Start Here `381ebcf9...` · QBE operating plan `380ebcf9...819cac62` (now holds the internals + moved children).
- Standing context: QBE $400K needs signed LOIs by 31 Aug (0 today); SEFA first. The deck exists to close that.
