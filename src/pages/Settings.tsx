import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useDark } from '../context/DarkModeContext';
import { Moon, Sun, Store, DollarSign, Clock, Bell, Shield, FileText } from 'lucide-react';

const RENT_TYPES = [
  { label: 'Small Booth', base: 125 },
  { label: 'Standard Booth', base: 200 },
  { label: 'Corner Booth', base: 275 },
  { label: 'Front Wall Booth', base: 325 },
  { label: 'Food Court Booth', base: 400 },
  { label: 'Outdoor Spot', base: 75 },
];

export default function Settings() {
  const { dark, toggle } = useDark();
  const [toast, setToast] = useState<string | null>(null);
  const [calcType, setCalcType] = useState(0);
  const [calcMonths, setCalcMonths] = useState(12);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const bg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const text = dark ? 'text-white' : 'text-slate-900';
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`;
  const sectionTitle = `text-xs font-bold uppercase tracking-widest mb-3 ${subText}`;

  const calcTotal = RENT_TYPES[calcType].base * calcMonths;
  const calcDeposit = RENT_TYPES[calcType].base;

  return (
    <Layout title="Settings" subtitle="Market preferences and configuration">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium">{toast}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Appearance */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <h2 className={sectionTitle}>Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                {dark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${text}`}>Dark Mode</div>
                <div className={`text-xs ${subText}`}>Toggle light/dark interface</div>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dark ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Market Info */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <h2 className={sectionTitle}>Market Information</h2>
          <div className="space-y-3">
            {[
              { label: 'Market Name', value: 'Heritage Trade Mall' },
              { label: 'Owner / Manager', value: 'Market Owner' },
              { label: 'Address', value: '1234 Commerce Blvd, Nashville, TN 37201' },
              { label: 'Phone', value: '(615) 555-0100' },
              { label: 'Email', value: 'manager@heritagetrademall.com' },
            ].map(f => (
              <div key={f.label}>
                <label className={`text-xs font-medium mb-1 block ${subText}`}>{f.label}</label>
                <input defaultValue={f.value} className={inputCls} />
              </div>
            ))}
            <button onClick={() => showToast('Market info saved! (mock)')} className="mt-1 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Save Changes</button>
          </div>
        </div>

        {/* Rent Calculator */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h2 className={sectionTitle.replace('mb-3', '')}>Rent Calculator</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-medium mb-1 block ${subText}`}>Booth Type</label>
              <select value={calcType} onChange={e => setCalcType(Number(e.target.value))} className={inputCls}>
                {RENT_TYPES.map((t, i) => <option key={i} value={i}>{t.label} — ${t.base}/mo</option>)}
              </select>
            </div>
            <div>
              <label className={`text-xs font-medium mb-1 block ${subText}`}>Lease Term (months)</label>
              <input type="number" min={1} max={36} value={calcMonths} onChange={e => setCalcMonths(Number(e.target.value))} className={inputCls} />
            </div>
            <div className={`rounded-lg p-4 mt-2 ${dark ? 'bg-slate-700' : 'bg-slate-50'} border ${dark ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex justify-between text-sm mb-1">
                <span className={subText}>Monthly Rent</span>
                <span className={`font-semibold ${text}`}>${RENT_TYPES[calcType].base.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className={subText}>Security Deposit</span>
                <span className={`font-semibold ${text}`}>${calcDeposit.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-sm font-bold mt-2 pt-2 border-t ${dark ? 'border-slate-600' : 'border-slate-200'}`}>
                <span className={text}>Total for {calcMonths}mo + deposit</span>
                <span className="text-emerald-500">${(calcTotal + calcDeposit).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h2 className={sectionTitle.replace('mb-3', '')}>Business Hours</h2>
          </div>
          <div className="space-y-2">
            {[
              { day: 'Monday – Friday', hours: '10:00 AM – 6:00 PM' },
              { day: 'Saturday', hours: '9:00 AM – 7:00 PM' },
              { day: 'Sunday', hours: '11:00 AM – 5:00 PM' },
            ].map(h => (
              <div key={h.day} className="flex items-center justify-between gap-2">
                <span className={`text-xs font-medium w-36 shrink-0 ${subText}`}>{h.day}</span>
                <input defaultValue={h.hours} className={`${inputCls} flex-1`} />
              </div>
            ))}
            <button onClick={() => showToast('Business hours saved! (mock)')} className="mt-1 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Save Hours</button>
          </div>
        </div>

        {/* Notifications */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className={sectionTitle.replace('mb-3', '')}>Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email alerts for past-due rent', defaultOn: true },
              { label: 'Email reminders 3 days before due date', defaultOn: true },
              { label: 'New reservation notifications', defaultOn: true },
              { label: 'Monthly revenue summary email', defaultOn: false },
              { label: 'Lease renewal reminders (30 days out)', defaultOn: true },
            ].map(n => {
              const [on, setOn] = useState(n.defaultOn);
              return (
                <div key={n.label} className="flex items-center justify-between">
                  <span className={`text-sm ${text}`}>{n.label}</span>
                  <button onClick={() => setOn(v => !v)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? 'bg-indigo-600' : dark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* About / Demo */}
        <div className={`rounded-xl border shadow-sm p-5 ${bg}`}>
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-indigo-400" />
            <h2 className={sectionTitle.replace('mb-3', '')}>About This CRM</h2>
          </div>
          <div className={`space-y-2 text-sm ${subText}`}>
            <p>Market Booth CRM is a demo application for managing flea market and indoor vendor mall booth rentals.</p>
            <p className="text-xs">All data is fictional and for demonstration purposes only. No real vendors, payments, or transactions are represented.</p>
            <div className={`rounded-lg p-3 mt-2 text-xs ${dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border`}>
              <div className="font-semibold mb-1 text-indigo-500">Demo CRM v1.0</div>
              <div>Built with React · TypeScript · Tailwind CSS v4 · Recharts</div>
              <div className="mt-1 text-emerald-500 font-medium">Portfolio project — not a production application</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
