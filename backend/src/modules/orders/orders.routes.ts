import type { FastifyInstance } from 'fastify';
import { OrdersController } from './orders.controller.js';
import { authenticate } from '../../shared/middleware/index.js';

const controller = new OrdersController();

export async function ordersRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/', controller.getActive.bind(controller));

  // Protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);

    protectedRoutes.post('/', controller.create.bind(controller));
    protectedRoutes.get('/my', controller.getMy.bind(controller));
    protectedRoutes.get('/my/count', controller.getCount.bind(controller));
    protectedRoutes.get('/:id', controller.getById.bind(controller));
    protectedRoutes.patch('/:id', controller.update.bind(controller));
    protectedRoutes.delete('/:id', controller.delete.bind(controller));
  });
}
