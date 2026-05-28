/**
 * Interactive cost-model explorer — sliders + matrix + Musk Idiot Index.
 * Designed for QBE-style funder pitches: capital ask + unit economics + scaling plan.
 *
 * All defaults come from `cost-model-scenarios.json`. Sliders let you override
 * any input and watch the matrix recompute live. Source of truth stays the JSON;
 * this page is the playground.
 */
import { CostModelExplorer } from './cost-model-explorer';

export const metadata = {
  title: 'Cost Model Explorer — Goods on Country',
  description: 'Interactive bed cost model: sliders, scenarios, Idiot Index, QBE-ready capital ask.',
};

export default function CostModelPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bed Cost Model Explorer</h1>
        <p className="text-sm text-gray-600 mt-2">
          Musk-style first-principles cost model. Sliders drive the matrix below — adjust assumptions and
          see how the unit economics, capital ask, and scaling plan respond live. All defaults verified from
          Defy/Centre Canvas/Coastal Fasteners invoices + Notion BK review 2026-05-28.
        </p>
      </div>
      <CostModelExplorer />
    </div>
  );
}
