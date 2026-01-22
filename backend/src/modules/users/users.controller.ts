import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { UsersService } from './users.service.js';
import { updateProfileSchema, createExecutorProfileSchema, updateExecutorProfileSchema } from './users.schemas.js';
import { AppError } from '../../shared/utils/index.js';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.authUser) {
        return reply.status(401).send({ message: 'Не авторизован' });
      }

      const user = await this.usersService.getMe(request.authUser.id);
      return reply.send(user);
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.authUser) {
        return reply.status(401).send({ message: 'Не авторизован' });
      }

      const input = updateProfileSchema.parse(request.body);
      const user = await this.usersService.updateProfile(request.authUser.id, input);
      return reply.send(user);
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async createExecutorProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.authUser) {
        return reply.status(401).send({ message: 'Не авторизован' });
      }

      const input = createExecutorProfileSchema.parse(request.body);
      const profile = await this.usersService.createExecutorProfile(request.authUser.id, input);
      return reply.status(201).send(profile);
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async updateExecutorProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.authUser) {
        return reply.status(401).send({ message: 'Не авторизован' });
      }

      const input = updateExecutorProfileSchema.parse(request.body);
      const profile = await this.usersService.updateExecutorProfile(request.authUser.id, input);
      return reply.send(profile);
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async getExecutors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const executors = await this.usersService.getExecutors(request.authUser?.id);
      return reply.send(executors);
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Ошибка валидации',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    console.error('Users error:', error);
    return reply.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
}
