import { Suspense } from 'react';
import Link from 'next/link';
import { getPipelineOverview } from './actions';
import { KanbanBoard } from './kanban-board';
import { FocusDeals } from './focus-deals';
import { FundersTab } from './tabs/funders/tab';
import { LoiTrackerTab } from './tabs/loi-tracker/tab';
import { PipelineTab } from './tabs/pipeline/tab';
import { AskTab } from './tabs/ask/tab';
import { StackTab } from './tabs/stack/tab';
import { ReadinessTab } from './tabs/readiness/tab';
import { UnitTab } from './tabs/unit/tab';

export const dynamic = 'force-dynamic';

/**
 * THE RAISE, IN ONE PLACE.
 *
 * Ben, 17 September 2026: fewer routes. Four surfaces about the same money were four URLs, and
 * admin-routes.ts had already declared every one of them `absorbed`, meaning folded into this
 * hub. The board, the stack, who the funders are, what has been asked and what is signed are five
 * views of one question and they belong behind one address.
 *
 * Same move as /admin/voices earlier today. Each body lives in tabs/<name>/tab.tsx with its own
 * client component beside it, so nothing about the data changed. The funder create form and the
 * per-funder video brief stay as routes, because a form and a document need a URL.
 */
const TABS = [
  { id: 'board', label: 'Board' },
  { id: 'stack', label: 'The stack' },
  { id: 'unit', label: 'The unit' },
  { id: 'ask', label: 'The ask' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'funders', label: 'Funders' },
  { id: 'loi', label: 'LOI tracker' },
  { id: 'pipeline', label: 'Pipeline' },
] as const;

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const current = TABS.find((t) => t.id === tab)?.id ?? 'board';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">The raise</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales, funding, partnerships and procurement. One board, and the views behind it.
        </p>
      </div>

      <nav className="flex flex-wrap gap-1 border-b pb-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === 'board' ? '/admin/deals' : `/admin/deals?tab=${t.id}`}
            className={`rounded-lg px-3 py-1.5 text-sm ${current === t.id ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {current === 'board' && <DealsBoard />}
      {current === 'stack' && <StackTab />}
      {current === 'unit' && <UnitTab />}
      {current === 'ask' && <AskTab />}
      {current === 'readiness' && <ReadinessTab />}
      {current === 'funders' && <FundersTab />}
      {current === 'loi' && <LoiTrackerTab />}
      {current === 'pipeline' && <PipelineTab />}
    </div>
  );
}

async function DealsBoard() {
  const overview = await getPipelineOverview();
  return (
    <>
      <FocusDeals />
      <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
        <KanbanBoard overview={overview} />
      </Suspense>
    </>
  );
}
