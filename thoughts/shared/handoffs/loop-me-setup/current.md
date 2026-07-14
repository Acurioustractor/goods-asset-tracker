---
date: 2026-06-26T00:00:00Z
session_name: loop-me-setup
branch: docs/snow-onepager-assets
status: paused
---

# Work Stream: loop-me-setup

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-27
**Goal:** Use the `loop-me` skill to spec workflows for Ben's recurring loops. FIVE specs now complete + accepted: inbox-triage, receipt-acquittal, field-morning-read, funder-grant-triage, consent-gate.

### consent-gate (specced 2026-06-27)
- [x] Grounded: on-SITE EL content already gated in code (EL client `filterByConsent`/`getGoodsSiteClearance`/`stories_for_site` RPC; `cleared-voices.ts` = default-deny 32-voice allowlist). GAP = authored OUTBOUND content (funder emails, decks, social, ledger-story artifacts) that bypasses the runtime filter. inbox-triage bucket-5 already defers to "consent gate by hand". Sibling to the `ground` skill (facts).
- [x] Grilled 5 (one at a time): invocation = **shared gate in the publish path** (producers route through it + manual /consent-check; zero-ref content passes silently) · verdict = **always checkpoint when a ref is present, push-right** (all-green=2-sec approve; flags pre-loaded) · hold = **propose fix per flag, Ben applies, never auto-applied** · photos = **always flag, surface what's known** (EL-linked images checked like a name) · bias-to-block throughout.
- [x] Rule set: cleared-voices allowlist (WHO) + live EL withdrawal (freshness) + practitioner labelling + Ampilatwatja naming caution + claim ceiling (scabies→RHD WHY-only) + quote/photo consent.
- [x] Wrote `~/.claude/skills/loop-me/workflows/consent-gate.md` (accepted, 6 asserted defaults). Marked SPECIFIED in NOTES. ⚠ Build-time: confirm exact Ampilatwatja Elder name list + claim-ceiling wording in impact-model.ts.
- [NEW candidate surfaced] **withdrawal/takedown watcher** — scheduled sibling the consent-gate explicitly defers: when a voice withdraws consent AFTER publication, find + pull every place the voice already appears off-site. High-value OCAP completion.

### Codebase clarification (2026-06-27, Ben asked)
- This session = loop-me specs (GLOBAL, `~/.claude/skills/loop-me/`), org-wide. NO JusticeHub touched (repos exist: ~/Code/JusticeHub, JusticeHub Tests, JusticeHub-ux-review, Youth Justice Service Finder). NO Goods code committed (last commit b47bbaf, pre-session). Goods repo = read-only grounding for consent-gate + the incidental ledger write. Session is just ANCHORED in the Goods dir. Ben chose to KEEP GOING with loop-me.
**Branch:** docs/snow-onepager-assets (incidental — this work is global, lives in `~/.claude/skills/loop-me/`, NOT in the Goods repo)
**Test:** n/a (spec/docs work, no code shipped from this session)

### Now
[->] Nothing in flight. Session at a clean stop. Next action is Ben's choice: spec another loop, or build one of the four accepted specs.

### funder-grant-triage (specced 2026-06-27)
- [x] Grounded: the GrantScope grant side is ALREADY a near-complete autonomous loop — `discover-grants` (6am) → `enrich-grant-opportunities` (7am) → unify (6:30) → Notion/GHL 2-way sync, and **`grant-seed-weekly` (Mon 6:30am) auto-seeds top-5 into GHL silently**. `agent-funder-cadence` (6am) is a SEPARATE loop (silence-watch on existing named funders). Gap: no decide-queue (auto-seed has no checkpoint) + warm/inbox funder intros not covered.
- [x] Grilled 5 (one at a time): scope = **unified decide-queue (grants + warm funders)** · trigger = **weekly Mon grant batch + warm intros surfaced live + on-demand** · checkpoint = **Telegram decide-queue with inline [pursue][decline][research] buttons** · pursue depth = **lane-aware** (warm→Gmail draft + GHL seed; cold→GHL seed + research task, no auto-draft) · ranking = **two lanes, warm on top never auto-declined, grants top-N by existing fit-scorer**.
- [x] Verified build anchors: GrantScope DB = SEPARATE project `bhwyqqbovcjoefezgfnq` (`KNOWLEDGE_HUB_SUPABASE_URL`), NOT shared `tednlu…`. Bot already has `callback_query` → `handleReactorCallback` dispatcher (`apps/command-center/src/lib/telegram/bot.ts`). `seed-ghl-grants.mjs` needs a single-`--id`/`seedOne()` add for the pursue handler.
- [x] Wrote `~/.claude/skills/loop-me/workflows/funder-grant-triage.md` (accepted, 6 asserted defaults signed off). Marked SPECIFIED in NOTES.

### This Session (2026-06-27)
- [x] Ran `/loop-me` (no arg) → Ben chose **The Field morning read** to spec next.
- [x] Grounded against `act-global-infrastructure`: the read is ALREADY BUILT (`build-morning-read.mjs` → `the-field-morning.html`, ≤7 actions Water/Sun/Source/Reach + energy check; 6:50 `field-surfaces` cron; Warmth V2 locked 2026-06-07, rings from `field-decisions.jsonl`). It's PULL-ONLY; the 7:30 `telegram-daily-focus` is a different cockpit that does NOT carry it. command-center serves it at `/api/field/surface?name=morning` but is localhost-only (port 3002, not phone-reachable). `notion-daily-focus` owns the "🎯 Today's Focus" page (clear+rebuild each morning, runs 7:30 BEFORE the telegram push by design).
- [x] Grilled 5 questions (one at a time, recommended-answer): job = **pure surfacing + reliable push (no AI, no checkpoint)** · placement = **fold into the 7:30 telegram as a leading 🌱 The Field block** · contents = energy line + actions + link · link-down = **mirror full read into Notion Today's Focus** (phone-reachable) · brief actions = **4, one per category** (guarantees Reach, the "gold").
- [x] Wrote **`~/.claude/skills/loop-me/workflows/field-morning-read.md`**, status "spec complete and accepted (2026-06-27)", all 5 asserted defaults signed off. Marked SPECIFIED in NOTES.md.
- [NOTE] `receipt-acquittal.md` was specced + Phase 1/1.5 BUILT (dry-run) in a session between the 2026-06-26 handoff and now — it exists and is accepted; not this session's work.

### Next
- [ ] Spec the next loop via `/loop-me <name>`. Remaining candidates: **consent gate (OCAP)** (publish-time check on Empathy Ledger storyteller content — high-stakes, bias-to-block), ecosystem digest, PR babysitting.
- [ ] (Separate build task, act repo) Build field-morning-read: add JSON sidecar to `build-morning-read.mjs` → extend `notion-daily-focus.mjs` (prepend Field section) + `telegram-daily-focus.mjs` (prepend 4-action Field block + Notion link). NO new cron. Dry-run tracer both scripts first.
- [ ] (Separate build task, act repo) Build inbox-triage (dry-run tracer on ONE mailbox first). receipt-acquittal Phase 2 / OCR-ingest are the open levers there.

### Decisions
- loop-me NOTES is ABOUT THE WHOLE ACT ORG. Verifiable facts cross-checked against `/Users/benknight/Code/act-global-infrastructure/`.
- field-morning-read is a DELIVERY layer only — render + Warmth V2 are locked and untouched; loop adds a JSON sidecar + two script extensions; capture side (`field-decisions.jsonl` rings/energy, `field-captures.jsonl`) is OUT of scope (a separate future loop).
- Drafts/copy bound to Ben's standing brand voice (zero em dashes etc.).

### Open Questions
- (none blocking) — all three specs are build-ready.

### Workflow State
pattern: loop-me grilling (one-question-at-a-time spec authoring)
phase: 1
total_phases: 1
retries: 0
max_retries: 3

#### Resolved
- goal: "Install loop-me + spec first workflow (inbox-triage)"
- resource_allocation: conservative

#### Unknowns
- (none)

#### Last Failure
(none)

---

## Context

### What this work stream is
Pure global-skill / personal-tooling work. The `loop-me` skill (Matt Pocock, `mattpocock/skills`) runs a stateful `/grilling` session whose only output is **workflow specs** — one spec per recurring "loop" in Ben's life. It is `disable-model-invocation: true`, so it only runs when Ben types `/loop-me` (optionally `/loop-me <loop to spec>`). NOT to be confused with the built-in `/loop` (recurring-task runner) — different things.

### Where everything lives (all OUTSIDE the Goods repo)
- `~/.claude/skills/loop-me/SKILL.md` — the skill (identical to upstream).
- `~/.claude/skills/loop-me/NOTES.md` — Ben's confirmed world (tools, channels, terminology, candidate loops). Source of truth the grilling reads from.
- `~/.claude/skills/loop-me/workflows/inbox-triage.md` — first completed spec.

This handoff lives in the Goods repo only because that's the active working dir; the work itself touches no Goods files.

### inbox-triage spec — full summary
See `~/.claude/skills/loop-me/workflows/inbox-triage.md`. It is implementer-ready and carries its own dry-run acceptance test. Key shape:
- **6 buckets:** reply-needed (draft) · money/receipt (extract+flag) · funder/opportunity (fit-score+log Notion) · warm orbit (draft+tag ring) · community/OCAP (FLAG ONLY, hands-off) · FYI/no-action (label+leave).
- **OCAP detection (safety-critical):** GHL `lane:community` OR Empathy Ledger thread OR consent/storyteller/Country keywords → bucket 5; uncertain → bucket 5. Over-flags on purpose.
- **Autonomy:** reversible actions (label/archive/extract/fit-score/log/GHL-tag/draft) run autonomously + continuously; the brief is a pure decide-queue (drafts to send, OCAP to handle, one "what I did" transparency line). Sending email = manual always (Gmail tooling has no send, which enforces it).
- **Brief:** Telegram push, ~08:00 local + on-demand `/brief`, empty suppressed, one unified brief sectioned by bucket across all 4 mailboxes, each line links down to the asset.
- **State:** Gmail labels only (`loop/triaged` + bucket labels); new inbound re-queues; no new datastore.
- **Build home:** `act-global-infrastructure` (alongside existing sync scripts + the grammY Telegram bot + a cron).

### NOTES.md correction worth remembering
The only stale fact found: notion-sync script count is ~**42 outbound + 9 inbound**, not 17. Everything else Ben seeded held up against the act repo.

### Resume instructions
This stream needs no Goods-repo state. To continue: just run `/loop-me <next loop>` in any session (it reads its own NOTES + workflows). To build inbox-triage, switch to the `act-global-infrastructure` repo and work from the spec file. Nothing here blocks the Goods `docs/snow-onepager-assets` branch (which carries unrelated pre-existing WIP — see the centrecorp-utopia-page handoff).
