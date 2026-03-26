import { Suspense } from 'react';
import { getSupportersOverview } from './actions';
import { SupportersDashboard } from './supporters-dashboard';

export const dynamic = 'force-dynamic';

export default async function SupportersPage() {
  const overview = await getSupportersOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supporters Network</h1>
        <p className="mt-1 text-sm text-gray-500">
          LinkedIn commenters, Gmail contacts, and warm leads — all synced to GHL
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
        <SupportersDashboard overview={overview} />
      </Suspense>
    </div>
  );
}
