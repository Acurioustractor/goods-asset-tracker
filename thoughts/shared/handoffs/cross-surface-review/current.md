---
date: 2026-06-10T19:43:59Z
session_name: cross-surface-review
branch: main
status: active
---

# Work Stream: cross-surface-review

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-06-11T20:55:00Z
**Goal:** Full alignment review across three surfaces so they all tell one consistent story on the same canon numbers: (1) the Notion page, (2) the website partner page, (3) a set of printable paper one-pagers. Done when the three agree on figures, names, and framing, and the paper one-pagers are exported. → DELIVERED (all merged). Last extra: dashboard "what your backing built" reframed to a % allocation (PR #122).
**Branch:** `main` at `6b1d3fc` (clean of my work — everything merged via PRs #121 + #122). Working tree has only auto-gen canon drift (needs-signoff/qbe-readiness/story-coverage, from running check:drift) + pre-existing untracked scratch; none of it is mine to commit.
**Test:** `cd v2 && npm run build` (clean build) · `npm run check:drift:ci` (hermetic canon/artifact/qbe/story guards)

### STATE AT /clear (RESUME HERE)
**Everything in this work stream is SHIPPED to main.** Nothing pending except two non-conflicts left for Ben's call (below). Ben is switching to a quick-edit model after this save.
- **What shipped:** (1) **PR #121** `dce5a07` — May-trip count 87→107 on dashboard kanban/history; Oonchiumpa roles (Karen Liddle chair / Kristy Bloomfield lead, both families); snow.ts outcomes grant reconciled fully-paid. (2) **PR #122** `6b1d3fc` — dashboard "What your backing has built" reframed from a $100K FY25 split to an indicative % allocation (community visits 25 / bed R&D 25 / washing machine 20 / production+deployments 20 / plant 10) with bars; headline Counted, split Modelled. Plus Notion partner-update + funder-profile edits (verified live); one-pager verified current; FY26 Acquittal already on-canon.
- **Canon source of truth:** `v2/src/lib/data/canon.ts` + `v2/src/lib/data/asset-canonical.ts` (496 beds / 9 communities / 28 washers·14 live / 2,660 kg / Snow $493,130 / QBE up-to-$400K contingent).
- **Key files for quick edits:** dashboard data = `v2/src/lib/data/partner-dashboards.ts` (the `snow` object: funderImpact.breakdown is the % allocation; communityPartnership = Oonchiumpa); dashboard render = `v2/src/app/partners/[slug]/dashboard/page.tsx`; one-pager = Pencil node `L3Uot` in `design/goods-theory-of-change-v2.pen` (export → `wiki/outputs/funder-reports/snow/`).
- **Run locally:** `cd v2 && npm run dev -- -p 3007` then `/partners/snow/dashboard` (pw `snow2026`). GOTCHA: if Turbopack panics ("turbo-persistence ... index out of range") or a stale `.next/dev/lock` blocks startup, `rm -rf .next` (or `rm -f .next/dev/lock`) and relaunch. Port 3000 is Ben's separate Harvest project, not Goods.
- **Open for Ben (non-blocking, don't auto-change):** (a) justice-youth wording — plain on Notion ("young people exiting the justice system") vs softened on dashboard ("young First Nations people"); (b) Butterfly board name — Notion says "Audrey Deemal", memory had "Eloise Hall". Both are person/claim facts; confirm with Ben before editing.
- **The % allocation numbers (25/25/20/20/10) are indicative, Ben-approved as a rough cut, labelled Modelled.** If Ben gives real numbers, edit `funderImpact.breakdown.items` in partner-dashboards.ts (`percent` drives the bar width, `value` is the "~25%" label).

### Now
[->] COMPLETE. Three-way Snow alignment shipped (**PR #121**, `dce5a07`). THEN, on Ben's review of `/partners/snow/dashboard`: reframed the "What your backing has built" section — the $493,130 cumulative headline sat next to a split that only acquitted the $100K FY25 grant (mismatched denominators). Replaced with an **indicative % allocation** across all Snow support (community visits 25 / bed R&D 25 / washing machine 20 / production+deployments 20 / plant 10), rendered as bars; headline stays Counted, split now Modelled + "indicative" note. Weighting confirmed by Ben (plant is small; money went to R&D/visits/washer/deployments). **PR #122 MERGED** to main (`6b1d3fc`, build+drift green, screenshotted locally). Dashboard-only (one-pager uses outcome cards; Notion update carries no finance breakdown). Dev server running locally on :3007 (stale Next lock was cleared). Nothing outstanding except the two non-conflicts left for Ben (justice-youth wording; Butterfly board name).

### This Session (2026-06-10, working-tree backlog → 5 merged PRs)
- [x] Triaged a large accumulated working tree (28 tracked mods + big untracked pile) into coherent clusters; nothing was broken, but it was never committed.
- [x] **PR #116 MERGED** — Oonchiumpa partner page accuracy rebuild (overclaims softened, 109→107 beds, X-trestle "click legs on" fix) + 13 assets (build photos, Karen/Mykel videos, factory panorama) + curated EL photo overrides (`field-note-overrides.json` partners-oonchiumpa block).
- [x] **PR #117 MERGED** — Elder name correction sitewide: Casey Holmes OAM → **Mr Donald Thompson OAM** (Ben-verified). 13 files; EL tag slugs `participant:casey-holmes`→`participant:donald-thompson`. Sweep verified complete (zero "Casey" left in src/docs/data).
- [x] **PR #118 MERGED** — Washer price figures to confirmed **$4,300** (V1) / **$2,000–$2,500** (target) across washer-journey.tsx + washing-machine.md + cost-register.md; "roughly half" framing; progress bar 33%→50%; confidence-legend layout.
- [x] **PR #119 MERGED** — Footer links repointed off gated pages: `/community`→`/communities`, `/impact`→`/story#impact` (both public).
- [x] **PR #120 MERGED** — Snow Foundation figure restated stale $193,785 → **~$493,130** (verified, Xero 3yr, $0 outstanding) in `.wiki-content` funder-register + snow-foundation, with source cite + "2 Xero-UI checks pending" caveat.
- [x] All 5 PRs were green (hermetic drift + tests + Vercel), MERGEABLE/CLEAN, disjoint file sets; merged with `--delete-branch`; local main ff to `50e7694`.
- [x] **Restored an accidental GHL revert** to HEAD: the working tree had silently reverted the 2026-06-08 canonical-tags compliance feature (R8 Spam Act consent gate, R9 OCAP lane:community guard, R10 capital_tier field). NOT committed — restored. Compliance feature preserved.

### This Session (2026-06-11, three-way Snow alignment APPLIED)
- [x] Confirmed the three targets with Ben (see Now). Established canon = `v2/src/lib/data/canon.ts` + `asset-canonical.ts` (496 beds / 9 communities / 28 washers·14 live / 2,660 kg / $493,130 Snow / $400K QBE cap contingent).
- [x] Read all three surfaces. Agreement on the headline canon was already clean (496/9/28·14/$493,130/QBE cap) across dashboard + Notion + one-pager.
- [x] **Found the one material conflict — May-2026 trip bed count.** Notion + dashboard kanban/history said **87** (with a 36+51 breakdown, 1,740 kg); Oonchiumpa page (PR #116) + dashboard partnership section said **107** (wiki flagged 107 as approved-DEMAND, not reconciled-delivered). Surfaced to Ben rather than auto-fixing (recipient delivery count, funder-facing).
- [x] **Ben decided: trip count = 107 (align Notion up); Oonchiumpa roles = Karen Liddle chairs, Kristy Bloomfield leads, both families named.**
- [x] **WEBSITE** (`partner-dashboards.ts`, branch `fix/snow-cross-surface-alignment`, commit `37f505a`): kanban + history `87 → 107 beds that trip`; partnership intro now "Bloomfield and Liddle families, chaired by Karen Liddle and led by Kristy Bloomfield". `check:drift:ci` clean + `npm run build` clean. NOT pushed.
- [x] **NOTION** (Tier 2, applied + re-fetch-verified): trip beat `87 → 107`, recomputed plastic `1,740 → ~2,140 kg`, mirrored the website geography (Utopia/Arawerr/Ampilatwatja, Oonchiumpa chose households, Centrecorp funded materials, builders each kept one), dropped the now-inconsistent 36+51 split; chair line `chaired by Kristy Bloomfield` → `chaired by Karen Liddle and led by Kristy Bloomfield`.
- [x] **ONE-PAGER** (`L3Uot`): re-exported PNG+PDF — byte-identical to the 06-10 files, so already on-canon ($493,130 / 496 / 9 / 14·28 / $400K-matched-not-awarded). VERIFIED CURRENT; removed redundant today-dated dupes. Kept `2026-06-10-snow-impact-one-pager.{pdf,png}`.

### Next
- [ ] Ben to merge **PR #121** when CI is green (Tier 3 — explicit "merge" verb; week's pattern = Ben merges).
- [x] "fix all" actioned: (a) Notion funder-PROFILE `348ebcf981cf813e955fd76ba624f260` fixed `$193K -> ~$493K` callout + current-state, and `R4 $200K -> $130K` (verified live); (b) FY26 Acquittal `371ebcf981cf8171bf27ef793c643335` ALREADY on-canon ($493,129.79 / $0 outstanding / flags $193,785 as stale / 496·9·133·363·2,660·28·14) — no edit; (c) `snow.ts` outcomes drawdown reconciled (in PR #121).
- [ ] JUDGMENT CALL left as-is (not factual conflicts): Notion says justice-involved-youth ("young people exiting the justice system"); dashboard softens to "young First Nations people" — audience-appropriate. Notion Butterfly board names "Audrey Deemal"; memory had "Eloise Hall" — board forming, unverified. Residual geography nuance: Oonchiumpa page attributes all 107 to "Utopia Homelands"; dashboard + Notion now say "Utopia, Arawerr and Ampilatwatja" (count agrees at 107).

### Decisions
- Per-cluster branches off main, each its own PR (disjoint file sets) — clean review, mergeable in any order. This worked well; keep the pattern.
- Did NOT commit the GHL canonical-tags revert — it stripped compliance logic accidentally; restored to HEAD instead. (Verify-before-delete rule paid off.)
- Commit style: concise scoped subject, no Claude attribution (matches repo convention), no em dashes.

### Open Questions
- UNCONFIRMED — **Which Notion page?** Candidates: Artifact Hub `378ebcf981cf8192a5e5c66b93630725` (master alignment spine); the Snow June-2026 Partner Update record; the Goods Brand Guide hub `373ebcf981cf81d58ee8fd91280f895f`; "11 Cost Model v6". Ask Ben.
- UNCONFIRMED — **Which website page?** Likely `/partners/snow/dashboard` (sendable funder artifact, pw `snow2026`) — or `/partners/oonchiumpa` / `/partners/centrecorp`. Ask Ben.
- UNCONFIRMED — **Which one-pager set?** Existing: `wiki/outputs/funder-reports/snow/2026-06-10-snow-impact-one-pager.{pdf,png}` (Pencil node `L3Uot` in `design/goods-theory-of-change-v2.pen`). Is this a refresh of that, or a new set (Oonchiumpa / Centrecorp / multi-partner)? Ask Ben.

### Workflow State
pattern: review-then-align
phase: 1
total_phases: 4
retries: 0
max_retries: 3

#### Resolved
- goal: "Full review across the Notion page, the website page, and then a set of paper one-pagers"
- resource_allocation: balanced

#### Unknowns
- notion_page_target: UNKNOWN (confirm with Ben)
- website_page_target: UNKNOWN (confirm with Ben)
- onepager_set_scope: UNKNOWN (confirm with Ben)

#### Last Failure
(none)

---

## Context

### Canon facts that MUST be consistent across all three surfaces
These are the corrections landed this session — the review must ensure none of the three surfaces still carries the old/stale versions:
- **Elder name:** Mr Donald Thompson OAM (NOT Casey Holmes), Alyawarr brother to Frank/Frankie Holmes OAM, Ampilatwatja.
- **Washer price path:** V1 ~$4,300; resident-accessible target $2,000–$2,500 (modelled founder estimates, labelled as such). NOT $4,500–5,000 / $1,000–2,000.
- **Snow Foundation cumulative:** ~$493,130 (~$493,129.79, Xero 3yr, $0 outstanding). NOT $193,785/$193K.
- **Utopia beds delivered:** 107 (NOT 109). Funded by Centrecorp, delivered via Oonchiumpa network.
- **Stretch Bed mechanism:** X-trestle tension design — poles thread THROUGH canvas sleeves + recycled-HDPE X-leg holes, then tension. NEVER "clip-on" / "click the legs on".
- **Org-wide canon totals** (from MEMORY/wiki): totalReceived ~$741,111; 496 beds / 9 communities; QBE Stage 2 cap up to $400K (at least matched, not secured until awarded).

### Brand/writing rules for any copy touched
- NO em dashes anywhere. Warm, grounded, community-first. Centre Indigenous voices.
- Avoid AI-writing tells (no "not just X but Y", no puffery, no forced rule-of-three, no decorative arrows in prose).
- Every dollar figure needs a source; modelled figures must be labelled modelled, never stated as secured.

### Surface tooling
- **Website partner pages:** `v2/src/app/partners/{snow,oonchiumpa,centrecorp}/`. Image swaps via in-page MediaSwapZone → writes `v2/data/field-note-overrides.json` (picks need commit+deploy). EL photo picker at `/admin/dashboard-images`.
- **Notion:** edits are Tier 2 (post a one-line "about to edit X" first). Notion MCP available.
- **Paper one-pagers:** Pencil `.pen` design work via Pencil MCP (`design/goods-theory-of-change-v2.pen`). Export → `wiki/outputs/funder-reports/...`. GOTCHA: fresh Pencil `Insert` frames render blank + offset; build by COPYING existing nodes.
- **Money figures:** read-only Xero via `/reconcile`; never write to Xero. Snow figure source: `wiki/outputs/funder-reports/snow/2026-06-09-snow-figure-reconciliation.md`.

### Repo state at save
- Branch: `main` @ `50e7694` (all 5 PRs merged in).
- Working tree dirty only with: auto-generated canon (`wiki/canon/qbe-readiness.md`, `story-coverage.md`, `needs-signoff.md`) + `thoughts/shared/handoffs/alignment-engine/current.md` (drift-loop output / handoff) — intentionally left uncommitted. Plus a large untracked scratch/asset pile (`output/`, `tmp/`, `generated-images/`, `design/`, brand images) — out of scope.
- v2 DB is Goods `cwsyhpiuepvdjtxaozwf`; use curl/psql with service-role key, NEVER the Supabase MCP for v2.

### Resume steps after /clear
1. MEMORY.md + this ledger load automatically. Read the "Canon facts" list above.
2. Ask Ben the 3 Open-Questions (which Notion page / which website page / which one-pager set).
3. Pull each surface's current content, diff against the Canon facts list, report drift.
4. Fix stale surface(s); export the one-pager set last so it reflects the agreed copy.
