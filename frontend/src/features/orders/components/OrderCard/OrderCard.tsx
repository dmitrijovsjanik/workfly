import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { Button } from '@alfalab/core-components-button';
import type { Order, Category, OrderStatus } from '@/shared/types';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onView?: (order: Order) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  DEVELOPMENT: 'Разработка',
  DESIGN: 'Дизайн',
  MARKETING: 'Маркетинг',
  COPYWRITING: 'Копирайтинг',
  OTHER: 'Другое',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Черновик',
  ACTIVE: 'Активен',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  DRAFT: styles.statusDraft,
  ACTIVE: styles.statusActive,
  IN_PROGRESS: styles.statusInProgress,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatBudget(budget: number | null): string {
  if (budget) {
    return `${budget.toLocaleString('ru-RU')} ₽`;
  }
  return 'Договорная';
}

export function OrderCard({ order, onEdit, onView }: OrderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Typography.Title tag="h3" view="xsmall" className={styles.title}>
            {order.title}
          </Typography.Title>
          <Tag view="outlined" size="xxs" className={styles.category}>
            {CATEGORY_LABELS[order.category]}
          </Tag>
        </div>
        <Tag size="xxs" className={`${styles.statusBadge} ${STATUS_CLASSES[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </Tag>
      </div>

      <Typography.Text view="primary-small" className={styles.description}>
        {order.description}
      </Typography.Text>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Бюджет:</span>
          <span className={styles.metaValue}>{formatBudget(order.budget)}</span>
        </div>
        {order.deadline && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Дедлайн:</span>
            <span className={styles.metaValue}>{formatDate(order.deadline)}</span>
          </div>
        )}
      </div>

      {order.skillsRequired.length > 0 && (
        <div className={styles.skills}>
          {order.skillsRequired.map((skill) => (
            <Tag key={skill} view="filled" size="xxs">
              {skill}
            </Tag>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>Создан {formatDate(order.createdAt)}</span>
        <div className={styles.actions}>
          {onView && (
            <Button view="secondary" size="xs" onClick={() => onView(order)}>
              Подробнее
            </Button>
          )}
          {onEdit && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <Button view="tertiary" size="xs" onClick={() => onEdit(order)}>
              Редактировать
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
