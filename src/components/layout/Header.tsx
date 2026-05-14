import { Bell, Moon, Sun } from 'lucide-react';
import { useDark } from '../../context/DarkModeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { dark, toggle } = useDark();

  return (
    <header className={`sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
      <div>
        <h1 className={`text-lg font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
        {subtitle && <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className={`p-2 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800 hover:text-yellow-400' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          title="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        {/* Notification */}
        <button className={`p-2 rounded-lg relative transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">MO</div>
          <div className="hidden sm:block">
            <div className={`text-sm font-semibold leading-tight ${dark ? 'text-white' : 'text-slate-800'}`}>Market Owner</div>
            <div className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
