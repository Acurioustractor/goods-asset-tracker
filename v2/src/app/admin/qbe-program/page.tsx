'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  capitalTargets as goodsCapitalTargets,
  healthBuyers,
  procurementBuyers,
  communityAndManufacturingPartners,
} from '@/lib/data/outreach-targets';
import {
  GraduationCap,
  DollarSign,
  Layers,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Users,
  Building2,
  Banknote,
  Shield,
  TrendingUp,
  Lightbulb,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Landmark,
  HandCoins,
  PiggyBank,
  Scale,
  Coins,
  CreditCard,
  Gift,
  Handshake,
  Search,
  Clock,
  Star,
  Zap,
  MessageSquare,
  FileText,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const CIVICGRAPH_GOODS_WORKSPACE_URL = 'https://civicgraph.vercel.app/goods-workspace';
const CIVICGRAPH_SYNC_LABEL = 'GrantScope snapshot synced into Goods outreach targets (16 Mar 2026)';

// ─── Types ──────────────────────────────────────────────────────────────────

type CapitalTier = 'grant' | 'debt' | 'equity';
type FitScore = 'strong' | 'possible' | 'unlikely' | 'active';

interface CapitalType {
  name: string;
  tier: CapitalTier;
  description: string;
  goodsFit: FitScore;
  goodsNotes: string;
  examples?: string[];
}

interface InvestorMatch {
  name: string;
  type: string;
  capitalType: string;
  amountRange: string;
  status: 'active' | 'warm' | 'new-from-qbe' | 'prospect';
  qbeAlignment: string;
  nextStep: string;
  priority: 'critical' | 'high' | 'medium';
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'webinar' | 'deadline' | 'milestone' | 'session';
  completed?: boolean;
}

interface SessionKey {
  speaker: string;
  role: string;
  insight: string;
  actionForGoods: string;
}

type IntakeLedgerState = 'in_ghl' | 'crm_only' | 'unworked';

type IntakeLedgerStatus = {
  targetId: string;
  state: IntakeLedgerState;
  crmMatched: boolean;
  ghlMatched: boolean;
  grantscopeLinked: boolean;
  crmContactId: string | null;
  crmContactName: string | null;
  ghlContactId: string | null;
  crmMatchBasis: string | null;
  ghlMatchBasis: string | null;
};

type IntakeLedgerResponse = {
  statuses: IntakeLedgerStatus[];
  summary: {
    totalTargets: number;
    inGhl: number;
    crmOnly: number;
    unworked: number;
    grantscopeLinked: number;
    ghlEnabled: boolean;
  };
};

type BackfillDetail = {
  contactId: string;
  contactLabel: string;
  contactEmail?: string | null;
  contactOrganization?: string | null;
  targetId?: string;
  targetName?: string;
  basis?: string;
  reviewBasis?: 'email' | 'contact' | 'organization' | 'name' | null;
  reviewedAt?: string | null;
  candidateTargets?: Array<{ id: string; name: string }>;
  candidateTargetNames?: string[];
  status: 'updated' | 'ambiguous' | 'unmatched' | 'reviewed';
};

type BackfillReviewFilter = 'strongest' | 'decision' | 'unmatched';

// ─── Data ───────────────────────────────────────────────────────────────────

const CAPITAL_TYPES: CapitalType[] = [
  // Grants
  { name: 'Grant', tier: 'grant', description: 'Non-repayable funding', goodsFit: 'active', goodsNotes: 'Already have $445K from Snow, FRRR, VFFF, TFN, AMP. QBE match adds up to $200K.', examples: ['Snow Foundation', 'QBE Foundation', 'FRRR'] },
  { name: 'Crowdfunding Donations', tier: 'grant', description: 'Community-based giving campaigns', goodsFit: 'possible', goodsNotes: 'Community resonance exists. Could tie to specific community deployments.', examples: ['GoFundMe', 'Chuffed'] },
  { name: 'Pay for Success', tier: 'grant', description: 'Payment only if outcomes delivered', goodsFit: 'possible', goodsNotes: 'Govt shifting to this model. Housing/health outcomes from beds are measurable. Could link to NT Housing outcomes.', examples: ['QLD Govt revenue-linked scheme'] },
  { name: 'Loan Guarantee', tier: 'grant', description: 'Third party protects lender if you default', goodsFit: 'possible', goodsNotes: 'Snow Foundation or IBA could provide guarantees to de-risk SEFA or commercial debt.', examples: ['Foundation balance sheets'] },
  { name: 'Recoverable Grant', tier: 'grant', description: 'Grant repaid without interest in 2-3 years', goodsFit: 'strong', goodsNotes: 'Perfect for working capital. Mindaroo does these. QLD Govt launching $100K program. Revenue from bed sales could repay.', examples: ['Mindaroo Foundation', 'QLD Govt program'] },
  // Debt
  { name: 'PRI Debt', tier: 'debt', description: 'Program-related investment from foundations', goodsFit: 'strong', goodsNotes: 'Foundations can count sub-market returns toward their grant targets. DGR1 makes this possible.', examples: ['Foundation corpus investment'] },
  { name: 'Variable Repayment Debt', tier: 'debt', description: 'Interest linked to impact outcomes', goodsFit: 'strong', goodsNotes: 'BOLD agreement model: lower interest if hitting community deployment targets. SEFA has done these.', examples: ['SEFA BOLD agreements'] },
  { name: 'Standard Debt', tier: 'debt', description: 'Loan with regular interest payments', goodsFit: 'strong', goodsNotes: 'SEFA has $9M undeployed. IBA Business Loan up to $5M. 73% margin can service debt.', examples: ['SEFA', 'IBA'] },
  { name: 'Crowdfunding Debt', tier: 'debt', description: 'Retail investors lend via platform', goodsFit: 'possible', goodsNotes: 'Via Lend for Good platform. Need existing community/crowd first.', examples: ['Lend for Good'] },
  { name: 'Convertible Debt', tier: 'debt', description: 'Loan that can convert to equity', goodsFit: 'unlikely', goodsNotes: 'Structure complexity with not-for-profit. More suited to for-profit entities.', examples: ['SAFEs', 'Convertible notes'] },
  // Equity
  { name: 'PRI Equity', tier: 'equity', description: 'Foundation-aligned equity investment', goodsFit: 'unlikely', goodsNotes: 'Not-for-profit structure limits equity. Could work via Oonchiumpa (for-profit arm).', examples: ['Foundation corpus'] },
  { name: 'Equity', tier: 'equity', description: 'Ownership stake in entity', goodsFit: 'unlikely', goodsNotes: 'QBE Ventures does $5-15M equity but needs 10x return path. Community ownership model is different.', examples: ['QBE Ventures'] },
  { name: 'Crowdfunding Equity / DPO', tier: 'equity', description: 'Public equity raise from crowd', goodsFit: 'unlikely', goodsNotes: 'Would need for-profit entity. Interesting for co-op model if that path opens.', examples: ['Kindship: 800 investors, $1.1M'] },
];

const INVESTOR_MATCHES: InvestorMatch[] = [
  // Existing + QBE-aligned
  {
    name: 'SEFA (Social Enterprise Finance Australia)',
    type: 'Impact Lender',
    capitalType: 'Procurement Readiness Loan + Growth Impact Loan',
    amountRange: '$200K-$1M+',
    status: 'warm',
    qbeAlignment: 'Hanna Ebeling (CEO) presented at QBE session. $160M unlocked since 2011, 170+ orgs backed, 75+ deals. Acted as syndicate agent for Jigsaw $3M raise (Snow Foundation in that deal). Procurement Readiness Impact Loan is an exact fit: "Secure finance to fulfil a confirmed procurement contract with government or another party" — this maps directly to our Centre Corp 107 beds, Miwatj 8 clinics, NPY 200-350 beds, and WHSAC 500 mattress pipeline.',
    nextStep: 'Email Hanna Ebeling DIRECTLY at hanna.ebeling@sefa.com.au (0475 084 855). Reference QBE cohort participation, propose Procurement Readiness Impact Loan to bridge confirmed procurement pipeline. Alt contacts: Renee Martin (Head of Impact & Advisory, renee.martin@sefa.com.au, 0409 926 646), Jennifer Turner (Head of Impact Investment, jennifer.turner@sefa.com.au, 0408 480 313). Prep debt-readiness docs in parallel: historical + forecast financials, constitution, org chart, business plan, theory of change, impact measurement evidence.',
    priority: 'critical',
  },
  {
    name: 'Snow Foundation',
    type: 'Anchor Philanthropist',
    capitalType: 'Grant + Loan Guarantee',
    amountRange: '$200K R4 pending + guarantee potential',
    status: 'active',
    qbeAlignment: 'Named in Jigsaw case study as co-investor. Beck mentioned Snow does long-term enterprise partnerships with flexible capital.',
    nextStep: 'Propose shift from pure grant to blended: grant + loan guarantee for SEFA debt.',
    priority: 'critical',
  },
  {
    name: 'QBE Foundation',
    type: 'Program Grant',
    capitalType: 'Grant (matched funding)',
    amountRange: 'Up to $200K (requires match)',
    status: 'active',
    qbeAlignment: 'We are IN the program. Grant contingent on demonstrating additional capital raised. Climate resilience + inclusion focus.',
    nextStep: 'Complete Freshly Impact Network diagnostic. Prepare capital strategy with SEFA + Snow as first movers.',
    priority: 'critical',
  },
  {
    name: 'QBE Ventures (Lighthouse)',
    type: 'Corporate Venture Capital',
    capitalType: 'Discovery Funding / SAFE',
    amountRange: '$50K-$200K (Lighthouse) / $5-15M (full)',
    status: 'new-from-qbe',
    qbeAlignment: 'Alex presented: Lighthouse = early discovery funding to explore insurance value. Remote housing resilience = reduced claims. Flat-pack disaster deployment.',
    nextStep: 'Draft 1-page insurance adjacency pitch: bed durability reduces housing fit-out claims in remote communities.',
    priority: 'high',
  },
  {
    name: 'PFI (QLD Partnering for Impact)',
    type: 'Government Repayable',
    capitalType: 'Recoverable Grant',
    amountRange: '$640K repayable',
    status: 'warm',
    qbeAlignment: 'Jess confirmed QLD Govt launching recoverable grant programs. PFI is exactly this model.',
    nextStep: 'Confirm EOI submission status. Lead with Palm Island proof.',
    priority: 'critical',
  },
  {
    name: 'Mindaroo Foundation',
    type: 'Catalytic Capital',
    capitalType: 'Catalytic grant / Recoverable grant',
    amountRange: '$100K-$500K',
    status: 'warm',
    qbeAlignment: 'Beck specifically named Mindaroo catalytic capital bucket. Must demonstrate QBE grant crowds in additional investment.',
    nextStep: 'Approach with blended stack showing QBE + Snow + SEFA already moving. Ask for catalytic layer.',
    priority: 'high',
  },
  {
    name: 'IBA Business Loan',
    type: 'Indigenous Business Finance',
    capitalType: 'Debt + 30% Grant Component',
    amountRange: 'Up to $5M (30% grant = $1.5M)',
    status: 'warm',
    qbeAlignment: 'Blended by design: 30% grant + 70% debt. Aboriginal ownership via Oonchiumpa. Manufacturing capex is core use case.',
    nextStep: 'Complete business plan. Confirm Oonchiumpa eligibility. Position as senior debt in stack.',
    priority: 'high',
  },
  {
    name: 'Impact Investing Australia Deal Tracker',
    type: 'Platform',
    capitalType: 'Visibility tool',
    amountRange: 'N/A',
    status: 'new-from-qbe',
    qbeAlignment: 'Jess announced interactive map of impact investors coming to IIA website. Deal tracker MVP already live.',
    nextStep: 'List Goods capital raise on IIA deal tracker when stack is defined (need public visibility first).',
    priority: 'medium',
  },
  {
    name: 'Lend for Good',
    type: 'Crowdfunding Debt Platform',
    capitalType: 'Crowdfunding Debt',
    amountRange: '$50K-$500K',
    status: 'new-from-qbe',
    qbeAlignment: 'Social Impact Hub is a provider on Lend for Good. Community connection is pre-condition for crowd success.',
    nextStep: 'Evaluate after primary stack is built. Could supplement with community-facing raise tied to specific deployment.',
    priority: 'medium',
  },
];

const TIMELINE: TimelineEvent[] = [
  { date: '2026-03-31', title: 'QBE Session 1: Blended Finance & Investor Panel', description: 'Types of capital, blended finance, SEFA/QBE Ventures/Beck panel, peer sharing', type: 'session', completed: true },
  { date: '2026-04-03', title: 'DEADLINE: Induction Evaluation Survey', description: 'Short survey + baseline data for impact measurement. Link in Induction tab.', type: 'deadline' },
  { date: '2026-04-07', title: 'Webinar: Finding Money', description: 'Revenue strategy for purpose organisations. 12:30-1:30pm AEST', type: 'webinar' },
  { date: '2026-04-10', title: 'DEADLINE: Mentoring Survey', description: 'Complete preferences survey so Social Impact Hub can match a mentor.', type: 'deadline' },
  { date: '2026-04-13', title: 'Jay Boolkin returns from leave', description: 'Adam Long (adam@socialimpacthub.org / 0421 498 170) is backup until then.', type: 'milestone' },
  { date: '2026-04-24', title: 'Impact Investing 101', description: 'Types of investors, types of capital. 12-1pm AEST', type: 'webinar' },
  { date: '2026-05-01', title: 'How Legal Structures Shape Impact Investing', description: 'Keith Rovers (Mint Ellison). Hybrid entities, legal toolkit preview. 12-1pm AEST', type: 'webinar' },
  { date: '2026-05-08', title: 'Deal Anatomy: Inside an Impact Investment Transaction', description: 'Real deal walkthrough with investor + enterprise. 12-1pm AEST', type: 'webinar' },
  { date: '2026-05-31', title: 'Freshly Impact Network Diagnostic', description: 'Work with Beck/Rebecca to determine right capital type. Must complete before pitch.', type: 'deadline' },
  { date: '2026-08-31', title: 'QBE Match Funding Deadline', description: 'Demonstrate additional capital raised to unlock QBE matched grant (up to $200K).', type: 'deadline' },
];

const SESSION_KEYS: SessionKey[] = [
  {
    speaker: 'Alex (QBE Ventures)',
    role: 'Corporate Venture Capital',
    insight: '3 things to convince any investor: (1) Why is this important? (2) Why are YOU the right org? (3) Is it achievable? Impact numbers going up works just as well as revenue numbers.',
    actionForGoods: 'Frame pitch around insurance adjacency: remote housing resilience reduces claims. Flat-pack disaster deployment. Explore Lighthouse program for discovery funding.',
  },
  {
    speaker: 'Rebecca (Beck) Parkinson',
    role: 'Impact Investment Advisor, ex-SVA/DFAT',
    insight: 'Know EXACTLY what capital you want. Be targeted. Drop mismatches fast. Research funders before meetings. A quick "no" saves months.',
    actionForGoods: 'Define the stack NOW: QBE grant + Snow guarantee + SEFA debt + IBA capex loan. Stop being scattergun on prospects.',
  },
  {
    speaker: 'Hannah (SEFA CEO)',
    role: 'Impact Debt Provider',
    insight: 'Debt just brings future cash flow forward. $9M undeployed. Grants are the MOST PRECIOUS/SCARCE capital. Requires independent board governance.',
    actionForGoods: 'Start SEFA conversation immediately for working capital. Board independence needs attention. Don\'t wait for grants when debt is available.',
  },
  {
    speaker: 'Jess (Social Impact Hub)',
    role: 'Program Facilitator',
    insight: 'QBE grant is designed to crowd in other capital. Use the letter of invitation to unlock conditional commitments. Blended finance = shared values, different risk-return.',
    actionForGoods: 'Use QBE participation letter to approach SEFA, Mindaroo, and IBA. Position QBE as the catalytic first mover.',
  },
];

const MATCH_FUNDING_TRACKER = {
  target: 400_000,
  secured: 0,
  conditional: 0,
  pipeline: 0,
  sources: [
    { name: 'QBE Foundation Grant', amount: 200_000, status: 'conditional' as const, note: 'Contingent on match' },
    { name: 'Snow Foundation R4', amount: 200_000, status: 'pipeline' as const, note: 'Applied, awaiting response' },
    { name: 'SEFA Working Capital Loan', amount: 300_000, status: 'pipeline' as const, note: 'Warm relationship, need to formalise ask' },
    { name: 'PFI Repayable Grant', amount: 640_000, status: 'pipeline' as const, note: 'EOI submitted Mar 15' },
    { name: 'IBA Business Loan', amount: 5_000_000, status: 'pipeline' as const, note: 'Eligibility confirmed, business plan needed' },
    { name: 'Mindaroo Catalytic', amount: 200_000, status: 'pipeline' as const, note: 'Warm, needs blended stack proof' },
  ] as { name: string; amount: number; status: 'secured' | 'conditional' | 'pipeline'; note: string }[],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function currency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

const TIER_COLORS: Record<CapitalTier, string> = {
  grant: 'bg-green-100 text-green-800',
  debt: 'bg-blue-100 text-blue-800',
  equity: 'bg-purple-100 text-purple-800',
};

const TIER_LABELS: Record<CapitalTier, string> = {
  grant: 'Grant & Grant-like',
  debt: 'Debt & Debt-like',
  equity: 'Equity & Equity-like',
};

const FIT_COLORS: Record<FitScore, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  strong: 'bg-green-100 text-green-800 border-green-300',
  possible: 'bg-amber-100 text-amber-800 border-amber-300',
  unlikely: 'bg-slate-100 text-slate-600 border-slate-300',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  warm: 'bg-amber-100 text-amber-800',
  'new-from-qbe': 'bg-blue-100 text-blue-800',
  prospect: 'bg-slate-100 text-slate-600',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-slate-100 text-slate-600',
};

type Tab = 'overview' | 'induction' | 'strategy' | 'financial-model' | 'capital-types' | 'investor-pipeline' | 'match-tracker' | 'session-notes';

// ─── Induction Data (from April 2 email from Jay Boolkin) ──────────────────

const INDUCTION_MATERIALS = [
  { title: 'Induction Slides (PDF, 62 pages)', url: '/qbe/induction-slides.pdf', note: 'Full deck from 31 March 2026 induction. Includes capital types, blended finance theory, Jigsaw/Dismantle/Victoria Theatre case studies, Sefa product suite and contacts.' },
  { title: 'Investor Alignment Tool (xlsx)', url: '/qbe/investor-alignment-tool.xlsx', note: 'CASE Smart Impact Capital worksheet — knockout criteria + fit criteria template for scoring potential investors.' },
  { title: 'Funder Letter — A Curious Tractor (PDF)', url: '/qbe/funder-letter.pdf', note: 'Our personalised Catalysing Impact participation letter from QBE/SIH. Use this when approaching Sefa, Snow, Mindaroo, IBA etc. as proof of program participation and catalytic positioning.' },
  { title: 'Funder Letter — Zoho WorkDrive (backup)', url: 'https://workdrive.zohoexternal.com/external/6e4c54f60ccd083fab3b05b6287bfeee5444ffc7f6acdf5a43ecef11b7af29a9', note: 'Original shared link from Jay in case the local copy is out of date.' },
  { title: 'Cohort Group Photo', url: '/qbe/cohort-photo.jpeg', note: 'From the 31 March in-person induction at QBE Sydney.' },
  { title: 'Induction Evaluation Survey', url: 'https://survey.zohopublic.com/zs/dwt4Xl', note: 'DUE COB Fri 3 Apr — includes baseline impact data questions.' },
  { title: 'Mentoring Preferences Survey', url: 'https://survey.zohopublic.com/zs/2htaT2', note: 'DUE COB Fri 10 Apr — informs mentor matching.' },
];

const COHORT_ATTENDEES: { name: string; org: string; us?: boolean }[] = [
  { name: 'Benjamin Knight', org: 'A Curious Tractor', us: true },
  { name: 'Geoff McGinley', org: 'Adapt Homes' },
  { name: 'Rebecca Stoeckel', org: 'Adapt Homes' },
  { name: 'Sefano Katz', org: 'Envirotech Education' },
  { name: 'Shelly Bengiat', org: 'Envirotech Education' },
  { name: 'Kirra Johnson', org: 'Good Cycles' },
  { name: 'Lynn Crawford', org: 'Good Cycles' },
  { name: "Carlena D'Arma", org: 'Hepburn Energy' },
  { name: 'Moragh Mackay', org: 'Mycelia Renewables' },
  { name: 'Latrell Norman', org: 'Ngardara Project' },
  { name: 'Luke Mahoney', org: 'Ngardara Project' },
  { name: 'Scott McDinny', org: 'Ngardara Project' },
  { name: 'Madie Sturgess', org: 'Original Power' },
  { name: 'Lucy Henry', org: 'Plate It Forward' },
  { name: 'Vivek Reddy', org: 'Plate It Forward' },
  { name: 'Guido Verbist', org: 'Revolve Recycling' },
  { name: 'Daniel Hillyer', org: 'RoboFit' },
  { name: 'Maryanne Harris', org: 'RoboFit' },
];

const COHORT_HOSTS: { name: string; org: string; role: string }[] = [
  { name: 'James Aiken', org: 'QBE Foundation', role: 'Funder' },
  { name: 'Lauren Hicks', org: 'QBE Foundation', role: 'Funder' },
  { name: 'Sarah Bassam', org: 'QBE Foundation', role: 'Funder' },
  { name: 'Alex Taylor', org: 'QBE Ventures', role: 'Corporate VC' },
  { name: 'Hanna Ebeling', org: 'Sefa', role: 'Impact Debt' },
  { name: 'Rebecca Parkinson', org: 'Professional Impact Network', role: 'Advisor' },
  { name: 'Adam Long', org: 'Social Impact Hub', role: 'Facilitator (Jay backup)' },
  { name: 'Jay Boolkin', org: 'Social Impact Hub', role: 'Program Lead (on leave until 13 Apr)' },
  { name: 'Jessica Mendoza-Roth', org: 'Social Impact Hub', role: 'Facilitator' },
  { name: 'Sarah Gregory', org: 'Social Impact Hub', role: 'Head of People (diagnostic intros)' },
];

const INDUCTION_NEXT_STEPS = [
  { label: 'Evaluation Survey', due: 'COB Fri 3 Apr', status: 'overdue' as const, detail: 'Short eval + baseline data for program impact measurement.' },
  { label: 'Mentoring Survey', due: 'COB Fri 10 Apr', status: 'due-soon' as const, detail: 'Informs mentor matching. Tomorrow.' },
  { label: 'Diagnostic Session', due: 'TBA', status: 'waiting' as const, detail: 'Sarah Gregory will introduce the PIN member running our diagnostic.' },
  { label: 'Mentor Matching', due: 'After 10 Apr', status: 'waiting' as const, detail: 'Social Impact Hub matches a mentor based on survey responses.' },
];

// ─── Components ─────────────────────────────────────────────────────────────

function CollapsibleCard({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-slate-600" />
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

function intakeStateClassName(state?: IntakeLedgerState) {
  switch (state) {
    case 'in_ghl':
      return 'bg-emerald-100 text-emerald-800';
    case 'crm_only':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function intakeStateLabel(state?: IntakeLedgerState) {
  switch (state) {
    case 'in_ghl':
      return 'In GHL';
    case 'crm_only':
      return 'CRM only';
    default:
      return 'Unworked';
  }
}

function intakeRecordHref(status?: IntakeLedgerStatus) {
  const exactCrmMatch =
    !!status?.crmContactId &&
    (status.crmMatchBasis === 'email' || status.crmMatchBasis === 'contact');

  if (exactCrmMatch) {
    return `/admin/partners/${status.crmContactId}`;
  }
  return '/admin/partners';
}

function intakeRecordLabel(status?: IntakeLedgerStatus) {
  const exactCrmMatch =
    !!status?.crmContactId &&
    (status.crmMatchBasis === 'email' || status.crmMatchBasis === 'contact');

  if (exactCrmMatch) {
    return 'Open contact';
  }
  return 'Open People';
}

function matchBasisLabel(basis?: string | null) {
  switch (basis) {
    case 'grantscope_id':
      return 'Matched by target ID';
    case 'email':
      return 'Matched by email';
    case 'contact':
      return 'Matched by contact';
    case 'organization':
      return 'Matched by organisation';
    case 'name':
      return 'Matched by name';
    default:
      return null;
  }
}

function backfillContextLine(detail: Pick<BackfillDetail, 'contactEmail' | 'contactOrganization'>) {
  if (detail.contactEmail && detail.contactOrganization) {
    return `${detail.contactEmail} · ${detail.contactOrganization}`;
  }

  return detail.contactEmail || detail.contactOrganization || null;
}

function backfillStatusWeight(status: BackfillDetail['status']) {
  const order = { updated: 0, ambiguous: 1, unmatched: 2, reviewed: 3 };
  return order[status];
}

function backfillBasisWeight(basis?: BackfillDetail['reviewBasis'] | BackfillDetail['basis']) {
  switch (basis) {
    case 'email':
      return 0;
    case 'contact':
      return 1;
    case 'organization':
      return 2;
    case 'name':
      return 3;
    case 'manual':
      return 4;
    default:
      return 5;
  }
}

function sortBackfillDetails(details: BackfillDetail[]) {
  return [...details].sort((a, b) => {
    const statusDelta = backfillStatusWeight(a.status) - backfillStatusWeight(b.status);
    if (statusDelta !== 0) return statusDelta;

    const basisDelta =
      backfillBasisWeight(a.status === 'ambiguous' || a.status === 'unmatched' ? a.reviewBasis : a.basis) -
      backfillBasisWeight(b.status === 'ambiguous' || b.status === 'unmatched' ? b.reviewBasis : b.basis);
    if (basisDelta !== 0) return basisDelta;

    return a.contactLabel.localeCompare(b.contactLabel);
  });
}

function formatBackfillReviewLine(detail: BackfillDetail) {
  const context = backfillContextLine(detail);
  const basis =
    detail.status === 'ambiguous' || detail.status === 'unmatched'
      ? matchBasisLabel(detail.reviewBasis)
      : matchBasisLabel(detail.basis);

  if (detail.status === 'ambiguous') {
    return [
      detail.contactLabel,
      context ? `(${context})` : null,
      basis ? `- ${basis}` : null,
      `→ candidates: ${detail.candidateTargetNames?.join(' · ') || 'Multiple candidates'}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  return [
    detail.contactLabel,
    context ? `(${context})` : null,
    basis ? `- ${basis}` : null,
    '→ no Goods outreach target match found',
  ]
    .filter(Boolean)
    .join(' ');
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function QBEProgramPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [capitalFilter, setCapitalFilter] = useState<CapitalTier | 'all'>('all');
  const [intakeLedger, setIntakeLedger] = useState<IntakeLedgerResponse | null>(null);
  const [intakeLedgerLoading, setIntakeLedgerLoading] = useState(true);
  const [intakePushTargetId, setIntakePushTargetId] = useState<string | null>(null);
  const [intakeBackfillLoading, setIntakeBackfillLoading] = useState(false);
  const [intakeResolveContactId, setIntakeResolveContactId] = useState<string | null>(null);
  const [intakeReviewContactId, setIntakeReviewContactId] = useState<string | null>(null);
  const [intakeUndoReviewContactId, setIntakeUndoReviewContactId] = useState<string | null>(null);
  const [intakeBulkReviewLoading, setIntakeBulkReviewLoading] = useState(false);
  const [intakeBulkUndoReviewLoading, setIntakeBulkUndoReviewLoading] = useState(false);
  const [intakeActionMessage, setIntakeActionMessage] = useState<string | null>(null);
  const [backfillDetails, setBackfillDetails] = useState<BackfillDetail[]>([]);
  const [backfillReviewFilter, setBackfillReviewFilter] = useState<BackfillReviewFilter>('strongest');
  const [showReviewedBackfill, setShowReviewedBackfill] = useState(false);
  const [showAllBackfillRows, setShowAllBackfillRows] = useState(false);
  const [backfillGeneratedAt, setBackfillGeneratedAt] = useState<string | null>(null);

  const filteredCapital = capitalFilter === 'all'
    ? CAPITAL_TYPES
    : CAPITAL_TYPES.filter(c => c.tier === capitalFilter);

  const pipelineTotal = MATCH_FUNDING_TRACKER.sources
    .filter(s => s.status !== 'conditional')
    .reduce((sum, s) => sum + s.amount, 0);

  const discoveryBuyers = [...healthBuyers, ...procurementBuyers]
    .filter((target) => target.priority === 'critical' || target.priority === 'high')
    .slice(0, 4);

  const discoveryCapital = goodsCapitalTargets
    .filter((target) => target.priority === 'critical' || target.priority === 'high')
    .slice(0, 4);

  const discoveryPartners = communityAndManufacturingPartners
    .filter((target) => target.priority === 'critical' || target.priority === 'high')
    .slice(0, 4);

  async function loadIntakeLedger(signal?: AbortSignal) {
    try {
      setIntakeLedgerLoading(true);
      const response = await fetch('/api/admin/targets/intake-status', {
        credentials: 'include',
        cache: 'no-store',
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load intake ledger status (${response.status})`);
      }

      const data = await response.json() as IntakeLedgerResponse;
      setIntakeLedger(data);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      console.error('Failed to load intake ledger status', error);
      setIntakeLedger(null);
    } finally {
      setIntakeLedgerLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadIntakeLedger(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  async function handlePushTarget(target: (typeof discoveryBuyers)[number]) {
    try {
      setIntakePushTargetId(target.id);
      setIntakeActionMessage(null);
      setBackfillDetails([]);

      const response = await fetch('/api/admin/targets/push-outreach', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targets: [target],
        }),
      });

      if (!response.ok) {
        throw new Error(`Push failed (${response.status})`);
      }

      const data = await response.json() as {
        successful: number;
        failed: number;
      };

      if (data.successful < 1) {
        throw new Error('Target was not pushed into GHL');
      }

      setIntakeActionMessage(`${target.name} pushed into GHL`);
      await loadIntakeLedger();
    } catch (error) {
      console.error('Failed to push outreach target', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to push target into GHL');
    } finally {
      setIntakePushTargetId(null);
    }
  }

  async function handleBackfillTargetIds() {
    try {
      setIntakeBackfillLoading(true);
      setIntakeActionMessage(null);
      setBackfillDetails([]);

      const response = await fetch('/api/admin/targets/backfill-identities', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Backfill failed (${response.status})`);
      }

      const data = await response.json() as {
        generatedAt: string;
        summary: {
          updated: number;
          ambiguous: number;
          unmatched: number;
          reviewed: number;
        };
        details: BackfillDetail[];
      };

      setIntakeActionMessage(
        `Backfill complete: ${data.summary.updated} linked, ${data.summary.ambiguous} ambiguous, ${data.summary.unmatched} unmatched, ${data.summary.reviewed} reviewed`
      );
      setBackfillGeneratedAt(data.generatedAt || null);
      setBackfillDetails(sortBackfillDetails(data.details || []));
      await loadIntakeLedger();
    } catch (error) {
      console.error('Failed to backfill target identities', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to backfill target IDs');
    } finally {
      setIntakeBackfillLoading(false);
    }
  }

  async function handleResolveBackfill(contactId: string, targetId: string, targetName: string) {
    try {
      setIntakeResolveContactId(contactId);
      setIntakeActionMessage(null);

      const response = await fetch('/api/admin/targets/resolve-identity', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          targetId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resolve failed (${response.status})`);
      }

      setBackfillDetails((current) =>
        sortBackfillDetails(
          current
          .map((detail): BackfillDetail => {
            if (detail.contactId !== contactId) return detail;

            return {
              ...detail,
              status: 'updated',
              targetId,
              targetName,
              basis: 'manual',
              reviewBasis: undefined,
              candidateTargets: undefined,
              candidateTargetNames: undefined,
            };
          })
        )
      );

      setIntakeActionMessage(`Resolved ${targetName} for this contact`);
      await loadIntakeLedger();
    } catch (error) {
      console.error('Failed to resolve outreach target identity', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to resolve target identity');
    } finally {
      setIntakeResolveContactId(null);
    }
  }

  async function handleReviewBackfill(contactId: string, contactLabel: string) {
    try {
      setIntakeReviewContactId(contactId);
      setIntakeActionMessage(null);

      const response = await fetch('/api/admin/targets/review-identity', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          action: 'review',
        }),
      });

      if (!response.ok) {
        throw new Error(`Review failed (${response.status})`);
      }

      setBackfillDetails((current) =>
        sortBackfillDetails(
          current.map((detail): BackfillDetail => {
            if (detail.contactId !== contactId) return detail;
            return {
              ...detail,
              status: 'reviewed',
              reviewedAt: new Date().toISOString(),
              candidateTargets: undefined,
              candidateTargetNames: undefined,
              reviewBasis: undefined,
            };
          })
        )
      );
      setIntakeActionMessage(`Marked ${contactLabel} as reviewed`);
    } catch (error) {
      console.error('Failed to mark outreach identity as reviewed', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to mark contact as reviewed');
    } finally {
      setIntakeReviewContactId(null);
    }
  }

  async function handleUndoReviewBackfill(contactId: string, contactLabel: string) {
    try {
      setIntakeUndoReviewContactId(contactId);
      setIntakeActionMessage(null);

      const response = await fetch('/api/admin/targets/review-identity', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          action: 'undo',
        }),
      });

      if (!response.ok) {
        throw new Error(`Undo failed (${response.status})`);
      }

      setBackfillDetails((current) =>
        sortBackfillDetails(
          current.map((detail): BackfillDetail => {
            if (detail.contactId !== contactId) return detail;
            return {
              ...detail,
              status: 'unmatched',
              reviewedAt: null,
            };
          })
        )
      );
      setIntakeActionMessage(`Returned ${contactLabel} to the review queue`);
    } catch (error) {
      console.error('Failed to undo reviewed outreach identity', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to undo reviewed contact');
    } finally {
      setIntakeUndoReviewContactId(null);
    }
  }

  async function handleBulkReviewBackfill(details: BackfillDetail[]) {
    const contactIds = details.map((detail) => detail.contactId);
    if (contactIds.length === 0) {
      setIntakeActionMessage('No unmatched rows in this view');
      return;
    }

    try {
      setIntakeBulkReviewLoading(true);
      setIntakeActionMessage(null);

      const response = await fetch('/api/admin/targets/review-identity', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactIds,
          action: 'review',
        }),
      });

      if (!response.ok) {
        throw new Error(`Bulk review failed (${response.status})`);
      }

      const reviewedAt = new Date().toISOString();
      setBackfillDetails((current) =>
        sortBackfillDetails(
          current.map((detail): BackfillDetail => {
            if (!contactIds.includes(detail.contactId)) return detail;
            return {
              ...detail,
              status: 'reviewed',
              reviewedAt,
              candidateTargets: undefined,
              candidateTargetNames: undefined,
              reviewBasis: undefined,
            };
          })
        )
      );
      setIntakeActionMessage(`Marked ${contactIds.length} contacts as reviewed`);
    } catch (error) {
      console.error('Failed to bulk mark outreach identities as reviewed', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to mark contacts as reviewed');
    } finally {
      setIntakeBulkReviewLoading(false);
    }
  }

  async function handleBulkUndoReviewBackfill(details: BackfillDetail[]) {
    const contactIds = details.map((detail) => detail.contactId);
    if (contactIds.length === 0) {
      setIntakeActionMessage('No reviewed rows in this view');
      return;
    }

    try {
      setIntakeBulkUndoReviewLoading(true);
      setIntakeActionMessage(null);

      const response = await fetch('/api/admin/targets/review-identity', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactIds,
          action: 'undo',
        }),
      });

      if (!response.ok) {
        throw new Error(`Bulk undo failed (${response.status})`);
      }

      setBackfillDetails((current) =>
        sortBackfillDetails(
          current.map((detail): BackfillDetail => {
            if (!contactIds.includes(detail.contactId)) return detail;
            return {
              ...detail,
              status: 'unmatched',
              reviewedAt: null,
            };
          })
        )
      );
      setIntakeActionMessage(`Returned ${contactIds.length} contacts to the review queue`);
    } catch (error) {
      console.error('Failed to bulk undo reviewed outreach identities', error);
      setIntakeActionMessage(error instanceof Error ? error.message : 'Failed to restore reviewed contacts');
    } finally {
      setIntakeBulkUndoReviewLoading(false);
    }
  }

  const intakeStatusById = new Map(
    intakeLedger?.statuses.map((status) => [status.targetId, status]) || []
  );
  const backfillLinkedCount = backfillDetails.filter((detail) => detail.status === 'updated').length;
  const backfillAmbiguousCount = backfillDetails.filter((detail) => detail.status === 'ambiguous').length;
  const backfillUnmatchedCount = backfillDetails.filter((detail) => detail.status === 'unmatched').length;
  const backfillReviewedCount = backfillDetails.filter((detail) => detail.status === 'reviewed').length;
  const filteredBackfillDetails = backfillDetails.filter((detail) => {
    if (detail.status === 'reviewed') return showReviewedBackfill;
    if (backfillReviewFilter === 'decision') return detail.status === 'ambiguous';
    if (backfillReviewFilter === 'unmatched') return detail.status === 'unmatched';
    return true;
  });
  const unresolvedFilteredBackfillDetails = filteredBackfillDetails.filter(
    (detail) => detail.status === 'ambiguous' || detail.status === 'unmatched'
  );
  const allFilteredLinkedDetails = filteredBackfillDetails.filter((detail) => detail.status === 'updated');
  const allFilteredAmbiguousDetails = filteredBackfillDetails.filter((detail) => detail.status === 'ambiguous');
  const allFilteredUnmatchedDetails = filteredBackfillDetails.filter((detail) => detail.status === 'unmatched');
  const allFilteredReviewedDetails = filteredBackfillDetails.filter((detail) => detail.status === 'reviewed');
  const reviewDisplayLimit = showAllBackfillRows ? Number.POSITIVE_INFINITY : 5;
  const filteredLinkedDetails = allFilteredLinkedDetails.slice(0, reviewDisplayLimit);
  const filteredAmbiguousDetails = allFilteredAmbiguousDetails.slice(0, reviewDisplayLimit);
  const filteredUnmatchedDetails = allFilteredUnmatchedDetails.slice(0, reviewDisplayLimit);
  const filteredReviewedDetails = allFilteredReviewedDetails.slice(0, reviewDisplayLimit);
  const hasBackfillAudit = backfillDetails.length > 0;
  const backfillGeneratedLabel = backfillGeneratedAt
    ? new Date(backfillGeneratedAt).toLocaleString('en-AU')
    : null;
  const hiddenBackfillRowsCount =
    Math.max(allFilteredLinkedDetails.length - filteredLinkedDetails.length, 0) +
    Math.max(allFilteredAmbiguousDetails.length - filteredAmbiguousDetails.length, 0) +
    Math.max(allFilteredUnmatchedDetails.length - filteredUnmatchedDetails.length, 0) +
    Math.max(allFilteredReviewedDetails.length - filteredReviewedDetails.length, 0);

  async function handleCopyUnresolvedList() {
    try {
      if (unresolvedFilteredBackfillDetails.length === 0) {
        setIntakeActionMessage('No unresolved rows in this view');
        return;
      }

      const heading =
        backfillReviewFilter === 'decision'
          ? 'Goods backfill review — needs decision'
          : backfillReviewFilter === 'unmatched'
            ? 'Goods backfill review — unmatched only'
            : 'Goods backfill review — strongest first';

      const body = unresolvedFilteredBackfillDetails
        .map((detail, index) => `${index + 1}. ${formatBackfillReviewLine(detail)}`)
        .join('\n');

      await navigator.clipboard.writeText(`${heading}\n\n${body}`);
      setIntakeActionMessage(`Copied ${unresolvedFilteredBackfillDetails.length} unresolved rows`);
    } catch (error) {
      console.error('Failed to copy unresolved review list', error);
      setIntakeActionMessage('Failed to copy unresolved list');
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: GraduationCap },
    { id: 'induction', label: 'Induction', icon: Users },
    { id: 'strategy', label: '7 Layers', icon: Zap },
    { id: 'financial-model', label: 'Financial Model', icon: TrendingUp },
    { id: 'capital-types', label: 'Capital Types', icon: Layers },
    { id: 'investor-pipeline', label: 'Investor Pipeline', icon: Target },
    { id: 'match-tracker', label: 'Match Tracker', icon: DollarSign },
    { id: 'session-notes', label: 'Session Notes', icon: BookOpen },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">QBE Catalysing Impact</h1>
          <Badge className="bg-blue-100 text-blue-800 text-xs">2026 Cohort</Badge>
        </div>
        <p className="text-slate-500">
          Blended finance accelerator. Goal: unlock $400K matched funding by stacking grant + debt + catalytic capital.
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-slate-900">Weekly cockpit</CardTitle>
              <CardDescription className="mt-1 text-slate-600">
                Run the live weekly Goods raise here. Use CivicGraph to discover targets, push approved leads into GHL, then work them back from this hub.
              </CardDescription>
            </div>
            <a
              href={CIVICGRAPH_GOODS_WORKSPACE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Open CivicGraph Goods Workspace
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">1. Discovery</div>
            <p className="mt-2 text-sm text-slate-700">
              CivicGraph finds buyers, funders, community demand, and partner paths across the external landscape.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">2. Relationship system</div>
            <p className="mt-2 text-sm text-slate-700">
              GHL is the relationship ledger. Push approved targets there and track owner, stage, and next follow-up in one place.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">3. Weekly execution</div>
            <p className="mt-2 text-sm text-slate-700">
              Use QBE Program and QBE Actions as the live weekly cockpit for capital strategy, deadlines, and immediate next moves.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="text-xs text-emerald-600 font-medium">Existing Grants</div>
            <div className="text-2xl font-bold text-emerald-800">$445K</div>
            <div className="text-xs text-emerald-600">5 active funders</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-xs text-blue-600 font-medium">QBE Match Target</div>
            <div className="text-2xl font-bold text-blue-800">$400K</div>
            <div className="text-xs text-blue-600">requires matched capital</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="text-xs text-amber-600 font-medium">Pipeline Capital</div>
            <div className="text-2xl font-bold text-amber-800">{currency(pipelineTotal)}</div>
            <div className="text-xs text-amber-600">{MATCH_FUNDING_TRACKER.sources.filter(s => s.status === 'pipeline').length} sources in motion</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="text-xs text-purple-600 font-medium">Blended Stack</div>
            <div className="text-2xl font-bold text-purple-800">{currency(pipelineTotal + 445_000)}</div>
            <div className="text-xs text-purple-600">total if all converts</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-sky-200 bg-white">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Identity health</div>
            <div className="mt-1 text-sm text-slate-700">
              {hasBackfillAudit
                ? 'Current Goods target-ID resolution state across linked, decision, unmatched, and reviewed contacts.'
                : 'Run a backfill once to generate the current identity audit for Goods outreach contacts.'}
            </div>
            {backfillGeneratedLabel && (
              <div className="mt-1 text-[11px] text-slate-500">Last checked {backfillGeneratedLabel}</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Linked</div>
              <div className="mt-1 text-lg font-bold text-emerald-900">{hasBackfillAudit ? backfillLinkedCount : '—'}</div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">Needs decision</div>
              <div className="mt-1 text-lg font-bold text-amber-900">{hasBackfillAudit ? backfillAmbiguousCount : '—'}</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Unmatched</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{hasBackfillAudit ? backfillUnmatchedCount : '—'}</div>
            </div>
            <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700">Reviewed</div>
              <div className="mt-1 text-lg font-bold text-violet-900">{hasBackfillAudit ? backfillReviewedCount : '—'}</div>
            </div>
            <button
              type="button"
              onClick={() => void handleBackfillTargetIds()}
              disabled={intakeBackfillLoading}
              className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-900 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {intakeBackfillLoading ? 'Refreshing…' : hasBackfillAudit ? 'Refresh identity check' : 'Run identity check'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="border-sky-200 bg-sky-50">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-sky-700" />
                    Discovery intake
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {CIVICGRAPH_SYNC_LABEL}. Use this as feeder input, then move approved targets into GHL and track weekly progress here.
                  </CardDescription>
                  {backfillDetails.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                        Linked {backfillLinkedCount}
                      </div>
                      <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
                        Needs manual resolution {backfillAmbiguousCount}
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                        Unmatched {backfillUnmatchedCount}
                      </div>
                      <div className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-800">
                        Reviewed {backfillReviewedCount}
                      </div>
                    </div>
                  )}
                </div>
                <a
                  href={CIVICGRAPH_GOODS_WORKSPACE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Open CivicGraph
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => void handleBackfillTargetIds()}
                  disabled={intakeBackfillLoading}
                  className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {intakeBackfillLoading ? 'Backfilling…' : 'Backfill target IDs'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Capital targets</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{goodsCapitalTargets.length}</div>
                  <div className="mt-1 text-xs text-slate-500">grant, catalytic, debt, Aboriginal trust pathways</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Buyer targets</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{healthBuyers.length + procurementBuyers.length}</div>
                  <div className="mt-1 text-xs text-slate-500">health buyers and procurement channels</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Partner targets</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{communityAndManufacturingPartners.length}</div>
                  <div className="mt-1 text-xs text-slate-500">community, manufacturing, and distribution partners</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operating rule</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">Discovery in CivicGraph. Relationships in GHL. Weekly control here.</div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Already in GHL</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {intakeLedgerLoading ? '—' : intakeLedger?.summary.inGhl ?? 0}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">active relationship-ledger coverage</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">CRM only</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {intakeLedgerLoading ? '—' : intakeLedger?.summary.crmOnly ?? 0}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">known internally but not yet worked from GHL</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Still unworked</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {intakeLedgerLoading ? '—' : intakeLedger?.summary.unworked ?? 0}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">discovery targets with no ledger footprint yet</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Source-linked contacts</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {intakeLedgerLoading ? '—' : intakeLedger?.summary.grantscopeLinked ?? 0}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {intakeLedger?.summary.ghlEnabled === false ? 'GHL disabled in this environment' : 'CRM contacts carrying a Grantscope link'}
                  </div>
                </div>
              </div>
              {intakeActionMessage && (
                <div className="rounded-lg border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {intakeActionMessage}
                </div>
              )}
              {backfillDetails.length > 0 && (
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Backfill review</div>
                      {backfillGeneratedLabel && (
                        <div className="mt-1 text-[11px] text-slate-500">Last checked {backfillGeneratedLabel}</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allFilteredUnmatchedDetails.length > 0 && (
                        <button
                          type="button"
                          onClick={() => void handleBulkReviewBackfill(allFilteredUnmatchedDetails)}
                          disabled={intakeBulkReviewLoading}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {intakeBulkReviewLoading
                            ? 'Reviewing…'
                            : `Mark ${allFilteredUnmatchedDetails.length} unmatched reviewed`}
                        </button>
                      )}
                      {showReviewedBackfill && allFilteredReviewedDetails.length > 0 && (
                        <button
                          type="button"
                          onClick={() => void handleBulkUndoReviewBackfill(allFilteredReviewedDetails)}
                          disabled={intakeBulkUndoReviewLoading}
                          className="rounded-md border border-violet-300 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-900 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {intakeBulkUndoReviewLoading
                            ? 'Restoring…'
                            : `Undo ${allFilteredReviewedDetails.length} reviewed`}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleCopyUnresolvedList()}
                        className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 hover:bg-slate-50"
                      >
                        Copy unresolved list
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAllBackfillRows((current) => !current)}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          showAllBackfillRows
                            ? 'border-sky-300 bg-sky-50 text-sky-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {showAllBackfillRows ? 'Show fewer rows' : 'Show all rows'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewedBackfill((current) => !current)}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          showReviewedBackfill
                            ? 'border-violet-300 bg-violet-50 text-violet-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {showReviewedBackfill ? 'Hide reviewed' : 'Show reviewed'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackfillReviewFilter('strongest')}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          backfillReviewFilter === 'strongest'
                            ? 'border-sky-300 bg-sky-50 text-sky-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Strongest first
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackfillReviewFilter('decision')}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          backfillReviewFilter === 'decision'
                            ? 'border-amber-300 bg-amber-50 text-amber-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Needs decision
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackfillReviewFilter('unmatched')}
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          backfillReviewFilter === 'unmatched'
                            ? 'border-slate-300 bg-slate-100 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Unmatched only
                      </button>
                    </div>
                  </div>
                  <div className={`mt-3 grid gap-3 ${showReviewedBackfill ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Linked {allFilteredLinkedDetails.length}
                        </div>
                        {!showAllBackfillRows && allFilteredLinkedDetails.length > filteredLinkedDetails.length && (
                          <div className="text-[10px] text-emerald-700">Showing {filteredLinkedDetails.length}</div>
                        )}
                      </div>
                      <div className="mt-2 space-y-2">
                        {filteredLinkedDetails.map((detail) => (
                          <div key={detail.contactId} className="text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{detail.contactLabel}</div>
                            {backfillContextLine(detail) && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{backfillContextLine(detail)}</div>
                            )}
                            <div>{detail.targetName} · {matchBasisLabel(detail.basis) || detail.basis}</div>
                            <div className="mt-2">
                              <a
                                href={`/admin/partners/${detail.contactId}`}
                                className="inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900 hover:bg-emerald-100"
                              >
                                Open contact
                              </a>
                            </div>
                          </div>
                        ))}
                        {filteredLinkedDetails.length === 0 && (
                          <div className="text-xs text-slate-500">No linked rows in this view.</div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          Ambiguous {allFilteredAmbiguousDetails.length}
                        </div>
                        {!showAllBackfillRows && allFilteredAmbiguousDetails.length > filteredAmbiguousDetails.length && (
                          <div className="text-[10px] text-amber-700">Showing {filteredAmbiguousDetails.length}</div>
                        )}
                      </div>
                      <div className="mt-2 space-y-2">
                        {filteredAmbiguousDetails.map((detail) => (
                          <div key={detail.contactId} className="text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{detail.contactLabel}</div>
                            {backfillContextLine(detail) && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{backfillContextLine(detail)}</div>
                            )}
                            {detail.reviewBasis && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{matchBasisLabel(detail.reviewBasis)}</div>
                            )}
                            <div>{detail.candidateTargetNames?.join(' · ') || 'Multiple candidates'}</div>
                            {detail.candidateTargets && detail.candidateTargets.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {detail.candidateTargets.map((target) => (
                                  <button
                                    key={target.id}
                                    type="button"
                                    onClick={() => void handleResolveBackfill(detail.contactId, target.id, target.name)}
                                    disabled={intakeResolveContactId === detail.contactId}
                                    className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-900 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {intakeResolveContactId === detail.contactId ? 'Resolving…' : `Use ${target.name}`}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {filteredAmbiguousDetails.length === 0 && (
                          <div className="text-xs text-slate-500">No ambiguous rows in this view.</div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          Unmatched {allFilteredUnmatchedDetails.length}
                        </div>
                        {!showAllBackfillRows && allFilteredUnmatchedDetails.length > filteredUnmatchedDetails.length && (
                          <div className="text-[10px] text-slate-500">Showing {filteredUnmatchedDetails.length}</div>
                        )}
                      </div>
                      <div className="mt-2 space-y-2">
                        {filteredUnmatchedDetails.map((detail) => (
                          <div key={detail.contactId} className="text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{detail.contactLabel}</div>
                            {backfillContextLine(detail) && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{backfillContextLine(detail)}</div>
                            )}
                            {detail.reviewBasis && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{matchBasisLabel(detail.reviewBasis)}</div>
                            )}
                            <div>No Goods outreach target match found</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <a
                                href={`/admin/partners/${detail.contactId}`}
                                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 hover:bg-slate-100"
                              >
                                Open contact
                              </a>
                              <button
                                type="button"
                                onClick={() => void handleReviewBackfill(detail.contactId, detail.contactLabel)}
                                disabled={intakeReviewContactId === detail.contactId}
                                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {intakeReviewContactId === detail.contactId ? 'Saving…' : 'Mark reviewed'}
                              </button>
                            </div>
                          </div>
                        ))}
                        {filteredUnmatchedDetails.length === 0 && (
                          <div className="text-xs text-slate-500">No unmatched rows in this view.</div>
                        )}
                      </div>
                    </div>
                    {showReviewedBackfill && (
                      <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                            Reviewed {allFilteredReviewedDetails.length}
                          </div>
                          {!showAllBackfillRows && allFilteredReviewedDetails.length > filteredReviewedDetails.length && (
                            <div className="text-[10px] text-violet-700">Showing {filteredReviewedDetails.length}</div>
                          )}
                        </div>
                        <div className="mt-2 space-y-2">
                          {filteredReviewedDetails.map((detail) => (
                            <div key={detail.contactId} className="text-xs text-slate-700">
                              <div className="font-semibold text-slate-900">{detail.contactLabel}</div>
                              {backfillContextLine(detail) && (
                                <div className="mt-0.5 text-[11px] text-slate-500">{backfillContextLine(detail)}</div>
                              )}
                              <div className="mt-0.5 text-[11px] text-slate-500">
                                Reviewed {detail.reviewedAt ? new Date(detail.reviewedAt).toLocaleDateString('en-AU') : 'recently'}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <a
                                  href={`/admin/partners/${detail.contactId}`}
                                  className="inline-flex items-center gap-2 rounded-md border border-violet-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-900 hover:bg-violet-100"
                                >
                                  Open contact
                                </a>
                                <button
                                  type="button"
                                  onClick={() => void handleUndoReviewBackfill(detail.contactId, detail.contactLabel)}
                                  disabled={intakeUndoReviewContactId === detail.contactId}
                                  className="inline-flex items-center gap-2 rounded-md border border-violet-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-900 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {intakeUndoReviewContactId === detail.contactId ? 'Restoring…' : 'Undo reviewed'}
                                </button>
                              </div>
                            </div>
                          ))}
                          {filteredReviewedDetails.length === 0 && (
                            <div className="text-xs text-slate-500">No reviewed rows in this view.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {!showAllBackfillRows && hiddenBackfillRowsCount > 0 && (
                    <div className="mt-3 text-[11px] text-slate-500">
                      {hiddenBackfillRowsCount} additional rows are hidden in this view. Show all rows before doing a full-panel sweep.
                    </div>
                  )}
                </div>
              )}
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Top buyer intake</div>
                  <div className="mt-3 space-y-3">
                    {discoveryBuyers.map((target) => (
                      <div key={target.id} className="border-l-2 border-sky-300 pl-3">
                        {(() => {
                          const status = intakeStatusById.get(target.id);
                          return (
                            <>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">{target.name}</span>
                          <Badge className={target.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                            {target.priority}
                          </Badge>
                          <Badge className={intakeStateClassName(status?.state)}>
                            {intakeLedgerLoading ? 'Checking' : intakeStateLabel(status?.state)}
                          </Badge>
                          {status?.grantscopeLinked && (
                            <Badge className="bg-sky-100 text-sky-800">Linked</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{target.nextAction}</p>
                        {!intakeLedgerLoading && (status?.crmMatchBasis || status?.ghlMatchBasis) && (
                          <p className="mt-1 text-[11px] text-slate-500">
                            {status?.state === 'in_ghl'
                              ? matchBasisLabel(status.ghlMatchBasis) || matchBasisLabel(status.crmMatchBasis)
                              : matchBasisLabel(status.crmMatchBasis)}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {status?.state !== 'in_ghl' && (
                            <button
                              type="button"
                              onClick={() => void handlePushTarget(target)}
                              disabled={intakePushTargetId === target.id}
                              className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-900 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {intakePushTargetId === target.id ? 'Pushing…' : 'Push to GHL'}
                            </button>
                          )}
                          <a
                            href={intakeRecordHref(status)}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 hover:bg-slate-100"
                          >
                            {intakeRecordLabel(status)}
                          </a>
                        </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Top capital intake</div>
                  <div className="mt-3 space-y-3">
                    {discoveryCapital.map((target) => (
                      <div key={target.id} className="border-l-2 border-sky-300 pl-3">
                        {(() => {
                          const status = intakeStatusById.get(target.id);
                          return (
                            <>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">{target.name}</span>
                          <Badge className={target.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                            {target.priority}
                          </Badge>
                          <Badge className={intakeStateClassName(status?.state)}>
                            {intakeLedgerLoading ? 'Checking' : intakeStateLabel(status?.state)}
                          </Badge>
                          {status?.grantscopeLinked && (
                            <Badge className="bg-sky-100 text-sky-800">Linked</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{target.nextAction}</p>
                        {!intakeLedgerLoading && (status?.crmMatchBasis || status?.ghlMatchBasis) && (
                          <p className="mt-1 text-[11px] text-slate-500">
                            {status?.state === 'in_ghl'
                              ? matchBasisLabel(status.ghlMatchBasis) || matchBasisLabel(status.crmMatchBasis)
                              : matchBasisLabel(status.crmMatchBasis)}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {status?.state !== 'in_ghl' && (
                            <button
                              type="button"
                              onClick={() => void handlePushTarget(target)}
                              disabled={intakePushTargetId === target.id}
                              className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-900 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {intakePushTargetId === target.id ? 'Pushing…' : 'Push to GHL'}
                            </button>
                          )}
                          <a
                            href={intakeRecordHref(status)}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 hover:bg-slate-100"
                          >
                            {intakeRecordLabel(status)}
                          </a>
                        </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Top partner intake</div>
                  <div className="mt-3 space-y-3">
                    {discoveryPartners.map((target) => (
                      <div key={target.id} className="border-l-2 border-sky-300 pl-3">
                        {(() => {
                          const status = intakeStatusById.get(target.id);
                          return (
                            <>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">{target.name}</span>
                          <Badge className={target.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                            {target.priority}
                          </Badge>
                          <Badge className={intakeStateClassName(status?.state)}>
                            {intakeLedgerLoading ? 'Checking' : intakeStateLabel(status?.state)}
                          </Badge>
                          {status?.grantscopeLinked && (
                            <Badge className="bg-sky-100 text-sky-800">Linked</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{target.nextAction}</p>
                        {!intakeLedgerLoading && (status?.crmMatchBasis || status?.ghlMatchBasis) && (
                          <p className="mt-1 text-[11px] text-slate-500">
                            {status?.state === 'in_ghl'
                              ? matchBasisLabel(status.ghlMatchBasis) || matchBasisLabel(status.crmMatchBasis)
                              : matchBasisLabel(status.crmMatchBasis)}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {status?.state !== 'in_ghl' && (
                            <button
                              type="button"
                              onClick={() => void handlePushTarget(target)}
                              disabled={intakePushTargetId === target.id}
                              className="inline-flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-900 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {intakePushTargetId === target.id ? 'Pushing…' : 'Push to GHL'}
                            </button>
                          )}
                          <a
                            href={intakeRecordHref(status)}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 hover:bg-slate-100"
                          >
                            {intakeRecordLabel(status)}
                          </a>
                        </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Program Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TIMELINE.map((event, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${event.completed ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <div className="mt-0.5">
                      {event.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : event.type === 'deadline' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-slate-900">{event.title}</span>
                        <Badge className={`text-xs ${
                          event.type === 'session' ? 'bg-blue-100 text-blue-700' :
                          event.type === 'webinar' ? 'bg-purple-100 text-purple-700' :
                          event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(event.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights from Speakers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Key Investor Insights (Session 1)
              </CardTitle>
              <CardDescription>What the panelists said and what it means for Goods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SESSION_KEYS.map((key, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-sm text-slate-900">{key.speaker}</span>
                      <span className="text-xs text-slate-400">{key.role}</span>
                    </div>
                    <div className="bg-slate-50 rounded p-3 mb-3">
                      <p className="text-sm text-slate-700 italic">&ldquo;{key.insight}&rdquo;</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-blue-800 font-medium">{key.actionForGoods}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goods Blended Finance Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Goods Blended Finance Stack (Proposed)
              </CardTitle>
              <CardDescription>Based on Jigsaw case study model: QBE grant de-risks other capital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { layer: 'Guarantees', source: 'Snow Foundation letter of support', color: 'bg-red-100 border-red-300 text-red-800', amount: 'De-risk' },
                  { layer: 'Grants', source: 'QBE ($200K) + IBA 30% ($1.5M) + Existing ($445K)', color: 'bg-orange-100 border-orange-300 text-orange-800', amount: '$2.1M' },
                  { layer: 'Catalytic Capital', source: 'Mindaroo / PFI recoverable', color: 'bg-amber-100 border-amber-300 text-amber-800', amount: '$840K' },
                  { layer: 'Subordinated Debt', source: 'SEFA working capital loan', color: 'bg-blue-100 border-blue-300 text-blue-800', amount: '$300K' },
                  { layer: 'Senior Debt', source: 'IBA Business Loan (70%)', color: 'bg-indigo-100 border-indigo-300 text-indigo-800', amount: '$3.5M' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${item.color}`}>
                    <div>
                      <span className="font-semibold text-sm">{item.layer}</span>
                      <p className="text-xs opacity-75">{item.source}</p>
                    </div>
                    <span className="font-bold text-sm">{item.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">
                  <strong>How it works:</strong> QBE grant sits near the top of the stack, absorbing first losses and de-risking the debt below it.
                  This makes SEFA and IBA more comfortable lending because there&apos;s a philanthropic cushion above them.
                  Snow&apos;s guarantee provides additional protection. This is the Jigsaw model applied to Goods.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'induction' && (
        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900">
                <strong>Session 1 Induction — QBE Offices, Sydney, 31 March 2026.</strong>{' '}
                Materials, cohort list, and follow-up deadlines from Jay Boolkin&apos;s 2 April recap email.
                Jay on leave until 13 April — Adam Long (adam@socialimpacthub.org / 0421 498 170) is backup.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Outstanding Next Steps
              </CardTitle>
              <CardDescription>Surveys and diagnostic intros due this week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {INDUCTION_NEXT_STEPS.map((step, i) => {
                  const colors = {
                    overdue: 'bg-red-50 border-red-200 text-red-900',
                    'due-soon': 'bg-amber-50 border-amber-200 text-amber-900',
                    waiting: 'bg-slate-50 border-slate-200 text-slate-700',
                  };
                  const badges = {
                    overdue: 'bg-red-100 text-red-800',
                    'due-soon': 'bg-amber-100 text-amber-800',
                    waiting: 'bg-slate-100 text-slate-600',
                  };
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${colors[step.status]}`}>
                      <Badge className={`text-xs ${badges[step.status]} whitespace-nowrap`}>{step.due}</Badge>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{step.label}</div>
                        <div className="text-xs opacity-80">{step.detail}</div>
                      </div>
                      {step.status === 'overdue' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Induction Materials
              </CardTitle>
              <CardDescription>Slides, investor alignment tool, funder letter, surveys.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {INDUCTION_MATERIALS.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-900">{m.title}</span>
                        {m.url !== '#' && (
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 break-words">{m.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Cohort ({COHORT_ATTENDEES.length} enterprises)
              </CardTitle>
              <CardDescription>
                Contact details not shared by default — connect via LinkedIn. For a specific intro, email Jay/Adam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {COHORT_ATTENDEES.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      a.us ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                    }`}
                  >
                    <span className={`font-medium ${a.us ? 'text-emerald-900' : 'text-slate-900'}`}>{a.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className={a.us ? 'text-emerald-700' : 'text-slate-500'}>{a.org}</span>
                    {a.us && <Badge className="ml-auto text-xs bg-emerald-100 text-emerald-800">Us</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-purple-600" />
                Program Hosts &amp; Funders
              </CardTitle>
              <CardDescription>QBE, Sefa, PIN, Social Impact Hub team.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {COHORT_HOSTS.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-purple-50 rounded text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{h.name}</div>
                      <div className="text-xs text-slate-500">
                        {h.org} · {h.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Learning Opportunities
              </CardTitle>
              <CardDescription>
                Free access to Social Impact Hub webinars — promo code <strong>CATALYSINGIMPACT</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: 'Fri 7 Apr', title: 'Finding Money', desc: 'Where for-purpose orgs go wrong and how to get revenue strategy right', time: '12:30-1:30pm AEST' },
                  { date: 'Fri 24 Apr', title: 'Impact Investing 101', desc: 'Types of investors, types of capital', time: '12-1pm AEST' },
                  { date: 'Fri 1 May', title: 'How Legal Structures Shape Impact Investing', desc: 'Keith Rovers (Mint Ellison) — hybrid entities', time: '12-1pm AEST' },
                  { date: 'Fri 8 May', title: 'Deal Anatomy', desc: 'Inside an impact investment transaction', time: '12-1pm AEST' },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-amber-50 rounded">
                    <div className="text-xs font-bold text-amber-800 w-20 shrink-0">{w.date}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">{w.title}</div>
                      <div className="text-xs text-slate-500">
                        {w.desc} · {w.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="space-y-6">
          {/* 7 Layers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                The 7 Layers of Value
              </CardTitle>
              <CardDescription>This isn&apos;t a $10K grant. It&apos;s a $400K-$1.5M capital access program.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { layer: 1, title: '$10K Participation Grant', status: 'secured' as const, value: '$10,000', desc: 'Cash in hand. Chase outstanding $10,800 on INV-0289.', action: 'Tag to ACT-GD in Xero' },
                  { layer: 2, title: 'Free Expert Advisory (PIN)', status: 'secured' as const, value: '$20-50K equiv', desc: 'Investment readiness diagnostic + tailored advisory. Free management consulting from social enterprise specialists.', action: 'Request "Impact Investment Readiness" diagnostic — maps to Stage 2 assessors + SEFA prep' },
                  { layer: 3, title: 'QBE Skilled Volunteering', status: 'competitive' as const, value: 'Priceless', desc: 'QBE employees (actuaries, analysts, risk managers) work alongside your team for weeks. Only 3 of 10 selected in Year 1.', action: 'Request: "Build 5-year financial model", "Risk assessment for remote expansion", "Investor deck for impact lenders"' },
                  { layer: 4, title: 'Design-Thinking Hackathon', status: 'competitive' as const, value: 'Priceless', desc: 'Full-day session where cross-functional QBE teams work on your challenges. Free innovation sprint with corporate firepower.', action: 'Focus: scale distribution to remote communities, supply chain for fleet operations' },
                  { layer: 5, title: 'Stage 2 Catalytic Grant', status: 'competitive' as const, value: '$150K-$400K', desc: 'From $1M pool. Year 1: 5 of 10 got grants ($50K-$350K) = 50% hit rate. Selection formula (clause 6.4): "degree to which funding leverages further funding and generates impact."', action: 'THE MULTIPLIER STORY WINS. Show $250K from QBE unlocks $750K+ from elsewhere.' },
                  { layer: 6, title: 'Live Crowdfunding Showcase', status: 'stage2' as const, value: '$5-15K', desc: 'Pitch to 200+ QBE employees at Sydney HQ via The Funding Network. Year 1 raised $55K total across all enterprises.', action: 'This is Nick\'s moment. Orange Sky co-founder + 2016 Young Australian of the Year + washing machines on Country = powerful story.' },
                  { layer: 7, title: 'Network & Relationship Effects', status: 'ongoing' as const, value: 'Long-term', desc: 'SIH letter of support, curated funder intros, SIH co-investment (clause 5.3 — 3 years), QBE commercial insurance, QBE procurement, AcceliCITY program, Local Grants 2027 ($50K), alumni network.', action: 'Use SIH letter immediately in all funding applications. Explore QBE fleet insurance for washing machines.' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    item.status === 'secured' ? 'border-emerald-300 bg-emerald-50' :
                    item.status === 'competitive' ? 'border-amber-300 bg-amber-50' :
                    item.status === 'stage2' ? 'border-blue-300 bg-blue-50' :
                    'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        item.status === 'secured' ? 'bg-emerald-600 text-white' :
                        item.status === 'competitive' ? 'bg-amber-600 text-white' :
                        item.status === 'stage2' ? 'bg-blue-600 text-white' :
                        'bg-slate-600 text-white'
                      }`}>
                        {item.layer}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm">{item.title}</span>
                          <Badge className={`text-xs ${
                            item.status === 'secured' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'competitive' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'stage2' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status === 'secured' ? 'Secured' :
                             item.status === 'competitive' ? 'Competitive' :
                             item.status === 'stage2' ? 'If Stage 2' : 'Ongoing'}
                          </Badge>
                          <span className="text-sm font-bold text-slate-700">{item.value}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{item.desc}</p>
                        <div className="flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-blue-800 font-medium">{item.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Year 1 Benchmark */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Year 1 Benchmark (2025 Cohort)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">$3.77M</div>
                  <div className="text-xs text-purple-600">Total unlocked</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">$1.02M</div>
                  <div className="text-xs text-purple-600">QBE grants</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">$2.75M</div>
                  <div className="text-xs text-purple-600">External leveraged</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">50%</div>
                  <div className="text-xs text-purple-600">Stage 2 hit rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage 2 Multiplier Pitch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Stage 2 Multiplier Pitch
              </CardTitle>
              <CardDescription>Clause 6.4: &ldquo;The degree to which the funding will leverage further funding and generate impact.&rdquo;</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700">Source</th>
                        <th className="text-right py-2 pr-4 font-semibold text-slate-700">Amount</th>
                        <th className="text-left py-2 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { source: 'QBE Catalysing Impact Grant', amount: '$250K', status: 'Stage 2 target', highlight: true },
                        { source: 'Snow Foundation', amount: '$250K', status: 'Probable ($200K received + R4)', highlight: false },
                        { source: 'SEFA concessional loan', amount: '$200K', status: 'Probable (in discussion)', highlight: false },
                        { source: 'IBA Social Enterprise Grant', amount: '$125K', status: 'Probable', highlight: false },
                        { source: 'REAL Innovation Fund', amount: '$200K', status: 'EOI submitted', highlight: false },
                        { source: 'PFI Repayable Grant', amount: '$640K', status: 'EOI submitted', highlight: false },
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-slate-100 ${row.highlight ? 'bg-amber-50' : ''}`}>
                          <td className="py-2 pr-4">{row.source}</td>
                          <td className="py-2 pr-4 text-right font-bold">{row.amount}</td>
                          <td className="py-2 text-slate-500">{row.status}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-900 text-white">
                        <td className="py-2 pr-4 font-bold rounded-bl-lg pl-2">TOTAL</td>
                        <td className="py-2 pr-4 text-right font-bold">$1.67M</td>
                        <td className="py-2 font-bold rounded-br-lg">Fund production facility</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 font-medium">
                    Every dollar of external capital lined up before Stage 2 = more QBE dollars. Even Letters of Intent count.
                    The single most important thing: secure and document external capital commitments NOW.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Advantages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                What ACT Has That Other Enterprises Don&apos;t
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { icon: '🏆', advantage: 'Nicholas Marchesi OAM', detail: 'Co-founder of Orange Sky, 2016 Young Australian of the Year, Stanford Executive Program, Obama Foundation Leader. Instant credibility with any audience.' },
                  { icon: '🔧', advantage: '20 operational washing machines + IoT telemetry', detail: 'Real assets, real data, real utilisation metrics. Not a prototype — operating infrastructure with Particle.io devices.' },
                  { icon: '📊', advantage: 'Fleet management dashboard', detail: 'Live data from IoT devices. Most social enterprises can\'t show real-time impact metrics. This is your secret weapon.' },
                  { icon: '💰', advantage: '$1.3M FY26 revenue', detail: 'This isn\'t a startup with projections — it\'s an operating entity with real trade revenue.' },
                  { icon: '📖', advantage: 'The narrative: Orange Sky → Goods on Country', detail: 'Same washing machine, evolved. Laundry for homeless → laundry + economic empowerment on Country. QBE employees will get it in 30 seconds.' },
                  { icon: '🏭', advantage: '389 products deployed across 8 communities', detail: 'Real field-tested products. 33 storytellers documenting impact. Asset register with QR-coded lifecycle tracking.' },
                  { icon: '🔄', advantage: 'Circular economy loop', detail: 'Community waste → beds → community ownership. Each bed diverts 20kg HDPE from landfill. 125 tonnes/year at scale.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="font-semibold text-sm text-slate-900">{item.advantage}</span>
                      <p className="text-xs text-slate-600 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-blue-600" />
                Critical Path to Stage 2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { workstream: 'Immediate', actions: 'Chase $10,800 invoice (INV-0289). Choose "Impact Investment Readiness" diagnostic. Attend all webinars.', why: 'Foundations — don\'t leave money on the table' },
                  { workstream: 'External Capital (#1 lever)', actions: 'Start SEFA conversation → get LOI. Follow up PFI EOI. Follow up REAL submission. Apply IBA Social Enterprise Grant. Document everything with dollar amounts.', why: 'Every LOI = more Stage 2 dollars. The multiplier story wins.' },
                  { workstream: 'Fleet Data (secret weapon)', actions: 'Package 20 machines + IoT telemetry as impact dashboard. Utilisation rates, communities served, jobs created.', why: 'Real data beats pitch decks. Most enterprises can\'t show this.' },
                  { workstream: 'Advisory (extract max value)', actions: 'Financial model with PIN advisor. Investment deck. Impact measurement framework.', why: 'Free $20-50K equivalent consulting — use every minute.' },
                  { workstream: 'Skilled Volunteering', actions: 'Lobby hard for selection. Get QBE analysts to build your financial model.', why: 'Corporate firepower on your hardest problems.' },
                  { workstream: 'Pitch Prep', actions: 'Nick\'s story + fleet data + financial model for crowdfunding showcase.', why: '200+ QBE employees become your champions and internal advocates.' },
                ].map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${i === 0 ? 'bg-red-100 text-red-800' : i === 1 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.workstream}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700">{item.actions}</p>
                    <p className="text-xs text-slate-500 mt-1 italic">{item.why}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'financial-model' && (
        <div className="space-y-6">
          {/* Revenue Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Revenue Projections (from PFI Application)
              </CardTitle>
              <CardDescription>3-year scale-up: containerised manufacturing on Jinibara Country → Central Aus → Top End</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Metric</th>
                      <th className="text-right py-2 pr-4 font-semibold text-slate-700">Year 1</th>
                      <th className="text-right py-2 pr-4 font-semibold text-slate-700">Year 2</th>
                      <th className="text-right py-2 font-semibold text-slate-700">Year 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { metric: 'Units produced', y1: '1,500', y2: '3,500', y3: '5,000' },
                      { metric: 'Revenue', y1: '$1.1M', y2: '$2.6M', y3: '$4.0M' },
                      { metric: 'Cost per unit', y1: '~$520', y2: '~$350', y3: '~$350' },
                      { metric: 'Gross margin', y1: '$330K', y2: '$1.05M', y3: '$1.75M' },
                      { metric: 'Operating costs', y1: '~$600K', y2: '~$600K', y3: '~$600K' },
                      { metric: 'Net surplus', y1: '-$270K', y2: '$450K', y3: '$1.15M' },
                      { metric: 'Facilities active', y1: '1 (QLD)', y2: '2 (+Central Aus)', y3: '3 (+Top End)' },
                      { metric: 'FTE jobs', y1: '9', y2: '21', y3: '30' },
                      { metric: 'Plastic diverted', y1: '37.5t', y2: '87.5t', y3: '125t' },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i === 5 ? 'bg-emerald-50 font-semibold' : ''}`}>
                        <td className="py-2 pr-4 text-slate-700">{row.metric}</td>
                        <td className="py-2 pr-4 text-right">{row.y1}</td>
                        <td className="py-2 pr-4 text-right">{row.y2}</td>
                        <td className="py-2 text-right">{row.y3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-3">Conservative: assumes 70% capacity utilisation. Demand evidence (389 deployed, 1,000+ requested) confirms demand exceeds production capacity 3-5x.</p>
            </CardContent>
          </Card>

          {/* Cost Reduction Pathway */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Cost Reduction Pathway (per bed)
              </CardTitle>
              <CardDescription>$520 → $350 per unit. Key driver: CNC cutting time 4hrs → 2hrs = $60/unit saving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { component: 'Raw materials (steel $27, canvas $94, HDPE free)', y1: 130, y3: 100, how: 'Volume supplier agreements, canvas renegotiation at 5,000+' },
                  { component: 'Manufacturing labour', y1: 180, y3: 100, how: 'CNC cutting from 4hrs → 2hrs (tooling + template optimisation), community operators' },
                  { component: 'Facility operating (diesel, maintenance, depreciation)', y1: 130, y3: 80, how: 'Solar-hybrid power reduces diesel; depreciation spreads across volume' },
                  { component: 'Distribution / logistics', y1: 80, y3: 70, how: 'Regional facilities reduce freight distances' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-slate-900">{item.component}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600">${item.y1}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-emerald-600 font-bold">${item.y3}</span>
                        <Badge className="text-xs bg-emerald-100 text-emerald-700">-${item.y1 - item.y3}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{item.how}</p>
                    {/* Progress bar */}
                    <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((item.y1 - item.y3) / (520 - 350)) * 100}%` }} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg">
                  <span className="font-bold">Total per bed</span>
                  <div className="flex items-center gap-2">
                    <span>$520</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-bold text-emerald-400">$350</span>
                    <Badge className="bg-emerald-600 text-white text-xs">-$170 (33%)</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-blue-600" />
                Revenue Streams (at $4M scale)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stream: 'Institutional Sales (B2B)', pct: 60, amount: '$2.4M', desc: 'Bulk orders from health services, housing providers, community orgs. Centre Corp (107 beds approved), Miwatj Health (8 clinics), NPY Women\'s Council, Groote (500 mattresses + 300 washers). Repeat customers with ongoing needs.', color: 'bg-blue-500' },
                  { stream: 'Government Procurement', pct: 25, amount: '$1.0M', desc: 'State/territory housing departments replacing disposable mattresses. NT Remote Housing ($4B/10yr), QLD Remote Indigenous Housing, WA Remote Communities. Lower lifecycle cost argument.', color: 'bg-emerald-500' },
                  { stream: 'Retail & Corporate (B2C)', pct: 15, amount: '$600K', desc: 'Direct-to-consumer via e-commerce (live). Corporate partnerships: camping, emergency management, defence. QIC interested in building 50 beds with staff for NAIDOC week.', color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${item.color}`} />
                        <span className="font-semibold text-sm">{item.stream}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{item.amount}</span>
                        <Badge className="text-xs bg-slate-100 text-slate-700">{item.pct}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mb-2">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Production Economics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Production Process (10.75 hrs/bed, 18 steps)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { step: 'Plastic collection', hrs: 1.0, level: 'Community', color: 'bg-green-100 text-green-800' },
                  { step: 'Sorting & quality check', hrs: 0.5, level: 'Entry', color: 'bg-green-100 text-green-800' },
                  { step: 'Shredding', hrs: 0.5, level: 'Semi-skilled', color: 'bg-blue-100 text-blue-800' },
                  { step: 'Tray prep + Heating + Pressing', hrs: 1.25, level: 'Semi-skilled', color: 'bg-blue-100 text-blue-800' },
                  { step: 'CNC cutting (biggest cost driver)', hrs: 4.0, level: 'Skilled trade', color: 'bg-purple-100 text-purple-800' },
                  { step: 'Edge finishing + Assembly', hrs: 0.75, level: 'Semi-skilled', color: 'bg-blue-100 text-blue-800' },
                  { step: 'QR coding + Quality testing', hrs: 0.5, level: 'Admin', color: 'bg-slate-100 text-slate-700' },
                  { step: 'Packaging + Logistics + Delivery', hrs: 1.75, level: 'Mixed', color: 'bg-amber-100 text-amber-800' },
                  { step: 'Community storytelling + Training', hrs: 0.75, level: 'Community', color: 'bg-green-100 text-green-800' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-16 text-right text-xs text-slate-500">{item.hrs}h</div>
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 bg-blue-400 rounded" style={{ width: `${(item.hrs / 10.75) * 100}%` }} />
                      <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-slate-900">{item.step}</span>
                    </div>
                    <Badge className={`text-xs ${item.color} w-24 justify-center`}>{item.level}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Community/entry', pct: '28%', desc: '3.0 hrs/bed' },
                  { label: 'Semi-skilled', pct: '19%', desc: '2.0 hrs/bed' },
                  { label: 'Skilled trade', pct: '42%', desc: '4.5 hrs/bed (CNC)' },
                  { label: 'Admin/mgmt', pct: '11%', desc: '1.25 hrs/bed' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-lg font-bold text-slate-800">{item.pct}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capital Need (from PFI) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-blue-600" />
                Total Capital Need: $3.2M (PFI Application)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { item: 'Container facility #1 (QLD, Jinibara Country)', amount: 600_000, type: 'CapEx' },
                  { item: 'Container facility #2 (Central Australia)', amount: 600_000, type: 'CapEx' },
                  { item: 'Container facility #3 (Top End / Torres Strait)', amount: 600_000, type: 'CapEx' },
                  { item: 'Working capital + raw materials', amount: 600_000, type: 'OpEx' },
                  { item: 'Workforce development + training', amount: 400_000, type: 'OpEx' },
                  { item: 'Technology, logistics, distribution', amount: 250_000, type: 'CapEx' },
                  { item: 'Impact measurement + community engagement', amount: 150_000, type: 'OpEx' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{item.item}</span>
                      <Badge className={`text-xs ${item.type === 'CapEx' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.type}</Badge>
                    </div>
                    <span className="font-bold text-sm">{currency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg mt-2">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-bold text-lg">$3.2M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'capital-types' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'grant', 'debt', 'equity'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setCapitalFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  capitalFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'All 15 Types' : TIER_LABELS[filter]}
              </button>
            ))}
          </div>

          {/* Capital Type Cards */}
          <div className="grid gap-3">
            {filteredCapital.map((cap, i) => (
              <Card key={i} className={`border-l-4 ${
                cap.goodsFit === 'active' ? 'border-l-emerald-500' :
                cap.goodsFit === 'strong' ? 'border-l-green-500' :
                cap.goodsFit === 'possible' ? 'border-l-amber-500' :
                'border-l-slate-300'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-900">{cap.name}</span>
                        <Badge className={`text-xs ${TIER_COLORS[cap.tier]}`}>{cap.tier}</Badge>
                        <Badge className={`text-xs ${FIT_COLORS[cap.goodsFit]}`}>
                          {cap.goodsFit === 'active' ? 'Already Using' : cap.goodsFit === 'strong' ? 'Strong Fit' : cap.goodsFit === 'possible' ? 'Worth Exploring' : 'Not Right Now'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{cap.description}</p>
                      <p className="text-sm text-slate-700">{cap.goodsNotes}</p>
                      {cap.examples && (
                        <div className="flex gap-1 mt-2">
                          {cap.examples.map((ex, j) => (
                            <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{ex}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'investor-pipeline' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Investors aligned with QBE program learnings. Sorted by priority. &quot;New from QBE&quot; = discovered/validated in today&apos;s session.
          </p>
          {INVESTOR_MATCHES.map((inv, i) => (
            <Card key={i} className="border-slate-200 hover:border-slate-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900">{inv.name}</span>
                      <Badge className={`text-xs ${STATUS_COLORS[inv.status]}`}>
                        {inv.status === 'new-from-qbe' ? 'New from QBE' : inv.status}
                      </Badge>
                      <Badge className={`text-xs ${PRIORITY_COLORS[inv.priority]}`}>{inv.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                      <span>{inv.type}</span>
                      <span>{inv.capitalType}</span>
                      <span className="font-medium text-slate-700">{inv.amountRange}</span>
                    </div>
                    <div className="bg-blue-50 rounded p-2 mb-2">
                      <p className="text-xs text-blue-800"><strong>QBE Alignment:</strong> {inv.qbeAlignment}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-emerald-800 font-medium">{inv.nextStep}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'match-tracker' && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                $400K Match Funding Progress
              </CardTitle>
              <CardDescription>QBE grant requires demonstrating matched capital from other sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (MATCH_FUNDING_TRACKER.secured / MATCH_FUNDING_TRACKER.target) * 100)}%` }}
                  />
                  <div
                    className="absolute inset-y-0 bg-amber-400 rounded-r-full transition-all opacity-60"
                    style={{
                      left: `${(MATCH_FUNDING_TRACKER.secured / MATCH_FUNDING_TRACKER.target) * 100}%`,
                      width: `${Math.min(100 - (MATCH_FUNDING_TRACKER.secured / MATCH_FUNDING_TRACKER.target) * 100, (pipelineTotal / MATCH_FUNDING_TRACKER.target) * 100)}%`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">
                      {currency(MATCH_FUNDING_TRACKER.secured)} secured / {currency(MATCH_FUNDING_TRACKER.target)} target
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded" /> Secured</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded" /> Pipeline</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded" /> Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Capital Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MATCH_FUNDING_TRACKER.sources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium text-sm text-slate-900">{source.name}</span>
                      <p className="text-xs text-slate-500">{source.note}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-slate-900">{currency(source.amount)}</span>
                      <Badge className={`ml-2 text-xs ${
                        source.status === 'secured' ? 'bg-emerald-100 text-emerald-800' :
                        source.status === 'conditional' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {source.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Decision Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                The Big Questions to Decide
              </CardTitle>
              <CardDescription>From QBE Session 1 slides — answer these to define your capital strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: 'Can you make regular debt repayments?',
                    answer: 'YES. 73% gross margin at $560/bed. Revenue from institutional orders (govt, health, housing). Working capital needs are seasonal around deployment circuits.',
                    status: 'ready' as const,
                  },
                  {
                    question: 'Are you planning for an exit?',
                    answer: 'Community ownership transfer. PICC wants to buy the manufacturing plant. This IS the exit story — build the capability, transfer to community. Social enterprise model, not VC-style exit.',
                    status: 'ready' as const,
                  },
                  {
                    question: 'Are you willing to let an investor set a valuation?',
                    answer: 'Not relevant for current structure (not-for-profit). But Oonchiumpa (for-profit arm) could potentially take equity if needed for specific deals.',
                    status: 'partial' as const,
                  },
                  {
                    question: 'Are you targeting 3-10x growth in 5 years?',
                    answer: 'YES. Current: ~$240K revenue. 5-year target: $4-5M from NT Housing program ($4B over 10yr, 2,700 homes need beds). 20x growth is realistic with production capacity.',
                    status: 'ready' as const,
                  },
                  {
                    question: 'Are you willing to negotiate custom terms per investor?',
                    answer: 'YES. Already doing this with different funders. Blended stack means each investor has different terms. SEFA as syndicate agent could manage coordination.',
                    status: 'ready' as const,
                  },
                ].map((q, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {q.status === 'ready' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{q.question}</p>
                        <p className="text-sm text-slate-600 mt-1">{q.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'session-notes' && (
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>Session 1 — March 31, 2026</strong> at QBE Offices, Sydney.
                Full transcript and slide photos saved. Facilitator: Jess Grebenschikoff (Social Impact Hub).
              </p>
            </CardContent>
          </Card>

          <CollapsibleCard title="Types of Capital (15 instruments)" icon={Layers} defaultOpen>
            <div className="space-y-4">
              {(['grant', 'debt', 'equity'] as const).map(tier => (
                <div key={tier}>
                  <h4 className="font-semibold text-sm text-slate-700 mb-2">{TIER_LABELS[tier]}</h4>
                  <div className="grid gap-2">
                    {CAPITAL_TYPES.filter(c => c.tier === tier).map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Badge className={`text-xs ${FIT_COLORS[cap.goodsFit]}`}>
                          {cap.goodsFit === 'active' ? 'Using' : cap.goodsFit === 'strong' ? 'Fit' : cap.goodsFit === 'possible' ? 'Maybe' : 'No'}
                        </Badge>
                        <span className="font-medium">{cap.name}</span>
                        <span className="text-slate-400">-</span>
                        <span className="text-slate-500">{cap.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Blended Finance Definition" icon={Handshake}>
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded-r-lg">
              <p className="text-sm italic text-blue-900">
                &ldquo;A strategy that combines the right mix of capital from multiple stakeholders who have different risk-return requirements on their capital but common impact objectives.&rdquo;
              </p>
              <cite className="text-xs text-blue-600 mt-2 block">- The GIIN, Big Society Capital, World Bank</cite>
            </blockquote>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-sm">4 Types of Blended Finance:</h4>
              {[
                { type: 'Fund-level', desc: 'Concessional + commercial capital in one fund', fit: false },
                { type: 'Project-level', desc: 'Partial funding/guarantees for infrastructure', fit: true },
                { type: 'Company-level', desc: 'Credit enhancement, below-market loans', fit: true },
                { type: 'Outcome-based', desc: 'Corporate bonds/loans tied to SDG impact', fit: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {t.fit ? <Star className="h-4 w-4 text-amber-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                  <span className="font-medium">{t.type}:</span>
                  <span className="text-slate-600">{t.desc}</span>
                  {t.fit && <Badge className="text-xs bg-amber-100 text-amber-700">Best fit for Goods</Badge>}
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Jigsaw Case Study (Model for Goods)" icon={Building2}>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Jigsaw raised $3M to expand &quot;prepare for work&quot; model from Sydney/Brisbane to 6 national hubs.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600">Debt Investment</div>
                  <div className="text-xl font-bold text-blue-800">$2.1M</div>
                  <div className="text-xs text-blue-600">70% of raise</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-600">Grant Funding</div>
                  <div className="text-xl font-bold text-green-800">$0.9M</div>
                  <div className="text-xs text-green-600">30% of raise</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">Syndicate Agent: SEFA</p>
                <p className="text-xs text-slate-500">
                  Investors: Westpac Foundation, Paul Ramsay Foundation, Scalzo Foundation, <strong>Snow Foundation</strong>,
                  Impact Generation Partners, RW Fenton Family Trust, Bryan Foundation, Lord Mayor&apos;s Charitable Foundation, Ian Potter Foundation
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Key for Goods:</strong> Snow Foundation is already in the Jigsaw deal AND already a Goods funder.
                  SEFA acted as syndicate agent. This is the exact template for a Goods blended raise.
                </p>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Sefa: 6 Loan Products (Hanna Ebeling's slides)" icon={Banknote}>
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                <strong>$160M unlocked since 2011. 170+ orgs backed. 75+ deals. $50M+ direct loans.</strong>
              </p>
              <div className="grid gap-2">
                {[
                  { name: 'Transition Loan', desc: 'Working capital to meet next milestone — grant payment, contract kick-off, launch date' },
                  { name: 'Home for Impact Loan', desc: 'Buy, lease, or fit out a building for impact' },
                  { name: 'Growth Impact Loan', desc: 'Invest in people, programs, systems to grow impact without giving up equity or control' },
                  { name: 'Procurement Readiness Impact Loan', desc: 'Secure finance to fulfil a confirmed procurement contract with government or another party', fit: true },
                  { name: 'Blended Finance', desc: 'Assemble philanthropy + government grants + investors for complex projects' },
                  { name: 'Co-investment Syndicates', desc: 'Bring together partners and investors to co-create large-scale deals (Sefa was syndicate agent for Jigsaw $3M raise)' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded ${
                      p.fit ? 'bg-emerald-50 border border-emerald-300' : 'bg-slate-50'
                    }`}
                  >
                    {p.fit ? (
                      <Star className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-600">{p.desc}</div>
                      {p.fit && (
                        <Badge className="mt-1 text-xs bg-emerald-100 text-emerald-800">
                          Best fit: Centre Corp 107 beds, Miwatj 8 clinics, NPY 200-350 beds, WHSAC 500 mattress pipeline
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 mt-2">
                <p className="text-xs font-semibold text-blue-900 mb-2">Direct Contacts (from slide 59):</p>
                <div className="text-xs text-blue-800 space-y-1">
                  <div><strong>Hanna Ebeling</strong> — CEO · hanna.ebeling@sefa.com.au · 0475 084 855</div>
                  <div><strong>Renee Martin</strong> — Head of Impact & Advisory · renee.martin@sefa.com.au · 0409 926 646</div>
                  <div><strong>Jennifer Turner</strong> — Head of Impact Investment · jennifer.turner@sefa.com.au · 0408 480 313</div>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>Debt docs Sefa wants to see:</strong> historical financials, forecast financials, constitution,
                  org chart, business plan / pitch deck, theory of change, evidence of impact measurement.
                </p>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="SEFA Loan Process" icon={Clock}>
            <div className="space-y-3">
              {[
                { phase: 'Initial Phase', time: '2-4 weeks', steps: ['Enquiry/referral', 'Initial conversation', 'Mutual understanding'] },
                { phase: 'Analysis Phase', time: '2-3 months', steps: ['Documentation review', 'Information gathering', 'Scenario analysis', 'Investment committee green light'] },
                { phase: 'Execution Phase', time: '2-4 weeks', steps: ['Letter of offer', 'Legal documentation', '1% establishment fee', 'Disbursement', 'Ongoing reporting'] },
              ].map((p, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-slate-100 text-slate-700 text-xs">{p.time}</Badge>
                    <span className="font-semibold text-sm">{p.phase}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.steps.map((s, j) => (
                      <span key={j} className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-800">
                  <strong>Hannah&apos;s key points:</strong> No early repayment penalties (40%+ repay early).
                  Requires independent board directors (majority). Only 3/75 loans ever had issues (2 were fraud).
                  SEFA has $9M undeployed capital ready to go.
                </p>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Investor Knockout Criteria" icon={Search}>
            <div className="space-y-2">
              {[
                { criteria: 'Investment Geography', check: 'Invests in NT / remote Australia', goods: 'IBA, SEFA, Snow all invest in remote' },
                { criteria: 'Legal Structure', check: 'Invests in not-for-profit / hybrid', goods: 'ACT Ltd + Oonchiumpa Pty Ltd hybrid' },
                { criteria: 'Investment Size', check: 'Matches our capital need', goods: '$300K-$5M range across stack' },
                { criteria: 'Return Expectations', check: 'Aligns on impact return', goods: 'Social impact primary, financial secondary' },
                { criteria: 'Capital Type', check: 'Offers grant/debt/recoverable', goods: 'Not seeking equity (yet)' },
                { criteria: 'Stage of Growth', check: 'Invests at our stage', goods: 'Revenue-generating, production scaling' },
              ].map((k, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-2 bg-slate-50 rounded">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">{k.criteria}:</span>{' '}
                    <span className="text-slate-600">{k.check}</span>
                  </div>
                  <span className="text-xs text-emerald-600">{k.goods}</span>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Upcoming Webinars (Free Access)" icon={Calendar}>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Register at socialimpacthub.org (Events + Courses) with promo code: <strong>CATALYSINGIMPACT</strong>
              </p>
              {[
                { date: 'April 7', title: 'Finding Money', desc: 'Revenue strategy for purpose organisations', time: '12:30-1:30pm AEST' },
                { date: 'April 24', title: 'Impact Investing 101', desc: 'Types of investors and capital', time: '12-1pm AEST' },
                { date: 'May 1', title: 'Legal Structures & Impact Investing', desc: 'Keith Rovers (Mint Ellison) — hybrid entities, legal toolkit', time: '12-1pm AEST' },
                { date: 'May 8', title: 'Deal Anatomy', desc: 'Inside an impact investment transaction', time: '12-1pm AEST' },
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                  <div className="text-xs font-bold text-purple-800 w-16">{w.date}</div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-slate-900">{w.title}</span>
                    <span className="text-xs text-slate-500 ml-2">{w.time}</span>
                    <p className="text-xs text-slate-500">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Peer Enterprises (Cohort)" icon={Users}>
            <div className="space-y-2 text-sm">
              {[
                { name: 'Good Cycles', note: 'Returning participant. Complex blended finance model. Kira leads.' },
                { name: 'Adapt Homes (Jeff)', note: 'Extra-large tiny homes on wheels for disaster recovery. Insurance adjacency.' },
                { name: 'Robofix', note: 'Exoskeletons for mobility. QLD Govt $200K revenue-linked investment.' },
                { name: 'Patburn Co-op', note: 'Community energy. 2 wind turbines, 2000 members, $9M raised (co-op + grants + bank).' },
                { name: 'Play it Forward', note: 'Grant-funded DGR1 entity.' },
                { name: 'Tender Funerals', note: 'SEFA client. Affordable community-led social franchise model. Already refinancing SEFA with bank.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-medium text-slate-900 whitespace-nowrap">{p.name}</span>
                  <span className="text-slate-500">{p.note}</span>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
        Full transcript and session photos saved in <code>thoughts/shared/qbe-program/</code>.
        Aligned with Grantscope outreach targets at <code>v2/src/lib/data/outreach-targets.ts</code>.
      </div>
    </div>
  );
}
