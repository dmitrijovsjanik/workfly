import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export function useActiveOrders() {
  return useQuery({
    queryKey: ['orders', 'active'],
    queryFn: () => ordersApi.getActive(),
  });
}
