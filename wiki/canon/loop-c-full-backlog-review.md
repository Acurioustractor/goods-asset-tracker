# Loop C — Full Backlog Ingestion Review (dry-run)

**Generated:** 2026-06-08 · **Engine:** Loop C (ingestion) · **Mode:** full backlog, NO writes to registers
**Scope:** 202 backlog docs (`wiki/outputs/` + `thoughts/shared/handoffs/`, media dirs excluded) · **Model:** Sonnet extractors + Sonnet synthesis
**Run:** workflow `wrntzibjg` · 232 agents · **8.54M tokens · ~19 min** · 3,338 facts → 184 conflicts / 1,779 candidates
**Fixes applied vs scope-test:** RED count-only ✓ · JS+LLM dedup barrier ✓ · dedup vs canon.ts/engine.ts/qbe-areas.json ✓

> Candidate report for human review. Nothing written to canon.ts / artifact-register.json. Money stays a manual gate (→ `needs-signoff.md`). RED = counts only (118 quote-instances across 30 docs; **no names, no verbatim** — fix worked).

---

## 1. Headline

**After hand-verification, the run's precision is poor: the 14 "live drift" conflicts are 100% false positives (§2), and the 1,779 candidates over-produced badly (§5).** Loop C has good recall (it finds every place a number-string appears) but cannot distinguish a live value from a comment, a unit, or a hallucination. Its output is a *lead list to verify*, never a fact source to trust. Cost ran **2.4× the scope-test estimate** (8.5M not ~3.5M). Net: the loop needs a grounding/precision pass (§5) before it earns any trust — that is now the priority over adding its output to canon.

---

## 2. "ACTIONABLE DRIFT" — VERIFIED FALSE POSITIVES ⚠️

The full run flagged 14 conflicts as wrong numbers in live code. **Hand-verification against the actual files found 0 real ones — all 14 are false positives.** This is the most important result of the run: the codebase is canon-clean, and the extractor cannot tell a live value from a comment.

| Flagged | Reality (verified) |
|---------|--------------------|
| impact-model.ts `$550` | comment documenting drift that was *removed*: "// per-stage costs that summed to a non-canonical $550 and were [deleted]" |
| compendium.ts `$513,148` | comment describing a *fixed* double-count; line 349 uses canonical AR |
| metrics.ts `$832,832` | `CRITICAL:` comment explaining the void filter; filter is LIVE in code (`status=not.in.(VOIDED,DELETED)`) |
| supplier-quotes.ts `$600` | comment: "INV-1507 $600/bed was for the DISCONTINUED Weave Bed" |
| grant-content.ts `$778,162` | not present — file carries `totalReceived: 741_111` ("is FINAL") |
| outreach-targets.ts `9,225kg` | hallucinated — line 202 says "2,660kg+ // canonical: see asset-canonical.ts" |
| story-atoms.ts `25kg/bed` | unit misread — "20 kg of plastic that fits in a **25 L tub**" |
| content.ts beds `471 / 493 / 419` | per-community distribution (guarded by `validateContent`), not a beds-deployed total |
| stretch-beds `132` | live DB vs register — the asset-drift loop's job, not a code edit |
| cleared-voices `25` | real definitional question (display-cleared vs consent-cleared), not a code bug |

**Action 1 (fix live drifts) is cancelled — there is nothing to fix.** Editing any of these would damage correct, intentionally-documented code. The existing canon/asset/artifact drift loops are already keeping the live code clean; Loop C's job is the *backlog*, and on the backlog it confirmed no live leakage.

---

## 3. Historical drift (170 of 184) — a propagation map, not a fix list

The remaining ~170 conflicts are stale numbers in **dated handoffs/reports** (e.g. AR $82,500 in 19 docs, $600/bed in 13, $537,595 Grantscope revenue in 13, communities=8 in 10, beds=389 in 9). You don't edit dated documents — but this is a useful map of **how far each retired number propagated** before canon was set. Headline: the pre-canon era scattered ~6 different revenue figures and 4 different bed counts across the backlog. That scatter is exactly what the canon registry now prevents.

---

## 4. GENUINELY-NEW canon candidates (deduped, high-value)

1,779 raw candidates are too noisy to action wholesale (§5). But three domains are genuinely **absent from canon today** and worth adding as new canon facts/domains:

### 4a. Governance / legal — NEW domain (this is the QBE Area-09 keystone, the #1 blocker)
- **Operating entity (now):** Nicholas Marchesi, sole trader, **ABN 21 591 780 066**
- **A Curious Tractor Pty Ltd** — **ACN 697 347 676**, incorporated 2026-04-28, trading as Goods on Country (future trading entity)
- **The Butterfly Movement Ltd** — **ABN 22 155 132 684**, confirmed charity/DGR vehicle, min 3 directors
- **A Kind Tractor Ltd** — **ABN 73 669 029 341** — DORMANT, not the trading entity
- Supply Nation cert: 50%+ Indigenous ownership, free via Oonchiumpa, **before 1 July 2026**
- QBE match gate: **≥3 signed LOIs by 31 Aug 2026**; Stage 2 apply Sept 2026
- ⚠️ stale internal conflict: QBE cap "$200K vs $400K" appears unresolved in some docs — **canon should settle it at $400K** (confirmed per induction deck) to kill that conflict

### 4b. Capital stack / pipeline — NEW `pipeline` domain
- **Signed LOIs / committed = $0** across all 3 Goods pipelines (the match gate is open)
- Funder universe: First Australians Capital ($100K–2M), SEDI First Nations (~$2.5M), RMF Plastics ($60M nat.), NPSIF ($300K–1M), Disaster Ready Fund R4 ($142.5M, due 29 May), FNCE Advice Grant (due 2026-09-03)
- Demand signal: Utopia requested **160 more beds** (26 Nov 2025); Centrecorp committed **107–109 beds**; open demand ~885 beds
- Key dates: SEFA LOI Aug 2026 · investment memo 2026-06-30 · QBE Stage 2 Sept 2026

### 4c. Market context — candidate `market` facts (mostly green/public-safe)
Washing machines last 1–2 yr in remote communities (vs 10+ for ours) · $125K Commonwealth procurement threshold (200 beds @ $560 = $112K sits under it) · NACCHO = 144 ACCHOs as a procurement channel · Grantscope: 1,546 communities / 4,952 entities mapped.

### 4d. Product (CAVEAT — mostly already canon)
~23 "new" product specs (26kg, 188×92×25, 200kg, 20kg plastic, steel 26.9mm) are **already in `products.ts`** — the synthesis flagged them new only because I didn't give it `products.ts`/`asset-canonical.ts` as known sources. Genuinely new here: survival rate 95% (n=15–20), Year-3 target 5,000 beds, Speed Queen unit $2,995, washer sell prices $4,000–4,500, named BOM suppliers (Defy Design / DNA Steel / Centre Canvas), ~1,000 beds/yr factory throughput.

---

## 5. Calibration — productionizing Loop C

What this run taught us:

- **Dedup is still too loose.** 2,095→1,779 only collapsed exact claim+value; semantic near-dups survived across the ~30 synthesis chunks. Fix: a final whole-set semantic dedup pass (one agent over the deduped value-keys), or cluster by `(domain, rounded-value)` before synthesis.
- **Expand "known sources"** to include `products.ts`, `asset-canonical.ts`, `content.ts`, `compendium.ts` — or the loop keeps re-proposing facts that are already canon (the 119 "assets" + 23 product candidates are almost all already-covered).
- **Conflicts are the product; candidates are a backlog.** The 14 live-drift conflicts are immediately actionable; the 1,779 candidates are a triage queue, not an auto-add list. Future runs should foreground conflicts and treat candidates as opt-in.
- **RED fix verified.** 118 instances / 30 docs, count-only, zero names/verbatim leaked.
- **Cost reality:** ~$50–85 equivalent (8.5M Sonnet tokens) for a full sweep. Run it on a schedule (monthly?), not every session. Incremental mode (only docs changed since last run) would cut this ~10×.
- **Money never auto-writes** — the 3 money conflicts (metrics.ts $832,832, compendium.ts $513,148, grant-content.ts $778,162) go to `/reconcile` + `needs-signoff.md`.

---

## 6. Recommended next steps (your call)

1. **Fix the 3 🔴 live drifts** — `impact-model.ts` $550→$426 (public), beds-deployed 493/471/419→496 (consolidate to canon), metrics.ts void-filter (→ /reconcile). These are real and some are public-facing.
2. **Add the governance + pipeline domains to canon.ts** — the entity/ABN facts and the $0-LOI / demand / deadline facts. High value, low risk (mostly green/amber, no money auto-write).
3. **Harden Loop C** (dedup pass + expanded known-sources + incremental mode) before scheduling it.

---

## 7. Hardening — VERIFIED (2026-06-08)

Rebuilt the loop as `scripts/loop-c-ingestion.workflow.js` (tracked; `.claude/` is gitignored) with a **grounding pass** (every fact carries a `docFraming`: current / historical / fixed / stale-flagged / proposed / external-ref) and a **skeptical adversarial verify** (each `current` drift claim is re-checked against the real source — including the named code file — defaulting to not-drift). Plus expanded known-sources (products.ts, asset-canonical.ts, engine.ts, grant-content.ts, qbe-areas.json) and tighter dedup.

**Precision test** — re-ran the 5 docs that produced the worst false positives (canon-sweep-report, public-copy-quarantine, grantscope-matches, area-04, canonical-numbers-sheet):

| Metric | Raw run | Hardened run |
|--------|---------|--------------|
| False-positive "live drift" | ~7 (100% false) | **0** |
| Confirmed live drift | — | 0 (correct — codebase is clean) |
| Values caught by framing (not-current) | 0 (no framing) | 59 of 177 (43 stale / 8 external-ref / 8 historical) |
| Drift claims sent to verify → refuted | n/a | 5 → 5 refuted |
| add-to-canon candidates | ~10/doc | 4 total (conservative) |

**Cost of precision:** the verify stage reads source/code files, so per-doc cost ~2.2× (~93k vs ~41k tokens). A full 202-doc hardened run ≈ ~18–19M tokens — which is why **incremental mode** (scan only git-changed docs) is required before scheduling.

**Productionization — DONE (2026-06-08):**
- **args fix:** the Workflow tool delivers `args` as a JSON *string*; the script now parses it, so it's parameterizable by file list. Verified end-to-end on a 1-doc run.
- **incremental helper:** `scripts/loop-c-changed-docs.mjs` prints `{repo, files}` of backlog docs changed since a mtime marker (`wiki/canon/.loop-c-lastrun`). Keys off mtime, not git, because most backlog docs are untracked.

## 8. How to run / schedule

**Run (incremental):**
```
node scripts/loop-c-changed-docs.mjs            # prints {repo, files} changed since last run (or --all for full)
# then, in a Claude session, feed that JSON to the loop:
Workflow({ scriptPath: 'scripts/loop-c-ingestion.workflow.js', args: <the JSON> })
node scripts/loop-c-changed-docs.mjs --stamp    # after a clean run, advance the marker
```

**Scheduling — honest constraint (NOT auto-scheduled):** Loop C needs the local repo + the Workflow tool, which limits the options:
- `CronCreate` (in-session cron) is session-only and recurring jobs auto-expire after 7 days → **cannot do monthly.**
- `/schedule` remote-agent routines are persistent, but a remote runner may not have the repo checkout or the Workflow tool → **viability untested.**
- **Recommendation:** run it **manually ~monthly** (the 3 commands above) — it's a 2-minute trigger. Loop C is dry-run / Tier 1, so an unattended run is within the AFK boundary, but it spends tokens (incremental keeps it bounded). Only wire a `/schedule` routine after one remote run proves the runner has repo + Workflow access.
