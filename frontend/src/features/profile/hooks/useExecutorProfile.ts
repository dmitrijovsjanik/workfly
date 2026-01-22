import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, CreateExecutorProfileInput, UpdateExecutorProfileInput } from '../api/profileApi';

export function useCreateExecutorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExecutorProfileInput) => profileApi.createExecutorProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

export function useUpdateExecutorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateExecutorProfileInput) => profileApi.updateExecutorProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
