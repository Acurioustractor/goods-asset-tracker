'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface Bucket {
  bucket: string;        // ISO string at hour granularity
  scans: number;
  bots: number;
  admin: number;
}

export function ScansTimeChart({ data }: { data: Bucket[] }) {
  if (data.length === 0) {
    return (
      <p className="text-center py-12 text-sm text-muted-foreground">
        No scans yet. The chart will populate as people open bed pages.
      </p>
    );
  }

  const chartData = data.map((d) => ({
    label: new Date(d.bucket).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
    }),
    Scans: d.scans,
    Bots: d.bots,
    'Admin views': d.admin,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" fontSize={11} tick={{ fill: '#6b7280' }} interval="preserveStartEnd" />
        <YAxis fontSize={12} tick={{ fill: '#6b7280' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Bar dataKey="Scans" stackId="a" fill="#059669" />
        <Bar dataKey="Bots" stackId="a" fill="#cbd5e1" />
        <Bar dataKey="Admin views" stackId="a" fill="#fbbf24" />
      </BarChart>
    </ResponsiveContainer>
  );
}
