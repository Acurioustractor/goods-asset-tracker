# Canon photo + video review, as at 3 July 2026

The 40-slot canon taxonomy (`design/canon-slots.json`) is the purpose map for the raise: each slot is one job an image or clip must do across the deck, one-pagers, data room and funder cards. Current picks live in `design/canon-resolved.json` (16 set as at 28 Jun). Visual board: `design/brand/kit/canon-build.html` and the live picker at `/admin/canon`.

## 1. Where the 40 slots stand

| Group | Slots | State |
|---|---|---|
| Hero & narrative | cover-hero, problem, closing-hero | all 3 locked |
| Product | product-hero, product-in-use, product-anatomy, assembly-sequence, kids-building | 3 locked, 2 on seed |
| Plant & manufacturing | plant-hero, plant-panorama, plant-the-one-move, pressed-sheets, shredder, plastic-feedstock, plastic-loop | 2 locked, plant-hero on an EL pick, 4 on seed |
| Community & impact | community-delivery, listening-first, community-ownership, map, washing-machine | 2 locked, 3 on seed |
| Storytellers (RED) | Mykel, Linda Turner, Alfred Johnson, Norman Frank | all cleared, all on seed portraits |
| Cost & finance | cost-curve, breakeven, sankey, where-750 | 4 charts on seed (computed, drift-locked) |
| Logos | logo-black, logo-white | on seed |
| Video | video-hero, video-build, video-testimony, video-plant, video-community | 5 seeded, usable now |
| QBE area visuals | 05 risk, 07 governance, 08 people, 09 ownership, 12 alignment | 5 illustrations, all "draft pending Ben approval" |

Read: nothing is missing that stops the deck rendering. Most unlocked slots already carry a strong seed pick, so the pack is usable today. "Set vs seed" is really "locked vs not-yet-confirmed", not "have vs don't have".

## 2. Consent ledger (the RED assets)

Posture is default-deny (`cleared-voices.ts`, 32 names). Every identifiable person must be on the list.

- **Cleared and ready** (photo + video): Mykel, Linda Turner, Alfred Johnson, Norman Frank. Video: Mykel building the bed (cleared), Karen Liddle on beds (cleared).
- **Jaquilane: CLEARED by Ben, 3 Jul 2026.** Her testimony video is live on `/story` and is now approved. Canon slot note updated. Open nuance: the raw files are "Jaquilane" and "Jaquilane's mum" (`media/raw/Jacquane's Mum.mp4`, `Jaquilane mum full.mp4`) — confirm the approval covers the mum if she is the on-camera speaker, and whether "Jaquilane" should be added to the `cleared-voices.ts` allowlist so she can also appear as an Empathy Ledger storyteller card (not just the hardcoded /story video).
- **Still RED, do NOT use funder-facing until cleared:**
  - `stretch-bed-kids-building.jpg` and the Utopia group clips (Girls making, Boys making, Beds putting together Utopia) — unnamed children/people.
  - `karen-mykel-draft-v3.mp4` ledger cut — carries 4 face-consent blockers plus placeholder music; not a funder cut yet.
  - Sally / Georgina Tennant Creek photo — neither on the allowlist.
- **The single highest-value consent unlock:** `community-testing-bed-golden-hour.jpg`. It is the one warm, human, on-Country hero we have, blocked only by consent, not quality. Clearing its subjects is the best photo you can add to the whole pack. Until then cover-hero runs on `stretch-bed-community.jpg` (fine, less warmth).

## 3. Video pool

Five canon slots, all seeded and usable:

| Slot | Seed | Consent | Note |
|---|---|---|---|
| video-hero | hero-desktop.mp4 | green | ambient background, no faces |
| video-build | mykel-building-the-bed.mp4 | Mykel cleared | the human how-it-works |
| video-testimony | jaquilane-testimony.mp4 | Jaquilane cleared (3 Jul) | now usable |
| video-plant | recycling-plant-desktop.mp4 | green | the on-Country making story |
| video-community | community-desktop.mp4 | green | community b-roll |

Wider pool available but not slotted: `partners/centrecorp/utopia-*` (4 clips: community-setup, bed-building, delivery-road, good-news-full), `partners/oonchiumpa/karen-liddle-on-beds`, `stretch-bed/assembly.mp4` (hands, green), and the `output/ledger-video` raw material (Karen on Beds, Timelapse full build, Utopia Sunrise, Mykel interview). The Centrecorp Utopia clips are the strongest unused proof for the Centrecorp/field-note story once faces are confirmed.

## 4. The gaps that matter for the raise

Not "empty slots" (most have seeds), but shots we do not have and the pack would be stronger with:

1. **A cleared, warm human hero** (golden-hour community bed). Consent, not capture.
2. **A community-ownership photograph.** The core of the recoverable-grant ask is community owning the plant, and today that slot is a diagram only. No photo of a handover / community-owned moment.
3. **Washing machine in use**, ideally with Dianne Stokes (cleared). Current pick is an empty enclosure at sunset.
4. **Portraits for cleared voices with no canon face:** Dianne Stokes, Cliff Plummer, Ivy Johnson are all on the allowlist but have no canon portrait. Pull from Empathy Ledger.
5. **The 5 QBE area illustrations** (05, 07, 08, 09, 12) are all still "draft pending Ben approval." They either get approved into the data room or dropped.

## 5. Recommendation: what to lock next

1. **Confirm the strong seeds to canon.** Most unlocked slots (plant, cost charts, logos, delivery, listening-first) are already the right pick. Locking them is a 20-minute pass in `/admin/canon`, and it stops any future re-render swapping them.
2. **Chase the four sourcing gaps** in section 4, in priority order: golden-hour hero consent, a community-ownership photo, washing-machine-in-use, EL portraits for Dianne/Cliff/Ivy.
3. **Decide the 5 QBE area illustrations** (approve or drop) so the data room stops carrying drafts.
4. **Formalise Jaquilane** in `cleared-voices.ts` + `canon.ts` if she should also render as an EL storyteller card (would move the cleared count 32 -> 33; run `check:drift` after).

Nothing here blocks sending. The pack is usable today; this is about locking the confirmed picks and closing the human-warmth and community-ownership image gaps that make the ownership story land.
