import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { Modal } from '@alfalab/core-components-modal';
import { useMyOrders } from '../../hooks/useMyOrders';
import { OrderCard } from '../../components/OrderCard';
import { CreateOrderForm } from '../../components/CreateOrderForm';
import type { Order, OrderStatus } from '@/shared/types';
import styles from './MyOrdersPage.module.css';

export function MyOrdersPage() {
  const { data: orders, isLoading, error } = useMyOrders();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const countByStatus = (status: OrderStatus) =>
    orders?.filter((o) => o.status === status).length || 0;

  const activeOrders = orders?.filter((o) => o.status === 'ACTIVE') || [];
  const inProgressOrders = orders?.filter((o) => o.status === 'IN_PROGRESS') || [];
  const completedOrders = orders?.filter((o) => o.status === 'COMPLETED') || [];

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewOrder = (order: Order) => {
    // TODO: navigate to order detail page
    console.log('View order:', order.id);
  };

  const handleEditOrder = (order: Order) => {
    // TODO: open edit modal
    console.log('Edit order:', order.id);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Skeleton visible>
            <Typography.Title tag="h1" view="small">
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
        <Typography.Title tag="h1" view="small" className={styles.headerTitle}>
          Мои заказы
        </Typography.Title>
        <Button view="primary" size="s" onClick={() => setIsCreateModalOpen(true)}>
          Создать заказ
        </Button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{countByStatus('ACTIVE')}</div>
          <div className={styles.statLabel}>Активных</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{countByStatus('IN_PROGRESS')}</div>
          <div className={styles.statLabel}>В работе</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{countByStatus('COMPLETED')}</div>
          <div className={styles.statLabel}>Завершено</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{orders?.length || 0}</div>
          <div className={styles.statLabel}>Всего</div>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography.Title tag="h2" view="xsmall">
              Активные заказы
            </Typography.Title>
          </div>
          <div className={styles.ordersList}>
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onEdit={handleEditOrder}
              />
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressOrders.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography.Title tag="h2" view="xsmall">
              В работе
            </Typography.Title>
          </div>
          <div className={styles.ordersList}>
            {inProgressOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onEdit={handleEditOrder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedOrders.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography.Title tag="h2" view="xsmall">
              Завершённые
            </Typography.Title>
          </div>
          <div className={styles.ordersList}>
            {completedOrders.map((order) => (
              <OrderCard key={order.id} order={order} onView={handleViewOrder} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders?.length === 0 && (
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
