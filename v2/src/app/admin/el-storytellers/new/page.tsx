import Link from 'next/link';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { CreateStorytellerForm } from './create-form';

export const metadata: Metadata = {
  title: 'New storyteller · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function fetchCommunities(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('communities').select('name').order('name');
  return (data || []).map((c) => c.name as string).filter(Boolean);
}

export default async function NewStorytellerPage() {
  const communities = await fetchCommunities();
  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/el-storytellers" className="text-blue-700 hover:underline">
            ← back to storytellers
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Add a storyteller to Empathy Ledger</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Creates a new EL storyteller scoped to the Goods organisation. Defaults to
          <code className="mx-1 rounded bg-gray-100 px-1 py-0.5">is_active=false</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5">content_status=draft</code> so nothing
          surfaces publicly until you verify consent and flip the flags in EL.
        </p>
        <p className="mt-2 max-w-prose rounded border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
          Capture consent per{' '}
          <code className="rounded bg-white px-1 py-0.5">wiki/articles/brand-comms/CONSENT_PROCESS.md</code>{' '}
          before publishing. For young people (under 18), capture family/guardian consent and
          appropriate cultural facilitation (e.g. Oonchiumpa for Mykel) before flipping
          <code className="mx-1 rounded bg-white px-1 py-0.5">has_explicit_consent</code> to true.
        </p>
      </header>

      <CreateStorytellerForm communities={communities} />
    </div>
  );
}
