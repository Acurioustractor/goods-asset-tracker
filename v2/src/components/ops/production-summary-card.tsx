import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProductionSummary } from '@/app/admin/ops/actions';

const DIESEL_STYLES: Record<string, string> = {
  low: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  full: 'bg-green-100 text-green-800',
};

export function ProductionSummaryCard({ data }: { data: ProductionSummary }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Production Status</h3>
          <Link href="/admin/production" className="text-sm text-blue-600 hover:underline">
            Full view &rarr;
          </Link>
        </div>

        {/* Latest shift */}
        {data.latestShift ? (
          <div className="rounded-lg bg-gray-50 p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Latest Shift</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{data.latestShift.operator}</p>
                <p className="text-sm text-gray-500">
                  {new Date(data.latestShift.date + 'T00:00:00').toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums">{data.latestShift.sheetsProduced}</p>
                <p className="text-xs text-gray-500">sheets</p>
              </div>
              <Badge
                variant="outline"
                className={DIESEL_STYLES[data.latestShift.dieselLevel] || ''}
              >
                Diesel: {data.latestShift.dieselLevel}
              </Badge>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-4">No shifts logged yet.</p>
        )}

        {/* Inventory position */}
        {data.inventory ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">Beds Possible</p>
              <p className="text-2xl font-bold tabular-nums">{data.inventory.bedsPossible}</p>
            </div>
            {data.inventory.bottleneck && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                Bottleneck: {data.inventory.bottleneck}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(data.inventory.components).map(([name, count]) => (
                <div key={name} className="flex justify-between text-sm">
                  <span className="text-gray-500">{name}</span>
                  <span className="font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Counted{' '}
              {new Date(data.inventory.snapshotDate + 'T00:00:00').toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No inventory snapshots yet.</p>
        )}

        {/* Open issues */}
        {data.openIssues > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {data.openIssues} open issue{data.openIssues !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
