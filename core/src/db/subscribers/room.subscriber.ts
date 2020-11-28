/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InjectConnection } from '@nestjs/typeorm';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Room } from '../models/room.model';

export class RoomSubscriber implements EntitySubscriberInterface<Room> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Room;
  }

  beforeRemove(event: RemoveEvent<Room>) {
    event.entity?.images?.forEach((image) => {
      const dir = join(process.cwd(), 'images', 'room', image);
      if (existsSync(dir)) {
        rmSync(dir);
      }
    });
  }
}
