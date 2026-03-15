# "Goods That Heal" — Long-Form Scrolling Landing Page

> The most amazing page anyone has ever seen. Data, partners, stories, video, photos, galleries — a scrolling storytelling experience that makes people stop and feel something.

**Route:** `/story` or `/our-story` (TBD)
**Purpose:** Full narrative of Goods on Country — origin to impact to future — told through community voices, data, video, photography, and interactive elements.

---

## Design Philosophy

This isn't a landing page. It's a **scrolling documentary**.

- Full-bleed video and photography — no borders, no cards, edge to edge
- Community voices dominate — their words are the structure, not our narration
- Data appears when you need it, not in a dashboard grid
- Parallax scroll effects create depth — images move at different speeds
- Video segments autoplay as you scroll into them, muted with captions
- Photography galleries open inline — no modal, no leaving the flow
- Dark sections and light sections alternate to create rhythm
- Mobile-first — every interaction works with a thumb

### Inspirations
- Apple product pages (scroll-triggered animations, full-bleed media)
- NYT interactive features (data + narrative + photography woven together)
- The Pudding (scroll-driven data visualisation)
- Patagonia long-form stories (photography + mission + product)

---

## Page Architecture — 12 Sections

### 1. HERO — "A good bed can prevent heart disease"
**Type:** Full-viewport video background
**Video:** `hero-desktop.mp4` / `hero-mobile.mp4` (autoplay, muted, looping)
**Overlay:** Dark gradient from bottom, white text
**Content:**
```
Goods that heal.

A good bed can prevent heart disease.

↓ Scroll to understand why
```
**Interaction:** Subtle parallax — text scrolls slightly faster than video. Down arrow pulses.

---

### 2. THE CASCADE — Why children die from preventable disease
**Type:** Scroll-triggered reveal, dark background
**Animation:** Each step reveals as you scroll, with a connecting line between them

```
No washing machine
    ↓
Dirty bedding
    ↓
Scabies (1 in 3 children)
    ↓
Skin infections → Strep A
    ↓
Rheumatic fever
    ↓
Rheumatic Heart Disease
    ↓
Death certificates for children
```

**Data callouts** (appear as you scroll):
- 59% of remote homes lack a washing machine
- $3M/year of washing machines go to dump in Alice Springs alone
- 55% of very remote First Nations homes are overcrowded

**Image:** Fades in at the end — `community/tennant-creek.jpg`
**Quote overlay:** *"Hardly anyone around the community has beds."* — Ivy, Palm Island

**Prevention point** (highlighted, animated):
```
A washing machine breaks the cascade.
Clean bedding breaks the cycle.
A good bed can prevent heart disease.
```

---

### 3. COMMUNITY VOICES — Why people sleep on floors
**Type:** Full-bleed photo backgrounds with quote overlays, horizontal scroll or vertical cards
**Layout:** Each voice gets a full-height panel with their portrait photo behind their words

**Panel 1:** Alfred Johnson portrait (`people/alfred-johnson.jpg`)
> "You can't just go down to the store and buy beds. It's a big muck-around. You have to bring them on the barge, pay for freight, and still, not everyone gets one."

**Panel 2:** Carmelita (no portrait — use `community/tennant-creek.jpg` blurred)
> "The freight is very, very dear. Sometimes family don't have extra mattresses. Kids sleep out with family."

**Panel 3:** Chloe, Kalgoorlie
> "So many people are sleeping on the floor or on old, unsuitable mattresses. Something as simple as a good bed makes a huge difference."

**Panel 4:** Jessica Allardyce, Miwatj Health
> "Essential goods are difficult to get out as everything comes on a barge and they are expensive. There is also a lot of scabies and this often leads to Rheumatic Heart Disease."

**Stat overlay at bottom:** `$1,200+ for a mattress in remote areas — 2x the city price. Lasts weeks, not years.`

---

### 4. THE CO-DESIGN JOURNEY — "We don't design for communities"
**Type:** Timeline scroll with photos and video
**Video embed:** Fred Campbell testimony (Descript or local mp4)

**Timeline entries** (scroll-triggered, alternating sides):

```
V1 Basket Bed
"We want to move it around" — lighter, portable
↓
V2
"We want it high off the ground" — snakes, floods, safety
↓
V3
"We don't want the foam" — can't wash, breaks down in weeks
↓
V4 Stretch Bed
"We want a MAD bed!" — community-designed pride
```

**Key people** (portrait + quote, side by side):

- **Dianne Stokes** (`people/dianne-stokes.jpg`): Named the washing machine in Warumungu. Received 1 bed → returned for 20 more.
- **Norman Frank** (`people/norman-frank.jpg`): "I want to see a better future for our kids." Called for 3 beds. In maroon.
- **Fred Campbell** video: "It's essential... a lot of snakes, so everyone wants to be off the ground."

---

### 5. THE STRETCH BED — Product showcase
**Type:** Sticky scroll with 3D-feel reveal OR assembly sequence animation
**Interaction:** As you scroll, the bed assembles step by step

**Assembly sequence** (scroll-triggered, each step locks into place):
1. Canvas laid flat (`bed-canvas.jpg`)
2. First pole threads through (`bed-seq-1-leg-pole.jpg`)
3. Second pole (`bed-seq-2-legs-pole.jpg`)
4. Legs clip on (`bed-seq-3-all-parts.jpg`)
5. Complete bed (`bed-assembled.jpg`) → zooms out to hero shot (`stretch-bed-hero.jpg`)

**Specs appear alongside** (animated counters):
- 26 kg ← weight
- 200 kg ← capacity
- 5 min ← assembly
- 0 tools ← required
- 25 kg ← plastic diverted
- 10+ years ← design life

**Video:** `stretch-bed-desktop.mp4` plays after assembly sequence

---

### 6. PAKKIMJALKI KARI — The washing machine
**Type:** Split section — image left, content right
**Images:** `washing-machine-hero.jpg`, `washing-machine-name.jpg` (the Warumungu language plate), `washing-machine-enclosure-sunset.jpg`

**Content:**
- ONE button design story
- Language panel swappable per community
- Recycled plastic casing
- GPS telemetry
- 10+ year lifespan vs 1-2 for standard

**Data highlight:**
```
For every $1 invested in washing → $6 saved in healthcare
Remote laundries reduce scabies by 60%
```

**Quote:** Patricia Frank — "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it's right there at home."

---

### 7. MAKING IT — The production facility
**Type:** Full-bleed video background transitioning to step-by-step process
**Video:** `recycling-plant-desktop.mp4` (autoplay on scroll-in)
**Descript embeds:** On Country Production #1 and #2

**Process steps** (reuse existing component pattern from homepage but bigger, more cinematic):
1. **Collect** — `process/01-source.jpg` — Community gathers plastic waste
2. **Shred** — `process/02-process.jpg` — Containerised shredder
3. **Press** — `process/hydraulic-press.jpg` → `pressed-sheets.jpg` — 180°C, overnight cooling
4. **Cut** — `process/cnc-cutter.jpg` — CNC router, precise components
5. **Build** — `process/04-build.jpg` — 5 minutes, no tools
6. **Deliver** — `process/06-deliver.jpg` — On community, by community

**Container facility callout:**
```
2 shipping containers. $100K invested.
Container 1: Shreds. Stays in community.
Container 2: Produces. Travels the circuit.
200 tubs of plastic → 200 beds.
```

**Map animation:** Circuit deployment — Alice Springs → Tennant Creek → Katherine → Darwin

---

### 8. THE IMPACT — 389 products, 8 communities
**Type:** Interactive map OR animated counter section
**Background:** `community-testing-bed-golden-hour.jpg`

**Map:** Australia outline with community pins. Each pin expands on hover/tap:
- Palm Island: 141 beds
- Tennant Creek: 139 beds, 5 washers
- Alice Springs: 60 beds
- Maningrida: 24 beds
- Kalgoorlie: 20 beds
- Utopia: 24 beds
- Mt Isa: 4 beds

**Animated counters** (scroll-triggered, count up):
```
389 products tracked
8 communities served
1,000+ lives impacted
9,225 kg plastic diverted
33 storytellers
$445K philanthropic investment
```

**Gallery pull:** Inline scrollable gallery from "General Goods Photos" (74 photos) and "The Harvest" (113 photos) — horizontal scroll, lazy loaded, tap to expand.

---

### 9. COMMUNITY STORIES — They hold the pen
**Type:** Storyteller cards from Empathy Ledger API (syndicated content)
**Component:** Extended `FeaturedStories` — more stories, with portraits and audio/video

**Key storytellers with full panels:**

- **Fred Campbell** — Portrait + video embed + quotes about youth employment
- **Jacqueline** — Video testimony (`jaquilane-testimony.mp4`) + quotes about recycled plastic
- **Dianne Stokes** — Portrait + the washing machine naming story
- **Linda Turner** — Portrait + self-determination quote

**Gallery:** `Goods. Tennant Creek` gallery (19 photos) — inline horizontal scroll

**Quote wall:** All community voices laid out as a mosaic — each quote clickable to expand into the full story.

---

### 10. THE PARTNERS — Who makes this possible
**Type:** Logo grid + partner detail accordion
**Background:** Clean, light, professional

**Partner categories:**
- Community Partners: Oonchiumpa, Wilya Janta, PICC, NPY Women's Council
- Health Partners: Anyinginyi, Miwatj, Purple House
- Manufacturing: Defy Design, Envirobank
- Strategic: Orange Sky, DeadlyScience
- Funders: Snow Foundation, FRRR, Vincent Fairfax, TFN, AMP Spark

**Advisory board:** 13 faces in a grid (where photos exist)

---

### 11. WHAT'S NEXT — Containerised manufacturing at scale
**Type:** Vision section with timeline
**Video:** `building-together-desktop.mp4`
**Image:** `process/factory-overview.jpg`

**Three-year plan** (scroll-triggered timeline):
```
Year 1 (2026-27)
QLD flagship — Jinibara Country
1,500 beds · 6 jobs
↓
Year 2 (2027-28)
Central Australia — Oonchiumpa partnership
3,500 beds · 12 jobs
↓
Year 3 (2028-29)
Top End or Torres Strait
5,000 beds · 18 jobs · 125 tonnes plastic diverted
```

**Vision quote** (full-bleed, large text):
> "When someone asks 'Who makes these?' and the answer is 'We do.'"

---

### 12. CLOSING CTA — Take action
**Type:** Dark background, clear actions
**Image:** `woman-on-red-stretch-bed.jpg` or `lying-on-stretch-bed.jpg`

**Three paths:**
1. **Buy a Stretch Bed** → `/shop/stretch-bed-single`
2. **Sponsor a Bed** → `/sponsor`
3. **Partner With Us** → `/partner`

**Closing line:**
```
Goods that heal.
Built with communities, not for them.
goodsoncountry.au
```

---

## Technical Implementation

### New Components Needed

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `ScrollSection` | Full-viewport section with scroll-triggered animations | Medium |
| `ParallaxImage` | Image that moves at different scroll speed | Low |
| `ScrollReveal` | Fade/slide elements in on scroll intersection | Low |
| `AnimatedCounter` | Count up numbers when in viewport | Low |
| `QuotePanel` | Full-height panel with portrait bg + quote overlay | Medium |
| `CascadeTimeline` | The RHD cascade with scroll-triggered reveals | Medium |
| `CommunityMap` | Interactive Australia map with community pins | High |
| `InlineGallery` | Horizontal scrollable photo gallery | Medium |
| `VideoSection` | Full-bleed video that plays on scroll-in | Low |
| `StickyAssembly` | Sticky scroll bed assembly animation | High |

### Existing Components to Reuse
- `Hero` — video background hero (already built)
- `ImpactStats` — live counters from Supabase (already built)
- `FeaturedStories` — syndicated from Empathy Ledger (already built)
- `MediaSlot` — responsive image with label (already built)
- `CyclingImage` — auto-rotating images (already built)
- `AssemblySequence` — step-by-step product assembly (already built)
- `StoryCard` / `StorytellerCard` — content cards (already built)

### Libraries
- **Framer Motion** — scroll-triggered animations, parallax, layout transitions
- **Intersection Observer** — lightweight alternative for simpler scroll triggers
- **react-countup** — animated number counters (or custom with requestAnimationFrame)
- **Mapbox GL** or **Leaflet** — interactive community map (or simple SVG Australia outline)

### Data Sources
- **Empathy Ledger API** — stories, storytellers, media (via existing `empathyLedger` client)
- **Goods Asset Register Supabase** — live asset counts, community data
- **Static content** — narrative text, quotes (from compendium)
- **Local media** — `/public/images/`, `/public/video/`

### Performance
- Lazy load all images below the fold
- Video: poster frames + load on intersection
- Gallery images: thumbnail first, full-res on expand
- Total page weight target: < 5MB initial, lazy load the rest
- Lighthouse target: 90+ on mobile

---

## Build Order

### Phase 1: Core Structure (MVP)
1. Create `/our-story/page.tsx` with section layout
2. `ScrollSection` wrapper component with IntersectionObserver
3. Sections 1 (Hero), 5 (Stretch Bed), 8 (Impact), 12 (CTA) — the product story
4. Mobile responsive from day one

### Phase 2: Community Voices
5. Sections 3 (Voices), 4 (Co-Design), 9 (Stories) — the human story
6. `QuotePanel` with portrait backgrounds
7. Video embeds (Descript + local mp4)
8. Empathy Ledger story cards

### Phase 3: Data & Process
9. Section 2 (Cascade), 7 (Making It), 10 (Partners)
10. `CascadeTimeline` with animated reveals
11. Process step animations
12. Partner grid

### Phase 4: Polish & Delight
13. Section 6 (Washing Machine), 11 (What's Next)
14. Parallax effects
15. `AnimatedCounter` with scroll triggers
16. `InlineGallery` with Empathy Ledger gallery pulls
17. Community map (if time permits — can start with static image)
18. Loading states, skeleton screens, error boundaries

---

## Content Strategy

This page serves multiple audiences simultaneously:

| Audience | What they see | What they feel | What they do |
|----------|--------------|---------------|-------------|
| **Funder/Investor** | Data, scale, validation, team | "This is real and it works" | Contact/partner |
| **Government** | Impact metrics, health data, procurement savings | "This solves our problem" | Procurement inquiry |
| **Community member** | Their own voices, their communities | "This is about us, by us" | Share, connect |
| **Retail customer** | Product quality, purpose, story | "I want to be part of this" | Buy a bed |
| **Media/Journalist** | The narrative arc, quotes, data | "This is a great story" | Write about it |
| **Other social enterprises** | The model, the approach, the philosophy | "We can learn from this" | Connect, collaborate |

Every section works for every audience. The community voices ARE the data. The data IS the story.
