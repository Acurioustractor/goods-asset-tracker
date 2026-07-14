<!-- Generated 2026-06-03 by the goods-brand-guide workflow (7 agents). Colour/type values read from the live codebase (globals.css, logo.svg, cost-charts.tsx). Durable repo copy; mirror lives in Notion under Pitch Page and Documents. -->

# Goods on Country: Brand Guide

*The master brand document. A designer, funder, or partner can pick this up and use it. Colour and type values are read from the live codebase (`globals.css`, `logo.svg`, `cost-story/cost-charts.tsx`), not guessed. Treat this as a living document: it updates as the brand system consolidates.*

---

## 1. Brand at a glance

**Essence.** The making belongs on Country.

**The one-line.** Goods presses recycled-plastic beds on Country and builds the production so community owns it. The result is health hardware, local jobs, and assets that stay home.

**The mission.** Our goal is to become unnecessary.

**The promise.** Built with communities, not for them. We don't license. We transfer. A good bed can prevent heart disease, so Goods makes the physical thing that breaks the scabies-to-rheumatic-heart-disease pathway, and builds the production so community owns the making.

**What we make.** The Stretch Bed (flagship, for sale), the Pakkimjalki Kari washing machine (prototype, register interest), the Basket Bed (archived, open-source plans). The Weave Bed is discontinued.

**The human spine.** Mykel built Stretch Beds with Oonchiumpa in Alice Springs, kept one for himself, and asks to come back every day. He carries the arc: waste, to product, to skill, to work, to ownership.

---

## 2. Positioning + audiences

The voice holds across every audience. What shifts is the lead beat, never the warmth or the agency framing.

| Audience | How the brand shows up |
|---|---|
| **Catalytic / funder** | Lead with the case and the structure: $400,000 in signed, match-eligible catalytic capital, as a recoverable grant that converts into community ownership. Press our own legs and a set costs ~$150 instead of $344, saving ~$194 a bed. Break-even drops from ~1,679 to 338 beds a year. |
| **Community** | Lead with agency and place: communities ask for beds, design them around the fire, and own the making. Real names, real language, "deadly," "around the fire." Never charity framing. |
| **Buyer** | Lead with the product and the proof: health hardware that gets people off the ground, 26kg, holds 200kg, 5-minute no-tools assembly, 20kg of HDPE diverted per bed. "Buy now" for the Stretch Bed only. |
| **Partner** | Lead with relationship and transfer: Oonchiumpa as lead Indigenous partner, the production built to move to community ownership. "Partner with us," "Express interest." |
| **Press** | Lead with the story and the people: Mykel, the Utopia trip, the plant inside shipping containers, the cost story. Voice plus face plus number on the same beat. |

---

## 3. Logo

The canonical mark is the **Goods.** wordmark, set in **Poppins Medium 500**, with **ON COUNTRY** tracked beside it (inline) or below it (stacked). Charcoal on light, white on dark. The full SVG system lives in `v2/public/brand/logos/` and serves live at `/brand/logos/`. The cream square `logo.svg` is the legacy favicon, not the wordmark.

**Lockups.**
- **Stacked** (`Goods` over `ON COUNTRY`): `goods-stacked-black.svg`, `-white`, `-on-light`, `-on-dark`. The site header and footer use the stacked mark.
- **Inline** (`Goods.` then `ON COUNTRY` beside, the period rendered as a round dot): `goods-inline-black.svg`, `-white`, `-on-light`, `-on-dark`.
- **Chip** (compact): `goods-chip-on-light.svg`, `-on-dark`. App icon, OG card, watermark.
- Preview every variant at `/brand/logos/preview.html`; usage in `/brand/logos/README.md`.

**Colour (do not improvise).** Charcoal `#0A0A0A`, Cream `#FDF8F3`, White `#FFFFFF`.

**Type.** Poppins Medium 500. `Goods.` letter-spacing -3 at display size; `ON COUNTRY` letter-spacing +8, all caps. Fallback Helvetica Neue, then Arial.

**Co-branding.** Goods sits alongside Oonchiumpa (lead Indigenous partner), Centrecorp Foundation, and ACT / A Curious Tractor, plus funders QBE and Snow Foundation on the logo wall. Give the Goods mark equal or lesser visual weight when paired with Oonchiumpa, never dominant.

**Clear space.** Minimum padding around the mark is the cap-height of the word `Goods`. No type, image, or edge may intrude.

**Do**
- Inline mark in headers and footers, stacked on covers and cards, chip for icons and watermarks.
- White on dark or busy photography, charcoal on light.

**Don't**
- Don't stretch, skew, recolour, drop-shadow, or outline the wordmark.
- Don't put it on busy photography without a tint layer.
- Don't rebuild it in Canva. Use the SVG files.
- Don't use the legacy cream square (`logo.svg`) as the logo; it is the favicon only.
- Don't place the mark over a face or cultural artwork without consent, and never imitate Aboriginal-style design in the mark.

**Legacy + provenance.** The brand previously ran a pink `Goods.` wordmark (`data/new_beds/logos/`). Source: `scripts/generate_logo_variations.py`.

**Rendering note.** The marks are referenced via `next/image`, so they currently render in the Helvetica/Arial fallback in production (an image-embedded SVG does not inherit the app's Poppins). To render in true Poppins everywhere, outline the text to paths or embed the font. The inline dot is positioned for the fallback width, so it only overlaps when rendered in true Poppins.

---

## 4. Colour

Two palettes exist in the live code today: the app design tokens (stored in **OKLCH** in `globals.css`) and the public cost-story treatment (stored in **hex** in `cost-charts.tsx` and `logo.svg`). The cost-story cream and terracotta is the public face of the brand. The OKLCH tokens drive the app UI. They are close but not identical; the consolidation note below flags this.

### A. Public palette (cost-story treatment + logo): exact hex, the brand face

| Hex | Role |
|---|---|
| `#FBF8F1` | Cream card frame (cost-story `C.card`, also the `bg-[#FBF8F1]` literal) |
| `#FDF8F3` | Logo cream square |
| `#A8643F` | Clay / HDPE plastic, the terracotta anchor (`C.clay`) |
| `#C45C3E` | Logo terracotta (keyline + rule) |
| `#C18A7B` | Rose, "Defy" comparison panels (`C.rose`) |
| `#5C8A86` | Teal, canvas / freight / buy-kit (`C.teal`) |
| `#BBA255` | Gold, steel / labour (`C.gold`) |
| `#7E9A68` | Olive, hardware / contribution / factory (`C.olive`) |
| `#5E7A4C` | Green, fixed block / surplus / community (`C.green`) |
| `#8B9D77` | Logo sage ("ON COUNTRY" text) |
| `#2B2A26` | Ink, body text (`C.ink`) |
| `#2E2E2E` | Logo ink ("Goods" wordmark) |
| `#7A7363` | Sub-text (`C.sub`) |
| `#E6DFD1` | Chart gridlines (`C.grid`) |

### B. App design tokens (`globals.css` `:root`, OKLCH): drives the app UI

| Role | Token | Value (OKLCH) |
|---|---|---|
| Background, warm off-white | `--background` | `oklch(0.99 0.005 80)` |
| Foreground, warm dark brown | `--foreground` | `oklch(0.2 0.02 50)` |
| Primary, terracotta/ochre | `--primary` / `--ring` | `oklch(0.55 0.15 45)` |
| Secondary, warm sand | `--secondary` | `oklch(0.85 0.04 85)` |
| Muted, light cream | `--muted` | `oklch(0.95 0.02 80)` |
| Accent, sage green ("connection to country") | `--accent` | `oklch(0.65 0.12 140)` |
| Border | `--border` | `oklch(0.88 0.03 80)` |
| Card, pure white | `--card` | `oklch(1 0 0)` |
| Chart 1 terracotta | `--chart-1` | `oklch(0.55 0.15 45)` |
| Chart 2 sage | `--chart-2` | `oklch(0.65 0.12 140)` |
| Chart 3 gold/sand | `--chart-3` | `oklch(0.7 0.1 85)` |
| Chart 4 clay | `--chart-4` | `oklch(0.5 0.08 30)` |
| Chart 5 teal | `--chart-5` | `oklch(0.6 0.1 180)` |

**Roles.** Cream is the ground. Terracotta/clay is the primary and the anchor of every chart. Sage green carries "connection to country" and is currently a tertiary; formalise it as the secondary accent rather than leaving it underused. Ink for text, sub for captions, gridlines for structure.

**Consolidation note.** The two palettes share intent but not exact values: token primary `oklch(0.55 0.15 45)` versus logo `#C45C3E` versus cost-story clay `#A8643F`; token background versus logo cream `#FDF8F3` versus card `#FBF8F1`. There is no single canonical cream or terracotta hex yet. The recommended fix is to define the cost-story `C` palette as CSS variables and derive both systems from one source, so a palette change is one edit, not a file hunt. Check WCAG contrast on every text-on-cream and text-on-terracotta pairing before publishing externally.

---

## 5. Typography

**Display: Georgia serif** (editorial). Set as `Georgia, "Times New Roman", serif`, the editorial display on the public pages (the cost-story `serif` const, headings). Warm, low-cost, on every machine. The **logo** uses a different font, **Poppins Medium** (see Section 3), not Georgia.

**Body: system sans-serif.** Plain, fast, legible.

**Scale and radii.** Cards use the large radius (`rounded-3xl`, base `--radius: 0.625rem` / 10px, derived up to 4xl at +16px). Cost-story cream cards use `rounded-3xl` with `shadow-sm` and `p-5 md:p-8`.

**Consolidation note.** `layout.tsx` also loads Inter and Playfair Display via `next/font`, and Tailwind's `font-sans` points at undefined Geist variables (falls through to system fonts). Keep **Poppins**: it renders the logo. Pick one editorial display (Georgia is the one used on the public pages), wire `--font-sans` correctly, and drop the genuinely unused loads.

---

## 6. Photography

Real on-Country photography over stock, always. The visual spine is real, named people, not generic imagery. Every photo of a person carries a consent record (see Section 7 and the protocol in Section 12).

**Canonical-product warning.** `v2/public/images/hero/stretch-bed-on-country.jpg` is the **old Basket Bed** (black perforated crate), not the Stretch Bed. Do not use it as a Stretch Bed hero. The canonical Stretch Bed is the speckled/terrazzo recycled-HDPE X-trestle legs with green canvas.

### Hero picks per category

| Category | File | Why |
|---|---|---|
| **Stretch Bed product** | `v2/public/images/product/stretch-bed-hero.jpg` | Canonical bed, golden hour, green canvas taut over terrazzo X-trestle legs. Reads as a real product on Country. |
| **Bed in use (community)** | `v2/public/images/utopia/utopia-09.jpg` | Two community women on a real Stretch Bed indoors, terrazzo X-leg, thumbs-up. Warm, human, agency-forward. |
| **People / portrait** | `design/deck-assets/mykel.jpg` | Mykel, the human spine. The single most important face in the pitch. |
| **Process / making** | `design/deck-assets/heat-press-full.jpg` | The press inside a shipping container, the "press our own legs" capital case in one frame. |
| **Plastic loop** | `design/deck-assets/shredded-plastic-tubs.jpg` | Real shredded-HDPE bricks, proves "20kg diverted per bed" without a diagram. |
| **Factory / plant** | `design/deck-assets/factory-panorama.jpg` | Row of open containers, the whole on-Country plant. This is "the making belongs on Country." |
| **Utopia trip** | `design/deck-assets/nic-with-elder-on-verandah.jpg` | Elder, Nic, and a community member around a bed on a verandah. Strongest relationship image in the repo. |
| **Partners** | `v2/public/images/partners/oonchiumpa.png` | Lead Indigenous partner; pair with Centrecorp, QBE, Snow on the logo wall. |

### Library by zone

| Zone | Key files | Best use |
|---|---|---|
| **Product (canonical: terrazzo X-trestle + green canvas)** | `product/stretch-bed-{hero,assembled,detail,legs,poles,assembly}.jpg`; `pitch/bed-seq-1/2/3-*.jpg`, `pitch/bed-{frame-legs,poles,canvas,assembled}.jpg` | Product page, deck, build diagram (studio-clean part shots) |
| **Bed in use** | `utopia/utopia-09.jpg`; `media-pack/woman-on-red-stretch-bed.jpg`; `product/stretch-bed-{community,in-use,kids-building}.jpg`; `people/xavier-stretch-bed-alice-springs.jpg` | Story, community hero, social (check consent for child faces) |
| **People / portraits (spine in bold)** | **`mykel.jpg`**, **`people/linda-turner.jpg`**, **`people/norman-frank.jpg`**, **`people/alfred-johnson.jpg`**, **`people/dianne-stokes.jpg`**; `people/{patricia-frank,ivy,brian-russell,cliff-plummer}.jpg`; founders `people/{ben-knight,nic-and-ben-warumungu}.jpg`; `process/joey-portrait.jpg` | Voices, deck, community page |
| **Process / plastic loop** | `heat-press-full.jpg`, `process/heat-press-*.jpg`, `process/hydraulic-press.jpg`; `shredded-plastic-tubs.jpg`, `process/shredded-*.jpg`; `process/pressed-sheets-*.jpg`; `process/cnc-*.jpg` (legs cut); build sequence `build/build-001…121.jpg` | Process page, cost-story, jobs story |
| **Factory / plant** | `factory-panorama.jpg`, `facility-full-site.jpg`, `container-factory.jpg`, `process/{containers-angle,factory-overview}.jpg`; `media-pack/goods-branding-golden-hour.jpg` | Process hero, deck, funder |
| **Utopia trip** | `utopia/utopia-01…16.jpg` (09 strongest; deck uses 02/06/09/16); `nic-with-elder-on-verandah.jpg` | Story, community gallery, deck |
| **Washing machine (Pakkimjalki Kari)** | `product/washing-machine-{hero,installed,community,name}.jpg`; `media-pack/{washing-machine-enclosure-sunset,speed-queen-controls}.jpg` | Register-interest page, story |
| **Community / place** | `community/tennant-creek.jpg` (only landscape present) | Communities page |
| **Partner logos** | `partners/oonchiumpa.png`, `centrecorp-foundation.jpg`, `qbe.svg`, `snow-foundation.png`, `amp-foundation.svg`, `frrr.png`, `tfn.svg` | Logo wall, funder deck (SVG preferred) |

**Legacy / do-not-use as Stretch Bed:** `hero/stretch-bed-on-country.jpg` (Basket Bed), `product/{basket-bed-hero,greate-bed}.jpg`, `process/05-weave.jpg` (rename: legacy "weave" term, subject is fine).

### Art-direction rules
- Real people and real place over stock, every time.
- Voice plus face plus number on the same beat. Never a stat alone, never a quote alone.
- Show recycled-HDPE terrazzo legs and green canvas for the Stretch Bed; never the black-crate Basket Bed as the flagship.
- Golden hour and warm natural light suit the palette; avoid cold or heavily filtered grades.

### Cultural protocol + consent (binding)
- Free, prior and informed consent for every use of a name, image, voice, or story. Consent is specific, revocable, and logged in the Empathy Ledger alongside the asset.
- Attribute by name, language, and Country. Never crop, recolour, or composite a person or cultural element in a way that changes its meaning.
- Communities retain rights over their stories and likeness. Goods licenses use, it does not own.
- Check consent for child faces before any social or public use.

### Photo gaps to commission
A clean cut-out studio Stretch Bed hero on white (for spec cards and e-commerce); a person resting on the bed at dusk (the health-hardware payoff); hands on the press (closes "local jobs"); an ownership/handover moment (no human image exists for the recoverable-grant-into-ownership ask); a real 20kg-of-HDPE-equals-one-bed shot; wide landscapes for the other 8 served communities; Oonchiumpa (Kristy Bloomfield) working with the Goods team at the plant.

---

## 7. Empathy Ledger integration

Goods reads stories and storyteller profiles from the Empathy Ledger (API `https://empathy-ledger-v2.vercel.app`, project code `goods-on-country`). There are ~240 storytellers but **0 published stories**, so the site currently runs entirely on local fallbacks in `content.ts` (`storytellerProfiles`, `curatedQuotes`, `community-stories`). EL records merge **on top of** locals, keyed by `display_name`. The proof exists; the work is EL-side data entry plus flipping consent gates.

### Voice + photo map (the 7 consent-cleared voices)

| Storyteller | Quote (verbatim) | Photo | EL field |
|---|---|---|---|
| **Mykel** (Oonchiumpa builder, Alice Springs) | "Yeah, I'll be rocking up every day to make them." / "Comfortable as. Smooth, tight, hard, fancy." | No local portrait; use Utopia frames or add `people/mykel.jpg` | `name` + `quotes[]` + `avatarUrl`; story hero by tag `participant:mykel format:photo` |
| **Linda Turner** (Tennant Creek) | "We've never been asked what sort of house we'd like to live in." | `people/linda-turner.jpg` | `avatarUrl` + `quotes[]`; `themes:['co-design']` |
| **Norman Frank** (Warumungu Elder, Tennant Creek) | "I want to see a better future for our kids and better housing..." | `people/norman-frank.jpg` | `avatarUrl` + `quotes[]`; `isElder:true` |
| **Alfred Johnson** (Palm Island) | "You have to bring them on the barge... It all adds up." | `people/alfred-johnson.jpg` (key `'Alfred  Johnson'`, double-space) | `avatarUrl` + `quotes[]`; `themes:['dignity','health']` |
| **Dianne Stokes** (Elder, Tennant Creek; named the washing machine) | "I'm a traditional owner... almost 24 years without shelter. The only thing I had was my car." | `people/dianne-stokes.jpg` | `avatarUrl` + `quotes[]`; `isElder:true`; `culturalMarkers` (Warumungu naming) |
| **Dr Boe Remenyi** (cardiologist) | "If I can fall through the gaps, how many others are falling through the gaps?" | No portrait, upload `people/boe-remenyi.jpg` | `avatarUrl` + `quotes[]`; `expertiseAreas:['health']` |
| **Kristy Bloomfield** (Oonchiumpa lead) | "We want to create a safe space for our young people..." | No portrait, upload `people/kristy-bloomfield.jpg` | `avatarUrl` + `quotes[]`; `themes:['sovereignty','youth-housing']` |

### How photos and voices get set in EL
1. Create or confirm the Storyteller record with `display_name` matching the local key exactly (mind double-spaces like `'Alfred  Johnson'`, or it appears as a duplicate). Set `bio`, `location`, `isElder` (Norman, Dianne), `languageSkills` (Warumungu for the Tennant Creek Elders).
2. Upload a portrait as an EL media asset and set it as `avatarUrl`. Set `consentObtained: true`, `elderApproved` where relevant, `culturalSensitivity`, `attributionText`, `projectCode: goods-on-country`. Priority uploads: Mykel, Boe, Kristy (no local fallback exists).
3. Add the cleared verbatim quotes to each storyteller's `quotes[]`.
4. Create the Mykel "in his own voice" story; attach Utopia B-roll by tag (`participant:mykel`, `format:photo`) so the trip-story block resolver auto-fills.
5. Flip the consent gates so they pass `filterByConsent`: `syndication_enabled = true`, `is_archived = false`, `consent_withdrawn_at = null`, plus `status = published`, `is_public = true`, `consent_verified = true`. Without `syndication_enabled = true` the story stays invisible.
6. Confirm `EMPATHY_LEDGER_PROJECT_ID`, `EL_SUPABASE_URL/KEY`, and `ENABLE_EMPATHY_LEDGER !== 'false'` in the Goods env, or even published records won't fetch.

No Goods-site code change is needed; the merge and fallback already handle it.

---

## 8. Iconography + product visual system

**Icon style.** Simple line work, consistent weight, warm palette. Subjects are concrete and on-Country: bed, press, plastic, container, hands, Country. No Aboriginal-style design elements, dot patterns, or symbols. If cultural artwork is ever used, commission it directly with consent and payment.

![goods-icon-family](goods-icon-family.png)

**How the Stretch Bed is rendered.** Always the canonical product: recycled-HDPE **X-trestle** legs (two crossed-plank "X" assemblies, speckled/terrazzo), 2 galvanised steel poles (26.9mm OD × 2.6mm wall), heavy-duty Australian canvas. The poles thread through the canvas sleeves and the top holes of the X-legs; tension pulls it tight and the canvas is structural. Never render or describe it as "clip-on," "woven cord," "tension-weave," or "hardwood frame."

![goods-product-set](goods-product-set.png)

**Cost-story diagram family** (`public/goods-*.svg/png`). A consistent set in the cream-and-clay palette: `goods-cost-down`, `goods-cost-curve`, `goods-breakeven`, `goods-marginal-vs-fixed`, `goods-sankey-money`, `goods-sankey-plastic`, `goods-anatomy-bed`, `goods-where-750-goes`, plus `theory-of-change` and `operating-model`. **Quantitative diagrams are computed in code** (Recharts, driven by the verified `computeModel()` engine) for accuracy. **Illustrative visuals** (anatomy, plastic-journey, community-ownership) are Gemini-generated images. Cost figures in any diagram are CANON (Section 9). Fix the known `goods-bed-assembly` label typo: "wit" should read "with."

**Cards.** Cream frames (`#FBF8F1`), `rounded-3xl`, `border-border`, `shadow-sm`, `p-5 md:p-8`, Georgia headings, terracotta/clay-led charts.

*Note: the admin cost-model skins (Mission Control, Investment, Terminal) use a separate dark "console" identity (cyan/amber/zinc). This is internal-only and not governed by the public warm palette. Keep it out of any external-facing material.*

---

## 9. Voice + copy

### Pillars
1. **Agency, not charity.** Community is the actor and owner, never the recipient of rescue. Lead with "asked for," "our own ways," "community-owned."
2. **One human thread, recurring.** A few real, named people who come back, not a quote wall. Mykel is the spine; Tennant Creek is the depth arc.
3. **Voice plus face plus number on the same beat.** A quote sits next to the data it humanises (Alfred and the freight line; Mykel and the $194 cost-down). Never a stat alone, never a quote alone.
4. **Health hardware, not furniture.** A bed prevents heart disease. Goods makes the physical thing that breaks the scabies-to-RHD pathway.
5. **The making belongs on Country.** Press the bed where the plastic, the people, and the need are. Build the production so community owns it and Goods becomes unnecessary.

Consent and data sovereignty (OCAP) underpin all five: attribute by name and community, never fabricate a location, only use the display-cleared set.

### Message hierarchy
- **One-line:** "The making belongs on Country." Goods presses recycled-plastic beds on Country and builds the production so community owns it. Health hardware, local jobs, assets that stay home.
- **Supporting lines (all canonical):** "A good bed can prevent heart disease." / "Built with communities, not for them." / "We don't license. We transfer." / "Press our own legs and a set costs ~$150 instead of $344, saving ~$194 a bed. That is the whole case." / "Own the press and break-even drops from ~1,679 beds a year to 338."
- **The ask:** $400,000 in signed, match-eligible catalytic capital, structured as a recoverable grant that converts into community ownership.
- **The mission:** "Our goal is to become unnecessary."

### Copy patterns
- **Headlines:** short, concrete, a human truth or a plain claim. In use: "Built with communities, not for them.", "She designed it. She named it.", "From a Tin Shed to a Home".
- **Body:** plain declaratives, short sentences, real community language ("deadly," "more better," "rocking up every day"). Lead with the person or the impact, then the spec. Cite the source inline for any number.
- **Captions:** voice plus face plus place, attributed by name and community. Example: `"Hardly anyone around the community has beds.", Ivy, Palm Island`.
- **CTAs:** verb-first, low-pressure, matched to product status. "Buy now" (Stretch Bed only), "Register interest" (washing machine), "Download the plans" (Basket Bed), "Partner with us" / "Express interest" (production). Never list a prototype or archived product as for sale.

### Before / after
1. **Live bug** (`content.ts` `processSteps[5]`, flagged for fix):
   - Before: "The recycled plastic legs click onto the poles."
   - After: "The poles thread through the canvas sleeves and the top holes of the X-legs; tension pulls it tight. No tools, under 5 minutes."
2. **AI-tell + em dash:**
   - Before: "The Stretch Bed isn't just a bed, it showcases how community-led design can transform lives."
   - After: "The Stretch Bed is health hardware. Designed around the fire with Elders and families, it gets people off the ground and breaks the scabies cycle."
3. **Charity framing to agency:**
   - Before: "We provide beds to disadvantaged remote communities in need."
   - After: "Communities ask for beds, design them around the fire, and Dianne came back within two weeks asking for twenty more. We build the production so they own the making."

### Lexicon
**Use:** on Country · health hardware · community-owned / community-led · "around the fire" · co-design · designed with, not for · the making belongs on Country · become unnecessary · catalytic / recoverable capital · the freight tax · deadly (= excellent) · X-trestle tension design · recovered/recycled HDPE plastic · galvanised steel poles · heavy-duty Australian canvas · press / on-country production · assets that stay home.

**Avoid (product):** "clip-on" / "click onto the poles" · "woven cord" / "tension-weave" · "hardwood frame."

**Avoid (framing):** charity / "the less fortunate" / "those in need" / handout / beneficiary / rescue · "showcases" / "underscores" / "stands as a testament" · "not just X but Y" · "in today's world" · forced rule-of-three · decorative arrows in prose. Don't call ACT a registered charity or DGR entity.

**Avoid (punctuation):** em dashes anywhere. Use commas, full stops, or restructure. This is the #1 brand rule and the #1 AI-writing tell.

### Canonical numbers (verbatim, for reuse)
- **Product (Stretch Bed):** 26kg · holds 200kg · 188 × 92 × 25cm · ~5-min, no-tools assembly · 10+ year design life · 5-year warranty · 20kg HDPE diverted per bed · galvanised steel poles 26.9mm OD × 2.6mm wall (1950mm length).
- **Cost story:** ~$685 marginal cost per bed today (Buy-Kit basis $684.79) · recycled-plastic legs cost $344 bought finished from a city factory vs ~$40 raw plastic · press our own and a set costs ~$150 · saving ~$194 per bed · break-even drops from ~1,679 to 338 beds/year once we own the press · ~120 beds made today.
- **Assets (canonical):** 496 beds (363 Basket + 133 Stretch) · 28 washers (14 working) · 9 communities served · 2,660kg plastic (Stretch-only).
- **Production plant:** ~$100K already invested (TFN + ACT) · ~30 beds/week when deployed for 2 months · two-container model (shredder + production) · heat press 190°C, ~5,000 PSI.
- **The ask:** $400,000 signed, match-eligible catalytic capital, as a recoverable grant converting to community ownership.
- **Problem stats (cite source inline):** 59% of remote homes lack washing machines (FRRR, 2022) · 1 in 3 children have scabies at any time (PLOS NTD) · 55% of very remote First Nations homes overcrowded (AIHW, 2021 Census) · standard washing machines last 1–2 yrs vs 10–15 (East Arnhem Spin Project) · one Alice Springs provider sells $3M/yr of washing machines into remote communities, most reaching dumps within months.

### Naming
Stretch Bed (flagship, for sale) · Pakkimjalki Kari washing machine (named in Warumungu by Elder Dianne Stokes; prototype, register interest) · Basket Bed (archived, open-source plans) · Weave Bed (discontinued, remove all references).

---

## 10. Applications + templates

References to the live site at **goodsoncountry.com**.

| Surface | Lead with | Live reference |
|---|---|---|
| **Web home** | The one-line, Mykel, the cost story | `goodsoncountry.com` |
| **Cost story** | Cream cards, computed Recharts, voices, real hero | `/cost-story` |
| **Product** | Canonical Stretch Bed, X-trestle tension, specs, "Buy now" | `/stretch-bed`, `/shop/stretch-bed-single` |
| **Process** | "The making belongs on Country," the plant, plastic loop, Mykel's voice | `/process` |
| **Story / community** | Named voices, Utopia trip, agency framing | `/story`, `/stories`, `/community`, `/communities`, `/gallery` |
| **Impact** | Canonical assets, provenance-tier badges (verified / modelled / estimate / target) | `/impact` |
| **Funder deck** | The ask, cost-down case, break-even, Mykel as spine, partner logo wall | `design/deck-assets/`, `/pitch`, `/investors` (gated) |
| **One-pager** | $400,000 recoverable-grant ask, voice + face + number | deck-assets |
| **Partner / sponsor** | Relationship, transfer to community ownership | `/partner`, `/sponsor` |
| **Social** | Single voice + face + place; verb-first CTA | bed-in-use and portrait sets |

Template rules: cream card frames, Georgia headings, computed quantitative charts, real consent-cleared photography, canonical numbers with inline sources, zero em dashes.

---

## 11. Do / Don't quick reference

**Do**
- Lead with impact and agency; centre Indigenous voices and ownership.
- Use real, named, consent-cleared people. Voice plus face plus number on every beat.
- Use CANON numbers, cite the source inline.
- Render the Stretch Bed as recycled-HDPE X-trestle legs + galvanised steel poles + structural canvas.
- Use cream + terracotta; Georgia display, system-sans body.
- Log consent in the Empathy Ledger; attribute by name and Country.

**Don't**
- No em dashes. Anywhere.
- No AI tells: "not just X but Y," "showcases," "underscores," "stands as a testament," "in today's world," forced rule-of-three, decorative arrows in prose.
- No charity framing: "those in need," "the less fortunate," handout, beneficiary, rescue.
- No "clip-on," "woven cord," "tension-weave," or "hardwood frame" for the bed.
- Don't use the Basket Bed crate image (`hero/stretch-bed-on-country.jpg`) as a Stretch Bed.
- Don't list prototypes or archived products as for sale.
- Don't generate or imitate Aboriginal-style artwork for the visual system.
- Don't place the logo over a face or cultural artwork without consent.

---

## 12. NEXT STEP: Audience tactics, comms guide + funnels

**To be built next.** This guide defines the brand system: voice, look, protocol, assets. It does not yet define the channel-by-channel tactics, the comms cadence, or the conversion funnels. That is the next pass.

Frame for the next document:
- **Per-audience funnels:** catalytic/funder (the $400,000 close, LOI ladder, recoverable-grant structure), community (co-design and register-interest), buyer (Stretch Bed e-commerce, "Buy now"), partner (Oonchiumpa-led transfer, "Partner with us"), press (story pitch, media pack).
- **Channel tactics:** which message and beat lead on web, deck, email, social, and the partner kit; cadence and sequencing per audience.
- **Conversion paths:** how each audience moves from first touch to signed action, mapped to the live `goodsoncountry.com` routes and the GHL pipelines.

**Build location.** The comms and funnel infrastructure lives at `/Users/benknight/Code/act-global-infrastructure` (GHL pipelines, smart-router, audience segments, reconcilers). Build the next pass there, wired to this brand guide as the source of voice, look, and protocol.

**Cultural-protocol governance (carry into every pass).** Anchor consent and attribution in Terri Janke's True Tracks framework (respect, self-determination, consent and consultation, interpretation, cultural integrity, secrecy and privacy, attribution, benefit-sharing, maintaining Indigenous cultures, recognition and protection). Name Oonchiumpa as lead Indigenous partner. Document how brand and commercial benefit flows back, consistent with the recoverable-grant-into-community-ownership structure. *Verify the exact wording and named order of the True Tracks principles against Terri Janke and Company's primary source before publishing the protocol section externally.*