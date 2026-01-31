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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 mt-1">
            {count} total order{count !== 1 ? 's' : ''}
          </p>
        </div>
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
            <p className="text-gray-500 text-center py-8">No orders found</p>
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
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {order.order_number}
                        </Link>
                        {order.is_sponsorship && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800">
                            Sponsorship
                          </Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div>{order.customer_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">
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
                      <td className="py-4 text-sm text-gray-500">
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
              <span className="px-4 py-2 text-sm text-gray-500">
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
    pending: 'bg-gray-100 text-gray-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge className={variants[status] || variants.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
