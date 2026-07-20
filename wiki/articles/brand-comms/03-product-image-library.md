# 03. Product Image Library

How Goods imagery looks. What we have. What we still need. Where to find it.

Canonical home: [v2/public/images/](../../v2/public/images/) plus Empathy Ledger media library (live fallback).
Resolution path: every image slot tries Empathy Ledger first, then falls back to local. See [v2/src/lib/data/media.ts](../../v2/src/lib/data/media.ts).

## Photo direction

A world-class product company photographs its product the way the product is actually used. No staged set pieces. No stock. No imported lifestyle photography from other brands' visual languages.

### What every Goods photo should be

- **Real moments, On-Country.** Photographed where the product lives. Tennant Creek verandah, Palm Island front yard, Arnhem Land community centre. Never a studio.
- **Golden hour or natural diffuse light.** Goods is sun, dust, sky, country. Not flat overhead lighting.
- **Elders centred where present.** Never crop them out. Never use them as background figures.
- **Product credible at the size it ships.** A 26kg flat-pack, two poles, four legs, canvas. Show the actual thing.
- **Hands and people, not just object shots.** Beds being assembled. Beds being slept on. Beds in family rooms, not white voids.
- **Honest backgrounds.** Show the verandah, the dirt, the corrugated roof, the kids in the doorway. Don't tidy the frame.

### What no Goods photo should be

- Stock photography of any kind.
- Generic "Indigenous Australia" imagery (red dirt, dot painting, didgeridoo) used as decoration.
- Beds floating on white seamless backgrounds (we are not Casper).
- Heavy filter, oversaturated red, or "outback aesthetic" colour grading.
- Hero portraits without the storyteller's name and consent state attached.

### Composition cues

- Wide environmental shot first, detail shots second.
- 3:2 horizontal for hero / banner. Square for grid. 4:5 vertical for mobile-first marketing.
- Negative space top right of hero shots so we have room for headlines and brand mark.
- Brand mark visible in at least one product hero shot per shoot (see [media-pack/goods-branding-golden-hour.jpg](../../v2/public/images/media-pack/goods-branding-golden-hour.jpg)).

## Asset inventory

### Stretch Bed shots (have)

| File | What it is | Best use |
|------|-----------|----------|
| `product/stretch-bed-hero.jpg` | Main hero shot | Homepage, shop hero, decks |
| `product/stretch-bed-assembly.jpg` | Mid-assembly | Process page, how-it-works |
| `product/stretch-bed-in-use.jpg` | Person using bed | Stories, dignity narrative |
| `product/stretch-bed-community.jpg` | Bed in community context | Community pages, social |
| `product/stretch-bed-detail.jpg` | Close-up of construction | Specs, materials, B2B |
| `product/stretch-bed-kids-building.jpg` | Kids assembling | Co-build narrative, education |
| `product/stretch-bed-legs.jpg` | HDPE legs detail | Materials, recycling story |
| `product/stretch-bed-poles.jpg` | Steel poles detail | Materials, manufacturing |
| `product/stretch-bed-assembled.jpg` | Finished bed | Product detail |
| `media-pack/lying-on-stretch-bed.jpg` | Person lying on bed | Comfort, dignity |
| `media-pack/woman-on-red-stretch-bed.jpg` | Red variant in use | Variant marketing |
| `media-pack/thumbs-up-stretch-bed.jpg` | Recipient approval moment | Social proof |
| `media-pack/community-testing-bed-golden-hour.jpg` | Field testing | Process, prototyping |
| `media-pack/community-bed-assembly.jpg` | Community-led assembly | Co-build narrative |

### Pakkimjalki Kari (washing machine) shots (have)

| File | What it is | Best use |
|------|-----------|----------|
| `product/washing-machine-hero.jpg` | Main hero | Shop page, decks |
| `product/washing-machine-installed.jpg` | In situ | Community deployment narrative |
| `product/washing-machine-community.jpg` | In use, community context | Community pages |
| `product/washing-machine-name.jpg` | The naming context | Design-in-community narrative, Dianne credit |
| `media-pack/speed-queen-controls.jpg` | Single-button interface | Specs, simplicity story |
| `media-pack/washing-machine-enclosure-sunset.jpg` | Recycled HDPE housing | Materials, design |

### People (have)

Photos exist for: Dianne Stokes, Norman Frank, Patricia Frank, Cliff Plummer, Linda Turner, Ivy, Alfred Johnson, Brian Russell, Ben Knight (team), Nic Marchesi (in `nic-and-ben-warumungu.jpg`).

### Process and manufacturing (have)

Six numbered stages: source, process, cut, build, weave, deliver. Plus CNC, hydraulic press, container factory shots in `process/`.

### Community landscapes (have)

`community/tennant-creek.jpg` only.

## Gaps to commission

| Gap | Priority | Why |
|-----|----------|-----|
| Palm Island landscape and community context | High | We've delivered 141 beds there. No landscape on file. |
| Alice Springs landscape | High | Design-in-community hub, no landscape. |
| Townsville logistics hub | Medium | Logistics narrative needs visual. |
| Maningrida and Arnhem Land scenes | High | We deliver there, no imagery. |
| Ebony and Jahvan Oui (future manufacturing leads) | High | Co-ownership story needs the people. |
| Production plant in operation, wide and detail shots | Critical | We sell the model. Not enough plant imagery. |
| Pakkimjalki Kari being used (clothes going in, family with it) | High | Currently mostly static product shots. |
| Zelda Hogan portrait | Medium | Strong story, no photo. |

## Naming convention

```
v2/public/images/
  product/{slug}-{moment}.jpg          stretch-bed-hero.jpg
  people/{firstname-lastname}.jpg      dianne-stokes.jpg
  community/{community-slug}.jpg       palm-island.jpg
  process/{step-number}-{stage}.jpg    01-source.jpg
  media-pack/{descriptive-name}.jpg    goods-branding-golden-hour.jpg
  manufacturing/{equipment}-{angle}.jpg
```

Always lowercase, hyphenated. No spaces. No trailing version numbers. If you replace an image, replace it in place.

## Before publishing any photo

- [ ] Storyteller named, consent on file.
- [ ] Photographer credited.
- [ ] If children, parent / guardian consent on file.
- [ ] No identifying info in caption beyond what storyteller approved.
- [ ] Filename matches naming convention.
- [ ] At least 1920px on the long side for marketing use.
- [ ] Compressed appropriately (under 500kb for web hero, under 200kb for thumbs).
- [ ] Empathy Ledger record updated if this replaces a placement.

## Brand mark and lockups

The Goods brandmark appears in [media-pack/goods-branding-golden-hour.jpg](../../v2/public/images/media-pack/goods-branding-golden-hour.jpg). Logo files for partner use are not yet in the repo. Add to `media-pack/logo/` when finalised. Until then, partners requesting logo assets should be replied to from this guide's [04-email-templates.md](04-email-templates.md) media template.

## Empathy Ledger media slots

The site uses slot keys (e.g. `product.stretchBedHero`, `people.dianneStokes`). When uploading new media to Empathy Ledger, use the matching slot key from [media.ts](../../v2/src/lib/data/media.ts) so the live fallback resolves correctly. See `getMediaUrl()` and `resolveMedia()` in that file.
