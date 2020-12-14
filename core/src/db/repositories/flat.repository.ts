import { EntityRepository, Repository } from 'typeorm';
import { Flat } from '../models/flat.model';
import { Account } from '../models/account.model';

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

  getUsersFlatByUserIdWithCharges(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .leftJoin('flat.rooms', 'rooms')
      .leftJoin('rooms.owner', 'roomOwners')
      .leftJoinAndSelect('flat.charges', 'charges')
      .where('owner.id = :userId', { userId })
      .orWhere('roomOwners.id = :userId', { userId })
      .getOne();
  }

  getUsersFlatByUserIdWithBills(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .leftJoin('flat.rooms', 'rooms')
      .leftJoin('rooms.owner', 'roomOwners')
      .leftJoinAndSelect('flat.bills', 'bills')
      .where('owner.id = :userId', { userId })
      .orWhere('roomOwners.id = :userId', { userId })
      .getOne();
  }

  getOwnersFlat(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .getOne();
  }

  getUsersFlatByOwnerId(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .leftJoinAndSelect('flat.rooms', 'rooms')
      .where('owner.id = :userId', { userId })
      .getOne();
  }

  getUsersFlatByOwnerIdWithoutRooms(userId: number): Promise<Flat> {
    return this.createQueryBuilder('flat')
      .leftJoin('flat.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .getOne();
  }

  getFlatWithChoresAndUsers(): Promise<Flat[]> {
    return this.createQueryBuilder('flat')
      .leftJoinAndSelect('flat.chores', 'chores')
      .leftJoinAndSelect('chores.account', 'accounts')
      .leftJoinAndSelect('flat.rooms', 'rooms')
      .leftJoinAndSelect('rooms.owner', 'owners')
      .getMany();
  }

  async deleteUnconfirmedFlats(): Promise<void> {
    const date = new Date();
    date.setHours(date.getHours() - 4);

    // Select and delete separated to trigger listeners that will remove images
    const toDelete = await this.createQueryBuilder('flat')
      .where('NOT flat.isConfirmed')
      .andWhere('flat.updatedAt < :date', { date: date.toLocaleString() })
      .getMany();

    await this.remove(toDelete);
  }
}
