import { redirect } from 'next/navigation';

// RETIRED 2026-07-20 (admin consolidation, 58→~19 routes). The old implementation
// is preserved in ./legacy-page.tsx and git history. See the keep/fold/retire table
// in wiki/outputs/2026-07-20-admin-see-do-public-sweep.md.
export default function RetiredPage() {
  redirect('/admin/people');
}
