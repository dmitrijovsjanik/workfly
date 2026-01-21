import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: true,
});

// Plugins
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

// Placeholder routes
fastify.get('/api', async () => {
  return {
    name: 'Workfly API',
    version: '1.0.0',
    status: 'running',
  };
});

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
const start = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const port = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
