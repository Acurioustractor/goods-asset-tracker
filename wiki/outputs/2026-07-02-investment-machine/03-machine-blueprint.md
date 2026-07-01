# The investment machine: GHL + Notion, built on what exists

> Written 2026-07-02. This is an operating blueprint, not a build-from-scratch. It composes the pieces that already work: the GHL Goods Supporter Journey and the 5 tag families (`wiki/outputs/2026-06-28-funding-refresh/06-ghl-operating-guide.md`), the engagement playbook's proof pillars and stage-depth table (`05-engagement-playbook.md`), the Notion Funder Pipeline DB (collection `97afae12`) and QBE Opportunity Register (collection `62ffa800`), the `funding-pipeline` and `relationship-pipeline` skills, the scripts in `v2/scripts/`, and the design kit in `design/brand/kit/`. Every external write in here is STAGED FOR APPROVAL. Nothing below has been done.

**Standing guardrails the machine enforces, never negotiates:**
- The QBE match is an output of money raised, never an input. It is "up to AU$400K", at least 1:1, repayable preferred, and not secured until awarded in November.
- Pipeline value is never presented as committed. Money is "received" only when it is in Xero or the bank.
- Re-pull Xero immediately before any external send; figures drift roughly $1,200 a month. Stamp an as-at date on every money figure.
- Consent gate: only the 32 cleared voices appear in funder material. Consent-pending people are never named, quoted or pictured.
- Every funder-facing artifact carries "Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation". The QBE logo needs written consent.
- One writer per layer: GHL is the system of record for stage; Notion is the review surface; Xero is the money truth; the repo is the artifact source.

---

## (a) The funnel, end to end

Six machine stages map cleanly onto the seven GHL stages that already exist. No renaming, no new pipeline.

| Machine stage | GHL stage(s) | Owner system | What must be true to advance | Evidence recorded where |
|---|---|---|---|---|
| **SOURCE** | (pre-GHL) | `funding-pipeline` skill + scout sweeps, output in `wiki/outputs/` | Live source page verified with a real date (the skill's non-skippable live-date gate) | Dated shortlist file in the repo, staged for Ben |
| **QUALIFY** | Identified, then Qualified | GHL, screened with the SIH 8 knockouts (K1 geography, K2 legal structure, K3 $150K-$400K size, K4 signed-by-Aug timing, K5 no equity exit, K6 impact alignment, K7 grant or concessional debt, K8 early-commercial) | Knockout pass plus a way in. "Don't Know" is the honest cell value, never a guess | GHL tags (Type + Signal); knockout notes on the contact |
| **CULTIVATE** | Cultivating | GHL stage + Action tags drive the work list | A relationship exists and the specific ask is scoped (amount, instrument, use) | GHL notes; Notion Funder Pipeline row mirrors for review |
| **ASK** | Ask made | GHL; founder sends, always | The funder-specific brief went out with a specific amount, instrument and use of funds. The stage moves ON SEND, never on intent (the SEFA lesson: the move was staged "on send" and the send never happened) | `ask-out` tag + a +7 day GHL follow-up task; send noted with date |
| **PAPER** | Delivering | QBE Opportunity Register (Match Eligible flips from TBC) + CivicGraph Match Campaign tab | A signed document exists on the SIH ladder: LOI or beyond counts as match. Gmail Evidence URL filled on the register row | Register row: Match Eligible = Yes, evidence URL, executed doc in the data room; SIH notified so they can confirm at due diligence |
| **BANKED** | Delivering, then Stewarding/Reporting | Xero | Invoice raised from the correct entity, money reconciled in Xero. Then the reporting clock starts | Xero; acquittal plan in Notion; stage moves to Stewarding |

The commitment register (CivicGraph Match Campaign tab) is the single place signed match evidence accumulates. It holds 0 entries today. It is the QBE Stage 2 exhibit, so it stays strictly separate from prospect pipeline value.

## (b) Entry points, and how each lands in GHL

Today no public surface writes into GHL at all. The fixes are small and mostly Tier 1.

| Entry point | Today | How it lands in GHL (proposed) |
|---|---|---|
| Gated pages (`/investors`, `/sites/qbe-readiness`, `/sites/qbe`, `/sites/cost-lab`) | Password only, no capture | Log gate entries (IP-hashed, already have SCAN_IP_HASH_SALT) to a lightweight table; weekly report lists "who looked". Manual protocol meanwhile: whenever Ben shares the password, he adds or updates the GHL contact and tags `goods-capital-target` + Type, same sitting |
| Public pitch (`/pitch`, `/pitch/document`, `/cost-story`) | CTAs go to generic `/partner` and `/contact` | Add a funder-specific contact path ("Talk to us about the raise") that creates a GHL contact tagged Class + `warm`; UTM-tag the links baked into the one-pagers and deck so inbound source is visible |
| QR bed records (`/bed`) | Public asset proof, no funnel | Keep it as proof, not capture. Every funder letter already cites "QR-tracked beds"; the artifact matcher sends the link at Cultivating |
| Warm intros (Snow, Jay/SIH, board members) | Ad hoc | Standing rule: an intro becomes a GHL contact at Identified the same day, tagged Signal `warm` and Type, with the introducer noted. The 3 live people-leads (Sally Knox, John Chambers, Eloise Hall) are the test cases |
| August hackathon (~15 QBE staff) | Not wired | Attendee list becomes GHL contacts tagged `goods-partner-target` + `monitor` (staged write, needs Ben). They are relationship seeds and skilled-volunteer paths, never match capital |
| LendForGood campaign (if SIH originates) | Not started | The campaign page itself becomes an entry point; lenders are the crowd, the intermediary relationship stays with SIH in GHL |

## (c) The artifact-per-stage map

This reuses the playbook exactly: 5 pillars (pitch, costing, impact, stories, governance), depth by stage, type-based bundles. The design kit slots in as the rendered layer of the same pillars.

| Stage | Philanthropic funder | Repayable lender | Catalytic/blended | Render source |
|---|---|---|---|---|
| Identified | Public pitch link only | Public pitch link only | Public pitch link only | `/pitch` |
| Qualified | Funder one-pager | Funder one-pager + cost-story link | One-pager + readiness link | `design/brand/kit/funder-onepager.pdf` (re-bake first: `design/brand/kit/render.sh`) |
| Cultivating | One impact proof + one cleared story | Lead with costing: cost-story + repayment case, then one impact proof | Deck + matched-capital status | `invest-deck-full.pdf`, `/cost-story`, `/sites/cost-lab` |
| Ask made | Funder-specific brief + canonical numbers + governance | Loan brief + cost model + governance (board plan) | Stage 2 pack + commitment register extract | Briefs in `wiki/outputs/funder-reports/` (SEFA/Snow/Centrecorp overrides per the playbook) |
| Delivering | Grant agreement + acquittal plan, then invoice | Term sheet, then invoice | Funding agreement | Templates + Xero |
| Stewarding | Impact report + acquittal (Utopia pattern) | Covenant reporting | SIH impact report (due within 6 months of completion) | `ledger-story` skill outputs, canonical numbers sheet |
| Renewing | Next-round brief | Facility review | Next raise | New brief per round |

`v2/scripts/funder-artifact-match.mjs` already reads GHL and Notion and answers, per supporter: stage, type, exact artifacts to send, next money step. The machine calls it; it does not rebuild it.

## (d) Weekly operating cadence

The week is two machine runs and one founder sitting. Total founder time: about 90 minutes plus sends.

**Monday, machine (Tier 1, agent-runnable, read-only):**
1. `node v2/scripts/ghl-people-pull.mjs` for the live board (extend it first; see build list).
2. `node v2/scripts/funder-artifact-match.mjs` for per-supporter send recommendations.
3. Cross-check the QBE Opportunity Register: any row where Due Date has passed, Owner is null, or Match Eligible is still TBC with an ask out gets flagged.
4. Emit one page: "the four moves this week" (the proven pattern), the stalled list (Action `needs-followup`), the send list (Action `ready-to-send`), leading indicators (section f), and any canon drift (`npm run check:drift`, `node scripts/check-qbe-readiness.mjs`).

**Tuesday, Ben (day shift, 60-90 minutes):**
1. Read the one-pager. Approve or amend the four moves.
2. Send the sends, founder voice, from the Notion data-room links. Every send gets its date noted.
3. Approve the staged GHL moves; the agent then applies them with `node v2/scripts/ghl-people-move.mjs` (dry-run output first, always).
4. Anything stalled after 2+ follow-ups gets marked lost, same sitting.

**Fortnightly:** run the `funding-pipeline` skill (live-date gate) to refresh sources; new verified candidates enter as staged Identified rows.

**Monthly:** re-render the design artifacts (`design/brand/kit/render.sh` for the deck and both one-pagers) so the internal landscape one-pager reflects live stages instead of hand-typed ones; re-pull the alignment scoring if tiers moved; review the risk register.

**Before ANY send:** re-pull Xero, confirm the figure basis ($713,827 Goods-only signed; $741,111 only when the basis is explicitly all-sources), and check the artifact carries the credit line and an as-at date.

## (e) Staged writes, for approval, never done

Nothing in this section has been executed. Each block is a checklist Ben ticks or strikes.

**GHL writes (apply via `ghl-people-move.mjs` dry-run first; Tier 2-3, founder-gated):**

New contacts + opportunities (from Tier B of `02-investor-targets.md`):
- [ ] LendForGood, Cultivating, tags `goods-capital-target` `repayable-lender` `warm` `ready-to-send` `beds` (the send is the SIH origination question), value $100K-150K indicative
- [ ] Metro Finance (MetroEco), Qualified, tags `goods-capital-target` `repayable-lender` `warm` `ready-to-send` `nt-plant`, value $60-110K indicative (equipment schedule)
- [ ] CommBank Green Equipment Finance, Identified, tags `goods-capital-target` `repayable-lender` `monitor` `nt-plant`, next action: 1800 ASSETS eligibility call
- [ ] Tripple, Identified, tags `goods-capital-target` `repayable-lender` `warm` `needs-followup` `first-nations`, next action: request the Snow intro; never counted toward match
- [ ] Optional cost-offset rows: Sea Swift (round open 1 Jul), INPEX (rolling), tagged `goods-partner-target` `monitor`

Stage and value corrections (all flagged by the live pull):
- [ ] SEFA: move to Ask made ON SEND of the loan brief, not before; reconcile the target to one figure ($250K or $300K, Ben's call) in GHL, Notion and the readiness page together
- [ ] Minderoo: if no real ask went out, move back to Cultivating (restores the 28 Jun correction)
- [ ] Snow: resolve the duplicate ($402,930 Stewarding row to Renewing; $100K first-mover stays Ask made)
- [ ] Centrecorp: restore or explain the missing $123,332 Stewarding row
- [ ] Set values: First Nations Finance, CEFC/NAB, Invest NT, and the five valueless Ask-made rows
- [ ] Six stalled asks: send drafted nudges, then mark lost if silent after two follow-ups
- [ ] Triage the 22 Identified per the 28 Jun call: work five (Sally Knox, John Chambers, IMB, East Arnhem, NAACT), park the rest as `monitor`
- [ ] Tag hygiene: ensure every open opportunity carries one tag from each of Class, Type, Signal, Action

**Notion writes (Tier 2, founder-gated):**
- [ ] Funder Pipeline DB: add rows for LendForGood, Metro Finance, CommBank, Tripple with Stage, Type, Action, Amount, Next action, Send-next artifact
- [ ] QBE Opportunity Register: add LendForGood and Metro Finance rows (both genuinely match-relevant), Owner set, Due Date set, Match Eligible TBC until paper exists
- [ ] Fill the null Owners and missing Due Dates on the five newer register rows (FRRR SRC, ANZ Seeds, Clean Energy, Sisters of Charity, SEDI)
- [ ] Create one Machine Dashboard page in the data room: this week's four moves, the commitment register status (signed $ against $400K), the leading indicators, and links to the two databases. The Monday run refreshes it; Ben reads one page instead of six
- [ ] Resolve the Notion trash question: either restore the operating-plan tree or record the two live databases plus the repo as canonical and archive the rest properly (with a note where each dead link used to point)

**Explicitly NOT machine writes, ever:** sends of any email, anything touching Xero, the SEFA figure decision, the revenue $713,827/$907,569 decision, consent clearances, and any stage move without a dry-run shown first.

## (f) Definition of done, and what to watch weekly

**Done for 31 Aug 2026:** signed, legally binding, match-eligible external commitments totalling at least AU$400K, each one an LOI or beyond on the SIH ladder, each with an executed document in the data room, a filled Gmail Evidence URL on its register row, an entry in the CivicGraph Match Campaign tab, and SIH informed so it can confirm at due diligence. Repayable weighted ahead of grants per QBE preference. The written rules from Jay (what counts as match, repayable weighting, self-originated debt, cl 5.3 and cl 7.3) received and filed BEFORE the stack is finalised.

**Leading indicators on the Monday one-pager, every week:**
1. Signed match-eligible total (today $0) against $400K, and weeks remaining (today: 8.5).
2. Register rows at Match Eligible = Yes (today 0 of 11).
3. Asks out with a specific amount, instrument and use (honest count, after the Minderoo correction).
4. SEFA milestone: enquiry lodged, credit assessment opened, term sheet drafted. This is the anchor's clock and it is the tightest.
5. Jay rules email: sent yes/no, answered yes/no.
6. Days since last touch on each Tier 1 funder (flag anything over 7 during the window; do not trust `updatedAt`, which bulk touches reset).
7. Rows carrying `ready-to-send` older than one week (send debt; the SEFA send is currently 12 days old).
8. Pipeline hygiene: opportunities missing values, missing Action tags, or past due.
9. LendForGood origination answer from SIH: asked, answered, campaign live.
10. Hedge depth: signable candidates outside the lead stack (White Box, LendForGood, Metro, Minderoo-if-real). If the lead stack loses a leg, this is the bench.

**Failure honesty:** if by 1 Aug the signed total is under $150K (the QBE floor), the weekly page says so in the first line and the conversation with Jay shifts to what a partial stack means for Stage 2. The machine never softens that number.

## Build next

**An agent can build now (Tier 1, local, no external writes):**
1. Extend `v2/scripts/ghl-people-pull.mjs` with the Grants, buyer and partner pipeline ids so `--pipeline` stops silently falling back to funder. Highest-value small fix; the Grants sync of 28 Jun is currently invisible.
2. The Monday one-pager generator: compose `ghl-people-pull` + `funder-artifact-match` + register checks + the 10 indicators into one markdown file in `wiki/outputs/`, and a matching block for the Notion Machine Dashboard (content staged, paste or push after approval).
3. Add `invest-deck-full`, `funder-onepager` and `funder-landscape-onepager` to `v2/src/lib/data/artifact-register.json` with citesCanon ids so Loop B drift-guards them.
4. A number-token bake for the design kit (figures from `canon.ts` injected like CANON image slots), killing the hand-retyped-figures risk.
5. Generate the landscape one-pager's stage column from the live pull instead of hand-typing.
6. Draft the LendForGood question to Jay, the Metro broker enquiry, and the Tripple intro request for Snow (drafts only, alongside the 8 existing unsent drafts).
7. A commitment-register status script: read the register, count Match Eligible = Yes, sum signed dollars, emit indicator 1.

**Needs Ben (day shift, human-gated):**
1. The five sends: SEFA, Jay rules email, White Box EOI, Snow repayable reframe, LendForGood origination ask. One sitting.
2. Approve and apply the staged GHL and Notion writes above.
3. The SEFA figure call ($250K or $300K) and the revenue call ($713,827 stands; adopt or park the $907,569 reconciliation and action or drop the TFN rebook).
4. The Notion trash decision (restore or archive-with-pointers).
5. Founder review pass on the 12 diagnostic areas, starting with the investor story, the ask and the use-of-funds budget.
6. The Drive access test from a non-Goods account, and locking the cost bundle to named people.
7. Broker engagement for Metro/CommBank and the which-ABN-borrows call with the accountant.

The machine's whole job in one sentence: keep an honest, current picture of the distance between $0 signed and $400K signed, and hand Ben the four highest-leverage moves and finished drafts each week, so founder time goes to sending, calling and signing instead of remembering.
