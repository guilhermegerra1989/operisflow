import { Pool } from 'pg';

export const databaseProvider = {
  provide: 'PG_POOL',
  useFactory: async () => {
    console.log('DATABASE_URL EM EXECUÇÃO =>', process.env.DATABASE_URL);

    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  },
};