import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  FileText,
  Building2,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Globe,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const registrationSteps = [
  {
    title: 'Create AusTender Account',
    description: 'Register at austender.gov.au as a supplier. Free account creation.',
    owner: 'Ben',
    done: false,
    details: [
      'Go to austender.gov.au → Register as Supplier',
      'Use Goods on Country / ACT ABN',
      'Primary contact: Nicholas Marchesi',
      'Business type: Social Enterprise / Indigenous Business',
    ],
  },
  {
    title: 'Complete Supplier Profile',
    description: 'Fill in business capabilities, product categories, and service areas.',
    owner: 'Ben',
    done: false,
    details: [
      'UNSPSC codes (see panel codes below)',
      'Service areas: NT, QLD, national',
      'Certifications: Supply Nation (pending), Social Enterprise',
      'Upload capability statement',
    ],
  },
  {
    title: 'Set Up Saved Searches',
    description: 'Configure alerts for relevant panels and approach-to-market notices.',
    owner: 'Ben',
    done: false,
    details: [
      'Search for active panels matching our categories',
      'Set email alerts for new ATM notices',
      'Monitor standing offers in furniture + housing + community equipment',
    ],
  },
  {
    title: 'Apply to Relevant Panels',
    description: 'Submit applications to standing offer panels that match our products.',
    owner: 'Nic/Ben',
    done: false,
    details: [
      'NT Department of Housing — Remote Housing Panel',
      'Commonwealth furniture/equipment panels',
      'Indigenous-specific procurement panels',
    ],
  },
];

const panelCodes = [
  {
    category: 'Furniture & Furnishings',
    unspsc: '56000000',
    description: 'Beds, tables, shelving, seating — core product line',
    relevance: 'high' as const,
    notes: 'Stretch Bed + future HDPE furniture catalog',
  },
  {
    category: 'Building Materials',
    unspsc: '30100000',
    description: 'Construction materials incl. panels and prefab components',
    relevance: 'high' as const,
    notes: 'HDPE wall panels, shelving for housing fitout',
  },
  {
    category: 'Community & Social Services',
    unspsc: '93140000',
    description: 'Community development, Indigenous services',
    relevance: 'high' as const,
    notes: 'Community health hardware, manufacturing training',
  },
  {
    category: 'Laundry Equipment',
    unspsc: '47130000',
    description: 'Commercial washing machines and laundry',
    relevance: 'medium' as const,
    notes: 'Pakkimjalki Kari washing machines (when at scale)',
  },
  {
    category: 'Recycling Services',
    unspsc: '76120000',
    description: 'Waste management and recycling',
    relevance: 'medium' as const,
    notes: 'On-country plastic recycling as a service',
  },
  {
    category: 'Playground Equipment',
    unspsc: '49200000',
    description: 'Recreational and playground structures',
    relevance: 'future' as const,
    notes: 'HDPE playground equipment (catalog expansion)',
  },
];

const searchTerms = [
  { term: 'remote housing furniture', priority: 'high' as const },
  { term: 'Indigenous community equipment', priority: 'high' as const },
  { term: 'beds hospital community', priority: 'high' as const },
  { term: 'remote community infrastructure', priority: 'high' as const },
  { term: 'social enterprise procurement', priority: 'medium' as const },
  { term: 'recycled plastic products', priority: 'medium' as const },
  { term: 'Northern Territory housing panel', priority: 'high' as const },
  { term: 'washing machines commercial remote', priority: 'medium' as const },
  { term: 'furniture standing offer arrangement', priority: 'high' as const },
  { term: 'circular economy', priority: 'medium' as const },
];

const keyPanels = [
  {
    name: 'NT Remote Housing Infrastructure',
    value: '$4B over 10 years',
    agency: 'NT Department of Housing',
    status: 'Active — 2,700 homes',
    fit: 'Every home needs beds. Fitout panel = recurring revenue.',
  },
  {
    name: 'Commonwealth Furniture Panel',
    value: 'Multi-supplier SOA',
    agency: 'Department of Finance',
    status: 'Standing Offer',
    fit: 'Government offices, defence, community centres — bulk bed orders.',
  },
  {
    name: 'Indigenous-specific Procurement',
    value: '3% of all Commonwealth spend',
    agency: 'NIAA / Various',
    status: 'IPP mandated',
    fit: 'Supply Nation cert = automatic qualification. No competition for beds.',
  },
  {
    name: 'QLD Social Procurement',
    value: 'QPP 2026 — preference below $500K',
    agency: 'QLD Government',
    status: 'New policy 2026',
    fit: 'Social enterprise status + Aboriginal business = double stacking.',
  },
];

export default function AusTenderPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-blue-300 uppercase">
            <Search className="h-4 w-4" />
            Government Procurement
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AusTender Registration
          </h1>
          <p className="mt-2 text-lg text-blue-200">
            Search panels for furniture, remote housing, and community equipment.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Portal', value: 'austender.gov.au', icon: Globe, color: 'text-blue-300' },
            { label: 'Cost', value: 'FREE', icon: ShieldCheck, color: 'text-emerald-300' },
            { label: 'Panel Codes', value: String(panelCodes.length), icon: FileText, color: 'text-amber-300' },
            { label: 'Key Panels', value: String(keyPanels.length), icon: Building2, color: 'text-purple-300' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-300/80 uppercase">
                <kpi.icon className="h-4 w-4" />
                {kpi.label}
              </div>
              <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Steps */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Registration Steps</h2>
          <p className="mt-1 text-sm text-gray-500">Get on AusTender and start finding relevant panels</p>
        </div>

        <div className="space-y-4">
          {registrationSteps.map((step, i) => (
            <Card key={i} className={!step.done ? 'border-blue-200' : ''}>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {step.done ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {step.owner}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-500" />
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

      {/* UNSPSC Panel Codes */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">UNSPSC Panel Codes</h2>
          <p className="mt-1 text-sm text-gray-500">Categories to register under on AusTender</p>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">UNSPSC</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Relevance</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Goods Fit</th>
                </tr>
              </thead>
              <tbody>
                {panelCodes.map((code) => (
                  <tr key={code.unspsc} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{code.category}</div>
                      <div className="text-xs text-gray-500">{code.description}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{code.unspsc}</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        code.relevance === 'high' ? 'bg-emerald-100 text-emerald-800' :
                        code.relevance === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-600'
                      }>
                        {code.relevance}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px]">{code.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Key Panels to Target */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Priority Panels</h2>
          <p className="mt-1 text-sm text-gray-500">Government panels with the highest fit for Goods products</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {keyPanels.map((panel) => (
            <Card key={panel.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{panel.name}</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 shrink-0">{panel.value}</Badge>
                </div>
                <CardDescription>{panel.agency} — {panel.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{panel.fit}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Search Terms */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Search Terms for Monitoring</h2>
          <p className="mt-1 text-sm text-gray-500">Set up saved searches and email alerts for these terms</p>
        </div>

        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchTerms.map((s) => (
                <Badge
                  key={s.term}
                  variant="outline"
                  className={
                    s.priority === 'high'
                      ? 'border-blue-300 bg-blue-50 text-blue-800 text-sm px-3 py-1.5'
                      : 'border-gray-200 text-gray-600 text-sm px-3 py-1.5'
                  }
                >
                  <Search className="h-3 w-3 mr-1.5" />
                  {s.term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Threshold reminder */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-800 p-8 text-center">
          <div className="text-blue-300 text-sm uppercase tracking-widest mb-3">Key threshold</div>
          <p className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
            200 beds × $560 = $112,000
          </p>
          <p className="text-blue-300 text-base mt-2">
            Under the $125K Commonwealth threshold — no tender required.
          </p>
          <p className="text-blue-400/70 text-sm mt-4 max-w-lg mx-auto">
            Any government agency can purchase directly without going to tender.
            Supply Nation certification makes Goods the obvious choice.
          </p>
        </div>
      </section>
    </div>
  );
}
