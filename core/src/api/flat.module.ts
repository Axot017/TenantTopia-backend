import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from '../db/repositories/account.repository';
import { FlatRepository } from '../db/repositories/flat.repository';
import { RoomRepository } from '../db/repositories/room.repository';
import { FlatService } from '../services/flat.service';
import { RoomService } from '../services/room.service';
import { FlatController } from './controllers/flat.controller';
import { RoomController } from './controllers/room.controller';
import { RoomSearchController } from './controllers/room-search.controller';
import { RoomSubscriber } from '../db/subscribers/room.subscriber';
import { FlatSubscriber } from '../db/subscribers/flat.subscriber';

@Module({
  controllers: [RoomSearchController, RoomController, FlatController],
  providers: [FlatService, RoomService, RoomSubscriber, FlatSubscriber],
  imports: [
    TypeOrmModule.forFeature([
      RoomRepository,
      AccountRepository,
      FlatRepository,
    ]),
  ],
})
export class FlatModule {}
