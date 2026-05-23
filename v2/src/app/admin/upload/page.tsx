import Link from 'next/link';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { UploadForm } from './upload-form';

export const metadata: Metadata = {
  title: 'Upload media · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function fetchCommunities(): Promise<{ slug: string; name: string }[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('communities').select('name').order('name');
  return (data || [])
    .map((c) => ({
      name: c.name as string,
      slug: (c.name as string).toLowerCase().replace(/\s+/g, '-'),
    }))
    .filter((c) => c.name);
}

export default async function UploadPage() {
  const communities = await fetchCommunities();
  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/photos" className="text-blue-700 hover:underline">
            ← back to photos
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Upload photos + videos</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Drop a folder of mixed photos and videos. Set the shared context once
          (community, trip, event tag), tick consent if you have it, hit upload.
          Each file goes to Empathy Ledger with the canonical Goods tags. Videos
          run through ffmpeg locally for poster + H.264 encode. Photos resize via
          sharp.
        </p>
        <p className="mt-2 max-w-prose rounded border border-stone-200 bg-stone-50 p-2 text-xs text-stone-700">
          For one-off uploads with custom titles + captions, use{' '}
          <Link href="/admin/videos/new" className="font-semibold text-blue-700 hover:underline">
            /admin/videos/new
          </Link>{' '}
          (single video, full form). For 50+ files at once, use the bulk script:{' '}
          <code className="rounded bg-white px-1.5 py-0.5">node scripts/upload-videos.mjs /folder</code>.
        </p>
      </header>

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <UploadForm communities={communities} />
      </div>
    </div>
  );
}
