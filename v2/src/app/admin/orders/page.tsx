import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatAmountFromStripe } from '@/lib/stripe';

interface SearchParams {
  status?: string;
  page?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const statusFilter = params.status;
  const page = parseInt(params.page || '1', 10);
  const pageSize = 20;

  // Build query
  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: orders, count, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">
            {count} total order{count !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/orders/launch-checklist"
          className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
        >
          Stripe launch checklist →
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Link
            key={option.value}
            href={option.value ? `/admin/orders?status=${option.value}` : '/admin/orders'}
          >
            <Button
              variant={statusFilter === option.value || (!statusFilter && !option.value) ? 'default' : 'outline'}
              size="sm"
            >
              {option.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter
              ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`
              : 'All Orders'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {order.order_number}
                        </Link>
                        {order.is_sponsorship && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800">
                            Sponsorship
                          </Badge>
                        )}
                        {order.is_sponsorship && order.sponsor_message && (
                          <span
                            className="ml-1 inline-flex items-center gap-1 align-middle text-xs text-amber-700"
                            title={`Dedication: "${order.sponsor_message}"`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Has dedication
                          </span>
                        )}
                        {order.is_sponsorship && order.sponsored_community && (
                          <span className="ml-1 align-middle text-xs text-muted-foreground">
                            → {order.sponsored_community}
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <div>{order.customer_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer_email}
                        </div>
                      </td>
                      <td className="py-4">
                        {order.order_items?.length || 0} item
                        {(order.order_items?.length || 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 font-medium">
                        ${formatAmountFromStripe(order.total_cents)}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {page > 1 && (
                <Link
                  href={`/admin/orders?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                >
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/admin/orders?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
                >
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-muted text-foreground',
    paid: 'bg-primary/10 text-primary',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-muted text-foreground',
  };

  return (
    <Badge className={variants[status] || variants.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
