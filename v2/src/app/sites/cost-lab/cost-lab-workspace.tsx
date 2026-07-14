'use client';

/**
 * The Cost Lab — a first-principles working room for Ben + Nic.
 *
 * Every number on this page is editable and recomputes live through the SAME
 * verified engine the investor cockpit uses (`@/lib/cost-model/engine`).
 * Edits persist in THIS browser only (localStorage). "Reset to canon" always
 * returns to the locked 2026-05-29 numbers. Nothing here writes to the
 * database or changes the public site.
 *
 * Sections:
 *   1. The bed, broken to raw amounts (component vs raw-material floor)
 *   2. The container build coster (line-item capex, gross vs net)
 *   3. People and the fixed block
 *   4. Funding alignment (which capital pays for which block + QBE match math)
 *   5. Compounding growth (containers pay for containers)
 *   6. Partners and components map
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Atom,
  Banknote,
  Boxes,
  Container,
  Factory,
  Handshake,
  LineChart,
  RotateCcw,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  DEFAULTS,
  computeModel,
  fmt,
  fmtInt,
  safeDiv,
  LOCATIONS,
  ALREADY_INVESTED,
  LEGS_SAVING_PER_BED,
  SHRED_FLOOR_PER_BED,
  POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED,
  CANVAS_RAW_FLOOR_PER_BED,
  type Inputs,
  type BuildMethod,
} from '@/lib/cost-model/engine';
import { MATCH_TARGET } from '@/lib/data/loi-pipeline';

// ── Local state shapes ───────────────────────────────────────────────────────

interface CapexRow {
  id: number;
  label: string;
  low: number;
  high: number;
  note: string;
}

interface SimInputs {
  bedsPerContainerYear: number;
  path: Extract<BuildMethod, 'factory' | 'community'>;
  containerCost: number; // per additional container, AUD
  siteOverheadPerYear: number; // per container site
  signedExternal: number; // signed match-eligible capital for the QBE calc
  horizonYears: number;
  startingContainers: number; // containers funded up-front by the raise
}

const CANON_CAPEX: CapexRow[] = [
  { id: 1, label: 'Shredder', low: 15_000, high: 30_000, note: 'Vendor quote pending' },
  { id: 2, label: 'Hot press line', low: 80_000, high: 150_000, note: 'Vendor quote pending' },
  { id: 3, label: 'CNC router', low: 15_000, high: 40_000, note: 'Vendor quote pending' },
  { id: 4, label: 'Benches and tooling', low: 2_000, high: 2_000, note: 'Estimated' },
];

const CANON_SIM: SimInputs = {
  bedsPerContainerYear: 500,
  path: 'community',
  containerCost: 125_000,
  siteOverheadPerYear: 24_000,
  signedExternal: 400_000,
  horizonYears: 8,
  startingContainers: 1,
};

// One-click scenarios: set the model and the simulator together.
const SCENARIOS: Array<{
  key: string;
  label: string;
  hint: string;
  inputs: Partial<Inputs>;
  sim: Partial<SimInputs>;
}> = [
  {
    key: 'today',
    label: 'Today',
    hint: 'Buy-Kit at the honest current run-rate (120 beds/yr).',
    inputs: { build_method: 'kits', beds_per_year: 120, location: 'sydney', containerise: false },
    sim: { startingContainers: 1, path: 'community' },
  },
  {
    key: 'first-container',
    label: 'First container',
    hint: 'One On-Country container at 500 beds/yr, community path.',
    inputs: { build_method: 'community', beds_per_year: 500, location: 'on_country', containerise: true },
    sim: { startingContainers: 1, path: 'community', bedsPerContainerYear: 500, containerCost: 125_000, siteOverheadPerYear: 24_000, horizonYears: 8 },
  },
  {
    key: 'seed-fleet',
    label: 'Seed fleet of 3 (best case)',
    hint: 'The QBE stack ($400K signed + $400K match) funds 3 containers up-front, then surplus compounds. Modelled.',
    inputs: { build_method: 'community', beds_per_year: 1500, location: 'on_country', containerise: true },
    sim: { startingContainers: 3, path: 'community', bedsPerContainerYear: 500, containerCost: 125_000, siteOverheadPerYear: 24_000, signedExternal: 400_000, horizonYears: 8 },
  },
];

const STORAGE_KEY = 'goods-cost-lab-v1';
const NOTES_KEY = 'goods-cost-lab-notes-v1'; // kept separate so Reset to canon never wipes notes

// ── Small controls ───────────────────────────────────────────────────────────

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</span>
      <span className="mt-1 flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-1.5">
        {prefix ? <span className="text-sm text-stone-400">{prefix}</span> : null}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-semibold text-stone-900 outline-none"
        />
        {suffix ? <span className="text-sm text-stone-400">{suffix}</span> : null}
      </span>
      {hint ? <span className="mt-0.5 block text-[11px] leading-4 text-stone-400">{hint}</span> : null}
    </label>
  );
}

function SectionHeading({
  icon: Icon,
  kicker,
  title,
  blurb,
}: {
  icon: typeof Atom;
  kicker: string;
  title: string;
  blurb: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0532B]">
        <Icon className="h-4 w-4" aria-hidden /> {kicker}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{blurb}</p>
    </div>
  );
}

function StatChip({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-stone-900">{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] leading-4 text-stone-500">{sub}</p> : null}
    </div>
  );
}

// ── The page ─────────────────────────────────────────────────────────────────

export function CostLabWorkspace() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [capexRows, setCapexRows] = useState<CapexRow[]>(CANON_CAPEX);
  const [sim, setSim] = useState<SimInputs>(CANON_SIM);
  const [nextRowId, setNextRowId] = useState(100);
  const [hydrated, setHydrated] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Hydrate from localStorage once on mount (SSR renders canon, client restores
  // saved edits; same one-shot pattern as portal/our-story).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          inputs?: Partial<Inputs>;
          capexRows?: CapexRow[];
          sim?: Partial<SimInputs>;
        };
        if (saved.inputs) setInputs({ ...DEFAULTS, ...saved.inputs });
        if (saved.capexRows?.length) setCapexRows(saved.capexRows);
        if (saved.sim) setSim({ ...CANON_SIM, ...saved.sim });
      }
      const savedNotes = window.localStorage.getItem(NOTES_KEY);
      if (savedNotes) setNotes(savedNotes);
    } catch {
      // Bad saved state: fall through to canon.
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, capexRows, sim }));
      window.localStorage.setItem(NOTES_KEY, notes);
    } catch {
      // Storage full or blocked: live state still works.
    }
  }, [inputs, capexRows, sim, notes, hydrated]);

  const model = useMemo(() => computeModel(inputs), [inputs]);

  const set = (patch: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...patch }));
  const setSimField = (patch: Partial<SimInputs>) => setSim((prev) => ({ ...prev, ...patch }));

  const resetAll = () => {
    setInputs(DEFAULTS);
    setCapexRows(CANON_CAPEX);
    setSim(CANON_SIM);
    setActiveScenario(null);
    // Notes are deliberately NOT cleared: workshop decisions outlive a model reset.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clear.
    }
  };

  const applyScenario = (key: string) => {
    const s = SCENARIOS.find((x) => x.key === key);
    if (!s) return;
    setInputs((prev) => ({ ...prev, ...s.inputs }));
    setSim((prev) => ({ ...prev, ...s.sim }));
    setActiveScenario(key);
  };

  // ── Container coster derived values ──
  const capexLow = capexRows.reduce((s, r) => s + (Number.isFinite(r.low) ? r.low : 0), 0);
  const capexHigh = capexRows.reduce((s, r) => s + (Number.isFinite(r.high) ? r.high : 0), 0);
  const netLow = Math.max(0, capexLow - ALREADY_INVESTED);
  const netHigh = Math.max(0, capexHigh - ALREADY_INVESTED);
  const capexMid = (capexLow + capexHigh) / 2;
  const paybackBedsMid = safeDiv(capexMid, LEGS_SAVING_PER_BED);
  const paybackYearsMid = safeDiv(paybackBedsMid, inputs.beds_per_year);

  // ── Compounding simulator ──
  const simContribution =
    sim.path === 'community' ? model.contributionCommunity : model.contributionFactory;
  const simRows = useMemo(() => {
    const rows: Array<{
      year: number;
      containers: number;
      beds: number;
      contribution: number;
      costs: number;
      surplus: number;
      bank: number;
      built: number;
    }> = [];
    let containers = Math.max(1, sim.startingContainers);
    let bank = 0;
    for (let year = 1; year <= sim.horizonYears; year++) {
      const beds = containers * sim.bedsPerContainerYear;
      const contribution = beds * simContribution;
      const costs = model.fixedBlock + containers * sim.siteOverheadPerYear;
      const surplus = contribution - costs;
      bank += surplus;
      let built = 0;
      while (bank >= sim.containerCost && containers + built < 12 && sim.containerCost > 0) {
        bank -= sim.containerCost;
        built += 1;
      }
      rows.push({ year, containers, beds, contribution, costs, surplus, bank, built });
      containers += built;
    }
    return rows;
  }, [sim, simContribution, model.fixedBlock]);

  const totalBeds = simRows.reduce((s, r) => s + r.beds, 0);
  const finalContainers = simRows.length ? simRows[simRows.length - 1].containers + simRows[simRows.length - 1].built : 1;
  const firstSelfFunded = simRows.find((r) => r.built > 0);
  const totalPlasticKg = totalBeds * inputs.hdpe_kg_per_bed;
  // Crew estimate: beds/yr per container ÷ (beds/day × ~220 working days) = crews needed, modelled.
  const crewPerContainer = safeDiv(sim.bedsPerContainerYear, inputs.community_beds_per_day * 220);

  // ── QBE match math ──
  const qbeMatch = Math.min(sim.signedExternal, MATCH_TARGET.cap);
  const stackTotal = sim.signedExternal + qbeMatch;

  // ── Per-container impact (the support-people numbers, modelled) ──
  const wagesPerContainer = sim.bedsPerContainerYear * inputs.community_labour_per_bed;
  const plasticPerContainer = sim.bedsPerContainerYear * inputs.hdpe_kg_per_bed;
  const surplusPerContainer = sim.bedsPerContainerYear * simContribution - sim.siteOverheadPerYear;

  // ── Workshop: copy a session summary for pasting into Notion ──
  const copySummary = async () => {
    const scenarioLabel = SCENARIOS.find((s) => s.key === activeScenario)?.label || 'Custom dials';
    const lines = [
      `Cost Lab session summary (${new Date().toLocaleDateString('en-AU')})`,
      `Scenario: ${scenarioLabel}`,
      '',
      `Price ${fmt(inputs.retail_price)} | Marginal: kit ${fmt(model.marginalKit)} / factory ${fmt(model.marginalFactory)} / community ${fmt(model.marginalCommunity)}`,
      `Contribution: kit ${fmt(model.contributionKit)} / factory ${fmt(model.contributionFactory)} / community ${fmt(model.contributionCommunity)}`,
      `Fixed block ${fmt(model.fixedBlock)}/yr | Break-even (selected path) ${fmtInt(model.breakevenSelected)} beds/yr`,
      `Container capex: gross ${fmt(capexLow)} to ${fmt(capexHigh)} | net of invested ${fmt(netLow)} to ${fmt(netHigh)} (modelled)`,
      `Compounding (${sim.path}, ${fmtInt(sim.bedsPerContainerYear)} beds/yr/container, container ${fmt(sim.containerCost)}): start ${sim.startingContainers}, ${firstSelfFunded ? `first self-funded container year ${firstSelfFunded.year}` : 'no self-funded container in horizon'}, ${fmtInt(finalContainers)} containers by year ${sim.horizonYears}, ${fmtInt(totalBeds)} cumulative beds`,
      `Per container per year (modelled): wages ${fmt(wagesPerContainer)}, plastic ${fmtInt(Math.round(plasticPerContainer))}kg, surplus ${fmt(surplusPerContainer)}`,
      `QBE stack: signed ${fmt(sim.signedExternal)} + match ${fmt(qbeMatch)} = ${fmt(stackTotal)} (match not secured until awarded)`,
      '',
      'Notes and decisions:',
      notes.trim() || '(none captured)',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: user can select the notes manually.
    }
  };

  // ── First-principles component rows ──
  const componentRows = [
    {
      component: 'HDPE legs',
      today: inputs.defy_kit_per_bed,
      inHouse: model.hdpeRawCost,
      floor: SHRED_FLOOR_PER_BED,
      floorNote: `Shred floor ${fmt(SHRED_FLOOR_PER_BED)} (20kg at $2/kg). Polymer floor ${fmt(POLYMER_FLOOR_PER_BED)}.`,
      partner: 'Defy (kit) / our press (in-house)',
    },
    {
      component: 'Steel poles',
      today: inputs.steel_per_bed,
      inHouse: inputs.steel_per_bed,
      floor: STEEL_RAW_FLOOR_PER_BED,
      floorNote: 'Raw steel at mill pricing.',
      partner: 'DNA Steel',
    },
    {
      component: 'Canvas',
      today: inputs.canvas_per_bed,
      inHouse: inputs.canvas_per_bed,
      floor: CANVAS_RAW_FLOOR_PER_BED,
      floorNote: 'Raw cloth before cut and sew.',
      partner: 'Centre Canvas',
    },
    {
      component: 'Hardware',
      today: inputs.hardware_per_bed,
      inHouse: inputs.hardware_per_bed,
      floor: inputs.hardware_per_bed,
      floorNote: 'Already near commodity floor.',
      partner: 'Coastal Fasteners',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF6F0] pb-24 text-stone-900">
      {/* ── Header ── */}
      <header className="border-b border-stone-200 bg-[#2B2A26] text-[#FDF8F3]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#BBA255]">
            Goods on Country · internal working room
          </p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">The Cost Lab</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#E6DFD1]">
            For Ben and Nic. Break every cost to its raw amount, price a container build, map the
            funding, and watch the compounding math. Every field is editable and recomputes through
            the same verified engine as the investor cockpit. Your edits stay in this browser.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-md border border-[#BBA255]/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#BBA255] transition hover:bg-[#BBA255]/10"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset to canon
            </button>
            <Link
              href="/sites/cost-lab/playbook"
              className="inline-flex items-center rounded-md bg-[#BBA255] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#2B2A26] transition hover:bg-[#d4bb6e]"
            >
              Open the playbook
            </Link>
            <Link
              href="/sites/qbe"
              className="text-xs text-[#E6DFD1] underline underline-offset-4 hover:text-white"
            >
              Investor workspace
            </Link>
            <Link
              href="/investors?skin=mc"
              className="text-xs text-[#E6DFD1] underline underline-offset-4 hover:text-white"
            >
              Cost cockpit
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => applyScenario(s.key)}
                title={s.hint}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                  activeScenario === s.key
                    ? 'border-[#BBA255] bg-[#BBA255] text-[#2B2A26]'
                    : 'border-white/20 bg-white/5 text-[#E6DFD1] hover:border-[#BBA255]/60'
                }`}
              >
                {s.label}
              </button>
            ))}
            <span className="self-center text-[11px] text-[#E6DFD1]/60">
              One click sets every dial. All scenarios are modelled, not forecasts.
            </span>
          </div>
        </div>
      </header>

      {/* ── 1. First principles ── */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Atom}
          kicker="Section 1"
          title="The bed, broken to raw amounts"
          blurb="First principles: what does each component cost today, what would it cost made in-house, and what is the raw-material floor underneath it? The gap between today and the floor is the whole investment story."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Controls */}
          <div className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Dial the raw inputs</p>
            <NumberField label="Sale price" prefix="$" value={inputs.retail_price} step={25} onChange={(n) => set({ retail_price: n })} />
            <NumberField label="Defy kit per bed" prefix="$" value={inputs.defy_kit_per_bed} step={5} onChange={(n) => set({ defy_kit_per_bed: n })} hint="Verified INV-1602 + INV-1732" />
            <NumberField label="HDPE kg per bed" suffix="kg" value={inputs.hdpe_kg_per_bed} onChange={(n) => set({ hdpe_kg_per_bed: n })} />
            <NumberField label="HDPE $/kg landed" prefix="$" value={inputs.hdpe_per_kg_landed} step={0.25} onChange={(n) => set({ hdpe_per_kg_landed: n })} hint="$2/kg shred + $0.75/kg delivery" />
            <NumberField label="Steel per bed" prefix="$" value={inputs.steel_per_bed} onChange={(n) => set({ steel_per_bed: n })} />
            <NumberField label="Canvas per bed" prefix="$" value={inputs.canvas_per_bed} onChange={(n) => set({ canvas_per_bed: n })} />
            <NumberField label="Hardware per bed" prefix="$" value={inputs.hardware_per_bed} step={0.25} onChange={(n) => set({ hardware_per_bed: n })} />
            <NumberField label="Crew day rate" prefix="$" value={inputs.labour_per_day} step={25} onChange={(n) => set({ labour_per_day: n })} />
            <NumberField label="Long-haul freight per bed" prefix="$" value={inputs.long_haul_freight_per_bed} step={10} onChange={(n) => set({ long_haul_freight_per_bed: n })} hint="Containerising cuts this by $70" />
          </div>

          {/* Component table + path outcomes */}
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <th className="px-3 py-2">Component</th>
                    <th className="px-3 py-2">Today</th>
                    <th className="px-3 py-2">In-house</th>
                    <th className="px-3 py-2">Raw floor</th>
                    <th className="px-3 py-2">Multiple over raw</th>
                    <th className="px-3 py-2">Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {componentRows.map((row) => {
                    const multiple = safeDiv(row.today, row.floor);
                    return (
                      <tr key={row.component} className="border-b border-stone-100 last:border-0">
                        <td className="px-3 py-2 font-medium">{row.component}</td>
                        <td className="px-3 py-2">{fmt(row.today)}</td>
                        <td className="px-3 py-2">{fmt(row.inHouse)}</td>
                        <td className="px-3 py-2" title={row.floorNote}>{fmt(row.floor)}</td>
                        <td className="px-3 py-2">
                          <span className={multiple >= 3 ? 'font-semibold text-[#A0532B]' : 'text-stone-700'}>
                            {multiple.toFixed(1)}x
                          </span>
                        </td>
                        <td className="px-3 py-2 text-stone-500">{row.partner}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="border-t border-stone-100 px-3 py-2 text-[11px] leading-4 text-stone-500">
                The 8x plus multiple on HDPE legs is the prize: a finished kit costs {fmt(inputs.defy_kit_per_bed)} while the
                shredded plastic inside it costs about {fmt(SHRED_FLOOR_PER_BED)}. Owning the press captures that gap,
                about {fmt(LEGS_SAVING_PER_BED)} per bed at the materials level.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatChip label="Buy-kit marginal" value={fmt(model.marginalKit)} sub={`Contribution ${fmt(model.contributionKit)} per bed. Break-even ${fmtInt(model.breakevenKit)} beds/yr`} />
              <StatChip label="Factory marginal" value={fmt(model.marginalFactory)} sub={`Contribution ${fmt(model.contributionFactory)} per bed. Break-even ${fmtInt(model.breakevenFactory)} beds/yr`} />
              <StatChip label="Community marginal" value={fmt(model.marginalCommunity)} sub={`Fair-wage labour, free plastic. Break-even ${fmtInt(model.breakevenCommunity)} beds/yr`} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Container coster ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Container}
          kicker="Section 2"
          title="What does one container build cost?"
          blurb="The line-item build sheet. Edit values, add rows as quotes land. Low and high bound the range until vendor quotes turn it into one number. Net subtracts what is already invested."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                  <th className="px-3 py-2">Line item</th>
                  <th className="px-3 py-2">Low</th>
                  <th className="px-3 py-2">High</th>
                  <th className="px-3 py-2">Note</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {capexRows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-3 py-1.5">
                      <input
                        value={row.label}
                        onChange={(e) =>
                          setCapexRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, label: e.target.value } : r)))
                        }
                        className="w-full rounded border border-transparent bg-transparent px-1 py-1 font-medium outline-none focus:border-stone-300"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="number"
                        value={row.low}
                        onChange={(e) =>
                          setCapexRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, low: Number(e.target.value) } : r)))
                        }
                        className="w-24 rounded border border-stone-200 px-1 py-1 outline-none focus:border-stone-400"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        type="number"
                        value={row.high}
                        onChange={(e) =>
                          setCapexRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, high: Number(e.target.value) } : r)))
                        }
                        className="w-24 rounded border border-stone-200 px-1 py-1 outline-none focus:border-stone-400"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      <input
                        value={row.note}
                        onChange={(e) =>
                          setCapexRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, note: e.target.value } : r)))
                        }
                        className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-stone-500 outline-none focus:border-stone-300"
                      />
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => setCapexRows((rows) => rows.filter((r) => r.id !== row.id))}
                        className="text-xs text-stone-400 hover:text-red-600"
                        aria-label={`Remove ${row.label}`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-stone-200 px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  setCapexRows((rows) => [...rows, { id: nextRowId, label: 'New line item', low: 0, high: 0, note: '' }]);
                  setNextRowId((n) => n + 1);
                }}
                className="text-xs font-semibold uppercase tracking-wide text-[#A0532B] hover:underline"
              >
                + Add line item
              </button>
              <p className="text-[11px] text-stone-400">
                Missing candidates: container shell and fit-out, electrical and safety, freight to site, installation, training.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <StatChip label="Gross build cost" value={`${fmt(capexLow)} to ${fmt(capexHigh)}`} sub="Sum of the line items" />
            <StatChip label="Already invested" value={fmt(ALREADY_INVESTED)} sub="Facility + tooling to date" />
            <StatChip label="Net remaining ask" value={`${fmt(netLow)} to ${fmt(netHigh)}`} sub="Gross minus already invested. Always say which basis you are quoting." />
            <StatChip
              label="Payback (mid-range)"
              value={`${fmtInt(Math.round(paybackBedsMid))} beds`}
              sub={`About ${paybackYearsMid.toFixed(1)} years at ${fmtInt(inputs.beds_per_year)} beds/yr, on the ${fmt(LEGS_SAVING_PER_BED)}/bed legs saving`}
            />
          </div>
        </div>
      </section>

      {/* ── 3. People and the fixed block ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Users}
          kicker="Section 3"
          title="People and the fixed block"
          blurb="The annual block that has to be funded regardless of volume: production leadership, facility, admin, field travel and rent. This is the honest split: people time is a real cost even when nobody invoices for it."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
            <NumberField label="Production lead days/yr" suffix="d" value={inputs.founder_days_production} step={5} onChange={(n) => set({ founder_days_production: n })} hint="The production share of founder time" />
            <NumberField label="Day rate" prefix="$" value={inputs.founder_rate_per_day} step={20} onChange={(n) => set({ founder_rate_per_day: n })} />
            <NumberField label="Facility (Kirmos) monthly" prefix="$" value={inputs.kirmos_monthly_50pct} step={100} onChange={(n) => set({ kirmos_monthly_50pct: n })} />
            <NumberField label="Admin per year" prefix="$" value={inputs.admin_per_year} step={1000} onChange={(n) => set({ admin_per_year: n })} />
            <NumberField label="Field travel per year" prefix="$" value={inputs.field_travel_per_year} step={5000} onChange={(n) => set({ field_travel_per_year: n })} />
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Location</span>
              <select
                value={inputs.location}
                onChange={(e) => set({ location: e.target.value as Inputs['location'] })}
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold"
              >
                {Object.entries(LOCATIONS).map(([key, loc]) => (
                  <option key={key} value={key}>
                    {loc.label} (rent {fmt(loc.rentPerYear)}/yr)
                  </option>
                ))}
              </select>
            </label>
            <NumberField label="Beds per year (volume)" value={inputs.beds_per_year} step={10} onChange={(n) => set({ beds_per_year: n })} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatChip label="Annual fixed block" value={fmt(model.fixedBlock)} sub="Production lead share + facility + admin + travel + rent" />
            <StatChip label="Fixed cost per bed at this volume" value={fmt(model.fixedPerBed)} sub={`At ${fmtInt(inputs.beds_per_year)} beds/yr. Falls as volume rises`} />
            <StatChip label="Break-even on the current path" value={`${fmtInt(model.breakevenSelected)} beds/yr`} sub="Fixed block divided by contribution per bed" />
            <StatChip
              label="Crew per container (modelled)"
              value={`${crewPerContainer.toFixed(1)} crews`}
              sub={`${fmtInt(sim.bedsPerContainerYear)} beds/yr at ${inputs.community_beds_per_day} beds/day, 220 days. Paid fair-wage work on Country`}
            />
          </div>
        </div>
      </section>

      {/* ── 4. Funding alignment ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Banknote}
          kicker="Section 4"
          title="Which capital pays for which block"
          blurb="Different money fits different blocks. Capex wants catalytic or recoverable capital. The fixed block until break-even wants grants. Inventory wants working capital that repays from orders. Lining these up is the whole raise."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#A0532B]">
              <Factory className="h-4 w-4" aria-hidden /> Production capex
            </p>
            <p className="mt-2 text-2xl font-semibold">{fmt(netLow)} to {fmt(netHigh)}</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              Net of {fmt(ALREADY_INVESTED)} invested. Fit: recoverable grant or catalytic capital with a
              transfer trigger to community ownership. This is the block QBE match dollars amplify.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#A0532B]">
              <Users className="h-4 w-4" aria-hidden /> Fixed block to break-even
            </p>
            <p className="mt-2 text-2xl font-semibold">{fmt(model.fixedBlock)}/yr</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              Fund 18 to 24 months (about {fmt(model.fixedBlock * 1.5)} to {fmt(model.fixedBlock * 2)}) while volume
              climbs to {fmtInt(model.breakevenFactory)} beds/yr. Fit: philanthropic grants. Should not carry repayment pressure.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#A0532B]">
              <Boxes className="h-4 w-4" aria-hidden /> Working capital
            </p>
            <p className="mt-2 text-2xl font-semibold">{fmt(model.selectedMarginal * 100)}</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              100 beds of inventory at the current marginal cost, so delivery never waits on a funded batch.
              Fit: patient debt (SEFA-style) repaid from confirmed orders.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-stone-200 bg-[#2B2A26] p-6 text-[#FDF8F3]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BBA255]">QBE Stage 2 match math</p>
          <div className="mt-4 grid items-end gap-4 sm:grid-cols-[280px_1fr]">
            <NumberField
              label="Signed match-eligible capital"
              prefix="$"
              value={sim.signedExternal}
              step={25_000}
              onChange={(n) => setSimField({ signedExternal: Math.max(0, n) })}
              hint="Legally binding commitments only. SIH verifies directly with the funder."
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#E6DFD1]/70">QBE match (up to $400K)</p>
                <p className="mt-1 text-xl font-semibold">{fmt(qbeMatch)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#E6DFD1]/70">Total stack</p>
                <p className="mt-1 text-xl font-semibold">{fmt(stackTotal)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#E6DFD1]/70">Leverage on signed dollars</p>
                <p className="mt-1 text-xl font-semibold">{safeDiv(stackTotal, sim.signedExternal, 0).toFixed(1)}x</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#E6DFD1]">
            Up to $400,000 from a $1M shared pool, at least matched by signed external capital, awarded at Steering
            Committee discretion. Application September 2026, outcomes November 2026. Repayable finance is prioritised,
            which suits recoverable-grant structures. Innovation framing: the capex block IS the innovation (mobile
            recycled-plastic manufacturing that transfers to community ownership), which opens innovation funds that
            plain bed-buying grants never reach.
          </p>
        </div>
      </section>

      {/* ── 5. Compounding growth ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={TrendingUp}
          kicker="Section 5"
          title="Compounding: containers pay for containers"
          blurb="The growth story is not linear sales, it is capacity that funds capacity. Each container's contribution accumulates, and when the bank covers the next build, capacity steps up. Change the assumptions and watch when container two arrives."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
            <NumberField label="Beds/yr per container" value={sim.bedsPerContainerYear} step={50} onChange={(n) => setSimField({ bedsPerContainerYear: Math.max(1, n) })} />
            <NumberField label="Cost per new container" prefix="$" value={sim.containerCost} step={5_000} onChange={(n) => setSimField({ containerCost: Math.max(0, n) })} hint={`Mid-range from the coster above: ${fmt(capexMid)}`} />
            <NumberField label="Site overhead per container/yr" prefix="$" value={sim.siteOverheadPerYear} step={1_000} onChange={(n) => setSimField({ siteOverheadPerYear: Math.max(0, n) })} />
            <NumberField label="Containers funded up-front" value={sim.startingContainers} onChange={(n) => setSimField({ startingContainers: Math.min(12, Math.max(1, Math.round(n))) })} hint="What the raise buys on day one. Seed fleet of 3 = the $800K best case" />
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Production path</span>
              <select
                value={sim.path}
                onChange={(e) => setSimField({ path: e.target.value as SimInputs['path'] })}
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold"
              >
                <option value="community">Community (contribution {fmt(model.contributionCommunity)}/bed)</option>
                <option value="factory">Factory (contribution {fmt(model.contributionFactory)}/bed)</option>
              </select>
            </label>
            <NumberField label="Horizon (years)" value={sim.horizonYears} onChange={(n) => setSimField({ horizonYears: Math.min(15, Math.max(1, Math.round(n))) })} />
            <button
              type="button"
              onClick={() => setSimField({ containerCost: Math.round(capexMid) })}
              className="text-xs font-semibold uppercase tracking-wide text-[#A0532B] hover:underline"
            >
              Use coster mid-range
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatChip
                label="First self-funded container"
                value={firstSelfFunded ? `Year ${firstSelfFunded.year}` : 'Not in horizon'}
                sub={firstSelfFunded ? 'Built from accumulated contribution, no new capital' : 'Raise contribution or lower the build cost'}
              />
              <StatChip label={`Containers by year ${sim.horizonYears}`} value={fmtInt(finalContainers)} sub={`Starting from ${sim.startingContainers} funded up-front`} />
              <StatChip label="Cumulative beds" value={fmtInt(totalBeds)} sub={`${fmtInt(Math.round(totalPlasticKg))}kg HDPE diverted (modelled)`} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatChip label="Fair wages per container/yr" value={fmt(wagesPerContainer)} sub={`${fmtInt(sim.bedsPerContainerYear)} beds at ${fmt(inputs.community_labour_per_bed)}/bed, inside the unit cost, not charity (modelled)`} />
              <StatChip label="Plastic per container/yr" value={`${fmtInt(Math.round(plasticPerContainer))}kg`} sub={`${inputs.hdpe_kg_per_bed}kg HDPE in every bed, collected on Country`} />
              <StatChip label="Surplus per container/yr" value={fmt(surplusPerContainer)} sub="After site overhead. On CATSI transfer this becomes community income (modelled)" />
            </div>

            <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <th className="px-3 py-2">Year</th>
                    <th className="px-3 py-2">Containers</th>
                    <th className="px-3 py-2">Beds</th>
                    <th className="px-3 py-2">Contribution</th>
                    <th className="px-3 py-2">Fixed + sites</th>
                    <th className="px-3 py-2">Surplus</th>
                    <th className="px-3 py-2">Bank</th>
                    <th className="px-3 py-2">New builds</th>
                  </tr>
                </thead>
                <tbody>
                  {simRows.map((r) => (
                    <tr key={r.year} className="border-b border-stone-100 last:border-0">
                      <td className="px-3 py-2 font-medium">{r.year}</td>
                      <td className="px-3 py-2">{r.containers}</td>
                      <td className="px-3 py-2">{fmtInt(r.beds)}</td>
                      <td className="px-3 py-2">{fmt(r.contribution)}</td>
                      <td className="px-3 py-2">{fmt(r.costs)}</td>
                      <td className={`px-3 py-2 ${r.surplus < 0 ? 'text-red-600' : 'text-emerald-700'}`}>{fmt(r.surplus)}</td>
                      <td className="px-3 py-2">{fmt(r.bank)}</td>
                      <td className="px-3 py-2">{r.built > 0 ? `+${r.built}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-stone-100 px-3 py-2 text-[11px] leading-4 text-stone-500">
                Modelled, not forecast: assumes every bed made is sold, one central fixed block, {fmt(sim.siteOverheadPerYear)}/yr
                overhead per site, and no price or cost drift. Capped at 12 containers.
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#A0532B]">
                <LineChart className="h-4 w-4" aria-hidden /> How to say it to an investor
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                <li>
                  &ldquo;Your capital buys the first container. The first container&rsquo;s margin buys the second.
                  After that, growth funds growth.&rdquo;
                </li>
                <li>
                  &ldquo;Each container is a unit of compounding: about {fmtInt(sim.bedsPerContainerYear)} beds a year,
                  about {fmt(simContribution)} of contribution per bed, and a build cost it can repay itself.&rdquo;
                </li>
                <li>
                  &ldquo;The asset transfers to community ownership, so what compounds is not just revenue: it is
                  community-owned productive capacity, paid local work and plastic kept out of Country.&rdquo;
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Partners and components ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Handshake}
          kicker="Section 6"
          title="Partners, components and what moves each number"
          blurb="Every line in the model has a partner behind it and one action that hardens the number. This is the alignment map: who we need, what they hold, and the next move."
        />

        <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-3 py-2">Component / block</th>
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Evidence today</th>
                <th className="px-3 py-2">The move that hardens it</th>
              </tr>
            </thead>
            <tbody>
              {[
                { c: 'HDPE leg kit', p: 'Defy', e: 'Invoices verified (INV-1602, INV-1731, INV-1732)', m: 'Volume quote at 500+/yr; decide kit vs press timeline' },
                { c: 'Steel poles', p: 'DNA Steel', e: 'Canonical pricing held', m: 'Re-quote at volume' },
                { c: 'Canvas', p: 'Centre Canvas', e: 'Three 2026 invoices verified', m: 'Volume pricing and lead-time commitment' },
                { c: 'Hardware', p: 'Coastal Fasteners', e: 'Verified per-bed pricing', m: 'None needed, near commodity floor' },
                { c: 'Press / shredder / CNC', p: 'Vendor TBD', e: 'Modelled ranges only', m: 'Three vendor quotes: the single biggest credibility upgrade' },
                { c: 'Community labour', p: 'Community partners (Oonchiumpa model)', e: 'Fair wage $130/bed, band $100 to $160 (modelled)', m: 'Agree the wage band with the first production community' },
                { c: 'Freight', p: 'Carriers', e: 'Model assumption, containerising saves about $70/bed', m: 'Lane quotes for the first On-Country site' },
                { c: 'Fixed block', p: 'Goods ops + accountant', e: 'Modelled at about $109.5K/yr', m: 'Standard Ledger sign-off (also needed for the QBE application)' },
                { c: 'Buyers', p: 'Centrecorp, NPY, Miwatj, WHSAC, Homeland Schools', e: 'One repeat buyer paid, rest in pipeline', m: 'Signed LOIs: they double as QBE match evidence' },
              ].map((row) => (
                <tr key={row.c} className="border-b border-stone-100 last:border-0 align-top">
                  <td className="px-3 py-2 font-medium">{row.c}</td>
                  <td className="px-3 py-2">{row.p}</td>
                  <td className="px-3 py-2 text-stone-500">{row.e}</td>
                  <td className="px-3 py-2 text-stone-700">{row.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[11px] leading-5 text-stone-400">
          All values flow from the locked 2026-05-29 engine defaults unless you edit them. Edits live in this browser
          only. Treat outputs as workpaper numbers, not audited accounts. For the investor-facing version of this story,
          use the investor workspace and the one-page Notion summary.
        </p>
      </section>

      {/* ── 7. Workshop mode ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Boxes}
          kicker="Section 7"
          title="Workshop mode: capture what you decide"
          blurb="Run a scenario, argue about it, then write the decision down here before you touch the next dial. Notes stay in this browser and survive Reset to canon. Copy the session summary takes the live numbers plus your notes to the clipboard, ready to paste into Notion."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
            placeholder={'Decisions, quotes to chase, dials we are betting on...\n\ne.g.\n- Get the hot press quote first (biggest range)\n- Bet on throughput before contribution\n- Ask SEFA about a 3-year container loan'}
            className="w-full rounded-lg border border-stone-300 bg-white p-4 text-sm leading-6 text-stone-900 outline-none focus:border-[#A0532B]"
          />
          <div className="space-y-3">
            <button
              type="button"
              onClick={copySummary}
              className="w-full rounded-md bg-[#2B2A26] px-4 py-2.5 text-sm font-semibold text-[#FDF8F3] transition hover:bg-[#3d3b35]"
            >
              {copied ? 'Copied to clipboard' : 'Copy session summary'}
            </button>
            <p className="text-[11px] leading-4 text-stone-500">
              The summary includes the active scenario, all three path economics, capex, the compounding result, the
              per-container impact numbers and your notes. Paste it into the Notion cost-model page or a message to
              each other.
            </p>
            <Link
              href="/sites/cost-lab/playbook"
              className="block text-center text-xs font-semibold uppercase tracking-wide text-[#A0532B] hover:underline"
            >
              Run a set play from the playbook
            </Link>
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-7xl px-4 pb-4 text-xs text-stone-400 sm:px-6 lg:px-8">
        Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation.
      </p>
    </main>
  );
}
