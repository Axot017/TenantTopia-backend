import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201 })
  addBill(
    @Body() addBillDto: AddBillDto,
    @CurrentUser() currentUser: Account
  ): Promise<void> {
    return this.paymentService.addBill(addBillDto, currentUser);
  }

  @Get('/user/bills')
  @ApiResponse({ type: () => Bill, status: 200, isArray: true })
  getUserBills(@CurrentUser() currentUser: Account): Promise<Bill[]> {
    return this.paymentService.getUserBills(currentUser);
  }

  @Get('flat/bills')
  @ApiResponse({ type: () => Bill, status: 200, isArray: true })
  getFlatBills(@CurrentUser() currentUser: Account): Promise<Bill[]> {
    return this.paymentService.getFlatBills(currentUser);
  }

  @Get('charges')
  @ApiResponse({ type: () => Charge, status: 200, isArray: true })
  getCharges(@CurrentUser() currentUser: Account): Promise<Charge[]> {
    return this.paymentService.getCharges(currentUser);
  }

  @Post('charge/:id/reset')
  @ApiOperation({ summary: 'Only the user who recives maney can reset charge' })
  @ApiResponse({
    status: 201,
  })
  resetCharge(
    @Param('id', ParseNumberPipe) id: number,
    @CurrentUser() currentUser: Account
  ): Promise<void> {
    return this.paymentService.resetCharge(id, currentUser);
  }
}
