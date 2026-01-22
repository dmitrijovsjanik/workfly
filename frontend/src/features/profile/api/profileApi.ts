import { apiClient } from '@/shared/api';
import type { User, ExecutorProfile, Executor } from '@/shared/types';

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string | null;
  role?: 'CUSTOMER' | 'EXECUTOR' | 'BOTH';
}

export interface CreateExecutorProfileInput {
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  portfolioUrl?: string;
  experienceYears?: number;
}

export type UpdateExecutorProfileInput = Partial<CreateExecutorProfileInput>;

export const profileApi = {
  getMe: (): Promise<User> => apiClient('/users/me'),

  updateProfile: (input: UpdateProfileInput): Promise<User> =>
    apiClient('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  createExecutorProfile: (input: CreateExecutorProfileInput): Promise<ExecutorProfile> =>
    apiClient('/users/me/executor-profile', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  updateExecutorProfile: (input: UpdateExecutorProfileInput): Promise<ExecutorProfile> =>
    apiClient('/users/me/executor-profile', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  getExecutors: (): Promise<Executor[]> => apiClient('/users/executors'),
};
