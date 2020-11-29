import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Account } from '../../db/models/account.model';
import { Bill } from '../../db/models/bill.model';
import { Charge } from '../../db/models/charge.model';
import { AddBillDto } from '../../dtos/addBill.dto';
import { PaymentService } from '../../services/payment.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { ParseNumberPipe } from '../pipes/parseNumber.pipe';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('bills')
  addBill(
    @Body() addBillDto: AddBillDto,
    @CurrentUser() currentUser: Account
  ): Promise<void> {
    return this.paymentService.addBill(addBillDto, currentUser);
  }

  @Get('/user/bills')
  getUserBills(@CurrentUser() currentUser: Account): Promise<Bill[]> {
    return this.paymentService.getUserBills(currentUser);
  }

  @Get('flat/bills')
  getFlatBills(@CurrentUser() currentUser: Account): Promise<Bill[]> {
    return this.paymentService.getFlatBills(currentUser);
  }

  @Get('charges')
  getCharges(@CurrentUser() currentUser: Account): Promise<Charge[]> {
    return this.paymentService.getCharges(currentUser);
  }

  @Post('charge/:id/reset')
  resetCharge(
    @Param('id', ParseNumberPipe) id: number,
    @CurrentUser() currentUser: Account
  ): Promise<void> {
    return this.paymentService.resetCharge(id, currentUser);
  }
}
