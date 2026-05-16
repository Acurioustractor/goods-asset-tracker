import { getCrmOverview } from './actions';
import { CrmDashboard } from './crm-dashboard';

export const dynamic = 'force-dynamic';

export default async function CrmPage() {
  const overview = await getCrmOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CRM & Pipelines</h1>
        <p className="mt-1 text-sm text-gray-500">
          Unified view of sales, funding, partnerships, and procurement pipelines
        </p>
      </div>
      <CrmDashboard overview={overview} />
    </div>
  );
}
