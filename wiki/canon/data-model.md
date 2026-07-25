# The Goods data model — one aligned world

> The canonical keys, the one junction that connects everything, and the rules that keep it aligned. Run `cd v2 && npm run audit:model` to check the whole model talks to itself. Last audited 2026-07-20: 0 misalignments.

## Canonical keys — one key per thing, used everywhere

| Entity | Canonical key | Format | Example |
|---|---|---|---|
| **Community** | `communities.id` | kebab slug | `utopia`, `tennant-creek`, `mt-isa` |
| **Person** | `crm_contacts.id` | uuid | `754208bf-…` (Dianne Stokes) |
| **Product** | product slug | kebab slug | `stretch-bed`, `pakkimjalki-kari`, `basket-bed`, `the-plant` |
| **Asset** | `assets.unique_id` | GB0-… | `GB0-158` |
| **Story** | `stories.slug` | kebab slug | `welcome-to-goods`, `palm-island-delivery` |

Everything references a thing by its canonical key. Never by display name.

**Community naming:** `communities.name` is the display name (`Utopia Homelands`), `id` is the slug (`utopia`). Variants and old names live in `communities.name_aliases` (`Mt Isa` ↔ `Mount Isa`, `Alice Springs` ↔ `Alice Homelands`). The community page resolves a name-or-alias slug to the canonical id and redirects, so a link built from a name never 404s.

## The one junction — `media_links`

`media_links` is the single typed junction between a media item and the entities it shows. It replaces free-text `people:`/`community:` tags as the source of truth for "what is this photo about".

```
media_links(
  media_source  local | el_media | el_story | supabase | external
  media_key     path / id / url per source
  media_type    photo | video | diagram | document
  target_type   person | community | asset | product | story
  target_key    the canonical key of the target (see table above)
  relation      shows | made_by | taken_at | about
  consent_status cleared | held | unknown | not_required
)
```

**Rule: `target_key` must be a real canonical key of `target_type`.** A `product` link's key is a product slug; a `community` link's key is a `communities.id`; a `person` link's key is a `crm_contacts.id`. The audit fails if any link points at a key that does not exist.

**Where links are created:**
- The **Media Room** inspector (`/admin/media-library`) → product + community links, via `/api/admin/media-link`.
- The **backfill** (`scripts/backfill-media-links.mjs`) → person/community/story from the starred manifest, `local-image-tags.json`, and EL `media_storytellers`.
- **Never** hand-write a `media_links` row with a display name as the key.

## Foreign references (all audited, all resolve)

- `assets.community_id` → `communities.id`
- `content_items.community_id` → `communities.id`
- `content_items.storyteller_id` → `storytellers.id`
- `community_demand.community_id` → `communities.id`
- `storytellers.community_id` → `communities.id`
- `crm_deals` → `crm_contacts` (contact) and community via CRM
- `media_links.target_key` → the canonical key per `target_type`

## How the surfaces talk to each other

- **The Map / Atlas** reads `communities` + `community_rollup` + `assets` + `bed_signals`, drills to `/admin/communities/[id]`.
- **Community page** joins everything for one place: rollup, demand, `crm_deals`, `content_items` media, `storytellers`, `media_links`, and links out to the **product pages** (the support tiles) and the **pipeline** (the funding bridge).
- **Product pages** (`/admin/products/[slug]`) carry authored content; media tagged to the product in the Media Room lands here via `media_links(product)`.
- **Media Room** writes `media_links` that the Atlas, community, and product pages read.
- **Pipeline** reads `crm_deals` + GHL; the community funding bridge points into it.

## What the audit checks (`npm run audit:model`)

1. Every community/person/story foreign reference resolves (hard fail if not).
2. Every `media_links` row points at a real entity of its `target_type` (hard fail if not).
3. Coverage: communities with beds but no linked media (warning — fill via the Media Room).
4. Coverage: products with no linked media (warning).

## Known coverage gaps (2026-07-20, warnings not failures)

- 6 bed communities have no `media_links` yet: **darwin, kalgoorlie, katherine, kununurra, maningrida, mt-isa**. Maningrida (66 beds) is the biggest hole. Fill by tagging photos to them in the Media Room.
- **basket-bed** has no product media links yet.

## History

- 2026-07-20: `media_links` label-fix — 15 rows the starred-manifest backfill wrote as `story` (using deck-slot names as keys) were remapped to their true entity from the `media_key` prefix (6 product, 5 person, 1 community) or removed (3 purely-thematic). `scripts/fix-media-links-labels.mjs`. Audit went to 0 fails. Product link entity populated for the first time (0 → 6).
