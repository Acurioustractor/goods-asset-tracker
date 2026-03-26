'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Handshake,
  ShoppingCart,
  Package,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Mail,
  Calendar,
  X,
} from 'lucide-react';
import {
  type PipelineOverview,
  type KanbanDeal,
  type PipelineStage,
  type DealType,
  moveDeal,
  createDeal,
} from './actions';

// ── Config ──

const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  lead: { label: 'Lead', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-300' },
  qualified: { label: 'Qualified', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
  proposal: { label: 'Proposal', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
  negotiation: { label: 'Negotiation', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300' },
  won: { label: 'Won', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300' },
  lost: { label: 'Lost', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300' },
};

const TYPE_CONFIG: Record<DealType, { label: string; icon: typeof DollarSign; color: string }> = {
  sale: { label: 'Sale', icon: ShoppingCart, color: 'text-emerald-600' },
  funding: { label: 'Funding', icon: DollarSign, color: 'text-blue-600' },
  partnership: { label: 'Partnership', icon: Handshake, color: 'text-purple-600' },
  procurement: { label: 'Procurement', icon: Package, color: 'text-amber-600' },
};

const ACTIVE_STAGES: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];

function formatCurrency(cents: number): string {
  if (cents === 0) return '';
  return `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

// ── Main Component ──

export function KanbanBoard({ overview }: { overview: PipelineOverview }) {
  const [typeFilter, setTypeFilter] = useState<DealType | 'all'>('all');
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showWonLost, setShowWonLost] = useState(false);
  const router = useRouter();

  const filteredColumns = {} as Record<PipelineStage, KanbanDeal[]>;
  for (const stage of [...ACTIVE_STAGES, 'won', 'lost'] as PipelineStage[]) {
    filteredColumns[stage] = (overview.columns[stage] || []).filter(d =>
      typeFilter === 'all' || d.deal_type === typeFilter
    );
  }

  async function handleMoveDeal(dealId: string, newStage: PipelineStage) {
    await moveDeal(dealId, newStage);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active Pipeline" value={formatCurrency(overview.stats.totalPipeline) || '$0'} sub={`${overview.stats.activeDeals} deals`} icon={TrendingUp} color="text-blue-600" />
        <StatCard label="Total Won" value={formatCurrency(overview.stats.totalWon) || '$0'} sub="All time" icon={CheckCircle} color="text-emerald-600" />
        <StatCard label="Needs Action" value={String(overview.stats.needsAction)} sub="Stale >7 days" icon={AlertTriangle} color="text-amber-600" />
        <StatCard label="In Pipeline" value={String(overview.stats.activeDeals)} sub="Active deals" icon={Clock} color="text-gray-600" />
      </div>

      {/* Filters + Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({overview.deals.length})
        </button>
        {(Object.keys(TYPE_CONFIG) as DealType[]).map(dt => {
          const cfg = TYPE_CONFIG[dt];
          const Icon = cfg.icon;
          const data = overview.stats.byType[dt];
          return (
            <button
              key={dt}
              onClick={() => setTypeFilter(dt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === dt ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label} ({data.count})
            </button>
          );
        })}
        <button
          onClick={() => setShowNewDeal(!showNewDeal)}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
        >
          <Plus className="h-3.5 w-3.5" /> New Deal
        </button>
      </div>

      {showNewDeal && <NewDealForm onClose={() => setShowNewDeal(false)} onCreated={() => { setShowNewDeal(false); router.refresh(); }} />}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIVE_STAGES.map(stage => {
          const cfg = STAGE_CONFIG[stage];
          const deals = filteredColumns[stage];
          const colValue = deals.reduce((s, d) => s + d.amount_cents, 0);
          const nextStage = ACTIVE_STAGES[ACTIVE_STAGES.indexOf(stage) + 1] || 'won';

          return (
            <div key={stage} className={`rounded-xl border-2 ${cfg.borderColor} ${cfg.bgColor} flex flex-col`}>
              {/* Column Header */}
              <div className="px-3 py-2.5 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs font-medium text-gray-400">{deals.length}</span>
                </div>
                {colValue > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(colValue)}</p>
                )}
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 flex-1 min-h-[120px] max-h-[500px] overflow-y-auto">
                {deals.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No deals</p>
                ) : (
                  deals.map(deal => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onAdvance={() => handleMoveDeal(deal.id, nextStage as PipelineStage)}
                      onMove={(s) => handleMoveDeal(deal.id, s)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Won/Lost Toggle */}
      <button
        onClick={() => setShowWonLost(!showWonLost)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        {showWonLost ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        Closed ({filteredColumns.won.length} won, {filteredColumns.lost.length} lost)
      </button>

      {showWonLost && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['won', 'lost'] as PipelineStage[]).map(stage => {
            const cfg = STAGE_CONFIG[stage];
            const deals = filteredColumns[stage];
            return (
              <div key={stage} className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor}`}>
                <div className="px-3 py-2 border-b border-gray-200/50">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label} ({deals.length})</span>
                </div>
                <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                  {deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} onAdvance={() => {}} onMove={(s) => handleMoveDeal(deal.id, s)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sub-Components ──

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: typeof DollarSign; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
      <Icon className={`h-7 w-7 ${color} shrink-0`} />
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function DealCard({ deal, onAdvance, onMove }: {
  deal: KanbanDeal;
  onAdvance: () => void;
  onMove: (stage: PipelineStage) => void;
}) {
  const [showStages, setShowStages] = useState(false);
  const typeCfg = TYPE_CONFIG[deal.deal_type] || TYPE_CONFIG.sale;
  const TypeIcon = typeCfg.icon;

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-3 space-y-2 ${
      deal.needs_action ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'
    }`}>
      {/* Title + Type */}
      <div className="flex items-start gap-2">
        <TypeIcon className={`h-4 w-4 mt-0.5 shrink-0 ${typeCfg.color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-tight truncate">{deal.title}</p>
          {(deal.contact_name || deal.contact_org) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {deal.contact_name}{deal.contact_org ? ` · ${deal.contact_org}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Amount + Meta */}
      <div className="flex items-center gap-2 flex-wrap">
        {deal.amount_cents > 0 && (
          <span className="text-sm font-bold text-gray-900">{formatCurrency(deal.amount_cents)}</span>
        )}
        {deal.probability > 0 && deal.pipeline_stage !== 'won' && (
          <span className="text-xs text-gray-400">{deal.probability}%</span>
        )}
        {deal.needs_action && (
          <span className="text-xs text-amber-600 flex items-center gap-0.5">
            <AlertTriangle className="h-3 w-3" /> {deal.days_since_update}d stale
          </span>
        )}
        {deal.source && (
          <span className="text-[10px] text-gray-400">{deal.source}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
        {deal.pipeline_stage !== 'won' && deal.pipeline_stage !== 'lost' && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-orange-600 px-1.5 py-0.5 rounded hover:bg-orange-50 transition-colors"
          >
            <ArrowRight className="h-3 w-3" /> Advance
          </button>
        )}
        <button
          onClick={() => setShowStages(!showStages)}
          className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100 ml-auto"
        >
          Move...
        </button>
      </div>

      {/* Stage picker */}
      {showStages && (
        <div className="flex flex-wrap gap-1 pt-1">
          {Object.entries(STAGE_CONFIG).map(([stage, cfg]) => (
            <button
              key={stage}
              onClick={() => { onMove(stage as PipelineStage); setShowStages(false); }}
              className={`text-xs px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color} hover:opacity-80 transition-opacity ${
                stage === deal.pipeline_stage ? 'ring-2 ring-offset-1 ring-gray-400' : ''
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NewDealForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [dealType, setDealType] = useState<DealType>('sale');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title) return;
    setSaving(true);
    await createDeal({
      title,
      deal_type: dealType,
      amount_cents: amount ? Math.round(parseFloat(amount) * 100) : 0,
      notes: notes || undefined,
    });
    onCreated();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">New Deal</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Deal title" value={title} onChange={e => setTitle(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={dealType} onChange={e => setDealType(e.target.value as DealType)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {(Object.keys(TYPE_CONFIG) as DealType[]).map(dt => (
            <option key={dt} value={dt}>{TYPE_CONFIG[dt].label}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input type="text" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>
      <button onClick={handleSubmit} disabled={!title || saving} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Creating...' : 'Create Deal'}
      </button>
    </div>
  );
}
