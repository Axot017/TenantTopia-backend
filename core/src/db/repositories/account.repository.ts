import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../models/account.model';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async findOneByEmail(email: string): Promise<Account> {
    return this.findOne({ where: { email } });
  }
}
