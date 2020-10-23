import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../models/account.model';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
