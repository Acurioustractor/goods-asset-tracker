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
import type { DailyMachineRollup } from '@/lib/types/database';

interface MachineTimeseriesChartProps {
  data: DailyMachineRollup[];
}

export function MachineTimeseriesChart({ data }: MachineTimeseriesChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No telemetry data yet
      </p>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.rollup_date).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
    }),
    cycles: d.cycles,
    kwh: Number(d.kwh_used),
    kwhPerCycle: Number(d.avg_kwh_per_cycle),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis yAxisId="left" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="cycles"
          fill="#3b82f6"
          name="Cycles"
          radius={[2, 2, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="kwh"
          stroke="#f59e0b"
          strokeWidth={2}
          name="kWh"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
