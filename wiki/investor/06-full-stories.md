# Area 6 — Full Written Stories (long-form narrative inventory)

*2026-07-20. Inventory of the full written stories (narrative prose, not standalone quotes) the pitch can draw on. Scope: code data layer, /stories and /story routes, wiki outputs, handoff ledgers. Standing rules apply: consent gate default-deny (Kununurra Elder and Walter never quoted or excerpted), quotes registry-verbatim only, ownership is a pathway, scabies to RHD is the why only, no banned words.*

## 1. The written-story landscape (where long-form narrative lives)

| Source | What it holds | File |
|---|---|---|
| Trip stories (field notes) | 1 full multi-scene narrative: Utopia May 2026 | `v2/src/lib/data/trip-stories.ts` (`tripStories = [utopia]` only) |
| Journey stories | 6 short person-centred narratives with verbatim quotes | `v2/src/lib/data/content.ts` (`journeyStories`, line 325) |
| Deck narrative | 10-slide spoken narrative (cover, model, turns 1-5, truck-test hinge, ask, closing) with full presenter scripts | `v2/src/lib/data/deck.ts` (`deckSlides`) |
| Origin / project history | "Our Story" timeline 2018-2025 (Spark, Pattern, Question, ACT, 540 Beds, Washing Machines) plus prose sections | `v2/src/app/story/page.tsx` |
| Stories archive page | Assembles the above: journey cards, "In Their Own Words" quote cards, community grid, Go Deeper links; 55 items catalogued in the survey behind it | `v2/src/app/stories/page.tsx` + `[id]` detail route |
| Narrative foundation | The signed gate document for all investor narrative; model definition in Ben's words | `wiki/outputs/2026-07-11-narrative-foundation.md` |
| Utopia story spine | Working spine for the Utopia scroll-with-video feature; scene-by-scene, consent-annotated | `wiki/outputs/utopia-story-spine-2026-05.md` (+ `utopia-story.html`) |
| Pitch narrative snapshot | Current pitch narrative as of 14 Jul | `wiki/outputs/2026-07-14-goods-pitch-narrative-current.md` |
| Story-artifact decision | Which artifact carries which story | `wiki/outputs/2026-06-05-goods-story-artifact-decision.md` |
| Handoff ledgers | Stories-page survey + pitch-room deck-builder state | `thoughts/shared/handoffs/stories-page-archive/current.md`, `thoughts/shared/handoffs/pitch-room/current.md` |

Note: `wiki/articles/` has no dedicated "Project History" article (checked; label in 00-INDEX refers to the /story timeline + narrative-foundation doc). `wiki/articles/communities/tennant-creek` carries design-history narrative; `brand-comms/02-storyteller-voices.md` is quote-level, not long-form.

## 2. Story-by-story inventory

Consent statuses below are read from `v2/src/lib/data/storyteller-registry.ts` (per-quote `primary / approved / hold`). "Registry: yes" means the person has a registry entry with cleared quotes.

### Trip story
| Story | Lives | Storytellers | Pitch moment | Notes |
|---|---|---|---|---|
| **From Alice Springs to Utopia** (`utopia-may-2026`) | `trip-stories.ts` → `/field-notes/utopia-may-2026` | Dorrie Jones voice card; Frankie Holmes OAM + Donald Thompson OAM scene (both in registry); Oonchiumpa (Kristy Bloomfield, registry: yes) | Delivery + ownership ("Move the making to Country", "Build it in your community" CTAs) | The only shipped trip story. Ampilatwatja Elders cleared but full names to confirm before crediting (standing open item). Spine doc marks most voices consent pending for the video feature; the shipped code version is the cleared cut. |

### Journey stories (content.ts, all with verbatim quote blocks)
| Story | Person / place | Registry | Pitch moment |
|---|---|---|---|
| From a Tin Shed to a Home | Zelda Hogan, Tennant Creek | yes (`zelda-hogan`) | Proof (stability, kids at school) |
| Rest After a Heart Attack | Brian Russell, Tennant Creek | yes (`brian-russell`, primary + approved quotes) | Problem to proof (bed as medical necessity) |
| From Floor to Bed | Ivy, Palm Island | not in registry under that name; deck uses her as a Turn 1 voice | Problem (floor sleeping, dignity) |
| She designed it. She named it. | Dianne Stokes, Tennant Creek | yes (`dianne-stokes`, 1 quote on hold: totem line) | Ownership + model (design in community) |
| Never Been Asked | Linda Turner, Tennant Creek | yes (`linda-turner`) | Problem + ownership (never asked; own destiny). Disambiguate from the excluded fabricated "Linda Turner Maningrida" story. |
| A Washing Machine at Home | Patricia Frank, Tennant Creek | yes (`patricia-frank`) | Problem to delivery (Pakkimjalki Kari) |

Caveat: `journeyStories` still carries `theme: 'co-design'` keys (known, pending migration; do not add new ones) and the Dianne pull-quote uses an em dash inside a verbatim registry quote (quote text is untouchable; do not reuse the em dash in prose).

### Deck narrative (deck.ts, updated 15 July, pre-540 canon)
Ten slides each with a full spoken script: `cover`, `model`, `turn-1` (need is real), `turn-2`, `turn-3`, `turn-4`, `hinge-truck-test`, `turn-5`, `ask`, `closing`. This is the longest single piece of pitch prose in the repo and the spine the funder deck follows. Voices are drawn registry-verbatim (e.g. Gary's fire-and-dirt consultation line, anonymous Arlparra lines usable unnamed). Status label: narrative signed via narrative-foundation gate; figures in it predate the 540/177/20/11/3,540 canon and are being swept under Area 8.

### Origin story (/story)
2018 Dr Boe Remenyi RHD spark → 2020 Orange Sky pattern → 2022 question → 2023 A Curious Tractor + Bloomfield "around the fire" prototypes → 2024 beds at scale → 2025 Pakkimjalki Kari. Serves the problem and model moments. Boe Remenyi is in the registry (`boe-remenyi`). scabies to RHD framing here is the why, correctly not an outcome claim.

## 3. Coverage by pitch moment

- **Problem:** Linda Turner, Ivy, Brian Russell, Patricia Frank, deck turn-1 (Arlparra "sleeping on a door"), Alfred Johnson freight line (deck slide 4 prose). Strong.
- **Proof / delivery:** Zelda, Brian, Utopia trip story. Adequate but Tennant Creek heavy.
- **Model / ownership:** Dianne Stokes, Utopia (Oonchiumpa-led), narrative-foundation §1. Ownership stays a pathway in all of them. Adequate.
- **Closing:** deck `closing` slide only; no standalone written closing story.

## 4. Gaps: communities with no written story

- **Townsville:** no story, no photos (0 beds delivered; low priority).
- **Maningrida:** no written story and no photos on file despite 40 beds + washers delivered (per INV-0303 canon). Largest unstoried deployment. The only "Maningrida story" ever drafted was the fabricated Linda Turner piece, excluded; nothing real replaces it.
- **Kununurra:** no publishable story and none possible yet; the Elder's words are paper-only consent, default-deny. Aunty Jean O'Reera (GB0-158) recipient fact exists but no cleared narrative.
- **Katherine:** 1 bed (GB0-159, Nic), no story; likely fine as a register line only.
- Also thin: **Mount Isa** (Gary and Tracy McCartney in registry, quotes only, no long-form piece) and **Kalgoorlie** (Cliff Plummer registry: yes; Walter permanently held).

## 5. Stories to write next

1. **Maningrida delivery story** (40 beds + 8 washers in community): the biggest deployment with no narrative. UPDATE 2026-07-20: a firsthand source now exists — Shayne Bloomfield's EL transcript (section 6 below) covers the whole trip. Write it from his account once quotes clear; do not synthesise beyond it.
2. **Mykel / Oonchiumpa young-builders story** (registry: yes, two primary quotes): the ownership-pathway proof piece the deck references but no standalone written story carries.
3. **Pakkimjalki Kari full story** (Dianne naming + Bloomfield family build, Jan 2026): scattered across content.ts, deck model slide, and narrative-foundation; deserves one canonical long-form telling.
4. **Palm Island story beyond Ivy** (Alfred Johnson freight arithmetic + PICC partnership): problem-moment depth outside the NT.
5. **A written closing story** for the deck's final beat (currently script-only).
6. Housekeeping, not writing: sweep deck.ts scripts to 540/177/20/11/3,540 (Area 8), resolve Ampilatwatja Elders' name-credit confirmation, and confirm whether journeyStories get their own section on `/stories` (open question in the stories-page ledger).

*Claims status: inventory is observed from the named files; deployment figures are register-verified canon (Area 10); nothing here creates a new external claim.*

## 6. Shayne Bloomfield quote candidates (added 2026-07-20, pending Ben clearance)

Source: EL transcript `4b390461-d019-4498-9ece-dc44bf6c4268` ("Shane Bloomfield - Recording",
3,936 words; spelling Ben-confirmed as Shayne). Analysis authorised by Ben 2026-07-20. This is
the **firsthand Maningrida delivery account**: the Darwin drive, the laundromat refurb, ~20 beds
built with young people at the aged-care service, washers installed. It also carries reciprocity
and protocol lines that generalise. All candidates verbatim from the transcript (filler trimmed
where marked ...); Candidates 1-2 CLEARED by Ben 2026-07-20 and promoted to storyteller-registry.ts; 3-7 remain pending.

1. **Reciprocity (deck-grade):** CLEARED + PROMOTED to registry 2026-07-20. "A lot of people say community is community and they need
   what we've got. When you flip it, we need what they've got."
2. **The beds, eight weeks on:** CLEARED + PROMOTED to registry 2026-07-20. "Today my mum still gets text messages from her family
   saying, I can't believe how good this bed's going ... I don't want to get outta bed in the
   morning 'cause it's just so comfortable."
3. **Protocol / how we enter:** "We've liaised with Aboriginal elders, traditional owners of
   that community, before we've liaised with government members."
4. **Maningrida aged care:** "We made 20 odd beds in aged care ... utilizing the young people
   of the aged care service ... They were so willing to learn about how these beds came
   together."
5. **What Elders wanted:** "All they wanted was something that's off the ground ... sit on the
   edge of it and just pop themselves up. Just amazing."
6. **The washers + recycled plastic:** "They're definitely not gonna break, I can tell you
   that ... the recycled plastic that you use is blowing my mind away. Every sheet was a
   different design."
7. **Connection to country:** "I can go away for years and I come back. The first thing I do
   is I put my hands on the ground and I say, I'm back."
8. **Partnership:** already in the registry as his primary quote ("This partnership could go a
   long way. I feel it's got a long, long path ahead.").

Claim-hygiene note: his hot-wash-kills-disease lines are his own observed testimony; if ever
used they stay in his voice and never become a Goods health-outcome claim (scabies→RHD stays
the why only).

Provenance updated: `transcript-provenance.ts` Shayne entry moved
`blocked_analysis_not_authorized` → `blocked_no_review_or_grant`; EL "Shane" spelling aliased
to crm "Shayne" in `backfill-media-links.mjs`.
