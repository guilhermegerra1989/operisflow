import { Pool } from 'pg';

export const databaseProvider = {
  provide: 'PG_POOL',
  useFactory: () => {
    console.log(">> DATABASE_URL:", process.env.DATABASE_URL);

    new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

  },
};