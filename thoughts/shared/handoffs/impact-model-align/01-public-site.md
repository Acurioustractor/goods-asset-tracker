# Impact-model alignment — public site inventory

Read-only inventory, 2026-06-18. Reference model = `wiki/outputs/2026-06-18-goods-impact-framework.md`
(spine: voice + canon number + honest label; 5 outcome domains; claim ceiling on health;
consent gate; "become unnecessary" arc). Canon = `v2/src/lib/data/asset-canonical.ts`
(496 beds [133 Stretch + 363 Basket], 9 communities, 16 washers, 2,660kg HDPE modelled).

All paths below are absolute-relative to repo root `/Users/benknight/Code/Goods Asset Register/`.

---

## HEADLINE VERDICT

The public site does NOT present one impact model. It presents **at least four different
impact framings** simultaneously, none of which matches the reference framework's 5 outcome
domains, plus a health-outcome overclaim and pervasive charity CTAs. The numbered-stat pages
(`/impact`, `/insights`, `/community`, `/stories`) lean stat-first and routinely break the
"never a stat alone / never a quote alone" spine. The narrative pages (`/cost-story`, `/about`,
`/field-notes`, `/press`) are the closest to the framework — `/cost-story` is essentially a
reference implementation of the spine. The biggest single problem is `/impact`: it owns a
5-DIMENSION model that competes head-on with the framework's 5 DOMAINS and contains the
site's worst health overclaim.

---

## DISTINCT IMPACT FRAMINGS / PILLAR-SETS FOUND (name them)

1. **Framework reference (target):** 5 outcome domains — Rest & health · Dignity & safety ·
   Community-led design & self-determination · Youth/jobs/path-to-ownership · Circular & local
   economy. (NOT implemented on any public page as-is.)
2. **`/impact` "Five Dimensions / How We Measure Impact":** Health & Wellbeing · Environmental ·
   Economic (WISE) · Community Ownership · Production Efficiency. Source `impact-model.ts`
   `IMPACT_DIMENSIONS`. This is a DIFFERENT 5-set (adds Production Efficiency, splits Environmental
   from Circular, has no standalone Dignity or Youth domain).
3. **`/impact` "The Loss Function / Impact Per Dollar":** a 6-metric efficiency banner
   (Assets · Lives Impacted · Plastic · Communities · Employment Hrs · Invested $). A cost-per-dollar
   framing absent from the framework.
4. **`/impact` "Health Cascade / RHD Is Entirely Preventable":** a scabies→Strep A→RHD chain with
   "INTERRUPTED" badges. Direct collision with the framework's claim ceiling.
5. **`/insights` "four pillars of community feedback / Impact Dimensions":** Health · Dignity ·
   Community-Led Design · Basic Needs. A 4-pillar set keyed off `themeDefinitions` in `content.ts`.
6. **`content.ts` `themeDefinitions` (7 themes):** Community Voice (co-design) · Health & Wellbeing ·
   Dignity & Safety · Basic Needs · Product Feedback · Washing Machines · Freight Tax. Drives
   `/insights` chart and the homepage spotlight tabs.
7. **`/about` "What we believe" (4 values):** Community-led design · Made On-Country ·
   Earned-not-given · Community ownership. A values set, not domains — closest in spirit to the arc.
8. **`/press` voice rules (boilerplate framing):** "health hardware", "design in community / become
   unnecessary", explicit banned-words list. A brand/comms framing, well aligned to the arc.

So a reader moving impact → insights → community → about → cost-story meets a 5-dimension model,
a 4-pillar model, a 7-theme taxonomy, a 4-values set, and a clean spine — five different mental
models of "our impact".

---

## TOP 5 MISALIGNMENTS (file:line)

1. **Health-outcome overclaim — the RHD "Health Cascade".**
   `v2/src/app/impact/page.tsx:297-401` ("RHD Is Entirely Preventable", "INTERRUPTED" badges,
   "Beds interrupting floor sleeping", "Wash cycles breaking scabies chain"). Framework claim
   ceiling: NO health outcome is claimed without a partner clinical method; it stays "future".
   This section presents the interruption as achieved. Reinforced by the dimension description
   `v2/src/lib/data/impact-model.ts:235` ("interrupting the scabies → Strep A → RHD cascade") and
   the govt-health-savings metric `impact-model.ts:421-432` (modelled $ savings from "cases
   prevented" — flagged in-code as needing a health-evidence partner, but still wired into the model).

2. **Competing 5-dimension model on `/impact`.**
   `v2/src/lib/data/impact-model.ts:228-562` (`IMPACT_DIMENSIONS`) rendered at
   `v2/src/app/impact/page.tsx:265-295`. Five dimensions (Health/Environmental/Economic/
   Community-Ownership/Production-Efficiency) that are NOT the framework's five domains. No
   Dignity & Safety domain, no standalone Youth/path-to-ownership domain; adds Production Efficiency.

3. **Third, conflicting pillar-set on `/insights` ("four pillars").**
   `v2/src/app/insights/page.tsx:42-71` and `:280-318` ("The four pillars of community feedback":
   Health/Dignity/Community-Led Design/Basic Needs). Also labels the corpus "Verified quotes"
   with a live count (`:106-107`) — a stat-led framing, and "Basic Needs" is not a framework domain.

4. **Charity-framing CTAs across the impact/stories surfaces** (framework + brand voice ban
   "donate/beneficiary/empower/sponsor-as-charity"; lead with need not charity):
   - `v2/src/app/impact/page.tsx:983-999` "Be Part of This Impact… every bed purchased or sponsored…
     changes a family's life" + "Sponsor a Bed".
   - `v2/src/app/stories/page.tsx:751-757` "When you purchase or sponsor a bed, you become part of
     this community" + "Sponsor a Bed".
   - `v2/src/app/community/page.tsx:666-674` "When you purchase or sponsor a bed…" + "Sponsor a Bed".
   (Contrast `/cost-story:181-183` and `/about:50-57` which explicitly reject charity framing.)

5. **Stale / non-canon numbers and stat-without-voice.**
   - `/communities` sums `communityLocations` to **493 beds across 7 places**
     (`v2/src/lib/data/content.ts:767-856`, computed at `v2/src/app/communities/page.tsx:12-25`),
     vs canon 496 / 9. Off by 3 beds and 2 communities.
   - `/stories` stats bar shows hardcoded **"500+ Minutes of community feedback"**
     (`v2/src/app/stories/page.tsx:276`) — a bare stat, no source/label.
   - `/impact` "Lives Impacted (avg 2.5 per bed)" and "Sleep Nights = beds × 2.5 × 365"
     (`impact/page.tsx:186-187`, `impact-model.ts:259-270`) — modelled multipliers presented in the
     headline banner with only a tiny "modelled" badge inside the dimension cards, not on the banner.
   - `/community` metadata + hero hardcode "**29 storytellers**" (`community/page.tsx:15`) while the
     live count is dynamic — a drift risk.

---

## PER-SURFACE FINDINGS

### `/impact` — `v2/src/app/impact/page.tsx` (+ `impact-model.ts`, `impact-fetcher.ts`)
- **Status:** PUBLIC (page.tsx renders with no auth; there is an `impact/login/` subfolder but the
  route file itself is open). Richest impact surface on the site; furthest from the framework.
- **Framings:** #2 Five Dimensions, #3 Loss Function, #4 Health Cascade (all above).
- **Domains vs framework:** mismatched 5-set (see misalignment 2). Production Efficiency and the
  per-dollar "loss function" have no home in the framework.
- **Voices (named):** Jessica Allardyce (Miwatj — practitioner, not a recipient; framework would
  label as practitioner), "Community voice / Palm Island" (anonymous, `impact-model.ts:309-313`),
  Linda Turner, Dianne Stokes. Quotes are attached per-dimension (good) but the headline banner +
  cascade + cost table are stat-only (spine break).
- **Numbers:** beds/communities/plastic pulled live (canon-aligned via fetcher); but layered with
  modelled multipliers (2.5 lives/bed, sleep-nights, employment-hours, govt savings) and a cost
  table. Provenance badges exist (verified/modelled/estimate/target — good, partial spine) but the
  top "Loss Function" banner carries NO badges.
- **Divergences:** health overclaim (RHD cascade); competing dimension model; "Sponsor a Bed" /
  "every bed purchased or sponsored… changes a family's life" charity CTA; "Lives Impacted" headline.

### `/stories` — `v2/src/app/stories/page.tsx`
- **Status:** PUBLIC. Voice-led hero (Linda Turner quote + face + place = on-spine).
- **Framings:** none of the pillar-sets; it's a storyteller roster + EL media.
- **Voices:** pulls **all EL project storytellers, limit 50**, filtered ONLY by internal-account
  blocklist (`:81-90`) and "has at least one quote" (`:92-98`). **No consent-cleared-external gate.**
  The framework requires only consent-cleared-external voices appear externally; this page surfaces
  the whole EL roster. (Curated quotes in `curated-quotes.ts` are preferred for display, but the set
  of PEOPLE shown is not consent-filtered.)
- **Numbers:** stats bar = live storyteller/community counts + `CANONICAL_ASSETS.bedsDeployed` (496,
  good) BUT a hardcoded "500+ Minutes" bare stat (`:276`).
- **Divergences:** consent gate not enforced on the roster; "Sponsor a Bed / purchase" charity CTA
  (`:751-761`); OCAP data-sovereignty section is well-aligned.

### `/field-notes` (+ `/field-notes/[slug]`) — `v2/src/app/field-notes/page.tsx`
- **Status:** PUBLIC. Index lists `tripStories` where `published` (data: `trip-stories.ts`).
- **Framings:** narrative field notes (the Utopia-pattern monthly cut from the framework). No
  pillar-set, no stat banner. On-spine in form.
- **Voices/numbers:** depend on `trip-stories.ts` (not read in this pass — flag for a content check
  that voices there are consent-cleared and numbers are canon). Index page itself makes no claims.
- **Divergences:** none structural; content-level verification of the individual notes is out of scope
  here.

### `/insights` — `v2/src/app/insights/page.tsx`
- **Status:** PUBLIC. Thematic-analysis dashboard.
- **Framings:** #5 "four pillars" + #6 7-theme taxonomy (from `content.ts themeDefinitions`).
- **Voices:** one featured quote per theme from `quotes` (static `content.ts`). Quote + theme, but
  no face and no canon number on the beat — partial spine.
- **Numbers:** "Verified quotes" count, storyteller count, theme count, community count — all
  stat-first in the hero (`:104-127`), stat-without-voice.
- **Divergences:** a third distinct pillar-set; "Verified quotes" label applied to the whole corpus;
  "Basic Needs" is not a framework domain (framework reframes need under Dignity & Safety).

### `/press` — `v2/src/app/press/page.tsx` (+ `press-reads.ts`, `compendium.ts`, EL press-pack)
- **Status:** PUBLIC. Press/brand kit. **Best brand-voice alignment on the site.**
- **Framings:** #8 voice rules + explicit banned-words list (donations/charity, co-design,
  beneficiaries, empower) at `:58-74` — directly encodes the framework's consent/voice posture.
- **Voices:** `featuredVoices = impactStories.slice(0,3)` (`:96`) = Alfred Johnson, Melissa Jackson,
  Gloria Turner. Photos section is explicitly "only consent-cleared, public-visibility" from EL
  (`:319-322`) — on-spine consent handling.
- **Numbers:** `keyFacts` (`:42-49`) = 496 beds (canon ✓), 9 communities (✓), 20kg/bed (✓), with a
  per-fact `verified` flag and the warranty fact honestly marked NOT verified. This is the cleanest
  labelled-number block on the site.
- **Divergences:** minor — voice rule line "A washing machine is cardiac prevention. A bed is medical
  recovery." (`:59`) is a strong health claim stated flatly (sits just inside the line because it's a
  rationale framing, not an outcome count, but worth tightening against the claim ceiling).

### `/cost-story` — `v2/src/app/cost-story/page.tsx`
- **Status:** PUBLIC. **The reference implementation of the spine.**
- **Framings:** none of the pillar-sets; it's the cost-model narrative (framework QBE Area 11 surface).
- **Voices (all cleared per framework):** Linda Turner, Alfred Johnson (freight), Norman Frank, Mykel
  (now cleared 2026-06-18; the in-file comment at `:48-50` still calls Mykel/Fred "consent-pending" —
  stale, update). Each voice is paired with a number and a labelled chart = full spine.
- **Numbers:** explicit verified-vs-modelled labelling (`:369-372` "bill of materials and $750 are
  verified; in-house leg costs, labour, freight, volumes are modelled"). $534.79 BOM, $685/$426
  marginal, $1,780 fully-loaded, 20kg HDPE — consistent and labelled.
- **Divergences:** only the stale "consent-pending" comment for Mykel; explicitly REJECTS charity
  framing (`:181-183`). Strongest alignment.

### `/mission` — `v2/src/app/mission/page.tsx`
- **Status:** REDIRECT to `/story` (`redirect('/story')`). No content of its own. `/story` was not in
  the assigned list; flag if it needs reviewing as the de-facto mission page.

### `/communities` (+ `/communities/[slug]`) — `v2/src/app/communities/page.tsx`
- **Status:** PUBLIC. Map + list of communities.
- **Framings:** geographic, no pillar-set.
- **Numbers:** sums `communityLocations` to **493 beds across 7 places** (computed `:12-25`,
  data `content.ts:767-856`). DIVERGES from canon 496 / 9 (the data set omits some communities and
  is 3 beds short). This is a per-page-computed number, not the canon import.
- **Voices:** community descriptions only; no quotes on the index.
- **Divergences:** non-canon totals (stat-without-voice, and the stat itself is off-canon).

### `/community` — `v2/src/app/community/page.tsx`
- **Status:** PUBLIC. "Community Dashboard" — live EL storytellers + insights + themes + quotes.
- **Framings:** none of the pillar-sets explicitly, but renders EL "themes" and "Highest Impact
  Quotes" (with a numeric "Impact: X.X" score) — a data/analytics framing of voices.
- **Voices:** pulls **all EL storytellers limit 50**, filtered ONLY by `isRealPerson` heuristic
  (`:33-38`) — again **no consent-cleared-external gate** (same gap as `/stories`). Also surfaces EL
  "top quotes" with impact scores (`:266-315`) — uncurated, ranked by an algorithm, no per-quote
  consent check.
- **Numbers:** metadata + hero hardcode "29 storytellers" (`:15`, `:606-609`) while body counts are
  live (drift); impact-stats section uses `CANONICAL_ASSETS` (496/9, canon ✓).
- **Divergences:** consent gate not enforced; "Impact score" ranking of community voices is off-tone;
  "purchase or sponsor a bed" charity CTA (`:666-674`).

### `/gallery` — `v2/src/app/gallery/page.tsx` (+ `gallery-client`, `media.ts`)
- **Status:** PUBLIC. Photo/video/storyteller gallery.
- **Framings:** none; media browser.
- **Voices:** maps **all EL storytellers limit 50** into gallery cards (`:252-261`) with their first
  EL quote — **no consent-cleared-external gate** (same gap). Falls back to `storytellerProfiles`.
- **Numbers:** caption "8 prototype units deployed" for washing machines (`media.ts`-driven,
  `gallery/page.tsx:177`) — conflicts with canon 16 washers-in-community (stale washer figure).
- **Divergences:** consent gate not enforced on people shown; stale "8 prototype units" washer caption.

---

## CROSS-CUTTING PATTERNS

- **Consent gate not enforced on the three EL-roster pages** (`/stories`, `/community`, `/gallery`):
  all three pull the full EL project roster (limit 50) filtered only by internal-account blocklists
  and "has a quote", never by the canon cleared-voices-external set. The framework treats the gate as
  non-negotiable for external surfaces. This is the most systemic risk.
- **Three different "impact dimension/pillar" taxonomies** ship at once (impact 5-dim, insights
  4-pillar, content 7-theme) — none is the framework's 5 domains.
- **Health claim ceiling** is held well by `/cost-story`, `/about`, `/press` but BROKEN by `/impact`
  (RHD cascade + govt-savings metric) and softened-but-present in `impact-model.ts` dimension copy.
- **Charity CTAs** ("Sponsor a Bed", "every bed purchased… changes a family's life", "when you
  purchase or sponsor… you become part of this community") on `/impact`, `/stories`, `/community` —
  contradicted by the explicit anti-charity stance on `/cost-story`, `/about`, `/press`.
- **Canon-number drift:** `/communities` 493/7 (computed), `/gallery` "8 prototype units",
  `/community` "29 storytellers", `/stories` "500+ minutes" — all bypass `asset-canonical.ts`.
- **Best-aligned surfaces to use as the template:** `/cost-story` (full spine), `/press` (labels +
  consent + canon facts), `/about` (arc + values). Worst: `/impact` (every divergence class present).
