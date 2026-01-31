import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAmountFromStripe } from '@/lib/stripe';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch dashboard stats
  const [ordersResult, productsResult, recentOrdersResult] = await Promise.all([
    // Order stats
    supabase
      .from('orders')
      .select('status, total_cents', { count: 'exact' }),
    // Product count
    supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('is_active', true),
    // Recent orders
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const orders = ordersResult.data || [];
  const productCount = productsResult.count || 0;
  const recentOrders = recentOrdersResult.data || [];

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'processing'
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (o.total_cents || 0), 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      description: 'All time',
    },
    {
      title: 'Pending Fulfillment',
      value: pendingOrders,
      description: 'Need attention',
      highlight: pendingOrders > 0,
    },
    {
      title: 'Total Revenue',
      value: `$${formatAmountFromStripe(totalRevenue).toLocaleString()}`,
      description: 'AUD',
    },
    {
      title: 'Active Products',
      value: productCount,
      description: 'In catalog',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to the Goods on Country admin panel
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      {order.order_number}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {order.customer_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <span className="font-medium">
                      ${formatAmountFromStripe(order.total_cents)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/orders?status=paid">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Orders to Process</h3>
              <p className="text-sm text-gray-500 mt-1">
                View orders ready for fulfillment
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/products">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">Manage Products</h3>
              <p className="text-sm text-gray-500 mt-1">
                Update inventory and pricing
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/" target="_blank">
          <Card className="hover:border-orange-300 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-medium">View Storefront</h3>
              <p className="text-sm text-gray-500 mt-1">
                See your live website
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
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
