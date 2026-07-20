# Area 1: Storytellers and the Cleared Quote Bank

> Compiled 2026-07-19 from `v2/src/lib/data/`: `storyteller-registry.ts` (canonical, wins on any conflict), `cleared-voices.ts`, `curated-quotes.ts`, `transcript-provenance.ts` (as of 2026-07-15), `impact-model.ts`, `deck.ts`.

## How to use this

- **Verbatim only.** Every quote below is copied exactly from the storyteller registry. Never paraphrase, trim, or "improve" a line on any surface.
- **Consent is default-deny.** A voice appears externally only if its tier is `external` (the 32-voice allowlist in `cleared-voices.ts`). Unknown names resolve to `hold`. `website` tier never enters funder material; `funder` tier never enters the community storyteller set.
- **Transcripts are the quote authority.** A transcript existing is not the same as release being granted; `releaseState` below is EL's own gate, verbatim. Transcript text is RED/sacred and never enters this repo.
- **Practitioners must be labelled as practitioners**, never as community recipients.
- **[IN DECK]** marks quotes carried by `deck.ts`. The deck resolves quotes through the registry via `voiceNames` (each named voice's primary line) plus two Mykel lines labelled "in his own voice" and two anonymous Arlparra pull-quotes.
- Impact linking uses the **five outcome domains** from `impact-model.ts` (`IMPACT_DIMENSIONS`): 1 Rest & health · 2 Dignity & safety · 3 Self-determination & community-led design · 4 Jobs, On Country work & ownership · 5 Circular & local economy. The "3 shifts" NOT FOUND in `impact-model.ts`; that file instead names **two through-lines** (economics and Indigenous sovereignty) that run across all five domains. If the 3-shifts framing is needed, it lives in the canonical impact framework doc (`wiki/outputs/2026-06-18-goods-impact-framework.md`), not this data file.

## 1. Storyteller table

Tier values are copied verbatim from `storyteller-registry.ts`. "Usable quotes" = registry quotes with status `primary` or `approved` (holds excluded). Transcript status uses `transcript-provenance.ts` labels. "EL page" = a story published on EL per `releaseState: public_story`; portraits are the registry `portrait` path (null = gap).

| Name | Community | Tier | Transcript status | Usable quotes | EL page / portrait |
|---|---|---|---|---|---|
| Dianne Stokes | Tennant Creek | external | EL transcript x5, ~2,631 words; a story is published on EL | 1 (+1 hold) | EL story published; portrait yes |
| Norman Frank | Tennant Creek | external | EL transcript, ~2,262 words; on file, needs cultural + use review | 2 | portrait yes |
| Linda Turner | Tennant Creek | external | EL transcript, ~2,444 words; on file, external release not yet granted | 3 | portrait yes |
| Patricia Frank | Tennant Creek | external | Curated card, no primary source ("Priority gap: record her properly") | 3 | portrait yes |
| Jimmy Frank | Tennant Creek | external | EL transcript, ~4,269 words; on file, needs cultural + use review | 3 | portrait yes |
| Annie Morrison | Tennant Creek | external | EL transcript, ~832 words; on file, external release not yet granted | 2 | portrait yes (never label as Elder) |
| Brian Russell | Tennant Creek | external | EL transcript, ~1,380 words; release not yet granted; medical disclosure inside, external use HELD pending Ben | 2 | portrait yes |
| Melissa Jackson | Tennant Creek | external | EL transcript, ~577 words; on file, external release not yet granted | 2 | portrait yes |
| Risilda Hogan | Tennant Creek | external | EL transcript, ~713 words; on file, external release not yet granted | 1 | portrait yes |
| Cliff Plummer (practitioner) | Tennant Creek | external | EL transcript x2, ~793 words; release not yet granted; medical disclosure inside, external use HELD pending Ben | 3 | portrait yes; has video |
| Mykel | Utopia | external | Transcript, Ben-provided + cleared | 4 | portrait yes |
| Xavier | Alice Springs | external | Narrated by another voice (by design; Fred Campbell, consent via Oonchiumpa) | 0 (by design) | portrait yes |
| Fred Campbell | Alice Springs | external | EL only a 24-word clip, analysis not yet authorised; narrative rests on curated card | 6 | portrait yes; has video |
| Karen Liddle | Utopia (Oonchiumpa) | external | Trip notes, cleared | 4 | portrait yes |
| Katrina Bloomfield | Alice Springs / Utopia | external | Trip notes, cleared | 3 | no portrait (voice-only by design) |
| Kristy Bloomfield | Alice Springs / Utopia | external | Curated card; 7 EL partner lead records, no transcript ("Record her properly") | 2 | portrait yes |
| Shayne Bloomfield | Alice Springs / Utopia | external | EL transcript, ~3,936 words; recording on file, analysis not yet authorised | 2 | no portrait (voice-only by design) |
| Dorrie Jones | Arlparra (Utopia Homelands) | external | Trip notes, Ben-cleared 2026-06-17 | 1 | no standalone portrait file |
| Ivy | Palm Island | external | EL transcript, ~299 words; on file, external release not yet granted; "which Ivy" flag open | 1 | portrait yes |
| Alfred Johnson | Palm Island | external | EL transcript, ~932 words; on file, external release not yet granted | 2 | portrait yes |
| Carmelita & Colette | Palm Island | external | EL transcript, ~615 words; on file, external release not yet granted | 3 | portrait yes (always the joint card) |
| Daniel Patrick Noble | Palm Island | external | EL transcript, ~1,083 words; on file, external release not yet granted | 2 | portrait yes |
| Jason | Palm Island | external | EL transcript, ~817 words; on file, external release not yet granted | 1 | portrait yes |
| Mark | Palm Island | external | EL transcript, ~389 words; on file, external release not yet granted | 2 | no portrait (gap); tier confirm pending Ben |
| Gloria Turner | Kalgoorlie, WA | external | EL transcript, ~1,034 words; on file, external release not yet granted | 2 | portrait yes |
| Chloe (practitioner) | Kalgoorlie, WA | external | EL transcript, ~1,175 words; on file, external release not yet granted | 2 | portrait yes |
| Tracy McCartney (practitioner) | Kalgoorlie, WA | external | EL transcript, ~2,916 words; release not yet granted; place conflict unresolved, out of deck table | 1 (+1 hold) | portrait yes |
| Heather Mundo | Katherine | external | Curated card, no primary source | 2 | portrait yes |
| Gary | Mount Isa | external | EL transcript, ~5,264 words (longest in corpus); on file, external release not yet granted | 2 | portrait yes |
| Wayne Glenn (practitioner, Red Dust) | Darwin | external | EL transcript, ~1,023 words; on file, external release not yet granted | 3 | portrait yes |
| Dr Boe Remenyi (practitioner) | NT-wide | external | Curated card, no primary source traced | 2 | NO portrait (gap) |
| Ray Nelson | Utopia Homelands | external | Funder pack, traceable (bed GB0-156-96) | 1 | NO portrait (gap) |
| Zelda Hogan | Tennant Creek | website | Hardcoded in site content; never into funder surfaces | 1 (website only) | no portrait |
| Frankie Holmes OAM | Ampilatwatja | pending | Trip notes; full name crediting to confirm | 0 | no portrait |
| Donald Thompson OAM | Ampilatwatja | pending | Trip notes; full name crediting to confirm | 0 | no portrait |
| Charley | Utopia | pending | Trip notes (trip voice card, video) | 0 | no portrait |
| Walter | Alice Springs | hold | EL transcript, ~615 words; transcript exists, external use is not cleared | 0 (1 hold) | no portrait |
| Jessica Allardyce (practitioner) | East Arnhem | hold | Hardcoded in site content; bypasses EL consent pipeline; correctly unused | 0 (1 hold) | no portrait |
| Kylie Bloomfield | Alice Springs / Utopia | hold | EL recording ~3,646 words on file; analysis not yet authorised | 0 | no portrait |
| Georgina Byron AM (funder) | Funder | funder | NOT FOUND in transcript-provenance.ts | 2 (+1 hold) | no portrait |
| Nicholas Marchesi | Goods team | internal | EL transcript, ~567 words; analysis not yet authorised | 0 | no portrait |

Also on file but not in the registry: **Ana - Bega** (Bega Health practitioner, EL transcript ~3,054 words, release not granted, open item per `UNREGISTERED_TRANSCRIPTS`).

**Totals: 40 registry records (32 external, 1 website, 3 pending, 3 hold, 1 funder, 1 internal, and Xavier counted within external), 70 usable external-tier quotes.**

## 2. Cleared quote bank, linked to impact domains

Every quote below is registry-verbatim (status `primary` or `approved`, tier `external`). Domain assignment is this document's linking model: the single domain each line best evidences. Deck usage per `deck.ts` `voiceNames` and explicit Mykel labels.

### Domain 1: Rest & health (21 quotes)

| Quote | Storyteller | Notes |
|---|---|---|
| "It means something that really makes me happy. Every time I go away, it's like it's calling me. Come back home." | Dianne Stokes | On Pakkimjalki Kari [IN DECK] |
| "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it's right there at home." | Patricia Frank | THE community washing/health line [IN DECK] |
| "A washing machine would be important for the old people, you know? Now we got our own washing." | Annie Morrison | |
| "I was looking at the beds. They're good. I was trying to ask them if they can make one for me." | Annie Morrison | |
| "Back pain and all that. You're gonna be moving around with problems. That's why good beds matter." | Brian Russell | Also the domain-1 quote in impact-model.ts |
| "They like to have lower beds, especially for our older people." | Melissa Jackson | [IN DECK] |
| "If I had two of those beds, I'd be okay." | Cliff Plummer | Practitioner |
| "I've been in the health area for 38 years. I retired last year but found retirement life so boring, so back to work." | Cliff Plummer | Practitioner |
| "You got to get health messages across." | Cliff Plummer | Practitioner |
| "Sleep on a good mattress. For the back, the legs, the muscles." | Gloria Turner | |
| "I've put up with clients going to hospital with pneumonia from sleeping on the ground because it's too cold. In summer they're scared to sleep because of snakes." | Chloe | Practitioner |
| "Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity." | Chloe | Practitioner |
| "Families are often staying with other families where the bedding isn't available or sufficient. People are just sleeping where they can." | Wayne Glenn | Practitioner |
| "We see entrenched primary health issues in communities: rheumatic heart disease, scabies, trachoma. Issues that don't exist anywhere else in the world." | Wayne Glenn | Practitioner; the why only, never an outcome |
| "Education and awareness is great, but you need to match it with something that actually enables people to change. It's great to say you should wash your sheets every week. But if you don't have a washing machine, that's not going to work." | Dr Boe Remenyi | The cleared washing to RHD logic line; use wherever Jessica Allardyce's held line was |
| "If I can fall through the gaps, how many others are falling through the gaps? That's my biggest mission: speaking up for my countrymen who don't have a voice." | Dr Boe Remenyi | Practitioner |
| "Since receiving their new beds, they are no longer experiencing back pains." | Ray Nelson | Lived-experience account ONLY, never a measured clinical result |
| "We do need rest. It's for our health: maintaining health and being well." | Carmelita & Colette | |
| "These two boys just picked it up straight away. The most important thing is it's actually comfortable." | Heather Mundo | |
| "It's comfy. I'd sleep on it every night. I reckon it'll last a long time." | Mark | |
| "Good for me and comfy, easy to put together." | Dorrie Jones | [IN DECK] |

### Domain 2: Dignity & safety (8 quotes)

| Quote | Storyteller | Notes |
|---|---|---|
| "Hardly any people around the community have got beds. When they got family members over, there's not enough for everyone." | Ivy | Also the domain-2 quote in impact-model.ts [IN DECK] |
| "Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard." | Katrina Bloomfield | [IN DECK] |
| "We put together crates, tied them up with plastic, joined them together to make it look like a bed. Just to have something to sleep on." | Mark | |
| "I was living at the tin shed. Then I started working, got help from Stronger Families, and moved into this house." | Risilda Hogan | |
| "The families right now, like you see in most of those houses that we went to, the beds were on the ground. It's a safety thing. Some of our kids have come up with scabies and stuff that shed from the dogs. But knowing that they can pack that up, put it away into a tidy small space in the back of a car and use it wherever they can go. That's something they can't do with those other sturdy metal ones." | Fred Campbell | |
| "It's hard because of the cost of living. That's very hard locally on Palm Island." | Carmelita & Colette | |
| "The freight is very, very dear." | Carmelita & Colette | |
| "It's a really simple idea to a really complex issue. One that can be taken and modified for individual families and communities." | Wayne Glenn | Practitioner |

Website-only (never funder exports): "A good night's sleep is important... from a big day from work." Zelda Hogan.

### Domain 3: Self-determination & community-led design (19 quotes)

| Quote | Storyteller | Notes |
|---|---|---|
| "We've never been asked what sort of house we'd like to live in." | Linda Turner | Also the domain-3 quote in impact-model.ts; could open the whole deck |
| "We try to lead by example to our kids and grandkids." | Linda Turner | |
| "Our strengths is our culture, our country, you know, and our language." | Jimmy Frank | |
| "We challenge a lot of that and try to make a difference. Make it easier for our people to live in their homes." | Jimmy Frank | |
| "Climate change is coming. Those houses are not right for it." | Jimmy Frank | |
| "Now we've got our own ways, we can collaborate with our own people. Not only here. It'll be everywhere." | Norman Frank | |
| "When it comes from an Aboriginal person, it works. That's what makes the difference." | Jason | |
| "We had 150 men lead the march from our men's group. The women and kids came behind us. We marched through the street." | Gary | |
| "We don't force nothing on them. We just sit down and explain what we do, or we let them look and listen. When they're ready, they'll try." | Gary | |
| "You got to get that shame out of the way and go and ask, sit down and talk to them." | Alfred Johnson | |
| "Back then we didn't have the opportunity to challenge government. Now we're in a position to say: this is a sacred site for us as Aboriginal women and traditional owners." | Kristy Bloomfield | |
| "We want to get bigger. We want to help other people, other language groups, other cultures." | Patricia Frank | |
| "We want to build our relationships up with other language groups and make them happy too: how they want to live." | Patricia Frank | |
| "I'm a Goa man, the only Goa man and Gangalidda man. My grandmother's side, full Gangalidda. My grandfather's side, full Goa man from the Gulf country." | Brian Russell | |
| "Tennant Creek is a beautiful place to live. Everyone knows each other." | Melissa Jackson | |
| "I love this community. I grew up here and I've been here for so many years." | Heather Mundo | |
| "Palm Island always feels like home. I've got a big extended family here." | Daniel Patrick Noble | |
| "Because we are family. They help a lot. Helping me." | Gloria Turner | |
| "I don't call this work. This is where I come to meet my friends. For me it's about building relationships with people." | Tracy McCartney | Practitioner |

### Domain 4: Jobs, On Country work & ownership (20 quotes)

| Quote | Storyteller | Notes |
|---|---|---|
| "Never would have thought it would have come out like that." | Mykel | [IN DECK, in his own voice] |
| "Yeah, I'll be rocking up every day to make them." | Mykel | [IN DECK, in his own voice] |
| "Comfortable as. Smooth, tight, hard, fancy." | Mykel | |
| "It was fun, really fun. Good experience." | Mykel | |
| "He knew what he was doing. He had the pattern of how everything was all coming together. He loved it. We took him back to the family and he just was so proud showing them that he can build it." | Fred Campbell | Always attributed to Fred, narrating Xavier [IN DECK] |
| "He's probably one of our first clients. Other service providers did not share anything of his disabilities. We found out along the way. We had that relationship with him. He wanted to be with us a lot, and we had that great friendship with him. He trusts us. We earned that trust from him. He just became a little brother to us." | Fred Campbell | Xavier, on trust |
| "He couldn't stop thanking me. The smile on his face all the way back home. He got out showing his family the bag, and he's walking around everywhere with those shoes on, running everywhere." | Fred Campbell | Also the domain-4 quote in impact-model.ts |
| "I reckon if anything, he'd be probably one of the ideal candidates to go around and show the community, and how to even teach these other younger guys." | Fred Campbell | |
| "It's easy to get them on bail and stuff like that, but with safe plans and actions, I'll make sure that we don't put a plan together where it's gonna fail the young kid itself. And we see them going back and their bail conditions breaching them and they go back into the system." | Fred Campbell | |
| "To see kids' faces with joy after making a bed, it just really hits you." | Karen Liddle | [IN DECK] |
| "I had a yarn with the girls one day. Said you got to get out and start your own business. That's how we started Oonchiumpa." | Karen Liddle | |
| "We're silent achievers. We don't brag about what's going on and what we've done." | Karen Liddle | |
| "We've been saying from the start: gotta teach these kids there's a better way of living. There's always a story behind a child." | Karen Liddle | |
| "The girls tend to be shy. But once they get into doing things and being in control, they're capable of anything." | Katrina Bloomfield | |
| "It's exciting to see kids when they get involved, knowing what they're going to make, and that eventually it could be yours. They're just so excited." | Katrina Bloomfield | |
| "We want to create a safe space for our young people. There's a lack of housing, which leads to a lack of sleep, which leads to low school attendance." | Kristy Bloomfield | [IN DECK] |
| "This partnership could go a long way. I feel it's got a long, long path ahead." | Shayne Bloomfield | [IN DECK] |
| "We could use this place as a healing camp: a cultural institute where kids learn to respect the land and the people around them." | Shayne Bloomfield | |
| "We're setting this up for our kids and grandkids... independence, being in charge of your own destiny." | Linda Turner | Ownership pathway |
| "I want to see a better future for our kids and better housing. Not only here but for the whole nation. We're all struggling today for housing." | Norman Frank | [IN DECK] |

### Domain 5: Circular & local economy (2 quotes)

| Quote | Storyteller | Notes |
|---|---|---|
| "You have to bring them on the barge. You can't just take them on the boat. You have to pay for freight. It all adds up." | Alfred Johnson | Also the domain-5 quote in impact-model.ts [IN DECK] |
| "A lot of them are low income earners. Just to have that extra cost of bringing things over, it all adds up. Sometimes people would rather go without." | Daniel Patrick Noble | [IN DECK] |

### Anonymous field lines used in the deck (not registry voices)

- "We've been sleeping on a door." (Arlparra household) [IN DECK]
- "Off the ground. That's the main thing." (Arlparra Elder) [IN DECK]

### Funder testimonial (funder tier only, clearly labelled, never in the community set)

- "Our role is to plug the gaps. There's quite a few gaps to plug. We can't do it all, but we can do our bit." Georgina Byron AM
- "To have healthy kids grow up to be healthy parents and uncles and aunties: that is the goal, isn't it?" Georgina Byron AM

## 3. Gaps

### Storytellers with no usable quote
- **Xavier** (by design: narrated by Fred Campbell; no direct quotes exist or may be created)
- **Kylie Bloomfield** (hold; recording on file but analysis not yet authorised)
- **Frankie Holmes OAM, Donald Thompson OAM, Charley** (pending: Ben must confirm tier before any external use; live on the published Utopia field note)
- **Nicholas Marchesi** (internal; filtered out of public grids)

### Held or gated voices (names and hold reasons only; their words are never reproduced in working material)
- **Walter** (Alice Springs, hard hold): tier `hold`; transcript exists but external use is not cleared. His quiet-sleep quote was misattributed to Fred and deduped 2026-06-17; a banned fragment guard enforces the hold.
- **Kununurra Elder** (hard hold): paper-only consent gate; her words go nowhere, never into deck.ts. NOT FOUND in the scoped data files; the hold is carried in project memory and the strategy-deck record, noted here so no one goes looking for a registry entry.
- **Jessica Allardyce** (hold): strongest RHD/washing line in the corpus but NOT consent-cleared; removed from all rendered surfaces 2026-07-12; use Dr Boe Remenyi instead. Elevation decision is Ben's.
- **Held single quotes from otherwise-cleared voices:** Dianne Stokes's totem/24-years line (hold for Dianne's say-so); Tracy McCartney's second dignity-and-health variant (pick one at narrative sign-off); Georgina Byron's "empowering" line (Ben to decide use or retire, checkpoint B-5b). Brian Russell and Cliff Plummer transcripts contain medical disclosures: external use of transcript material HELD pending Ben (their registry quotes above remain cleared).

### Impact domains with weak or no coverage
1. **Circular & local economy (Domain 5) is the weakest: 2 quotes**, both about freight cost. No cleared community line about plastic, recycling, or the loop itself.
2. **Domain 1's health depth leans on practitioners.** 9 of 21 rest-and-health quotes are practitioner voices; the strongest community washing/health carrier, Patricia Frank, has no transcript at all (curated card only; "Priority gap: record her properly").
3. **The "3 shifts" cannot be quote-mapped from code**: they are not in `impact-model.ts` (NOT FOUND), so shift-level linking waits on the canonical framework doc.

### Provenance gaps worth closing
- Patricia Frank, Kristy Bloomfield, Heather Mundo, Dr Boe Remenyi: no primary source traced (curated cards).
- Fred Campbell: only a 24-word EL clip despite carrying 6 quotes; record him properly.
- Portrait gaps for cleared, quoted voices: Dr Boe Remenyi, Ray Nelson, Mark, Dorrie Jones (no standalone file).
- Only one voice has a published EL story: Dianne Stokes. Every other transcript is release-blocked at some EL gate.
- Ana - Bega: EL transcript exists but she is not in the registry (open item).
- Ivy: "which Ivy" identity flag open before print use; Mark: tier confirm pending Ben.
