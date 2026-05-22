# Handoff prompt — Goods "Field Notes" scrollytelling system (Utopia)

> Paste everything below the line into Claude Code, running in the `Goods Asset Register` repo, to continue this work. It is self-contained.

---

You are continuing work on a feature already built in this repo: a reusable "Field Notes" scrollytelling system for Goods on Country community trips, with the first story being the May 2026 Alice Springs → Utopia trip. The files are already written and pass `tsc` and `eslint`. They are uncommitted on `main`. Your job is to finish, verify, and (when consent allows) publish it. Read `CLAUDE.md` first and follow it exactly.

## What already exists (do not rebuild, extend)

System (reusable, trip = data):
- `v2/src/lib/data/trip-stories.ts` — typed `TripStory` + `TripBlock` model and the Utopia instance (`slug: utopia-may-2026`, `published: false`). Add future trips as new entries here.
- `v2/src/components/stories/trip-story.tsx` — `'use client'` renderer for all block kinds (masthead, read, immersive, bleedquote, stats, voices, videos, map, pathways, close). Scoped dark CSS in a `<style>` tag. Reuses `CommunityMap` (dynamic, `ssr:false`) + `communityLocations` from `content.ts`. Has an `internal` prop: true shows consent-pending voices/video; false (public) hides them.

Routes:
- `v2/src/app/admin/field-notes/page.tsx` and `.../[slug]/page.tsx` — admin-gated (existing admin auth + middleware), noindexed, renders with `internal`. This is the internal preview.
- `v2/src/app/field-notes/page.tsx` and `.../[slug]/page.tsx` — public route. `[slug]` calls `notFound()` unless `story.published === true`. Index lists only published stories.

Media + docs:
- `v2/public/images/stories/utopia/01-hero.jpg … 11-close.jpg` (11 stills). Map of file → original camera frame is in `wiki/outputs/utopia-media/MANIFEST.txt`.
- `v2/public/video/utopia/README.txt` — expected video filenames.
- Brand-comms knowledge base on `main` at `wiki/articles/brand-comms/`: `01-voice-and-tone.md` (the voice guide — obey it), `02-storyteller-voices.md` (storyteller library, includes Mykel), `CONSENT_PROCESS.md`, `CONSENT_BACKLOG.md`.
- Standalone HTML prototypes (reference for look/feel only): `wiki/outputs/utopia-feature.html`, `utopia-story.html`. Story spine: `wiki/outputs/utopia-story-spine-2026-05.md`.

## Guardrails (non-negotiable)
- Work in `v2/`. Do NOT touch `deploy/`.
- Do NOT use the Supabase MCP for v2 data (it points at the wrong project). Use `curl` with the service role key in `.env.local`, or `psql`.
- `v2/src/lib/data/products.ts` is the single source of truth for product specs. Don't hardcode specs.
- Brand voice (`wiki/articles/brand-comms/01-voice-and-tone.md`): no em dashes anywhere, sentence case, no "donate/charity/empower/unlock/beneficiaries", lead with impact not charity, name people, use verified numbers, quotes verbatim and never combined across speakers.
- Consent: every voice and face from the trip is consent pending and internal-only until verified in Empathy Ledger per `CONSENT_PROCESS.md`. Mykel is a young person — family/guardian consent plus Oonchiumpa facilitating (Fred Campbell) is required. Never publish pending content. The public route + the component's `internal=false` mode already enforce this; don't bypass it.
- Always finish with a clean `npm run build` in `v2/`.

## Verified facts (use these, don't invent)
- Stretch Bed: 26kg, 200kg capacity, 188×92×25cm, ~5 min assembly, no tools, 10+ yr life, 5-yr warranty, 20kg HDPE diverted per bed, 500+ minutes of community feedback in the design.
- 400+ beds in homes since 2023 (March 2026 compendium snapshot: 412 beds, 9 washing machines, 7 deployment rows). Project of A Curious Tractor.
- Utopia is on Anmatyerr and Alyawarr Country. Ampilatwatja: two senior men, both Order of Australia recipients this year, received four beds. The 107-bed Centrecorp/Utopia pathway is APPROVED, not delivered — never show it as delivered.
- Consent-pending trip voices: Mykel ("Comfortable as. Smooth, tight, hard, fancy. It's not trampoline." / "Yeah, I'll be rocking up every day to make them."), Johnny ("This one's better, I reckon."), the Arrernte welcome ("Come down and make your apmere"). Cleared/verified voices used to connect to the wider story: Ivy (Palm Island), Linda Turner (Tennant Creek), Chloe (Kalgoorlie).

## Tasks, in order
1. Run `cd v2 && npm run build` and fix anything it flags. (`tsc` and `eslint` already pass; this is the bundling gate.)
2. View it: `npm run dev`, open `/admin/field-notes/utopia-may-2026` (admin chrome shows without login in local dev). Sanity check the scroll, the stat strip, the map, and the video posters.
3. Add the trip videos to `v2/public/video/utopia/` using the names in `README.txt` (`alice-youth-desktop.mp4`, `alice-youth-mobile.mp4`, `ampilatwatja-elders.mp4`, `beds-being-made.mp4`, `delivery-drone.mp4`). They wire up automatically.
4. Optional: pin Utopia and Ampilatwatja on the map by adding entries to `communityLocations` in `v2/src/lib/data/content.ts` (match the existing `CommunityLocation` shape: id, name, region, lat, lng, storytellerCount, bedsDelivered, description, highlight). Use the verified counts above; keep the 107 Centrecorp pathway out of `bedsDelivered`.
5. Confirm the two Ampilatwatja Order of Australia men's identities and preferred credit before any external use.
6. Consent pass per `CONSENT_PROCESS.md`: create EL storyteller + story records for Mykel (with youth consent), Johnny, the Elders; capture the welcome's speaker/language/consent. Update `CONSENT_BACKLOG.md`.
7. When verified: in `trip-stories.ts` set the Utopia story `published: true` and change the relevant voice cards' `consent` to `cleared`; then link `/field-notes/utopia-may-2026` from nav. The public route and component handle the rest.
8. Commit on a branch (e.g. `field-notes-utopia`), not straight to `main`. Suggested message: "Add reusable Field Notes scrollytelling system + Utopia (internal)."

## Design notes / known limits
- On the admin route the immersive sections render inside the admin sidebar layout, so they are slightly inset (fine for internal review). The public route renders within the normal site layout. If you want a true edge-to-edge public experience, give the public `[slug]` route its own minimal layout without `SiteHeader`/`SiteFooter`.
- The map reuses the canonical `communityLocations`; it currently shows the existing deployment communities (Tennant Creek, Palm Island, etc.), not Utopia/Ampilatwatja, until you do task 4.
