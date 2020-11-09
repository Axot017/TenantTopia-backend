import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: Record<string, TypeOrmModuleOptions> = {
  sqlite: {
    name: 'splithere-db',
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: true,
  },
  pg: {
    type: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Test123',
    database: process.env.DB_DATABASE || 'core_db',
    synchronize: true,
    logging: false,
    keepConnectionAlive: true,
    extra: {
      connectionLimit: 5,
    },
  },
};
