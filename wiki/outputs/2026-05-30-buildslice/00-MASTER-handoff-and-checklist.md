# Build-Slice — MASTER Handoff & Checklist

**Date:** 2026-05-30 · **For:** Ben · **The split:** what the workflow already built (done, in repo) vs what only a human (Ben/Nic) can decide / send / execute. Tier tags follow the workflow rules (T2 = post a one-line "proceed?"; T3 = needs an explicit verb from you).

> The workflow wrote docs and code. It executed **zero** GHL writes, **zero** merges, **zero** sends. Everything below the line is yours.

**Source docs (this slice):** [`01-ghl-pipeline-audit.md`](./01-ghl-pipeline-audit.md) · [`02-pr-merge-readiness.md`](./02-pr-merge-readiness.md) · [`03-stage2-pack-and-decisions.md`](./03-stage2-pack-and-decisions.md) · [`04-oncountry-production-pipeline-design.md`](./04-oncountry-production-pipeline-design.md). All four present — no gaps.

---

## 1. What the workflow produced

| Artifact | One line | Link |
|---|---|---|
| GHL pipeline audit | All 10 live pipelines enumerated; 3 are canonical Goods; $846K GHL-cash vs $588K Xero gap flagged; read-only, nothing written. | [`01-ghl-pipeline-audit.md`](./01-ghl-pipeline-audit.md) |
| PR merge-readiness | #47–52 all green/mergeable; exact ordered merge sequence; the one hard conflict (#48↔#52) + the stack (#51 on #50) mapped. | [`02-pr-merge-readiness.md`](./02-pr-merge-readiness.md) |
| Stage-2 pack & decisions | Raise artifacts built-vs-missing; 4 open decisions; the two 1-July deadlines; Week-1 critical path. | [`03-stage2-pack-and-decisions.md`](./03-stage2-pack-and-decisions.md) |
| On-Country Production pipeline design | Build-ready spec for the 5th Goods pipeline (9 stages, custom fields, tags, asset joins); design only, no GHL write. | [`04-oncountry-production-pipeline-design.md`](./04-oncountry-production-pipeline-design.md) |

---

## 2. PR merge plan — **Tier 3 · needs your explicit merge**

Final order: **47 → 49 → 50 → 51 (retarget) → 48 → 52 (rebase)**. All six are CI-green and mergeable; the only hard ordering constraint is #48↔#52 (3-file conflict — loser rebases), plus #51 is stacked on #50 (not main). Commands shown, not run.

| Step | PR | What | Command |
|---|---|---|---|
| 1 | **#47** investor cockpit | Isolated, zero overlap. Land first. | `gh pr merge 47 --squash --delete-branch` |
| 2 | **#49** operating-systems | Only shared file = `admin-sidebar.tsx` (auto-merges). | `gh pr merge 49 --squash --delete-branch` |
| 3 | **#50** LOI tracker | Base of the #51 stack — must land before #51 retargets. | `gh pr merge 50 --squash --delete-branch` |
| 4 | **#51** audience comms + reports | **Retarget off `feat/admin-loi-tracker` → main, then merge.** Because Steps 1–3 squash, rebase `--onto` is the clean path. | `gh pr edit 51 --base main` → `git fetch origin && git switch feat/audience-comms-and-impact-reports && git rebase --onto origin/main origin/feat/admin-loi-tracker && git push --force-with-lease` → `gh pr merge 51 --squash --delete-branch` |
| 5 | **#48** public-copy quarantine | First of the conflicting pair (smaller/copy-only — makes #52's rebase mechanical). | `gh pr merge 48 --squash --delete-branch` |
| 6 | **#52** asset canonical counts | **Rebase onto main, resolve 3-file conflict** (`content.ts`, `grant-content.ts`, `outreach-targets.ts` — mostly "take both"), build, then merge. | `git fetch origin && git switch fix/asset-canonical-counts && git rebase origin/main` → resolve 3 files → `git add … && git rebase --continue` → `cd v2 && npm run build` → `git push --force-with-lease` → `gh pr merge 52 --squash --delete-branch` |

**Retarget note (#51):** its base is currently `feat/admin-loi-tracker`, NOT main — retarget only after #50 lands or the diff looks wrong / it won't merge.
**Conflict note (#48↔#52):** order is interchangeable; pick #48 first. Resolutions target different facts — keep #52's canonical counts, keep #48's copy wording, take both where they don't overlap.
**Pre-share gate (not a merge blocker):** set `INVESTORS_PASSWORD` in Vercel before sharing the #47 `/investors` URL with QBE (falls back to a default if unset).

### Also — **#38** cost-model v6 → **Tier 3 · recommend CLOSE** (superseded)
DIRTY/conflicting; edits the old `cost-model-explorer.tsx` which main has refactored into the 3-skin cockpit. The v6 intent already shipped via PRs #41/#44/#45/#46. Your call:
```bash
gh pr close 38 --comment "Superseded by v6 cockpit on main (PRs #41/#44/#45/#46). Closing."
```

---

## 3. GHL write proposals — **Tier 2 · propose → approve → build**

GHL writes are shared-state/reversible — each needs your one-line "proceed". Two batches: **hygiene** (from the audit) and the **new production pipeline shell** (from the design).

### 3a. Hygiene moves (audit §3)
| # | Proposal | Pipeline | Action |
|---|---|---|---|
| H1 | Confirm Centre Canvas end-state | Buyer | Already `abandoned`; recommend leave abandoned, keep the *contact* + supplier tags. Just confirm. |
| H2 | Reset/confirm WHSAC $1,700,000 | Buyer | 93% of board $ sitting at first stage — qualify+stage-up if real, else reset value. |
| H3 | Review Centrebuild/Centrecorp opp | Buyer | Centrecorp declined 3 quotes — move to realistic stage or mark parked. |
| H4 | Route Laura McConnell Conti | Universal Inquiry | Unrouted Goods inquiry → Buyer or Supporter Journey, or action/close. |
| H5 | Triage spam-looking inquiry | Universal Inquiry | `javi_tess92@outlook.com` random-name opp (2026-05-30) — verify or delete. |
| H6 | Add `grant` tag to grant-type opps | Supporter Journey | Append-only on FRRR/VFFF/QIC/AMP/Snow… honours the routing rule. Safe. |
| H7 | Decision-record fix (**Tier 1 — can do now**) | Grants (legacy) | "Grants (legacy) = Grantscope prospect dump, NOT a merge target." Reverses prior assumption; real Goods grants already live in Supporter Journey. |
| H8 | (Optional) Retire empty Supporters & Donors | Supporters & Donors | 0 opps — retire or commit to populating. Clutter only. |
| H9 | (Optional, **Tier 3**) Archive 435 Grantscope prospects | Grants (legacy) | Bulk status change, low value — recommend leave as-is. |

**Reporting-hygiene (no write):** flag the **A Curious Tractor org-pipeline double-count** (VFFF $50K, First Greate Bed $37,620, Central Australian Pilot $53,900, Weave Beds Utopia $85,712 — all also in Supporter Journey) anywhere funder $ is summed by hand. Keep the **$846,177 GHL-cash vs $588,262 Xero-verified gap** visible (already shows in `/admin/loi-tracker`).

### 3b. New "On-Country Production" pipeline (design §8) — the 5th Goods pipeline
**The make-it-yourself ladder — unit = a community owning its plant, NOT a sale.** The GHL MCP has **no create-pipeline/stage/field tool**, so the shell is built **by hand in the UI**; code/MCP only fills opps afterward (mirrors the Supporter-Journey precedent).

1. **Create pipeline** `Goods — On-Country Production` (keep the `Goods —` prefix).
2. **Add 9 stages in order:** Community Interest → Local Champions → Feasibility & Fit → Capability Building → Facility Stand-Up → Operating (Goods-supported) → Community-Owned → Paused → Stood Down.
3. **Create custom fields** under a `Goods — On-Country Production` group, all keys prefixed `goods_prod_*` (opp-level = the facility; contact-level = champions/trainees) — exact fields/options in design §4.
4. **Confirm back to code:** stage names match + post the GHL stage UUIDs. Then (separate, post-approval): wire `production` into `loi-pipeline.ts`, add the `community-makers` segment, seed opps one community at a time (each approved).

**Guardrail:** `monetaryValue` here = a *capex ask*, never revenue, never into the QBE match. Beds made flow through `getCanonicalAssetRollup()` (no second count). Plastic stays Stretch-only, 20kg/bed.

---

## 4. Decision checklist — **Ben & Nic** (the 4 open decisions)

All four are flagged Week-1 (Mon 1 – Sun 7 Jun 2026). Only Ben/Nic can make them.

| # | Decision | Owner | Current state | Unblocks |
|---|---|---|---|---|
| 1 | **QBE cap — $200K vs $400K** | Ben / Nic | OPEN. Model runs the conservative $200K end (dial `Investment & Financing`!B33). | Target raise size; what counts toward match. |
| 2 | **Entity / Indigenous-ownership structure** | Ben + Nic (+ Oonchiumpa) | OPEN. Longest-lead item. | First Australians Capital, IBA, **Supply Nation (1-July 51% rule)**, SEDI FN, the whole IPP government-procurement lane. |
| 3 | **Reconcile the $201,900 phantom** | Ben | OPEN. = TFN $130K + old-FRRR $50K + AMP $21,900; not in live Xero → excluded from match. | Match-total integrity; the frozen number. |
| 4 | **PICC $436,700 — Goods vs ACT-PI attribution** | Ben | OPEN. Already paid (Palm Island), largest cash line; attribution unconfirmed. Also chase INV-0317 ($36,300). | Largest cash line; revenue base + "buy the facility" + $36K order narrative. |

---

## 5. Time-boxed actions — Week-1 critical path + the two 1-July deadlines

### ★ TWO HARD 1-JULY DEADLINES (Wed 1 Jul 2026 — calendar Week 5)
| ★ | What | Owner | Note |
|---|---|---|---|
| ★ | **NEMA Disaster Ready Fund R4** — applications close | Ben (+ state Lead Agency partner) | Flat-pack washable beds = remote disaster re-supply. Needs go/no-go in Week 1 + a Lead Agency partner; draft Wk2, finalise Wk4, submit Wk5. |
| ★ | **Supply Nation certification** — 51%-ownership rule | Ben (+ Oonchiumpa) | **Highest-leverage single unlock** — gates the entire IPP procurement lane (+ FAC, IBA). Depends on Decision #2. Longest lead — kick off Wk1, submit well before 1 July (calendar targets Wk3, 15–21 Jun). |

### Critical path (3 things that sink the window if they slip — all start Week 1)
1. **Supply Nation cert + entity/ownership structure** (the 1-July 51% deadline; longest lead).
2. **Standard Ledger sign-off** ("the finance chat") — gates SEFA + all diligence + the one frozen revenue number; closes 9 open model gates.
3. **QBE match-eligibility definition** (from Jay) — gates the LOI form and what counts.

### Key downstream dates
- **Tue 30 Jun 2026** — Centrecorp board (possible bed PO). Get *why* they declined the 3 quotes before re-asking.
- **End June 2026** — Matt SIH production-cost advisory bundle due.
- **~Mid-July 2026** — Snow written R4/R5 tranche commitment target (~$150K new).
- **August 2026** — SEFA conditional term sheet target (drawdown Nov 2026).
- **Sun 12 Jul 2026** — assemble the Stage-2 pack (deck + v2.1 model + LOI tracker + use-of-funds) — only after signatures + frozen number land.
- **~Sep 2026** — QBE Catalysing Impact Stage-2 window. The match pays only against capital evidenced *first* → this is conversion, not discovery (0 signed LOIs today).

### Pre-send model items (before any external share)
- **Set opening-cash gate #1** — replace the $50K placeholder with the real carve-out figure (single highest-leverage input). Owner: Ben.
- **Re-pull ACT-GD Xero mirror** — for the documented **+$1,200 INV-0327 drift** (John Villiers Trust). Owner: Ben.
- **Replace the Drive sheet** — hi@act.place still holds old `Goods-Financial-Model.xlsx`; swap to `Goods-Playable-Model-v2.1.xlsx`. Owner: Ben.
- **Merge PR #50** first — it's the operating system (`/admin/loi-tracker`) the calendar + close-plan run on.

---

## 6. Outward sends queued — **Tier 3 · your hand**

Gmail tools in this environment are read/draft only — **both clicks are yours.**

| Send | State | Action | Owner |
|---|---|---|---|
| **Jay (SIH/QBE) email** | Drafted in Gmail — a 04:34 dupe + the 04:40 keeper (carries the buyer/demand HMW). | **Delete the 04:34 dupe draft, THEN send the 04:40.** In it: ask QBE to **define match-eligibility** + ask for a **warm intro to First Australians Capital**. | Ben |

No other outward sends are queued by this slice. (The LOI asks to Snow / Centrecorp / SEFA in the close-plan are human-led conversations, not pre-drafted sends — they wait on the §4 decisions + the match-eligibility answer from the Jay email.)
