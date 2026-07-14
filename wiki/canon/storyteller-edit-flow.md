# Storyteller edit flow: names, portraits, consent

How storyteller identity moves from Empathy Ledger to the Goods site, and where you
edit each piece. Written 2026-06-08 during the first weekly ledger batch review.

## The one mental model

There is one direction of flow. Empathy Ledger is upstream (the source of truth).
The Goods site and admin are downstream: they read EL, then layer repo overrides on top.

```
  EMPATHY LEDGER (the source of truth)          <- edit IDENTITY here
  empathy-ledger-v2.vercel.app · project "goods-on-country"
  holds: name · location · elderStatus · avatar/portrait · consent
        |
        |  read-only APIs  +  portrait sync script
        v
  GOODS REPO (overrides / committed copies)     <- edit PRESENTATION here
  curated-quotes.ts · content.ts · compendium.ts · public/images/people/
        |
        |  build / deploy
        v
  GOODS SITE  (public /stories, product pages)  +  GOODS ADMIN (gated /admin/*)
```

Rule of thumb: change a person's name or portrait in EL, then pull it down. Change how a
quote or card shows on the site in the repo.

The Goods EL client (`v2/src/lib/empathy-ledger/client.ts`) is read-only for storytellers:
every method is a `get*`. It cannot write a storyteller's name or portrait back to EL. The
only admin write paths are story content blocks and media swaps, plus a sync cron.

## Where each thing lives

| You want to change... | Edit it here | How it reaches the site |
| --- | --- | --- |
| Name / location / Elder status | Empathy Ledger app | Admin reads EL live; repo mirrors corrected by hand |
| Portrait | Upload avatar in EL | `sync-el-portraits.mjs` copies it into `public/images/people/<slug>.<ext>` |
| Consent to use a voice or photo | EL consent fields | Loop E gate enforces it before a draft can ship |
| A cleared quote the site shows | `v2/src/lib/data/curated-quotes.ts` (keyed by name) | Build/deploy; read by `/admin/stories` and the loop roster |
| A journey story or testimonial | `v2/src/lib/data/content.ts` | Build/deploy; public `/stories`, product pages |
| Role / community in the register | `v2/src/lib/data/compendium.ts` | Build/deploy; impact and register surfaces |
| Photo tags / GPS / consent review | `/admin/photo-review` (gated, never public) | Stays internal; GPS and consent never reach `public/` |

## Empathy Ledger app

- URL: `https://empathy-ledger-v2.vercel.app`, project `goods-on-country`.
- Holds every storyteller's name, location, Elder status, avatar, and consent state.
- Quirk: EL has 240 storytellers but 0 published stories, so the public `/stories` page
  falls back to local `journeyStories` in `content.ts`. Flipping a story to published in EL
  makes it take over from the local fallback. That flip is the publish lever.
- This is where you add a surname (if one exists and is consented) and upload or replace a
  portrait.

## Goods admin UI (gated, read side)

All under `/admin/*`, behind `/admin/login` (middleware `v2/src/proxy.ts`).

| Route | What it does |
| --- | --- |
| `/admin/stories` | Storyteller grid. Pulls live from EL, then applies `curated-quotes.ts` overrides. |
| `/admin/el-storytellers` | Browse EL storytellers as Goods sees them (read view, confirms what synced). |
| `/admin/el-stories` + `/[id]/edit` | The one writing admin: arrange story content blocks and swap media. Not identity. |
| `/admin/photo-review` | Tag photos to people and places, hold consent and GPS. Never public. |

## The clean edit flows

### A. Add a full name or fix a portrait
1. In the EL app, open the storyteller (for example `gary`), edit `name` or upload the avatar, save.
2. Pull the portrait down: `cd v2 && node --env-file=.env.local scripts/sync-el-portraits.mjs`
   (allowlist-gated to the cleared slugs; add the slug to the allowlist if new).
3. If the name changed, correct the repo mirror by hand where it appears: the
   `curated-quotes.ts` key, the `content.ts` author/person, the `compendium.ts` name.
4. `npm run check:drift:ci` to confirm the loops are happy, then commit.

### B. Approve a portrait for a public surface (consent)
1. Confirm the person's EL consent covers this surface (a public weekly ledger post).
2. Tick the consent checklist for that person.
3. The draft already points at the committed `public/images/people/<slug>` copy, so nothing
   else to wire.

### C. Publish a ledger draft
1. Draft lives in `wiki/outputs/ledger/<date>-<slug>.md` (untracked, drafts only).
2. Consent confirmed in step B makes it shippable.
3. Publishing to the live feed or EL is a deliberate human step. The loops never auto-publish.

## How the loops keep it honest

Loop E (`v2/scripts/check-story-coverage.mjs`) reads the cleared-voice roster
(curated-quotes keys plus cleared trip VoiceCards) and hard-fails if a draft names someone
not in the cleared roster. It runs in `check:drift:ci`. The system will not let an
unconsented name ship, so you do not have to police it by memory.

## First-name-only voices

Gary, Jason, Ivy, and Chloe are recorded first-name-only in every source, including EL.
No surname exists anywhere in the system. First-name-only is fine and common for community
voices. Add a surname only at the EL source, and only if the person agreed to one.
