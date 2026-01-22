import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@alfalab/core-components-button';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import type { Role } from '@/shared/types';
import styles from './OnboardingPage.module.css';

interface RoleOption {
  value: Role;
  mainText: string;
  subText: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'EXECUTOR',
    mainText: 'Я исполнитель',
    subText: 'ищу проекты',
  },
  {
    value: 'CUSTOMER',
    mainText: 'Я заказчик',
    subText: 'ищу исполнителя',
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('EXECUTOR');
  const updateProfile = useUpdateProfile();

  const handleContinue = () => {
    updateProfile.mutate(
      { role: selectedRole },
      {
        onSuccess: () => {
          // Navigate to appropriate create card flow based on role
          if (selectedRole === 'EXECUTOR') {
            navigate('/create-profile', { replace: true });
          } else {
            navigate('/create', { replace: true });
          }
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoText}>workfly</span>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.cardContent}>
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.roleOption} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedRole(option.value)}
              >
                <div className={styles.roleTexts}>
                  <span className={styles.mainText}>{option.mainText}</span>
                  <span className={styles.subText}>{option.subText}</span>
                </div>
                {isSelected && (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={24}
                    className={styles.checkIcon}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          view="primary"
          size="m"
          block
          onClick={handleContinue}
          loading={updateProfile.isPending}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
