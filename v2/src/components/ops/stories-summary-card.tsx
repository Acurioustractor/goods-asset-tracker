import { Card, CardContent } from '@/components/ui/card';
import type { StoriesSummary } from '@/app/admin/ops/actions';

export function StoriesSummaryCard({ data }: { data: StoriesSummary }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Stories & Community Voice</h3>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Storytellers</p>
            <p className="text-xl font-bold">{data.storytellerCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Published</p>
            <p className="text-xl font-bold">{data.storyCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Syndication</p>
            <p className="text-xl font-bold">{data.syndicationEnabledCount}</p>
          </div>
        </div>

        {data.latestStory && (
          <div className="rounded-lg bg-gray-50 p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Latest Story</p>
            <p className="font-medium text-sm">{data.latestStory.title}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(data.latestStory.date).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Community Ideas */}
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Community Ideas</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{data.communityIdeas.submitted}</p>
              <p className="text-xs text-gray-500">Submitted</p>
            </div>
            <div>
              <p className="text-lg font-bold">{data.communityIdeas.inProgress}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div>
              <p className="text-lg font-bold">{data.communityIdeas.completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
