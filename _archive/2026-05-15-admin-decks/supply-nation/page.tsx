import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Building2,
  DollarSign,
  FileText,
  Users,
  Globe,
  Target,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const DEADLINE = new Date('2026-07-01');
const TODAY = new Date();
const DAYS_REMAINING = Math.ceil((DEADLINE.getTime() - TODAY.getTime()) / 86400000);

const certificationSteps = [
  {
    title: 'Confirm 51% Aboriginal Ownership',
    description: 'Verify Oonchiumpa Consultancy meets the 51% Aboriginal ownership threshold under the new IPP rules effective July 1, 2026.',
    owner: 'Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: true,
    details: [
      'Oonchiumpa is 100% Aboriginal-owned (Kristy Bloomfield)',
      'Goods/ACT operational support — Oonchiumpa is cultural authority + lead applicant',
      'Verify corporate structure documentation is current',
    ],
  },
  {
    title: 'Register on Supply Nation Portal',
    description: 'Create account on supplynation.org.au and begin the certification application.',
    owner: 'Ben',
    status: 'todo' as 'todo' | 'done',
    urgent: true,
    details: [
      'Registration is FREE',
      'Portal: supplynation.org.au/certification',
      'Need ABN, ownership documents, business plan',
    ],
  },
  {
    title: 'Gather Required Documents',
    description: 'Compile all supporting documentation for the certification application.',
    owner: 'Ben/Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: true,
    details: [
      'Certificate of Incorporation / ABN registration',
      'Proof of Aboriginal ownership (51%+ shareholding)',
      'Director identification / confirmation of Aboriginality',
      'Business plan or capability statement',
      'Financial statements (if available)',
      'Letters of support from Aboriginal community organisations',
    ],
  },
  {
    title: 'Complete Application Form',
    description: 'Fill out the Supply Nation certification application with business details, products, and capabilities.',
    owner: 'Ben',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Business description — recycled HDPE beds + washing machines for remote communities',
      'Product catalog — Stretch Bed, washing machines, HDPE products',
      'Service areas — NT, QLD, national via circuit model',
      'Reference customers — PICC, WHSAC, Anyinginyi, Miwatj Health',
    ],
  },
  {
    title: 'Submit & Follow Up',
    description: 'Submit the application and monitor progress. Certification typically takes 4-6 weeks.',
    owner: 'Nic',
    status: 'todo' as 'todo' | 'done',
    urgent: false,
    details: [
      'Processing time: 4-6 weeks',
      'May require interview or site visit',
      'Must be completed before July 1 IPP threshold change',
    ],
  },
];

const benefits = [
  {
    title: '3x More Government Contracts',
    description: 'Commonwealth IPP mandates 3% of all procurement from Indigenous businesses (rising to 4% by 2030). Supply Nation certification is the key that unlocks this.',
    icon: DollarSign,
    stat: '$850K–$4.3M/yr',
  },
  {
    title: 'Only Certified Bed Manufacturer',
    description: 'No other Supply Nation certified business makes beds for remote communities. First-mover advantage in a market with zero competition.',
    icon: ShieldCheck,
    stat: 'Monopoly position',
  },
  {
    title: 'Panel Eligibility',
    description: 'Required for NT Housing Infrastructure Panel ($4B program), AusTender panels, and most government procurement above $80K.',
    icon: FileText,
    stat: '$4B+ addressable',
  },
  {
    title: 'Corporate Procurement',
    description: 'Major corporates (BHP, Rio Tinto, Fortescue, banks) have Indigenous procurement targets. Supply Nation is their discovery platform.',
    icon: Building2,
    stat: 'BHP alone = $3.5B',
  },
];

const ippTimeline = [
  { date: 'Now', event: 'IPP target = 3% of Commonwealth procurement from Indigenous businesses', status: 'active' as const },
  { date: 'Jul 1, 2026', event: 'New threshold: businesses must be 51% Aboriginal-owned (up from 50%)', status: 'deadline' as const },
  { date: '2027', event: 'IPP target increases — more mandatory contracts', status: 'future' as const },
  { date: '2030', event: 'IPP target rises to 4% — estimated $5B+ total spend', status: 'future' as const },
];

const competitorGap = [
  { category: 'Beds for remote communities', certified: 0, opportunity: 'First mover — no competition' },
  { category: 'Recycled plastic products', certified: 2, opportunity: 'Differentiated by community model' },
  { category: 'Washing machines (remote)', certified: 0, opportunity: 'Only commercial-grade for remote' },
  { category: 'Housing fitout / furniture', certified: 8, opportunity: 'Expand HDPE product line' },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SupplyNationPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-teal-400 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-emerald-300 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Certification Prep
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Supply Nation Certification
          </h1>
          <p className="mt-2 text-lg text-emerald-200">
            Via Oonchiumpa Consultancy — unlock Commonwealth Indigenous Procurement Policy contracts.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 uppercase">
              <Clock className="h-4 w-4" />
              Days Remaining
            </div>
            <div className={`mt-2 text-3xl font-bold ${DAYS_REMAINING < 60 ? 'text-red-400' : 'text-emerald-300'}`}>
              {DAYS_REMAINING}
            </div>
            <div className="mt-1 text-xs text-emerald-400">until IPP threshold change</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 uppercase">
              <Calendar className="h-4 w-4" />
              Deadline
            </div>
            <div className="mt-2 text-2xl font-bold text-white">Jul 1, 2026</div>
            <div className="mt-1 text-xs text-emerald-400">51% ownership requirement</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 uppercase">
              <DollarSign className="h-4 w-4" />
              Cost
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-300">FREE</div>
            <div className="mt-1 text-xs text-emerald-400">certification is no cost</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 uppercase">
              <TrendingUp className="h-4 w-4" />
              Impact
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">3x</div>
            <div className="mt-1 text-xs text-emerald-400">more contract opportunities</div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Why Supply Nation Matters</h2>
          <p className="mt-1 text-sm text-gray-500">
            Certification unlocks the entire government and corporate Indigenous procurement pipeline
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{b.title}</CardTitle>
                    <Badge className="mt-1 bg-emerald-100 text-emerald-800">{b.stat}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{b.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* IPP Timeline */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Indigenous Procurement Policy Timeline</h2>
          <p className="mt-1 text-sm text-gray-500">
            The window is closing — July 1 introduces stricter ownership requirements
          </p>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              {ippTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${
                      item.status === 'active' ? 'bg-emerald-500' :
                      item.status === 'deadline' ? 'bg-red-500 animate-pulse' :
                      'bg-gray-300'
                    }`} />
                    {i < ippTimeline.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        item.status === 'deadline' ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.date}
                      </span>
                      {item.status === 'deadline' && (
                        <Badge className="bg-red-100 text-red-700 text-xs">CRITICAL</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Certification Steps Checklist */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Certification Checklist</h2>
          <p className="mt-1 text-sm text-gray-500">
            5 steps to Supply Nation certification via Oonchiumpa
          </p>
        </div>

        <div className="space-y-4">
          {certificationSteps.map((step, i) => (
            <Card key={i} className={step.urgent ? 'border-amber-200' : ''}>
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
                        <Badge className="bg-amber-100 text-amber-800 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
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
                          <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
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

      {/* Competitor Gap Analysis */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Competitive Landscape</h2>
          <p className="mt-1 text-sm text-gray-500">
            Current Supply Nation certified suppliers in adjacent categories
          </p>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">Certified Suppliers</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {competitorGap.map((row) => (
                  <tr key={row.category} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        row.certified === 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.certified}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.certified === 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 mr-2 text-xs">Blue ocean</Badge>
                      )}
                      {row.opportunity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Oonchiumpa Profile */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Lead Applicant: Oonchiumpa Consultancy</h2>
          <p className="mt-1 text-sm text-gray-500">
            100% Aboriginal-owned — the ideal vehicle for Supply Nation certification
          </p>
        </div>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Why Oonchiumpa</h3>
                <ul className="space-y-2">
                  {[
                    '100% Aboriginal-owned — meets 51% threshold easily',
                    'Kristy Bloomfield — established business leader',
                    'Alice Springs base — NT remote community access',
                    'Existing relationship with Goods/ACT as operational partner',
                    'Cultural authority for community engagement',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Structure</h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-white border border-emerald-200 p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Applicant</div>
                    <div className="font-bold text-gray-900 mt-1">Oonchiumpa Consultancy</div>
                    <div className="text-sm text-gray-600">100% Aboriginal-owned</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                  </div>
                  <div className="rounded-lg bg-white border border-gray-200 p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Operational Partner</div>
                    <div className="font-bold text-gray-900 mt-1">Goods on Country / ACT</div>
                    <div className="text-sm text-gray-600">Manufacturing, logistics, tech</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* What Certification Unlocks */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-800 p-8 text-center">
          <div className="text-emerald-300 text-sm uppercase tracking-widest mb-3">Once certified</div>
          <p className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
            The only Supply Nation certified bed manufacturer for remote communities in Australia.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            {[
              { label: 'Commonwealth IPP', value: '3%+ of all procurement' },
              { label: 'AusTender Panels', value: 'Furniture & housing' },
              { label: 'Corporate Targets', value: 'BHP, Rio, Fortescue' },
              { label: 'NT Housing', value: '$4B program access' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <div className="text-xs text-emerald-300 uppercase tracking-wide">{item.label}</div>
                <div className="text-sm font-bold text-white mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
