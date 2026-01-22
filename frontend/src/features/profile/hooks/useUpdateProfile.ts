import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, UpdateProfileInput } from '../api/profileApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileApi.updateProfile(input),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      setUser(user);
    },
  });
}
