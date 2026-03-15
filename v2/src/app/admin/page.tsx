import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminKPIs, getPipelineAssets, getRecentActivity } from './actions';
import type { AssetStatus } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [kpis, pipeline, activity] = await Promise.all([
    getAdminKPIs(),
    getPipelineAssets(),
    getRecentActivity(),
  ]);

  const stats = [
    {
      title: 'Beds Deployed',
      value: kpis.bedsDeployed,
      description: 'In communities',
    },
    {
      title: 'Beds in Pipeline',
      value: kpis.bedsInPipeline,
      description: 'Requested + allocated',
      highlight: kpis.bedsInPipeline > 0,
    },
    {
      title: 'Communities Served',
      value: kpis.communitiesServed,
      description: 'Distinct locations',
    },
    {
      title: 'Trade Revenue',
      value: kpis.totalRevenue > 0 ? `$${kpis.totalRevenue.toLocaleString()}` : '$0',
      description: 'AUD from orders',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Goods on Country operations overview
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${stat.highlight ? 'text-orange-600' : ''}`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bed Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Bed Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          {pipeline.length === 0 ? (
            <p className="text-gray-500 text-sm">No beds in pipeline</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Community</th>
                    <th className="pb-2 font-medium text-right">Qty</th>
                    <th className="pb-2 font-medium">Partner</th>
                    <th className="pb-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((entry) => (
                    <tr key={entry.unique_id} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{entry.unique_id}</td>
                      <td className="py-2">
                        <StatusBadge status={entry.status as AssetStatus} />
                      </td>
                      <td className="py-2">{entry.community}</td>
                      <td className="py-2 text-right font-medium">{entry.quantity}</td>
                      <td className="py-2 text-gray-600">{entry.partner_name || '—'}</td>
                      <td className="py-2 text-gray-500 text-xs max-w-[200px] truncate">
                        {entry.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {activity.map((event, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase text-gray-400 w-20">
                      {event.type}
                    </span>
                    <span className="text-sm">{event.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatRelativeDate(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/ops">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Ops Dashboard</h3>
              <p className="text-sm text-gray-500 mt-1">
                Operations overview
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/economics">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer bg-orange-50/50">
            <CardContent className="pt-6">
              <h3 className="font-medium">Unit Economics</h3>
              <p className="text-sm text-gray-500 mt-1">
                First-Principles Models
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/fleet">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Fleet</h3>
              <p className="text-sm text-gray-500 mt-1">
                Washing machine telemetry
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/production">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Production</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manufacturing shifts
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/" target="_blank">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Storefront</h3>
              <p className="text-sm text-gray-500 mt-1">
                View live website
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AssetStatus | string }) {
  const variants: Record<string, string> = {
    requested: 'bg-blue-100 text-blue-800',
    allocated: 'bg-yellow-100 text-yellow-800',
    demo: 'bg-purple-100 text-purple-800',
    deployed: 'bg-green-100 text-green-800',
    retired: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}
