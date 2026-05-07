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

## Recommendation: extend the pattern further

The same restructure makes sense for these remaining tables (in priority order):
1. **Banned terms database** under [01. Voice and Tone](https://www.notion.so/359ebcf981cf81d5bb44c3d3f8af9934). Schema: Term, Severity, Reason, Suggestion, Allowed-near phrases, Examples. Already exists in code as `brand-lint.ts` rules. Filterable: "show me all errors", "show me all rules with allowlists".
2. **Email templates database** under [04. Email and Comms Templates](https://www.notion.so/359ebcf981cf815ea10de9f84f0f31dc). Schema: Name, Audience, Subject pattern, Body skeleton, Anti-patterns, Last revised. Currently 7 templates in markdown.
3. **Slide deck slides database** under [07. Live Session Slide Deck](https://www.notion.so/359ebcf981cf81b3a4b1d37f74c6a222). Schema: Slide number, Title, Body, Image slot, Speaker notes, Per-audience asks. Currently a single markdown doc.
4. **Photo categories database** under [03. Product Image Library](https://www.notion.so/359ebcf981cf81f8846fe5bd663dec9f). Schema: Category, Sample, Count, Location, Gap status, Priority. Some of this already auto-derives via `buildImageCategories()` on /brand.

## Next session

Pick one of the above (Funders is highest leverage, Banned terms is the cleanest fit) and apply the same pattern. After 2-3 of these databases exist, we should write a small Notion-API consumer in `v2/src/lib/notion/` so that surfaces (`/brand`, press kit, lint UI, etc.) can read live from Notion if Notion drift becomes a real problem. Until then, repo is canonical.

## Last revised
2026-05-08, end of POC build.
