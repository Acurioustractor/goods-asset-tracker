'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Handshake,
  ShoppingCart,
  Package,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  type CrmOverview,
  type Deal,
  type Activity,
  type DealType,
  type PipelineStage,
  updateDealStage,
  createDeal,
  logActivity,
} from './actions';

// ── Constants ──

const DEAL_TYPE_CONFIG: Record<DealType, { label: string; icon: typeof DollarSign; color: string }> = {
  sale: { label: 'Sales', icon: ShoppingCart, color: 'emerald' },
  funding: { label: 'Funding & Grants', icon: DollarSign, color: 'blue' },
  partnership: { label: 'Partnerships', icon: Handshake, color: 'purple' },
  procurement: { label: 'Procurement', icon: Package, color: 'amber' },
};

const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  qualified: { label: 'Qualified', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  proposal: { label: 'Proposal', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  negotiation: { label: 'Negotiation', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  won: { label: 'Won', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  lost: { label: 'Lost', color: 'text-red-600', bgColor: 'bg-red-100' },
};

const STAGE_BAR_COLORS: Record<PipelineStage, string> = {
  lead: 'bg-gray-400',
  qualified: 'bg-blue-500',
  proposal: 'bg-amber-500',
  negotiation: 'bg-purple-500',
  won: 'bg-emerald-500',
  lost: 'bg-red-400',
};

const ACTIVITY_ICONS: Record<string, typeof Mail> = {
  email_sent: Mail,
  email_received: Mail,
  call: Phone,
  meeting: Calendar,
  linkedin_post: Globe,
  linkedin_message: Globe,
  sms: MessageSquare,
  note: MessageSquare,
};

function formatCurrency(cents: number): string {
  if (cents === 0) return '$0';
  return `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

// ── Main Component ──

interface Props {
  overview: CrmOverview;
}

export function CrmDashboard({ overview }: Props) {
  const [activeType, setActiveType] = useState<DealType | 'all'>('all');
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const router = useRouter();

  const filteredDeals = activeType === 'all'
    ? overview.deals
    : overview.deals.filter(d => d.deal_type === activeType);

  const activeDeals = filteredDeals.filter(d => d.pipeline_stage !== 'won' && d.pipeline_stage !== 'lost');
  const closedDeals = filteredDeals.filter(d => d.pipeline_stage === 'won' || d.pipeline_stage === 'lost');

  async function handleAdvanceStage(dealId: string, currentStage: PipelineStage) {
    const stageOrder: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won'];
    const idx = stageOrder.indexOf(currentStage);
    if (idx < stageOrder.length - 1) {
      await updateDealStage(dealId, stageOrder[idx + 1]);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Pipeline"
          value={formatCurrency(overview.totalPipeline)}
          sub={`${overview.totalActive} active deals`}
          icon={TrendingUp}
          color="text-blue-600"
        />
        <MetricCard
          label="Total Won"
          value={formatCurrency(overview.totalWon)}
          sub="All time"
          icon={CheckCircle}
          color="text-emerald-600"
        />
        <MetricCard
          label="Contacts"
          value={String(overview.contactCount)}
          sub="In CRM"
          icon={Users}
          color="text-purple-600"
        />
        <MetricCard
          label="Recent Activity"
          value={String(overview.recentActivities.length)}
          sub="Last 50 events"
          icon={Clock}
          color="text-amber-600"
        />
      </div>

      {/* Pipeline Type Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeType === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Pipelines ({overview.deals.length})
        </button>
        {(Object.keys(DEAL_TYPE_CONFIG) as DealType[]).map(dt => {
          const config = DEAL_TYPE_CONFIG[dt];
          const count = overview.deals.filter(d => d.deal_type === dt).length;
          const Icon = config.icon;
          return (
            <button
              key={dt}
              onClick={() => setActiveType(dt)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeType === dt
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {config.label} ({count})
            </button>
          );
        })}

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowLogActivity(!showLogActivity)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            <MessageSquare className="h-4 w-4" />
            Log Activity
          </button>
          <button
            onClick={() => setShowNewDeal(!showNewDeal)}
            className="flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            New Deal
          </button>
        </div>
      </div>

      {/* Quick Forms */}
      {showNewDeal && <NewDealForm onClose={() => setShowNewDeal(false)} onCreated={() => { setShowNewDeal(false); router.refresh(); }} />}
      {showLogActivity && <LogActivityForm onClose={() => setShowLogActivity(false)} onLogged={() => { setShowLogActivity(false); router.refresh(); }} />}

      {/* Pipeline Funnel (for active type) */}
      {activeType !== 'all' && (
        <PipelineFunnel
          summary={overview.pipelineSummary[activeType]}
          dealType={activeType}
        />
      )}

      {/* All-pipelines funnel overview */}
      {activeType === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(DEAL_TYPE_CONFIG) as DealType[]).map(dt => {
            const config = DEAL_TYPE_CONFIG[dt];
            const Icon = config.icon;
            const summary = overview.pipelineSummary[dt];
            const activeCount = Object.entries(summary)
              .filter(([stage]) => stage !== 'won' && stage !== 'lost')
              .reduce((sum, [, v]) => sum + v.count, 0);
            const activeValue = Object.entries(summary)
              .filter(([stage]) => stage !== 'won' && stage !== 'lost')
              .reduce((sum, [, v]) => sum + v.value, 0);
            const wonCount = summary.won?.count || 0;

            return (
              <button
                key={dt}
                onClick={() => setActiveType(dt)}
                className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-gray-900 text-sm">{config.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Active</span>
                    <span className="font-medium">{activeCount} deals</span>
                  </div>
                  {activeValue > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pipeline</span>
                      <span className="font-medium text-blue-600">{formatCurrency(activeValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Won</span>
                    <span className="font-medium text-emerald-600">{wonCount}</span>
                  </div>
                </div>
                {/* Mini stage bar */}
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 mt-3">
                  {(['lead', 'qualified', 'proposal', 'negotiation', 'won'] as PipelineStage[]).map(stage => {
                    const total = Object.values(summary).reduce((s, v) => s + v.count, 0);
                    const count = summary[stage]?.count || 0;
                    if (!count || !total) return null;
                    return (
                      <div
                        key={stage}
                        className={`${STAGE_BAR_COLORS[stage]}`}
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Deals */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Active Deals ({activeDeals.length})
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {activeDeals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No active deals in this pipeline.</p>
            </div>
          ) : (
            activeDeals.map(deal => (
              <DealRow
                key={deal.id}
                deal={deal}
                isExpanded={expandedDeal === deal.id}
                onToggle={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
                onAdvance={() => handleAdvanceStage(deal.id, deal.pipeline_stage)}
                onStageChange={async (stage) => { await updateDealStage(deal.id, stage); router.refresh(); }}
              />
            ))
          )}
        </div>
      </div>

      {/* Closed Deals */}
      {closedDeals.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Closed ({closedDeals.length})
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {closedDeals.map(deal => (
              <DealRow
                key={deal.id}
                deal={deal}
                isExpanded={expandedDeal === deal.id}
                onToggle={() => setExpandedDeal(expandedDeal === deal.id ? null : deal.id)}
                onAdvance={() => {}}
                onStageChange={async (stage) => { await updateDealStage(deal.id, stage); router.refresh(); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      {overview.recentActivities.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {overview.recentActivities.slice(0, 15).map(activity => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-Components ──

function MetricCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: typeof DollarSign; color: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <Icon className={`h-8 w-8 ${color} shrink-0`} />
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function PipelineFunnel({ summary, dealType }: {
  summary: Record<PipelineStage, { count: number; value: number }>;
  dealType: DealType;
}) {
  const stages: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const total = stages.reduce((s, stage) => s + (summary[stage]?.count || 0), 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        {DEAL_TYPE_CONFIG[dealType].label} Pipeline
      </h3>
      <div className="space-y-2">
        {stages.map(stage => {
          const data = summary[stage] || { count: 0, value: 0 };
          const pct = total > 0 ? (data.count / total) * 100 : 0;

          return (
            <div key={stage} className="flex items-center gap-3">
              <span className={`w-28 text-sm font-medium ${STAGE_CONFIG[stage].color}`}>
                {STAGE_CONFIG[stage].label}
              </span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${STAGE_BAR_COLORS[stage]} rounded-full transition-all flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(pct, data.count > 0 ? 5 : 0)}%` }}
                >
                  {data.count > 0 && <span className="text-xs font-bold text-white">{data.count}</span>}
                </div>
              </div>
              <span className="w-24 text-right text-sm text-gray-500">
                {data.value > 0 ? formatCurrency(data.value) : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DealRow({ deal, isExpanded, onToggle, onAdvance, onStageChange }: {
  deal: Deal;
  isExpanded: boolean;
  onToggle: () => void;
  onAdvance: () => void;
  onStageChange: (stage: PipelineStage) => void;
}) {
  const stageConfig = STAGE_CONFIG[deal.pipeline_stage] || STAGE_CONFIG.lead;
  const typeConfig = DEAL_TYPE_CONFIG[deal.deal_type as DealType] || DEAL_TYPE_CONFIG.sale;
  const TypeIcon = typeConfig.icon;

  return (
    <div>
      <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left transition-colors cursor-pointer">
        <span className="text-gray-400">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>

        <TypeIcon className="h-4 w-4 text-gray-400 shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{deal.title}</p>
          <p className="text-xs text-gray-500 truncate">
            {deal.contact_name || deal.contact_org || ''}
            {deal.source && ` · via ${deal.source}`}
          </p>
        </div>

        {deal.amount_cents > 0 && (
          <span className="text-sm font-bold text-gray-900 shrink-0">
            {formatCurrency(deal.amount_cents)}
          </span>
        )}

        {deal.probability > 0 && deal.pipeline_stage !== 'won' && (
          <span className="text-xs text-gray-400 shrink-0">{deal.probability}%</span>
        )}

        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${stageConfig.bgColor} ${stageConfig.color}`}>
          {stageConfig.label}
        </span>

        {deal.pipeline_stage !== 'won' && deal.pipeline_stage !== 'lost' && (
          <button
            onClick={e => { e.stopPropagation(); onAdvance(); }}
            className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors shrink-0"
            title="Advance stage"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-12 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Details</h4>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{typeConfig.label}</span></div>
                {deal.amount_cents > 0 && <div><span className="text-gray-500">Value:</span> <span className="font-medium">{formatCurrency(deal.amount_cents)}</span></div>}
                <div><span className="text-gray-500">Probability:</span> <span className="font-medium">{deal.probability}%</span></div>
                {deal.expected_close_date && <div><span className="text-gray-500">Expected:</span> <span className="font-medium">{deal.expected_close_date}</span></div>}
                {deal.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap pt-1">
                    {deal.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Notes</h4>
              <p className="text-sm text-gray-600">{deal.notes || 'No notes'}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Stage</h4>
              <select
                value={deal.pipeline_stage}
                onChange={e => onStageChange(e.target.value as PipelineStage)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {Object.entries(STAGE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const Icon = ACTIVITY_ICONS[activity.activity_type] || MessageSquare;
  const isInbound = activity.direction === 'inbound';

  return (
    <div className="flex items-center gap-3 p-3 text-sm">
      <Icon className={`h-4 w-4 shrink-0 ${isInbound ? 'text-emerald-500' : 'text-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 truncate">
          {activity.subject || activity.activity_type.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {activity.contact_name && `${activity.contact_name} · `}
          {activity.channel && `${activity.channel} · `}
          {new Date(activity.occurred_at).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      </div>
      <span className={`px-2 py-0.5 rounded text-xs ${isInbound ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
        {isInbound ? 'Inbound' : 'Outbound'}
      </span>
    </div>
  );
}

// ── Quick Forms ──

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
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">New Deal</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Deal title" value={title} onChange={e => setTitle(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <select value={dealType} onChange={e => setDealType(e.target.value as DealType)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          {(Object.keys(DEAL_TYPE_CONFIG) as DealType[]).map(dt => (
            <option key={dt} value={dt}>{DEAL_TYPE_CONFIG[dt].label}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <input type="text" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
      </div>
      <button onClick={handleSubmit} disabled={!title || saving} className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Creating...' : 'Create Deal'}
      </button>
    </div>
  );
}

function LogActivityForm({ onClose, onLogged }: { onClose: () => void; onLogged: () => void }) {
  const [activityType, setActivityType] = useState('email_sent');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState('email');
  const [direction, setDirection] = useState('outbound');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!subject) return;
    setSaving(true);
    await logActivity({ activity_type: activityType, subject, body: body || undefined, channel, direction });
    onLogged();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Log Activity</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={activityType} onChange={e => setActivityType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="email_sent">Email Sent</option>
          <option value="email_received">Email Received</option>
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="linkedin_post">LinkedIn Post</option>
          <option value="linkedin_message">LinkedIn Message</option>
          <option value="sms">SMS</option>
          <option value="note">Note</option>
        </select>
        <select value={channel} onChange={e => setChannel(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="linkedin">LinkedIn</option>
          <option value="sms">SMS</option>
          <option value="in_person">In Person</option>
          <option value="ghl">GHL</option>
        </select>
        <select value={direction} onChange={e => setDirection(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
        </select>
      </div>
      <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
      <textarea placeholder="Details (optional)" value={body} onChange={e => setBody(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
      <button onClick={handleSubmit} disabled={!subject || saving} className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Logging...' : 'Log Activity'}
      </button>
    </div>
  );
}
