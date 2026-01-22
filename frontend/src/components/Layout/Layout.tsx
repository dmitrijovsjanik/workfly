import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LayoutContext } from './LayoutContext';
import styles from './Layout.module.css';
import { useState, useCallback, ReactNode } from 'react';

export function Layout() {
  const { isAuthenticated } = useAuth();
  const [subheader, setSubheader] = useState<ReactNode>(null);
  const [footer, setFooter] = useState<ReactNode>(null);

  const setLayoutSubheader = useCallback((node: ReactNode) => setSubheader(node), []);
  const setLayoutFooter = useCallback((node: ReactNode) => setFooter(node), []);

  return (
    <LayoutContext.Provider value={{ setSubheader: setLayoutSubheader, setFooter: setLayoutFooter }}>
      <div className={styles.layout}>
        <div className={styles.wrapper}>
          {/* Header section */}
          <div className={styles.header}>
            {isAuthenticated && <Header />}
            {subheader}
          </div>

          {/* Body section - 3:4 aspect ratio */}
          <main className={styles.main}>
            <Outlet />
          </main>

          {/* Footer section */}
          <div className={styles.footer}>
            {footer}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
