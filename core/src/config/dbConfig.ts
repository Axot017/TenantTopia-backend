import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  name: 'tenanttopia-db',
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: true,
  // type: 'postgres',
  // host: process.env.DB_HOST || 'db',
  // port: parseInt(process.env.DB_PORT) || 5432,
  // username: process.env.DB_USERNAME || 'postgres',
  // password: process.env.DB_PASSWORD || 'Test123',
  // database: process.env.DB_DATABASE || 'core_db',
  // synchronize: true,
  // logging: false,
  // extra: {
  //   connectionLimit: 5,
  // },
};
