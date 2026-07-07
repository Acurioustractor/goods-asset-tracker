---
date: 2026-06-08T11:30:00+10:00
session_name: alignment-engine
branch: feat/alignment-loop-c
status: active
---

# Work Stream: alignment-engine

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-08 (Loop E session — all 5 loops now built)
**Goal:** A living system that keeps every Goods artifact (pitch, costing, impact, stories) aligned to one source of truth and up to date, via scheduled agent loops. Layers 1+2 + Loops A/B/C/D done + **Loop E built (this session)** — the loop set is complete.
**Branch:** main (clean, on default branch). All 5 loops built. **TWO PRs OPEN, both CI green, awaiting Ben's merge: #101 (Loop E detector) + #102 (EL portrait sync).** Prior merged: Loop C #100, Loops A/B/D + layers 1-2 (#91/#92/#93/#95).
**Test:** `cd v2 && npm run check:drift` (full, needs .env.local) or `npm run check:drift:ci` (hermetic — canon + artifact + qbe-readiness + **story-coverage** guards)

### Now — SAVE-TO-CLEAR (2026-06-08, end of Loop E + first ledger batch)
**Done this session (3 things):**
1. **Loop E** = the 5th/final loop = story/illustration coverage detector `v2/scripts/check-story-coverage.mjs` (wired into check:drift + check:drift:ci; runbook `wiki/canon/loop-e-runbook.md`; report `wiki/canon/story-coverage.md`). **PR #101 open, CI green.**
2. **First weekly ledger batch via /ledger-story = 26 posts** in `wiki/outputs/ledger/2026-06-08-*.md` (UNTRACKED, all validate exit 0, all reference local `v2/public/images/people/<slug>.<ext>`). Manifest: `wiki/outputs/2026-06-08-ledger-first-batch-manifest.md`. Drafts only — nothing published, no consent flag flipped.
3. **EL portrait sync** = `v2/scripts/sync-el-portraits.mjs` (allowlist of 23 cleared slugs; --force/--dry) mirrored 15 EL avatars into `v2/public/images/people/` + optimized 9 oversized (~11MB saved). **PR #102 open, CI green** (commit `9a56c18`). NOTE: those 15 image files are committed on the PR branch only — they are NOT in main's working tree until #102 merges (so the drafts' image paths resolve only post-merge).

**Open for Ben (from the manifest):**
- Merge **#101** + **#102**.
- Review the 26 drafts; the 6 NOT drafted = Mark (no EL identity), Walter (quote is a verbatim DUP of Fred's), Kylie Bloomfield (no verbatim quote), + Nicholas Marchesi/Georgina Byron AM/Dr Boe Remenyi (founder/funder/clinician, not community-voice).
- **Data truths to resolve:** Annie Elder (repo=Elder, EL=false → draft drops it); Tracy place (EL Kalgoorlie vs repo Mt Isa); Gloria = Gloria Turner, Elder, Kalgoorlie WA (earlier triage said Tennant Creek = WRONG); Walter dup-quote fix in curated-quotes.ts; Kristy content.ts placeholder quote (don't use); Shayne/Shane + double-space keys.
- **Per-publish gates:** consent-to-use each portrait on a surface; pick surface + weekly cadence.

**NEXT work (new session):** all 5 loops done — Loop E was the last. Optional: act on `wiki/canon/qbe-readiness.md` (Area 09 keystone); Loop D v2 (live QBE DB); cron the money/story checks. Standing P0: 3 revenue cuts ($741,111 / $650,910.79 / $713,827) still unreconciled — needs accountant figure.

**EL portraits = the reusable pattern:** EL is the source of truth for storyteller portraits (read via syndication API `EMPATHY_LEDGER_API_URL` + `/api/v1/content-hub/storytellers/<slug>`, creds in v2/.env.local). Re-run `node --env-file=.env.local scripts/sync-el-portraits.mjs` to refresh. EL reads also expose elderStatus + location (caught the Annie/Gloria/Tracy corrections above).

### This Session (2026-06-08 — Loop E: story/illustration coverage, BUILT)
- [x] **Loop E = the coverage loop** (the 5th, final loop). Deterministic detector in the Loop A/B/D pattern — generation stays the existing `/ledger-story` + `/goods-illustrations` skills (human, drafts only, consent re-gated); Loop E only tells them what to draft next.
- [x] `v2/scripts/check-story-coverage.mjs` — reads cleared-voice pool (curated-quotes keys ∪ trip-stories `consent:'cleared'` VoiceCards; mirrors CONSENT.md src 1-2; unnamed role labels excluded) + weekly-ledger coverage/cadence (wiki/outputs/ledger/*.md, 7-day target) + illustration coverage (goods-ill-*.png promoted vs generated-images draft sets, 9-topic registry). Writes ranked build queue → `wiki/canon/story-coverage.md`. RED-safe (counts + already-public display_names only).
- [x] Exit semantics = Loop D shape: **hard-fail (exit 1)** only on a consent leak (ledger draft `storyteller:` not in roster) — proven by planting+removing a test draft; coverage/cadence gaps warn (fail under `--strict`).
- [x] Wired `check:story-coverage` into `check:drift` + `check:drift:ci`. Hermetic gate green end-to-end; **CI auto-runs it via check:drift:ci (line 36 ci.yml), no workflow edit needed.**
- [x] Current state: 32 named cleared voices, 0 with a weekly post (cadence never-posted/overdue); 4/9 illustration topics promoted, 5 gaps. Tier mismatch (pool 32 vs canon cleared-voices 6) reported as by-design, NOT hard-failed (the open "3 deck / ~25 display / 6 canon" question).
- [x] Runbook: `wiki/canon/loop-e-runbook.md` (what it is, run cmds, generation runbook, the consent-tier caveat, what it never does). Generated report (regenerated each run): `wiki/canon/story-coverage.md`.
- [x] **SHIPPED: PR #101** (`feat/alignment-loop-e`, commit `0e0f968`) via worktree-off-origin/main; CI green (pull_request + push). Files: check-story-coverage.mjs, loop-e-runbook.md, story-coverage.md + package.json scripts. Worktree removed; main tree restored (Loop E footprint only in the PR). Awaiting Ben's merge.

### Prev Session (2026-06-08 — Loop C: built + hardened + MERGED #100)
- [x] Scope-test (7 docs) → full run (202 docs, 8.5M tokens) → verification → hardening → canon additions → PR #100 MERGED (`be61f12`).
- [x] **KEY FINDING: codebase is canon-clean** — the raw run's 14 "live drift" conflicts were 100% FALSE POSITIVES (values in comments documenting fixed drift, unit misreads "25 L tub"→25kg, hallucinations, per-community distributions read as totals). Hand-verified each. Don't re-chase.
- [x] **Hardened loop** (`scripts/loop-c-ingestion.workflow.js` + `scripts/loop-c-changed-docs.mjs`): grounding pass (docFraming) + skeptical adversarial verify. Proven on the 5 worst docs: 7 false positives → 0.
- [x] **Canon extended**: new `governance` domain — 4 entity facts hand-verified vs area-09 legal review (Marchesi sole trader ABN 21 591 780 066; A Curious Tractor Pty Ltd ACN 697 347 676/ABN 36 697 347 676; Butterfly Movement Ltd ABN 22 155 132 684 DGR home; A Kind Tractor ABN 73 669 029 341 dormant) + pipeline `signed-lois=0`. tsc clean, drift green.
- [x] Reviews: `wiki/canon/loop-c-scope-test.md` + `loop-c-full-backlog-review.md`. Gotcha logged: Workflow tool delivers `args` as a JSON string (parse it).
- [x] Earlier housekeeping: moved off stale `chore/supabase-source-map` → main; parked other-session same-day work on local `wip/2026-06-08-dirty-tree-snapshot`.

### Prev Session (2026-06-08 PM — Loop D)
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
- [x] Loop C: ingestion Workflow over the backlog — DONE + MERGED #100 (hardened; codebase verified canon-clean). Run manually ~monthly via `node scripts/loop-c-changed-docs.mjs` → `Workflow({scriptPath:'scripts/loop-c-ingestion.workflow.js', args})` → `--stamp`.
- [x] **Loop E: story/illustration coverage** — BUILT this session (detector + runbook, hermetic-green, uncommitted). The 5-loop set is complete. ← ship next (explicit verb)
- [ ] Optional: hand-triage Loop C's remaining candidates / re-run hardened loop on governance+pipeline docs for more canon facts; resolve the cleared-voices consent-tier definition (3 deck / 25 display / 6 canon)
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
