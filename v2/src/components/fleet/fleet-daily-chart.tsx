'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface FleetDailyData {
  date: string;
  cycles: number;
  kwh: number;
  machines_active: number;
}

interface FleetDailyChartProps {
  data: FleetDailyData[];
}

export function FleetDailyChart({ data }: FleetDailyChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No fleet activity data available
      </p>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
    }),
    Cycles: d.cycles,
    'kWh': d.kwh,
    'Machines Active': d.machines_active,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} tick={{ fill: '#6b7280' }} />
        <YAxis yAxisId="left" fontSize={12} tick={{ fill: '#6b7280' }} />
        <YAxis yAxisId="right" orientation="right" fontSize={12} tick={{ fill: '#6b7280' }} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Bar
          yAxisId="left"
          dataKey="Cycles"
          fill="#3b82f6"
          radius={[3, 3, 0, 0]}
          barSize={24}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="kWh"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f59e0b' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
