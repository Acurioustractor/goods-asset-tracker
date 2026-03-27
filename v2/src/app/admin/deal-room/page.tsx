import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

const fmtK = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

export default async function DealRoomPage() {
  const supabase = createServiceClient();

  const { data: relatedDeals } = await supabase
    .from('crm_deals')
    .select('title, amount_cents, pipeline_stage, deal_type, notes')
    .or('title.ilike.%groote%,title.ilike.%REAL%,title.ilike.%WHSAC%,title.ilike.%oonchiumpa%,title.ilike.%picc%,title.ilike.%snow%,title.ilike.%sefa%,title.ilike.%defy%')
    .neq('pipeline_stage', 'lost')
    .order('amount_cents', { ascending: false });

  const deals = relatedDeals || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-2">Deal Room</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            The $5M Compound<br />Opportunity
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Two deals that unlock the entire business model. Federal grants build the plants.
            Groote fills them. Communities own them.
          </p>

          {/* Hero numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'REAL Fund', value: '$2.4M', sub: 'Federal grant — 2 plants', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { label: 'Groote', value: '$1.7M', sub: '800 units — single contract', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Bridge', value: '$632K', sub: 'Snow + SEFA', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Combined', value: '$4.7M', sub: 'If both convert', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
            ].map((n, i) => (
              <div key={i} className={`rounded-xl border p-4 ${n.bg}`}>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{n.label}</div>
                <div className={`text-2xl md:text-3xl font-black mt-1 ${n.color}`}>{n.value}</div>
                <div className="text-xs text-slate-500 mt-1">{n.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Flow — visual pipeline */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 via-amber-200 to-orange-200 -translate-y-1/2 hidden md:block" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {[
            { step: '01', title: 'REAL Fund Awarded', detail: '$2.4M builds Alice Springs + Townsville plants', icon: '🏗️', color: 'border-blue-300 bg-blue-50', dot: 'bg-blue-500' },
            { step: '02', title: 'Plants Operational', detail: '800 beds/yr each. Circuit model active.', icon: '⚙️', color: 'border-sky-300 bg-sky-50', dot: 'bg-sky-500' },
            { step: '03', title: 'Groote Converts', detail: '$1.7M fills Townsville. Revenue proven.', icon: '📦', color: 'border-emerald-300 bg-emerald-50', dot: 'bg-emerald-500' },
            { step: '04', title: 'Self-Sustaining', detail: 'Procurement revenue covers operations.', icon: '💰', color: 'border-amber-300 bg-amber-50', dot: 'bg-amber-500' },
            { step: '05', title: 'Community Owned', detail: 'PICC buys plant. Model replicable.', icon: '🏠', color: 'border-orange-300 bg-orange-50', dot: 'bg-orange-500' },
          ].map((s, i) => (
            <div key={i} className={`relative rounded-xl border-2 p-4 ${s.color}`}>
              <div className={`hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${s.dot} ring-4 ring-white`} />
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest">STEP {s.step}</div>
              <div className="font-bold text-sm mt-1">{s.title}</div>
              <div className="text-xs text-gray-500 mt-1">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two deals */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* GROOTE */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight">GROOTE ARCHIPELAGO</h2>
            <Badge className="bg-purple-100 text-purple-800 ml-auto text-xs">EXPLORING</Badge>
          </div>

          {/* Quote */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5">
            <p className="text-base italic text-blue-900 leading-relaxed">
              &ldquo;We are on an island — literally. Therefore anything we purchase is so much more expensive due to freight.&rdquo;
            </p>
            <p className="text-sm text-blue-600 mt-2 font-medium">— Simone Grimmond, WHSAC</p>
          </div>

          {/* Revenue breakdown */}
          <div className="rounded-xl border-2 border-emerald-200 overflow-hidden">
            <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-200">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Revenue Breakdown</div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">500 Stretch Beds @ $560</div>
                  <div className="text-xl font-black text-gray-900">$280K</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">300 Washing Machines @ $4,950</div>
                  <div className="text-xl font-black text-gray-900">$1.5M</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Total Revenue</div>
                  <div className="text-lg font-bold">$1.77M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Est. Cost</div>
                  <div className="text-lg font-bold text-gray-500">$660K</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Margin</div>
                  <div className="text-lg font-bold text-emerald-600">$1.1M</div>
                </div>
              </div>
            </div>
          </div>

          {/* Freight advantage */}
          <div className="rounded-xl border-2 border-blue-200 overflow-hidden">
            <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">Freight Advantage (Barge)</div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">📦</div>
                  <div>
                    <div className="text-sm font-medium">Goods bed (flat-pack, 26kg)</div>
                    <div className="text-xs text-gray-400">60 beds per pallet</div>
                  </div>
                </div>
                <div className="text-lg font-black text-green-700">$163</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-sm">🛏️</div>
                  <div>
                    <div className="text-sm font-medium">Standard mattress (bulky)</div>
                    <div className="text-xs text-gray-400">~12 per pallet</div>
                  </div>
                </div>
                <div className="text-lg font-black text-red-600">$500+</div>
              </div>
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Total freight savings (500 beds)</span>
                  <span className="text-xl font-black text-green-700">$168K</span>
                </div>
                <div className="text-xs text-green-600 mt-1">That alone covers 300 beds at cost price</div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Next Steps — Groote</div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { action: 'Connect with Simone Grimmond at WHSAC', owner: 'Nic', when: 'This week', urgent: true },
                { action: 'Build proposal: 500 beds + 300 washers + freight comparison', owner: 'Nic/Ben', when: 'Next week', urgent: true },
                { action: 'Site visit to Groote — logistics, community needs', owner: 'Nic', when: 'April', urgent: false },
                { action: 'Identify funding pathway — self-fund or grant co-fund?', owner: 'Nic', when: 'April', urgent: false },
                { action: 'Connect to Townsville plant via REAL Fund', owner: 'Nic', when: 'May', urgent: false },
                { action: 'Draft MOU / purchase agreement', owner: 'Nic', when: 'June', urgent: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-start gap-3 ${s.urgent ? '' : 'opacity-70'}`}>
                  <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${s.urgent ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                    <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${s.urgent ? 'font-semibold' : ''}`}>{s.action}</div>
                    <div className="text-xs text-gray-400">{s.owner} &middot; {s.when}</div>
                  </div>
                  {s.urgent && <Badge className="bg-orange-100 text-orange-800 text-[10px] shrink-0">NOW</Badge>}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-red-50 px-5 py-3 border-b border-red-100">
              <div className="text-xs font-bold text-red-600 uppercase tracking-wide">Risks & Mitigations</div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { risk: 'WHSAC may not have $1.7M budget authority', fix: 'Co-fund via NIAA, QLD/NT Government housing programs' },
                { risk: 'Barge logistics for 800 units', fix: '60 beds/pallet flat-pack = only 9 pallets vs 42 for mattresses' },
                { risk: 'Washing machine not at production scale', fix: 'Speed Queen base proven in Tennant Creek. Scale via Townsville plant.' },
                { risk: 'Community consultation required', fix: 'Site visit essential — cultural co-design is non-negotiable' },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr,1fr] gap-3 border-b last:border-0 pb-3 last:pb-0">
                  <div className="text-sm text-red-700 font-medium">{r.risk}</div>
                  <div className="text-sm text-gray-600">{r.fix}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REAL FUND */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight">REAL INNOVATION FUND</h2>
            <Badge className="bg-blue-100 text-blue-800 ml-auto text-xs">EOI SUBMITTED</Badge>
          </div>

          {/* Status card */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Federal Grant — DEWR</div>
                <div className="text-3xl font-black mt-1">$2.4M</div>
                <div className="text-sm text-slate-400">2 × $1.2M over 4 years</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">EOI Submitted</div>
                <div className="text-lg font-bold text-blue-400">Mar 2, 2026</div>
                <div className="text-xs text-slate-500">{Math.floor((Date.now() - new Date('2026-03-02').getTime()) / 86400000)} days ago</div>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '25%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-blue-400 font-medium">EOI Submitted</span>
              <span>Full Application</span>
              <span>Assessment</span>
              <span>Awarded</span>
            </div>
          </div>

          {/* Two sites */}
          {[
            {
              name: 'Alice Springs',
              emoji: '🏜️',
              partner: 'Oonchiumpa Consultancy',
              lead: 'Kristy Bloomfield',
              amount: '$1.2M / 4yr',
              circuit: 'Alice Springs → Tennant Creek → Katherine → Darwin',
              catchment: ['Alice Homelands (60)', 'Tennant Creek (139)', 'Utopia (24)', 'NPY Lands (~200)', 'Maningrida (24)'],
              keyFact: '100% Aboriginal owned — ideal lead applicant for federal funding',
              color: 'border-amber-300 bg-amber-50',
              totalBeds: 447,
            },
            {
              name: 'Townsville / Palm Island',
              emoji: '🌴',
              partner: 'PICC',
              lead: 'Narelle',
              amount: '$1.2M / 4yr',
              circuit: 'Townsville → Palm Island → Groote → East Arnhem',
              catchment: ['Palm Island (141)', 'Groote (~500)', 'Mt Isa (4)', 'East Arnhem (~100)'],
              keyFact: 'PICC said "we\'ll buy the production facility itself"',
              color: 'border-teal-300 bg-teal-50',
              totalBeds: 745,
            },
          ].map((site, i) => (
            <div key={i} className={`rounded-xl border-2 overflow-hidden ${site.color}`}>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{site.emoji}</span>
                    <div>
                      <div className="font-bold">{site.name}</div>
                      <div className="text-xs text-gray-500">{site.partner} ({site.lead})</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-blue-700">{site.amount}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Circuit:</span> {site.circuit}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {site.catchment.map((c, j) => (
                    <span key={j} className="px-2 py-1 bg-white/60 border border-gray-200 rounded-md text-xs text-gray-700">{c}</span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="rounded-lg bg-orange-100 border border-orange-200 px-3 py-1.5 text-xs text-orange-800 font-medium flex-1">
                    {site.keyFact}
                  </div>
                  <div className="text-right pl-4 shrink-0">
                    <div className="text-2xl font-black tabular-nums">{site.totalBeds}</div>
                    <div className="text-[10px] text-gray-400 uppercase">catchment beds</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Next steps */}
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Next Steps — REAL Fund</div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { action: 'Follow up with DEWR on EOI status', owner: 'Nic', when: 'This week', urgent: true },
                { action: 'Prepare full application (if EOI progresses)', owner: 'Nic/Ben', when: 'April', urgent: true },
                { action: 'Letters of support from Oonchiumpa + PICC', owner: 'Nic', when: 'April', urgent: false },
                { action: 'Include Groote demand data ($1.7M) in application', owner: 'Ben', when: 'April', urgent: false },
                { action: 'Confirm production economics with Defy', owner: 'Sam', when: 'April', urgent: false },
                { action: 'Detailed budget: $1.2M × 4yr per site', owner: 'Ben', when: 'May', urgent: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-start gap-3 ${s.urgent ? '' : 'opacity-70'}`}>
                  <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${s.urgent ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                    <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${s.urgent ? 'font-semibold' : ''}`}>{s.action}</div>
                    <div className="text-xs text-gray-400">{s.owner} &middot; {s.when}</div>
                  </div>
                  {s.urgent && <Badge className="bg-blue-100 text-blue-800 text-[10px] shrink-0">NOW</Badge>}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-red-50 px-5 py-3 border-b border-red-100">
              <div className="text-xs font-bold text-red-600 uppercase tracking-wide">Risks & Mitigations</div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { risk: 'Federal process is slow — 6-12 months', fix: 'Snow + SEFA bridge. Existing plant can start production.' },
                { risk: 'Two sites too ambitious for first app', fix: 'Can apply for one site first, second in next round' },
                { risk: 'Oonchiumpa capacity as lead', fix: 'ACT operational support; Oonchiumpa cultural authority' },
                { risk: 'PICC governance / capacity', fix: 'Ebony & Jahvan training pipeline. PICC has org structure.' },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr,1fr] gap-3 border-b last:border-0 pb-3 last:pb-0">
                  <div className="text-sm text-red-700 font-medium">{r.risk}</div>
                  <div className="text-sm text-gray-600">{r.fix}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The Timeline */}
      <div className="rounded-2xl border-2 border-orange-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
          <h3 className="text-lg font-black text-gray-900">4-Year Trajectory</h3>
          <p className="text-sm text-gray-500">From grant-funded to community-owned</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                year: 'Year 1',
                title: 'Build & Prove',
                color: 'border-blue-300 bg-blue-50',
                items: ['REAL Fund awarded', 'Plants constructed & fitted', 'First production runs', 'Groote pilot order (100 beds)'],
                metric: '~400 beds produced',
              },
              {
                year: 'Year 2',
                title: 'Scale & Sell',
                color: 'border-emerald-300 bg-emerald-50',
                items: ['Groote full order (500 beds + 300 washers)', 'Circuit model running in NT', 'PICC plant generating revenue', 'New procurement contracts'],
                metric: '~1,600 beds produced',
              },
              {
                year: 'Year 3',
                title: 'Sustain & Transfer',
                color: 'border-amber-300 bg-amber-50',
                items: ['Revenue covers operating costs', 'Community operators trained', 'PICC buyout negotiations', 'Second community requests plant'],
                metric: '~2,400 beds cumulative',
              },
              {
                year: 'Year 4',
                title: 'Community-Owned',
                color: 'border-orange-300 bg-orange-50',
                items: ['PICC owns Townsville plant', 'Oonchiumpa runs Alice Springs', 'ACT → design + support role', 'Model documented for replication'],
                metric: 'Self-sustaining',
              },
            ].map((y, i) => (
              <div key={i} className={`rounded-xl border-2 p-4 ${y.color}`}>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{y.year}</div>
                <div className="text-base font-bold mt-1">{y.title}</div>
                <ul className="mt-3 space-y-1.5">
                  {y.items.map((item, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-gray-300 mt-0.5">&#9679;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-200/50">
                  <div className="text-xs font-bold text-gray-700">{y.metric}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The punchline */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
        <div className="text-slate-400 text-sm uppercase tracking-widest mb-3">The end state</div>
        <p className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
          When someone asks &ldquo;Who makes these?&rdquo;<br />
          the answer is <span className="text-orange-400">&ldquo;We do.&rdquo;</span>
        </p>
        <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto">
          Two production plants. Community-owned. 1,600 beds per year.
          Recycled plastic diverted. Jobs created. Dignity delivered.
        </p>
      </div>

      {/* Related CRM Deals */}
      <Card>
        <div className="px-6 py-4 border-b">
          <div className="text-sm font-bold text-gray-900">Connected CRM Deals ({deals.length})</div>
          <div className="text-xs text-gray-500">{fmtK(deals.reduce((s, d) => s + (d.amount_cents || 0), 0))} total value</div>
        </div>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-400">
                  <th className="py-3 pr-4 font-medium text-xs">Deal</th>
                  <th className="py-3 pr-4 font-medium text-xs">Type</th>
                  <th className="py-3 pr-4 font-medium text-xs text-right">Amount</th>
                  <th className="py-3 pr-4 font-medium text-xs">Stage</th>
                  <th className="py-3 font-medium text-xs">Notes</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d, i) => {
                  const tc: Record<string, string> = { sale: 'bg-green-100 text-green-800', funding: 'bg-emerald-100 text-emerald-800', partnership: 'bg-blue-100 text-blue-800', procurement: 'bg-purple-100 text-purple-800' };
                  const sc: Record<string, string> = { won: 'bg-green-100 text-green-800', negotiation: 'bg-amber-100 text-amber-800', proposal: 'bg-blue-100 text-blue-800', qualified: 'bg-purple-100 text-purple-800', lead: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{d.title}</td>
                      <td className="py-2.5 pr-4"><Badge className={tc[d.deal_type] || 'bg-gray-100 text-gray-800'}>{d.deal_type}</Badge></td>
                      <td className="py-2.5 pr-4 text-right tabular-nums font-bold whitespace-nowrap">{fmtK(d.amount_cents || 0)}</td>
                      <td className="py-2.5 pr-4"><Badge className={sc[d.pipeline_stage] || 'bg-gray-100 text-gray-800'}>{d.pipeline_stage}</Badge></td>
                      <td className="py-2.5 text-xs text-gray-500 max-w-[250px] truncate">{d.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
