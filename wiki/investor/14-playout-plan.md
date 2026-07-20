# Area 14 — The playout plan: how everything assembles

> The blueprint for playing the whole system out: which voice, quote, photo and video lands on
> which surface, in what order, all linked. The .pen deck rebuild happens LAST, from this plan,
> once the sweep is clean and Ben's clearing pass has filled the quote inventory.
> Inputs: 12-voice-impact-model.md (the model), 13-linkage-coverage.md (auto-generated
> coverage), case-studies/ (the five patterns), the flagship story, media_links (live),
> QUOTE-REVIEW.md (clearing queue).

## 1. The assembly rule

Every surface beat = **stat + voice + face + proof-media**, all four linked:
- stat from canon.ts (register-verified, labelled)
- voice = a CLEARED registry quote (verbatim, attributed, consent-traceable)
- face = EL portrait via media_links (or place photo where no portrait is cleared)
- proof-media = a linked photo or video of the moment (media_links person/community rows)

If any of the four is missing, the beat is not ready; the gap goes to the coverage report, not
to improvisation.

## 2. The canonical narrative spine (all surfaces follow it)

| Beat | Stat | Voice (cleared today) | Media on hand | Ready? |
|---|---|---|---|---|
| 1. The problem | freight/price/dump cycle | NEEDS CLEARING: Daniel D34/D35, Alfred D18, Jimmy D15, Carmelita D36 | problem.jpg, community-delivery.jpg | voice pending |
| 2. Never asked | 60-year default | NEEDS CLEARING: Linda D24, Gary D16 | listening-first.jpg | voice pending |
| 3. Designed in community | 180°C, X-trestle, products.ts specs | Dianne D3 "go and talk to the elders" ✅ | product-anatomy.jpg, Dianne portrait + storyteller photo | READY |
| 4. Proof at delivery | 540 / 177 / 20 / 11 / 3,540kg | Margaret x3 ✅ + Dianne D5 milk-crate ✅ | map.png (canon), delivery photos, Margaret needs a photo | READY (photo gap) |
| 5. The loop works | 3,540kg, plastic loop | Shayne "not gonna break / blowing my mind" (pending) | plastic-loop.jpg, sankey, shredder.jpg, washing-machine.jpg | voice pending |
| 6. Delivery in community hands | Maningrida 58 beds + 8 washers | Shayne x2 ✅ | community photos; Mykel video, Karen video (linked) | READY |
| 7. The making | Mykel/Oonchiumpa builds | Mykel registry ✅, Karen registry ✅ | mykel-building-the-bed.mp4 (linked), kids-building.jpg, assembly-sequence.png | READY |
| 8. The hinge (truck test) | $685 vs $426, break-even 333-338 | Dianne D4 "hear from the ground" ✅ | cost-curve.png, breakeven.png | READY |
| 9. Ownership is the ask | Oonchiumpa request (requested, not settled) | NEEDS CLEARING: Kristy generational-wealth + Tanya allies | community-ownership.png, area-09 | voice pending |
| 10. The funder witness | Snow ~$493K delivered, $0 signed match | NEEDS CLEARING + audio check: Georgina with-not-for | storyteller portraits, Deadly Heart context | voice pending |
| 11. The ask | $400K signed match-eligible by 31 Aug; QBE up to $400K | (numbers slide, no quote needed) | map.png, where-750.png | READY |
| 12. Close | "We know what we need" synthesis line (never quoted) | Dianne D8 blessings ✅ | closing-hero.jpg | READY |

Seven of twelve beats are fully ready today; five wait only on the clearing pass (the exact
quote numbers are listed, all in QUOTE-REVIEW.md).

## 3. Surface map (one spine, many cuts)

| Surface | Cut | State |
|---|---|---|
| Funder deck (HTML) | beats 1-12, one slide each; slides 05/06/07 already carry cleared voices | LIVE, on canon |
| .pen deck + one-pagers | rebuild LAST from this table once beats 1-12 all READY | HOLD (deliberate) |
| /pitch/deck (public) | same spine, galleries + inline video per beat | live; sync after clearing pass |
| Flagship story | beats 4-6-12 as prose (done: the-voices-are-the-evidence.md) | READY for blog |
| Case studies x5 | one pattern per enterprise audience | DRAFTED (2 fully cleared) |
| /admin/voice-impact | the engine room: all voices, all links, all gaps | LIVE |
| Community pages + Atlas | per-community cut: voices + media + assets per place | LIVE, grows with media_links |
| Stories page /stories | per-storyteller cut with EL links | live; add new cleared voices after pass |

## 4. What unblocks full playout (in order)

1. **Ben's clearing pass** on the named quotes above (D13-D45 subset + Kristy/Tanya/Georgina
   lines). This is the single biggest unlock: 5 beats flip to READY.
2. **Photo links for the proof voices**: Margaret has no photo (none may exist; a place photo
   of the homeland delivery run works); Ana-Bega has nothing; storyteller-photo coverage is
   listed per voice in 13-linkage-coverage.md.
3. **Video**: only Mykel + Karen videos exist linked. Nic's plant walkthrough is a Descript
   embed (get the file); Sinnae video missing; May-trip footage still not in repo. Every future
   trip: one video per beat is the collection target.
4. **Audio checks** where transcription is garbled before external use (Gary, Jimmy D14,
   Georgina names).
5. **Then the .pen deck rebuild**: 12 beats, one slide each, every asset path from
   deck-photos/, every quote from the registry, canon strip from CANONICAL_ASSETS. One session,
   no improvisation.

## 5. Standing loop (keeps it alive)

After ANY change (new transcript, cleared quote, new media): rebuild voice-impact data,
re-run `build-linkage-coverage.mjs`, re-check this table's READY column. The playout is done
when every beat is READY and every surface carries the same spine.
