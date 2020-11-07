import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Room } from '../../db/models/room.model';
import { RoomService } from '../../services/room.service';

@Controller('flat/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(): Promise<Room> {
    return null;
  }

  @Patch(':id')
  updateRoom(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return null;
  }

  @Get(':id')
  getRoom(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return null;
  }

  @Delete(':id')
  deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return null;
  }
}
