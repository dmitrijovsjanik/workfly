import { z } from 'zod';

export const createOrderSchema = z.object({
  title: z.string().min(5, 'Название должно содержать минимум 5 символов').max(100),
  description: z.string().min(20, 'Описание должно содержать минимум 20 символов').max(5000),
  budget: z.number().int().positive().optional(),
  deadline: z.string().datetime().optional(),
  skillsRequired: z.array(z.string()).max(10).default([]),
  category: z.enum(['DEVELOPMENT', 'DESIGN', 'MARKETING', 'COPYWRITING', 'OTHER']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = createOrderSchema.partial();

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
