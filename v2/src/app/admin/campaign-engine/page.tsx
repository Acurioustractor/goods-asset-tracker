import { Suspense } from 'react';
import {
  getCampaignStats,
  getScoredContacts,
  getPipelineContacts,
  getMomentumMetrics,
} from './actions';
import { CampaignDashboard } from './campaign-dashboard';

export const dynamic = 'force-dynamic';

export default async function CampaignEnginePage() {
  const [stats, contacts, pipeline, momentum] = await Promise.all([
    getCampaignStats().catch(() => null),
    getScoredContacts().catch(() => []),
    getPipelineContacts().catch(() => []),
    getMomentumMetrics().catch(() => null),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign Engine</h1>
        <p className="mt-1 text-sm text-gray-500">
          Engagement scoring, pipeline management, and outreach automation
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
        <CampaignDashboard
          stats={stats}
          contacts={contacts}
          pipeline={pipeline}
          momentum={momentum}
        />
      </Suspense>
    </div>
  );
}
