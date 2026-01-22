import { ReactNode, forwardRef, ComponentPropsWithoutRef } from 'react';
import styles from './Card.module.css';

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${className || ''}`}
        {...props}
      >
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export { styles as cardStyles };
