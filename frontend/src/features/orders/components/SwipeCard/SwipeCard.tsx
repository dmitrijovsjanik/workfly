import { forwardRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
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
  onSwipe: (direction: 'left' | 'right') => void;
  userSkills?: string[];
  isTop?: boolean;
  exitDirection?: 'left' | 'right' | null;
}

const SWIPE_THRESHOLD = 100;

export const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(function SwipeCard(
  { order, onSwipe, userSkills = [], isTop = false, exitDirection = null },
  ref
) {
  // Track drag position for rotation/opacity effects during drag
  const [dragX, setDragX] = useState(0);

  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragX(info.offset.x);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    } else {
      setDragX(0); // Reset if not swiped
    }
  };

  // Calculate rotation and opacity based on drag
  const rotation = isTop ? (dragX / 200) * 15 : 0;
  const dragOpacity = isTop ? Math.max(0.5, 1 - Math.abs(dragX) / 400) : 1;

  // Exit position
  const exitX = exitDirection === 'right' ? 400 : exitDirection === 'left' ? -400 : 0;

  return (
    <motion.div
      ref={ref}
      className={`${cardStyles.card} ${styles.swipeCard}`}
      style={{
        zIndex: isTop ? 2 : 1,
        rotate: rotation,
        opacity: dragOpacity,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: -400, right: 400 }}
      dragElastic={0.9}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        x: 0,
      }}
      exit={{
        x: exitX,
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      layout
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
