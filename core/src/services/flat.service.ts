import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from '../db/models/account.model';
import { Flat } from '../db/models/flat.model';
import { FlatRepository } from '../db/repositories/flat.repository';
import { ModifyFlatDto } from '../dtos/modifyFlat.dto';

@Injectable()
export class FlatService {
  constructor(private readonly flatRepository: FlatRepository) {}

  async createFlat(
    currentUser: Account,
    modifyFlatDto: ModifyFlatDto
  ): Promise<Flat> {
    const usersFlat = await this.flatRepository.getUsersFlatByUserId(
      currentUser.id
    );

    if (usersFlat) {
      if (usersFlat.isConfirmed) {
        throw new ConflictException('User have confirmed flat or room');
      } else {
        await this.flatRepository.remove(usersFlat);
      }
    }

    return this.flatRepository.save(modifyFlatDto);
  }

  async updateFlat(
    currentUser: Account,
    modifyFlatDto: ModifyFlatDto
  ): Promise<Flat> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    if (!usersFlat) {
      throw new BadRequestException("you don't have any flat");
    }

    return this.flatRepository.save({ ...usersFlat, ...modifyFlatDto });
  }

  async deleteFlat(currentUser: Account): Promise<void> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    await this.flatRepository.remove(usersFlat);
  }

  async finalizeFlatCreation(currentUser: Account): Promise<void> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    if (!usersFlat) {
      throw new NotFoundException('Flat not found');
    }

    await this.flatRepository.save({ ...usersFlat, isConfirmed: true });
  }

  async getFlat(
    includeUnconfirmed: boolean,
    currentUser: Account
  ): Promise<Flat> {
    const usersFlat = await this.flatRepository.getUsersFlatByUserId(
      currentUser.id
    );

    if (!usersFlat || (!includeUnconfirmed && !usersFlat.isConfirmed)) {
      throw new NotFoundException('Flat not found');
    }

    return usersFlat;
  }
}
