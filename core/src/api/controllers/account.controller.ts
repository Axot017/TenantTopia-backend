/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Account } from '../../db/models/account.model';
import {
  AccountService,
  AVATARS_FILE_DIR,
} from '../../services/account.service';
import { CreateAccountDto } from '../../dtos/createAccount.dto';
import { EditAccountDto } from '../../dtos/editAccount.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Public } from '../decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

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

  @Post('current/avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: AVATARS_FILE_DIR,
      }),
    })
  )
  uploadAvatar(
    @UploadedFile() file: any,
    @CurrentUser() currentAccount: Account
  ): Promise<void> {
    return this.accountService.addAvatar(file.filename, currentAccount);
  }

  @Get('avatar/:img')
  getImage(@Param('img') img: string, @Res() res: Response): unknown {
    const dir = join(process.cwd(), 'images', 'avatars', img);
    if (existsSync(dir)) {
      return createReadStream(dir).pipe(res);
    } else {
      throw new NotFoundException();
    }
  }
}
