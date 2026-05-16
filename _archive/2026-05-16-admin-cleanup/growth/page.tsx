import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deployments, communityPartners, documentedDemand, funding, getDemandTotal, getDeploymentTotals, getFundingSummary, financialSnapshot } from '@/lib/data/compendium';

export const dynamic = 'force-dynamic';

// Freight economics by remoteness
const FREIGHT = [
  { mode: 'Road', costKg: 2.0, bedFreight: 52, note: 'Standard NT/QLD accessible' },
  { mode: 'Barge', costKg: 6.3, bedFreight: 163, note: 'Islands (Palm Island, Groote)' },
  { mode: 'Charter', costKg: 17.5, bedFreight: 455, note: 'Most remote homelands' },
];

// Regional data
const REGIONS = [
  {
    id: 'central-nt',
    name: 'Central Australia (NT)',
    plant: { name: 'Alice Springs Plant', status: 'Planning', partner: 'Oonchiumpa Consultancy', funding: 'REAL Innovation Fund $1.2M + Snow Foundation' },
    communities: [
      { name: 'Alice Homelands', beds: 60, partner: 'Oonchiumpa', status: 'active' as const },
      { name: 'Tennant Creek', beds: 139, partner: 'Wilya Janta', status: 'active' as const, demand: '3 beds (Norman — maroon), 5 washers deployed' },
      { name: 'Utopia Homelands', beds: 24, partner: 'Centrecorp', status: 'active' as const, demand: 'Beds for every child' },
      { name: 'Maningrida', beds: 24, partner: 'Homeland Schools Co.', status: 'active' as const, demand: '65 beds requested (no invoice)' },
    ],
    expansion: [
      { name: 'NPY Lands (SA/NT/WA)', units: 200, path: 'NPY Women\'s Council — "always looking for beds"', priority: 'high' as const },
      { name: 'Katherine', units: 100, path: 'NT Government / health — circuit model stop', priority: 'medium' as const },
      { name: 'Darwin / Top End', units: 150, path: 'NT Housing / health orgs — circuit endpoint', priority: 'medium' as const },
      { name: 'Wadeye', units: 200, path: 'Thamarrurr / NT Government — largest remote community', priority: 'high' as const },
    ],
    procurement: [
      { name: 'Centrecorp Foundation', type: 'Aboriginal Trust', amount: '$85.7K PAID + $93.5K plant quote', status: 'Champion' as const },
      { name: 'Anyinginyi Health', type: 'Health', amount: 'Quote for 4 washers', status: 'Active' as const },
      { name: 'NT Government', type: 'Government', amount: 'TBC', status: 'Warm' as const },
      { name: 'Rotary Eclub (Anyinginyi)', type: 'Service Club', amount: '$82.5K OVERDUE', status: 'Overdue' as const },
      { name: 'Purple House', type: 'Health', amount: 'TBC', status: 'Exploring' as const },
      { name: 'Julalikari Council', type: 'Community', amount: '$19.8K PAID (4 washers)', status: 'Won' as const },
    ],
    funders: [
      { name: 'Snow Foundation', amount: '$132K authorised + $78K received', status: 'Champion' as const },
      { name: 'REAL Innovation Fund', amount: '$1.2M (4yr)', status: 'EOI submitted' as const },
      { name: 'SEFA', amount: '$500K repayable', status: 'Negotiation' as const },
      { name: 'QBE Foundation', amount: '$10K received, ~$140K pending', status: 'Active' as const },
      { name: 'FRRR', amount: '$50K received', status: 'Received' as const },
    ],
  },
  {
    id: 'north-qld',
    name: 'North Queensland',
    plant: { name: 'Townsville / Palm Island Plant', status: 'Exploring', partner: 'PICC', funding: 'REAL Innovation Fund $1.2M + Tim Fairfax' },
    communities: [
      { name: 'Palm Island', beds: 141, partner: 'PICC / Plate It Forward', status: 'active' as const, demand: '40 beds ordered ($36.3K authorised)' },
      { name: 'Mt Isa', beds: 4, partner: undefined, status: 'testing' as const },
    ],
    expansion: [
      { name: 'Groote Archipelago', units: 500, path: 'WHSAC — 500 mattresses + 300 washers. $1.7M potential.', priority: 'high' as const },
      { name: 'East Arnhem / Miwatj', units: 100, path: 'Miwatj Health — RHD prevention, 8 clinics', priority: 'high' as const },
      { name: 'Yarrabah', units: 200, path: 'Largest discrete Aboriginal community in Australia', priority: 'medium' as const },
      { name: 'Doomadgee / Mornington Island', units: 100, path: 'Gulf communities — barge access only', priority: 'medium' as const },
      { name: 'Cherbourg / Woorabinda', units: 100, path: 'QLD inland communities', priority: 'low' as const },
    ],
    procurement: [
      { name: 'PICC', type: 'Community Company', amount: '$36.3K authorised + wants to buy plant', status: 'Champion' as const },
      { name: 'WHSAC (Groote)', type: 'Community Corp', amount: '$1.7M est.', status: 'Exploring' as const },
      { name: 'Miwatj Health', type: 'Health', amount: 'TBC — 8 clinics', status: 'Exploring' as const },
      { name: 'QIC Brisbane', type: 'Corporate', amount: '$12K PAID (20 beds RAP)', status: 'Won' as const },
      { name: 'Red Dust', type: 'Health', amount: '$15.9K PAID (30 beds)', status: 'Won' as const },
      { name: 'Our Community Shed', type: 'Manufacturing', amount: '$20.3K PAID + $257K plant quotes', status: 'Active' as const },
    ],
    funders: [
      { name: 'REAL Innovation Fund', amount: '$1.2M (4yr)', status: 'EOI submitted' as const },
      { name: 'Tim Fairfax Foundation', amount: 'TBC', status: 'Qualified' as const },
      { name: 'Minderoo Foundation', amount: 'TBC', status: 'Qualified' as const },
      { name: 'The Funding Network', amount: '$130K received', status: 'Received' as const },
      { name: 'Vincent Fairfax Family Foundation', amount: '$50K received', status: 'Received' as const },
    ],
  },
];

const statusColors: Record<string, string> = {
  Champion: 'bg-green-100 text-green-800',
  Active: 'bg-blue-100 text-blue-800',
  Won: 'bg-green-100 text-green-800',
  Received: 'bg-green-100 text-green-800',
  Warm: 'bg-amber-100 text-amber-800',
  Exploring: 'bg-purple-100 text-purple-800',
  Overdue: 'bg-red-100 text-red-800',
  'EOI submitted': 'bg-blue-100 text-blue-800',
  Qualified: 'bg-purple-100 text-purple-800',
  Negotiation: 'bg-amber-100 text-amber-800',
  Planning: 'bg-amber-100 text-amber-800',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-gray-100 text-gray-600',
};

export default async function GrowthPage() {
  const supabase = createServiceClient();
  const fundingSummary = getFundingSummary();
  const demandTotal = getDemandTotal();
  const depTotals = getDeploymentTotals();

  // Live deal data
  const { data: allDeals } = await supabase
    .from('crm_deals')
    .select('title, amount_cents, pipeline_stage, deal_type, units')
    .neq('pipeline_stage', 'lost');

  const deals = allDeals || [];
  const salesWon = deals.filter(d => d.deal_type === 'sale' && d.pipeline_stage === 'won');
  const salesActive = deals.filter(d => d.deal_type === 'sale' && d.pipeline_stage !== 'won');
  const fundingPending = deals.filter(d => d.deal_type === 'funding' && d.pipeline_stage !== 'won');

  const totalExpansionUnits = REGIONS.flatMap(r => r.expansion).reduce((s, t) => s + t.units, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Growth & Procurement</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communities &rarr; procurement &rarr; funding &rarr; production plants
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Deployed</div>
            <div className="text-xl font-bold mt-1">{depTotals.beds} beds</div>
            <div className="text-xs text-gray-500">{depTotals.communities} communities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Demand Pipeline</div>
            <div className="text-xl font-bold text-blue-600 mt-1">${(demandTotal / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">documented requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Expansion Est.</div>
            <div className="text-xl font-bold text-purple-600 mt-1">~{totalExpansionUnits}</div>
            <div className="text-xs text-gray-500">target units</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Grants Pending</div>
            <div className="text-xl font-bold text-amber-600 mt-1">${(fundingSummary.pending / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">{fundingPending.length} applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Receivables</div>
            <div className="text-xl font-bold text-orange-600 mt-1">${(financialSnapshot.outstandingReceivables / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">awaiting payment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Procurement</div>
            <div className="text-xl font-bold mt-1">{REGIONS.flatMap(r => r.procurement).length}</div>
            <div className="text-xs text-gray-500">active channels</div>
          </CardContent>
        </Card>
      </div>

      {/* Documented Demand */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Documented Demand Pipeline</CardTitle>
          <p className="text-xs text-gray-500">Direct requests from communities — use in every grant application</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Requester</th>
                  <th className="pb-2 pr-4 font-medium">Request</th>
                  <th className="pb-2 pr-4 font-medium text-right">Est. Value</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {documentedDemand.sort((a, b) => b.estimatedValue - a.estimatedValue).map((d, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium whitespace-nowrap">{d.requester}</td>
                    <td className="py-2 pr-4 text-gray-600">{d.request}</td>
                    <td className="py-2 pr-4 text-right tabular-nums font-medium whitespace-nowrap">
                      {d.estimatedValue > 0 ? `$${(d.estimatedValue / 1000).toFixed(0)}K` : 'TBC'}
                    </td>
                    <td className="py-2">
                      <Badge className={
                        d.status === 'approved' ? 'bg-green-100 text-green-800' :
                        d.status === 'requested' ? 'bg-blue-100 text-blue-800' :
                        d.status === 'exploring' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-600'
                      }>{d.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="py-2 pr-4 font-bold" colSpan={2}>Total Pipeline</td>
                  <td className="py-2 pr-4 text-right tabular-nums font-bold">${(demandTotal / 1000).toFixed(0)}K</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Regions */}
      {REGIONS.map(region => (
        <div key={region.id} className="space-y-4">
          {/* Region Header */}
          <div className="flex items-center gap-3 pt-2">
            <h2 className="text-xl font-bold text-gray-900">{region.name}</h2>
            <Badge className={statusColors[region.plant.status] || 'bg-gray-100'}>{region.plant.status}</Badge>
          </div>

          {/* Plant bar */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="py-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                <div><span className="text-gray-400">Plant:</span> <span className="font-semibold">{region.plant.name}</span></div>
                <div><span className="text-gray-400">Partner:</span> <span className="font-medium">{region.plant.partner}</span></div>
                <div><span className="text-gray-400">Funding:</span> <span className="font-medium text-blue-700">{region.plant.funding}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Communities */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Active Communities</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {region.communities.map((c, i) => (
                    <div key={i} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                      <div className="min-w-0">
                        <div className="font-medium text-sm">{c.name}</div>
                        {c.partner && <div className="text-xs text-gray-500">{c.partner}</div>}
                        {c.demand && <div className="text-xs text-orange-600 mt-0.5">{c.demand}</div>}
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <span className="font-bold text-sm tabular-nums">{c.beds}</span>
                        <span className="text-xs text-gray-400 ml-1">beds</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-400 pt-1">
                    Total: {region.communities.reduce((s, c) => s + c.beds, 0)} beds deployed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expansion Targets */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Expansion Targets</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {region.expansion.map((t, i) => (
                    <div key={i} className="border-b last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{t.name}</span>
                          <Badge className={priorityColors[t.priority]}>{t.priority}</Badge>
                        </div>
                        <span className="font-bold text-sm tabular-nums text-blue-600 shrink-0">~{t.units}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.path}</div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-400 pt-1">
                    Total potential: ~{region.expansion.reduce((s, t) => s + t.units, 0)} units
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Procurement Channels */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Procurement Channels</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {region.procurement.map((p, i) => (
                    <div key={i} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.name}</span>
                          <Badge className={statusColors[p.status] || 'bg-gray-100 text-gray-800'}>{p.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{p.type}</div>
                      </div>
                      <span className="text-xs font-medium tabular-nums text-gray-700 shrink-0 pl-3 whitespace-nowrap">{p.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funding Sources */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Funding Sources</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {region.funders.map((f, i) => (
                    <div key={i} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{f.name}</span>
                          <Badge className={statusColors[f.status] || 'bg-gray-100 text-gray-800'}>{f.status}</Badge>
                        </div>
                      </div>
                      <span className="text-xs font-medium tabular-nums text-gray-700 shrink-0 pl-3 whitespace-nowrap">{f.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

      {/* Plant Economics + Freight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Plant Economics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Plant Investment', value: '$100K', note: '2 containers' },
                { label: 'Capacity', value: '~200 beds', note: 'per run (~2mo)' },
                { label: 'Circuit Model', value: '4 stops/yr', note: '~800 beds/year' },
                { label: 'Breakeven', value: '~180 beds', note: 'at $560/bed' },
                { label: 'Material Cost', value: '~$120/bed', note: 'steel + canvas + HDPE' },
                { label: 'Margin', value: '~$440/bed', note: 'at institutional rate' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-lg font-bold mt-0.5">{item.value}</div>
                  <div className="text-xs text-gray-400">{item.note}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Freight Economics (per bed, 26kg)</CardTitle>
            <p className="text-xs text-gray-500">Flat-pack advantage: 60 beds per pallet vs ~12 for mattresses</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {FREIGHT.map((f, i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{f.mode}</div>
                    <div className="text-xs text-gray-500">{f.note}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold tabular-nums">${f.bedFreight}</div>
                    <div className="text-xs text-gray-400">${f.costKg}/kg</div>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-green-50 rounded-lg mt-2">
                <div className="text-xs font-medium text-green-800">Flat-pack advantage</div>
                <div className="text-sm text-green-700 mt-1">
                  5x more beds per pallet than mattresses = freight savings of $10K+ per truckload to remote communities
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The Strategy */}
      <Card className="bg-orange-50/50 border-orange-200">
        <CardHeader>
          <CardTitle>The Growth Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Philanthropy Funds the Plants</h4>
              <p className="text-gray-600">
                Grants fund plant setup, training, and first production runs. Proves the model.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li>&bull; Snow Foundation — multi-year anchor</li>
                <li>&bull; REAL Fund — $2.4M for both plants</li>
                <li>&bull; SEFA — $500K repayable loan</li>
                <li>&bull; QBE, FRRR, AMP — programme grants</li>
              </ul>
              <div className="mt-2 text-xs font-medium text-green-700">
                ${(fundingSummary.received / 1000).toFixed(0)}K received &middot; ${(fundingSummary.pending / 1000).toFixed(0)}K pending
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Procurement Sustains Operations</h4>
              <p className="text-gray-600">
                Aboriginal trusts, health services, and government buy at institutional rates. Repeat orders keep the plant running.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li>&bull; Centrecorp, PICC — repeat buyers</li>
                <li>&bull; WHSAC Groote — $1.7M single opportunity</li>
                <li>&bull; Miwatj Health — 8-clinic fleet</li>
                <li>&bull; NT/QLD Government — housing programs</li>
              </ul>
              <div className="mt-2 text-xs font-medium text-blue-700">
                {salesWon.length} sales won &middot; {salesActive.length} in pipeline
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Communities Own Production</h4>
              <p className="text-gray-600">
                The end goal: communities run their own plants. PICC wants to buy the facility. Oonchiumpa leads Alice Springs.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li>&bull; Ebony & Jahvan Oui — operator trainees</li>
                <li>&bull; Oonchiumpa — Alice Springs lead partner</li>
                <li>&bull; PICC — "we&apos;ll buy the plant"</li>
                <li>&bull; Defy Design — training & manufacturing</li>
              </ul>
              <div className="mt-2 text-xs font-medium text-purple-700">
                2 lead partners &middot; 2 operator trainees
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grant Matching Keywords */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Grant Matching Keywords</CardTitle>
          <p className="text-xs text-gray-500">Use these terms in applications — they match Goods to the most grant programs</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Indigenous', 'Remote communities', 'First Nations', 'Social enterprise',
              'Circular economy', 'Community-led manufacturing', 'Housing', 'Health outcomes',
              'RHD prevention', 'Recycled materials', 'HDPE plastic', 'On-country production',
              'Community ownership', 'Youth employment', 'Cultural co-design', 'Flat-pack furniture',
              'Essential goods', 'Overcrowding', 'Scabies reduction', 'Washing machines',
            ].map((kw, i) => (
              <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {kw}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
