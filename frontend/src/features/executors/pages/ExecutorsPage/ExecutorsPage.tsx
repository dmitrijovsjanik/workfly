import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Typography } from '@alfalab/core-components-typography';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { useExecutors } from '@/features/profile/hooks/useExecutors';
import { ExecutorCard } from '../../components/ExecutorCard';
import type { Executor } from '@/shared/types';
import styles from './ExecutorsPage.module.css';

export function ExecutorsPage() {
  const { data: executors, isLoading } = useExecutors();

  const [swipedExecutors, setSwipedExecutors] = useState<Set<string>>(new Set());

  const availableExecutors = executors?.filter((e) => !swipedExecutors.has(e.id)) || [];
  const currentExecutor = availableExecutors[0];
  const nextExecutor = availableExecutors[1];

  const handleSwipe = useCallback((executor: Executor, direction: 'left' | 'right') => {
    setSwipedExecutors((prev) => new Set(prev).add(executor.id));

    if (direction === 'right') {
      // TODO: Send interest to API
      console.log('INTERESTED in executor:', executor.id);
    } else {
      console.log('SKIP executor:', executor.id);
    }
  }, []);

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentExecutor) {
      handleSwipe(currentExecutor, direction);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton visible className={styles.cardSkeleton} />
      </div>
    );
  }

  if (availableExecutors.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <Typography.Title tag="h2" view="small">
            Исполнители закончились
          </Typography.Title>
          <Typography.Text view="primary-medium" color="secondary" className={styles.emptyText}>
            Вы просмотрели всех доступных исполнителей. Загляните позже!
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
              onSwipeComplete={(direction: 'left' | 'right') => handleSwipe(currentExecutor, direction)}
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
          {availableExecutors.length} {availableExecutors.length === 1 ? 'исполнитель' : 'исполнителей'}
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
