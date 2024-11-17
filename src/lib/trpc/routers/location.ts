import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { db } from '@/lib/db';
import { locations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const locationInput = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1).max(10000),
});

export const locationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.query.locations.findMany({
      where: eq(locations.userId, ctx.userId),
      orderBy: (locations, { desc }) => [desc(locations.createdAt)],
    });
  }),

  create: protectedProcedure
    .input(locationInput)
    .mutation(async ({ ctx, input }) => {
      const [location] = await db
        .insert(locations)
        .values({
          ...input,
          userId: ctx.userId,
        })
        .returning();
      return location;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        radius: z.number().min(1).max(10000).optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [location] = await db
        .update(locations)
        .set(data)
        .where(eq(locations.id, id))
        .returning();
      return location;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(locations)
        .where(eq(locations.id, input.id))
        .returning();
      return { success: true };
    }),
});