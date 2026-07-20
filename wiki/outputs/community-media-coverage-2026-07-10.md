# Community media: attribution logic + coverage — 10 July 2026

The problem named today: photos and video appearing on community surfaces without solid place attribution, some communities with nothing, no single logic. This is the fix and the current state.

## The logic now (one ladder, one gate)

Public community pages (`/communities`, `/communities/[slug]`) resolve ALL media through `community-media-resolver.ts`:

1. **content_items library** (Goods Supabase) — rows where `community_id` matches AND `consent_tier = 'public'` AND not archived. Ranked starred → rating. Portraits/logos excluded from galleries; overlays excluded from films.
2. **Manual map fallback** (`community-media.ts`) — hand-verified entries only, used when the library has no public rows for that community.
3. **Nothing** — if neither can defend a place claim, the page renders no media. No borrowed imagery.

`community_id` gets onto rows three ways (indexer `content-index.mjs`):
- area/url match (e.g. `public/images/utopia/**` → `utopia`) — already existed
- storyteller portrait link → their community — already existed
- **NEW:** a `community:<id>` tag from the media library / `data/local-image-tags.json`

So tagging an image `community:tennant-creek` in /admin/media-library is now all it takes to put it in the Tennant Creek pool — consent tier still gates it.

## Slug mismatch, handled

Page routes use `utopia-homelands`; the communities table uses `utopia`. The resolver maps this (`PAGE_SLUG_TO_LIBRARY_ID`). Any new mismatches: add to that map, nothing else.

## Coverage today (local assets; run the indexer to confirm DB state)

| Community | Attributable today | Source |
|---|---|---|
| Utopia Homelands | 16 imgs (`images/utopia/`) + 12 (`images/stories/utopia/`) auto-linked; 4 Centrecorp clips exist but consent **unverified** → stay off public | area/url rules |
| Tennant Creek | 1 img (`community/tennant-creek.jpg`) — tagged today | new tag |
| Palm Island | **zero** | — |
| Alice Springs | **zero** directly (build/ + process/ folders are likely Alice but unverified — do not tag until confirmed) | — |
| Maningrida, Mount Isa, Kalgoorlie, Darwin, Canberra | **zero** | — |

The "not photos of some" observation is correct: 7 of 9 communities have no defensible place-attributed public media. That's a shooting/tagging gap, not a code gap — the thematic-media-system doc (2026-07-03, section 4 item 11) already calls for "a representative clip per community."

## What to do (in order of unlock)

1. **Run `npm run content:index`** (needs Supabase env, so from your machine, not dev-stripped env) — pushes the new tag + link logic through, then `/admin/media-gaps` shows live state.
2. **Tag sweep in /admin/media-library** — anything you can personally place: add `community:<id>`. Minutes per batch; pages update on next deploy/revalidate.
3. **Consent sweep on the 22 RED EL videos** (doc section 4 item 1) — the single biggest unlock; several are per-community clips (utopia-delivery-road, karen-liddle-on-beds, mykel-building-the-bed).
4. **Jaquilane files** — render was pulled 2026-07-03 but `jaquilane-*.mp4` remain in `public/video/`, fetchable by URL. Until clearance is resolved, move them out of `public/` (e.g. Supabase storage, gated) or delete from the deploy.
5. **Alice/build provenance** — confirm `images/build/` + `images/process/` are Oonchiumpa/Alice shoots; if yes, one tag batch gives Alice Springs a real gallery.

## What changed in code today

`community-media-resolver.ts` (new), `content-index.mjs` linker (community: tag support), `local-image-tags.json` (first real tag), both community pages now resolve through the ladder. eslint + tsc clean. The old hardcoded map remains only as the verified fallback.
