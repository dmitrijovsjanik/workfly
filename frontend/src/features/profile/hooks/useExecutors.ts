import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';

export function useExecutors() {
  return useQuery({
    queryKey: ['executors'],
    queryFn: profileApi.getExecutors,
  });
}
