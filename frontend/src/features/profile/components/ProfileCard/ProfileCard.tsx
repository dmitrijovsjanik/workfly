import { Link } from 'react-router-dom';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import type { User } from '@/shared/types';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const roleLabels = {
    CUSTOMER: 'Заказчик',
    EXECUTOR: 'Исполнитель',
    BOTH: 'Заказчик и Исполнитель',
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Circle
          size={64}
          text={user.name.charAt(0).toUpperCase()}
          backgroundColor="#e5e5e5"
          className={styles.avatar}
        />
        <div className={styles.info}>
          <Typography.Title tag="h2" view="small">
            {user.name}
          </Typography.Title>
          <Typography.Text view="primary-small" color="secondary">
            {user.email}
          </Typography.Text>
          <Tag view="filled" size="xxs" className={styles.roleTag}>
            {roleLabels[user.role]}
          </Tag>
        </div>
      </div>

      {user.executorProfile && (
        <div className={styles.section}>
          <Typography.Text view="primary-medium" weight="bold">
            Профиль исполнителя
          </Typography.Text>
          {user.executorProfile.bio && (
            <Typography.Text view="primary-small" className={styles.bio}>
              {user.executorProfile.bio}
            </Typography.Text>
          )}
          {user.executorProfile.skills.length > 0 && (
            <div className={styles.skills}>
              {user.executorProfile.skills.map((skill) => (
                <Tag key={skill} view="outlined" size="xxs">
                  {skill}
                </Tag>
              ))}
            </div>
          )}
          <div className={styles.stats}>
            {user.executorProfile.hourlyRate && (
              <div className={styles.stat}>
                <Typography.Text view="primary-small" color="secondary">
                  Ставка:
                </Typography.Text>
                <Typography.Text view="primary-small">
                  {user.executorProfile.hourlyRate} руб/час
                </Typography.Text>
              </div>
            )}
            {user.executorProfile.experienceYears !== null && (
              <div className={styles.stat}>
                <Typography.Text view="primary-small" color="secondary">
                  Опыт:
                </Typography.Text>
                <Typography.Text view="primary-small">{user.executorProfile.experienceYears} лет</Typography.Text>
              </div>
            )}
            <div className={styles.stat}>
              <Typography.Text view="primary-small" color="secondary">
                Рейтинг:
              </Typography.Text>
              <Typography.Text view="primary-small">{user.executorProfile.rating.toFixed(1)}</Typography.Text>
            </div>
            <div className={styles.stat}>
              <Typography.Text view="primary-small" color="secondary">
                Выполнено:
              </Typography.Text>
              <Typography.Text view="primary-small">{user.executorProfile.completedCount} заказов</Typography.Text>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Link to="/profile/edit">
          <Button view="secondary" size="s">
            Редактировать профиль
          </Button>
        </Link>
      </div>
    </div>
  );
}
