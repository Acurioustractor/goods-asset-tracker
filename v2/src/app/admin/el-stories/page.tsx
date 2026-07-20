import Link from 'next/link';
import type { Metadata } from 'next';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

export const metadata: Metadata = {
  title: 'Stories (EL) · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface ElStoryRow {
  id: string;
  title: string | null;
  is_public: boolean;
  requires_elder_review: boolean;
  elder_reviewed: boolean;
  has_explicit_consent: boolean;
  tags: string[] | null;
  created_at: string;
  storyteller_id: string | null;
}

async function fetchGoodsStories(): Promise<ElStoryRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  // Prose feed only: exclude gallery photos / raw delivery evidence so this
  // page stays a clean editorial surface. Use /admin/photos for image triage.
  const excludeTypes = 'gallery-photo,photo,delivery-evidence';
  const url = `${EL_URL}/rest/v1/stories?project_id=eq.${EL_PROJECT_ID}` +
    `&story_type=not.in.(${excludeTypes})` +
    `&select=id,title,is_public,requires_elder_review,elder_reviewed,has_explicit_consent,tags,created_at,storyteller_id` +
    `&order=created_at.desc&limit=100`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ElStoriesIndex() {
  const stories = await fetchGoodsStories();
  const publicCount = stories.filter((s) => s.is_public).length;
  const pendingReview = stories.filter((s) => s.requires_elder_review && !s.elder_reviewed).length;

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Stories in Empathy Ledger (Goods)</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-prose">
            Every Goods story in EL (last 100). Filter / curate via tags. Approve consent via{' '}
            <code className="rounded bg-muted px-1">/admin/consent</code>{' '}
            or directly in EL admin.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">{publicCount} public</span>
            <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-800">{pendingReview} pending elder</span>
            <span className="ml-2 rounded bg-stone-100 px-2 py-0.5 text-stone-700">{stories.length} total</span>
          </p>
        </div>
        <Link
          href="/admin/el-stories/new"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + Write a story
        </Link>
      </header>

      {stories.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          No EL stories yet (or EL API unreachable). Click &quot;Write a story&quot; above to compose the first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-left">Consent</th>
                <th className="px-4 py-2 text-left">Public?</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stories.map((s) => (
                <tr key={s.id} className="hover:bg-amber-50/30">
                  <td className="px-4 py-2 font-medium text-foreground max-w-[40ch] truncate">
                    {s.is_public ? (
                      <Link href={`/stories/${s.id}`} target="_blank" className="hover:text-amber-700">
                        {s.title || '(untitled)'}
                      </Link>
                    ) : (
                      s.title || '(untitled)'
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {(s.tags || []).slice(0, 4).map((t) => (
                        <code key={t} className="rounded bg-muted px-1 text-[10px]">{t}</code>
                      ))}
                      {(s.tags || []).length > 4 && (
                        <span className="text-muted-foreground">+{(s.tags || []).length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {s.has_explicit_consent ? (
                      <span className="text-emerald-700">✓ explicit</span>
                    ) : (
                      <span className="text-amber-700">⚠ pending</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {s.is_public ? (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">public</span>
                    ) : (
                      <span className="rounded bg-stone-100 px-1.5 py-0.5 text-stone-600">draft</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <Link
                      href={`/admin/el-stories/${s.id}/edit`}
                      className="rounded bg-amber-600 px-2 py-1 text-white text-[11px] font-medium hover:bg-amber-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
