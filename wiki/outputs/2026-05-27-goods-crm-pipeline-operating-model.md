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

**Buyers** (exemplar: `Northern Land Council — GAPUWIYAK`):
- `goods-role-{council|store|health|housing|landcouncil|corp}`
- `goods-state-{nt|qld|wa|sa|nsw|act|tas}`
- `goods-communitycontrolled` (if community-controlled)
- `goods-stage-{prospect|active|customer}`
- always `goods` + `act-gd` + `project:act-gd`

**Funders / supporters** (drives Grade→GHL playbook):
- `goods-{hot|warm|steady|cooling|cold}` — warmth band from the Notion grade
- `goods-funder` / `goods-supporter`

## What "clean" looks like (state at 2026-05-27)

- **Supporter Journey:** 13 funders, each at warmth-mapped stage with `goods-<band>` tag.
- **Buyer Pipeline:** commercial prospects only (started with NLC Gapuwiyak after cleanup).
- **Demand Register:** sized community demand signals + scored entities from GrantScope.

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
