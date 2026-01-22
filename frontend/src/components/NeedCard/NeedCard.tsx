import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@alfalab/core-components-button';
import { cardStyles } from '@/components';
import styles from './NeedCard.module.css';

export interface NeedCardProps {
  icon: string;
  title: string;
  text?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  isTop?: boolean;
  children?: ReactNode;
}

export const NeedCard = forwardRef<HTMLDivElement, NeedCardProps>(function NeedCard(
  { icon, title, text, buttonText, onButtonClick, isTop = false, children },
  ref
) {
  return (
    <motion.div
      ref={ref}
      className={`${cardStyles.card} ${styles.needCard}`}
      style={{ zIndex: 0 }}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
      }}
      exit={{
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      layout
    >
      <div className={`${cardStyles.content} ${styles.content}`}>
        <div className={styles.icon}>{icon}</div>
        <h2 className={styles.title}>{title}</h2>
        {text && <p className={styles.text}>{text}</p>}
        {children}
        {buttonText && onButtonClick && (
          <Button view="primary" size="m" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </div>
    </motion.div>
  );
});
