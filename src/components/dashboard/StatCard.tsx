import { useDark } from '../../context/DarkModeContext';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  sub?: string;
  alert?: boolean;
}

export default function StatCard({ label, value, icon: Icon, color, sub, alert }: StatCardProps) {
  const { dark } = useDark();
  return (
    <div className={`rounded-xl p-5 border flex items-start gap-4 shadow-sm transition-shadow hover:shadow-md ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
        <div className={`text-2xl font-bold ${alert ? 'text-red-500' : dark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
        {sub && <div className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>}
      </div>
    </div>
  );
}
