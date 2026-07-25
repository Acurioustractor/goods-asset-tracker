import { getBrandStats, getAllPosts } from './actions';
import { BrandDashboard } from './brand-dashboard';

export const dynamic = 'force-dynamic';

export default async function BrandPage() {
  const [stats, posts] = await Promise.all([
    getBrandStats(),
    getAllPosts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brand & Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          LinkedIn post tracking, brand strategy analysis, and content performance
        </p>
      </div>
      <BrandDashboard stats={stats} posts={posts} />
    </div>
  );
}
