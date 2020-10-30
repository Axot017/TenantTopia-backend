import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Account } from '../../db/models/account.model';
import { AccountService } from '../../services/account.service';
import { CreateAccountDto } from '../../dtos/createAccount.dto';
import { EditAccountDto } from '../../dtos/editAccount.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Public } from '../decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post('create')
  @ApiResponse({ status: 201 })
  createAccount(@Body() createAccountDto: CreateAccountDto): Promise<void> {
    return this.accountService.createAccount(createAccountDto);
  }

  @Get('current')
  @ApiResponse({ type: Account, status: 200 })
  getCurrentAccount(@CurrentUser() currentUser: Account): Account {
    return currentUser;
  }

  @Patch('current')
  @ApiResponse({ type: Account, status: 200 })
  editCurrentAccount(
    @CurrentUser() currentUser: Account,
    @Body() editAccountDto: EditAccountDto
  ): Promise<void> {
    return this.accountService.editCurrentAccount(currentUser, editAccountDto);
  }
}
