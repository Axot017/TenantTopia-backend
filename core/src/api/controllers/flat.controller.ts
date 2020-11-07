/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Account } from '../../db/models/account.model';
import { Flat } from '../../db/models/flat.model';
import { ModifyFlatDto } from '../../dtos/modifyFlat.dto';
import { FlatService, FLAT_IMAGES_DIR } from '../../services/flat.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('flat')
@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  @ApiResponse({ type: () => Flat, status: 201 })
  createFlat(
    @Body() modifyFlatDto: ModifyFlatDto,
    @CurrentUser() currentUser: Account
  ): Promise<Flat> {
    return this.flatService.createFlat(currentUser, modifyFlatDto);
  }

  @Patch()
  @ApiResponse({ type: () => Flat, status: 200 })
  updateFlat(
    @Body() modifyFlatDto: ModifyFlatDto,
    @CurrentUser() currentUser: Account
  ): Promise<Flat> {
    return this.flatService.updateFlat(currentUser, modifyFlatDto);
  }

  @Post('finalize')
  @ApiResponse({ status: 201 })
  finalizeFlatCreation(@CurrentUser() currentUser: Account): Promise<void> {
    return this.flatService.finalizeFlatCreation(currentUser);
  }

  @Get()
  @ApiResponse({ type: () => Flat, status: 200 })
  getFlat(
    @Query('includeUnconfirmed', ParseBoolPipe) includeUnconfirmed: boolean,
    @CurrentUser() currentUser: Account
  ): Promise<Flat> {
    return this.flatService.getFlat(includeUnconfirmed, currentUser);
  }

  @Delete()
  @ApiResponse({ status: 200 })
  deleteFlat(@CurrentUser() currentUser: Account): Promise<void> {
    return this.flatService.deleteFlat(currentUser);
  }

  @Post('image')
  @ApiResponse({ status: 201 })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FLAT_IMAGES_DIR,
      }),
    })
  )
  uploadAvatar(
    @UploadedFile() file: any,
    @CurrentUser() currentAccount: Account
  ): Promise<void> {
    return this.flatService.uploadImage(file.filename, currentAccount);
  }

  @Get('image/:img')
  @ApiResponse({ status: 200 })
  getImage(@Param('img') img: string, @Res() res: Response): unknown {
    const dir = join(process.cwd(), 'images', 'flat', img);
    if (existsSync(dir)) {
      return createReadStream(dir).pipe(res);
    } else {
      throw new NotFoundException();
    }
  }

  @Delete('image/:img')
  @ApiResponse({ status: 200 })
  deleteImage(
    @CurrentUser() currentAccount: Account,
    @Param('img') img: string
  ): Promise<void> {
    return this.flatService.deleteImage(img, currentAccount);
  }
}
