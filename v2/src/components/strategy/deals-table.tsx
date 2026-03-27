'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface DealRow {
  title: string;
  deal_type: string;
  pipeline_stage: string;
  amount_cents: number;
  units: number;
  notes: string | null;
}

function deriveStatus(notes: string): { label: string; color: string; key: string } {
  const upper = (notes || '').toUpperCase();
  if (upper.includes('OVERDUE')) return { label: 'OVERDUE', color: 'bg-red-100 text-red-800', key: 'overdue' };
  if (upper.includes('PAID')) return { label: 'PAID', color: 'bg-green-100 text-green-800', key: 'paid' };
  if (upper.includes('AUTHORISED')) return { label: 'AWAITING', color: 'bg-amber-100 text-amber-800', key: 'awaiting' };
  if (upper.includes('DRAFT')) return { label: 'DRAFT', color: 'bg-gray-100 text-gray-800', key: 'draft' };
  return { label: 'WON', color: 'bg-blue-100 text-blue-800', key: 'won' };
}

function deriveStageStatus(deal: DealRow): { label: string; color: string; key: string } {
  const stageColors: Record<string, string> = {
    negotiation: 'bg-amber-100 text-amber-800',
    proposal: 'bg-blue-100 text-blue-800',
    qualified: 'bg-purple-100 text-purple-800',
    lead: 'bg-gray-100 text-gray-800',
  };
  return {
    label: deal.pipeline_stage.toUpperCase(),
    color: stageColors[deal.pipeline_stage] || 'bg-gray-100 text-gray-800',
    key: deal.pipeline_stage,
  };
}

const TYPE_COLORS: Record<string, string> = {
  sale: 'bg-green-100 text-green-800',
  procurement: 'bg-purple-100 text-purple-800',
  funding: 'bg-emerald-100 text-emerald-800',
  partnership: 'bg-blue-100 text-blue-800',
};

function formatCurrency(cents: number): string {
  if (cents === 0) return '$0';
  const val = cents / 100;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

type ViewMode = 'table' | 'cards';
type StatusFilter = 'all' | 'paid' | 'overdue' | 'awaiting' | 'draft' | 'won';
type TypeFilter = 'all' | 'sale' | 'funding' | 'procurement' | 'partnership';

export function DealsTable({
  wonDeals,
  activeDeals,
}: {
  wonDeals: DealRow[];
  activeDeals: DealRow[];
}) {
  const [view, setView] = useState<ViewMode>('table');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [section, setSection] = useState<'won' | 'pipeline' | 'all'>('all');

  // Combine and enrich deals
  const allDeals = useMemo(() => {
    const won = wonDeals.map(d => ({ ...d, isWon: true, status: deriveStatus(d.notes || '') }));
    const active = activeDeals.map(d => ({ ...d, isWon: false, status: deriveStageStatus(d) }));
    return [...won, ...active];
  }, [wonDeals, activeDeals]);

  // Filter
  const filtered = useMemo(() => {
    return allDeals.filter(d => {
      if (section === 'won' && !d.isWon) return false;
      if (section === 'pipeline' && d.isWon) return false;
      if (statusFilter !== 'all') {
        if (d.isWon && d.status.key !== statusFilter) return false;
      }
      if (typeFilter !== 'all' && d.deal_type !== typeFilter) return false;
      return true;
    });
  }, [allDeals, section, statusFilter, typeFilter]);

  // Totals
  const totalAmount = filtered.reduce((s, d) => s + d.amount_cents, 0);
  const totalUnits = filtered.reduce((s, d) => s + (d.units || 0), 0);
  const paidAmount = filtered.filter(d => d.isWon && d.status.key === 'paid').reduce((s, d) => s + d.amount_cents, 0);
  const overdueAmount = filtered.filter(d => d.isWon && d.status.key === 'overdue').reduce((s, d) => s + d.amount_cents, 0);

  // Status counts for filter chips
  const statusCounts = useMemo(() => {
    const base = allDeals.filter(d => {
      if (section === 'won' && !d.isWon) return false;
      if (section === 'pipeline' && d.isWon) return false;
      if (typeFilter !== 'all' && d.deal_type !== typeFilter) return false;
      return true;
    });
    const counts: Record<string, number> = { all: base.length };
    for (const d of base) {
      counts[d.status.key] = (counts[d.status.key] || 0) + 1;
    }
    return counts;
  }, [allDeals, section, typeFilter]);

  const typeCounts = useMemo(() => {
    const base = allDeals.filter(d => {
      if (section === 'won' && !d.isWon) return false;
      if (section === 'pipeline' && d.isWon) return false;
      return true;
    });
    const counts: Record<string, number> = { all: base.length };
    for (const d of base) {
      counts[d.deal_type] = (counts[d.deal_type] || 0) + 1;
    }
    return counts;
  }, [allDeals, section]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>All Deals</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} deals &middot; {formatCurrency(totalAmount)} total
              {totalUnits > 0 && ` \u00b7 ${totalUnits} units`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'table' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === 'cards' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mt-3">
          {([['all', 'All'], ['won', 'Won / Completed'], ['pipeline', 'Active Pipeline']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setSection(key); setStatusFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                section === key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-4 mt-3">
          {/* Status filters */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400 self-center mr-1">Status:</span>
            {(['all', 'paid', 'overdue', 'awaiting', 'draft', 'won'] as StatusFilter[])
              .filter(s => s === 'all' || (statusCounts[s] || 0) > 0)
              .map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    statusFilter === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  {statusCounts[s] ? ` (${statusCounts[s]})` : ''}
                </button>
              ))}
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400 self-center mr-1">Type:</span>
            {(['all', 'sale', 'funding', 'procurement', 'partnership'] as TypeFilter[])
              .filter(t => t === 'all' || (typeCounts[t] || 0) > 0)
              .map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    typeFilter === t
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  {typeCounts[t] ? ` (${typeCounts[t]})` : ''}
                </button>
              ))}
          </div>
        </div>

        {/* Summary bar */}
        {(paidAmount > 0 || overdueAmount > 0) && (
          <div className="flex gap-4 mt-3 text-xs">
            {paidAmount > 0 && (
              <span className="text-green-700 font-medium">Paid: {formatCurrency(paidAmount)}</span>
            )}
            {overdueAmount > 0 && (
              <span className="text-red-700 font-medium">Overdue: {formatCurrency(overdueAmount)}</span>
            )}
            {totalAmount - paidAmount - overdueAmount > 0 && (
              <span className="text-gray-500">Other: {formatCurrency(totalAmount - paidAmount - overdueAmount)}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No deals match these filters</p>
        ) : view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Deal</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium text-right">Amount</th>
                  <th className="pb-2 pr-4 font-medium text-right">Units</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium whitespace-nowrap">{d.title}</td>
                    <td className="py-2 pr-4">
                      <Badge className={TYPE_COLORS[d.deal_type] || 'bg-gray-100 text-gray-800'}>
                        {d.deal_type}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums font-medium whitespace-nowrap">
                      {formatCurrency(d.amount_cents)}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums">{d.units || '—'}</td>
                    <td className="py-2 pr-4">
                      <Badge className={d.status.color}>{d.status.label}</Badge>
                    </td>
                    <td className="py-2 text-xs text-gray-500 max-w-[300px] truncate">{d.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="py-2 pr-4 font-bold">Total ({filtered.length})</td>
                  <td className="py-2 pr-4"></td>
                  <td className="py-2 pr-4 text-right tabular-nums font-bold whitespace-nowrap">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums font-bold">{totalUnits || '—'}</td>
                  <td className="py-2 pr-4"></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((d, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  d.status.key === 'overdue' ? 'border-red-200 bg-red-50/50' :
                  d.status.key === 'paid' ? 'border-green-200 bg-green-50/30' :
                  d.status.key === 'awaiting' ? 'border-amber-200 bg-amber-50/30' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">{d.title}</h4>
                  <Badge className={d.status.color + ' shrink-0'}>{d.status.label}</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-lg font-bold tabular-nums">{formatCurrency(d.amount_cents)}</span>
                  {d.units > 0 && <span className="text-xs text-gray-500">{d.units} units</span>}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={TYPE_COLORS[d.deal_type] || 'bg-gray-100 text-gray-800'}>
                    {d.deal_type}
                  </Badge>
                </div>
                {d.notes && (
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">{d.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
