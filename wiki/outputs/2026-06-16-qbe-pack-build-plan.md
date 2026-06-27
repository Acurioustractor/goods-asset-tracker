# QBE Stage-2 pack: current state and build plan

**Date:** 2026-06-16 · **For:** Ben (+ Nic) · **Author:** Claude (review pass)
**Branch:** `docs/snow-onepager-assets` · **Status:** working plan, figures carry evidence labels.
**Sources:** the Artifact Hub (`378e…0725`), the Opportunity Hub (`380e…d84`), the live QBE Diagnostic DB (`cb37…16f5`), `wiki/canon/qbe-readiness.md`, the 2026-06-13 strategic pack, the 2026-06-16 opportunity-hub outputs, and a three-agent sweep of repo canon + live web surfaces + Notion (handoffs in `thoughts/shared/handoffs/qbe-pack/`).

---

## 0. Headline

The pack substantially **already exists**, but it is fragmented across surfaces, partly **uncommitted**, and split across **two Notion hubs** whose canon has begun to diverge from the newest (still-ungated) reconciliations.

- **Deployed canon and the Artifact Hub spine agree:** revenue **$741,111**, washers **28 deployed / 14 working**, beds **496** (133 Stretch + 363 Basket), **9** communities, **2,660 kg** HDPE, Stretch price **$750**. Zero numeric drift between committed code and the 06-08 spine.
- **The two forward changes are NOT deployed:** the **~$907,569** reconciled revenue (accountant-gated) lives only in a committed note; the **16 "in community"** washer reframe is local/uncommitted (deployed code + dashboard still say 14/28).
- **The whole 2026-06-13 strategic pack (≈30 files) is untracked** — it holds the draft artifacts for the weak areas (entity-wording, risk register, role map, governance, impact-method, operating model) and would be lost on a fresh clone.
- **One real bug:** `/impact` renders Centrecorp **109** beds vs **107** everywhere else.
- **Notion diagnostic DB rows 04/10/12** still carry the pre-reconciliation revenue workpaper.

---

## 1. What exists, by surface

| Surface | What it is | Freshness | Role in the pack |
|---|---|---|---|
| **Artifact Hub** (Notion `378e…0725`) | Canon spine + 4 pillars + 12-area matrix + gap list + shareable index | 2026-06-08 | **Master control tower** (spine slightly stale) |
| **Opportunity Hub** (Notion `380e…d84`) | Investor-outreach focus: dates, flags, hackathon, alignment tool, funder letters | 2026-06-16 | Investor-engine sub-hub (current; top-level Flag A revenue framing superseded) |
| **QBE Diagnostic DB** (Notion `cb37…16f5`) | 12 live diagnostic rows, all "Built – needs review" | rows 06-01 / 06-05 | Authoritative scores + gaps (revenue rows stale) |
| **Artifact Register DB** (Notion `5449…f294`) | Generated from `v2/src/lib/data/artifact-register.json` | live | Drift-tracked artifact index |
| **`/sites/qbe-readiness`** (gated web) | 12 areas → 1 goal / 5 proofs / timeline / scoreboard | 06-16 | **Funder-facing one-pager front door** |
| **`/sites/qbe`, `/investors`, `/sites/cost-lab`** (gated web) | Live cost-model cockpits + Cost Lab | live engine | The costing proof (areas 03/04/11) |
| **Strategic pack** (`wiki/outputs/2026-06-13-goods-strategic-pack/`) | ≈30 files: entity-wording, risk register, role map, governance, impact-method, operating model, playable model | 06-13 | **The per-area evidence — UNCOMMITTED** |
| **Opportunity-hub outputs** (`wiki/outputs/2026-06-16-qbe-opportunity-hub/`) | overview, cost-model access, investor alignment, revenue reconciliation, funder letters | 06-16 | Investor engine + reconciliation (committed) |
| **Pencil deck** (`design/goods-theory-of-change-v2.pen`) | The designed ≈19-slide pitch | in build | The visual artifact |
| **Public pages** | /pitch, /impact, /cost-story, /stories, /communities, /process, /stretch-bed, /partner, /press, /field-notes | mostly current; some stale figures | The public proof set |
| **Admin tools** | `/admin/loi-tracker`, `/admin/cost-model`, `/admin/roadmap`, `/admin/team` | live | Back-office (LOI tracker not yet funder-facing) |

---

## 2. The 12 areas → what to build → surface → who

`B` = buildable now by Claude (the artifact, from existing drafts/data). `H` = human-gated decision. Most P0s are `B+H`: I can surface/build the artifact; the underlying decision is Ben/Nic/accountant/legal.

| # | Area | Score | Build / update | Surface type | B/H |
|---|---|---|---|---|---|
| 01 | Vision & Ambition | 8→9 | Confirm entity/ownership wording (no new artifact) | /pitch, deck | H |
| 02 | Impact / MEL ★P0 | 5→8 | Surface the impact-measurement-method draft (`05`); consent-cleared story list | **New one-pager** + /impact section + Notion | B+H |
| 03 | Business Model ★P0 | 4→7 | Reconcile demand vs Xero; 50-bed cost-down run | /sites/qbe, /cost-story update | H |
| 04 | Financial Mgmt ★P0 | 4→7 | One accountant-signed Goods-only figure → propagate | /impact, cockpit, Notion, spine | H |
| 05 | Strategic / Risk ★P0 | 5→7 | Surface the scored risk register draft (`06`) | **New gated risk page** + Notion | B+H |
| 06 | Process & Tech | 7→8 | SOP docs; external Drive access test | /process, repo | B+H |
| 07 | Governance ★P0 | 5→8 | Surface governance framework (`18`); set approval path | Notion + /about | B+H |
| 08 | People & Org | 6→7 | Surface 12-month role map (`07`) | **New page / about section** | B+H |
| 09 | **Legal (keystone)** ★P0 | 5→7 | Surface + propagate ONE entity-wording block (`04`) | **New legal page** + every surface | B+H |
| 10 | Investors & Capital ★P0 | 6→8 | Funder-facing commitment / LOI view | **Gate the LOI tracker** | B+H |
| 11 | Cost Model v6 ★P0 | (no V4) | Attach 3 vendor quotes for facility/site capex | cockpit | H |
| 12 | Investor Alignment ★P0 | (no V4) | Refresh populated tool (done 06-16) | Notion + repo | B |

---

## 3. Canon truth status (resolve before anything cites it)

| Number | Deployed/committed | Newest reframe | Recommendation |
|---|---|---|---|
| Revenue received | **$741,111** (all-sources, `grant-content.ts:140`, `impact-model.ts:413/570`) | **~$907,569** (cash, Goods-attributable; +$166,458 swing; accountant-gated) | Keep **$741,111** as the citable figure on every surface with the "Xero workpaper, unaudited, not a Goods-only carve-out" caveat. Do **not** put $907,569 on public surfaces until the accountant signs. Carry the reconciliation as a flagged pending item. |
| Goods-only carve-out | **$713,827** (in `needs-signoff.md`, not in code) | — | Internal-only until signed. |
| Washers | **28 deployed / 14 working** (`asset-canonical.ts:6`; dashboard hardcodes "14") | **16 "in community"** (canonical-as-of 06-11, uncommitted) | DECISION NEEDED: propagate 16 everywhere or hold. If propagating, it touches `asset-canonical.ts`, the dashboard fallback, and any washer copy. |
| Centrecorp beds | **/impact = 109** (bug); 107 everywhere else | 107 | **Fix the 109→107 bug** (`impact/page.tsx:677-678`, `impact-model.ts:113,603`). |
| Beds / communities / kg / price | 496 / 9 / 2,660 / $750 | unchanged | No action. |

Notion clean-ups in the same truth pass: diagnostic DB rows 04/10/12 (old revenue), and the password drift (Area 11 row `OnCountry-E1C4AC` vs others `goods2026`).

---

## 4. The build plan (sequenced by leverage)

**Phase 1 — Truth pass (highest correctness value, lowest risk; mostly buildable).**
1. Fix the Centrecorp 109→107 bug on `/impact`.
2. Decide & apply the washer figure (16 vs 28/14) consistently.
3. Refresh the Artifact Hub spine: mark the revenue reconciliation pending, align washers, point to the Opportunity Hub correctly.
4. Update Opportunity-Hub Flag A (supersede the "$201,900 / $870–943K" line with the corrected ~$907,569 / +$166,458).
5. Align the diagnostic DB revenue rows + password.
6. Re-verify stale public figures: `/partner` TRACTION_STATS, `/pitch/document` washer tiers, `/press` date.

**Phase 2 — Make the pack durable (buildable).**
7. Commit the 2026-06-13 strategic pack (currently untracked) so it survives a clone and becomes part of the pack.
8. Decide the pack architecture (one master vs two hubs — see §5).

**Phase 3 — Build the missing area surfaces from existing drafts (buildable + human sign-off).**
9. Area 05: scored risk-register page (from pack `06`).
10. Area 09: entity-wording / legal-structure page (from pack `04`) + propagate the one wording block.
11. Area 02: impact-measurement-method one-pager (from pack `05`).
12. Area 10/12: funder-facing commitment / LOI view (gate `/admin/loi-tracker`).
13. Area 08: 12-month role map surface (from pack `07`).
14. Area 07: governance framework surface (from pack `18`).

**Phase 4 — Stale public-page updates** (depends on Phase 1 decisions): `/impact`, `/partner`, `/pitch/document`, `/press`.

**Phase 5 — Finish the Pencil deck.**

**Human-gated (flag, cannot build):** accountant signs ~$907,569; entity/ownership decision (keystone); first signed binding LOI; recruit 1–2 directors; 3 vendor quotes; the 50-bed in-source run.

---

## 5. Open decisions for Ben

1. **Number handling.** Keep $741,111 public + flag $907,569 pending (recommended), or push the reconciled figure / 16-washers now?
2. **Pack architecture.** One master (refresh the Artifact Hub as the single spine, Opportunity Hub stays the investor sub-hub, `/sites/qbe-readiness` is the funder front door) — recommended — vs keep two hubs and just bring them current, vs build a fresh single "QBE Stage 2 pack" page.
3. **Starting point / scope of this session.** Truth pass first (recommended) vs missing-surfaces first vs commit-and-consolidate first vs deck.
