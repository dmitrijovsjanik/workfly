import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon, Cancel01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { Button } from '@alfalab/core-components-button';
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

type SwipeMode = 'projects' | 'executors';

function getInitialMode(searchParams: URLSearchParams): SwipeMode {
  const tab = searchParams.get('tab');
  if (tab === 'executors') return 'executors';
  return 'projects';
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSubheader, setFooter } = useLayout();
  const { data: user, isLoading: profileLoading } = useProfile();
  const { data: ordersCount, isLoading: ordersCountLoading } = useOrdersCount();
  const { data: orders, isLoading: ordersLoading } = useActiveOrders();
  const { data: executors, isLoading: executorsLoading } = useExecutors();

  const hasExecutorProfile = !!user?.executorProfile;
  const hasOrders = (ordersCount?.count ?? 0) > 0;
  const userSkills = user?.executorProfile?.skills || [];

  const [mode, setModeState] = useState<SwipeMode>(() => getInitialMode(searchParams));

  const setMode = useCallback((newMode: SwipeMode) => {
    setModeState(newMode);
    setSearchParams({ tab: newMode }, { replace: true });
  }, [setSearchParams]);
  const [swipedOrders, setSwipedOrders] = useState<Set<string>>(new Set());
  const [swipedExecutors, setSwipedExecutors] = useState<Set<string>>(new Set());
  const [orderExitDirection, setOrderExitDirection] = useState<'left' | 'right' | null>(null);
  const [executorExitDirection, setExecutorExitDirection] = useState<'left' | 'right' | null>(null);

  const isLoading = profileLoading || ordersCountLoading;

  const canSwipeProjects = hasExecutorProfile;
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

  // Called when swipe animation completes (both finger and button)
  const handleOrderSwipeComplete = useCallback((order: Order, direction: 'left' | 'right') => {
    setSwipedOrders((prev) => new Set(prev).add(order.id));
    setOrderExitDirection(null);
    if (direction === 'right') {
      // TODO: Send like to API
    }
  }, []);

  const handleExecutorSwipeComplete = useCallback((executor: Executor, direction: 'left' | 'right') => {
    setSwipedExecutors((prev) => new Set(prev).add(executor.id));
    setExecutorExitDirection(null);
    if (direction === 'right') {
      // TODO: Send like to API
    }
  }, []);

  // Handle button press - just set exit direction, card will call onSwipeComplete when done
  const handleButtonSwipe = useCallback((direction: 'left' | 'right') => {
    if (mode === 'projects' && currentOrder && !orderExitDirection) {
      setOrderExitDirection(direction);
    } else if (mode === 'executors' && currentExecutor && !executorExitDirection) {
      setExecutorExitDirection(direction);
    }
  }, [mode, currentOrder, currentExecutor, orderExitDirection, executorExitDirection]);

  // Check if we have cards to show actions for the current mode
  const hasCards = mode === 'projects'
    ? canSwipeProjects && availableOrders.length > 0
    : canSwipeExecutors && availableExecutors.length > 0;

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
            className={`${styles.tab} ${mode === 'projects' ? styles.activeTab : ''}`}
            onClick={() => setMode('projects')}
            type="button"
          >
            Проекты
            {!canSwipeProjects && <span className={styles.locked}>🔒</span>}
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
  }, [isLoading, mode, canSwipeProjects, canSwipeExecutors, setSubheader, setMode]);

  // Set footer (action buttons) - always show to prevent layout jump
  useEffect(() => {
    setFooter(
      <>
        <Button
          view="secondary"
          size={56}
          shape="rounded"
          leftAddons={<HugeiconsIcon icon={Cancel01Icon} size={24} />}
          onClick={() => handleButtonSwipe('left')}
          disabled={!hasCards}
          className={styles.skipBtn}
        />
        <Button
          view="secondary"
          size={56}
          shape="rounded"
          leftAddons={<HugeiconsIcon icon={Message01Icon} size={24} />}
          onClick={() => navigate('/messages')}
          aria-label="Чаты"
        />
        <Button
          view="primary"
          size={56}
          shape="rounded"
          leftAddons={<HugeiconsIcon icon={FavouriteIcon} size={24} />}
          onClick={() => handleButtonSwipe('right')}
          disabled={!hasCards}
          className={styles.likeBtn}
        />
      </>
    );

    return () => setFooter(null);
  }, [hasCards, handleButtonSwipe, navigate, setFooter]);

  // Render projects stack content
  const renderProjectsStack = () => {
    if (ordersLoading) {
      return (
        <div className={styles.cardStack}>
          <Skeleton visible className={styles.stackSkeleton} />
        </div>
      );
    }
    const isActive = mode === 'projects';

    // Если нет профиля исполнителя - показываем только NeedCard
    if (!canSwipeProjects) {
      return (
        <div className={styles.cardStack}>
          <NeedCard
            icon="🎯"
            title="Создайте профиль исполнителя"
            text="Чтобы искать проекты, вам нужно создать карточку исполнителя с вашими навыками и ставкой."
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
        {/* NeedCard всегда в самом низу колоды */}
        <NeedCard
          key="projects-need-card"
          icon="🎉"
          title="Проекты закончились"
          text="Вы просмотрели все доступные проекты. Загляните позже!"
          isTop={isNeedCardTop}
        />
        {nextOrder && (
          <SwipeCard
            key={nextOrder.id}
            order={nextOrder}
            userSkills={userSkills}
            onSwipeComplete={() => {}}
            isTop={false}
          />
        )}
        {currentOrder && (
          <SwipeCard
            key={currentOrder.id}
            order={currentOrder}
            userSkills={userSkills}
            onSwipeComplete={(direction) => handleOrderSwipeComplete(currentOrder, direction)}
            isTop={isActive}
            exitDirection={orderExitDirection}
          />
        )}
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
            onSwipeComplete={() => {}}
            isTop={false}
          />
        )}
        {currentExecutor && (
          <ExecutorCard
            key={currentExecutor.id}
            executor={currentExecutor}
            onSwipeComplete={(direction) => handleExecutorSwipeComplete(currentExecutor, direction)}
            isTop={isActive}
            exitDirection={executorExitDirection}
          />
        )}
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
        initial={false}
        animate={{ x: mode === 'projects' ? '0%' : '-50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.stackWrapper}>
          {renderProjectsStack()}
        </div>
        <div className={styles.stackWrapper}>
          {renderExecutorsStack()}
        </div>
      </motion.div>
    </div>
  );
}
