import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { useActiveOrders } from '@/features/orders/hooks/useActiveOrders';
import { useProfile } from '@/features/profile/hooks/useProfile';
import type { Order, Category } from '@/shared/types';
import styles from './ExecutorContent.module.css';

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

export function ExecutorContent() {
  const { data: orders, isLoading, error } = useActiveOrders();
  const { data: user } = useProfile();

  const userSkills = user?.executorProfile?.skills || [];

  const handleRespond = (order: Order) => {
    // TODO: implement response/swipe
    console.log('Respond to order:', order.id);
  };

  const handleSkip = (order: Order) => {
    // TODO: implement skip
    console.log('Skip order:', order.id);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton visible>
            <Typography.Title tag="h2" view="small">
              Доступные заказы
            </Typography.Title>
          </Skeleton>
        </div>
        <div className={styles.skeletonList}>
          <Skeleton visible className={styles.skeleton} />
          <Skeleton visible className={styles.skeleton} />
          <Skeleton visible className={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Typography.Text view="primary-medium" color="negative">
            Не удалось загрузить заказы
          </Typography.Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title tag="h2" view="small" className={styles.title}>
          Доступные заказы
        </Typography.Title>
        {orders && orders.length > 0 && (
          <Typography.Text view="primary-small" color="secondary">
            {orders.length} {orders.length === 1 ? 'заказ' : orders.length < 5 ? 'заказа' : 'заказов'}
          </Typography.Text>
        )}
      </div>

      {orders && orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderTitleRow}>
                  <Typography.Title tag="h3" view="xsmall" className={styles.orderTitle}>
                    {order.title}
                  </Typography.Title>
                  <Tag view="outlined" size="xxs" className={styles.orderCategory}>
                    {CATEGORY_LABELS[order.category]}
                  </Tag>
                </div>
                <div className={styles.orderBudget}>
                  <div className={styles.budgetValue}>
                    {formatBudget(order.budget)}
                  </div>
                  <div className={styles.budgetLabel}>бюджет</div>
                </div>
              </div>

              <Typography.Text view="primary-small" className={styles.orderDescription}>
                {order.description}
              </Typography.Text>

              {order.skillsRequired.length > 0 && (
                <div className={styles.orderSkills}>
                  {order.skillsRequired.map((skill) => {
                    const isMatching = userSkills.includes(skill);
                    return (
                      <Tag
                        key={skill}
                        view="filled"
                        size="xxs"
                        className={isMatching ? styles.matchingSkill : undefined}
                      >
                        {skill}
                      </Tag>
                    );
                  })}
                </div>
              )}

              <div className={styles.orderFooter}>
                <div className={styles.orderMeta}>
                  <span>{formatDate(order.createdAt)}</span>
                  {order.customer && <span>{order.customer.name}</span>}
                </div>
                <div className={styles.orderActions}>
                  <Button view="secondary" size="xs" onClick={() => handleSkip(order)}>
                    Пропустить
                  </Button>
                  <Button view="primary" size="xs" onClick={() => handleRespond(order)}>
                    Откликнуться
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <Typography.Title tag="h3" view="xsmall">
            Пока нет доступных заказов
          </Typography.Title>
          <Typography.Text view="primary-small" className={styles.emptyText}>
            Новые заказы появятся здесь
          </Typography.Text>
        </div>
      )}
    </div>
  );
}
