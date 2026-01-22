import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Хешируем пароль для всех тестовых пользователей
  const passwordHash = await bcrypt.hash('password123', 10);

  // Создаём 3 дизайнеров с профилями исполнителей
  const designers = [
    {
      email: 'anna.designer@example.com',
      name: 'Анна Петрова',
      executorProfile: {
        bio: 'UI/UX дизайнер с 5-летним опытом. Специализируюсь на мобильных приложениях и веб-интерфейсах. Работала с Figma, Sketch, Adobe XD.',
        hourlyRate: 3000,
        skills: ['UI/UX', 'Figma', 'Mobile Design', 'Web Design', 'Prototyping'],
        portfolioUrl: 'https://behance.net/anna-petrova',
        experienceYears: 5,
        rating: 4.8,
        completedCount: 47,
      },
    },
    {
      email: 'maxim.creative@example.com',
      name: 'Максим Волков',
      executorProfile: {
        bio: 'Графический дизайнер и иллюстратор. Создаю логотипы, фирменный стиль, иллюстрации для любых проектов. Люблю минимализм и чистый дизайн.',
        hourlyRate: 2000,
        skills: ['Graphic Design', 'Logo Design', 'Branding', 'Illustration', 'Adobe Illustrator'],
        portfolioUrl: 'https://dribbble.com/maxim-volkov',
        experienceYears: 3,
        rating: 4.6,
        completedCount: 23,
      },
    },
    {
      email: 'elena.ux@example.com',
      name: 'Елена Смирнова',
      executorProfile: {
        bio: 'Product дизайнер с фокусом на UX исследования. Провожу интервью с пользователями, создаю user flows и прототипы. Сертифицированный специалист Google UX.',
        hourlyRate: 4000,
        skills: ['UX Research', 'User Testing', 'Figma', 'Product Design', 'Design Systems'],
        portfolioUrl: 'https://elena-smirnova.design',
        experienceYears: 7,
        rating: 4.9,
        completedCount: 82,
      },
    },
  ];

  for (const designer of designers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: designer.email },
    });

    if (existingUser) {
      // Update existing executor profile with new data
      await prisma.executorProfile.upsert({
        where: { userId: existingUser.id },
        update: designer.executorProfile,
        create: {
          userId: existingUser.id,
          ...designer.executorProfile,
        },
      });
      console.log(`Updated designer: ${designer.name} (${designer.email})`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: designer.email,
        name: designer.name,
        passwordHash,
        role: 'EXECUTOR',
        executorProfile: {
          create: designer.executorProfile,
        },
      },
      include: {
        executorProfile: true,
      },
    });

    console.log(`Created designer: ${user.name} (${user.email})`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
