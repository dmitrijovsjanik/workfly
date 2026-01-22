import { prisma } from '../../shared/database/index.js';
import { NotFoundError, ForbiddenError } from '../../shared/utils/index.js';
import type { CreateOrderInput, UpdateOrderInput } from './orders.schemas.js';

export class OrdersService {
  async create(customerId: string, input: CreateOrderInput) {
    const order = await prisma.order.create({
      data: {
        customerId,
        title: input.title,
        description: input.description,
        budget: input.budget,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
        skillsRequired: input.skillsRequired,
        category: input.category,
      },
    });

    return order;
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Заказ не найден');
    }

    return order;
  }

  async findByCustomer(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive(excludeCustomerId?: string) {
    return prisma.order.findMany({
      where: {
        status: 'ACTIVE',
        ...(excludeCustomerId && { customerId: { not: excludeCustomerId } }),
      },
      include: {
        customer: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, customerId: string, input: UpdateOrderInput) {
    const order = await this.findById(id);

    if (order.customerId !== customerId) {
      throw new ForbiddenError('Нет доступа к этому заказу');
    }

    return prisma.order.update({
      where: { id },
      data: {
        ...input,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      },
    });
  }

  async delete(id: string, customerId: string) {
    const order = await this.findById(id);

    if (order.customerId !== customerId) {
      throw new ForbiddenError('Нет доступа к этому заказу');
    }

    await prisma.order.delete({ where: { id } });
  }

  async countByCustomer(customerId: string) {
    return prisma.order.count({ where: { customerId } });
  }
}
