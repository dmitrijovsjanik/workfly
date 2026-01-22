import type { FastifyRequest, FastifyReply } from 'fastify';
import { OrdersService } from './orders.service.js';
import { createOrderSchema, updateOrderSchema } from './orders.schemas.js';

const ordersService = new OrdersService();

export class OrdersController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createOrderSchema.parse(request.body);
    const order = await ordersService.create(request.authUser!.id, input);
    return reply.status(201).send(order);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const order = await ordersService.findById(request.params.id);
    return reply.send(order);
  }

  async getMy(request: FastifyRequest, reply: FastifyReply) {
    const orders = await ordersService.findByCustomer(request.authUser!.id);
    return reply.send(orders);
  }

  async getActive(request: FastifyRequest, reply: FastifyReply) {
    const orders = await ordersService.findActive(request.authUser?.id);
    return reply.send(orders);
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateOrderSchema.parse(request.body);
    const order = await ordersService.update(request.params.id, request.authUser!.id, input);
    return reply.send(order);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await ordersService.delete(request.params.id, request.authUser!.id);
    return reply.status(204).send();
  }

  async getCount(request: FastifyRequest, reply: FastifyReply) {
    const count = await ordersService.countByCustomer(request.authUser!.id);
    return reply.send({ count });
  }
}
