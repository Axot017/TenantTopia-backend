import { EntityRepository, Repository } from 'typeorm';
import { Bill } from '../models/bill.model';

@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {
  getUserBills(userId: number): Promise<Bill[]> {
    return this.find({ where: { payerId: userId }, relations: ['payer'] });
  }
}
