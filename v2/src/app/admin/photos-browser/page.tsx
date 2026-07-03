import { redirect } from 'next/navigation';

// RETIRED 2026-07-03 (content system, slice B). /admin/photos-browser was a
// strict subset of the unified media library (browse EL photos, copy/download),
// so it now redirects there. The old implementation lives in git history;
// photos-browser-client.tsx remains in the folder, unused, for easy restore.
export default function PhotosBrowserPage() {
  redirect('/admin/media-library');
}
