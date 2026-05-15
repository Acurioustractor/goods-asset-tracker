import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STRETCH_BED, PRODUCTION_FACILITY } from '@/lib/data/products';
import {
  Target,
  MapPin,
  Users,
  Package,
  TrendingUp,
  Heart,
  Recycle,
  Building2,
  Clock,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const meetingDetails = {
  agency: 'NIAA — National Indigenous Australians Agency',
  office: 'Alice Springs Regional Office',
  purpose: 'Product demo + partnership discussion',
  duration: '30 minutes',
  attendees: 'Nic (presenter), Ben (support)',
};

const talkingPoints = [
  {
    title: 'The Problem We Solve',
    duration: '5 min',
    icon: Heart,
    points: [
      '55% of very remote First Nations homes are overcrowded — people sleeping on floors',
      '$3M/yr of washing machines sold into remote communities — most dumped within months',
      'Mattress freight to remote communities costs $500+ per unit — more than the mattress itself',
      'Scabies → skin sores → Group A Strep → Rheumatic Heart Disease — entirely preventable with clean bedding',
    ],
  },
  {
    title: 'The Stretch Bed Demo',
    duration: '10 min',
    icon: Package,
    points: [
      `Live assembly demo — ${STRETCH_BED.specs.assemblyTime}, ${STRETCH_BED.specs.toolsRequired.toLowerCase()} tools`,
      `${STRETCH_BED.specs.weight}, ${STRETCH_BED.specs.loadCapacity} capacity — invite them to sit on it`,
      'Canvas sleeping surface — fully washable, quick-drying, breaking the scabies cycle',
      `${STRETCH_BED.specs.plasticDiverted} diverted per bed — show the recycled HDPE leg`,
      '60 beds per pallet vs ~12 mattresses — show the freight comparison',
    ],
  },
  {
    title: 'Track Record',
    duration: '5 min',
    icon: TrendingUp,
    points: [
      '400+ beds tracked across 8+ communities',
      '141 beds deployed to Palm Island alone',
      'Partners: Anyinginyi Health, Miwatj Health, Purple House, Red Dust',
      'Backed by Snow Foundation, VFFF, FRRR, TFN, AMP Spark',
      'REAL Innovation Fund EOI submitted — 2 production plants, $2.4M',
    ],
  },
  {
    title: 'The Ask',
    duration: '5 min',
    icon: Target,
    points: [
      'Awareness of Goods within NIAA procurement channels',
      'Introduction to NT Housing Infrastructure Panel team',
      'Support for Supply Nation certification pathway (via Oonchiumpa)',
      'Feedback on how to get beds into remote housing fitout specifications',
      'Connection to other NIAA-funded programs that need health hardware',
    ],
  },
  {
    title: 'The Vision',
    duration: '5 min',
    icon: Building2,
    points: [
      'On-country manufacturing — community-owned production facilities',
      'Circuit model: Alice Springs → Tennant Creek → Katherine → Darwin',
      'Backloading: delivery trucks return with waste plastic for next production run',
      'Goal: "When someone asks who makes these, the answer is: we do"',
      'Community ownership transfer — not licensing, not franchising, actual ownership',
    ],
  },
];

const deploymentData = [
  { community: 'Palm Island', beds: 141, state: 'QLD', partner: 'PICC' },
  { community: 'Tennant Creek', beds: 139, state: 'NT', partner: 'Anyinginyi Health' },
  { community: 'Alice Homelands', beds: 60, state: 'NT', partner: 'Oonchiumpa' },
  { community: 'Utopia', beds: 24, state: 'NT', partner: 'Urapuntja Health' },
  { community: 'Maningrida', beds: 24, state: 'NT', partner: 'Miwatj Health' },
  { community: 'Wadeye', beds: 8, state: 'NT', partner: 'Red Dust' },
  { community: 'Mt Isa', beds: 4, state: 'QLD', partner: 'Direct' },
];

const totalBeds = deploymentData.reduce((s, d) => s + d.beds, 0);

const objectionHandling = [
  {
    objection: 'What about mattresses / toppers?',
    response: 'Canvas surface is the bed. No mattress needed. Fully washable. Some communities add a thin topper, but the bed works without one. The washability IS the health intervention.',
  },
  {
    objection: 'How do you scale?',
    response: 'Containerised mobile production — two containers, $100K investment. One shreds plastic, one presses panels. ~30 beds/week. Can deploy to any community with power.',
  },
  {
    objection: 'What about community consultation?',
    response: 'Non-negotiable. 500+ minutes of co-design sessions with Elders. Every deployment is community-led. We never deliver without consultation.',
  },
  {
    objection: 'How does ownership transfer work?',
    response: 'PICC (Palm Island) said "we\'ll buy the production facility itself." We train community operators, they run it. ACT becomes design + support only.',
  },
  {
    objection: 'What about warranty / breakage?',
    response: `${STRETCH_BED.specs.warranty} warranty, ${STRETCH_BED.specs.designLifespan} design lifespan. HDPE is virtually indestructible. Near-zero breakage rate across 400+ deployments.`,
  },
];

const leaveBehinds = [
  'Physical Stretch Bed sample (assembled in meeting)',
  'One-page capability statement',
  'Groote proposal as reference (PDF)',
  'Freight comparison infographic',
  'Community deployment map',
];

export default function NIAAPrepPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-orange-400 uppercase">
            <Target className="h-4 w-4" />
            Meeting Prep
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            NIAA Alice Springs
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            Product demo + partnership discussion. 30 minutes to show them the bed changes everything.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase">Agency</div>
            <div className="mt-2 text-sm font-bold text-white">{meetingDetails.agency}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase">Office</div>
            <div className="mt-2 text-sm font-bold text-white">{meetingDetails.office}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase">Duration</div>
            <div className="mt-2 text-2xl font-bold text-orange-400">{meetingDetails.duration}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="text-xs font-medium text-slate-400 uppercase">Beds Deployed</div>
            <div className="mt-2 text-2xl font-bold text-orange-400">{totalBeds}+</div>
          </div>
        </div>
      </section>

      {/* Agenda / Talking Points */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Talking Points</h2>
          <p className="mt-1 text-sm text-gray-500">30-minute structure — demo is the centrepiece</p>
        </div>

        <div className="space-y-4">
          {talkingPoints.map((section, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription>~{section.duration}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {section.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Deployment Map */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Deployment Evidence</h2>
          <p className="mt-1 text-sm text-gray-500">{totalBeds}+ beds across {deploymentData.length} communities</p>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Community</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Beds</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Partner</th>
                </tr>
              </thead>
              <tbody>
                {deploymentData.map((d) => (
                  <tr key={d.community} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.community}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">{d.beds}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{d.state}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.partner}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-orange-50">
                  <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-700 text-lg">{totalBeds}</td>
                  <td colSpan={2} className="px-4 py-3 text-sm text-gray-500">across {deploymentData.length} communities</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Objection Handling */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Objection Handling</h2>
          <p className="mt-1 text-sm text-gray-500">Anticipated questions and prepared responses</p>
        </div>

        <div className="space-y-4">
          {objectionHandling.map((item, i) => (
            <Card key={i}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-red-700 text-sm">&ldquo;{item.objection}&rdquo;</div>
                    <div className="text-sm text-gray-700 mt-2">{item.response}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Leave-behinds */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Leave-Behinds</h2>
          <p className="mt-1 text-sm text-gray-500">Physical materials to leave with NIAA</p>
        </div>

        <Card>
          <CardContent>
            <ul className="space-y-3">
              {leaveBehinds.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Key number */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
          <div className="text-slate-400 text-sm uppercase tracking-widest mb-3">The number that matters</div>
          <p className="text-5xl md:text-6xl font-black text-orange-400">
            200 beds × $560
          </p>
          <p className="text-2xl font-bold text-white mt-2">= $112,000</p>
          <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto">
            Under the $125K Commonwealth threshold. Any agency can purchase directly.
            No tender. No panel. Just a purchase order.
          </p>
        </div>
      </section>
    </div>
  );
}
