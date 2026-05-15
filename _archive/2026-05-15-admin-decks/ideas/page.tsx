import { getAdminIdeas, getFeedbackStats } from './actions';
import { IdeasAdmin } from './ideas-admin';

export const dynamic = 'force-dynamic';

export default async function AdminIdeasPage() {
  const [ideas, stats] = await Promise.all([
    getAdminIdeas(),
    getFeedbackStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Ideas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review, moderate, and respond to community feedback and ideas.
        </p>
      </div>
      <IdeasAdmin ideas={ideas} stats={stats} />
    </div>
  );
}
