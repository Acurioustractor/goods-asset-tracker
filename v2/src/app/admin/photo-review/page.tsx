/**
 * /admin/photo-review — internal Photo + Video Review tool, behind admin auth.
 *
 * The tool carries storyteller consent + GPS + Empathy Ledger data, so it is
 * served from a `requireAdmin()`-gated route (`./raw`) rather than `public/`.
 * We embed it in an iframe so its self-contained inline JS (Leaflet map,
 * tagging, JSON/CSV export) runs exactly as it does locally.
 */
import Link from 'next/link';

export const metadata = {
  title: 'Photo + Video Review — Goods Admin',
  robots: { index: false, follow: false },
};

export default function PhotoReviewPage() {
  return (
    <div className="-my-8 md:-my-10 -mx-4 sm:-mx-6 flex h-[100dvh] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Photo + Video Review</h1>
          <p className="text-xs text-gray-500">
            Internal tool. Holds storyteller consent and GPS data, so it stays behind admin auth and is never hosted publicly.
          </p>
        </div>
        <Link
          href="/admin/photo-review/raw"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Open full screen ↗
        </Link>
      </header>
      <iframe
        src="/admin/photo-review/raw"
        title="Goods Photo + Video Review"
        className="w-full flex-1 border-0"
      />
    </div>
  );
}
