# Story-admin UX + git-media + community backfill — 2026-07-08

**Branch:** `docs/snow-onepager-assets` @ `7438af3` — **fully pushed**, working tree clean bar 61 untracked local media (gitignored by policy). Safe to `/clear`.

## What shipped this session (commits, oldest→newest)
- `d321c70` — media-library grid stabilised + gated EL photos surfaced + community coverage realigned to EL
- `ce78ea4` — EL photo↔people alignment engine + website→EL migration
- `ecc9a85` — slim WIP snapshot (wiki/thoughts/canon JSON/scripts — **text only**, binaries excluded)
- `1af2294` — EL-gallery community derivation + Oonchiumpa alias (backfill)
- `98e7fcd` — media-library sources made self-explanatory + archive-trap banner
- `7438af3` — People moved Story→Money + new `/admin/site-content`

## Git / media policy (important — see [[goods-media-out-of-git]])
Git LFS for `output/` was tried then **fully reverted** (`git lfs uninstall`, `.gitattributes` removed). Large media does NOT go in git. Gitignored / local-only:
`output/` (1.3GB video renders + source), `generated-images/`, `design/_image-originals/`, `design/deck-assets/`, `design/brand/claude-design/`.
Push code + text only. Anything that must ship/share → Supabase Storage bucket + URL.

## Community backfill (DONE to auto-ceiling)
`v2/scripts/backfill-community-links.mjs` (now EL-gallery aware) + `v2/src/lib/data/community-match.ts` (added `oonchiumpa`→Alice Springs).
Result: 144/169 `content_items` tagged. Remaining 169 = genuinely non-community (studio/product/brand/process) OR need human people-tagging in the media-library UI (4 gallery-less EL). **Do not retry auto-tagging the rest.**

## Media-library clarity
`v2/src/app/admin/media-library/page.tsx` + `library-client.tsx`: plain header, source tooltips + permanent explainer line, archive-mode banner.
**Website** = the site's own image/video files (free to use). **Empathy Ledger** = consent-governed community media (tag people/community on these).

## Admin Story restructure
`v2/src/app/admin/admin-sidebar.tsx`: **People** moved Story→Money (it's a CRM, not story content). New `v2/src/app/admin/site-content/page.tsx` = review-all-live-posts (field notes w/ draft status, EL stories, partner pages, core pages; each `View↗` opens the live page).

## PARKED — resume here
Ben was asked (AskUserQuestion) his **primary job** in the media library (tag-people / find-photos / cleanup / just-clarity) to drive a filter-bar simplification — **he didn't answer**. When he does:
1. Simplify the media-library filter-bar wall around that primary job (Subject/Theme/Type/Community/Person/source chips/3 toggles is a lot).
2. Optional: fold **Storytellers + Stories(EL) + Quotes → one "Voices" hub**; fold **Media-gaps + Community-stories → one "Coverage" view** (theme-axis vs place-axis).
3. Human task: tag people on the ~408 "Needs people" EL photos in the media-library UI (unlocks more community derivation).
