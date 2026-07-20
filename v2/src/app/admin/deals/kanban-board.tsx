'use client';

import { useState, type DragEvent } from 'react';
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
  X,
  GripVertical,
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

const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string; borderColor: string; dropHighlight: string }> = {
  lead: { label: 'Lead', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border', dropHighlight: 'ring-muted-foreground/40 bg-muted' },
  qualified: { label: 'Qualified', color: 'text-accent-foreground', bgColor: 'bg-accent/10', borderColor: 'border-accent/40', dropHighlight: 'ring-accent bg-accent/20' },
  proposal: { label: 'Proposal', color: 'text-primary', bgColor: 'bg-primary/5', borderColor: 'border-primary/30', dropHighlight: 'ring-primary bg-primary/15' },
  negotiation: { label: 'Negotiation', color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/50', dropHighlight: 'ring-primary bg-primary/20' },
  won: { label: 'Won', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300', dropHighlight: 'ring-emerald-400 bg-emerald-100' },
  lost: { label: 'Lost', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300', dropHighlight: 'ring-red-400 bg-red-100' },
};

const TYPE_CONFIG: Record<DealType, { label: string; icon: typeof DollarSign; color: string }> = {
  sale: { label: 'Sale', icon: ShoppingCart, color: 'text-emerald-600' },
  funding: { label: 'Funding', icon: DollarSign, color: 'text-primary' },
  partnership: { label: 'Partnership', icon: Handshake, color: 'text-accent-foreground' },
  procurement: { label: 'Procurement', icon: Package, color: 'text-primary' },
};

const ACTIVE_STAGES: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];

function formatCurrency(cents: number): string {
  if (cents === 0) return '$0';
  return `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

// ── Main Component ──

export function KanbanBoard({ overview }: { overview: PipelineOverview }) {
  const [typeFilter, setTypeFilter] = useState<DealType | 'all'>('all');
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showWonLost, setShowWonLost] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
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

  // Drag handlers
  function handleDragStart(e: DragEvent, deal: KanbanDeal) {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(deal.id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverStage(null);
  }

  function handleDragOver(e: DragEvent, stage: PipelineStage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  async function handleDrop(e: DragEvent, stage: PipelineStage) {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    setDragOverStage(null);
    setDraggingId(null);
    if (dealId) {
      await handleMoveDeal(dealId, stage);
    }
  }

  // Compute totals across all active columns
  const activeTotalValue = ACTIVE_STAGES.reduce((sum, stage) =>
    sum + filteredColumns[stage].reduce((s, d) => s + d.amount_cents, 0), 0
  );
  const activeTotalDeals = ACTIVE_STAGES.reduce((sum, stage) =>
    sum + filteredColumns[stage].length, 0
  );
  const wonTotalValue = filteredColumns.won.reduce((s, d) => s + d.amount_cents, 0);

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active Pipeline" value={formatCurrency(activeTotalValue)} sub={`${activeTotalDeals} deals`} icon={TrendingUp} color="text-blue-600" />
        <StatCard label="Total Won" value={formatCurrency(wonTotalValue)} sub={`${filteredColumns.won.length} deals`} icon={CheckCircle} color="text-emerald-600" />
        <StatCard label="Needs Action" value={String(overview.stats.needsAction)} sub="Stale >7 days" icon={AlertTriangle} color="text-amber-600" />
        <StatCard label="In Pipeline" value={String(activeTotalDeals)} sub="Active deals" icon={Clock} color="text-muted-foreground" />
      </div>

      {/* Filters + Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
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
                typeFilter === dt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label} ({data.count})
            </button>
          );
        })}
        <button
          onClick={() => setShowNewDeal(!showNewDeal)}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
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
          const colWeighted = deals.reduce((s, d) => s + Math.round(d.amount_cents * d.probability / 100), 0);
          const nextStage = ACTIVE_STAGES[ACTIVE_STAGES.indexOf(stage) + 1] || 'won';
          const isDragOver = dragOverStage === stage;

          return (
            <div
              key={stage}
              className={`rounded-xl border-2 ${cfg.borderColor} ${cfg.bgColor} flex flex-col transition-all ${
                isDragOver ? `ring-2 ${cfg.dropHighlight}` : ''
              }`}
              onDragOver={e => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="px-3 py-2.5 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs font-medium text-muted-foreground">{deals.length}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-foreground">{formatCurrency(colValue)}</span>
                  {colWeighted > 0 && colWeighted !== colValue && (
                    <span className="text-[10px] text-muted-foreground">({formatCurrency(colWeighted)} weighted)</span>
                  )}
                </div>
              </div>

              {/* Cards */}
              <div className={`p-2 space-y-2 flex-1 min-h-[120px] max-h-[500px] overflow-y-auto ${
                isDragOver ? 'bg-opacity-80' : ''
              }`}>
                {deals.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    {isDragOver ? 'Drop here' : 'No deals'}
                  </p>
                ) : (
                  deals.map(deal => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      isDragging={draggingId === deal.id}
                      onDragStart={e => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
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

      {/* Pipeline Totals Bar */}
      <div className="bg-card rounded-xl border border-border p-3">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-semibold text-foreground">Pipeline Totals:</span>
          {ACTIVE_STAGES.map(stage => {
            const deals = filteredColumns[stage];
            const value = deals.reduce((s, d) => s + d.amount_cents, 0);
            const cfg = STAGE_CONFIG[stage];
            return (
              <div key={stage} className="flex items-center gap-1.5">
                <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-foreground font-semibold">{formatCurrency(value)}</span>
                <span className="text-[10px] text-muted-foreground">({deals.length})</span>
              </div>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5 border-l pl-4 border-border">
            <span className="text-xs font-medium text-muted-foreground">Total</span>
            <span className="text-sm text-foreground font-bold">{formatCurrency(activeTotalValue)}</span>
          </div>
        </div>
      </div>

      {/* Won/Lost Toggle */}
      <button
        onClick={() => setShowWonLost(!showWonLost)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        {showWonLost ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        Closed ({filteredColumns.won.length} won · {formatCurrency(wonTotalValue)}, {filteredColumns.lost.length} lost)
      </button>

      {showWonLost && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['won', 'lost'] as PipelineStage[]).map(stage => {
            const cfg = STAGE_CONFIG[stage];
            const deals = filteredColumns[stage];
            const totalValue = deals.reduce((s, d) => s + d.amount_cents, 0);
            return (
              <div
                key={stage}
                className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} ${
                  dragOverStage === stage ? `ring-2 ${cfg.dropHighlight}` : ''
                }`}
                onDragOver={e => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage)}
              >
                <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label} ({deals.length})</span>
                  <span className={`text-xs font-semibold ${cfg.color}`}>{formatCurrency(totalValue)}</span>
                </div>
                <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                  {deals.map(deal => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      isDragging={draggingId === deal.id}
                      onDragStart={e => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      onAdvance={() => {}}
                      onMove={(s) => handleMoveDeal(deal.id, s)}
                    />
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
    <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
      <Icon className={`h-7 w-7 ${color} shrink-0`} />
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function DealCard({ deal, isDragging, onDragStart, onDragEnd, onAdvance, onMove }: {
  deal: KanbanDeal;
  isDragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onAdvance: () => void;
  onMove: (stage: PipelineStage) => void;
}) {
  const [showStages, setShowStages] = useState(false);
  const typeCfg = TYPE_CONFIG[deal.deal_type] || TYPE_CONFIG.sale;
  const TypeIcon = typeCfg.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-card rounded-lg border shadow-sm p-3 space-y-2 cursor-grab active:cursor-grabbing transition-opacity ${
        deal.needs_action ? 'border-amber-300 ring-1 ring-amber-100' : 'border-border'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      {/* Title + Type + Drag handle */}
      <div className="flex items-start gap-1.5">
        <GripVertical className="h-4 w-4 text-muted-foreground/60 mt-0.5 shrink-0" />
        <TypeIcon className={`h-4 w-4 mt-0.5 shrink-0 ${typeCfg.color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight truncate">{deal.title}</p>
          {(deal.contact_name || deal.contact_org) && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {deal.contact_name}{deal.contact_org ? ` · ${deal.contact_org}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Amount + Meta */}
      <div className="flex items-center gap-2 flex-wrap">
        {deal.amount_cents > 0 && (
          <span className="text-sm font-bold text-foreground">{formatCurrency(deal.amount_cents)}</span>
        )}
        {deal.probability > 0 && deal.pipeline_stage !== 'won' && (
          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
        )}
        {deal.needs_action && (
          <span className="text-xs text-amber-600 flex items-center gap-0.5">
            <AlertTriangle className="h-3 w-3" /> {deal.days_since_update}d stale
          </span>
        )}
        {deal.source && (
          <span className="text-[10px] text-muted-foreground">{deal.source}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-border">
        {deal.pipeline_stage !== 'won' && deal.pipeline_stage !== 'lost' && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
          >
            <ArrowRight className="h-3 w-3" /> Advance
          </button>
        )}
        <button
          onClick={() => setShowStages(!showStages)}
          className="text-xs text-muted-foreground hover:text-muted-foreground px-1.5 py-0.5 rounded hover:bg-muted ml-auto"
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
                stage === deal.pipeline_stage ? 'ring-2 ring-offset-1 ring-border' : ''
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
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold font-display text-foreground">New Deal</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Deal title" value={title} onChange={e => setTitle(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm" />
        <select value={dealType} onChange={e => setDealType(e.target.value as DealType)} className="border border-border rounded-lg px-3 py-2 text-sm">
          {(Object.keys(TYPE_CONFIG) as DealType[]).map(dt => (
            <option key={dt} value={dt}>{TYPE_CONFIG[dt].label}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm" />
        <input type="text" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm" />
      </div>
      <button onClick={handleSubmit} disabled={!title || saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50">
        {saving ? 'Creating...' : 'Create Deal'}
      </button>
    </div>
  );
}
