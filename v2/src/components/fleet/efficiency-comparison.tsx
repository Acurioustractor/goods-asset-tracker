'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';

interface MachineEfficiency {
  name: string;
  kwhPerCycle: number;
  isCurrent: boolean;
}

interface EfficiencyComparisonProps {
  machines: MachineEfficiency[];
  fleetMedian: number;
}

export function EfficiencyComparison({ machines, fleetMedian }: EfficiencyComparisonProps) {
  if (machines.length === 0) {
    return <p className="text-gray-500 text-center py-4">No efficiency data</p>;
  }

  const sorted = [...machines].sort((a, b) => a.kwhPerCycle - b.kwhPerCycle);

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" /> This machine
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-gray-300" /> Other machines
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-red-400" /> Fleet median
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" fontSize={11} tick={{ fill: '#6b7280' }} unit=" kWh" />
          <YAxis dataKey="name" type="category" fontSize={11} tick={{ fill: '#6b7280' }} width={100} />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(3)} kWh/cycle`]}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          />
          <ReferenceLine x={fleetMedian} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="kwhPerCycle" radius={[0, 4, 4, 0]} barSize={18}>
            {sorted.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isCurrent ? '#3b82f6' : '#d1d5db'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
