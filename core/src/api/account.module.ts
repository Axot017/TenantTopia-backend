import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from '../db/repositories/account.repository';
import { AuthClientModule } from '../microservice/authClient.module';
import { AccountService } from '../services/account.service';
import { AccountController } from './controllers/account.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    AuthClientModule,
    ConfigModule,
  ],
})
export class AccountModule {}
