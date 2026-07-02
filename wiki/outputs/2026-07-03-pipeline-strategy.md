# One pipeline picture: the Goods capital strategy, 2026-07-03

> Built from the live GHL pipeline counts (Ben's pull, 2026-07-03, LeadConnector API), the live Notion Funder Pipeline (19 rows, read 2026-07-03) and QBE Opportunity Register (13 rows, read 2026-07-03), and the record-level GHL board as at 2026-07-02 (the machine's last working pull; see the token note below). Confidence levels marked. Nothing in here is a send and nothing has been written to GHL or Notion; staged writes sit in section 7.

**The clock: AU$0 signed match-eligible of AU$400,000. 59 days (8.4 weeks) to 31 Aug 2026.**

---

## 1. The system, codified

Thirteen pipelines exist in GHL. Only three are Goods planning surfaces, and each has exactly one job:

| Surface | Job | Count (live 2026-07-03) |
|---|---|---|
| GHL Goods Supporter Journey | System of record for every funder, philanthropist, grant, lender and supporter. Stage moves happen here first. | 63 open, $4,938,311 open value |
| GHL Goods Buyer Pipeline | Buyers, bed orders, procurement. Revenue, never match. | 17 open, $1,881,721 |
| GHL Goods Demand Register | Demand signals before they become buyers or funders. | 74 open, $9,015,250 |
| Notion Funder Pipeline | The working shortlist: who gets active follow-up this fortnight. | 19 rows |
| Notion QBE Opportunity Register | The priority shortlist: near-term matched-capital asks only. The Stage 2 exhibit. | 13 rows |

Everything else (Grants board, A Curious Tractor, CONTAINED, Harvest, The Shop, Universal Inquiry, Supporters & Donors, Empathy Ledger) is legacy, empty, or another ACT project. The Grants pipeline keeps its one open $500K row as a watch item and is never the Goods funding plan.

**Operating rule (one writer per layer, from the machine blueprint):** GHL owns stage, Notion is the review surface, Xero is the money truth, the repo is the artifact source. The intended containment is QBE Register is a subset of Funder Pipeline is a subset of Supporter Journey. Today that containment is broken (section 4).

## 2. What broke this morning: the machine is blind

The rotated GHL private integration token (post security incident) authorises the `locations` scope only. `contacts` and `opportunities` return 401. Verified directly against the API 2026-07-03. Every machine script (`ghl-people-pull`, `funder-artifact-match`, `monday-onepager`, `ghl-people-move`) is dead until the scopes are restored.

**FIXED same day:** Ben installed a fresh private integration token (2026-07-03, 06:36); `opportunities` and `contacts` verified 200 and the full live pull ran clean. The machine is live again. Section 3.5 records what the live pull corrected.

## 3. The reconciliation: every open Supporter Journey record, bucketed

Five buckets. QBE priority (on the register, matched-capital ask), Workbench (active follow-up in the Funder Pipeline), Stewarding only (money already in, reporting relationship), Buyer or demand (wrong pipeline, move it), Parked (monitor tag, nobody re-researches it).

### Bucket 1: QBE priority (13 register rows, target asks $1,370,000)

Target asks, never committed money. Signed today: $0.

| Funder | Ask | Stage (GHL) | 31 Aug call | The one next move |
|---|---|---|---|---|
| SEFA (anchor) | $250K register, $300K pipeline DB: **conflict, Ben calls the figure** | Cultivating | STRETCH, tightening daily | SEND the intro plus loan brief, lodge the Access form, phone (02) 8199 3360. Credit runs 2 to 4 months; every day of delay eats the window. |
| White Box SELF | $250,000 | Cultivating | STRETCH | Lodge the SELF EOI; ask the eligibility question in the EOI instead of self-screening out. |
| Minderoo | $200,000 | Ask made in register, Cultivating in pipeline DB: **conflict** | STRETCH | Verify a real ask exists. If not, correct to Cultivating (the 28 Jun finding) and cultivate honestly. |
| SEDI Capability | $120,000 | Qualified | STRETCH | Prepare and lodge. No ownership gate, verified open. |
| Snow (first-mover) | $100,000 | Ask made | SIGNABLE | Confirm the Round 4 email went out, book the call, push toward a repayable LOI so it counts as match. |
| LendForGood | $100,000 | Cultivating | SIGNABLE if SIH originates | One yes/no question to Jay: will SIH originate a Goods campaign. Draft ready. |
| First Nations Clean Energy | $80,000 | Identified | POST-QBE (closes 3 Sep) | Qualify for the plant's energy scope, move to Qualified. |
| Centrecorp | $75,000 | Ask made | SIGNABLE | Time to the July board; keep the grant (match) separate from the bed order (revenue). |
| Metro Finance MetroEco | $60,000 | Qualified | SIGNABLE (weeks, equipment-backed) | Which ABN borrows (accountant), then the broker enquiry. Draft ready. |
| VFFF | $50,000 | Cultivating | SIGNABLE (small) | Short renewal note tied to the raise. Never double-count with FRRR Backing the Future. |
| FRRR SRC | $50,000 | Qualified | STRETCH | Lodge the remote-bedding, plastic-circularity application. |
| Sisters of Charity | $20,000 | Identified | Needs DGR Item 1 partner | Qualify the partner-led route or park. |
| ANZ Seeds of Renewal | $15,000 | Qualified | Small | Lodge before 30 Jul. |

Lead stack: SEFA $250K plus Snow $100K plus Centrecorp $75K equals $425K, clears the gate on paper with zero redundancy. Bench if a leg fails: White Box, LendForGood, Metro, Minderoo-if-real.

**Conditional promotion: Tim Fairfax Family Foundation ($150K, Ask made).** The scout pass says invitation-only, no open round, DGR Item 1 required, never in the match stack. But the pipeline DB row is live as of today with a dated action: confirm with Katie Norman by 10 Jul the $150K/year structure, decision path, written LOI timing and QBE match treatment. Promote to the register only if Katie confirms a written commitment path. Until then it stays Workbench. (Both signals preserved; promotion on evidence, not hope.)

### Bucket 2: Workbench (active follow-up, Funder Pipeline DB)

Already on the pipeline DB and correctly placed: Tim Fairfax (above), Bryan Foundation, Ian Potter, Brian M Davis, Rotary Eclub Outback ($82,500 context), Rotary Global Grant, First Nations Finance, CEFC via NAB, Invest NT, CommBank Green Equipment, Tripple (post-QBE, never match math), Eloise Hall, Philanthropy Australia (network, warm-intro engine, never a direct ask), REAL Innovation Fund ($2M, separate Oonchiumpa-led vehicle, excluded from match), QBE Foundation itself (Stage 2 prep row).

**The Bryan Foundation, answered directly:** it is in GHL (Ask made, opp `5nhYHB7YkyqTySyNTdqq`) and on the Funder Pipeline. It is not on the QBE Register, and it should not be promoted today: the ask is 30 plus days silent with no amount on the row. Send the drafted nudge (2026-06-28 send-drafts, section 4); promote only if the reply opens a live conversation with an amount, otherwise mark lost after the second silent follow-up. Same rule for Ian Potter and Brian M Davis.

**Qualify into the workbench from GHL (from the 17 names surfaced 2026-07-03, my provisional calls, Inferred until the next live pull):**

| Name | Call | Why |
|---|---|---|
| NAACT (Northern Australian Aboriginal Charitable Trust) | Work | One of the 28 Jun work-five. NT footprint fit. Confirmed Identified in GHL. |
| Yeperenye Charitable Trust | Work | Alice Springs base, Central Australia orbit alongside Centrecorp and Oonchiumpa. Confirmed Identified in GHL. |
| StreetSmart Australia | Work (small) | Homelessness-adjacent bedding fit, small grants. Confirmed Identified in GHL. |
| INPEX Community Investment | Work (cost-offset) | Rolling, NT, priorities map near one to one. Partner tag, not match. Confirmed Identified in GHL. |
| Australian Communities Foundation | Work (light) | Giving-circle and DAF pathway to individual philanthropists. Confirmed Identified in GHL. |
| The John Villiers Trust | CORRECTED: renewal lane | Live pull shows Stewarding: a past funder, not a cold prospect. Renewal touch, Ben decides. |
| AMP Foundation | CORRECTED: renewal lane | Live pull shows Stewarding, $21,900 received. Warm past funder, renewal touch. |
| The Funding Network | CORRECTED: same entity as TFN | Live pull shows Stewarding, $130,000. This IS the TFN of the mis-booking question. One entity, one row. |
| Social Impact Hub Foundation | Reclassify | This is Jay's shop, the QBE intermediary. Partner and steward, never an ask row. |
| Red Dust | CORRECTED: Stewarding | Live pull shows $15,950 received. A money relationship, not a demand signal. Stays in Supporter Journey. |
| QIC | CORRECTED: Stewarding | Live pull shows $12,000 received. Same. |
| BHP Foundation, Fortescue Foundation, Rio Tinto Foundation, Nova Peris Foundation, Brisbane Powerhouse Foundation, Westpac Scholars Trust | Park | Long-cycle, no open door, or remit mismatch (Westpac Scholars funds individuals). Monitor tag. |

Plus the work-five leftovers from the 28 Jun triage: Sally Knox, John Chambers, IMB Bank Community Foundation, Developing East Arnhem (all 30 plus days cold, nudge drafts exist).

### Bucket 3: Stewarding only (money in, reporting relationship)

- Snow historic, $493,130, Renewing (corrected to Xero 2026-07-02). The relationship that anchors the first-mover ask, but this row is history, not pipeline.
- Centrecorp, $123,332 paid, Stewarding (restored 2026-07-02). Acquittal current; feeds the next-round brief.
- TFN, $130,000, Stewarding. Acquittal touch only; carries the unresolved $144,558 mis-booking question (parked with the $907,569 reconciliation).
- Social Impact Hub, partner and intermediary. Steward, never an ask.

### Bucket 4: Buyer or demand (wrong pipeline, move out of Supporter Journey)

Red Dust and QIC pending confirmation (above). Anything else the live pull shows as a procurement or community-demand signal moves to the Buyer Pipeline or Demand Register, keeping Supporter Journey pure capital. The Buyer Pipeline ($1.88M open) and Demand Register ($9.0M signals) are the demand-side proof that feeds artifacts; they are never match capital and never appear in the raise arithmetic.

### Bucket 5: Parked (monitor tag, documented so nobody re-researches)

The Tier C refutations of 2026-07-02 stand: Bank Australia, Aboriginal Investment NT (natural first funder for the future 51% entity, Round 3 opens Feb 2027), Impact Seed WA, English Family Foundation (Butterfly-era), Macquarie Group Foundation, FGII (nominate by 17 Aug for Perth November as post-QBE pipeline), First Nations Innovation Acceleration QLD, Impact Investment Partners, Industry Growth Program, Giant Leap, Boundless Earth. Plus the six parked names from the 17 (table above) and the remaining cold Identified rows.

### 3.5 Live-pull corrections (2026-07-03, Verified, full 63-row enumeration)

The token fix landed the same morning and the live pull enumerated all 63 open rows. Corrections to the provisional calls above, plus the previously unnamed rows:

- **TFN is The Funding Network.** One entity, $130,000 at Stewarding. The provisional table had it twice (a stewarding row and a qualify-in). One row, stewarding, and it carries the $144,558 mis-booking question.
- **Five "qualify-ins" were actually past funders at Stewarding:** AMP Foundation ($21,900), The John Villiers Trust, Red Dust ($15,950), QIC ($12,000), plus an FRRR historic row ($50,000, separate from the new FRRR SRC application at Qualified). None are cold prospects; none move to Buyer or Demand. They form a **renewal lane**: warm past funders who already said yes once. Ben decides which get a renewal touch tied to the raise.
- **Confirmed at Identified** (qualify-in stands): NAACT, Yeperenye, StreetSmart, INPEX, Australian Communities Foundation, plus Sea Swift (cost-offset, round opened 1 Jul).
- **Newly enumerated Identified, default Parked pending a look:** Mjd Foundation, Community Resources Limited, Uniting Church Frontier Services, Country Connect Foundation, Regional Arts Australia.
- **Garma Festival (Qualified, "Beds Showcase")** is a showcase and demand surface, not capital. Buyer or demand bucket.
- **Delivering and money-in rows confirmed:** Homeland School Company $44,000 (Delivering), Mala'la Health Service $5,434, Julalikari Council $19,800, Our Community Shed $20,265 (Stewarding or Renewing). These read like funded deployments or orders; confirm buyer versus funder nature at the next Tuesday sitting, then move any pure orders to the Buyer Pipeline.
- Tim Fairfax was touched today (Ben's session) and sits at Ask made with the 10 Jul Katie Norman action. Minderoo remains Ask made in GHL; decision 2 still open.

Coverage after corrections: 63 of 63 open rows enumerated and bucketed. QBE priority 13, Workbench 20 (incl. 6 confirmed qualify-ins), Stewarding and renewal lane 12, Buyer or demand 1 (Garma, pending Ben), Parked 17.

## 4. Conflicts the reconciliation surfaced (each needs one decision)

1. **SEFA figure:** $250K on the QBE Register, $300K on the Funder Pipeline DB. One figure everywhere before the send. Ben's call, standing open since 28 Jun.
2. **Minderoo stage:** Ask made on the register and in the GHL review list, Cultivating with "no formal ask yet" on the pipeline DB. Either a real ask went out (date it, keep Ask made, count it in indicator 3) or it did not (correct to Cultivating everywhere, again).
3. **Register and pipeline DB are nearly disjoint:** only 4 of 13 register rows (SEFA, Minderoo, LendForGood, Metro) have Funder Pipeline rows. Nine register asks (White Box, Snow, Centrecorp, VFFF, SEDI, FRRR, Clean Energy, ANZ, Sisters) are invisible on the working shortlist. The containment rule (register inside pipeline inside GHL) needs the nine mirror rows added. Staged in section 7.
4. **Tim Fairfax double signal:** scout says park forever, pipeline DB says live conversation with a 10 Jul date. Resolved above: workbench now, register on written evidence.
5. **GHL token scopes:** section 2. Machine blind until fixed.

## 5. The strategy: three loops to 31 Aug

**Loop 1, the raise (founder, daily units of one sitting).** The five sends, unchanged and still unsent: SEFA (anchor, tightest clock), Jay rules email plus the LendForGood origination question (one email, two answers), White Box EOI, Snow repayable reframe. Then: Metro broker enquiry once the accountant answers which ABN borrows. Target: first signed match-eligible LOI by mid-July. The constraint is not the list, it is sends.

**Loop 2, the workbench (machine Monday, founder Tuesday, 60 to 90 minutes).** Monday run emits the one-pager (four moves, stalled list, send list, ten indicators). Tuesday Ben sends, approves staged moves, marks losses. Fortnightly the funding-pipeline skill refreshes sources; the eight qualify-ins from section 3 enter as staged Identified or Cultivating rows. Stalled asks get two nudges then an honest lost.

**Loop 3, the exhibit (continuous).** Every signed document lands in the data room within 24 hours: register row flips Match Eligible to Yes with the Gmail evidence URL, CivicGraph Match Campaign tab gets the entry, SIH is told. The commitment register is the Stage 2 exhibit and stays strictly separate from pipeline value. The design surfaces (section 6) render from this truth, never ahead of it.

**Failure honesty, standing:** if signed total is under $150K by 1 Aug, the Monday page says so in line one and the Jay conversation shifts to what a partial stack means for Stage 2.

## 6. The artifact map: every priority ask has a share-ready asset

Sources: the repo artifact base (45 artifacts, 0 dead), the Claude Design project "Goods on Country. Investor Materials" (`b333c5aa-2dfa-4043-ab5f-ef7460692623`), the design kit at `design/brand/kit/`. Credit line on everything funder-facing: Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation.

| Ask | Send artifact (repo) | Design surface (Claude Design) | Live link |
|---|---|---|---|
| SEFA | `wiki/outputs/funder-reports/sefa/2026-06-27-sefa-loan-application-brief.pdf` plus canonical numbers | `invest-funder-card` (SEFA worked example), `invest-onepager` | /cost-story, /sites/cost-lab |
| Snow | `wiki/outputs/funder-reports/snow/2026-06-27-snow-first-mover-brief.pdf` plus repayable reframe draft | `invest-match-progress` (their $100K is the first block on the meter) | /investors |
| Centrecorp | `wiki/outputs/funder-reports/centrecorp/2026-06-27-centrecorp-nextround-brief.pdf` plus the 87-bed Utopia proof | `invest-funder-card` variant | /field-notes/utopia-may-2026 |
| White Box | SELF EOI plus entity wording block (`04-entity-wording-block.md`) plus cost model v6 | `invest-onepager` | /sites/qbe-readiness |
| Minderoo | Impact page plus deck (cultivate, no brief until the ask is real) | `invest-deck-full` (16 slides) | /impact, /pitch |
| LendForGood | Jay origination draft (04-new-outreach-drafts, draft 1) | `invest-teaser-deck` (7 slides, campaign-shaped) | /pitch |
| Metro | Broker enquiry (draft 2) plus equipment schedule from the cost engine | `invest-stat-band` | /cost-story |
| Grants in motion (SEDI, FRRR, ANZ, Sisters, Clean Energy) | Canonical numbers sheet plus impact framework | `invest-stat-band`, `impact-stats` | /impact |
| Tim Fairfax (if promoted) | Refreshed funder one-pager | `invest-onepager` | /pitch |
| QBE Stage 2 (the application itself) | Commitment register extract plus catalytic pitch bundle | `invest-capital-stack`, `invest-match-progress`, `invest-next-phase` | /sites/qbe |

**Design surface refresh shipped with this strategy:** `invest-funder-pipeline.html` rebuilt from the 2026-06-20 fifteen-prospect lanes to the reconciled five-bucket board as at 2026-07-03, pushed to the Claude Design project so the shareable picture matches this file. `invest-match-progress` ($0 of $400K) and `invest-capital-stack` ($425K lead stack) verified still canon-true, no change needed. Standing rule: these surfaces re-render only from the register and canon, never hand-typed ahead of the truth; next refresh comes off the first live pull after the token fix.

## 7. Staged writes (nothing applied, Tier 2, Ben ticks or strikes)

**Notion Funder Pipeline DB:**
- [ ] Add the nine register mirror rows: White Box, Snow first-mover, Centrecorp next-round, VFFF, SEDI, FRRR SRC, Clean Energy Advice, ANZ Seeds, Sisters of Charity (stage, type, amount, next action, GHL opp id where known), restoring register inside pipeline containment.
- [ ] Add a Bucket select property (QBE priority, Workbench, Stewarding, Buyer-demand, Parked) and set it on all rows per section 3, so the classification lives where the review happens.
- [ ] Add workbench rows for the five confirmed qualify-ins (NAACT, Yeperenye, StreetSmart, INPEX, Australian Communities Foundation) at Identified. (John Villiers, AMP and The Funding Network dropped: live pull shows they are past funders at Stewarding, renewal lane instead.)

**Notion QBE Register:**
- [ ] SEFA amount to the single figure once Ben calls it (and the same figure into GHL and the readiness page, one sitting).
- [ ] Tim Fairfax row added only on Katie Norman's written-path confirmation.
- [ ] Append any new row page ids to `SEED_ROWS` in `commitment-register-status.mjs` (the script warns about this itself).

**GHL (apply via `ghl-people-move.mjs`, dry-run first, after the scope fix):**
- [ ] Minderoo stage per decision 2.
- [ ] Bucket tags on all open Supporter Journey rows (`bucket-qbe`, `bucket-workbench`, `bucket-steward`, `bucket-demand`, `bucket-parked`) so the classification survives in the system of record.
- [ ] Move Red Dust and QIC to Buyer Pipeline or Demand Register if the live pull confirms they are not funders.
- [ ] Values on the valueless Ask made rows; two-nudge-then-lost on the six stalled asks.

**Notion Machine Dashboard:** paste this file's clock line, the five conflicts, and the bucket counts after Tuesday review.

## 8. Machine build-next (Tier 1, agent-runnable once scopes return)

1. Extend `ghl-people-pull.mjs` to emit the bucket classification (from the tags above) so section 3 regenerates weekly instead of by hand.
2. Monday one-pager gains a "containment check" line: register rows missing from pipeline DB, pipeline rows missing from GHL, and the count of unbucketed open rows.
3. `funder-artifact-match.mjs` reads the Bucket field and only recommends sends for QBE priority and Workbench rows.

---

*Provenance: GHL pipeline totals from Ben's live LeadConnector pull 2026-07-03 (Verified, his session). Record-level GHL stages as at 2026-07-02 machine pull (Inferred for today). Notion register and pipeline rows read live 2026-07-03 via the Notion API (Verified). Token scope failure verified directly against services.leadconnectorhq.com 2026-07-03. Target asks are never committed money; signed total today is $0.*
