import { useState } from 'react';
import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import { Textarea } from '@alfalab/core-components-textarea';
import { Input } from '@alfalab/core-components-input';
import { Tag } from '@alfalab/core-components-tag';
import { Select } from '@alfalab/core-components-select';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { ApiClientError } from '@/shared/api';
import type { Category } from '@/shared/types';
import styles from './CreateOrderForm.module.css';

interface CreateOrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
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

export function CreateOrderForm({ onSuccess, onCancel }: CreateOrderFormProps) {
  const createOrder = useCreateOrder();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('DEVELOPMENT');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const error = createOrder.error instanceof ApiClientError
    ? createOrder.error.message
    : createOrder.error?.message;

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate(
      {
        title,
        description,
        category,
        budget: budget ? parseInt(budget, 10) : undefined,
        skillsRequired: skills,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setBudget('');
          setSkills([]);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.error}>
          <Typography.Text view="primary-small" color="negative">
            {error}
          </Typography.Text>
        </div>
      )}

      <Input
        label="Название заказа"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Например: Разработка landing page"
        block
        required
      />

      <Textarea
        label="Описание задачи"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
        showCounter
        block
        placeholder="Опишите что нужно сделать, требования и ожидания"
        required
      />

      <Select
        label="Категория"
        options={CATEGORIES.map((c) => ({ key: c.value, content: c.label }))}
        selected={category}
        onChange={({ selected }) => setCategory((selected?.key as Category) || 'DEVELOPMENT')}
        block
      />

      <Input
        label="Бюджет (руб)"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Например: 50000"
        block
      />

      <div className={styles.skillsSection}>
        <Typography.Text view="primary-small" weight="medium">
          Требуемые навыки ({skills.length}/10)
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
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button view="secondary" size="m" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button type="submit" view="primary" size="m" loading={createOrder.isPending}>
          Создать заказ
        </Button>
      </div>
    </form>
  );
}
