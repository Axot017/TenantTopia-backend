/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InjectConnection } from '@nestjs/typeorm';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { Connection, EntitySubscriberInterface, RemoveEvent } from 'typeorm';
import { Flat } from '../models/flat.model';

export class FlatSubscriber implements EntitySubscriberInterface<Flat> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Flat;
  }

  beforeRemove(event: RemoveEvent<Flat>) {
    event.entity?.images?.forEach((image) => {
      const dir = join(process.cwd(), 'images', 'flat', image);
      if (existsSync(dir)) {
        rmSync(dir);
      }
    });
    event.entity?.rooms?.forEach((room) => {
      room.images?.forEach((image) => {
        const dir = join(process.cwd(), 'images', 'room', image);
        if (existsSync(dir)) {
          rmSync(dir);
        }
      });
    });
  }
}
