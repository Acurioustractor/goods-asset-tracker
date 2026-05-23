# Utopia: the story we are building

> Working story spine for the May 2026 Oonchiumpa-supported trip to Utopia Homelands. Audience: supporters of the Goods project, and community. Built so the writing and the video line up for a scroll-with-video feature on the Goods website.
>
> Status: draft for collaboration. Most voices here are **consent pending, internal only**. Nothing goes to a public surface until consent lands per `brand-comms/CONSENT_PROCESS.md`. Names and places marked [TBC] are unconfirmed: do not publish them until checked with Oonchiumpa.

## What this trip was

Oonchiumpa supported the trip and led the cultural and community connection. Beds were built with young people, with the purchase supported by the Centrecorp Foundation, and every young person received a bed. The work was led by community: where we went, what we did, and what the trip was for were decided by the people who live there, not by us.

This is the beginning of a longer relationship with Oonchiumpa and the Utopia Homelands, not a one-off delivery. The spine below is meant to grow trip by trip.

## Footage and assets we already have

Tracking what exists so scenes can be cut against real material. Confirm consent state before any external use.

| Asset | Scene | Consent | Notes |
|-------|-------|---------|-------|
| Mykel build-day recording (audio/video) | 2 | Pending, youth | The seven-beds story. Verbatim quotes captured. |
| Video of the beds being made | 2 / 6 | Pending | The making itself. Strong for the production-on-Country thread. |
| Drone shot of the delivery community | 3 | Pending | Establishing scale of the larger delivery. Confirm which community. |
| Order of Australia Elders' bed video | 4 | Pending | Two senior men, Ampilatwatja, in their own words about the bed. |
| Before / after: door-on-the-ground to Stretch Bed | 5 | Pending | Highest-impact image if captured and cleared. |

More video transcripts to come from Ben. See "Transcripts to add" at the foot of this doc for where each one slots.

## The emotional register (the Nick Cave note)

Cave and the Goods voice guide want the same thing from different doors: the holy sits inside ordinary, concrete objects, and you reach it by naming the thing plainly, then letting it open. So the resonance here comes from true facts placed next to each other, never from adjectives.

- Plain words, then a turn. State the fact flatly, then let one short line carry the feeling.
- Repetition as quiet incantation. "He called him grandson. He called him brother."
- The made-from-waste image is the spine of the whole story. Lids become a bed. The ground becomes a place to rest. A morning becomes a trade.
- Trust silence. Don't explain the meaning of a moment. Put the moment down and step back.
- Stay inside the guide: no em dashes, sentence case, no "donate / empower / unlock", real numbers, named people with consent, quotes verbatim and never recombined.

## How the scroll-with-video works (content architecture)

Each scene is one full-height panel. Background is a muted, looping or scrubbing video. Text blocks fade in over it as the reader scrolls. A pulled quote lands on its own, large, with the speaker's name and community underneath once consent allows it.

| Layer | Role | Notes |
|-------|------|-------|
| Background video | Carries the place and the feeling | Desktop 1080p, mobile 720p, plus a poster frame, same pattern as the existing Hero video system in `v2/public/video/`. Muted, slow, no hard cuts. |
| Scroll-pinned text | The narration in Goods voice | Short. One idea per block. Fades in, holds, fades as the next scene arrives. |
| Pulled quote | The community voice | Verbatim. Big type. Name + community appear only when consent is Verified. Until then, the panel can run the line with no attribution, internal preview only. |
| Caption / credit | Photo and consent state | Every image credited, consent state explicit, per the photography brief. |

Build note for later (not now): this is a candidate for a `StoryScroll` section component in `v2/src/components/`, reusing the `Hero` `videoSrc` pattern and the Empathy Ledger voice pull so that when a storyteller moves to Verified in EL, their name and portrait light up automatically. We can spec and build that as a separate task.

---

## Scene 1. Arriving, and handing it over

**Beat:** The beds arrive at Utopia. Community workers take the lead. From the first minute, this is their call, not ours.

**Narration (draft):**
> We brought the beds to Utopia. From there it was not ours to run. The community workers said where they went and who they were for. Our job on a trip like this is small and specific: turn up, build, listen, and do what we are asked.

**Voices:** community worker(s) [name TBC, consent pending]. Capture one short line on what the beds are for, in their words.

**Visual:** wide shot of arrival, beds still flat-packed. Hands lifting. Video: slow, the truck or the unload, dust, light.

---

## Scene 2. Mykel, and the seven beds

**Beat:** A young person builds the bed he will sleep on, then keeps going. Seven in total. The centrepiece.

**Narration (draft, higher resonance):**
> He kept turning it over, like he couldn't quite trust it. "Never would've thought it would've come out like that."
>
> It came out of lids. Bottle caps and scraps of plastic headed for the tip, shredded and pressed until they were strong enough to stand on. Two steel poles slide through the canvas. The legs click into place. That is the whole bed. In Utopia, on Country, a young fella threaded the poles, clicked the legs, and built the bed he would sleep on that night. Then he built another. Then another. Seven in total.
>
> We asked him the one question that matters when you are the one who has to lie down on it. Is it comfortable? "Comfortable as. Smooth, tight, hard, fancy. It's not trampoline."
>
> An Elder was watching him work. He called him grandson. He called him brother. "Well done, grandson. Well done, brother." And then, after a pause: "That could be a good employment for yourself too, grandson. Later on."
>
> So we asked Mykel the question that is really a door. If we built a place here to make these all the time, would you come? "Yeah, I'll be rocking up every day to make them."
>
> Waste into rest. A pile of lids into a bed. A morning into a trade. A young man into someone an Elder is proud to name.
>
> This is the first thing he built. It is not the last thing we will build together.

**Voices:** Mykel (consent pending, youth protocol). Elder present (kinship terms, full name and credit TBC).

**Visual:** Mykel's hands threading the pole, clicking a leg. The finished bed. Him sitting on it. The seven lined up if that shot exists. Video: the build, real time, no music over his voice.

**Shorter social cut (held for consent):**
> In Utopia, on Country, Mykel built the bed he'd sleep on out of recycled bottle lids. Then he built six more. We asked if it was comfortable. "Comfortable as. Smooth, tight, hard, fancy. It's not trampoline." An Elder watching told him: "That could be a good employment for yourself, grandson. Later on." Mykel's answer: "I'll be rocking up every day to make them."

---

## Scene 3. Led by community, to the bigger delivery

**Beat:** Community decides the trip continues to a close community nearby, where a larger run of beds is delivered. We did not plan that leg. They did.

**Narration (draft):**
> Then they told us where to go next. A community close by wanted beds too, more of them. We did not plan that leg. They did. We drove where we were pointed, and we unloaded.

**Voices:** [community lead / Oonchiumpa, name TBC]. One line on why the beds, and how many homes they reach, in their words.

**Visual:** the drone shot of the community and the beds going out, the road and the country between places. Video: long, quiet, the land doing the talking. Honour the rule: name the community, never "the bush" or "the outback".

**Honesty guardrail:** Ben's words are "many beds". Keep it as "a larger delivery" or use his number only once it is reconciled against the asset register. Do not publish a hard count before then.

---

## Scene 4. The old fellas at Ampilatwatja, and the bed in their own words

**Beat:** At Ampilatwatja we sit with two senior men, both recent recipients of the Order of Australia. We give four beds. They speak about the bed on camera, short and direct.

**Narration (draft, restrained, let them carry it):**
> We went to Ampilatwatja to sit with the old fellas. Two of them carry the Order of Australia, given to them this year. We brought four beds. They had something to say about them, so we let the camera run, and then we got out of the way.

**Voices:** two Elders, both OAM [names TBC, consent and credit to confirm directly with them and Oonchiumpa]. Their short bed video is the centre of this scene. Use their words, do not narrate over them.

**Visual:** the bed video, full bleed. Portraits if consented. Video: the men, on or beside the beds, talking. The four beds in their homes.

---

## Scene 5. From the door to the bed

**Beat:** The before and after. People who slept on doors laid on the ground, now sleeping on a Goods Stretch Bed. The image that holds the whole point.

**Narration (draft):**
> Before, some people slept on a door laid flat on the ground. A door, off its hinges, for a bed. Now the door is a door again, and the bed is a bed. Off the ground. Washable. Built to last ten years.

**Voices:** [resident, name TBC] on the difference, in their words. This is the highest-impact line in the whole piece if we can capture and clear it.

**Visual:** the before image (a door used as a bed) and the after (the same person, or the same house, with a Stretch Bed). Side by side, or a scroll-driven cross-fade from one to the other. Some candid, some posed, whatever people are comfortable with.

**Health framing available if wanted:** off the ground matters. Cliff Plummer (Verified, Tennant Creek): "You got to get health messages across." Cold ground leads to pneumonia, poor rest, slower healing. Use only if it serves the community story, not as a funder pitch dropped into a community piece.

---

## Scene 6. What comes next

**Beat:** This trip is a start. Name the open future honestly, without overclaiming.

**Narration (draft):**
> Utopia is one of the strongest candidates for the next place where these beds get made, not just delivered. Mykel said he'd turn up every day. An Elder called it employment. The next question is whether the making moves here, to the people who already want it.

**Honesty guardrails (do not overclaim):**
- The production facility location is still open. Say "candidate" or "pathway", not "the plant is coming".
- Do not state Utopia bed counts as delivered until reconciled against the asset register. The 107-bed Centrecorp pathway is an approved demand signal, not a delivered number.
- "Our job is to become unnecessary." The end state is community ownership of the making.

---

## Capture and consent checklist for this story

Before any scene above goes to a public surface:

- [ ] Mykel: family / guardian consent plus his own, Oonchiumpa facilitating, Fred Campbell as contact. EL record + story created. Youth protocol in `CONSENT_BACKLOG.md`.
- [ ] Elder present at the build: full name, preferred credit, consent.
- [ ] Ampilatwatja: the two Order of Australia men, names, preferred credit, consent for the bed video and portraits.
- [ ] Community workers and the resident in the before/after: names, consent, preferred credit.
- [ ] Place names confirmed (Utopia Homelands; the close delivery community [name TBC]; Ampilatwatja confirmed).
- [ ] Photos and video credited, consent state explicit, per `brand-comms/PHOTOGRAPHY_BRIEF.md`.
- [ ] Voice-guide pass: no em dashes, sentence case, no banned words, specific numbers sourced, quotes verbatim.

## Transcripts to add

Drop new video transcripts here as you get them, and I will work them into the scenes in Goods voice, verbatim. Slots open:

- **Scene 1, community worker** at the bed drop: why the beds, who they are for.
- **Scene 3, community lead** at the bigger delivery: how many homes, what it means.
- **Scene 4, the two Ampilatwatja Elders**: their words about the bed (from the bed video).
- **Scene 5, a resident**: the door-to-bed difference, in their words.
- **Scene 2 / 6, the making**: anyone speaking over the beds-being-made footage.

Paste a transcript with a rough note on who is speaking and where it was filmed. I will keep quotes exact and never combine voices.

## Related

- `brand-comms/02-storyteller-voices.md` (Mykel added, Utopia Homelands voices)
- `brand-comms/CONSENT_BACKLOG.md` (Mykel, Group 3, youth note)
- `brand-comms/CONSENT_PROCESS.md` (the six-step flow)
- `communities/alice-springs-oonchiumpa.md` (the Oonchiumpa relationship, Utopia rows, what is still open)
- `v2/src/lib/data/products.ts` (Stretch Bed material truth: recycled HDPE legs, galvanised steel poles, canvas)
