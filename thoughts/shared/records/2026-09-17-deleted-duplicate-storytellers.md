# Two duplicate storyteller rows deleted

**17 September 2026. Ben: "delete them."**

Found by the `crm_contacts` identity backfill: the `storytellers` table held 34 rows and 32
distinct people. Carmelita & Colette and Dr Boe Remenyi each had two records.

Both strays were created 3 July 2026 and superseded on 16 July. Each carried no community, no
portrait, no `el_uuid`, no aliases, and nothing in the code pointed at either slug. No
`crm_contacts` row referenced them. Both copies of each person were `gated`, so nothing was ever
exposed.

**Why they had to go.** Every storyteller lookup in this repo resolves by
NAME. Two rows means a lookup takes whichever the map hit last. Clear one copy and a name lookup
can return the cleared row for a person whose other record still says gated. That is the same
shape as the consent leak found on 16 September through Georgina's funder record.

## What was deleted, in full

```json
[
  {
    "id": "0a3e970a-7540-46f9-85c7-59ac572f842d",
    "el_uuid": null,
    "display_name": "Carmelita & Colette",
    "aliases": [],
    "slug": "carmelita-and-colette",
    "role": null,
    "community_id": null,
    "is_elder": false,
    "portrait_content_id": null,
    "consent_tier": "gated",
    "created_at": "2026-07-03T04:08:32.730963+00:00",
    "updated_at": "2026-07-03T04:08:32.730963+00:00"
  },
  {
    "id": "88cf3728-9f2a-4388-89de-019301f794bb",
    "el_uuid": null,
    "display_name": "Dr Boe Remenyi",
    "aliases": [],
    "slug": "dr-boe-remenyi",
    "role": null,
    "community_id": null,
    "is_elder": false,
    "portrait_content_id": null,
    "consent_tier": "gated",
    "created_at": "2026-07-03T04:08:32.730963+00:00",
    "updated_at": "2026-07-03T04:08:32.730963+00:00"
  }
]
```

## What was kept

| Person | Kept slug | Why |
|---|---|---|
| Carmelita & Colette | `carmelita-colette` | Carries `community_id: palm-island` and a portrait, and is the slug `storyteller-registry.ts` and the pitch photo review point at. |
| Dr Boe Remenyi | `boe-remenyi` | The slug `snow-arc.tsx` and `storyteller-registry.ts` point at, with a portrait in `people-portraits.ts`. |

## After

`storytellers`: 32 rows, 32 distinct people, every one `gated`. All 32 are linked from
`crm_contacts` by `storyteller_id`. `scripts/check-people-identity.mjs` passes and now fails the
build if a person ever holds two consent records again.
