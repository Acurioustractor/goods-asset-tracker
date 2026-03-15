import {
  getSystemHealth,
  getImpactKPIs,
  getFleetSummary,
  getProductionSummary,
  getFundingSummary,
  getStoriesSummary,
} from './actions';
import { SystemHealthStrip } from '@/components/ops/system-health-strip';
import { OpsKPIGrid } from '@/components/ops/ops-kpi-grid';
import { FleetSummaryCard } from '@/components/ops/fleet-summary-card';
import { ProductionSummaryCard } from '@/components/ops/production-summary-card';
import { FundingSummaryCard } from '@/components/ops/funding-summary-card';
import { StoriesSummaryCard } from '@/components/ops/stories-summary-card';

export const revalidate = 300; // 5 min cache

export default async function OpsPage() {
  const [health, kpis, fleet, production, funding, stories] = await Promise.all([
    getSystemHealth(),
    getImpactKPIs(),
    getFleetSummary(),
    getProductionSummary(),
    getFundingSummary(),
    getStoriesSummary(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-gray-500 mt-1">
          Live health of the whole operation — one page, every data source.
        </p>
      </div>

      {/* Section 1: System Health */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          System Health
        </h2>
        <SystemHealthStrip checks={health} />
      </section>

      {/* Section 2: Impact KPIs */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Impact KPIs
        </h2>
        <OpsKPIGrid kpis={kpis} />
      </section>

      {/* Section 3 & 4: Fleet + Production side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Fleet
          </h2>
          <FleetSummaryCard data={fleet} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Production
          </h2>
          <ProductionSummaryCard data={production} />
        </section>
      </div>

      {/* Section 5 & 6: Funding + Stories side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Funding & Revenue
          </h2>
          <FundingSummaryCard data={funding} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Stories & Community
          </h2>
          <StoriesSummaryCard data={stories} />
        </section>
      </div>
    </div>
  );
}
