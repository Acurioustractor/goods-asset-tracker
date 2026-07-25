'use client';

import { useState } from 'react';
import Link from 'next/link';

export type PipeCategory = 'Funding' | 'Sales' | 'Partnerships' | 'Procurement';

export interface PipeRow {
  id: string;
  name: string;
  category: PipeCategory;
  amount: number; // AUD
  stageLabel: string;
  stageTone: 'sage' | 'gold' | 'terracotta' | 'muted';
  next: string;
  href: string | null;
}

const TONE: Record<PipeRow['stageTone'], string> = {
  sage: 'bg-emerald-100 text-emerald-900',
  gold: 'bg-amber-100 text-amber-900',
  terracotta: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
};

const CAT_TONE: Record<PipeCategory, string> = {
  Funding: 'bg-violet-100 text-violet-900',
  Sales: 'bg-sky-100 text-sky-900',
  Partnerships: 'bg-emerald-100 text-emerald-900',
  Procurement: 'bg-muted text-muted-foreground',
};

function fmtMoney(n: number): string {
  if (!n) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

const FILTERS: ('All' | PipeCategory)[] = ['All', 'Funding', 'Sales', 'Partnerships', 'Procurement'];
const COLS = 'grid grid-cols-[1fr_120px_90px_150px_1.3fr] gap-3 items-center';

export default function PipelineTable({ rows }: { rows: PipeRow[] }) {
  const [filter, setFilter] = useState<'All' | PipeCategory>('All');
  const shown = filter === 'All' ? rows : rows.filter((r) => r.category === filter);

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap px-4 pt-4">
        {FILTERS.map((f) => {
          const count = f === 'All' ? rows.length : rows.filter((r) => r.category === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? 'bg-primary/10 text-primary font-semibold' : 'border bg-background text-foreground hover:border-primary/40'
              }`}
            >
              {f} <span className="text-xs opacity-60 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className={`${COLS} px-4 py-2 border-b text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground`}>
            <div>Opportunity</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div>Status</div>
            <div>Next</div>
          </div>

          {shown.length === 0 && (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">No {filter.toLowerCase()} opportunities.</div>
          )}

          {shown.map((r) => {
            const inner = (
              <>
                <div className="font-medium truncate">{r.name}</div>
                <div><span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold ${CAT_TONE[r.category]}`}>{r.category.toUpperCase()}</span></div>
                <div className="text-right font-display font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{fmtMoney(r.amount)}</div>
                <div><span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold ${TONE[r.stageTone]}`}>{r.stageLabel.toUpperCase()}</span></div>
                <div className="text-muted-foreground text-sm truncate">{r.next}</div>
              </>
            );
            return r.href ? (
              <Link key={r.id} href={r.href} className={`${COLS} px-4 py-2.5 border-b last:border-0 text-sm hover:bg-muted/50 transition-colors`}>
                {inner}
              </Link>
            ) : (
              <div key={r.id} className={`${COLS} px-4 py-2.5 border-b last:border-0 text-sm`}>{inner}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
