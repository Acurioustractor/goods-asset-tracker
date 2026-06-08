import Link from 'next/link';
import type { Metadata } from 'next';
import { getGoodsStorytellersWithClearance, slugify, type StorytellerClearance } from '@/lib/storytellers';

export const metadata: Metadata = {
  title: 'Storytellers (EL) · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// EL is one Next app serving both /api and /admin, so the API base is also
// the app base. Deep-link straight to the EL storyteller edit screen.
const EL_APP_URL =
  process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger.vercel.app';

function editInElHref(id: string): string {
  return `${EL_APP_URL.replace(/\/$/, '')}/admin/storytellers/${id}/edit`;
}

// A single token (no space) means we only hold a first name — an identity gap
// the elder/community has to resolve in EL, never us.
function isFirstNameOnly(displayName: string): boolean {
  return displayName.trim().split(/\s+/).length < 2;
}

function initials(displayName: string): string {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// EL profile lifecycle status → label + colour. This is NOT consent — it's
// whether the profile is live, half-built, awaiting review, or disabled.
const STATUS_META: Record<string, { label: string; cls: string; attention: boolean }> = {
  active: { label: 'Active', cls: 'bg-emerald-100 text-emerald-800', attention: false },
  pending_review: { label: 'Pending review', cls: 'bg-amber-100 text-amber-800', attention: true },
  needs_content: { label: 'Needs content', cls: 'bg-gray-100 text-gray-600', attention: true },
  inactive: { label: 'Inactive', cls: 'bg-rose-100 text-rose-800', attention: true },
};

function statusMeta(status?: string | null) {
  return (status && STATUS_META[status]) || { label: status || 'Unknown', cls: 'bg-gray-100 text-gray-500', attention: false };
}

// "Cleared for the Goods public surface" verdict, derived from EL's canonical
// syndication gate (stories_for_site). cleared = passes the gate; candidate =
// published in a Goods-carried project. cleared=0 & candidate>0 = a real
// consent gap holding content back ("Blocked").
function clearanceVerdict(c: StorytellerClearance) {
  if (c.cleared > 0)
    return { label: 'On Goods', cls: 'bg-emerald-100 text-emerald-800', attention: false, detail: `${c.cleared} cleared by gate` };
  if (c.candidate > 0)
    return { label: 'Blocked', cls: 'bg-rose-100 text-rose-800', attention: true, detail: `${c.candidate} published, held by gate` };
  return { label: 'No public stories', cls: 'bg-gray-100 text-gray-500', attention: false, detail: 'nothing published for Goods' };
}

export default async function ElStorytellersIndex() {
  const tellers = await getGoodsStorytellersWithClearance();

  const firstNameOnly = tellers.filter((s) => isFirstNameOnly(s.displayName));
  // avatarUrl is mapped from public_avatar_url, so a missing one means the
  // portrait isn't cleared for public surfaces — a real consent signal.
  const noPublicPortrait = tellers.filter((s) => !s.avatarUrl);
  const needsReview = tellers.filter((s) => statusMeta(s.contentStatus).attention);
  const blocked = tellers.filter((s) => clearanceVerdict(s.clearance).attention);

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Storytellers in Empathy Ledger (Goods)</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-prose">
            Every Goods storyteller in EL. EL is the source of truth — review here, then{' '}
            <span className="font-medium text-gray-700">Edit in EL</span> to fix. Voice cards in{' '}
            <code className="mx-1 rounded bg-gray-100 px-1">trip-stories.ts</code> reference these via{' '}
            <code className="rounded bg-gray-100 px-1">storytellerSlug</code>.
          </p>
        </div>
        <Link
          href="/admin/el-storytellers/new"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + New storyteller
        </Link>
      </header>

      {/* Needs-attention banner — counts identity gaps the reviewer should action in EL */}
      {tellers.length > 0 &&
        (blocked.length > 0 || firstNameOnly.length > 0 || noPublicPortrait.length > 0 || needsReview.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <span className="font-semibold text-amber-900">Needs attention</span>
            {blocked.length > 0 && (
              <span className="font-medium text-rose-700">
                <span className="font-semibold">{blocked.length}</span> blocked from Goods (consent gap)
              </span>
            )}
            {needsReview.length > 0 && (
              <span className="text-amber-800">
                <span className="font-semibold">{needsReview.length}</span> not active (review / draft / disabled)
              </span>
            )}
            {firstNameOnly.length > 0 && (
              <span className="text-amber-800">
                <span className="font-semibold">{firstNameOnly.length}</span> first-name only
              </span>
            )}
            {noPublicPortrait.length > 0 && (
              <span className="text-amber-800">
                <span className="font-semibold">{noPublicPortrait.length}</span> no public portrait
              </span>
            )}
            <span className="text-amber-700/70">Fix in EL — this view is read-only.</span>
          </div>
        )}

      {tellers.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
          No storytellers loaded (EL API may be rate-limited). Refresh in a moment.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Storyteller</th>
                <th className="px-4 py-2 text-left">Community</th>
                <th className="px-4 py-2 text-left" title="EL profile lifecycle — not a consent grant">Status</th>
                <th className="px-4 py-2 text-left" title="Cleared by EL's syndication gate (stories_for_site)">On Goods?</th>
                <th className="px-4 py-2 text-left">Elder</th>
                <th className="px-4 py-2 text-left">Slug (use this on voice cards)</th>
                <th className="px-4 py-2 text-left">Public page</th>
                <th className="px-4 py-2 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tellers.map((s) => {
                const slug = slugify(s.displayName);
                const firstNameGap = isFirstNameOnly(s.displayName);
                const st = statusMeta(s.contentStatus);
                const cv = clearanceVerdict(s.clearance);
                return (
                  <tr key={s.id} className="hover:bg-amber-50/30">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        {s.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.avatarUrl}
                            alt={s.displayName}
                            className="h-9 w-9 flex-none rounded-full object-cover ring-1 ring-gray-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span
                            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-400 ring-1 ring-dashed ring-gray-300"
                            title="No portrait in EL"
                          >
                            {initials(s.displayName) || '—'}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{s.displayName}</div>
                          {firstNameGap && (
                            <span className="mt-0.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                              first-name only
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{s.community || '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cv.cls}`}
                        title={cv.detail}
                      >
                        {cv.label}
                      </span>
                    </td>
                    <td className="px-4 py-2">{s.elderStatus ? '✓' : ''}</td>
                    <td className="px-4 py-2 font-mono text-xs text-amber-700">{slug}</td>
                    <td className="px-4 py-2">
                      <Link href={`/storytellers/${slug}`} target="_blank" className="text-blue-700 hover:underline">
                        /storytellers/{slug} ↗
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <a
                        href={editInElHref(s.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Edit in EL ↗
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
