import { sql } from 'drizzle-orm';
import { 
  sqliteTable, 
  text, 
  integer, 
  real,
  primaryKey 
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  radius: integer('radius').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  locationId: text('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  contactType: text('contact_type', { enum: ['email', 'sms'] }).notNull(),
  contactValue: text('contact_value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  locationId: text('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['enter', 'leave'] }).notNull(),
  messageText: text('message_text').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const notificationHistory = sqliteTable('notification_history', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  locationId: text('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  contactId: text('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['enter', 'leave'] }).notNull(),
  status: text('status', { enum: ['sent', 'failed'] }).notNull(),
  sentAt: integer('sent_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  errorMessage: text('error_message'),
});

// Indexes
export const locationUserIdIndex = sql`CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations (user_id)`;
export const contactLocationIdIndex = sql`CREATE INDEX IF NOT EXISTS idx_contacts_location_id ON contacts (location_id)`;
export const messageLocationIdIndex = sql`CREATE INDEX IF NOT EXISTS idx_messages_location_id ON messages (location_id)`;
export const notificationHistoryLocationIdIndex = sql`CREATE INDEX IF NOT EXISTS idx_notification_history_location_id ON notification_history (location_id)`;
export const notificationHistoryContactIdIndex = sql`CREATE INDEX IF NOT EXISTS idx_notification_history_contact_id ON notification_history (contact_id)`;