import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import type { Role } from '@/shared/types';
import styles from './RoleStep.module.css';

interface RoleStepProps {
  onNext: () => void;
  onBack: () => void;
}

const roles: { value: Role; title: string; description: string }[] = [
  {
    value: 'EXECUTOR',
    title: 'Исполнитель',
    description: 'Хочу выполнять заказы и зарабатывать',
  },
  {
    value: 'CUSTOMER',
    title: 'Заказчик',
    description: 'Хочу размещать задачи и находить исполнителей',
  },
  {
    value: 'BOTH',
    title: 'И то, и другое',
    description: 'Буду и заказывать, и выполнять работу',
  },
];

export function RoleStep({ onNext, onBack }: RoleStepProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('EXECUTOR');
  const updateProfile = useUpdateProfile();

  const handleNext = () => {
    updateProfile.mutate(
      { role: selectedRole },
      { onSuccess: onNext }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title tag="h2" view="small">
          Кем вы хотите быть?
        </Typography.Title>
        <Typography.Text view="primary-small" color="secondary">
          Это можно изменить позже в настройках
        </Typography.Text>
      </div>

      <div className={styles.roles}>
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            className={`${styles.roleCard} ${selectedRole === role.value ? styles.selected : ''}`}
            onClick={() => setSelectedRole(role.value)}
          >
            <Typography.Text view="primary-medium" weight="bold">
              {role.title}
            </Typography.Text>
            <Typography.Text view="primary-small" color="secondary">
              {role.description}
            </Typography.Text>
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <Button view="secondary" size="m" onClick={onBack}>
          Назад
        </Button>
        <Button view="primary" size="m" onClick={handleNext} loading={updateProfile.isPending}>
          Далее
        </Button>
      </div>
    </div>
  );
}
