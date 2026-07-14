# MiniMax M3 as the Goods Data-Enrichment Layer

**Date:** 2026-06-06
**Status:** Working map. M3 pool live and calibrated (Grade A, PR #88 merged). Vision capability staged for one-command verification.
**Decision this informs:** which enrichment functions to route to the M3 pool, in what order, under what data-governance rules.
**Audience:** Ben + future sessions. Internal doc.

---

## 1. What M3 actually is (verified capability surface)

| Capability | Detail | Confidence |
|---|---|---|
| Text reasoning + coding | Frontier-tier coding and agentic benchmarks; wrote our 111-test vitest suite unaided | **Verified** (calibration run, PR #88) |
| Anthropic-compatible endpoint | `api.minimax.io/anthropic`, model `MiniMax-M3`, works with our `sk-cp` coding-plan key | **Verified** (live smoke tests) |
| 1M-token context | MSA sparse attention; roughly 1/20 prior-gen cost at 1M tokens, automatic caching on | Inferred (MiniMax docs/blog, not load-tested by us) |
| Native multimodality | Image AND video inputs, text out; OmniDocBench above Gemini 3.1 Pro | Inferred (docs); **our-key image test staged**: `! /tmp/m3-vision-test.sh` |
| Headless agentic worker | `claude-m3 -p` with tool fences; honest self-reporting under a scoped contract | **Verified** (calibration run) |
| MiniMax media APIs (MCP) | TTS, voice clone, image/video/music generation via separate MCP server | Not connected; separate billing from coding plan. See section 5 before ever connecting. |

Cost shape: flat coding-plan subscription, so M3 tokens are effectively pre-paid bulk labour. Opus/Max budget is the scarce resource; M3 exists to absorb volume.

---

## 2. The governing rule: data classes before functions

Every enrichment idea passes through one gate first: **what data leaves the laptop for MiniMax's servers?** This is an ICIP and consent boundary, not a technical preference. The auto-mode classifier already enforces half of it (Claude cannot send repo content to MiniMax; only Ben can fire those runs). The other half is policy:

| Class | Definition | Examples | M3 allowed? |
|---|---|---|---|
| **GREEN** | Already public, or contains no people/places/consent surface | Published site pages, canon product specs, code, tests, public grant listings, published stories, brand assets already on goodsoncountry.com | Yes, freely |
| **AMBER** | Internal business data, third-party personal data, community operational data | GHL contacts, Xero figures, wiki raw emails, asset register with community locations, funder strategy | Per-batch Ben decision; default NO, keep on the existing Anthropic boundary |
| **RED** | Consent-bearing or culturally sensitive | Uncleared storyteller media/transcripts, photos with unidentified or unconsented faces, anything `is_sacred_no_publish`, Elder content pending review, Warumungu or any language material, GPS of communities tied to people | Never. No exceptions. Stays local or on the existing trusted boundary |

Two corollaries that do most of the work:

1. **"Published = GREEN" is the unlock.** Once Ben's consent pass clears a voice and it ships on the public site, that exact content is public and M3 can enrich it (alt text, tags, summaries, derivations). M3 therefore operates *downstream* of consent, never upstream.
2. **M3 never makes a consent, identity, or cultural call.** It can format, count, draft, and flag. The quarantine logic in `el-find-clips.mjs` and the CONSENT.md gates stay exactly where they are: deterministic script + Ben + Elders.

---

## 3. Function map: what M3 serves, across the four threads

### Thread A: Storytelling (the living ledger)

| Function | What M3 does | Data class | Status |
|---|---|---|---|
| Scaffolding around the spine | Build/maintain the pipeline code itself: cutspec emitters, lint scripts like `check-story-draft.mjs`, profile page templates, test suites for the data layer | GREEN (code) | **Proven** (calibration was exactly this shape) |
| Published-story derivations | From cleared, published stories: social cut-downs, newsletter blocks, alt text, pull-quote candidates (verbatim only, from curated-quotes.ts), reading-level variants | GREEN | Ready now |
| Draft-checker hardening | Extend the AI-tell/em-dash/canon-number linter with cases; generate adversarial test fixtures for it | GREEN | Ready now |
| Transcript structural pass | AFTER a voice is cleared and published: suggest spine tags, locate quote candidates with timestamps for Ben to verify against curated rules | GREEN (published) / RED (uncleared) | Gated per voice |
| Profile backfill drafting | Draft the 17 missing local `storytellerProfile` records from EL-cleared source fields, flagged for Ben review before any merge | AMBER leaning RED (names + faces of real people to an external party) | Keep on Opus instead; cheap enough there |
| What M3 must NOT touch | Consent flips, identity assertion from photos, the Shane/Shayne reconcile, double-space name keys (names of real people are verified with the source, never machine-fixed), anything in the EL quarantine | RED | Permanent |

The honest headline: **M3 supports storytelling mostly by making everything around the stories cheap**, so Opus and Ben spend their attention only on the consent-bearing core. That division is a feature, not a limitation.

### Thread B: The data (registers, CRM, money, knowledge base)

| Function | What M3 does | Data class | Status |
|---|---|---|---|
| Funder universe enrichment | Classify, dedupe, fit-score the public-source grant records (GrantScope corpus, the ~55-source capital universe); draft one-page funder briefs from public info | GREEN (public-source) | Ready; highest-volume win available |
| Wiki compilation (Karpathy pattern) | Compile `wiki/raw/` into `wiki/articles/` for non-people topics (product history, cost model, manufacturing); the wiki was literally designed for LLM compilation | GREEN/AMBER per source (raw emails contain third parties; Ben picks batches) | Ready with batch approval |
| Schema and drift tooling | Extend `check-asset-drift.mjs`-style scripts; write validators for canon numbers across pages; test suites for `loi-pipeline.ts`, `asset-canonical.ts`, EL client filters | GREEN (code) | **Proven** pattern |
| GHL/Xero hygiene | Candidate-matching for the $258K GHL-vs-Xero unreconciled gap; contact dedupe suggestions | AMBER (real people's contact + financial data) | Default NO to MiniMax; run on Opus. M3 may build the *tooling* (GREEN) that Opus runs on the data |
| 1M-context audits | Whole-corpus consistency sweeps where the input is public site content: every page's numbers vs canon in one context window | GREEN | Ready; plays to the 1M-context strength |

### Thread C: Products

| Function | What M3 does | Data class | Status |
|---|---|---|---|
| Product content variants | FAQ, plain-English assembly guides, spec-sheet variants, procurement one-pagers, all generated FROM `products.ts` canon (never inventing specs) and lint-checked against it | GREEN | Ready now |
| Test coverage for product logic | Cart, checkout guards, `isPurchasableProductType`, Stripe paths: the same calibrated pattern as the cost-model suite | GREEN (code) | **Proven**; natural next worker run |
| Image enrichment for product/brand assets | Alt text, tagging, caption drafts for the no-people brand and studio assets already deployed publicly | GREEN | Pending the vision test (`! /tmp/m3-vision-test.sh`) |
| Feedback structuring | Washing machine prototype feedback: M3 builds the intake/structuring tooling; community members' actual feedback text stays AMBER unless anonymised | GREEN tooling / AMBER content | Tooling ready |

### Thread D: Community connection

This is where the rule inverts: the closer data sits to community members, the less M3 touches it directly.

| Function | What M3 does | Data class | Status |
|---|---|---|---|
| Aggregate impact maths | Tooling + tests over anonymised aggregates (beds per community count, plastic kg, payback models): extends the cost-model suite it already wrote | GREEN | **Proven** pattern |
| Ownership-transfer documentation | Draft CATSI-corp handover document skeletons, training-manual structure from public/canon material | GREEN | Ready |
| Community data itself | Names, faces, locations-tied-to-people, asset condition notes naming households | RED | Never to MiniMax. The community connection is served by M3 freeing capacity, not by M3 reading community data |

---

## 4. Pipeline mechanics (how enrichment actually runs)

1. **`m3 "prompt"` one-shot**: piped GREEN content in, structured output back. For: classification sweeps, drafts, summaries. Claude can call this for content already in the conversation; anything reading repo files needs Ben to fire it.
2. **`claude-m3 -p` headless worker in a worktree**: the proven pattern. Scoped prompt (budget, stop criteria, fallback, file whitelist) + `--allowedTools` fence + Opus verification pass + PR. Ben launches via `! <runner-script> &`.
3. **Batch enrichment scripts (to build)**: `scripts/m3-enrich.mjs` taking a manifest of GREEN items + a task template, fanning out one-shot calls, writing results to a review file. Never writes to EL/Supabase directly; output is always a reviewable artefact.
4. **Verification is non-negotiable**: every M3 output gets the calibration treatment scaled to stakes. Tests get re-run; numbers get traced to canon; copy gets the draft-checker; nothing M3 produces ships unreviewed.

Classifier reality (learned this session): Claude cannot send repo content or credentials toward MiniMax under auto-mode. Every M3 run that reads the repo is Ben-fired via `!` runner scripts. A durable `Bash(claude-m3:*)` permission rule is possible if launches get tedious.

---

## 5. Hard NOs (regardless of data class)

- **Voice cloning of storytellers or community members.** The MiniMax MCP offers it; it is banned here the same way `video_create_quick_cut` is banned: consent cannot survive the operation.
- **Generative imagery of real people or country.** Brand illustration stays in the existing approved pipeline (line-illustration system, gemini for infographics); M3/MiniMax media gen does not produce people, places, or anything presented as documentary.
- **Consent, identity, or cultural judgments.** Including "fixing" name spellings, matching faces, or deciding what counts as culturally sensitive.
- **Direct writes to systems of record.** EL, Supabase, GHL, Xero, Notion. M3 output lands in files for review, full stop.
- **Language material.** Warumungu names and any community language content are community-owned; no machine processing.

## 6. Rollout sequence

1. **Done:** pool stood up, calibrated Grade A, first merged contribution (PR #88, cost-model suite).
2. **One command from Ben:** vision test (`! /tmp/m3-vision-test.sh`) to confirm image input on our key.
3. **Next worker runs (GREEN, high value, low risk):** cart/checkout test suite; canon-number consistency sweep across public pages; funder-corpus classification batch; product FAQ + assembly-guide drafts.
4. **Then:** `scripts/m3-enrich.mjs` batch harness; wiki raw-to-article compilation with Ben-picked batches.
5. **Standing review:** any AMBER batch is a named, per-batch Ben decision logged in this file's changelog. RED never moves.

## Changelog

- 2026-06-06: Initial map. M3 calibration Grade A; vision unverified on our key; no AMBER batches approved yet.
