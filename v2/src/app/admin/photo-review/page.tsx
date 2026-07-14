import { redirect } from 'next/navigation';

// RETIRED 2026-07-04 (content system, Phase 2). /admin/photo-review was a frozen
// localStorage snapshot (Leaflet map + tagging + CSV export) with no write-back
// and stale data. Its star/rating UX was the model re-implemented live against
// content_items in the media library, which now supersedes it. This route
// redirects there. The old iframe host + raw/ snapshot remain in the folder,
// unused, for easy restore, and in git history.
export default function PhotoReviewPage() {
  redirect('/admin/media-library');
}
