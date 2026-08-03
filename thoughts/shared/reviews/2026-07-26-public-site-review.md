# Public site review — 2026-07-26

Review of all 117 public routes against `audience.ts` (six audiences), per
`thoughts/shared/handoffs/final-mission-brief.md`. Route changes are PROPOSED, not made.
Notion alignment page: https://app.notion.com/p/3a9ebcf981cf810b9537dc7e3aa19266

## The finding in one line

The same story is told at eight lengths in eight places, no buyer page leads with price and
lead time, and roughly half the public tree is internal tooling that should be noindexed or
retired. Proposal: six front doors, one per audience.

## Proposed canonical map

| Audience | Front door | Supporting |
|---|---|---|
| community | /pathways | /bed/[id], /support (field), /field-notes |
| funder | /pitch/road + /register | gated /funders/[slug], /export/leave-behind, /cost-story |
| buyer | /shop (rebuilt spec-first) | /wiki/support/faq |
| supporter | /story/road + /sponsor | /storytellers, /gallery |
| partner | /pathways/[id] | /press (asset pack), /partners/oonchiumpa |
| internal | admin + noindexed tools | /wiki/manufacturing/*, /sites/* |

## Duplicate clusters (retire on the /pitch/control-room pattern)

1. **Origin story x8:** /about, /the-work, /process, /story (1,178 ln hardcoded JSX, outside
   all prose guards), /story/road (data-driven, the keeper), /cost-story, /impact, /insights.
   /mission already redirects to /story. /impact + /insights share the same five domains; merge.
2. **Product x3 per product:** /shop/stretch-bed-single vs /stretch-bed vs
   /wiki/products/stretch-bed (same for washing machine). /shop index is hardcoded and can
   drift from DB-driven /shop/[slug]; static slug routes shadow the dynamic one.
3. **Pitch sprawl:** /pitch and /pitch/document are prose twins; /pitch/workshop,
   /pitch/investor-lab, /pitch/miro-board are three near-identical internal tools;
   /pitch/simple is the PDF twin (stays, ruling R); /deck is superseded by the road deck.
4. **Asset packs x4:** /press (keeper), /media (already 301'd but 902-line file still in
   tree), /brand, /kit.
5. **Cost family:** /investors literally re-renders /admin/cost-model; overlaps /sites/qbe,
   /sites/qbe-readiness, /sites/cost-lab.
6. **Naming collisions:** /community vs /communities; /support (fault form) vs /sponsor;
   /register is the claims register, not signup; /partner vs /partners/*.
7. **Login forms x4** with identical logic (insiders, investors, funders/[slug], partners/[slug]).

## Gating problems

- No middleware.ts in v2; every gate is per-page and inconsistent.
- /impact login is orphaned: the page is effectively public.
- /production/* and /partners/[slug]/dashboard have no server-side gate (verify the
  partner dashboard before assuming exposure).
- Admin MediaSwapZone UI is embedded in public pages (/process, /stretch-bed).

## Stale / dead

- /canberra (dated 2026 campaign, force-dynamic), /design/* (mockups, non-canonical stats,
  /design/circular-story is a dead link), /basket-bed-plans (legacy framing),
  /portal/projects|goals|our-story persist to localStorage only (demos).

## Next steps (blocked on Ben)

1. Ruling in /DECISIONS.md with sweep list, then redirects.
2. Ben walks /story vs /story/road; picks the survivor.
3. Rebuild /shop to lead with spec, price, lead time, freight, warranty, who fixes it.
4. /pitch/deck vs /pitch/road resolution when the open branch lands.
5. Decide the gating posture for production and partner surfaces, and whether /impact is public.
