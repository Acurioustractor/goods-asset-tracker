# Archived: Goods admin upload routes (2026-05-23)

## What's here

- `upload/` — was at `src/app/admin/upload/` — unified drag-multi photo+video uploader (FormData → ffmpeg → EL).
- `videos/` — was at `src/app/admin/videos/` — single-video drag-drop form with the 4-axis taxonomy dropdowns.

## Why archived

Decision 2026-05-23: Empathy Ledger is the canonical system of record for all media. Uploading
through Goods admin created two ingestion paths and confused the consent + tagging story.
EL admin is now the only upload surface. Goods reads from EL by tag — see
`v2/src/lib/field-notes/resolve-gallery.ts` and the `el-gallery` / `el-video-gallery` block kinds.

The CLI scripts at `scripts/upload-*.mjs` are kept as bulk-operation fallbacks (used to land the
121 Alice build photos before EL ingestion was streamlined).

## How to restore

```bash
git mv _archive/2026-05-23-goods-uploads/upload src/app/admin/upload
git mv _archive/2026-05-23-goods-uploads/videos src/app/admin/videos
```

Then re-add the sidebar entries in `src/app/admin/admin-sidebar.tsx` (removed in the same commit
that archived these — `git log -p src/app/admin/admin-sidebar.tsx` shows the diff).

## Related

- Cinema video block in `src/lib/data/trip-stories.ts` was swapped from a hardcoded `kind: 'videos'`
  to `kind: 'el-video-gallery'` with a tagQuery, so Mykel's clip auto-pulls from EL once tagged.
