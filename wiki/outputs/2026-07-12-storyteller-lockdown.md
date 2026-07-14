# Storyteller lockdown — every voice, quote, and title (2026-07-12)

*The registry is now code: `v2/src/lib/data/storyteller-registry.ts` is the single canonical
record. If any file disagrees with it, the registry wins. Enforced by
`npm run check:storytellers` (v2/scripts/check-storyteller-registry.mjs), which fails the
run on: misspellings anywhere in v2/src · banned quote fragments anywhere · hold/funder
names on rendered surfaces · registry↔`cleared-voices.ts` desync. Current status: **41
voices, 32 external, all checks green.** This doc is the human-readable view for your
sign-off; the .ts file is what the code trusts.*

## External (cleared for web + funder) — 32

| Voice | Title | Community | Primary quote(s) | Portrait |
|---|---|---|---|---|
| Dianne Stokes | Warumungu and Warlmanpa Elder; designed and named both products | Tennant Creek | "It means something that really makes me happy. Every time I go away, it's like it's calling me. Come back home." | ✓ |
| Norman Frank | Warumungu Elder, Wilya Janta founder | Tennant Creek | "I want to see a better future for our kids and better housing. Not only here but for the whole nation…" | ✓ |
| Linda Turner | Community member | Tennant Creek | "We've never been asked what sort of house we'd like to live in." | ✓ |
| Patricia Frank | Aboriginal Corporation Worker, Oo Tribe, White Cockatoo clan | Tennant Creek | "They truly wanna a washing machine to wash their blanket… it's right there at home." | ✓ |
| Jimmy Frank | Traditional Owner, Cultural Liaison | Tennant Creek | "Our strengths is our culture, our country, you know, and our language." | ✓ |
| Annie Morrison | Community member (never "Elder") | Tennant Creek | "I was looking at the beds. They're good. I was trying to ask them if they can make one for me." | ✓ |
| Brian Russell | Community member, Goa and Gangalidda man | Tennant Creek | "Back pain and all that… That's why good beds matter." | ✓ |
| Melissa Jackson | Community member | Tennant Creek | "They like to have lower beds, especially for our older people." | ✓ |
| Risilda Hogan | Community member | Tennant Creek | "I was living at the tin shed. Then I started working… and moved into this house." | ✓ |
| Cliff Plummer | Health Practitioner | Tennant Creek | "If I had two of those beds, I'd be okay." | ✓ |
| Mykel | Young maker (youth-care framing) | Utopia | "Never would have thought it would have come out like that." · "Yeah, I'll be rocking up every day to make them." | ✓ |
| Xavier | Young maker — **Fred narrates, never direct** | Alice Springs | (none of his own) | ✓ |
| Fred Campbell | Youth Case Worker, Oonchiumpa | Alice Springs | "He knew what he was doing. He had the pattern of how everything was all coming together…" (narrating Xavier) | ✓ |
| Karen Liddle | Oonchiumpa co-founder | Utopia | "To see kids' faces with joy after making a bed, it just really hits you." · "…That's how we started Oonchiumpa." | voice-only |
| Katrina Bloomfield | Oonchiumpa family | Alice/Utopia | "Most of our people in community are just on a blanket on the ground… mainly for the old elders." | voice-only |
| Kristy Bloomfield | Oonchiumpa co-founder, Traditional Owner | Alice/Utopia | "We want to create a safe space for our young people…" | ✓ |
| Shayne Bloomfield | Oonchiumpa family | Alice/Utopia | "This partnership could go a long way. I feel it's got a long, long path ahead." | voice-only |
| Dorrie Jones | Community member | Arlparra | "Good for me and comfy, easy to put together." | hero-photo in trip stories |
| Ivy | Community member | Palm Island | "Hardly any people around the community have got beds…" | ✓ |
| Alfred Johnson | Community member | Palm Island | "You have to bring them on the barge… You have to pay for freight. It all adds up." | ✓ |
| Carmelita & Colette | Community members (always the joint card) | Palm Island | "We do need rest. It's for our health…" | ✓ |
| Daniel Patrick Noble | Community member | Palm Island | "…Sometimes people would rather go without." | ✓ |
| Jason | Community member | Palm Island | "When it comes from an Aboriginal person, it works." | ✓ |
| Mark | Community member (tier query — see open items) | Palm Island | "We put together crates, tied them up with plastic… Just to have something to sleep on." | none |
| Gloria Turner | Community member | Kalgoorlie | "Sleep on a good mattress. For the back, the legs, the muscles." | ✓ |
| Chloe | Support Worker (practitioner) | Kalgoorlie | "I've put up with clients going to hospital with pneumonia from sleeping on the ground…" | ✓ |
| Tracy McCartney | Support Worker (practitioner) | Kalgoorlie | "I don't call this work. This is where I come to meet my friends…" | ✓ |
| Heather Mundo | Community member | Katherine | "These two boys just picked it up straight away…" | ✓ |
| Gary | Men's group leader | Mount Isa | "We had 150 men lead the march from our men's group…" | ✓ |
| Wayne Glenn | Practitioner, Red Dust | Darwin | "It's a really simple idea to a really complex issue." | ✓ |
| Dr Boe Remenyi | Paediatric Cardiologist (practitioner) | NT-wide | "…It's great to say you should wash your sheets every week. But if you don't have a washing machine, that's not going to work." | **GAP** |
| Ray Nelson | Community member | Utopia Homelands | "Since receiving their new beds, they are no longer experiencing back pains." (lived experience only, never clinical) | **GAP** |

## Website-only — 1

| Zelda Hogan | Community member | Tennant Creek | "A good night's sleep is important…" — homepage journeyStories fallback only; verified no funder path imports it. |
|---|---|---|---|

## Pending your confirmation — 3 (checkpoint B-1)

Frankie Holmes OAM · Donald Thompson OAM (Senior Alyawarr Elders, Ampilatwatja) · Charley
(Utopia trip video). Foundation §3 says external; `cleared-voices.ts` doesn't have them; they
are live on the published Utopia field note today. Say the word and they go on the allowlist
(tier → external in the registry), or the field note gets gated.

## Holds — do not use externally

| Voice | Why | Guard |
|---|---|---|
| Walter | Not cleared. Quiet-sleep quote is his, not Fred's. | Quote text banned in v2/src; entry emptied from curated-quotes. |
| Jessica Allardyce | Strongest RHD/washing line, consent not cleared (your §6.5). | Quote fragment banned; removed from content.ts quotes + impactStories, all rendered surfaces → Dr Boe Remenyi. |
| Kylie Bloomfield | No usable transcript. | — |
| Georgina Byron AM | Funder testimonial only, never in the community set. "Empowering" quote on hold (B-5b). | Name blocked from app/components. |

## Also locked by the guard

"Diane Stokes", "Norm Frank", "Waramungu" can no longer exist anywhere in v2/src (caught
and fixed in snow.ts, content.ts demand list, community-voices page, photo-review admin).
Dianne's totem/24-years line and Jimmy's "weave a bed" line are banned fragments. Xavier
has no quotes field to misuse. Registry external tier and `cleared-voices.ts` must stay in
sync or the check fails.

## Open items for you (small)

1. **B-1 tiers:** Frankie / Donald / Charley — external or gate the field note?
2. **Which Ivy** — allowlist carries both "Ivy" and "Ivy Johnson"; data uses bare "Ivy".
3. **Mark's tier** — storyteller index says website-only, allowlist says external. Registry
   follows the allowlist until you say otherwise.
4. **Tracy McCartney** — two quote variants exist; registry blesses the curated one, holds
   the mattress/dignity one. Pick at narrative sign-off.
5. **Gloria Turner grouping** — Kalgoorlie is canonical; community-narrative groups her with
   Palm/Tennant voices (cosmetic, fix with the B-d theme migration).
6. **Portrait gaps** — Ray Nelson, Dr Boe Remenyi (cleared + quoted, no file); fold into the
   photo pass.
