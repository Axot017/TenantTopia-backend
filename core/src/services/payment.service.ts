import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../db/models/account.model';
import { Bill } from '../db/models/bill.model';
import { Charge } from '../db/models/charge.model';
import { Flat } from '../db/models/flat.model';
import { Room } from '../db/models/room.model';
import { BillRepository } from '../db/repositories/bill.repository';
import { ChargeRepository } from '../db/repositories/charge.repository';
import { FlatRepository } from '../db/repositories/flat.repository';
import { AddBillDto } from '../dtos/addBill.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

export class PaymentService {
  constructor(
    @InjectRepository(ChargeRepository)
    private readonly chargeRepository: ChargeRepository,
    private readonly billRepository: BillRepository,
    private readonly flatRepository: FlatRepository
  ) {}

  async deleteUserCharges(user: Account): Promise<void> {
    await this.chargeRepository.deleteUsersCharges(user.id);
  }

  async createCharge(
    flatOwner: Account,
    roomOwner: Account,
    flat: Flat,
    room: Room
  ): Promise<void> {
    await this.chargeRepository.save({
      flatOwner,
      roomOwner,
      flat,
      room,
    });
  }

  async addBill(addBillDto: AddBillDto, currentUser: Account): Promise<void> {
    const flat = await this.flatRepository.getUsersFlatByUserIdWithCharges(
      currentUser.id
    );

    if (!flat) {
      throw new NotFoundException('Flat not found');
    }

    const charges = flat.charges;

    const numberOfRoommates = charges.length + 1;

    if (numberOfRoommates <= 1) {
      throw new BadRequestException('No roommates');
    }

    const amountPerRoommate = addBillDto.amount / numberOfRoommates;

    if (charges[0].flatOwnerId === currentUser.id) {
      charges.forEach((charge) => {
        charge.amount -= amountPerRoommate;
      });
    } else {
      charges.forEach((charge) => {
        if (charge.roomOwnerId === currentUser.id) {
          charge.amount += amountPerRoommate * charges.length;
        } else {
          charge.amount -= amountPerRoommate;
        }
      });
    }

    await this.chargeRepository.save(charges);

    await this.billRepository.save({
      payer: currentUser,
      description: addBillDto.description,
      amount: addBillDto.amount,
      flat,
    });
  }

  async getUserBills(currentUser: Account): Promise<Bill[]> {
    return this.billRepository.getUserBills(currentUser.id);
  }

  async getFlatBills(currentUser: Account): Promise<Bill[]> {
    const flat = await this.flatRepository.getUsersFlatByUserIdWithBills(
      currentUser.id
    );

    if (!flat) {
      throw new NotFoundException('Flat not found');
    }

    return flat.bills;
  }

  async getCharges(currentUser: Account): Promise<Charge[]> {
    return this.chargeRepository.getChargesByUserId(currentUser.id);
  }

  async resetCharge(id: number, currentUser: Account): Promise<void> {
    const charge = await this.chargeRepository.findOne(id);

    if (!charge) {
      throw new NotFoundException('Charge not found');
    }

    if (
      (charge.amount < 0 && charge.flatOwnerId != currentUser.id) ||
      (charge.amount > 0 && charge.roomOwnerId != currentUser.id)
    ) {
      throw new ForbiddenException('You cannot edit this charge');
    }

    charge.amount = 0.0;
    await this.chargeRepository.save(charge);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async addRoomCostsToCharge(): Promise<void> {
    const charges = await this.chargeRepository.getChargesWithRooms();
    charges.forEach((charge) => {
      charge.amount -= charge.room.cost;
    });
    await this.chargeRepository.save(charges);
  }
}
