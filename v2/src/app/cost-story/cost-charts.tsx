'use client';

/**
 * Live cost-story charts. Every chart reads the shared cost-model context
 * (driven by the verified computeModel() engine) so the floating control dock
 * recomputes all six as you drag price / beds-per-year. Replaces the six
 * static PNG infographics that used to live in /public.
 *
 * Charts are Recharts (already in the stack — no new dependency). The cream
 * card frame mirrors the original infographic exports.
 */

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Layer,
  Line,
  LineChart,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fmt, fmtInt } from '@/lib/cost-model/engine';
import {
  BEDS_MAX,
  BEDS_MIN,
  PRICE_MAX,
  PRICE_MIN,
  WAGE_MAX,
  WAGE_MIN,
  useCostModel,
} from './cost-model-context';

// ─── Brand palette (matches the original infographic exports) ───────────────
const C = {
  clay: '#A8643F', // HDPE / plastic
  rose: '#C18A7B', // Defy panels
  teal: '#5C8A86', // canvas / freight / buy-kit
  gold: '#BBA255', // steel / labour
  olive: '#7E9A68', // hardware / contribution / factory
  green: '#5E7A4C', // fixed block / surplus / community
  ink: '#2B2A26',
  sub: '#7A7363',
  grid: '#E6DFD1',
  card: '#FBF8F1',
} as const;

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' } as const;

// ─── Shared frame ───────────────────────────────────────────────────────────
function ChartFrame({
  title,
  subtitle,
  source,
  height = 340,
  children,
}: {
  title: string;
  subtitle?: string;
  source?: string;
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-10">
      <div className="rounded-3xl border border-border bg-[#FBF8F1] p-5 shadow-sm md:p-8">
        <figcaption>
          <h3
            className="text-center text-2xl font-semibold leading-tight md:text-3xl"
            style={{ ...serif, color: C.ink }}
          >
            {title}
          </h3>
          {subtitle ? (
            <p
              className="mx-auto mt-2 max-w-2xl text-center text-sm italic md:text-base"
              style={{ color: C.sub }}
            >
              {subtitle}
            </p>
          ) : null}
        </figcaption>
        <div className="mt-6 w-full" style={{ height }}>
          {children}
        </div>
        {source ? (
          <p
            className="mt-5 border-t pt-3 text-[11px] leading-relaxed"
            style={{ color: C.sub, borderColor: C.grid }}
          >
            {source}
          </p>
        ) : null}
      </div>
    </figure>
  );
}

// ─── Permissive tooltip (avoids Recharts generic friction) ──────────────────
interface TipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string | number }>;
}

function MoneyTip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-md" style={{ borderColor: C.grid }}>
      {label !== undefined && label !== '' ? (
        <p className="mb-1 font-semibold" style={{ color: C.ink }}>{label}</p>
      ) : null}
      {payload
        .filter((p) => p.value != null && Number(p.value) !== 0)
        .map((p, i) => (
          <p key={i} style={{ color: p.color || C.ink }}>
            {p.name}: {fmt(Number(p.value))}
          </p>
        ))}
    </div>
  );
}

function refLabel(value: string, fill: string = C.sub, position: 'insideTopLeft' | 'insideTopRight' | 'top' | 'right' = 'insideTopRight') {
  return { value, position, fill, fontSize: 11 };
}

// =============================================================================
// 1. IDIOT INDEX — what we pay vs the raw-material floor (material markup)
// =============================================================================
export function IdiotIndexChart() {
  const { model: m } = useCostModel();
  const data = [
    { part: 'HDPE legs', idx: m.idiotKitShred, fill: C.clay },
    { part: 'Defy panels', idx: m.idiotPanelShred, fill: C.rose },
    { part: 'Canvas', idx: m.idiotCanvas, fill: C.teal },
    { part: 'Steel', idx: m.idiotSteel, fill: C.gold },
    { part: 'Hardware', idx: 1, fill: C.olive },
  ].sort((a, b) => b.idx - a.idx);
  const maxIdx = Math.ceil(Math.max(...data.map((d) => d.idx)) + 1);

  return (
    <ChartFrame
      title="Idiot index: where the cost-down is"
      subtitle="Index = what we pay now ÷ the raw-material floor. A high bar isn't waste — it's supplier margin we could capture by in-sourcing."
      source={`Goods cost model v6. Index = paid ÷ raw floor per component. HDPE legs run ${m.idiotKitShred.toFixed(1)}× the shred floor and ${m.idiotKitPolymer.toFixed(1)}× raw recycled polymer — the capital case. Material markup; independent of sell price and volume.`}
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ left: 16, right: 64, top: 8, bottom: 8 }}>
          <CartesianGrid horizontal={false} stroke={C.grid} />
          <XAxis
            type="number"
            domain={[0, maxIdx]}
            tickFormatter={(v: number) => `${v}×`}
            stroke={C.sub}
            fontSize={12}
          />
          <YAxis type="category" dataKey="part" width={92} stroke={C.ink} fontSize={13} tickLine={false} />
          <Tooltip content={<MoneyTipless />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="idx" radius={[0, 6, 6, 0]} maxBarSize={28} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.part} fill={d.fill} />
            ))}
            <LabelList dataKey="idx" position="right" formatter={(v: React.ReactNode) => `${Number(v).toFixed(1)}×`} fill={C.ink} fontSize={13} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

// idiot index reads as multiples, not dollars — its own tiny tooltip
function MoneyTipless({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-md" style={{ borderColor: C.grid }}>
      <p className="font-semibold" style={{ color: C.ink }}>{label}</p>
      <p style={{ color: C.sub }}>{Number(payload[0].value).toFixed(1)}× the raw floor</p>
    </div>
  );
}

// =============================================================================
// 2. FULLY-LOADED vs VOLUME — the "$1,780 myth" collapsing toward marginal
// =============================================================================
export function FullyLoadedChart() {
  const { model: m, beds } = useCostModel();
  const data: { beds: number; buyKit: number; factory: number }[] = [];
  for (let v = BEDS_MIN; v <= BEDS_MAX; v += 25) {
    data.push({ beds: v, buyKit: m.marginalKit + m.fixedBlock / v, factory: m.marginalFactory + m.fixedBlock / v });
  }
  const currentFull = m.marginalFactory + m.fixedBlock / Math.max(1, beds);

  return (
    <ChartFrame
      title={'Why "$1,780 a bed" is misleading'}
      subtitle="Fully-loaded cost = marginal cost + the fixed block ÷ how many beds we make. Make more beds and it collapses toward the real marginal floor."
      source={`Goods cost model v6. Fully-loaded = marginal + (${fmt(m.fixedBlock)} fixed block ÷ beds/yr). The bed doesn't get cheaper to make — we just stop dividing a year of fixed cost by a tiny number. Marker = your current ${fmtInt(beds)} beds/yr.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 24, top: 16, bottom: 8 }}>
          <CartesianGrid stroke={C.grid} />
          <XAxis dataKey="beds" type="number" domain={[BEDS_MIN, BEDS_MAX]} stroke={C.sub} fontSize={12}
            tickFormatter={(v: number) => fmtInt(v)} label={{ value: 'beds per year', position: 'insideBottom', offset: -4, fill: C.sub, fontSize: 11 }} />
          <YAxis stroke={C.sub} fontSize={12} tickFormatter={(v: number) => fmt(v)} width={64} />
          <Tooltip content={<MoneyTip />} />
          <ReferenceLine y={m.marginalKit} stroke={C.teal} strokeDasharray="5 4" label={refLabel(`Buy-Kit floor ${fmt(m.marginalKit)}`, C.teal)} />
          <ReferenceLine y={m.marginalFactory} stroke={C.green} strokeDasharray="5 4" label={refLabel(`Factory floor ${fmt(m.marginalFactory)}`, C.green, 'insideTopLeft')} />
          <ReferenceLine x={beds} stroke={C.clay} strokeDasharray="2 3" label={refLabel(`you: ${fmt(currentFull)}`, C.clay, 'top')} />
          <Line type="monotone" dataKey="buyKit" name="Buy-Kit fully-loaded" stroke={C.teal} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="factory" name="Factory fully-loaded" stroke={C.green} strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

// =============================================================================
// 3. WHERE EACH $X GOES — stacked unit economics, 3 build paths
// =============================================================================
export function Where750Chart() {
  const { model: m, inputs: i, price } = useCostModel();

  const kitAssembly = i.labour_per_day / Math.max(0.5, i.defy_kits_beds_per_day) + i.local_freight_per_bed;
  const factoryProcess = i.labour_per_day / Math.max(0.5, i.factory_beds_per_day);
  const factoryPlastic = m.hdpeRawCost + i.diesel_per_bed_factory;

  const rows = [
    {
      path: 'Buy-Kit (today)',
      input: i.defy_kit_per_bed,
      labour: kitAssembly,
      materials: Math.max(0, m.marginalKit - i.defy_kit_per_bed - kitAssembly - m.longHaulFreight),
      freight: m.longHaulFreight,
      contribution: Math.max(0, price - m.marginalKit),
    },
    {
      path: 'Factory (in-house)',
      input: factoryPlastic,
      labour: factoryProcess,
      materials: Math.max(0, m.marginalFactory - factoryPlastic - factoryProcess - m.longHaulFreight),
      freight: m.longHaulFreight,
      contribution: Math.max(0, price - m.marginalFactory),
    },
    {
      path: 'Community',
      input: 0,
      labour: i.community_labour_per_bed,
      materials: Math.max(0, m.marginalCommunity - i.community_labour_per_bed - m.longHaulFreight),
      freight: m.longHaulFreight,
      contribution: Math.max(0, price - m.marginalCommunity),
    },
  ];

  return (
    <ChartFrame
      title={`Where each ${fmt(price)} goes`}
      subtitle="The same bed, three ways to make it. Owning the plastic processing turns a thin sliver of contribution into the slice that keeps the lights on."
      source={`Goods cost model v6. Each bar is the ${fmt(price)} sell price split into cost (plastic/legs, labour, steel + canvas + hardware, freight) then contribution. Contribution funds the ${fmt(m.fixedBlock)}/yr fixed block. BOM + price verified; in-house legs, labour and freight modelled.`}
      height={360}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ left: 8, right: 16, top: 16, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="path" stroke={C.ink} fontSize={13} tickLine={false} />
          <YAxis stroke={C.sub} fontSize={12} tickFormatter={(v: number) => fmt(v)} width={64} />
          <Tooltip content={<MoneyTip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <ReferenceLine y={price} stroke={C.clay} strokeDasharray="4 4" label={refLabel(`Sells for ${fmt(price)}`, C.clay, 'insideTopRight')} />
          <Bar dataKey="input" stackId="a" name="Plastic / legs" fill={C.clay} maxBarSize={120} isAnimationActive={false} />
          <Bar dataKey="labour" stackId="a" name="Labour" fill={C.gold} isAnimationActive={false} />
          <Bar dataKey="materials" stackId="a" name="Steel + canvas + hardware" fill={C.teal} isAnimationActive={false} />
          <Bar dataKey="freight" stackId="a" name="Freight to community" fill={C.rose} isAnimationActive={false} />
          <Bar dataKey="contribution" stackId="a" name="Contribution (keeps the lights on)" fill={C.olive} radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

// =============================================================================
// 4. WHERE THE MONEY GOES — Sankey flow (factory path, at current beds/price)
// =============================================================================
export function MoneySankey() {
  const { model: m, inputs: i, price, beds } = useCostModel();

  // cogs + freight = marginalFactory × beds exactly (materials absorbs any inbound
  // freight), so Revenue = cogs + freight + contribution balances at every slider value.
  const perDayProcess = i.labour_per_day / Math.max(0.5, i.factory_beds_per_day);
  const plastic = m.hdpeRawCost * beds;
  const diesel = i.diesel_per_bed_factory * beds;
  const process = perDayProcess * beds;
  const materials = Math.max(0, m.marginalFactory - m.hdpeRawCost - i.diesel_per_bed_factory - perDayProcess - m.longHaulFreight) * beds;
  const freight = m.longHaulFreight * beds;
  const cogs = plastic + diesel + process + materials;
  const contribution = Math.max(1, (price - m.marginalFactory) * beds);
  const coversFixed = contribution >= m.fixedBlock;
  const fixed = coversFixed ? m.fixedBlock : contribution; // all contribution if below break-even
  const surplus = contribution - fixed; // 0 when the fixed block isn't yet covered

  const nodes: { name: string }[] = [
    { name: `Revenue · ${fmt(beds * price)}` }, // 0
    { name: `Cost of goods · ${fmt(cogs)}` }, // 1
    { name: `Freight · ${fmt(freight)}` }, // 2
    { name: `Contribution · ${fmt(contribution)}` }, // 3
    { name: `Plastic shred · ${fmt(plastic)}` }, // 4
    { name: `Diesel · ${fmt(diesel)}` }, // 5
    { name: `Process labour · ${fmt(process)}` }, // 6
    { name: `Steel + canvas + hw · ${fmt(materials)}` }, // 7
    { name: coversFixed ? `Fixed block · ${fmt(m.fixedBlock)}` : `Toward fixed block · ${fmt(fixed)} of ${fmt(m.fixedBlock)}` }, // 8
  ];
  const links = [
    { source: 0, target: 1, value: cogs },
    { source: 0, target: 2, value: freight },
    { source: 0, target: 3, value: contribution },
    { source: 1, target: 4, value: plastic },
    { source: 1, target: 5, value: diesel },
    { source: 1, target: 6, value: process },
    { source: 1, target: 7, value: materials },
    { source: 3, target: 8, value: fixed },
  ];
  if (surplus > 0) {
    nodes.push({ name: `Operating surplus · ${fmt(surplus)}` }); // 9
    links.push({ source: 3, target: 9, value: surplus });
  }

  return (
    <ChartFrame
      title="Where the money goes"
      subtitle="A year of in-house (factory) production, read as a flow. Band thickness = dollars. Every dollar of revenue is a cost or contribution; contribution first pays the fixed block, the rest is operating surplus."
      source={`Goods cost model v6. In-house path at ${fmtInt(beds)} beds × ${fmt(price)}. Contribution pays the ${fmt(m.fixedBlock)}/yr fixed block first; what's left is surplus. ${(price - m.marginalFactory) * beds < m.fixedBlock ? 'At these settings contribution does not yet cover the fixed block — no operating surplus at this volume.' : 'Band thickness proportional to dollars.'}`}
      height={420}
    >
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={{ nodes, links }}
          node={<SankeyNode />}
          link={{ stroke: C.olive, strokeOpacity: 0.28 }}
          nodePadding={26}
          nodeWidth={12}
          margin={{ left: 8, right: 160, top: 12, bottom: 12 }}
        >
          <Tooltip content={<MoneyTip />} />
        </Sankey>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

interface SankeyNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: { name?: string };
  containerWidth?: number;
}
function SankeyNode({ x = 0, y = 0, width = 0, height = 0, index = 0, payload, containerWidth = 0 }: SankeyNodeProps) {
  const isLeft = x < containerWidth / 2;
  const palette = [C.ink, C.clay, C.rose, C.olive, C.clay, C.gold, C.clay, C.teal, C.green, C.green];
  const fill = palette[index] ?? C.ink;
  return (
    <Layer>
      <Rectangle x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} radius={2} />
      <text
        x={isLeft ? x + width + 8 : x - 8}
        y={y + height / 2}
        textAnchor={isLeft ? 'start' : 'end'}
        dominantBaseline="middle"
        fontSize={11}
        fill={C.ink}
      >
        {payload?.name}
      </text>
    </Layer>
  );
}

// =============================================================================
// 5. COST-DOWN PATH — experience curve (marginal cost vs production maturity)
// =============================================================================
export function CostCurveChart() {
  const { model: m, price } = useCostModel();
  const data = [
    { x: '500', real: m.marginalKit, label: 'Buy-Kit' },
    { x: '1,000', real: m.marginalFactory, label: 'Factory' },
    { x: '2,000', real: m.marginalCommunity, proj: m.marginalCommunity, label: 'Community' },
    { x: '5,000', proj: Math.round(m.marginalCommunity * 0.93) },
    { x: '10,000', proj: Math.round(m.marginalCommunity * 0.86) },
  ];
  const yMax = Math.ceil((Math.max(m.marginalKit, price) + 60) / 50) * 50;

  return (
    <ChartFrame
      title="Goods' cost-down path (an experience curve)"
      subtitle="Marginal cost per bed falls as we mature in production — the same shape as solar panels and EV batteries."
      source={`Goods cost model v6. Marginal cost = what one more bed costs to make + freight, before the ${fmt(m.fixedBlock)}/yr fixed block. Solid points are real/target paths (Buy-Kit → Factory → Community); the dashed tail is illustrative — actual learning rate pending Defy volume quotes.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 24, top: 24, bottom: 16 }}>
          <CartesianGrid stroke={C.grid} />
          <XAxis dataKey="x" stroke={C.sub} fontSize={12}
            label={{ value: 'cumulative beds produced → production maturity', position: 'insideBottom', offset: -6, fill: C.sub, fontSize: 11 }} />
          <YAxis stroke={C.sub} fontSize={12} tickFormatter={(v: number) => fmt(v)} width={64} domain={[300, yMax]} />
          <Tooltip content={<MoneyTip />} />
          <ReferenceLine y={price} stroke={C.clay} strokeDasharray="4 4" label={refLabel(`Sells for ${fmt(price)} — marginal sits below price`, C.clay, 'insideTopRight')} />
          <Line type="monotone" dataKey="real" name="Marginal cost (real/target)" stroke={C.green} strokeWidth={3} connectNulls={false}
            dot={{ r: 6, fill: C.green }} isAnimationActive={false}>
            <LabelList dataKey="real" position="top" formatter={(v: React.ReactNode) => (v ? fmt(Number(v)) : '')} fill={C.ink} fontSize={12} />
          </Line>
          <Line type="monotone" dataKey="proj" name="Marginal cost (illustrative)" stroke={C.green} strokeWidth={2.5} strokeDasharray="6 5" connectNulls
            dot={{ r: 4, fill: C.card, stroke: C.green }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

// =============================================================================
// 6. BREAK-EVEN — contribution stacking up toward the fixed block
// =============================================================================
export function BreakevenChart() {
  const { model: m, price } = useCostModel();
  const data: { beds: number; buyKit: number; factory: number }[] = [];
  for (let b = 0; b <= 1800; b += 50) {
    data.push({ beds: b, buyKit: m.contributionKit * b, factory: m.contributionFactory * b });
  }

  return (
    <ChartFrame
      title="How many beds to break even"
      subtitle="Each bed's contribution stacks up toward the fixed block. In-house production crosses it fast; buying finished kits barely clears it."
      source={`Goods cost model v6. Break-even = ${fmt(m.fixedBlock)} ÷ contribution per bed, at the ${fmt(price)} price. The flatter the line, the more beds needed — which is why in-sourcing the plastic (the steeper line) is the whole capital case.`}
      height={380}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 24, top: 16, bottom: 16 }}>
          <CartesianGrid stroke={C.grid} />
          <XAxis dataKey="beds" type="number" domain={[0, 1800]} stroke={C.sub} fontSize={12} tickFormatter={(v: number) => fmtInt(v)}
            label={{ value: 'beds sold per year', position: 'insideBottom', offset: -6, fill: C.sub, fontSize: 11 }} />
          <YAxis stroke={C.sub} fontSize={12} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} width={52} />
          <Tooltip content={<MoneyTip />} />
          <ReferenceLine y={m.fixedBlock} stroke={C.clay} strokeDasharray="5 4" label={refLabel(`Fixed block ${fmt(m.fixedBlock)}/yr`, C.clay, 'insideTopLeft')} />
          {Number.isFinite(m.breakevenFactory) ? (
            <ReferenceLine x={m.breakevenFactory} stroke={C.green} strokeDasharray="2 3" label={refLabel(`in-house ${fmtInt(m.breakevenFactory)}`, C.green, 'top')} />
          ) : null}
          {Number.isFinite(m.breakevenKit) && m.breakevenKit <= 1800 ? (
            <ReferenceLine x={m.breakevenKit} stroke={C.teal} strokeDasharray="2 3" label={refLabel(`buy-kit ${fmtInt(m.breakevenKit)}`, C.teal, 'top')} />
          ) : null}
          <Line type="monotone" dataKey="factory" name="In-house / community" stroke={C.green} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="buyKit" name="Buy-Kit" stroke={C.teal} strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

// =============================================================================
// FLOATING CONTROL DOCK — drives every chart on the page
// =============================================================================
export function CostDock() {
  const { price, beds, wage, setPrice, setBeds, setWage, model: m } = useCostModel();
  const [open, setOpen] = useState(true);
  const contribution = price - m.marginalFactory;
  const surplus = contribution * beds - m.fixedBlock;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-[#FBF8F1]/95 px-5 py-2 text-sm font-medium shadow-lg backdrop-blur"
        style={{ color: C.ink }}
      >
        ⚙ Adjust the model
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 left-1/2 z-50 w-[min(1120px,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl border border-border bg-[#FBF8F1]/95 p-3 shadow-2xl backdrop-blur md:bottom-4 md:p-4">
      <div className="flex items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.sub }}>
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: C.olive }} />
          Drag — every chart updates live
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-xs underline" style={{ color: C.sub }}>
          hide
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
        {/* Price */}
        <label className="block">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-medium" style={{ color: C.ink }}>Sell price / bed</span>
            <span className="font-mono text-sm" style={{ color: C.ink }}>{fmt(price)}</span>
          </div>
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={5} value={price}
            onChange={(e) => setPrice(Number(e.target.value))} className="w-full" style={{ accentColor: C.clay }} />
        </label>
        {/* Beds */}
        <label className="block">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-medium" style={{ color: C.ink }}>Beds per year</span>
            <span className="font-mono text-sm" style={{ color: C.ink }}>{fmtInt(beds)}</span>
          </div>
          <input type="range" min={BEDS_MIN} max={BEDS_MAX} step={1} value={beds}
            onChange={(e) => setBeds(Number(e.target.value))} className="w-full" style={{ accentColor: C.olive }} />
        </label>
        {/* Community fair wage */}
        <label className="block">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-medium" style={{ color: C.ink }}>Fair wage / bed</span>
            <span className="font-mono text-sm" style={{ color: C.ink }}>{fmt(wage)}</span>
          </div>
          <input type="range" min={WAGE_MIN} max={WAGE_MAX} step={5} value={wage}
            onChange={(e) => setWage(Number(e.target.value))} className="w-full" style={{ accentColor: C.green }} />
          <p className="mt-0.5 text-[10px]" style={{ color: C.sub }}>→ community {fmt(m.marginalCommunity)}/bed</p>
        </label>
        {/* Live readout */}
        <div className="flex gap-4 rounded-xl bg-white/70 px-4 py-2 text-center md:gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: C.sub }}>Contribution</p>
            <p className="font-mono text-sm font-semibold" style={{ color: contribution > 0 ? C.green : C.clay }}>{fmt(contribution)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: C.sub }}>{surplus >= 0 ? 'Surplus / yr' : 'Deficit / yr'}</p>
            <p className="font-mono text-sm font-semibold" style={{ color: surplus >= 0 ? C.green : C.clay }}>{fmt(Math.abs(surplus))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
