import { Pool } from 'pg';

export const databaseProvider = {
  provide: 'PG_POOL',
  useFactory: () => {
    new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // obrigatório no Render
      },
    });
  },
};