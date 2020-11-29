import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { Account } from '../db/models/account.model';
import { Flat } from '../db/models/flat.model';
import { FlatRepository } from '../db/repositories/flat.repository';
import { ModifyFlatDto } from '../dtos/modifyFlat.dto';
import { PaymentService } from './payment.service';

export const FLAT_IMAGES_DIR = './images/flat';

@Injectable()
export class FlatService {
  constructor(
    private readonly flatRepository: FlatRepository,
    private readonly paymentService: PaymentService
  ) {}

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

    return this.flatRepository.save({ ...modifyFlatDto, owner: currentUser });
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
    const usersFlat = await this.flatRepository.getOwnersFlat(currentUser.id);
    if (usersFlat) {
      await this.flatRepository.remove(usersFlat);
    }
  }

  async finalizeFlatCreation(currentUser: Account): Promise<void> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    this.validateFlat(usersFlat);

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

  private validateFlat(flat: Flat) {
    const address = flat.address;
    if (!flat) {
      throw new NotFoundException('Flat not found');
    } else if (
      !(
        flat.description &&
        address.address &&
        address.city &&
        address.zipCode &&
        address.lat &&
        address.lon
      )
    ) {
      throw new BadRequestException('Not all fields added');
    } else if ((flat.rooms ?? []).length === 0) {
      throw new BadRequestException('No room added');
    }
  }

  async uploadImage(filename: string, currentUser: Account): Promise<void> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    if (!usersFlat) {
      const filePath = join(process.cwd(), 'images', 'flat', filename);
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
      throw new BadRequestException("you don't have any flat");
    }

    usersFlat.images.push(filename);

    await this.flatRepository.save(usersFlat);
  }

  async deleteImage(filename: string, currentUser: Account): Promise<void> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerId(
      currentUser.id
    );

    if (!usersFlat) {
      throw new BadRequestException("you don't have any flat");
    }

    const dir = join(process.cwd(), 'images', 'flat', filename);
    if (existsSync(dir)) {
      rmSync(dir);
    } else {
      throw new NotFoundException();
    }

    usersFlat.images = usersFlat.images.filter((item) => item !== filename);

    await this.flatRepository.save(usersFlat);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  deleteUnconfirmedFlats(): void {
    this.flatRepository.deleteUnconfirmedFlats();
  }
}
