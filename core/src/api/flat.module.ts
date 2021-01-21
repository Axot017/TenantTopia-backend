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
import { NoteController } from './controllers/note.controller';
import { NoteRepository } from '../db/repositories/note.repository';
import { NoteService } from '../services/note.service';
import { PaymentModule } from './payment.module';
import { ChoreService } from '../services/chore.service';
import { ChoreRepository } from '../db/repositories/chore.repository';

@Module({
  controllers: [
    RoomSearchController,
    RoomController,
    FlatController,
    NoteController,
  ],
  providers: [
    FlatService,
    RoomService,
    NoteService,
    ChoreService,
    RoomSubscriber,
    FlatSubscriber,
  ],
  imports: [
    TypeOrmModule.forFeature([
      RoomRepository,
      AccountRepository,
      FlatRepository,
      NoteRepository,
      ChoreRepository,
    ]),
    PaymentModule,
  ],
})
export class FlatModule {}
