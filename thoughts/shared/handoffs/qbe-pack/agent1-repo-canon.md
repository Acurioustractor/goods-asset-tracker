# QBE Stage-2 Pack — Repo & Canon Current-State Digest (Agent 1)

**Date:** 2026-06-16 · **Scope:** read-only review of QBE diagnostic artifact coverage + canonical numbers, with staleness flags.
**Method:** read `qbe-areas.json` (committed `777876b`, asOf 2026-06-02), the 11 area review docs in `wiki/outputs/`, the strategic pack `2026-06-13-goods-strategic-pack/`, the revenue-reconciliation note, and the canon data files. Distinguished committed (deployed) vs working-tree (uncommitted) for every artifact.

---

## CRITICAL TRACKING FINDING (read first)

**Almost the entire QBE pack is UNCOMMITTED working-tree material.** Verified via `git ls-files`:
- All 11 area review docs (`2026-05-28/29-qbe-area-*.md`) → **NOT committed (`??`)**.
- The entire `wiki/outputs/2026-06-13-goods-strategic-pack/` (0 of ~30 files tracked) → **NOT committed**. Freshest file mtime 14 Jun 15:44.
- The revenue-reconciliation note (`2026-06-16-qbe-opportunity-hub/03-revenue-reconciliation.md`) → **IS committed** (1 tracked).
- The canon data files (`asset-canonical.ts`, `grant-content.ts`, `canon.ts`, `qbe-areas.json`) → **all committed, all clean** in working tree.

So: the *narrative pack* lives only on this branch's working tree (would vanish on a fresh clone); the *numbers* are committed canon. The scores in `qbe-areas.json` are asOf 2026-06-02 (V4 workshop 1 May); the strategic-pack AREA-INDEX/closure-map carry the same V4 scores but more recent (13 Jun) "built ✅" status assessments.

---

## TABLE 1 — PER-AREA ARTIFACT COVERAGE

| Area | Score now→target | Artifacts that exist (+ freshest date) | The specific remaining gap | BUILDABLE / HUMAN-GATED (≤6-word why) |
|---|---|---|---|---|
| 01 Vision & Ambition | 8→9 | area-01 review (2026-05-28, uncommitted); pack `13-vision-and-ambition.md`, `04-entity-wording-block`, memo §1-2, deck slides 1-6 (13 Jun) | Founder/legal must confirm entity + community-ownership language; don't claim transfer complete | HUMAN-GATED — founder/legal confirms wording |
| 02 Social Objective & Impact / MEL ★P0 | 5→8 | area-02 review (2026-05-28); pack `05-impact-measurement-method.md` (TOC + verified/modelled split) (13 Jun) | No partner-validated outcomes method; consent-cleared story list (beyond Ivy/Dianne/Ray) is primary gap | HUMAN-GATED — consent + partner validation |
| 03 Business Model Clarity ★P0 (joint-lowest) | 4→7 | area-03 review (2026-05-28); pack `14-business-model.md`, Playable Model, market §6 (13 Jun) | Demand pipeline unverified; SIH cost project + QBE market project + 50-bed run pending; can't quote demand as committed | HUMAN-GATED — external projects + signed demand |
| 04 Financial Management ★P0 (joint-lowest) | 4→7 | area-04 review (2026-05-29); pack `15-financial-summary.md` + Goods Playable Model; revenue-reconciliation note (2026-06-16, committed) | One accountant-signed Goods-only figure; founder time costed; locked opening cash ($50K placeholder); firm capex quote | HUMAN-GATED — accountant endorsement (hard Stage-2 gate) |
| 05 Strategic Planning & Risk ★P0 | 5→7 | area-05 review (2026-05-29); pack `16-strategic-plan.md` + `06-risk-register.md` (14 risks scored, environmental profiled) (13 Jun) | Founder adoption + review cadence; shareability decision | HUMAN-GATED — founder adopts the register |
| 06 Process & Technology | 7→8 | area-06 review (2026-05-29); pack `17-operating-model.md`; QR/asset register (live) (13 Jun) | SOP documentation ongoing; GHL reauth; Drive pack never access-tested externally | BUILDABLE — SOP docs; (reauth+access-test human) |
| 07 Governance, Data & Reporting ★P0 | 5→8 | area-07 review (2026-05-29); pack `18-governance-framework.md`, role map, risk register, entity block (13 Jun) | Recruiting 1-2 commercial/scale-up directors; no audited/consolidated reporting cycle; named sign-off path | HUMAN-GATED — recruit a real board |
| 08 People & Organisation | 6→7 | area-08 review (2026-05-29); pack `07-role-map.md` (now/next chart, 2 role briefs) (13 Jun) | GM + BD hires + 12-mo role map; hiring gated on the raise | HUMAN-GATED — hires gated on raise |
| 09 Legal Structure (KEYSTONE) | 5→7 | area-09 review (2026-05-29); pack `04-entity-wording-block.md` (13 Jun) | Entity/ownership decision OPEN — keystone (CASE knockout #2, Supply Nation 51% 1-July, FAC/IBA precondition); needs Keith Rovers/founder sign-off | HUMAN-GATED — founder/lawyer entity decision |
| 10 Investors & Capital Raising ★P0 | 6→8 | area-10 review (2026-05-29); pack memo `01`, `02-one-pager`, deck `.pptx`, 3 funder notes `08/09/10`, CASE tool `12` (13-14 Jun) | 0 signed LOIs → match gate open; QBE match rules confirmed ($400K, 1:1) but no binding commitment; conversion not discovery | HUMAN-GATED — one signed legally-binding LOI |
| 11 Cost Model v6 ★P0 | null→null (no V4) | pack `15-financial-summary.md` cost section + Goods Playable Model; verified BOM + $110,046 press capex (13 Jun) | Facility/site capex modelled not vendor-quoted ($112-222K factory; $100-150K/site); needs 3 vendor quotes (SIH advisory deliverable) | HUMAN-GATED — 3 external vendor quotes |
| 12 Investor Alignment Tool ★P0 | null→null (no V4) | pack `12-investor-alignment.md` + `Investor-Alignment-Tool-Goods-POPULATED.xlsx` (13-14 Jun); CSV + followup seqs `19/20` | Populated from real pipeline (no longer blank); blocked only on the same GHL reauth + written commitments + Area 09 (CASE knockout #2) | BUILDABLE — populate/refresh from wiki pipeline |

Notes:
- ★ = SIH-flagged priority opportunity area (P0). Areas 11/12 are Notion-added on top of the diagnostic's 10 and carry **null V4 scores**.
- Every "BUILDABLE" item still has a human-gated dependency downstream (reauth, vendor quote, board, signature) — see the catalyticBlockers ranking: #1 entity (09), #2 signed LOI (10/03), #3 finance reconciliation (04), #4 governance (07), #5 copy accuracy/AI-discipline (02).
- The pack's own honest headline (closure map): *documentation* is largely built (2 of 6 recommendations delivered in draft — MEL + risk register; financial model strong but needs sign-off). What remains is 5 real-world proofs no document can finish: (1) one signed legally-binding commitment, (2) accountant-endorsed GOC-only financials, (3) the legal-entity decision, (4) a measured in-source bed cost (50-bed run), (5) a consent-cleared story list — plus the 2 SIH/QBE-run projects (production-cost tool, market research).

---

## TABLE 2 — CANON NUMBERS (committed code vs 2026-06-08 Artifact Hub spine)

| Number | Value in code/data (cite file:line) | 2026-06-08 Artifact Hub spine | DRIFT? + note |
|---|---|---|---|
| Total revenue/funding received | **$741,111** — `grant-content.ts:140 totalReceived: 741_111`; `impact-model.ts:413,570 verifiedFinancials.revenueReceived` (the /impact denominator) | revenue 713,827 / 741,111 | **NO** drift in committed code — code holds $741,111 (the all-sources canon). The narrower **Goods-only carve-out $713,827** is NOT in code; it lives in `wiki/canon/needs-signoff.md`. |
| **Reconciled ~$907,569?** | **NO — not in any committed canon.** Code = $741,111. ~$907,569 exists ONLY in the committed *note* `…/03-revenue-reconciliation.md` (a recommendation to the accountant, explicitly unaudited, unsigned) | n/a | **Code is still 741,111.** The +$166,458 swing (TFN +$144,558, AMP +$21,900, FRRR +$0/double-count) → ~$907,569 is a *proposed* figure pending accountant sign-off + TFN void+rebook + bank dedup. **Not yet propagated to code/site.** |
| Washing machines — deployed | **28** — `asset-canonical.ts:6 washersDeployed: 28` (committed, clean) | washers 28 / 14 | **NO** drift in code. |
| Washing machines — working | **14** — `asset-canonical.ts:6 washersWorking: 14`; dashboard fallback `partners/[slug]/dashboard/page.tsx:545` hardcodes "14 machines in community today" | 28 / 14 | **NO drift in committed code. The "16 in community" figure is NOT in deployed/committed code — it is local/uncommitted** (per MEMORY: live dashboard shows 16 only after a future commit+deploy; the register still holds 28 rows so 16 is not row-derived). **Committed answer = 14 working / 28 deployed.** |
| Total beds | **496** — `asset-canonical.ts:6 bedsDeployed: 496` | beds 496 | **NO** drift. |
| Bed split (Basket vs Stretch) | **133 Stretch + 363 Basket = 496** — `asset-canonical.ts:6 stretchBedsDeployed: 133, basketBedsDeployed: 363` | (spine quotes 496 total) | **NO** drift. Plastic-kg derives from Stretch only (133 × 20). |
| Communities served | **9** served (10 distinct touched) — `asset-canonical.ts:6 communitiesServed: 9, distinctCommunities: 10` | communities 9 | **NO** drift. |
| HDPE kg diverted | **2,660 kg** — `asset-canonical.ts:6 plasticKg: 2660` (= 133 Stretch × 20kg, `PLASTIC_KG_PER_BED=20` in `products.ts:13`) | kg 2,660 | **NO** drift. |
| Stretch Bed price | **$750 AUD** — `canon.ts:121 value: 750` (source: Supabase `products` stretch-bed-single, `price_cents=75000`); `supplier-quotes.ts:181 WEBSITE_PRICE = 750`. **NOT in `products.ts`** (header: "NO PRICES — pricing handled separately via Stripe/Supabase") | price 750 | **NO** drift. |

### Direct answers to the two posed questions
1. **Washing-machine figure in DEPLOYED/committed code = 28 deployed / 14 working.** It is NOT 16. The "16 in community" canonical reframe (MEMORY 2026-06-11) is uncommitted/local; deployed dashboard fallback string is literally "14 machines in community today" and `asset-canonical.ts` reads 28/14.
2. **Revenue is NOT reconciled to ~$907,569 in any committed canon. Committed code is still $741,111** (`grant-content.ts:140`, `impact-model.ts`). ~$907,569 is a *proposed accountant figure* in a committed working-note only, gated on TFN void+rebook + bank dedup + scope sign-off — not propagated anywhere live.

---

## Staleness summary
- **Scores:** `qbe-areas.json` asOf 2026-06-02 (V4 = 1 May workshop); strategic-pack closure-map (13 Jun) reuses the same V4 scores but adds current "built" status. No newer scoring exists.
- **Revenue:** committed canon $741,111 (restated 2026-06-03, PR #74). The $907,569 reconciliation is the freshest *thinking* (2026-06-16, live-Xero re-verified read-only) but is unsigned and uncommitted-to-code. Carve-out $741,111-vs-$713,827 delta ($27,284) unresolved.
- **Pack durability risk:** the whole narrative pack + all area docs are uncommitted on branch `docs/snow-onepager-assets` working tree — flag for commit before relying on them as the pack of record.
