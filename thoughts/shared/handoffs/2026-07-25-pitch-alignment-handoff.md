# Handoff — pitch alignment, 2026-07-25

**Branch:** `claude/investment-deck-alignment-y3qc43` · pushed through `0d9d909`
**Read first:** `wiki/outputs/2026-07-25-goods-pitch-canonical-map.md` (THE map, supersedes 07-18)

---

## Where this landed

The week's problem was diagnosed as **a model problem that kept invalidating decks**, not a deck
problem. Six deck artifacts were built in eight days because the model underneath was still moving.
The Notion business plan "Communities Choose What They Need" (2026-07-25) settled it: the unit of
the story is the pathway a community chooses, not the bed.

Four commits:

| Commit | What |
|---|---|
| `dc783b2` | ONE source of truth for six stages + nine modules (`v2/src/lib/data/pathway-stages.ts`) |
| `6d3b03e` | Deck re-cut to the 12-slide model-led spine + `check-deck-overflow.mjs` gate |
| `4716dcb` | Chrome-free map exports at canon (`render-map-export.mjs`) |
| `0d9d909` | Canonical pitch surface named; 07-18 map superseded |

**Locked stages:** Yarn / Shape / Resource / Deliver / Transfer / Grow.
**Nine modules:** Products, Equipment, Place, Skills, People, Systems, Enterprise, **Money**, Story + evidence.

Three competing stage models were live simultaneously (Notion 6, funder-pathways 6, community-pathways 7).
The operating model had **no Transfer step at all** — the thing the whole pitch centres on was not
tracked anywhere. It is now operating step 7.

Notion had **nine** figure errors fixed, not the six first identified. The extra three surfaced only
because the page was re-fetched and verified after editing: the retired `$1.73M` REAL figure
appeared a **second** time in §6, and "Listen" survived in §3 and §11. **Re-read after editing.**

## Verify in one pass

```bash
cd v2 && npm run build && npm run check:drift        # both green as at 0d9d909
NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/check-deck-overflow.mjs   # 12/12
```

Deck edits: change `v2/public/deck-slides/slides-source.html` **and** `DECK_PLAN` in
`v2/src/lib/data/pitch-cockpit.ts` together, then re-render. `/pitch/simple` joins slides to
presenter notes by slide number, so a mismatch silently mislabels every note.

## ⚠ Before you commit anything

**77 files in the working tree are NOT from this work.** Another session has an uncommitted
brand/logo refactor in flight: `v2/public/logo.svg` and 13 files under `v2/public/brand/logos/`
**deleted**, plus `manifest.json`, `layout.tsx`, `site-header`, `site-footer`, newsletter forms,
SEO components, `admin-sidebar`, `design/brand/tokens.css`, and several `wiki/canon/*` files.

There are **no cross-session commits**, so it is purely working-tree state. It was deliberately left
alone. **Do not `git add -A`** — you would commit another session's half-finished logo deletions.
Stage explicit paths.

`design/Goods_Final_Deck.pen`, `Goods_Deck_SHIP.pen` and the untracked
`Goods_Funder_Pathways_Deck.pen` are also other-session artifacts, all now superseded by the HTML
spine. `Goods_Funder_Pathways_Deck.pen` is a single **flattened rectangle** and cannot be edited.

## The alignment job for the next session

Aligned already: Notion ↔ website ↔ deck on stages, modules and canon figures.

Still to align:

1. **`wiki/investor/14-playout-plan.md`** still describes the OLD 12-beat spine (different beats,
   different content) and is referenced as the deck blueprint. Re-cut it to the new 12, or retire it
   and point at the canonical map.
2. **`design/deck-clean-manifest.md`** still carries the superseded map.png ruling plus its own
   "this ruling is itself stale" correction stacked on top. The map question is now resolved; fold
   the manifest's live rulings (imagery bans, photo method) into the canonical map and retire it.
3. **The leave-behind does not exist yet.** The Pathway Board ships as deck slide 6, but the "one
   page left on the table" artifact was never built as a standalone print piece. This is the
   highest-value remaining build.
4. **Cut the Mykel video** for the room: `v2/public/video/partners/oonchiumpa/mykel-building-the-bed.mp4`.
   One video, maybe two. Nothing longer than the attention it earns.
5. **Eyeball `/pitch/simple`** against the new slides. `DECK_PLAN` was rewritten to match but the
   rendered pairing has not been viewed.
6. **Decide the .pen question.** Either archive all three superseded Pencil decks, or rebuild one
   from `slides-source.html`. Do not edit the flattened one.

## Open loose ends (honest, unchanged)

1. **$0 of the $475K stack is signed** as at 2026-07-25, against a 31 August deadline. The only item
   on this list that actually matters. The deck says so on the slide.
2. **The $324 is modelled**, not measured. The measured run converts it. Never soften it.
3. **Butterfly receipting** — confirm the mechanics before printing "tax-deductible today" anywhere
   donor-facing. A wrong deductibility claim is an ATO problem, not a copy problem.
4. **Brand vs entity** — master brand is "Goods.", charity arm "Goods on Country", but the legal
   entities are The Butterfly Movement Ltd and A Curious Tractor Pty Ltd. Reconcile before print.
5. **Maningrida consent evidence** is cleared by Ben ruling, but the evidence is not pointed at from
   the repo. Name where it lives so a future session can verify rather than trust.
6. **Washer restatus** — 10 stale `deployed` register rows (Tennant 7, Alice 2, Darwin 1) keep
   washers curated rather than drift-checked. Restatus them and make washers a hard-checked field.

## The frame worth keeping

**Three artifacts, one model:** Notion is the diligence read · the 12-slide deck is the room · the
Pathway Board is what gets left on the table.

The deck opens and closes on the handover line, and the ask sits last:
*"The goal was never a bigger Goods. It is a plant that belongs to the people sleeping on the beds."*
