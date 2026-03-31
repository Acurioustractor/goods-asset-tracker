'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Target,
  DollarSign,
  MapPin,
  Building2,
  Heart,
  Leaf,
  Users,
  ArrowRight,
  CheckCircle2,
  Circle,
  Star,
  Filter,
  Handshake,
  TrendingUp,
  Banknote,
  Scale,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── Types ──────────────────────────────────────────────────────────────────

type CapitalType = 'grant' | 'catalytic' | 'pri_debt' | 'recoverable' | 'loan_guarantee' | 'equity' | 'crowdfunding';
type Relationship = 'active' | 'warm' | 'applied' | 'prospect' | 'new';
type AlignmentLevel = 'perfect' | 'strong' | 'moderate' | 'weak';

interface Foundation {
  name: string;
  capitalTypes: CapitalType[];
  annualGiving?: string;
  relationship: Relationship;
  // Knockout criteria (from QBE session)
  geography: number; // 0-10: invests in NT/remote/QLD
  legalStructure: number; // 0-10: invests in NFP/hybrid/social enterprise
  investmentSize: number; // 0-10: matches our ask range
  returnExpectations: number; // 0-10: aligns on impact-first
  capitalFit: number; // 0-10: offers what we need
  growthStage: number; // 0-10: invests at our stage
  // Thematic alignment
  indigenous: boolean;
  remoteHousing: boolean;
  circularEconomy: boolean;
  healthOutcomes: boolean;
  socialEnterprise: boolean;
  communityOwnership: boolean;
  climateResilience: boolean; // QBE Foundation focus
  // Context
  notes: string;
  qbeInsight?: string; // what we learned from QBE session about this funder
  amountSignal?: string;
  contactName?: string;
  nextAction: string;
}

// ─── Foundation Data ────────────────────────────────────────────────────────

const FOUNDATIONS: Foundation[] = [
  // ─── Active Funders ───
  {
    name: 'Snow Foundation',
    capitalTypes: ['grant', 'loan_guarantee'],
    annualGiving: '$10M+',
    relationship: 'active',
    geography: 10, legalStructure: 10, investmentSize: 9, returnExpectations: 10, capitalFit: 10, growthStage: 10,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: 'Anchor funder. $193K received + $200K R4 pending. Sally travelled to Tennant Creek.',
    qbeInsight: 'Beck named Snow in Jigsaw case study as co-investor. Does long-term enterprise partnerships with flexible capital. Could shift from pure grant to blended: grant + loan guarantee for SEFA.',
    amountSignal: '$400K ($193K received + $200K pending)',
    contactName: 'Sally Grimsley-Ballard',
    nextAction: 'Propose blended capital conversation: grant + loan guarantee to de-risk SEFA debt.',
  },
  {
    name: 'QBE Foundation',
    capitalTypes: ['grant', 'catalytic'],
    annualGiving: '$5M+',
    relationship: 'active',
    geography: 9, legalStructure: 9, investmentSize: 8, returnExpectations: 10, capitalFit: 10, growthStage: 10,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: true,
    notes: 'WE ARE IN THE PROGRAM. $10K Stage 1 secured. Stage 2: $150-400K catalytic grant.',
    qbeInsight: 'Year 1 unlocked $3.77M total. 50% Stage 2 hit rate. Selection formula: "degree to which funding leverages further funding." MULTIPLIER STORY WINS.',
    amountSignal: '$10K secured + $150-400K Stage 2',
    nextAction: 'Build multiplier story. Secure external LOIs before Stage 2 application.',
  },
  {
    name: 'FRRR (Foundation for Rural & Regional Renewal)',
    capitalTypes: ['grant'],
    annualGiving: '$20M+',
    relationship: 'active',
    geography: 10, legalStructure: 9, investmentSize: 6, returnExpectations: 10, capitalFit: 8, growthStage: 8,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '$50K received via Backing the Future. Validates remote community focus.',
    nextAction: 'Explore other FRRR programs. Position next ask around production proof.',
  },
  {
    name: 'Vincent Fairfax Family Foundation',
    capitalTypes: ['grant'],
    annualGiving: '$5M+',
    relationship: 'active',
    geography: 7, legalStructure: 9, investmentSize: 6, returnExpectations: 10, capitalFit: 8, growthStage: 8,
    indigenous: true, remoteHousing: false, circularEconomy: false, healthOutcomes: false, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '$50K received. Youth + governance focus.',
    nextAction: 'Reconnect around youth jobs and community ownership.',
  },
  {
    name: 'The Funding Network',
    capitalTypes: ['crowdfunding'],
    annualGiving: '$2M+',
    relationship: 'active',
    geography: 8, legalStructure: 9, investmentSize: 7, returnExpectations: 10, capitalFit: 7, growthStage: 9,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '$130K raised at Sept 2025 pitch. Largest single raise.',
    qbeInsight: 'QBE Stage 2 crowdfunding showcase uses TFN. If we make Stage 2, Nick pitches to 200+ QBE employees via TFN.',
    amountSignal: '$130K received',
    nextAction: 'Maintain relationship. Key partner for QBE Stage 2 showcase.',
  },

  // ─── Pipeline ───
  {
    name: 'SEFA (Social Enterprise Finance Australia)',
    capitalTypes: ['pri_debt', 'loan_guarantee'],
    annualGiving: '$9M deployable',
    relationship: 'warm',
    geography: 9, legalStructure: 10, investmentSize: 9, returnExpectations: 9, capitalFit: 10, growthStage: 9,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '$9M undeployed. 75-80 loans to date. Only 3/75 ever had issues. No early repayment penalties.',
    qbeInsight: 'Hannah (CEO) presented at QBE Session 1. Personalized approach. Requires independent board governance. BOLD agreements link interest to impact outcomes. Process: 2-4 weeks initial → 2-3 months analysis → 2-4 weeks execution.',
    amountSignal: '$300-500K loan target',
    contactName: 'Hannah (CEO) / Joel Bird',
    nextAction: 'START CONVERSATION NOW. Reference QBE program. Package Snow-backed blended ask.',
  },
  {
    name: 'Mindaroo Foundation',
    capitalTypes: ['catalytic', 'recoverable'],
    annualGiving: '$100M+',
    relationship: 'warm',
    geography: 8, legalStructure: 8, investmentSize: 9, returnExpectations: 9, capitalFit: 9, growthStage: 8,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: true,
    notes: '20 comms logged. Sally (Snow) recommended. Lucy Stronach contact.',
    qbeInsight: 'Beck specifically named Mindaroo catalytic capital bucket. Must demonstrate QBE grant crowds in additional investment. Governance scholarships via AICD partnership.',
    amountSignal: '$100-500K catalytic',
    contactName: 'Lucy Stronach',
    nextAction: 'Approach with blended stack showing QBE + Snow + SEFA moving. Ask for catalytic layer.',
  },
  {
    name: 'PFI (QLD Partnering for Impact)',
    capitalTypes: ['recoverable'],
    annualGiving: '$10M+ fund',
    relationship: 'applied',
    geography: 10, legalStructure: 9, investmentSize: 10, returnExpectations: 8, capitalFit: 10, growthStage: 9,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '$640K repayable. EOI submitted Mar 15. QLD Treasury.',
    qbeInsight: 'Jess confirmed QLD Govt launching recoverable grant programs. PFI is exactly this model — repayable without interest.',
    amountSignal: '$640K repayable',
    contactName: 'PFIFund@treasury.qld.gov.au',
    nextAction: 'Follow up EOI status. Lead with Palm Island proof and QLD jobs.',
  },
  {
    name: 'Tim Fairfax Family Foundation',
    capitalTypes: ['grant'],
    annualGiving: '$10M+',
    relationship: 'warm',
    geography: 10, legalStructure: 9, investmentSize: 7, returnExpectations: 10, capitalFit: 8, growthStage: 8,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '33 comms logged. QLD focus. Katie Norman contact.',
    amountSignal: '$50-200K',
    contactName: 'Katie Norman',
    nextAction: 'Lead with Palm Island proof and QLD manufacturing jobs.',
  },
  {
    name: 'IBA (Indigenous Business Australia)',
    capitalTypes: ['pri_debt', 'grant'],
    annualGiving: '$200M+ lending',
    relationship: 'warm',
    geography: 10, legalStructure: 10, investmentSize: 10, returnExpectations: 8, capitalFit: 10, growthStage: 9,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: 'Business Loan up to $5M with 30% grant component ($1.5M). Via Oonchiumpa (51%+ Aboriginal-owned).',
    amountSignal: 'Up to $5M (30% grant)',
    nextAction: 'Complete business plan. Confirm Oonchiumpa eligibility.',
  },

  // ─── QBE-Identified New Prospects ───
  {
    name: 'QBE Ventures (Lighthouse Program)',
    capitalTypes: ['equity'],
    annualGiving: '$50M+ fund',
    relationship: 'new',
    geography: 8, legalStructure: 6, investmentSize: 7, returnExpectations: 5, capitalFit: 5, growthStage: 7,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: false, climateResilience: true,
    notes: 'CVC unit. $5-15M checks. Lighthouse = early discovery funding.',
    qbeInsight: 'Alex: Lighthouse lets them explore value fit for ~1 year with small funding. Think insurance adjacency: bed durability reduces housing claims, flat-pack disaster deployment. "Numbers going up don\'t have to be money."',
    amountSignal: '$50-200K Lighthouse / $5-15M full',
    nextAction: 'Draft 1-page insurance adjacency pitch for Lighthouse program.',
  },
  {
    name: 'Impact Investing Australia',
    capitalTypes: ['catalytic'],
    annualGiving: 'Platform',
    relationship: 'new',
    geography: 10, legalStructure: 10, investmentSize: 10, returnExpectations: 10, capitalFit: 10, growthStage: 10,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: true,
    notes: 'Impact investment map + deal tracker. List your raise publicly.',
    qbeInsight: 'Jess announced interactive map of impact investors coming to IIA website. Deal tracker MVP live. List when ready to raise publicly.',
    nextAction: 'List Goods capital raise when stack is defined.',
  },
  {
    name: 'Lend for Good',
    capitalTypes: ['crowdfunding'],
    annualGiving: 'Platform',
    relationship: 'new',
    geography: 9, legalStructure: 9, investmentSize: 6, returnExpectations: 8, capitalFit: 7, growthStage: 8,
    indigenous: true, remoteHousing: true, circularEconomy: true, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: 'Crowdfunding debt platform. SIH is a provider on Lend for Good.',
    qbeInsight: 'Jess recommended. Community connection is pre-condition for crowd success. Could supplement primary stack with community raise tied to specific deployment.',
    nextAction: 'Evaluate after primary stack built. Tie to specific community deployment.',
  },

  // ─── Prospects from Grantscope ───
  {
    name: 'Centrecorp Foundation',
    capitalTypes: ['grant', 'catalytic'],
    annualGiving: '$5M+',
    relationship: 'warm',
    geography: 10, legalStructure: 10, investmentSize: 8, returnExpectations: 10, capitalFit: 9, growthStage: 9,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: '107 beds APPROVED for Utopia. $420K receivable. Aboriginal investment arm.',
    amountSignal: '$420K+ receivable',
    contactName: 'Randle Walker',
    nextAction: 'Turn buyer proof into blended capital conversation for Central Aus production.',
  },
  {
    name: 'Groote Eylandt Aboriginal Trust',
    capitalTypes: ['grant'],
    annualGiving: '$20M+',
    relationship: 'prospect',
    geography: 10, legalStructure: 9, investmentSize: 9, returnExpectations: 10, capitalFit: 9, growthStage: 8,
    indigenous: true, remoteHousing: true, circularEconomy: false, healthOutcomes: true, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: 'Largest single demand signal: 500 mattresses + 300 washers from WHSAC.',
    amountSignal: 'High annual giving',
    nextAction: 'Use Groote demand signal for place-based production ask.',
  },
  {
    name: 'Dusseldorp Forum',
    capitalTypes: ['grant'],
    annualGiving: '$5M+',
    relationship: 'warm',
    geography: 7, legalStructure: 8, investmentSize: 6, returnExpectations: 10, capitalFit: 7, growthStage: 7,
    indigenous: true, remoteHousing: false, circularEconomy: false, healthOutcomes: false, socialEnterprise: true, communityOwnership: true, climateResilience: false,
    notes: 'Meeting held Oct 2025. Justice reinvestment angle.',
    nextAction: 'Follow up with updated impact data. Justice reinvestment framing.',
  },
  {
    name: 'Giant Leap',
    capitalTypes: ['equity'],
    annualGiving: '$50M+ fund',
    relationship: 'prospect',
    geography: 7, legalStructure: 6, investmentSize: 8, returnExpectations: 5, capitalFit: 4, growthStage: 7,
    indigenous: true, remoteHousing: false, circularEconomy: true, healthOutcomes: false, socialEnterprise: true, communityOwnership: false, climateResilience: true,
    notes: 'Impact VC. Sally (Snow) recommended.',
    nextAction: 'Approach when ready for equity conversation.',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function calculateAlignment(f: Foundation): { score: number; level: AlignmentLevel } {
  // Knockout criteria average (from QBE session)
  const knockoutScore = (f.geography + f.legalStructure + f.investmentSize + f.returnExpectations + f.capitalFit + f.growthStage) / 6;

  // Thematic alignment count
  const themes = [f.indigenous, f.remoteHousing, f.circularEconomy, f.healthOutcomes, f.socialEnterprise, f.communityOwnership, f.climateResilience];
  const themeScore = themes.filter(Boolean).length / themes.length * 10;

  // QBE bonus (has insight from session)
  const qbeBonus = f.qbeInsight ? 0.5 : 0;

  const score = Math.round(((knockoutScore * 0.6) + (themeScore * 0.3) + qbeBonus) * 10) / 10;
  const level: AlignmentLevel = score >= 8.5 ? 'perfect' : score >= 7 ? 'strong' : score >= 5.5 ? 'moderate' : 'weak';

  return { score, level };
}

const ALIGNMENT_COLORS: Record<AlignmentLevel, string> = {
  perfect: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  strong: 'bg-green-100 text-green-800 border-green-300',
  moderate: 'bg-amber-100 text-amber-800 border-amber-300',
  weak: 'bg-slate-100 text-slate-600 border-slate-300',
};

const RELATIONSHIP_COLORS: Record<Relationship, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  warm: 'bg-amber-100 text-amber-800',
  applied: 'bg-blue-100 text-blue-800',
  prospect: 'bg-slate-100 text-slate-600',
  new: 'bg-purple-100 text-purple-800',
};

const CAPITAL_LABELS: Record<CapitalType, string> = {
  grant: 'Grant',
  catalytic: 'Catalytic',
  pri_debt: 'PRI Debt',
  recoverable: 'Recoverable',
  loan_guarantee: 'Guarantee',
  equity: 'Equity',
  crowdfunding: 'Crowdfunding',
};

type SortBy = 'alignment' | 'relationship' | 'name';

// ─── Page ───────────────────────────────────────────────────────────────────

export default function FoundationMatcherPage() {
  const [sortBy, setSortBy] = useState<SortBy>('alignment');
  const [filterRelationship, setFilterRelationship] = useState<Relationship | 'all'>('all');
  const [showQBEOnly, setShowQBEOnly] = useState(false);

  const scored = useMemo(() =>
    FOUNDATIONS.map(f => ({ ...f, ...calculateAlignment(f) })),
    []
  );

  const filtered = useMemo(() => {
    let list = scored;
    if (filterRelationship !== 'all') list = list.filter(f => f.relationship === filterRelationship);
    if (showQBEOnly) list = list.filter(f => f.qbeInsight);
    if (sortBy === 'alignment') list = [...list].sort((a, b) => b.score - a.score);
    else if (sortBy === 'relationship') {
      const order: Record<Relationship, number> = { active: 0, warm: 1, applied: 2, new: 3, prospect: 4 };
      list = [...list].sort((a, b) => order[a.relationship] - order[b.relationship]);
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [scored, filterRelationship, showQBEOnly, sortBy]);

  const avgScore = scored.reduce((s, f) => s + f.score, 0) / scored.length;
  const perfectCount = scored.filter(f => f.level === 'perfect').length;
  const strongCount = scored.filter(f => f.level === 'strong').length;
  const qbeCount = scored.filter(f => f.qbeInsight).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Foundation Match Scorecard</h1>
        </div>
        <p className="text-slate-500">
          Scored against QBE knockout criteria: geography, legal structure, investment size, return expectations, capital type, growth stage.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-800">{perfectCount}</div>
            <div className="text-xs text-emerald-600">Perfect Fit</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-800">{strongCount}</div>
            <div className="text-xs text-green-600">Strong Fit</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-800">{scored.length}</div>
            <div className="text-xs text-blue-600">Total Foundations</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-purple-800">{qbeCount}</div>
            <div className="text-xs text-purple-600">QBE Session Intel</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-slate-800">{avgScore.toFixed(1)}</div>
            <div className="text-xs text-slate-500">Avg Alignment</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="px-3 py-1.5 rounded-md text-sm border border-slate-200 bg-white"
        >
          <option value="alignment">Sort: Alignment Score</option>
          <option value="relationship">Sort: Relationship</option>
          <option value="name">Sort: Name</option>
        </select>
        <select
          value={filterRelationship}
          onChange={e => setFilterRelationship(e.target.value as Relationship | 'all')}
          className="px-3 py-1.5 rounded-md text-sm border border-slate-200 bg-white"
        >
          <option value="all">All Relationships</option>
          <option value="active">Active</option>
          <option value="warm">Warm</option>
          <option value="applied">Applied</option>
          <option value="new">New from QBE</option>
          <option value="prospect">Prospect</option>
        </select>
        <button
          onClick={() => setShowQBEOnly(!showQBEOnly)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            showQBEOnly ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
          }`}
        >
          QBE Intel Only
        </button>
      </div>

      {/* Foundation Cards */}
      <div className="space-y-3">
        {filtered.map((f, i) => (
          <Card key={i} className={`border-l-4 ${
            f.level === 'perfect' ? 'border-l-emerald-500' :
            f.level === 'strong' ? 'border-l-green-500' :
            f.level === 'moderate' ? 'border-l-amber-500' :
            'border-l-slate-300'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{f.name}</span>
                    <Badge className={`text-xs ${ALIGNMENT_COLORS[f.level]}`}>
                      {f.score}/10 — {f.level}
                    </Badge>
                    <Badge className={`text-xs ${RELATIONSHIP_COLORS[f.relationship]}`}>
                      {f.relationship === 'new' ? 'New from QBE' : f.relationship}
                    </Badge>
                    {f.amountSignal && (
                      <span className="text-xs font-bold text-slate-700">{f.amountSignal}</span>
                    )}
                  </div>

                  {/* Capital types */}
                  <div className="flex gap-1 mb-2">
                    {f.capitalTypes.map((ct, j) => (
                      <Badge key={j} className="text-xs bg-blue-50 text-blue-700 border border-blue-200">{CAPITAL_LABELS[ct]}</Badge>
                    ))}
                  </div>

                  {/* Thematic alignment */}
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {f.indigenous && <span className="text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">Indigenous</span>}
                    {f.remoteHousing && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Remote Housing</span>}
                    {f.circularEconomy && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">Circular Economy</span>}
                    {f.healthOutcomes && <span className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">Health</span>}
                    {f.socialEnterprise && <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Social Enterprise</span>}
                    {f.communityOwnership && <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Community Ownership</span>}
                    {f.climateResilience && <span className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">Climate Resilience</span>}
                  </div>

                  {/* Notes */}
                  <p className="text-sm text-slate-600 mb-1">{f.notes}</p>

                  {/* QBE Insight */}
                  {f.qbeInsight && (
                    <div className="bg-purple-50 rounded p-2 mb-2">
                      <p className="text-xs text-purple-800"><strong>QBE Session Intel:</strong> {f.qbeInsight}</p>
                    </div>
                  )}

                  {/* Next action */}
                  <div className="flex items-start gap-2">
                    <ArrowRight className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800 font-medium">{f.nextAction}</p>
                  </div>
                </div>

                {/* Knockout criteria mini-chart */}
                <div className="hidden md:block w-32 shrink-0">
                  <div className="space-y-1">
                    {[
                      { label: 'Geo', val: f.geography },
                      { label: 'Legal', val: f.legalStructure },
                      { label: 'Size', val: f.investmentSize },
                      { label: 'Return', val: f.returnExpectations },
                      { label: 'Capital', val: f.capitalFit },
                      { label: 'Stage', val: f.growthStage },
                    ].map((k, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span className="text-xs text-slate-400 w-10">{k.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${k.val >= 8 ? 'bg-emerald-500' : k.val >= 6 ? 'bg-amber-500' : 'bg-red-400'}`}
                            style={{ width: `${k.val * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Knockout Criteria Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Knockout Criteria (from QBE Session 1)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {[
              { label: 'Geography', desc: 'Invests in NT, remote Australia, QLD', icon: MapPin },
              { label: 'Legal Structure', desc: 'Invests in NFP, hybrid, social enterprise', icon: Building2 },
              { label: 'Investment Size', desc: 'Matches our $200K-$5M ask range', icon: DollarSign },
              { label: 'Return Expectations', desc: 'Aligns on impact-first returns', icon: Heart },
              { label: 'Capital Type', desc: 'Offers grant, debt, recoverable, catalytic', icon: Banknote },
              { label: 'Growth Stage', desc: 'Invests at revenue-generating, scaling stage', icon: TrendingUp },
            ].map((k, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                <k.icon className="h-3.5 w-3.5 text-slate-500 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-700">{k.label}</span>
                  <p className="text-slate-500">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
        Scoring: 60% knockout criteria + 30% thematic alignment + 10% QBE intel bonus.
        Data from Grantscope (10K foundations), outreach-targets.ts, and QBE Session 1 learnings.
      </div>
    </div>
  );
}
