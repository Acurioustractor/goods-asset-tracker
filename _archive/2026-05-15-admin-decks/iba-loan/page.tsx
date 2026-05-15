import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Banknote,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Users,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Target,
  Factory,
  Recycle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function currency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const loanStructure = {
  program: 'IBA Business Loan',
  maxAmount: 5_000_000,
  grantComponent: 0.30,
  grantAmount: 1_500_000,
  loanAmount: 3_500_000,
  interestRate: 'Variable (below market rate)',
  term: 'Up to 15 years',
  security: 'Business assets / plant & equipment',
  ownershipReq: '51%+ Aboriginal-owned',
};

const startUpFinance = {
  program: 'IBA Start-Up Finance',
  maxAmount: 150_000,
  grantComponent: 0.30,
  grantAmount: 45_000,
  loanAmount: 105_000,
  note: 'For businesses less than 2 years old. Simpler application.',
};

const applicationSteps = [
  {
    title: 'Confirm Eligibility',
    description: 'Verify 51%+ Aboriginal ownership via Oonchiumpa structure. Confirm business viability and purpose.',
    owner: 'Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: true,
    details: [
      'Oonchiumpa = 100% Aboriginal-owned (Kristy Bloomfield) ✓',
      'Business purpose: manufacturing plant for recycled HDPE beds',
      'Revenue history: $239K trade revenue, $513K receivables',
      'Existing funders: Snow, VFFF, FRRR, TFN, AMP Spark',
    ],
  },
  {
    title: 'Prepare Business Plan',
    description: 'Comprehensive plan covering manufacturing, market, financials, and community impact.',
    owner: 'Ben/Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: true,
    details: [
      'Executive summary — recycled HDPE manufacturing for remote communities',
      'Market analysis — $4B NT housing program, IPP procurement pipeline',
      'Production model — containerised facility, 30 beds/week, circuit deployment',
      'Financial projections — COGS $149/bed, sell $560, 73% margin',
      'Community impact — jobs, plastic diversion, health outcomes',
      'Ownership transfer roadmap — PICC wants to buy plant',
    ],
  },
  {
    title: 'Financial Statements',
    description: 'Compile financial records including P&L, balance sheet, and cash flow projections.',
    owner: 'Ben',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Trade revenue: $239K to date',
      'Outstanding receivables: $513K',
      'Key invoices: Snow $132K (authorised), Shed $163.9K + $93.5K (proposals)',
      'Production facility investment: ~$100K (TFN + ACT)',
      '3-year cash flow projection needed',
    ],
  },
  {
    title: 'Detailed Use of Funds',
    description: 'Breakdown of how the $5M will be deployed across production facilities and operations.',
    owner: 'Ben',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Alice Springs production facility: $1.2M (shredder + press + CNC + containers)',
      'Townsville production facility: $1.2M (second plant for QLD/Groote circuit)',
      'Working capital: $800K (raw materials, initial production runs)',
      'Transport & logistics: $500K (delivery trucks, barge costs)',
      'Training & employment: $600K (community operators, Defy training)',
      'Operations & overheads: $700K (4 years)',
    ],
  },
  {
    title: 'Community Impact Assessment',
    description: 'Document the social, environmental, and economic impact of the manufacturing operation.',
    owner: 'Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Jobs created: 8-12 per facility (community operators)',
      'Plastic diverted: 10t+ per year per facility',
      'Health impact: washable beds reduce scabies → RHD pathway',
      '400+ beds already deployed — proven demand',
      'Community ownership transfer model — not licensing',
      'Letters of support from PICC, Oonchiumpa, Anyinginyi, health partners',
    ],
  },
  {
    title: 'Submit Application',
    description: 'Submit to IBA with all supporting documentation.',
    owner: 'Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Submit via IBA online portal or Alice Springs office',
      'Processing time: 6-12 weeks',
      'May require site visit / interview',
      'IBA may connect with Business Support program for mentoring',
    ],
  },
];

const projections = [
  { year: 'Year 1', revenue: 560_000, beds: 1_000, facilities: 1, note: 'Alice Springs plant operational, initial orders' },
  { year: 'Year 2', revenue: 1_400_000, beds: 2_500, facilities: 2, note: 'Townsville plant online, Groote fills capacity' },
  { year: 'Year 3', revenue: 2_200_000, beds: 4_000, facilities: 2, note: 'NT Housing panel, Supply Nation contracts flowing' },
  { year: 'Year 4', revenue: 3_000_000, beds: 5_000, facilities: 3, note: 'Third community-owned facility, self-sustaining' },
];

const strengths = [
  { title: '400+ Beds Deployed', detail: 'Proven product in 7+ communities', icon: Package },
  { title: '100% Aboriginal-Owned Vehicle', detail: 'Oonchiumpa meets 51% threshold', icon: Users },
  { title: '$239K Trade Revenue', detail: 'Revenue-generating, not pre-revenue', icon: DollarSign },
  { title: 'Health Impact Evidence', detail: 'Scabies → RHD prevention pathway', icon: Target },
  { title: 'Community Ownership Model', detail: 'PICC wants to buy the plant itself', icon: Building2 },
  { title: 'Circular Economy', detail: '20kg plastic diverted per bed', icon: Recycle },
];

// Need to import Package for strengths
import { Package } from 'lucide-react';

export default function IBALoanPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-purple-400 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-indigo-300 uppercase">
            <Banknote className="h-4 w-4" />
            Capital Strategy
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            IBA Business Loan
          </h1>
          <p className="mt-2 text-lg text-indigo-200">
            Up to $5M with 30% grant component — fund two production plants and scale nationally.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Available', value: currency(loanStructure.maxAmount), color: 'text-indigo-300' },
            { label: 'Grant (free)', value: currency(loanStructure.grantAmount), color: 'text-emerald-300' },
            { label: 'Loan (repay)', value: currency(loanStructure.loanAmount), color: 'text-amber-300' },
            { label: 'Ownership Req', value: '51%+', color: 'text-white' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-xs font-medium text-indigo-300/80 uppercase">{kpi.label}</div>
              <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Loan Structure */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Loan Structure</h2>
          <p className="mt-1 text-sm text-gray-500">How the $5M breaks down</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-800">Grant Component (30%)</CardTitle>
              <CardDescription>Non-repayable — free capital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-700 mb-4">{currency(loanStructure.grantAmount)}</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" /><span>No repayment required</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" /><span>Covers 30% of total loan</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" /><span>De-risks the investment significantly</span></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Component (70%)</CardTitle>
              <CardDescription>Below-market interest rate, up to 15 years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-4">{currency(loanStructure.loanAmount)}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Interest Rate</span>
                  <span className="font-medium">{loanStructure.interestRate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Term</span>
                  <span className="font-medium">{loanStructure.term}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security</span>
                  <span className="font-medium">{loanStructure.security}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use of Funds Visual */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Use of Funds</h2>
        </div>

        <Card>
          <CardContent>
            {[
              { label: 'Alice Springs Plant', amount: 1_200_000, pct: 24, color: 'bg-indigo-500' },
              { label: 'Townsville Plant', amount: 1_200_000, pct: 24, color: 'bg-purple-500' },
              { label: 'Working Capital', amount: 800_000, pct: 16, color: 'bg-blue-500' },
              { label: 'Operations (4yr)', amount: 700_000, pct: 14, color: 'bg-cyan-500' },
              { label: 'Training & Employment', amount: 600_000, pct: 12, color: 'bg-emerald-500' },
              { label: 'Transport & Logistics', amount: 500_000, pct: 10, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{item.label}</span>
                  <span className="text-gray-500">{currency(item.amount)} ({item.pct}%)</span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Strengths */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Application Strengths</h2>
          <p className="mt-1 text-sm text-gray-500">Why IBA should fund this</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((s) => (
            <Card key={s.title}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.detail}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Revenue Projections */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">4-Year Revenue Projection</h2>
          <p className="mt-1 text-sm text-gray-500">Conservative estimates based on current pipeline</p>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Revenue</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Beds</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">Facilities</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Milestone</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p) => (
                  <tr key={p.year} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-bold text-gray-900">{p.year}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-indigo-700">{currency(p.revenue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.beds.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{p.facilities}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-indigo-50">
                  <td className="px-4 py-3 font-bold">4-Year Total</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-700 text-lg">
                    {currency(projections.reduce((s, p) => s + p.revenue, 0))}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {projections.reduce((s, p) => s + p.beds, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-bold">3</td>
                  <td className="px-4 py-3 text-xs text-gray-500">Community-owned, self-sustaining</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Application Checklist */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Application Checklist</h2>
          <p className="mt-1 text-sm text-gray-500">6 steps to submit the IBA Business Loan application</p>
        </div>

        <div className="space-y-4">
          {applicationSteps.map((step, i) => (
            <Card key={i} className={step.urgent ? 'border-indigo-200' : ''}>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {step.status === 'done' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      {step.urgent && (
                        <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Priority
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {step.owner}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-indigo-500" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The pitch */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-800 p-8 text-center">
          <div className="text-indigo-300 text-sm uppercase tracking-widest mb-3">The pitch to IBA</div>
          <p className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
            $5M builds two community-owned manufacturing plants that turn waste plastic into health infrastructure.
          </p>
          <p className="text-indigo-300/70 text-sm mt-4 max-w-lg mx-auto">
            30% is a grant. The loan is repaid from manufacturing revenue.
            By Year 4, communities own the plants outright.
          </p>
        </div>
      </section>
    </div>
  );
}
