import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { useNavigate } from 'react-router-dom';
import { useActiveOrders } from '../../hooks/useActiveOrders';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { SwipeCard } from '../../components/SwipeCard';
import type { Order } from '@/shared/types';
import styles from './OrdersPage.module.css';

export function OrdersPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useActiveOrders();

  const [swipedOrders, setSwipedOrders] = useState<Set<string>>(new Set());

  const isLoading = userLoading || ordersLoading;
  const hasExecutorProfile = !!user?.executorProfile;
  const userSkills = user?.executorProfile?.skills || [];

  // Filter out swiped orders
  const availableOrders = orders?.filter((o) => !swipedOrders.has(o.id)) || [];
  const currentOrder = availableOrders[0];
  const nextOrder = availableOrders[1];

  const handleSwipe = useCallback((order: Order, direction: 'left' | 'right') => {
    setSwipedOrders((prev) => new Set(prev).add(order.id));

    if (direction === 'right') {
      // TODO: Send like/response to API
      console.log('LIKE order:', order.id);
    } else {
      // TODO: Send skip to API
      console.log('SKIP order:', order.id);
    }
  }, []);

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentOrder) {
      handleSwipe(currentOrder, direction);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton visible className={styles.cardSkeleton} />
      </div>
    );
  }

  // Show prompt if no executor profile
  if (!hasExecutorProfile) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔧</div>
          <Typography.Title tag="h2" view="small">
            Станьте исполнителем
          </Typography.Title>
          <Typography.Text view="primary-medium" color="secondary" className={styles.emptyText}>
            Заполните профиль исполнителя, чтобы находить и откликаться на заказы
          </Typography.Text>
          <Button view="primary" onClick={() => navigate('/profile')}>
            Заполнить профиль
          </Button>
        </div>
      </div>
    );
  }

  // No more orders
  if (availableOrders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎉</div>
          <Typography.Title tag="h2" view="small">
            Заказы закончились
          </Typography.Title>
          <Typography.Text view="primary-medium" color="secondary" className={styles.emptyText}>
            Вы просмотрели все доступные заказы. Загляните позже!
          </Typography.Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Card Stack */}
      <div className={styles.cardStack}>
        <AnimatePresence>
          {/* Next card (background) */}
          {nextOrder && (
            <SwipeCard
              key={nextOrder.id}
              order={nextOrder}
              userSkills={userSkills}
              onSwipeComplete={() => {}}
              isTop={false}
            />
          )}

          {/* Current card (top) */}
          {currentOrder && (
            <SwipeCard
              key={currentOrder.id}
              order={currentOrder}
              userSkills={userSkills}
              onSwipeComplete={(direction: 'left' | 'right') => handleSwipe(currentOrder, direction)}
              isTop={true}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.skipBtn}`}
          onClick={() => handleButtonSwipe('left')}
          type="button"
        >
          ✕
        </button>
        <div className={styles.counter}>
          {availableOrders.length} {availableOrders.length === 1 ? 'заказ' : 'заказов'}
        </div>
        <button
          className={`${styles.actionBtn} ${styles.likeBtn}`}
          onClick={() => handleButtonSwipe('right')}
          type="button"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
