# 00 — MASTER: Goods QBE Investor-Readiness Sweep

**Date:** 2026-05-29
**Author:** Claude (lead author, QBE investment sweep synthesis)
**Purpose:** Tie the whole sweep together and give the founder a co-pilot plan. This is the front door to the run — read this first, then the cost model (`01-*`), the Investor Alignment Tool (`02-*`), and the 10 area bodies (`area-1` … `area-10`).
**Top gate (unchanged):** ≥3 LOIs / ~AU$400K eligible non-QBE capital evidenced by **31 Aug 2026** = QBE Stage-2 match unlocks. QBE is an *output* of the stack, not an input.

**Claim labels used throughout:** `verified` (queried/primary-source) · `modelled` (derived, not confirmed) · `target` (goal/ask) · `future` (pathway not yet live) · `internal only` (pipeline/CRM/working figure — NOT committed capital, NOT QBE match evidence, NOT for external quoting).

---

## 1. Executive read

### What the sweep concludes about investor-readiness

Goods is **substantively further along than the SIH V4 diagnostic implies — but the gap is now evidence control, not analysis.** Across all 10 diagnostic areas the same pattern repeats: the analytical scaffolding exists (v0.1 models, drafts, live operating systems verified in code and Supabase), but the **founder-authored, signed, consent-cleared, accountant/lawyer-endorsed artifact layer does not yet exist**, and **stale finance/entity claims are still live in public code**. An investor meeting today would be defensible on substance and indefensible on artifacts.

Three areas are genuine **strengths** (Vision, Process & Technology — both P1; and the impact *substance* under Area 2). Five are **P0 priority gaps** (Areas 2, 3, 4, 7, 10). Four are **partial / P1** (Areas 5, 6, 8, 9). Every one of the 10 is "Built — needs review": the bottleneck is sign-off and cleanup, **not more narrative**. The single highest-leverage move is not building more — it is (a) cleaning stale public copy and (b) getting the founder to author/sign the drafts that already exist.

### The cost-model reframe headline (the one thing to get right)

The v5 model's headline "**fully-loaded $1,912/bed**" is arithmetically correct but economically misleading — it is fixed-cost absorption at ~2% factory utilisation (a year of founder time, rent, and field travel ÷ a 100-bed denominator). The v6 reconfiguration (`01-bed-cost-model-reconfigured.md`) splits it honestly:

> **"The next Stretch Bed costs ~$685 to make today (`modelled`, verified inputs) and ~$426 once we in-source plastic processing (`future`). Separately, the enterprise carries a ~$123K/yr fixed block — facility, founder *production* time, community field travel — that philanthropy funds today and bed margin covers at ~380+ beds/yr. The '$1,912' is fixed-cost absorption at pilot volume, not a marginal cost."**

The capital case is a **plastic-processing capital ask, full stop**: the HDPE kit carries an ~8.6× idiot index and ~$289/bed of Defy margin — essentially the entire in-sourcing prize. Capex (~$112K–$222K gross) only pays back above ~300 beds/yr, so the honest sequence is **buy Defy kits now, in-source when *committed* volume crosses ~300/yr**.

**Four must-fix guardrails on the cost story (from the cost critic — apply before any external quote):**
1. **NET CAPITAL ASK is internally inconsistent.** $112K–$222K gross capex *less* the $110,046 already invested (facility $100K + Carbatec $10,046) = **$2K–$112K, NOT the stated $90K–$200K**. Either the $110K is not deductible from *this equipment* capex (then quote **$112K–$222K gross** and drop "less already invested") or the net ask is **~$2K–$112K**. Resolve before quoting any capital number to QBE. Note this is *also* not the same quantity as the QBE match cap (§5 open decisions).
2. **Founder rate conflict drives everything.** $1,000/day (v5) vs Day-3 $560/day is a 78% gap that flows into the fixed block, per_bed_right, and breakeven. Until Ben/Nic confirm, present the fixed block and breakeven as a **band**: at $560/day fixed block ≈ **$109.5K** and factory breakeven ≈ **338 beds/yr**; at $1,000/day, **$122.7K** / **378 beds/yr**.
3. **Do NOT let the reframe imply the bed got cheaper.** v6 marginal $684.79 + fixed-per-bed $1,227 = **$1,912 exactly** — same number, re-partitioned. The honest claim is "marginal is $685 (→$426 in-sourced) and ~$1,227/bed is a fixed enterprise block that shrinks with volume" — **not that any cost was removed**.
4. **Bridge $600 vs $685.** A marginal cost can't exceed a fully-loaded cost, so the $600 codebase/FRRR/Day-4 figure and the $685 v6 marginal look contradictory side-by-side. One-line bridge: **the $600 excludes the $150 long-haul-to-community freight and the $1,227 fixed-cost absorption**; $534.79 (direct+assembly+LOCAL freight) → $684.79 adds the $150 long-haul reclassified out of overhead. Neither $600 nor $685 is green to quote as a bare "cost per bed" externally — both are `modelled`.

### What is GREEN to share vs HOLD

| GREEN to share (sourced / labelled) | HOLD — do NOT share until resolved/cleaned |
|---|---|
| Deployment: **496 deployed bed units**, 674 total product units, 27 community records, 10 communities (`verified`, asset register) | Any "**$1,912/bed**" figure unpaired with the marginal+fixed reframe |
| Paid revenue history, labelled: Snow **$402,929.79**, Centrecorp **$123,332**, VFFF **$50,000**, QIC $12,000 (`verified`, Xero mirror, *not audited*) | Stale Centrecorp **$208K paid / $420K commitment** (MEMORY.md still carries it; 10 invoices VOIDED since 21 May — $123,332 paid is canonical) |
| The cost reframe one-liner (§1), with marginal as `modelled` and capex band stated gross | Stale finance boilerplate live in v2 code: **$778,162**, **$445K** "grant to date", **$405,685** subtotal, "369+/520+/600+ beds", "~$3M capital stack close mid-2026", **DGR1 status**, "committed buyer pipeline", "community-owned" as *current* state |
| Idiot-index story (HDPE 8.6×, ~$289/bed Defy margin = the in-sourcing prize) | Any **capital ask number** until net-vs-gross (must-fix #1) AND QBE cap ($200K vs $400K) are resolved |
| QBE match is **contingent** on raising ~$400K eligible non-QBE capital first (`target`) | Pipeline **$3.42M active / $604,040 weighted** as anything but `internal only` — never as committed capital or match evidence |
| Cost-down trajectory tied to volume + in-sourcing milestones (labelled `target`/`future`) | Rotary **$82,500** as received — it is invoiced-NOT-received (a receivable) |
| Founder-time logic: fundraising days raise capital, commercialisation days recover in margin, only 30 production days touch the bed | Any founder-time-derived figure (fixed block, breakeven, per_bed_right) as final until Ben/Nic confirm rate/days/split |

---

## 2. Notion write plan — QBE Diagnostic Artifact Database

**Target DB:** QBE Diagnostic Artifact Database — https://www.notion.so/cb3794d427914d72bf1036106d8116f5

**Key finding:** all 10 area records **already exist** in the DB (URLs below, harvested from the area bodies). So the action is **UPDATE all 10** — set status, gap line, and proof links — **plus two new linked artifacts** for the cost model and the Investor Alignment Tool. **Tier-2 gate:** writing to Notion is a shared-state write — confirm with the founder before pushing (it is in §5 open decisions). The table below is the plan; do not execute until the founder says go.

| # | Area | Notion record | Action | Status field | Key field values to write |
|---|------|---------------|--------|--------------|---------------------------|
| 1 | Vision & Ambition | [36ee…cbf9](https://www.notion.so/36eebcf981cf8187b43cdb663f3dcbf9) | Update | Strength / P1 / Built–needs review | Gap: no founder-signed 1–3pp strategy narrative + no legal/governance-reviewed operating-model diagram; public bed count still unlocked. Strong substance, artifact layer not external-ready. |
| 2 | Social Objective & Impact | [358e…d317](https://www.notion.so/358ebcf981cf810bb68dcc6f8913d317) (Impact Claim Map) + Area-2 record | Update | **P0** / Built–needs review | Gap: /impact still says "Live Data"/"Every number is live" — no rendered provenance labels; no published ToC graphic; public/internal claim split drafted not shipped. Bottleneck = founder-authored consent-cleared collateral + cleaned copy. |
| 3 | Business Model Clarity | [36ee…deb4](https://www.notion.so/36eebcf981cf81fb8aa8de54f38bdeb4) | Update | **P0** / Built–needs review | Gap: no founder-approved buyer sheet, route-pricing matrix, clean LOI tracker, or top-down market sizing. Pipeline $3.42M active / $604,040 weighted is `internal only` — not committed capital, not match evidence. |
| 4 | Financial Management | [36ee…0e32](https://www.notion.so/36eebcf981cf8167884fc3d5ecda0e32) | Update | **P0** / Built–needs review | Gap: no single accountant-reviewed Goods-only 3-statement pack (carve-out, opening cash, AR/AP, capex/inventory, R&D, GST, locked founder FTE). **Link the cost model here** (primary home). |
| 5 | Strategic Planning & Risk | [36ee…60d7](https://www.notion.so/36eebcf981cf8143a283efd1eb5260d7) | Update | Partial / P1 / Built–needs review | Gap: no board/advisory-grade risk register (named owners, residual risk, review cadence, trigger table); recycled-plastic environmental risk not yet explicit; v0.1 unsigned. |
| 6 | Process & Technology | [36ee…2b57](https://www.notion.so/36eebcf981cf81659f6afab915672b57) | Update | Strength / P1 / Built–needs review | Gap: live systems verified in code/Supabase, but SOPs, owner rules, stale-data checklist and founder-dependency reduction plan unwritten/unsigned. Need the source-of-truth matrix. |
| 7 | Governance, Data & Reporting | [36ee…703a](https://www.notion.so/36eebcf981cf813e9b6fc95d4e5a703a) | Update | **P0** / Built–needs review | Gap: no formal governance system for the trading entity — board/advisory ToR, delegations/decision-rights matrix, COI register, consolidated reporting calendar all v0.1, unsigned. |
| 8 | People & Organisation | [36ee…0971](https://www.notion.so/36eebcf981cf813cbfbbca1709600971) | Update | Partial / P1 / Built–needs review | Gap: GM/ops + BD/sales-ops/procurement role briefs drafted not approved; fair-market founder FTE rates not set with accountant; no signed 90-day delegation plan off Ben/Nic. |
| 9 | Legal Structure | [36ee…0718](https://www.notion.so/36eebcf981cf8106b398d52438170718) | Update | Partial / P1 / Built–needs review | Gap: signed legal review + populated IP register + contracting-party checklist wired into the site; quarantine stale DGR/entity claims in live code + funder pages. |
| 10 | Investors & Capital Raising | [36ee…1bf9](https://www.notion.so/36eebcf981cf81329a11e33e2d121bf9) | Update | **P0** / Built–needs review | Gap: no founder-authored investor pack, no signed LOIs, QBE Stage-2 terms unconfirmed ($200K vs $400K), uncleaned funder/public copy. **Link the Investor Alignment Tool here** (primary home). |
| — | **Cost Model v6 (reconfigured)** | NEW artifact in DB | **Create** | Built–needs review | Title "Stretch Bed Cost Model v6 — marginal/fixed reframe + idiot index". Relate to Area 4 (primary) + Area 3 + Area 10. Files: `01-bed-cost-model-reconfigured.md` + `01-cost-model-idiot-index.json`. Note the 4 must-fix guardrails (net-vs-gross, founder-rate band, no-cost-removed, $600↔$685 bridge). |
| — | **Investor Alignment Tool (populated)** | NEW artifact in DB | **Create** | Built–needs review | Title "Investor Alignment Tool — 8 knockout + 14 fit, 15 investors scored". Relate to Area 10 (primary) + Area 3. File: `02-investor-alignment-tool-populated.md`; xlsx target `tmp/qbe-sweep/iat-2026-full.txt`. Flag: QBE match contingent; no committed 2026 capital claimed. |

**Where the two new artifacts link in:** Cost Model → Area 4 (financial pack) as primary, cross-linked to Area 3 (business-model unit economics) and Area 10 (the capital ask sits on it). Investor Alignment Tool → Area 10 (investor pack) as primary, cross-linked to Area 3 (buyer/match evidence). If the DB has a "Master synthesis" or "Run index" property, point all 12 rows at **this file** (`00-MASTER-qbe-investment-sweep.md`).

**Per-record proof-link discipline:** each area body already lists its proof links (Notion sub-pages + wiki `2026-05-29-qbe-area-NN-*-full-review.md` + canonical numbers sheet). When updating each record, paste that area's proof-links block into the record so the diagnostic artifact is self-contained.

---

## 3. Investor Alignment Tool — population summary + how to drop into the .xlsx

**Source artifact:** `02-investor-alignment-tool-populated.md`. **xlsx/text target:** `tmp/qbe-sweep/iat-2026-full.txt` (transcribe before any funder conversation).

**What was populated:**
- **Tab 1 — Our Needs:** all **8 knockout** criteria (all High) + all **14 fit** criteria with Goods' priority set (8 High-priority fit: M, N, O, Q, S, U, V, W). The structural constraint is flagged in every relevant row — **QBE match is contingent on raising ~$400K eligible non-QBE capital first**.
- **Tab 2 — Investor Tracking:** **15 investors/instruments** with engagement stage, likelihood, labelled amount, owner, blockers, value-adds, red flags, priority. Every dollar is labelled; **no committed 2026 capital is claimed** anywhere.
- **Tab 3 — Alignment Scoring:** knockout score (Don't-Know-on-any-knockout = No, per methodology) + fit score + one-line verdict per investor.

**Verdict tiers (the operative output):**
- **Close now (match-critical):** QBE/SEFA, **Snow**, **SEFA**, **Centrecorp** — the realistic ~$400K eligible match by 31 Aug. Snow + Centrecorp + SEFA landing first is what triggers QBE.
- **Pursue, right-sized / partner-led:** Minderoo (right-size + clean the overclaiming page first), Oonchiumpa/REAL (consortium, due 2 Jun), Butterfly (own future DGR vehicle).
- **Park / warm / research:** VFFF, PFI, IBA (Year 2–3), PRF/Paul Ramsay, FN Clean Energy, QIC.
- **Finance/AR (not investors):** R&D Tax Incentive (~$80K/yr offset, fix the ~$120K mistags), Rotary ($82,500 outstanding — collect, don't pursue as capital).

**How to drop it into the .xlsx (mechanical steps):**
1. Open the live IAT workbook (`tmp/qbe-sweep/iat-2026-full.txt` is the text mirror of the sheet). Tab 1 columns are pre-mapped: knockouts → cols **E–L**, fit → cols **M–Z** (see the `Col` column in the md).
2. **Tab 1:** paste each criterion's priority (High/Medium) and "Our need" text into its mapped cell.
3. **Tab 2:** one investor per row; transcribe the 9 fields. **Apply every claim label as a cell note/comment** (`verified`/`modelled`/`target`/`future`/`internal only`) — the labels are the audit trail and must survive the transcription.
4. **Tab 3:** enter knockout score as `n/8`, fit as `n/14`, verdict text. Keep the "Don't Know = No" rule visible in the header.
5. **Do NOT hard-code any pipeline $ as committed.** The 7 open research actions (bottom of the md — QBE cap, Centrecorp timing, Snow R4/R5, SEFA covenant, Oonchiumpa share, PRF EOI, pipeline reconciliation) are each a "Don't Know" to resolve; track them as a checklist tab.
6. Save the xlsx alongside the md in `wiki/outputs/2026-05-29-qbe-investment-sweep/` (or keep in `tmp/qbe-sweep/` if it stays internal-only) and link it from the Notion Area-10 record + the new IAT artifact.

---

## 4. Co-pilot sequence — work the 10 areas with the founder, one by one

**Ordering principle:** P0 first; within P0, lead with the areas that unblock the most downstream artifacts; build a model/diagram only where it changes a decision or is required external evidence. Each step is a **founder working session** — the deliverable is a *signed* artifact, because sign-off (not analysis) is the gap.

**Pre-flight (do before Session 1 — 30 min, founder must be in the room):** resolve the §5 open decisions, because **almost every P0 artifact inherits them** (founder rate/days/split → cost model + finance pack + capital ask; opening cash → cashflow; QBE cap → investor pack). Do not start building signed collateral on unconfirmed inputs.

| Order | Session | Area(s) | Why here | Build a model/diagram? |
|------:|---------|---------|----------|------------------------|
| **1** | **Finance lock + cost story** | **4** (+ cost model) | P0. Everything quantitative inherits from here. Resolve net-vs-gross capital ask, founder-rate band, $600↔$685 bridge. | **YES — the highest-value build.** Goods-only **3-statement model** (P&L + balance sheet/working-capital + 36-mo cashflow + scenario tabs + provenance-labelled assumptions). The cost model v6 feeds COGS. Accountant sign-off after. |
| **2** | **Investor evidence control** | **10** (+ IAT) | P0. The meeting's purpose. Depends on Session 1's numbers. | **YES — the IAT is the model.** Plus a founder-authored **investor one-pager / use-of-funds** built on the locked finance pack and the resolved capital ask. No signed LOIs yet — show the pipeline labelled, not as commitments. |
| **3** | **Business model + buyer evidence** | **3** | P0. Converts the finance + investor work into the *demand* story; the LOI tracker here is the match evidence QBE needs. | **YES — diagram.** 4-lane **segment/route-pricing matrix** + clean **LOI tracker** + a top-down market sizing (one slide). Reconcile pricing to the $750 / cost-down trajectory. |
| **4** | **Impact: ship the claim split + ToC** | **2** | P0. The integrity fix — /impact still says "Live Data". Cleaning this removes a live external-leak risk and is mostly *cleanup + publish*, not new build. | **YES — diagram (ToC graphic) already exists in source.** Render impact-provenance labels on /impact; publish the Theory-of-Change graphic; ship the public/internal claim split into founder-signed report templates. |
| **5** | **Governance system for the trading entity** | **7** | P0. Investors fund a governable entity. v0.1 drafts exist; founder + (ideally) one director sign them. | Diagram: **one-page governance map** (entities + board/advisory + decision rights). Then sign ToR, delegations/decision-rights matrix, COI register, reporting calendar. |
| **6** | **Strategic narrative + operating-model diagram** | **1** | P1 strength — but it underpins the investor pack, so do it right after the P0s. | **YES — diagram.** Legal/governance-reviewed **operating-model diagram** + founder-signed 1–3pp strategy narrative. Unlock the canonical public bed count here. |
| **7** | **Risk register, board-grade** | **5** | P1. Pull strategy out of founder judgement into a signed register; add the recycled-plastic environmental risk the diagnostic flagged. | No new model — **risk register table** (named owners, residual risk, review cadence, trigger table). Sign it. |
| **8** | **People / capacity off the founders** | **8** | P1. The 90-day delegation plan depends on the GM/ops + BD role briefs and the FTE rates locked in Session 1. | No model — approve role briefs, set fair-market founder FTE with the accountant, sign the **90-day delegation plan**. |
| **9** | **Legal + IP + contracting + copy cleanup** | **9** | P1. Lawyer-signed review + IP register + contracting-party checklist; **quarantine stale DGR/entity claims in live v2 code** (cross-cuts Areas 2, 4, 10). | No model — signed legal memo + populated **IP register** + a code/copy cleanup PR (DGR1, $778,162, $445K, "community-owned", "committed buyer pipeline"). |
| **10** | **Process: SOPs + source-of-truth + founder-independence** | **6** | P1 strength. Last because it documents what already runs; depends on owners named in Sessions 5 & 8. | Diagram: **source-of-truth matrix** (Supabase/GHL/Notion/Xero/EL/Drive). Then SOPs, owner rules, stale-data checklist, founder-dependency reduction plan. |

**Cross-cutting cleanup task (run in parallel from Session 1, lands fully in Session 9):** strip the stale claims still live in `v2/src/lib/data/funder-shared-content.ts`, `funder-pages.ts`, and `grant-content.ts` — `$778,162`, `$445K`, `$405,685`, `369+/520+/600+ beds`, `~$3M capital stack close mid-2026`, `DGR1 status`, `committed buyer pipeline`, `community-owned` as current state. These are a live external-leak risk on the public site **regardless of meeting prep** and should not wait for Session 9 to be *flagged* (the code fix can land there).

---

## 5. Open decisions — founder only

These cannot be modelled away. Every downstream artifact in §4 inherits at least one of them. Resolve in the pre-flight before building signed collateral.

1. **Founder FTE rate.** $1,000/day (v5) vs $560/day (Day-3 $140K/yr basis) — a 78% gap. Pick the defensible rate. Until then the fixed block and breakeven are a band ($109.5K / 338 beds at $560; $122.7K / 378 beds at $1,000). *Owner: Ben + Nic.*
2. **Founder days/yr + the 30/50/25/45 split.** Total days on Goods (150 assumed, not time-tracked) and the production/fundraising/commercialisation/governance allocation. Drives which costs touch the bed vs sit in the fixed block vs are cost-of-capital. *Owner: Ben + Nic.*
3. **Opening cash at 1 May 2026.** The 36-month cashflow uses a $50K placeholder; the cash-trough depth is highly sensitive to it. The finance pack (Session 1) cannot close without the real number. *Owner: Ben.*
4. **Net-vs-gross capital ask.** Decide whether the $110,046 already invested is deductible from *this equipment* capex. If not → quote **$112K–$222K gross**. If yes → ask is **~$2K–$112K**. (Separate from the QBE match cap.) *Owner: Ben.*
5. **QBE Stage-2 match cap + eligible-instrument definition.** Docs conflict **$200K vs $400K**, and whether recoverable grant / concessional debt counts as match is unconfirmed. Confirm with QBE/SIH before any capital number is stated externally. *Owner: Ben (with SIH).*
6. **Which pipeline figures are confirmable as evidence.** Snow R4/R5 written commitment (vs cumulative-received $402.9K), Centrecorp next-round timing + which invoices stand (vs voided), SEFA covenant terms, Oonchiumpa Goods-share + contracting entity, whether a PRF/Paul Ramsay EOI actually exists. Each unconfirmed item stays `internal only`. *Owner: Ben / Nic.*
7. **Whether to write to Notion now.** Pushing the 10 record updates + 2 new artifacts to the Diagnostic Artifact DB is a Tier-2 shared-state write visible to teammates. The plan in §2 is ready; **it executes only on the founder's go.** *Owner: Ben.*

---

## Appendix — run artifacts (all paths absolute)

- Master synthesis (this file): `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-29-qbe-investment-sweep/00-MASTER-qbe-investment-sweep.md`
- Cost model v6: `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md`
- Cost model idiot-index JSON: `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-29-qbe-investment-sweep/01-cost-model-idiot-index.json`
- Investor Alignment Tool: `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-29-qbe-investment-sweep/02-investor-alignment-tool-populated.md`
- Area bodies: `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-29-qbe-investment-sweep/area-{1..10}-*.md`
- QBE Diagnostic Artifact Database: https://www.notion.so/cb3794d427914d72bf1036106d8116f5
