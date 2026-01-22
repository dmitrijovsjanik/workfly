import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    accessToken = data.accessToken;
    return data.accessToken;
  } catch {
    accessToken = null;
    onUnauthorized?.();
    return null;
  }
}

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiClient<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { skipAuth = false, ...fetchConfig } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchConfig.headers as Record<string, string>),
  };

  if (!skipAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchConfig,
    headers,
    credentials: 'include',
  });

  // Handle token expiration
  if (response.status === 401 && !skipAuth && accessToken) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchConfig,
        headers,
        credentials: 'include',
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Ошибка запроса' }));
    throw new ApiClientError(errorData.message || 'Ошибка запроса', response.status, errorData);
  }

  return response.json();
}
