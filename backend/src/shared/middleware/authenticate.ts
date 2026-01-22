import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../database/index.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const payload = await request.jwtVerify<{ userId: string; role: string; type: string }>();

    if (payload.type !== 'access') {
      return reply.status(401).send({ message: 'Invalid token type' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return reply.status(401).send({ message: 'User not found' });
    }

    request.authUser = user;
  } catch {
    return reply.status(401).send({ message: 'Invalid or expired token' });
  }
}
