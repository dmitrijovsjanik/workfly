import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Некорректный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  role: z.enum(['CUSTOMER', 'EXECUTOR', 'BOTH']).default('EXECUTOR'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Некорректный формат email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginInput = z.infer<typeof loginSchema>;
