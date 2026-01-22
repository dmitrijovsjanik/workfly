import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@alfalab/core-components-button';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useOrdersCount } from '@/features/orders/hooks/useOrdersCount';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { ExecutorsPage } from '@/features/executors/pages/ExecutorsPage';
import styles from './SwipePage.module.css';

type SwipeMode = 'orders' | 'executors';

export function SwipePage() {
  const navigate = useNavigate();
  const { data: user, isLoading: profileLoading } = useProfile();
  const { data: ordersCount, isLoading: ordersLoading } = useOrdersCount();

  const hasExecutorProfile = !!user?.executorProfile;
  const hasOrders = (ordersCount?.count ?? 0) > 0;

  // Default mode based on user state
  const [mode, setMode] = useState<SwipeMode>(hasExecutorProfile ? 'orders' : 'executors');

  const isLoading = profileLoading || ordersLoading;

  // Check if user can access the current mode
  const canSwipeOrders = hasExecutorProfile;
  const canSwipeExecutors = hasOrders;

  // Render "need card" screen
  const renderNeedCardScreen = () => {
    if (mode === 'orders') {
      return (
        <div className={styles.needCard}>
          <div className={styles.needCardIcon}>🎯</div>
          <h2 className={styles.needCardTitle}>Создайте профиль исполнителя</h2>
          <p className={styles.needCardText}>
            Чтобы искать заказы, вам нужно создать карточку исполнителя с вашими навыками и ставкой.
          </p>
          <Button view="primary" size="m" onClick={() => navigate('/create-profile')}>
            Создать профиль
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.needCard}>
        <div className={styles.needCardIcon}>📝</div>
        <h2 className={styles.needCardTitle}>Опубликуйте заказ</h2>
        <p className={styles.needCardText}>
          Чтобы искать исполнителей, сначала опубликуйте ваш проект. Исполнители увидят его и смогут откликнуться.
        </p>
        <Button view="primary" size="m" onClick={() => navigate('/create')}>
          Создать заказ
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.container}><div className={styles.loading}>Загрузка...</div></div>;
  }

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setMode('orders')}
          type="button"
        >
          Заказы
          {!canSwipeOrders && <span className={styles.locked}>🔒</span>}
        </button>
        <button
          className={`${styles.tab} ${mode === 'executors' ? styles.activeTab : ''}`}
          onClick={() => setMode('executors')}
          type="button"
        >
          Исполнители
          {!canSwipeExecutors && <span className={styles.locked}>🔒</span>}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {mode === 'orders' && !canSwipeOrders && renderNeedCardScreen()}
        {mode === 'orders' && canSwipeOrders && <OrdersPage />}
        {mode === 'executors' && !canSwipeExecutors && renderNeedCardScreen()}
        {mode === 'executors' && canSwipeExecutors && <ExecutorsPage />}
      </div>
    </div>
  );
}
