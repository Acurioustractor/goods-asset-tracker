import { Suspense } from 'react';
import { getPipelineOverview } from './actions';
import { KanbanBoard } from './kanban-board';
import { FocusDeals } from './focus-deals';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  const overview = await getPipelineOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Deals Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales, funding, partnerships, and procurement — all in one Kanban board.
        </p>
      </div>
      <FocusDeals />
      <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
        <KanbanBoard overview={overview} />
      </Suspense>
    </div>
  );
}
