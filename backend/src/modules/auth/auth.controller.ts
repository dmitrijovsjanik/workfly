import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import { AppError } from '../../shared/utils/index.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = registerSchema.parse(request.body);
      const result = await this.authService.register(input);

      reply.setCookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

      return reply.status(201).send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = loginSchema.parse(request.body);
      const result = await this.authService.login(input);

      reply.setCookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

      return reply.send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.status(401).send({ message: 'Refresh token не предоставлен' });
      }

      const result = await this.authService.refresh(refreshToken);

      reply.setCookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

      return reply.send({ accessToken: result.accessToken });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    return reply.send({ message: 'Выход выполнен успешно' });
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

    console.error('Auth error:', error);
    return reply.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
}
