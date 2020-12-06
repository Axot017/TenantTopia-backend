import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../models/room.model';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  getAvailableRoomsInRadius(
    lat: number,
    long: number,
    radius: number,
    minPrice: number,
    maxPrice: number
  ): Promise<Array<Room>> {
    return this.createQueryBuilder('room')
      .innerJoinAndSelect('room.flat', 'flat')
      .where(
        `( 6371 * acos( cos( radians(:lat) ) * cos( radians( flat.address.lat ) ) * cos ( radians(flat.address.lon) - 
        radians(:long)) + sin(radians(:lat)) * sin( radians(flat.address.lat)))) < :radius`,
        { lat, long, radius }
      )
      .andWhere('room.isAvailable')
      .andWhere(minPrice ? `room.cost >= :minPrice` : '1=1', { minPrice })
      .andWhere(maxPrice ? `room.cost <= :maxPrice` : '1=1', { maxPrice })
      .getMany();
  }

  getRoomWithOwner(id: number): Promise<Room> {
    return this.findOne(id, { relations: ['owner'] });
  }

  getRoomWithOwnerAndFlat(id: number): Promise<Room> {
    return this.findOne(id, { relations: ['owner', 'flat'] });
  }
}
