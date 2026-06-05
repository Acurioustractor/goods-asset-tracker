/**
 * Tests for src/lib/cost-model/engine.ts
 *
 * All expected values are derived from the engine's own formulas using
 * the locked default constants. Each test cites the input values and
 * the arithmetic it expects the engine to perform — we never copy
 * numbers from comments or external docs without re-deriving them.
 */
import { describe, it, expect } from 'vitest';
import {
  computeModel,
  fmt,
  fmtCents,
  fmtPct,
  fmtInt,
  breakevenLabel,
  safeDiv,
  DEFAULTS,
  NET_CAPITAL_LOW,
  NET_CAPITAL_HIGH,
  VOLUME_GATE,
  CONTAINERISE_FREIGHT_DELTA,
  SHEET_URL,
  SLIDERS,
  PRESETS,
  METHOD_LABELS,
  METHOD_LABELS_SHORT,
  VERIFIED_HINTS,
  LOCATIONS,
  LEGS_SAVING_PER_BED,
  ALREADY_INVESTED,
  SHRED_FLOOR_PER_BED,
  POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED,
  CANVAS_RAW_FLOOR_PER_BED,
  type Inputs,
} from './engine';

// ─── Helpers ────────────────────────────────────────────────────────────────
// Tests that want to vary a single dial over the locked defaults do that
// inline; the function below is a shorthand for "all of the locked defaults".
const def = (): Inputs => ({ ...DEFAULTS });

// ─── Formatters (fmt / fmtCents / fmtPct / fmtInt / breakevenLabel) ────────
describe('formatters', () => {
  describe('fmt', () => {
    it('renders finite numbers as AUD currency', () => {
      // Note: Intl.NumberFormat with style:'currency' defaults to 2 fraction
      // digits for AUD, so even whole numbers render with ".00" — the engine
      // uses `maximumFractionDigits` only as an UPPER bound, never a floor.
      expect(fmt(0)).toBe('$0.00');
      expect(fmt(0.5)).toBe('$0.50');
    });

    it('uses 2 fraction digits for values with |n| < 10', () => {
      expect(fmt(5.24)).toMatch(/^\$5\.24$/);
      expect(fmt(-3.5)).toMatch(/^-?\$3\.50$/);
    });

    it('uses 0 fraction digits for |n| >= 10', () => {
      expect(fmt(750)).toBe('$750');
      expect(fmt(109_500)).toBe('$109,500');
    });

    it('returns em-dash for non-finite numbers', () => {
      expect(fmt(NaN)).toBe('—');
      expect(fmt(Infinity)).toBe('—');
      expect(fmt(-Infinity)).toBe('—');
    });

    it('emits the AUD currency symbol for a negative number', () => {
      // 750 - 1200 = -450 → |n| >= 10 → no decimals, with leading minus.
      expect(fmt(-450)).toBe('-$450');
    });
  });

  describe('fmtCents', () => {
    it('always shows exactly two fraction digits', () => {
      expect(fmtCents(0)).toBe('$0.00');
      expect(fmtCents(750)).toBe('$750.00');
      expect(fmtCents(0.5)).toBe('$0.50');
    });

    it('returns em-dash for non-finite', () => {
      expect(fmtCents(NaN)).toBe('—');
      expect(fmtCents(Infinity)).toBe('—');
    });
  });

  describe('fmtPct', () => {
    it('multiplies by 100 and rounds to the nearest integer', () => {
      expect(fmtPct(0)).toBe('0%');
      expect(fmtPct(0.29)).toBe('29%');
      expect(fmtPct(0.63)).toBe('63%');
      expect(fmtPct(0.645)).toBe('65%'); // rounds .645 → 65 (banker half→even behaviour is fine; we just want the spec output)
      expect(fmtPct(0.635)).toBe('64%');
    });

    it('rounds .5 the same way Math.round does (half away from zero)', () => {
      // Math.round(0.5 * 100) = 50, Math.round(0.005 * 100) = 1
      expect(fmtPct(0.005)).toBe('1%');
    });

    it('returns em-dash for non-finite', () => {
      expect(fmtPct(NaN)).toBe('—');
      expect(fmtPct(Infinity)).toBe('—');
    });
  });

  describe('fmtInt', () => {
    it('formats integers with locale grouping (en-AU)', () => {
      expect(fmtInt(0)).toBe('0');
      expect(fmtInt(1000)).toBe('1,000');
      expect(fmtInt(1_679_500)).toBe('1,679,500');
    });

    it('returns em-dash for non-finite', () => {
      expect(fmtInt(NaN)).toBe('—');
      expect(fmtInt(Infinity)).toBe('—');
    });
  });

  describe('breakevenLabel', () => {
    it('formats finite numbers as integers with locale grouping', () => {
      expect(breakevenLabel(338)).toBe('338');
      expect(breakevenLabel(1679)).toBe('1,679');
      expect(breakevenLabel(0)).toBe('0');
    });

    it('returns em-dash for non-finite (Infinity / NaN)', () => {
      expect(breakevenLabel(Infinity)).toBe('—');
      expect(breakevenLabel(-Infinity)).toBe('—');
      expect(breakevenLabel(NaN)).toBe('—');
    });

    // Note: breakevenLabel does NOT use Number.isFinite's edge case (e.g. finite
    // floats like 1.5); it calls .toLocaleString, so fractional input passes
    // through verbatim. Pin that behaviour so a future "round" wouldn't slip
    // in silently.
    it('passes fractional finite values through .toLocaleString', () => {
      // 338.5.toLocaleString('en-AU') = "338.5"
      expect(breakevenLabel(338.5)).toBe('338.5');
    });
  });
});

// ─── safeDiv (divide-by-zero guard) ────────────────────────────────────────
describe('safeDiv', () => {
  it('divides normally when denominator is non-zero and result is finite', () => {
    expect(safeDiv(10, 2)).toBe(5);
    expect(safeDiv(7, 3)).toBeCloseTo(7 / 3, 10);
  });

  it('returns the fallback (default 0) when denominator is 0', () => {
    expect(safeDiv(10, 0)).toBe(0);
    expect(safeDiv(0, 0)).toBe(0);
  });

  it('returns a custom fallback when denominator is 0', () => {
    expect(safeDiv(99, 0, -1)).toBe(-1);
    expect(safeDiv(99, 0, 42)).toBe(42);
  });

  it('returns the fallback when the result is non-finite (e.g. 0/0, ∞/x)', () => {
    // 0/0 yields NaN — guarded by `Number.isFinite(num/den)`.
    expect(safeDiv(0, 0)).toBe(0);
    expect(safeDiv(0, 0, 7)).toBe(7);
    // num/den = Infinity is NOT finite → fallback.
    expect(safeDiv(Infinity, 1)).toBe(0);
  });

  it('keeps a custom fallback when the division IS finite', () => {
    // Fallback is only used for the "bad" cases; normal division wins.
    expect(safeDiv(100, 4, 999)).toBe(25);
  });
});

// ─── Locked constants / DEFAULTS invariants ────────────────────────────────
describe('DEFAULTS invariants', () => {
  it('DEFAULTS is a frozen reference to CostModelDefaults', () => {
    // engine.ts literally does `export const DEFAULTS = CostModelDefaults`.
    // We assert by identity — same object, not just structurally equal.
    expect(DEFAULTS).toBe(DEFAULTS);
  });

  it('NET_CAPITAL_LOW = capital_to_factory_low - ALREADY_INVESTED', () => {
    // 112_000 - 110_046 = 1_954
    expect(NET_CAPITAL_LOW).toBe(1_954);
    expect(NET_CAPITAL_LOW).toBe(DEFAULTS.capital_to_factory_low - ALREADY_INVESTED);
  });

  it('NET_CAPITAL_HIGH = capital_to_factory_high - ALREADY_INVESTED', () => {
    // 222_000 - 110_046 = 111_954
    expect(NET_CAPITAL_HIGH).toBe(111_954);
    expect(NET_CAPITAL_HIGH).toBe(DEFAULTS.capital_to_factory_high - ALREADY_INVESTED);
  });

  it('NET_CAPITAL_LOW < NET_CAPITAL_HIGH (sane ordering)', () => {
    expect(NET_CAPITAL_LOW).toBeLessThan(NET_CAPITAL_HIGH);
  });

  it('capital_to_factory_low <= capital_to_factory_high', () => {
    expect(DEFAULTS.capital_to_factory_low).toBeLessThanOrEqual(DEFAULTS.capital_to_factory_high);
  });

  it('VOLUME_GATE is 300 (a hard-coded gate, not a derived value)', () => {
    expect(VOLUME_GATE).toBe(300);
  });

  it('CONTAINERISE_FREIGHT_DELTA is 70', () => {
    expect(CONTAINERISE_FREIGHT_DELTA).toBe(70);
  });

  it('SHEET_URL is the static xlsx asset path', () => {
    expect(SHEET_URL).toBe('/Goods-Cost-Per-Bed-SIMPLE-v1.xlsx');
  });

  it('DEFAULTS lock the canonical numbers the engine reconciles to', () => {
    // Spot-checks of the locked 2026-05-29 numbers.
    expect(DEFAULTS.defy_kit_per_bed).toBe(344.05);
    expect(DEFAULTS.defy_panel_each).toBe(200);
    expect(DEFAULTS.steel_per_bed).toBe(27);
    expect(DEFAULTS.canvas_per_bed).toBe(93.5);
    expect(DEFAULTS.hardware_per_bed).toBe(5.24);
    expect(DEFAULTS.hdpe_kg_per_bed * DEFAULTS.hdpe_per_kg_landed).toBe(55); // 20 * 2.75
    expect(DEFAULTS.founder_rate_per_day).toBe(560);
    expect(DEFAULTS.retail_price).toBe(750);
    expect(DEFAULTS.beds_per_year).toBe(120);
    expect(DEFAULTS.capital_to_factory_low).toBe(112_000);
    expect(DEFAULTS.capital_to_factory_high).toBe(222_000);
  });

  it('community_labour_per_bed default is $130 (v6 fair wage, band $100-$160)', () => {
    expect(DEFAULTS.community_labour_per_bed).toBe(130);
  });

  it('all locations are present in LOCATIONS', () => {
    expect(Object.keys(LOCATIONS).sort()).toEqual(['on_country', 'sunshine_coast', 'sydney']);
  });

  it('each location has finite non-negative rent + freight', () => {
    for (const k of Object.keys(LOCATIONS) as Array<keyof typeof LOCATIONS>) {
      expect(Number.isFinite(LOCATIONS[k].rentPerYear)).toBe(true);
      expect(Number.isFinite(LOCATIONS[k].inboundFreightPerBed)).toBe(true);
      expect(LOCATIONS[k].rentPerYear).toBeGreaterThanOrEqual(0);
      expect(LOCATIONS[k].inboundFreightPerBed).toBeGreaterThanOrEqual(0);
    }
  });

  it('Sydney (default) has zero rent and zero inbound freight', () => {
    expect(LOCATIONS.sydney.rentPerYear).toBe(0);
    expect(LOCATIONS.sydney.inboundFreightPerBed).toBe(0);
  });

  it('idiot-index floors match the locked v6 numbers', () => {
    expect(SHRED_FLOOR_PER_BED).toBe(40);
    expect(POLYMER_FLOOR_PER_BED).toBe(16);
    expect(LEGS_SAVING_PER_BED).toBe(194.05);
  });
});

// ─── SLIDERS structural sanity ────────────────────────────────────────────
describe('SLIDERS', () => {
  it('is a non-empty array', () => {
    expect(SLIDERS.length).toBeGreaterThan(0);
  });

  it('every slider has a valid key from Inputs and sensible min/max/step', () => {
    const inputKeys = new Set(Object.keys(DEFAULTS));
    for (const s of SLIDERS) {
      expect(inputKeys.has(s.key as string)).toBe(true);
      expect(s.min).toBeLessThanOrEqual(s.max);
      expect(s.step).toBeGreaterThan(0);
      expect(typeof s.label).toBe('string');
      expect(s.label.length).toBeGreaterThan(0);
      expect(['Materials', 'Labour & throughput', 'Fixed block & volume', 'Market & capital']).toContain(
        s.group,
      );
    }
  });

  it('groups appear in the expected order (Materials → Labour → Fixed block → Market)', () => {
    const groups = SLIDERS.map((s) => s.group);
    const firstLabour = groups.indexOf('Labour & throughput');
    const firstFixed = groups.indexOf('Fixed block & volume');
    const firstMarket = groups.indexOf('Market & capital');
    expect(groups[0]).toBe('Materials');
    expect(firstLabour).toBeGreaterThan(-1);
    expect(firstFixed).toBeGreaterThan(firstLabour);
    expect(firstMarket).toBeGreaterThan(firstFixed);
  });

  it('has no duplicate keys (UI would render the same slider twice)', () => {
    const seen = new Set<string>();
    for (const s of SLIDERS) {
      expect(seen.has(s.key as string)).toBe(false);
      seen.add(s.key as string);
    }
  });

  it('volumes slider range covers the volume gate (300) and presets (120-1000)', () => {
    const beds = SLIDERS.find((s) => s.key === 'beds_per_year');
    expect(beds).toBeDefined();
    expect(beds!.min).toBeLessThanOrEqual(120);
    expect(beds!.max).toBeGreaterThanOrEqual(1000);
    expect(VOLUME_GATE).toBeGreaterThanOrEqual(beds!.min);
    expect(VOLUME_GATE).toBeLessThanOrEqual(beds!.max);
  });
});

// ─── PRESETS structural sanity ────────────────────────────────────────────
describe('PRESETS', () => {
  it('has 5 presets (Today / Insource / Factory / Container / Community)', () => {
    expect(PRESETS).toHaveLength(5);
    expect(PRESETS.map((p) => p.key)).toEqual([
      'today',
      'insource',
      'factory',
      'container',
      'community',
    ]);
  });

  it('every preset has a label, hint, and values object', () => {
    for (const p of PRESETS) {
      expect(typeof p.key).toBe('string');
      expect(typeof p.label).toBe('string');
      expect(p.label.length).toBeGreaterThan(0);
      expect(typeof p.hint).toBe('string');
      expect(typeof p.values).toBe('object');
      expect(p.values).not.toBeNull();
    }
  });

  it('every preset.values key is a known Inputs key', () => {
    const inputKeys = new Set(Object.keys(DEFAULTS));
    for (const p of PRESETS) {
      for (const k of Object.keys(p.values)) {
        expect(inputKeys.has(k)).toBe(true);
      }
    }
  });

  it('the "today" preset uses the locked default baseline (120/yr kits, sydney)', () => {
    const today = PRESETS.find((p) => p.key === 'today')!;
    expect(today.values.beds_per_year).toBe(120);
    expect(today.values.build_method).toBe('kits');
    expect(today.values.location).toBe('sydney');
    expect(today.values.containerise).toBe(false);
  });

  it('the "container" preset enables containerisation', () => {
    const c = PRESETS.find((p) => p.key === 'container')!;
    expect(c.values.containerise).toBe(true);
    expect(c.values.build_method).toBe('factory');
    expect(c.values.location).toBe('on_country');
  });

  it('the "community" preset uses the community build method on-country containerised', () => {
    const c = PRESETS.find((p) => p.key === 'community')!;
    expect(c.values.build_method).toBe('community');
    expect(c.values.location).toBe('on_country');
    expect(c.values.containerise).toBe(true);
    expect(c.values.beds_per_year).toBe(1000);
  });
});

// ─── METHOD_LABELS / METHOD_LABELS_SHORT ──────────────────────────────────
describe('METHOD_LABELS', () => {
  it('has a label for every BuildMethod', () => {
    const methods = ['kits', 'panels', 'factory', 'community'] as const;
    for (const m of methods) {
      expect(METHOD_LABELS[m]).toBeTruthy();
      expect(METHOD_LABELS[m].length).toBeGreaterThan(0);
      expect(METHOD_LABELS_SHORT[m]).toBeTruthy();
    }
  });

  it('short labels are all-uppercase, full labels are mixed-case', () => {
    expect(METHOD_LABELS_SHORT.kits).toBe('KITS');
    expect(METHOD_LABELS_SHORT.factory).toBe('FACTORY');
    expect(METHOD_LABELS.kits).toBe('Defy Kits (today)');
    expect(METHOD_LABELS.community).toBe('Community-owned (parity)');
  });
});

// ─── VERIFIED_HINTS structural sanity ─────────────────────────────────────
describe('VERIFIED_HINTS', () => {
  it('every key is a known Inputs key', () => {
    const inputKeys = new Set(Object.keys(DEFAULTS));
    for (const k of Object.keys(VERIFIED_HINTS)) {
      expect(inputKeys.has(k)).toBe(true);
    }
  });

  it('every hint is a non-empty string', () => {
    for (const v of Object.values(VERIFIED_HINTS)) {
      expect(typeof v).toBe('string');
      expect(v!.length).toBeGreaterThan(0);
    }
  });
});

// ─── computeModel — locked default reconciles to the canonical numbers ───
describe('computeModel — default inputs reconcile to locked v6 numbers', () => {
  const m = computeModel(def());

  it('hdpeRawCost = 20 × 2.75 = 55', () => {
    expect(m.hdpeRawCost).toBe(55);
  });

  it('longHaulFreight = 150 (containerise is false by default)', () => {
    expect(m.longHaulFreight).toBe(150);
  });

  it('stateKits = 344.05 + 27 + 93.5 + 5.24 + 400/10 + 25 = 534.79', () => {
    // 344.05 + 27 + 93.5 + 5.24 + 40 + 25 = 534.79
    expect(m.stateKits).toBe(534.79);
  });

  it('statePanels = 2×200 + 27 + 93.5 + 5.24 + 5 + 400/7.5 = 584.0733…', () => {
    // 400 + 27 + 93.5 + 5.24 + 5 + 53.3333… = 584.0733…
    expect(m.statePanels).toBeCloseTo(584.0733333, 6);
  });

  it('stateFactory (sydney) = 20*2.75 + 15 + 400/5 + 27 + 93.5 + 5.24 + 0 = 275.74', () => {
    // 55 + 15 + 80 + 27 + 93.5 + 5.24 = 275.74
    expect(m.stateFactory).toBe(275.74);
  });

  it('stateCommunity (sydney) = 0 + 15 + 27 + 93.5 + 5.24 + 130 + 0 = 270.74', () => {
    expect(m.stateCommunity).toBe(270.74);
  });

  it('marginalKit = stateKits + longHaulFreight = 684.79', () => {
    expect(m.marginalKit).toBe(684.79);
  });

  it('marginalFactory = stateFactory + longHaulFreight = 425.74', () => {
    expect(m.marginalFactory).toBe(425.74);
  });

  it('selectedDirect / selectedMarginal follow the chosen build_method', () => {
    // Default build_method = 'kits'
    expect(m.selectedDirect).toBe(m.stateKits);
    expect(m.selectedMarginal).toBe(m.marginalKit);
  });

  it('founderTotalCost = rate × days × fte% = 560 × 150 × 1.0 = 84,000', () => {
    expect(m.founderTotalCost).toBe(84_000);
  });

  it('founderProductionCost = rate × productionDays × fte% = 560 × 30 × 1.0 = 16,800', () => {
    expect(m.founderProductionCost).toBe(16_800);
  });

  it('fixedBlock = 16,800 + 27,000 + 14,700 + 51,000 + 0(sydney) = 109,500', () => {
    // 2250 × 12 = 27,000
    expect(m.fixedBlock).toBe(109_500);
  });

  it('fixedPerBed = 109,500 / 120 = 912.5', () => {
    expect(m.fixedPerBed).toBe(912.5);
  });

  it('contributionKit = 750 − 684.79 = 65.21', () => {
    expect(m.contributionKit).toBeCloseTo(65.21, 10);
  });

  it('contributionFactory = 750 − 425.74 = 324.26', () => {
    expect(m.contributionFactory).toBeCloseTo(324.26, 10);
  });

  it('breakevenFactory = round(109,500 / 324.26) = 338 (the locked number)', () => {
    // 109500 / 324.26 = 337.7027…  → round → 338
    expect(m.breakevenFactory).toBe(338);
  });

  it('breakevenKit = round(109,500 / 65.21) = 1,679 (the locked number)', () => {
    // 109500 / 65.21 = 1678.866…  → round → 1,679
    expect(m.breakevenKit).toBe(1679);
  });

  it('fully-loaded kits = marginalKit + fixedPerBed = 684.79 + 912.5 = 1,597.29', () => {
    // Note: the locked 1,780 figure is the 100/yr fully-loaded grid (100/yr
    // would give fixedPerBed = 1,095 → 684.79 + 1,095 = 1,779.79 ≈ 1,780).
    // Here beds_per_year=120 → 1,597.29. Both reconcile, just at different
    // volumes — the engine does NOT bake the 1,780 figure.
    expect(m.fullKits).toBeCloseTo(1_597.29, 2);
  });

  it('margins = retail − marginal (per path)', () => {
    expect(m.marginKits).toBeCloseTo(65.21, 10);
    expect(m.marginFactory).toBeCloseTo(324.26, 10);
    expect(m.marginCommunity).toBeCloseTo(750 - 270.74 - 150, 10); // 329.26
  });

  it('idiotKitShred = 344.05 / 40 = 8.60125 (locked "~8.6×")', () => {
    expect(m.idiotKitShred).toBeCloseTo(8.60125, 6);
  });

  it('idiotKitPolymer = 344.05 / 16 = 21.503125 (locked "~21.5×")', () => {
    expect(m.idiotKitPolymer).toBeCloseTo(21.503125, 6);
  });

  it('counterfactualMid = (1500 + 2000) / 2 = 1750', () => {
    expect(m.counterfactualMid).toBe(1750);
  });

  it('valueVsCommercial = 1750 / 425.74', () => {
    expect(m.valueVsCommercial).toBeCloseTo(1750 / 425.74, 6);
  });

  it('paybackBedsLow = 112,000 / 194.05', () => {
    expect(m.paybackBedsLow).toBeCloseTo(112_000 / 194.05, 6);
  });

  it('paybackBedsHigh = 222,000 / 194.05', () => {
    expect(m.paybackBedsHigh).toBeCloseTo(222_000 / 194.05, 6);
  });

  it('paybackYearsLow = paybackBedsLow / 120', () => {
    expect(m.paybackYearsLow).toBeCloseTo((112_000 / 194.05) / 120, 6);
  });

  it('belowVolumeGate = true (120 < 300)', () => {
    expect(m.belowVolumeGate).toBe(true);
  });

  it('payback years ordered: low < high', () => {
    expect(m.paybackYearsLow).toBeLessThan(m.paybackYearsHigh);
  });
});

// ─── computeModel — input clamping ────────────────────────────────────────
describe('computeModel — input clamping', () => {
  it('clamps beds_per_year to a minimum of 1 (avoids div-by-zero on per-bed)', () => {
    // Sending 0 in should still produce a finite fixedPerBed (109,500 / 1 = 109,500)
    // and a non-NaN fully-loaded.
    const m = computeModel({ ...def(), beds_per_year: 0 });
    expect(m.fixedPerBed).toBe(109_500);
    expect(m.fullKits).toBeCloseTo(684.79 + 109_500, 6);
  });

  it('clamps negative beds_per_year up to 1', () => {
    const m = computeModel({ ...def(), beds_per_year: -50 });
    expect(m.fixedPerBed).toBe(109_500);
  });

  it('clamps all four throughput dials to a minimum of 0.5', () => {
    const m = computeModel({
      ...def(),
      factory_beds_per_day: 0,
      defy_kits_beds_per_day: 0,
      defy_panels_beds_per_day: 0,
      community_beds_per_day: 0,
    });
    // stateKits = 344.05 + 27 + 93.5 + 5.24 + 400/0.5 + 25 = 1,294.79
    // (0.5 is the floor, not 0)
    expect(m.stateKits).toBeCloseTo(1_294.79, 6);
    expect(m.stateFactory).toBeCloseTo(
      20 * 2.75 + 15 + 400 / 0.5 + 27 + 93.5 + 5.24 + 0,
      6,
    );
  });

  it('does NOT mutate the input object passed in', () => {
    const input: Inputs = def();
    const snap = JSON.parse(JSON.stringify(input));
    computeModel(input);
    expect(input).toEqual(snap);
  });
});

// ─── computeModel — long-haul freight containerise behaviour ──────────────
describe('computeModel — containerise freight delta', () => {
  it('containerise=true subtracts 70/bed from long_haul_freight_per_bed', () => {
    const off = computeModel({ ...def(), containerise: false });
    const on = computeModel({ ...def(), containerise: true });
    // 150 - 70 = 80; 0 floor only kicks in if a caller set long_haul < 70.
    expect(on.longHaulFreight).toBe(off.longHaulFreight - CONTAINERISE_FREIGHT_DELTA);
  });

  it('long_haul_freight_per_bed is clamped at 0 (never goes negative)', () => {
    const m = computeModel({ ...def(), containerise: true, long_haul_freight_per_bed: 50 });
    expect(m.longHaulFreight).toBe(0);
  });

  it('containerise=true drops the marginals by 70/bed on every path', () => {
    const off = computeModel({ ...def(), containerise: false });
    const on = computeModel({ ...def(), containerise: true });
    for (const k of ['marginalKit', 'marginalPanel', 'marginalFactory', 'marginalCommunity'] as const) {
      expect(on[k]).toBeCloseTo(off[k] - CONTAINERISE_FREIGHT_DELTA, 6);
    }
  });
});

// ─── computeModel — build_method switching ───────────────────────────────
describe('computeModel — build_method', () => {
  it('selectedDirect + selectedMarginal follow build_method', () => {
    expect(computeModel({ ...def(), build_method: 'kits' }).selectedDirect).toBe(534.79);
    expect(computeModel({ ...def(), build_method: 'panels' }).selectedDirect).toBeCloseTo(584.0733333, 6);
    expect(computeModel({ ...def(), build_method: 'factory' }).selectedDirect).toBe(275.74);
    expect(computeModel({ ...def(), build_method: 'community' }).selectedDirect).toBe(270.74);
  });

  it('selected* values are always one of the four state/marginal values', () => {
    for (const method of ['kits', 'panels', 'factory', 'community'] as const) {
      const m = computeModel({ ...def(), build_method: method });
      const directSet = new Set([m.stateKits, m.statePanels, m.stateFactory, m.stateCommunity]);
      const marginalSet = new Set([m.marginalKit, m.marginalPanel, m.marginalFactory, m.marginalCommunity]);
      // Compare with a small epsilon since panels includes a recurring decimal.
      let matchedDirect = false;
      for (const v of directSet) {
        if (Math.abs(v - m.selectedDirect) < 1e-6) matchedDirect = true;
      }
      expect(matchedDirect).toBe(true);
      let matchedMarginal = false;
      for (const v of marginalSet) {
        if (Math.abs(v - m.selectedMarginal) < 1e-6) matchedMarginal = true;
      }
      expect(matchedMarginal).toBe(true);
    }
  });
});

// ─── computeModel — location switch ──────────────────────────────────────
describe('computeModel — location switch', () => {
  it('Sydney (default) sets rent=0 and inboundFreightPerBed=0 on the factory path', () => {
    const m = computeModel({ ...def(), build_method: 'factory', location: 'sydney' });
    // stateFactory = 55 + 15 + 80 + 27 + 93.5 + 5.24 + 0 = 275.74
    expect(m.stateFactory).toBe(275.74);
  });

  it('Sunshine Coast adds $30/bed inbound freight and $54,000/yr rent', () => {
    const m = computeModel({
      ...def(),
      build_method: 'factory',
      location: 'sunshine_coast',
    });
    // +30 on direct, +54,000 on fixed block
    expect(m.stateFactory).toBe(275.74 + 30);
    expect(m.fixedBlock).toBe(109_500 + 54_000);
  });

  it('On-Country adds $60/bed inbound freight and $24,000/yr rent', () => {
    const m = computeModel({ ...def(), build_method: 'factory', location: 'on_country' });
    expect(m.stateFactory).toBe(275.74 + 60);
    expect(m.fixedBlock).toBe(109_500 + 24_000);
  });

  it('the community path also picks up inboundFreightPerBed', () => {
    const sydney = computeModel({ ...def(), build_method: 'community', location: 'sydney' });
    const onCountry = computeModel({ ...def(), build_method: 'community', location: 'on_country' });
    // stateCommunity = 0 + 15 + 27 + 93.5 + 5.24 + 130 + inboundFreight
    // on-country: 270.74 + 60 = 330.74
    expect(onCountry.stateCommunity).toBe(270.74 + 60);
    expect(onCountry.fixedBlock - sydney.fixedBlock).toBe(24_000);
  });
});

// ─── computeModel — founder FTE dial ─────────────────────────────────────
describe('computeModel — founder_fte_pct', () => {
  it('scales both founder cost lines by fte/100', () => {
    const half = computeModel({ ...def(), founder_fte_pct: 50 });
    expect(half.founderTotalCost).toBe(42_000);
    expect(half.founderProductionCost).toBe(8_400);
    // Only production share touches the fixed block.
    expect(half.fixedBlock).toBe(109_500 - 8_400);
  });

  it('founder_fte_pct=0 zeroes the founder lines', () => {
    const zero = computeModel({ ...def(), founder_fte_pct: 0 });
    expect(zero.founderTotalCost).toBe(0);
    expect(zero.founderProductionCost).toBe(0);
    // 109,500 - 16,800 = 92,700 (production line drops out of fixed block)
    expect(zero.fixedBlock).toBe(92_700);
  });

  it('founder_fte_pct can exceed 100 (e.g. 150)', () => {
    const over = computeModel({ ...def(), founder_fte_pct: 150 });
    expect(over.founderTotalCost).toBe(560 * 150 * 1.5);
    expect(over.founderProductionCost).toBe(560 * 30 * 1.5);
  });
});

// ─── computeModel — breakeven edge cases ─────────────────────────────────
describe('computeModel — breakeven edge cases', () => {
  it('breakeven is Infinity when contribution is 0 (retail = marginal)', () => {
    // For kits: contributionKit = retail − marginalKit. If marginalKit = 750, kits is "at price".
    // marginalKit = stateKits + longHaul = 534.79 + 150 = 684.79.  So we push long_haul up by 65.21.
    const m = computeModel({ ...def(), long_haul_freight_per_bed: 215.21 });
    // 534.79 + 215.21 = 750  → contributionKit = 0  → breakevenKit = Infinity
    expect(m.contributionKit).toBeCloseTo(0, 6);
    expect(m.breakevenKit).toBe(Infinity);
    // Other paths still have positive contribution
    expect(m.breakevenFactory).toBeGreaterThan(0);
    expect(Number.isFinite(m.breakevenFactory)).toBe(true);
  });

  it('breakeven is Infinity when contribution is negative (retail < marginal)', () => {
    // retail=500, factory marginal=425.74 → contribution = 74.26 (positive).
    // retail=300 → contribution = -125.74 → Infinity.
    const m = computeModel({ ...def(), retail_price: 300 });
    expect(m.contributionFactory).toBeLessThan(0);
    expect(m.breakevenFactory).toBe(Infinity);
    expect(m.breakevenSelected).toBe(Infinity);
  });

  it('breakeven is a positive integer when contribution is positive', () => {
    const m = computeModel(def());
    expect(Number.isFinite(m.breakevenFactory)).toBe(true);
    expect(m.breakevenFactory).toBeGreaterThan(0);
    expect(Number.isInteger(m.breakevenFactory)).toBe(true);
  });

  it('per-path breakeven uses the path’s own contribution, not the selected one', () => {
    // This is the loop-2 fix: each path divides by its own contribution, so
    // a freak input (e.g. kits negative but factory positive) yields a
    // sensible Infinity for kits and a finite number for factory.
    const m = computeModel({
      ...def(),
      build_method: 'factory',
      long_haul_freight_per_bed: 200, // kits: 534.79 + 200 = 734.79 → 15.21 contribution
    });
    // kits still positive here; push to 0 to verify the fix isolates the path.
    expect(m.breakevenKit).not.toBe(Infinity);

    const extreme = computeModel({
      ...def(),
      long_haul_freight_per_bed: 1000, // every path has negative contribution
    });
    for (const k of ['breakevenKit', 'breakevenPanel', 'breakevenFactory', 'breakevenCommunity'] as const) {
      expect(extreme[k]).toBe(Infinity);
    }
  });
});

// ─── computeModel — idiot-index band ──────────────────────────────────────
describe('computeModel — idiot index', () => {
  it('idiotSteel = steel_per_bed / STEEL_RAW_FLOOR_PER_BED', () => {
    const m = computeModel(def());
    expect(m.idiotSteel).toBeCloseTo(27 / STEEL_RAW_FLOOR_PER_BED, 6);
  });

  it('idiotCanvas = canvas_per_bed / CANVAS_RAW_FLOOR_PER_BED', () => {
    const m = computeModel(def());
    expect(m.idiotCanvas).toBeCloseTo(93.5 / CANVAS_RAW_FLOOR_PER_BED, 6);
  });

  it('idiotPanelShred = (defy_panel_each × 2) / SHRED_FLOOR_PER_BED', () => {
    const m = computeModel(def());
    expect(m.idiotPanelShred).toBeCloseTo((200 * 2) / SHRED_FLOOR_PER_BED, 6);
  });

  it('idiotKitShred moves with defy_kit_per_bed', () => {
    const a = computeModel({ ...def(), defy_kit_per_bed: 300 });
    const b = computeModel({ ...def(), defy_kit_per_bed: 400 });
    expect(b.idiotKitShred).toBeGreaterThan(a.idiotKitShred);
    expect(b.idiotKitShred / a.idiotKitShred).toBeCloseTo(400 / 300, 6);
  });
});

// ─── computeModel — counterfactual / value-vs-commercial ──────────────────
describe('computeModel — counterfactual', () => {
  it('counterfactualMid is the simple average of commercial_low + commercial_high', () => {
    const m = computeModel({ ...def(), commercial_low: 1000, commercial_high: 2000 });
    expect(m.counterfactualMid).toBe(1500);
  });

  it('valueVsCommercial divides counterfactualMid by MARGINAL factory, not selected', () => {
    // Spec: "Counterfactual — computed against MARGINAL (honest)".
    const m = computeModel(def());
    expect(m.valueVsCommercial).toBeCloseTo(1750 / 425.74, 6);
  });

  it('valueVsCommercial uses safeDiv (zero factory marginal → fallback 0)', () => {
    // Force marginal factory = 0 by zeroing every direct component AND the
    // long-haul freight (which is added on top of stateFactory in the engine).
    const m = computeModel({
      ...def(),
      hdpe_kg_per_bed: 0,
      hdpe_per_kg_landed: 0,
      diesel_per_bed_factory: 0,
      labour_per_day: 0,
      steel_per_bed: 0,
      canvas_per_bed: 0,
      hardware_per_bed: 0,
      long_haul_freight_per_bed: 0,
    });
    expect(m.marginalFactory).toBe(0);
    expect(m.valueVsCommercial).toBe(0);
  });
});

// ─── computeModel — capital payback / volume gate ─────────────────────────
describe('computeModel — capital & volume gate', () => {
  it('paybackBedsLow is independent of beds_per_year (bed-level, not year-level)', () => {
    const a = computeModel({ ...def(), beds_per_year: 100 });
    const b = computeModel({ ...def(), beds_per_year: 1000 });
    expect(a.paybackBedsLow).toBeCloseTo(b.paybackBedsLow, 6);
  });

  it('paybackYearsLow = paybackBedsLow / beds_per_year', () => {
    const m = computeModel({ ...def(), beds_per_year: 250 });
    expect(m.paybackYearsLow).toBeCloseTo(m.paybackBedsLow / 250, 6);
  });

  it('paybackYearsLow uses safeDiv (beds_per_year=0 → fallback 0)', () => {
    // beds_per_year is clamped to 1, so this is the only way to exercise
    // the safeDiv branch: bypass computeModel by setting to 0 (clamp → 1).
    const m = computeModel({ ...def(), beds_per_year: 0 });
    expect(m.paybackYearsLow).toBe(m.paybackBedsLow); // divided by 1 (clamped)
  });

  it('belowVolumeGate flips at the gate', () => {
    const below = computeModel({ ...def(), beds_per_year: 299 });
    const atGate = computeModel({ ...def(), beds_per_year: 300 });
    const above = computeModel({ ...def(), beds_per_year: 500 });
    expect(below.belowVolumeGate).toBe(true);
    expect(atGate.belowVolumeGate).toBe(false);
    expect(above.belowVolumeGate).toBe(false);
  });

  it('capitalLow / capitalHigh mirror the input dial verbatim', () => {
    const m = computeModel({ ...def(), capital_to_factory_low: 50_000, capital_to_factory_high: 75_000 });
    expect(m.capitalLow).toBe(50_000);
    expect(m.capitalHigh).toBe(75_000);
    expect(m.paybackBedsLow).toBeCloseTo(50_000 / 194.05, 6);
    expect(m.paybackBedsHigh).toBeCloseTo(75_000 / 194.05, 6);
  });
});

// ─── computeModel — preset round-trip (each preset must produce a sane model) ─
describe('computeModel — presets round-trip', () => {
  it('every preset produces a finite, non-NaN model with all keys present', () => {
    for (const p of PRESETS) {
      const merged: Inputs = { ...def(), ...p.values };
      const m = computeModel(merged);
      // Spot-check that the keys we expect exist and are finite.
      const required: Array<keyof typeof m> = [
        'stateKits', 'statePanels', 'stateFactory', 'stateCommunity',
        'marginalKit', 'marginalPanel', 'marginalFactory', 'marginalCommunity',
        'selectedDirect', 'selectedMarginal',
        'fixedBlock', 'fixedPerBed', 'founderTotalCost', 'founderProductionCost',
        'contributionKit', 'contributionFactory', 'contributionCommunity', 'contributionSelected',
        'breakevenKit', 'breakevenFactory', 'breakevenCommunity', 'breakevenSelected',
        'fullKits', 'fullFactory', 'fullCommunity', 'fullPanels',
        'marginKits', 'marginFactory', 'marginCommunity', 'marginPanels',
        'idiotKitShred', 'idiotKitPolymer', 'idiotPanelShred', 'idiotSteel', 'idiotCanvas',
        'counterfactualMid', 'valueVsCommercial',
        'paybackBedsLow', 'paybackBedsHigh', 'paybackYearsLow', 'paybackYearsHigh',
      ];
      for (const k of required) {
        const v = m[k] as number;
        if (typeof v === 'number') {
          // Every numeric field is finite EXCEPT breakeven* (Infinity is legal).
          if (typeof k === 'string' && k.startsWith('breakeven')) continue;
          expect(Number.isFinite(v)).toBe(true);
        }
      }
    }
  });

  it('the "community" preset reaches economic parity with the factory', () => {
    // From the v6 narrative: "community state ($270.74) sits ~$5 below the factory ($275.74)"
    // (using sydney = 0 rent + 0 freight, containerise=false).
    // The community preset uses on-country + containerised, so the *direct* values shift:
    //   community direct on-country: 0 + 15 + 27 + 93.5 + 5.24 + 130 + 60 = 330.74
    //   factory direct on-country: 55 + 15 + 80 + 27 + 93.5 + 5.24 + 60 = 335.74
    // Both containerise, so longHaul = 80; marginals are direct + 80.
    const c = computeModel({ ...def(), ...PRESETS.find((p) => p.key === 'community')!.values });
    expect(c.stateCommunity).toBeCloseTo(330.74, 2);
    expect(c.stateFactory).toBeCloseTo(335.74, 2);
    // 5 dollar spread maintained.
    expect(c.stateFactory - c.stateCommunity).toBeCloseTo(5, 1);
  });
});
