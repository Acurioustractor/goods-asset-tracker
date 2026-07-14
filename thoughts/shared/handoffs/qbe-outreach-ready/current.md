# QBE Outreach-Readiness — Handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-19 (SAVE-TO-CLEAR — **QBE OUTREACH-READINESS JOB COMPLETE.**)

🎯 **Goal achieved:** the Goods × QBE pack is now *specific, easy-to-read artifacts, aligned across documents + Notion + website, on ONE canon, ready for investor/partner outreach.*

### Live on prod (verified by curl)
- **PR #128** `e50a35b` — claim-ceiling reframe ("a good bed is health hardware, not furniture", removed "prevent heart disease") + clip-on/"four legs" product copy → X-trestle canon, across ~13 website files.
- **PR #129** `b55ddf8` — removed stale `$600/$850/$1,200` price widget from /pitch + /pitch/document (contradicted canon $750).
- **PR #130** `5078d1a` — 11 rendered em-dashes recast on /impact.
- (Ben's separate **PR #131** `bba47df` "Assembled on Country" present-tense manufacturing-claims fix also on main — NOT this session's work.)

### Notion pack — fully aligned (live in Notion, no deploy needed)
- **Voice:** ~265 em/en dashes + arrows + "co-design" swept across all 12 diagnostic pages + index; **366 more** across the 9 active strat-pack children + Area 03 detail sub-page. All verified 0 prose dashes (page-19's 7 remaining = empty-table-cell "—" placeholders, intentional).
- **Cleared voices:** "3"→**32** (29 community + 3 practitioner) on Areas 05/07/index; Area 02 already correct; consent nuance (headshots=2 Ivy+Dianne) kept.
- **Signed revenue:** Ben confirmed accountant SIGNED the **Goods-only figure at AU$713,827** (carve-out; all-sources total stays AU$741,111). Swept across Areas 04/06/10 + front door (must-win #1 → ✅ achieved) + index + the 4 sub-pages that carried the stale $649,710.79 (00 Master Alignment Map [THE source doc, 5 spots], 03 Next-stage, 10 SEFA lender cover note, Area 03 detail).
- **Cost figure:** $420.74→$421 (canon.ts:133) on Areas 02/11.
- **Storyteller integrity:** Area 03 Alfred Johnson barge-quote mis-paste fixed (removed duplicated cost-model para).
- **Area 04** ACT-GD label reframed (project-lens workpaper vs the signed $713,827 carve-out).

### Key artifacts
- Full audit report: `thoughts/shared/handoffs/qbe-outreach-ready/audit-2026-06-19.md`
- Front door: Notion `381ebcf981cf813bbbcef58c727fcc20`; 12-area DB `cb3794d427914d72bf1036106d8116f5`.

### Git state
- Branch `docs/snow-onepager-assets` is **local-ahead 4, UNPUSHED**: `9e287d4` (P, claim-ceiling+product), `8c22943` (Q, qbe-readiness — docs-only, page absent on main), `093c474` (R, pitch widget), `fd415b9` (S, /impact). P/R/S content is on main via the squash-merged PRs (will dedup on docs→main rebase); Q is docs-only. Nothing of mine uncommitted (only a pre-existing `alignment-engine/current.md` mod, not this session's).
- Main (prod) HEAD: `5078d1a`.

### 🔑 Learnings banked
- Notion `update_content` matcher IS reliable on `$`/`~` if you ESCAPE them in old_str (`AU\$649,710.79`, `\~`); for dash edits anchor old_str AWAY from $/~ on plain words. Scan each sentence for BOTH dashes in parentheticals.
- Surgical-PR-to-main pattern: branch off origin/main in a worktree, cherry-pick the docs-branch fix commit, push, PR (handles the docs-vs-main divergence cleanly; /impact diverged 373 lines but the small em-dash hunks still cherry-picked clean).
- canon.ts is the dollar source of truth: community marginal = **421** (rounded), factory = **425.74** (precise); the stale $420.74 was the old precise community figure.

### ▶ Remaining (all genuinely-trivial, none block outreach)
1. Page-19 (GHL pipeline) 7 empty-table-cell `—` placeholders → "n/a" if ever wanted.
2. Retire/redirect the superseded "12 Investor alignment (13 June)" strat-pack child rather than keep it.
3. Eventually reconcile docs→main (the docs branch carries the merged fixes as separate commits + the docs-only qbe-readiness fix).

Detail in auto-memory: `[[goods-qbe-outreach-audit]]`.
