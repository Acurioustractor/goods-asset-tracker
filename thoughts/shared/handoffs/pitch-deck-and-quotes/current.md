---
date: 2026-07-15
session_name: pitch-deck-and-quotes
branch: docs/snow-onepager-assets
status: active
---

# Work Stream: pitch-deck-and-quotes

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-07-15
**Goal:** One editable pitch deck + a storyteller quote system, live. DONE = /pitch/deck live on prod (✓ done) and a durable quote table ready for hand-promotion (✓ done). Session complete.
**Branch:** docs/snow-onepager-assets (main SYNCED from it via PR #142 merge faf2820 — main no longer stale)
**Test:** `cd v2 && npm run build` — but this branch has "committed-consumer / uncommitted-dependency" gaps; the Vercel PR preview is the real build gate before any merge-to-main.

### Now
[->] Session complete, ready to /clear. Next pickup = promote §F quote lines into the registry when Ben picks them.

### This Session (done)
- [x] Built **/pitch/deck** — editable investor deck on the signed 6-turn narrative foundation (click-to-edit slides → localStorage, consent-safe voice swaps, fullscreen Present). Data: `v2/src/lib/data/deck.ts`. Copy is em-dash/arrow-free per brand voice.
- [x] Built **/admin/quote-cards** — portrait+quote thumbnail builder off `storyteller-registry.ts`; filter by community/turn/tier, screenshot-ready focus cards; `hold` quotes never render.
- [x] Retired **/pitch/control-room** → `permanentRedirect('/pitch/deck')`; deleted the 5-movement client. Kept orphaned `pitch-control-room.ts` (unused).
- [x] Re-analysed **all 26 consent-cleared EL transcripts** (3 parallel Sonnet agents + Mykel provided/cleared by Ben) → best verbatim quote per person tagged to 6 turns + METHOD/HEALTH/AUTHORSHIP. Output = `thoughts/shared/handoffs/goods-quote-analysis/TABLE.md` (LOCAL-ONLY, gitignored).
- [x] Security: a subagent copied sacred transcript content into the git repo → **gitignored `thoughts/shared/handoffs/goods-quote-analysis/`** (.gitignore ~L185). Nothing sacred in git.
- [x] **Shipped to production**: committed only my files (`3936a53`); fixed the branch's pre-existing Vercel build break by committing 12 forgotten dep files (`48e7a4e`); PR #142 → main (`faf2820`); **verified live at https://goodsoncountry.com/pitch/deck (200)**.

### Next
- [ ] Promote §F quote lines from TABLE.md into `storyteller-registry.ts` — per Ben, one line at a time (his "everything local-only for now" decision).
- [ ] `/pitch` "Open the deck" CTA: my edit to `v2/src/app/pitch/page.tsx` is uncommitted and tangled in ~500 lines of OTHER sessions' WIP on that file — ships when that file's owner commits.
- [ ] Ana - Bega: not in `storyteller-registry.ts` — add as a Bega Health practitioner record, or leave unmapped.
- [ ] Mykel wording: transcript "would've" vs registry "would have" — Ben's call.
- [ ] Cliff Plummer / Brian Russell: sensitive medical disclosures — stay HELD from external unless Ben clears.
- [ ] Optional cleanup: delete orphaned `v2/src/lib/data/pitch-control-room.ts` (nothing imports it post-retirement).

### Decisions
- Deck spine = the SIGNED 6-turn narrative foundation (`wiki/outputs/2026-07-11-narrative-foundation.md`), NOT the diverged 5-movement "Sit down and ask us" control-room spine.
- Storyteller quote re-analysis stays LOCAL-ONLY until Ben promotes lines by hand (custodian call; RED/sacred data).
- Washing machine name = canonical **"Pakkimjalki Kari"** (transcript phonetics "ganja Curry"/"Bujingi Curry" are rough ASR).
- Gloria Turner = CLEARED. Walter = external HOLD (his transcript, but held). Norman/Linda transcripts are about Wilya Janta HOUSING, not the product.

### Open Questions
- UNCONFIRMED: whether the `/pitch` "Open the deck" CTA has landed on prod — depends on another session committing `pitch/page.tsx`; my edit is applied locally only.
- UNCONFIRMED: Dianne "milk crate vs this bed" quote is Basket-Bed-era (2025) but reused as Stretch-Bed (2026) in a field note — flagged for fix, not yet fixed.

### Workflow State
pattern: build-ship-verify
phase: 5
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "editable pitch deck + storyteller quote system, shipped"
- resource_allocation: balanced

#### Unknowns
- pitch_cta_shipped: UNKNOWN (rides another session's uncommitted pitch/page.tsx)

#### Last Failure
(none — final production build green; earlier Vercel fail was the pre-existing missing-deps break, fixed in 48e7a4e)

---

## Context

### Key files
- Deck: `v2/src/lib/data/deck.ts` (9 slides, canonical), `v2/src/app/pitch/deck/{page,deck-client}.tsx`
- Cards: `v2/src/app/admin/quote-cards/{page,quote-cards-client}.tsx` (reads `STORYTELLER_REGISTRY`)
- Control-room redirect: `v2/src/app/pitch/control-room/page.tsx`
- Quote analysis (LOCAL/gitignored, RED): `thoughts/shared/handoffs/goods-quote-analysis/` — `TABLE.md` (master), `batch-A/B/C.md`, `batch-D-mykel.md`, `MODEL.md`
- Evidence source (RED, EL Supabase export): `/Users/benknight/Code/empathy-ledger-v2/output/goods-evidence/goods-analysis-ready-full-transcripts-2026-07-14.json`

### Memory
- `goods-deck-and-quote-cards` (the two tools + the local-only sacred-data rule + the ship story)
- `goods-storyteller-provenance-model` (updated: EL Supabase export resolves several "curated-unknown" voices)

### Ship / deploy facts
- Production = Vercel project `goods-on-country`, deploys from `main`, aliased to goodsoncountry.com + www. ~2 min build.
- The whole current site (deck, /register, admin content system, system-visuals) is now live on main — not just the deck.
- The working branch `docs/snow-onepager-assets` still carries uncommitted cross-session WIP (many M files); it was NEVER swept into any of my commits. NEVER `git add -A` on this branch.
