import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { Input } from '@alfalab/core-components-input';
import { Textarea } from '@alfalab/core-components-textarea';
import { Skeleton } from '@alfalab/core-components-skeleton';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { useProfile } from '../../hooks/useProfile';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useCreateExecutorProfile, useUpdateExecutorProfile } from '../../hooks/useExecutorProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import styles from './ProfilePage.module.css';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'PostgreSQL', 'Docker',
];

export function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const createExecutorProfile = useCreateExecutorProfile();
  const updateExecutorProfile = useUpdateExecutorProfile();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const [editMode, setEditMode] = useState<'none' | 'basic' | 'executor'>('none');

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');

  const startEdit = (mode: 'basic' | 'executor') => {
    if (user) {
      setName(user.name);
      if (user.executorProfile) {
        setBio(user.executorProfile.bio || '');
        setSkills(user.executorProfile.skills || []);
        setHourlyRate(user.executorProfile.hourlyRate?.toString() || '');
      }
    }
    setEditMode(mode);
  };

  const cancelEdit = () => {
    setEditMode('none');
  };

  const saveBasic = () => {
    if (name.trim()) {
      updateProfile.mutate({ name: name.trim() }, {
        onSuccess: () => setEditMode('none'),
      });
    }
  };

  const saveExecutor = () => {
    const input = {
      bio: bio || undefined,
      skills,
      hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
    };

    const mutation = user?.executorProfile ? updateExecutorProfile : createExecutorProfile;
    mutation.mutate(input, {
      onSuccess: () => setEditMode('none'),
    });
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim()) && skills.length < 10) {
      setSkills([...skills, skill.trim()]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton visible className={styles.headerSkeleton} />
        <Skeleton visible className={styles.sectionSkeleton} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Typography.Text color="negative">Ошибка загрузки профиля</Typography.Text>
      </div>
    );
  }

  const hasExecutorProfile = !!user.executorProfile;

  // Edit Basic Info
  if (editMode === 'basic') {
    return (
      <div className={styles.container}>
        <div className={styles.editHeader}>
          <Typography.Title tag="h1" view="small">Редактирование</Typography.Title>
        </div>
        <div className={styles.form}>
          <Input
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            block
          />
          <div className={styles.formActions}>
            <Button view="secondary" onClick={cancelEdit} block>Отмена</Button>
            <Button view="primary" onClick={saveBasic} loading={updateProfile.isPending} block>
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Executor Profile
  if (editMode === 'executor') {
    return (
      <div className={styles.container}>
        <div className={styles.editHeader}>
          <Typography.Title tag="h1" view="small">
            {hasExecutorProfile ? 'Редактирование' : 'Стать исполнителем'}
          </Typography.Title>
        </div>
        <div className={styles.form}>
          <Textarea
            label="О себе"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            showCounter
            block
          />

          <div className={styles.skillsSection}>
            <Typography.Text view="primary-small" weight="medium">
              Навыки ({skills.length}/10)
            </Typography.Text>
            <div className={styles.selectedSkills}>
              {skills.map((skill) => (
                <Tag key={skill} view="filled" size="xxs" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </Tag>
              ))}
            </div>
            <div className={styles.suggestedSkills}>
              {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map((skill) => (
                <Tag key={skill} view="outlined" size="xxs" onClick={() => addSkill(skill)}>
                  + {skill}
                </Tag>
              ))}
            </div>
          </div>

          <Input
            label="Ставка (₽/час)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            block
          />

          <div className={styles.formActions}>
            <Button view="secondary" onClick={cancelEdit} block>Отмена</Button>
            <Button
              view="primary"
              onClick={saveExecutor}
              loading={createExecutorProfile.isPending || updateExecutorProfile.isPending}
              block
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <Circle
          size={64}
          text={user.name.charAt(0).toUpperCase()}
          backgroundColor="#e5e5e5"
          className={styles.avatar}
        />
        <Typography.Title tag="h1" view="small" className={styles.userName}>
          {user.name}
        </Typography.Title>
        <Typography.Text view="primary-small" color="secondary">
          {user.email}
        </Typography.Text>
        <Button view="tertiary" size="xs" onClick={() => startEdit('basic')} className={styles.editBtn}>
          Редактировать
        </Button>
      </div>

      {/* Executor Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Typography.Title tag="h2" view="xsmall">
            Профиль исполнителя
          </Typography.Title>
          {hasExecutorProfile && (
            <Button view="tertiary" size="xs" onClick={() => startEdit('executor')}>
              Изменить
            </Button>
          )}
        </div>

        {hasExecutorProfile ? (
          <div className={styles.executorInfo}>
            {user.executorProfile!.bio && (
              <Typography.Text view="primary-small" className={styles.bio}>
                {user.executorProfile!.bio}
              </Typography.Text>
            )}

            {user.executorProfile!.skills.length > 0 && (
              <div className={styles.skills}>
                {user.executorProfile!.skills.map((skill) => (
                  <Tag key={skill} view="outlined" size="xxs">{skill}</Tag>
                ))}
              </div>
            )}

            <div className={styles.executorStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{user.executorProfile!.rating.toFixed(1)}</div>
                <div className={styles.statLabel}>Рейтинг</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{user.executorProfile!.completedCount}</div>
                <div className={styles.statLabel}>Выполнено</div>
              </div>
              {user.executorProfile!.hourlyRate && (
                <div className={styles.stat}>
                  <div className={styles.statValue}>
                    {user.executorProfile!.hourlyRate}
                  </div>
                  <div className={styles.statLabel}>₽/час</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.becomeExecutor}>
            <Typography.Text view="primary-small" color="secondary">
              Заполните профиль, чтобы искать и выполнять заказы
            </Typography.Text>
            <Button view="primary" size="s" onClick={() => startEdit('executor')}>
              Стать исполнителем
            </Button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className={styles.logoutSection}>
        <Button view="secondary" onClick={() => logout()} loading={logoutPending} block>
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
