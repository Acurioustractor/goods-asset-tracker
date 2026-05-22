import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { AddFunderForm } from './add-funder-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchCommunities(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('communities').select('name').order('name');
  return (data || []).map((c) => c.name as string).filter(Boolean);
}

export default async function NewFunderPage() {
  const communities = await fetchCommunities();
  return (
    <div className="space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/funders" className="text-blue-700 hover:underline">← back to funders</Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Add a funder / supporter</h1>
        <p className="mt-1 text-sm text-gray-500">
          New funders are saved to <code>wiki/config/funders.json</code> and appear in{' '}
          <code>/admin/reports</code> immediately. Report shape auto-picks by commitment size
          (&lt; $100K = short visual deck, ≥ $100K = long-form Snow-style). Optional community
          scope filters all metrics to one place.
        </p>
      </header>

      <AddFunderForm communities={communities} />
    </div>
  );
}
