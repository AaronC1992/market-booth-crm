import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { useDark } from '../../context/DarkModeContext';
import { monthlyRevenueData, getStats } from '../../data/mockData';
import { formatCurrency } from '../../utils/format';

const OCCUPANCY_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

export function RevenueChart() {
  const { dark } = useDark();
  const gridColor = dark ? '#334155' : '#e2e8f0';
  const textColor = dark ? '#94a3b8' : '#64748b';

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
        <Tooltip
          contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: dark ? '#f1f5f9' : '#0f172a', fontWeight: 600 }}
          formatter={(v: number) => [formatCurrency(v)]}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
        <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
        <Area type="monotone" dataKey="potential" name="Potential Revenue" stroke="#10b981" strokeWidth={2} strokeDasharray="4 3" fill="url(#potGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart() {
  const { dark } = useDark();
  const stats = getStats();
  const data = [
    { name: 'Booked', value: stats.booked },
    { name: 'Open', value: stats.open },
    { name: 'Reserved', value: stats.reserved },
    { name: 'Past Due', value: stats.pastDue },
    { name: 'Maintenance', value: stats.maintenance },
  ];
  const textColor = dark ? '#94a3b8' : '#64748b';

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={OCCUPANCY_COLORS[i]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: textColor }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: OCCUPANCY_COLORS[i] }} />
            {d.name}: <span className="font-semibold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
