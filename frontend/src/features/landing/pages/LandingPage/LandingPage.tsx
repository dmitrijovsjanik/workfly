import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Button } from '@alfalab/core-components-button';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { cardStyles } from '@/components';
import styles from './LandingPage.module.css';

// Demo data for auto-swiping cards
const DEMO_CARDS = [
  {
    id: '1',
    type: 'order' as const,
    title: 'Редизайн мобильного приложения',
    budget: 150000,
    category: 'Дизайн',
    skills: ['UI/UX', 'Figma', 'iOS'],
    description: 'Нужно обновить дизайн приложения для доставки еды. Около 20 экранов.',
    customer: { name: 'Иван П.' },
  },
  {
    id: '2',
    type: 'order' as const,
    title: 'Разработка Telegram бота',
    budget: 50000,
    category: 'Разработка',
    skills: ['Python', 'Telegram API'],
    description: 'Бот для автоматизации записи клиентов. Интеграция с Google Calendar.',
    customer: { name: 'Мария К.' },
  },
  {
    id: '3',
    type: 'order' as const,
    title: 'Лендинг для стартапа',
    budget: 80000,
    category: 'Разработка',
    skills: ['React', 'TypeScript', 'Tailwind'],
    description: 'Современный лендинг с анимациями и интеграцией форм.',
    customer: { name: 'Сергей Д.' },
  },
  {
    id: '4',
    type: 'order' as const,
    title: 'SEO-тексты для сайта',
    budget: 25000,
    category: 'Копирайтинг',
    skills: ['Копирайтинг', 'SEO', 'Контент'],
    description: 'Нужны продающие тексты для 10 страниц интернет-магазина.',
    customer: { name: 'Анна В.' },
  },
  {
    id: '5',
    type: 'order' as const,
    title: 'Настройка рекламы в VK',
    budget: 40000,
    category: 'Маркетинг',
    skills: ['VK Ads', 'Таргетинг', 'Аналитика'],
    description: 'Запуск и ведение рекламной кампании для онлайн-школы.',
    customer: { name: 'Дмитрий Л.' },
  },
];

type DemoCard = (typeof DEMO_CARDS)[number];

interface DemoSwipeCardProps {
  card: DemoCard;
  isTop: boolean;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  autoSwipeDirection?: 'left' | 'right' | null;
}

function DemoSwipeCard({ card, isTop, onSwipeComplete, autoSwipeDirection }: DemoSwipeCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.5, 0.8, 1, 0.8, 0.5]);

  // Overlay opacity based on x position
  const likeOverlayOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const nopeOverlayOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  useEffect(() => {
    if (isTop && !isExiting) {
      x.set(0);
    }
  }, [isTop, isExiting, x]);

  // Auto-swipe animation
  useEffect(() => {
    if (autoSwipeDirection && isTop && !isExiting) {
      setIsExiting(true);
      const targetX = autoSwipeDirection === 'right' ? 500 : -500;
      animate(x, targetX, {
        type: 'tween',
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0],
        onComplete: () => {
          onSwipeComplete(autoSwipeDirection);
        },
      });
    }
  }, [autoSwipeDirection, isTop, isExiting, x, onSwipeComplete]);

  return (
    <motion.div
      className={`${cardStyles.card} ${styles.swipeCard}`}
      style={{
        zIndex: isTop ? 2 : 1,
        x,
        rotate,
        opacity,
        pointerEvents: 'none',
      }}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
      }}
      transition={{ type: 'spring', stiffness: 800, damping: 35 }}
    >
      {/* Like Overlay */}
      <motion.div
        className={`${styles.overlay} ${styles.likeOverlay}`}
        style={{ opacity: likeOverlayOpacity }}
      >
        LIKE
      </motion.div>

      {/* Nope Overlay */}
      <motion.div
        className={`${styles.overlay} ${styles.nopeOverlay}`}
        style={{ opacity: nopeOverlayOpacity }}
      >
        NOPE
      </motion.div>

      {/* Card Content */}
      <div className={cardStyles.content}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <Tag view="filled" size="xxs" className={styles.category}>
            {card.category}
          </Tag>
          <div className={styles.budget}>{card.budget?.toLocaleString('ru-RU')} ₽</div>
        </div>

        {/* Title */}
        <Typography.Title tag="h2" view="small" className={styles.cardTitle}>
          {card.title}
        </Typography.Title>

        {/* Description */}
        <Typography.Text view="primary-medium" className={styles.cardDescription}>
          {card.description}
        </Typography.Text>

        {/* Skills */}
        <div className={styles.cardSkills}>
          {card.skills.map((skill) => (
            <Tag key={skill} view="outlined" size="xxs">
              {skill}
            </Tag>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.cardFooter}>
          <div className={styles.customer}>
            <div className={styles.customerAvatar}>
              {card.customer.name.charAt(0).toUpperCase()}
            </div>
            <span>{card.customer.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSwipeDirection, setAutoSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentCard = DEMO_CARDS[currentIndex % DEMO_CARDS.length];
  const nextCard = DEMO_CARDS[(currentIndex + 1) % DEMO_CARDS.length];

  const handleSwipeComplete = useCallback(() => {
    setAutoSwipeDirection(null);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Auto-swipe timer
  useEffect(() => {
    if (autoSwipeDirection) return;

    const delay = 500 + Math.random() * 1500;
    const timer = setTimeout(() => {
      setAutoSwipeDirection(Math.random() > 0.3 ? 'right' : 'left');
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, autoSwipeDirection]);

  return (
    <div className={styles.layout}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>workfly</span>
          </div>
        </header>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.body}>
            <div className={styles.cardStack}>
              <AnimatePresence>
                {/* Next card (background) */}
                <DemoSwipeCard
                  key={`next-${(currentIndex + 1) % DEMO_CARDS.length}`}
                  card={nextCard}
                  isTop={false}
                  onSwipeComplete={() => {}}
                />

                {/* Current card (top) */}
                <DemoSwipeCard
                  key={`current-${currentIndex % DEMO_CARDS.length}-${currentIndex}`}
                  card={currentCard}
                  isTop={true}
                  onSwipeComplete={handleSwipeComplete}
                  autoSwipeDirection={autoSwipeDirection}
                />
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
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
        </footer>
      </div>
    </div>
  );
}
