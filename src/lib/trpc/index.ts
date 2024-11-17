import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const t = initTRPC.create();

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const token = ctx.headers?.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return next({
      ctx: {
        ...ctx,
        userId: decoded.userId,
      },
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
});

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(authMiddleware);

export const appRouter = t.router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const [user] = await db
        .insert(users)
        .values({
          email: input.email,
          passwordHash,
        })
        .returning();

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(input.password, user.passwordHash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    }),
});

export type AppRouter = typeof appRouter;