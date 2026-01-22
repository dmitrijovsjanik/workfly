import { forwardRef, useState, useEffect, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { cardStyles } from '@/components';
import type { Order, Category } from '@/shared/types';
import styles from './SwipeCard.module.css';

const CATEGORY_LABELS: Record<Category, string> = {
  DEVELOPMENT: 'Разработка',
  DESIGN: 'Дизайн',
  MARKETING: 'Маркетинг',
  COPYWRITING: 'Копирайтинг',
  OTHER: 'Другое',
};

function formatBudget(budget: number | null): string {
  if (budget) {
    return `${budget.toLocaleString('ru-RU')} ₽`;
  }
  return 'Договорная';
}

interface SwipeCardProps {
  order: Order;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  userSkills?: string[];
  isTop?: boolean;
  exitDirection?: 'left' | 'right' | null;
}

// Swipe thresholds
const SWIPE_OFFSET_THRESHOLD = 80; // Minimum distance to trigger swipe
const SWIPE_VELOCITY_THRESHOLD = 300; // Minimum velocity to trigger swipe regardless of distance

export const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(function SwipeCard(
  { order, onSwipeComplete, userSkills = [], isTop = false, exitDirection = null },
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
  }, [exitDirection, isExiting, x, handleExitComplete, order.id]);

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
        {/* Header */}
        <div className={styles.header}>
          <Tag view="filled" size="xxs" className={styles.category}>
            {CATEGORY_LABELS[order.category]}
          </Tag>
          <div className={styles.budget}>{formatBudget(order.budget)}</div>
        </div>

        {/* Title */}
        <Typography.Title tag="h2" view="small" className={styles.title}>
          {order.title}
        </Typography.Title>

        {/* Description */}
        <Typography.Text view="primary-medium" className={styles.description}>
          {order.description}
        </Typography.Text>

        {/* Skills */}
        {order.skillsRequired.length > 0 && (
          <div className={styles.skills}>
            {order.skillsRequired.map((skill) => {
              const isMatch = userSkills.includes(skill);
              return (
                <Tag
                  key={skill}
                  view="outlined"
                  size="xxs"
                  className={isMatch ? styles.matchingSkill : undefined}
                >
                  {skill}
                </Tag>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          {order.customer && (
            <div className={styles.customer}>
              <div className={styles.customerAvatar}>
                {order.customer.name.charAt(0).toUpperCase()}
              </div>
              <span>{order.customer.name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
