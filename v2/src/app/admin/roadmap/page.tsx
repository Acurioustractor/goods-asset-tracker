import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { RoadmapBoard, type RoadmapCard } from './roadmap-board';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Roadmap — Goods admin', robots: { index: false, follow: false } };

export default async function AdminRoadmapPage() {
  let items: RoadmapCard[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('roadmap_items')
      .select('id, title, note, status, position')
      .eq('show_in_kanban', true)
      .order('position');
    items = (data ?? []) as RoadmapCard[];
  } catch {
    items = [];
  }

  return (
    <main className="min-h-screen px-5 sm:px-8 py-10" style={{ backgroundColor: '#FFFFFF', color: '#2E2E2E' }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-xs uppercase" style={{ color: '#8B9D77' }}>← Admin</Link>
        <h1 className="font-display text-3xl sm:text-4xl mt-3 mb-2" style={{ color: '#2E2E2E' }}>Roadmap board</h1>
        <p className="text-sm mb-8" style={{ color: '#2E2E2Ebf' }}>
          The shared Goods roadmap. Drag cards to move and reorder; it updates the partner dashboards live.
        </p>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: '#C45C3E' }}>
            No roadmap items found (or the table is unavailable). Check the roadmap_items table on the Goods project.
          </p>
        ) : (
          <RoadmapBoard initialItems={items} />
        )}
      </div>
    </main>
  );
}
