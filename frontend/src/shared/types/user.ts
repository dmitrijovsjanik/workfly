export type Role = 'CUSTOMER' | 'EXECUTOR' | 'BOTH';

export interface User {
  id: string;
  email: string | null;
  telegramId?: string | null;
  name: string;
  avatarUrl: string | null;
  role: Role;
  createdAt?: string;
  lastActiveAt?: string;
  executorProfile?: ExecutorProfile | null;
  customerProfile?: CustomerProfile | null;
}

export interface ExecutorProfile {
  id: string;
  bio: string | null;
  hourlyRate: number | null;
  skills: string[];
  portfolioUrl: string | null;
  experienceYears: number | null;
  rating: number;
  completedCount: number;
}

export interface CustomerProfile {
  id: string;
  companyName: string | null;
  bio: string | null;
}

// Executor with user info for swipe cards
export interface Executor {
  id: string;
  name: string;
  avatarUrl: string | null;
  executorProfile: ExecutorProfile;
}
