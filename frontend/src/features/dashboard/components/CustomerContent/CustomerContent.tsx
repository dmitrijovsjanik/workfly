import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { Modal } from '@alfalab/core-components-modal';
import { useMyOrders } from '@/features/orders/hooks/useMyOrders';
import { CreateOrderForm } from '@/features/orders/components/CreateOrderForm';
import type { Order, OrderStatus, Category } from '@/shared/types';
import styles from './CustomerContent.module.css';

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

type StatusFilter = 'all' | OrderStatus;

export function CustomerContent() {
  const { data: orders, isLoading, error } = useMyOrders();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const countByStatus = (status: OrderStatus) =>
    orders?.filter((o) => o.status === status).length || 0;

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders?.filter((o) => o.status === statusFilter);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewOrder = (order: Order) => {
    // TODO: navigate to order detail
    console.log('View order:', order.id);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton visible>
            <Typography.Title tag="h2" view="small">
              Мои заказы
            </Typography.Title>
          </Skeleton>
        </div>
        <div className={styles.skeletonList}>
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
          Мои заказы
        </Typography.Title>
        <Button view="primary" size="s" onClick={() => setIsCreateModalOpen(true)}>
          Создать заказ
        </Button>
      </div>

      {/* Stats / Filters */}
      <div className={styles.stats}>
        <div
          className={`${styles.statCard} ${statusFilter === 'all' ? styles.statCardActive : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <div className={styles.statValue}>{orders?.length || 0}</div>
          <div className={styles.statLabel}>Всего</div>
        </div>
        <div
          className={`${styles.statCard} ${statusFilter === 'ACTIVE' ? styles.statCardActive : ''}`}
          onClick={() => setStatusFilter('ACTIVE')}
        >
          <div className={styles.statValue}>{countByStatus('ACTIVE')}</div>
          <div className={styles.statLabel}>Активных</div>
        </div>
        <div
          className={`${styles.statCard} ${statusFilter === 'IN_PROGRESS' ? styles.statCardActive : ''}`}
          onClick={() => setStatusFilter('IN_PROGRESS')}
        >
          <div className={styles.statValue}>{countByStatus('IN_PROGRESS')}</div>
          <div className={styles.statLabel}>В работе</div>
        </div>
        <div
          className={`${styles.statCard} ${statusFilter === 'COMPLETED' ? styles.statCardActive : ''}`}
          onClick={() => setStatusFilter('COMPLETED')}
        >
          <div className={styles.statValue}>{countByStatus('COMPLETED')}</div>
          <div className={styles.statLabel}>Завершено</div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders && filteredOrders.length > 0 ? (
        <div className={styles.section}>
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard} onClick={() => handleViewOrder(order)}>
                <div className={styles.orderInfo}>
                  <Typography.Title tag="h3" view="xsmall" className={styles.orderTitle}>
                    {order.title}
                  </Typography.Title>
                  <div className={styles.orderMeta}>
                    <span>{CATEGORY_LABELS[order.category]}</span>
                    <span>•</span>
                    <span>{formatBudget(order.budget)}</span>
                  </div>
                </div>
                <Tag size="xxs" className={`${styles.statusBadge} ${STATUS_CLASSES[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      ) : orders?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <Typography.Title tag="h3" view="xsmall">
            У вас пока нет заказов
          </Typography.Title>
          <Typography.Text view="primary-small" className={styles.emptyText}>
            Создайте первый заказ, чтобы найти исполнителя
          </Typography.Text>
          <Button view="primary" size="m" onClick={() => setIsCreateModalOpen(true)}>
            Создать заказ
          </Button>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Typography.Text view="primary-small" color="secondary">
            Нет заказов с выбранным статусом
          </Typography.Text>
          <Button view="secondary" size="s" onClick={() => setStatusFilter('all')} style={{ marginTop: 12 }}>
            Показать все
          </Button>
        </div>
      )}

      {/* Create Order Modal */}
      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <Modal.Header hasCloser>
          <Typography.Title tag="h2" view="small">
            Новый заказ
          </Typography.Title>
        </Modal.Header>
        <Modal.Content>
          <CreateOrderForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}
