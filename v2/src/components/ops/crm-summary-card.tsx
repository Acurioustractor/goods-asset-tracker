import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CRMSummary } from '@/app/admin/ops/actions';

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

// Map tags to readable labels
function tagLabel(tag: string): string {
  return tag
    .replace('goods-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CRMSummaryCard({ data }: { data: CRMSummary }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">CRM & Engagement</h3>
          <Link href="/admin/partners" className="text-xs text-orange-600 hover:underline">
            View all →
          </Link>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Contacts</p>
            <p className="text-2xl font-bold">{data.totalContacts.toLocaleString()}</p>
            <p className="text-xs text-gray-400">in GoHighLevel</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Goods Tagged</p>
            <p className="text-2xl font-bold">{data.goodsTaggedContacts}</p>
            <p className="text-xs text-gray-400">
              {data.totalContacts > 0
                ? `${Math.round((data.goodsTaggedContacts / data.totalContacts) * 100)}% of contacts`
                : 'no contacts'}
            </p>
          </div>
        </div>

        {/* Tag breakdown */}
        {data.tagBreakdown.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Top Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {data.tagBreakdown.slice(0, 8).map((t) => (
                <Badge key={t.tag} variant="outline" className="text-xs font-normal">
                  {tagLabel(t.tag)} <span className="ml-1 text-gray-400">{t.count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source breakdown */}
        {data.sourceBreakdown.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contact Sources</p>
            <div className="space-y-1.5">
              {data.sourceBreakdown.slice(0, 5).map((s) => (
                <div key={s.source} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[200px]">{s.source}</span>
                  <span className="font-medium tabular-nums text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent goods contacts */}
        {data.recentContacts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recent Goods Contacts</p>
            <div className="space-y-2">
              {data.recentContacts.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate max-w-[150px]">{c.name}</span>
                    {c.tags[0] && (
                      <Badge variant="outline" className="text-[10px] font-normal shrink-0">
                        {tagLabel(c.tags[0])}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatRelative(c.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
