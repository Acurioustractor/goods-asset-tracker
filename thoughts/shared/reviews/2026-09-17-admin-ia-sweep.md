# The admin has a spine. Nothing is attached to it.

**17 September 2026.** Ben, looking at the sidebar: "the most uncomfortable thing is all the
routes all through the Goods admin, and how we can align this way better and have an overall
dashboard function, a shared date system, and a better way to align the different data in a
contact and tokenised way."

Swept every route, every date field, every identity key. The finding is not that the pieces are
missing. Four of them already exist, are well built, and carry their own guard tests. They are
just not reachable from the surfaces that need them, and nothing forces a new page to use them.

---

## 1. The routes

| | |
|---|---|
| `page.tsx` files under `/admin` | **97** |
| Non-dynamic routes | 85 |
| Linked from the sidebar | 52 |
| Sidebar links with no route | 1 (`/admin/products`) |
| **Routes you cannot reach from the sidebar** | **34** |
| Pure `redirect()` tombstones from past consolidations | 11 |

The 34 unreachable ones include `/admin/procurement` (built yesterday), `/admin/impact-cycles`,
`/admin/impact-system`, `/admin/miro-board` (734 lines), `/admin/deck-photo-review` (512 lines)
and all four `/admin/model/*` pages.

**A route directory already exists.** `src/lib/data/admin-routes.ts`, written 19 July, 70 entries,
15 declared hubs, dispositioned `hub | active | absorbed | utility | stale | one-off`. Every href
in it still resolves. It is accurate about everything it covers.

**Fifteen routes built since 19 July were never added to it.** So the information architecture did
not fail. It has no gate. `route-audience.ts` has a drift guard, and that guard caught my missing
`/admin/procurement` entry yesterday. `admin-routes.ts` has nothing equivalent, so it silently
falls behind every time a route is built.

## 2. The date system

There is no date system. There are nine.

| Field name for "when" | Uses in `lib/data` |
|---|---|
| `date` | 150 |
| `when` | 148 |
| `asOf` | 86 |
| `since` | 82 |
| `readAt` / `lastUpdated` / `generatedAt` / `updatedAt` / `confirmedAt` | 16 between them |

Stored values come in at least eight shapes: `2026-09-17`, `2026-09`, `2026`, `2026-2027`,
`May 2026`, `Sept 2026`, `2026-09 to 11`, and free prose ("after a sustained production run").

Rendering is worse. Across 52 files there are eight distinct `toLocaleDateString('en-AU', {...})
option shapes plus 17 bare calls with no options. No shared formatter exists anywhere in the repo.

**Five of ninety-seven admin pages show any freshness stamp at all**, and four of those five are
hardcoded strings ("verified 10 Jun 2026") that cannot move when the data does.

**The contract already exists, one level away.** `canon.ts` defines exactly the right shape for
every canon fact: `source`, `asAt` ("ISO date this value was last confirmed against its source"),
`check: 'auto' | 'manual'`, `owner`, `claimLabel`, `dataClass`. It governs canon numbers. It does
not reach a single admin route.

## 3. Identity, and what "tokenised" would mean

### The canonical place registry exists and is too small

Supabase `communities`, 31 rows, slug ids (`galiwinku`, `tennant-creek`), with `name_aliases` and
`traditional_name` columns. Only 5 of 31 carry any alias. 7 carry `el_community_id`.

Resolving every place string in the three procurement pulls against it:

| Source | Distinct place strings | Resolve | Do not |
|---|---|---|---|
| `community-intel.json` | 22 | 20 | 2 |
| `organisations.json` | 62 | 19 | **43** |
| `procurement-buyers.json` | 58 | 11 | **47** |

Two separate causes, and they need different fixes.

1. **The registry is too small.** Angurugu, Gapuwiyak, Hermannsburg, Barunga, Ampilatwatja,
   Beswick and about forty more are real communities in the contract record and absent from the
   31 rows.
2. **`place` is overloaded.** One string field holds communities, regions ("Barkly Region",
   "Big Rivers"), agencies ("Darwin Port Corporation") and junk ("All Centres", "27 remote
   locations"). A community and a region are different kinds of thing and cannot share a column.

### The asset register is the one thing that got it right

608 rows in `assets`, every single one carrying both `community` and `community_id`, and they
agree on all 608. That is the standard. It is also the only table that meets it.

### `crm_contacts` is scaffolding with the load-bearing columns empty

135 rows. The cross-system token columns were built and never filled:

| Column | Filled |
|---|---|
| `grantscope_id` | **0 / 135** |
| `compendium_partner_id` | **0 / 135** |
| `supabase_partner_id` | **0 / 135** |
| `empathy_ledger_id` | 11 / 135 |
| `email` | 55 / 135 |
| `last_contact_date` | 37 / 135 |

There is **no GHL contact id column at all**, and GHL is the actual CRM. `organization` is 61
distinct free strings pointing at no record.

Two contact systems run side by side: **17 admin files read GHL, 3 read `crm_contacts`.**

### Alias resolution is a solved problem here, twice, and neither solution is general

- `storyteller-registry.ts` carries `aliases` with guard tests that stop a variant spelling
  dodging a consent tier. It is the strongest identity code in the repo.
- `community-match.ts` maps free-text Empathy Ledger locations onto canonical communities,
  deterministic and read-time. Two files import it.

Both are scoped to one data source. Neither is something a new pull is required to go through.

## 4. The join exists and nothing renders it

`src/lib/data/community-record.ts` opens with: *"ONE RECORD PER COMMUNITY, the join across the
five modules that each hold a piece."* It carries every field as `Held<T>` with its own
`ConsentState`, so consent is a property of the field instead of a property of the URL it happens
to be rendered on.

It is imported by two public pages and **zero admin routes**. It sits among twenty `community-*`
modules in `lib/data`.

---

## What to do, in the order that unlocks the most

### 1. One entity registry, generalising what already works  ·  DONE 17 Sep

Built as `src/lib/data/place-registry.ts`: 108 places, 9 declared non-places, one resolver. The
`kind` field is what does the work, because a community, a region, a jurisdiction, a building and
a sentinel were all living in one string column. `resolveCommunity()` refuses a region.

`community-match.ts` now takes its spellings from the registry instead of its own map, which took
three alias lists down to one. `procurement-board.ts` had a fourth normaliser, which made
"Galiwinku" and "Galiwin'ku" two places.

Guarded by `place-registry.guards.test.ts` (30 tests, fails on any place string in the data that
neither resolves nor is declared) and `scripts/check-place-registry.mjs` in `check:drift`, which
checks the registry against the live table and the 608-row asset register.

Ben ruled 17 September that **media follows the registry**, so Ampilatwatja, Angurugu and Umbakumba
resolve to themselves instead of folding into a parent. One Empathy Ledger media asset moved, and
it is unreachable until Ampilatwatja is a row in the `communities` table.

Still to do: widen the live Supabase table to match, which is a write and needs a decision.

### 2. Give `crm_contacts` a consent link and an organisation token

**Corrected 17 September, after counting it.** This section originally read "make it the contact
token, or retire it", on the assumption it was a stale copy of GHL. It is not, and retiring it
would have destroyed the relationship record for 68 people and organisations.

Of its 135 rows, **68 have no GHL counterpart**, and those 68 are Elders, community people and
organisations: Dianne Stokes, Norman Frank, Frankie Holmes OAM, Donald Thompson OAM, Carmelita and
Colette, Karen Liddle, plus Tim Fairfax Family Foundation, Envirobank, Wilya Janta and PICC. GHL
holds 3,715 contacts and none of these. The table holds what GHL does not.

What it is missing is the link to consent. **All 34 storytellers are in it, every one tier
gated**, and the row carries no `storyteller_id`. So a gated voice sits beside funders and buyers
with nothing on the row saying the voice is gated. `empathy_ledger_id` is filled on 11 of 135;
`grantscope_id`, `compendium_partner_id` and `supabase_partner_id` are 0 of 135.

The live check (`npm run check:people`, wired into `check:drift`) found **two gated storytellers
carrying GHL tags that put them in something that sends**. Both are written into a KNOWN list with
their reason, because neither is a clear breach and the real defect is that one human is in two
roles with no record holding both facts:

- **Katrina Bloomfield** carries ACT Harvest tags, a different project.
- **Jimmy Frank** carries `comms:goods-newsletter` at `jf@wilyajanta.org`. He is Wilya Janta staff
  and a gated storyteller at the same time.

A third case fails the build.

Still to do, and it needs a schema change: `storyteller_id` and `ghl_contact_id` columns on
`crm_contacts`, and `organization` pointed at an organisation token instead of one of 61 free
strings. Five of those 61 match an organisation already held in `organisations.json`.

### 3. One date contract, borrowed from `canon.ts`  ·  BUILT 17 Sep, one surface wired

`src/lib/data/as-at.ts` carries the contract: `{ asAt, source, check, owner?, staleAfterDays? }`,
the same shape `canon.ts` has held per fact since July. `<AsAt/>` in `components/ui/` renders it.

**A date is a date and a label is a label.** `asAt` accepts `YYYY-MM-DD`, `YYYY-MM` or `YYYY`, and
refuses everything else, including the seven prose shapes that were living in date fields. The
pattern to copy is `procurement-openings.ts`, which already stores `when: '2026-09'` beside
`whenLabel: 'September to November 2026'`. A field that is sometimes sortable and sometimes prose
is neither.

`formatAsAt` is the only date formatter: "17 Sep 2026", "Sep 2026", "2026". It behaves the same on
the server and in the browser, which `toLocaleDateString` does not.

**Two ratchets, in `as-at.guards.test.ts`.** Files formatting a date by hand may fall from 52 and
never rise. Admin surfaces carrying a real stamp may rise from 1 and never fall. Each one names the
number to change when you move it.

`/admin/procurement` is the wired surface, and it is the proof: four pulls, four real dates from
the pulls themselves, four sources, and the NT workbook turns terracotta and says "due a re-read"
once it passes 90 days. The page can no longer claim to be fresher than its data.

Still to do: the other 96 admin pages, one at a time, raising the floor as each lands.

### 4. Give `admin-routes.ts` a gate

Copy the `route-audience.ts` drift guard. The moment it exists, the 15 undeclared routes surface,
and the 11 tombstones and 12 `stale` entries can be archived deliberately instead of accumulating.

### Then the dashboard function

With a stable token and a stamped date, a hub is a small thing: filter by entity, show what every
module holds about it, stamp when each part was read. Design the hub shell once in
`design/Goods Dashboard.pen` and let every hub inherit it, the way `/admin/procurement` was built.

---

## The one-line version

Four spines exist and are well built: `canon.ts` for provenance, `communities` for place identity,
`community-record.ts` for the join, `admin-routes.ts` for the map. Every one of them is optional.
Nothing fails when a new surface ignores them, so every new surface has. The work is not designing
a spine. It is making the four that exist compulsory, and widening the registry so the keys resolve.
