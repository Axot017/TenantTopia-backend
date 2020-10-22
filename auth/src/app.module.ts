import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './api/auth.module';
import { MicroserviceModule } from './microservice/microservice.module';
import configuration from './config/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './db/models/user.model';

@Module({
  imports: [
    MicroserviceModule,
    AuthModule,
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get<TypeOrmModuleOptions>('db'),
          entities: [User],
        };
      },
    }),
  ],
})
export class AppModule {}
