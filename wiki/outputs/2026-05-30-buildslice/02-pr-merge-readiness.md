# PR Merge-Readiness + Ordered Merge Sequence

**Date:** 2026-05-30
**Scope:** Open Goods PRs #47–#52 (priority) + #38 (glance).
**Mode:** READ-ONLY assessment. This is a PLAN. Nothing was merged, closed, pushed, retargeted, or commented on.
**Base:** `main` @ `049fc58`
**Live status source:** `gh pr view/checks` + `git merge-tree` simulations (all verified this session, not from memory).

---

## 1. Per-PR readiness table

| PR | Branch | Base | CI | Mergeable (GH) | Files touched | Notes |
|----|--------|------|----|----------------|---------------|-------|
| **#47** | `feat/investors-cockpit-gate` | `main` | ✅ all pass | MERGEABLE / CLEAN | 13 | Investor cockpit `/investors`. Fully isolated — overlaps **zero** other PRs. |
| **#48** | `fix/qbe-public-copy-quarantine` | `main` | ✅ all pass | MERGEABLE / CLEAN | 8 | /impact accuracy + provenance. **Conflicts with #52** (3 files, confirmed). |
| **#49** | `feat/admin-operating-systems` | `main` | ✅ all pass | MERGEABLE / CLEAN | 4 | `/admin/operating-systems`. Only shared file = `admin-sidebar.tsx` (auto-merges). |
| **#50** | `feat/admin-loi-tracker` | `main` | ✅ all pass | MERGEABLE / CLEAN | 4 | LOI tracker (live GHL). Base of #51's stack. Sidebar overlap w/ #49 is trivial. |
| **#51** | `feat/audience-comms-and-impact-reports` | **`feat/admin-loi-tracker` (#50)** | ✅ pass (Vercel) | MERGEABLE / CLEAN | 10 (own work) / 13 (vs main, incl. #50) | **STACKED ON #50 — base is NOT main.** Must retarget to `main` after #50 lands. |
| **#52** | `fix/asset-canonical-counts` | `main` | ✅ all pass | MERGEABLE / CLEAN | 20 | Canonical asset counts + Stretch-only plastic. **Conflicts with #48** (3 files). |
| #38 | `chore/admin-cost-model-v6-2026-05-29` | `main` | ✗ (DIRTY) | **CONFLICTING / DIRTY** | 1 | **SUPERSEDED — recommend close.** See §4. |

CI legend: every focus PR is green — Vercel deploy + Netlify header/redirect + (where present) `auto-tag` GitHub Action all `pass`. No focus PR is red. (#48 and #51 have no `auto-tag`/Netlify build rows but their Vercel deploys completed; nothing failing.)

**`mergeStateStatus = CLEAN` here means "mergeable against current main as a standalone branch."** It does NOT account for sibling PRs — GitHub computes it pairwise against main only. The real cross-PR conflict (#48↔#52) and the stack (#51 on #50) are surfaced below by direct `git merge-tree` simulation, not by trusting the per-PR CLEAN flag.

---

## 2. File-overlap / conflict matrix

Computed via `git diff --name-only origin/main...<branch>` intersections, then `git merge-tree --write-tree` to classify each non-empty intersection as **AUTO** (clean 3-way merge) vs **CONFLICT** (real textual collision).

| pair | shared files | merge-tree result | verdict |
|------|--------------|-------------------|---------|
| **#48 ∩ #52** | `content.ts`, `grant-content.ts`, `outreach-targets.ts`, `story-atoms.ts` | **exit 1 — CONFLICT in 3 files** (`content.ts`, `grant-content.ts`, `outreach-targets.ts`) | 🔴 **HARD CONFLICT.** Overlapping/adjacent hunks (both edit `content.ts` ~L43 region; both edit `outreach-targets.ts` L199; #48 `grant-content.ts` L196 vs #52 L197). `story-atoms.ts` edits are in different regions → no conflict there. **Whichever merges first, the other must rebase.** |
| #49 ∩ #50 | `admin-sidebar.tsx` | exit 0 — AUTO | 🟢 Trivial. #49 adds `Network` icon + "Operating systems" nav (Today group); #50 adds `FileSignature` icon + "LOI tracker" nav (different group). Different line regions, merges clean. (This is the "known trivial admin-sidebar overlap" — verified, no action needed.) |
| #49 ∩ #51 | `admin-sidebar.tsx` | exit 0 — AUTO | 🟢 Trivial. Same reasoning — distinct nav/import regions. |
| #50 ∩ #51 | `admin-sidebar.tsx`, `loi-pipeline.ts`, `ghl/index.ts`, `loi-tracker/page.tsx` | n/a — **STACK, not conflict** | 🟢 #51 is built **on top of** #50, so these appear in #51's diff-vs-main only because #50's commits are included. After #50 merges + #51 retargets to main, #51's effective diff = its own 10 files. No collision. |
| #47 ∩ {all} | — | empty | 🟢 #47 is fully isolated. |
| #48 ∩ {#47,#49,#50,#51} | — | empty | 🟢 #48 only collides with #52. |
| #52 ∩ {#47,#49,#50,#51} | — | empty | 🟢 #52 only collides with #48. |

**Bottom line:** exactly **one** hard ordering constraint exists — **#48 and #52 are mutually exclusive on first merge**; the loser rebases. Everything else is independent or a clean stack.

---

## 3. Recommended merge sequence (into `main`)

Ordering principle: land the fully-isolated PRs first (zero risk), then the admin cluster (clean auto-merges), then sequence the one conflicting pair last so only **one** rebase is needed, and slot the stack (#51) immediately after its base (#50).

> All commands below are **shown, not executed.** Ben runs them. Each merge re-triggers CI on the next branch via GitHub's auto-update if "require branches up to date" is on; if not, a `git fetch` between steps keeps `merge-tree` predictions valid.

### Step 1 — #47 (investor cockpit) — isolated, zero risk
*Why:* overlaps nothing; gated `/investors` page; safe to land first.
```bash
gh pr merge 47 --squash --delete-branch
```
> ⚠️ Pre-merge human gate (not a blocker for the merge itself): set `INVESTORS_PASSWORD` in Vercel before sharing the URL with QBE — it falls back to a default if unset.

### Step 2 — #49 (operating-systems) — isolated except trivial sidebar
*Why:* only shared file is `admin-sidebar.tsx`, which auto-merges; new `/admin/operating-systems` route.
```bash
gh pr merge 49 --squash --delete-branch
```

### Step 3 — #50 (LOI tracker) — base of the #51 stack
*Why:* must land before #51 can retarget. Sidebar overlap with #49 already proven auto-mergeable.
```bash
gh pr merge 50 --squash --delete-branch
```

### Step 4 — RETARGET #51 to main, then merge — audience comms + impact reports
*Why:* #51's base is currently `feat/admin-loi-tracker` (#50). Once #50 is on main, retarget #51 to `main` so GitHub recomputes its diff against main (its own 10 files). It does not overlap #48/#52/#47/#49, so it merges clean.
```bash
# retarget the base branch from feat/admin-loi-tracker -> main
gh pr edit 51 --base main
# (optional but recommended if #50 was squash-merged: rebase #51 onto fresh main locally,
#  since squash changes #50's commit SHAs — a plain retarget can leave duplicate hunks)
git fetch origin
git switch feat/audience-comms-and-impact-reports
git rebase --onto origin/main origin/feat/admin-loi-tracker
git push --force-with-lease            # Tier 2 — only on this owned feature branch
# then:
gh pr merge 51 --squash --delete-branch
```
> Note: because Steps 1–3 use `--squash`, #50's original commits are rewritten on main. The `git rebase --onto` above is the clean way to re-base #51's own commits onto the squashed main and avoid GitHub showing #50's already-merged changes as part of #51. If you instead merge with `--merge` (not squash) throughout, a bare `gh pr edit 51 --base main` is usually sufficient — but the rebase is the safe default.

### Step 5 — #48 (public-copy quarantine) — first of the conflicting pair
*Why:* land #48 before #52 so the textual conflict is resolved exactly once, on #52. (Order #48-before-#52 vs #52-before-#48 is interchangeable — pick #48 first because it is smaller/copy-only, making the #52 rebase mechanical.)
```bash
gh pr merge 48 --squash --delete-branch
```

### Step 6 — REBASE #52 onto main (resolve 3-file conflict), then merge — asset canonical counts
*Why:* #52 conflicts with #48 in `content.ts`, `grant-content.ts`, `outreach-targets.ts`. After #48 is on main, rebase #52 and resolve the 3 conflicts (both sides are small one-line copy/number edits — keep #52's canonical counts where they differ, keep #48's copy-quarantine wording where they differ; they target different facts so most resolutions are "take both").
```bash
git fetch origin
git switch fix/asset-canonical-counts
git rebase origin/main
# resolve conflicts in the 3 files (content.ts, grant-content.ts, outreach-targets.ts), then:
git add v2/src/lib/data/content.ts v2/src/lib/data/grant-content.ts v2/src/lib/data/outreach-targets.ts
git rebase --continue
cd v2 && npm run build        # confirm clean tsc/build after the manual resolution
git push --force-with-lease   # Tier 2 — owned feature branch
gh pr merge 52 --squash --delete-branch
```

### Final order (one line): **47 → 49 → 50 → 51 (retarget) → 48 → 52 (rebase)**

Alternate equally-valid order if you prefer the big asset-counts change in earlier: **47 → 49 → 50 → 51 → 52 → 48** (then #48 is the one that rebases). Either way, **exactly one** of {#48, #52} needs a manual conflict resolution.

---

## 4. #38 — cost-model v6 (superseded, recommend CLOSE)

- **State:** `CONFLICTING / DIRTY`, base `main`, 1 file (`v2/src/app/admin/cost-model/cost-model-explorer.tsx`), last updated **2026-05-29** (stale).
- **Superseded:** the v6 "honest read" intent (marginal vs fixed, breakeven, guardrails) is **already on main** via:
  - `b2e2607` "lead with honest marginal/fixed/breakeven + lock numbers" (PR #41)
  - `b49bcb9` "full-screen 3-skin cockpit + v6 community fair-wage reframe" + `275d63c` (PR #44)
  - `4dbc9c9` v6.1 investment-layer + `320a07d` (PR #45), `049fc58` breakeven-333 (PR #46)
- **Why it can't just merge:** main's cost-model UI was refactored from `cost-model-explorer.tsx` into `cost-model-workspace.tsx` (the 3-skin cockpit). #38 edits the old `-explorer.tsx` file, so it conflicts and its target has been restructured underneath it.
- **Recommendation (Ben's call — Tier 3, not executed here):** close #38 as superseded.
  ```bash
  # gh pr close 38 --comment "Superseded by v6 cockpit on main (PRs #41/#44/#45/#46). Closing."
  ```

---

## 5. Flags / watch-items

- 🔴 **#48 ↔ #52 is the only hard conflict** — confirmed via `git merge-tree` (exit 1, 3 files). One of them must rebase. Don't merge both blind.
- 🟡 **#51 base is NOT main** (`feat/admin-loi-tracker`) — retarget after #50 lands or its diff will look wrong / it cannot merge into main.
- 🟡 **Squash vs merge-commit choice changes the #51/#52 retarget mechanics** — with `--squash`, rebase `--onto` is the clean path (commands above). With `--merge`, a bare base-retarget often suffices.
- 🟢 admin-sidebar.tsx is touched by #49, #50, #51 but **all three auto-merge** (distinct regions) — no action.
- 🟢 #47 fully isolated; safe to land anytime/first.
- ⚪ All six focus PRs are **green on CI** as of this assessment — no red builds blocking.
- ⚪ `INVESTORS_PASSWORD` Vercel env var is a pre-share gate for #47 (not a merge blocker).
