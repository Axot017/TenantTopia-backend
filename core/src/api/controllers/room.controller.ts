/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Account } from '../../db/models/account.model';
import { Room } from '../../db/models/room.model';
import { EditRoomDto } from '../../dtos/editRoom.dto';
import { RoomService, ROOM_IMAGES_DIR } from '../../services/room.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('flat/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiResponse({ type: () => Room, status: 201 })
  createRoom(
    @CurrentUser() currentUser: Account,
    @Body() modifyRoomDto: EditRoomDto
  ): Promise<Room> {
    return this.roomService.createRoom(currentUser, modifyRoomDto);
  }

  @Patch(':id')
  @ApiResponse({ type: () => Room, status: 200 })
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() modifyRoomDto: EditRoomDto,
    @CurrentUser() currentUser: Account
  ): Promise<Room> {
    return this.roomService.updateRoom(modifyRoomDto, id, currentUser);
  }

  @Get(':id')
  @ApiResponse({ type: () => Room, status: 200 })
  getRoom(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return this.roomService.getRoom(id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200 })
  deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roomService.deleteRoom(id);
  }

  @Post(':id/image')
  @ApiResponse({ status: 201 })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: ROOM_IMAGES_DIR,
      }),
    })
  )
  uploadAvatar(
    @UploadedFile() file: any,
    @CurrentUser() currentAccount: Account,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.roomService.uploadImage(file.filename, id);
  }

  @Get('image/:img')
  @ApiResponse({ status: 200 })
  getImage(@Param('img') img: string, @Res() res: Response): unknown {
    const dir = join(process.cwd(), 'images', 'room', img);
    if (existsSync(dir)) {
      return createReadStream(dir).pipe(res);
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':id/image/:img')
  @ApiResponse({ status: 200 })
  deleteImage(
    @Param('img') img: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.roomService.deleteImage(img, id);
  }
}
