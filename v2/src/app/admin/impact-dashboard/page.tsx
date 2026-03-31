'use client';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  MapPin,
  Users,
  ShieldCheck,
  Recycle,
  TrendingUp,
  Heart,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Factory,
  Quote,
  Leaf,
  BarChart3,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static data — all inline, no DB calls                             */
/* ------------------------------------------------------------------ */

const heroStats = [
  { label: 'Products Deployed', value: '389', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Communities Served', value: '8', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Active Storytellers', value: '33', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Survival Rate (12mo)', value: '>95%', icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { label: 'Plastic Diverted', value: '9,225kg', icon: Recycle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Idiot Index', value: '17.6x', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
];

const deployments = [
  { community: 'Palm Island', country: 'Bwgcolman', beds: 131, washers: 10, total: 141, status: 'Active' },
  { community: 'Tennant Creek', country: 'Wumpurrarni', beds: 129, washers: 4, total: 139, status: 'Active', note: 'includes 6 weave beds' },
  { community: 'Utopia Homelands', country: 'Alyawarre', beds: 60, washers: 0, total: 60, status: 'Active' },
  { community: 'Maningrida', country: 'Kuninjku', beds: 18, washers: 6, total: 24, status: 'Active' },
  { community: 'Kalgoorlie', country: 'Wangkatja', beds: 20, washers: 0, total: 20, status: 'Active' },
  { community: 'Mt Isa', country: 'Kalkadoon', beds: 2, washers: 0, total: 2, status: 'Testing' },
  { community: 'Darwin', country: 'Larrakia', beds: 1, washers: 0, total: 1, status: 'Testing' },
  { community: 'Alice Springs', country: 'Arrernte', beds: 1, washers: 0, total: 1, status: 'Active' },
];

const cascadeSteps = [
  { stage: 'No washing machine', detail: '59% of remote homes lack washing machines (FRRR 2022)', icon: AlertTriangle, color: 'text-red-400' },
  { stage: 'Dirty bedding', detail: 'Mattresses on the floor, no way to wash sheets', icon: AlertTriangle, color: 'text-red-400' },
  { stage: 'Scabies', detail: '1 in 3 children in remote communities affected', icon: AlertTriangle, color: 'text-orange-400' },
  { stage: 'Skin infections', detail: 'Group A Streptococcus (Strep A)', icon: AlertTriangle, color: 'text-orange-400' },
  { stage: 'Rheumatic fever', detail: 'Autoimmune response to untreated Strep A', icon: AlertTriangle, color: 'text-amber-400' },
  { stage: 'Rheumatic Heart Disease', detail: 'Permanent heart valve damage, potentially fatal', icon: Heart, color: 'text-red-500' },
];

const economics = [
  {
    product: 'Stretch Bed',
    materials: 85,
    goods: 550,
    typical: 1500,
    idiotIndex: 17.6,
    advantage: 63,
    note: 'Each bed diverts 20kg of HDPE from landfill',
  },
  {
    product: 'Washing Machine',
    materials: 800,
    goods: 2800,
    typical: 5000,
    idiotIndex: 6.25,
    advantage: 44,
    note: 'Commercial-grade Speed Queen, built for remote conditions',
  },
];

const demand = [
  { source: 'NPY Women\'s Council', units: '200-350' },
  { source: 'Groote Eylandt (WHSAC)', units: '500+300' },
  { source: 'Utopia Homelands', units: '167' },
  { source: 'Other pipeline', units: '200+' },
];

const voices = [
  { name: 'Ivy', community: 'Palm Island', quote: 'It\'s more better than laying around on the floors' },
  { name: 'Alfred', community: 'Palm Island', quote: 'Having a bed is something you need; you feel more safe when you sleep in a bed' },
  { name: 'Fred Campbell', community: 'Oonchiumpa', quote: 'That\'s something Central Australia need \u2014 just something so simple, especially coming out of recycled' },
  { name: 'Jessica Allardyce', community: 'Miwatj Health', quote: 'When we visit homelands, the beds are often the only furniture that has survived' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ImpactDashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* ---- Hero ---- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-2">
            Impact Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Goods on Country<br />Impact at a Glance
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl text-sm md:text-base">
            Real data from 8 remote Indigenous communities. Beds that last, washing machines that
            prevent disease, and a manufacturing model that communities can own.
          </p>

          {/* Hero stat tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {heroStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`rounded-xl border p-4 ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color} mb-1`} />
                  <div className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- Deployment Summary ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            Deployment Map Summary
          </CardTitle>
          <CardDescription>Products deployed across remote communities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Community</th>
                  <th className="pb-2 pr-4 font-medium">Country</th>
                  <th className="pb-2 pr-4 font-medium text-right">Beds</th>
                  <th className="pb-2 pr-4 font-medium text-right">Washers</th>
                  <th className="pb-2 pr-4 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{d.community}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground italic">{d.country}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{d.beds}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{d.washers}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums font-semibold">
                      {d.total}{d.note ? '*' : ''}
                    </td>
                    <td className="py-2.5">
                      <Badge variant={d.status === 'Active' ? 'default' : 'secondary'}>
                        {d.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={2} className="pt-2.5 font-semibold">Total</td>
                  <td className="pt-2.5 text-right tabular-nums font-semibold">
                    {deployments.reduce((s, d) => s + d.beds, 0)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-semibold">
                    {deployments.reduce((s, d) => s + d.washers, 0)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums font-bold">
                    {deployments.reduce((s, d) => s + d.total, 0)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">*includes 6 weave beds (legacy design)</p>
        </CardContent>
      </Card>

      {/* Two-column row: Health Cascade + Product Economics */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* ---- Health Cascade ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Health Cascade
            </CardTitle>
            <CardDescription>
              How a washing machine can prevent heart disease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {cascadeSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    {/* Connector line */}
                    {i < cascadeSteps.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-px bg-border" />
                    )}
                    <div className="mt-1 shrink-0">
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div className="pb-4">
                      <div className="font-medium text-sm">{step.stage}</div>
                      <div className="text-xs text-muted-foreground">{step.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prevention callout */}
            <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-green-400">Prevention</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A washing machine interrupts the cascade at the source. <strong className="text-foreground">$1 invested = $6 healthcare saved.</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ---- Product Economics ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-500" />
              Product Economics
            </CardTitle>
            <CardDescription>
              The idiot index: ratio of typical remote delivered cost to material cost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {economics.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{p.product}</span>
                    <Badge variant="secondary" className="font-mono">
                      {p.idiotIndex}x idiot index
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Materials</div>
                      <div className="text-lg font-bold text-blue-400">{fmt(p.materials)}</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Goods Delivered</div>
                      <div className="text-lg font-bold text-emerald-400">{fmt(p.goods)}</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Typical Remote</div>
                      <div className="text-lg font-bold text-red-400">{fmt(p.typical)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{p.note}</span>
                    <span className="text-xs font-semibold text-emerald-400">{p.advantage}% cheaper than typical</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column row: Demand vs Supply + Environmental Impact */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* ---- Demand vs Supply ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Demand vs Supply
            </CardTitle>
            <CardDescription>
              The constraint is manufacturing capacity, not market demand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Deployed</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">389</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Documented Demand</div>
                <div className="text-3xl font-black text-blue-400 mt-1">1,400+</div>
              </div>
            </div>

            {/* Demand breakdown */}
            <div className="space-y-2 mb-4">
              {demand.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{d.source}</span>
                  <span className="font-semibold tabular-nums">{d.units} units</span>
                </div>
              ))}
            </div>

            {/* Ratio callout */}
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">3.6x supply/demand gap</span>
              </div>
              <p className="text-sm text-muted-foreground">
                3.6x more documented demand than current supply. Investment in manufacturing
                capacity unlocks revenue immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ---- Environmental Impact ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Environmental Impact
            </CardTitle>
            <CardDescription>
              Circular economy: community waste becomes community furniture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'HDPE diverted to date', value: '9,225 kg', sub: 'Recycled plastic from community waste streams' },
                { label: 'At scale (5,000 beds/yr)', value: '125 tonnes/yr', sub: 'Plastic diverted from landfill annually' },
                { label: 'Per bed', value: '20-25 kg', sub: 'Recycled HDPE plastic in each Stretch Bed' },
                { label: 'Product lifespan', value: '10+ years', sub: 'vs weeks for conventional furniture in remote conditions' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-2 border-b border-border/50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="text-lg font-bold text-green-400 mt-0.5">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Circular loop */}
            <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Recycle className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Circular Loop</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span>Community waste</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span>Shred + melt</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span>Press into beds</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="font-semibold text-foreground">Community ownership</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---- Community Voices ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-purple-500" />
            Community Voices
          </CardTitle>
          <CardDescription>
            What the people who use our products actually say
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {voices.map((v, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 bg-muted/30"
              >
                <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-sm italic leading-relaxed">
                  &ldquo;{v.quote}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm font-semibold">{v.name}</span>
                  <span className="text-xs text-muted-foreground">{v.community}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
