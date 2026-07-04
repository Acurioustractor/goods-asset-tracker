import { redirect } from 'next/navigation';

// RETIRED 2026-07-04 (content system, Phase 2). /admin/photos rode the legacy
// direct-Supabase EL keys (disabled org-wide 2026-06-17) so its bulk-tag and
// consent writes were already broken in prod. Its one worthwhile idea — the
// elder-review consent workflow — now lives in the media library (Type + consent
// panel, writing content_items.consent_tier) and /admin/consent. This route
// redirects there. The old implementation (photo-picker.tsx, actions.ts,
// bulk-tag-actions.ts) remains in the folder, unused, for easy restore, and in
// git history.
export default function PhotosPage() {
  redirect('/admin/media-library');
}
