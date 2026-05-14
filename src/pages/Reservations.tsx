import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { reservations } from '../data/mockData';
import { useDark } from '../context/DarkModeContext';
import { formatCurrency, formatDate } from '../utils/format';
import { CalendarDays, MapPin, User, Phone, Mail, DollarSign, RefreshCw, Plus } from 'lucide-react';

export default function Reservations() {
  const { dark } = useDark();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const newReservations = reservations.filter(r => !r.leaseRenewal);
  const renewals = reservations.filter(r => r.leaseRenewal);

  const bg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const text = dark ? 'text-white' : 'text-slate-900';
  const border = dark ? 'border-slate-700' : 'border-slate-200';

  function ReservationCard({ r }: { r: typeof reservations[0] }) {
    return (
      <div className={`rounded-xl border shadow-sm overflow-hidden ${bg}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${border} ${r.leaseRenewal ? (dark ? 'bg-purple-900/20' : 'bg-purple-50') : (dark ? 'bg-indigo-900/20' : 'bg-indigo-50')}`}>
          <div className="flex items-center gap-2">
            {r.leaseRenewal
              ? <RefreshCw className="w-4 h-4 text-purple-500" />
              : <CalendarDays className="w-4 h-4 text-indigo-500" />}
            <span className={`text-sm font-bold ${text}`}>
              {r.leaseRenewal ? 'Lease Renewal' : 'New Reservation'} — Booth {r.boothNumber}
            </span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.depositPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {r.leaseRenewal ? 'Renewal' : r.depositPaid ? 'Deposit Paid' : 'Deposit Pending'}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2.5">
          <div className={`flex items-center gap-2 text-sm font-medium ${text}`}><User className={`w-4 h-4 ${subText}`} />{r.futureVendorName} — {r.futureBusinessName}</div>
          <div className={`flex items-center gap-2 text-xs ${subText}`}><Phone className="w-3.5 h-3.5" />{r.futureVendorPhone}</div>
          <div className={`flex items-center gap-2 text-xs ${subText}`}><Mail className="w-3.5 h-3.5" />{r.futureVendorEmail}</div>
          <div className={`flex items-center gap-2 text-xs ${subText}`}><MapPin className="w-3.5 h-3.5" />Section: {r.section}</div>

          <div className={`grid grid-cols-2 gap-2 pt-1 border-t ${border}`}>
            <div>
              <div className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${subText}`}>Reserved On</div>
              <div className={`text-xs font-medium ${text}`}>{formatDate(r.reservationDate)}</div>
            </div>
            <div>
              <div className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${subText}`}>{r.leaseRenewal ? 'Renewal Date' : 'Move-In Date'}</div>
              <div className={`text-xs font-medium ${text}`}>{formatDate(r.moveInDate)}</div>
            </div>
            <div>
              <div className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${subText}`}>Monthly Rent</div>
              <div className={`text-xs font-medium text-emerald-500`}>{formatCurrency(r.monthlyRent)}</div>
            </div>
            {!r.leaseRenewal && (
              <div>
                <div className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${subText}`}>Deposit</div>
                <div className={`text-xs font-medium ${r.depositPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {formatCurrency(r.depositAmount)} {r.depositPaid ? '✓ Received' : '⚠ Pending'}
                </div>
              </div>
            )}
          </div>

          {r.notes && <div className={`text-xs italic pt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{r.notes}</div>}
        </div>

        {/* Actions */}
        <div className={`px-4 pb-4 flex gap-2`}>
          <button onClick={() => showToast(`Confirming ${r.futureVendorName}'s booking (mock)`)} className="flex-1 text-xs py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">Confirm</button>
          <button onClick={() => showToast(`Sending email to ${r.futureVendorEmail} (mock)`)} className={`flex-1 text-xs py-2 rounded-lg border font-medium transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Email Vendor</button>
          <button onClick={() => showToast(`Canceling reservation ${r.id} (mock)`)} className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 font-medium transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <Layout title="Reservations" subtitle="Upcoming move-ins and lease renewals">
      {toast && <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium">{toast}</div>}

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Upcoming', value: reservations.length, icon: CalendarDays, color: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600' },
          { label: 'New Move-Ins', value: newReservations.length, icon: User, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
          { label: 'Lease Renewals', value: renewals.length, icon: RefreshCw, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
          { label: 'Deposits Pending', value: reservations.filter(r => !r.depositPaid && !r.leaseRenewal).length, icon: DollarSign, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border shadow-sm p-4 flex items-center gap-3 ${bg}`}>
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${text}`}>{s.value}</div>
              <div className={`text-xs ${subText}`}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reservation button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => showToast('Opening new reservation form (mock)')} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Reservation
        </button>
      </div>

      {/* New Reservations */}
      {newReservations.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${subText}`}>New Reservations ({newReservations.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {newReservations.map(r => <ReservationCard key={r.id} r={r} />)}
          </div>
        </div>
      )}

      {/* Lease Renewals */}
      {renewals.length > 0 && (
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${subText}`}>Lease Renewals ({renewals.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {renewals.map(r => <ReservationCard key={r.id} r={r} />)}
          </div>
        </div>
      )}
    </Layout>
  );
}
