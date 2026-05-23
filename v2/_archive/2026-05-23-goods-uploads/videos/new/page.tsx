import Link from 'next/link';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { VideoUploadForm } from './upload-form';

export const metadata: Metadata = {
  title: 'New video · Goods admin',
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

export default async function NewVideoPage() {
  const communities = await fetchCommunities();
  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/photos" className="text-blue-700 hover:underline">
            ← back to photos + videos
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Upload a video to Empathy Ledger</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Single-file uploader for one-off videos. ffmpeg extracts a poster + re-encodes H.264 1080p
          locally, then writes to EL with canonical Goods tags. For bulk uploads (5+ videos), use{' '}
          <code className="rounded bg-gray-100 px-1">node scripts/upload-videos.mjs</code> instead.
        </p>
      </header>

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <VideoUploadForm communities={communities} />
      </div>

      <details className="rounded border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
        <summary className="cursor-pointer font-semibold">Taxonomy reference (4 axes)</summary>
        <div className="mt-2 space-y-2 leading-relaxed">
          <p>
            <strong>Use</strong> (1 of 5): atmosphere / voice / process / moment / establishing —
            what role the video plays.
          </p>
          <p>
            <strong>Placement</strong> (any combination of 3): overlay-fullscreen / under-text /
            standalone-card — where it can sit on a page.
          </p>
          <p>
            <strong>Context</strong>: community + trip + (optional) participant + theme + product.
          </p>
          <p>
            <strong>Consent</strong>: consent:elder-pending (default) or consent:public.
          </p>
        </div>
      </details>
    </div>
  );
}
