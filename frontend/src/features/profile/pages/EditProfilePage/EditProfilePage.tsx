import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@alfalab/core-components-typography';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { Input } from '@alfalab/core-components-input';
import { Button } from '@alfalab/core-components-button';
import { Tabs, Tab } from '@alfalab/core-components-tabs';
import { ExecutorProfileForm } from '../../components/ExecutorProfileForm';
import { useProfile } from '../../hooks/useProfile';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { ApiClientError } from '@/shared/api';
import styles from './EditProfilePage.module.css';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState('basic');
  const [name, setName] = useState('');

  const error = updateProfile.error instanceof ApiClientError ? updateProfile.error.message : updateProfile.error?.message;

  const showExecutorTab = user?.role === 'EXECUTOR' || user?.role === 'BOTH';

  const tabs = useMemo(() => {
    const result = [{ title: 'Основное', id: 'basic' }];
    if (showExecutorTab) {
      result.push({ title: 'Исполнитель', id: 'executor' });
    }
    return result;
  }, [showExecutorTab]);

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateProfile.mutate({ name: name.trim() });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton visible className={styles.skeleton} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Typography.Text view="primary-medium" color="negative">
          Не удалось загрузить профиль
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title tag="h1" view="small">
          Редактирование профиля
        </Typography.Title>
        <Button view="secondary" size="xs" onClick={() => navigate('/profile')}>
          Назад
        </Button>
      </div>

      <Tabs
        selectedId={activeTab}
        onChange={(_, { selectedId }) => setActiveTab(selectedId as string)}
        className={styles.tabs}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} title={tab.title} id={tab.id} />
        ))}
      </Tabs>

      <div className={styles.content}>
        {activeTab === 'basic' && (
          <form className={styles.form} onSubmit={handleBasicSubmit}>
            {error && (
              <div className={styles.error}>
                <Typography.Text view="primary-small" color="negative">
                  {error}
                </Typography.Text>
              </div>
            )}

            <Input
              label="Имя"
              value={name || user.name}
              onChange={(e) => setName(e.target.value)}
              block
              required
            />

            <Input label="Email" value={user.email || ''} block disabled />

            <Button type="submit" view="primary" size="m" loading={updateProfile.isPending}>
              Сохранить
            </Button>
          </form>
        )}

        {activeTab === 'executor' && (
          <ExecutorProfileForm profile={user.executorProfile} onSuccess={() => navigate('/profile')} />
        )}
      </div>
    </div>
  );
}
