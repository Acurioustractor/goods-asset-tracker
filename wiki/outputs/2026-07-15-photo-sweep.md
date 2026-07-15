# Photo sweep: 51 files from Ben's Downloads, 15 July 2026

*Every photo described, placed, scored and consent-flagged by an 11-agent vision sweep, then
staged into `v2/public/images/community/<place>/` at web weight (1800px, q75) and indexed into
`content_items` so the media library at /admin/media-library is the single tagging surface.
Ben's brief: "full sweep of all photos, one surface to tag properly, more people on beds."*

## The system (so this never rots again)

1. New photos land in `v2/public/images/community/<place>/` with a descriptive slug.
2. `cd v2 && npm run content:index` upserts them into content_items (checksum identity,
   re-run safe, never overwrites stars/tags).
3. **/admin/media-library is THE tagging surface**: star, rate, community, consent, archive.
4. The deck and pages pull only from committed, web-served paths; galleries in `deck.ts`.
5. Place uncertain = `unplaced/` dir; Ben retags community in the library, one click.

## Wired into the live deck this pass

| Deck moment | Photo | Why |
|---|---|---|
| Turn 2 header (was the Deadly Heart event placeholder) | kalgoorlie/mattress-dumped-jerry-can.jpg | The supply failure itself: a failed mattress on red dirt, no people, place-attributed. Gap #1 closed. |
| Turn 2 gallery | kalgoorlie/dump-site-dawn + mattress-ochre + mattress-decayed | Three more people-free supply-failure frames. |
| Turn 4 gallery | unplaced/rec-assembly-03-threading-pole + rec-assembly-07-wheelchair-guide | Kids assembling the current X-trestle bed, product-accurate; an Elder in a wheelchair guiding the build. |
| Hinge gallery | palm-island/bedding-golden-hour.jpg | Kids carrying new bedding home at golden hour. |
| Turn 5 gallery (lead) | alice-springs/oonchiumpa-team-red-bed.jpg | The partner org with finished product + stacked components. Gap #2 (transfer photo) closed. |
| Closing gallery | alice-springs/stretch-bed-two-generations + unplaced/rec-bed-done-joy + alice-springs/oonchiumpa-office-joy + stretch-bed-kids-pile | The people-on-beds upgrade Ben asked for: all current product, all quality 5. |

## Holds and rules applied

- **Kununurra (3 files, 20260709 and 20260711): LOCAL-ONLY HOLD** in
  `design/_image-originals/kununurra-hold/` (gitignored). Nothing Kununurra surfaces anywhere
  until the Elder clears words, scene, audience and use (core-messaging spec §5).
- **Hardship scenes with identifiable people** (kalgoorlie/camp-visit, camp-mattress-tent,
  alice-springs/bush-camp-fire): staged and indexed for the record, NOT wired to any public
  page. The what-not-to-do rule: no anonymous hardship imagery for emotional leverage. Ben's
  call if any ever surfaces, with consent.
- **Basket-Bed-era photos** (crate base + white topper: most Palm Island and Kalgoorlie people
  shots, the IMG_36xx and IMG_37xx-38xx sets): kept and indexed as community-story history, NOT
  used on Stretch Bed product surfaces (archived product; would misrepresent the current bed).
- **Children's faces**: flagged per file in the index. Already-established pattern (build/ dir)
  is that Ben clears specific uses; the closing-gallery picks follow his explicit direction
  today for more people-on-beds imagery.

## Notable finds (beyond the wired set)

- kalgoorlie/elder-orange-walker.jpg (q5 portrait) and man-new-mattress.jpg (q5, delivery day)
- palm-island/two-men-thumbs-up.jpg, naidoc-nan-kids-bed.jpg, kids-new-mattress.jpg,
  woman-boy-new-bed.jpg (q5 delivery-day joy, Basket era)
- alice-springs/atnarpa-portrait.jpg (q5 golden-hour portrait, Atnarpa Homestead)
- unplaced/old-vs-new-bed.jpg (q5: new bed in front, dead mattress behind; the whole story in
  one frame, Basket era)
- darwin/deadly-heart-first-lie-down.jpg (the better Deadly Heart moment: joy, not the event)
- The rec-centre assembly series (12 frames) is a complete kids-build-a-bed photo essay;
  place unconfirmed, likely worth its own field-note strip once Ben confirms where it was.

## Place attribution progress

Before: 2 of 9 communities had any place-attributed public media (Utopia + 1 Tennant Creek).
After this sweep: + Kalgoorlie (11), + Palm Island (12), + Alice Springs (7), + Darwin (1).
Still zero: Tennant Creek (beyond 1), Maningrida, Mount Isa, Canberra.

Full per-file records (description, place confidence, deck moment, quality, flags) live in the
sweep output: session task `w4vy39fty` (51/51 described, 0 failures).
