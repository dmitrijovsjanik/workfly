import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import type { CreateOrderInput } from '@/shared/types';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'count'] });
    },
  });
}
