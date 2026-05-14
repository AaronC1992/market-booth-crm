import React from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import { RevenueChart, OccupancyChart } from '../components/dashboard/Charts';
import {
  Store, CheckCircle, Circle, Clock, AlertTriangle, DollarSign, TrendingUp, Users, Wrench,
} from 'lucide-react';
import { booths, vendors, getStats } from '../data/mockData';
import { formatCurrency, statusTextColors, statusLabel, paymentTextColors, paymentLabel } from '../utils/format';
import { useDark } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const stats = getStats();
  const { dark } = useDark();
  const navigate = useNavigate();

  const recentBooths = [...booths]
    .filter(b => b.moveInDate)
    .sort((a, b) => new Date(b.moveInDate!).getTime() - new Date(a.moveInDate!).getTime())
    .slice(0, 5);

  const pastDueVendors = vendors.filter(v => v.paymentStatus === 'past_due');

  return (
    <Layout title="Dashboard" subtitle="Sunshine Indoor Market — Overview">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Booths" value={stats.total} icon={Store} color="bg-indigo-500" sub="All units in building" />
        <StatCard label="Booked Booths" value={stats.booked} icon={CheckCircle} color="bg-blue-500" sub={`${stats.occupancyRate}% occupancy rate`} />
        <StatCard label="Open Booths" value={stats.open} icon={Circle} color="bg-emerald-500" sub="Available to rent" />
        <StatCard label="Reserved" value={stats.reserved} icon={Clock} color="bg-amber-500" sub="Pending move-in" />
        <StatCard label="Past Due Booths" value={stats.pastDue} icon={AlertTriangle} color="bg-red-500" sub="Needs follow-up" alert />
        <StatCard label="Maintenance" value={stats.maintenance} icon={Wrench} color="bg-slate-500" sub="Out of service" />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={DollarSign} color="bg-indigo-600" sub="Current booked booths" />
        <StatCard label="Potential Revenue" value={formatCurrency(stats.potentialRevenue)} icon={TrendingUp} color="bg-emerald-600" sub="If all booths rented" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className={`lg:col-span-2 rounded-xl p-5 border shadow-sm ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-sm font-semibold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>Monthly Revenue vs. Potential</div>
          <RevenueChart />
        </div>
        <div className={`rounded-xl p-5 border shadow-sm ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-sm font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Occupancy Breakdown</div>
          <div className={`text-3xl font-bold mb-1 text-indigo-500`}>{stats.occupancyRate}%</div>
          <div className={`text-xs mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Occupancy rate</div>
          <OccupancyChart />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Past due */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center justify-between px-5 py-3.5 border-b ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
            <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle className="inline w-4 h-4 text-red-500 mr-1.5 mb-0.5" />Past Due Vendors
            </span>
            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{pastDueVendors.length}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pastDueVendors.map(v => (
              <div key={v.id} className="flex items-center px-5 py-3 gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{v.name}</div>
                  <div className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{v.businessName} · Booth {v.boothNumber}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-red-500">{formatCurrency(v.monthlyRent * 2)}</div>
                  <div className="text-xs text-slate-400">owed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent booths */}
        <div className={`rounded-xl border shadow-sm overflow-hidden ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center justify-between px-5 py-3.5 border-b ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
            <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Recently Active Booths</span>
            <button onClick={() => navigate('/booths')} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View all</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentBooths.map(b => (
              <div key={b.id} className="flex items-center px-5 py-3 gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${dark ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  {b.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{b.businessName || 'Vacant'}</div>
                  <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{b.section} · {b.boothSize}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusTextColors[b.status]}`}>{statusLabel[b.status]}</span>
                  <span className={`text-xs font-semibold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{formatCurrency(b.monthlyRent)}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
