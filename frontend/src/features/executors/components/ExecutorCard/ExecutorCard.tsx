import { forwardRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { cardStyles } from '@/components';
import type { Executor } from '@/shared/types';
import styles from './ExecutorCard.module.css';

interface ExecutorCardProps {
  executor: Executor;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop?: boolean;
  exitDirection?: 'left' | 'right' | null;
  onAnimationComplete?: () => void;
}

const SWIPE_THRESHOLD = 100;

export const ExecutorCard = forwardRef<HTMLDivElement, ExecutorCardProps>(function ExecutorCard(
  { executor, onSwipe, isTop = false, exitDirection = null, onAnimationComplete },
  ref
) {
  // Track drag position for rotation/opacity effects during drag
  const [dragX, setDragX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (isExiting) return;
    setDragX(info.offset.x);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (isExiting) return;
    if (info.offset.x > SWIPE_THRESHOLD) {
      setIsExiting(true);
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setIsExiting(true);
      onSwipe('left');
    } else {
      setDragX(0); // Reset if not swiped
    }
  };

  // When exitDirection changes (button press), trigger exit animation
  const targetX = exitDirection === 'right' ? 400 : exitDirection === 'left' ? -400 : dragX;

  // Calculate rotation and opacity based on position
  const rotation = isTop ? (targetX / 200) * 15 : 0;
  const opacity = isTop && exitDirection ? Math.max(0, 1 - Math.abs(targetX) / 400) : isTop ? Math.max(0.5, 1 - Math.abs(dragX) / 400) : 1;

  const { executorProfile } = executor;

  return (
    <motion.div
      ref={ref}
      className={`${cardStyles.card} ${styles.swipeCard}`}
      style={{
        zIndex: isTop ? 2 : 1,
      }}
      drag={isTop && !exitDirection ? 'x' : false}
      dragConstraints={{ left: -400, right: 400 }}
      dragElastic={0.9}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        x: exitDirection ? targetX : 0,
        rotate: rotation,
        opacity: opacity,
      }}
      exit={{
        x: targetX || (exitDirection === 'right' ? 400 : -400),
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      transition={exitDirection
        ? { duration: 0.25, ease: 'easeOut' }
        : { type: 'spring', stiffness: 300, damping: 30 }
      }
      onAnimationComplete={(definition) => {
        if (exitDirection && onAnimationComplete && definition === 'animate') {
          onAnimationComplete();
        }
      }}
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
