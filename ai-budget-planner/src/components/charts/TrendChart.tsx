'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { MonthlyTrend } from '@/types';
import { formatCurrency, getMonthYearLabel } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface TrendChartProps {
  data: MonthlyTrend[];
  currency?: string;
}

export default function TrendChart({ data, currency = 'ZAR' }: TrendChartProps) {
  const chartData = data.map(d => ({
    month: format(parseISO(`${d.month}-01`), 'MMM yy'),
    Income: d.income,
    Expenses: d.expenses,
    Saved: Math.max(0, d.income - d.expenses),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No trend data yet — add income and expenses to see your history.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border border-slate-600/50 bg-slate-800 px-3 py-2.5 shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-slate-400">{entry.name}</span>
              </span>
              <span className="font-medium text-slate-200">{formatCurrency(entry.value, currency)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={3} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${currency === 'ZAR' ? 'R' : '$'}${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Legend
            formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
            iconSize={10}
            iconType="circle"
          />
          <Bar dataKey="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Saved" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
