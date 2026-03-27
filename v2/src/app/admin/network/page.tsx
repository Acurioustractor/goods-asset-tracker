import { Suspense } from 'react';
import { getNetworkOverview } from './actions';
import { NetworkDashboard } from './network-dashboard';

export const dynamic = 'force-dynamic';

export default async function NetworkPage() {
  const overview = await getNetworkOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Network</h1>
        <p className="mt-1 text-sm text-gray-500">
          Relationships, deals, and actions — everything in one place
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
        <NetworkDashboard overview={overview} />
      </Suspense>
    </div>
  );
}
