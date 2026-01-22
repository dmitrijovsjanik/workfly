# Гайд по компонентам Workfly

Подробное руководство по всем компонентам фронтенда для грамотной разработки.

**Связанные документы:**
- [CLAUDE.md](CLAUDE.md) — основные инструкции проекта
- [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md) — принципы дизайна и UI/UX

---

## Содержание

1. [Общие (shared) компоненты](#общие-shared-компоненты)
2. [Компоненты авторизации](#компоненты-авторизации-auth)
3. [Компоненты заказов](#компоненты-заказов-orders)
4. [Компоненты исполнителей](#компоненты-исполнителей-executors)
5. [Компоненты профиля](#компоненты-профиля-profile)
6. [Компоненты дашборда](#компоненты-дашборда-dashboard)
7. [Компоненты онбординга](#компоненты-онбординга-onboarding)
8. [Компоненты лендинга](#компоненты-лендинга-landing)
9. [Хуки и состояние](#хуки-и-состояние)
10. [Паттерны анимаций](#паттерны-анимаций)
11. [API-клиент](#api-клиент)
12. [Типы данных](#типы-данных)

---

## Общие (shared) компоненты

### Layout

**Путь:** `frontend/src/components/Layout/Layout.tsx`

**Назначение:** Главная обёртка приложения с хедером и контентом.

**Использование:**
```tsx
// Используется в App.tsx как обёртка для роутов
<Route element={<Layout />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

**Зависимости:**
- `react-router-dom` — Outlet для вложенных роутов
- `useAuth` — условный рендер хедера
- `Header` — компонент навигации

---

### Header

**Путь:** `frontend/src/components/Header/Header.tsx`

**Назначение:** Верхняя навигация с аватаром, логотипом и уведомлениями.

**Элементы:**
- Аватар пользователя / кнопка назад (зависит от роута)
- Логотип (клик → дашборд)
- Иконка уведомлений (клик → сообщения)

**Зависимости:**
```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification02Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons/stroke-rounded';
import { Circle } from '@alfalab/core-components-icon-view/circle';
```

**Пример использования Circle для аватара:**
```tsx
<Circle
  size={40}
  text={user?.name?.charAt(0).toUpperCase() || '?'}
  backgroundColor="#e5e5e5"
/>
```

---

### BottomNav

**Путь:** `frontend/src/components/BottomNav/BottomNav.tsx`

**Назначение:** Нижняя навигация для мобильных устройств.

**Пункты меню:**
| ID | Иконка | Путь | Название |
|----|--------|------|----------|
| home | Home01Icon | /dashboard | Главная |
| search | Search01Icon | /swipe | Поиск |
| create | Add01Icon | /create | Создать |
| messages | Message01Icon | /messages | Чаты |
| profile | UserIcon | /profile | Профиль |

**Пример структуры:**
```tsx
const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home01Icon, label: 'Главная', path: '/dashboard' },
  // ...
];

// Активное состояние
const isActive = location.pathname === item.path;
```

---

### Card

**Путь:** `frontend/src/components/Card/Card.tsx`

**Назначение:** Универсальная карточка-контейнер.

**Props:**
```tsx
interface CardProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
```

**Особенности:**
- Поддержка forwardRef
- Принимает все стандартные div-пропсы
- Экспортирует стили для композиции

**Использование:**
```tsx
import { Card } from '@/components';

<Card className={styles.customCard}>
  <div>Контент карточки</div>
</Card>
```

---

### ProtectedRoute

**Путь:** `frontend/src/components/ProtectedRoute/ProtectedRoute.tsx`

**Назначение:** Защита роутов для авторизованных пользователей.

**Логика:**
1. Проверяет `isAuthenticated`
2. Показывает загрузку при `isLoading`
3. Редиректит на `/login` если не авторизован
4. Сохраняет `location` для возврата после логина

**Использование:**
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## Компоненты авторизации (auth)

### LoginForm

**Путь:** `frontend/src/features/auth/components/LoginForm/LoginForm.tsx`

**Назначение:** Форма входа по email/паролю.

**Поля:**
- Email (required)
- Password (required)

**Зависимости:**
```tsx
import { Button } from '@alfalab/core-components-button';
import { Input } from '@alfalab/core-components-input';
import { PasswordInput } from '@alfalab/core-components-password-input';
import { Typography } from '@alfalab/core-components-typography';
```

**Хук:**
```tsx
const { mutate: login, isPending, error } = useLogin();

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  login({ email, password });
};
```

**UI-паттерны:**
- Кнопка с `loading={isPending}`
- Отображение ошибок через `Typography` с `color="negative"`
- Ссылка на регистрацию

---

### RegisterForm

**Путь:** `frontend/src/features/auth/components/RegisterForm/RegisterForm.tsx`

**Назначение:** Форма регистрации нового пользователя.

**Поля:**
- Имя (required)
- Email (required)
- Пароль (required, hint: "Минимум 8 символов")

**Хук:** `useRegister()`

---

### Auth Store (Zustand)

**Путь:** `frontend/src/features/auth/store/authStore.ts`

**Состояние:**
```tsx
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}
```

**Персистентность:**
- Ключ: `'workfly-auth'`
- Сохраняет: user, accessToken, isAuthenticated
- При восстановлении устанавливает токен в API-клиент

---

## Компоненты заказов (orders)

### SwipeCard

**Путь:** `frontend/src/features/orders/components/SwipeCard/SwipeCard.tsx`

**Назначение:** Анимированная карточка заказа для свайпов.

**Props:**
```tsx
interface SwipeCardProps {
  order: Order;
  onSwipe: (direction: 'left' | 'right') => void;
  userSkills?: string[];  // для подсветки совпадающих навыков
  isTop?: boolean;        // верхняя карточка в стеке
}
```

**Анимация (Framer Motion):**
```tsx
const x = useMotionValue(0);
const rotate = useTransform(x, [-200, 200], [-15, 15]);
const likeOpacity = useTransform(x, [0, 100], [0, 1]);
const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

// Порог свайпа
const SWIPE_THRESHOLD = 100;

const handleDragEnd = (_: unknown, info: PanInfo) => {
  if (info.offset.x > SWIPE_THRESHOLD) onSwipe('right');
  else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('left');
};
```

**Содержимое карточки:**
- Категория (Tag filled)
- Бюджет
- Заголовок и описание
- Навыки (подсветка совпадающих)
- Информация о заказчике

**Оверлеи:**
- "LIKE" (правый свайп) — зелёный
- "NOPE" (левый свайп) — красный

---

### OrderCard

**Путь:** `frontend/src/features/orders/components/OrderCard/OrderCard.tsx`

**Назначение:** Статическая карточка заказа (без свайпов).

**Props:**
```tsx
interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onView?: (order: Order) => void;
}
```

**Цвета статусов:**
| Статус | Цвет |
|--------|------|
| DRAFT | Серый |
| ACTIVE | Зелёный |
| IN_PROGRESS | Синий |
| COMPLETED | Серый |
| CANCELLED | Красный |

---

### CreateOrderForm

**Путь:** `frontend/src/features/orders/components/CreateOrderForm/CreateOrderForm.tsx`

**Назначение:** Форма создания нового заказа.

**Props:**
```tsx
interface CreateOrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}
```

**Поля:**
| Поле | Тип | Лимит |
|------|-----|-------|
| Название | Input | 100 символов |
| Описание | Textarea | 2000 символов |
| Категория | Select | — |
| Бюджет | Input number | optional |
| Навыки | Tags | до 10 |

**Предложенные навыки:**
```tsx
const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX',
  'Figma', 'PostgreSQL', 'Docker', 'AWS', 'Go'
];
```

**Хук:** `useCreateOrder()`

---

## Компоненты исполнителей (executors)

### ExecutorCard

**Путь:** `frontend/src/features/executors/components/ExecutorCard/ExecutorCard.tsx`

**Назначение:** Анимированная карточка исполнителя для свайпов.

**Props:**
```tsx
interface ExecutorCardProps {
  executor: Executor;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop?: boolean;
}
```

**Содержимое:**
- Аватар (Circle с инициалом)
- Имя
- Рейтинг (★) и количество выполненных заказов
- Ставка (час)
- Описание (bio)
- Навыки (теги)
- Опыт
- Ссылка на портфолио

**Оверлеи:**
- "HIRE" (правый свайп)
- "SKIP" (левый свайп)

---

## Компоненты профиля (profile)

### ProfileCard

**Путь:** `frontend/src/features/profile/components/ProfileCard/ProfileCard.tsx`

**Назначение:** Отображение профиля пользователя.

**Props:**
```tsx
interface ProfileCardProps {
  user: User;
}
```

**Секции:**
1. Аватар + имя + email
2. Роль (бейдж)
3. Профиль исполнителя (если есть):
   - Bio
   - Навыки
   - Ставка
   - Опыт
   - Рейтинг
   - Выполненные заказы

---

### ExecutorProfileForm

**Путь:** `frontend/src/features/profile/components/ExecutorProfileForm/ExecutorProfileForm.tsx`

**Назначение:** Создание/редактирование профиля исполнителя.

**Props:**
```tsx
interface ExecutorProfileFormProps {
  profile?: ExecutorProfile | null;  // для режима редактирования
  onSuccess?: () => void;
}
```

**Поля:**
| Поле | Тип | Лимит |
|------|-----|-------|
| Bio | Textarea | 1000 символов |
| Ставка | Input number | — |
| Опыт (лет) | Input number | 0-50 |
| Портфолио | Input url | — |
| Навыки | Tags | до 20 |

**Добавление навыков:**
```tsx
const addSkill = (skill: string) => {
  const trimmed = skill.trim();
  if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
    setSkills([...skills, trimmed]);
  }
};

// По Enter или клику на предложенный
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addSkill(newSkill);
  }
};
```

**Хуки:**
- `useCreateExecutorProfile()` — создание
- `useUpdateExecutorProfile()` — обновление

---

## Компоненты дашборда (dashboard)

### DashboardPage

**Путь:** `frontend/src/features/dashboard/pages/DashboardPage/DashboardPage.tsx`

**Назначение:** Главная страница со свайпами (заказы или исполнители).

**Режимы:**
```tsx
type SwipeMode = 'orders' | 'executors';

// По умолчанию
const defaultMode = hasExecutorProfile ? 'orders' : 'executors';
```

**Условия доступа:**
- `canSwipeOrders`: есть профиль исполнителя
- `canSwipeExecutors`: есть опубликованные заказы

**Стек карточек:**
```tsx
<AnimatePresence>
  {nextCard && <Card key={nextCard.id} isTop={false} />}
  {currentCard && <Card key={currentCard.id} isTop={true} />}
</AnimatePresence>
```

**Кнопки действий:**
| Кнопка | Действие |
|--------|----------|
| ✕ (Skip) | Левый свайп |
| 💬 (Chat) | Переход в сообщения |
| ♥ (Like) | Правый свайп |

---

### ExecutorContent

**Путь:** `frontend/src/features/dashboard/components/ExecutorContent/ExecutorContent.tsx`

**Назначение:** Список заказов для исполнителя (list view).

**Особенности:**
- Подсветка совпадающих навыков
- Кнопки "Откликнуться" и "Пропустить"
- Отображение бюджета, категории, даты

---

## Компоненты онбординга (onboarding)

### OnboardingPage

**Путь:** `frontend/src/features/onboarding/pages/OnboardingPage/OnboardingPage.tsx`

**Назначение:** Выбор роли при первом входе.

**Опции:**
```tsx
const ROLE_OPTIONS: RoleOption[] = [
  { value: 'EXECUTOR', mainText: 'Я исполнитель', subText: 'ищу проекты' },
  { value: 'CUSTOMER', mainText: 'Я заказчик', subText: 'ищу исполнителя' },
];
```

**Навигация после выбора:**
- EXECUTOR → `/create-profile`
- CUSTOMER → `/create`

**Иконка выбора:**
```tsx
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

{isSelected && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />}
```

---

### RoleStep

**Путь:** `frontend/src/features/onboarding/components/RoleStep/RoleStep.tsx`

**Назначение:** Шаг выбора роли в multi-step онбординге.

**Props:**
```tsx
interface RoleStepProps {
  onNext: () => void;
  onBack: () => void;
}
```

---

## Компоненты лендинга (landing)

### LandingPage

**Путь:** `frontend/src/features/landing/pages/LandingPage/LandingPage.tsx`

**Назначение:** Публичная страница с демо-анимацией свайпов.

**Демо-карточки:**
```tsx
const DEMO_CARDS = [
  {
    type: 'executor',
    name: 'Анна К.',
    rating: 4.9,
    rate: 2500,
    skills: ['UI/UX', 'Figma', 'Web Design'],
  },
  {
    type: 'order',
    title: 'Редизайн мобильного приложения',
    budget: 150000,
    category: 'Дизайн',
    skills: ['UI/UX', 'Figma', 'iOS'],
  },
];
```

**Авто-свайп:**
```tsx
useEffect(() => {
  const delay = 1500 + Math.random() * 1500; // 1.5-3 сек
  const timer = setTimeout(onSwipe, delay);
  return () => clearTimeout(timer);
}, [onSwipe]);
```

---

## Хуки и состояние

### Хуки авторизации

```tsx
// Получение состояния
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  return { user, isAuthenticated, isLoading, logout };
}

// Мутация логина
export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate(from, { replace: true });
    },
  });
}
```

### Хуки профиля

```tsx
// Получение профиля
export function useProfile() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getMe(),
    enabled: isAuthenticated,
  });
}

// Создание профиля исполнителя
export function useCreateExecutorProfile() {
  return useMutation({
    mutationFn: (input) => profileApi.createExecutorProfile(input),
  });
}

// Обновление профиля исполнителя
export function useUpdateExecutorProfile() {
  return useMutation({
    mutationFn: (input) => profileApi.updateExecutorProfile(input),
  });
}
```

### Хуки заказов

```tsx
// Активные заказы для свайпов
export function useActiveOrders() {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: () => ordersApi.getActive(),
  });
}

// Количество заказов пользователя
export function useOrdersCount() {
  return useQuery({
    queryKey: ['orders', 'count'],
    queryFn: () => ordersApi.getMyOrdersCount(),
  });
}

// Создание заказа
export function useCreateOrder() {
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
  });
}
```

### Хуки исполнителей

```tsx
// Список исполнителей для заказчика
export function useExecutors() {
  return useQuery({
    queryKey: ['executors'],
    queryFn: () => profileApi.getExecutors(),
  });
}
```

---

## Паттерны анимаций

### Свайп-карточки (Framer Motion)

```tsx
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';

// Motion values
const x = useMotionValue(0);
const rotate = useTransform(x, [-200, 200], [-15, 15]);
const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
const likeOpacity = useTransform(x, [0, 100], [0, 1]);
const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

// Обработка свайпа
const handleDragEnd = (_: unknown, info: PanInfo) => {
  if (info.offset.x > SWIPE_THRESHOLD) {
    onSwipe('right');
  } else if (info.offset.x < -SWIPE_THRESHOLD) {
    onSwipe('left');
  }
};

// Компонент
<motion.div
  style={{ x, rotate, opacity }}
  drag={isTop ? 'x' : false}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.9}
  onDragEnd={handleDragEnd}
  initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
  animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
  exit={{
    x: x.get() > 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.2 },
  }}
/>
```

### Стек карточек

```tsx
<AnimatePresence>
  {nextCard && <SwipeCard key={nextCard.id} isTop={false} />}
  {currentCard && <SwipeCard key={currentCard.id} isTop={true} />}
</AnimatePresence>
```

**Важно:** порядок рендера — сначала следующая карточка (фон), потом текущая (верх).

---

## API-клиент

**Путь:** `frontend/src/shared/api/client.ts`

### Базовый клиент

```tsx
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, ...fetchConfig } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchConfig.headers as Record<string, string>),
  };

  if (!skipAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // ... fetch logic with auto-refresh on 401
}
```

### Обработка ошибок в компонентах

```tsx
const error = createOrder.error instanceof ApiClientError
  ? createOrder.error.message
  : createOrder.error?.message;

{error && (
  <Typography.Text view="primary-small" color="negative">
    {error}
  </Typography.Text>
)}
```

---

## Типы данных

### User

**Путь:** `frontend/src/shared/types/user.ts`

```tsx
export type Role = 'CUSTOMER' | 'EXECUTOR' | 'BOTH';

export interface User {
  id: string;
  email: string | null;
  telegramId?: string | null;
  name: string;
  avatarUrl: string | null;
  role: Role;
  createdAt?: string;
  lastActiveAt?: string;
  executorProfile?: ExecutorProfile | null;
  customerProfile?: CustomerProfile | null;
}

export interface ExecutorProfile {
  id: string;
  bio: string | null;
  hourlyRate: number | null;
  skills: string[];
  portfolioUrl: string | null;
  experienceYears: number | null;
  rating: number;
  completedCount: number;
}

export interface CustomerProfile {
  id: string;
  companyName: string | null;
  bio: string | null;
}

export interface Executor {
  id: string;
  name: string;
  avatarUrl: string | null;
  executorProfile: ExecutorProfile;
}
```

### Order

**Путь:** `frontend/src/shared/types/order.ts`

```tsx
export type Category = 'DEVELOPMENT' | 'DESIGN' | 'MARKETING' | 'COPYWRITING' | 'OTHER';
export type OrderStatus = 'DRAFT' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customerId: string;
  title: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  skillsRequired: string[];
  category: Category;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateOrderInput {
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  skillsRequired?: string[];
  category: Category;
}
```

---

## Интеграция с @alfalab/core-components

### Импорты (tree-shaking)

```tsx
// Рекомендуемый способ — отдельные пакеты
import { Button } from '@alfalab/core-components-button';
import { Input } from '@alfalab/core-components-input';
import { PasswordInput } from '@alfalab/core-components-password-input';
import { Textarea } from '@alfalab/core-components-textarea';
import { Typography } from '@alfalab/core-components-typography';
import { Tag } from '@alfalab/core-components-tag';
import { Select } from '@alfalab/core-components-select';
import { Circle } from '@alfalab/core-components-icon-view/circle';
import { Skeleton } from '@alfalab/core-components-skeleton';
```

### Основные компоненты

#### Button
```tsx
// Primary CTA
<Button view="primary" size="m" loading={isPending} block>
  Отправить
</Button>

// Secondary
<Button view="secondary" size="s">
  Отмена
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  block
  required
/>
```

#### Typography
```tsx
// Заголовок
<Typography.Title tag="h1" view="small">
  Заголовок страницы
</Typography.Title>

// Текст
<Typography.Text view="primary-small" color="secondary">
  Вторичный текст
</Typography.Text>

// Ошибка
<Typography.Text view="primary-small" color="negative">
  Текст ошибки
</Typography.Text>
```

#### Tag
```tsx
// Навык с удалением
<Tag view="filled" size="xxs" onClick={() => removeSkill(skill)}>
  {skill} ×
</Tag>

// Категория
<Tag view="outlined" size="xs">
  {categoryLabel}
</Tag>
```

#### Select
```tsx
<Select
  label="Категория"
  options={[
    { key: 'DEVELOPMENT', content: 'Разработка' },
    { key: 'DESIGN', content: 'Дизайн' },
  ]}
  selected={category}
  onChange={({ selected }) => setCategory(selected?.key)}
  block
/>
```

---

## Интеграция с @hugeicons

### Импорт и использование

```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Search01Icon,
  Add01Icon,
  Message01Icon,
  UserIcon,
  Notification02Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons/stroke-rounded';

// Использование
<HugeiconsIcon
  icon={Home01Icon}
  size={24}
  color="currentColor"
  strokeWidth={2}
  className="custom-class"
/>
```

### Используемые иконки

| Иконка | Назначение |
|--------|------------|
| Home01Icon | Главная (навигация) |
| Search01Icon | Поиск (навигация) |
| Add01Icon | Создать (навигация) |
| Message01Icon | Чаты (навигация) |
| UserIcon | Профиль (навигация) |
| Notification02Icon | Уведомления (хедер) |
| ArrowLeft01Icon | Назад (хедер) |
| CheckmarkCircle02Icon | Выбрано (онбординг) |

---

## Структура файлов компонента

```
ComponentName/
├── ComponentName.tsx        # Основной компонент
├── ComponentName.module.css # Стили (CSS Modules)
├── index.ts                 # Реэкспорт
└── types.ts                 # Типы (если много)
```

### Шаблон компонента

```tsx
// ComponentName/ComponentName.tsx
import { useState } from 'react';
import { Button } from '@alfalab/core-components-button';
import type { ComponentNameProps } from './types';
import styles from './ComponentName.module.css';

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  const [state, setState] = useState('');

  return (
    <div className={styles.container}>
      {/* Контент */}
    </div>
  );
}
```

```tsx
// ComponentName/index.ts
export { ComponentName } from './ComponentName';
```

---

## Настройка TanStack Query

**Путь:** `frontend/src/main.tsx`

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
    },
  },
});
```

---

## Краткая карта файлов

| Назначение | Путь |
|------------|------|
| Shared компоненты | `frontend/src/components/` |
| Auth | `frontend/src/features/auth/` |
| Orders | `frontend/src/features/orders/` |
| Executors | `frontend/src/features/executors/` |
| Profile | `frontend/src/features/profile/` |
| Dashboard | `frontend/src/features/dashboard/` |
| Onboarding | `frontend/src/features/onboarding/` |
| Landing | `frontend/src/features/landing/` |
| Auth Store | `frontend/src/features/auth/store/authStore.ts` |
| API Client | `frontend/src/shared/api/client.ts` |
| Типы | `frontend/src/shared/types/` |
| Точка входа | `frontend/src/App.tsx` |
| React entry | `frontend/src/main.tsx` |
