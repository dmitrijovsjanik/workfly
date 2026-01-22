import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@alfalab/core-components-input';
import { Textarea } from '@alfalab/core-components-textarea';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import { useCreateExecutorProfile } from '../../hooks/useExecutorProfile';
import { ApiClientError } from '@/shared/api';
import styles from './CreateProfilePage.module.css';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma',
  'PostgreSQL', 'Docker', 'AWS', 'Go', 'Vue', 'Angular',
];

export function CreateProfilePage() {
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const createProfile = useCreateExecutorProfile();
  const error = createProfile.error instanceof ApiClientError
    ? createProfile.error.message
    : createProfile.error?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      bio: bio || undefined,
      hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
      skills,
      portfolioUrl: portfolioUrl || undefined,
      experienceYears: experienceYears ? parseInt(experienceYears, 10) : undefined,
    };

    createProfile.mutate(input, {
      onSuccess: () => {
        navigate('/dashboard', { replace: true });
      },
    });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
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

  const canSubmit = bio.trim().length > 0 && skills.length > 0;

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoText}>workfly</span>
      </div>

      {/* Card */}
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Ваша карточка</span>
          <span className={styles.cardSubtitle}>Заполните профиль, чтобы начать искать проекты</span>
        </div>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <div className={styles.cardContent}>
          <Textarea
            label="О себе"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            showCounter
            block
            placeholder="Расскажите о своём опыте и специализации"
          />

          <div className={styles.row}>
            <Input
              label="Ставка ₽/час"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="2000"
              block
            />
            <Input
              label="Опыт (лет)"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              min={0}
              max={50}
              placeholder="3"
              block
            />
          </div>

          <Input
            label="Портфолио"
            type="text"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://behance.net/..."
            block
          />

          <div className={styles.skillsSection}>
            <label className={styles.skillsLabel}>Навыки ({skills.length}/10)</label>

            {skills.length > 0 && (
              <div className={styles.selectedSkills}>
                {skills.map((skill) => (
                  <Tag
                    key={skill}
                    view="filled"
                    size="xxs"
                    checked
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Tag>
                ))}
              </div>
            )}

            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите навык и нажмите Enter"
              block
            />

            <div className={styles.suggestedSkills}>
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((skill) => (
                <Tag
                  key={skill}
                  view="outlined"
                  size="xxs"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.cardActions}>
          <Button
            type="submit"
            view="primary"
            size="m"
            block
            loading={createProfile.isPending}
            disabled={!canSubmit}
          >
            Создать карточку
          </Button>
        </div>
      </form>
    </div>
  );
}
