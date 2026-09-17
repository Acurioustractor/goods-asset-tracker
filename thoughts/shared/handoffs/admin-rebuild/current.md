---
date: 2026-09-17T11:35:00+10:00
session_name: admin-rebuild
branch: fix/snow-ask-and-figure
status: active
---

# Work Stream: admin-rebuild

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-17T11:35:00+10:00
**Goal:** Ben, 17 September: "the most uncomfortable thing is all the routes through the Goods admin", then "I do not want 74 things, I want a simple and powerful system with a list of important actions", then "review it all systemically, delete fluff, and build the right system from the ground up."
**Branch:** `fix/snow-ask-and-figure` in `../goods-ledger-wt`, **66 commits ahead of main, NOT pushed.**
**Test:** `cd v2 && npx vitest run && npm run check:drift && npm run build && npm run smoke:admin`

### Now
[->] **The admin is rebuilt and every surface is tested. Nothing is pushed.** The one open decision
is whether to push 66 commits, which is Ben's call and needs `/ship`.

Dev server on **3013**. `npm run smoke:admin` opens all 75 surfaces against it.

### What moved

| | Before | After |
|---|---|---|
| Routes under /admin | 85 | **46** |
| Sidebar | 52 links + a 38-item drawer | **14 verbs**, one screen |
| ⌘K | 74 page titles | **~850 records** from `/api/admin/search` |
| Dead internal links | 5, unguarded | 0, guarded |
| Surfaces that render | unknown | **75 of 75** |
| Checks in `check:drift` | 9 | **13** |

### The four spines, which existed and were optional and are now compulsory

The morning sweep (`thoughts/shared/reviews/2026-09-17-admin-ia-sweep.md`) found four good
modules that nothing was required to use. Each now has a guard in `check:drift`.

1. **Place identity.** `place-registry.ts`,, 108 places, 9 declared non-places, one resolver.
   `kind` separates a community from a region, a jurisdiction, a building and a sentinel, because
   all five were living in one string column. Three alias lists became one.
   Guards: `place-registry.guards.test.ts` (30), `scripts/check-place-registry.mjs`.
2. **Provenance and dates.** `as-at.ts`,, the `canon.ts` contract widened to a whole surface.
   `asAt` takes a day, a month or a year and refuses the seven prose shapes that were living in
   date fields. Two ratchets: hand-formatters may fall from 52, stamped admin surfaces may rise
   from 2.
3. **The route map.** `admin-routes.ts` with `scripts/check-admin-routes.mjs`, four checks
   including every static `/admin` link anywhere in `src`.
4. **The join.** `community-record.ts` renders on every community drill page, with the consent
   state on each field.

### Cross-system: Goods and Empathy Ledger

- `el_uuid` on Goods storytellers was **0 of 32**, now **30 of 32**. Dorrie Jones and Ray Nelson
  have no Empathy Ledger record at all.
- `crm_contacts` gained `storyteller_id` and `ghl_contact_id` (migration
  `supabase/migrations/20260917_crm_contacts_identity_pointers.sql`, Ben ran it). Backfilled 94
  rows. **No consent tier is copied anywhere**: storytellers stays the only place a tier is decided.
- **The consent authority is the `consents` table, not `extracted_quotes`.** 673 rows, 665 active,
  206 recorded in person and self-spoken on 14 September 2026. An earlier version of the
  cross-check read the wrong column and reported a divergence that did not exist.
- Goods canon now feeds the Empathy Ledger impact model. Five verified figures created as
  outcomes; `check:outcome-sync` fails the build when they drift. Two rules: only GREEN canon
  facts cross, and the same word is not the same measure (beds deployed is not beds in inventory).

### Open, and each one is a decision

- [ ] **66 commits unpushed.** A full day. Tier 2, needs Ben's verb and `/ship`.
- [ ] **The QBE document says "thirty-seven people have cleared their words"** and canon says 38.
  Spelled out, which is why a search for "37" finds nothing but "37,000 hours of employment".
  The 38th is Aunty Vicki Wade, a practitioner voice, so 37 may still be right for that sentence.
  Same passage says "191 verbatim quotes" against the code's 192 from the same July pass.
  Ben said he would handle it.
- [ ] 9 routes still marked `absorbed`. Most are create forms and per-item documents that should
  stay, so the real floor is about 42, not 20.
- [ ] `/admin/procurement` still holds the open question for the Industry Capability Network:
  whether Queensland and Western Australia's board test is satisfied by Goods on Country Ltd.

### The thing worth carrying forward

**grep is not the authority on whether code is used. The compiler is.** Three times in one day my
dead-code detection said a file was unimported and it was live: a relative path the pattern missed
(`./data/team`, feeding /admin/people), a whole directory deleted for two files inside it
(`components/model`, breaking the public pitch), and a dynamic import (`community-map`, the
communities map). tsc caught all three before anything shipped, which is the only reason none of
them landed.

The same shape appeared in the data: the guards written that morning caught `Galiwinku` against
`Galiwin'ku` as two places, `Santa` and `Teresa` as two invented communities, Warlpiri resolving
Lajamanu to Yuendumu, two people holding two consent records each, and me citing an amber canon
fact as the basis for a figure crossing into another system.
