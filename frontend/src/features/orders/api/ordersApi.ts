import { apiClient } from '@/shared/api';
import type { Order, CreateOrderInput } from '@/shared/types';

export const ordersApi = {
  create: (input: CreateOrderInput): Promise<Order> =>
    apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getMyOrders: (): Promise<Order[]> =>
    apiClient('/orders/my'),

  getMyOrdersCount: (): Promise<{ count: number }> =>
    apiClient('/orders/my/count'),

  getById: (id: string): Promise<Order> =>
    apiClient(`/orders/${id}`),

  getActive: (): Promise<Order[]> =>
    apiClient('/orders', { skipAuth: true }),
};
