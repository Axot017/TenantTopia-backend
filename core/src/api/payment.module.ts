import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRepository } from '../db/repositories/bill.repository';
import { ChargeRepository } from '../db/repositories/charge.repository';
import { FlatRepository } from '../db/repositories/flat.repository';
import { PaymentService } from '../services/payment.service';
import { PaymentController } from './controllers/payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([
      FlatRepository,
      BillRepository,
      ChargeRepository,
    ]),
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
