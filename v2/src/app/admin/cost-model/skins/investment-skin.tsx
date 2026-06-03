'use client';
/**
 * INVESTMENT-LAYER skin (v6.1) — ACT brokerage slider + a "where every $801 goes" bar split
 * + debt-service coverage + the three load-bearing findings.
 *
 * Makes the §9 investment brief PLAYABLE: drag the act_brokerage dial and watch the amber
 * ACT/debt-service slice trade against the green community co-op margin, scaled against the
 * $801 institutional sale. Compact, dense, single-screen — same horizontal-bar pattern as the
 * Mission Control cockpit. Numbers LOCKED in cost-model-scenarios.json.
 */
import { useState } from 'react';
import { fmt, fmtCents } from '@/lib/cost-model/engine';
import scenarios from '@/lib/data/cost-model-scenarios.json';

const POS = '#34d399';
const NEG = '#f87171';
const AMBER = '#fbbf24';

const W = scenarios.margin_waterfall;
const D = scenarios.debt_service;
const J = scenarios.sensitivity_v6.joint_downside;

const SALE = Number(W.sale_price); // 801
const COGS = Number(W.cogs_community); // 270.74
const FREIGHT = Number(W.freight); // 100
const BUFFER = Number(W.cashflow_buffer); // 30
const LANDED = SALE - COGS - FREIGHT; // 430.26
const FAIR_WAGE = 130;
const BEDS = Number(D.revenue_beds_per_year); // 480
const FLOOR = Number(D.brokerage_floor_per_bed); // 100
const SERVICE_500K = Number(D.debt_high) * (Number(D.interest_rate_high_pct) / 100); // 35,000
const SERVICE_250K = Number(D.debt_low) * (Number(D.interest_rate_low_pct) / 100); // 12,500

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{children}</span>;
}

function Stat({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <div className="bg-[#0A0A0B] p-3">
      <Label>{label}</Label>
      <p className="mt-1 text-2xl font-semibold tabular-nums leading-none" style={{ color }}>{value}</p>
      <p className="mt-1 text-[9px] text-zinc-600">{sub}</p>
    </div>
  );
}

/** One line of the $801 split: label + value on top, a bar scaled to the $801 sale below. */
function FlowBar({ label, value, valueColor, widthPct, barColor, emphasis }: {
  label: string; value: string; valueColor: string; widthPct: number; barColor: string; emphasis?: boolean;
}) {
  return (
    <div className={`flex flex-col justify-center gap-1.5 rounded px-2 py-1 ${emphasis ? 'bg-white/[0.03] ring-1 ring-white/10' : ''}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.08em] text-zinc-300">{label}</span>
        <span className="tabular-nums text-[12px] font-semibold" style={{ color: valueColor }}>{value}</span>
      </div>
      <div className="h-5 w-full overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-inset ring-zinc-800">
        <div className="h-full rounded-sm transition-all duration-150" style={{ width: `${Math.max(0, Math.min(100, widthPct))}%`, background: barColor }} />
      </div>
    </div>
  );
}

export function InvestmentSkin() {
  const [brokerage, setBrokerage] = useState(Number(W.act_brokerage_default)); // 200
  const coop = LANDED - brokerage - BUFFER; // community co-op margin / bed
  const coopPos = coop >= 0;
  const totalBenefit = FAIR_WAGE + coop;
  const annualBrokerage = brokerage * BEDS;
  const cover500 = annualBrokerage / SERVICE_500K;
  const cover250 = annualBrokerage / SERVICE_250K;
  const under500 = cover500 < 1;
  const belowFloor = brokerage < FLOOR;
  const p = (v: number) => (v / SALE) * 100;

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-zinc-800 bg-[#0A0A0B] p-4 text-zinc-200 font-mono selection:bg-cyan-500/30">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">MODEL</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">INVESTMENT LAYER · ${SALE} INSTITUTIONAL SALE → COMMUNITY CO-OP</span>
        </div>
        <button onClick={() => setBrokerage(Number(W.act_brokerage_default))} className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-cyan-300">
          RESET → ${W.act_brokerage_default}
        </button>
      </div>

      {/* ── TOP: brokerage dial + headline readouts ── */}
      <div className="grid shrink-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="border border-zinc-800 p-3">
          <div className="flex items-baseline justify-between">
            <Label>ACT BROKERAGE · $/BED</Label>
            <span className="text-3xl font-semibold tabular-nums leading-none" style={{ color: AMBER }}>{fmt(brokerage)}</span>
          </div>
          <input
            type="range" min={Number(W.act_brokerage_min)} max={Number(W.act_brokerage_max)} step={5} value={brokerage}
            onChange={(e) => setBrokerage(parseFloat(e.target.value))}
            className="cm-key mt-2.5 w-full" style={{ accentColor: AMBER }}
          />
          <div className="mt-1 flex justify-between text-[9px] text-zinc-600">
            <span>${W.act_brokerage_min}</span>
            <span className={belowFloor ? 'text-red-400' : 'text-zinc-500'}>floor ~${FLOOR}</span>
            <span>${W.act_brokerage_max}</span>
          </div>
          <p className="mt-1.5 text-[9px] text-zinc-600">{fmt(annualBrokerage)}/yr pool · {BEDS} revenue beds</p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
          <Stat label="CO-OP MARGIN /BED" value={fmtCents(coop)} color={coopPos ? POS : NEG} sub="AFTER BROKERAGE + BUFFER" />
          <Stat label="STAYS IN COMMUNITY" value={fmtCents(totalBenefit)} color={coopPos ? POS : NEG} sub={`$${FAIR_WAGE} WAGE + CO-OP MARGIN`} />
          <Stat label="ACT / BED" value={fmtCents(brokerage)} color={AMBER} sub="→ DEBT SERVICE" />
          <Stat label="LANDED MARGIN" value={fmtCents(LANDED)} color="#e4e4e7" sub={`$${SALE} − COGS − FREIGHT`} />
        </div>
      </div>

      {/* ── MIDDLE: where every $801 goes (horizontal bars, scaled to the sale) ── */}
      <div className="flex min-h-0 flex-1 flex-col border border-zinc-800">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2">
          <Label>WHERE EVERY ${SALE} GOES · DRAG BROKERAGE TO RE-SPLIT</Label>
          <span className="text-[10px] text-zinc-600"><span style={{ color: AMBER }}>amber</span> = ACT debt service · <span style={{ color: POS }}>green</span> = community keeps</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4 py-3">
          <FlowBar label={`Sale price · institutional`} value={fmt(SALE)} valueColor="#67e8f9" widthPct={100} barColor="#0e7490" />
          <FlowBar label="− COGS (community)" value={`−${fmt(COGS)}`} valueColor="#d4d4d8" widthPct={p(COGS)} barColor="#52525b" />
          <FlowBar label="− Freight" value={`−${fmt(FREIGHT)}`} valueColor="#d4d4d8" widthPct={p(FREIGHT)} barColor="#3f3f46" />
          <FlowBar label="− ACT brokerage → debt service" value={`−${fmt(brokerage)}`} valueColor={AMBER} widthPct={p(brokerage)} barColor={AMBER} emphasis />
          <FlowBar label="− Cashflow buffer" value={`−${fmt(BUFFER)}`} valueColor="#d4d4d8" widthPct={p(BUFFER)} barColor="#6b7280" />
          <FlowBar label="= Community co-op margin (keeps)" value={fmtCents(coop)} valueColor={coopPos ? POS : NEG} widthPct={p(Math.max(0, coop))} barColor={POS} emphasis />
        </div>
        <div className="shrink-0 border-t border-zinc-800 px-3 py-1.5 text-[10px] leading-snug text-zinc-600">
          The ${FAIR_WAGE} fair wage sits INSIDE COGS — the green co-op margin is ON TOP of dignified paid work.{!coopPos && <span className="text-red-400"> ⚠ At {fmt(brokerage)}/bed the community is underwater ({fmtCents(coop)}) — brokerage must flex down.</span>}
        </div>
      </div>

      {/* ── BOTTOM: debt coverage + the three findings ── */}
      <div className="grid shrink-0 grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="border border-zinc-800 p-3">
          <Label>DEBT SERVICE · COVERAGE</Label>
          <div className="mt-2 flex items-baseline gap-5">
            <div>
              <span className="block text-[9px] text-zinc-500">$250K @ {D.interest_rate_low_pct}%</span>
              <span className="text-xl tabular-nums" style={{ color: cover250 >= 1 ? POS : NEG }}>{cover250.toFixed(1)}×</span>
            </div>
            <div>
              <span className="block text-[9px] text-zinc-500">$500K @ {D.interest_rate_high_pct}%</span>
              <span className="text-xl tabular-nums" style={{ color: under500 ? NEG : POS }}>{cover500.toFixed(1)}×</span>
            </div>
          </div>
          <p className={`mt-1.5 text-[9px] ${under500 ? 'text-red-400' : 'text-zinc-600'}`}>
            {under500 ? `⚠ under-covers $500K — floor ~$${FLOOR}/bed` : `${fmt(annualBrokerage)}/yr services both tranches`}
          </p>
        </div>
        <div className="border border-zinc-800 p-3">
          <Label>1 · DEFY-DECOUPLED</Label>
          <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-400">
            The Defy HDPE kit price has <span className="text-cyan-300">zero effect</span> on community COGS — free community-collected plastic decouples it.
          </p>
        </div>
        <div className="border border-zinc-800 p-3">
          <Label>2 · ${FLOOR}/BED FLOOR</Label>
          <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-400">
            The full <span className="text-zinc-200">$500K</span> tranche needs <span style={{ color: AMBER }}>≥~${FLOOR}/bed</span> brokerage. Thin ${D.thin_brokerage_per_bed}/bed under-covers it.
          </p>
        </div>
        <div className="border border-amber-500/40 bg-amber-500/[0.06] p-3">
          <Label>3 · JOINT DOWNSIDE ⚠</Label>
          <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-400">
            Vol −20% · price −20% · labour +20% → co-op margin collapses to <span style={{ color: NEG }}>{fmt(J.community_coop_margin_per_bed)}/bed</span>. Brokerage <span style={{ color: AMBER }}>must flex to ~{fmt(J.brokerage_flex_floor_per_bed)}</span> or it crushes the community.
          </p>
        </div>
      </div>
    </div>
  );
}
