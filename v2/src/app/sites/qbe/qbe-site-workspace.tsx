'use client';

import { useMemo, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  Calculator,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Gauge,
  Layers3,
  LineChart,
  LockKeyhole,
  PackageCheck,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DEFAULTS,
  computeModel,
  fmt,
  fmtInt,
  type BuildMethod,
  type Inputs,
} from '@/lib/cost-model/engine';
import { MATCH_TARGET } from '@/lib/data/loi-pipeline';
import { WEBSITE_PRICE } from '@/lib/data/supplier-quotes';
import { CAPITAL_STACK, QBE_PROGRAM } from '@/lib/data/funder-shared-content';

type ScenarioKey = 'today' | 'factory' | 'community';
type EvidenceStatus = 'Verified' | 'Modelled' | 'Guardrail' | 'Open';
type ReadinessStatus = 'Have' | 'Partial' | 'Gap';

const scenarioOptions: Array<{
  key: ScenarioKey;
  label: string;
  method: BuildMethod;
  volume: number;
  location: Inputs['location'];
  containerise: boolean;
  description: string;
}> = [
  {
    key: 'today',
    label: 'Today',
    method: 'kits',
    volume: 120,
    location: 'sydney',
    containerise: false,
    description: 'Buy finished HDPE leg kits from Defy, assemble and freight.',
  },
  {
    key: 'factory',
    label: 'Own the press',
    method: 'factory',
    volume: 500,
    location: 'sunshine_coast',
    containerise: false,
    description: 'Press and cut HDPE legs in-house, keep the value-add inside Goods.',
  },
  {
    key: 'community',
    label: 'On Country',
    method: 'community',
    volume: 1000,
    location: 'on_country',
    containerise: true,
    description: 'Community-owned plant, fair-wage labour and local plastic loop.',
  },
];

const sourceDocs = [
  {
    title: 'Pitch Page and Documents',
    href: 'https://app.notion.com/p/373ebcf981cf80748e1ef80e281b8fd6',
    note: 'One-line pitch, live routes, QBE ask and deck bundle.',
  },
  {
    title: 'Goods Brand Guide',
    href: 'https://app.notion.com/p/373ebcf981cf81d58ee8fd91280f895f',
    note: 'Brand voice, palette, canonical pricing and cost lines.',
  },
  {
    title: 'QBE Capital Unlock Note',
    href: 'https://app.notion.com/p/35aebcf981cf814aab0af794ed6856b9',
    note: 'What QBE unlocks and the first 90-day funding priorities.',
  },
  {
    title: 'QBE Documentation Readiness',
    href: 'https://app.notion.com/p/36debcf981cf818e968de440ad7b9203',
    note: 'Stage 2 submission set, readiness gaps and September sequence.',
  },
  {
    title: 'Goods Cost Register',
    href: 'https://app.notion.com/p/354ebcf981cf8156bebbf2851ecba5e6',
    note: 'Xero actuals, estimates, pricing references and review queue.',
  },
  {
    title: 'OpenAI Sites Pattern',
    href: 'https://openai.com/index/codex-for-every-role-tool-workflow/',
    note: 'Dashboard, scenario planner and living launch hub pattern.',
  },
];

const evidenceRows: Array<{
  claim: string;
  value: string;
  status: EvidenceStatus;
  source: string;
}> = [
  {
    claim: 'Unified Stretch Bed website price',
    value: '$750',
    status: 'Verified',
    source: 'supplier-quotes.ts, cost model defaults',
  },
  {
    claim: 'Current Buy-Kit marginal cost',
    value: '$684.79',
    status: 'Verified',
    source: 'computeModel() and cost-model-scenarios',
  },
  {
    claim: 'Factory marginal cost once legs are pressed in-house',
    value: '$425.74',
    status: 'Verified',
    source: 'computeModel() locked v6 defaults',
  },
  {
    claim: 'In-house leg saving',
    value: '$194.05 per bed',
    status: 'Verified',
    source: 'cost-model engine v6',
  },
  {
    claim: 'Break-even shift',
    value: '1,679 to 338 beds/year',
    status: 'Modelled',
    source: 'fixed block and contribution model',
  },
  {
    claim: 'QBE Stage 2 match cap',
    value: '$200k-$400k indicative',
    status: 'Guardrail',
    source: MATCH_TARGET.note,
  },
  {
    claim: 'Catalytic ask to close',
    value: '$400,000 signed match-eligible capital',
    status: 'Open',
    source: 'pitch page and brand guide, founder confirmation needed before external send',
  },
  {
    claim: 'Legacy $600 per bed',
    value: 'planning anchor only',
    status: 'Guardrail',
    source: 'supplier-quotes.ts, not current marginal COGS',
  },
];

const readinessRows: Array<{
  area: string;
  status: ReadinessStatus;
  next: string;
}> = [
  {
    area: 'Production cost model',
    status: 'Partial',
    next: 'Turn the verified engine into the SIH Excel tool with editable assumptions.',
  },
  {
    area: 'Market demand research',
    status: 'Gap',
    next: 'Use QBE skilled volunteering to quantify up to four buyer segments.',
  },
  {
    area: 'Founder-authored narrative',
    status: 'Gap',
    next: 'Ben and Nic rewrite the investor story so it is defensible in live Q&A.',
  },
  {
    area: 'GOC-only financial model',
    status: 'Partial',
    next: 'Finish the three-statement model, ACT carve-out and founder FTE treatment.',
  },
  {
    area: 'Signed match evidence',
    status: 'Gap',
    next: 'Land at least three binding LOIs by 31 August 2026.',
  },
  {
    area: 'Governance and ownership path',
    status: 'Partial',
    next: 'Lock the ACT-now to First Nations-controlled pathway and trigger points.',
  },
  {
    area: 'Impact report and demographics',
    status: 'Partial',
    next: 'Separate tracked, modelled, target and future claims before Stage 2.',
  },
  {
    area: 'Accountant-endorsed financials',
    status: 'Gap',
    next: 'Carve Goods financials from ACT and get accountant sign-off.',
  },
];

const useOfFunds = [
  { label: 'Stretch Bed production capacity', value: 120_000, detail: 'First capacity layer for beds, QC and delivery systems.' },
  { label: 'Washer expansion and support logic', value: 40_000, detail: 'Prototype fleet expansion, telemetry and repairs model.' },
  { label: 'Working capital tied to outputs', value: 50_000, detail: 'Inventory, reporting and risk controls while buyer proof lands.' },
];

const routeLinks = [
  { label: 'Cost story', href: '/cost-story', icon: LineChart },
  { label: 'Investor cockpit', href: '/investors?skin=investment', icon: LockKeyhole },
  { label: 'Pitch page', href: '/pitch', icon: FileText },
  { label: 'Pitch document', href: '/pitch/document', icon: ClipboardList },
  { label: 'LOI tracker', href: '/admin/loi-tracker', icon: Scale },
  { label: 'Cost model admin', href: '/admin/cost-model', icon: Calculator },
];

function statusClass(status: EvidenceStatus | ReadinessStatus) {
  switch (status) {
    case 'Verified':
    case 'Have':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'Modelled':
    case 'Partial':
      return 'border-sky-200 bg-sky-50 text-sky-800';
    case 'Guardrail':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'Gap':
    case 'Open':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    default:
      return 'border-stone-200 bg-stone-50 text-stone-700';
  }
}

function Metric({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#2B2A26]">{value}</p>
        </div>
        <span className="rounded-md bg-[#F2E9DF] p-2 text-[#A8643F]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-stone-600">{sub}</p>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="tabular-nums text-stone-500">{fmt(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-lg border border-stone-200 bg-white p-3">
      <span className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold uppercase tracking-[0.14em] text-stone-500">{label}</span>
        <span className="font-mono text-stone-900">
          {suffix === 'beds' ? fmtInt(value) : fmt(value)}
          {suffix === 'beds' ? ' beds' : ''}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 h-2 w-full cursor-pointer accent-[#A8643F]"
      />
    </label>
  );
}

function ScenarioStat({
  label,
  value,
  sub,
  className,
  labelClassName = 'text-white/70',
}: {
  label: string;
  value: string;
  sub: string;
  className: string;
  labelClassName?: string;
}) {
  return (
    <div className={`flex min-h-40 flex-col justify-between rounded-lg p-5 shadow-sm ${className}`}>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${labelClassName}`}>{label}</p>
        <p className="mt-3 text-3xl font-semibold leading-none md:text-4xl">{value}</p>
      </div>
      <p className="mt-5 text-xs leading-5 opacity-80">{sub}</p>
    </div>
  );
}

function scenarioInputs(
  scenario: (typeof scenarioOptions)[number],
  bedsPerYear: number,
  price: number,
  freight: number,
): Inputs {
  return {
    ...DEFAULTS,
    build_method: scenario.method,
    location: scenario.location,
    containerise: scenario.containerise,
    beds_per_year: bedsPerYear,
    retail_price: price,
    long_haul_freight_per_bed: freight,
  };
}

export function QbeSiteWorkspace() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('today');
  const activeScenario = scenarioOptions.find((s) => s.key === scenarioKey) ?? scenarioOptions[0];
  const [bedsPerYear, setBedsPerYear] = useState(activeScenario.volume);
  const [price, setPrice] = useState(WEBSITE_PRICE);
  const [freight, setFreight] = useState(DEFAULTS.long_haul_freight_per_bed);

  const model = useMemo(
    () => computeModel(scenarioInputs(activeScenario, bedsPerYear, price, freight)),
    [activeScenario, bedsPerYear, freight, price],
  );

  const comparison = useMemo(() => {
    return scenarioOptions.map((scenario) => {
      const inputs = scenarioInputs(scenario, scenario.volume, WEBSITE_PRICE, DEFAULTS.long_haul_freight_per_bed);
      const m = computeModel(inputs);
      return { scenario, model: m };
    });
  }, []);

  const selectedMargin = model.contributionSelected;
  const capitalPaybackBeds = Math.round(model.paybackBedsHigh);
  const maxMarginal = Math.max(...comparison.map((row) => row.model.selectedMarginal));
  const maxBreakeven = Math.max(...comparison.map((row) => row.model.breakevenSelected));
  const totalUseOfFunds = useOfFunds.reduce((sum, item) => sum + item.value, 0);

  function changeScenario(key: ScenarioKey) {
    const next = scenarioOptions.find((scenario) => scenario.key === key) ?? scenarioOptions[0];
    setScenarioKey(key);
    setBedsPerYear(next.volume);
    setFreight(next.containerise ? Math.max(0, DEFAULTS.long_haul_freight_per_bed - 70) : DEFAULTS.long_haul_freight_per_bed);
  }

  return (
    <main className="min-h-screen bg-[#FDF8F3] text-[#2B2A26]">
      <section className="border-b border-stone-800 bg-[#24211D] text-[#FDF8F3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="flex min-h-[520px] flex-col justify-between gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[#BBA255]/30 bg-[#BBA255]/15 text-[#FDF8F3]">
                <Sparkles className="h-3 w-3" />
                Codex Sites pattern
              </Badge>
              <Badge className="border-[#5C8A86]/30 bg-[#5C8A86]/20 text-[#FDF8F3]">
                QBE review workspace
              </Badge>
              <Badge className="border-white/15 bg-white/10 text-[#FDF8F3]">
                3 June 2026
              </Badge>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#BBA255]">
                Goods on Country
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-light leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: 'Georgia, serif' }}>
                QBE capital, costings and brand evidence in one live workspace
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#E6DFD1] sm:text-lg">
                The making belongs on Country. This site pulls the Notion QBE work, the verified cost engine, the brand guide and the investor-readiness gaps into one decision surface.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#BBA255]">Catalytic ask</p>
                <p className="mt-2 text-2xl font-semibold">$400k</p>
                <p className="mt-1 text-xs text-[#E6DFD1]">Signed match-eligible capital, cap/rules to confirm.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#BBA255]">Cost unlock</p>
                <p className="mt-2 text-2xl font-semibold">$685 to $426</p>
                <p className="mt-1 text-xs text-[#E6DFD1]">Marginal bed cost, Buy-Kit to factory path.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#BBA255]">Break-even</p>
                <p className="mt-2 text-2xl font-semibold">1,679 to 338</p>
                <p className="mt-1 text-xs text-[#E6DFD1]">Beds/year after the press is owned.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-stone-900">
              <Image
                src="/images/product/stretch-bed-hero.jpg"
                alt="The canonical Stretch Bed on Country, with green canvas and recycled HDPE X-trestle legs"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-40 overflow-hidden rounded-lg border border-white/10 bg-stone-900">
                <Image
                  src="/images/process/heat-press-full.jpg"
                  alt="The heat press inside the Goods production container"
                  fill
                  sizes="210px"
                  className="object-cover"
                />
              </div>
              <div className="relative h-40 overflow-hidden rounded-lg border border-white/10 bg-stone-900">
                <Image
                  src="/images/process/shredded-plastic-tubs.jpg"
                  alt="Tubs of shredded recycled HDPE ready to become bed legs"
                  fill
                  sizes="210px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#E6DFD1]">
              <span className="font-semibold text-[#FDF8F3]">Verified frame:</span> $750 price, $684.79 current marginal cost, $425.74 factory marginal cost. QBE match cap remains a guardrail until SIH/QBE confirm the exact rules.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Current contribution"
            value={fmt(computeModel(DEFAULTS).contributionKit)}
            sub="At $750 price and $684.79 marginal Buy-Kit cost."
            icon={Banknote}
          />
          <Metric
            label="Factory contribution"
            value={fmt(computeModel({ ...DEFAULTS, build_method: 'factory' }).contributionFactory)}
            sub="Contribution after pressing and cutting HDPE legs in-house."
            icon={TrendingDown}
          />
          <Metric
            label="Fixed block"
            value={fmt(computeModel(DEFAULTS).fixedBlock)}
            sub="Annual cost to fund separately from marginal cost per bed."
            icon={Gauge}
          />
          <Metric
            label="Match target"
            value="$200k-$400k"
            sub="Indicative QBE Stage 2 range. External match must be raised first."
            icon={ShieldAlert}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-white p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C8A86]">Scenario planner</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">What changes when the press comes home</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  Move the three levers and watch the case change: marginal cost, contribution, break-even and payback.
                </p>
              </div>
              <div className="inline-flex w-full rounded-lg border border-stone-200 bg-stone-50 p-1 sm:w-auto">
                {scenarioOptions.map((scenario) => (
                  <button
                    key={scenario.key}
                    onClick={() => changeScenario(scenario.key)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition sm:flex-none ${
                      scenario.key === scenarioKey
                        ? 'bg-[#2B2A26] text-white shadow-sm'
                        : 'text-stone-600 hover:bg-white hover:text-stone-950'
                    }`}
                  >
                    {scenario.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 bg-[#FBF8F1] p-5 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-8">
            <div className="space-y-4">
              <RangeControl
                label="Beds per year"
                value={bedsPerYear}
                min={50}
                max={2000}
                step={10}
                suffix="beds"
                onChange={setBedsPerYear}
              />
              <RangeControl
                label="Sale price"
                value={price}
                min={500}
                max={1000}
                step={25}
                onChange={setPrice}
              />
              <RangeControl
                label="Long-haul freight"
                value={freight}
                min={0}
                max={350}
                step={10}
                onChange={setFreight}
              />
              <div className="rounded-lg border border-[#D8CDBD] bg-white p-4 text-sm leading-6 text-stone-700 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643F]">Active path</p>
                <p className="mt-2 font-semibold text-stone-950">{activeScenario.description}</p>
                <div className="mt-4 grid gap-2 border-t border-stone-100 pt-3 text-xs text-stone-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Build method</span>
                    <span className="font-mono uppercase text-stone-900">{activeScenario.method}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Location</span>
                    <span className="font-mono uppercase text-stone-900">{activeScenario.location.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Contribution</span>
                    <span className="font-mono text-stone-900">{fmt(selectedMargin)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ScenarioStat
                  label="Marginal cost"
                  value={fmt(model.selectedMarginal)}
                  sub="Cash cost of one more bed."
                  className="bg-[#24211D] text-white"
                  labelClassName="text-[#BBA255]"
                />
                <ScenarioStat
                  label="Contribution"
                  value={fmt(selectedMargin)}
                  sub="Sale price less marginal cost."
                  className="bg-[#5C8A86] text-white"
                />
                <ScenarioStat
                  label="Break-even"
                  value={`${fmtInt(model.breakevenSelected)} beds`}
                  sub="Annual volume to clear the fixed block."
                  className="bg-[#A8643F] text-white"
                />
                <ScenarioStat
                  label="Payback"
                  value={`${fmtInt(capitalPaybackBeds)} beds`}
                  sub="Beds required to pay back high gross capex."
                  className="bg-[#5E7A4C] text-white"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold">Cost path comparison</h3>
                  <div className="mt-5 space-y-5">
                    {comparison.map(({ scenario, model: rowModel }) => (
                      <Bar
                        key={scenario.key}
                        label={`${scenario.label} marginal`}
                        value={rowModel.selectedMarginal}
                        max={maxMarginal}
                        color={scenario.key === 'today' ? 'bg-[#A8643F]' : scenario.key === 'factory' ? 'bg-[#5C8A86]' : 'bg-[#5E7A4C]'}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold">Break-even comparison</h3>
                  <div className="mt-5 space-y-5">
                    {comparison.map(({ scenario, model: rowModel }) => (
                      <Bar
                        key={scenario.key}
                        label={`${scenario.label} break-even`}
                        value={rowModel.breakevenSelected}
                        max={maxBreakeven}
                        color={scenario.key === 'today' ? 'bg-[#A8643F]' : scenario.key === 'factory' ? 'bg-[#5C8A86]' : 'bg-[#5E7A4C]'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="rounded-lg border border-[#BBA255]/40 bg-[#FFF9EA] p-5 text-sm leading-6 text-stone-700">
                  <p className="font-semibold text-stone-950">What this proves</p>
                  <p className="mt-2">
                    The $1,780 figure is fixed-cost absorption at low pilot volume. The investor surface should lead with marginal cost, contribution, fixed block and break-even.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C8A86]">Capex prize</p>
                  <p className="mt-2 text-2xl font-semibold text-[#2B2A26]">$194.05 / bed</p>
                  <p className="mt-2 text-xs leading-5 text-stone-600">
                    The in-house leg saving that turns the press into the capital case.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-[#A8643F]" />
              <h2 className="font-semibold">Capital unlock</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-600">{QBE_PROGRAM.description}</p>
            <div className="mt-4 space-y-3">
              {CAPITAL_STACK.map((layer) => (
                <div key={`${layer.layer}-${layer.source}`} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{layer.layer}</p>
                      <p className="mt-1 text-xs text-stone-600">{layer.source}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#A8643F]">{layer.amount}</span>
                  </div>
                  <Badge variant="outline" className="mt-2 text-[11px]">
                    {layer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-[#5C8A86]" />
              <h2 className="font-semibold">First funding priorities</h2>
            </div>
            <p className="mt-2 text-sm text-stone-600">{fmt(totalUseOfFunds)} working first tranche from the QBE unlock note.</p>
            <div className="mt-4 space-y-3">
              {useOfFunds.map((item) => (
                <div key={item.label} className="rounded-lg border border-stone-200 bg-[#FBF8F1] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <span className="whitespace-nowrap font-semibold text-[#5E7A4C]">{fmt(item.value)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8">
        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C8A86]">Evidence register</p>
            <h2 className="mt-1 text-xl font-semibold">Numbers that can move into the site</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {evidenceRows.map((row) => (
              <div key={row.claim} className="grid gap-3 p-4 sm:grid-cols-[1fr_160px_110px] sm:items-center">
                <div>
                  <p className="text-sm font-semibold">{row.claim}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{row.source}</p>
                </div>
                <p className="font-mono text-sm text-stone-900">{row.value}</p>
                <Badge variant="outline" className={statusClass(row.status)}>
                  {row.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C8A86]">Stage 2 readiness</p>
            <h2 className="mt-1 text-xl font-semibold">What still needs founder review</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {readinessRows.map((row) => (
              <div key={row.area} className="grid gap-3 p-4 sm:grid-cols-[150px_92px_1fr] sm:items-center">
                <p className="text-sm font-semibold">{row.area}</p>
                <Badge variant="outline" className={statusClass(row.status)}>
                  {row.status}
                </Badge>
                <p className="text-sm leading-6 text-stone-600">{row.next}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
        <div className="rounded-lg border border-stone-200 bg-[#2B2A26] p-5 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#BBA255]" />
            <h2 className="font-semibold">Decision line</h2>
          </div>
          <p className="mt-4 text-2xl font-light leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
            Press our own legs and a set costs about $150 instead of $344. That saves about $194 a bed and drops break-even from about 1,679 beds to 338.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#E6DFD1]">
            The site should make one question unavoidable: who signs the match-eligible capital that turns proven demand into an owned production path?
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="bg-[#BBA255] text-[#24211D] hover:bg-[#CBB56E]">
              <Link href="/investors?skin=investment">
                <Calculator className="h-4 w-4" />
                Open cockpit
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/cost-story">
                <ArrowRight className="h-4 w-4" />
                Cost story
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5C8A86]">Routes and sources</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {routeLinks.map(({ label, href, icon: Icon }) => (
              <Button key={href} asChild variant="outline" className="justify-between">
                <Link href={href}>
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            {sourceDocs.map((doc) => (
              <a
                key={doc.href}
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-stone-200 bg-stone-50 p-3 transition hover:border-[#A8643F]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{doc.title}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{doc.note}</p>
                  </div>
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
