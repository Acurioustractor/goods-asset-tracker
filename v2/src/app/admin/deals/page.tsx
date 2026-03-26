import { Suspense } from 'react';
import { getPipelineOverview } from './actions';
import { KanbanBoard } from './kanban-board';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  const overview = await getPipelineOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sales, funding, partnerships, and procurement — all in one Kanban board
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
        <KanbanBoard overview={overview} />
      </Suspense>
    </div>
  );
}
