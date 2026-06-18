# Goods impact framings — reconciliation catalogue

**Date:** 2026-06-18 · **Type:** READ-ONLY catalogue (no files changed)
**Purpose:** Every DISTINCT articulation of Goods' impact / theory-of-change / impact-claim framing across the repo, measured against the reference model `wiki/outputs/2026-06-18-goods-impact-framework.md`, so we know exactly what must collapse into one model.

## The reference model (target), in one line
Spine = community VOICE + canon NUMBER + honest LABEL (verified / modelled / future). Canon = 496 beds (133 Stretch / 363 Basket), 9 communities, 16 washers, 2,660kg HDPE (20kg/bed, modelled). 5 domains = Rest & health · Dignity & safety · Community-led design & self-determination · Youth/jobs/ownership · Circular & local economy. Claim ceiling = no health-outcome claims (RHD stays "future"). Arc = demand follows use; making belongs On Country; goal is to become unnecessary.

---

## CATALOGUE OF DISTINCT FRAMINGS

### 1. Code impact model — `impactDimensions` (the live app data)
- **Path:** `v2/src/lib/data/impact-model.ts`
- **Pillar set:** FOUR dimensions, not five: **Health & Wellbeing · Environmental · Economic (WISE) · Community Ownership**. (Also defines a separate 7-item REVENUE-CHANNEL array and a separate `operatingSystems`-style list — donor-institutional, direct-institutional, corporate-RAP, retail, community-maker, government, adjacent — which is a business-model taxonomy, not an impact-domain set.)
- **Headline numbers:** beds-delivered metric (verified), `sleepNightsProvided` (modelled, beds × 2.5 × 365), wash-cycles, plastic-diverted, employment-hours (modelled), FTE jobs, **`govt-savings` = Government Health Savings est.** (modelled, ~$70K/RHD admission × cases). Cost-per-unit $534.79 today → $275.74 factory / $270.74 community.
- **ToC shape:** dimension → metrics with `confidence` flags (`verified | modelled | estimate | target`). No single narrative arc; it is a metrics matrix.
- **Differs from reference:** (a) **4 domains, not 5** — collapses "Dignity & safety", "Community-led design & self-determination", and "Youth/jobs" differently; no standalone Dignity or Self-determination domain. (b) Carries a live **health-cost-avoided / RHD-savings metric** (`govt-savings`) and **`sleep-nights` as a health-outcome proxy** — both push past the reference model's claim ceiling even though labelled modelled. (c) Confidence vocabulary is 4-way (`verified/modelled/estimate/target`) vs the reference's 3-way (verified/modelled/future). This is the data layer the website renders, so it is the highest-priority reconciliation target.

### 2. Snow funder config — "8 alignment principles" + "ignition chain" (CODE, renders live)
- **Path:** `v2/src/lib/funders/configs/snow.ts` (renders at `/partners/snow/dashboard` and `/partners/[slug]/outcomes`)
- **Pillar set:** **EIGHT "alignment principles"** (First Nations leadership · early design in community · place-based On-Country delivery · genuine collaboration · advocacy & policy · evidence-based & culturally safe · long-term flexible funding · data sovereignty & Indigenous IP). Completely different axis from the 5 domains.
- **Headline numbers:** **STALE / conflicting** — "25 kg plastic per bed" (×many; reference is 20kg), "$600/bed planning anchor", "$684.79 Buy-Kit marginal", "15-20 beds deployed / 8 families", "200-350 bed requests", cultural advisors "$3,800/day", "30 beds/week". Stage dial currentIndex=2 "Scaling". Washers "16 in community" (this one IS canon).
- **ToC shape:** a 5-link **"ignition chain"** (anchor capital → de-risk plant → make On-Country → local jobs → next 1,000 beds as employment story) + 7-beat narrative spine. Forward/funder-gratitude arc.
- **Differs from reference:** (a) 8 principles vs 5 domains. (b) **Stale 25kg/bed** contradicts canon 20kg. (c) `additionalContext` has an **"RHD + Healthy Homes connection"** block calling beds/washers "foundational health interventions ... especially relevant to Rheumatic Heart Disease prevention" — softer than the claim ceiling (frames prevention, not "supports conditions to interrupt pathway"). (d) Charity-adjacent legacy framing in tiers ("zero-margin product delivery"). Numbers here are the most drifted in the repo.

### 3. Wiki theory-of-change — "three shifts" plain version
- **Path:** `wiki/articles/impact/theory-of-change.md` (+ identical `v2/.wiki-content/impact/theory-of-change.md`)
- **Pillar set:** **THREE SHIFTS** — Material · Economic · Story. (Not 5 domains.)
- **Headline numbers:** none — deliberately narrative ("products are in communities", "feedback changed design", "people asking for more").
- **ToC shape:** 6-step chain (Listen → Design → Washable/repairable materials → Move production closer → Local work/ownership → Track via feedback). "Evidence has to come from use, not our own claims."
- **Differs from reference:** 3 shifts not 5 domains. Compatible in spirit (the reference's arc is built on this), but it is a SEPARATE axis the model must explicitly fold in (reference treats the 3 shifts as background, not the pillars). No claim-ceiling language stated.

### 4. ToC results-chain / MEL framework (SIH diagnostic deliverable)
- **Path:** `wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md`; rendered diagram `v2/public/theory-of-change.{svg,png,pdf}` via `v2/src/components/marketing/theory-of-change.tsx` (alt-text encodes it); generator `scripts/generate_theory_of_change.py`.
- **Pillar set:** outcomes grouped under **QBE's two priorities — Inclusion + Climate Resilience** — across **three columns: Health & Wellbeing · Environmental · Economic + Community Ownership**, each over short/medium/long horizons. (So: 2 funder priorities × 3 outcome columns × 3 horizons.)
- **Headline numbers:** 495 beds (132 Stretch + 363 Basket — off by 1 vs canon 496/133), 9 communities, ~2,640kg plastic, $61,449 FY26 commercial / ~$537,595 cumulative, 11-metric shortlist with ●◐○□ status keys. Health-cost-avoided metric present but "modelled only, do not use externally".
- **ToC shape:** full inputs→activities→outputs→outcomes→impact results chain + the **Listen→Design→Make→Deliver&track→Learn→Improve** operating cycle. "Our job is to become unnecessary."
- **Differs from reference:** (a) Domains framed via **QBE's 2 priorities + 3 columns** rather than the 5 reference domains. (b) Numbers slightly off-canon (495/132 not 496/133; 2,640 not 2,660). (c) Status vocabulary is 4-way (●◐○□ Tracked/Partial/Modelled/Target) vs reference 3-way. (d) Surfaces the **"bed to courtroom" health→education→justice link** as an under-used outcome — an extra claim chain absent from the reference. The rendered SVG/PNG/PDF diagram propagates this version publicly.

### 5. Australian Living Map of Alternatives (ALMA) — review-lens framing
- **Path:** `wiki/articles/impact/alma-framework.md`
- **Pillar set:** **6 review SIGNALS** (Authority · Evidence · Harm risk · Capability · Option value · Community value return) — a data-governance lens, explicitly NOT a measurement/domain system. Argues against centring SROI.
- **Headline numbers:** none.
- **ToC shape:** not a ToC; a per-evidence-item review checklist.
- **Differs from reference:** Orthogonal — it is a consent/data-sovereignty review lens, not an impact-domain model. The reference absorbs its spirit into "consent as method" but does not name ALMA. Decide whether ALMA stays as the governance lens behind the model or is retired.

### 6. QBE Area 02 — Social Objective & Impact (wiki article)
- **Path:** `wiki/articles/enterprise/02-social-objective-impact.md`
- **Pillar set:** thematic, not a fixed domain set — Health chain · System gaps table · Circular economy · "three things to hold together" (product facts / human facts / sovereignty facts).
- **Headline numbers:** **STALE & self-contradicting by design** — structured deployment 412 beds + 9 washers across 7 places, vs "389 assets" elsewhere, vs Palm Island 141 / Tennant Creek 139 / etc.; plastic 9,225kg (March compendium, flagged not-audited); recommends "hundreds of tracked assets" until reconciled.
- **ToC shape:** health-chain logic + "what we measure today / what's being built next / what we can vs can't claim now".
- **Differs from reference:** (a) Numbers wholly pre-reconciliation (412/389/9,225kg) — superseded. (b) Publishes the public line **"A good bed can prevent heart disease"** then walks it back — a softer claim posture than the reference ceiling. (c) No fixed 5-domain structure. Strong on the "don't overclaim" discipline that the reference inherits.

### 7. QBE Area 01 — Vision & Ambition (wiki article)
- **Path:** `wiki/articles/enterprise/01-vision-and-ambition.md`
- **Pillar set:** "three horizons" (Make proof legible → Funded batches to product ops → Transfer capability) + "three shifts" implicit.
- **Headline numbers:** "hundreds of tracked assets", 389-asset snapshot, "~$460K confirmed", Notion opportunity board "$16,566,450 / 103 opportunities", 140+/369/389/400+ bed-count caveat.
- **ToC shape:** vision → three horizons. "Our job is to become unnecessary."
- **Differs from reference:** stale/wide-range numbers (389, $460K), horizon framing not domain framing; otherwise philosophically aligned (become unnecessary, transfer capability).

### 8. Strategic-pack 05 — Impact Measurement Method (the closest precursor to the reference)
- **Path:** `wiki/outputs/2026-06-13-goods-strategic-pack/05-impact-measurement-method.md`
- **Pillar set:** the **VERIFIED / MODELLED / FUTURE** three-column method + "three shifts" + 5-step ToC.
- **Headline numbers:** **ON-CANON** — 496 (133+363), 9, 2,660kg, 20kg/bed, 32 cleared voices, $425.74/$421 cost. Ray Nelson back-pain quote.
- **ToC shape:** 5-step (Listen/Design/Build washable/Move production/Track) + health rationale with explicit **claim ceiling** wording.
- **Differs from reference:** barely — this is the direct parent. It uses the 3-shifts axis rather than naming the 5 domains, and does not enumerate the 5 domains. Effectively the reference model = this doc + the 5-domain layer. Lowest-conflict; mostly converges.

### 9. Strategic-pack 13 — Vision & Ambition + 02 One-Pager (investor leave-behind)
- **Path:** `wiki/outputs/2026-06-13-goods-strategic-pack/13-vision-and-ambition.md`, `.../02-one-pager.md`
- **Pillar set:** "three shifts" (Material/Economic/Story).
- **Headline numbers:** **ON-CANON** — 496/9, 2,660kg, 20kg/bed; one-pager adds "AU$649,710.79 received / 88.8% collected [WORKPAPER]", "direct commercial revenue AU$90 (3 orders)", $684.79 cost → $425.74/$421, ask $900K-$1M. Ray Nelson quote.
- **ToC shape:** vision → three shifts → structure map (ACT → GOC → community entities) → "become unnecessary".
- **Differs from reference:** mostly aligned. Uses 3 shifts not 5 domains. Publishes **"A good bed can prevent heart disease"** as the lead hook (then qualifies health pathway) — watch against the claim ceiling. Revenue figure ($649,710.79) is a different cut from the MEL doc's $537,595 — a money-reconciliation flag, not an impact-domain flag.

### 10. Metrics-tracked article (wiki) — the stale headline set
- **Path:** `wiki/articles/impact/metrics-tracked.md`
- **Pillar set:** current evidence / near-term build / possible future (3 tiers) — close to verified/modelled/future in shape.
- **Headline numbers:** **STALE** — "389 products, 8 communities, 9,225 kg plastic, $537,595 cumulative revenue". These are the pre-reconciliation numbers the reference explicitly retires.
- **ToC shape:** none; a metrics tiering.
- **Differs from reference:** numbers are the old set (389/8/9,225kg) — flatly contradicts canon 496/9/2,660kg. Tiering shape is compatible. Must be updated or it keeps feeding stale figures.

### 11. Centrecorp / Utopia impact report (funder)
- **Path:** `wiki/outputs/2026-05-18-centrecorp-utopia-impact-report.md`, `wiki/outputs/funder-reports/centrecorp/2026-Q2.md`, `wiki/outputs/utopia-story-spine-2026-05.md`
- **Pillar set:** narrative trip/partnership framing (Utopia deployment story), not a domain set.
- **Headline numbers:** Utopia 87→107 beds, 1.74t plastic (per one-pager), Oonchiumpa partnership. (Not fully re-read this pass — flagged for the numbers sweep; Utopia bed count has churned 87/107 across docs.)
- **Differs from reference:** event/partner-narrative cut rather than the 5-domain model; check its bed/plastic figures against canon during reconciliation.

---

## SOCIAL MEDIA — does any impact content exist?
**No finished social posts / captions exist as a distinct impact framing.** Searches for instagram/linkedin/caption/hashtag/post-copy/carousel/reel returned only:
- **Channel strategy**, not content: `wiki/outputs/2026-05-26-comms-intern-playbook.md` lists IG/Facebook/WhatsApp/LinkedIn as audiences-and-channels and names deliverables to MAKE (e.g. "Instagram photo set from Utopia trip", "Oonchiumpa grant clip") — but they are TODOs, not drafts.
- **One long-form blog draft:** `wiki/outputs/2026-05-25-utopia-trip-blog-post-ben.md` (trip narrative, not a social caption set).
- **Brand-voice rules that would govern social** (`wiki/articles/brand-comms/01-voice-and-tone.md`, `08-agent-prompt-pack.md`, `PHOTOGRAPHY_BRIEF.md`).
- The `/press` page (`wiki/articles/brand-comms/12-press-pack-el-workflow.md`) pulls consent-filtered EL photos/videos — a press SOP, not an impact framing.
No social-media impact-claim framing needs reconciling because none has been written. When social posts ARE drafted, they should be born from the reference model (one face / one voice / one place, per the living-ledger weekly-post cut).

---

## RECONCILIATION SUMMARY (what must collapse into the one model)

**Different PILLAR/DOMAIN sets to unify (the core job):**
- 5 reference domains vs **4 code dimensions** (#1) vs **8 Snow principles** (#2) vs **3 shifts** (#3, #8, #9) vs **2 QBE priorities × 3 columns** (#4) vs **6 ALMA signals** (#5) vs **3 horizons** (#7).

**STALE / off-canon NUMBERS to fix (highest urgency):**
- `snow.ts` **25 kg/bed**, "$600/bed", "15-20 beds", "200-350 requests" (#2) — live on the Snow dashboard.
- `metrics-tracked.md` **389 / 8 / 9,225 kg / $537,595** (#10).
- Area 02 article **412 + 389 + 9,225 kg** (#6).
- MEL doc **495 / 132 / 2,640 kg** (off-by-one/rounding vs canon 496/133/2,660) (#4); rendered into the public theory-of-change.png diagram.
- Revenue cuts disagree: $537,595 (MEL) vs $649,710.79 (one-pager) — money reconciliation, run separately.

**HEALTH-CLAIM CEILING risks (push past "future"):**
- `impact-model.ts` live **`govt-savings` health-cost-avoided metric** + **`sleep-nights` as health proxy** (#1).
- `snow.ts` **"RHD prevention" framing** (#2).
- "A good bed can prevent heart disease" public line in #6, #9 (qualified, but the lead hook).
- MEL doc's **"bed to courtroom" justice link** (#4).

**THEORY-OF-CHANGE SHAPES that diverge:** results-chain+operating-cycle (#4, rendered as the public diagram) vs 6-step plain (#3) vs ignition-chain (#2) vs three-horizons (#7). The reference uses a 3-line arc; the public diagram (#4) is the one most likely to need re-rendering to match.

**CHARITY framing to scrub:** `snow.ts` "zero-margin product delivery" legacy tier language (#2); Area 01/02 actively argue AGAINST charity framing (aligned).

**LOWEST conflict (already convergent):** strategic-pack 05 (#8), 13/02 (#9), wiki ToC (#3) — these are the reference model's direct lineage; mainly need the 5-domain layer added and the claim ceiling kept tight.
