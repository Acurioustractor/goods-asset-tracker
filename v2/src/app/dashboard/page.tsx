import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { KPICard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ProductPerformanceChart } from '@/components/dashboard/product-performance-chart';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  getMetrics,
  getRevenueData,
  getProductPerformance,
  getGeographicData,
  getInventoryStatus,
} from './actions';
import { DollarSignIcon, ShoppingCartIcon, TrendingUpIcon } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Goods on Country',
  description: 'Business intelligence dashboard for Goods on Country',
};

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [metrics, revenueData, productPerformance, geographicData, inventory] =
    await Promise.all([
      getMetrics(),
      getRevenueData(30),
      getProductPerformance(),
      getGeographicData(),
      getInventoryStatus(),
    ]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Business Dashboard
          </h1>
          <p className="text-neutral-600 mt-1">
            Real-time metrics and insights for Goods on Country
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toFixed(2)}`}
            subtitle="All time"
            icon={<DollarSignIcon className="w-8 h-8" />}
          />
          <KPICard
            title="Total Orders"
            value={metrics.totalOrders}
            subtitle={`${metrics.ordersThisMonth} this month`}
            icon={<ShoppingCartIcon className="w-8 h-8" />}
          />
          <KPICard
            title="Average Order Value"
            value={`$${metrics.averageOrderValue.toFixed(2)}`}
            subtitle="Per order"
            icon={<TrendingUpIcon className="w-8 h-8" />}
          />
          <KPICard
            title="Monthly Revenue"
            value={`$${metrics.revenueThisMonth.toFixed(2)}`}
            subtitle="Current month"
            trend={{
              value: metrics.growthRate,
              label: 'vs last month',
            }}
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-8">
          <Suspense fallback={<LoadingCard />}>
            <RevenueChart data={revenueData} />
          </Suspense>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Performance */}
          <Suspense fallback={<LoadingCard />}>
            <ProductPerformanceChart data={productPerformance} />
          </Suspense>

          {/* Geographic Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Geographic Distribution
            </h2>
            <div className="space-y-3">
              {geographicData.length === 0 ? (
                <p className="text-neutral-500 text-sm">No data available</p>
              ) : (
                geographicData.map((location) => (
                  <div
                    key={location.state}
                    className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-neutral-900">
                        {location.state}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {location.orders} orders · {location.customers}{' '}
                        customers
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-neutral-900">
                        ${location.revenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Inventory Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Inventory Status
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="text-left pb-3 font-semibold">Product</th>
                  <th className="text-right pb-3 font-semibold">In Stock</th>
                  <th className="text-right pb-3 font-semibold">Reserved</th>
                  <th className="text-right pb-3 font-semibold">Available</th>
                  <th className="text-right pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-neutral-500">
                      No inventory data available
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr
                      key={item.product}
                      className="border-b border-neutral-100"
                    >
                      <td className="py-3">{item.product}</td>
                      <td className="py-3 text-right text-neutral-700">
                        {item.inStock}
                      </td>
                      <td className="py-3 text-right text-neutral-700">
                        {item.reserved}
                      </td>
                      <td className="py-3 text-right text-neutral-700">
                        {item.available}
                      </td>
                      <td className="py-3 text-right">
                        {item.lowStockAlert ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          Dashboard data refreshes every 5 minutes
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

function LoadingCard() {
  return (
    <Card className="p-6 h-96 flex items-center justify-center">
      <div className="animate-pulse text-neutral-400">Loading...</div>
    </Card>
  );
}
