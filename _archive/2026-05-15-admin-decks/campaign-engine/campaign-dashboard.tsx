'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Kanban,
  Send,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  Zap,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Heart,
  Ticket,
  Handshake,
  Newspaper,
  BookOpen,
  Linkedin,
  Globe,
  Star,
} from 'lucide-react';
import {
  type ScoredContact,
  type PipelineContact,
  type CampaignStats,
  updatePipelineStage,
  runEngagementScoring,
} from './actions';
import {
  ENGAGEMENT_TIERS,
  PIPELINE_STAGES,
  SCORING_WEIGHTS,
  type EngagementTier,
  type PipelineStage,
  type MomentumMetrics,
  type ScoringAction,
} from '@/lib/campaign/types';

// ── Tab Types ──

type TabId = 'contacts' | 'pipeline' | 'compose' | 'momentum';

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'compose', label: 'Compose', icon: Send },
  { id: 'momentum', label: 'Momentum', icon: TrendingUp },
];

// ── Props ──

interface Props {
  stats: CampaignStats | null;
  contacts: ScoredContact[];
  pipeline: PipelineContact[];
  momentum: MomentumMetrics | null;
}

// ── Tier Color Helpers ──

const TIER_COLORS: Record<EngagementTier, string> = {
  aware: 'bg-gray-100 text-gray-700',
  engaged: 'bg-blue-100 text-blue-700',
  active: 'bg-amber-100 text-amber-700',
  champion: 'bg-emerald-100 text-emerald-700',
};

const TIER_BAR_COLORS: Record<EngagementTier, string> = {
  aware: 'bg-gray-400',
  engaged: 'bg-blue-500',
  active: 'bg-amber-500',
  champion: 'bg-emerald-500',
};

const STAGE_COLORS: Record<PipelineStage, string> = {
  cold: 'bg-gray-100 text-gray-700',
  warm: 'bg-blue-100 text-blue-700',
  contacted: 'bg-sky-100 text-sky-700',
  proposal_sent: 'bg-amber-100 text-amber-700',
  in_discussion: 'bg-purple-100 text-purple-700',
  committed: 'bg-emerald-100 text-emerald-700',
  active: 'bg-green-100 text-green-700',
  stale: 'bg-red-100 text-red-700',
};

const STAGE_BAR_COLORS: Record<PipelineStage, string> = {
  cold: 'bg-gray-400',
  warm: 'bg-blue-400',
  contacted: 'bg-sky-500',
  proposal_sent: 'bg-amber-500',
  in_discussion: 'bg-purple-500',
  committed: 'bg-emerald-500',
  active: 'bg-green-500',
  stale: 'bg-red-500',
};

const ACTION_ICONS: Record<ScoringAction, typeof ShoppingCart> = {
  order: ShoppingCart,
  newsletter_signup: Newspaper,
  qr_claim: CheckCircle,
  support_ticket: Ticket,
  partnership_inquiry: Handshake,
  contact_form: Mail,
  story_contribution: BookOpen,
  linkedin_hot: Linkedin,
  linkedin_strategic: Linkedin,
  linkedin_warm: Linkedin,
  linkedin_post_engaged: Globe,
  gmail_active: Mail,
  key_partner: Star,
};

// ── Main Component ──

export function CampaignDashboard({ stats, contacts, pipeline, momentum }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('contacts');
  const [tierFilter, setTierFilter] = useState<EngagementTier | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const router = useRouter();

  // ── Stats Cards ──

  const statsCards = stats ? [
    { label: 'Total Contacts', value: stats.totalContacts, sub: `${stats.ghlContacts} in GHL` },
    { label: 'Scored', value: stats.scoredContacts, sub: `${stats.pipelineContacts} in pipeline` },
    { label: 'Recent Orders', value: stats.recentOrders, sub: 'Last 30 days' },
    { label: 'Newsletter', value: stats.newsletterCount, sub: 'Subscribers' },
  ] : [];

  // ── Filtered Data ──

  const filteredContacts = contacts.filter(c => {
    if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.email.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.organization?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredPipeline = pipeline.filter(c => {
    if (stageFilter !== 'all' && c.pipeline_stage !== stageFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.email.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.organization?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Handlers ──

  async function handleRunScoring() {
    setIsScoring(true);
    try {
      const result = await runEngagementScoring();
      if (result.success) {
        router.refresh();
      } else {
        alert(`Scoring failed: ${result.error}`);
      }
    } finally {
      setIsScoring(false);
    }
  }

  async function handleStageChange(contactId: string, newStage: PipelineStage) {
    const result = await updatePipelineStage(contactId, newStage);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map(card => (
            <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-x-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'pipeline' && pipeline.filter(p => p.needsFollowup).length > 0 && (
                <span className="ml-1 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                  {pipeline.filter(p => p.needsFollowup).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'contacts' && (
        <ContactsTab
          contacts={filteredContacts}
          totalContacts={contacts.length}
          tierFilter={tierFilter}
          setTierFilter={setTierFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedContact={expandedContact}
          setExpandedContact={setExpandedContact}
          isScoring={isScoring}
          onRunScoring={handleRunScoring}
          tierDistribution={stats?.tierDistribution}
        />
      )}

      {activeTab === 'pipeline' && (
        <PipelineTab
          contacts={filteredPipeline}
          totalContacts={pipeline.length}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onStageChange={handleStageChange}
          pipelineDistribution={stats?.pipelineDistribution}
        />
      )}

      {activeTab === 'compose' && <ComposeTab />}

      {activeTab === 'momentum' && <MomentumTab metrics={momentum} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CONTACTS TAB
// ══════════════════════════════════════════════════════════════

function ContactsTab({
  contacts,
  totalContacts,
  tierFilter,
  setTierFilter,
  searchQuery,
  setSearchQuery,
  expandedContact,
  setExpandedContact,
  isScoring,
  onRunScoring,
  tierDistribution,
}: {
  contacts: ScoredContact[];
  totalContacts: number;
  tierFilter: EngagementTier | 'all';
  setTierFilter: (t: EngagementTier | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  expandedContact: string | null;
  setExpandedContact: (id: string | null) => void;
  isScoring: boolean;
  onRunScoring: () => void;
  tierDistribution?: Record<EngagementTier, number>;
}) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-orange-500 focus:border-orange-500"
          />
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as EngagementTier | 'all')}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Tiers</option>
            {(Object.keys(ENGAGEMENT_TIERS) as EngagementTier[]).map(tier => (
              <option key={tier} value={tier}>
                {ENGAGEMENT_TIERS[tier].label}
                {tierDistribution ? ` (${tierDistribution[tier]})` : ''}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {contacts.length} of {totalContacts}
          </span>
        </div>
        <button
          onClick={onRunScoring}
          disabled={isScoring}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isScoring ? 'animate-spin' : ''}`} />
          {isScoring ? 'Scoring...' : 'Run Scoring'}
        </button>
      </div>

      {/* Tier Distribution Bar */}
      {tierDistribution && totalContacts > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Engagement Distribution</span>
            <div className="flex gap-3">
              {(Object.keys(ENGAGEMENT_TIERS) as EngagementTier[]).map(tier => (
                <span key={tier} className="flex items-center gap-1 text-xs text-gray-500">
                  <span className={`inline-block w-2 h-2 rounded-full ${TIER_BAR_COLORS[tier]}`} />
                  {ENGAGEMENT_TIERS[tier].label}: {tierDistribution[tier]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
            {(Object.keys(ENGAGEMENT_TIERS) as EngagementTier[]).map(tier => {
              const count = tierDistribution[tier];
              const total = Object.values(tierDistribution).reduce((a, b) => a + b, 0);
              if (!count || !total) return null;
              return (
                <div
                  key={tier}
                  className={`${TIER_BAR_COLORS[tier]} transition-all`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Contact List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No scored contacts yet. Run engagement scoring to get started.</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div key={contact.email}>
              {/* Contact Row */}
              <button
                onClick={() => setExpandedContact(
                  expandedContact === contact.email ? null : contact.email
                )}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left transition-colors"
              >
                <span className="text-gray-400">
                  {expandedContact === contact.email
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />
                  }
                </span>

                {/* Score Badge */}
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${TIER_COLORS[contact.tier]}`}>
                  {contact.score}
                </span>

                {/* Name + Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name || contact.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.name ? contact.email : ''}
                    {contact.organization && ` · ${contact.organization}`}
                  </p>
                </div>

                {/* Action Badges */}
                <div className="hidden sm:flex gap-1">
                  {Object.entries(contact.actions).map(([action, count]) => {
                    const Icon = ACTION_ICONS[action as ScoringAction] || Mail;
                    return (
                      <span
                        key={action}
                        className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                        title={`${action}: ${count}x (${SCORING_WEIGHTS[action as ScoringAction]}pt each)`}
                      >
                        <Icon className="h-3 w-3" />
                        {count}
                      </span>
                    );
                  })}
                </div>

                {/* Tier Badge */}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TIER_COLORS[contact.tier]}`}>
                  {contact.tierLabel}
                </span>
              </button>

              {/* Expanded Details */}
              {expandedContact === contact.email && (
                <div className="px-12 pb-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                    {/* Score Breakdown */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Score Breakdown</h4>
                      <div className="space-y-1">
                        {Object.entries(contact.actions).map(([action, count]) => (
                          <div key={action} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">{action.replace(/_/g, ' ')}</span>
                            <span className="font-medium">
                              {count} × {SCORING_WEIGHTS[action as ScoringAction]}pt = {(count || 0) * SCORING_WEIGHTS[action as ScoringAction]}pt
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-1 flex justify-between text-sm font-bold">
                          <span>Total</span>
                          <span>{contact.score}pt</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${contact.email}`} className="text-orange-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-3.5 w-3.5" />
                            {contact.phone}
                          </div>
                        )}
                        {contact.organization && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-3.5 w-3.5" />
                            {contact.organization}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Actions</h4>
                      <div className="space-y-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Send Email
                        </a>
                        {contact.ghl_id && (
                          <span className="flex items-center gap-2 text-sm text-gray-500">
                            <Zap className="h-3.5 w-3.5" />
                            In GHL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PIPELINE TAB
// ══════════════════════════════════════════════════════════════

function PipelineTab({
  contacts,
  totalContacts,
  stageFilter,
  setStageFilter,
  searchQuery,
  setSearchQuery,
  onStageChange,
  pipelineDistribution,
}: {
  contacts: PipelineContact[];
  totalContacts: number;
  stageFilter: PipelineStage | 'all';
  setStageFilter: (s: PipelineStage | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onStageChange: (id: string, stage: PipelineStage) => void;
  pipelineDistribution?: Record<PipelineStage, number>;
}) {
  const needsFollowup = contacts.filter(c => c.needsFollowup);

  return (
    <div className="space-y-4">
      {/* Follow-up Alert */}
      {needsFollowup.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {needsFollowup.length} contact{needsFollowup.length > 1 ? 's' : ''} need follow-up
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {needsFollowup.slice(0, 3).map(c => c.name || c.email).join(', ')}
              {needsFollowup.length > 3 && ` +${needsFollowup.length - 3} more`}
            </p>
          </div>
        </div>
      )}

      {/* Pipeline Funnel */}
      {pipelineDistribution && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Pipeline Funnel</h3>
          <div className="space-y-2">
            {(Object.keys(PIPELINE_STAGES) as PipelineStage[]).map(stage => {
              const count = pipelineDistribution[stage] || 0;
              const total = Object.values(pipelineDistribution).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? (count / total) * 100 : 0;

              return (
                <button
                  key={stage}
                  onClick={() => setStageFilter(stageFilter === stage ? 'all' : stage)}
                  className={`w-full flex items-center gap-3 rounded-md p-2 text-sm transition-colors ${
                    stageFilter === stage ? 'bg-gray-100 ring-1 ring-gray-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-28 text-left text-gray-600 font-medium">
                    {PIPELINE_STAGES[stage].label}
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${STAGE_BAR_COLORS[stage]} rounded-full transition-all`}
                      style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-gray-900">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search pipeline..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-orange-500 focus:border-orange-500"
        />
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value as PipelineStage | 'all')}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        >
          <option value="all">All Stages</option>
          {(Object.keys(PIPELINE_STAGES) as PipelineStage[]).map(stage => (
            <option key={stage} value={stage}>
              {PIPELINE_STAGES[stage].label}
              {pipelineDistribution ? ` (${pipelineDistribution[stage]})` : ''}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {contacts.length} of {totalContacts}
        </span>
      </div>

      {/* Pipeline Contact List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Kanban className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No pipeline contacts yet. Add contacts to the pipeline from the People page.</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
              {/* Stage Badge */}
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STAGE_COLORS[contact.pipeline_stage]}`}>
                {contact.stageLabel}
              </span>

              {/* Name + Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {contact.name || contact.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {contact.organization && <span>{contact.organization}</span>}
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {contact.daysSinceContact < 999
                      ? `${contact.daysSinceContact}d ago`
                      : 'Never contacted'}
                  </span>
                  {contact.auto_followups_sent > 0 && (
                    <>
                      <span>·</span>
                      <span>{contact.auto_followups_sent} follow-up{contact.auto_followups_sent > 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Follow-up Indicator */}
              {contact.needsFollowup && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  Needs follow-up
                </span>
              )}

              {/* Score */}
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${TIER_COLORS[contact.tier]}`}>
                {contact.score}
              </span>

              {/* Advance Button */}
              {contact.pipeline_stage !== 'active' && contact.pipeline_stage !== 'stale' && (
                <button
                  onClick={() => {
                    const stages = Object.keys(PIPELINE_STAGES) as PipelineStage[];
                    const currentIdx = stages.indexOf(contact.pipeline_stage);
                    const nextStage = stages[Math.min(currentIdx + 1, stages.length - 2)]; // Skip stale
                    onStageChange(contact.id, nextStage);
                  }}
                  className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs text-orange-700 hover:bg-orange-100 transition-colors"
                  title="Advance to next stage"
                >
                  <ArrowRight className="h-3 w-3" />
                  Advance
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPOSE TAB
// ══════════════════════════════════════════════════════════════

function ComposeTab() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!to || !subject || !body) return;
    setSending(true);
    try {
      const response = await fetch('/api/admin/campaign/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      });
      if (response.ok) {
        setSent(true);
        setTo('');
        setSubject('');
        setBody('');
        setTimeout(() => setSent(false), 3000);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Compose Branded Email</h3>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Following up — Goods on Country"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Body</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={10}
            placeholder="Hi there,&#10;&#10;I wanted to follow up on..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 font-[Georgia,serif]"
          />
          <p className="text-xs text-gray-400 mt-1">
            Body will be wrapped in the Goods on Country branded email template.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending || !to || !subject || !body}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
          {sent && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              Sent!
            </span>
          )}
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
          Preview
        </div>
        <div className="p-6">
          <div className="bg-slate-800 px-6 py-4 rounded-t-md">
            <span className="text-orange-500 font-bold font-[Georgia,serif]">Goods</span>
            <span className="text-white font-bold font-[Georgia,serif]"> on Country</span>
          </div>
          <div className="border border-t-0 border-gray-200 rounded-b-md p-6 font-[Georgia,serif] text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {body || 'Your email body will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MOMENTUM TAB
// ══════════════════════════════════════════════════════════════

function MomentumTab({ metrics }: { metrics: MomentumMetrics | null }) {
  if (!metrics) {
    return (
      <div className="p-8 text-center text-gray-500">
        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p>Unable to load momentum metrics.</p>
      </div>
    );
  }

  const totalPipeline = Object.values(metrics.pipeline).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'In Pipeline', value: totalPipeline, icon: Kanban, color: 'text-blue-600' },
          { label: 'Newsletter', value: metrics.newsletterSubscribers, icon: Newspaper, color: 'text-emerald-600' },
          { label: 'Recent Orders', value: metrics.recentOrders, icon: ShoppingCart, color: 'text-orange-600' },
          { label: 'Recent Claims', value: metrics.recentClaims, icon: CheckCircle, color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
            <card.icon className={`h-8 w-8 ${card.color} shrink-0`} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Pipeline Funnel</h3>
        <div className="space-y-2">
          {(Object.keys(PIPELINE_STAGES) as PipelineStage[]).map(stage => {
            const count = metrics.pipeline[stage] || 0;
            const pct = totalPipeline > 0 ? (count / totalPipeline) * 100 : 0;

            return (
              <div key={stage} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-600 font-medium">
                  {PIPELINE_STAGES[stage].label}
                </span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${STAGE_BAR_COLORS[stage]} rounded-full transition-all flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                  >
                    {count > 0 && (
                      <span className="text-xs font-bold text-white">{count}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagement Tiers */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Engagement Tiers</h3>
        <div className="grid grid-cols-4 gap-4">
          {(Object.keys(ENGAGEMENT_TIERS) as EngagementTier[]).map(tier => {
            const count = metrics.tierDistribution[tier] || 0;
            return (
              <div key={tier} className="text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-lg font-bold ${TIER_COLORS[tier]}`}>
                  {count}
                </div>
                <p className="text-xs text-gray-500 mt-1">{ENGAGEMENT_TIERS[tier].label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.followupsNeeded > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {metrics.followupsNeeded} Follow-ups Needed
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Pipeline contacts waiting for outreach
              </p>
            </div>
          </div>
        )}
        {metrics.staleContacts > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {metrics.staleContacts} Stale Contacts
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Inactive for 30+ days — need re-engagement
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scoring Reference */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Scoring Reference</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.entries(SCORING_WEIGHTS) as [ScoringAction, number][]).map(([action, weight]) => {
            const Icon = ACTION_ICONS[action] || Mail;
            return (
              <div key={action} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 capitalize">{action.replace(/_/g, ' ')}</span>
                <span className="font-bold text-gray-900">{weight}pt</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
