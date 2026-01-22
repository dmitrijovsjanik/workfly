import { useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Search01Icon,
  Add01Icon,
  Message01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import styles from './BottomNav.module.css';

interface NavItem {
  id: string;
  icon: typeof Home01Icon;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home01Icon, label: 'Главная', path: '/dashboard' },
  { id: 'search', icon: Search01Icon, label: 'Поиск', path: '/swipe' },
  { id: 'create', icon: Add01Icon, label: 'Создать', path: '/create' },
  { id: 'messages', icon: Message01Icon, label: 'Чаты', path: '/messages' },
  { id: 'profile', icon: UserIcon, label: 'Профиль', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            type="button"
          >
            <HugeiconsIcon
              icon={item.icon}
              size={24}
              className={styles.icon}
            />
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
