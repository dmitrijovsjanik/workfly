import { Typography } from '@alfalab/core-components-typography';
import styles from './MessagesPage.module.css';

export function MessagesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title tag="h1" view="small">
          Сообщения
        </Typography.Title>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <Typography.Title tag="h3" view="xsmall">
          Пока нет сообщений
        </Typography.Title>
        <Typography.Text view="primary-small" color="secondary">
          Здесь будут чаты с исполнителями и заказчиками
        </Typography.Text>
      </div>
    </div>
  );
}
