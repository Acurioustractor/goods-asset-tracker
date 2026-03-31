'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Clock,
  Target,
  Users,
  Phone,
  Mail,
  FileText,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Action {
  text: string;
  done: boolean;
  critical?: boolean;
  contact?: string;
}

interface Week {
  number: number;
  dates: string;
  title: string;
  focus: string;
  events?: string[];
  actions: Action[];
}

// ─── Data ───────────────────────────────────────────────────────────────────

const WEEKS: Week[] = [
  {
    number: 1, dates: 'Mar 31 - Apr 4', title: 'FOUNDATIONS', focus: 'Easter week. Jay on leave. Set up everything.',
    actions: [
      { text: 'Chase INV-0289 ($10,800 outstanding QBE participation grant)', done: false, critical: true },
      { text: 'Register for all 4 webinars at socialimpacthub.org (code: CATALYSINGIMPACT)', done: false, critical: true },
      { text: 'Request "Impact Investment Readiness" diagnostic from Jay/Adam', done: false, critical: true },
      { text: 'Review Finance Engine (/admin/finance-model) — run all 4 scenarios', done: false },
      { text: 'Review LOI Tracker (/admin/loi-tracker) — confirm buyer details current', done: false },
    ],
  },
  {
    number: 2, dates: 'Apr 7 - Apr 11', title: 'LOIs START', focus: 'Get buyer commitments on paper. Every LOI = more Stage 2 dollars.',
    events: ['Webinar: Finding Money (Apr 7, 12:30pm)'],
    actions: [
      { text: 'Attend webinar: Finding Money (Apr 7)', done: false },
      { text: 'Email Centre Corp (Randle Walker) — request formal LOI for 107 beds ($59,920)', done: false, critical: true, contact: 'Randle Walker' },
      { text: 'Email Miwatj Health (Jessica Allardyce) — request written expression of interest for 8-clinic fleet', done: false, critical: true, contact: 'Jessica Allardyce' },
      { text: 'Email NPY Women\'s Council (Angela Lynch) — request written LOI with volume (200-350 beds)', done: false, critical: true, contact: 'Angela Lynch' },
      { text: 'Draft LOI template and share with all buyers to make it easy', done: false },
    ],
  },
  {
    number: 3, dates: 'Apr 14 - Apr 18', title: 'SEFA CONVERSATION', focus: 'THE highest-leverage action in the whole program. Hannah has $9M to deploy.',
    actions: [
      { text: 'Email SEFA (Hannah/Joel Bird) — introduce Goods, reference QBE program, request initial conversation', done: false, critical: true, contact: 'Hannah (SEFA CEO)' },
      { text: 'Prepare SEFA package: exec summary, Finance Engine P&L, Impact Dashboard numbers, LOIs to date', done: false, critical: true },
      { text: 'Follow up Groote/WHSAC (Simone Grimmond) — 500 mattresses + 300 washers procurement pathway', done: false, contact: 'Simone Grimmond' },
      { text: 'Follow up Homeland Schools $34,086 invoice (9 days overdue)', done: false },
    ],
  },
  {
    number: 4, dates: 'Apr 21 - Apr 25', title: 'CAPITAL STACK ASSEMBLY', focus: 'Start building the blended finance stack. Approach funders with proof of momentum.',
    events: ['Webinar: Impact Investing 101 (Apr 24, 12pm)'],
    actions: [
      { text: 'Attend webinar: Impact Investing 101 (Apr 24)', done: false },
      { text: 'Compile LOI portfolio — total received, total committed revenue', done: false, critical: true },
      { text: 'Follow up PFI EOI — confirm receipt and timeline', done: false, contact: 'PFIFund@treasury.qld.gov.au' },
      { text: 'Follow up REAL Innovation Fund — any response to Mar 2 EOI?', done: false },
      { text: 'Contact Mindaroo (Lucy Stronach) — approach with QBE + Snow + SEFA stack proof', done: false, critical: true, contact: 'Lucy Stronach' },
      { text: 'Snow Foundation (Sally) — propose blended capital: grant + loan guarantee for SEFA', done: false, critical: true, contact: 'Sally Grimsley-Ballard' },
    ],
  },
  {
    number: 5, dates: 'Apr 28 - May 2', title: 'LEGAL & GOVERNANCE', focus: 'Sort the structural stuff SEFA and investors need to see.',
    events: ['Webinar: Legal Structures (May 1, 12pm)'],
    actions: [
      { text: 'Attend webinar: How Legal Structures Shape Impact Investing (May 1)', done: false },
      { text: 'Board governance review — SEFA requires majority independent directors', done: false, critical: true },
      { text: 'Entity decision: A Curious Tractor Pty Ltd vs A Kind Tractor Ltd for fundraising', done: false, critical: true },
      { text: 'Start Social Traders certification (required before Stage 2)', done: false },
      { text: 'Prepare SEFA docs: FY23-25 financials, business plan, governance summary', done: false },
    ],
  },
  {
    number: 6, dates: 'May 5 - May 9', title: 'DEAL ANATOMY & PITCH PREP', focus: 'Start building the Stage 2 application and pitch deck.',
    events: ['Advisory group check-in (May 5)', 'Webinar: Deal Anatomy (May 8, 12pm)'],
    actions: [
      { text: 'Advisory group check-in — update on QBE progress, capital stack, LOIs', done: false },
      { text: 'Attend webinar: Deal Anatomy (May 8)', done: false },
      { text: 'Draft Stage 2 multiplier pitch using Finance Engine numbers', done: false, critical: true },
      { text: 'Request QBE Skilled Volunteering (Layer 3) — actuaries to validate financial model', done: false, critical: true },
      { text: 'Request QBE Hackathon (Layer 4) — supply chain + remote distribution brief', done: false },
    ],
  },
  {
    number: 7, dates: 'May 12 - May 23', title: 'FINANCIAL MODEL REFINEMENT', focus: 'Two-week sprint on making the numbers bulletproof.',
    actions: [
      { text: 'SEFA due diligence prep (if conversation progressing)', done: false, critical: true },
      { text: 'Financial model validation — QBE volunteers or PIN advisor', done: false, critical: true },
      { text: 'Validate cost reduction pathway ($520 → $350/unit) — CNC cutting proof', done: false },
      { text: 'Start IBA Business Loan application via Oonchiumpa', done: false },
      { text: 'Complete Freshly Impact Network diagnostic with Rebecca Parkinson', done: false },
      { text: 'Update Impact Dashboard with new deployment data', done: false },
    ],
  },
  {
    number: 8, dates: 'May 26 - Jun 6', title: 'STAGE 2 PREPARATION', focus: 'Compile everything into the Stage 2 application. The multiplier table with REAL numbers.',
    actions: [
      { text: 'Compile all capital commitments: LOIs, SEFA status, Snow guarantee, PFI, IBA, Mindaroo', done: false, critical: true },
      { text: 'Build Stage 2 application — multiplier table with real committed amounts', done: false, critical: true },
      { text: 'Nick\'s crowdfunding pitch deck: Orange Sky narrative + fleet data + financial model', done: false, critical: true },
      { text: 'QBE Ventures Lighthouse pitch: 1-page insurance adjacency memo', done: false },
    ],
  },
  {
    number: 9, dates: 'Jun 9 - Jul 4', title: 'APPLICATIONS & CLOSE', focus: 'Submit Stage 2. Continue SEFA process. Push all pipeline to conversion.',
    actions: [
      { text: 'Submit Stage 2 application (watch for deadline from QBE)', done: false, critical: true },
      { text: 'Supply Nation certification via Oonchiumpa (July 1 IPP deadline)', done: false },
      { text: 'Continue SEFA analysis phase', done: false },
      { text: 'Weekly follow-up rhythm on all pipeline funders', done: false },
    ],
  },
  {
    number: 10, dates: 'Jul - Aug', title: 'CLOSE & CONVERT', focus: 'Stage 2 decisions. SEFA execution. QBE match funding deadline Aug 31.',
    actions: [
      { text: 'Stage 2 grant decision expected', done: false, critical: true },
      { text: 'SEFA execution phase: letter of offer → legal → disbursement', done: false },
      { text: 'QBE matched funding deadline (Aug 31) — demonstrate capital raised', done: false, critical: true },
      { text: 'Crowdfunding showcase if Stage 2 — Nick pitches to 200+ QBE employees', done: false },
      { text: 'Close IBA application via Oonchiumpa', done: false },
    ],
  },
];

const KEY_CONTACTS = [
  { name: 'Jay', org: 'QBE Foundation', role: 'Program coordinator', action: 'On leave Easter week. Adam is backup.' },
  { name: 'Hannah', org: 'SEFA (CEO)', role: 'Impact lender', action: 'START CONVERSATION WEEK 3. $9M ready.' },
  { name: 'Joel Bird', org: 'SEFA', role: 'Investment team', action: '23 comms logged. Package blended ask.' },
  { name: 'Sally Grimsley-Ballard', org: 'Snow Foundation', role: 'Anchor funder', action: 'Blended capital: grant + guarantee.' },
  { name: 'Rebecca Parkinson', org: 'Freshly Impact Network', role: 'Diagnostic advisor', action: 'Impact Investment Readiness diagnostic.' },
  { name: 'Randle Walker', org: 'Centre Corp', role: '107 beds approved', action: 'GET LOI ON LETTERHEAD (Week 2)' },
  { name: 'Jessica Allardyce', org: 'Miwatj Health', role: '8-clinic fleet', action: 'GET EXPRESSION OF INTEREST (Week 2)' },
  { name: 'Angela Lynch', org: 'NPY Women\'s Council', role: 'Ongoing buyer', action: 'GET LOI WITH VOLUME (Week 2)' },
  { name: 'Simone Grimmond', org: 'WHSAC (Groote)', role: '500+300 demand', action: 'CONFIRM PROCUREMENT PATHWAY (Week 3)' },
  { name: 'Lucy Stronach', org: 'Mindaroo', role: 'Catalytic capital', action: 'APPROACH WEEK 4 with stack proof.' },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function QBEActionsPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalActions = WEEKS.reduce((s, w) => s + w.actions.length, 0);
  const completedActions = checkedItems.size;
  const criticalActions = WEEKS.reduce((s, w) => s + w.actions.filter(a => a.critical).length, 0);
  const criticalCompleted = WEEKS.reduce((s, w) => s + w.actions.filter(a => a.critical && checkedItems.has(`${w.number}-${a.text}`)).length, 0);

  // Find current week (rough)
  const now = new Date();
  const currentWeek = WEEKS.find(w => {
    const [, endStr] = w.dates.split(' - ');
    return true; // Show all for now
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Target className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-slate-900">QBE Weekly Actions</h1>
          <Badge className="bg-red-100 text-red-800 text-xs">5-Month Sprint</Badge>
        </div>
        <p className="text-slate-500">
          Week-by-week plan to secure $400K+ matched funding and win Stage 2 catalytic grant.
        </p>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-800">{completedActions}/{totalActions}</div>
            <div className="text-xs text-blue-600">Actions completed</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-red-800">{criticalCompleted}/{criticalActions}</div>
            <div className="text-xs text-red-600">Critical actions done</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-800">{Math.round((completedActions / totalActions) * 100)}%</div>
            <div className="text-xs text-emerald-600">Overall progress</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-800">Aug 31</div>
            <div className="text-xs text-amber-600">Match funding deadline</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${(completedActions / totalActions) * 100}%` }}
        />
      </div>

      {/* Weekly Cards */}
      {WEEKS.map(week => {
        const weekComplete = week.actions.every(a => checkedItems.has(`${week.number}-${a.text}`));
        const weekProgress = week.actions.filter(a => checkedItems.has(`${week.number}-${a.text}`)).length;

        return (
          <Card key={week.number} className={`${weekComplete ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {weekComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {week.number}
                      </div>
                    )}
                    Week {week.number}: {week.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {week.dates}
                    <span className="text-slate-400">|</span>
                    {week.focus}
                  </CardDescription>
                </div>
                <Badge className={`text-xs ${weekComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {weekProgress}/{week.actions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {week.events && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {week.events.map((ev, i) => (
                    <Badge key={i} className="text-xs bg-purple-100 text-purple-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      {ev}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {week.actions.map((action, i) => {
                  const key = `${week.number}-${action.text}`;
                  const isChecked = checkedItems.has(key);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleItem(key)}
                      className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                        isChecked ? 'bg-emerald-50' : action.critical ? 'bg-red-50 hover:bg-red-100' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : action.critical ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${isChecked ? 'line-through text-slate-400' : action.critical ? 'text-red-800 font-medium' : 'text-slate-700'}`}>
                          {action.text}
                        </span>
                        {action.contact && !isChecked && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-400">{action.contact}</span>
                          </div>
                        )}
                      </div>
                      {action.critical && !isChecked && (
                        <Badge className="text-xs bg-red-100 text-red-700 shrink-0">Critical</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Key Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="h-5 w-5 text-blue-600" />
            Key Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {KEY_CONTACTS.map((c, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded text-sm">
                <Users className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-400"> ({c.org})</span>
                  <p className="text-xs text-blue-700 font-medium">{c.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-5 w-5 text-amber-600" />
            Your Toolkit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-2">
            {[
              { name: 'QBE Program Hub', href: '/admin/qbe-program', desc: 'Session learnings, 7 Layers, timeline' },
              { name: 'Finance Engine', href: '/admin/finance-model', desc: 'Live P&L, scenarios, debt serviceability' },
              { name: 'LOI Tracker', href: '/admin/loi-tracker', desc: 'Buyer pipeline, multiplier evidence' },
              { name: 'Impact Dashboard', href: '/admin/impact-dashboard', desc: 'Investor-facing impact data' },
              { name: 'Foundation Matcher', href: '/admin/foundation-matcher', desc: 'Scored funder alignment' },
              { name: 'IBA Loan', href: '/admin/iba-loan', desc: 'IBA application prep' },
            ].map((link, i) => (
              <a key={i} href={link.href} className="block p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors">
                <span className="font-semibold text-sm text-slate-900">{link.name}</span>
                <p className="text-xs text-slate-500">{link.desc}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
        Also available as markdown: <code>thoughts/shared/qbe-program/weekly-action-plan.md</code> (paste into Notion).
        Checkboxes are session-only — for persistent tracking, use Notion or the admin task system.
      </div>
    </div>
  );
}
