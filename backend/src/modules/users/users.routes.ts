import type { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../shared/middleware/index.js';

export async function usersRoutes(fastify: FastifyInstance) {
  const usersController = new UsersController();

  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.get('/me', usersController.getMe.bind(usersController));
  fastify.patch('/me', usersController.updateProfile.bind(usersController));
  fastify.post('/me/executor-profile', usersController.createExecutorProfile.bind(usersController));
  fastify.patch('/me/executor-profile', usersController.updateExecutorProfile.bind(usersController));
  fastify.get('/executors', usersController.getExecutors.bind(usersController));
}
