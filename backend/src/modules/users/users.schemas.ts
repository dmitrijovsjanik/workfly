import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  avatarUrl: z.string().url('Некорректный URL').nullable().optional(),
  role: z.enum(['CUSTOMER', 'EXECUTOR', 'BOTH']).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createExecutorProfileSchema = z.object({
  bio: z.string().max(1000, 'Максимум 1000 символов').optional(),
  hourlyRate: z.number().int().positive('Ставка должна быть положительной').optional(),
  skills: z.array(z.string()).max(20, 'Максимум 20 навыков').default([]),
  portfolioUrl: z.string().url('Некорректный URL').optional(),
  experienceYears: z.number().int().min(0).max(50).optional(),
});

export type CreateExecutorProfileInput = z.infer<typeof createExecutorProfileSchema>;

export const updateExecutorProfileSchema = createExecutorProfileSchema.partial();

export type UpdateExecutorProfileInput = z.infer<typeof updateExecutorProfileSchema>;
