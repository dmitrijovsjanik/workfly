import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { authRoutes } from './modules/auth/index.js';
import { usersRoutes } from './modules/users/index.js';
import { ordersRoutes } from './modules/orders/index.js';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: process.env.APP_URL || 'http://localhost:5173',
    credentials: true,
  });

  await fastify.register(cookie);

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_min_32_characters_long',
  });

  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API info
  fastify.get('/api', async () => {
    return {
      name: 'Workfly API',
      version: '1.0.0',
      status: 'running',
    };
  });

  // Register modules
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(usersRoutes, { prefix: '/api/users' });
  await fastify.register(ordersRoutes, { prefix: '/api/orders' });

  return fastify;
}
