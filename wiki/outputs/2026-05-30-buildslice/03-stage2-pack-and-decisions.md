# Goods Capital-Raise — Stage-2 Pack & Open Decisions (inventory)

**Captured:** 2026-05-30 · **Read-only inventory** for a later checklist-builder step. Relative dates converted to absolute (today = Sat 30 May 2026).

**Sources (do not re-derive financials — cite these):**
- Arc: `wiki/outputs/2026-05-30-capital-raise-session-handoff.md`
- Calendar: `wiki/outputs/2026-05-30-tier1-6week-action-calendar.md`
- LOI close-plan: `wiki/outputs/2026-05-30-goods-loi-close-plan.md`
- Model dir: `wiki/outputs/2026-05-29-qbe-investment-sweep/` (map: `_START-HERE-models.md`)

> **The one insight (from the arc):** every piece of the raise is ready except the two things only humans produce — **signed paper and a handful of decisions.** 0 signed LOIs today, no accountant-frozen number, 4 open decisions. The QBE 1:1 match is an *output* of capital raised first → this is **conversion, not discovery.**

---

## Stage-2 pack: built vs missing

### BUILT (artifacts exist in repo, verified by directory listing 2026-05-30)

| Artifact | Path | Role / state |
|---|---|---|
| **THE model** | `…/2026-05-29-qbe-investment-sweep/Goods-Playable-Model-v2.1.xlsx` | Playable, balancing 36-mo 3-statement. BS = 0 every month (max dev 2.3e-10). Cash trough −$177,292 → +$212,278 by M36 with QBE $200K (Sep-26) + SEFA $300K (Nov-26) + philanthropy $500K (Jan-27) wired in. Recalc-verified via `formulas` engine. Provenance: `…v2.1.provenance.md`. |
| **Audited companion** | `…/Goods-3-Statement-Model-v0.3.xlsx` | Trust layer — provenance-labelled figures + "Founder Inputs to Close" tab (11-gate finance-chat agenda, 2 done / 9 remaining). Provenance: `…v0.3.provenance.md`. |
| **Model map** | `…/_START-HERE-models.md` | Points to the two current files; 6 superseded workbooks archived → `_archive/2026-05-30-superseded-workbooks/`. |
| **Investor alignment tool** | `…/Goods-Investor-Alignment-Tool-2026.xlsx` | Separate QBE capital-raise alignment deliverable (not part of the model lineage). |
| **Pitch-deck blueprint** | `wiki/outputs/2026-05-30-goods-worlds-best-pitch-deck-blueprint.md` | 16-slide blueprint (8-agent workflow). THE ONE THING = close first ~$400K signed match-eligible non-QBE capital. Critic verdict carried: "strong proof, unproven economics, unsigned money." |
| **LOI close-plan + 1-pg template** | `wiki/outputs/2026-05-30-goods-loi-close-plan.md` | Snow / Centrecorp / SEFA per-funder ask, sequence, math (≥3 sigs → >$400K). §0 = confirm match-eligibility with QBE first. Reusable LOI template embedded. |
| **Expanded capital universe** | `wiki/outputs/2026-05-30-goods-expanded-capital-universe.md` | ~55 non-equity sources; detail in `thoughts/shared/handoffs/funder-discovery/0{1,2,3}-*.md`. Tier-1 six: Minderoo $840K–1.5M, First Australians Capital, Paul Ramsay $500K, Tim Fairfax $300K, PICC, Snow/Centrecorp/SEFA. |
| **6-week action calendar** | `wiki/outputs/2026-05-30-tier1-6week-action-calendar.md` | Dated/owned Mon 1 Jun → Sun 12 Jul 2026, Tier-1 six + the two 1-July deadlines. |
| **Matt SIH cost-advisory bundle** | `…/2026-05-29-qbe-investment-sweep/matt-document-bundle/` | 5 files: `01-bill-of-materials.md`, `02-supplier-quotes.md`, `03-cost-model-and-build-paths.md`, `04-verified-financials.md`, `README.md`. Due Matt END JUNE (2026-06-30). |

**Operating system for the raise:** `/admin/loi-tracker` (reads GHL live) — code in **PR #50**, currently OPEN/unmerged. Merging it gives the close-plan + match rollup a live home QBE can be shown.

### MISSING / NOT YET PRODUCED (the gating gaps — all human-dependent)

| Gap | Why it blocks the pack | Owner |
|---|---|---|
| **0 signed LOIs** | The QBE match pays only against capital raised/evidenced first. Pack needs ≥3 signed/committed match-eligible commitments (~$400K+). None signed as of 2026-05-30. | Ben + Nic |
| **No accountant-frozen revenue number** | Standard Ledger ("the finance chat") sign-off not yet engaged. Gates SEFA + all diligence + the single quotable revenue figure. v0.3 carries 9 open accountant gates. | Standard Ledger + Ben/Nic |
| **Model not re-pulled for external share** | v2.1 pinned to 2026-05-29 ACT-GD Xero mirror with a documented **+$1,200 drift (INV-0327 John Villiers Trust)** — re-pull before any external send. | Ben |
| **Opening cash = $50K placeholder** | Gate #1, the single highest-leverage model input; still a placeholder, not a carve-out figure. | Ben |
| **Stage-2 pack not yet assembled** | Calendar Week 6 (6–12 Jul 2026) task: assemble deck + v2.1 + LOI tracker + use-of-funds into one pack — only after signatures + frozen number land. | Ben |
| **QBE match-eligibility definition unknown** | What counts (signed LOI vs MOU vs executed; does SEFA debt or a bed-PO count; per-source cap/min?) is unconfirmed — it's the §0 question in the drafted Jay email. | Jay/SIH → Ben |

---

## Open decisions (owner + current state)

> Only Ben/Nic can make these. All four are flagged "Week 1" in the calendar (Mon 1 – Sun 7 Jun 2026).

| # | Decision | Owner | Current state (2026-05-30) | Gates |
|---|---|---|---|---|
| 1 | **QBE cap — $200K vs $400K** | Ben / Nic | OPEN. Model currently runs the **conservative $200K** end of the contingent $200K–$400K cap (dial `Investment & Financing`!B33). Sets the target raise size. | Target size; what counts toward match |
| 2 | **Entity / Indigenous-ownership structure** | Ben + Nic (+ Oonchiumpa) | OPEN. Longest lead item. | First Australians Capital, IBA, **Supply Nation (1-July 51% rule)**, SEDI FN, and the whole IPP government-procurement lane |
| 3 | **Reconcile the $201,900 phantom** | Ben | OPEN. = TFN $130K + old-FRRR $50K + AMP $21,900. **Not in live Xero** → currently excluded from match. Decide whether to chase/label or write off. | Match total integrity; the frozen number |
| 4 | **PICC $436,700 — Goods vs ACT-PI attribution** | Ben | OPEN. $436,700 already **paid** (Palm Island) — the single largest cash line; attribution between Goods and ACT-PI unconfirmed. Also chase INV-0317 ($36,300). | Reframes the largest cash line; affects revenue base + "buy the facility" + $36K order narrative |

---

## Time-boxed actions (1-July deadlines flagged)

### ★ TWO HARD 1-JULY DEADLINES (Wed 1 July 2026 — calendar Week 5)

| ★ | Deadline | What | Owner | Note |
|---|---|---|---|---|
| ★ | **Wed 1 Jul 2026** | **NEMA Disaster Ready Fund Round 4** — applications close | Ben (+ state Lead Agency partner) | Flat-pack washable beds = remote disaster re-supply ("remote resilient household kit"). Needs a go/no-go in Week 1 + a Lead Agency partner; draft Week 2; finalise Week 4; submit Week 5. |
| ★ | **Wed 1 Jul 2026** | **Supply Nation certification** — 51%-ownership rule | Ben (+ Oonchiumpa) | **Highest-leverage single unlock.** Gates the entire IPP government-procurement lane (+ FAC, IBA). Depends on Decision #2 (entity/ownership). Longest lead — kick off Week 1, submit "well before 1 July" (calendar targets Week 3, 15–21 Jun). |

### Original pending pre-send items (from session start — current state)

| Item | State | Action needed | Owner |
|---|---|---|---|
| **Pick THE model file** | ✅ DONE | — (resolved → `Goods-Playable-Model-v2.1.xlsx`) | — |
| **Set opening-cash gate #1** | ⏳ OPEN | Replace the $50K placeholder with the real carve-out figure (single highest-leverage input). | Ben |
| **Re-pull ACT-GD Xero mirror** | ⏳ OPEN | Re-pull for the **+$1,200 INV-0327 drift** (John Villiers Trust, grant, now paid) + any later movement, before any external share. | Ben |
| **Replace the Drive sheet with v2.1** | ⏳ OPEN | The hi@act.place Drive sheet still holds the old `Goods-Financial-Model.xlsx` — replace with v2.1 if sending externally. | Ben |
| **Send the Jay (SIH/QBE) email** | ⏳ OPEN | **Delete the 04:34 dupe draft, THEN send the 04:40** (carries the buyer/demand HMW). In it: ask QBE to **define match-eligibility** + ask for a **warm intro to First Australians Capital**. *Both clicks must be done by Ben — Gmail tools here are read/draft only.* | Ben |
| **Engage Standard Ledger ("the finance chat")** | ⏳ OPEN | The keystone — gates SEFA, all diligence, and the one frozen revenue number; closes 9 open model gates. | Ben + Nic |
| **Merge PR #50** (`/admin/loi-tracker`) | ⏳ OPEN | Merge first (operating system for the calendar). PRs #47–52 all open/mergeable/CI-green/unreviewed; #51 stacked on #50. | Ben |

### Calendar critical path (3 things that sink the window if they slip — all start Week 1, Mon 1 Jun 2026)
1. **Supply Nation cert + entity/ownership structure** — the 1-July 51% deadline; longest lead.
2. **Standard Ledger sign-off** — gates SEFA + all diligence + the frozen number.
3. **QBE match-eligibility definition** (from Jay) — gates the LOI form and what counts.

### Key downstream dates (from calendar / close-plan)
- **Tue 30 Jun 2026** — Centrecorp board (next-round decision / possible bed PO). Get *why* they declined the 3 quotes before re-asking.
- **End June 2026 (2026-06-30)** — Matt SIH production-cost advisory bundle due.
- **~Mid-July 2026** — Snow written R4/R5 tranche commitment target (~$150K new).
- **August 2026** — SEFA conditional term sheet target (drawdown Nov 2026).
- **Sun 12 Jul 2026** — assemble the Stage-2 pack (deck + v2.1 + LOI tracker + use-of-funds).
- **~Sep 2026** — QBE Catalysing Impact Stage-2 applications window (Steering Committee assesses ~Oct, outcomes ~Nov). The match pays only against capital evidenced *first*.
