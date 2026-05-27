# Goods CRM Pipeline Operating Model

_Decided + cleaned 2026-05-27. The canonical "how the Goods pipelines work" reference._

## The spine — one record, one home

```
                       People / relationships → GHL          Money → Xero (ACT-GD)
                                  │
  GrantScope (buyer scoring SoR)  │  Notion grades (funder warmth SoR)
        4,952 scored entities     │       13 funders graded
            │                     │             │
            ▼                     │             ▼
  Goods — Demand Register  ───────┤   Goods — Supporter Journey   (funders/donors)
   Signal→Buyer Matched→          │    Identified→…→Stewarding→
   Converted→Dormant             │    Renewing→Lapsed→Declined
            │ graduate                         │ Won
            ▼                                  ▼
  Goods — Buyer Pipeline  ───────────────►   Xero (commercial revenue / grant income)
   Outreach Queued→…→Paid
```

Two rules keep it clean:

1. **No record lives in two pipelines.** Demand Register = unworked signal. Buyer Pipeline = actively-worked commercial deal. Graduating means **moving**, not copying.
2. **One tag convention** (below) so the GHL Smart Router can engage every record automatically.

## Pipeline roles (GHL location `agzsSZWgovjwgpcoASWG`)

| Pipeline | ID | Purpose | Who belongs |
|---|---|---|---|
| **Goods — Demand Register** | `UQsrmuqzxMSdCTklxEcG` | Top-of-funnel signal: who could buy / where unmet demand is | Scored procurement entities + community demand signals (from GrantScope). $0 until qualified. |
| **Goods — Buyer Pipeline** | `FjMyJM3YzWQFmKqR9fur` | **Commercial buyers only** — orgs paying their own way | Active commercial deals. One opp per buyer. |
| **Goods — Supporter Journey** | `JvBFYpVpyKsw899lkFgj` | Funder / donor cultivation | Grant funders + donors. Money is grant income, not a commercial sale. |

**Critical separation (decided 2026-05-27):** grant-funded deliveries do **not** go in the Buyer Pipeline. A funder's relationship lives in Supporter Journey; the dollars live in Xero. Putting grant deliveries in the commercial Buyer Pipeline was the root cause of the historical grant-vs-commercial confusion (e.g. Centrecorp product lines summed to ~$208K — the stale figure — while real cash is $123,332).

## Graduation rule: Demand Register → Buyer Pipeline

Move a record from Demand Register to Buyer Pipeline when **both** are true:
- it has a **named human contact** (not a `…@goods.civicgraph.io` placeholder), and
- there is a **reason to talk** (active conversation, RFQ, budget signal, warm intro).

When you graduate it: change the pipeline + set stage to `Outreach Queued`, and remove it from the Demand Register (no duplication).

## Tag convention

**Buyers** (exemplar: `Northern Land Council — GAPUWIYAK`, named contact **Matthew Ryan / NLC Chair**):
- `goods-role-{council|store|health|housing|landcouncil|corp}`
- `goods-state-{nt|qld|wa|sa|nsw|act|tas}`
- `goods-communitycontrolled` (if community-controlled)
- `goods-stage-{prospect|active|customer}`
- always `goods` + `act-gd` + `project:act-gd`

**Funders / supporters** (drives Grade→GHL playbook):
- `goods-{hot|warm|steady|cooling|cold}` — warmth band from the Notion grade
- `goods-funder` / `goods-supporter`

## What "clean" looks like (verified live in GHL 2026-05-27)

Counts pulled from GHL location `agzsSZWgovjwgpcoASWG` (opportunity search + contact lookup), not just asserted:

- **Supporter Journey — 13 funders, ~$978K open.** Each at a warmth-mapped stage with a `goods-<band>` tag (hot ×2 Centrecorp/Snow · steady ×3 · cooling ×7 · cold ×1 Rotary; no `goods-warm`). Centrecorp sits at exactly **$123,332** — the corrected grant figure — confirmed live.
- **Buyer Pipeline — 1 record (clean).** Only `Northern Land Council — GAPUWIYAK` (Outreach Queued, $70,771). Named human: **Matthew Ryan (NLC Chair)**, set 2026-05-27 so the exemplar obeys the graduation rule (was an `@goods.civicgraph.io` placeholder). Email + phone still to be filled before outreach.
- **Demand Register — 86 records, all placeholders.** Signal 61 · Buyer Matched 25 · Converted/Dormant 0. Every record is a `@goods.civicgraph.io` placeholder, so none is graduation-eligible yet — this is the activation backlog.

Whole-location census (context): A Curious Tractor 14 · Empathy Ledger 1 (test) · Goods Supporter Journey 13 · Goods Buyer 1 · Goods Demand Register 86 · Grants 413 · Harvest Inbox 10 · Supporters & Donors 0 (legacy, superseded by Supporter Journey) · The Shop 0 · Universal Inquiry 4 (`act-inquiry` form routing confirmed live).

## Tooling

- Supporter seeder: `act-global-infrastructure/scripts/seed-goods-supporter-journey.mjs`
- Buyer pipeline audit: `act-global-infrastructure/scripts/audit-goods-buyer-pipelines.mjs`
- Buyer pipeline cleanup (flag-gated, restore-file): `act-global-infrastructure/scripts/cleanup-goods-buyer-pipeline.mjs`
- Buyer activation (GrantScope): `grantscope/scripts/sync-ghl-goods-buyers.mjs`, `push-ghl-targets.mjs`, `/api/goods/buyer/push-ghl`
- GHL service (createOpportunity / deleteOpportunity / addTagToContact): `act-global-infrastructure/scripts/lib/ghl-api-service.mjs` (`createGHLService()` → `GHL_PRIVATE_TOKEN` + `GHL_LOCATION_ID`)
- **GHL MCP has no create-opportunity tool** — always create via the act-infra GHL service.

## Open items

- Close the anchor gap: Outback Stores, Centrecorp, Miwatj, ALPA, Tangentyere into the GrantScope entity graph + scored.
- Activate the curated top-~25 fit-scored buyers into Demand Register.
- Clear/upgrade the 9 old-format "52 beds, 6 washers" demand-signal leftovers.
