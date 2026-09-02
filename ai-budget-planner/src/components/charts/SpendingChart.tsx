'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EXPENSE_CATEGORIES } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SpendingChartProps {
  data: Record<string, number>;
  currency?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SpendingChart({ data, currency = 'ZAR' }: SpendingChartProps) {
  const chartData = Object.entries(data)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => {
      const catInfo = EXPENSE_CATEGORIES.find(c => c.value === category);
      return {
        name: catInfo?.label || category,
        value: amount,
        color: catInfo?.color || '#94a3b8',
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No spending data yet
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border border-slate-600/50 bg-slate-800 px-3 py-2 shadow-xl text-xs">
          <p className="font-semibold text-slate-200">{payload[0].name}</p>
          <p className="text-slate-400">{formatCurrency(payload[0].value, currency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
            iconSize={10}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
