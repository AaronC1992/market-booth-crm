import React, { useState } from 'react';
import { X, Phone, Mail, Calendar, DollarSign, FileText, Edit2, UserPlus, UserMinus, Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Booth } from '../../types';
import { useDark } from '../../context/DarkModeContext';
import { statusTextColors, statusLabel, paymentTextColors, paymentLabel, boothTypeLabel, formatCurrency, formatDate } from '../../utils/format';

interface BoothDetailProps {
  booth: Booth;
  onClose: () => void;
  onStatusChange?: (boothId: string, newStatus: Booth['status']) => void;
}

export default function BoothDetail({ booth, onClose, onStatusChange }: BoothDetailProps) {
  const { dark } = useDark();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      paid: '✓ Payment marked as received!',
      edit: '✎ Edit mode activated (mock)',
      assign: '+ Assign Vendor form opened (mock)',
      clear: '⚠ Booth cleared — vendor removed (mock)',
      print: '🖨 Print dialog opened (mock)',
    };
    showToast(messages[action] || 'Action completed');
    if (action === 'paid' && onStatusChange) {
      // mock update
    }
  };

  const bg = dark ? 'bg-slate-900' : 'bg-white';
  const border = dark ? 'border-slate-700' : 'border-slate-200';
  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className={`relative w-full max-w-md h-full overflow-y-auto shadow-2xl ${bg} border-l ${border} flex flex-col`}>
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-[60] bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg font-medium animate-bounce">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className={`flex items-start justify-between p-5 border-b ${border} sticky top-0 ${bg} z-10`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${text}`}>Booth {booth.number}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusTextColors[booth.status]}`}>{statusLabel[booth.status]}</span>
            </div>
            <div className={`text-sm mt-0.5 ${sub}`}>{booth.section} · {booth.boothSize} · {boothTypeLabel[booth.boothType]}</div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 space-y-5">
          {/* Rent & Payment */}
          <div className={`rounded-xl p-4 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Financials</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentTextColors[booth.paymentStatus]}`}>{paymentLabel[booth.paymentStatus]}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg p-1.5" />
              <div>
                <div className={`text-2xl font-bold ${text}`}>{formatCurrency(booth.monthlyRent)}</div>
                <div className={`text-xs ${sub}`}>per month</div>
              </div>
            </div>
          </div>

          {/* Vendor info */}
          {booth.vendorName ? (
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Vendor</div>
              <div className={`rounded-xl p-4 border space-y-2.5 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {booth.vendorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${text}`}>{booth.vendorName}</div>
                    <div className={`text-xs ${sub}`}>{booth.businessName}</div>
                  </div>
                </div>
                {booth.vendorPhone && (
                  <div className={`flex items-center gap-2 text-sm ${sub}`}>
                    <Phone className="w-3.5 h-3.5" /> {booth.vendorPhone}
                  </div>
                )}
                {booth.vendorEmail && (
                  <div className={`flex items-center gap-2 text-sm ${sub}`}>
                    <Mail className="w-3.5 h-3.5" /> {booth.vendorEmail}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl p-4 border text-center ${dark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              <UserPlus className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <div className="text-sm">No vendor assigned</div>
            </div>
          )}

          {/* Lease dates */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Lease</div>
            <div className={`rounded-xl p-4 border grid grid-cols-2 gap-3 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <div className={`text-xs ${sub} mb-0.5`}>Move-In Date</div>
                <div className={`text-sm font-medium ${text}`}><Calendar className="inline w-3 h-3 mr-1 mb-0.5" />{formatDate(booth.moveInDate)}</div>
              </div>
              <div>
                <div className={`text-xs ${sub} mb-0.5`}>Lease End</div>
                <div className={`text-sm font-medium ${text}`}><Calendar className="inline w-3 h-3 mr-1 mb-0.5" />{formatDate(booth.leaseEndDate)}</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booth.notes && (
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Notes</div>
              <div className={`rounded-xl p-4 border text-sm ${dark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <FileText className="inline w-3.5 h-3.5 mr-1.5 mb-0.5 opacity-50" />{booth.notes}
              </div>
            </div>
          )}

          {/* Status changer */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Change Status</div>
            <div className="flex flex-wrap gap-2">
              {(['open', 'booked', 'reserved', 'past_due', 'maintenance'] as Booth['status'][]).map(s => (
                <button
                  key={s}
                  onClick={() => { onStatusChange?.(booth.id, s); showToast(`Status changed to ${statusLabel[s]}`); }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${booth.status === s ? statusTextColors[s] + ' ring-2 ring-offset-1 ring-indigo-400' : dark ? 'border-slate-600 text-slate-400 hover:border-slate-400' : 'border-slate-300 text-slate-500 hover:border-slate-500'}`}
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`p-4 border-t ${border} grid grid-cols-2 gap-2`}>
          <button onClick={() => handleAction('paid')} className="flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors">
            <CheckCircle className="w-4 h-4" /> Mark Paid
          </button>
          <button onClick={() => handleAction('edit')} className="flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors">
            <Edit2 className="w-4 h-4" /> Edit Booth
          </button>
          <button onClick={() => handleAction('assign')} className={`flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg font-medium border transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            <UserPlus className="w-4 h-4" /> Assign Vendor
          </button>
          <button onClick={() => handleAction('print')} className={`flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg font-medium border transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            <Printer className="w-4 h-4" /> Print Agreement
          </button>
          {booth.vendorId && (
            <button onClick={() => handleAction('clear')} className="col-span-2 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium border border-red-200 transition-colors">
              <UserMinus className="w-4 h-4" /> Clear Booth / Remove Vendor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
