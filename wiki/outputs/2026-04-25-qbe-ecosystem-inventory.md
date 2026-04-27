---
title: QBE Mentor Pack, Ecosystem-Aware Revision
date: 2026-04-25
status: draft
audience: Ben, Nick, advisory group
supersedes: partial revision of 2026-04-25-qbe-mentor-prep-ceo-review.md
inputs:
  - Goods Asset Register v2 codebase (admin routes, public pages, Supabase tables)
  - /Users/benknight/Code/grantscope (Goods workspace, scripts, plans, CivicGraph)
  - /Users/benknight/Code/act-global-infrastructure (Tractorpedia, Xero, methodology, finance)
---

# Ecosystem Inventory and Revised Mentor Pack

## The big shift

The first CEO review (`2026-04-25-qbe-mentor-prep-ceo-review.md`) read the wiki and concluded "We are not under-prepared, we are over-distributed." After scanning the v2 codebase, Grantscope, and the ACT global infrastructure repo, the more accurate read is:

**We are not under-prepared. We are under-recognised.**

The mentor pack should not be a static PDF. The pack should be a guided 20-minute walkthrough of three live systems plus a 4-page leave-behind. Most cohort members in QBE Catalysing Impact will arrive with a deck. We arrive with infrastructure. That is the differentiator.

Specifically, three things change in the pack design from yesterday's plan:

1. **The deal-room and admin section already exists at production grade.** v2 has 40+ admin routes including `/admin/qbe-program`, `/admin/qbe-actions`, `/admin/deal-room`, `/admin/loi-tracker`, `/admin/finance-model`, `/admin/foundation-matcher`, `/admin/iba-loan`, `/admin/procurement`, `/admin/supply-nation`, `/admin/austender`, `/admin/impact-dashboard`. Most are LIVE today. The mentor sees real names, real amounts, real next steps.

2. **The intelligence layer is non-trivial and not in the wiki.** Grantscope has 1,546 Goods-relevant communities mapped, 4,952 procurement entities with 1,020 high-fit buyers, four agent scripts producing durable database outputs (lifecycle sync, procurement matching, supply-chain analysis, signoff verification), and a 90-day commercial revenue plan. No other cohort member has a CivicGraph behind them.

3. **Several first-pass gaps are partially mitigated by ACT-level assets.** ACT has audit-ready Xero discipline, R&D tax claim infrastructure (estimated $182K refund FY26), a 5-year cashflow model across three revenue layers, OCAP-grade governance and consent frameworks, and a 951-article Tractorpedia. Goods inherits institutional rigour the wiki was not surfacing.

The remaining gaps are sharper but smaller than first thought. See §5.

## 1. Goods v2 codebase: what is actually built

Readiness rating: **4.2 / 5**. Mentor can be given login access today. Detailed asset list:

### LIVE, mentor-ready today

| Route | What it shows |
|---|---|
| `/admin/qbe-program` | 8 named investors, 13 capital instruments, QBE timeline, match-funding tracker, session insights from QBE speakers (Alex/Ventures, Beck Parkinson, Hannah/SEFA, Jess/SIH). |
| `/admin/qbe-actions` | Week-by-week checklist Wks 1 to 12, critical path through 31 Aug 2026 milestone. |
| `/admin/deal-room` | $5M compound opportunity (REAL Fund $2.4M + Groote $1.7M + Bridge $632K = $4.7M). Two deal trees with checklist steps and named contacts. |
| `/admin/loi-tracker` | Centre Corp 107 beds at $59,920, Miwatj 8 clinics, NPY 200-350 beds, WHSAC 500 beds. LOI date, amount, confidence per row. |
| `/admin/foundation-matcher` | 7-10 foundations with fit score, giving focus, typical grant size, RFP deadline, match points, next step action. |
| `/admin/iba-loan` | IBA Business Loan tracker (up to $5M, 30% grant + 70% debt), application status, Aboriginal ownership pathway. |
| `/admin/procurement` | 8-channel framework, $850K to $4.3M addressable, IPP 1 July threshold, $239K conversion to date. |
| `/admin/supply-nation` | 7-step certification workflow, urgent 1 July 2026 51% threshold flag, Oonchiumpa anchor. |
| `/admin/austender` | 5-step registration workflow, panel codes mapped, status tracking. |
| `/admin/capability-statement` | Print-ready capability statement, co-designed products, partnerships, credentials, metrics. |
| `/admin/groote-proposal` | Full $1.7M Groote proposal (800 units) with logistics, community case, delivery timeline. Print-to-PDF. |
| `/admin/groote-outreach` | Outreach pipeline, copy-to-clipboard proposal templates, Simone Grimmond contact. |
| `/admin/impact-dashboard` | 389 products deployed, 8 communities, 33 storytellers, 95%+ survival rate, 9,225kg HDPE diverted, 17.6x Idiot Index, RHD health cascade. |
| `/admin/fleet` | Washing machine telemetry (GPS, operational status), interactive map. |
| `/admin/xero-reconciliation` | Xero P&L pulled, matched to Goods operational data, variance analysis. |
| `/admin/deployment-map` | Geographic deployment by state (QLD, NT, WA). |
| `/admin/communities` | PICC, Oonchiumpa, Wilya Janta, NPY, Miwatj, Centre Corp. Contact info, deployment status, co-design history. |
| `/admin/stories` | 33 storyteller profiles, story archive, community voice quotes. |
| `/pitch` (public) | Full sales pitch, hook to investment case, 7 sections. |
| `/insiders` (public, password-gated) | Full wiki, 9 topic folders, 80+ articles. |
| `/sponsor`, `/partner`, `/funders/[slug]` | Sponsorship program, partner application, funder-specific landing pages. |

### Built but needs 2 to 3 days to ship to mentor

| Route | Gap |
|---|---|
| `/admin/finance-model` | 4 scenarios coded, but seeded with hard-coded test data not real Centre Corp / Miwatj / NPY LOIs. Needs reseeding plus PDF export. |
| `/admin/grants` | Composer is skeletal, Claude API not yet wired, no funder-specific templates. |
| `/admin/campaign-engine` | Campaign dashboard structure exists, GHL sync partial, LinkedIn API not live. |

### Supabase data layer

Production tables exist for `crm_deals`, `crm_contacts`, `fleet_telemetry`, `bed_journeys`, `stories`, `community_partners`, `products`, `orders`, `production_beds_assembled`, `production_shifts`, `asset_status`. Every admin dashboard above pulls live data, not mock data, except `/admin/finance-model`.

## 2. Grantscope and CivicGraph: the intelligence layer

This is the asset most under-recognised in the original wiki. Grantscope is a civic intelligence platform with 100K organisations and 199K relationships in a Postgres entity graph. The Goods workspace inside it provides:

- **1,546 Goods communities mapped**, 995 in NT and QLD priority zones.
- **4,952 procurement entities mapped** including buyer agencies, panels, and intermediaries. 1,020 are high-fit for Goods.
- **22 active pipeline items worth $3.655M** weighted, 256 open procurement signals, 6 foundations tracked with 3 active conversations.
- **Four production scripts** running durably:
  - `goods-lifecycle-sync.mjs`: Asset deployment data sync, age computation, replacement signals at 80% lifespan (120 months for beds, 60 for washers).
  - `goods-procurement-matcher.mjs`: Matches procurement signals to local buyer entities and funding sources using Goods grant keywords (Indigenous, remote, housing, NDIS, social enterprise). Auto-assigns best buyer by govt contract value, generates unmet demand signals.
  - `goods-supply-chain-analyst.mjs`: Calculates delivered cost per product per community, computes "idiot index" (community supply chain health), surfaces optimisations.
  - `goods-signoff-check.sh`: Cross-repo QA. Typechecks Grantscope, builds Goods v2, runs smoke tests on `/org/act/goods` and `/admin/qbe-program`.

- **`/Users/benknight/Code/grantscope/thoughts/plans/goods-civicgraph-90-day-revenue-plan.md`** is a 150-line commercial plan: A$250K bookings target, productised offers (Buyer Pipeline Subscription A$1.5K to A$5K/mo, Capital Stack Subscription A$1.5K to A$4K/mo, Managed Outreach Retainer A$6K to A$20K/mo, Intelligence Sprint A$15K to A$60K fixed, Decision Pack A$2K to A$10K), four ICPs (community supply operators, regional buyers, place-based funders, government procurement teams), funnel math (120 accounts to 5-8 closes at $35K average).
- **`/Users/benknight/Code/grantscope/thoughts/shared/plans/goods-integration-scoping.md`** is a 3-phase integration roadmap: supplier verification cards (Phase 1), IPP buyer scorecards (Phase 2), Indigenous operator discovery dashboard (Phase 3).

**Why this matters in mentor session 1:** No other social enterprise in the QBE cohort will walk in with a buyer graph this size. A mentor sees that channel intelligence is not a future capability we are asking for help with. It is operational. The mentor's job becomes "help us turn this graph into signed contracts faster," which is a much higher-value conversation than "help us figure out who to call."

## 3. ACT global infrastructure: the parent organisation

ACT (A Curious Tractor) is the parent dual-entity (A Kind Tractor LTD charity ABN 73 669 029 341, A Curious Tractor Pty Ltd ABN 21 591 780 066). Goods sits inside ACT Ventures. Inheritances:

### Methodology IP

ACT has five named methodologies in the Tractorpedia (951 articles total, 12 to 15 directly Goods-relevant):

- **LCAA** (Listen, Curiosity, Action, Art) at `wiki/concepts/lcaa-method.md`. The design discipline behind every Goods deployment.
- **ALMA** (Authentic Learning for Meaningful Accountability) at `wiki/concepts/alma.md`. Six signal families, 1-5 rated. The impact framework Goods runs on.
- **Beautiful Obsolescence** at `wiki/concepts/beautiful-obsolescence.md`. Design discipline of building toward ACT's irrelevance. Goods' explicit handover thesis is a direct application.
- **Third Reality** at `wiki/concepts/third-reality.md`. ACT's proprietary impact-measurement integration of CivicGraph, JusticeHub, and Empathy Ledger.
- **OCAP and Indigenous Data Sovereignty** at `wiki/concepts/ocap-principles.md`. Ownership, Control, Access, Possession baked into the v2 asset register code.

### Governance and compliance

- Decision-making framework with financial thresholds ($500 day-to-day, $5K to $20K both directors, >$20K formal resolution). `docs/governance/decision-making.md`.
- Compliance calendar (BAS, ACNC, ASIC, insurance, board cadence). `docs/governance/compliance-calendar.md`.
- Governance and Consent policy with 5-tier consent levels and Elder review workflow. `wiki/raw/2026-04-07-cc-act-governance.md`.
- Project code system, 78+ codes including `ACT-GD` for Goods.

### Financial discipline

- FY26 9-month actuals: $1.886M ACT-level invoiced revenue, $463.7K burn (~$51.5K/month), top 3 funders (Centrecorp, PICC, Snow) = 67% of revenue.
- Goods Xero data lives under project code `ACT-GD`, recording $537,595 cumulative revenue and $445,685 in philanthropy received.
- R&D Tax Claim FY26: estimated $182K refundable (43.5% rate), 4 to 10 week ATO turnaround. Goods' IoT telemetry on the washing machine fleet, remote deployment iteration, and community handover protocols are eligible Supporting R&D under Division 355.
- Five-Year Cashflow Model across three revenue layers (Voice / Empathy Ledger bespoke, Flow / CivicGraph + Minderoo + JusticeHub + Goods grants, Ground / ACT Farm + workshops), totalling $2.6M to $5.5M revenue Year 5.

### Founder pay (red flag worth naming)

ACT records show **Ben Knight has invoiced $0** through FY26 to date. Nick Marchesi has invoiced $238.6K, ~40% R&D eligible. Ben's zero-pay status is a sustainability risk a mentor will surface within the first 30 minutes of conversation if it stays uncorrected. It is also leaving R&D refund cash on the table (~$41K incremental on a $100K founder invoice).

### Sibling ventures and what Goods learns

- **PICC (Palm Island Community Company)**: 20 years of community control, 141 Goods beds already deployed. Closest structural analogue to the long-term Goods endgame.
- **Empathy Ledger**: 33 storytellers across Goods, $50K to $70K bespoke services revenue. Storytelling stays inside ACT, not extracted.
- **JusticeHub**: 1,775+ community programs, Three Circles Minderoo pitch ($3.43M / 3 years). Proof ACT can build platforms at scale.
- **The Harvest**: 150-acre On-Country regenerative property (Witta, Jinibara Country). Parallel On-Country operating model.
- **ACT Farm and Black Cockatoo Valley**: Land tenure as capital strategy, regenerative + creative residencies.
- **SMART Recovery**: Healthcare integration pathway, useful pattern for Pakkimjalki Kari clinical channel.

## 4. Revised mentor pack design

The pack is now a **two-part deliverable**:

### Part A: Live walkthrough (the main event, 20 minutes inside session 1)

Mentor login (or screenshare if mentor prefers) to v2 admin. Three stops, in order:

1. **`/admin/qbe-program`** (5 min). The 8 named investors, 13 capital instruments, the $400K match-funding tracker, the QBE timeline. This is the strategy. We talk about which deal we close first.
2. **`/admin/deal-room`** + **`/admin/loi-tracker`** (5 min). The active $5M compound opportunity. Real names, real amounts, real next steps. We talk about which LOI is closest to signed and what de-risks it.
3. **`/admin/impact-dashboard`** + **`/insiders`** (5 min). 389 products, 8 communities, 33 storytellers, RHD cascade. We talk about the evidence base, then walk into one wiki article (likely `enterprise/04-financial-management.md` or `enterprise/07-governance-data-reporting.md`) where we ask for the mentor's specific help.
4. **5 minutes for the three asks** (the open questions from §6 of the prior CEO review).

The mentor leaves with credentials to revisit any of those dashboards.

### Part B: 4-page leave-behind PDF

Compressed from the 8-12 page first design. The walkthrough does the heavy lifting. The PDF is a takeaway summary, not a primary read.

| Page | Contents |
|---|---|
| 1 | The org. The number. Three asks. Login URL and credentials block. |
| 2 | 8-channel GTM diagram (compressed visual, lifted from `/admin/procurement`). |
| 3 | Capital stack visual (compressed, lifted from `/admin/qbe-program`). |
| 4 | Honest 10-domain self-diagnostic table, plus the calendar of dates through Nov 2026. |

The Catalysing Impact application draft, Snow R4 proposal, Empathy Ledger story samples, ACT audited financials, and Goods Xero P&L all live behind the deal-room login as appendices. The PDF references their URLs but does not embed them.

### Part C: ACT-level credibility insert (1 page, optional)

A separate single page citing the parent infrastructure: dual entity, OCAP framework, R&D claim discipline, 5-year ACT cashflow model, sibling ventures (PICC 20-year track record, JusticeHub at-scale platform, Empathy Ledger consent infrastructure). This is included if the mentor profile suggests scepticism about whether a small social enterprise can hold institutional discipline. Skip if mentor is a community-sector specialist who does not need parent-org credibility signalling.

## 5. Revised gap list

| Gap | First-pass severity | Revised severity | Why revised |
|---|---|---|---|
| 3-statement integrated financial model | CRITICAL, 60 days | HIGH, 30 days | ACT 5-year cashflow exists. Goods needs a sub-model derived from it, not a greenfield build. The volunteer ask is smaller (~2 weeks engagement, not 4-6). |
| Independent directors not seated | CRITICAL, 60 days | CRITICAL, 60 days | Unchanged. SEFA covenants will require this. |
| 51% Indigenous ownership structure | CRITICAL, 1 July IPP cutoff | CRITICAL, 1 July IPP cutoff | Unchanged. |
| Founder pay (Ben at $0) | not surfaced | CRITICAL, 30 days | New. R&D refund cash is being left on the table and the sustainability optic is bad in front of an investor. Invoice immediately. |
| `/admin/finance-model` seeded with test data | not surfaced | HIGH, 7 days | New. The dashboard exists, mentor will click into it, hard-coded scenarios undermine the rest of the credibility. Reseed with real LOI amounts before session 1. |
| Pakkimjalki Kari has no GTM champion | HIGH, 90 days | HIGH, 90 days | Unchanged. Decision still needed. |
| Production facility location undecided | HIGH, 60 days | HIGH, 60 days | Unchanged. |
| No signed customer contracts at scale | CRITICAL, 90 days | HIGH, 60 days | Centre Corp 107 beds approval Jan 2026 is closer to a signed institutional purchase order than the wiki implied. Loi-tracker confirms. Push to convert one of Centre Corp / Miwatj / NPY to MOU inside 60 days. |
| Pack assembly time | NEW | LOW | Most of the pack is the live walkthrough. Pack assembly is a few days, not weeks. |

## 6. The mentor differentiator in one sentence

Most QBE Catalysing Impact cohort members will arrive with a deck. **We arrive with infrastructure**: a live deal room, a 4,952-buyer civic graph, a 33-storyteller consent-first impact platform, and a 951-article methodology library inside a parent organisation with audit-ready financial discipline.

The mentor's job is therefore not to help us build the basics. The mentor's job is to be a force-multiplier on three decisions:

1. Which match-funding deal closes first (sequencing).
2. How we land 51% Indigenous structure before 1 July (lawyer + governance).
3. Whether to commit, defer, or kill the washing machine GTM (product portfolio).

Frame the asks that way. The mentor's calendar is most valuable on judgement calls, not capability gaps.

## 7. 7-day pack assembly sprint

In order. Ben, unless otherwise noted.

| Day | Action |
|---|---|
| Day 1 (today, 25 April) | Submit Induction Evaluation Survey and Mentoring Preferences Survey if either still outstanding. Email Sarah Gregory (SIH) to schedule 3-hour diagnostic. Write to Keith Rovers (Mint Ellison) escalating 51% Indigenous structure as top pro-bono priority. |
| Day 2 | Reseed `/admin/finance-model` with real LOI amounts from `/admin/loi-tracker` and Xero `ACT-GD` actuals. Validate scenario math against ACT 5-year cashflow model. |
| Day 3 | Issue founder invoice from Ben to ACT for FY26 to date. This is also the R&D refund unlock. Send to accountant same day. |
| Day 4 | Build Part B (4-page PDF leave-behind). Pull diagrams directly from `/admin/procurement` and `/admin/qbe-program`. |
| Day 5 | Build Part C (1-page ACT-level credibility insert). Pull from ACT `wiki/concepts/lcaa-method.md`, `wiki/concepts/beautiful-obsolescence.md`, ACT FY26 actuals. |
| Day 6 | Mentor login provisioning: confirm `/admin` access works behind insiders password gate. Test full walkthrough flow on a non-Ben account. Fix any broken links. Confirm deal-room appendix folder is populated with: Catalysing Impact application draft, Snow R4 proposal, ACT FY24 audited statements, Goods Xero P&L, 5 Empathy Ledger story samples, provisional risk register. |
| Day 7 | Send pack (PDF + login link + 20-min agenda) to mentor 7 days before session 1. Cover note opens with: "20-minute pre-read on page 1, three asks at the bottom. Everything else is live and waits for your questions." |

## 8. Ecosystem-level moves worth considering separately

These are not blockers for the QBE mentor pack but are worth flagging while the ecosystem map is fresh:

1. **The Grantscope 90-day revenue plan ($250K bookings) is a legitimate parallel revenue stream for ACT/Goods** that the QBE financial model could include. If even one Managed Outreach Retainer ($6K to $20K/month) lands during the QBE program, it materially improves the cashflow narrative.

2. **JusticeHub's Three Circles Minderoo pitch ($3.43M / 3 years)** is a precedent for how ACT pitches multi-venture grants to one philanthropic anchor. The Mindaroo conversation Goods is having (Lucy Stronach, 20 communications) could be re-architected to include JusticeHub or Empathy Ledger as a multi-venture asset stack.

3. **Empathy Ledger's bespoke services revenue ($50K to $70K per customer per year)** is a cleaner version of the "impact reporting subscription" some funders ask for. Worth pricing into the Goods deal-room as a separate SKU rather than bundling impact reporting into bed/washer cost.

4. **ACT-GD R&D claim is ~$65.5K direct + ~$87.4K apportioned eligible spend FY26**. That is real cash refund. Treat it as part of the capital stack ledger in `/admin/qbe-program`, not as an accounting backwater.

5. **The 951-article Tractorpedia is over-built for a pre-Stage 2 social enterprise**. Some of that depth should be productised (Empathy Ledger publishing, methodology licensing, governance-as-a-service to peer enterprises). Not for the mentor session, but for the 12-month roadmap.

## 9. CEO read

The first review said the founder is a systems designer and storyteller who needs to plug financial and governance gaps. That stands. What the ecosystem scan adds is that **most of those gaps are already partially plugged at the parent (ACT) level**, but the wiki and pack design did not surface that. The work for the next 7 days is largely curation, not creation.

The single biggest behavioural risk for the next 7 days is that the founder, faced with abundance, tries to polish everything. Resist that. Pack assembly is curation: pick three live dashboards, one PDF, one ACT credibility page. Send. The mentor calibrates from what we choose to show, not from how shiny it is.

If the mentor walks out of session 1 with the impression "this is not a startup pitching me a deck, this is an operator showing me a working system and asking for sequencing judgement," the pack has done its job.

---

## 10. Revisions applied (after adversarial meta-review, 2026-04-25)

The two artefacts above were stress-tested with a third pass focused on premise challenge, failure modes, and blind spots. Three expansions were accepted under HOLD SCOPE + SELECTIVE EXPANSION mode. They override conflicting earlier text.

### 10.1 Pack co-ownership

Pack assembly is co-owned by Ben and **Sally Grimsley-Ballard** (Snow Foundation, advisory group member). Sally's role: editorial review, funder-lens calibration, and fallback assembler if Ben slips on any sprint day. Estimate Sally commits 6 to 8 hours over 7 days. Ben asks Sally on Day 1.

This removes the single-point-of-failure that the pack itself was meant to flag. The previous 7-day sprint had Ben as sole owner on every line, which reproduced the exact key-person risk the pack identifies.

### 10.2 Walkthrough leads with gap, not asset

The Part A walkthrough script is reframed. Each of the three stops opens by naming the bottleneck the screen reveals, not the capability:

- **`/admin/qbe-program`**: "Here is our match-funding plan. The bottleneck is that we have $0 in signed LOIs against a $400K target."
- **`/admin/deal-room` and `/admin/loi-tracker`**: "Here is the deal room. Centre Corp approved 107 beds in January. The bottleneck is converting that approval into a binding MOU. Do you know anyone at Centre Corp who can move this from approval to signed?"
- **`/admin/impact-dashboard` and one wiki article**: "Here is the evidence. The gap is independent longitudinal evaluation. We are unsure how to fund or scope it."

This single reframing shifts the pack tone from pitch to ask. The walkthrough is now a structured asking session, not a demo.

### 10.3 Mentor-commitment log

Add a mentor session log to `/admin/qbe-program` before session 1. ~30 minutes of build. Captures, per session: date, mentor name, commitments made by mentor (introductions, reviews, follow-ups), commitments made by Goods, due dates. This scaffolds sessions 2 to 6 and prevents the mentor relationship from drifting to ad-hoc by session 3.

### 10.4 Failure modes addressed in the 7-day sprint

The following items are folded into the sprint as additions, not new tasks:

- **Day 1**: Mentoring Preferences Survey explicitly names 2-3 desired expertise areas (impact investing, Indigenous corporate structures, blended finance) so PIN match has the right profile vector. Plan B for mentor mismatch is acknowledged: if the matched mentor is misaligned, request rematch through Sarah Gregory inside session 1.
- **Day 1**: $400K is documented as upper-bound. $100K to $200K is the realistic operating target. Both numbers appear in the pack and are owned out loud, not papered over.
- **Day 2 (reseeding finance-model)**: scenarios cover the realistic operating target ($100-200K matched) as base case, $400K as stretch.
- **Day 5 (ACT credibility insert)**: R&D refund is marked as **contingent** in the capital stack ledger, not as confirmed cash. ATO claims can fail. The $182K is FY26 estimate.
- **Day 5**: ACT credibility insert includes a one-page entity diagram showing money flows between A Kind Tractor LTD, A Curious Tractor Pty Ltd, and Goods (project code ACT-GD), so a mentor sees the ring-fence at a glance instead of asking "if Goods loses money, who absorbs?"
- **Day 5**: Crisp paragraph distinguishing what is licensed in from Grantscope/CivicGraph vs what is core Goods infrastructure. Avoids the "wait, are you pitching me Goods or Grantscope?" question.
- **Day 6 (mentor login provisioning)**: includes a fresh-account QA pass on the insiders password gate. Tests the full walkthrough flow with a non-Ben Google account before sending login credentials to mentor.
- **Day 6**: Fred Campbell + community consent check on any Empathy Ledger storyteller content that leaves the deal-room into the mentor pack. ALMA framework requires explicit community authority on inclusion.
- **Pack page 12 (calendar)**: extends to a proposed agenda for sessions 2 to 6 (e.g., session 2 financial model deep-dive, session 3 governance and independent director recruitment, session 4 procurement channel sequencing, session 5 community ownership transition, session 6 program close-out and Stage 2 dry-run). Mentor approves or amends in session 1.

### 10.5 Walkthrough split between Ben and Nick

The 20-minute walkthrough is split. Ben covers `/admin/qbe-program` and `/admin/deal-room` (5+5 min, strategy and capital). **Nick covers `/admin/communities` and `/admin/fleet`** (5 min, community and ops). Final 5 min are joint Q&A on the three asks. Lands harder for any mentor whose instincts are operational rather than financial.

### 10.6 Two of the Top 5 questions reframed as introduction asks

The most valuable thing a PIN mentor can give is a warm introduction, not abstract advice. Two of the original Top 5 questions are reframed:

- **Original Q1 (51% Indigenous structure)** stays as advice-seeking, but adds a named introduction ask: "Who in your network has worked on co-operative or ORIC-registered Indigenous-owned corporate structures? We want to be in front of them inside 14 days."
- **Original Q4 (Pakkimjalki Kari)** is fully reframed to "Help us find a GTM champion" with named target profile (whitegoods commercial procurement or remote retail). Already updated in `2026-04-25-qbe-mentor-prep-ceo-review.md` §6.

### 10.7 What did not change

The capital stack design, the 8-channel GTM thesis, the 10-domain self-diagnostic, the volunteer engagement strategy, and the founder skills map all stand. The meta-review found no fundamental flaws in the substance, only in the framing and assembly process. The plan is sound. The execution discipline tightened.
