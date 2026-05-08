# Reusable Pack: Proof of Concept

> The Brand & Comms HQ in Notion was originally 8 narrative pages mirroring the wiki articles. This POC restructures one of them (Storyteller Voices) as a token-style database, so we can see whether the pattern is worth extending to the rest.

## What was built

A **Storyteller Voices** database in Notion under [02. Storyteller Voices](https://www.notion.so/359ebcf981cf81809952f1fa1e3df187). 16 rows, 13 typed properties, populated from `v2/src/lib/data/content.ts`.

**Database URL:** [notion.so/1fe6ebeb9ed845d2bc0e7d2349321fe3](https://www.notion.so/1fe6ebeb9ed845d2bc0e7d2349321fe3)
**Data source ID** (for API consumers): `a403a6f2-7376-479b-b9d3-46f459c8837b`

### Schema (13 properties)

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Storyteller's preferred public name |
| Role | Text | "Elder, Co-designer", "Health Practitioner", etc. |
| Community | Select | Tennant Creek, Palm Island, Alice Springs, Kalgoorlie, Mt Isa, East Arnhem, Maningrida, Other |
| State | Select | NT, QLD, WA, SA |
| Themes | Multi-select | co-design, dignity, safety, freight-tax, community-need, product-feedback, health, washing-machine, naming, Elder voice, intergenerational, culture, family |
| Headline Quote | Text | Verified verbatim pull quote, exact words |
| Quote Context | Text | "On co-design", "On freight tax", etc. |
| Photo Path | Text | `/images/people/...jpg` (blank if no portrait yet) |
| EL Story ID | Text | Empathy Ledger UUID if syndicated |
| Consent | Select | Verified / Withdrawn / Pending review |
| Featured | Checkbox | True if shown in the /brand 8-storyteller hero gallery |
| Use For | Multi-select | Co-design narrative / Dignity narrative / Freight cost narrative / Health pathway / RHD prevention / Washing machine narrative / Naming heritage / Elder authority / Intergenerational framing / Product feedback / Cultural strength / Spine of Goods origin |
| Notes | Text | Longer story, alternate quotes, photo gaps, video links |

### Rows populated (16)

**Featured (8):** Dianne Stokes, Norman Frank Jupurrurla, Linda Turner, Patricia Frank, Cliff Plummer, Brian Russell, Zelda Hogan, Ivy, Alfred Johnson, Chloe, Jessica Allardyce. (More than 8 marked Featured because Featured = "shown in /brand gallery"; the 8-photo limit on /brand picks the first eight by sort order.)

**Not featured (5):** Carmelita, Jimmy Frank, Annie Morrison, Melissa Jackson, Tracy McCartney. Quotes used in specific contexts (cultural-strength framing, freight cost, product feedback, support-worker voice).

**Photo gaps surfaced by the database** (rows where Photo Path is blank):
- Zelda Hogan, Carmelita, Jimmy Frank, Annie Morrison, Melissa Jackson, Chloe, Tracy McCartney, Jessica Allardyce

This list now lives in a queryable form rather than being buried in narrative prose. Filter "Photo Path is empty" in Notion and you get the photography commission target list.

## What this unlocks

### Filter / sort
- Show me all storytellers with theme `co-design` → Dianne, Linda, Norman, Jimmy
- Show me all storytellers in NT, with theme `health` → Cliff, Brian, Zelda, Jessica
- Show me all `Use For: RHD prevention` → Cliff, Jessica
- Show me all rows where Photo Path is empty → 8-row commission target list

### Export / consume
The database is API-readable via the Notion data source ID. The Goods app (or any other consumer) could:
- Pull storytellers via Notion API + filter (e.g. `Featured = true AND Consent = Verified`)
- Replace the static `VOICE_DIRECTORY` in `featured-voices.ts` with a Notion query
- Auto-update /brand, press kit, slide deck whenever a Notion row changes

### Fork
Another organisation duplicating the Brand & Comms HQ would clone the database structure and refill the rows with their own storytellers. The narrative pages stay the same.

## Tradeoffs observed

**Pros:**
- One row = one storyteller. Edit in place, no prose surgery required.
- Theme/Use-For filtering immediately useful for finding the right voice for the right brief.
- Photo gaps are visible at a glance.
- Multiple consumers (Notion users, /brand page, press kit, agents) can read the same source.
- New row = adding a storyteller is trivial.

**Cons:**
- Notion is now a second source of truth alongside `content.ts`. Either make Notion canonical (and have code pull from it) or keep `content.ts` canonical and accept Notion is a manual mirror.
- Consent state changes need to be reflected in BOTH places until we automate the sync.
- Multi-select options proliferate (themes, use-cases). Need a small editorial discipline to avoid two slightly-different terms ("RHD prevention" vs "rhd-prevention").

## Funders database (built 2026-05-08)

Same pattern applied to the Funders table. Lives under [05. Pipelines × Brand](https://www.notion.so/359ebcf981cf8176bdbddd3be80bc307).

**Database URL:** [notion.so/a06fb37b6de845adb276e24a22e47b0d](https://www.notion.so/a06fb37b6de845adb276e24a22e47b0d)
**Data source ID:** `8aa553ee-03bd-4718-a318-7e30787d4506`

22 rows populated from `v2/src/lib/data/funder-url-map.ts`. 13 typed properties:

| Property | Type | Purpose |
|----------|------|---------|
| Funder | Title | Display name |
| Slug | Text | Stable key matching funder-url-map.ts |
| Type | Select (14 options) | foundation-* / investor-* / procurement-* / community-partner |
| Primary URL | Text | Canonical landing page on goodsoncountry.com |
| Secondary URL | Text | Optional follow-up URL |
| Recommended Voice | Select | Storyteller key whose quote resonates with this funder type |
| Stage | Select | Researching / Cold intro / Warm intro / First meeting / Proposal/DD / Active / Alumni / Declined |
| Direct only | Checkbox | True for community partners where URL on first contact is wrong |
| Contact | Text | Person name + role (when known) |
| Last activity | Date | When we last touched this relationship |
| Rationale | Text | Why this funder gets this URL + voice |
| Notes | Text | Pipeline detail, ask amount, contact context |

Views:
- **Pipeline (by stage)** — board grouped by Stage. Quick visual of where every relationship sits.
- **By type** — board grouped by Type. Foundations vs investors vs procurement vs partners.
- **Active outreach** — table filtered to Stage NOT IN (Researching, Declined, Alumni). The "in flight right now" list.
- **Capital stack candidates** — table filtered to investor-catalytic / impact / blended types.

## Banned Terms database (built 2026-05-08)

Same token-database pattern applied to brand voice rules. Lives under [01. Voice and Tone](https://www.notion.so/359ebcf981cf81d5bb44c3d3f8af9934).

**Database URL:** [notion.so/91bb91f851c041f39961c9c5ac56dc61](https://www.notion.so/91bb91f851c041f39961c9c5ac56dc61)
**Data source ID:** `88901bf0-322b-4c21-8c43-8e736d2d32cb`

20 rows, one per linter rule, populated from `v2/src/lib/brand-lint.ts`. 11 typed properties (Term, Rule ID, Category, Severity, Pattern, Why banned, Suggestion, Allowed near, Active, Notes).

Three views:

- **By category** — board grouped by Punctuation / Banned word / Capitalisation / Generic identifier
- **Errors only** — table filtered to Severity = Error (14 rules, the must-fix-before-publishing list)
- **With allowlist** — table filtered to rules with legitimate compound exceptions (banned-donate, banned-empower, banned-unlock, banned-innovative, capitalisation-on-country, outback-bush, indigenous-people-block, remote-australia)

The "Allowed near" column is the most useful new surface: it documents WHY a banned word is sometimes allowed (DGR donations, charitable structure, REAL Innovation Fund, investor-mandate "remote Australia", etc.) so future authors can see the rule and its escape hatches in one place.

## Email Templates database (built 2026-05-08)

Same pattern applied to outreach templates. Lives under [04. Email and Comms Templates](https://www.notion.so/359ebcf981cf815ea10de9f84f0f31dc).

**Database URL:** [notion.so/da884c5de3d94f4fbac364ddbc978605](https://www.notion.so/da884c5de3d94f4fbac364ddbc978605)
**Data source ID:** `9d39b82f-20d9-4040-bec6-7a3c98d93388`

7 templates populated from `wiki/articles/brand-comms/04-email-templates.md`. 10 typed properties (Name, Audience, Stage, Subject pattern, Body skeleton, Tone, Anti-patterns, Response time, Active, Notes).

Two views:

- **By audience** — board grouped by Funder / Procurement / Community / Media / Internal
- **Quick reference** — table with name, subject pattern, response time, tone summary. The "I need to send something now" lookup table.

Templates seeded:
1. Funder intro (cold or warm)
2. Funder follow-up (post meeting)
3. Funder report (quarterly or campaign-end)
4. Procurement / B2B
5. Community partner ("Yarn about beds")
6. Media (press release with named storyteller quotes)
7. Internal handoff

Each Body skeleton is the full template including subject line, salutation, body structure, sign-off. Drag a template into Gmail / Apple Mail / Outlook compose. The Anti-patterns column documents what to avoid for each one.

## Slide deck database (built 2026-05-08)

Same pattern applied to the live session deck. Lives under [07. Live Session Slide Deck](https://www.notion.so/359ebcf981cf81b3a4b1d37f74c6a222).

**Database URL:** [notion.so/b59c3fa3e0c24cdf925d058ed07f0fa1](https://www.notion.so/b59c3fa3e0c24cdf925d058ed07f0fa1)
**Data source ID:** `60318477-f3df-4417-abc3-9c3ed034f75d`

10 rows (one per slide), 10 typed properties (Slide, Number, Section, Title, Body, Voice, Image slot, Speaker notes, Per-audience asks, Active). Mirrors `wiki/articles/brand-comms/07-slide-deck.md` and `v2/public/decks/live-session-deck.html`.

Two views:

- **Deck order** — table sorted by Number. The presenter's runsheet.
- **Slides with audience switches** — table filtered to slides that have per-audience customisation (slides 2, 4, 8, 10). The "what to swap per audience" cheat sheet.

Most useful column: **Per-audience asks**. For slide 10 (the ask) it captures the four versions (funder, procurement, community, catalytic capital) so a presenter can swap on the fly. For slide 8 (voices) it documents which 3 storytellers to feature for which audience type.

## Photo categories database (built 2026-05-08)

Same pattern applied to the photo library inventory + gap list. Lives under [03. Product Image Library](https://www.notion.so/359ebcf981cf81f8846fe5bd663dec9f).

**Database URL:** [notion.so/b2316c742d5b422592922e6205a2ddc7](https://www.notion.so/b2316c742d5b422592922e6205a2ddc7)
**Data source ID:** `e845e50a-f9ec-49aa-a016-8858fca757ec`

14 rows: 6 categories we have, 8 gap categories from the photography brief. 11 typed properties (Name, Folder, Type [Have/Gap/Mixed], Sample, Live count, Target count, Priority, Use cases, Gap details, Brief link, Active).

Two views:

- **Gaps to commission** — table filtered to Type = Gap or Mixed, sorted by Priority. The list a photographer would action.
- **By priority** — board grouped by Critical / High / Medium / Low / None.

The photography brief now has a structured queryable backing. When a shoot lands, update the row's Type from "Gap" to "Have" and bump the Live count.

Critical gaps (commission first): **Production plant in operation** (9 shots) and **Maningrida community** (5 shots). Both unblock 2026 funder decks.

## Six databases done. Pattern complete.

All six tables in the brand & comms system are now token-databases:

| # | Database | Rows | Lives under |
|---|----------|-----:|-------------|
| 1 | Storyteller Voices | 16 | 02. Storyteller Voices |
| 2 | Funders | 22 | 05. Pipelines × Brand |
| 3 | Banned Terms | 20 | 01. Voice and Tone |
| 4 | Email Templates | 7 | 04. Email and Comms Templates |
| 5 | Slide deck | 10 | 07. Live Session Slide Deck |
| 6 | Photo categories | 14 | 03. Product Image Library |

**89 rows total. 70-ish typed properties across all schemas.**

## Next phase: Notion-API consumer

With all six databases in place, the next move is wiring code surfaces to read from them. A small `v2/src/lib/notion/` module that:

1. Auths via a Notion integration token (env var)
2. Caches reads at the same ISR level as the rest of /brand (5-min)
3. Exposes typed helpers: `getStorytellers()`, `getFunders()`, `getBannedTerms()`, `getEmailTemplates()`, `getSlides()`, `getPhotoCategories()`
4. Falls back gracefully to local data (`v2/src/lib/data/*.ts`) if Notion is unreachable

**Source-of-truth direction (decision needed):**

- **Option A: Notion-canonical.** Repo files become read-only generated artefacts. Notion becomes the editing surface. Pros: brand team edits without touching code. Cons: build pipeline depends on Notion API uptime.
- **Option B: Repo-canonical, Notion is mirror.** Repo stays the source. A sync script periodically pushes from repo into Notion (or pulls from Notion as a sanity check). Pros: build determinism, version control. Cons: brand team edits in code.
- **Option C: Bi-directional with conflict resolution.** Last-write-wins or row-by-row reconciliation. Pros: flexible. Cons: complex, easy to lose data.

Recommendation: **Option B (repo-canonical, Notion mirror)** for now. Lowest engineering cost, clear ownership. Revisit only if the brand team starts editing in Notion directly and we see drift.

## Last revised
2026-05-08, end of POC build (six databases shipped).

## Last revised
2026-05-08, end of POC build.
