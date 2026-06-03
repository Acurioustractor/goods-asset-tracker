'use client';

import { useMemo, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  BookOpen,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Gauge,
  Layers3,
  LineChart,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Users,
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

const storySurfaceLinks = [
  {
    label: 'Utopia field note',
    href: '/field-notes/utopia-may-2026',
    status: 'Unlisted review draft',
    icon: BookOpen,
    image: '/images/stories/utopia/04-build.jpg',
    summary: 'Young people building Stretch Beds in Alice Springs, then the road out to Utopia Homelands.',
  },
  {
    label: 'Oonchiumpa partnership',
    href: '/partners/oonchiumpa',
    status: 'Public partner story',
    icon: Users,
    image: '/images/partners/centrecorp/utopia/community-build.jpg',
    summary: 'The Aboriginal-led program behind the build, the design work and the youth pathway.',
  },
  {
    label: 'Communities map',
    href: '/communities',
    status: 'Public proof surface',
    icon: MapPin,
    image: '/images/stories/utopia/region-map.png',
    summary: 'Where beds have gone, with community pages for Utopia, Palm Island, Tennant Creek and more.',
  },
  {
    label: 'Impact and origin',
    href: '/story',
    status: 'Public origin layer',
    icon: CheckCircle2,
    image: '/images/media-pack/community-bed-assembly.jpg',
    summary: 'The health hardware story: sleep, hygiene, repair, waste and money staying closer to community.',
  },
];

const narrativeBeats = [
  {
    kicker: '1 · The room',
    title: 'Oonchiumpa holds the build',
    body: 'Young people are not a side note. The first production-studio story starts with Oonchiumpa setting the room, collecting people each morning and holding the relationships.',
  },
  {
    kicker: '2 · The making',
    title: 'Kids build the beds they sleep on',
    body: 'The product proof is also an employment proof: flat-pack parts, assembly skill, pride in the finished bed and a real pathway if production moves closer to home.',
  },
  {
    kicker: '3 · The road',
    title: 'Fred and Decon lead into Utopia',
    body: 'The homelands story needs the connectors in front. The route only works because Oonchiumpa workers and local teams already know which doors to knock on.',
  },
  {
    kicker: '4 · The claim',
    title: 'Capital moves making to Country',
    body: 'The QBE ask is not abstract capex. It is the next step from household demand, youth capability and a containerised plant that communities can eventually own.',
  },
];

const photoProof = [
  {
    src: '/images/stories/utopia/04-build.jpg',
    alt: 'Young people assembling Stretch Beds in Alice Springs',
    label: 'Alice Springs build',
  },
  {
    src: '/images/product/stretch-bed-kids-building.jpg',
    alt: 'Young people building a Stretch Bed',
    label: 'Young builders',
  },
  {
    src: '/images/stories/utopia/06-delivery.jpg',
    alt: 'Stretch Beds being delivered in Utopia Homelands',
    label: 'Utopia delivery',
  },
  {
    src: '/images/partners/centrecorp/utopia/home-setup.jpg',
    alt: 'A Stretch Bed set up inside a remote-community home',
    label: 'Inside the home',
  },
  {
    src: '/images/partners/centrecorp/utopia/elder-feedback.jpg',
    alt: 'Elder feedback on a Stretch Bed',
    label: 'Elder feedback',
  },
  {
    src: '/images/stories/utopia/region-map.png',
    alt: 'Map of Urapuntja and Ampilatwatja homelands',
    label: 'Homelands map',
  },
];

const communityStoryLinks = [
  { label: 'Utopia Homelands', href: '/communities/utopia-homelands', detail: 'Homelands delivery path and community demand.' },
  { label: 'Alice Springs', href: '/communities/alice-springs', detail: 'Oonchiumpa, production studio and youth-build pathway.' },
  { label: 'Tennant Creek', href: '/communities/tennant-creek', detail: 'Design origins, Warumungu naming and early pull.' },
  { label: 'Palm Island', href: '/communities/palm-island', detail: 'Cleared voices on freight, safety and floor-to-bed impact.' },
];

const siteArchitecture = [
  {
    area: 'Capital room',
    href: '/sites/qbe',
    status: 'Live',
    icon: Layers3,
    purpose: 'Decision surface for QBE, SIH, founders and match-capital conversations.',
    offers: ['Scenario planner', 'QBE capital stack', 'Evidence register'],
  },
  {
    area: 'Story room',
    href: '/field-notes/utopia-may-2026',
    status: 'Review draft',
    icon: BookOpen,
    purpose: 'Long-form Utopia and Alice Springs narrative: young builders, Oonchiumpa, Fred and Decon, households and homelands.',
    offers: ['Utopia field note', 'Consent-aware voices', 'Road and build media'],
  },
  {
    area: 'Community room',
    href: '/communities',
    status: 'Live base',
    icon: MapPin,
    purpose: 'Place-by-place proof: where beds landed, what each community asked for, what the next production move means.',
    offers: ['Community map', 'Place pages', 'Demand and delivery context'],
  },
  {
    area: 'Production room',
    href: '/process',
    status: 'Needs story pass',
    icon: PackageCheck,
    purpose: 'Show the first on-Country production studio pathway from plastic, press and canvas through to local ownership.',
    offers: ['Container plant', 'Build photos', 'Youth employment pathway'],
  },
  {
    area: 'Partner room',
    href: '/partners/oonchiumpa',
    status: 'Live',
    icon: Users,
    purpose: 'Make the relationship visible: Oonchiumpa, Centrecorp, community workers and the people who hold the doors open.',
    offers: ['Oonchiumpa story', 'Centrecorp story', 'Partnership method'],
  },
  {
    area: 'Evidence room',
    href: '/cost-story',
    status: 'Live base',
    icon: LineChart,
    purpose: 'Back the story with numbers that are clean enough for investor, funder and buyer review.',
    offers: ['Cost model', 'Pricing guardrails', 'Route to investor cockpit'],
  },
];

const nextBuildQueue = [
  {
    title: 'Publish Utopia when consent clears',
    detail: 'Keep the unlisted review link, then flip the field note into the public index once voices and faces are cleared.',
  },
  {
    title: 'Turn communities into story hubs',
    detail: 'Each community page should carry delivery photos, demand, named voices where cleared, product lessons and next asks.',
  },
  {
    title: 'Build the production studio page',
    detail: 'Make the first on-Country production studio concrete: press, plastic loop, young builders, training and ownership transfer.',
  },
  {
    title: 'Add consent-aware photo captions',
    detail: 'Photos need source, place, status and whether they are public, review-only or internal until community sign-off.',
  },
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

      <section className="border-y border-stone-200 bg-[#F6EFE6]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C8A86]">Story layer</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-[#2B2A26] md:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
                The QBE page should offer the proof in story, not only in numbers
              </h2>
            </div>
            <p className="text-sm leading-6 text-stone-700">
              The calculator makes the capital case. The wider site has to carry the human case: the Utopia trip, Oonchiumpa role, the first production-studio pathway, community demand, photos from the road and cleared voices as they become available.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
            <Link
              href={storySurfaceLinks[0].href}
              className="group relative min-h-[420px] overflow-hidden rounded-lg border border-stone-300 bg-stone-900 text-white shadow-sm"
            >
              <Image
                src={storySurfaceLinks[0].image}
                alt="Young people building Stretch Beds through the Oonchiumpa program"
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B17] via-[#1F1B17]/62 to-transparent" />
              <div className="relative flex min-h-[420px] flex-col justify-end p-5 sm:p-7">
                <Badge className="w-fit border-[#BBA255]/35 bg-[#BBA255]/20 text-white">
                  {storySurfaceLinks[0].status}
                </Badge>
                <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
                  Alice Springs to Utopia Homelands
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#F3E8D9]">
                  {storySurfaceLinks[0].summary} This is the review link for the deeper narrative: young builders, Oonchiumpa, Fred and Decon, the road, the households and the community-ownership path.
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#2B2A26] transition group-hover:bg-[#F2E2C5]">
                  Open Utopia story
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <div className="grid gap-3">
              {storySurfaceLinks.slice(1).map(({ label, href, status, icon: Icon, image, summary }) => (
                <Link
                  key={href}
                  href={href}
                  className="group grid grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm transition hover:border-[#A8643F]"
                >
                  <div className="relative min-h-36 bg-stone-200">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-md bg-[#F2E9DF] p-2 text-[#A8643F]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <Badge variant="outline" className="border-stone-200 text-[11px] text-stone-600">
                        {status}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[#2B2A26]">{label}</h3>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {narrativeBeats.map((beat) => (
              <div key={beat.title} className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643F]">{beat.kicker}</p>
                <h3 className="mt-3 text-lg font-semibold text-[#2B2A26]">{beat.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{beat.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#5C8A86]" />
                <h3 className="text-lg font-semibold">Photo proof to bring forward</h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photoProof.map((photo) => (
                  <figure key={photo.src} className="overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm">
                    <div className="relative aspect-[4/3] bg-stone-200">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 280px, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="p-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                      {photo.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#A8643F]" />
                <h3 className="text-lg font-semibold">Community entry points</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                The next pass should make the community map feel like a story index: each place opens into demand, delivery photos, voices, product lessons and what the next production move could unlock.
              </p>
              <div className="mt-4 space-y-3">
                {communityStoryLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg border border-stone-200 bg-[#FBF8F1] p-3 transition hover:border-[#5C8A86]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <ArrowRight className="h-4 w-4 text-stone-400" />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-3 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C8A86]">Site map</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">What this Codex site should offer</h2>
              </div>
              <p className="text-sm leading-6 text-stone-600">
                This is the next build shape: one live workspace that branches into capital, story, communities, production, partners and evidence. Each page has a job, not just a link.
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {siteArchitecture.map(({ area, href, status, icon: Icon, purpose, offers }) => (
                <Link
                  key={area}
                  href={href}
                  className="group flex min-h-[250px] flex-col rounded-lg border border-stone-200 bg-[#FBF8F1] p-4 transition hover:border-[#A8643F] hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md bg-white p-2 text-[#A8643F] shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Badge variant="outline" className="border-stone-300 bg-white text-[11px] text-stone-600">
                      {status}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#2B2A26]">{area}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{purpose}</p>
                  <div className="mt-auto pt-4">
                    <div className="flex flex-wrap gap-2">
                      {offers.map((offer) => (
                        <span key={offer} className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600">
                          {offer}
                        </span>
                      ))}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#A8643F]">
                      Open page
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-stone-200 bg-[#2B2A26] p-5 text-white shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[#BBA255]" />
              <h2 className="text-lg font-semibold">Next build queue</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#E6DFD1]">
              The highest leverage work is not more dashboard polish. It is turning the real work into public, consent-clean story surfaces.
            </p>
            <div className="mt-5 space-y-3">
              {nextBuildQueue.map((item, index) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BBA255] text-xs font-bold text-[#24211D]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#E6DFD1]">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
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
