import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useDark } from '../../context/DarkModeContext';

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Layout({ title, subtitle, children }: LayoutProps) {
  const { dark } = useDark();
  return (
    <div className={`flex min-h-screen ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Demo banner */}
        <div className="bg-indigo-600 text-white text-center text-xs py-1.5 font-medium tracking-wide">
          Demo CRM for flea market booth management — All data is fictional
        </div>
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
