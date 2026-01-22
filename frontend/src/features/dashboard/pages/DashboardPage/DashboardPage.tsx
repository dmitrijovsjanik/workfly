import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon } from '@hugeicons/core-free-icons';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { useLayout } from '@/components/Layout';
import { NeedCard } from '@/components';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useOrdersCount } from '@/features/orders/hooks/useOrdersCount';
import { useActiveOrders } from '@/features/orders/hooks/useActiveOrders';
import { useExecutors } from '@/features/profile/hooks/useExecutors';
import { SwipeCard } from '@/features/orders/components/SwipeCard';
import { ExecutorCard } from '@/features/executors/components/ExecutorCard';
import type { Order, Executor } from '@/shared/types';
import styles from './DashboardPage.module.css';

type SwipeMode = 'orders' | 'executors';

export function DashboardPage() {
  const navigate = useNavigate();
  const { setSubheader, setFooter } = useLayout();
  const { data: user, isLoading: profileLoading } = useProfile();
  const { data: ordersCount, isLoading: ordersCountLoading } = useOrdersCount();
  const { data: orders, isLoading: ordersLoading } = useActiveOrders();
  const { data: executors, isLoading: executorsLoading } = useExecutors();

  const hasExecutorProfile = !!user?.executorProfile;
  const hasOrders = (ordersCount?.count ?? 0) > 0;
  const userSkills = user?.executorProfile?.skills || [];

  const [mode, setMode] = useState<SwipeMode>(hasExecutorProfile ? 'orders' : 'executors');
  const [swipedOrders, setSwipedOrders] = useState<Set<string>>(new Set());
  const [swipedExecutors, setSwipedExecutors] = useState<Set<string>>(new Set());
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const isLoading = profileLoading || ordersCountLoading;

  const canSwipeOrders = hasExecutorProfile;
  const canSwipeExecutors = hasOrders;

  const availableOrders = useMemo(
    () => orders?.filter((o) => !swipedOrders.has(o.id)) || [],
    [orders, swipedOrders]
  );
  const availableExecutors = useMemo(
    () => executors?.filter((e) => !swipedExecutors.has(e.id)) || [],
    [executors, swipedExecutors]
  );

  const currentOrder = availableOrders[0];
  const nextOrder = availableOrders[1];
  const currentExecutor = availableExecutors[0];
  const nextExecutor = availableExecutors[1];

  const handleOrderSwipe = useCallback((order: Order, direction: 'left' | 'right') => {
    setExitDirection(direction);
    setSwipedOrders((prev) => new Set(prev).add(order.id));
    if (direction === 'right') {
      console.log('LIKE order:', order.id);
    }
  }, []);

  const handleExecutorSwipe = useCallback((executor: Executor, direction: 'left' | 'right') => {
    setExitDirection(direction);
    setSwipedExecutors((prev) => new Set(prev).add(executor.id));
    if (direction === 'right') {
      console.log('LIKE executor:', executor.id);
    }
  }, []);

  const handleButtonSwipe = useCallback((direction: 'left' | 'right') => {
    if (mode === 'orders' && currentOrder) {
      handleOrderSwipe(currentOrder, direction);
    } else if (mode === 'executors' && currentExecutor) {
      handleExecutorSwipe(currentExecutor, direction);
    }
  }, [mode, currentOrder, currentExecutor, handleOrderSwipe, handleExecutorSwipe]);

  // Check if we have cards to show actions for the current mode
  const hasCards = mode === 'orders'
    ? canSwipeOrders && availableOrders.length > 0
    : canSwipeExecutors && availableExecutors.length > 0;

  // Check if we have any cards in either stack
  const hasOrderCards = canSwipeOrders && availableOrders.length > 0;
  const hasExecutorCards = canSwipeExecutors && availableExecutors.length > 0;

  // Set subheader (tabs)
  useEffect(() => {
    if (isLoading) {
      setSubheader(
        <div className={styles.tabs}>
          <Skeleton visible className={styles.tabSkeleton} />
          <Skeleton visible className={styles.tabSkeleton} />
        </div>
      );
    } else {
      setSubheader(
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
      );
    }

    return () => setSubheader(null);
  }, [isLoading, mode, canSwipeOrders, canSwipeExecutors, setSubheader]);

  // Set footer (action buttons) - always show to prevent layout jump
  useEffect(() => {
    setFooter(
      <>
        <button
          className={`${styles.actionBtn} ${styles.skipBtn} ${!hasCards ? styles.disabledBtn : ''}`}
          onClick={() => handleButtonSwipe('left')}
          type="button"
          disabled={!hasCards}
        >
          ✕
        </button>
        <button
          className={styles.chatBtn}
          onClick={() => navigate('/messages')}
          type="button"
          aria-label="Чаты"
        >
          <HugeiconsIcon icon={Message01Icon} size={24} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.likeBtn} ${!hasCards ? styles.disabledBtn : ''}`}
          onClick={() => handleButtonSwipe('right')}
          type="button"
          disabled={!hasCards}
        >
          ♥
        </button>
      </>
    );

    return () => setFooter(null);
  }, [hasCards, handleButtonSwipe, navigate, setFooter]);

  // Render orders stack content
  const renderOrdersStack = () => {
    if (ordersLoading) {
      return (
        <div className={styles.cardStack}>
          <Skeleton visible className={styles.stackSkeleton} />
        </div>
      );
    }
    const isActive = mode === 'orders';

    // Если нет профиля исполнителя - показываем только NeedCard
    if (!canSwipeOrders) {
      return (
        <div className={styles.cardStack}>
          <NeedCard
            icon="🎯"
            title="Создайте профиль исполнителя"
            text="Чтобы искать заказы, вам нужно создать карточку исполнителя с вашими навыками и ставкой."
            buttonText="Создать профиль"
            onButtonClick={() => navigate('/create-profile')}
            isTop={isActive}
          />
        </div>
      );
    }

    // Есть профиль - рендерим колоду с NeedCard как последней карточкой
    const showNeedCard = availableOrders.length === 0;
    const isNeedCardTop = showNeedCard && isActive;

    return (
      <div className={styles.cardStack}>
        <AnimatePresence mode="popLayout" onExitComplete={() => setExitDirection(null)}>
          {/* NeedCard всегда в самом низу колоды */}
          <NeedCard
            key="orders-need-card"
            icon="🎉"
            title="Заказы закончились"
            text="Вы просмотрели все доступные заказы. Загляните позже!"
            isTop={isNeedCardTop}
          />
          {nextOrder && (
            <SwipeCard
              key={nextOrder.id}
              order={nextOrder}
              userSkills={userSkills}
              onSwipe={() => {}}
              isTop={false}
            />
          )}
          {currentOrder && (
            <SwipeCard
              key={currentOrder.id}
              order={currentOrder}
              userSkills={userSkills}
              onSwipe={(direction) => handleOrderSwipe(currentOrder, direction)}
              isTop={isActive}
              exitDirection={exitDirection}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Render executors stack content
  const renderExecutorsStack = () => {
    if (executorsLoading) {
      return (
        <div className={styles.cardStack}>
          <Skeleton visible className={styles.stackSkeleton} />
        </div>
      );
    }
    const isActive = mode === 'executors';

    // Если нет заказов - показываем только NeedCard
    if (!canSwipeExecutors) {
      return (
        <div className={styles.cardStack}>
          <NeedCard
            icon="📝"
            title="Опубликуйте заказ"
            text="Чтобы искать исполнителей, сначала опубликуйте ваш проект."
            buttonText="Создать заказ"
            onButtonClick={() => navigate('/create')}
            isTop={isActive}
          />
        </div>
      );
    }

    // Есть заказы - рендерим колоду с NeedCard как последней карточкой
    const showNeedCard = availableExecutors.length === 0;
    const isNeedCardTop = showNeedCard && isActive;

    return (
      <div className={styles.cardStack}>
        <AnimatePresence mode="popLayout" onExitComplete={() => setExitDirection(null)}>
          {/* NeedCard всегда в самом низу колоды */}
          <NeedCard
            key="executors-need-card"
            icon="🎉"
            title="Исполнители закончились"
            text="Вы просмотрели всех доступных исполнителей. Загляните позже!"
            isTop={isNeedCardTop}
          />
          {nextExecutor && (
            <ExecutorCard
              key={nextExecutor.id}
              executor={nextExecutor}
              onSwipe={() => {}}
              isTop={false}
            />
          )}
          {currentExecutor && (
            <ExecutorCard
              key={currentExecutor.id}
              executor={currentExecutor}
              onSwipe={(direction) => handleExecutorSwipe(currentExecutor, direction)}
              isTop={isActive}
              exitDirection={exitDirection}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.body}>
        <Skeleton visible className={styles.bodySkeleton} />
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <motion.div
        className={styles.stacksContainer}
        animate={{ x: mode === 'orders' ? '0%' : '-50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.stackWrapper}>
          {renderOrdersStack()}
        </div>
        <div className={styles.stackWrapper}>
          {renderExecutorsStack()}
        </div>
      </motion.div>
    </div>
  );
}
