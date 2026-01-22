import { createContext, useContext, ReactNode } from 'react';

interface LayoutContextValue {
  setSubheader: (node: ReactNode) => void;
  setFooter: (node: ReactNode) => void;
}

export const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within Layout');
  }
  return context;
}
