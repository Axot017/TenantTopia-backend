import { EntityRepository, Repository } from 'typeorm';
import { Flat } from '../models/flat.model';

@EntityRepository(Flat)
export class FlatRepository extends Repository<Flat> {
  getUsersFlatByUserId(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .leftJoinAndSelect('flat.rooms', 'rooms')
      .leftJoin('rooms.owner', 'roomOwners')
      .where('owner.id = :userId', { userId })
      .orWhere('roomOwners.id = :userId', { userId })
      .getOne();
  }

  getUsersFlatByOwnerId(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .leftJoinAndSelect('flat.rooms', 'rooms')
      .where('owner.id = :userId', { userId })
      .getOne();
  }
}
