import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Account } from '../db/models/account.model';
import { Chore } from '../db/models/chore.model';
import { FlatRepository } from '../db/repositories/flat.repository';
import { ChoreRepository } from '../db/repositories/chore.repository';
import { CreateChoreDto } from '../dtos/createChore.dto';
import { UpdateChoreDto } from '../dtos/updateChore.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountRepository } from '../db/repositories/account.repository';

@Injectable()
export class ChoreService {
  constructor(
    private readonly choreRepository: ChoreRepository,
    private readonly flatRepository: FlatRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async createChore(
    createChoreDto: CreateChoreDto,
    currentUser: Account
  ): Promise<Chore> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerIdWithoutRooms(
      currentUser.id
    );

    if (!usersFlat) {
      throw new ForbiddenException('You are not a flat owner');
    }

    const account = await this.accountRepository.findOne(
      createChoreDto.accountId
    );

    if (!account) {
      throw new BadRequestException('User not found');
    }

    const chore = { ...createChoreDto, flat: usersFlat, account: account };

    return this.choreRepository.save(chore);
  }

  async updateChore(
    updateChoreDto: UpdateChoreDto,
    choreId: number,
    currentUser: Account
  ): Promise<Chore> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerIdWithoutRooms(
      currentUser.id
    );

    if (!usersFlat) {
      throw new ForbiddenException('You are not a flat owner');
    }

    const chore = await this.getChore(choreId);

    return this.choreRepository.save({ ...chore, ...updateChoreDto });
  }

  async getChore(choreId: number): Promise<Chore> {
    const chore = await this.choreRepository.findOne(choreId, {
      relations: ['account'],
    });

    if (!chore) {
      throw new NotFoundException('Chore not found');
    }

    return chore;
  }

  async getChores(currentUser: Account): Promise<Chore[]> {
    const usersFlat = await this.flatRepository.getUsersFlatByUserId(
      currentUser.id
    );

    if (!usersFlat) {
      throw new NotFoundException('Flat not found.');
    }

    return await this.choreRepository.find({
      where: [{ flat: usersFlat.id }],
    });
  }

  async getUserChores(currentUser: Account): Promise<Chore[]> {
    return await this.choreRepository.find({
      where: [{ account: currentUser }],
    });
  }

  async deleteChore(choreId: number): Promise<void> {
    /// TODO: add flat owner only permission
    const chore = await this.getChore(choreId);
    await this.choreRepository.remove(chore);
  }
}
