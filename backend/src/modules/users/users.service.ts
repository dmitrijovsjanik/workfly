import { prisma } from '../../shared/database/index.js';
import { NotFoundError, ConflictError } from '../../shared/utils/index.js';
import type { UpdateProfileInput, CreateExecutorProfileInput, UpdateExecutorProfileInput } from './users.schemas.js';

export class UsersService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        telegramId: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        lastActiveAt: true,
        executorProfile: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            skills: true,
            portfolioUrl: true,
            experienceYears: true,
            rating: true,
            completedCount: true,
          },
        },
        customerProfile: {
          select: {
            id: true,
            companyName: true,
            bio: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
      },
    });

    return user;
  }

  async createExecutorProfile(userId: string, input: CreateExecutorProfileInput) {
    const existingProfile = await prisma.executorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictError('Профиль исполнителя уже существует');
    }

    const profile = await prisma.executorProfile.create({
      data: {
        userId,
        ...input,
      },
      select: {
        id: true,
        bio: true,
        hourlyRate: true,
        skills: true,
        portfolioUrl: true,
        experienceYears: true,
        rating: true,
        completedCount: true,
      },
    });

    // Update user role to EXECUTOR or BOTH if they were CUSTOMER
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === 'CUSTOMER') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'BOTH' },
      });
    }

    return profile;
  }

  async updateExecutorProfile(userId: string, input: UpdateExecutorProfileInput) {
    const existingProfile = await prisma.executorProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundError('Профиль исполнителя не найден');
    }

    const profile = await prisma.executorProfile.update({
      where: { userId },
      data: input,
      select: {
        id: true,
        bio: true,
        hourlyRate: true,
        skills: true,
        portfolioUrl: true,
        experienceYears: true,
        rating: true,
        completedCount: true,
      },
    });

    return profile;
  }

  async getExecutors(excludeUserId?: string) {
    const executors = await prisma.user.findMany({
      where: {
        executorProfile: { isNot: null },
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        executorProfile: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            skills: true,
            portfolioUrl: true,
            experienceYears: true,
            rating: true,
            completedCount: true,
          },
        },
      },
      orderBy: [
        { executorProfile: { rating: 'desc' } },
        { executorProfile: { completedCount: 'desc' } },
      ],
    });

    return executors;
  }
}
