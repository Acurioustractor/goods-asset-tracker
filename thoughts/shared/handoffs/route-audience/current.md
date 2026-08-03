---
date: 2026-08-02T14:10:00Z
session_name: route-audience
branch: main (52994da) — work landed via PRs, four branches pushed unmerged
status: active
---

# Work Stream: route-audience

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-02T14:10:00Z
**Goal:** Every route declares who it is for and leads with what that reader came for, enforced by a guard. DONE when the nine rewrites are fixed and `check:audience` reports 0.
**Branch:** `main` = `52994da`. Four branches pushed, no PR.
**Test:** `cd v2 && npm run check:audience && npm run test && npm run check:drift:ci`

### Now
[->] Nothing in flight. Four green branches await a merge decision; the urgent list is not code.

### This Session
- [x] **PR #190 MERGED + VERIFIED LIVE** — `/pitch/deck` stopped publishing the presenter script. It named every funder in the pipeline with amount and stage on an indexed page. Found by accident.
- [x] **PR #191 MERGED + VERIFIED LIVE** — `audience.ts` applied to all 206 routes. `route-audience.ts` + `check-audience.mjs`, chained into `check:drift` AND `check:drift:ci`. `servedBy` deleted. Sweep executed (story collapse, pitch collapse, four retirements, 14 redirects at 307, `/admin/products`, seven `legacy-page.tsx`).
- [x] **PR #192 MERGED + VERIFIED LIVE** — `/partners` built from `pathway-stages.ts`. Zero figures on the page, verified live. 0 audiences without a front door.
- [x] Wayfinding map #177: twelve tickets charted and all closed.
- [x] `DECISIONS.md` rulings X, Y, Z, written AFTER the sweep ran.
- [x] Two audiences added: `operator`, `press`.
- [x] Nine rewrites identified and recorded with the rule each breaks.

### Next
- [ ] **Merge `fix/sites-ruling-v` (`63292af`)** — highest value. The $607.5K counted a bed buyer and four surfaces printed it; dollar-for-dollar was implemented as arithmetic and exported to the clipboard for Notion; ruling P violated outside `engine.ts`.
- [ ] **Merge `fix/shop-spec-first` (`2bc4a71`)** — the buyer front door. After deploy, re-run `scripts/read-route-leads.mjs` and flip `/shop` from `rewrite` to `keep`; count goes 9 -> 8.
- [ ] Merge `docs/route-audience-ruling` (`95ec0fb`) and `chore/route-ground-truth` (`e41e1df`).
- [ ] Fix the remaining rewrites: `/story` (aggregate language, supporter front door), `/portal*` x4 (never names the nine modules), `/`, `/process`, `/shop/washing-machine`.
- [ ] Sweep leftovers: move the 14 admin page-level redirects into `next.config.ts`; absorb `route-review.ts` (migrate `job` + `dataSources`, delete it, re-render `/admin/route-review`).

### Decisions
- **Exactly one audience per route**: no primary/secondary; `plumbing` is the only exemption and is pattern-bound. A route serving two readers has not been split yet.
- **`shouldLeadWith` is derived, never stored**: change `buyer.leadWith` and every buyer route moves. Makes the model load-bearing.
- **`retire` must be earned**: zero inbound links AND never shared externally, else `redirect`. When unsure, redirect.
- **All retirement redirects in `next.config.ts`, 307 first**: the `/brand` 308 kept redirecting after its rule was deleted.
- **`leadsWithNow` is production truth**: read from the live site, so a fix does not flip a verdict until it deploys and is re-read. Deliberately left `/shop` at `rewrite`.
- **Only clear violations marked as `rewrite`**: a go-deeper page a reader clicked into is not failing by opening with its own subject. Marking those would push the count past thirty and make it meaningless.

### Open Questions
- UNCONFIRMED: **the $607.5K on `/sites/qbe-readiness` still needs re-deriving from GHL** before the 3 September QBE check-in. Could not close it: the opportunities API paginates by cursor and only 200 records were read. Use `/reconcile`, which halts on mismatch.
- UNCONFIRMED: whether the nine rewrites are the right nine, or the "clear violations only" judgement was too lenient.
- OPEN, recorded in `operator.open`: **the wiki is publicly readable and safety content on an open route is a different risk from marketing content.** Never decided whether that surface should be open, gated or printed.
- UNCONFIRMED: `/design/*` files exist in the repo but 404 in production. Cause never established. Whatever causes it could be silently true of a route that matters.

### Workflow State
pattern: wayfinding map (issue #177), decisions then execution
phase: 5
total_phases: 6
retries: 0
max_retries: 3

#### Resolved
- goal: "work out what content Goods should make, what belongs on the website, and what the messaging is" — narrowed by Ben to the route/audience mapping, which the brief called "the deliverable everything else follows from"
- resource_allocation: aggressive

#### Unknowns
- qbe_stack_total: UNKNOWN (needs full GHL pagination)
- rewrites_completeness: UNKNOWN (judgement call, unreviewed)

#### Last Failure
(none — all gates green at session end)

---

## Context

### The one thing that mattered most, and it was found by accident

`/pitch/deck` was publishing `slide.script` — the **in-room presenter narration** — on a route with
no `noindex` that `audience.ts` pointed funders at. The money slide's script named **every funder in
the pipeline with amount and stage**: Minderoo, Tim Fairfax, Snow, Rotary Eclub, Centrecorp, SEFA,
White Box, LendForGood, Metro Finance. To an audience that includes those people.

The lasting lesson is bigger than the page. `deck.guards.test.ts` excluded `script` from every claim
check **on the stated premise that no public renderer reads it**. That premise was false, so bed
thresholds, "14 September" and retired-figure checks all ran against a string set that omitted the
longest prose on the page. Nothing retired had actually slipped in (checked by hand). **A guard
whose scope rests on a written assumption about another file will rot. Assert the assumption.**

### The honest read on the day (Ben's reflection, and it should carry forward)

Route classification has clean edges and produces green checkmarks. It is satisfying work. It is
**infrastructure**: it makes the next person's work cheaper and stops a class of error recurring, and
it says nothing to a funder, a buyer or a community.

**A day of legible progress can sit very comfortably on top of the two or three things that are
actually overdue.** None of the following moved, and none of it is code:

- **Randle Walker, five weeks unanswered** on the Mparntwe / Tennant Creek split. Verified in GHL:
  the $106,150 is recorded **twice**, in Goods Supporter Journey ("Ask made") and Goods Buyer
  Pipeline ("Proposed"). **No Xero invoice exists** — INV-0331 is absent from the sequence, so the
  draft quote was never issued. And **his contact carries `dnd: true`**, so none of his eight comms
  tags can fire. Contact `ehnCEv62bCaGNTd1QuGp`.
- **$0 signed** against the 31 August gate.
- **ALIVE / University of Melbourne is $167,200 OVERDUE** — INV-0341 ($66,000) and INV-0342
  ($101,200, *"Gathering the Parts" 100 Bed Delivery*), both AUTHORISED, both due 30 July. Found by
  accident while looking for Centrecorp. Larger and more actionable than the Centrecorp ask.
- **The Xero identity problem**: COGS $0, 83.6% of income in unclassified Other Revenue, no financial
  identity separate from Nic. Constrains what can honestly be claimed.
- **The nine rewrites are a diagnosis, not a fix.**

### Ruling sweeps rot, caught twice in one day

`ask-surface.ts` was corrected in the **morning** to record that the $607.5K grants total included
**Centrecorp at $75K, a bed buyer**. By the **afternoon** four surfaces still printed the old figure,
including `/export/leave-behind` — the document handed to funders — which listed "Centrecorp $75K
grant" as a named line beside Snow and SEFA.

Separately, `route-review.ts` (found by accident, 708 lines, built 2026-07-20, never mentioned in the
whole effort) carried eight `retire` dispositions of which `/admin/products` had sat unexecuted for
thirteen days.

### Guards caught five real defects, three of them mine

- `src/proxy.ts` declares gating in **arrays** as well as `pathname ===` comparisons; my parser read
  only the second, so `/community`, `/my-items`, `/production` looked ungated.
- Routes that redirect were left with no audience. A redirecting route has a reader; that reader is
  why the target was chosen.
- `check-audience.mjs` reads `git ls-files`, so it failed on `/partners` before the file was staged.
  The repo's own rule enforcing itself on the commit that introduced the file.
- The admin route directory (PR #168) failed on `/admin/products` as a ghost entry.
- `check-qbe-guardrails` fired on a comment **stating ruling V correctly**. `check-retired-figures`
  already had `NEGATED` and its comment calls that "the fourth time in one week a guard has flagged
  the field that enforces the thing it guards". This was the fifth. Ported across and verified it
  still fails on a genuine violation.

Also: `check:voice` passed on the `DECISIONS.md` entry, and hand-grepping found **twelve em-dashes in
body prose** where the file uses them only in date headings, two in its whole history. **A clean
guard does not mean clean.**

### Where the work lives

- Map: `Acurioustractor/goods-asset-tracker` issue **#177**, twelve closed tickets, consolidated
  sweep posted as a comment.
- Merged: PRs **#190**, **#191**, **#192**. `main` = `52994da`.
- Pushed, no PR: `fix/sites-ruling-v` · `fix/shop-spec-first` · `docs/route-audience-ruling` ·
  `chore/route-ground-truth`.
- Memory: `goods-audience-model-applied`, `goods-deck-script-leak`, `goods-money-figures-unswept`.
- Worktrees still on disk: `/private/tmp/claude-501/goods-{audience,sites,shop,ruling}`. Safe to
  remove; all four branches are on the remote.

### Working tree

Ben's tree is `feat/pitch-road-ending` at `cf13a24`, **untouched all session**, still carrying ~68
files from other sessions. All work was done in separate worktrees off `origin/main`.
