import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../models/room.model';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  getAvailableRoomsInRadius(
    lat: number,
    long: number,
    radius: number
  ): Promise<Array<Room>> {
    // TODO: add logic responsible for filtering by lat long distance
    return this.createQueryBuilder('room').where('"isAvailable"').getMany();
  }
}
