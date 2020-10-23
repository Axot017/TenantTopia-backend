import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from '../db/repositories/account.repository';
import { MicroserviceController } from './controllers/microservice.controller';
import { MicroserviceService } from './services/micoservice.service';

@Module({
  controllers: [MicroserviceController],
  providers: [MicroserviceService],
  imports: [TypeOrmModule.forFeature([AccountRepository])],
})
export class MicroserviceModule {}
