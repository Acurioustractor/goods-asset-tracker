import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RequisitionForm } from './requisition-form';

export const dynamic = 'force-dynamic';

const STAGE_BADGES: Record<string, { label: string; className: string }> = {
  requested: { label: 'Requested', className: 'bg-primary/10 text-primary' },
  allocated: { label: 'Allocated', className: 'bg-yellow-100 text-yellow-800' },
  demo: { label: 'Demo', className: 'bg-purple-100 text-purple-800' },
  deployed: { label: 'Deployed', className: 'bg-green-100 text-green-800' },
  retired: { label: 'Retired', className: 'bg-muted text-foreground' },
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
        <h1 className="font-display text-2xl font-bold tracking-tight">Bed Requisitions</h1>
        <p className="text-muted-foreground mt-1">
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add new requisition */}
      <RequisitionForm />

      {/* Active requisitions table */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Active Requisitions</h2>
        {pending.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No active requisitions. Add one above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Community</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Qty</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Source / Partner</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pending.map((r) => {
                  const stage = STAGE_BADGES[r.status] || { label: r.status, className: '' };
                  return (
                    <tr key={r.unique_id} className="hover:bg-muted">
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.unique_id}</td>
                      <td className="px-4 py-2.5 font-medium">{r.community || '—'}</td>
                      <td className="px-4 py-2.5">{r.product || 'Stretch Bed'}</td>
                      <td className="px-4 py-2.5">{r.quantity || 1}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.partner_name || '—'}</td>
                      <td className="px-4 py-2.5">
                        <Badge className={stage.className}>{stage.label}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {r.created_time
                          ? new Date(r.created_time).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground max-w-xs truncate">{r.notes || '—'}</td>
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
          <h2 className="font-display text-lg font-semibold mb-3">Recently Deployed</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Community</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Qty</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fulfilled.map((r) => (
                  <tr key={r.unique_id} className="hover:bg-muted">
                    <td className="px-4 py-2.5 font-medium">{r.community || '—'}</td>
                    <td className="px-4 py-2.5">{r.product || 'Stretch Bed'}</td>
                    <td className="px-4 py-2.5">{r.quantity || 1}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
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
