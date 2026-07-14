# Provenance — 2026-06-28 funding refresh

Method: `funding-pipeline` skill. GHL pipeline pulled read-only via `v2/scripts/ghl-funder-stages.mjs`. GrantScope leads via `.claude/skills/funding-pipeline/scripts/pull-grantscope-open.mjs` (table `grant_opportunities`, shared project `tednluwflfhxyucgwigh`, read-only). Live dates verified by two oracle web-research agents on 2026-06-28; detail in `../2026-06-27-funding-source-audit/grants-live-verification/agent-A-firstnations.md` and `agent-B-circular.md`.

| Claim | Source | Checked | Confidence |
|---|---|---|---|
| All 10 GHL Grants rows dead / no-fit | per-row verification, agents A+B | 2026-06-28 | Verified (each row checked on its program page) |
| Vic RMF R6 closed 11 Jun 2026 (not 1 Jul) | sustainability.vic.gov.au R6 page | 2026-06-28 | Verified |
| WA RMF General R2 closed 27 Feb 2026 | wa.gov.au RMF | 2026-06-28 | Verified |
| NT RMF R2 closed 28 Feb 2023; CENT operational by 30 Jun 2025 | nt.gov.au CENT + syndications | 2026-06-28 | Verified |
| SEDI Capability Building open, rolling ~early 2027, up to $120K, for-profit social enterprise eligible, no gate | dss.gov.au SEDI | 2026-06-28 | Verified |
| NT Advanced Manufacturing Ecosystem Fund open rolling, $25K–$500K matched, no gate | business.gov.au listing | 2026-06-28 | Inferred (Medium-High) — confirm rolling status on NT page before submitting |
| NT Business Growth Program closing 30 Jun 2026, $2K–$10K | nt.gov.au Business Growth Program | 2026-06-28 | Verified |
| NSW Bin Trim Equipment Rebates R2 open to 30 Jun 2027, NSW site required | epa.nsw.gov.au Bin Trim | 2026-06-28 | Verified |
| NIAA RJED / CJBF closed 7 Apr 2026 (watch R4) | niaa.gov.au RJED | 2026-06-28 | Verified |
| IBA finance gates on 50%+ Indigenous ownership | iba.gov.au business finance | 2026-06-28 | Verified |
| First Nations Finance / CEFC-NAB / Invest NT / SEFA — no-gate repayable picks | `../2026-06-27-funding-source-audit/02-verification-pass.md` | 2026-06-28 | Verified (prior audit pass) |

Caveat: GrantScope `closes_at` and `last_verified_at` fields are the DB's own metadata, not Goods verifications. Several DB rows show a default-looking `2026-06-30` close that is a likely artifact (e.g. NIAA IAS). Always re-verify on the live page.
