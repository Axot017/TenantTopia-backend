import { EntityRepository, Repository } from 'typeorm';
import { Charge } from '../models/charge.model';

@EntityRepository(Charge)
export class ChargeRepository extends Repository<Charge> {
  getChargesByUserId(id: number): Promise<Charge[]> {
    return this.createQueryBuilder('charge')
      .innerJoinAndSelect('charge.flatOwner', 'flatOwner')
      .innerJoinAndSelect('charge.roomOwner', 'roomOwner')
      .where('flatOwner.id = :id', { id })
      .orWhere('roomOwner.id = :id', { id })
      .getMany();
  }

  async deleteUsersCharges(userId: number): Promise<void> {
    await this.createQueryBuilder('charge')
      .where('flatOwnerId = :userId', { userId })
      .orWhere('roomOwnerId = :userId', { userId })
      .delete()
      .execute();
  }

  getChargesWithRooms(): Promise<Charge[]> {
    return this.find({ relations: ['room'] });
  }
}
