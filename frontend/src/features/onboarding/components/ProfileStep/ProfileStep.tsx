import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Textarea } from '@alfalab/core-components-textarea';
import { Input } from '@alfalab/core-components-input';
import { Tag } from '@alfalab/core-components-tag';
import { Select } from '@alfalab/core-components-select';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useCreateExecutorProfile } from '@/features/profile/hooks/useExecutorProfile';
import { useCreateOrder } from '@/features/orders/hooks/useCreateOrder';
import { ApiClientError } from '@/shared/api';
import type { Category } from '@/shared/types';
import styles from './ProfileStep.module.css';

interface ProfileStepProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'UI/UX',
  'Figma',
  'PostgreSQL',
  'Docker',
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'DEVELOPMENT', label: 'Разработка' },
  { value: 'DESIGN', label: 'Дизайн' },
  { value: 'MARKETING', label: 'Маркетинг' },
  { value: 'COPYWRITING', label: 'Копирайтинг' },
  { value: 'OTHER', label: 'Другое' },
];

export function ProfileStep({ onComplete, onSkip, onBack }: ProfileStepProps) {
  const { data: user } = useProfile();
  const createExecutorProfile = useCreateExecutorProfile();
  const createOrder = useCreateOrder();

  const isExecutor = user?.role === 'EXECUTOR' || user?.role === 'BOTH';
  const isCustomer = user?.role === 'CUSTOMER' || user?.role === 'BOTH';

  // Executor form state
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Customer form state
  const [orderTitle, setOrderTitle] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderCategory, setOrderCategory] = useState<Category>('DEVELOPMENT');
  const [orderBudget, setOrderBudget] = useState('');
  const [orderSkills, setOrderSkills] = useState<string[]>([]);
  const [orderCreated, setOrderCreated] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  const executorError = createExecutorProfile.error instanceof ApiClientError
    ? createExecutorProfile.error.message
    : createExecutorProfile.error?.message;

  const orderError = createOrder.error instanceof ApiClientError
    ? createOrder.error.message
    : createOrder.error?.message;

  const addSkill = (skill: string, isOrder = false) => {
    const trimmed = skill.trim();
    if (isOrder) {
      if (trimmed && !orderSkills.includes(trimmed) && orderSkills.length < 10) {
        setOrderSkills([...orderSkills, trimmed]);
      }
    } else {
      if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
        setSkills([...skills, trimmed]);
        setNewSkill('');
      }
    }
  };

  const removeSkill = (skillToRemove: string, isOrder = false) => {
    if (isOrder) {
      setOrderSkills(orderSkills.filter((s) => s !== skillToRemove));
    } else {
      setSkills(skills.filter((s) => s !== skillToRemove));
    }
  };

  const handleExecutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExecutorProfile.mutate(
      {
        bio: bio || undefined,
        skills,
        hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
      },
      { onSuccess: onComplete }
    );
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate(
      {
        title: orderTitle,
        description: orderDescription,
        category: orderCategory,
        budget: orderBudget ? parseInt(orderBudget, 10) : undefined,
        skillsRequired: orderSkills,
      },
      {
        onSuccess: () => {
          setOrderCreated(true);
          setOrdersCount((c) => c + 1);
          // Reset form for next order
          setOrderTitle('');
          setOrderDescription('');
          setOrderBudget('');
          setOrderSkills([]);
        },
      }
    );
  };

  const handleCreateAnother = () => {
    setOrderCreated(false);
  };

  // Customer: show success screen after creating order
  if (!isExecutor && orderCreated) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography.Title tag="h2" view="small">
            Заказ создан!
          </Typography.Title>
          <Typography.Text view="primary-small" color="secondary">
            {ordersCount === 1
              ? 'Ваш первый заказ опубликован. Исполнители уже могут его видеть.'
              : `Создано заказов: ${ordersCount}`}
          </Typography.Text>
        </div>

        <div className={styles.actions}>
          <Button view="secondary" size="m" onClick={handleCreateAnother}>
            Создать ещё заказ
          </Button>
          <Button view="primary" size="m" onClick={onComplete}>
            Начать работу
          </Button>
        </div>
      </div>
    );
  }

  // Customer: order creation form
  if (!isExecutor && isCustomer) {
    return (
      <form className={styles.container} onSubmit={handleOrderSubmit}>
        <div className={styles.header}>
          <Typography.Title tag="h2" view="small">
            Создайте первый заказ
          </Typography.Title>
          <Typography.Text view="primary-small" color="secondary">
            Опишите задачу, чтобы найти исполнителя
          </Typography.Text>
        </div>

        {orderError && (
          <div className={styles.error}>
            <Typography.Text view="primary-small" color="negative">
              {orderError}
            </Typography.Text>
          </div>
        )}

        <Input
          label="Название заказа"
          value={orderTitle}
          onChange={(e) => setOrderTitle(e.target.value)}
          placeholder="Например: Разработка landing page"
          block
          required
        />

        <Textarea
          label="Описание задачи"
          value={orderDescription}
          onChange={(e) => setOrderDescription(e.target.value)}
          maxLength={2000}
          showCounter
          block
          placeholder="Опишите что нужно сделать, требования и ожидания"
          required
        />

        <Select
          label="Категория"
          options={CATEGORIES.map((c) => ({ key: c.value, content: c.label }))}
          selected={orderCategory}
          onChange={({ selected }) => setOrderCategory((selected?.key as Category) || 'DEVELOPMENT')}
          block
        />

        <Input
          label="Бюджет (руб)"
          type="number"
          value={orderBudget}
          onChange={(e) => setOrderBudget(e.target.value)}
          placeholder="Например: 50000"
          block
        />

        <div className={styles.skillsSection}>
          <Typography.Text view="primary-small" weight="medium">
            Требуемые навыки ({orderSkills.length}/10)
          </Typography.Text>

          <div className={styles.selectedSkills}>
            {orderSkills.map((skill) => (
              <Tag key={skill} view="filled" size="xxs" onClick={() => removeSkill(skill, true)}>
                {skill} ×
              </Tag>
            ))}
          </div>

          <div className={styles.suggestedSkills}>
            {SUGGESTED_SKILLS.filter((s) => !orderSkills.includes(s)).map((skill) => (
              <Tag key={skill} view="outlined" size="xxs" onClick={() => addSkill(skill, true)}>
                + {skill}
              </Tag>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button view="secondary" size="m" onClick={onBack}>
            Назад
          </Button>
          <Button view="tertiary" size="m" onClick={onSkip}>
            Пропустить
          </Button>
          <Button type="submit" view="primary" size="m" loading={createOrder.isPending}>
            Создать заказ
          </Button>
        </div>
      </form>
    );
  }

  // Executor: profile form
  return (
    <form className={styles.container} onSubmit={handleExecutorSubmit}>
      <div className={styles.header}>
        <Typography.Title tag="h2" view="small">
          Расскажите о себе
        </Typography.Title>
        <Typography.Text view="primary-small" color="secondary">
          Это поможет заказчикам найти вас
        </Typography.Text>
      </div>

      {executorError && (
        <div className={styles.error}>
          <Typography.Text view="primary-small" color="negative">
            {executorError}
          </Typography.Text>
        </div>
      )}

      <Textarea
        label="О себе"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={500}
        showCounter
        block
        placeholder="Кратко опишите свой опыт и специализацию"
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
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
            <Tag key={skill} view="outlined" size="xxs" onClick={() => addSkill(skill)}>
              + {skill}
            </Tag>
          ))}
        </div>

        <Input
          label="Свой навык"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill(newSkill);
            }
          }}
          size="s"
        />
      </div>

      <Input
        label="Ставка (руб/час)"
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        placeholder="Например: 2000"
        block
      />

      <div className={styles.actions}>
        <Button view="secondary" size="m" onClick={onBack}>
          Назад
        </Button>
        <Button view="tertiary" size="m" onClick={onSkip}>
          Пропустить
        </Button>
        <Button type="submit" view="primary" size="m" loading={createExecutorProfile.isPending}>
          Готово
        </Button>
      </div>
    </form>
  );
}
