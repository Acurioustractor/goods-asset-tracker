# Design System Reconciliation + docs→main Ship — Handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-20 (SAVE-TO-CLEAR — **design-system reconciliation + the whole docs→main code ship are DONE & live on prod.**)

🎯 **What this session did:** reconciled the Goods design system to one canon (repo + Claude Design project + live site), then shipped every stranded prod-code change from the long-lived `docs/snow-onepager-assets` branch to main via surgical PRs. All verified live.

### Live on prod (all merged to main, checks green: hermetic tests + drift guard + Vercel)
- **PR #134 `c2bb10d`** — canon palette (softer terracotta `#C45C3E`/sage `#8B9D77`/teal/clay/gold; `globals.css` has a `--goods-*` brand layer mirroring `design/brand/tokens.css`, shadcn theme derives via `var()`) + **softened home** (post-hero capital-stack/company section removed; entity+DGR info kept in footer + /partner + nav) + **AA sage contrast** (`--accent-foreground`→ink; 2 solid sage-band CTA buttons given explicit light style) + **canon home impact band** (496/9/16/2,660kg; dropped the live raw-row-count fetch 561/10 + the "~2,244 lives impacted" claim-ceiling metric). Curl-verified on www.goodsoncountry.com.
- **PR #135 `1a97799`** — /admin/canon photo board + /admin/media-library + canon-* APIs + canon-el-picks/local-image-tags/local-images data + **`design/brand/` token source** + **ToC generator** (`scripts/generate_theory_of_change.py` now parses tokens.css) + regenerated `theory-of-change.{svg,png,pdf}` on canon. Internal/gated; dep closure verified.
- **PR #136 `a6883ec`** — **P4 canonical 5-domain `/impact` + `/insights` redesign** (3 shifts → 5 domains → scabies→RHD as the *why* → cost model; reviewed on preview first) + **`/impact` hero stat band fixed to canon** (was raw `impact-fetcher` 524 totalAssets + a "Lives Impacted" claim-ceiling metric → now `CANONICAL_ASSETS` 496/16/2,660kg/9 + modelled employment hrs from canon beds + invested; "Lives Impacted" dropped). `/insights` curl-verified live ("five domains" present, old "four pillars" gone). `/impact` gated (prod IMPACT_PASSWORD unknown; local fallback `goods2026`), verified structure locally + drift-guard green.

### Claude Design project (a24f62c8) — fully reconciled to canon
- 19 files reconciled + pushed (numbers/claim-ceiling/$750/X-trestle/co-design→design partner/Georgia/hero img + NEW voice card + zero em-dashes), adversarially verified (19-agent workflow). **DECK PULLED** (superseded $120K/$600/prevent-heart-disease + Weave Beds).
- Foundation re-pushed to canon hex palette + ink accent-foreground (`_base.css`, `colors_and_type.css`, ui-kit `tokens.css`).
- Swatch cards tidied (`colors-primary`, `colors-neutrals`: canon oklch+hex labels, dash-free subtitles).

### docs→main reconciliation = COMPLETE
- All **prod code** that was stranded on `docs/snow-onepager-assets` is now on main (#134/#135/#136). What remains on the branch is only `wiki/`/`thoughts/`/`design/` handoff+content work — correctly branch-only. The branch is now code-equal to main.

### Git state
- main HEAD: **`a6883ec`** (#136).
- `docs/snow-onepager-assets` carries the (now-duplicated) palette/home/fix commits + the branch-only docs/wiki/thoughts/design content. Can be reset/retired or kept as the handoff branch — Ben's later call, nothing stranded.
- Surgical-PR-off-main pattern used throughout (worktree off origin/main, re-apply edits onto main's #128–135 base so prior fixes preserved, PR, watch checks, squash-merge, verify live). All worktrees cleaned up.

### 🔑 Learnings banked
- `goodsoncountry.com` 307-redirects to **www.goodsoncountry.com** (curl the www host to verify prod, not the apex).
- The Vercel **git-branch preview aliases are SSO-gated (401)** for headless; prod (www) is public. Local dev (`npm run dev`) strips Supabase → data is skeleton but CSS/structure render. `/impact` is password-gated (`process.env.IMPACT_PASSWORD || 'goods2026'`; locally the env var is unset so the fallback `goods2026` works).
- The repo's prod-ship pattern is **surgical PR to main** (NOT wholesale docs→main merge — docs is 68 commits / 163 files / +21.6k diverged, mostly handoff/content).
- `gh pr checks <N> --watch` is the clean gate (waits for hermetic tests + drift guard + Vercel, exit 0 = all green) before squash-merge.

### ▶ Remaining (tiny, no prod impact)
1. `impact-fetcher` `storytellerCount: 33` fallback baseline (canon 32) — stale on BOTH branches, so not a regression; 1-line cleanup if wanted.
2. Docs branch fate — reset to main vs keep as handoff branch.
3. **On-Country hyphen** — DS docs document the hyphen ("On-Country manufacturing"); live site is 92:25 no-hyphen. Left as-is, flagged for Ben to settle.

Detail in auto-memory: `[[goods-design-system]]`.
