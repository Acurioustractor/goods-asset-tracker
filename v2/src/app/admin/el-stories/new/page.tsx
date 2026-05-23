import Link from 'next/link';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { getGoodsStorytellers, slugify } from '@/lib/storytellers';
import { CreateStoryForm } from './create-form';

export const metadata: Metadata = {
  title: 'New EL story · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function fetchCommunities(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('communities').select('name').order('name');
  return (data || []).map((c) => c.name as string).filter(Boolean);
}

export default async function NewStoryPage() {
  const [communities, tellers] = await Promise.all([
    fetchCommunities(),
    getGoodsStorytellers(),
  ]);
  const storytellerOptions = tellers
    .map((t) => ({ id: t.id, displayName: t.displayName, slug: slugify(t.displayName) }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/el-stories" className="text-blue-700 hover:underline">
            ← back to EL stories
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Write a prose story (Empathy Ledger)</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Writes directly to the EL <code className="rounded bg-gray-100 px-1">stories</code> table
          scoped to the Goods project with the canonical tag taxonomy pre-set. Defaults to consent
          pending + not public until you explicitly approve.
        </p>
      </header>

      <CreateStoryForm
        communities={communities.map((c) => ({
          label: c,
          slug: c.toLowerCase().replace(/\s+/g, '-'),
        }))}
        storytellers={storytellerOptions}
      />
    </div>
  );
}
