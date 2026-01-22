import type { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  avatarUrl: string | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      role: Role;
      type: 'access' | 'refresh';
    };
    user: {
      userId: string;
      role: Role;
      type: 'access' | 'refresh';
    };
  }
}
