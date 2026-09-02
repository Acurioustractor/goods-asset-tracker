# QBE funding pipeline alignment review

**Date:** 20 August 2026  
**Scope:** The 58 open opportunities in `GOODS - Funding`, aligned to the QBE Catalysing Impact Stage 2 requirement for signed external commitments.

## Decision

Do **not** manage this as a `$400,000 matched opportunity`. QBE's grant is discretionary (historically typically `$150K–$400K`, from a shared cohort pool) and the recorded rule is that the QBE grant actually awarded must be covered by signed external commitments. The `$400K` figure is an internal ceiling/ambition, not a QBE promise.

The QBE register should therefore show three independent quantities:

1. QBE grant sought / awarded — `unknown until QBE decision`.
2. Signed external commitments that QBE has accepted — `currently $0 unless a verified letter has since been added`.
3. Qualified candidate pipeline — never summed as match coverage.

## What the live funding pipeline shows

58 funding opportunities are open: 27 Identified, 5 Qualified, 10 Cultivating, 10 Ask made, 4 Stewarding/Reporting and 2 Renewing.

The useful QBE view is a strict subset of that pipeline, not another copy of it:

| QBE class | Current opportunities | Required decision/action |
|---|---|---|
| **Potential match — active** | SEFA `$300K`, White Box SELF `$150K`, Snow first-mover `$150K`, Minderoo `$100K`, Tim Fairfax `$150K` | One owner, one dated next action, instrument/entity/amount/decision-date confirmed. None counts until signed and accepted. |
| **Potential match — qualify before promotion** | Fay Fuller Foundation, LendForGood, Metro, First Nations Finance, CEFC/NAB, Invest NT, SEDI, FRRR, ANZ | Establish whether the instrument, legal entity, timing and written-commitment route can satisfy QBE. Fay Fuller is **awaiting Gavin Reid's introduction**, not yet a live QBE match candidate. |
| **Explicitly excluded from match arithmetic** | QBE Stage 2 itself, Centrecorp 130-bed commercial quote, historic Snow funding, Philanthropy Australia, REAL Innovation Fund | Keep relationship/revenue/program evidence visible, but do not let it inflate external-match coverage. |
| **Stewarding / renewal** | John Villiers, Mala'la, Red Dust, QIC, Julalikari, Our Community Shed | Separate reporting/renewal work from the QBE decision view. |

### Integrity correction required

**Tim Fairfax** is currently marked `match eligible: Yes` in GHL, but its amount basis is `Estimate`, its capital status is `Ask made`, and the QBE review records that its written-commitment route had not been confirmed. Change that field to **TBC** until there is a letter meeting the evidence standard below.

## The shared operating model

| Layer | Owns | Must not do |
|---|---|---|
| **GHL — GOODS Funding** | Relationship, stage, owner, next action, activity and one opportunity ID | Claim QBE eligibility from a stage or estimated value. |
| **Notion — Funder Pipeline** | Fortnightly operating review for all active funding work | Become a second CRM or independent source of stage truth. |
| **Notion — QBE commitment register** | The small, evidence-led subset for the Stage 2 exhibit | Include qualified leads, past payments or commercial quotes as signed match. |
| **Repository / data room** | Canonical assets, final letters, entity wording and evidence provenance | Substitute a draft or pitch deck for commitment paper. |
| **Xero** | Paid money | Treat receivables, voided quotes or historic grant payments as QBE match. |

## Exact fields

### GHL opportunity fields

Keep the current `funding type`, `match eligible`, `capital status` and `amount basis` fields. Add only the missing operational detail as tags/notes if custom fields are not yet approved:

- `qbe_class`: `active_candidate` / `qualify` / `excluded` / `stewardship`.
- `qbe_entity`: `A Curious Tractor Pty Ltd` / `The Butterfly Movement Ltd` / `TBC`.
- `qbe_instrument`: grant / recoverable grant / loan / equipment finance / equity-like / TBC.
- `qbe_evidence_status`: none / requested / draft letter / signed letter / QBE accepted / rejected.
- named owner, next action and due date.

Rule: **`match eligible: Yes` only when `qbe_evidence_status = QBE accepted`.** `TBC` means plausible but unverified. `No` means structurally excluded.

### Notion QBE commitment-register properties

Use a relation to the one GHL opportunity; do not recreate stages manually.

- Organisation and named relationship holder.
- GHL opportunity relation / ID.
- QBE class and short rationale.
- Instrument and legal receiving entity.
- Amount requested; amount in written commitment; amount QBE accepted.
- Commitment status: `Candidate` → `Terms discussed` → `Letter requested` → `Signed` → `QBE accepted` / `Excluded`.
- Evidence link (letter/source email), dated verifier, and source freshness.
- Owner, next action, due date and blocker.
- Counts toward QBE coverage — formula/roll-up, **true only for QBE accepted amount**.

## The review cadence

1. **Weekly 30-minute QBE sitting:** only the active-candidate and qualify views. Every row must leave with an owner, a next move and a date.
2. **On receipt of a letter:** attach source evidence, verify named funder, amount, instrument, legal entity and callable contact; then ask SIH/QBE whether it qualifies. Only then change `match eligible` to Yes and include its accepted amount.
3. **Monthly funding review:** work the full 58-row GHL pipeline; promote/demote the QBE subset from evidence, not optimism.
4. **Application/export:** the Notion QBE register renders the commitment exhibit; GHL continues to show the relationship history.

## Immediate actions (human approval required)

1. Downgrade Tim Fairfax `match eligible` from Yes to TBC.
2. Add Fay Fuller as `qualify`, with the blocker `await Gavin Reid introduction`; do not add a match amount.
3. Create/confirm the nine priority rows in the Notion QBE register and link their GHL opportunity IDs: SEFA, White Box, Snow, Minderoo, Tim Fairfax, LendForGood, Metro, Centrecorp (explicitly excluded commercial route) and Fay Fuller.
4. Ask SIH/QBE the entity and instrument questions before treating any letter as coverage.

## Sources

- Live GHL `GOODS - Funding` opportunity pull, 20 August 2026 — stages, values and current custom-field values.
- `thoughts/shared/handoffs/2026-08-01-qbe-stage2-reality-and-the-raise.md` — QBE mechanic, entity/financial constraints, signed total and evidence risks.
- `wiki/outputs/2026-07-03-pipeline-strategy.md` — original register/pipeline containment model and category decisions; revalidate individual opportunity facts before acting.
- Fay Fuller Foundation official site and contact page, checked 20 August 2026 — organisational focus and official general contact route.
