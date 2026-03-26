import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RequisitionForm } from './requisition-form';

export const dynamic = 'force-dynamic';

const STAGE_BADGES: Record<string, { label: string; className: string }> = {
  requested: { label: 'Requested', className: 'bg-blue-100 text-blue-800' },
  allocated: { label: 'Allocated', className: 'bg-yellow-100 text-yellow-800' },
  demo: { label: 'Demo', className: 'bg-purple-100 text-purple-800' },
  deployed: { label: 'Deployed', className: 'bg-green-100 text-green-800' },
  retired: { label: 'Retired', className: 'bg-gray-100 text-gray-800' },
};

export default async function RequisitionsPage() {
  const supabase = await createClient();

  // Get all pipeline entries in requested/allocated status (active requisitions)
  const { data: requisitions } = await supabase
    .from('assets')
    .select('unique_id, product, status, community, quantity, partner_name, notes, created_time')
    .in('status', ['requested', 'allocated'])
    .order('created_time', { ascending: false });

  // Get recently fulfilled (deployed in last 30 days)
  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: recentlyFulfilled } = await supabase
    .from('assets')
    .select('unique_id, product, status, community, quantity, partner_name, notes, created_time')
    .eq('status', 'deployed')
    .gte('created_time', thirtyDaysAgo)
    .order('created_time', { ascending: false })
    .limit(10);

  const pending = requisitions || [];
  const fulfilled = recentlyFulfilled || [];
  const totalUnits = pending.reduce((sum, r) => sum + (r.quantity || 1), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bed Requisitions</h1>
        <p className="text-gray-500 mt-1">
          {pending.length} active requisitions &middot; {totalUnits} units requested
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Requested', value: pending.filter((r) => r.status === 'requested').length },
          { label: 'Allocated', value: pending.filter((r) => r.status === 'allocated').length },
          { label: 'Total Units', value: totalUnits },
          { label: 'Recently Deployed', value: fulfilled.length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add new requisition */}
      <RequisitionForm />

      {/* Active requisitions table */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Active Requisitions</h2>
        {pending.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-gray-400">
              <p className="text-sm">No active requisitions. Add one above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">ID</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Community</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Qty</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Source / Partner</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map((r) => {
                  const stage = STAGE_BADGES[r.status] || { label: r.status, className: '' };
                  return (
                    <tr key={r.unique_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{r.unique_id}</td>
                      <td className="px-4 py-2.5 font-medium">{r.community || '—'}</td>
                      <td className="px-4 py-2.5">{r.product || 'Stretch Bed'}</td>
                      <td className="px-4 py-2.5">{r.quantity || 1}</td>
                      <td className="px-4 py-2.5 text-gray-500">{r.partner_name || '—'}</td>
                      <td className="px-4 py-2.5">
                        <Badge className={stage.className}>{stage.label}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">
                        {r.created_time
                          ? new Date(r.created_time).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 max-w-xs truncate">{r.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recently deployed */}
      {fulfilled.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Recently Deployed</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Community</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Qty</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fulfilled.map((r) => (
                  <tr key={r.unique_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{r.community || '—'}</td>
                    <td className="px-4 py-2.5">{r.product || 'Stretch Bed'}</td>
                    <td className="px-4 py-2.5">{r.quantity || 1}</td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {r.created_time
                        ? new Date(r.created_time).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
