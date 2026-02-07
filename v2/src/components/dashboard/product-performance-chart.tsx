'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import type { ProductPerformance } from '@/app/dashboard/actions';

interface ProductPerformanceChartProps {
  data: ProductPerformance[];
}

const COLORS = ['#171717', '#404040', '#737373', '#a3a3a3'];

export function ProductPerformanceChart({
  data,
}: ProductPerformanceChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        Product Performance
      </h2>

      {/* Summary Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200">
            <tr>
              <th className="text-left pb-2 font-semibold">Product</th>
              <th className="text-right pb-2 font-semibold">Orders</th>
              <th className="text-right pb-2 font-semibold">Units</th>
              <th className="text-right pb-2 font-semibold">Revenue</th>
              <th className="text-right pb-2 font-semibold">Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr key={product.product} className="border-b border-neutral-100">
                <td className="py-2 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {product.product}
                </td>
                <td className="py-2 text-right text-neutral-700">
                  {product.orders}
                </td>
                <td className="py-2 text-right text-neutral-700">
                  {product.units}
                </td>
                <td className="py-2 text-right text-neutral-700">
                  ${product.revenue.toFixed(2)}
                </td>
                <td className="py-2 text-right text-neutral-700">
                  ${(product.revenue / product.units).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="product" stroke="#737373" fontSize={12} />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) => value != null ? `$${value.toFixed(2)}` : '$0.00'}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
