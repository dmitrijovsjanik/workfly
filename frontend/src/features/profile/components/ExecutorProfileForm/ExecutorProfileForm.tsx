import { useState, useEffect } from 'react';
import { Input } from '@alfalab/core-components-input';
import { Textarea } from '@alfalab/core-components-textarea';
import { Button } from '@alfalab/core-components-button';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import type { ExecutorProfile } from '@/shared/types';
import { useCreateExecutorProfile, useUpdateExecutorProfile } from '../../hooks/useExecutorProfile';
import { ApiClientError } from '@/shared/api';
import styles from './ExecutorProfileForm.module.css';

interface ExecutorProfileFormProps {
  profile?: ExecutorProfile | null;
  onSuccess?: () => void;
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
  'AWS',
  'Go',
];

export function ExecutorProfileForm({ profile, onSuccess }: ExecutorProfileFormProps) {
  const [bio, setBio] = useState(profile?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate?.toString() || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolioUrl || '');
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears?.toString() || '');

  const createProfile = useCreateExecutorProfile();
  const updateProfile = useUpdateExecutorProfile();

  const mutation = profile ? updateProfile : createProfile;
  const error = mutation.error instanceof ApiClientError ? mutation.error.message : mutation.error?.message;

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setHourlyRate(profile.hourlyRate?.toString() || '');
      setSkills(profile.skills || []);
      setPortfolioUrl(profile.portfolioUrl || '');
      setExperienceYears(profile.experienceYears?.toString() || '');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      bio: bio || undefined,
      hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
      skills,
      portfolioUrl: portfolioUrl || undefined,
      experienceYears: experienceYears ? parseInt(experienceYears, 10) : undefined,
    };

    mutation.mutate(input, { onSuccess });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Typography.Title tag="h3" view="xsmall">
        {profile ? 'Редактирование профиля исполнителя' : 'Создание профиля исполнителя'}
      </Typography.Title>

      {error && (
        <div className={styles.error}>
          <Typography.Text view="primary-small" color="negative">
            {error}
          </Typography.Text>
        </div>
      )}

      <Textarea
        label="О себе"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={1000}
        showCounter
        block
      />

      <Input
        label="Ставка (руб/час)"
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        placeholder="Например: 2000"
        block
      />

      <Input
        label="Опыт работы (лет)"
        type="number"
        value={experienceYears}
        onChange={(e) => setExperienceYears(e.target.value)}
        min={0}
        max={50}
      />

      <Input
        label="Ссылка на портфолио"
        type="text"
        value={portfolioUrl}
        onChange={(e) => setPortfolioUrl(e.target.value)}
        placeholder="https://..."
      />

      <div className={styles.skillsSection}>
        <Typography.Text view="primary-small" weight="medium">
          Навыки ({skills.length}/20)
        </Typography.Text>

        <div className={styles.selectedSkills}>
          {skills.map((skill) => (
            <Tag key={skill} view="filled" size="xxs" checked onClick={() => removeSkill(skill)}>
              {skill} x
            </Tag>
          ))}
        </div>

        <Input
          label="Добавить навык"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          rightAddons={
            <Button type="button" view="text" size="xs" onClick={() => addSkill(newSkill)}>
              Добавить
            </Button>
          }
        />

        <div className={styles.suggestedSkills}>
          <Typography.Text view="primary-small" color="secondary">
            Популярные:
          </Typography.Text>
          <div className={styles.skillsList}>
            {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
              <Tag key={skill} view="outlined" size="xxs" onClick={() => addSkill(skill)}>
                + {skill}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" view="primary" size="m" block loading={mutation.isPending}>
        {profile ? 'Сохранить' : 'Создать профиль'}
      </Button>
    </form>
  );
}
