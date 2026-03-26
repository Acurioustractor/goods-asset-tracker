'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  ExternalLink,
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
} from 'lucide-react';
import type { NetworkOverview, NetworkContact, ContactTier, ContactType } from './actions';

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

type FilterTab = 'all' | ContactTier | 'needs-followup' | 'has-email';
type SortField = 'score' | 'name' | 'lastContact' | 'daysSince';

// ── Main Component ──

export function NetworkDashboard({ overview }: { overview: NetworkOverview }) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [typeFilter, setTypeFilter] = useState<ContactType | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const { contacts, stats } = overview;

  // Filter
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
      case 'lastContact':
        cmp = (a.lastContactDate || '').localeCompare(b.lastContactDate || '');
        break;
      case 'daysSince':
        cmp = (a.daysSinceContact ?? 999) - (b.daysSinceContact ?? 999);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  }

  const TIER_TABS: { id: FilterTab; label: string; count: number; icon: typeof Users }[] = [
    { id: 'all', label: 'All', count: stats.total, icon: Users },
    { id: 'champion', label: 'Champions', count: stats.champions, icon: Star },
    { id: 'hot', label: 'Hot', count: stats.hot, icon: Flame },
    { id: 'strategic', label: 'Strategic', count: stats.strategic, icon: Target },
    { id: 'warm', label: 'Warm', count: stats.warm, icon: ThermometerSun },
    { id: 'needs-followup', label: 'Needs Follow-up', count: stats.needsFollowUp, icon: AlertTriangle },
    { id: 'has-email', label: 'Has Email', count: stats.withEmail, icon: Mail },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <KPICard label="Total" value={stats.total} icon={Users} />
        <KPICard label="Champions" value={stats.champions} icon={Star} highlight />
        <KPICard label="Hot" value={stats.hot} icon={Flame} />
        <KPICard label="Strategic" value={stats.strategic} icon={Target} />
        <KPICard label="Funders" value={stats.byType.funder} icon={DollarSign} />
        <KPICard label="Partners" value={stats.byType.partner} icon={Handshake} />
        <KPICard label="Follow-up" value={stats.needsFollowUp} icon={AlertTriangle} warn />
      </div>

      {/* Tier Tabs */}
      <div className="flex flex-wrap gap-2">
        {TIER_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Search + Type + Source Filters */}
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

      {/* Contact List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-left">
            Contact <ArrowUpDown className="h-3 w-3" />
          </button>
          <span>Type</span>
          <button onClick={() => toggleSort('daysSince')} className="flex items-center gap-1">
            Last Contact <ArrowUpDown className="h-3 w-3" />
          </button>
          <button onClick={() => toggleSort('score')} className="flex items-center gap-1">
            Score <ArrowUpDown className="h-3 w-3" />
          </button>
          <span>Sources</span>
        </div>

        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">
              No contacts match your filters
            </div>
          ) : (
            sorted.map(contact => (
              <ContactRow
                key={contact.id}
                contact={contact}
                expanded={expandedId === contact.id}
                onToggle={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              />
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
          Showing {sorted.length} of {stats.total} contacts
        </div>
      </div>
    </div>
  );
}

// ── Sub-Components ──

function KPICard({ label, value, icon: Icon, highlight, warn }: {
  label: string; value: number; icon: typeof Users; highlight?: boolean; warn?: boolean;
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

function ContactRow({ contact, expanded, onToggle }: {
  contact: NetworkContact; expanded: boolean; onToggle: () => void;
}) {
  const tierCfg = TIER_CONFIG[contact.tier];
  const typeCfg = TYPE_CONFIG[contact.type];
  const TierIcon = tierCfg.icon;
  const isKeyPartner = contact.tier === 'champion';

  return (
    <div className={isKeyPartner ? 'bg-orange-50/30' : ''}>
      {/* Row */}
      <div
        className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors items-center"
        onClick={onToggle}
      >
        {/* Name + Org */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={`rounded-full p-1 ${tierCfg.color}`}>
            <TierIcon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900 text-sm truncate">{contact.name}</span>
              {isKeyPartner && <Star className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />}
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
            <span className="text-gray-300">—</span>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

        {/* Sources */}
        <div className="flex items-center gap-1">
          {contact.sources.includes('linkedin') && <Linkedin className="h-3.5 w-3.5 text-blue-600" />}
          {contact.sources.includes('gmail') && <Mail className="h-3.5 w-3.5 text-red-500" />}
          {contact.postsEngaged.length > 0 && (
            <span className="text-[10px] text-gray-400">{contact.postsEngaged.length}p</span>
          )}
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 pl-12 space-y-3 bg-gray-50/50 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
            {/* Contact Info */}
            <div className="space-y-1.5">
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
              <div className="flex gap-2 pt-1">
                <a
                  href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(contact.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" /> LinkedIn
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </a>
                )}
              </div>
            </div>

            {/* Engagement */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Engagement</h4>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{contact.score}</span> pts
                {contact.dealCount > 0 && <span> · {contact.dealCount} deal{contact.dealCount !== 1 ? 's' : ''}</span>}
              </div>
              {contact.pipelineStage && (
                <div className="text-sm">
                  <span className="text-gray-500">Stage:</span>{' '}
                  <span className="font-medium capitalize">{contact.pipelineStage}</span>
                </div>
              )}
              {contact.lastContactDate && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Last: {new Date(contact.lastContactDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>

            {/* Posts Engaged */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">Posts Engaged</h4>
              {contact.postsEngaged.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {contact.postsEngaged.map(post => (
                    <span key={post} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {POST_LABELS[post] || post}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No LinkedIn engagement tracked</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
