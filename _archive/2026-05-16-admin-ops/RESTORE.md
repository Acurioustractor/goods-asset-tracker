# Archived: `/admin/ops` + ops summary components

**Date:** 2026-05-16
**Reason:** Dead twin of `/admin` home dashboard. Was not in the sidebar; pulled the
same kind of summary data (fleet/production/funding/stories/CRM cards) that the new
trip-mode home now covers from a different angle.

## What's in here

- `admin-ops/` — the `/admin/ops` route (page.tsx + actions.ts).
- `components-ops/` — the `<*SummaryCard>` components used only by that route.

## How to restore

```
git mv _archive/2026-05-16-admin-ops/admin-ops v2/src/app/admin/ops
git mv _archive/2026-05-16-admin-ops/components-ops v2/src/components/ops
```

Then re-add the `Operations` group entry pointing at `/admin/ops` in
`v2/src/app/admin/admin-sidebar.tsx` if you want it discoverable.

## Related decisions

- `/admin` (home) was rebuilt as a trip-mode dashboard on 2026-05-16 — see
  `v2/src/app/admin/page.tsx`. That page now owns the "look at everything live"
  surface.
- Five CRM-like pages (`/admin/crm`, `/admin/deals`, `/admin/strategy`,
  `/admin/growth`, `/admin/deal-room`) remain — consolidation deferred until after
  the Utopia trip. Sidebar's `Money → Deals` now points at `/admin/deals` (the
  Kanban) instead of `/admin/strategy` (a narrative page).
