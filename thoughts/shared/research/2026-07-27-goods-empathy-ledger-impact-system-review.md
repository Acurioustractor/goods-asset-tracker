---
date: 2026-07-27T13:33:53+08:00
researcher: Codex
git_commit: 63e0a4cdb321b9031940fb1012f8bdc928d6fb41
branch: feat/story-road
repository: goods-asset-tracker
topic: "Historical review and future architecture for community-led impact tracking, reflection, evaluation and visualization across Goods and Empathy Ledger"
tags: [research, impact, evaluation, community-governance, data-sovereignty, visualization, empathy-ledger]
status: complete
last_updated: 2026-07-27
last_updated_by: Codex
---

# Goods and Empathy Ledger Impact System Review

## Research question

How have Goods and Empathy Ledger historically tried to define, track, reflect on, evaluate and communicate impact? Which parts are current, successful, unsafe, incomplete or superseded? How do these approaches compare with established impact-management, participatory-evaluation and Indigenous-data-governance models? What components, data structures, visualizations and working rhythms would create a best-in-class community-led impact system where voice shapes goals, evidence and decisions?

## Executive finding

Goods and Empathy Ledger do not need another independent impact framework. They need a single governed learning cycle that joins the strongest existing parts:

```text
community authority
  → locally defined goals and unacceptable outcomes
  → delivery, use, production and ownership events
  → consented voice, observation and reflection
  → evidence-linked outcome claims
  → community interpretation and significance
  → decision and adaptation
  → approved case study and story return
  → next community-defined goal
```

Goods already holds most of the operational truth: assets, delivery, condition, QR signals, fleet telemetry, production, costs, community pathways and ownership stages.

Empathy Ledger already holds most of the meaning and governance infrastructure: storytellers, interviews, transcripts, consent routing, cultural review, verbatim evidence, outcomes, reflections, case-study review, release decisions and story use-and-return.

The systems remain fragmented at the most important point. There is no single community-facing record joining a goal, its rationale, operational events, voices, measurements, outcome review, decision, return obligation and next step.

The recommended centre is therefore not a dashboard. It is a **Community Impact Cycle** backed by a governed evidence graph. Dashboards, reports and case studies become views over that cycle.

## 1. The history of impact thinking in Goods

### 1.1 Delivery totals and output dashboards

The earliest and most persistent model treated impact as things delivered:

- beds;
- washing machines;
- communities;
- plastic diverted;
- people or households reached; and
- money deployed or raised.

This gave Goods a legible public story and supported grants, partner reporting and fundraising. It also created repeated problems:

- raw database rows were counted instead of deployed quantities;
- Stretch and Basket Beds were combined for plastic calculations;
- stale washer states produced conflicting totals;
- household reach became an assumption;
- modelled labour became employment impact;
- output counts were allowed to imply health and wellbeing outcomes; and
- historical figures survived across decks, reports and pages after canon changed.

The live asset rollup now filters by deployed state, sums quantity and separates product types. Public figures have canonical sources and drift checks. This was an important success, but it proves only delivery and scale.

Primary implementation:

- `v2/src/lib/data/asset-canonical.ts`
- `v2/src/lib/data/impact-fetcher.ts`
- `v2/src/app/api/impact-summary/route.ts`

### 1.2 Health cascade and avoided-cost claims

Goods previously visualized a chain from beds and washing machines through hygiene and scabies to rheumatic heart disease, avoided cases and government savings.

This was corrected. The live rule is:

> The scabies to rheumatic heart disease pathway is the why, never a claimed Goods outcome.

Removed or retired:

- sleep-nights as a health proxy;
- prevented health cases;
- avoided government savings;
- "INTERRUPTED" pathway badges; and
- any implied bed-to-justice causal chain.

The current health pathway is explanatory infrastructure. A clinical outcome requires a community-authorised health partner, defined method, baseline, observation period and appropriate verification.

Evidence:

- `v2/src/lib/data/impact-model.ts`
- `v2/src/components/dashboard/health-pathway.tsx`
- `thoughts/shared/handoffs/impact-model-align/P0-claim-ceiling.md`

### 1.3 Competing public dimensions

Goods has used several overlapping structures:

- Health, Environmental, Economic, Community Ownership and Production Efficiency;
- three shifts: material, economic and story;
- five current community-outcome domains;
- Snow's eight alignment principles;
- QBE's product, human and sovereignty facts;
- ALMA;
- LCAA;
- theory-of-change diagrams;
- SROI-oriented measures;
- funder-specific impact categories; and
- community snapshots.

The old public dimensions mixed different types of information:

- community outcomes;
- internal production performance;
- a cross-cutting economic story; and
- a desired future ownership state.

The current canonical backbone is stronger:

1. Rest and health
2. Dignity and safety
3. Indigenous self-determination and community-led design
4. Jobs, On Country work and the path to ownership
5. Circular and local economy

Economics and sovereignty run through every domain. Production efficiency is internal operating evidence. The three shifts remain useful as the short public explanation.

Evidence:

- `v2/src/lib/data/impact-model.ts`
- `wiki/outputs/2026-06-18-goods-impact-framework.md`
- `wiki/articles/impact/theory-of-change.md`
- `thoughts/shared/handoffs/impact-model-align/03-other-framings.md`

### 1.4 Impact per dollar and SROI

The code still contains an "impact per dollar" engineering metaphor. Earlier Empathy Ledger work also built SROI calculators and value-assignment surfaces.

These approaches were useful for asking:

- what resources produce;
- whether a model is economically viable;
- which assumptions determine feasibility; and
- what funders or governments may save.

They are unsuitable as the governing model because they can collapse:

- cultural authority;
- dignity;
- community control;
- story ownership;
- relationship quality; and
- uncertain health contribution

into one apparently comparable score or dollar ratio.

The useful parts remain:

- transparent cost models;
- complete-project costing;
- contribution and additionality questions;
- assumptions and sensitivity;
- local value and wages retained; and
- bounded SROI where community-endorsed financial proxies genuinely support a decision.

### 1.5 ALMA and story-selection lenses

ALMA asks about:

- Authority
- Evidence
- Harm
- Capability
- option value
- value return

It is useful as a governance and editorial review lens. It should not become a score or universal impact ontology.

The strongest principle retained from this work is that a story must be assessed for authority, risk, benefit and return, not only emotional power.

### 1.6 Twin-spine evidence

The most successful Goods impact idea is:

> No number without a voice, no voice reduced to a number.

The numeric spine shows scale and operating facts. The voice spine shows meaning, experience, context and authority.

The Voice Impact Model currently tracks:

- source transcript;
- storyteller;
- community;
- themes;
- domain mappings;
- verbatim quotes;
- sensitivity;
- strength;
- exact-line clearance; and
- coverage gaps.

The approach corrected a common failure in narrative evaluation: attractive quotes detached from their source, permission and context.

Important limit:

> The frequency of a theme in the interview corpus is evidence of corpus coverage, not prevalence across a community.

Evidence:

- `v2/src/lib/data/voice-impact-model.ts`
- `v2/src/app/admin/voice-impact/page.tsx`
- `wiki/investor/12-voice-impact-model.md`
- `wiki/outputs/2026-07-20-the-voices-are-the-evidence.md`

### 1.7 Claims ledger and honesty labels

Goods has developed one of its strongest safeguards in the claims ledger:

- default-deny external claims;
- explicit claim status;
- canonical numeric source;
- claim ceiling;
- supporting evidence;
- as-of date;
- locked claims that cannot leak figures;
- code assertions; and
- confidence or honesty labels.

Current vocabularies overlap:

- verified;
- workpaper;
- modelled;
- estimate;
- target;
- future;
- interest;
- conflict;
- retired; and
- locked.

These should be normalized at the data layer while preserving plain-language labels for community and public audiences.

Evidence:

- `v2/src/lib/data/claims-ledger.ts`
- `v2/src/lib/data/cost-story.ts`
- `v2/src/lib/data/impact-model.ts`

### 1.8 Community pathway and ownership

Goods has moved from a single full-facility assumption to a modular pathway. The public stages are:

1. Yarn
2. Shape
3. Resource
4. Deliver
5. Transfer
6. Grow

The cost engine now supports selectable site and production modules. Ownership is presented as movement, not a completed claim.

The strongest current ownership insight is multidimensional control:

- assets;
- operations;
- money;
- capability;
- demand;
- knowledge and IP;
- data; and
- narrative.

A site can progress differently across each dimension. A single ownership percentage would hide this.

Evidence:

- `v2/src/lib/data/pathway-stages.ts`
- `v2/src/lib/data/community-pathways.ts`
- `v2/src/lib/cost-model/engine.ts`
- `STRATEGY.md`
- `wiki/outputs/2026-07-22-how-a-community-comes-to-own-the-plant.md`

## 2. The history of impact thinking in Empathy Ledger

### 2.1 Transcript analysis and multiple generations of dimensions

Empathy Ledger has built several analysis generations containing:

- themes;
- cultural themes;
- powerful quotes;
- impact dimensions;
- ALMA signals;
- LCAA;
- PRISM;
- spiral resonance;
- storyteller impact;
- project impact;
- organisation impact;
- global transferable patterns; and
- Beautiful Obsolescence.

The intended architecture was storyteller → project → organisation → global. The strongest philosophical description calls these sovereignty containers rather than extraction engines.

The main historical problem was not lack of analysis. It was too many parallel ontologies, some with fabricated or ungoverned outputs, weak source traceability and consent that defaulted too broadly.

Evidence:

- `supabase/migrations/20260115000000_act_unified_analysis_system.sql`
- `docs/analysis-framework-paper.md`
- `thoughts/shared/reviews/2026-05-29-analysis-pipeline-transcript-to-meaning.md`

### 2.2 Personal impact scores and radar dashboards

Several surfaces scored individuals, produced radar profiles or treated model-generated dimensions as personal analytics.

Later research rejects this framing:

- a person should not have a single impact score;
- a journey should be represented through events, reflections, relationships, goals and change in the person's terms;
- radar charts distort area and depend on arbitrary axis order; and
- people must not become data points detached from their stories.

The useful parts are:

- surfacing themes and achievements;
- linking evidence to a person's own goals;
- showing source citations;
- supporting portfolios or grant applications; and
- giving storytellers access and correction.

The scoring and ranking layer should remain retired.

### 2.3 Outcome records

Empathy Ledger's human-authored outcome schema is materially strong. It supports:

- input, activity, output, outcome and impact level;
- baseline, target and current values;
- unit and measurement method;
- measurement dates;
- qualitative evidence;
- success, challenge and learning notes;
- linked stories;
- cultural protocol;
- verification;
- verifier;
- quality and confidence; and
- organisation or project scope.

Historically, outcome rows and AI analysis were disconnected. Outcomes rendered as text lists with limited progress, trend or story evidence.

The current `outcomes-with-evidence` resolver links outcomes to stories and distinguishes claim labels. Impact dashboard and report APIs now use this resolver. This is a significant improvement, but community-authored goal creation and participatory review remain incomplete.

Evidence:

- `production_schema_20260111.sql`
- `src/lib/impact/outcomes-with-evidence.ts`
- `src/app/api/organizations/[id]/impact-dashboard/route.ts`
- `src/app/api/organizations/[id]/impact-report/route.ts`

### 2.4 Reflection

Current reflection surfaces support:

- photo, voice and note capture;
- project, person and place linkage;
- daily capture counts;
- list, filter, edit and delete;
- generated digests;
- organisational reflection archives; and
- themes, years, places and record types.

This is valuable qualitative and institutional-memory infrastructure.

The unresolved issue is structural: reflections are not consistently promoted into evidence, linked to a goal, discussed in a community review or converted into an owned follow-up decision.

Evidence:

- `src/app/reflect/ReflectPage.tsx`
- `src/app/reflections/ReflectionsPage.tsx`
- `src/app/org/[slug]/reflection/page.tsx`
- `src/app/admin/road/ReflectionBox.tsx`

### 2.5 Consent and analysis governance

Empathy Ledger previously contained:

- default-allow analysis paths;
- anonymous or unconsented analysis egress;
- hardcoded compliance assertions;
- fabricated Elders or scores;
- client-supplied verification;
- cross-tenant data risks;
- public media exposure;
- contradictory consent flags; and
- analysis treated as permission to publish.

The July remediation materially changed the platform:

- affirmative AI-processing consent;
- quarantine of unconsented analysis;
- withdrawal exclusion;
- sensitive and sacred local-only routing;
- Elder review;
- default-deny downstream readers;
- model/provider stamping;
- transcript versioning;
- source fingerprints;
- verbatim excerpt grounding;
- nation labels requiring Elder confirmation;
- current profile-authoritative publication consent; and
- citation audits.

This is the strongest foundation for trustworthy qualitative evidence.

Evidence:

- `src/lib/impact/analysis/gates.ts`
- `src/lib/impact/trustable-claims.ts`
- `src/lib/services/transcript-analysis-follow-up.service.ts`
- `src/lib/reports/evidence-consent-gate.ts`
- `src/lib/reports/citation-audit.ts`
- `thoughts/shared/plans/empathy-ledger-impact-roadmap-2026-07-10.md`

### 2.6 Governed case studies

The newest case-study machinery supports:

- private review tied to person and source transcript;
- named community reviewer;
- item-level excerpt proposals;
- accept, reject and contextualize decisions;
- explicit financial-return status and context;
- approved media IDs;
- audience;
- channel;
- purpose;
- time limit;
- revocation; and
- a separate release decision.

The partner preview fails closed without an approved release.

This is close to the right publication governance. What remains unverified is whether complete Goods community case studies are populated, adopted and routinely reviewed by communities.

Evidence:

- `supabase/migrations/20260716031517_case_study_reviewer_decisions.sql`
- `src/app/case-study-review/[token]/page.tsx`
- `src/app/case-study-partner/[token]/page.tsx`

### 2.7 Use and return

The storyteller-facing use-and-return ledger now shows:

- purpose;
- audience;
- recipient;
- status;
- approval date;
- review date;
- agreed return;
- responsible party;
- due state;
- delivery note; and
- unresolved uses where no return agreement exists.

This implements a core reciprocity principle:

> A permitted use is incomplete until the agreed return is assigned, visible and recorded.

The code exists. Production population and community adoption remain unknown.

Evidence:

- `src/app/storyteller/me/use-and-return/page.tsx`
- `src/app/me/[token]/UseAndReturnTab.tsx`
- `src/app/api/me/[token]/uses/route.ts`

## 3. Current impact surfaces

## 3.1 Goods surfaces

| Surface | Current purpose | Evidence pattern | Main caution |
| --- | --- | --- | --- |
| `/impact` | Public impact overview | Three shifts, five domains, progress bars, confidence, voices, economics, sovereignty | Current values can sit beside future targets; user must understand confidence |
| `/stories` | Public community voices | Consented EL profiles, curated quotes, text/video stories, community cards | Local fallback can diverge from canonical consent/provenance |
| `/story/road` | Road narrative | Place, voice, figure, media, explicit gaps | Editorial narrative, not an outcome evaluation |
| `/communities/[slug]` | Place view | Assets, voices, media, narrative, partners | Community view needs stronger local goal and review ownership |
| `/pathways/[id]` | Ownership pathway | Stage, modules, readiness, next steps | Pathway state should be supported by decision evidence |
| `/partners/[slug]/outcomes` | Partner reporting | Live rollup, committed floors, quote, photos, next measures | Can mix commitment with observed delivery |
| `/partners/[slug]/dashboard` | Relationship and funder view | Timeline, contribution, ownership stage, media | Audience-specific framing can become a competing impact model |
| `/admin/voice-impact` | Corpus analysis | Portraits, domain coverage, theme bars, quote clearance | Corpus frequency can be misread as outcome magnitude |
| `/admin/story-atlas` | Narrative coverage | Voice, belief turn, place, metric, provenance, gaps | Editorial map, not population evidence |
| `/admin/reports/impact` | Audience reports | Template metrics, proof points, domains, stories | Template IDs still reference retired domains; target substitution risk |
| `/cost-story` | Economics explanation | Voice, verified/modelled numbers, scenarios | Model results must not read as measured production |
| `/register` and asset pages | Physical truth | Asset, place, status, history, signals | Asset presence is not outcome |
| QR bed pages | Use and demand signal | Scan, pulse, check-in, demand bump | Selection bias, access and privacy limits |
| Fleet dashboard | Machine operations | Cycles, uptime, kWh, alerts, investigation | Connectivity gaps and fallback loss |
| Production surfaces | Making and unit economics | Output, time, cost, supply, reconciliation | Several current measures remain modelled |
| Decks and leave-behinds | Fundraising narrative | Canon figures, voices, story road | Static copies can drift or outlive rulings |
| Maps and diagrams | Context and systems | Need, deployment, facility, pathway, flows | Location privacy and false precision |

## 3.2 Empathy Ledger surfaces

| Surface | Current purpose | Evidence pattern | Main caution |
| --- | --- | --- | --- |
| `/impact` | Global impact/PRISM | Aggregate analysis | Legacy score ontology and consent provenance require scrutiny |
| `/insights` and `/observatory` | Theme exploration | Real voices, quotes, themes, force/constellation views | Exploration must link to approved sources and avoid prevalence claims |
| Storyteller impact pages | Personal portfolio | Achievements, stories, evidence, exports | Avoid personal impact scores or external definitions of success |
| Organisation impact pages | Organisational outcomes | Outcomes, analysis, stories, reports | Must distinguish human-authored outcomes from AI-derived analysis |
| Impact dashboard/report APIs | Reporting | Outcomes linked to published evidence | Community review and goal ownership are not fully surfaced |
| `/reflect` | Lightweight capture | Voice, photo, note, place, person, project | Capture is not evaluation until linked to review and decision |
| `/reflections` | Memory and digest | Filtered reflection archive | AI digest requires source and consent governance |
| Case-study review | Community review | Item decisions, context, release, revocation | Adoption and complete workflow remain unverified |
| Storyteller use-and-return | Reciprocity | Named use, audience, return, due state | Production data may be sparse |
| Trust Meter | Claim readiness | Trustable, pending, culturally withheld, unattributed | Trust ratio is governance health, not impact magnitude |
| Annual reports and live reports | Organisational communication | Outcomes, stories, media, generation | Generation must remain behind evidence and citation gates |
| SROI dashboards | Monetized value | Outcomes, proxies, calculations | Legacy and unsuitable as the primary model |
| Radar and PRISM views | Multidimensional profile | Scores and dimensions | Area distortion and reduction of people |
| Maps and constellation | Relationship/theme exploration | People, stories, places, connections | Must protect location and cultural sensitivity |

## 4. What has worked

### 4.1 Canonical operational truth

Separating canonical figures from narrative copy and adding drift checks has prevented repeated errors from silently becoming public claims.

### 4.2 Claim ceilings

Explicit ceilings make it possible to explain why Goods exists without presenting rationale as measured impact.

### 4.3 Confidence at the point of reading

Verified, modelled, target and future labels are more useful when visible beside each value than buried in methodology.

### 4.4 Voice plus operational evidence

The twin spine retains meaning without asking testimony to perform the job of a statistic.

### 4.5 Verbatim grounding

Snapping excerpts back to the actual transcript protects against stitched, smoothed or fabricated quotes.

### 4.6 Consent and cultural gates in code

Default-deny routing, withdrawal exclusion and cultural review are materially stronger than policy statements alone.

### 4.7 Visible evidence gaps

Story Road, Story Atlas and partner outcomes often show what is unknown or should be measured next. This supports learning.

### 4.8 Item-level case-study decisions

A whole-story consent flag is too coarse. Item-level review plus separate release conditions is a better model.

### 4.9 Use-and-return

Recording what a storyteller receives from a use moves reciprocity from aspiration toward accountable work.

### 4.10 Modular ownership

Tracking the modules and dimensions a community controls is more honest than a binary plant-owned/not-owned state.

## 5. What should remain retired

- Composite impact scores.
- Personal impact rankings.
- Radar charts as the main representation of people or communities.
- Output-only dashboards.
- Health or justice attribution without an authorised method.
- Government-savings estimates presented as outcomes.
- Story counts presented as community impact.
- Theme frequency presented as community prevalence.
- Founder or staff voice presented as community evidence.
- Blanket or perpetual consent treated as approval for every use.
- AI-processing permission treated as publication permission.
- Hardcoded CARE, OCAP or sovereignty compliance badges.
- Unverified outcome rows labelled verified.
- Targets substituted for missing current values in audience reports.
- Commitment figures rendered as delivered impact.
- Single ownership percentages.
- One-size-fits-all facility replication.
- SROI ratios that monetize sovereignty, culture or dignity.
- Maps that expose restricted locations.
- Decorative quote cards detached from source, permission and next action.

## 6. External models

### 6.1 Maiam nayri Wingara

Maiam nayri Wingara is the most relevant Australian foundation. It defines Indigenous Data Sovereignty across creation, collection, access, analysis, interpretation, management, dissemination and reuse. Indigenous Data Governance is the right to decide what, how and why data are collected, accessed and used.

Application:

- community authority begins before data collection;
- analysis and interpretation are governed, not only storage;
- infrastructure and export are part of sovereignty;
- collective rights sit beside individual consent; and
- the system must support Indigenous priorities and decision-making.

Source: [Maiam nayri Wingara](https://www.maiamnayriwingara.org/) and [MnW Principles](https://www.maiamnayriwingara.org/mnw-principles).

### 6.2 CARE

CARE means:

- Collective Benefit
- Authority to Control
- Responsibility
- Ethics

CARE complements FAIR by correcting an emphasis on reuse that ignores power and historical context.

Application:

- every collection and reuse needs an identified community benefit;
- authority must be represented as executable permissions;
- Goods and Empathy Ledger retain responsibilities even when permission exists; and
- harm, future use, benefit and power require continuing review.

Source: [Global Indigenous Data Alliance CARE Principles](https://www.gida-global.org/careprinciples).

### 6.3 OCAP

OCAP means Ownership, Control, Access and Possession. It is a strong operational precedent for Nation-governed research and information systems.

It is Canadian First Nations intellectual property and must not be represented as a generic Australian compliance framework.

Application:

- use it comparatively;
- do not claim Goods or Empathy Ledger is "OCAP compliant";
- learn from community control over collection, storage, interpretation, use and access; and
- prioritize Australian and local community governance.

Source: [First Nations Information Governance Centre](https://fnigc.ca/ocap-training/).

### 6.4 Most Significant Change

MSC collects stories of change and asks stakeholder groups to select which changes are most significant and explain why.

Best fit:

- community review;
- value and significance;
- case-study selection;
- surfacing disagreement;
- identifying unexpected change; and
- learning across decision cycles.

Limit:

- not prevalence evidence;
- selection can reproduce power;
- nomination, panel membership, reasoning and dissent must be transparent.

Source: [Davies and Dart MSC guide](https://www.betterevaluation.org/tools-resources/most-significant-change-technique-guide-its-use).

### 6.5 Outcome Harvesting

Outcome Harvesting begins with an observed change, then works backward to establish significance, context, contribution, other actors and evidence.

Best fit:

- emerging ownership and governance outcomes;
- partnerships;
- unexpected capability changes;
- policy or procurement change;
- contribution rather than attribution; and
- independent substantiation.

Source: [Outcome Harvesting Community](https://www.outcomeharvesting.net/about-oh).

### 6.6 Developmental Evaluation

Developmental Evaluation provides rapid feedback during innovation in complex, uncertain settings.

Best fit:

- early On-Country production pilots;
- changing module configurations;
- ownership transition;
- new youth or employment programs;
- regular adaptation; and
- documenting why a decision changed.

It should be complemented by periodic independent review when Goods makes efficacy claims.

Source: [BetterEvaluation Developmental Evaluation](https://www.betterevaluation.org/methods-approaches/approaches/developmental-evaluation).

### 6.7 Impact Frontiers

The five dimensions ask:

- **What:** which outcome and how important is it?
- **Who:** who experiences it and in what context?
- **How much:** scale, depth and duration.
- **Contribution:** what changed relative to what may have happened otherwise?
- **Risk:** how might actual impact differ from expectation?

Application:

- use this as a claim-completeness grammar;
- let the community determine what matters;
- distinguish scale from depth and duration;
- require contribution and alternative explanations; and
- record impact risk and unintended effects.

Source: [Impact Frontiers Five Dimensions](https://impactfrontiers.org/norms/five-dimensions-of-impact/).

### 6.8 IRIS+

IRIS+ supplies standard metric definitions and core sets for investment reporting. It also emphasizes setting goals, selecting metrics, reviewing data regularly and using it to change decisions.

Application:

- map a small subset of Goods measures for funder comparability;
- keep local definitions and community domains primary;
- record calculation instructions and denominator;
- never import a metric without a relevance, burden, harm and publication test; and
- do not mistake comparability for truth.

Source: [IRIS+ Standards](https://iris.thegiin.org/standards/) and [IMM introduction](https://iris.thegiin.org/introduction/).

### 6.9 Social Value principles and SROI

The useful principles are:

- involve affected stakeholders;
- understand positive, negative, intended and unintended change;
- value what matters;
- include only material claims;
- do not overclaim;
- be transparent; and
- verify.

Application:

- adopt the principles;
- use a monetary SROI only for bounded financial questions;
- preserve qualitative and comparative evidence;
- publish assumptions and sensitivity; and
- never monetize sovereignty, culture or story ownership into a master ratio.

Source: [Social Value International Principles](https://www.socialvalueint.org/principles).

### 6.10 OECD DAC

The criteria are:

- relevance;
- coherence;
- effectiveness;
- efficiency;
- impact; and
- sustainability.

Application:

- use them for periodic whole-program review;
- tailor rather than mechanically score;
- add sovereignty and governance as an explicit seventh lens; and
- let communities define relevance and sustainability.

Source: [OECD evaluation criteria](https://www.oecd.org/en/topics/sub-issues/development-co-operation-evaluation-and-effectiveness/evaluation-criteria.html).

### 6.11 COREQ

COREQ is a 32-item reporting checklist for interviews and focus groups.

Application to Empathy Ledger:

- interviewer and relationship;
- recruitment and sampling;
- setting and participants present;
- interview guide and version;
- recording, transcription and language;
- participant review;
- coding and analyst reflexivity;
- negative or divergent cases;
- supporting excerpts; and
- consent and cultural authority.

Source: [EQUATOR COREQ](https://www.equator-network.org/reporting-guidelines/coreq/).

## 7. The target operating model

### 7.1 Governance before goals

Every Community Impact Cycle begins with:

- community or Nation governance profile;
- lead community-controlled organisation;
- named cultural, operational and publication authorities;
- who is affected and who must participate;
- collective and individual permissions;
- data custody and export preference;
- approved purposes;
- unacceptable outcomes and harms;
- dispute, pause and withdrawal process; and
- benefit and return commitments.

### 7.2 Community-defined goals

A goal contains:

- community wording;
- why it matters;
- whose priority it is;
- desired change;
- unacceptable change;
- baseline or starting context;
- indicators and stories that would be meaningful;
- timeframe;
- responsible decision group;
- data burden and risks;
- permitted audiences;
- review cadence; and
- success, stop and reconsider conditions.

The five Goods domains may be mapped afterward. They do not replace local wording.

### 7.3 Events and observations

Operational events:

- delivery;
- installation;
- use;
- scan or pulse;
- condition;
- repair;
- retirement;
- demand;
- production batch;
- material flow;
- training;
- competency;
- paid work;
- wage;
- sale;
- maintenance;
- Goods support;
- governance decision;
- asset transfer;
- revenue-control change; and
- customer-control change.

Qualitative observations:

- interview;
- field note;
- photo;
- audio;
- video;
- reflection;
- group deliberation;
- community meeting;
- partner observation;
- funder witness; and
- independent substantiation.

### 7.4 Outcome claim

An outcome claim contains:

- what changed;
- who experienced or enacted the change;
- date or period;
- scale, depth and duration where known;
- why it matters to the community;
- Goods contribution;
- other contributors;
- what might have happened otherwise;
- positive, negative, intended and unintended effects;
- impact risks;
- evidence links;
- evidence strength;
- counter-evidence and dissent;
- verifier;
- verification state;
- community interpretation;
- approved audience and purpose; and
- review or expiry date.

### 7.5 Participatory interpretation

At each review:

1. Return accessible evidence to participants.
2. Review progress and missing data.
3. Harvest planned and unexpected outcomes.
4. Nominate significant changes.
5. Discuss which changes matter and why.
6. Preserve different interpretations and dissent.
7. Review harms, burdens and exclusions.
8. Decide what to continue, change, pause or stop.
9. Assign the next action and review date.
10. Approve only the external claims and stories needed.

### 7.6 Decision and adaptation

Every reflection should be able to link to a decision.

Every decision should contain:

- question;
- evidence considered;
- people and authorities involved;
- options;
- decision;
- rationale;
- dissent;
- action owner;
- due date;
- affected goals;
- expected effect;
- follow-up observation; and
- whether public claims or releases must change.

### 7.7 Publication and return

The case study is generated from governed records. It receives a separate release decision:

- exact content;
- audience;
- purpose;
- channel;
- duration;
- media;
- attribution;
- financial or other return;
- responsible party;
- withdrawal route; and
- version.

The storyteller and community can see:

- where it was used;
- what was returned;
- what remains due;
- what changed because of it; and
- how to correct or withdraw it.

## 8. Minimum data components

1. **Community governance profile**
2. **Authority and decision group**
3. **Data and story agreement**
4. **Community-defined outcome**
5. **Goal and baseline**
6. **Indicator definition**
7. **Operational event**
8. **Production batch**
9. **Asset and status history**
10. **Observation or measurement**
11. **Story source**
12. **Evidence excerpt**
13. **Outcome claim**
14. **Evidence link and strength**
15. **Reflection**
16. **Deliberation and significance decision**
17. **Adaptation decision**
18. **Ownership/control milestone**
19. **Verification**
20. **Release decision**
21. **Use record**
22. **Return obligation**
23. **Case-study view**
24. **Review cycle**

### 8.1 Shared claim status

Recommended internal states:

- `observed`
- `self_reported`
- `corroborated`
- `verified`
- `modelled`
- `target`
- `future`
- `disputed`
- `retired`
- `restricted`

These are not a single quality ranking. `self_reported` may be the correct evidence for lived experience. `verified` requires a stated method and authority.

### 8.2 Evidence strength

- direct operational record;
- direct participant account;
- repeated independent accounts;
- corroborated account;
- community deliberation;
- documentary evidence;
- independent substantiation;
- evaluator interpretation;
- plausible contribution;
- causal estimate.

### 8.3 Stable relationship

```text
community
  → impact cycle
    → goal
      → indicator
      → event or observation
        → evidence
          → outcome claim
            → deliberation
              → decision
                → release and return
                  → next goal
```

## 9. Visualization architecture

## 9.1 Principle

The visual system should answer a decision question. It should not ask readers to discover meaning by exploring a large dashboard.

Use three views over one governed evidence graph.

### 9.2 Community view

Primary questions:

- What did we say mattered?
- What have we seen and experienced?
- What changed?
- What did not change?
- What have we decided?
- What happens next?
- What has been shared and returned?

Recommended components:

#### A. Community voice header

- locally chosen outcome name;
- approved audio, video or quote;
- why it matters;
- storyteller and cultural authority;
- language and attribution;
- permission badge; and
- link to context.

#### B. Goal journey

Use a simple timeline:

```text
starting point → action → observation → community review → decision → next step
```

Show dates, decisions and voices. Do not show a false linear causal arrow from product to health outcome.

#### C. What we heard / what we decided / what changed

Three linked cards:

- voice and observation;
- decision record; and
- later evidence.

This makes reflection actionable.

#### D. Community-defined outcome progress

Use:

- baseline;
- latest value;
- target or desired direction;
- uncertainty;
- date;
- sample or denominator;
- method;
- status; and
- supporting story.

Prefer a line, dot plot or progress strip. Do not use a gauge without time or context.

#### E. Most Significant Change panel

- candidate stories;
- selected story;
- who selected it;
- why it was significant;
- different or dissenting view; and
- next decision.

#### F. Ownership and capability ladder

Use rows for:

- assets;
- operations;
- money;
- capability;
- demand;
- knowledge/IP;
- data; and
- narrative.

Columns show named stages with supporting evidence. Do not calculate one ownership percentage.

#### G. Story use and return

- approved uses;
- audience;
- purpose;
- what was returned;
- due or overdue obligations;
- correction and withdrawal; and
- community benefit.

### 9.3 Delivery and learning view

Primary questions:

- Is the operating model working?
- Where are failures and evidence gaps?
- What is progressing toward community control?
- Which decision needs attention?

Recommended components:

#### A. Asset survival cohort

A cohort survival curve or simple small multiples by delivery period:

- active;
- repaired;
- retired;
- lost;
- unknown.

Always show follow-up completeness.

#### B. Production run chart

Small multiples:

- units;
- labour hours;
- yield;
- material;
- energy;
- unit cost;
- defects;
- downtime;
- local paid hours; and
- Goods support hours.

Show measured runs separately from modelled scenarios.

#### C. Goal trend

Baseline, actual, target band, confidence and decisions annotated on the line.

#### D. Outcome harvest board

Columns:

- observed;
- evidence review;
- community substantiation;
- independently substantiated;
- approved for use;
- needs more evidence.

#### E. Evidence coverage matrix

Rows are goals or claims. Columns are:

- operational data;
- participant voice;
- community review;
- independent evidence;
- consent;
- cultural review;
- verifier;
- current review date.

This is more useful than an abstract quality score.

#### F. Risks and unintended outcomes

A visible panel:

- risk;
- early signal;
- affected people;
- mitigation;
- owner;
- next check; and
- whether community raised it.

#### G. Decision queue

- decision;
- evidence ready or missing;
- authority required;
- responsible person;
- due date; and
- impact of delay.

### 9.4 Public and funder view

Primary questions:

- What is verified?
- What do communities say it means?
- What is Goods contributing?
- What remains uncertain?
- How is authority and return protected?
- What is the next funded step?

Recommended sequence:

1. Approved voice and community context.
2. Three to five current verified numbers.
3. Change over time, not only totals.
4. One outcome contribution chain.
5. Ownership/control progression.
6. Community-approved case study.
7. Limitations and negative or unknown results.
8. Methodology and provenance.
9. Next decision and use of funds.

### 9.5 Best chart choices

| Question | Preferred visual |
| --- | --- |
| Change over time | Line chart with annotations |
| Progress from baseline to target | Dot plot or line with target band |
| Compare communities safely | Small-multiple bars with context, never ranking |
| Show ownership progression | Evidence-backed milestone ladder |
| Show money or material flow | Sankey only when flow quantities reconcile |
| Show production sensitivity | Scenario lines or tornado chart |
| Show evidence completeness | Matrix or table |
| Show claim chain | Pathway with evidence-strength markers |
| Show corpus theme coverage | Horizontal bars labelled as corpus coverage |
| Show relationships | Network only when a concrete relationship question exists |
| Show individual journey | Event/reflection/decision timeline |
| Show uncertainty | Ranges, bands and explicit unknown state |
| Show voice | Audio/video/quote with provenance and use conditions |

Avoid:

- radar charts;
- composite scores;
- decorative gauges;
- community league tables;
- maps without a decision purpose;
- area-distorting bubbles;
- hidden denominators;
- colour-only status;
- animation that obscures values; and
- scrolling experiences without a text/table alternative.

### 9.6 Accessibility and low-bandwidth requirements

- Never rely on colour alone.
- Direct-label important values.
- Provide a structured table equivalent.
- Provide transcripts and captions for audio/video.
- Provide alt text and longer descriptions for complex visuals.
- Support print and offline export.
- Use progressive media loading.
- Let community views work on low bandwidth.
- Protect precise location where disclosure could cause harm.
- Use plain language and locally chosen wording.

Authoritative references:

- [ONS choosing chart types](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type)
- [W3C visual accessibility](https://www.w3.org/WAI/people-use-web/abilities-barriers/visual/)
- [J-PAL data visualization](https://www.povertyactionlab.org/resource/data-visualization)

## 10. Working cadence

### At every delivery or production event

- update asset or batch record;
- capture actual time, cost, material, quality and paid work;
- collect only authorised observations;
- log incidents, repairs and unexpected effects;
- identify claims affected; and
- schedule return or follow-up.

### Monthly operating review

- asset and production health;
- goal progress;
- evidence gaps;
- consent and cultural-review backlog;
- decision queue;
- use-and-return obligations;
- risks and unintended outcomes; and
- next community contact.

### Quarterly community learning review

- return evidence;
- review goals in local language;
- harvest outcomes;
- review significant changes;
- discuss dissent and harm;
- decide continue, change, pause or stop;
- update ownership milestones;
- approve limited external uses; and
- set the next review.

### Annual independent review

- community-defined relevance;
- coherence;
- effectiveness;
- efficiency;
- impact;
- sustainability;
- sovereignty and governance;
- evidence quality;
- contribution and alternative explanations;
- negative and unintended outcomes; and
- system changes made in response.

## 11. Component architecture

```text
GOODS OPERATIONAL TRUTH
assets · delivery · condition · repair · fleet · production · cost · pathway
                              │
                              ▼
COMMUNITY IMPACT CYCLE
authority · goal · event · observation · outcome · deliberation · decision
                              │
                              ▼
EMPATHY LEDGER GOVERNANCE
storyteller · transcript · consent · cultural review · evidence · release · return
                              │
                              ▼
GOVERNED CLAIM GRAPH
claim · source · method · confidence · verifier · audience · purpose · expiry
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
           community      operations    public/funder
             view            view           view
```

Goods should remain canonical for physical and economic operations. Empathy Ledger should remain canonical for governed qualitative sources, evidence use and return. The Community Impact Cycle owns the relationship and decision logic between them.

## 12. Priority build sequence

### P0. Correct current reporting hazards

- Replace retired impact-domain IDs in report templates.
- Remove proof points that claim present ownership or field-proven survival.
- Stop substituting targets when current data is missing.
- Separate commitments from delivered values in partner KPIs.
- Label theme bars as interview-corpus coverage.
- Remove the hardcoded QR hash-salt fallback.

### P1. Establish shared IDs and contracts

- community;
- impact cycle;
- goal;
- asset;
- production run;
- transcript;
- reflection;
- outcome;
- claim;
- decision;
- case study;
- release;
- use; and
- return.

### P2. Build community goals and review

- governance profile;
- local outcome definition;
- baseline;
- goal;
- indicator;
- review cadence;
- unacceptable outcomes;
- significance deliberation;
- dissent; and
- next decision.

### P3. Connect reflections to evidence and decisions

- promote reflection to observation;
- attach it to goal and claim;
- support community review;
- record decision and follow-up; and
- show what changed because of the reflection.

### P4. Complete measured production evidence

- sustained run;
- labour;
- wages;
- yield;
- material;
- energy;
- quality;
- maintenance;
- unit cost;
- Goods support; and
- community interpretation.

### P5. Generate the first complete governed case study

Use one agreed community pilot. Tennant Creek is the strongest operational candidate in the current records, subject to community approval.

The case study must include:

- authority;
- local goal;
- baseline;
- module choice;
- complete-project cost;
- operating evidence;
- approved voices;
- outcome harvest;
- ownership movement;
- limitations;
- community decision;
- release;
- return; and
- reusable questions for another community.

### P6. Replace the public impact dashboard

Build the three governed views from the same evidence graph:

- community;
- learning/operations;
- public/funder.

Do not build a fourth independent reporting model.

## 13. Definition of done

The system is working when a community can:

- define its own goals and unacceptable outcomes;
- see and correct the evidence;
- understand what is measured, reported, modelled or unknown;
- decide what a change means;
- see different and dissenting interpretations;
- control which stories and claims leave the private space;
- know where each approved use went;
- see what was returned;
- withdraw or revise permission;
- trace a public claim to source and method;
- see what Goods still controls;
- decide the next transfer milestone;
- generate a case study without rebuilding evidence by hand; and
- take its data, stories and learning to another provider.

Goods is succeeding when the system progressively makes community more capable of governing the making, evidence and narrative without Goods at the centre.

Empathy Ledger is succeeding when it makes permission, provenance, interpretation, use and return visible while progressively moving authority toward storytellers and communities.

## 14. Primary repository references

### Goods

- `STRATEGY.md`
- `DECISIONS.md`
- `CONTEXT.md`
- `v2/src/lib/data/impact-model.ts`
- `v2/src/lib/data/impact-fetcher.ts`
- `v2/src/lib/data/voice-impact-model.ts`
- `v2/src/lib/data/claims-ledger.ts`
- `v2/src/lib/data/pathway-stages.ts`
- `v2/src/lib/data/community-pathways.ts`
- `v2/src/lib/cost-model/engine.ts`
- `v2/src/app/impact/page.tsx`
- `v2/src/app/admin/voice-impact/page.tsx`
- `v2/src/app/admin/story-atlas/page.tsx`
- `v2/src/app/partners/[slug]/outcomes/page.tsx`
- `v2/src/components/reports/impact-report.tsx`
- `v2/src/lib/data/report-templates.ts`
- `wiki/outputs/2026-06-18-goods-impact-framework.md`
- `wiki/outputs/2026-07-20-the-voices-are-the-evidence.md`
- `wiki/investor/12-voice-impact-model.md`
- `wiki/outputs/2026-07-27-goods-community-impact-and-story-sovereignty-model.md`

### Empathy Ledger

- `docs/analysis-framework-paper.md`
- `production_schema_20260111.sql`
- `src/lib/impact/analysis/gates.ts`
- `src/lib/impact/trustable-claims.ts`
- `src/lib/impact/outcomes-with-evidence.ts`
- `src/lib/reports/evidence-consent-gate.ts`
- `src/lib/reports/citation-audit.ts`
- `src/app/reflect/ReflectPage.tsx`
- `src/app/reflections/ReflectionsPage.tsx`
- `src/app/storyteller/me/use-and-return/page.tsx`
- `src/app/case-study-review/[token]/page.tsx`
- `supabase/migrations/20260716031517_case_study_reviewer_decisions.sql`
- `thoughts/shared/plans/empathy-ledger-impact-roadmap-2026-07-10.md`
- `thoughts/shared/research/2026-07-13-governed-transcript-impact-story-video-system.md`
- `thoughts/shared/research/2026-07-14-goods-transcript-outcomes-evidence-model.md`

## 15. External sources

- [Maiam nayri Wingara](https://www.maiamnayriwingara.org/)
- [Maiam nayri Wingara Principles](https://www.maiamnayriwingara.org/mnw-principles)
- [Global Indigenous Data Alliance CARE Principles](https://www.gida-global.org/careprinciples)
- [FNIGC OCAP](https://fnigc.ca/ocap-training/)
- [Most Significant Change guide](https://www.betterevaluation.org/tools-resources/most-significant-change-technique-guide-its-use)
- [Outcome Harvesting Community](https://www.outcomeharvesting.net/about-oh)
- [BetterEvaluation Developmental Evaluation](https://www.betterevaluation.org/methods-approaches/approaches/developmental-evaluation)
- [Impact Frontiers Five Dimensions](https://impactfrontiers.org/norms/five-dimensions-of-impact/)
- [IRIS+ Standards](https://iris.thegiin.org/standards/)
- [Social Value International Principles](https://www.socialvalueint.org/principles)
- [OECD evaluation criteria](https://www.oecd.org/en/topics/sub-issues/development-co-operation-evaluation-and-effectiveness/evaluation-criteria.html)
- [EQUATOR COREQ](https://www.equator-network.org/reporting-guidelines/coreq/)
- [ONS choosing chart types](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type)
- [W3C visual accessibility](https://www.w3.org/WAI/people-use-web/abilities-barriers/visual/)
- [J-PAL data visualization](https://www.povertyactionlab.org/resource/data-visualization)

## 16. Open questions requiring community or organisational authority

- Which community wants to pilot the complete cycle?
- Who holds cultural, operational, data and publication authority for that pilot?
- What outcomes does that community choose in its own language?
- What data does it not want collected?
- Where should data be held and how should export or transfer work?
- Who is paid for interpretation and review?
- Which benefits or returns are required for each story use?
- Which health partner, if any, will define an authorised evaluation?
- Who pays and supervises the production line?
- What is the first ownership/control function the community wants to take?
- Which public comparisons are acceptable?
- What should happen to historic material whose consent or provenance remains incomplete?

