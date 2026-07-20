'use client';
/**
 * Cost-model WORKSPACE — the shell that switches between three aesthetic skins.
 *
 * Owns ONE useCostModel() instance (so all three skins read identical, locked
 * numbers) and a top segmented toggle [Mission Control | Tesla | Terminal] that
 * persists the active skin in the URL query (?skin=mc|tesla|terminal) so a view
 * is shareable. Engine + math live in @/lib/cost-model — this file is pure shell.
 */
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCostModel } from '@/lib/cost-model/use-cost-model';
import { MissionControlSkin } from './skins/mission-control-skin';
import { TeslaSkin } from './skins/tesla-skin';
import { TerminalSkin } from './skins/terminal-skin';
import { InvestmentSkin } from './skins/investment-skin';

type SkinKey = 'mc' | 'tesla' | 'terminal' | 'investment';

const SKINS: { key: SkinKey; label: string; tagline: string }[] = [
  { key: 'mc', label: 'Mission Control', tagline: 'SpaceX launch console' },
  { key: 'tesla', label: 'Tesla', tagline: 'Dark · elegant · spacious' },
  { key: 'terminal', label: 'Terminal', tagline: 'Bloomberg flight console' },
  { key: 'investment', label: 'Investment', tagline: 'Margin waterfall · brokerage · debt' },
];

function parseSkin(raw: string | null, fallback: SkinKey = 'mc'): SkinKey {
  return raw === 'tesla' || raw === 'terminal' || raw === 'investment' || raw === 'mc' ? raw : fallback;
}

export function CostModelWorkspace({ defaultSkin = 'mc' }: { defaultSkin?: SkinKey }) {
  const router = useRouter();
  const params = useSearchParams();
  const skin = parseSkin(params.get('skin'), defaultSkin);

  // ONE shared engine instance — every skin renders the same locked numbers.
  const cm = useCostModel();

  const selectSkin = useCallback(
    (next: SkinKey) => {
      const sp = new URLSearchParams(Array.from(params.entries()));
      sp.set('skin', next);
      // shallow URL update — keep the single useCostModel state alive across skin swaps.
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    [params, router],
  );

  return (
    // Full-screen cockpit shell: a compact toggle bar on top, then the active
    // skin fills the rest of the viewport. The page wrapper has cancelled the
    // admin <main> padding, so 100vh here is the true browser viewport.
    <div className="flex h-screen flex-col gap-2 overflow-hidden">
      {/* Compact skin toggle bar (single row, ~44px) */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold font-display leading-tight tracking-tight text-foreground">
            Bed Cost Model
            <span className="ml-2 hidden text-[11px] font-normal text-muted-foreground sm:inline">
              one verified engine · three aesthetics · marginal-cost-first · QBE-ready · share via{' '}
              <code className="rounded bg-muted px-1 text-[10px]">?skin=</code>
            </span>
          </h1>
        </div>
        <div className="inline-flex shrink-0 rounded-lg border border-border bg-muted p-0.5">
          {SKINS.map((s) => (
            <button
              key={s.key}
              onClick={() => selectSkin(s.key)}
              title={s.tagline}
              aria-pressed={skin === s.key}
              className={`rounded-md px-3 py-1.5 text-left transition-colors ${
                skin === s.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              <span className="block text-[12px] font-medium leading-none">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active skin — fills all remaining vertical space (one viewport, no doc scroll) */}
      <div className="min-h-0 flex-1">
        {skin === 'mc' && <MissionControlSkin cm={cm} />}
        {skin === 'tesla' && <TeslaSkin cm={cm} />}
        {skin === 'terminal' && <TerminalSkin cm={cm} />}
        {skin === 'investment' && <InvestmentSkin />}
      </div>
    </div>
  );
}
