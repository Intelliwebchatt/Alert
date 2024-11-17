import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const contactInput = z.object({
  locationId: z.string(),
  name: z.string().min(1),
  contactType: z.enum(['email', 'sms']),
  contactValue: z.string(),
});

export const contactRouter = router({
  listByLocation: protectedProcedure
    .input(z.object({ locationId: z.string() }))
    .query(async ({ input }) => {
      return db.query.contacts.findMany({
        where: eq(contacts.locationId, input.locationId),
        orderBy: (contacts, { desc }) => [desc(contacts.createdAt)],
      });
    }),

  create: protectedProcedure
    .input(contactInput)
    .mutation(async ({ input }) => {
      const [contact] = await db
        .insert(contacts)
        .values(input)
        .returning();
      return contact;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        contactType: z.enum(['email', 'sms']).optional(),
        contactValue: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [contact] = await db
        .update(contacts)
        .set(data)
        .where(eq(contacts.id, id))
        .returning();
      return contact;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(contacts)
        .where(eq(contacts.id, input.id))
        .returning();
      return { success: true };
    }),
});