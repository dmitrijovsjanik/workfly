import { apiClient } from '@/shared/api';
import type { AuthResponse, LoginInput, RegisterInput } from '@/shared/types';

export const authApi = {
  register: (input: RegisterInput): Promise<AuthResponse> =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    }),

  login: (input: LoginInput): Promise<AuthResponse> =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    }),

  logout: (): Promise<{ message: string }> =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),
};
