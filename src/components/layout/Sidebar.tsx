import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, List, Users, CreditCard, Calendar, Settings, Store,
} from 'lucide-react';
import { useDark } from '../../context/DarkModeContext';
import { booths } from '../../data/mockData';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/layout', label: 'Booth Layout', icon: Map },
  { to: '/booths', label: 'Booth List', icon: List },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/reservations', label: 'Reservations', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { dark } = useDark();
  const pastDueCount = booths.filter(b => b.status === 'past_due').length;

  return (
    <aside className={`w-64 min-h-screen flex flex-col shadow-lg z-20 ${dark ? 'bg-slate-900 border-r border-slate-700' : 'bg-white border-r border-slate-200'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className={`text-sm font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>Market Booth</div>
          <div className="text-xs text-indigo-500 font-semibold tracking-wide">CRM</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : dark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {label === 'Payments' && pastDueCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold pulse ${isActive ? 'bg-red-400 text-white' : 'bg-red-100 text-red-600'}`}>
                    {pastDueCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`px-4 py-4 border-t ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          <div className="font-semibold mb-1 text-indigo-500">Sunshine Indoor Market</div>
          <div>1421 Commerce Blvd, Nashville TN</div>
          <div className="mt-1">(615) 555-0100</div>
        </div>
      </div>
    </aside>
  );
}
