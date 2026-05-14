import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DarkModeContextType {
  dark: boolean;
  toggle: () => void;
}
const DarkModeContext = createContext<DarkModeContextType>({ dark: false, toggle: () => {} });
export const useDark = () => useContext(DarkModeContext);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      <div className={dark ? 'dark' : ''}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}
