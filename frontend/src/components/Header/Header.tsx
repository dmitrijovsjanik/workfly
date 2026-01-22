import { useNavigate, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification02Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { Button } from '@alfalab/core-components-button';
import { useProfile } from '@/features/profile/hooks/useProfile';
import styles from './Header.module.css';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useProfile();

  const isProfilePage = location.pathname === '/profile';

  return (
    <header className={styles.header}>
      {/* Avatar or Back button */}
      <button
        type="button"
        className={styles.avatarButton}
        onClick={() => isProfilePage ? navigate(-1) : navigate('/profile')}
        aria-label={isProfilePage ? 'Назад' : 'Профиль'}
      >
        {isProfilePage ? (
          <Circle size={56} backgroundColor="#e5e5e5">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#333" />
          </Circle>
        ) : (
          <Circle
            size={56}
            text={user?.name?.charAt(0).toUpperCase() || '?'}
            backgroundColor="#e5e5e5"
            className={styles.avatar}
          />
        )}
      </button>

      {/* Logo */}
      <button
        type="button"
        className={styles.logo}
        onClick={() => navigate('/dashboard')}
        aria-label="На главную"
      >
        <span className={styles.logoText}>workfly</span>
      </button>

      {/* Notifications */}
      <Button
        view="secondary"
        size={56}
        shape="rounded"
        leftAddons={<HugeiconsIcon icon={Notification02Icon} size={24} />}
        onClick={() => navigate('/messages')}
        aria-label="Уведомления"
      />
    </header>
  );
}
