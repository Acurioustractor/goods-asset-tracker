'use client';

/**
 * Shared cost-model state for the /cost-story page.
 *
 * ONE source of truth: the verified `computeModel()` engine (same core the
 * /admin/cost-model cockpit uses). The floating control dock and every live
 * chart read this context, so dragging the price/volume sliders recomputes
 * all six charts AND the playground from identical, locked numbers.
 */

import { createContext, useContext, useMemo, useState } from 'react';
import {
  computeModel,
  DEFAULTS,
  type CostModel,
  type Inputs,
} from '@/lib/cost-model/engine';

interface CostModelCtx {
  price: number;
  beds: number;
  wage: number;
  setPrice: (n: number) => void;
  setBeds: (n: number) => void;
  setWage: (n: number) => void;
  inputs: Inputs;
  model: CostModel;
}

const Ctx = createContext<CostModelCtx | null>(null);

export const PRICE_MIN = 500;
export const PRICE_MAX = 900;
export const BEDS_MIN = 50;
export const BEDS_MAX = 1500;
// Community fair-wage band (v6: $130 default, $100–$160). The mission lever:
// raising it keeps more dignified paid work in community without breaking the path.
export const WAGE_MIN = 100;
export const WAGE_MAX = 160;

export function CostModelProvider({
  children,
  initialPrice = 750,
  initialBeds = 500,
  initialWage = DEFAULTS.community_labour_per_bed,
}: {
  children: React.ReactNode;
  initialPrice?: number;
  initialBeds?: number;
  initialWage?: number;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [beds, setBeds] = useState(initialBeds);
  const [wage, setWage] = useState(initialWage);

  const inputs = useMemo<Inputs>(
    () => ({ ...DEFAULTS, retail_price: price, beds_per_year: beds, community_labour_per_bed: wage }),
    [price, beds, wage],
  );
  const model = useMemo(() => computeModel(inputs), [inputs]);

  const value = useMemo<CostModelCtx>(
    () => ({ price, beds, wage, setPrice, setBeds, setWage, inputs, model }),
    [price, beds, wage, inputs, model],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCostModel(): CostModelCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCostModel must be used within <CostModelProvider>');
  return ctx;
}
