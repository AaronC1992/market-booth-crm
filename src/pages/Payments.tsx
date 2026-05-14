import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { payments, getStats } from '../data/mockData';
import { useDark } from '../context/DarkModeContext';
import { paymentTextColors, paymentLabel, formatCurrency, formatDate } from '../utils/format';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Search, Download } from 'lucide-react';

type FilterType = 'all' | 'paid' | 'due_soon' | 'past_due';

export default function Payments() {
  const { dark } = useDark();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const stats = getStats();
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = useMemo(() => {
    let p = payments;
    if (filter !== 'all') p = p.filter(x => x.paymentStatus === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      p = p.filter(x => x.vendorName.toLowerCase().includes(q) || x.boothNumber.toLowerCase().includes(q));
    }
    return p;
  }, [filter, search]);

  const totalPaid = payments.filter(p => p.paymentStatus === 'paid').reduce((a, b) => a + b.monthlyRent, 0);
  const totalPastDue = payments.filter(p => p.paymentStatus === 'past_due').reduce((a, b) => a + b.amountOwed, 0);
  const totalDueSoon = payments.filter(p => p.paymentStatus === 'due_soon').reduce((a, b) => a + b.amountOwed, 0);
  const paidCount = payments.filter(p => p.paymentStatus === 'paid').length;

  const bg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const text = dark ? 'text-white' : 'text-slate-900';
  const tableRow = dark ? 'border-slate-700 hover:bg-slate-700/40' : 'border-slate-100 hover:bg-slate-50';

  const FILTER_TABS: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: payments.length },
    { key: 'paid', label: 'Paid', count: payments.filter(p => p.paymentStatus === 'paid').length },
    { key: 'due_soon', label: 'Due Soon', count: payments.filter(p => p.paymentStatus === 'due_soon').length },
    { key: 'past_due', label: 'Past Due', count: payments.filter(p => p.paymentStatus === 'past_due').length },
  ];

  return (
    <Layout title="Payments" subtitle="Rent tracking and payment history for all booths">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium">{toast}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className={`rounded-xl border p-4 shadow-sm ${bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className={`text-xs font-medium ${subText}`}>Collected This Month</span>
          </div>
          <div className={`text-xl font-bold mt-1 ${text}`}>{formatCurrency(totalPaid)}</div>
          <div className={`text-xs mt-0.5 ${subText}`}>{paidCount} vendors paid</div>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className={`text-xs font-medium ${subText}`}>Due Soon</span>
          </div>
          <div className={`text-xl font-bold mt-1 text-amber-500`}>{formatCurrency(totalDueSoon)}</div>
          <div className={`text-xs mt-0.5 ${subText}`}>{payments.filter(p => p.paymentStatus === 'due_soon').length} vendors</div>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <span className={`text-xs font-medium ${subText}`}>Past Due</span>
          </div>
          <div className={`text-xl font-bold mt-1 text-red-500`}>{formatCurrency(totalPastDue)}</div>
          <div className={`text-xs mt-0.5 ${subText}`}>{stats.pastDue} booths overdue</div>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <span className={`text-xs font-medium ${subText}`}>Monthly Revenue Target</span>
          </div>
          <div className={`text-xl font-bold mt-1 ${text}`}>{formatCurrency(stats.potentialRevenue)}</div>
          <div className={`text-xs mt-0.5 text-emerald-500 font-medium`}>{stats.occupancyRate}% occupancy</div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className={`rounded-xl border shadow-sm mb-4 p-4 ${bg}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subText}`} />
            <input type="text" placeholder="Search vendor or booth…" value={search} onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`} />
          </div>
          <button onClick={() => showToast('Exporting payment report… (mock)')} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shrink-0">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="flex gap-1.5 mt-3">
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1 ${filter === t.key ? 'bg-indigo-600 text-white' : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t.label} <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === t.key ? 'bg-indigo-500' : dark ? 'bg-slate-600' : 'bg-slate-200'}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${bg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wide ${dark ? 'bg-slate-700/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <th className="text-left px-4 py-3 font-semibold">Vendor</th>
                <th className="text-left px-4 py-3 font-semibold">Booth</th>
                <th className="text-right px-4 py-3 font-semibold">Monthly Rent</th>
                <th className="text-right px-4 py-3 font-semibold">Amount Due</th>
                <th className="text-left px-4 py-3 font-semibold">Due Date</th>
                <th className="text-left px-4 py-3 font-semibold">Last Paid</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`border-b transition-colors ${tableRow}`}>
                  <td className={`px-4 py-3 font-medium ${text}`}>{p.vendorName}</td>
                  <td className={`px-4 py-3 ${subText}`}>{p.boothNumber}</td>
                  <td className={`px-4 py-3 text-right font-medium ${text}`}>{formatCurrency(p.monthlyRent)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.paymentStatus === 'past_due' ? 'text-red-500' : p.paymentStatus === 'due_soon' ? 'text-amber-500' : subText}`}>{p.amountOwed > 0 ? formatCurrency(p.amountOwed) : '—'}</td>
                  <td className={`px-4 py-3 ${subText}`}>{p.dueDate ? formatDate(p.dueDate) : '—'}</td>
                  <td className={`px-4 py-3 ${subText}`}>{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentTextColors[p.paymentStatus]}`}>{paymentLabel[p.paymentStatus]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => showToast(`Payment recorded for ${p.vendorName} (mock)`)} className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium transition-colors">
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className={`text-center py-12 ${subText}`}>No payments match your filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
