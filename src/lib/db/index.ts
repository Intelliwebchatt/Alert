import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: 'file:location-alert.db',
});

export const db = drizzle(client, { schema });