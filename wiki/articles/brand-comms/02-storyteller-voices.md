# 02. Storyteller Voices

Every quote and story Goods uses publicly comes from this library or from a fresh Empathy Ledger pull. Never invent. Never paraphrase a quote into something a person didn't say. Never combine quotes from different people.

Source: [v2/src/lib/data/content.ts](../../v2/src/lib/data/content.ts) and Empathy Ledger project `goods-on-country` (UUID `6bd47c8a-e676-456f-aa25-ddcbb5a31047`, 12 syndicated stories).

## Consent and OCAP rules

Before using any voice externally:

1. Story must be `syndication_enabled = true` in Empathy Ledger.
2. Storyteller has not withdrawn consent (`consent_withdrawn_at IS NULL`).
3. Story is not archived (`is_archived = false`).
4. For sensitive contexts (health, deceased family, cultural content): re-confirm with the storyteller or community contact before publishing.
5. Always credit by name (or first name if the storyteller prefers) and community.
6. Storytellers can update or remove their stories at any time. Honour those changes within 24 hours of notification.

The Empathy Ledger client at [v2/src/lib/empathy-ledger/client.ts](../../v2/src/lib/empathy-ledger/client.ts) handles filtering automatically. If pulling raw, filter manually.

## Storyteller index

### Tennant Creek voices

**Dianne Stokes** — Elder, Design partner, Tennant Creek
- Photo: [v2/public/images/people/dianne-stokes.jpg](../../v2/public/images/people/dianne-stokes.jpg)
- Themes: co-design, naming, Warumungu language
- Pull quotes:
  - "Working both ways, cultural side in white society and Indigenous society."
- Story: Named the washing machine Pakkimjalki Kari in Warumungu. Received the first Stretch Bed and within two weeks requested 20 more. Sits around the fire with family refining the design.
- Use for: design-in-community narratives, naming heritage, Elder authority.

**Norman Frank Jupurrurla** — Warumungu Elder, Wilya Janta founder, Tennant Creek
- Photo: [v2/public/images/people/norman-frank.jpg](../../v2/public/images/people/norman-frank.jpg)
- Themes: housing advocacy, future, culture
- Pull quotes:
  - "I want to see a better future for our kids and better housing for our people."
  - "Without your culture, I feel lost."
- Story: Founded Wilya Janta to advocate for housing. After his daughter tried a Goods bed, he called requesting three more in maroon.
- Use for: housing context, intergenerational framing.

**Linda Turner** — Tennant Creek
- Photo: [v2/public/images/people/linda-turner.jpg](../../v2/public/images/people/linda-turner.jpg)
- Themes: co-design, self-determination
- Pull quotes:
  - "We've never been asked at what sort of house we'd like to live in."
  - "We're setting this up for our kids and grandkids. Independence. Being in charge of your own destiny."
- Story: Grew up in the bush. Watched the intervention reshape perceptions. Setting up a business sharing culture and bush medicine.
- Use for: the foundational "asking versus telling" frame. The first quote is core to the Goods origin.

**Patricia Frank** — Aboriginal Corporation worker, White Cockatoo clan, Oo Tribe, Tennant Creek
- Photo: [v2/public/images/people/patricia-frank.jpg](../../v2/public/images/people/patricia-frank.jpg)
- Themes: washing machine, family, NT-wide network
- Pull quotes:
  - "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it's right there at home."
  - "We wanna help family throughout the NT and their First Nation People."
- Story: Helped connect Goods with language groups across the NT, building the relationships that made Pakkimjalki Kari possible.
- Use for: washing machine narrative, NT network, family framing.

**Cliff Plummer** — Retired Aboriginal health practitioner, Tennant Creek
- Photo: [v2/public/images/people/cliff-plummer.jpg](../../v2/public/images/people/cliff-plummer.jpg)
- Video: [Beds and Dignity (Descript)](https://share.descript.com/view/2gxa5x40r9N)
- Themes: health, dignity, sleep
- Pull quotes:
  - "You got to get health messages across."
- Story: Connects beds to community health. Cold ground leads to pneumonia, poor rest, slower healing.
- Use for: health-pathway storytelling, the link between bedding and disease prevention.

**Zelda Hogan** — Tennant Creek
- Photo: not yet captured
- Themes: housing journey, sleep, motherhood
- Pull quotes:
  - "A good night's sleep is important. From a big day from work."
  - "It's better here. Yeah. At house."
- Story: Moved her family from a tin shed to a house. Bed was the first sign things were changing. Children go to school. She works.
- Use for: dignity narrative, before-and-after framing.

**Brian Russell** — Tennant Creek (originally Doomadgee)
- Photo: [v2/public/images/people/brian-russell.jpg](../../v2/public/images/people/brian-russell.jpg)
- Themes: health, recovery, belonging
- Pull quotes:
  - "I had a heart attack last year. I got no bone in my feet."
  - "It's gonna be home for me now."
- Story: Heart attack survivor. Sleeps poorly without a proper bed. Chose Tennant Creek for the community support.
- Use for: medical-necessity framing. Strong for health funder briefs.

**Jimmy Frank** — Cultural Liaison, Tennant Creek
- Themes: culture, country, language
- Pull quotes:
  - "Our strengths is our culture, our country, you know, and our language."
- Use for: cultural strength framing, never extractive.

**Annie Morrison** — Elder, Tennant Creek
- Themes: community, helping
- Pull quotes:
  - "I like to do more, you know, but helping all the people."

**Melissa Jackson** — Tennant Creek
- Themes: product feedback
- Pull quotes:
  - "I think it's a great bed. Nice bed. And it's more lower, um, more comfortable."
- Use for: product feedback, design iteration story.

### Palm Island voices

**Ivy** — Palm Island
- Photo: [v2/public/images/people/ivy.jpg](../../v2/public/images/people/ivy.jpg)
- Themes: community need, dignity, product feedback
- Pull quotes:
  - "Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor."
  - "It's more better than laying around on the floors. It was easy to make. Yeah, it's nice."
- Use for: the foundational "no beds" framing. Strong opener.

**Alfred Johnson** — Palm Island
- Photo: [v2/public/images/people/alfred-johnson.jpg](../../v2/public/images/people/alfred-johnson.jpg)
- Themes: dignity, safety, freight tax
- Pull quotes:
  - "Having a bed is something you need. You feel more safe when you sleep in a bed. It's different than sleeping on the couch or the ground."
  - "You can't just go down to the store and buy beds. It's a big muck-around. You have to bring them on the barge, pay for freight, and still, not everyone gets one."
- Use for: dignity narrative, freight cost narrative.

**Carmelita** — Palm Island
- Themes: freight tax
- Pull quotes:
  - "The freight is very, very dear."

### Utopia Homelands voices

**Mykel** — Young maker, Utopia Homelands (Central Australia)
- **CONSENT: Pending review. Internal use only.** Young person. Do not publish his name, words, photo or video on any external surface (website, deck, funder brief, press, social) until consent is captured with his family and Oonchiumpa facilitating. See [CONSENT_BACKLOG.md](CONSENT_BACKLOG.md) Group 3 and the youth note.
- Photo: not yet captured (Ben to add)
- Video: not yet captured (Ben to add)
- Themes: youth pathway, making, On-Country employment, circular economy (waste to bed), comfort, product feedback
- Pull quotes (verbatim, from the build-day recording, May 2026 Utopia trip):
  - "Never would've thought it would've come out like that."
  - "It was fun, really fun. Good experience."
  - "Comfortable as. Smooth, tight, hard, fancy. It's not trampoline."
  - "Yeah, I'll be rocking up every day to make them."
- Elder present (kinship terms, full name to confirm before any use): "Well done, grandson. Well done, brother." / "That could be a good employment for yourself too, grandson. Later on."
- Story: On the Oonchiumpa-supported trip to Utopia Homelands, beds were built with young people (purchase supported by the Centrecorp Foundation), and every young person received a bed. Mykel built the bed he would sleep on, then kept going. Seven in total. This is the first young-person voice and the first Utopia Homelands voice on file.
- Use for: youth pathway, On-Country employment, the circular-economy story (recycled plastic lids becoming a bed), comfort and product feedback. INTERNAL ONLY until consent captured.

### Health workers and support voices

**Chloe** — Support Worker, Kalgoorlie
- Themes: health, dignity, mobility
- Pull quotes:
  - "Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity."

**Tracy McCartney** - Support Worker, Kalgoorlie
- Themes: dignity, health
- Pull quotes:
  - "The new mattress design is not just about comfort. It's about dignity and health."

**Jessica Allardyce** — Miwatj Health, East Arnhem
- Themes: health pathway, RHD prevention
- Pull quotes:
  - "Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be able to clean infected clothing, bedding and towels."
- Use for: clinical credibility, the scabies-to-RHD pathway. Highest impact for health funders.

**Gloria** — Kalgoorlie
- Themes: chronic illness, mattress impact
- Story: great-grandmother on dialysis.
- Pull quotes:
  - "The impact of a mattress on overall health."

## By theme (quick lookup)

| Theme | Best voices |
|-------|-------------|
| Design in community / "never been asked" | Linda Turner, Dianne Stokes, Norm Frank |
| Dignity and safety | Ivy, Alfred Johnson, Tracy McCartney, Chloe |
| Health and recovery | Brian Russell, Jessica Allardyce, Cliff Plummer, Gloria |
| Freight tax | Alfred Johnson, Carmelita |
| Washing machine | Patricia Frank, Jessica Allardyce, Dianne Stokes |
| Future and intergenerational | Norman Frank, Linda Turner |
| Product feedback | Ivy, Melissa Jackson, Norman Frank |
| Youth pathway / On-Country employment | Mykel; Xavier (told in Fred Campbell's voice) — cleared for external use (Oonchiumpa-facilitated, 2026-06-26) |

## Journey stories (longer narrative arcs)

For pieces that need a 200-300 word narrative, use these pre-written arcs from [content.ts](../../v2/src/lib/data/content.ts) `journeyStories`:

- `zelda-tin-shed`: From a Tin Shed to a Home
- `brian-health`: Rest After a Heart Attack
- `ivy-floor-to-bed`: From Floor to Bed
- `dianne-codesigner`: Co-Designer, Not Recipient
- `linda-never-asked`: Never Been Asked
- `patricia-washing-machine`: A Washing Machine at Home

## Pulling fresh from Empathy Ledger

```bash
# All Goods stories (filtered for syndication + consent on the EL side)
curl "https://empathy-ledger-v2.vercel.app/api/stories?projectCode=goods-on-country&limit=20"
```

The Goods site does NOT proxy this endpoint. The EL API is hosted on `empathy-ledger-v2.vercel.app` (note the `-v2` suffix). Server-side code in `v2/src/lib/empathy-ledger/client.ts` calls it via the `EMPATHY_LEDGER_API_URL` env var.

EL Supabase direct (when API down):
- `EMPATHY_LEDGER_SUPABASE_URL` and `EMPATHY_LEDGER_SUPABASE_KEY` in `.env.local`
- Filter: `project_id = '6bd47c8a-e676-456f-aa25-ddcbb5a31047' AND syndication_enabled = true AND consent_withdrawn_at IS NULL AND is_archived = false`

## Gaps to fill

Voices we want but don't yet have on file:
- Maningrida community voices (we deliver there, no quoted feedback yet)
- Utopia Homelands voices — *captured and cleared: Mykel and Xavier from the May 2026 trip. More to come as the Oonchiumpa relationship continues.*
- A young person's voice from any community — *captured and cleared: Mykel (Oonchiumpa-facilitated, 2026-06-26).*
- A maker / production worker voice (Ebony or Jahvan Oui from Palm Island) — *Mykel and Xavier also speak to this from the maker side, cleared.*
- A second video from Dianne Stokes about Pakkimjalki Kari (placeholder in `videoTestimonials`)
- Utopia Elders' voices, including the two Order of Australia recipients at Ampilatwatja and their short bed video (May 2026 trip, cleared for use; individual full names still to confirm before crediting them by name)
