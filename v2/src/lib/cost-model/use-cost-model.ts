'use client';
/**
 * useCostModel() — the single React state hook over the VERIFIED cost-model engine.
 *
 * All three UI skins (Mission Control / Tesla / Terminal) consume ONE instance of
 * this hook so they read identical, locked numbers. The hook owns input state and
 * memoises `model = computeModel(inputs)`. No math lives here — see engine.ts.
 */
import { useState, useMemo, useCallback } from 'react';
import { computeModel, DEFAULTS, type Inputs, type Preset, type CostModel } from './engine';

export interface UseCostModel {
  inputs: Inputs;
  setInput: <K extends keyof Inputs>(key: K, val: Inputs[K]) => void;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  applyPreset: (p: Preset) => void;
  resetAll: () => void;
  model: CostModel;
}

export function useCostModel(initial: Inputs = DEFAULTS): UseCostModel {
  const [inputs, setInputs] = useState<Inputs>(initial);
  const model = useMemo(() => computeModel(inputs), [inputs]);

  const setInput = useCallback(<K extends keyof Inputs>(key: K, val: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }, []);

  const applyPreset = useCallback((p: Preset) => {
    setInputs((prev) => ({ ...prev, ...p.values }));
  }, []);

  const resetAll = useCallback(() => {
    setInputs(DEFAULTS);
  }, []);

  return { inputs, setInput, setInputs, applyPreset, resetAll, model };
}
