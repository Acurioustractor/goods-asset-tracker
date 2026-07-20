import { redirect } from 'next/navigation';

// RETIRED 2026-07-21 (admin consolidation). The upload + recent-content job now
// lives in the Media Room's "Add media" dialog (real file upload to the
// production-media bucket via /api/admin/media-upload, writing the same
// compassion_content row the recipient /bed/[id] page reads). The old
// implementation is preserved in ./legacy-page.tsx and git history. See the
// keep/fold/retire table in wiki/outputs/2026-07-20-admin-see-do-public-sweep.md.
export default function RetiredPage() {
  redirect('/admin/media-library');
}
