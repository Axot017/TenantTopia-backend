import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Account } from '../db/models/account.model';
import { AccountRepository } from '../db/repositories/account.repository';
import { CreateAccountDto } from '../dtos/createAccount.dto';
import { timeout } from 'rxjs/operators';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    @Inject('AUTH_MICROSERVICE_CLIENT')
    private readonly coreClient: ClientProxy,
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<void> {
    const isEmailFree = await this.accountRepository
      .findOne({
        where: { email: createAccountDto.email },
      })
      .then((user) => !user);

    if (!isEmailFree) {
      throw new ConflictException('Email is already taken');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, ...account } = createAccountDto;
      await queryRunner.manager.save(Account, account);

      const user = await this.accountRepository.findOne({
        where: { email: createAccountDto.email },
      });

      await this.coreClient
        .send(
          { cmd: 'createUser' },
          { password, email: account.email, userId: user.id }
        )
        .pipe(timeout(5000))
        .toPromise();

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (e) {
      Logger.log(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new ServiceUnavailableException('Auth service is unavaliable');
    }
    return null;
  }
}
