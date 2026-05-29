/**
 * Cost-model showcase — ONE verified engine, THREE aesthetic skins.
 *
 * Engine + state live in `@/lib/cost-model` (engine.ts + use-cost-model.ts).
 * The client workspace owns a single useCostModel() instance and switches
 * between Mission Control / Tesla / Terminal skins, persisting the choice in
 * the URL (?skin=mc|tesla|terminal). All defaults + math are LOCKED in
 * cost-model-scenarios.json (v5) + 01-cost-model-idiot-index.json (v6).
 * Route stays admin-gated by the admin layout.
 */
import { Suspense } from 'react';
import { CostModelWorkspace } from './cost-model-workspace';

export const metadata = {
  title: 'Cost Model — Goods on Country',
  description: 'Verified bed cost model: marginal-cost-first, three aesthetic skins, QBE-ready capital ask.',
};

export default function CostModelPage() {
  return (
    // FULL-SCREEN COCKPIT: break out of the <main> px/py padding so the cost
    // model owns the entire admin content region — full width AND full height.
    // The admin <main> uses `py-8 md:py-10`; we cancel the top/bottom padding
    // (-my-8 / md:-my-10) and the horizontal padding (-mx-4 / sm:-mx-6) so a
    // skin can size itself to ~100vh and present one no-scroll viewport.
    <div className="w-full -my-8 md:-my-10 -mx-4 px-4 sm:-mx-6 sm:px-6">
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading cost model…</div>}>
        <CostModelWorkspace />
      </Suspense>
    </div>
  );
}
