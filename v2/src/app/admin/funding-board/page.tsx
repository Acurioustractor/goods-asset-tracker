import type { Metadata } from 'next';
import { allTargets } from '@/lib/data/outreach-targets';
import { FundingBoard } from './board-client';

/**
 * ONE TABLE: every buyer, funder, philanthropic prospect and government pathway, linked to the
 * community it matters to. Three lenses (community / type / status) on the same underlying
 * data — not three pages — per Ben, 17 Sep 2026.
 *
 * Data lives in outreach-targets.ts: paidBuyers (real invoiced trade) and
 * philanthropicProspects20260917 (this session's Centrecorp-shaped research) are new; the rest
 * is the pre-existing outreach pipeline, now community-linked where known.
 */

export const metadata: Metadata = {
  title: 'Funding board | Goods admin',
  robots: { index: false, follow: false },
};

export default function FundingBoardPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold">Funding board</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        Every organisation Goods has sold to, been funded by, or could plausibly buy from or be
        funded by — buyers, philanthropy, government procurement pathways — in one table, linked
        to the community it matters to. Evidence tier says how solid each lead actually is; dropped
        entries are researched and ruled out, kept so nobody re-researches them.
      </p>
      <div className="mt-6">
        <FundingBoard targets={allTargets} />
      </div>
    </div>
  );
}
