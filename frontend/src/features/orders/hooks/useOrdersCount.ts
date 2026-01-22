import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useOrdersCount() {
  return useQuery({
    queryKey: ['orders', 'count'],
    queryFn: () => ordersApi.getMyOrdersCount(),
  });
}
