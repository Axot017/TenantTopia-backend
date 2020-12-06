import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from './db/models/account.model';
import configuration from './config/config';
import { AccountModule } from './api/account.module';
import { MicroserviceModule } from './microservice/microservice.module';
import { AuthGuard } from './api/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthClientModule } from './microservice/authClient.module';
import { MulterModule } from '@nestjs/platform-express';
import { Flat } from './db/models/flat.model';
import { Room } from './db/models/room.model';
import { FlatModule } from './api/flat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Note } from './db/models/note.model';
import { Bill } from './db/models/bill.model';
import { Charge } from './db/models/charge.model';
import { PaymentModule } from './api/payment.module';
import { ChoreModule } from './api/chore.module';
import { Chore } from './db/models/chore.model';

@Module({
  imports: [
    AccountModule,
    MicroserviceModule,
    AuthClientModule,
    PaymentModule,
    FlatModule,
    ChoreModule,
    MulterModule.register(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get<TypeOrmModuleOptions>('db'),
          entities: [Account, Flat, Room, Note, Bill, Charge, Chore],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
