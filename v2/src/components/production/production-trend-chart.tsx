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

interface ShiftData {
  shift_date: string;
  sheets_produced: number;
  plastic_shredded_kg: number;
}

interface ProductionTrendChartProps {
  data: ShiftData[];
}

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No production data available yet.
      </p>
    );
  }

  // Aggregate by date (multiple shifts per day)
  const byDate = new Map<string, { sheets: number; kg: number }>();
  for (const shift of data) {
    const existing = byDate.get(shift.shift_date) || { sheets: 0, kg: 0 };
    existing.sheets += shift.sheets_produced;
    existing.kg += shift.plastic_shredded_kg;
    byDate.set(shift.shift_date, existing);
  }

  const chartData = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date: new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
      }),
      Sheets: vals.sheets,
      'Plastic (kg)': vals.kg,
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
          dataKey="Sheets"
          fill="#16a34a"
          radius={[3, 3, 0, 0]}
          barSize={24}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Plastic (kg)"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f59e0b' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
