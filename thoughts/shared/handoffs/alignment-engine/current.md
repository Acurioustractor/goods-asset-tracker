---
date: 2026-06-08T11:30:00+10:00
session_name: alignment-engine
branch: feat/alignment-loop-c
status: active
---

# Work Stream: alignment-engine

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-08T11:30:00+10:00
**Goal:** A living system that keeps every Goods artifact (pitch, costing, impact, stories) aligned to one source of truth and up to date, via scheduled agent loops. Layers 1+2 done; Loop D built (in PR); loops C/E next.
**Branch:** main — **Loop D MERGED via PR #95** (merge `5b455cc`, Loop D commit `777876b`; hermetic CI green incl. Loop D). Worktree + branch cleaned up. Prior work merged: PRs #91, #92, #93.
**Test:** `cd v2 && npm run check:drift` (full, needs .env.local) or `npm run check:drift:ci` (hermetic, now includes Loop D)

### Now
[->] Loop D MERGED (#95). NEXT loop = Loop C: ingestion backlog sweep as a Workflow (needs explicit Workflow opt-in; scope-test one folder first)

### This Session (2026-06-08 PM — Loop D)
- [x] Built **Loop D (QBE gap/readiness)** deterministically, in the Loop A/B pattern, on isolated worktree `feat/alignment-loop-c` off origin/main (main working tree had unrelated dirty files from other sessions — left untouched)
- [x] `v2/src/lib/data/qbe-areas.json` — 12 Catalysing Impact diagnostic areas + V4 scores (now→target) + priority + keystone (Area 09) + 5 catalytic blockers; grounded in `wiki/outputs/2026-06-02-qbe-catalytic-pitch/02-qbe-diagnostic-alignment.md` §3/§5
- [x] `v2/src/lib/data/qbe-areas.ts` — typed accessor (mirrors canon.ts; imports JSON like cost-model-scenarios.ts); tsc --noEmit clean against full project
- [x] `v2/scripts/check-qbe-readiness.mjs` — joins areas↔artifact-register.json by qbeAreas tag; area-integrity = hard fail, P0/keystone coverage gaps = warn (fail under --strict); writes `wiki/canon/qbe-readiness.md`
- [x] Wired `check:qbe-readiness` into `check:drift` + `check:drift:ci` (hermetic → auto-runs in existing CI gate, no secrets)
- [x] Verified: hermetic gate green end-to-end; **build queue tops with Area 09 Legal Structure (keystone, 0 artifacts) — matches the diagnostic's own keystone call**; coverage gaps = 09 + 12 (Investor Alignment Tool, 0 artifacts)

### Earlier (Layers 1+2, merged)
- [x] Notion **Artifact Hub** `378ebcf981cf8192a5e5c66b93630725`; designed 5-layer engine + 5 loops (A/B/C/D/E)
- [x] Layer 1 (PR #91): `canon.ts` + `check-canon-drift.mjs` (money loop)
- [x] Layer 2 (PR #92): `artifact-register.json` + `check-artifact-drift.mjs` + Notion **Goods Artifact Register** DB `5449e6cfb8c64339824d788020f3a294`
- [x] CI gate `.github/workflows/ci.yml`; Supabase source map (PR #93) `wiki/canon/SOURCES.md` + wrong-project guard; CI secrets set + live asset-drift verified

### Next
- [ ] Loop C: ingestion Workflow over the backlog (scope-test one folder first) — **needs explicit Workflow opt-in** (token spend); extract+tag facts/quotes/artifacts from wiki/outputs, handoffs, trip material, EL into the registers
- [ ] Loop E: story/illustration generation (ledger-story + goods-illustrations skills, consent-gated, drafts only)
- [ ] Optional Loop D v2: pull live QBE Diagnostic DB statuses (`cb3794d427914d72bf1036106d8116f5`) to enrich scores; push readiness back to Notion (Tier 2 write)
- [ ] Optional: cron the money + story checks (assets already daily); decide runner per-loop (M3 pool / Workflow / /schedule)
- [ ] Housekeeping: the whole `thoughts/shared/handoffs/alignment-engine/` dir is UNTRACKED (this ledger is a local-only working file); prune merged local branches feat/canon-alignment-engine, feat/artifact-register-loop-b, chore/supabase-source-map; add `chore/**` to ci.yml push triggers; bump CI actions to Node24 before ~2026-06-16

### Decisions
- Canon + artifact register live in CODE (source of truth) so loops run headless/CI; Notion DBs are generated views (edit code, not Notion)
- Money is `check: 'manual'` — never auto-written by a loop; reconciliation is a human/day-shift gate (the `/reconcile` skill + accountant)
- Loops auto-act Tier 1-2 only; Tier 3 (money writes, publishes, sends, merges) require explicit human verb
- CI: hermetic guards+tests on PRs (no secrets); live asset-drift only on main/daily (uses repo secrets, self-skips if absent)

### Open Questions
- UNCONFIRMED: the 3 revenue cuts ($741,111 site / $650,910.79 Xero-paid / $713,827 carve-out) still don't reconcile — standing P0, needs accountant-reviewed Goods-only figure (Area 04). Surfaced in wiki/canon/needs-signoff.md.
- UNCONFIRMED: 8 artifacts flagged stale by Loop B (wiki/canon/artifact-review.md) — real review items (e.g. canonical-numbers-sheet predates 06-03 restatement); not yet re-verified.

### Workflow State
pattern: layered-loops (alignment engine)
phase: 2
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "living system to keep artifacts aligned + up to date via agent loops"
- resource_allocation: balanced

#### Unknowns
- revenue reconciliation: UNKNOWN (P0, human)

#### Last Failure
(none)

---

## Context

### What the engine is
5 layers: (1) **Canon** = machine-readable source of truth; (2) **Artifact register** = artifacts tagged with the canon ids they cite; (3) **Loops** compare reality→canon, canon→artifacts, backlog→registers; (4) **Orchestration** (M3 pool / Workflow / /schedule cron / git hooks, per-loop); (5) **Guardrails** (claim labels, GREEN/AMBER/RED data class, Tier 1-4, provenance+asAt). The Notion Artifact Hub is the human face of the canon.

### Files (all on main)
- `v2/src/lib/data/canon.ts` — CANON registry (assets import from asset-canonical.ts; money/cost/story/product facts with provenance: claimLabel, dataClass, source, check, asAt, owner, reconcilesWith). Helpers canonFact/canonValue/canonByDomain.
- `v2/src/lib/data/artifact-register.json` — 21 artifacts, each with citesCanon[] + claimLabels/dataClass/owner/qbeAreas/lastVerified.
- `v2/scripts/check-canon-drift.mjs` — Loop A (money): cross-file lockstep (canon.ts ↔ compendium.ts verifiedFinancials ↔ grant-content.ts fundingHistory, both 741,111/143,000) + line-item sums + staleness + 3-cut reconciliation. Writes wiki/canon/needs-signoff.md. Never writes money.
- `v2/scripts/check-artifact-drift.mjs` — Loop B: citation integrity (hard-fail broken id) + staleness-by-citation + reverse index. Writes wiki/canon/artifact-review.md.
- `v2/scripts/check-asset-drift.mjs` — assets: re-derives live register vs CANONICAL_ASSETS; now has wrong-project guard (must be cwsyhpiuepvdjtxaozwf).
- `.github/workflows/ci.yml` — checks job (hermetic: check:drift:ci + npm test) + asset-drift job (main/daily/dispatch, secrets, self-skips if absent).
- `wiki/canon/SOURCES.md` — the Supabase project map.
- npm scripts: check:canon, check:artifacts, check:asset-drift, check:drift (all), check:drift:ci (hermetic).

### Notion
- Artifact Hub: `378ebcf981cf8192a5e5c66b93630725` (under Goods. HQ `177ebcf981cf805fb111f407079f9794`)
- Goods Artifact Register DB: `5449e6cfb8c64339824d788020f3a294` (data source `ac319346-fffe-485d-9132-1bfbf65e2f8d`), generated from artifact-register.json
- QBE Diagnostic Artifact DB (the diagnostic spine, 12 areas): `cb3794d427914d72bf1036106d8116f5`
- Existing hubs: Pitch Page and Documents `373ebcf981cf80748e1ef80e281b8fd6`, Goods Brand Guide `373ebcf981cf81d58ee8fd91280f895f`

### Supabase (see wiki/canon/SOURCES.md + memory goods-supabase-projects)
- v2 app = "Goods" `cwsyhpiuepvdjtxaozwf` (CORRECT). Use .env.local creds, NOT the MCP.
- Wrong-project trap = `bhwyqqbovcjoefezgfnq` ("ACT Farmhand"). Xero/money = `tednluwflfhxyucgwigh` ("Empathy Ledger"). EL = `yvnuayzslukamizrlhwb`.

### Git
- main tip 3d2b697. PRs #91/#92/#93 all merged + CI green. CI secrets SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set 2026-06-08.
- Working tree has unrelated in-flight changes from other sessions (field-notes trip-stories, investor-auth, qbe, proxy.ts) — NOT this work stream; leave them.

### How to run / verify
- `cd v2 && npm run check:drift` (full) — assets need .env.local + Goods project.
- Money sign-off queue: wiki/canon/needs-signoff.md. Artifact review queue: wiki/canon/artifact-review.md.
- Memory: [[goods-artifact-hub-notion]], [[goods-supabase-projects]] in ~/.claude memory.
