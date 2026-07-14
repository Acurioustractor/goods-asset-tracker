---
title: Cost-model cockpit + v6 — session handoff & continuation prompt
date: 2026-05-29
repo: Goods Asset Register
branch: wip/dashboard-rebuild-2026-05-28
purpose: Resume the cost-model cockpit UI + v6 community-reframe work in a fresh session.
---

# Cost-model cockpit + v6 — handoff

## TL;DR
A new **3-skin full-screen cost-model cockpit** (Mission Control / Tesla / Terminal) **and** the **v6 community fair-wage reframe ($270.74 parity)** + the **§9 v6 data keys** are all **built, build-green, and UN-MERGED** in the working tree, live on the PM2 dev server at **`localhost:3004/admin/cost-model?skin=mc|tesla|terminal`**. Everything on `main` (deployed) is at the **pre-v6 state** (Community $140.74). The next move is Ben's: **review the cockpit on :3004, pick/approve, then merge** — after which come the public-artifact wave and the v6.1 investment UI.

## Done & merged (on main, deployed — Vercel READY)
- PRs **#36–#43**: funder-copy cleanup, entity/counts alignment, the 7 QBE diagrams (+ the loop-2 number corrections), the admin cost-model "honest read" lock, and the **admin-calc enterprise-readiness fixes** (loop 1: the $832K→$123K funder void-filter, the RangeError crash, the public `${...}` bug; loop 2: the single-source-of-truth refactor + the Xero-reconciliation rewire).
- The playable model **`Goods-Playable-Model-v1.xlsx`** built (+ uploaded to Drive by Ben); the Drive **"Raw data (CSV) v2"** subfolder (`1HSsnijyc_IK4-1PiAU6nkhUlCau7w4TN`) with 8 corrected CSVs; the 3 deployed diagrams corrected; the two QBE Notion pages (Cost Model v6 `36febcf981cf8146a55de05050e956e9`, Area 04 `36eebcf981cf8167884fc3d5ecda0e32`) corrected. **All at the pre-v6-reframe numbers (Community $140.74).**

## Un-merged (working tree, on :3004, awaiting review/merge)
- **3-skin cockpit:** `v2/src/app/admin/cost-model/page.tsx` + `cost-model-workspace.tsx` + `skins/{mission-control,terminal,tesla}-skin.tsx`. Full-screen (≈100vh, no doc scroll), all 28 sliders visible at once, `?skin=` toggle. Engine extracted to `v2/src/lib/cost-model/{engine.ts, use-cost-model.ts}`. Replaced the old `cost-model-explorer.tsx` (deleted).
- **v6 community reframe + §9 data:** `v2/src/lib/data/cost-model-scenarios.{json,ts}` (meta → v6) + `engine.ts`. Community = **$270.74** ($130 fair-wage labour input, free feedstock), margin **$479.26/64%** = parity with Factory ($275.74), margin community-owned. New keys: `standalone_site_capex`, `volume_ramp_v6`, `demand_mix`, `margin_waterfall` (with `act_brokerage` slider + `downside_flex`), `debt_service`, `sensitivity_v6` (3-way downside flagged `load_bearing`).
- Build: `cd v2 && npm run build` passes. **Not committed** (folds into one cockpit+v6 PR when approved).

## Remaining (ordered)
1. **Merge the cockpit + v6.** Once Ben approves the skin(s) on :3004, PR off `main` via a worktree (fold cockpit + v6 + §9 data into one branch), build-verified, then merge → deploy.
2. **Public-artifact wave** — propagate the v6 Community reframe ($140.74 → $270.74) to the deployed/shared artifacts (same surface as the loop-2 corrections):
   - **Diagrams** (`scripts/generate_goods_*.py`, regenerate + redeploy via PR):
     - `goods-cost-down`: the staircase no longer descends to "Community cheapest" — Community ($271) is now **~parity with Factory ($276)**; reframe the endpoint to "parity + community-owned margin + dignified paid work," not "cheapest."
     - `goods-scenarios`: Community @1,000/yr before-founder **$366,560 → $236,560**; breakeven **238 → ~282** (recompute: new Community marginal $420.74 = $270.74 + $150 freight; contribution $329.26; $329.26×1,000 − $92,700 = $236,560). Annotate "fair-wage: lower surplus, but the wage + margin stay community-owned."
   - **Drive CSVs** (no MCP delete → fresh subfolder): `02-build-paths.csv` Community 140.74→270.74 / margin 609→479 / pct 81→64; `04-scenarios.csv` Community result.
   - **Notion** Cost Model v6 page build-paths table: Community row 140.74→270.74.
3. **v6.1 investment-layer UI** — a **margin-waterfall + `act_brokerage` slider (default 200, range 60–500, with `downside_flex`) + debt-service** panel that makes the brief's 3 findings playable. Data is already in `cost-model-scenarios.json` (`margin_waterfall` / `debt_service` / `sensitivity_v6`). The brokerage-flex-down is THE CDFI/equity design point.
4. **Loose ends:** swap the `#` `SHEET_URL` placeholder (in the cockpit skins/engine) for the real Google Sheet link once Ben sends it; restart the `empathy-ledger-v2` (:4000) + `act-global-infrastructure` command-center (:3002) dev servers if Ben needs them (a too-broad `pkill` killed them this session).
5. **Open — Ben's (not code):** the 6 QBE sanity-check calls (**borrower entity: GOC-DGR vs Pty Ltd** is the material one) → PIN advisor; 3 vendor quotes for the per-site capex (the one *Unverified* v6 block); the corporate-RAP gift price (biggest revenue unknown).

## Key facts (for the next session)
- **Repo:** `/Users/benknight/Code/Goods Asset Register`; working branch `wip/dashboard-rebuild-2026-05-28` (behind main; **PR off `main` via a worktree, do NOT rebase the wip branch**).
- **Dev server:** **:3004 under PM2** (`act-frontend`), NOT :3000. It hot-reloads. Don't `pkill` broadly — kill by exact PID, and prefer `pm2` for the managed process.
- **v6 brief (source of truth):** `/Users/benknight/Code/act-global-infrastructure/thoughts/shared/briefs/2026-05-29-cost-model-v6-worked-numbers.md` (+ `.provenance.md`, + `-prep.md`).
- **Calc-review fix plan / definition-of-done:** `wiki/outputs/2026-05-29-qbe-investment-sweep/04-admin-calc-enterprise-review.md`.
- **Memory:** `memory/qbe_investment_sweep.md` ("Cost-model v6 worked-numbers reconciliation" + "Admin calc enterprise-readiness" sections).
- **Lessons logged:** verify every background Agent dispatch by its returned `agentId` before claiming it's running; never system-wide `pkill` (kill by PID); Playwright screenshots save to a sandbox dir unreadable from here (rely on Ben's view of :3004).

## Canonical numbers (do not drift)
Build-path direct: Buy-Kit **534.79** / Buy-Panels **584.07** / Factory **275.74** / Community **270.74** (v6 fair-wage). Marginal (incl. $150 long-haul freight): Buy-Kit **684.79** / Factory **425.74** / Community **420.74**. Contribution@750: 65.21 / 324.26 / 329.26. Fixed block **$109,500/yr**. Breakeven: Factory **338** / Buy-Kit **1,679** / Community **~282**. Founder **$560/day** (= $84K/yr; $16,800 production share). Idiot index **8.6×** (shred $40) + **21.5×** (raw polymer $16). Capital ask **$112–222K gross**. Price **$750** (institutional $801, Centrecorp anchor). Verified financials: received **$649,710.79**, surplus before founder **$340,585**, AR $82,500, AP ~0. ~**496** beds deployed / 10 communities. Community v6: $0 plastic + $15 diesel + $27 steel + $93.50 canvas + $5.24 hardware + **$130 fair-wage labour** = **$270.74** (band $240.74–$300.74). Honest framing: lead with marginal; demote the ~$1,912 fully-loaded as a labelled "fixed-cost absorption at pilot volume" reference; never tout "cheapest"; DGR only via The Butterfly Movement Ltd.

---

## ▶ CONTINUATION PROMPT (paste into a fresh Claude Code session in this repo)

> Continue the Goods cost-model **cockpit + v6** work. First read: `memory/MEMORY.md` + `memory/qbe_investment_sweep.md` (the "Cost-model v6 worked-numbers reconciliation" + "Admin calc enterprise-readiness" sections), this handoff `wiki/outputs/2026-05-29-cost-model-cockpit-v6-handoff.md`, the v6 brief `/Users/benknight/Code/act-global-infrastructure/thoughts/shared/briefs/2026-05-29-cost-model-v6-worked-numbers.md`, and the fix plan `wiki/outputs/2026-05-29-qbe-investment-sweep/04-admin-calc-enterprise-review.md`.
>
> STATE: a 3-skin full-screen cost-model cockpit (Mission Control / Tesla / Terminal) + the v6 community fair-wage reframe (Community $270.74 parity) + the §9 v6 data are built, build-green, **un-merged** in the working tree (branch `wip/dashboard-rebuild-2026-05-28`), live at `localhost:3004/admin/cost-model?skin=mc|tesla|terminal` (PM2 dev server on **:3004**, not :3000). Engine: `v2/src/lib/cost-model/{engine.ts,use-cost-model.ts}`; data: `v2/src/lib/data/cost-model-scenarios.{json,ts}`. Main (deployed) is at the pre-v6 state (Community $140.74).
>
> RULES: PR off `main` via a worktree (don't rebase wip); verify every background Agent dispatch by its returned agentId before saying it's running; never broad `pkill` (kill by exact PID); `cd v2 && npm run build` must stay green.
>
> DO, in order (confirm step 1 with Ben first):
> 1. **Merge the cockpit + v6** once Ben approves the skin(s) on :3004 — fold cockpit + v6 + §9 data into one PR off main, build-verified.
> 2. **Public-artifact wave**: propagate the Community reframe $140.74→$270.74 to the diagrams (`goods-cost-down`: Community is now ~parity with Factory, not "cheapest"; `goods-scenarios`: Community @1,000/yr before-founder $366,560→$236,560, breakeven 238→~282 — recompute from marginal $420.74 / contribution $329.26), regenerate + redeploy via PR; the Drive CSVs (fresh subfolder — MCP has no delete) `02-build-paths` + `04-scenarios`; the Notion Cost Model v6 page (`36febcf981cf8146a55de05050e956e9`) build-paths table.
> 3. **v6.1 investment-layer UI**: a margin-waterfall + `act_brokerage` slider (default 200, range 60–500, `downside_flex`) + debt-service panel surfacing the 3 brief findings (Defy-decoupling; the ~$100/bed brokerage floor for the $500K debt; brokerage-must-flex-down-or-community-collapses-to-$14/bed). Data already in `cost-model-scenarios.json`.
> 4. Loose ends: swap the `#` `SHEET_URL` for the real Google Sheet link when Ben sends it; offer to restart the empathy-ledger-v2 (:4000) + act-infra command-center (:3002) dev servers.
> Use the canonical numbers in the handoff; keep the honest framing (lead with marginal, demote $1,912, never "cheapest", DGR only via Butterfly).
