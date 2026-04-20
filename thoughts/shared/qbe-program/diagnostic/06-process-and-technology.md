# 6. Process and Technology Maturity

> Are fit for purpose and efficient processes and supporting technology/systems in place?

## Tech stack (live)

| Layer | System | Status |
|---|---|---|
| Website + ecommerce | Next.js 16 (App Router), React 19, Tailwind 4, shadcn/ui | Live at goodsoncountry.com |
| Database | Supabase (PostgreSQL) | Live (project cwsyhpiuepvdjtxaozwf) |
| Payments | Stripe | Live (Stretch Bed only) |
| Hosting | Vercel | Live |
| CRM / outreach | GHL | Integrated |
| Storytelling infrastructure | Empathy Ledger (see below) | Live, 33 Goods-connected storytellers |
| Accounting | Xero (ACT-GD cost code) | Live, book of record |
| Fleet telemetry | Particle.io + custom webhooks for washing machines | 1 of 11 machines instrumented; scaling |
| Knowledge base (internal) | Goods Wiki (Karpathy pattern) + ACT Tractorpedia | Live |
| Grant intelligence | Grantscope integration | Live |

## Operational processes documented

- **Operations Handbook:** `v2/docs/OPERATIONS_HANDBOOK.md`
- **Production Facility Guide:** `v2/docs/PRODUCTION_FACILITY_GUIDE.md`
- **Partner Guide:** `v2/docs/PARTNER_GUIDE.md`
- **Procurement Strategy:** `v2/docs/procurement-strategy.md`
- **Empathy Ledger Operations:** `v2/docs/empathy-ledger-operations.md`
- **Content Pipeline:** `v2/docs/content-pipeline.md`

## Asset tracking

- Every bed has a unique ID and a journey record (`bed_journeys` table).
- QR codes on assets link to a consented story and service record.
- Current v2 database has 389 assets tracked.
- Washing machine fleet tracked via `assets` + `usage_logs` + `daily_machine_rollups` with a 6-hourly rollup cron.

## Data sovereignty and cultural safety

This is where we think Goods is stronger than most social enterprises at our stage, because we sit on ACT's Empathy Ledger infrastructure.

**Empathy Ledger (relevant to Goods):**
- Consent-first architecture. Every story has explicit consent; withdrawal is one click and cascades through the system.
- OCAP-compliant (Ownership, Control, Access, Possession) for First Nations data.
- 33 Goods-connected storytellers, all with active consent.
- Auto-sync cron at `/api/cron/el-sync` runs daily.
- `EMPATHY_LEDGER_SUPABASE_URL` + API integration in `v2/src/lib/empathy-ledger/`.
- Governance: Elder review workflow, trigger warnings, ongoing consent (renewable with expiry).

**Why this matters for impact work:** most social enterprises extract community stories for fundraising and never give them back. Our architecture reverses that: stories are sovereign assets owned by storytellers. This is the cultural-safety foundation under our entire impact measurement capability.

## Process maturity by area

| Area | Maturity | Notes |
|---|---|---|
| Product design + iteration | High | V1-V4 documented, field feedback loop |
| Manufacturing SOPs | Medium | Documented, scaling to container format |
| Sales + order fulfilment | Medium | Ecommerce live, B2B manual |
| Impact capture | High | Empathy Ledger is production-grade |
| Finance + bookkeeping | Medium-High | Xero, monthly cycle |
| Risk + compliance | Medium | Documented, not board-formalised |
| People + HR | Early | ACT shared services; no dedicated HR |
| IT security | Medium | Supabase RLS, auth, consent gates; no formal audit |

## Where we are under-invested

- **Formal ERP / MRP** for production planning. We are still at spreadsheet-plus-docs level.
- **CRM pipeline discipline.** We use GHL but have not fully systematised the B2B sales pipeline (Grantscope covers funder side; B2B buyer side is less structured).
- **Compliance automation** (WHS, product liability checks).
- **Data warehouse / BI.** Live dashboards exist in-app but there is no separate analytics layer.

## Recent builds worth noting

- **Funder-gated due diligence pages** (recent commit: password-gated funder landing pages). Each target funder gets a link with tailored due-diligence material.
- **QBE Program admin dashboards** (live operational state of this very process).
- **Fleet webhooks** for washing machine usage telemetry (Particle.io + Openfields HMAC-signed).
- **Admin KV state** for cross-session state persistence.

## Source documents

- Strategy PD Part 10 (Technology Platform): `v2/docs/GOODS_STRATEGY_PD.md`
- Ops handbook: `v2/docs/OPERATIONS_HANDBOOK.md`
- Production guide: `v2/docs/PRODUCTION_FACILITY_GUIDE.md`
- Empathy Ledger integration: `v2/docs/EMPATHY_LEDGER_INTEGRATION.md`
- Consent architecture: `act-global-infrastructure/wiki/concepts/consent-as-infrastructure.md`
- Indigenous data sovereignty: `act-global-infrastructure/wiki/concepts/indigenous-data-sovereignty.md`
