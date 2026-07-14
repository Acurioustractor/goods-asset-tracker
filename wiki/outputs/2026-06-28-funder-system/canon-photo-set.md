# Goods on Country — Canonical Photo Set (funder/investment artifacts)

> The approved images a designer should "always use" so every funder/investor artifact is brand-correct and consent-safe.
> Compiled 2026-06-28 (read-only sweep). Verify paths against current code before shipping.

## Source of truth — where "approved" lives

- **`design/image-canon.json`** is THE authoritative approved set (asOf 2026-06-16, owner Ben). It is a *reference-only index*: one best image per subject, each mapped to the QBE diagnostic area(s) it serves, with `type` (photo/illustration/chart/logo), `dataClass` (green = public-safe, red = consent-gated), and a `consentCleared` flag on people. **24 approved images.** All 24 canonical paths were verified to exist on disk.
- The **Canon photo board UI** at `v2/src/app/admin/canon/page.tsx` + `canon-client.tsx` renders that JSON (consent badges, copy-path-for-Pencil / copy-web-URL). It also offers a live Empathy Ledger picker whose pins live in `v2/data/canon-el-picks.json` — **currently empty (`{}`)**, so there are no EL-pinned canon photos today.
- **Canonical store policy** (from the JSON): web images live under `v2/public/images/**` (served at `/images/**`); `design/deck-assets/` is a *tolerated mirror* for the Pencil deck (Pencil image fills need a path relative to the `.pen`), **not a second source of truth**; `generated-images/` is AI scratch, never canonical.
- **Consent canon:** `v2/src/lib/data/canon.ts` `cleared-voices` fact (value 32, dataClass red) is the OCAP-strict list of people cleared for EXTERNAL use. People images are RED dataClass — never to external models, never auto-published. The 32 cleared names are listed in §Consent below.

Practical read: for a funder artifact, **default to the 24 in `image-canon.json`**. The broader pools below (deck-assets, `v2/public/images/**`) are the approved-source library you draw the next image from, but anything with a person not on the cleared list must be flagged before external use.

---

## (a) Product — Stretch Bed, assembly, anatomy

| Path | Subject | type / dataClass | CANON? | Best use |
|---|---|---|---|---|
| `design/deck-assets/stretch-bed-in-use.jpg` (= `v2/public/images/product/stretch-bed-in-use.jpg`) | Stretch Bed in use, **hero** | photo / green | ✅ CANON (QBE 01,02) | Lead product shot; cover / opener |
| `design/deck-assets/stretch-bed-kids-building.jpg` | Kids building a Stretch Bed | photo / green | ✅ CANON (02,06) | "5 min, no tools" proof; may contain children — see consent |
| `design/deck-assets/goods-bed-anatomy.jpg` | Stretch Bed anatomy / how it works | illustration / green | ✅ CANON (06) | X-trestle legs + 2 poles + structural canvas explainer |
| `v2/public/images/brand/goods-ill-assembly.png` | Assembly diagram (branded line art) | illustration / green | ✅ CANON (06) | Step-by-step assembly; brand line style |
| `v2/public/images/product/stretch-bed-hero.jpg` | Stretch Bed hero (alt, golden hour) | photo / green | mirror | Alt hero; site product slot `product.stretchBedHero` |
| `design/deck-assets/stretch-bed-community.jpg` | Stretch Bed in community setting | photo / green | pool | Context shot |
| `design/deck-assets/goods-anatomy-bed.png` | Bed anatomy (PNG variant) | illustration / green | pool | Alt anatomy graphic |
| `design/deck-assets/goods-bed-assembly.jpg` | Bed assembly (photo) | photo / green | pool | Assembly context |
| `v2/public/images/product/stretch-bed-detail.jpg` · `stretch-bed-assembled.jpg` · `stretch-bed-legs.jpg` · `stretch-bed-poles.jpg` · `stretch-bed-overview.png` | Detail / assembled / legs / poles / overview | photo / green | pool | Component close-ups for spec pages |
| `v2/public/images/media-pack/community-testing-bed-golden-hour.jpg` · `lying-on-stretch-bed.jpg` · `thumbs-up-stretch-bed.jpg` · `woman-on-red-stretch-bed.jpg` | Bed-in-use media-pack shots | photo / green→**check people** | pool | Lifestyle; flag any identifiable person before external use |

Note: washing-machine and basket-bed images exist under `v2/public/images/product/` but are NOT for "for-sale" framing (washer = prototype, basket = archived) — exclude from a "buy the Stretch Bed" artifact.

## Process / on-Country plant (funder-critical — the "we make it here" proof)

| Path | Subject | type / dataClass | CANON? | Best use |
|---|---|---|---|---|
| `v2/public/images/process/heat-press-full.jpg` | Heat press making the legs (the one move) | photo / green | ✅ CANON (03,06,11) | "We press legs on Country" |
| `v2/public/images/process/pressed-sheets.jpg` | Pressed HDPE sheets | photo / green | ✅ CANON (06) | Waste → product |
| `design/deck-assets/shredder-granulator.jpg` | Shredder / granulator | photo / green | ✅ CANON (06) | Collect-shred-melt-press step |
| `design/deck-assets/shredded-plastic-tubs.jpg` | Shredded plastic feedstock | photo / green | ✅ CANON (03,06) | "20kg HDPE diverted per bed" |
| `v2/public/images/process/facility-full-site.jpg` | The on-Country plant / facility | photo / green | ✅ CANON (06,11) | Containerised plant → community ownership |
| `v2/public/images/process/factory-panorama.jpg` | Facility panorama | photo / green | ✅ CANON (06,11) | Wide production-line shot |
| `design/deck-assets/container-factory.jpg` · `goods-plastic-journey.jpg` | Container factory / plastic journey | photo·illustration / green | pool (journey illustration is CANON below) | Plant context |

## (b) Community / field — Utopia, deliveries, builds

| Path | Subject | type / dataClass | CANON? | Best use |
|---|---|---|---|---|
| `v2/public/images/utopia/utopia-09.jpg` (mirror `design/deck-assets/utopia-09.jpg`) | Utopia / on-Country delivery | photo / green | ✅ CANON (02) | Delivery to Utopia, Arawerr, Ampilatwatja |
| `v2/public/images/media-pack/nic-with-elder-on-verandah.jpg` | Nic with an Elder on the verandah | photo / green | ✅ CANON (02,08) | "Listening first" — Elder unnamed, see consent |
| `design/deck-assets/utopia-02.jpg · utopia-06.jpg · utopia-16.jpg` + `v2/public/images/utopia/utopia-01..16.jpg` (16 frames) | Utopia field set | photo / green→**check people** | pool | Field-story spreads; faces need name/consent check |
| `design/deck-assets/build-009.jpg · build-041.jpg · build-073.jpg · build-097.jpg` | Community build sequence | photo / **amber-check people** | pool | Build process; flag identifiable people |
| `wiki/outputs/utopia-media/01-hero..11-close.jpg` (11 frames, see `MANIFEST.txt`) | Utopia May trip raw frames | photo / **RED — consent pending** | ❌ NOT cleared | Internal only; MANIFEST says "All consent pending, internal only. Confirm faces/names before any external use." 07-elders.jpg = likely OAM Elders, CONFIRM names |
| `v2/public/images/media-pack/` event shots: `canberra-airport-display-may-2025.jpg`, `parliament-house-event-mar-2025.jpg`, `deadly-heart-trek-aug-2025.jpg`, `snow-tennant-creek-april-2025.jpg`, `sally-georgina-tennant-creek-jul-2025.jpg`, `goods-early-2023-community.jpg`, `goods-branding-golden-hour.jpg` | Events / milestones / brand-in-field | photo / green→**check people** | pool | Credibility/traction strip; named-people shots need consent check |

## (c) People / storytellers — named portraits (ALL dataClass RED)

The 4 in `image-canon.json` are explicitly `consentCleared: true` AND on the cleared-voices list — safe for external funder use:

| Path | Person | CANON? | Cleared? |
|---|---|---|---|
| `v2/public/images/people/mykel.jpg` (mirror `design/deck-assets/mykel.jpg`, `mykel-indoor.jpg`) | Mykel | ✅ CANON (02) | ✅ cleared-voices |
| `v2/public/images/people/linda-turner.jpg` | Linda Turner | ✅ CANON (02) | ✅ cleared-voices |
| `v2/public/images/people/alfred-johnson.jpg` | Alfred Johnson | ✅ CANON (02) | ✅ cleared-voices |
| `v2/public/images/people/norman-frank.jpg` | Norman Frank | ✅ CANON (02) | ✅ cleared-voices |

Wider portrait library (`v2/public/images/people/`, 27 files) — each maps to a cleared voice or to team; **RED, confirm against cleared-voices per use**. All cross-checked as cleared unless noted:

`annie-morrison`, `brian-russell`, `carmelita-colette` (joint card), `chloe` (practitioner — label as practitioner), `cliff-plummer`, `daniel-patrick-noble`, `dianne-stokes`, `fred-campbell`, `gary`, `gloria-turner`, `heather-mundo`, `ivy` (Ivy Johnson), `jason`, `jimmy-frank`, `kristy-bloomfield`, `melissa-jackson`, `patricia-frank`, `risilda-hogan`, `tracy-mccartney`, `wayne-glenn` (practitioner), `xavier-stretch-bed-alice-springs` (Xavier — pictured on the main hero; story told in Fred Campbell's voice) — **all on cleared-voices.**

Team / founders (own consent, not community storytellers): `ben-knight.jpg`, `nic-and-ben-warumungu.jpg`, and the Elder in `nic-with-elder-on-verandah.jpg` (**unnamed — confirm name before crediting**).

## (d) Brand marks / logos

| Path | Subject | type | CANON? | Best use |
|---|---|---|---|---|
| `design/deck-assets/goods-inline-black.png` | Goods inline logo (black) | logo / green | ✅ CANON (01) | On light backgrounds |
| `design/deck-assets/goods-inline-white.png` | Goods inline logo (white) | logo / green | ✅ CANON (01) | On dark / photo backgrounds |
| `v2/public/images/brand/goods-brand-hero.png` | Brand hero | illustration / green | pool | Section opener |
| `v2/public/images/brand/goods-ill-*.png` (assembly, bed, canvas, leg, poles, plant, plastic-loop, washing-machine) | Brand line-illustration family | illustration / green | pool (assembly + plastic-loop have canon twins) | Consistent explainer icon set |

## (e) Computed charts / diagrams

| Path | Subject | type | CANON? | Best use |
|---|---|---|---|---|
| `design/deck-assets/goods-cost-curve.png` | Cost-down curve | chart / green | ✅ CANON (03,10,11) | Marginal cost falls as we press own legs |
| `design/deck-assets/goods-breakeven.png` | Break-even chart | chart / green | ✅ CANON (03,10,11) | Break-even 1,679 → 338 beds/yr |
| `design/deck-assets/goods-sankey-money.png` | Where the money goes (Sankey) | chart / green | ✅ CANON (04,11) | "Every dollar traced" |
| `design/deck-assets/goods-where-750-goes.png` | Where $750 goes | chart / green | ✅ CANON (04,11) | What a bed price covers |
| `design/deck-assets/goods-plastic-journey.jpg` | The plastic loop / journey | illustration / green | ✅ CANON (03,06) | Waste → bed → job, on Country |
| `design/deck-assets/goods-community-ownership-v2.png` | Community ownership pathway | illustration / green | ✅ CANON (01,09) | Plant + jobs + value stay home |
| `v2/public/images/brand/goods-ownership-handover.png` · `goods-plastic-loop-v1.png` · `goods-20kg-plastic-one-bed.png` | Ownership/loop/impact diagrams | illustration / green | pool | Alt/branded versions |

---

## Consent cross-reference (the named 32, from `canon.ts` cleared-voices)

Ivy Johnson, Dianne Stokes, Ray Nelson, Mykel, Kristy Bloomfield, Norman Frank, Linda Turner, Alfred Johnson, Brian Russell, Karen Liddle, Katrina Bloomfield, Annie Morrison, Heather Mundo, Fred Campbell, Gloria Turner, Carmelita & Colette (joint), Daniel Patrick Noble, Shayne Bloomfield, Jason, Gary, Dorrie Jones, Cliff Plummer, Mark, Melissa Jackson, Patricia Frank, Risilda Hogan, Tracy McCartney, Jimmy Frank, Xavier — **+ practitioner voices Dr Boe Remenyi, Chloe & Wayne Glenn (label as practitioners, NOT community recipients).**

- EL portrait consent gate (`v2/src/lib/empathy-ledger/client.ts`): the EL picker/feeds filter on `consent_withdrawn_at` (null), `is_archived` (false), `is_public`/syndication, `has_explicit_consent`, and elder review (`requires_elder_review` → `elder_reviewed`). The canonical clearance verdict comes from EL's `stories_for_site` RPC (`getGoodsSiteClearance`) — the gate is never reimplemented client-side.
- Cleared names with a portrait on disk but no `consentCleared` flag in `image-canon.json`: only Mykel/Linda/Alfred/Norman are flagged in the JSON. The other ~20 portraits are cleared *per `canon.ts`* but are not in the curated image-canon — treat as usable-with-confirmation, not auto-canon.

## Top gaps

1. **People canon is thin:** only 4 portraits are in `image-canon.json` (Mykel, Linda, Alfred, Norman). ~20 more cleared-voice portraits exist in `v2/public/images/people/` but aren't promoted to canon — a designer working only from the JSON would under-use the faces.
2. **`canon-el-picks.json` is empty (`{}`):** no Empathy Ledger photos are pinned to canon, so the live EL library (hundreds of photos) is invisible to the curated set despite the board supporting it.
3. **QBE areas 05, 07, 12 have NO canon image** (gaps list in JSON); 08, 09 are single-image. Branded drafts exist in `generated-images/goods-illustrations/qbe-0{5,7,8,9},12/` but are pending Ben approval + promotion to `v2/public/images/brand`.
4. **`wiki/outputs/utopia-media/` (11 frames) is RED / consent-pending** — internal only; 07-elders.jpg names unconfirmed. Do not use externally without sign-off.
5. **Identifiable people in field/build/event shots** (build-009/041/073/097, utopia-*, media-pack events, kids-building) are not individually consent-tracked in canon — flag before any external artifact.
