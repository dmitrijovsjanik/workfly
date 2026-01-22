import { useState, useEffect } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { Input } from '@alfalab/core-components-input';
import { Textarea } from '@alfalab/core-components-textarea';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useCreateExecutorProfile, useUpdateExecutorProfile } from '@/features/profile/hooks/useExecutorProfile';
import { useOrdersCount } from '@/features/orders/hooks/useOrdersCount';
import styles from './ProfileSidebar.module.css';

interface ProfileSidebarProps {
  onOrdersClick?: () => void;
  forceExecutorEdit?: boolean;
  onExecutorEditClose?: () => void;
}


const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'PostgreSQL', 'Docker',
];

export function ProfileSidebar({ onOrdersClick, forceExecutorEdit, onExecutorEditClose }: ProfileSidebarProps) {
  const { data: user, isLoading } = useProfile();
  const { data: ordersCount } = useOrdersCount();
  const updateProfile = useUpdateProfile();
  const createExecutorProfile = useCreateExecutorProfile();
  const updateExecutorProfile = useUpdateExecutorProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<'basic' | 'executor'>('basic');

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.executorProfile) {
        setBio(user.executorProfile.bio || '');
        setSkills(user.executorProfile.skills || []);
        setHourlyRate(user.executorProfile.hourlyRate?.toString() || '');
      }
    }
  }, [user]);

  // Handle external trigger to open executor edit form
  useEffect(() => {
    if (forceExecutorEdit) {
      setEditSection('executor');
      setIsEditing(true);
    }
  }, [forceExecutorEdit]);

  if (isLoading || !user) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.emptyState}>Загрузка...</div>
      </div>
    );
  }

  // Everyone can be a customer (create orders)
  // Executor features require filled executorProfile
  const hasExecutorProfile = !!user.executorProfile;

  const handleStartEdit = (section: 'basic' | 'executor') => {
    setEditSection(section);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    onExecutorEditClose?.();
    // Reset form
    setName(user.name);
    if (user.executorProfile) {
      setBio(user.executorProfile.bio || '');
      setSkills(user.executorProfile.skills || []);
      setHourlyRate(user.executorProfile.hourlyRate?.toString() || '');
    }
  };

  const handleSaveBasic = () => {
    if (name.trim()) {
      updateProfile.mutate({ name: name.trim() }, {
        onSuccess: () => setIsEditing(false),
      });
    }
  };

  const handleSaveExecutor = () => {
    const input = {
      bio: bio || undefined,
      skills,
      hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
    };

    const mutation = user.executorProfile ? updateExecutorProfile : createExecutorProfile;
    mutation.mutate(input, {
      onSuccess: () => {
        setIsEditing(false);
        onExecutorEditClose?.();
      },
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

  // Edit mode: Basic
  if (isEditing && editSection === 'basic') {
    return (
      <div className={styles.sidebar}>
        <div className={styles.editHeader}>
          <Typography.Text view="primary-medium" weight="bold">
            Редактирование
          </Typography.Text>
          <div className={styles.editActions}>
            <Button view="tertiary" size="xs" onClick={handleCancelEdit}>
              Отмена
            </Button>
            <Button
              view="primary"
              size="xs"
              onClick={handleSaveBasic}
              loading={updateProfile.isPending}
            >
              Сохранить
            </Button>
          </div>
        </div>
        <div className={styles.editForm}>
          <Input
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            block
          />
        </div>
      </div>
    );
  }

  // Edit mode: Executor
  if (isEditing && editSection === 'executor') {
    return (
      <div className={styles.sidebar}>
        <div className={styles.editHeader}>
          <Typography.Text view="primary-medium" weight="bold">
            Профиль исполнителя
          </Typography.Text>
          <div className={styles.editActions}>
            <Button view="tertiary" size="xs" onClick={handleCancelEdit}>
              Отмена
            </Button>
            <Button
              view="primary"
              size="xs"
              onClick={handleSaveExecutor}
              loading={createExecutorProfile.isPending || updateExecutorProfile.isPending}
            >
              Сохранить
            </Button>
          </div>
        </div>
        <div className={styles.editForm}>
          <Textarea
            label="О себе"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            showCounter
            block
          />

          <div className={styles.skillsEdit}>
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
            size="s"
            block
          />
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className={styles.sidebar}>
      {/* Header: Avatar + Name */}
      <div className={styles.header}>
        <Circle
          size={64}
          text={user.name.charAt(0).toUpperCase()}
          backgroundColor="#e5e5e5"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <Typography.Title tag="h3" view="xsmall" className={styles.userName}>
            {user.name}
          </Typography.Title>
          <div className={styles.userEmail}>{user.email}</div>
          {hasExecutorProfile && (
            <Tag view="filled" size="xxs" className={styles.roleBadge}>
              Исполнитель
            </Tag>
          )}
        </div>
      </div>

      <Button view="secondary" size="xs" block onClick={() => handleStartEdit('basic')}>
        Редактировать
      </Button>

      {/* Executor Stats - only show if has profile */}
      {hasExecutorProfile && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Статистика</div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{user.executorProfile!.rating.toFixed(1)}</div>
                <div className={styles.statLabel}>Рейтинг</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{user.executorProfile!.completedCount}</div>
                <div className={styles.statLabel}>Выполнено</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Customer Stats - show for everyone (anyone can create orders) */}
      <div className={styles.divider} />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Мои заказы</div>
        <div
          className={styles.contextLink}
          onClick={onOrdersClick}
        >
          <span className={styles.contextIcon}>📋</span>
          <span className={styles.contextText}>Всего заказов</span>
          <span className={styles.contextValue}>{ordersCount?.count || 0}</span>
        </div>
      </div>

      {/* Executor Profile: Skills & Rate - show for everyone so they can become executor */}
      <div className={styles.divider} />
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Профиль исполнителя</div>

        {hasExecutorProfile ? (
          <>
            {user.executorProfile!.skills.length > 0 && (
              <div className={styles.skills}>
                {user.executorProfile!.skills.map((skill) => (
                  <Tag key={skill} view="outlined" size="xxs">
                    {skill}
                  </Tag>
                ))}
              </div>
            )}

            {user.executorProfile!.hourlyRate && (
              <div className={styles.rateInfo}>
                <span className={styles.rateLabel}>Ставка:</span>
                <span className={styles.rateValue}>
                  {user.executorProfile!.hourlyRate} ₽/час
                </span>
              </div>
            )}

            <Button
              view="tertiary"
              size="xs"
              block
              onClick={() => handleStartEdit('executor')}
            >
              Редактировать профиль
            </Button>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👤</div>
            <Typography.Text view="primary-small" color="secondary">
              Заполните профиль, чтобы искать заказы
            </Typography.Text>
            <Button
              view="primary"
              size="xs"
              onClick={() => handleStartEdit('executor')}
              style={{ marginTop: 12 }}
            >
              Стать исполнителем
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
