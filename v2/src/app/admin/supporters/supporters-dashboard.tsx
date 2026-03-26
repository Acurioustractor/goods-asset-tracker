'use client';

import { useState } from 'react';
import {
  Users,
  Linkedin,
  Mail,
  Flame,
  Target,
  ThermometerSun,
  DollarSign,
  Handshake,
  Landmark,
  Newspaper,
  Heart,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import type { SupportersOverview, Supporter } from './actions';

type FilterTab = 'all' | 'hot' | 'strategic' | 'warm' | 'gmail' | 'funders' | 'partners' | 'politicians' | 'community';

const TIER_COLORS: Record<Supporter['tier'], string> = {
  hot: 'bg-red-100 text-red-800',
  strategic: 'bg-amber-100 text-amber-800',
  warm: 'bg-blue-100 text-blue-800',
  gmail: 'bg-green-100 text-green-800',
  existing: 'bg-gray-100 text-gray-700',
};

const TIER_ICONS: Record<Supporter['tier'], typeof Flame> = {
  hot: Flame,
  strategic: Target,
  warm: ThermometerSun,
  gmail: Mail,
  existing: Users,
};

const CATEGORY_COLORS: Record<string, string> = {
  philanthropy: 'bg-purple-100 text-purple-700',
  funder: 'bg-purple-100 text-purple-700',
  investor: 'bg-purple-100 text-purple-700',
  politician: 'bg-indigo-100 text-indigo-700',
  government: 'bg-indigo-100 text-indigo-700',
  'social-enterprise': 'bg-teal-100 text-teal-700',
  partner: 'bg-emerald-100 text-emerald-700',
  'first-nations': 'bg-orange-100 text-orange-700',
  community: 'bg-orange-100 text-orange-700',
  academic: 'bg-cyan-100 text-cyan-700',
  media: 'bg-pink-100 text-pink-700',
  arts: 'bg-violet-100 text-violet-700',
  creative: 'bg-violet-100 text-violet-700',
  'youth-justice': 'bg-rose-100 text-rose-700',
  'health-education': 'bg-lime-100 text-lime-700',
  health: 'bg-lime-100 text-lime-700',
  'social-impact': 'bg-teal-100 text-teal-700',
  design: 'bg-sky-100 text-sky-700',
  'circular-economy': 'bg-green-100 text-green-700',
  housing: 'bg-amber-100 text-amber-700',
  business: 'bg-slate-100 text-slate-700',
  supporter: 'bg-gray-100 text-gray-600',
};

const POST_LABELS: Record<string, string> = {
  'stretch-bed': 'Stretch Bed',
  'washing-machine': 'Washing Machine',
  'goods-bed-v3': 'Bed v3 Testing',
  'goods-bed-imagine': 'Bed Imagine',
  'nic-tribute': 'Nic Tribute',
  'palm-island': 'Palm Island',
  'tennant-creek': 'Tennant Creek',
  'alice-springs': 'Alice Springs',
  'contained-tour': 'CONTAINED Tour',
  'contained-cta': 'CONTAINED CTA',
  'contained-diagrama': 'Diagrama',
  'contained-little-friend': 'CONTAINED',
  'things-connected': 'Things Connected',
  'urapuntja': 'Urapuntja',
  'oonchiumpa': 'Oonchiumpa',
  'norman-frank': 'Norman Frank',
};

// Key partners that should always be highlighted
const KEY_PARTNERS = [
  'kristy bloomfield',
  'tanya turner',
  'narelle gleeson',
  'rachel atkinson',
  'simon quilty',
  'todd sidery',
  'sam davies',
  'sally grimsley-ballard',
  'kim harland',
  'fiona maxwell',
];

function KPICard({ label, value, icon: Icon, color }: {
  label: string;
  value: number;
  icon: typeof Users;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function SupporterRow({ supporter, expanded, onToggle }: {
  supporter: Supporter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const TierIcon = TIER_ICONS[supporter.tier];
  const isKeyPartner = KEY_PARTNERS.includes(supporter.name.toLowerCase());

  return (
    <div className={`border-b border-gray-100 ${isKeyPartner ? 'bg-orange-50/50' : ''}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        {/* Tier icon */}
        <div className={`rounded-full p-1.5 ${TIER_COLORS[supporter.tier]}`}>
          <TierIcon className="h-3.5 w-3.5" />
        </div>

        {/* Name + company */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {supporter.name}
            </span>
            {isKeyPartner && (
              <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500 flex-shrink-0" />
            )}
            {supporter.isLinkedin && (
              <Linkedin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
            )}
            {supporter.isGmail && (
              <Mail className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
            )}
          </div>
          {supporter.company && (
            <p className="text-xs text-gray-500 truncate">{supporter.company}</p>
          )}
        </div>

        {/* Category badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${CATEGORY_COLORS[supporter.category] || CATEGORY_COLORS.supporter}`}>
          {supporter.category.replace(/-/g, ' ')}
        </span>

        {/* Posts count */}
        {supporter.postsEngaged.length > 0 && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {supporter.postsEngaged.length} post{supporter.postsEngaged.length !== 1 ? 's' : ''}
          </span>
        )}

        {/* Expand */}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-3 pl-12 space-y-2">
          {supporter.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <a href={`mailto:${supporter.email}`} className="text-blue-600 hover:underline">
                {supporter.email}
              </a>
            </div>
          )}
          {supporter.postsEngaged.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {supporter.postsEngaged.map(post => (
                <span key={post} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {POST_LABELS[post] || post}
                </span>
              ))}
            </div>
          )}
          {supporter.tags.filter(t => !t.startsWith('goods-linkedin-') && !t.startsWith('goods-gmail-') && !t.startsWith('goods-li-')).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {supporter.tags
                .filter(t => !t.startsWith('goods-linkedin-') && !t.startsWith('goods-gmail-') && !t.startsWith('goods-li-'))
                .slice(0, 8)
                .map(tag => (
                  <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                    {tag}
                  </span>
                ))}
            </div>
          )}
          <div className="flex gap-3 mt-2">
            {supporter.isLinkedin && (
              <a
                href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(supporter.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" /> LinkedIn
              </a>
            )}
            {supporter.email && (
              <a
                href={`mailto:${supporter.email}`}
                className="text-xs text-green-600 hover:underline flex items-center gap-1"
              >
                <Mail className="h-3 w-3" /> Email
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SupportersDashboard({ overview }: { overview: SupportersOverview }) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { supporters, stats } = overview;

  // Filter supporters
  const filtered = supporters.filter(s => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) &&
          !s.company.toLowerCase().includes(q) &&
          !s.email.toLowerCase().includes(q) &&
          !s.category.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Tab filter
    switch (activeFilter) {
      case 'hot': return s.tier === 'hot';
      case 'strategic': return s.tier === 'strategic';
      case 'warm': return s.tier === 'warm';
      case 'gmail': return s.isGmail;
      case 'funders': return ['philanthropy', 'funder', 'investor'].includes(s.category);
      case 'partners': return ['partner', 'social-enterprise'].includes(s.category);
      case 'politicians': return ['politician', 'government'].includes(s.category);
      case 'community': return ['community', 'first-nations'].includes(s.category);
      default: return true;
    }
  });

  const FILTER_TABS: { id: FilterTab; label: string; icon: typeof Users; count: number }[] = [
    { id: 'all', label: 'All', icon: Users, count: stats.total },
    { id: 'hot', label: 'Hot', icon: Flame, count: stats.hot },
    { id: 'strategic', label: 'Strategic', icon: Target, count: stats.strategic },
    { id: 'warm', label: 'Warm', icon: ThermometerSun, count: stats.warm },
    { id: 'gmail', label: 'Email Active', icon: Mail, count: stats.gmailTotal },
    { id: 'funders', label: 'Funders', icon: DollarSign, count: stats.funders },
    { id: 'partners', label: 'Partners', icon: Handshake, count: stats.partners },
    { id: 'politicians', label: 'Government', icon: Landmark, count: stats.politicians },
    { id: 'community', label: 'Community', icon: Heart, count: stats.community },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Total Supporters" value={stats.total} icon={Users} color="bg-gray-100 text-gray-700" />
        <KPICard label="LinkedIn" value={stats.linkedinTotal} icon={Linkedin} color="bg-blue-100 text-blue-700" />
        <KPICard label="Hot Leads" value={stats.hot} icon={Flame} color="bg-red-100 text-red-700" />
        <KPICard label="Strategic" value={stats.strategic} icon={Target} color="bg-amber-100 text-amber-700" />
        <KPICard label="Funders" value={stats.funders} icon={DollarSign} color="bg-purple-100 text-purple-700" />
        <KPICard label="Media" value={stats.media} icon={Newspaper} color="bg-pink-100 text-pink-700" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, company, email, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Supporters list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              {filtered.length} supporter{filtered.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Star className="h-3 w-3 text-orange-500 fill-orange-500" /> Key Partner
              <Linkedin className="h-3 w-3 text-blue-600" /> LinkedIn
              <Mail className="h-3 w-3 text-red-500" /> Gmail
            </div>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">
              No supporters match your filters
            </div>
          ) : (
            filtered.map(supporter => (
              <SupporterRow
                key={supporter.id}
                supporter={supporter}
                expanded={expandedId === supporter.id}
                onToggle={() => setExpandedId(expandedId === supporter.id ? null : supporter.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Source attribution */}
      <p className="text-xs text-gray-400 text-center">
        Data sourced from LinkedIn post comments (scraped 2026-03-26) and Gmail correspondence.
        Synced to GoHighLevel CRM with tier and category tags.
      </p>
    </div>
  );
}
