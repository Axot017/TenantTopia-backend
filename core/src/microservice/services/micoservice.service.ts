import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Account } from '../../db/models/account.model';
import { AccountRepository } from '../../db/repositories/account.repository';

@Injectable()
export class MicroserviceService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOne(id);

    if (!account) {
      throw new RpcException('Account not existing');
    }

    return account;
  }
}
