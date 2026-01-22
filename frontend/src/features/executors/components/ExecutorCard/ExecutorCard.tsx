import { forwardRef, useState, useEffect, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { cardStyles } from '@/components';
import type { Executor } from '@/shared/types';
import styles from './ExecutorCard.module.css';

interface ExecutorCardProps {
  executor: Executor;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  isTop?: boolean;
  exitDirection?: 'left' | 'right' | null;
}

// Swipe thresholds
const SWIPE_OFFSET_THRESHOLD = 80; // Minimum distance to trigger swipe
const SWIPE_VELOCITY_THRESHOLD = 300; // Minimum velocity to trigger swipe regardless of distance

export const ExecutorCard = forwardRef<HTMLDivElement, ExecutorCardProps>(function ExecutorCard(
  { executor, onSwipeComplete, isTop = false, exitDirection = null },
  ref
) {
  // Track if card is being removed (finger swipe or button)
  const [isExiting, setIsExiting] = useState(false);

  // Motion values for drag tracking
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.5, 0.8, 1, 0.8, 0.5]);

  // Reset state when card becomes top (was previously next card in stack)
  useEffect(() => {
    if (isTop && !exitDirection) {
      setIsExiting(false);
      x.set(0);
    }
  }, [isTop, exitDirection, x]);

  // Handle exit animation completion
  const handleExitComplete = useCallback((direction: 'left' | 'right') => {
    onSwipeComplete(direction);
  }, [onSwipeComplete]);

  // Handle button press - animate exit via motion values
  useEffect(() => {
    if (exitDirection && !isExiting) {
      setIsExiting(true);
      const targetX = exitDirection === 'right' ? 500 : -500;
      animate(x, targetX, {
        type: 'tween',
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0],
        onComplete: () => {
          handleExitComplete(exitDirection);
        },
      });
    }
  }, [exitDirection, isExiting, x, handleExitComplete]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isExiting) return;

    const { offset, velocity } = info;

    // Check if swipe should be triggered based on distance OR velocity
    const swipedRight = offset.x > SWIPE_OFFSET_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD;
    const swipedLeft = offset.x < -SWIPE_OFFSET_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD;

    if (swipedRight) {
      setIsExiting(true);
      animate(x, 500, {
        type: 'tween',
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0],
        onComplete: () => {
          handleExitComplete('right');
        },
      });
    } else if (swipedLeft) {
      setIsExiting(true);
      animate(x, -500, {
        type: 'tween',
        duration: 0.3,
        ease: [0.32, 0, 0.67, 0],
        onComplete: () => {
          handleExitComplete('left');
        },
      });
    } else {
      // Return to center
      animate(x, 0, {
        type: 'spring',
        stiffness: 500,
        damping: 35,
      });
    }
  };

  const { executorProfile } = executor;

  return (
    <motion.div
      ref={ref}
      className={`${cardStyles.card} ${styles.swipeCard}`}
      style={{
        zIndex: isTop ? 2 : 1,
        x,
        rotate,
        opacity,
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
      drag={isTop && !isExiting ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
      }}
      transition={{ type: 'spring', stiffness: 800, damping: 35 }}
    >
      {/* Card Content */}
      <div className={cardStyles.content}>
        {/* Avatar & Name */}
        <div className={styles.header}>
          <Circle
            size={64}
            text={executor.name.charAt(0).toUpperCase()}
            backgroundColor="#e5e5e5"
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <Typography.Title tag="h2" view="small" className={styles.name}>
              {executor.name}
            </Typography.Title>
            <div className={styles.stats}>
              <span className={styles.rating}>★ {executorProfile.rating.toFixed(1)}</span>
              <span className={styles.completed}>{executorProfile.completedCount} заказов</span>
            </div>
          </div>
          {executorProfile.hourlyRate && (
            <div className={styles.rate}>
              <div className={styles.rateValue}>
                {executorProfile.hourlyRate.toLocaleString('ru-RU')}
              </div>
              <div className={styles.rateLabel}>₽/час</div>
            </div>
          )}
        </div>

        {/* Bio */}
        {executorProfile.bio && (
          <Typography.Text view="primary-medium" className={styles.bio}>
            {executorProfile.bio}
          </Typography.Text>
        )}

        {/* Skills */}
        {executorProfile.skills.length > 0 && (
          <div className={styles.skills}>
            {executorProfile.skills.map((skill) => (
              <Tag key={skill} view="outlined" size="xxs">
                {skill}
              </Tag>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          {executorProfile.experienceYears && (
            <div className={styles.experience}>
              {executorProfile.experienceYears}{' '}
              {executorProfile.experienceYears === 1
                ? 'год'
                : executorProfile.experienceYears < 5
                  ? 'года'
                  : 'лет'}{' '}
              опыта
            </div>
          )}
          {executorProfile.portfolioUrl && (
            <a
              href={executorProfile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.portfolio}
              onClick={(e) => e.stopPropagation()}
            >
              Портфолио
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});
