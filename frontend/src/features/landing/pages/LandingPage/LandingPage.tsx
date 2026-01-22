import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@alfalab/core-components-button';
import { Tag } from '@alfalab/core-components-tag';
import styles from './LandingPage.module.css';

// Demo data for auto-swiping cards
const DEMO_CARDS = [
  {
    id: '1',
    type: 'executor' as const,
    name: 'Анна К.',
    avatar: null,
    rating: 4.9,
    rate: 2500,
    skills: ['UI/UX', 'Figma', 'Web Design'],
    bio: 'Дизайнер интерфейсов с 5-летним опытом. Специализируюсь на мобильных приложениях.',
  },
  {
    id: '2',
    type: 'order' as const,
    title: 'Редизайн мобильного приложения',
    budget: 150000,
    category: 'Дизайн',
    skills: ['UI/UX', 'Figma', 'iOS'],
    description: 'Нужно обновить дизайн приложения для доставки еды. Около 20 экранов.',
  },
  {
    id: '3',
    type: 'executor' as const,
    name: 'Максим П.',
    avatar: null,
    rating: 4.7,
    rate: 3000,
    skills: ['React', 'TypeScript', 'Node.js'],
    bio: 'Fullstack разработчик. Делаю быстро и качественно.',
  },
  {
    id: '4',
    type: 'order' as const,
    title: 'Разработка Telegram бота',
    budget: 50000,
    category: 'Разработка',
    skills: ['Python', 'Telegram API'],
    description: 'Бот для автоматизации записи клиентов. Интеграция с Google Calendar.',
  },
  {
    id: '5',
    type: 'executor' as const,
    name: 'Елена С.',
    avatar: null,
    rating: 5.0,
    rate: 2000,
    skills: ['Копирайтинг', 'SEO', 'Контент'],
    bio: 'Пишу тексты, которые продают. 100+ успешных проектов.',
  },
];

type DemoCard = (typeof DEMO_CARDS)[number];

interface DemoCardProps {
  card: DemoCard;
  onSwipe: () => void;
  direction: 'left' | 'right';
}

function DemoSwipeCard({ card, onSwipe, direction }: DemoCardProps) {
  useEffect(() => {
    const delay = 1500 + Math.random() * 1500; // 1.5-3 seconds
    const timer = setTimeout(onSwipe, delay);
    return () => clearTimeout(timer);
  }, [onSwipe]);

  return (
    <motion.div
      className={styles.card}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: direction === 'right' ? 300 : -300,
        rotate: direction === 'right' ? 15 : -15,
        opacity: 0,
        transition: { duration: 0.4 },
      }}
    >
      {/* Swipe Overlay */}
      <motion.div
        className={`${styles.overlay} ${direction === 'right' ? styles.likeOverlay : styles.nopeOverlay}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <span>{card.type === 'executor' ? (direction === 'right' ? 'HIRE' : 'SKIP') : (direction === 'right' ? 'LIKE' : 'NOPE')}</span>
      </motion.div>

      <div className={styles.cardContent}>
        {card.type === 'executor' ? (
          <>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                <span>{card.name.charAt(0)}</span>
              </div>
              <div className={styles.cardHeaderInfo}>
                <div className={styles.cardName}>{card.name}</div>
                <div className={styles.cardStats}>
                  <span className={styles.rating}>★ {card.rating}</span>
                  <span className={styles.rate}>{card.rate?.toLocaleString('ru-RU')} ₽/час</span>
                </div>
              </div>
            </div>
            <p className={styles.cardBio}>{card.bio}</p>
          </>
        ) : (
          <>
            <div className={styles.cardHeader}>
              <Tag view="filled" size="xxs">{card.category}</Tag>
              <div className={styles.budget}>{card.budget?.toLocaleString('ru-RU')} ₽</div>
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
          </>
        )}

        <div className={styles.cardSkills}>
          {card.skills.map((skill) => (
            <Tag key={skill} view="outlined" size="xxs">{skill}</Tag>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');

  const handleSwipe = useCallback(() => {
    setSwipeDirection(Math.random() > 0.5 ? 'right' : 'left');
    setCurrentIndex((prev) => (prev + 1) % DEMO_CARDS.length);
  }, []);

  const currentCard = DEMO_CARDS[currentIndex];

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoText}>workfly</span>
      </div>

      {/* Card Stack */}
      <div className={styles.cardStack}>
        <AnimatePresence mode="popLayout">
          <DemoSwipeCard
            key={currentCard.id + '-' + currentIndex}
            card={currentCard}
            onSwipe={handleSwipe}
            direction={swipeDirection}
          />
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          view="secondary"
          size="m"
          className={styles.actionButton}
          onClick={() => navigate('/login')}
        >
          Войти
        </Button>
        <Button
          view="primary"
          size="m"
          className={styles.actionButton}
          onClick={() => navigate('/register')}
        >
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
}
