# Area 3 — Key partners and people who make it possible

> Source: `crm_contacts` (Supabase Goods, 135 rows, seeded 2026-07-19 from 21 code/wiki sources plus Gmail sweep).
> Query date: 2026-07-20. This doc is the investor-facing people map; the storyteller registry
> (`v2/src/lib/data/storyteller-registry.ts`) remains the consent authority and Area 1 covers voices.
> Labels: every relationship below is tagged with its pipeline reality. A conversation is not a deal.

## The shape of the network

135 contacts: 40 storytellers, 25 partners, 16 community leaders (4 Elders), 13 advisory, 11 funders + 7 philanthropy, 8 buyers, 7 procurement, 2 suppliers, 2 staff. 37 have a verified last-contact date from the Gmail sweep; the rest are register/wiki-sourced.

## Staff and core

| Person | Role | Status |
|---|---|---|
| Nicholas Marchesi | Founder, delivery, product | active (2026-07-17) |
| Benjamin Knight | Systems, story, capital | active (2026-07-19) |

## Elders and community leadership (delivered relationships)

| Person | Place | Why they matter |
|---|---|---|
| Dianne Stokes (Elder) | Tennant Creek | Named Pakkimjalki Kari in Warumungu; central voice of the work |
| Norman Frank Jupurrurla (Elder) | Tennant Creek / Wilya Janta | Housing and health leadership; partner and storyteller |
| Donald Thompson OAM (Elder) | Ampilatwatja | Cleared voice (full-name credit pending confirmation) |
| Frankie Holmes OAM (Elder) | Ampilatwatja | Cleared voice (full-name credit pending confirmation) |
| Kristy Bloomfield | Alice Springs / Utopia (Oonchiumpa) | Lead of the ownership pathway conversation; most active community relationship (2026-07-17) |
| Karen Liddle | Utopia (Oonchiumpa) | Oonchiumpa chair; youth build program |
| Jimmy Frank, Mislam Sam, Tracy McCartney, Margaret (Utopia), Aunty Jean O'Reera (Kununurra) | various | Community leaders on the register; Margaret = Margaret Lloyd (Ben confirmed 2026-07-20, crm + EL linked); Aunty Jean's record remains open |

## Partner organisations by function

**Ownership pathway (requested, not settled):** Oonchiumpa Consultancy (Kristy Bloomfield, Karen Liddle, Tanya Turner, Fred Campbell) asked to own a plant; PICC (Rachel Atkinson, Narelle Gleeson) asked to buy a facility. Requests, not deals.

**Housing and health:** Wilya Janta (Norman Frank, Dr Simon Quilty), Anyinginyi Health (Tony Miles), Miwatj Health (Clara Strowel, Jessica Allardyce), Dr Boe Remenyi (RHD, NT-wide).

**Plastic loop and manufacturing:** Envirobank (Marty Taylor, Narelle Anderson) for feedstock; Defy Design (Sam Davies, Todd Sidery) product engineering, active July 2026; Zinus (Daniel Pittman) manufacturing advisory.

**Procurement and buyers (labelled):** Homeland Schools Company, Maningrida (committed buyer); Anyinginyi Health (in discussion); QIC Brisbane (proposal sent); NT Housing (warm); WHSAC Groote Archipelago (Simone Grimmond) and WHSAC WA (cold); Julalikari Council (Delaicee Power) and Urapuntja Aboriginal Corporation (register procurement contacts).

**Community and culture:** Orange Sky (Judith Meiklejohn), DeadlyScience (Corey Tutt), NPY Women's Council (Angela Lynch), Homeland School Company (Nic Sharah, Alex Meng), Red Dust Studios, BHAC laundromat (Maningrida washers).

## Funders and philanthropy (labelled honestly)

| Funder | Contact | Reality |
|---|---|---|
| Snow Foundation | Georgina Byron, Sally Grimsley-Ballard | Delivered funder (~$493K to date); Sally active 2026-06-25 |
| Centrecorp | Randle Walker | Delivered ($123,332 paid, Utopia) |
| FRRR | Steph Pearson, Danielle Griffin | Active (2026-07-16) |
| SEFA | Joel Bolzonello (Joel Bird row) | Proposed first stack lead ($300K target); not signed |
| Social Impact Hub / QBE | Jay Boolkin | Program relationship, active (2026-07-14) |
| Tim Fairfax Family Foundation | Katie Norman | Warm |
| Giant Leap Fund | — | Warm |
| Dusseldorp Forum | Jessica Duffy, Scarlett Steven | Cold/stale |
| Paul Ramsay Foundation | — | Cold |
| Minderoo | Lucy Stronach | Register contact only |
| Oranges & Sardines, Queensland Community Foundation (Tara Castle), John Villiers Trust (Fiona Maxwell) | — | Early/stale |

Signed match-eligible capital today: $0. That stays on every surface until it changes.

## Advisory bench

Dr Simon Quilty (Wilya Janta), Corey Tutt (DeadlyScience), Daniel Pittman (Zinus), Judith Meiklejohn (Orange Sky), Sam Davies (Defy), Nina Fitzgerald, Susan Clear, Shaun Fisher (Fishers Oysters, active 2026-07-10), April Long (SMART Recovery), Adeem (CYP, active 2026-07-17), Sally Grimsley-Ballard (Snow).

## Suppliers

Austcover (Vanessa Jennings, canvas), Beko (Amanda Hart, washer prototype conversations). Speed Queen is the current washer base; no named contact row yet.

## Data-quality queue (feeds the crm_contacts cleanup task)

- Duplicate people: Tony / Tony (Anyinginyi) / Tony Miles = one person, three rows. Tanya Turner x2. Tara Castle x2. (Correction 2026-07-20: "Georgina Byron AM" as storyteller is RIGHT — she has 2 EL transcripts, now in the Voice Impact Model as the funder-witness voice; the funder row and storyteller row should link, not merge.) Marty Taylor and Narelle Anderson each solo plus a combined row. Norman Frank + Simon Quilty combined row duplicates their solo rows. Homeland School(s) Company x3 variants.
- Org-as-contact rows to move to an ORG layer: Envirobank, Julalikari Council, Urapuntja, PICC, Homeland Schools, Centrecorp Foundation, Utopia Homelands, WHSAC x2, Dusseldorp Forum, Giant Leap, Paul Ramsay, Tim Fairfax, Oranges & Sardines, NT Housing, Our Shed, BHAC laundromat, Red Dust Studios, Tennant Creek youth centre.
- 98 contacts have no last-contact date; Gmail sweep only covered addresses on file.

## Open items (Ben)

- Julalikari washer recipients: named contacts for GB0-WM-TC-JUL rows.
- Tennant Creek youth centre: follow-up owner and named contact.
- Ampilatwatja OAM Elders: confirm full names before crediting by name in any external artifact.
