'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  Factory,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Banknote,
  Calculator,
  Users,
  Layers,
  Target,
  Gauge,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ScenarioInputs {
  // Demand & Production
  y1Units: number;
  y2Units: number;
  y3Units: number;
  capacityUtilisation: number; // 0-100%
  // Pricing
  avgPrice: number;
  priceGrowth: number; // annual %
  // Costs
  y1CostPerUnit: number;
  y3CostPerUnit: number; // linear interpolation
  annualOpex: number;
  opexGrowth: number; // annual %
  // Capital
  facilityCost: number;
  facilitiesY1: number;
  facilitiesY2: number;
  facilitiesY3: number;
  workingCapital: number;
  workforceTraining: number;
  techLogistics: number;
  impactMeasurement: number;
  // Funding secured
  grantsSecured: number;
  grantsPipeline: number;
  grantConversionRate: number; // %
  debtAmount: number;
  debtInterestRate: number; // %
  debtTermYears: number;
  // QBE specific
  qbeStage2Grant: number;
  qbeMatchRequired: number;
}

interface YearResult {
  year: number;
  label: string;
  units: number;
  revenue: number;
  cogs: number;
  grossMargin: number;
  grossMarginPct: number;
  opex: number;
  ebitda: number;
  debtService: number;
  netSurplus: number;
  cumCashflow: number;
  facilities: number;
  fte: number;
  plasticDiverted: number;
  communitiesServed: number;
}

// ─── Default Scenario (from PFI application) ────────────────────────────────

const DEFAULT: ScenarioInputs = {
  y1Units: 1500,
  y2Units: 3500,
  y3Units: 5000,
  capacityUtilisation: 70,
  avgPrice: 700,
  priceGrowth: 3,
  y1CostPerUnit: 520,
  y3CostPerUnit: 350,
  annualOpex: 600000,
  opexGrowth: 5,
  facilityCost: 600000,
  facilitiesY1: 1,
  facilitiesY2: 2,
  facilitiesY3: 3,
  workingCapital: 600000,
  workforceTraining: 400000,
  techLogistics: 250000,
  impactMeasurement: 150000,
  grantsSecured: 445000,
  grantsPipeline: 1200000, // Snow R4 $200K + QBE $200K + PFI $640K + REAL $200K
  grantConversionRate: 50,
  debtAmount: 500000, // SEFA
  debtInterestRate: 5,
  debtTermYears: 5,
  qbeStage2Grant: 250000,
  qbeMatchRequired: 400000,
};

// ─── Scenario Presets ───────────────────────────────────────────────────────

const SCENARIOS: Record<string, { label: string; desc: string; overrides: Partial<ScenarioInputs> }> = {
  base: { label: 'Base Case', desc: 'PFI application numbers, 70% utilisation', overrides: {} },
  conservative: {
    label: 'Conservative',
    desc: 'Lower demand, slower cost reduction, 50% grant conversion',
    overrides: { y1Units: 1000, y2Units: 2500, y3Units: 3500, capacityUtilisation: 60, y3CostPerUnit: 400, grantConversionRate: 35 },
  },
  optimistic: {
    label: 'Optimistic',
    desc: 'Full demand, faster cost reduction, 70% grant conversion',
    overrides: { y1Units: 2000, y2Units: 4500, y3Units: 6000, capacityUtilisation: 85, y3CostPerUnit: 320, grantConversionRate: 70, avgPrice: 750 },
  },
  debt_stress: {
    label: 'Debt Stress Test',
    desc: 'Hannah\'s "rainy day" — what if revenue is 60% of plan?',
    overrides: { y1Units: 900, y2Units: 2100, y3Units: 3000, capacityUtilisation: 55, grantConversionRate: 30 },
  },
};

// ─── Calculator ─────────────────────────────────────────────────────────────

function calculate(inputs: ScenarioInputs): YearResult[] {
  const results: YearResult[] = [];
  let cumCash = 0;

  // Initial capital outlay (Year 0 effectively — spread across Y1)
  const totalCapex = inputs.facilityCost * inputs.facilitiesY3
    + inputs.workingCapital + inputs.workforceTraining + inputs.techLogistics + inputs.impactMeasurement;

  // Capital available
  const grantsExpected = inputs.grantsSecured + (inputs.grantsPipeline * inputs.grantConversionRate / 100) + inputs.qbeStage2Grant;
  const totalCapital = grantsExpected + inputs.debtAmount;

  // Annual debt service (simple annuity)
  const annualDebtService = inputs.debtAmount > 0
    ? (inputs.debtAmount * (inputs.debtInterestRate / 100)) / (1 - Math.pow(1 + inputs.debtInterestRate / 100, -inputs.debtTermYears))
    : 0;

  // Starting cash = total capital - initial capex for Y1 facility
  cumCash = totalCapital - (inputs.facilityCost * inputs.facilitiesY1) - inputs.workingCapital * 0.5;

  for (let y = 1; y <= 5; y++) {
    const yearUnits = y === 1 ? inputs.y1Units :
                      y === 2 ? inputs.y2Units :
                      Math.min(inputs.y3Units * (1 + (y - 3) * 0.05), inputs.y3Units * 1.15);
    const effectiveUnits = Math.round(yearUnits * inputs.capacityUtilisation / 100);

    // Price grows annually
    const price = inputs.avgPrice * Math.pow(1 + inputs.priceGrowth / 100, y - 1);

    // Cost per unit interpolates Y1→Y3, then flat
    const costProgress = Math.min(1, (y - 1) / 2);
    const costPerUnit = inputs.y1CostPerUnit - (inputs.y1CostPerUnit - inputs.y3CostPerUnit) * costProgress;

    // Revenue & COGS
    const revenue = effectiveUnits * price;
    const cogs = effectiveUnits * costPerUnit;
    const grossMargin = revenue - cogs;

    // Opex grows annually
    const opex = inputs.annualOpex * Math.pow(1 + inputs.opexGrowth / 100, y - 1);

    // Facility capex in year (incremental)
    const facilities = y === 1 ? inputs.facilitiesY1 : y === 2 ? inputs.facilitiesY2 : y === 3 ? inputs.facilitiesY3 : inputs.facilitiesY3;
    const prevFacilities = y === 1 ? 0 : y === 2 ? inputs.facilitiesY1 : y === 3 ? inputs.facilitiesY2 : inputs.facilitiesY3;
    const newFacilities = Math.max(0, facilities - prevFacilities);
    const facilityCapex = newFacilities * inputs.facilityCost;

    // Other one-time costs spread: workforce + tech + impact in Y1-2
    const otherCapex = y <= 2
      ? (inputs.workforceTraining + inputs.techLogistics + inputs.impactMeasurement) / 2
      : 0;

    const ebitda = grossMargin - opex;
    const debtSvc = y <= inputs.debtTermYears ? annualDebtService : 0;
    const netSurplus = ebitda - debtSvc - facilityCapex - otherCapex;

    cumCash += netSurplus;

    results.push({
      year: y,
      label: `Year ${y} (${2025 + y})`,
      units: effectiveUnits,
      revenue,
      cogs,
      grossMargin,
      grossMarginPct: revenue > 0 ? (grossMargin / revenue) * 100 : 0,
      opex,
      ebitda,
      debtService: debtSvc,
      netSurplus,
      cumCashflow: cumCash,
      facilities,
      fte: Math.round(effectiveUnits * 10.75 / 1800), // 10.75 hrs/bed, 1800 hrs/FTE
      plasticDiverted: Math.round(effectiveUnits * 25 / 1000), // 25kg per bed, in tonnes
      communitiesServed: Math.min(Math.round(effectiveUnits / 100), 50),
    });
  }

  return results;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

function Slider({ label, value, onChange, min, max, step = 1, unit = '', helpText }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit?: string; helpText?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">{label}</label>
        <span className="text-xs font-bold text-slate-900">{unit === '$' ? fmt(value) : `${value}${unit}`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {helpText && <p className="text-xs text-slate-400">{helpText}</p>}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function FinanceModelPage() {
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT);
  const [activeScenario, setActiveScenario] = useState('base');
  const [showControls, setShowControls] = useState(false);

  const update = (partial: Partial<ScenarioInputs>) => {
    setInputs(prev => ({ ...prev, ...partial }));
    setActiveScenario('custom');
  };

  const applyScenario = (key: string) => {
    const scenario = SCENARIOS[key];
    setInputs({ ...DEFAULT, ...scenario.overrides });
    setActiveScenario(key);
  };

  const results = useMemo(() => calculate(inputs), [inputs]);

  // Derived metrics
  const totalCapex = inputs.facilityCost * inputs.facilitiesY3 + inputs.workingCapital + inputs.workforceTraining + inputs.techLogistics + inputs.impactMeasurement;
  const grantsExpected = inputs.grantsSecured + (inputs.grantsPipeline * inputs.grantConversionRate / 100) + inputs.qbeStage2Grant;
  const totalCapital = grantsExpected + inputs.debtAmount;
  const fundingGap = Math.max(0, totalCapex - totalCapital);
  const breakEvenYear = results.findIndex(r => r.cumCashflow > 0 && r.netSurplus > 0) + 1;
  const y3Result = results[2];
  const y5Result = results[4];

  // QBE multiplier
  const externalCapital = totalCapital - inputs.qbeStage2Grant;
  const qbeMultiplier = inputs.qbeStage2Grant > 0 ? externalCapital / inputs.qbeStage2Grant : 0;

  // Debt serviceability
  const annualDebtService = inputs.debtAmount > 0
    ? (inputs.debtAmount * (inputs.debtInterestRate / 100)) / (1 - Math.pow(1 + inputs.debtInterestRate / 100, -inputs.debtTermYears))
    : 0;
  const debtCoverageY3 = y3Result && annualDebtService > 0 ? y3Result.ebitda / annualDebtService : Infinity;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Finance Engine</h1>
          <Badge className={`text-xs ${activeScenario === 'custom' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
            {activeScenario === 'custom' ? 'Custom' : SCENARIOS[activeScenario]?.label}
          </Badge>
        </div>
        <p className="text-slate-500">
          Live P&L model with scenario toggles. Built for SEFA, IBA, QBE, and PFI conversations.
        </p>
      </div>

      {/* Scenario Presets */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => applyScenario(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeScenario === key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setShowControls(!showControls)}
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          {showControls ? 'Hide Controls' : 'Adjust Inputs'}
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-3">
            <div className="text-xs text-emerald-600 font-medium">Y3 Revenue</div>
            <div className="text-xl font-bold text-emerald-800">{fmt(y3Result?.revenue || 0)}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="text-xs text-blue-600 font-medium">Y3 Gross Margin</div>
            <div className="text-xl font-bold text-blue-800">{Math.round(y3Result?.grossMarginPct || 0)}%</div>
          </CardContent>
        </Card>
        <Card className={`border-${breakEvenYear <= 2 ? 'emerald' : breakEvenYear <= 3 ? 'amber' : 'red'}-200 bg-${breakEvenYear <= 2 ? 'emerald' : breakEvenYear <= 3 ? 'amber' : 'red'}-50`}>
          <CardContent className="p-3">
            <div className="text-xs font-medium" style={{ color: breakEvenYear <= 2 ? '#059669' : breakEvenYear <= 3 ? '#d97706' : '#dc2626' }}>Break-even</div>
            <div className="text-xl font-bold" style={{ color: breakEvenYear <= 2 ? '#065f46' : breakEvenYear <= 3 ? '#92400e' : '#991b1b' }}>Year {breakEvenYear || 'N/A'}</div>
          </CardContent>
        </Card>
        <Card className={`border-${debtCoverageY3 >= 1.5 ? 'emerald' : debtCoverageY3 >= 1 ? 'amber' : 'red'}-200 bg-${debtCoverageY3 >= 1.5 ? 'emerald' : debtCoverageY3 >= 1 ? 'amber' : 'red'}-50`}>
          <CardContent className="p-3">
            <div className="text-xs font-medium" style={{ color: debtCoverageY3 >= 1.5 ? '#059669' : debtCoverageY3 >= 1 ? '#d97706' : '#dc2626' }}>Debt Coverage (Y3)</div>
            <div className="text-xl font-bold" style={{ color: debtCoverageY3 >= 1.5 ? '#065f46' : debtCoverageY3 >= 1 ? '#92400e' : '#991b1b' }}>
              {debtCoverageY3 === Infinity ? 'No debt' : `${debtCoverageY3.toFixed(1)}x`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-3">
            <div className="text-xs text-purple-600 font-medium">QBE Multiplier</div>
            <div className="text-xl font-bold text-purple-800">{qbeMultiplier.toFixed(1)}x</div>
          </CardContent>
        </Card>
        <Card className={`border-${fundingGap === 0 ? 'emerald' : 'red'}-200 bg-${fundingGap === 0 ? 'emerald' : 'red'}-50`}>
          <CardContent className="p-3">
            <div className="text-xs font-medium" style={{ color: fundingGap === 0 ? '#059669' : '#dc2626' }}>Funding Gap</div>
            <div className="text-xl font-bold" style={{ color: fundingGap === 0 ? '#065f46' : '#991b1b' }}>{fundingGap === 0 ? 'Covered' : fmt(fundingGap)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Scenario Controls</CardTitle>
            <CardDescription>Drag sliders to stress-test. Hannah (SEFA) says: &ldquo;Show me the rainy days.&rdquo;</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demand & Pricing</h4>
                <Slider label="Y1 Units" value={inputs.y1Units} onChange={v => update({ y1Units: v })} min={500} max={3000} step={100} unit="" />
                <Slider label="Y2 Units" value={inputs.y2Units} onChange={v => update({ y2Units: v })} min={1000} max={6000} step={100} unit="" />
                <Slider label="Y3 Units" value={inputs.y3Units} onChange={v => update({ y3Units: v })} min={2000} max={8000} step={100} unit="" />
                <Slider label="Capacity Utilisation" value={inputs.capacityUtilisation} onChange={v => update({ capacityUtilisation: v })} min={40} max={95} unit="%" />
                <Slider label="Avg Price" value={inputs.avgPrice} onChange={v => update({ avgPrice: v })} min={500} max={1000} step={10} unit="$" />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Costs</h4>
                <Slider label="Y1 Cost/Unit" value={inputs.y1CostPerUnit} onChange={v => update({ y1CostPerUnit: v })} min={350} max={700} step={10} unit="$" />
                <Slider label="Y3 Cost/Unit (target)" value={inputs.y3CostPerUnit} onChange={v => update({ y3CostPerUnit: v })} min={250} max={550} step={10} unit="$" />
                <Slider label="Annual Opex" value={inputs.annualOpex} onChange={v => update({ annualOpex: v })} min={300000} max={1000000} step={50000} unit="$" />
                <Slider label="Facility Cost (each)" value={inputs.facilityCost} onChange={v => update({ facilityCost: v })} min={400000} max={800000} step={50000} unit="$" />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capital & Funding</h4>
                <Slider label="Grants Pipeline" value={inputs.grantsPipeline} onChange={v => update({ grantsPipeline: v })} min={0} max={2000000} step={50000} unit="$" helpText="Snow R4 + QBE + PFI + REAL" />
                <Slider label="Grant Conversion %" value={inputs.grantConversionRate} onChange={v => update({ grantConversionRate: v })} min={20} max={80} unit="%" helpText="How much of pipeline converts" />
                <Slider label="QBE Stage 2 Grant" value={inputs.qbeStage2Grant} onChange={v => update({ qbeStage2Grant: v })} min={0} max={400000} step={25000} unit="$" />
                <Slider label="SEFA Debt" value={inputs.debtAmount} onChange={v => update({ debtAmount: v })} min={0} max={1000000} step={50000} unit="$" />
                <Slider label="Debt Interest Rate" value={inputs.debtInterestRate} onChange={v => update({ debtInterestRate: v })} min={2} max={10} step={0.5} unit="%" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* P&L Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Profit & Loss (5 Year)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-500 text-xs uppercase">Metric</th>
                  {results.map(r => (
                    <th key={r.year} className="text-right py-2 px-2 font-semibold text-slate-700 text-xs">{r.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Units Produced', key: 'units', format: (v: number) => v.toLocaleString() },
                  { label: 'Revenue', key: 'revenue', format: fmt, bold: true },
                  { label: 'COGS', key: 'cogs', format: (v: number) => `(${fmt(v)})` },
                  { label: 'Gross Margin', key: 'grossMargin', format: fmt, bold: true, highlight: true },
                  { label: 'Gross Margin %', key: 'grossMarginPct', format: (v: number) => `${v.toFixed(0)}%` },
                  { label: 'Operating Expenses', key: 'opex', format: (v: number) => `(${fmt(v)})` },
                  { label: 'EBITDA', key: 'ebitda', format: fmt, bold: true },
                  { label: 'Debt Service', key: 'debtService', format: (v: number) => v > 0 ? `(${fmt(v)})` : '-' },
                  { label: 'Net Surplus / (Deficit)', key: 'netSurplus', format: fmt, bold: true, highlight: true },
                  { label: 'Cumulative Cashflow', key: 'cumCashflow', format: fmt, bold: true },
                  { label: '', key: '' as keyof YearResult, format: () => '', isSpacer: true },
                  { label: 'Facilities Active', key: 'facilities', format: (v: number) => String(v) },
                  { label: 'FTE Jobs', key: 'fte', format: (v: number) => String(v) },
                  { label: 'Plastic Diverted (t)', key: 'plasticDiverted', format: (v: number) => `${v}t` },
                  { label: 'Communities Served', key: 'communitiesServed', format: (v: number) => String(v) },
                ].map((row, i) => {
                  if ((row as { isSpacer?: boolean }).isSpacer) return <tr key={i} className="h-2" />;
                  return (
                    <tr key={i} className={`border-b border-slate-100 ${row.highlight ? 'bg-blue-50' : ''}`}>
                      <td className={`py-1.5 pr-4 text-slate-700 ${row.bold ? 'font-semibold' : ''}`}>{row.label}</td>
                      {results.map(r => {
                        const val = r[row.key as keyof YearResult] as number;
                        const isNeg = row.key === 'netSurplus' && val < 0;
                        const isPos = row.key === 'netSurplus' && val > 0;
                        return (
                          <td key={r.year} className={`py-1.5 px-2 text-right ${row.bold ? 'font-semibold' : ''} ${isNeg ? 'text-red-600' : isPos ? 'text-emerald-600' : ''}`}>
                            {row.format(val)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cashflow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-blue-600" />
            Cashflow Trajectory
          </CardTitle>
          <CardDescription>Shows when you need cash and when revenue catches up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {results.map(r => {
              const maxCash = Math.max(...results.map(x => Math.abs(x.cumCashflow)), 1);
              const barWidth = Math.abs(r.cumCashflow) / maxCash * 100;
              const isPositive = r.cumCashflow >= 0;
              return (
                <div key={r.year} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-slate-500 text-right shrink-0">{r.label}</div>
                  <div className="flex-1 flex items-center">
                    {!isPositive && (
                      <div className="flex-1 flex justify-end">
                        <div className="h-6 bg-red-400 rounded-l" style={{ width: `${barWidth}%`, minWidth: '2px' }} />
                      </div>
                    )}
                    <div className="w-px h-8 bg-slate-400 shrink-0" />
                    {isPositive && (
                      <div className="flex-1">
                        <div className="h-6 bg-emerald-500 rounded-r" style={{ width: `${barWidth}%`, minWidth: '2px' }} />
                      </div>
                    )}
                    {!isPositive && <div className="flex-1" />}
                    {isPositive && <div className="flex-1" />}
                  </div>
                  <div className={`w-20 text-xs font-bold text-right ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {fmt(r.cumCashflow)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Capital Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Capital Stack Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sources */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sources of Capital</h4>
              <div className="space-y-2">
                {[
                  { label: 'Grants Secured', amount: inputs.grantsSecured, color: 'bg-emerald-500' },
                  { label: `Pipeline @ ${inputs.grantConversionRate}%`, amount: inputs.grantsPipeline * inputs.grantConversionRate / 100, color: 'bg-emerald-300' },
                  { label: 'QBE Stage 2', amount: inputs.qbeStage2Grant, color: 'bg-amber-500' },
                  { label: 'SEFA Debt', amount: inputs.debtAmount, color: 'bg-blue-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${s.color}`} />
                    <span className="text-sm text-slate-700 flex-1">{s.label}</span>
                    <span className="text-sm font-bold">{fmt(s.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Total Capital</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(totalCapital)}</span>
                </div>
              </div>
            </div>

            {/* Uses */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Uses of Capital</h4>
              <div className="space-y-2">
                {[
                  { label: `Manufacturing (${inputs.facilitiesY3} facilities)`, amount: inputs.facilityCost * inputs.facilitiesY3 },
                  { label: 'Working Capital', amount: inputs.workingCapital },
                  { label: 'Workforce Training', amount: inputs.workforceTraining },
                  { label: 'Tech & Logistics', amount: inputs.techLogistics },
                  { label: 'Impact Measurement', amount: inputs.impactMeasurement },
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{u.label}</span>
                    <span className="text-sm font-bold">{fmt(u.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Total Capex</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(totalCapex)}</span>
                </div>
                <div className={`p-2 rounded-lg ${fundingGap > 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${fundingGap > 0 ? 'text-red-800' : 'text-emerald-800'}`}>
                      {fundingGap > 0 ? 'Funding Gap' : 'Surplus'}
                    </span>
                    <span className={`text-sm font-bold ${fundingGap > 0 ? 'text-red-800' : 'text-emerald-800'}`}>
                      {fundingGap > 0 ? fmt(fundingGap) : fmt(totalCapital - totalCapex)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEFA Debt Serviceability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            Debt Serviceability (for SEFA conversation)
          </CardTitle>
          <CardDescription>Hannah: &ldquo;All debt does is bring future cash flow forward. If you know revenue will come, debt fits.&rdquo;</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Loan Amount</div>
                <div className="text-xl font-bold">{fmt(inputs.debtAmount)}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Interest Rate</div>
                <div className="text-xl font-bold">{inputs.debtInterestRate}% p.a.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Term</div>
                <div className="text-xl font-bold">{inputs.debtTermYears} years</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Annual Repayment</div>
                <div className="text-xl font-bold">{fmt(annualDebtService)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase">DSCR (Debt Service Coverage Ratio)</h4>
              <p className="text-xs text-slate-500">Lenders want DSCR &gt; 1.25x. Above 1.5x is comfortable.</p>
              {results.slice(0, inputs.debtTermYears).map(r => {
                const dscr = annualDebtService > 0 ? r.ebitda / annualDebtService : Infinity;
                const color = dscr >= 1.5 ? 'emerald' : dscr >= 1.25 ? 'amber' : dscr >= 1 ? 'orange' : 'red';
                return (
                  <div key={r.year} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-16">{r.label.split(' ')[0]} {r.label.split(' ')[1]}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${Math.min(100, (dscr / 3) * 100)}%` }} />
                    </div>
                    <span className={`text-xs font-bold text-${color}-600 w-12 text-right`}>
                      {dscr === Infinity ? '-' : `${dscr.toFixed(1)}x`}
                    </span>
                    {dscr >= 1.25 ? (
                      <CheckCircle2 className={`h-4 w-4 text-${color}-600`} />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 text-${color}-600`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QBE Multiplier Story */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            QBE Multiplier Story (Stage 2 Pitch)
          </CardTitle>
          <CardDescription>Clause 6.4: Every QBE dollar should unlock multiple dollars from elsewhere</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg flex-1">
              <div className="text-xs text-amber-600">QBE Investment</div>
              <div className="text-2xl font-bold text-amber-800">{fmt(inputs.qbeStage2Grant)}</div>
            </div>
            <ArrowRight className="h-6 w-6 text-slate-400" />
            <div className="text-center p-4 bg-emerald-50 rounded-lg flex-1">
              <div className="text-xs text-emerald-600">Total Capital Unlocked</div>
              <div className="text-2xl font-bold text-emerald-800">{fmt(totalCapital)}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600">Multiplier</div>
              <div className="text-2xl font-bold text-purple-800">{qbeMultiplier.toFixed(1)}x</div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>The pitch:</strong> &ldquo;{fmt(inputs.qbeStage2Grant)} from QBE unlocks {fmt(externalCapital)} from SEFA, IBA, Snow, and PFI.
              That&apos;s a {qbeMultiplier.toFixed(1)}x multiplier. By Year 3, this creates {y3Result?.fte || 0} jobs,
              serves {y3Result?.communitiesServed || 0} communities, diverts {y3Result?.plasticDiverted || 0} tonnes of plastic,
              and generates {fmt(y3Result?.revenue || 0)} in trade revenue.&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5-Year Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            5-Year Impact at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Cumulative Revenue', value: fmt(results.reduce((s, r) => s + r.revenue, 0)), color: 'emerald' },
              { label: 'Beds Produced', value: results.reduce((s, r) => s + r.units, 0).toLocaleString(), color: 'blue' },
              { label: 'Peak FTE Jobs', value: String(y5Result?.fte || 0), color: 'purple' },
              { label: 'Plastic Diverted', value: `${results.reduce((s, r) => s + r.plasticDiverted, 0)}t`, color: 'green' },
              { label: 'Communities', value: String(y5Result?.communitiesServed || 0), color: 'amber' },
            ].map((item, i) => (
              <div key={i} className={`text-center p-3 bg-${item.color}-50 rounded-lg`}>
                <div className={`text-xl font-bold text-${item.color}-800`}>{item.value}</div>
                <div className={`text-xs text-${item.color}-600`}>{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-slate-400 border-t border-slate-200 pt-4">
        Base case from PFI Stage 1 EOI (March 2026). Model assumptions: 10.75 hrs/bed, 1,800 hrs/FTE, 25kg plastic/bed.
        Debt service uses simple annuity calculation. Capital stack assumes grants spread across Y1-Y2.
      </div>
    </div>
  );
}
