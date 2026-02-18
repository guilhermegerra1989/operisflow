import { Pool } from 'pg';

export const databaseProvider = {
  provide: 'PG_POOL',
  useFactory: () => {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  },
};