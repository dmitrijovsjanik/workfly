import type { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/database/index.js';
import { hashPassword, verifyPassword, UnauthorizedError, ConflictError } from '../../shared/utils/index.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже зарегистрирован');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        role: input.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const accessToken = this.fastify.jwt.sign(
      { userId: user.id, role: user.role, type: 'access' },
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = this.fastify.jwt.sign(
      { userId: user.id, role: user.role, type: 'refresh' },
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { user, accessToken, refreshToken };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Неверный email или пароль');
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Неверный email или пароль');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const accessToken = this.fastify.jwt.sign(
      { userId: user.id, role: user.role, type: 'access' },
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = this.fastify.jwt.sign(
      { userId: user.id, role: user.role, type: 'refresh' },
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.fastify.jwt.verify<{ userId: string; role: string; type: string }>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedError('Неверный тип токена');
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }

      const newAccessToken = this.fastify.jwt.sign(
        { userId: user.id, role: user.role, type: 'access' },
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      const newRefreshToken = this.fastify.jwt.sign(
        { userId: user.id, role: user.role, type: 'refresh' },
        { expiresIn: REFRESH_TOKEN_EXPIRES }
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedError('Недействительный refresh token');
    }
  }
}
