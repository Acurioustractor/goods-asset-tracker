# Community Impact System Implementation Plan

**Status:** proposed  
**Date:** 27 July 2026  
**Repositories:** Goods Asset Register and Empathy Ledger  
**Inputs:** the current Goods strategy, the community impact and story sovereignty model, the full Goods and Empathy Ledger impact-system review, and the current live application surfaces.

## Outcome

Build one live, community-led impact system that lets:

- communities define what matters and what should not happen;
- Goods record delivery, use, repair, production, capability and ownership movement;
- storytellers contribute governed evidence and reflection;
- communities interpret change and decide what happens next;
- every public claim stay linked to current evidence, confidence, permission and review dates;
- funders see approved, decision-useful evidence without gaining access to restricted material;
- communities learn from other communities without being ranked or told to copy one model; and
- each community generate simple, approved artifacts from the same live records.

The centre is the **Community Impact Cycle**, not a new dashboard:

```text
authority
  → goal
  → action and evidence
  → voice and reflection
  → outcome review
  → community decision
  → approved story and return
  → next goal
```

## Product rules

1. Community authority exists before data collection.
2. Local outcome language comes before Goods domain mapping.
3. Operational records and testimony remain different evidence types.
4. No number without context and no voice without provenance.
5. Processing permission is not publication permission.
6. Community review happens before external release.
7. Claims fail closed when evidence, consent or review expires.
8. Every public view reads the same governed claim graph.
9. Missing data appears as missing, never as a target or curated substitute.
10. Communities may compare questions, configurations and lessons, but not be ranked.
11. Ownership is shown across several controls, never one percentage.
12. Every reflection can lead to a decision, and every decision has a follow-up.

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ Community authority                                         │
│ governance · local outcomes · permissions · review · return │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ Community Impact Cycle                                      │
│ goal · baseline · event · evidence · outcome · decision     │
└───────────────┬──────────────────────────────┬──────────────┘
                │                              │
┌───────────────▼──────────────┐  ┌────────────▼──────────────┐
│ Goods operational truth      │  │ Empathy Ledger            │
│ assets · use · fleet ·       │  │ people · interviews ·     │
│ production · cost · pathway  │  │ consent · review · return │
└───────────────┬──────────────┘  └────────────┬──────────────┘
                └──────────────┬───────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Governed claim graph                                        │
│ source · method · confidence · verifier · permission · date │
└─────────────┬────────────────┬────────────────┬─────────────┘
              │                │                │
       community view    learning view   public/funder view
```

## Phase 0: freeze the truth and audit every surface

**Goal:** know exactly what every current surface reads, claims and publishes before adding the new model.

### 0.1 Create the surface registry

Create one machine-readable registry with one row per route, API, report, export, deck and scheduled output.

Fields:

```text
surface_id
repository
route_or_artifact
audience
owner
purpose
data_sources[]
claims[]
confidence_visible
consent_gate
cultural_gate
community_approval_gate
fallback_behavior
cache_behavior
last_verified_at
status: live | migrate | retire | internal_only
replacement_surface_id
```

### 0.2 Audit Goods surfaces

Minimum scope:

- `/impact`
- `/stories`
- `/story/road`
- `/communities/[slug]`
- `/pathways` and `/pathways/[id]`
- `/partners/[slug]/outcomes`
- `/partners/[slug]/dashboard`
- `/cost-story`
- `/register`
- asset and QR pages
- production pages
- fleet dashboards
- `/admin/voice-impact`
- `/admin/story-atlas`
- `/admin/reports/impact`
- funder pages
- decks
- leave-behinds
- grant exports
- maps
- theory-of-change and operating-model diagrams
- cross-system impact APIs

For every surface record:

- exact source of every number;
- exact source of every quote;
- claim status;
- whether current, target and committed values are visually distinct;
- what happens when live data is absent;
- cache lifetime;
- permission and cultural gates;
- whether community approval is required;
- whether the user can reach source and methodology; and
- whether the surface should migrate, merge or retire.

### 0.3 Audit Empathy Ledger surfaces

Minimum scope:

- global impact
- insights
- observatory
- storyteller analytics
- storyteller impact
- organisation impact
- project analysis
- impact dashboards and reports
- reflections
- case-study review
- partner preview
- Trust Meter
- annual reports
- live reports
- use-and-return
- public stories
- syndication
- SROI
- PRISM
- radar and network views
- maps
- generated reports and exports

### 0.4 Correct immediate hazards

Before new feature work:

- replace retired Goods report dimension IDs;
- remove present-tense ownership claims;
- remove claims of field-proven product survival;
- stop using targets when current values are missing;
- separate committed, delivered and measured values;
- label interview-theme charts as corpus coverage;
- remove unsupported personal impact scores;
- retire radar-first presentations;
- remove hardcoded CARE or sovereignty compliance claims;
- fail closed on unverified outcome records; and
- require configured QR privacy salt.

### 0.5 Deliverables

- `impact-surface-registry.json`
- surface audit report
- route-to-source diagram
- retirement and migration list
- public claim regression test
- screenshot baseline for every live surface

### Exit test

Every public claim has a known source, confidence state, permission gate and owner. No surface silently replaces missing evidence.

## Phase 1: shared data contracts

**Goal:** join both systems without making either repository duplicate the other's canonical data.

### 1.1 Stable shared identifiers

Create stable IDs for:

- community;
- community organisation;
- authority;
- impact cycle;
- local outcome;
- goal;
- indicator;
- asset;
- production run;
- operational event;
- storyteller;
- source;
- excerpt;
- observation;
- reflection;
- outcome claim;
- deliberation;
- decision;
- ownership milestone;
- verification;
- case study;
- release;
- use; and
- return obligation.

### 1.2 Canonical ownership

Goods owns:

- asset and delivery truth;
- condition and repair;
- QR use signals;
- fleet telemetry;
- production batches;
- time, cost, material and quality;
- community pathway;
- modules;
- Goods support; and
- ownership/control operating milestones.

Empathy Ledger owns:

- storyteller;
- transcript and source version;
- individual consent;
- cultural review;
- excerpt grounding;
- analysis permission;
- story and evidence review;
- publication release;
- use records;
- return obligations; and
- correction and withdrawal.

The Community Impact Cycle owns:

- community-defined outcomes;
- goals;
- baseline;
- indicator selection;
- review cadence;
- significance deliberation;
- outcome claim;
- decision;
- next action; and
- approved cross-system view.

### 1.3 Claim contract

Implement a shared claim envelope:

```text
claim_id
community_id
impact_cycle_id
goal_id
domain_mapping[]
claim_text
claim_type
status
period
source_ids[]
asset_ids[]
production_run_ids[]
storyteller_ids[]
method
denominator
disaggregation
confidence
evidence_strength
contribution
other_contributors[]
counter_evidence[]
limitations[]
verification_status
verified_by
community_approval_id
approved_audiences[]
approved_purposes[]
review_on
expires_on
withdrawal_state
last_computed_at
```

### 1.4 Shared state vocabularies

Claim state:

- observed;
- self-reported;
- corroborated;
- verified;
- modelled;
- target;
- future;
- disputed;
- retired;
- restricted.

Data freshness:

- live;
- current;
- review due;
- stale;
- unavailable.

Release state:

- private;
- community review;
- approved with conditions;
- released;
- expired;
- withdrawn.

### 1.5 Integration method

Use explicit versioned APIs and event notifications. Do not let either application query undocumented tables in the other.

Required endpoints:

- Goods operational evidence summary by community and cycle;
- Goods asset and production evidence by claim;
- Empathy Ledger approved evidence by community, cycle and purpose;
- Empathy Ledger release and withdrawal state;
- Community Impact Cycle claim and decision feed;
- public-safe community summary; and
- freshness and data-health status.

### Exit test

A claim can be resolved from public text to community approval, source, method, current evidence and withdrawal state across both systems.

## Phase 2: community input and review workflows

**Goal:** make community authority and interpretation a working product flow.

### 2.1 Community setup

Build a facilitated setup flow that records:

- community and language names;
- lead organisation;
- cultural authorities;
- operating authorities;
- story and publication authorities;
- participating groups;
- decision process;
- collective data rules;
- individual consent rules;
- restricted subjects and locations;
- preferred data custody;
- return expectations;
- disputes and withdrawals; and
- review schedule.

Provide:

- facilitated desktop mode;
- printable workbook;
- offline capture;
- audio-first input;
- plain-language summary;
- review and sign-off; and
- export for community custody.

### 2.2 Local outcome and goal builder

Do not start with a metric list.

Flow:

1. What are you trying to make possible?
2. What is already working?
3. What must not happen?
4. Who should experience or control the change?
5. What would you notice if things improved?
6. What story, observation or number would help?
7. Who should collect it?
8. Who should interpret it?
9. Who may see it?
10. When should the community review it?

Then map the local outcome to:

- Goods domains;
- Impact Frontiers dimensions;
- optional IRIS+ metric;
- operational data sources; and
- story and reflection prompts.

The community can reject every suggested mapping.

### 2.3 Observation and reflection input

Extend existing reflection capture with:

- related goal;
- observation type;
- people affected;
- event or asset;
- expected or unexpected;
- positive, negative or mixed;
- urgency;
- permission;
- follow-up needed;
- decision requested; and
- return preference.

Support:

- voice;
- video;
- photo;
- text;
- structured measurement;
- group reflection;
- anonymous or restricted feedback;
- no-network capture; and
- later community correction.

### 2.4 Production and capability input

At each production run record:

- module and site;
- operator;
- products;
- material input;
- output and offcut;
- energy;
- setup and cycle time;
- paid local hours;
- training hours;
- unpaid participation;
- wages;
- defects and rework;
- downtime;
- repairs;
- unit cost;
- Goods support;
- safety events;
- operator reflection; and
- next-run decision.

### 2.5 Outcome review and significance

Build a community review workspace:

- evidence returned in accessible form;
- goal progress;
- missing information;
- candidate outcome harvests;
- candidate significant-change stories;
- source and permission;
- different interpretations;
- negative or unintended outcomes;
- benefit and burden;
- continue, change, pause or stop decision;
- owner and date;
- next observation; and
- approved external claims.

### 2.6 Payment and return

Record:

- who contributed;
- whether participation was paid;
- agreed payment or return;
- responsible organisation;
- due date;
- delivery evidence; and
- unresolved obligation.

### Exit test

A community can create a goal, contribute evidence, interpret it, record dissent, approve or reject a claim, decide what happens next and see what was returned.

## Phase 3: the three live views

**Goal:** replace disconnected dashboards with audience views over the same evidence.

### 3.1 Community view

Route pattern:

```text
/community/[slug]/impact
```

Default private or community-controlled.

Sections:

1. Community voice and locally chosen outcome names.
2. What we said mattered.
3. What has happened.
4. What we heard.
5. What changed and what did not.
6. What we decided.
7. Ownership and capability movement.
8. What is shared externally.
9. What has been returned.
10. What happens next.

Visuals:

- voice-led outcome header;
- goal timeline;
- baseline/latest/desired-direction chart;
- what we heard, decided and later observed cards;
- significant-change selection;
- ownership/control ladder;
- asset survival;
- production small multiples;
- evidence completeness matrix;
- use-and-return ledger; and
- limitations and unknowns.

### 3.2 Delivery and learning view

Route pattern:

```text
/admin/communities/[slug]/impact
```

Sections:

- live goals;
- operational health;
- evidence gaps;
- outcome harvest board;
- decision queue;
- ownership milestones;
- risk and unintended outcomes;
- consent and cultural-review backlog;
- stale claims;
- return obligations; and
- next field activity.

### 3.3 Public and funder view

Route pattern:

```text
/communities/[slug]
/impact
/partners/[slug]/outcomes
```

Sections:

1. Approved voice and place context.
2. Three to five current verified facts.
3. Change over time.
4. One evidence-backed contribution pathway.
5. Ownership and capability milestones.
6. Community-approved case study.
7. Unknown, negative and unintended results.
8. Method and provenance.
9. Next decision and funding need.

No private drill-down. No precise restricted locations. No cross-community ranking.

### 3.4 Cross-community learning view

Route:

```text
/community/learning
```

Users explore:

- community-chosen goals;
- modules tried;
- starting conditions;
- measured production patterns;
- operating prerequisites;
- problems encountered;
- changes communities made;
- ownership functions transferred;
- lessons approved for reuse;
- tools and artifacts;
- contact or learning pathway chosen by each community.

Filters:

- module;
- stage;
- geography at an approved level;
- product;
- operating condition;
- evidence type;
- lesson type; and
- community-approved topic.

Never show:

- league tables;
- composite impact rankings;
- unrestricted quotes;
- sensitive locations;
- unsupported "best community" labels; or
- comparisons without context.

### Exit test

All four views render the same claim differently for audience and permission, while preserving the same source, status and review date.

## Phase 4: live data and freshness

**Goal:** public impact changes when canonical evidence changes, with no manual copy drift.

### 4.1 Event flow

Events that trigger recomputation:

- asset deployed, repaired, retired or restatused;
- scan or use signal;
- telemetry received;
- production run closed;
- cost model version published;
- goal updated;
- observation added;
- outcome reviewed;
- verification added;
- release approved or expired;
- consent changed;
- cultural hold applied;
- story withdrawn;
- decision recorded; and
- return completed.

### 4.2 Materialized public summaries

Compute public-safe summaries by:

- community;
- project;
- partner;
- domain;
- period; and
- claim.

Each summary includes:

- value;
- unit;
- status;
- confidence;
- source count;
- method;
- computed time;
- source freshness;
- next review;
- permission version; and
- limitations.

### 4.3 Staleness

Rules:

- expired release removes content;
- withdrawn consent removes affected content and invalidates dependent summaries;
- stale operational data shows its last date;
- unreviewed model changes do not update public claims;
- missing evidence shows unavailable;
- conflicting sources show conflict;
- broken cross-system links fail closed; and
- every cached value exposes `computed_at` and source version.

### 4.4 Monitoring

Create data-health monitors:

- claim missing source;
- claim missing community approval;
- expired review;
- public quote without current release;
- withdrawn source still surfaced;
- metric with missing denominator;
- target rendered as current;
- committed rendered as delivered;
- domain ID drift;
- asset count drift;
- stale telemetry;
- missing production measurements;
- unpaid return obligation; and
- public surface using retired claim.

### 4.5 Regression tests

For each public surface:

- snapshot approved claims;
- verify source lineage;
- verify confidence label;
- verify current/target separation;
- verify cultural and consent gates;
- verify withdrawal propagation;
- verify empty state;
- verify stale state;
- verify accessibility alternative; and
- verify restricted-data exclusion.

### Exit test

Changing or withdrawing a source updates or removes every dependent public surface within the defined service window, with an audit record.

## Phase 5: simple artifacts

**Goal:** make the model usable in meetings, on Country, in funding conversations and between communities.

Generate from the live evidence graph:

### Community Impact Card

One page:

- community-approved voice;
- local goal;
- current evidence;
- decision;
- next step;
- ownership movement;
- data date; and
- sharing conditions.

### Production Run Card

- configuration;
- units;
- time;
- material;
- paid work;
- cost;
- quality;
- support;
- lesson; and
- next change.

### Ownership Pathway Card

Rows:

- assets;
- operations;
- money;
- capability;
- demand;
- knowledge;
- data;
- narrative.

Each row shows current stage, evidence and next community decision.

### Case Study

- starting point;
- local aspiration;
- module choice;
- delivery and making;
- operational facts;
- approved voices;
- outcomes;
- ownership movement;
- what failed;
- what changed;
- next decision;
- reusable questions;
- provenance; and
- release conditions.

### Community Learning Sheet

- what we tried;
- what conditions mattered;
- what we would change;
- what another community should ask itself;
- tools available;
- what may be reused; and
- how to contact or learn from the community.

### Funder Evidence Brief

- funded purpose;
- delivery;
- current verified results;
- contribution;
- uncertainty;
- community decision;
- next funding need;
- evidence references; and
- approved stories.

### Offline community pack

- printable goals;
- evidence cards;
- story-review sheets;
- significance-selection sheet;
- decision record;
- ownership ladder;
- return ledger; and
- corrections form.

### Exit test

Every artifact is generated without retyping a number or copying a quote into a separate unmanaged document.

## Phase 6: first pilot

**Recommended candidate:** Tennant Creek, subject to community agreement.

Why:

- deepest design history;
- existing Shed proposal;
- Youth Centre relationship;
- assets and delivery history;
- substantial voice corpus;
- production and recycling pathway;
- existing governance questions that the cycle can make explicit.

### Pilot steps

1. Confirm community invitation and authorities.
2. Reconcile asset, proposal, transcript, media and consent records.
3. Agree data custody, publication and return.
4. Define two to four local outcomes.
5. Establish baseline and unacceptable outcomes.
6. Select the smallest operational module.
7. Complete full costing.
8. Record delivery or production events.
9. Capture maker, operator, household and leadership evidence.
10. Run a community outcome review.
11. Record significant change, dissent and unintended effects.
12. Decide what changes next.
13. Approve the public case-study layer.
14. Generate the learning sheet for other communities.
15. Review whether the system reduced or increased community burden.

### Pilot measures

System:

- time to create goal;
- time to capture event;
- time to review evidence;
- missing-source rate;
- consent/release completion;
- withdrawal propagation;
- community correction rate;
- unresolved return obligations; and
- artifact generation time.

Community:

- usefulness for decisions;
- control over interpretation;
- ease of correction;
- clarity of permissions;
- evidence burden;
- whether the output reflects local priorities; and
- willingness to use the system again.

### Exit test

The community can explain the result, correct it, control its release, use it for its next decision and share only the lessons it chooses.

## Phase 7: extend to other communities

Do not clone the Tennant Creek configuration.

For each new community:

1. Begin with authority and aspiration.
2. Import only approved reusable questions and tools.
3. Create local outcomes.
4. Select modules.
5. Map, do not replace, local outcomes with Goods domains.
6. Measure the configuration actually chosen.
7. Review in community.
8. Publish only approved lessons.
9. Add the case to cross-community learning.
10. Record what did not transfer from the prior model.

## Delivery sequence

### Release 1: truth and safety

Scope:

- surface registry;
- reporting-hazard fixes;
- shared vocabularies;
- claim contract;
- public claim tests.

Result:

Current surfaces stop overstating impact while the new model is built.

### Release 2: community cycle

Scope:

- governance profile;
- local outcomes;
- goals;
- observation/reflection;
- outcome review;
- decision record.

Result:

A community can run one full learning cycle privately.

### Release 3: evidence integration

Scope:

- Goods operational APIs;
- Empathy Ledger evidence and release APIs;
- stable links;
- freshness;
- withdrawal propagation;
- data-health monitoring.

Result:

The cycle has live operational and story evidence.

### Release 4: community and learning views

Scope:

- community view;
- learning/operations view;
- ownership ladder;
- goal and evidence visuals;
- use-and-return.

Result:

The community can see, interpret and act on the evidence.

### Release 5: public views and artifacts

Scope:

- public/funder view;
- cross-community learning;
- case-study generator;
- impact cards;
- production cards;
- print/offline packs.

Result:

Approved learning can travel without manual drift or loss of control.

### Release 6: pilot and revision

Scope:

- first community pilot;
- community evaluation of the system;
- independent claim review;
- fixes;
- replication readiness.

Result:

The model is demonstrated by a governed community decision cycle, not only application features.

## Parallel workstreams

### Product and community

- invitations;
- governance;
- outcome design;
- review facilitation;
- payment and return;
- pilot evaluation.

### Data and integration

- shared IDs;
- claim graph;
- APIs;
- event propagation;
- cache and freshness;
- monitoring.

### Goods operational evidence

- asset history;
- survival;
- repair;
- production runs;
- labour and wages;
- cost and quality;
- ownership milestones.

### Empathy Ledger governance

- consent;
- cultural review;
- source grounding;
- case-study decisions;
- release;
- withdrawal;
- use-and-return.

### Design and visualization

- community input;
- low-bandwidth views;
- accessible charts;
- evidence drill-down;
- print artifacts;
- cross-community learning.

### Quality and assurance

- claim regression;
- permission tests;
- tenant boundaries;
- accessibility;
- data completeness;
- independent verification.

## Test map

```text
community input
  ├─ authority required
  ├─ offline recovery
  └─ correction history

operational event
  ├─ canonical source
  ├─ recomputation
  └─ stale/error state

story evidence
  ├─ consent
  ├─ cultural review
  ├─ verbatim grounding
  └─ withdrawal

outcome claim
  ├─ method and denominator
  ├─ evidence strength
  ├─ community approval
  └─ verifier

surface
  ├─ audience permission
  ├─ current vs target
  ├─ provenance
  ├─ accessible alternative
  └─ empty and restricted state

artifact
  ├─ no retyped values
  ├─ approved version
  ├─ freshness
  └─ withdrawal propagation
```

## Failure modes

| Failure | Prevention |
| --- | --- |
| New dashboard becomes another competing model | All surfaces read the shared claim graph |
| Community burden increases | Minimum useful data, paid review, burden measure |
| Goods defines local success | Community outcomes precede domain mapping |
| Quotes become statistics | Evidence types and corpus labels remain explicit |
| Targets look current | Separate states and regression tests |
| Ownership is overstated | Evidence-backed multidimensional ladder |
| Consent is too broad | Source, item, audience, purpose, duration and revocation |
| Story is approved but return is forgotten | Release cannot complete without return owner and state |
| Cross-community page becomes ranking | No composite scores or league tables |
| Public data becomes stale | Event recomputation, dates, expiry and monitors |
| Withdrawal leaves cached copies | Dependency graph and invalidation event |
| Sensitive location appears in a map | Approved geographic resolution and restricted defaults |
| Modelled production becomes measured impact | Source type and measured/modelled separation |
| Founder story substitutes for community evidence | Role label and evidence-source rules |
| Community loses access when provider changes | Export, custody plan and documented transfer |

## Not in scope

- claiming measured health outcomes without an authorised partner method;
- a universal facility blueprint;
- a single community ownership percentage;
- community rankings;
- replacing local governance with generic CARE or OCAP badges;
- monetizing culture, dignity or sovereignty;
- publishing unrestricted raw transcripts;
- moving all Goods operational data into Empathy Ledger;
- moving storyteller consent into the Goods database; and
- redesigning unrelated commerce or fundraising features.

## Definition of done

The first version is complete when:

- every current impact surface is registered and classified;
- unsafe current claims are corrected;
- one shared claim contract works across both systems;
- community outcomes and goals can be created in local language;
- operational and story evidence can attach to a goal;
- a community can review evidence and record a decision;
- dissent and negative outcomes can be preserved;
- release and return are governed;
- public claims update when source evidence changes;
- withdrawal removes dependent public content;
- community, learning and public views read the same evidence;
- one complete community-approved case study is generated;
- a second community can learn from it without inheriting its configuration; and
- the pilot community says the system supports its decisions and control.

## Decision audit trail

| # | Decision | Rationale | Rejected |
| --- | --- | --- | --- |
| 1 | Build the shared cycle before redesigning surfaces | Prevents another generation of drifting dashboards | Independent page redesigns |
| 2 | Keep operational and story truth in their current canonical systems | Preserves clear authority and avoids duplication | One merged database |
| 3 | Make community outcomes primary and map Goods domains second | Supports local meaning and cross-community learning | Mandatory fixed outcomes |
| 4 | Use multidimensional ownership milestones | Shows real control and next decisions | Binary ownership or percentage |
| 5 | Produce three audience views over one graph | Supports different needs without conflicting claims | Separate reporting models |
| 6 | Pilot one full cycle before broad rollout | Tests governance, burden and usefulness in practice | Platform-wide launch first |
| 7 | Make withdrawal and freshness part of the data model | Keeps public evidence live and trustworthy | Manual cleanup |
| 8 | Generate simple artifacts from governed records | Stops copy drift and makes field use practical | Handwritten parallel reports |

