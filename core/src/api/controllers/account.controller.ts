import { Body, Controller, Get, Post } from '@nestjs/common';
import { Account } from '../../db/models/account.model';
import { AccountService } from '../../services/account.service';
import { CreateAccountDto } from '../../dtos/createAccount.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Public } from '../decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { hostname } from 'os';

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
    console.log(hostname());
    return currentUser;
  }
}
