import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getMe(),
    enabled: isAuthenticated,
  });
}
