import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { funding, type FundingRecord } from '@/lib/data/compendium';
import {
  ShieldCheck,
  Target,
  Calendar,
  DollarSign,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Recycle,
  MapPin,
  Building2,
  Factory,
  Lock,
  Truck,
  Users,
  TrendingUp,
  Globe,
  Heart,
  Landmark,
  Banknote,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const kpis = [
  {
    label: 'Addressable Market',
    value: '$850K\u2013$4.3M/yr',
    sub: 'once panels established',
    icon: DollarSign,
    color: 'text-emerald-400',
  },
  {
    label: 'Stacking Categories',
    value: '6',
    sub: 'preferential categories',
    icon: Layers,
    color: 'text-orange-400',
  },
  {
    label: 'Critical Deadline',
    value: 'Jul 1, 2026',
    sub: 'IPP 51% ownership threshold',
    icon: Calendar,
    color: 'text-red-400',
  },
  {
    label: 'Current Conversion',
    value: '$239K',
    sub: 'trade revenue to date',
    icon: TrendingUp,
    color: 'text-sky-400',
  },
];

const stackingCategories = [
  {
    category: 'Indigenous Business',
    policy: 'Commonwealth IPP',
    threshold: '3% of all procurement (\u21924% by 2030)',
    status: 'Eligible \u2014 needs Supply Nation cert',
    ready: false,
  },
  {
    category: 'Social Enterprise',
    policy: 'QLD QPP 2026',
    threshold: 'Preference below $500K',
    status: 'Eligible',
    ready: true,
  },
  {
    category: 'Aboriginal Business',
    policy: 'QLD QPP 2026',
    threshold: 'Diversity thresholds',
    status: 'Eligible via Oonchiumpa',
    ready: true,
  },
  {
    category: 'Circular Economy',
    policy: 'National Framework 2024',
    threshold: 'Recycled content targets',
    status: 'Core to model (20kg HDPE/bed)',
    ready: true,
  },
  {
    category: 'Local / Regional',
    policy: 'NT Reform Oct 2025',
    threshold: 'Local supplier preference',
    status: 'Alice Springs base',
    ready: true,
  },
  {
    category: 'SME',
    policy: 'Commonwealth Nov 2025',
    threshold: '$125K threshold (no tender)',
    status: '200 beds = $112K \u2713',
    ready: true,
  },
];

const cookPrinciples = [
  {
    title: 'Supplier Consolidation',
    description:
      '3 key suppliers (DNA Steel, Centre Canvas, Defy). Lock with long-term agreements.',
    icon: Users,
  },
  {
    title: 'Inventory = Evil',
    description:
      'Build to order for institutional buyers. Zero finished-goods warehouse.',
    icon: Factory,
  },
  {
    title: 'Prepay to Lock Capacity',
    description:
      'Pre-purchase canvas/steel in bulk. Lock HDPE recycling with Defy/Envirobank.',
    icon: Lock,
  },
  {
    title: 'Vertical Integration',
    description:
      'Own the plastic press. Waste\u2192product pipeline. Community\u2192community.',
    icon: Recycle,
  },
  {
    title: 'Block Competitors',
    description:
      'Supply Nation certification = only certified bed manufacturer for remote communities.',
    icon: ShieldCheck,
  },
  {
    title: 'Backloading',
    description:
      'Delivery trucks return with waste plastic. Halves logistics cost.',
    icon: Truck,
  },
];

const priorityActions = {
  tier1: {
    label: 'This Month \u2014 April 2026',
    color: 'bg-red-500',
    items: [
      'Supply Nation Certification \u2014 FREE, 3x more contracts',
      'Register on AusTender \u2014 search panels for furniture/remote housing',
      'NIAA Alice Springs meeting \u2014 30min product demo',
    ],
  },
  tier2: {
    label: 'Q2 2026',
    color: 'bg-orange-500',
    items: [
      'NT Housing Infrastructure Panel \u2014 $4B over 10yr, 2,700 homes',
      'QLD social enterprise supplier registration under QPP 2026',
      'IBA Business Loan application \u2014 up to $5M, 30% grant component',
    ],
  },
  tier3: {
    label: '2026',
    color: 'bg-amber-500',
    items: [
      'Standing Offer Arrangement with NT Dept of Housing (3yr)',
      'Backloading logistics loop \u2014 return trucks carry waste plastic',
      'Circular Economy one-pager for every tender',
    ],
  },
};

const revenueEstimates = [
  { pathway: 'Supply Nation / IPP', low: 200_000, high: 1_000_000 },
  { pathway: 'NT Remote Housing', low: 300_000, high: 2_000_000 },
  { pathway: 'QLD Social Procurement', low: 150_000, high: 500_000 },
  { pathway: 'Direct Community', low: 100_000, high: 300_000 },
  { pathway: 'Circular Economy Grants', low: 100_000, high: 500_000 },
];

const currentGaps = [
  {
    title: 'Corporate Sponsors',
    detail: 'Only QIC converted ($12K)',
    icon: Building2,
  },
  {
    title: 'WA/SA Coverage',
    detail: 'Zero active funders despite deployed beds',
    icon: MapPin,
  },
  {
    title: 'Health System Buyers',
    detail: 'Only 4 orgs active, missing NT/QLD Health departments',
    icon: Heart,
  },
  {
    title: 'LinkedIn Leads',
    detail: 'Warm leads (Tara Castle QCF, Nick Miller $330M FUM) not in CRM',
    icon: Globe,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function groupPipelineFunding(records: FundingRecord[]) {
  const pipeline = records.filter((r) => r.status === 'pipeline');
  const groups: Record<string, FundingRecord[]> = {
    'Government Procurement': [],
    Philanthropy: [],
    'Impact Finance': [],
    'Aboriginal Trusts': [],
    Other: [],
  };

  for (const r of pipeline) {
    if (
      r.id.includes('nt-housing') ||
      r.id.includes('qld-qpp') ||
      r.id.includes('supply-nation') ||
      r.id.includes('sedi')
    ) {
      groups['Government Procurement'].push(r);
    } else if (
      r.id.includes('iba')
    ) {
      groups['Impact Finance'].push(r);
    } else if (
      r.id.includes('giant-leap') ||
      r.id.includes('sefa')
    ) {
      groups['Impact Finance'].push(r);
    } else if (
      r.id.includes('acf')
    ) {
      groups['Aboriginal Trusts'].push(r);
    } else {
      groups['Philanthropy'].push(r);
    }
  }

  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

const groupIcons: Record<string, typeof Landmark> = {
  'Government Procurement': Landmark,
  Philanthropy: Heart,
  'Impact Finance': Banknote,
  'Aboriginal Trusts': Users,
  Other: Globe,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProcurementPage() {
  const totalLow = revenueEstimates.reduce((s, r) => s + r.low, 0);
  const totalHigh = revenueEstimates.reduce((s, r) => s + r.high, 0);
  const pipelineGroups = groupPipelineFunding(funding);

  return (
    <div className="space-y-12 pb-16">
      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Hero */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-orange-400 uppercase">
            <ShieldCheck className="h-4 w-4" />
            The Cook Playbook
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Procurement Strategy
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            Own the pipeline. Lock capacity. Block competitors.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                {kpi.label}
              </div>
              <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{kpi.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Stacking Advantage */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            The Stacking Advantage
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Goods qualifies under 6 preferential procurement categories
            simultaneously
          </p>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Policy
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Threshold
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Goods Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stackingCategories.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b last:border-b-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.category}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.policy}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.threshold}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {row.ready ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                        )}
                        <span
                          className={
                            row.ready ? 'text-emerald-700' : 'text-amber-700'
                          }
                        >
                          {row.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: Cook Principles */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Cook Principles Applied
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tim Cook&apos;s supply chain playbook, translated to Goods on
            Country
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cookPrinciples.map((p, i) => (
            <Card key={p.title} className="relative overflow-hidden">
              <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-orange-500 text-xs font-bold text-white">
                {i + 1}
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 4: Priority Actions */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Priority Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Three tiers of execution to capture the procurement pipeline
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(priorityActions).map(([key, tier]) => (
            <Card key={key}>
              <CardHeader>
                <Badge
                  className={`${tier.color} border-0 text-white w-fit`}
                >
                  {key === 'tier1'
                    ? 'Tier 1'
                    : key === 'tier2'
                      ? 'Tier 2'
                      : 'Tier 3'}
                </Badge>
                <CardDescription className="mt-1 font-semibold text-gray-900">
                  {tier.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 5: Opportunity Pipeline */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Opportunity Pipeline
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pipeline-stage opportunities from the master compendium
          </p>
        </div>

        <div className="space-y-6">
          {pipelineGroups.map(([group, items]) => {
            const Icon = groupIcons[group] ?? Globe;
            return (
              <Card key={group}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-base">{group}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">
                      {items.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-left">
                        <th className="px-4 py-2 font-semibold text-gray-700">
                          Source
                        </th>
                        <th className="px-4 py-2 font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-2 font-semibold text-gray-700">
                          Program
                        </th>
                        <th className="px-4 py-2 font-semibold text-gray-700">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b last:border-b-0 hover:bg-slate-50/50"
                        >
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {r.source}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {r.amount ? fmt(r.amount) : '\u2014'}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {r.program ?? '\u2014'}
                          </td>
                          <td className="max-w-xs px-4 py-2 text-gray-500 truncate">
                            {r.notes ?? '\u2014'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 6: Revenue Estimate */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Revenue Estimate</h2>
          <p className="mt-1 text-sm text-gray-500">
            Conservative vs optimistic annual revenue by pathway
          </p>
        </div>

        <Card>
          <CardContent className="space-y-5">
            {revenueEstimates.map((est) => {
              const maxVal = 2_000_000;
              const lowPct = Math.min((est.low / maxVal) * 100, 100);
              const highPct = Math.min((est.high / maxVal) * 100, 100);
              return (
                <div key={est.pathway}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {est.pathway}
                    </span>
                    <span className="text-gray-500">
                      {fmt(est.low)} \u2013 {fmt(est.high)}
                    </span>
                  </div>
                  <div className="relative h-5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-orange-200"
                      style={{ width: `${highPct}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-orange-500"
                      style={{ width: `${lowPct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-600">
                  {fmt(totalLow)} \u2013 {fmt(totalHigh)}
                </span>
              </div>
              <div className="relative mt-2 h-6 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                  style={{
                    width: `${Math.min((totalHigh / 5_000_000) * 100, 100)}%`,
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-600 to-orange-500"
                  style={{
                    width: `${Math.min((totalLow / 5_000_000) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span>$5M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 7: Building Supply Chain — The Bigger Play */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">The Bigger Play: Building Supply Chain</h2>
          <p className="mt-1 text-sm text-gray-500">
            The bed is the wedge. The housing fitout supply chain is the market.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Embed in Housing Spec */}
              <div className="rounded-xl bg-white border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Embed in Housing Spec</div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  NT&apos;s $4B remote housing program = 2,700 new homes. Every home needs beds.
                  Get on the fitout panel and Stretch Beds become the <span className="font-semibold">standard specification</span> for
                  every remote house built for the next decade.
                </p>
                <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                  <div className="text-xs font-bold text-blue-800">Like Apple embedding its chips in every device</div>
                  <div className="text-[10px] text-blue-600">You don&apos;t sell beds — you&apos;re embedded in the construction supply chain</div>
                </div>
              </div>

              {/* HDPE Beyond Beds */}
              <div className="rounded-xl bg-white border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Factory className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">HDPE Beyond Beds</div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The same shredding + moulding plant that makes bed legs can make wall panels,
                  furniture, flooring modules, shelving. Once you own the plastic press,
                  the product catalog expands into the <span className="font-semibold">entire housing fitout</span>.
                </p>
                <div className="mt-3 space-y-1.5">
                  {['Wall panels', 'Shelving units', 'Table/desk tops', 'Outdoor furniture', 'Playground equipment'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero Inventory Circuit */}
              <div className="rounded-xl bg-white border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Zero Inventory Circuit</div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cook closed 10 of 19 warehouses. Goods doesn&apos;t need <em>any</em>. The circuit model
                  means production follows demand. Build to order, deliver on circuit,
                  backload waste plastic on return.
                </p>
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">The Loop</div>
                  <div className="text-xs text-amber-800">
                    Collect plastic → Shred → Mould → Assemble → Deliver → Collect plastic →
                  </div>
                  <div className="text-[10px] text-amber-600 mt-1">Every delivery funds the next production run</div>
                </div>
              </div>
            </div>

            {/* The punchline */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-center">
              <p className="text-sm text-slate-300">
                Cook reduced Apple&apos;s inventory from <span className="font-bold text-white">30 days to 6</span>.
                Goods&apos; target is <span className="font-bold text-orange-400">zero</span> — build to order, deliver on circuit, return with feedstock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 8: Current Gaps */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Current Gaps</h2>
          <p className="mt-1 text-sm text-gray-500">
            Weaknesses to address in the next 90 days
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {currentGaps.map((gap) => (
            <Card
              key={gap.title}
              className="border-red-200 bg-red-50/30"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <gap.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{gap.title}</CardTitle>
                    <CardDescription className="mt-0.5">
                      {gap.detail}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
