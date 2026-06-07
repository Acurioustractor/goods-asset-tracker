# Session save: M3 pool stood up + asset-tracking research (2026-06-06)

## STATE AT /clear

### What this session shipped (all verified, all merged)
- **MiniMax M3 worker pool LIVE + calibrated.** `~/bin/m3` (one-shot, vision verified) + `~/bin/claude-m3` (headless worker). Key in macOS keychain `MINIMAX_API_KEY` (coding plan, international host). Full detail in auto-memory `minimax-m3-pool.md`. Pool record: 4 runs, 4 useful, 3 PRs merged, all Grade A or A-.
- **PR #88 MERGED**: 111-test vitest suite for `cost-model/engine.ts` (first tests in v2 ever).
- **PR #89 MERGED**: 77 purchase-path guard tests (products.guards / cart context / checkout route incl. DB-price-tamper proof). 188 tests total on main. 5 source observations parked in PR body (addItem zero-quantity line, no quantity cap, opaque error handling, unvalidated customerEmail, strict === locked).
- **PR #90 MERGED**: canon restatement. Public /impact figure source fixed 649,710.79 -> 741,111, AR 82,500 -> 143,000; stale $550-650 cost anchor -> canon marginals; Canberra NT -> ACT (union extended). Plus sweep report + product FAQ drafts in wiki/outputs.
- **Two strategy docs written (UNCOMMITTED, in main working tree):**
  - `wiki/outputs/2026-06-06-minimax-data-enrichment-map.md` (GREEN/AMBER/RED data governance + M3 function map)
  - `wiki/outputs/2026-06-06-asset-tracking-enhancement-plan.md` (THE working plan for Ben's bed/washer/ping ask)

### Live-register findings (2026-06-06 snapshot, PII-free queries, Ben-authorized)
- 561 assets, 523 deployed (132 Stretch + 363 Basket + 28 washers). Live register has DRIFTED past asset-canonical.ts (TC 173 vs 159, Maningrida 24 vs 18, Alice 19 vs 16, Stretch 132 vs 133).
- **Human layer never switched on: 0 QR claims ever, 1/523 recipient_name, 0 recipient_consent_at, 0 checkins rows, 244 lifetime scans.** QR hardware is 100% (523/523 have qr_url).
- **Washer pings ALIVE: 1,959 usage_logs events, 14 distinct machines, cycle_complete same-day fresh.** Pipeline = Particle.io devices -> /api/webhooks/particle (+ openfields source) -> daily_machine_rollups cron (646 rows). BUT only 5/28 deployed washers have machine_id mapped; public "14 working" is hardcoded coincidence.

### In-flight / unverified
- **/impact prod render of 741,111 UNVERIFIED**: deploy succeeded (commit status success) but the figure is client-rendered; curl cannot see it. 2-min browser check needed (open /impact, confirm Total Revenue Received shows ~$741K not $649K).
- INSIDERS_PASSWORD still on fallback (pre-existing).
- trip-stories.ts dirty in working tree = OTHER SESSION's work, do not commit it.

## RESUME PROMPT (paste in new session)

Read thoughts/shared/handoffs/asset-tracking/2026-06-06-m3-pool-and-asset-tracking-session.md and wiki/outputs/2026-06-06-asset-tracking-enhancement-plan.md. Then work the plan's "this week" list:
1. Browser-verify prod /impact shows $741,111 (PR #90 deployed but client-rendered, unverified).
2. Stage the M3 worker for webhook + fleet-cron test suites (particle/openfields/map-device/fleet-rollup routes) - same fenced worktree pattern as PRs #88/#89; Ben fires runner scripts with `! <script> &` (classifier blocks Claude sending repo content to MiniMax; this is settled, do not fight it).
3. Run v2/scripts/check-asset-drift.mjs and re-lock asset-canonical.ts to the live register.
4. Ben (human, no code): map the 23 unmapped Particle coreids via /admin/fleet map-device; triage the 14 dark machines.
5. Commit the two uncommitted strategy docs in wiki/outputs (2026-06-06-minimax-data-enrichment-map.md + 2026-06-06-asset-tracking-enhancement-plan.md) when convenient.
Then month-scale: live "working machines" metric replacing hardcoded 14; delivery-mode scan flow on /bed/[id]; dark-machine alerting. Quarter: consent-first household check-ins via bed_signals; multi-site production_site stamping. Hard rule: recipient/household data is RED class, never to MiniMax, no consent/identity calls by any model.

## Key references
- Asset plan: wiki/outputs/2026-06-06-asset-tracking-enhancement-plan.md (loops 1-3, monitoring comparison, M3 recurring jobs, rollout)
- Enrichment map: wiki/outputs/2026-06-06-minimax-data-enrichment-map.md
- M3 pool memory: ~/.claude/projects/-Users-benknight-Code-Goods-Asset-Register/memory/minimax-m3-pool.md
- Product drafts awaiting Ben's read: wiki/outputs/2026-06-06-product-faq-drafts/ (one UNCONFIRMED mechanism phrase in assembly-guide.md: "X-legs taller than needed / spread sideways")
- Checkout hardening backlog: PR #89 body observations (day-shift, money logic)
