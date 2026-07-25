# Handoff — consent gate, claim hygiene, canon guards (2026-07-25)

## Ledger
<!-- Extracted by the SessionStart hook. Keep this section short. -->
**Updated:** 2026-07-25. **Two PRs merged to main and verified live** (#157 `7f360e9`, #158 `3501133`). Branch `claude/investment-deck-alignment-y3qc43` is clean and pushed. Nothing in flight.

**▶ NEXT:** a full project alignment session (strategy + plan). See "The next session" below. Standing business item unchanged: **QBE, application September 2026, $0 signed.**

---

## What shipped to production

| Fixed | Was |
|---|---|
| `/storytellers` + `/storytellers/[slug]` consent-gated at the data layer | no gate at all: every EL storyteller's name, photo, bio, Elder badge, public and indexable |
| `/press` reads 11 Communities from canon | 9, wearing a literal green **Verified** badge |
| `/partners/centrecorp` reads 11 | 9, while the same file said 11 two hundred lines up |
| washer canon 22 across `asset-canonical`, `canon.ts` prose, partner kanban | 20, pre-dating Ben's 2026-07-21 ruling |
| invented Kristy Bloomfield quote removed from `content.ts` | `verified: false` placeholder, never rendered, one import from the pitch page |
| CI runs on `claude/**` pushes | session pushes ran nothing until a PR existed |

Tests **192 → 231**. Canon `check: 'manual'` facts **14 → 12**, auto 8 → 12.

## New guards (they run in CI)

- **`check-retired-figures.mjs`** — fails on values canon has moved past. Retired-only by design: flagging *current* values would fire on legitimate per-community numbers. Small ints need a context word, dates excluded, deliberate historical mentions go in `ALLOWED` with a reason.
- **`consent.guards.test.ts`** (20) — the two default-deny gates must agree. No voice at tier hold/pending/internal passes the allowlist; every tier-external voice is on it.
- **`storytellers.consent.test.ts`** (6) — includes the direct-URL hole and fail-closed when EL is down.
- **`claims.guards.test.ts`** — no quote attributed to a named person may be marked unverified. Tests its own walker against a decoy.
- **`claims-ledger.guards.test.ts`** (8) — `assertLedgerSafe()` had no test. It is what stopped the withheld revenue figure re-leaking after `/deck` shipped it once.
- **`canon.guards.test.ts`** — `marginal-community` locked to `computeModel(DEFAULTS).marginalCommunity`.
- **canon lockstep** in `check-storyteller-registry.mjs` (cleared-voices count) and `check-story-coverage.mjs` (display pool).

## Facts settled

- **`cleared-voices` 32 → 34.** Gap was exactly Margaret Lloyd + Tanya Turner. `cleared-voices.ts` and registry tier-external both already said 34 and matched exactly; canon was the lone outlier.
- **`el-published-stories` 0 → 2.** EL holds 10 rows at `status='published'` but only 2 with `is_public=true`, and those 2 are exactly what the syndication RPC returns. Stays manual: CI has Goods Supabase secrets, not EL ones. Re-derivation query is in the fact's `source`.
- **`marginal-community` 421 was already correct.** It is `marginalCommunity` (270.74 + 150 freight), NOT `marginalFactory` (425.74). The QBE sweep's "~$426/bed" is the factory figure. **Do not reconcile them** — different build methods.

## Things that are true and easy to get wrong

- **EL has no per-storyteller consent column.** Checked all 40-odd columns. Its clearance signal counts STORIES. The `cleared-voices.ts` name allowlist is the only person-level gate that exists. The 2026-07-24 blanket clearance was on `media_assets`, not people.
- **Tennant Creek genuinely has 9 washers** against a national 22. The retired-figure scan flags it; it is correct. Do not "fix" it.
- **`*.pen` and `audit/*.json` are now gitignored.** ~5.7MB kept out of main's history. `design/goods-theory-of-change*.pen` stay tracked deliberately (already on main; untracking would delete them).

## Repo state

- `main` = `3501133`. Feature branch = `acc1785`, clean, pushed, **~803 files / 62,961 insertions ahead**.
- What remains on that branch is genuinely **new public surface**: `/brand`, `/pathways`, `/pathways/[id]`, four `/export/*`, four `/pitch/*`, plus the deck rebuild and admin work. That wants a Vercel preview walk, not a code review.
- Ship pattern that worked twice today: worktree off `origin/main`, cherry-pick, `cp -Rc node_modules`, build + test + `check:drift:ci`, squash-merge, curl-verify live.

## Two mistakes worth inheriting

1. I committed `.gitignore` **with conflict markers in it**. A resolution loop handled `wiki/canon/*` and `git add -A` staged the rest blindly. Caught by checking, not by anything failing.
2. An inserted import landed **inside a doc comment**, silently commenting it out. The build caught it: compiled, then failed type-check.

Both argue the same thing: run the gates, read the output, don't infer.
