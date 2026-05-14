import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { vendors } from '../data/mockData';
import { useDark } from '../context/DarkModeContext';
import { paymentTextColors, paymentLabel, formatCurrency } from '../utils/format';
import { Search, Plus, Phone, Mail, Store, Tag, X } from 'lucide-react';

const CATEGORIES = ['All', 'Antiques', 'Collectibles', 'Handmade Crafts', 'Food', 'Clothing', 'Tools', 'Furniture', 'Sports Cards', 'Baked Goods', 'Candles', 'Jewelry', 'Books / Media', 'Electronics', 'Farmhouse Decor', 'Kitchen / Household', 'Outdoor / Garden', 'Pet Supplies'];

export default function Vendors() {
  const { dark } = useDark();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = useMemo(() => {
    let v = vendors;
    if (category !== 'All') v = v.filter(x => x.productCategory === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      v = v.filter(x => x.name.toLowerCase().includes(q) || x.businessName.toLowerCase().includes(q) || x.boothNumber?.toLowerCase().includes(q));
    }
    return v;
  }, [search, category]);

  const border = dark ? 'border-slate-700' : 'border-slate-200';
  const bg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const text = dark ? 'text-white' : 'text-slate-900';

  return (
    <Layout title="Vendors" subtitle={`${filtered.length} of ${vendors.length} vendors`}>
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium">{toast}</div>}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className={`relative z-10 w-full max-w-lg rounded-2xl shadow-2xl p-6 ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${text}`}>Add New Vendor</h3>
              <button onClick={() => setShowAddModal(false)} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {['Vendor Name', 'Business Name', 'Phone', 'Email', 'Products Sold'].map(f => (
                <div key={f}>
                  <label className={`text-xs font-medium mb-1 block ${subText}`}>{f}</label>
                  <input className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`} placeholder={f} />
                </div>
              ))}
              <div>
                <label className={`text-xs font-medium mb-1 block ${subText}`}>Assign Booth</label>
                <select className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                  <option>— Select Booth —</option>
                  <option>E4 (Standard $200/mo)</option>
                  <option>F2 (Standard $200/mo)</option>
                  <option>FW2 (Front Wall $325/mo)</option>
                  <option>FW4 (Front Wall $325/mo)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setShowAddModal(false); showToast('New vendor added! (mock)'); }} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Save Vendor</button>
              <button onClick={() => setShowAddModal(false)} className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className={`rounded-xl border shadow-sm mb-4 p-4 ${bg}`}>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subText}`} />
            <input
              type="text"
              placeholder="Search vendor, business, or booth…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.slice(0, 12).map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${category === c ? 'bg-indigo-600 text-white' : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(v => (
          <div key={v.id} className={`rounded-xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${bg}`}>
            <div className={`flex items-center gap-3 p-4 border-b ${border}`}>
              <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${text}`}>{v.name}</div>
                <div className={`text-xs truncate ${subText}`}>{v.businessName}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${paymentTextColors[v.paymentStatus]}`}>{paymentLabel[v.paymentStatus]}</span>
            </div>
            <div className="p-4 space-y-2">
              <div className={`flex items-center gap-2 text-xs ${subText}`}><Phone className="w-3.5 h-3.5 shrink-0" />{v.phone}</div>
              <div className={`flex items-center gap-2 text-xs ${subText}`}><Mail className="w-3.5 h-3.5 shrink-0" />{v.email}</div>
              <div className={`flex items-center gap-2 text-xs ${subText}`}><Store className="w-3.5 h-3.5 shrink-0" />Booth {v.boothNumber} · {formatCurrency(v.monthlyRent)}/mo</div>
              <div className={`flex items-center gap-2 text-xs ${subText}`}><Tag className="w-3.5 h-3.5 shrink-0" />{v.productCategory}</div>
              {v.notes && <div className={`text-xs mt-1 italic ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{v.notes}</div>}
            </div>
            <div className={`px-4 pb-4 flex gap-2`}>
              <button onClick={() => showToast(`Viewing ${v.name}'s profile (mock)`)} className="flex-1 text-xs py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 font-medium transition-colors">View Profile</button>
              <button onClick={() => showToast(`Edit form for ${v.name} (mock)`)} className={`flex-1 text-xs py-2 rounded-lg border font-medium transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Edit</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={`col-span-3 text-center py-16 ${subText}`}>No vendors match your search.</div>
        )}
      </div>
    </Layout>
  );
}
