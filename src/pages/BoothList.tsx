import React, { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import BoothDetail from '../components/booths/BoothDetail';
import { booths as initialBooths } from '../data/mockData';
import type { Booth, BoothStatus } from '../types';
import { useDark } from '../context/DarkModeContext';
import {
  statusTextColors, statusLabel, paymentTextColors, paymentLabel, boothTypeLabel, formatCurrency, formatDate,
} from '../utils/format';
import { Search, ChevronUp, ChevronDown, Download, Printer, Plus } from 'lucide-react';

type SortKey = 'number' | 'monthlyRent' | 'status' | 'paymentStatus';

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'booked', label: 'Booked' },
  { key: 'reserved', label: 'Reserved' },
  { key: 'past_due', label: 'Past Due' },
  { key: 'maintenance', label: 'Maintenance' },
];

export default function BoothList() {
  const { dark } = useDark();
  const [booths, setBooths] = useState<Booth[]>(initialBooths);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Booth | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleStatusChange = (boothId: string, newStatus: BoothStatus) => {
    setBooths(prev => prev.map(b => b.id === boothId ? { ...b, status: newStatus } : b));
    setSelected(prev => prev?.id === boothId ? { ...prev, status: newStatus } : prev);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const filtered = useMemo(() => {
    let result = booths;
    if (filter !== 'all') result = result.filter(b => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.number.toLowerCase().includes(q) ||
        (b.vendorName?.toLowerCase().includes(q)) ||
        (b.businessName?.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      let va: string | number = a[sortKey] ?? '';
      let vb: string | number = b[sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [booths, filter, search, sortKey, sortDir]);

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />
      : <span className="w-3 h-3 inline-block ml-0.5 opacity-30">↕</span>;

  const border = dark ? 'border-slate-700' : 'border-slate-200';
  const rowHover = dark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50';
  const headBg = dark ? 'bg-slate-800' : 'bg-slate-50';
  const headText = dark ? 'text-slate-400' : 'text-slate-500';
  const cellText = dark ? 'text-slate-200' : 'text-slate-700';
  const subText = dark ? 'text-slate-500' : 'text-slate-400';

  return (
    <Layout title="Booth List" subtitle={`${filtered.length} of ${booths.length} booths`}>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium">{toast}</div>
      )}
      {selected && <BoothDetail booth={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}

      {/* Toolbar */}
      <div className={`rounded-xl border shadow-sm mb-4 p-4 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search booth, vendor, or business…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-2 shrink-0">
            <button onClick={() => showToast('Exporting CSV… (mock)')} className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border font-medium transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => showToast('Print dialog opened… (mock)')} className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border font-medium transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={() => showToast('New booth form opened… (mock)')} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Booth
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === tab.key ? 'bg-indigo-600 text-white' : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
              <span className={`ml-1.5 ${filter === tab.key ? 'opacity-75' : 'opacity-60'}`}>
                ({tab.key === 'all' ? booths.length : booths.filter(b => b.status === tab.key).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${headBg} border-b ${border}`}>
                {[
                  { label: 'Booth', key: 'number' as SortKey },
                  { label: 'Vendor / Business', key: null },
                  { label: 'Type', key: null },
                  { label: 'Status', key: 'status' as SortKey },
                  { label: 'Rent', key: 'monthlyRent' as SortKey },
                  { label: 'Payment', key: 'paymentStatus' as SortKey },
                  { label: 'Lease End', key: null },
                  { label: '', key: null },
                ].map(col => (
                  <th
                    key={col.label}
                    className={`text-left text-xs uppercase tracking-wider font-semibold px-4 py-3 ${headText} ${col.key ? 'cursor-pointer select-none hover:text-indigo-400' : ''}`}
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    {col.label}{col.key && <SortIcon k={col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(booth => (
                <tr key={booth.id} className={`border-b ${border} last:border-0 transition-colors ${rowHover}`}>
                  <td className="px-4 py-3">
                    <div className={`font-bold text-sm ${dark ? 'text-indigo-300' : 'text-indigo-700'}`}>{booth.number}</div>
                    <div className={`text-xs ${subText}`}>{booth.section}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${cellText} truncate max-w-[160px]`}>{booth.businessName || <span className="italic opacity-50">Vacant</span>}</div>
                    <div className={`text-xs ${subText} truncate max-w-[160px]`}>{booth.vendorName || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${subText}`}>{boothTypeLabel[booth.boothType]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusTextColors[booth.status]}`}>{statusLabel[booth.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${cellText}`}>{formatCurrency(booth.monthlyRent)}</span>
                    <span className={`text-xs ${subText}`}>/mo</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentTextColors[booth.paymentStatus]}`}>{paymentLabel[booth.paymentStatus]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${subText}`}>{formatDate(booth.leaseEndDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(booth)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 font-medium transition-colors whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={`text-center py-12 ${subText}`}>No booths match your search or filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
