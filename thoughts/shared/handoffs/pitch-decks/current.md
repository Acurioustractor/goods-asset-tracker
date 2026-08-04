# Pitch decks, the reading apparatus, and the Claude Design bridge

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-05T06:30:00Z
**Goal:** Make the pitch deck easier to read and understand, and clean the funder-facing
design-system cards. Code work is DONE and green. **PR #206 is OPEN and NOT MERGED.**
**Branch:** `feat/pitch-readability` = `0b624b2`, one commit ahead of `origin/main` = `68433c1`.
**Test:** `cd v2 && npm test && npm run check:audience && npm run check:voice && npm run check:retired-figures && npm run build`

### Now
[->] **NEXT TOPIC = DEEP RESEARCH: how to drive Claude Design fully from the Claude CLI.**
     Read "The research question" below FIRST. The premise that this cannot be done is WRONG
     and was my error, not a finding. Most of it already works.

[->] **PR #206 needs a human call.** Green, MERGEABLE, CLEAN, preview verified. Ben opened the
     preview but had not reported back before the session ended. Do NOT merge without him
     saying he has looked: the 2026-07-27 six-front-doors revert happened exactly this way.
     Preview: https://goods-on-country-git-feat-pitc-2d336d-benjamin-knights-projects.vercel.app/pitch/road

[->] **Claude Design gallery is in a broken intermediate state until someone reindexes.**
     See "The one manual step" below. This is the ONLY thing today that a human had to do.

---

## The research question for the next session

**Do not start from "can we connect Claude Design to the CLI". We already have.**

Verified working today via the `DesignSync` MCP tool, all from the CLI:
`list_projects` · `get_project` · `list_files` · `get_file` · `create_project` ·
`finalize_plan` · `write_files` (11 files) · `delete_files` (1 file).

The write flow is: `finalize_plan` (locks exact paths + a `localDir`, requires BOTH `writes` and
`deletes` keys even when one is empty) returns a `planId`, then `write_files` with
`localPath` per file reads from disk and uploads without the content entering context.

**The ONE thing that did not work: rebuilding the card index (`_ds_manifest.json`).**
Files upload correctly and `list_files` confirms them, but the gallery does not show them until
something app-side recompiles the manifest from the `<!-- @dsCard ... -->` marker on line 2 of
each preview HTML. Observed behaviour, twice, five weeks apart:

- A FIRST batch written to a FRESHLY CREATED project indexes automatically.
- LATER batches to an EXISTING project do not, and no amount of waiting or hard-refreshing fixes
  it. `preview/invest-next-phase.html` has been sitting unindexed since before today, which is
  independent evidence this is not about how I uploaded.
- `register_assets` / `unregister_assets` report success and change nothing. The tool description
  now calls them **legacy** outright and says the index comes from `@dsCard` markers.

**Leads I dismissed instead of chasing. Start here:**

1. **The `/design-sync` skill is referenced in the DesignSync tool description and is NOT
   installed on this machine.** Nothing in `~/.claude/skills/` matches. If it exists upstream it
   very likely carries the correct end-to-end recipe, including whatever triggers the reindex.
   Find it, install it, read it. **This is the single highest-value lead.**
2. **`/design-login`** is also referenced (a dedicated design authorization for sessions without
   a claude.ai login). Unexamined.
3. **`report_validate` and the `counts` parameter** on DesignSync mention a `.render-check.json`
   and an app-side "self-check" that COMPILES the manifest. That self-check is the thing we need
   to trigger. Its trigger condition is unknown and is the crux of the whole problem.
4. **`_ds_bundle.js` and `_adherence.oxlintrc.json`** exist at the project root and were never
   opened. They may describe the build/validate contract.
5. Whether writing a **deliberately modified `_ds_manifest.json`** directly via `write_files`
   works, or whether it is regenerated and overwritten. Never tested. Cheap to test.

**Test project:** "Goods on Country — Investor Materials" `b333c5aa-2dfa-4043-ab5f-ef7460692623`.
Old project `a24f62c8-2be7-4811-887d-f5f8a24f3cf9` still exists and is a fine sacrificial target
for destructive experiments. Do not experiment on `b333c5aa`, it is now the real one.

**Also worth researching, separately:** whether the round trip can be closed. Today it is
one-way-plus-manual: repo → Design (automatic), Design → repo (`get_file`, then a HAND PORT into
React). Nothing binds an HTML card to `pitch-chrome.tsx`. Pencil round-trips both ways via MCP,
which is why `design/goods-theory-of-change-v2.pen` was chosen as the canonical editable deck.
Whether Design can reach parity is an open question nobody has actually asked.

---

## The one manual step (blocking the gallery)

Open **claude.ai/design** → project "Goods on Country — Investor Materials" → in-app chat, paste:

> Reindex the design system cards. `preview/invest-funder-pipeline.html` was deleted and its
> manifest entry is dangling. Pick up the new `Deck chrome` group (4 cards),
> `preview/invest-loi-ladder.html`, and `preview/invest-next-phase.html`, and refresh the card
> names and subtitles from the `@dsCard` markers.

**Until this runs the gallery is WORSE than before**, because the manifest still points at the
deleted `invest-funder-pipeline.html` and will render "file not found" — the exact dangling-entry
failure that caused the migration off project `a24f62c8` in July. File contents are all correct
and live; only the index lags.

---

## What landed this session

### PR #206 — the deck's reading apparatus (OPEN, not merged)

`/pitch/road` is the canonical deck (ruling R) and its CONTENT was never the problem. It is a
**deck rendered as a document**: 18 panels, each already authored one-per-viewport
(`lg:h-[100svh]`), served as one scroll with no pagination, no map, no print path and no shorter
cut for a non-funder. That is why five pitch artifacts existed instead of one.

- **New module `v2/src/lib/data/pitch-chrome.ts`** holds the apparatus, not the content: panel
  order (mirrored from `deckSlides`, guarded), packs, appendices, the opener. **19 guards** in
  `pitch-chrome.guards.test.ts`.
- **New client `v2/src/app/pitch/road/pitch-chrome.tsx`** works on the rendered DOM by panel id
  rather than owning the markup, so the server-rendered deck keeps streaming and priority hints.
  Reads state from `window.location` and writes back with `replaceState` (using
  `useSearchParams` would force a Suspense boundary around the whole deck for a nav bar).
- **`page.tsx`**: 13 `data-pitch-panel` tags added (renders as 18 panels at runtime).
- **`globals.css`**: slide mode + a print block giving one panel per page.
- Modes: contents bar with scrollspy · `?view=slides` (arrows, space, Escape) · print · `?for=`.

**Two live defects fixed on the way:**
1. The hero's "Open the slide deck" button linked to `/pitch/deck`, which `next.config` 302s
   straight back to `/pitch/road`. **A redirect loop on the deck's own cover.** Now opens slide mode.
2. `pitch-surface-notice.tsx` hardcoded `/pitch/funder-pathways` as "THE canonical funder
   surface" while ruling R, `audience.ts` (`funder.frontDoor`) and seven `next.config` redirects
   all said `/pitch/road`. **Every appendix was signposting funders away from the front door** —
   the exact failure that component was written to prevent. Now derives from `audience.ts`, with
   a guard asserting it never goes back to a hardcoded string.

### Claude Design: 5 cards added, 6 corrected, 1 deleted

New **Deck chrome** group (4): `deck-opener`, `deck-contents-bar`, `deck-pack-switcher`,
`deck-slide-transport`. Plus `invest-loi-ladder`.

**Three separate rulings had never been swept into the Investment cards:**
- **Ruling V (2026-08-01).** Cards claimed the QBE grant was matched "at least 1:1" and drew a
  "$150K floor" tick on a progress track. Neither exists. Catalytic and discretionary, typically
  $150K–$400K, pool up to $1.1M across TEN enterprises. Raising $400K obliges QBE to nothing.
- **Ben, 2026-08-02.** Centrecorp still in the capital stack as a $75K grant. They are a BUYER.
  Inflated the grant column by $75,000. Stack is **$400K** (confirmed by Ben 2026-08-05), not $475K.
- **Ruling G/H (2026-07-25).** Three cards read "signed FY revenue (Goods-only,
  accountant-signed)". There is no accountant-signed document; it is a **workpaper**.
  *Caught only by reading a file back AFTER writing it. I had not scanned for it.*
- **Canon drift:** beds 496→**540**, communities 9→**11**, HDPE 2,660kg→**3,540kg**.

**Deleted (Ben, explicit):** `preview/invest-funder-pipeline.html`. It named fifteen funders with
an amount and a stage each, captioned "as at 3 Jul 2026". It could NOT be rebuilt from
`loi-pipeline.ts`, because that file holds only the ladder config, three GHL pipeline ids and a
23-stage map — **no names, no amounts**. Those come from GHL, read live by `/admin/loi-tracker`.
It was also the same content class as the `/pitch/deck` presenter-script leak fixed 2026-08-02.
Replaced by `invest-loi-ladder.html`, which mirrors STRUCTURE and points at the tracker for STATE.
Local copy retained at `design/brand/claude-design/preview/invest-funder-pipeline.html`.

---

## Decisions

- **Three packs on `/pitch/road`, not six.** `buyer.frontDoor` is `/shop` and
  `buyer.mustNeverSee` forbids the impact story ahead of the spec, which is this page's entire
  first half. `community.mustNeverSee` forbids arriving with a proposal instead of a yarn, and
  this page is a proposal from panel one. A guard refuses to add either.
- **The opener is the highest-risk prose in the system** and is guarded accordingly: no bed
  threshold, no payback promise, **no site count and no break-even claim**, and it must say
  plainly that nothing is signed.
- **`/pitch/document`, `/pitch/funder-pathways`, `/pitch/community-narrative` are APPENDICES**,
  linked from the deck's contents, not retired. `/pitch/document` carries prose the deck does not
  (competition table, why-now, the pains); deleting it loses content rather than duplication.
- **If a figure or a name is typed into HTML, it will be wrong within a month.** Every card
  corrected today was accurate when written. Use `CANON:num:<id>` and `CANON:<slot>` tokens.

## Gotchas found

- `design/brand/claude-design/` is **gitignored**. The 11 card files exist ONLY there and in the
  Design project. They are not in git and PR #206 does not contain them.
- `design/brand/kit/render.sh` is **not executable**; run it as `bash design/brand/kit/render.sh
  <file.html>`. Verified working: outputs `.pdf` + `-preview.png`, ~8 seconds.
- `check:retired-figures` scans ALL of `src/`, including ban-list literals. Writing `'co-designed'`
  inside an OPENER_BANNED array trips it. Do not restate global voice rules in local lists.
- `finalize_plan` requires both `writes` and `deletes` keys, even when one is `[]`.

## Open

- **UNRESOLVED, blocks the investor number: what a site costs to run for a year.** Four live
  answers ($15,000 / $48,333 / $64,333 / $79,333), moving break-even from 2.0 to 4.6 sites.
  `deliverables/GOC-site-cost-decision.md` is ready to settle it: three questions, options priced,
  blank decision lines. Half an hour with Nic. **Do NOT print a site count until then.**
- Email to Matt drafted 2026-08-04, still NOT sent. Sheet still not shared with Matt/Mal.
- `invest-funder-card.html` retains a "Match-eligible" chip. Judged acceptable: ruling V struck
  the 1:1 and the floor, not the coverage test, and `ASK_MATCH_VEHICLE.rule` still uses coverage
  language. Flagged in case a future reader disagrees.
