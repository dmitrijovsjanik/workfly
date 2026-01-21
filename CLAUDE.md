# Workfly — Фриланс-биржа в стиле Tinder

## Описание проекта

Веб-приложение для поиска заказов и исполнителей с механикой свайпов. Заказчики публикуют задачи, исполнители свайпают понравившиеся заказы, при взаимном интересе создаётся матч и открывается чат с возможностью безопасной сделки.

## Глобальные принципы разработки

### Код

- TypeScript везде (strict mode)
- Функциональные компоненты + хуки
- Именование: camelCase для переменных, PascalCase для компонентов
- Файлы компонентов: PascalCase (SwipeCard.tsx)
- Один компонент — один файл
- Комментарии только для сложной бизнес-логики
- Без any — всегда типизировать

### Структура компонентов

```
ComponentName/
├── ComponentName.tsx      # Основной компонент
├── ComponentName.module.css  # Стили (CSS Modules)
├── index.ts               # Реэкспорт
└── types.ts               # Типы (если много)
```

### Git

- Conventional Commits: feat:, fix:, refactor:, docs:, chore:
- Ветки: feature/*, fix/*, refactor/*
- PR в main через GitHub

---

## Технологический стек

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| React | ^18.2.0 | UI фреймворк |
| TypeScript | ^5.x | Типизация |
| Vite | ^5.x | Сборка |
| @alfalab/core-components | latest | UI-библиотека |
| @hugeicons/react + @hugeicons/core-free-icons | latest | Иконки |
| Framer Motion | ^11.x | Анимации свайпов |
| @use-gesture/react | latest | Жесты |
| TanStack Query | ^5.x | API-запросы и кеширование |
| Zustand | ^4.x | Глобальное состояние |
| React Router | ^6.x | Роутинг |
| Socket.io-client | ^4.x | WebSocket для чата |

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | ^20.x | Рантайм |
| Fastify | ^4.x | HTTP-сервер |
| Prisma | ^5.x | ORM |
| Socket.io | ^4.x | WebSocket |
| Passport.js | latest | Авторизация |
| Bull | ^5.x | Очереди задач |
| Zod | ^3.x | Валидация |

### Инфраструктура

| Технология | Назначение |
|------------|------------|
| PostgreSQL 16 | База данных |
| Redis 7 | Сессии, WebSocket, очереди |
| Nginx | Reverse proxy |
| Docker + Docker Compose | Контейнеризация |
| GitHub Actions | CI/CD |
| Let's Encrypt | SSL |

---

## Использование UI-библиотеки

### @alfalab/core-components

Импорт компонентов:

```tsx
// Предпочтительный способ — отдельные пакеты (tree-shaking)
import { Button } from '@alfalab/core-components-button';
import { Input } from '@alfalab/core-components-input';
import { Typography } from '@alfalab/core-components-typography';

// Или из общего пакета
import { Button, Input } from '@alfalab/core-components';
```

Основные компоненты для проекта:

- `Button` — кнопки действий
- `Input`, `Textarea` — формы
- `Typography` — текст
- `Card` — карточки заказов
- `Modal`, `BottomSheet` — модальные окна
- `Tag`, `Badge` — статусы, навыки
- `Tabs` — переключение режимов
- `Toast`, `Notification` — уведомления
- `Skeleton` — загрузка
- `Avatar` — аватары пользователей

---

## Использование иконок

### @hugeicons/react + @hugeicons/core-free-icons

```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon, Search01Icon, MessageIcon } from '@hugeicons/core-free-icons/stroke-rounded';

// Использование
<HugeiconsIcon icon={Home01Icon} size={24} color="currentColor" />

// С кастомными стилями
<HugeiconsIcon
  icon={Search01Icon}
  size={20}
  strokeWidth={2}
  className="icon-search"
/>
```

Доступно 4600+ бесплатных иконок в стиле stroke-rounded.

---

## Структура проекта

```
workfly/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── CLAUDE.md
├── PLAN.md
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── app/
│       │   └── router.tsx
│       ├── components/          # Переиспользуемые компоненты
│       │   ├── SwipeCard/
│       │   ├── ChatMessage/
│       │   └── ...
│       ├── features/            # Фичи (страницы + логика)
│       │   ├── auth/
│       │   ├── orders/
│       │   ├── swipe/
│       │   ├── chat/
│       │   └── profile/
│       ├── shared/              # Утилиты, хуки, типы
│       │   ├── api/
│       │   ├── hooks/
│       │   ├── types/
│       │   └── utils/
│       └── assets/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── app.ts
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── orders/
│       │   ├── swipes/
│       │   ├── chat/
│       │   └── contracts/
│       ├── shared/
│       │   ├── database/
│       │   ├── middleware/
│       │   └── utils/
│       └── prisma/
│           └── schema.prisma
│
├── nginx/
│   └── nginx.conf
│
└── uploads/
```

---

## База данных (Prisma Schema)

```prisma
// Основные модели

model User {
  id            String   @id @default(uuid())
  email         String?  @unique
  passwordHash  String?
  telegramId    String?  @unique
  name          String
  avatarUrl     String?
  role          Role     @default(EXECUTOR)
  createdAt     DateTime @default(now())
  lastActiveAt  DateTime @default(now())

  executorProfile  ExecutorProfile?
  customerProfile  CustomerProfile?
  ordersCreated    Order[]
  swipes           Swipe[]
  responses        Response[]
  contractsAsCustomer Contract[] @relation("CustomerContracts")
  contractsAsExecutor Contract[] @relation("ExecutorContracts")
  messages         Message[]
}

model ExecutorProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  bio             String?
  hourlyRateMin   Int?
  hourlyRateMax   Int?
  skills          String[]
  portfolioUrl    String?
  experienceYears Int?
  rating          Float    @default(0)
  completedCount  Int      @default(0)
}

model CustomerProfile {
  id          String  @id @default(uuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id])
  companyName String?
  bio         String?
}

model Order {
  id              String      @id @default(uuid())
  customerId      String
  customer        User        @relation(fields: [customerId], references: [id])
  title           String
  description     String
  budgetMin       Int?
  budgetMax       Int?
  deadline        DateTime?
  skillsRequired  String[]
  category        Category
  status          OrderStatus @default(ACTIVE)
  createdAt       DateTime    @default(now())

  swipes     Swipe[]
  responses  Response[]
  contracts  Contract[]
}

model Swipe {
  id         String   @id @default(uuid())
  executorId String
  executor   User     @relation(fields: [executorId], references: [id])
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  action     SwipeAction
  createdAt  DateTime @default(now())

  @@unique([executorId, orderId])
}

model Response {
  id              String         @id @default(uuid())
  orderId         String
  order           Order          @relation(fields: [orderId], references: [id])
  executorId      String
  executor        User           @relation(fields: [executorId], references: [id])
  coverLetter     String?
  proposedBudget  Int?
  proposedDeadline DateTime?
  status          ResponseStatus @default(PENDING)
  createdAt       DateTime       @default(now())

  @@unique([orderId, executorId])
}

model Contract {
  id           String         @id @default(uuid())
  orderId      String
  order        Order          @relation(fields: [orderId], references: [id])
  customerId   String
  customer     User           @relation("CustomerContracts", fields: [customerId], references: [id])
  executorId   String
  executor     User           @relation("ExecutorContracts", fields: [executorId], references: [id])
  amount       Int
  platformFee  Int
  status       ContractStatus @default(PENDING)
  fundedAt     DateTime?
  completedAt  DateTime?
  createdAt    DateTime       @default(now())

  chat         Chat?
}

model Chat {
  id          String    @id @default(uuid())
  contractId  String    @unique
  contract    Contract  @relation(fields: [contractId], references: [id])
  createdAt   DateTime  @default(now())

  messages    Message[]
}

model Message {
  id        String      @id @default(uuid())
  chatId    String
  chat      Chat        @relation(fields: [chatId], references: [id])
  senderId  String
  sender    User        @relation(fields: [senderId], references: [id])
  content   String?
  type      MessageType @default(TEXT)
  fileUrl   String?
  fileName  String?
  createdAt DateTime    @default(now())
  readAt    DateTime?
}

// Enums

enum Role {
  CUSTOMER
  EXECUTOR
  BOTH
}

enum Category {
  DEVELOPMENT
  DESIGN
  MARKETING
  COPYWRITING
  OTHER
}

enum OrderStatus {
  DRAFT
  ACTIVE
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum SwipeAction {
  LIKE
  SKIP
}

enum ResponseStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum ContractStatus {
  PENDING
  FUNDED
  IN_PROGRESS
  COMPLETED
  DISPUTED
  CANCELLED
}

enum MessageType {
  TEXT
  FILE
  IMAGE
  SYSTEM
}
```

---

## API Endpoints (основные)

### Auth
- `POST /api/auth/register` — регистрация email/пароль
- `POST /api/auth/login` — вход
- `POST /api/auth/telegram` — авторизация через Telegram
- `POST /api/auth/refresh` — обновление токена
- `POST /api/auth/logout` — выход

### Users
- `GET /api/users/me` — текущий пользователь
- `PATCH /api/users/me` — обновить профиль
- `POST /api/users/me/executor-profile` — создать профиль исполнителя
- `PATCH /api/users/me/executor-profile` — обновить профиль исполнителя

### Orders
- `GET /api/orders` — список заказов (для свайпов)
- `POST /api/orders` — создать заказ
- `GET /api/orders/:id` — детали заказа
- `PATCH /api/orders/:id` — обновить заказ
- `GET /api/orders/my` — мои заказы (для заказчика)

### Swipes
- `POST /api/swipes` — свайп (like/skip)
- `GET /api/swipes/responses` — мои отклики

### Responses
- `GET /api/orders/:id/responses` — отклики на заказ
- `POST /api/responses/:id/accept` — принять отклик
- `POST /api/responses/:id/reject` — отклонить

### Contracts
- `POST /api/contracts` — создать контракт
- `GET /api/contracts` — мои контракты
- `POST /api/contracts/:id/fund` — оплатить (заморозить)
- `POST /api/contracts/:id/complete` — завершить
- `POST /api/contracts/:id/dispute` — открыть спор

### Chat
- `GET /api/chats` — список чатов
- `GET /api/chats/:id/messages` — сообщения
- `POST /api/chats/:id/messages` — отправить сообщение
- `POST /api/chats/:id/upload` — загрузить файл

### WebSocket Events
- `message:new` — новое сообщение
- `message:read` — сообщение прочитано
- `typing:start` / `typing:stop` — индикатор печати
- `notification` — системные уведомления

---

## Переменные окружения

```env
# Database
DATABASE_URL=postgresql://workfly:password@db:5432/workfly

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_BOT_USERNAME=workfly_bot

# App
APP_URL=https://workfly.online
API_URL=https://workfly.online/api

# Uploads
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# Payments (позже)
# PAYMENT_PROVIDER_KEY=
```

---

## Деплой

### VPS
- IP: 89.104.71.141
- Домен: workfly.online
- OS: Ubuntu
- RAM: 4 ГБ (рекомендуется)
- CPU: 2 ядра

### Команды

```bash
# Первый деплой
git clone https://github.com/dmitrijovsjanik/workfly.git /var/www/workfly
cd /var/www/workfly
cp .env.example .env
# отредактировать .env
docker compose up -d

# Обновление
cd /var/www/workfly
git pull origin main
docker compose up -d --build
```
