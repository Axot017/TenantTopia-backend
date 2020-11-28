import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface } from 'typeorm';
import { Bill } from '../models/bill.model';

export class FlatSubscriber implements EntitySubscriberInterface<Bill> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }
}
