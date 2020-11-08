import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../models/room.model';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  getAvailableRoomsInRadius(
    lat: number,
    long: number,
    radius: number
  ): Promise<Array<Room>> {
    return this.createQueryBuilder('room')
      .innerJoinAndSelect('room.flat', 'flat')
      .addSelect(
        `SQRT(POW(69.1 * (flat.address.lat - ${lat}), 2) + POW(69.1 * (${long} - flat.address.lon) * COS(flat.address.lat / 57.3), 2))`,
        'distance'
      )
      .where(`flat.id < ${radius}`)
      .andWhere('room.isAvailable')
      .getMany();
  }
}
