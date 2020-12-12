import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoreRepository } from '../db/repositories/chore.repository';
import { FlatRepository } from '../db/repositories/flat.repository';
import { ChoreService } from '../services/chore.service';
import { ChoreController } from './controllers/chore.controller';
import { AccountRepository } from '../db/repositories/account.repository';

@Module({
  controllers: [ChoreController],
  providers: [ChoreService],
  imports: [
    TypeOrmModule.forFeature([
      FlatRepository,
      AccountRepository,
      ChoreRepository,
    ]),
  ],
  exports: [ChoreService],
})
export class ChoreModule {}
