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
import { EditAccountDto } from '../dtos/editAccount.dto';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

export const AVATARS_FILE_DIR = './images/avatars';

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
      .findOneByEmail(createAccountDto.email)
      .then((user) => !user);

    if (!isEmailFree) {
      throw new ConflictException('Email is already taken');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, ...account } = createAccountDto;
      const user = await queryRunner.manager.save(Account, account);

      await this.coreClient
        .send(
          { cmd: 'createUser' },
          { password, email: account.email, userId: (user as Account).id }
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
  }

  async editCurrentAccount(
    currentUser: Account,
    editAccountDto: EditAccountDto
  ): Promise<void> {
    await this.accountRepository.save({ ...currentUser, ...editAccountDto });
  }

  async addAvatar(fileName: string, currentUser: Account): Promise<void> {
    if (currentUser.avatar) {
      const filePath = join(
        process.cwd(),
        'images',
        'avatars',
        currentUser.avatar
      );

      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }
    currentUser.avatar = fileName;
    await this.accountRepository.save(currentUser);
  }
}
