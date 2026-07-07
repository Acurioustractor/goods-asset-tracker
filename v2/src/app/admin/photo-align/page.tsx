import { redirect } from 'next/navigation';

// Photo→people alignment was folded into the media library (2026-07-07): open a
// photo there and use "People in this photo", or the Person / Needs-people filters.
// This standalone route now redirects there. The original standalone UI is preserved
// in ./align-client.tsx + git history — revert this file to restore it.
export default function PhotoAlignPage() {
  redirect('/admin/media-library');
}
