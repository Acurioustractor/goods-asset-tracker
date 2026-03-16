'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  funding, getFundingSummary, type FundingRecord,
  communityPartners as compendiumPartners,
  deployments, documentedDemand,
  getDeploymentTotals, getDemandTotal,
} from '@/lib/data/compendium';
import {
  allTargets as initialTargets,
  capitalTargets,
  healthBuyers,
  procurementBuyers,
  communityAndManufacturingPartners,
  capitalPathways,
  CATEGORY_LABELS, CATEGORY_COLORS,
  type OutreachTarget, type RelationshipStatus, type TargetCategory, type Priority,
} from '@/lib/data/outreach-targets';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'pipeline' | 'foundations' | 'communities' | 'partners' | 'procurement' | 'composer';

type GrantSection =
  | 'org_identity' | 'founders' | 'problem' | 'solution'
  | 'impact' | 'financials' | 'community_voices' | 'use_of_funds' | 'eligibility';

type FundingPurpose = 'beds' | 'production' | 'washers' | 'scale';

type ComposedSection = { id: GrantSection; title: string; content: string };
type ComposedGrant = { funderName: string; sections: ComposedSection[]; generatedAt: string };

// Editable local notes layered on top of static data
interface LocalNote {
  context?: string;
  links?: string[];
  lastUpdated?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount === 0) return 'TBD';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  warm: 'bg-amber-100 text-amber-800',
  applied: 'bg-blue-100 text-blue-800',
  prospect: 'bg-purple-100 text-purple-800',
  research: 'bg-gray-100 text-gray-600',
};

const PRIORITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-300',
  low: 'bg-gray-300',
};

const ALL_STATUSES: RelationshipStatus[] = ['active', 'warm', 'applied', 'prospect', 'research'];

const STORAGE_KEY_TARGETS = 'goods-grants-targets';
const STORAGE_KEY_NOTES = 'goods-grants-notes';

function loadTargets(): OutreachTarget[] {
  if (typeof window === 'undefined') return initialTargets;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TARGETS);
    if (!stored) return initialTargets;
    const parsed = JSON.parse(stored) as { version: number; data: OutreachTarget[] };
    // Merge: keep stored edits/additions, add any new targets from static data
    const storedIds = new Set(parsed.data.map((t: OutreachTarget) => t.id));
    const newFromStatic = initialTargets.filter(t => !storedIds.has(t.id));
    return [...parsed.data, ...newFromStatic];
  } catch { return initialTargets; }
}

function loadNotes(): Record<string, LocalNote> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTES);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function GrantsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [targets, setTargets] = useState<OutreachTarget[]>(loadTargets);
  const [notes, setNotes] = useState<Record<string, LocalNote>>(loadNotes);
  const [selectedTarget, setSelectedTarget] = useState<OutreachTarget | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Persist targets & notes to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TARGETS, JSON.stringify({ version: 1, data: targets }));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  const summary = getFundingSummary();
  const totalPipeline = summary.received + summary.pending + summary.receivables;
  const depTotals = getDeploymentTotals();
  const demandTotal = getDemandTotal();

  // Computed insights
  const insights = useMemo(() => {
    const critical = targets.filter(t => t.priority === 'critical');
    const criticalProspects = critical.filter(t => t.status === 'prospect' || t.status === 'research');
    const activeCount = targets.filter(t => t.status === 'active').length;
    const warmCount = targets.filter(t => t.status === 'warm').length;
    const appliedCount = targets.filter(t => t.status === 'applied').length;
    const prospectCount = targets.filter(t => t.status === 'prospect').length;
    const partnersActive = targets.filter(t => ['community_partner', 'manufacturing_partner'].includes(t.category) && t.status === 'active').length;
    const buyersWarm = targets.filter(t => ['procurement_buyer', 'health_buyer'].includes(t.category) && (t.status === 'warm' || t.status === 'active')).length;

    const recs: { type: 'action' | 'opportunity' | 'strength'; text: string }[] = [];

    // Strengths
    if (summary.received > 0) recs.push({ type: 'strength', text: `${formatCurrency(summary.received)} confirmed funding from ${funding.filter(f => f.status === 'received').length} funders — strong anchor funder base.` });
    if (depTotals.beds > 0) recs.push({ type: 'strength', text: `${depTotals.beds} beds deployed across ${depTotals.communities} communities — proven delivery track record.` });
    if (partnersActive > 0) recs.push({ type: 'strength', text: `${partnersActive} active community/manufacturing partners — strong on-the-ground network.` });

    // Actions
    if (criticalProspects.length > 0) recs.push({ type: 'action', text: `${criticalProspects.length} critical-priority targets still at prospect/research stage: ${criticalProspects.map(t => t.name).join(', ')}. Prioritise outreach.` });
    if (summary.receivables > 0) recs.push({ type: 'action', text: `${formatCurrency(summary.receivables)} in outstanding receivables — follow up on invoices (Centrecorp $420K, PICC $36K, Homeland $34K).` });
    if (appliedCount > 0) recs.push({ type: 'action', text: `${appliedCount} applications submitted and waiting — schedule follow-ups to keep momentum.` });

    // Opportunities
    if (demandTotal > 0) recs.push({ type: 'opportunity', text: `${formatCurrency(demandTotal)} in documented community demand — use in every grant application as proof of market.` });
    if (buyersWarm > 0) recs.push({ type: 'opportunity', text: `${buyersWarm} warm/active procurement buyers — convert into repeat orders to strengthen commercial case for impact investors.` });
    if (prospectCount > 3) recs.push({ type: 'opportunity', text: `${prospectCount} prospects to develop — focus on those with highest grant relevance scores for quickest conversion.` });

    return { activeCount, warmCount, appliedCount, prospectCount, critical, recs };
  }, [targets, summary, depTotals, demandTotal]);

  const openSidebar = useCallback((target: OutreachTarget) => {
    setSelectedTarget(target);
    setSidebarOpen(true);
  }, []);

  const updateTargetStatus = useCallback((id: string, newStatus: RelationshipStatus) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setSelectedTarget(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  }, []);

  const updateTarget = useCallback((id: string, updates: Partial<OutreachTarget>) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setSelectedTarget(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
  }, []);

  const addTarget = useCallback((target: OutreachTarget) => {
    setTargets(prev => [target, ...prev]);
  }, []);

  const deleteTarget = useCallback((id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setSidebarOpen(false);
    setSelectedTarget(null);
  }, []);

  const updateNote = useCallback((id: string, note: LocalNote) => {
    setNotes(prev => ({ ...prev, [id]: { ...prev[id], ...note, lastUpdated: new Date().toISOString() } }));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'foundations', label: 'Foundations' },
    { key: 'communities', label: 'Communities' },
    { key: 'partners', label: 'Partners' },
    { key: 'procurement', label: 'Procurement' },
    { key: 'composer', label: 'Composer' },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Summary */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grants & Foundations</h1>
          <p className="text-gray-500 mt-1">
            {formatCurrency(totalPipeline)} total pipeline &middot; {targets.length} relationships &middot; {depTotals.beds} beds deployed
          </p>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-500 transition-colors flex items-center gap-1.5"
        >
          <span className="text-lg leading-none">+</span> Add New
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Received</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(summary.received)}</p>
          <p className="text-[10px] text-green-600">{funding.filter(f => f.status === 'received').length} funders</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wide">Receivable</p>
          <p className="text-lg font-bold text-amber-700">{formatCurrency(summary.receivables)}</p>
          <p className="text-[10px] text-amber-600">{funding.filter(f => f.status === 'receivable').length} invoices</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">Pending</p>
          <p className="text-lg font-bold text-blue-700">{formatCurrency(summary.pending)}</p>
          <p className="text-[10px] text-blue-600">{funding.filter(f => f.status === 'pending').length} applications</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
          <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wide">Demand</p>
          <p className="text-lg font-bold text-purple-700">{formatCurrency(demandTotal)}</p>
          <p className="text-[10px] text-purple-600">{documentedDemand.length} requests</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
          <p className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Active</p>
          <p className="text-lg font-bold text-green-700">{insights.activeCount}</p>
          <p className="text-[10px] text-green-600">relationships</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
          <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wide">Warm</p>
          <p className="text-lg font-bold text-amber-700">{insights.warmCount}</p>
          <p className="text-[10px] text-amber-600">in progress</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
          <p className="text-[10px] font-medium text-red-600 uppercase tracking-wide">Critical</p>
          <p className="text-lg font-bold text-red-700">{insights.critical.length}</p>
          <p className="text-[10px] text-red-600">top priority</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <PipelineView targets={targets} notes={notes} onSelect={openSidebar} onStatusChange={updateTargetStatus} />
      )}
      {activeTab === 'foundations' && (
        <FoundationsView targets={targets} notes={notes} onSelect={openSidebar} onStatusChange={updateTargetStatus} />
      )}
      {activeTab === 'communities' && (
        <CommunitiesView targets={targets} notes={notes} onSelect={openSidebar} />
      )}
      {activeTab === 'partners' && (
        <PartnersView targets={targets} notes={notes} onSelect={openSidebar} onStatusChange={updateTargetStatus} />
      )}
      {activeTab === 'procurement' && (
        <ProcurementView targets={targets} notes={notes} onSelect={openSidebar} onStatusChange={updateTargetStatus} />
      )}
      {activeTab === 'composer' && <GrantComposer />}

      {/* Recommendations & Reflections */}
      {activeTab !== 'composer' && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strengths */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Strengths
              </h3>
              {insights.recs.filter(r => r.type === 'strength').map((r, i) => (
                <p key={i} className="text-xs text-gray-600 leading-relaxed pl-3.5">{r.text}</p>
              ))}
            </div>
            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Actions Needed
              </h3>
              {insights.recs.filter(r => r.type === 'action').map((r, i) => (
                <p key={i} className="text-xs text-gray-600 leading-relaxed pl-3.5">{r.text}</p>
              ))}
            </div>
            {/* Opportunities */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Opportunities
              </h3>
              {insights.recs.filter(r => r.type === 'opportunity').map((r, i) => (
                <p key={i} className="text-xs text-gray-600 leading-relaxed pl-3.5">{r.text}</p>
              ))}
            </div>
          </div>

          {/* Bottom-line summary */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 mt-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Summary:</strong> {formatCurrency(summary.received)} secured from {funding.filter(f => f.status === 'received').length} funders
              with {formatCurrency(summary.pending)} in active applications.
              {summary.receivables > 0 && ` ${formatCurrency(summary.receivables)} in receivables need follow-up.`}
              {' '}{depTotals.beds} beds across {depTotals.communities} communities prove delivery capability.
              {demandTotal > 1_000_000 && ` ${formatCurrency(demandTotal)} in documented demand signals the market is real.`}
              {' '}Focus: convert {insights.critical.filter(t => t.status !== 'active').length} critical non-active targets
              and chase outstanding receivables to strengthen the commercial case for impact investors.
            </p>
          </div>
        </div>
      )}

      {/* Detail Sidebar */}
      <DetailSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        target={selectedTarget}
        note={selectedTarget ? notes[selectedTarget.id] : undefined}
        onStatusChange={updateTargetStatus}
        onTargetUpdate={updateTarget}
        onNoteUpdate={updateNote}
        onDelete={deleteTarget}
      />

      {/* Add New Dialog */}
      <AddTargetDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addTarget}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Sidebar
// ─────────────────────────────────────────────────────────────────────────────

function DetailSidebar({
  open, onOpenChange, target, note, onStatusChange, onTargetUpdate, onNoteUpdate, onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: OutreachTarget | null;
  note?: LocalNote;
  onStatusChange: (id: string, status: RelationshipStatus) => void;
  onTargetUpdate: (id: string, updates: Partial<OutreachTarget>) => void;
  onNoteUpdate: (id: string, note: LocalNote) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Local edit state — populated when entering edit mode
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editInstrument, setEditInstrument] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editNextAction, setEditNextAction] = useState('');
  const [editGrantRelevance, setEditGrantRelevance] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editCategory, setEditCategory] = useState<TargetCategory>('philanthropy_active');

  const contextValue = note?.context ?? '';

  if (!target) return null;

  const startEditing = () => {
    setEditName(target.name);
    setEditAmount(target.amountSignal || '');
    setEditInstrument(target.instrument || '');
    setEditContactName(target.contactName || '');
    setEditContactEmail(target.contactEmail || '');
    setEditNextAction(target.nextAction);
    setEditGrantRelevance(target.grantRelevance);
    setEditPriority(target.priority);
    setEditCategory(target.category);
    setEditing(true);
  };

  const saveEdits = () => {
    onTargetUpdate(target.id, {
      name: editName,
      amountSignal: editAmount || undefined,
      instrument: editInstrument || undefined,
      contactName: editContactName || undefined,
      contactEmail: editContactEmail || undefined,
      nextAction: editNextAction,
      grantRelevance: editGrantRelevance,
      priority: editPriority,
      category: editCategory,
    });
    setEditing(false);
  };

  const inputClass = 'w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';

  const ALL_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
  const ALL_CATEGORIES: TargetCategory[] = [
    'philanthropy_active', 'philanthropy_pipeline', 'philanthropy_prospect',
    'aboriginal_trust', 'government_grant', 'impact_finance', 'corporate',
    'health_buyer', 'procurement_buyer', 'distribution_partner',
    'community_partner', 'manufacturing_partner',
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) { setEditing(false); setConfirmDelete(false); } onOpenChange(o); }}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              {editing ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className={`${inputClass} font-semibold text-base`} />
              ) : (
                <SheetTitle>{target.name}</SheetTitle>
              )}
              <SheetDescription>
                {editing ? (
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value as TargetCategory)}
                    className="mt-1 text-xs rounded border border-gray-300 px-2 py-1 bg-white">
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                ) : (
                  <>
                    <Badge className={`${CATEGORY_COLORS[target.category]} mr-2`}>{CATEGORY_LABELS[target.category]}</Badge>
                    <Badge className={STATUS_BADGE[target.status]}>{target.status}</Badge>
                  </>
                )}
              </SheetDescription>
            </div>
            <button
              onClick={editing ? saveEdits : startEditing}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors shrink-0 mt-1 ${
                editing
                  ? 'bg-orange-600 border-orange-600 text-white hover:bg-orange-500'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          {/* Status changer */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Stage</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.map((s) => (
                <button key={s} onClick={() => onStatusChange(target.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    target.status === s ? 'bg-orange-50 border-orange-400 text-orange-700 font-medium' : 'border-gray-200 text-gray-500 hover:border-orange-300'
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Priority</label>
            {editing ? (
              <div className="flex gap-1.5">
                {ALL_PRIORITIES.map(p => (
                  <button key={p} onClick={() => setEditPriority(p)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                      editPriority === p ? 'bg-orange-50 border-orange-400 text-orange-700 font-medium' : 'border-gray-200 text-gray-500 hover:border-orange-300'
                    }`}>{p}</button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[target.priority]}`} />
                <span className="text-sm text-gray-600 capitalize">{target.priority}</span>
              </div>
            )}
          </div>

          {/* Amount Signal */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Amount Signal</label>
            {editing ? (
              <input value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="e.g. $200K pending" className={inputClass} />
            ) : (
              <p className="text-sm font-medium text-gray-900">{target.amountSignal || <span className="text-gray-400">—</span>}</p>
            )}
          </div>

          {/* Instrument */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Instrument</label>
            {editing ? (
              <input value={editInstrument} onChange={e => setEditInstrument(e.target.value)} placeholder="e.g. grant, loan, co-investment" className={inputClass} />
            ) : (
              <p className="text-sm text-gray-700 capitalize">{target.instrument || <span className="text-gray-400">—</span>}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Contact</label>
            {editing ? (
              <div className="space-y-1.5">
                <input value={editContactName} onChange={e => setEditContactName(e.target.value)} placeholder="Contact name" className={inputClass} />
                <input value={editContactEmail} onChange={e => setEditContactEmail(e.target.value)} placeholder="email@example.com" type="email" className={inputClass} />
              </div>
            ) : (
              <div>
                {target.contactName ? <p className="text-sm text-gray-900">{target.contactName}</p> : null}
                {target.contactEmail ? (
                  <a href={`mailto:${target.contactEmail}`} className="text-sm text-orange-600 hover:underline">{target.contactEmail}</a>
                ) : null}
                {!target.contactName && !target.contactEmail && <span className="text-sm text-gray-400">—</span>}
              </div>
            )}
          </div>

          {/* States */}
          {target.states && target.states.length > 0 && !editing && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">States</label>
              <div className="flex gap-1">{target.states.map(s => <Badge key={s} className="bg-gray-100 text-gray-700 text-[10px]">{s}</Badge>)}</div>
            </div>
          )}

          {/* Next Action */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Next Action</label>
            {editing ? (
              <textarea value={editNextAction} onChange={e => setEditNextAction(e.target.value)} rows={3} className={inputClass} />
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{target.nextAction}</p>
            )}
          </div>

          {/* Grant Relevance */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Why They Fit</label>
            {editing ? (
              <textarea value={editGrantRelevance} onChange={e => setEditGrantRelevance(e.target.value)} rows={3} className={inputClass} />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{target.grantRelevance}</p>
            )}
          </div>

          {editing && (
            <div className="flex gap-2 pt-2">
              <button onClick={saveEdits}
                className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors">
                Save Changes
              </button>
              <button onClick={() => setEditing(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          )}

          {/* Context Notes — always editable */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Context / Notes</label>
            <textarea
              defaultValue={contextValue}
              key={target.id}
              onBlur={(e) => onNoteUpdate(target.id, { context: e.target.value })}
              placeholder="Add context, meeting notes, follow-up details..."
              rows={4}
              className={inputClass}
            />
            {note?.lastUpdated && (
              <p className="text-[10px] text-gray-400 mt-1">Last updated {new Date(note.lastUpdated).toLocaleDateString('en-AU')}</p>
            )}
          </div>

          {/* Links — always editable */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Links</label>
            {note?.links && note.links.length > 0 && (
              <div className="space-y-1 mb-2">
                {note.links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <a href={link} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-orange-600 hover:underline truncate flex-1">
                      {link}
                    </a>
                    <button
                      onClick={() => {
                        const updated = note.links!.filter((_, idx) => idx !== i);
                        onNoteUpdate(target.id, { links: updated });
                      }}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newLink.trim()) {
                    onNoteUpdate(target.id, { links: [...(note?.links || []), newLink.trim()] });
                    setNewLink('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newLink.trim()) {
                    onNoteUpdate(target.id, { links: [...(note?.links || []), newLink.trim()] });
                    setNewLink('');
                  }
                }}
                className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-500 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Delete */}
          <div className="border-t border-gray-200 pt-4">
            {confirmDelete ? (
              <div className="space-y-2">
                <p className="text-xs text-red-600 font-medium">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDelete(target.id)}
                    className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors"
              >
                Delete this relationship
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add Target Dialog
// ─────────────────────────────────────────────────────────────────────────────

function AddTargetDialog({
  open, onOpenChange, onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (target: OutreachTarget) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TargetCategory>('philanthropy_active');
  const [status, setStatus] = useState<RelationshipStatus>('prospect');
  const [priority, setPriority] = useState<Priority>('medium');
  const [amountSignal, setAmountSignal] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [grantRelevance, setGrantRelevance] = useState('');

  const inputClass = 'w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';

  const ALL_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
  const ALL_CATEGORIES: TargetCategory[] = [
    'philanthropy_active', 'philanthropy_pipeline', 'philanthropy_prospect',
    'aboriginal_trust', 'government_grant', 'impact_finance', 'corporate',
    'health_buyer', 'procurement_buyer', 'distribution_partner',
    'community_partner', 'manufacturing_partner',
  ];

  const reset = () => {
    setName(''); setCategory('philanthropy_active'); setStatus('prospect');
    setPriority('medium'); setAmountSignal(''); setContactName('');
    setContactEmail(''); setNextAction(''); setGrantRelevance('');
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      status,
      priority,
      amountSignal: amountSignal || undefined,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      nextAction: nextAction || '',
      grantRelevance: grantRelevance || '',
    });
    reset();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { reset(); onOpenChange(false); }} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add New Relationship</h2>
          <button onClick={() => { reset(); onOpenChange(false); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Organisation or person name" className={inputClass} autoFocus />
          </div>

          {/* Category + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TargetCategory)} className={inputClass}>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as RelationshipStatus)} className={inputClass}>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Priority</label>
            <div className="flex gap-1.5">
              {ALL_PRIORITIES.map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    priority === p ? 'bg-orange-50 border-orange-400 text-orange-700 font-medium' : 'border-gray-200 text-gray-500 hover:border-orange-300'
                  }`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Amount Signal</label>
            <input value={amountSignal} onChange={e => setAmountSignal(e.target.value)} placeholder="e.g. $200K pending" className={inputClass} />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Contact Name</label>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact person" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Contact Email</label>
              <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@example.com" type="email" className={inputClass} />
            </div>
          </div>

          {/* Next Action */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Next Action</label>
            <textarea value={nextAction} onChange={e => setNextAction(e.target.value)} rows={2} placeholder="What's the next step?" className={inputClass} />
          </div>

          {/* Grant Relevance */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Why They Fit</label>
            <textarea value={grantRelevance} onChange={e => setGrantRelevance(e.target.value)} rows={2} placeholder="Why is this relationship relevant?" className={inputClass} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end gap-2">
          <button onClick={() => { reset(); onOpenChange(false); }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={!name.trim()}
            className="rounded-md bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Add Relationship
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1: Pipeline — Kanban board, drag cards between status columns
// ─────────────────────────────────────────────────────────────────────────────

type PipelineFilter = 'all' | 'capital' | 'procurement' | 'health' | 'community';

const KANBAN_COLUMNS: { key: RelationshipStatus; label: string; color: string; headerBg: string; dropBg: string }[] = [
  { key: 'active', label: 'Active', color: 'text-green-700', headerBg: 'bg-green-50 border-green-200', dropBg: 'bg-green-50/50' },
  { key: 'warm', label: 'Warm', color: 'text-amber-700', headerBg: 'bg-amber-50 border-amber-200', dropBg: 'bg-amber-50/50' },
  { key: 'applied', label: 'Applied', color: 'text-blue-700', headerBg: 'bg-blue-50 border-blue-200', dropBg: 'bg-blue-50/50' },
  { key: 'prospect', label: 'Prospect', color: 'text-purple-700', headerBg: 'bg-purple-50 border-purple-200', dropBg: 'bg-purple-50/50' },
  { key: 'research', label: 'Research', color: 'text-gray-600', headerBg: 'bg-gray-50 border-gray-200', dropBg: 'bg-gray-50/50' },
];

function PipelineView({
  targets, notes, onSelect, onStatusChange,
}: {
  targets: OutreachTarget[];
  notes: Record<string, LocalNote>;
  onSelect: (t: OutreachTarget) => void;
  onStatusChange: (id: string, status: RelationshipStatus) => void;
}) {
  const [filter, setFilter] = useState<PipelineFilter>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RelationshipStatus | null>(null);

  const filtered = useMemo(() => {
    let result = [...targets];
    if (filter === 'capital') {
      result = result.filter(t => ['philanthropy_active', 'philanthropy_pipeline', 'philanthropy_prospect', 'aboriginal_trust', 'government_grant', 'impact_finance'].includes(t.category));
    } else if (filter === 'procurement') {
      result = result.filter(t => ['procurement_buyer', 'corporate'].includes(t.category));
    } else if (filter === 'health') {
      result = result.filter(t => t.category === 'health_buyer');
    } else if (filter === 'community') {
      result = result.filter(t => ['community_partner', 'manufacturing_partner', 'distribution_partner'].includes(t.category));
    }
    return result;
  }, [targets, filter]);

  const grouped = useMemo(() => {
    const groups: Record<RelationshipStatus, OutreachTarget[]> = {
      active: [], warm: [], applied: [], prospect: [], research: [],
    };
    const po: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    for (const t of filtered) {
      groups[t.status]?.push(t);
    }
    // Sort each column by priority
    for (const key of Object.keys(groups) as RelationshipStatus[]) {
      groups[key].sort((a, b) => (po[a.priority] ?? 3) - (po[b.priority] ?? 3));
    }
    return groups;
  }, [filtered]);

  const filterOptions: { key: PipelineFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: targets.length },
    { key: 'capital', label: 'Capital & Grants', count: targets.filter(t => ['philanthropy_active', 'philanthropy_pipeline', 'philanthropy_prospect', 'aboriginal_trust', 'government_grant', 'impact_finance'].includes(t.category)).length },
    { key: 'procurement', label: 'Procurement', count: targets.filter(t => ['procurement_buyer', 'corporate'].includes(t.category)).length },
    { key: 'health', label: 'Health', count: targets.filter(t => t.category === 'health_buyer').length },
    { key: 'community', label: 'Community & Mfg', count: targets.filter(t => ['community_partner', 'manufacturing_partner', 'distribution_partner'].includes(t.category)).length },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, col: RelationshipStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(col);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, col: RelationshipStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onStatusChange(id, col);
    }
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === f.key
                ? 'bg-orange-50 border-orange-400 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:border-orange-300'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-5 gap-3 min-h-[500px]">
        {KANBAN_COLUMNS.map((col) => {
          const items = grouped[col.key] || [];
          const isOver = dragOverColumn === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`rounded-lg border transition-colors ${
                isOver ? `${col.dropBg} border-orange-400 ring-2 ring-orange-200` : 'border-gray-200 bg-gray-50/30'
              }`}
            >
              {/* Column header */}
              <div className={`rounded-t-lg border-b px-3 py-2.5 ${col.headerBg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-semibold uppercase tracking-wide ${col.color}`}>
                    {col.label}
                  </h3>
                  <span className={`text-xs font-medium ${col.color}`}>{items.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[100px]">
                {items.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onSelect(t)}
                    className={`bg-white rounded-lg border border-gray-200 p-2.5 cursor-grab active:cursor-grabbing hover:border-orange-300 hover:shadow-sm transition-all ${
                      draggingId === t.id ? 'opacity-40 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start gap-1.5 mb-1.5">
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${PRIORITY_DOT[t.priority]}`} />
                      <p className="text-sm font-medium text-gray-900 leading-tight">{t.name}</p>
                    </div>

                    <Badge className={`text-[9px] ${CATEGORY_COLORS[t.category]} mb-1.5`}>
                      {CATEGORY_LABELS[t.category]}
                    </Badge>

                    {t.amountSignal && (
                      <p className="text-xs font-medium text-gray-700 mb-1">{t.amountSignal}</p>
                    )}

                    {t.contactName && (
                      <p className="text-[11px] text-gray-500 mb-1">{t.contactName}</p>
                    )}

                    <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{t.nextAction}</p>

                    {notes[t.id]?.context && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-[9px] text-orange-500 font-medium">has notes</span>
                      </div>
                    )}

                    {/* Quick move buttons */}
                    <div className="mt-2 flex gap-1 border-t border-gray-100 pt-1.5">
                      {ALL_STATUSES.filter(s => s !== t.status).slice(0, 3).map(s => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); onStatusChange(t.id, s); }}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-600 transition-colors"
                          title={`Move to ${s}`}
                        >
                          &rarr; {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-gray-400 italic">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2: Foundations — capital/grant focused
// ─────────────────────────────────────────────────────────────────────────────

function FoundationsView({
  targets, notes, onSelect, onStatusChange,
}: {
  targets: OutreachTarget[];
  notes: Record<string, LocalNote>;
  onSelect: (t: OutreachTarget) => void;
  onStatusChange: (id: string, status: RelationshipStatus) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<RelationshipStatus | 'all'>('all');

  const foundations = useMemo(() => {
    const capitalCategories = new Set([
      'philanthropy_active', 'philanthropy_pipeline', 'philanthropy_prospect',
      'aboriginal_trust', 'government_grant', 'impact_finance',
    ]);
    let result = targets.filter(t => capitalCategories.has(t.category));

    // Also add funding records not in targets
    const targetNames = new Set(result.map(t => t.name.toLowerCase()));
    for (const f of funding) {
      const exists = Array.from(targetNames).some(
        n => n.includes(f.source.toLowerCase().split(' ')[0]) ||
             f.source.toLowerCase().includes(n.split(' ')[0])
      );
      if (!exists) {
        result.push({
          id: `funding-${f.id}`,
          name: f.source,
          category: 'philanthropy_active',
          status: f.status === 'received' ? 'active' : f.status === 'pending' ? 'applied' : 'warm',
          priority: f.amount >= 200_000 ? 'critical' : f.amount >= 50_000 ? 'high' : 'medium',
          amountSignal: formatCurrency(f.amount),
          contactName: f.contact,
          contactEmail: f.contactEmail,
          nextAction: f.notes || '',
          grantRelevance: f.program || '',
        });
      }
    }

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    const po: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return result.sort((a, b) => (po[a.priority] ?? 3) - (po[b.priority] ?? 3));
  }, [targets, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {(['all', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? 'bg-orange-50 border-orange-400 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:border-orange-300'
            }`}
          >
            {s === 'all' ? `All (${foundations.length})` : s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 pr-2 w-4"></th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Foundation</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Next Action</th>
              <th className="py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Why They Fit</th>
            </tr>
          </thead>
          <tbody>
            {foundations.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                className="border-b border-gray-100 hover:bg-orange-50/50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 pr-2">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[t.priority]}`} title={t.priority} />
                </td>
                <td className="py-2.5 pr-3 font-medium text-gray-900">{t.name}</td>
                <td className="py-2.5 pr-3">
                  <Badge className={`text-[10px] ${CATEGORY_COLORS[t.category]}`}>
                    {CATEGORY_LABELS[t.category]}
                  </Badge>
                </td>
                <td className="py-2.5 pr-3">
                  <select
                    value={t.status}
                    onChange={(e) => { e.stopPropagation(); onStatusChange(t.id, e.target.value as RelationshipStatus); }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[11px] px-2 py-0.5 rounded-full border-0 font-medium ${STATUS_BADGE[t.status]} cursor-pointer`}
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-2.5 pr-3 text-xs text-gray-700 whitespace-nowrap">{t.amountSignal || '—'}</td>
                <td className="py-2.5 pr-3 text-xs">
                  {t.contactName && <span className="text-gray-700">{t.contactName}</span>}
                  {t.contactEmail && (
                    <a href={`mailto:${t.contactEmail}`} onClick={e => e.stopPropagation()}
                       className="block text-orange-600 hover:underline text-[11px]">
                      {t.contactEmail}
                    </a>
                  )}
                  {!t.contactName && !t.contactEmail && <span className="text-gray-400">—</span>}
                </td>
                <td className="py-2.5 pr-3 max-w-[220px]">
                  <p className="text-xs text-gray-600 line-clamp-2">{t.nextAction || '—'}</p>
                </td>
                <td className="py-2.5 max-w-[180px]">
                  <p className="text-xs text-gray-500 line-clamp-2">{t.grantRelevance || '—'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 3: Communities — warm communities & demand signals
// ─────────────────────────────────────────────────────────────────────────────

function CommunitiesView({
  targets, notes, onSelect,
}: {
  targets: OutreachTarget[];
  notes: Record<string, LocalNote>;
  onSelect: (t: OutreachTarget) => void;
}) {
  const communityData = useMemo(() => {
    // Merge deployments + community partners + community targets + demand
    const rows: {
      id: string;
      community: string;
      state: string;
      beds: number;
      washers: number;
      partner?: string;
      contact?: string;
      demandSignal?: string;
      status: string;
      target?: OutreachTarget;
    }[] = [];

    // Start with deployments
    for (const d of deployments) {
      const demand = documentedDemand.find(
        dm => dm.requester.toLowerCase().includes(d.community.toLowerCase()) ||
              d.community.toLowerCase().includes(dm.requester.toLowerCase().split(' ')[0])
      );

      // Find matching community partner target
      const matchTarget = targets.find(
        t => ['community_partner'].includes(t.category) &&
             (t.name.toLowerCase().includes(d.community.toLowerCase()) ||
              d.partner?.toLowerCase().includes(t.name.toLowerCase().split(' ')[0]))
      );

      rows.push({
        id: d.id,
        community: d.traditionalName ? `${d.community} (${d.traditionalName})` : d.community,
        state: d.state,
        beds: d.beds,
        washers: d.washers,
        partner: d.partner,
        contact: d.contacts?.join(', '),
        demandSignal: demand?.request,
        status: d.status,
        target: matchTarget,
      });
    }

    // Add demand records not already covered by deployments
    for (const dm of documentedDemand) {
      const alreadyCovered = rows.some(r =>
        r.community.toLowerCase().includes(dm.requester.toLowerCase().split(' ')[0]) ||
        dm.requester.toLowerCase().includes(r.community.toLowerCase().split(' ')[0])
      );
      if (!alreadyCovered) {
        rows.push({
          id: `demand-${dm.id}`,
          community: dm.requester,
          state: '',
          beds: 0,
          washers: 0,
          demandSignal: dm.request,
          status: dm.status,
        });
      }
    }

    return rows;
  }, [targets]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Communities we&apos;re working with or should be talking to, plus demand signals.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Community</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">State</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Beds</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Washers</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Partner</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Demand Signal</th>
              <th className="py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {communityData.map((row) => (
              <tr
                key={row.id}
                onClick={() => row.target && onSelect(row.target)}
                className={`border-b border-gray-100 transition-colors ${row.target ? 'hover:bg-orange-50/50 cursor-pointer' : 'hover:bg-gray-50'}`}
              >
                <td className="py-2.5 pr-3 font-medium text-gray-900">{row.community}</td>
                <td className="py-2.5 pr-3">
                  {row.state && <Badge className="bg-gray-100 text-gray-700 text-[10px]">{row.state}</Badge>}
                </td>
                <td className="py-2.5 pr-3 text-gray-700">{row.beds > 0 ? row.beds : '—'}</td>
                <td className="py-2.5 pr-3 text-gray-700">{row.washers > 0 ? row.washers : '—'}</td>
                <td className="py-2.5 pr-3 text-xs text-gray-600">{row.partner || '—'}</td>
                <td className="py-2.5 pr-3 text-xs text-gray-600">{row.contact || '—'}</td>
                <td className="py-2.5 pr-3 max-w-[220px]">
                  {row.demandSignal ? (
                    <p className="text-xs text-orange-700 font-medium line-clamp-2">{row.demandSignal}</p>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="py-2.5">
                  <Badge className={
                    row.status === 'active' ? 'bg-green-100 text-green-800' :
                    row.status === 'testing' ? 'bg-blue-100 text-blue-800' :
                    row.status === 'approved' ? 'bg-green-100 text-green-800' :
                    row.status === 'requested' ? 'bg-amber-100 text-amber-800' :
                    row.status === 'exploring' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-600'
                  }>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 4: Partners — community, manufacturing, distribution partners
// ─────────────────────────────────────────────────────────────────────────────

function PartnersView({
  targets, notes, onSelect, onStatusChange,
}: {
  targets: OutreachTarget[];
  notes: Record<string, LocalNote>;
  onSelect: (t: OutreachTarget) => void;
  onStatusChange: (id: string, status: RelationshipStatus) => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'community_partner' | 'manufacturing_partner' | 'distribution_partner'>('all');

  const partners = useMemo(() => {
    const partnerCategories = ['community_partner', 'manufacturing_partner', 'distribution_partner'];
    let result = targets.filter(t => partnerCategories.includes(t.category));
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }
    const po: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return result.sort((a, b) => (po[a.priority] ?? 3) - (po[b.priority] ?? 3));
  }, [targets, categoryFilter]);

  const catFilters: { key: typeof categoryFilter; label: string }[] = [
    { key: 'all', label: 'All Partners' },
    { key: 'community_partner', label: 'Community' },
    { key: 'manufacturing_partner', label: 'Manufacturing' },
    { key: 'distribution_partner', label: 'Distribution' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Community, manufacturing, and distribution partners we work with.
      </p>

      <div className="flex gap-1.5 flex-wrap">
        {catFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setCategoryFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === f.key
                ? 'bg-orange-50 border-orange-400 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:border-orange-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 pr-2 w-4"></th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Partner</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">States</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Next Action</th>
              <th className="py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Grant Relevance</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                className="border-b border-gray-100 hover:bg-orange-50/50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 pr-2">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[t.priority]}`} title={t.priority} />
                </td>
                <td className="py-2.5 pr-3 font-medium text-gray-900">
                  {t.name}
                  {t.amountSignal && <p className="text-[11px] text-gray-500 font-normal mt-0.5">{t.amountSignal}</p>}
                </td>
                <td className="py-2.5 pr-3">
                  <Badge className={`text-[10px] ${CATEGORY_COLORS[t.category]}`}>
                    {CATEGORY_LABELS[t.category]}
                  </Badge>
                </td>
                <td className="py-2.5 pr-3">
                  <select
                    value={t.status}
                    onChange={(e) => { e.stopPropagation(); onStatusChange(t.id, e.target.value as RelationshipStatus); }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[11px] px-2 py-0.5 rounded-full border-0 font-medium ${STATUS_BADGE[t.status]} cursor-pointer`}
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-2.5 pr-3">
                  {t.states && t.states.length > 0 ? (
                    <div className="flex gap-1">
                      {t.states.map(s => <Badge key={s} className="bg-gray-100 text-gray-700 text-[10px]">{s}</Badge>)}
                    </div>
                  ) : <span className="text-gray-400 text-xs">—</span>}
                </td>
                <td className="py-2.5 pr-3 text-xs">
                  {t.contactName && <span className="text-gray-700">{t.contactName}</span>}
                  {t.contactEmail && (
                    <a href={`mailto:${t.contactEmail}`} onClick={e => e.stopPropagation()}
                       className="block text-orange-600 hover:underline text-[11px]">
                      {t.contactEmail}
                    </a>
                  )}
                  {!t.contactName && !t.contactEmail && <span className="text-gray-400">—</span>}
                </td>
                <td className="py-2.5 pr-3 max-w-[220px]">
                  <p className="text-xs text-gray-600 line-clamp-2">{t.nextAction}</p>
                </td>
                <td className="py-2.5 max-w-[180px]">
                  <p className="text-xs text-gray-500 line-clamp-2">{t.grantRelevance}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 5: Procurement — who buys goods for communities
// ─────────────────────────────────────────────────────────────────────────────

function ProcurementView({
  targets, notes, onSelect, onStatusChange,
}: {
  targets: OutreachTarget[];
  notes: Record<string, LocalNote>;
  onSelect: (t: OutreachTarget) => void;
  onStatusChange: (id: string, status: RelationshipStatus) => void;
}) {
  const buyers = useMemo(() => {
    return targets
      .filter(t => ['procurement_buyer', 'health_buyer', 'corporate'].includes(t.category))
      .sort((a, b) => {
        const po: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return (po[a.priority] ?? 3) - (po[b.priority] ?? 3);
      });
  }, [targets]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Organisations procuring beds, washing machines, and health hardware for communities.
      </p>

      {/* Buyer table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 pr-2 w-4"></th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Organisation</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount / Signal</th>
              <th className="py-2 pr-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                className="border-b border-gray-100 hover:bg-orange-50/50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 pr-2">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[t.priority]}`} title={t.priority} />
                </td>
                <td className="py-2.5 pr-3 font-medium text-gray-900">
                  {t.name}
                  {t.states && t.states.length > 0 && (
                    <span className="ml-2 text-[10px] text-gray-400">{t.states.join(', ')}</span>
                  )}
                </td>
                <td className="py-2.5 pr-3">
                  <Badge className={`text-[10px] ${CATEGORY_COLORS[t.category]}`}>
                    {CATEGORY_LABELS[t.category]}
                  </Badge>
                </td>
                <td className="py-2.5 pr-3">
                  <select
                    value={t.status}
                    onChange={(e) => { e.stopPropagation(); onStatusChange(t.id, e.target.value as RelationshipStatus); }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[11px] px-2 py-0.5 rounded-full border-0 font-medium ${STATUS_BADGE[t.status]} cursor-pointer`}
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-2.5 pr-3 text-xs text-gray-700">{t.amountSignal || '—'}</td>
                <td className="py-2.5 pr-3 text-xs text-gray-600">{t.contactName || '—'}</td>
                <td className="py-2.5 max-w-[280px]">
                  <p className="text-xs text-gray-500 line-clamp-2">{t.nextAction}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Capital Pathways */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Strategic Capital Pathways</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capitalPathways.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-600">{p.summary}</p>
                <p className="text-xs text-gray-500 italic">{p.thesis}</p>
                <div className="flex flex-wrap gap-1">
                  {p.targets.map((tid) => {
                    const t = targets.find(x => x.id === tid);
                    return (
                      <Badge
                        key={tid}
                        className={`text-[10px] cursor-pointer hover:opacity-80 ${t ? STATUS_BADGE[t.status] : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => t && onSelect(t)}
                      >
                        {t?.name || tid}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 5: Grant Composer (existing functionality)
// ─────────────────────────────────────────────────────────────────────────────

const ALL_SECTIONS: { id: GrantSection; label: string }[] = [
  { id: 'org_identity', label: 'Organisation Identity' },
  { id: 'founders', label: 'Founders' },
  { id: 'problem', label: 'Problem Statement' },
  { id: 'solution', label: 'Our Solution' },
  { id: 'impact', label: 'Impact to Date' },
  { id: 'financials', label: 'Financial Position' },
  { id: 'community_voices', label: 'Community Voices' },
  { id: 'use_of_funds', label: 'Use of Funds' },
  { id: 'eligibility', label: 'Eligibility' },
];

const FUNDING_PURPOSES: { id: FundingPurpose; label: string; description: string }[] = [
  { id: 'beds', label: 'Beds', description: '$600–850 per bed deployed' },
  { id: 'production', label: 'Production Facility', description: '$100K for containerised facility' },
  { id: 'washers', label: 'Washing Machines', description: '$4,000 per unit with telemetry' },
  { id: 'scale', label: 'Scale (500+ beds)', description: '$500K working capital + supply chain' },
];

const SUGGESTED_FUNDERS = [
  'Snow Foundation', 'FRRR', 'Vincent Fairfax Family Foundation', 'Tim Fairfax Family Foundation',
  'Paul Ramsay Foundation', 'Dusseldorp Forum', 'Giant Leap Fund', 'IBA', 'NIAA', 'Centrecorp Foundation',
];

function GrantComposer() {
  const [funderName, setFunderName] = useState('');
  const [selectedSections, setSelectedSections] = useState<GrantSection[]>([
    'org_identity', 'problem', 'solution', 'impact', 'community_voices', 'financials', 'use_of_funds', 'eligibility',
  ]);
  const [fundingPurpose, setFundingPurpose] = useState<FundingPurpose>('beds');
  const [composedGrant, setComposedGrant] = useState<ComposedGrant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSection = (id: GrantSection) => {
    setSelectedSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const compose = async () => {
    if (!funderName.trim()) { setError('Enter a funder name'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/grants/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funderName: funderName.trim(), sections: selectedSections, fundingPurpose }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Failed to compose'); }
      setComposedGrant(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compose grant');
    } finally { setLoading(false); }
  };

  const exportMarkdown = () => {
    if (!composedGrant) return;
    const lines = [
      `# Grant Application — ${composedGrant.funderName}`,
      `*Generated ${new Date(composedGrant.generatedAt).toLocaleDateString('en-AU', { dateStyle: 'long' })}*`, '',
    ];
    for (const section of composedGrant.sections) lines.push(`## ${section.title}`, '', section.content, '');
    lines.push('---', '*Prepared by Goods on Country (www.goodsoncountry.com)*');
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `grant-${composedGrant.funderName.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click(); URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!composedGrant) return;
    const text = composedGrant.sections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Auto-fill grant applications from verified content. Every claim is sourced from the master compendium.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Funder / Grant Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text" value={funderName} onChange={(e) => setFunderName(e.target.value)}
              placeholder="Enter funder name..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_FUNDERS.map((name) => (
                <button key={name} onClick={() => setFunderName(name)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    funderName === name ? 'bg-orange-50 border-orange-400 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-orange-300 hover:text-gray-700'
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Sections to Include</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ALL_SECTIONS.map((section) => (
                <label key={section.id} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedSections.includes(section.id)} onChange={() => toggleSection(section.id)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{section.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Funding Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {FUNDING_PURPOSES.map((purpose) => (
                <label key={purpose.id} className="flex items-start gap-2 cursor-pointer group">
                  <input type="radio" name="fundingPurpose" checked={fundingPurpose === purpose.id} onChange={() => setFundingPurpose(purpose.id)}
                    className="mt-0.5 border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{purpose.label}</span>
                    <p className="text-xs text-gray-400">{purpose.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={compose} disabled={loading || !funderName.trim()}
          className="rounded-md bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Composing...' : 'Compose Application'}
        </button>
        {composedGrant && (
          <>
            <button onClick={exportMarkdown}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Export Markdown
            </button>
            <button onClick={copyToClipboard}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {composedGrant && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{composedGrant.funderName}</h2>
            <Badge className="bg-green-100 text-green-800">{composedGrant.sections.length} sections</Badge>
            <span className="text-xs text-gray-400">Generated {new Date(composedGrant.generatedAt).toLocaleString('en-AU')}</span>
          </div>
          {composedGrant.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-orange-600">{section.title}</CardTitle>
                  <button onClick={async () => { await navigator.clipboard.writeText(section.content); }}
                    className="text-xs text-gray-400 hover:text-orange-600 transition-colors">
                    Copy section
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{section.content}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
