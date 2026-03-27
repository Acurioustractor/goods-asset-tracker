'use client';

import { useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Mail,
  Phone,
  Star,
  Flame,
  Target,
  ThermometerSun,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Handshake,
  Landmark,
  Heart,
  Newspaper,
  GraduationCap,
  ShoppingCart,
  Linkedin,
  Calendar,
  ArrowUpDown,
  Filter,
  Kanban,
  List,
  ArrowRight,
  GripVertical,
  Plus,
  X,
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  CheckCircle,
  Package,
} from 'lucide-react';
import type {
  NetworkOverview,
  NetworkContact,
  ContactTier,
  ContactType,
  ContactDeal,
  ActionItem,
  DealType,
  PipelineStage,
} from './actions';
import { moveDeal, createDeal } from './actions';

// ── Config ──

const TIER_CONFIG: Record<ContactTier, { label: string; color: string; icon: typeof Flame }> = {
  champion: { label: 'Champion', color: 'bg-orange-100 text-orange-800', icon: Star },
  hot: { label: 'Hot', color: 'bg-red-100 text-red-800', icon: Flame },
  strategic: { label: 'Strategic', color: 'bg-amber-100 text-amber-800', icon: Target },
  warm: { label: 'Warm', color: 'bg-blue-100 text-blue-800', icon: ThermometerSun },
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: Users },
  cold: { label: 'Cold', color: 'bg-gray-100 text-gray-600', icon: Users },
};

const TYPE_CONFIG: Record<ContactType, { label: string; icon: typeof Users; color: string }> = {
  funder: { label: 'Funder', icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
  partner: { label: 'Partner', icon: Handshake, color: 'bg-emerald-100 text-emerald-700' },
  government: { label: 'Government', icon: Landmark, color: 'bg-indigo-100 text-indigo-700' },
  community: { label: 'Community', icon: Heart, color: 'bg-orange-100 text-orange-700' },
  media: { label: 'Media', icon: Newspaper, color: 'bg-pink-100 text-pink-700' },
  academic: { label: 'Academic', icon: GraduationCap, color: 'bg-cyan-100 text-cyan-700' },
  customer: { label: 'Customer', icon: ShoppingCart, color: 'bg-teal-100 text-teal-700' },
  supporter: { label: 'Supporter', icon: Users, color: 'bg-gray-100 text-gray-600' },
};

const DEAL_TYPE_CONFIG: Record<DealType, { label: string; icon: typeof DollarSign; color: string }> = {
  sale: { label: 'Sale', icon: ShoppingCart, color: 'text-emerald-600' },
  funding: { label: 'Funding', icon: DollarSign, color: 'text-blue-600' },
  partnership: { label: 'Partnership', icon: Handshake, color: 'text-purple-600' },
  procurement: { label: 'Procurement', icon: Package, color: 'text-amber-600' },
};

const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; bgColor: string; borderColor: string; dropHighlight: string }> = {
  lead: { label: 'Lead', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', dropHighlight: 'ring-gray-400 bg-gray-100' },
  qualified: { label: 'Qualified', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', dropHighlight: 'ring-blue-400 bg-blue-100' },
  proposal: { label: 'Proposal', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', dropHighlight: 'ring-amber-400 bg-amber-100' },
  negotiation: { label: 'Negotiation', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', dropHighlight: 'ring-purple-400 bg-purple-100' },
  won: { label: 'Won', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300', dropHighlight: 'ring-emerald-400 bg-emerald-100' },
  lost: { label: 'Lost', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300', dropHighlight: 'ring-red-400 bg-red-100' },
};

const ACTIVE_STAGES: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];

const POST_LABELS: Record<string, string> = {
  'stretch-bed': 'Stretch Bed', 'washing-machine': 'Washing Machine',
  'goods-bed-v3': 'Bed v3 Testing', 'goods-bed-imagine': 'Bed Imagine',
  'nic-tribute': 'Nic Tribute', 'palm-island': 'Palm Island',
  'tennant-creek': 'Tennant Creek', 'alice-springs': 'Alice Springs',
  'contained-tour': 'CONTAINED Tour', 'contained-cta': 'CONTAINED CTA',
  'contained-diagrama': 'Diagrama', 'contained-little-friend': 'CONTAINED',
  'things-connected': 'Things Connected', 'urapuntja': 'Urapuntja',
  'oonchiumpa': 'Oonchiumpa', 'norman-frank': 'Norman Frank',
};

type ViewMode = 'contacts' | 'pipeline';
type FilterTab = 'all' | ContactTier | 'needs-followup' | 'has-email' | 'has-deals';
type SortField = 'score' | 'name' | 'lastContact' | 'daysSince' | 'dealValue';

function formatCurrency(cents: number): string {
  if (cents === 0) return '$0';
  return `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

// ── Main Component ──

export function NetworkDashboard({ overview }: { overview: NetworkOverview }) {
  const [viewMode, setViewMode] = useState<ViewMode>('contacts');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [typeFilter, setTypeFilter] = useState<ContactType | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [showBrief, setShowBrief] = useState(true);

  const { contacts, actions, stats } = overview;

  // Filter contacts
  const filtered = contacts.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) &&
          !c.organization.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !c.type.includes(q)) {
        return false;
      }
    }
    if (activeFilter !== 'all') {
      if (activeFilter === 'needs-followup' && !c.needsFollowUp) return false;
      if (activeFilter === 'has-email' && !c.email) return false;
      if (activeFilter === 'has-deals' && c.deals.length === 0) return false;
      if (['champion', 'hot', 'strategic', 'warm', 'active', 'cold'].includes(activeFilter) && c.tier !== activeFilter) return false;
    }
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (sourceFilter !== 'all' && !c.sources.includes(sourceFilter)) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'score': cmp = a.score - b.score; break;
      case 'name': cmp = a.name.localeCompare(b.name); break;
      case 'lastContact': cmp = (a.lastContactDate || '').localeCompare(b.lastContactDate || ''); break;
      case 'daysSince': cmp = (a.daysSinceContact ?? 999) - (b.daysSinceContact ?? 999); break;
      case 'dealValue': cmp = a.totalDealValue - b.totalDealValue; break;
    }
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  }

  return (
    <div className="space-y-5">
      {/* Morning Brief */}
      {actions.length > 0 && (
        <MorningBrief
          actions={actions}
          show={showBrief}
          onToggle={() => setShowBrief(!showBrief)}
        />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <KPICard label="Contacts" value={String(stats.total)} icon={Users} />
        <KPICard label="Champions" value={String(stats.champions)} icon={Star} highlight />
        <KPICard label="Active Pipeline" value={formatCurrency(stats.pipelineValue)} icon={TrendingUp} />
        <KPICard label="Won" value={formatCurrency(stats.pipelineWon)} icon={CheckCircle} />
        <KPICard label="Active Deals" value={String(stats.activeDeals)} icon={Kanban} />
        <KPICard label="Need Follow-up" value={String(stats.needsFollowUp)} icon={AlertTriangle} warn />
      </div>

      {/* View Toggle + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* View Mode */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode('contacts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'contacts' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="h-3.5 w-3.5" /> People
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'pipeline' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" /> Pipeline
          </button>
        </div>

        {/* Tier Tabs (contacts mode only) */}
        {viewMode === 'contacts' && (
          <div className="flex flex-wrap gap-1.5">
            {([
              { id: 'all' as FilterTab, label: 'All', count: stats.total },
              { id: 'champion' as FilterTab, label: 'Champions', count: stats.champions },
              { id: 'hot' as FilterTab, label: 'Hot', count: stats.hot },
              { id: 'strategic' as FilterTab, label: 'Strategic', count: stats.strategic },
              { id: 'needs-followup' as FilterTab, label: 'Follow-up', count: stats.needsFollowUp },
              { id: 'has-deals' as FilterTab, label: 'Has Deals', count: contacts.filter(c => c.deals.length > 0).length },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === tab.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label} <span className="text-gray-400">{tab.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search + Type/Source Filters (contacts mode) */}
      {viewMode === 'contacts' && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, org, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as ContactType | 'all')}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Types</option>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label} ({stats.byType[key as ContactType] || 0})</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Sources</option>
              <option value="linkedin">LinkedIn</option>
              <option value="gmail">Gmail</option>
              <option value="crm">CRM</option>
            </select>
          </div>
        </div>
      )}

      {/* Contact List View */}
      {viewMode === 'contacts' && (
        <ContactList
          contacts={sorted}
          total={stats.total}
          expandedId={expandedId}
          onToggle={id => setExpandedId(expandedId === id ? null : id)}
          sortField={sortField}
          toggleSort={toggleSort}
        />
      )}

      {/* Pipeline Kanban View */}
      {viewMode === 'pipeline' && (
        <PipelineKanban
          dealColumns={overview.dealColumns}
          deals={overview.deals}
          contacts={contacts}
        />
      )}
    </div>
  );
}

// ── Morning Brief ──

function MorningBrief({ actions, show, onToggle }: {
  actions: ActionItem[]; show: boolean; onToggle: () => void;
}) {
  const topActions = actions.slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 text-white">
      <button onClick={onToggle} className="flex items-center gap-2 w-full text-left">
        <Zap className="h-5 w-5 text-orange-400" />
        <h2 className="font-semibold text-lg">Today&apos;s Actions</h2>
        <span className="text-sm text-slate-400 ml-1">({actions.length} items)</span>
        {show ? <ChevronUp className="h-4 w-4 ml-auto text-slate-400" /> : <ChevronDown className="h-4 w-4 ml-auto text-slate-400" />}
      </button>

      {show && (
        <div className="mt-4 space-y-2">
          {topActions.map((action, i) => (
            <ActionCard key={i} action={action} />
          ))}
          {actions.length > 5 && (
            <p className="text-xs text-slate-500 pt-1">+{actions.length - 5} more actions</p>
          )}
        </div>
      )}
    </div>
  );
}

function ActionCard({ action }: { action: ActionItem }) {
  const priorityColor = action.priority >= 8 ? 'border-red-500/50 bg-red-500/10' :
    action.priority >= 6 ? 'border-orange-500/50 bg-orange-500/10' :
    'border-slate-600 bg-slate-800/50';

  const typeIcon = {
    'follow-up': Clock,
    'stale-deal': AlertTriangle,
    'new-engagement': MessageSquare,
    'no-email': Mail,
    'high-value': Star,
  }[action.type];
  const Icon = typeIcon;

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${priorityColor}`}>
      <Icon className="h-4 w-4 mt-0.5 text-slate-300 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{action.headline}</p>
        <p className="text-xs text-slate-400 mt-0.5">{action.detail}</p>
      </div>
      <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded shrink-0">
        {action.action}
      </span>
    </div>
  );
}

// ── KPI Card ──

function KPICard({ label, value, icon: Icon, highlight, warn }: {
  label: string; value: string; icon: typeof Users; highlight?: boolean; warn?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-3 ${
      highlight ? 'bg-orange-50 border-orange-200' : warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${highlight ? 'text-orange-600' : warn ? 'text-amber-600' : 'text-gray-400'}`} />
        <span className="text-xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ── Contact List ──

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ContactList({ contacts, total, expandedId, onToggle, sortField, toggleSort }: {
  contacts: NetworkContact[];
  total: number;
  expandedId: string | null;
  onToggle: (id: string) => void;
  sortField: SortField;
  toggleSort: (field: SortField) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_90px_90px_80px_60px] gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-left">
          Contact <ArrowUpDown className="h-3 w-3" />
        </button>
        <span>Type</span>
        <button onClick={() => toggleSort('daysSince')} className="flex items-center gap-1">
          Last <ArrowUpDown className="h-3 w-3" />
        </button>
        <button onClick={() => toggleSort('score')} className="flex items-center gap-1">
          Score <ArrowUpDown className="h-3 w-3" />
        </button>
        <button onClick={() => toggleSort('dealValue')} className="flex items-center gap-1">
          Deals <ArrowUpDown className="h-3 w-3" />
        </button>
        <span>Src</span>
      </div>

      <div className="max-h-[700px] overflow-y-auto divide-y divide-gray-100">
        {contacts.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No contacts match your filters</div>
        ) : (
          contacts.map(contact => (
            <ContactRow
              key={contact.id}
              contact={contact}
              expanded={expandedId === contact.id}
              onToggle={() => onToggle(contact.id)}
            />
          ))
        )}
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
        Showing {contacts.length} of {total} contacts
      </div>
    </div>
  );
}

function ContactRow({ contact, expanded, onToggle }: {
  contact: NetworkContact; expanded: boolean; onToggle: () => void;
}) {
  const tierCfg = TIER_CONFIG[contact.tier];
  const typeCfg = TYPE_CONFIG[contact.type];
  const TierIcon = tierCfg.icon;
  const isKeyPartner = contact.tier === 'champion';

  return (
    <div className={isKeyPartner ? 'bg-orange-50/30' : ''}>
      <div
        className="grid grid-cols-[1fr_100px_90px_90px_80px_60px] gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors items-center"
        onClick={onToggle}
      >
        {/* Name + Org */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={`rounded-full p-1 ${tierCfg.color} shrink-0`}>
            <TierIcon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900 text-sm truncate">{contact.name}</span>
              {isKeyPartner && <Star className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />}
              {contact.needsFollowUp && <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />}
            </div>
            {contact.organization && (
              <p className="text-xs text-gray-500 truncate">{contact.organization}</p>
            )}
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-300 shrink-0 ml-auto" /> : <ChevronDown className="h-4 w-4 text-gray-300 shrink-0 ml-auto" />}
        </div>

        {/* Type */}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${typeCfg.color}`}>
          {typeCfg.label}
        </span>

        {/* Last Contact */}
        <div className="text-xs">
          {contact.daysSinceContact !== null ? (
            <span className={contact.needsFollowUp ? 'text-amber-600 font-medium' : 'text-gray-500'}>
              {contact.daysSinceContact === 0 ? 'Today' : `${contact.daysSinceContact}d ago`}
            </span>
          ) : (
            <span className="text-gray-300">&mdash;</span>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                contact.score >= 10 ? 'bg-orange-500' :
                contact.score >= 7 ? 'bg-red-400' :
                contact.score >= 4 ? 'bg-amber-400' :
                'bg-blue-300'
              }`}
              style={{ width: `${Math.min(100, (contact.score / 15) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{contact.score}</span>
        </div>

        {/* Deals */}
        <div className="text-xs">
          {contact.dealCount > 0 ? (
            <span className="font-medium text-gray-700">
              {contact.dealCount} <span className="text-gray-400">({formatCurrency(contact.totalDealValue)})</span>
            </span>
          ) : (
            <span className="text-gray-300">&mdash;</span>
          )}
        </div>

        {/* Sources */}
        <div className="flex items-center gap-1">
          {contact.sources.includes('linkedin') && <Linkedin className="h-3 w-3 text-blue-600" />}
          {contact.sources.includes('gmail') && <Mail className="h-3 w-3 text-red-500" />}
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 pl-12 space-y-4 bg-gray-50/50 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3">
            {/* Contact Info + Actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Contact</h4>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {contact.email}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5" /> {contact.phone}
                </a>
              )}
              {contact.gmailEmailCount && (
                <p className="text-xs text-gray-500">
                  {contact.gmailEmailCount} emails exchanged
                  {contact.gmailLastSubject && <span className="text-gray-400"> &middot; Last: {contact.gmailLastSubject}</span>}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <a
                  href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(contact.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 px-2 py-1 bg-blue-50 rounded"
                >
                  <Linkedin className="h-3 w-3" /> LinkedIn
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-xs text-green-600 hover:underline flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                    <Mail className="h-3 w-3" /> Email
                  </a>
                )}
              </div>
            </div>

            {/* Deals Inline */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Deals</h4>
              {contact.deals.length > 0 ? (
                contact.deals.map(deal => {
                  const dtCfg = DEAL_TYPE_CONFIG[deal.deal_type] || DEAL_TYPE_CONFIG.sale;
                  const sCfg = STAGE_CONFIG[deal.pipeline_stage];
                  return (
                    <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${dtCfg.color}`}>{dtCfg.label}</span>
                        <span className="text-sm font-medium text-gray-900 truncate">{deal.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {deal.units > 0 && <span className="font-bold text-orange-700">{deal.units} beds</span>}
                        {deal.amount_cents > 0 && <span className="font-bold text-gray-800">{formatCurrency(deal.amount_cents)}</span>}
                        <span className={`px-1.5 py-0.5 rounded ${sCfg.bgColor} ${sCfg.color} text-[10px] font-medium`}>
                          {sCfg.label}
                        </span>
                        {deal.needs_action && (
                          <span className="text-amber-600 flex items-center gap-0.5">
                            <AlertTriangle className="h-3 w-3" /> {deal.days_since_update}d
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400">No deals</p>
              )}
            </div>

            {/* Engagement + Activity */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Engagement</h4>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{contact.score}</span> pts
                {contact.followUpDueIn !== null && (
                  <span className={`ml-2 text-xs ${contact.followUpDueIn < 0 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                    {contact.followUpDueIn < 0
                      ? `${Math.abs(contact.followUpDueIn)}d overdue`
                      : `follow-up in ${contact.followUpDueIn}d`
                    }
                  </span>
                )}
              </div>
              {contact.lastContactDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Last: {new Date(contact.lastContactDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              {contact.postsEngaged.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">LinkedIn posts:</p>
                  <div className="flex flex-wrap gap-1">
                    {contact.postsEngaged.map(post => (
                      <span key={post} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {POST_LABELS[post] || post}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {contact.recentActivities.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Recent activity:</p>
                  {contact.recentActivities.slice(0, 3).map(a => (
                    <div key={a.id} className="text-xs text-gray-500 py-0.5">
                      <span className="capitalize font-medium">{a.activity_type}</span>
                      {a.description && <span> &middot; {a.description}</span>}
                      <span className="text-gray-300 ml-1">
                        {new Date(a.occurred_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pipeline Kanban ──

function PipelineKanban({ dealColumns, deals, contacts }: {
  dealColumns: Record<PipelineStage, ContactDeal[]>;
  deals: ContactDeal[];
  contacts: NetworkContact[];
}) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<DealType | 'all'>('all');
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showWonLost, setShowWonLost] = useState(false);

  // Build a contact lookup from deals
  const contactByDealId = new Map<string, NetworkContact>();
  for (const c of contacts) {
    for (const d of c.deals) {
      contactByDealId.set(d.id, c);
    }
  }

  const filteredColumns = {} as Record<PipelineStage, ContactDeal[]>;
  for (const stage of [...ACTIVE_STAGES, 'won', 'lost'] as PipelineStage[]) {
    filteredColumns[stage] = (dealColumns[stage] || []).filter(d =>
      typeFilter === 'all' || d.deal_type === typeFilter
    );
  }

  async function handleMoveDeal(dealId: string, newStage: PipelineStage) {
    await moveDeal(dealId, newStage);
    router.refresh();
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, deal: ContactDeal) {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(deal.id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverStage(null);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, stage: PipelineStage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  async function handleDrop(e: DragEvent<HTMLDivElement>, stage: PipelineStage) {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    setDragOverStage(null);
    setDraggingId(null);
    if (dealId) await handleMoveDeal(dealId, stage);
  }

  const activeTotalValue = ACTIVE_STAGES.reduce((sum, stage) =>
    sum + filteredColumns[stage].reduce((s, d) => s + d.amount_cents, 0), 0
  );
  const wonTotalValue = filteredColumns.won.reduce((s, d) => s + d.amount_cents, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({deals.length})
        </button>
        {(Object.keys(DEAL_TYPE_CONFIG) as DealType[]).map(dt => {
          const cfg = DEAL_TYPE_CONFIG[dt];
          const Icon = cfg.icon;
          const count = deals.filter(d => d.deal_type === dt).length;
          return (
            <button
              key={dt}
              onClick={() => setTypeFilter(dt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === dt ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label} ({count})
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
          const stageDeals = filteredColumns[stage];
          const colValue = stageDeals.reduce((s, d) => s + d.amount_cents, 0);
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
              <div className="px-3 py-2.5 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs font-medium text-gray-400">{stageDeals.length}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{formatCurrency(colValue)}</span>
              </div>

              <div className={`p-2 space-y-2 flex-1 min-h-[120px] max-h-[500px] overflow-y-auto ${isDragOver ? 'bg-opacity-80' : ''}`}>
                {stageDeals.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">{isDragOver ? 'Drop here' : 'No deals'}</p>
                ) : (
                  stageDeals.map(deal => {
                    const contact = contactByDealId.get(deal.id);
                    return (
                      <KanbanDealCard
                        key={deal.id}
                        deal={deal}
                        contactName={contact?.name || null}
                        contactOrg={contact?.organization || null}
                        isDragging={draggingId === deal.id}
                        onDragStart={e => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        onAdvance={() => handleMoveDeal(deal.id, nextStage as PipelineStage)}
                        onMove={s => handleMoveDeal(deal.id, s)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Totals */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <span className="font-semibold text-gray-700">Pipeline:</span>
          {ACTIVE_STAGES.map(stage => {
            const stageDeals = filteredColumns[stage];
            const value = stageDeals.reduce((s, d) => s + d.amount_cents, 0);
            const cfg = STAGE_CONFIG[stage];
            return (
              <div key={stage} className="flex items-center gap-1.5">
                <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-gray-900 font-semibold">{formatCurrency(value)}</span>
                <span className="text-[10px] text-gray-400">({stageDeals.length})</span>
              </div>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5 border-l pl-4 border-gray-200">
            <span className="text-xs font-medium text-gray-500">Total</span>
            <span className="text-sm text-gray-900 font-bold">{formatCurrency(activeTotalValue)}</span>
          </div>
        </div>
      </div>

      {/* Won/Lost */}
      <button
        onClick={() => setShowWonLost(!showWonLost)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        {showWonLost ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4 rotate-180" />}
        Closed ({filteredColumns.won.length} won &middot; {formatCurrency(wonTotalValue)}, {filteredColumns.lost.length} lost)
      </button>

      {showWonLost && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['won', 'lost'] as PipelineStage[]).map(stage => {
            const cfg = STAGE_CONFIG[stage];
            const stageDeals = filteredColumns[stage];
            const totalValue = stageDeals.reduce((s, d) => s + d.amount_cents, 0);
            return (
              <div
                key={stage}
                className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} ${dragOverStage === stage ? `ring-2 ${cfg.dropHighlight}` : ''}`}
                onDragOver={e => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage)}
              >
                <div className="px-3 py-2 border-b border-gray-200/50 flex items-center justify-between">
                  <span className={`font-semibold text-sm ${cfg.color}`}>{cfg.label} ({stageDeals.length})</span>
                  <span className={`text-xs font-semibold ${cfg.color}`}>{formatCurrency(totalValue)}</span>
                </div>
                <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                  {stageDeals.map(deal => {
                    const contact = contactByDealId.get(deal.id);
                    return (
                      <KanbanDealCard
                        key={deal.id}
                        deal={deal}
                        contactName={contact?.name || null}
                        contactOrg={contact?.organization || null}
                        isDragging={draggingId === deal.id}
                        onDragStart={e => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        onAdvance={() => {}}
                        onMove={s => handleMoveDeal(deal.id, s)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KanbanDealCard({ deal, contactName, contactOrg, isDragging, onDragStart, onDragEnd, onAdvance, onMove }: {
  deal: ContactDeal;
  contactName: string | null;
  contactOrg: string | null;
  isDragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onAdvance: () => void;
  onMove: (stage: PipelineStage) => void;
}) {
  const [showStages, setShowStages] = useState(false);
  const typeCfg = DEAL_TYPE_CONFIG[deal.deal_type] || DEAL_TYPE_CONFIG.sale;
  const TypeIcon = typeCfg.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg border shadow-sm p-3 space-y-2 cursor-grab active:cursor-grabbing transition-opacity ${
        deal.needs_action ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
        <TypeIcon className={`h-4 w-4 mt-0.5 shrink-0 ${typeCfg.color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-tight truncate">{deal.title}</p>
          {(contactName || contactOrg) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {contactName}{contactOrg ? ` \u00b7 ${contactOrg}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {deal.units > 0 && <span className="text-xs font-bold text-orange-700">{deal.units} beds</span>}
        {deal.amount_cents > 0 && <span className="text-sm font-bold text-gray-900">{formatCurrency(deal.amount_cents)}</span>}
        {deal.probability > 0 && deal.pipeline_stage !== 'won' && <span className="text-xs text-gray-400">{deal.probability}%</span>}
        {deal.needs_action && (
          <span className="text-xs text-amber-600 flex items-center gap-0.5">
            <AlertTriangle className="h-3 w-3" /> {deal.days_since_update}d
          </span>
        )}
      </div>

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
          {(Object.keys(DEAL_TYPE_CONFIG) as DealType[]).map(dt => (
            <option key={dt} value={dt}>{DEAL_TYPE_CONFIG[dt].label}</option>
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
