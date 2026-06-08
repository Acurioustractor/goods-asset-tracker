# Loop C — Ingestion Scope-Test (dry-run)

**Generated:** 2026-06-08 · **Engine:** Loop C (ingestion) · **Mode:** scope-test, NO writes to canon.ts or artifact-register.json
**Folder:** `wiki/outputs/2026-06-02-qbe-catalytic-pitch/` (7 files) · **Model:** Sonnet (7 parallel extractors)
**Run:** workflow `w5fn93ii5` · 287,442 tokens · 94s · 204 facts / 119 new-candidate flags / 13 conflicts

> This is a candidate report for human review. Nothing here has been added to the registers. Money stays a manual sign-off (Loop A / `needs-signoff.md`). RED storyteller data is reported as counts only — no names, no verbatim quotes.

---

## 1. Quality verdict — PASS (with one fix needed)

Sonnet extraction quality was high enough for the full run:

- **Canon matching:** correctly tied every restated number to its canon id (`beds-deployed`, `stretch-beds-deployed`, `washers-*`, `communities-served`, `plastic-kg`, `stretch-price`, `marginal-*`, `save-per-bed`, `revenue-*`) across all 7 files. No false matches observed.
- **Conflict detection:** caught the standing 3-cut revenue problem unprompted and explained each gap with a plausible cause (older cut / narrower scope / different as-at). It correctly treated the doc-self-flagged stale figure ($537,595) as a known-stale cut, not a true error.
- **New-fact recall:** surfaced real facts absent from canon (cost-model curve, capital stack, program terms, governance, market context).
- **Bonus:** flagged a plaintext password leak (`goods2026`) sitting in `02-qbe-diagnostic-alignment.md`.

**Fix before the full run (RED handling):** on the RED voice map (`05`) the agent correctly withheld verbatim quotes, **but it returned the full ~29-name storyteller roster** in `speakers[]`. For RED-class files the identities themselves are sensitive. The production prompt/schema must force **count-only for RED** (no names beyond the canon `cleared-voices` set). This is the one calibration change the scope-test exists to catch.

---

## 2. Conflicts (drift) — 6 unique, all route to human review

These are the high-value output. Most are NOT canon errors — they are artifacts citing older/narrower cuts, which is exactly what the engine is meant to surface.

| # | In doc | Canon | Likely cause | Route |
|---|--------|-------|--------------|-------|
| 1 | Receivables **$82,500** (deck + Notion Area 04) | `accounts-receivable` = **$143,000** | Pre-dates Homeland $44K + Regional Arts $16.5K additions | money sign-off |
| 2 | Raised **$733,410.79** | `revenue-received` = **$741,111** | Different as-at / carve-out rule | money sign-off |
| 3 | Verified-paid grants **~$588K** | `revenue-xero-paid` = **$650,910.79** | ~$63K unexplained gap (PICC inclusion?) | money sign-off (P0) |
| 4 | V4 diagnostic **$537,595** | (all 3 cuts) | Doc self-flags as stale/narrower | note only |
| 5 | **3** deck-cleared / **25** display-cleared voices | `cleared-voices` = **6** | Different consent tiers (deck vs `curated-quotes.ts` display vs EL-pitch) | define the tiers |
| 6 | **$344** "city-factory cost" (slide 06) | `marginal-factory` = **$426** | $344 is the *leg-kit* line, not the factory marginal — mislabel risk in the deck | copy fix |

Conflicts 1–4 are the standing P0 revenue reconciliation — they belong in `needs-signoff.md`, not a canon edit. Conflict 5 is a real definitional gap worth closing (what does `cleared-voices` count?). Conflict 6 is a deck-copy accuracy risk.

---

## 3. New canon candidates (deduped) — for human triage, NOT auto-added

204 raw facts collapse to a small unique set. **Critical dedup note:** many "new" candidates already live in **`cost-model/engine.ts`** (cost curve) or **`qbe-areas.json`** (diagnostic scores) — so the production loop must dedup against ALL canon sources, not just the 18 facts in `canon.ts`, or it will propose duplicates.

**A. Cost-model (verify against `engine.ts` before adding — likely already derived there):**
fixed-cost block ~$109,500/yr · break-even 1,679 / 338 / 333 beds/yr (Buy-Kit/Factory/Community) · contribution $65 / $324 / $329 · leg-kit finished $344.05 vs raw plastic ~$40 (8.6× markup) · press capex spent ~$110,046 · run-rate ~120 beds/yr (modelled) · ~2.8× lift to break-even · container capacity ~30 beds/week · community fair-wage $130/bed (band $100–160).

**B. Capital stack / pipeline (genuinely NEW — no `pipeline` facts in canon yet):**
QBE ask ~$400K signed match-eligible · QBE program: up to $400K from $1M shared pool, at-least-matched (confirmed per induction deck; doc hedged it as unconfirmed → canon would settle it) · signed LOIs = **0** · funder targets: Minderoo $840K–1.5M, Snow ~$150K, Sefa ~$300K, PRF ~$500K (+$7,469 paid), TFF ~$300K, FAC $100K–2M · factory capex $112K–222K, site capex $100K–150K. *(All AMBER; pipeline targets are `target` claim-label, not `verified`.)*

**C. QBE diagnostic (already in `qbe-areas.json` / Loop D — do not duplicate):**
V4 scores, "strong proof / weak paperwork", CASE 5-of-6 knockouts, keystone = Legal Structure.

**D. Governance / legal (NEW, high-value):**
operating entity = sole trader (Nicholas Marchesi, ABN 21 591 780 066) · Supply Nation 51% cert deadline 1 July · FY26 net loss (no surplus).

**E. Market context (LOW confidence — provenance pending):**
~$3M/yr remote washing-machine provider · Convergence benchmark $1 concessional → ~$4.10 mobilised.

---

## 4. Artifact registration

The folder is already represented in `artifact-register.json` by `pitch-deck-blueprint` and `catalytic-pitch-bundle`. The extractor proposed registering all 7 files individually — **recommend NOT** splitting; the bundle entry covers them. Action: refresh `citesCanon[]` on the two existing entries to include the cost-model + pipeline ids once those candidates land, and bump `lastVerified`.

---

## 5. RED handling

`05-goods-voice-map.md`: ~28–29 distinct storytellers, ~35+ quote instances. Verbatim withheld ✓. Roster **quarantined from this report** (count only). The 25-vs-6 consent-tier gap (conflict 5) is the only RED item that needs a human decision.

---

## 6. Calibration for the full run (202 docs, 2.8MB)

- **Cost:** ~41k tokens/doc on Sonnet → full backlog ≈ **~3.5–4M tokens ≈ ~$20–35 one-time** (≈5× on Opus). Sonnet quality is sufficient; Opus not needed for extraction.
- **Add a dedup/synthesis barrier:** extract per-doc in parallel, then ONE pass that dedups facts across all docs AND against `engine.ts` + `qbe-areas.json` + `canon.ts`. Without it, 204 raw facts (mostly repeats) drown the signal.
- **RED prompt fix:** count-only for RED files; never emit the storyteller roster.
- **Money never auto-writes:** route all money conflicts to `needs-signoff.md` (Loop A already owns this).
- **Skip media dirs:** `brand-review-2026-05-28/` (14M) and `utopia-media/` (3.2M) are images — exclude from the text sweep.
- **Security pass is a freebie:** the extractor catches leaked credentials/PII in docs — worth keeping as an explicit ask.
