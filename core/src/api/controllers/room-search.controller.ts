import { Controller, Get, Query } from '@nestjs/common';
import { Room } from '../../db/models/room.model';
import { RoomService } from '../../services/room.service';
import { ParseNumberPipe } from '../pipes/parseNumber.pipe';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomSearchController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiResponse({ type: () => Room, isArray: true, status: 200 })
  getRoomsInRadius(
    @Query('lat', ParseNumberPipe) lat: number,
    @Query('long', ParseNumberPipe) long: number,
    @Query('radius', ParseNumberPipe) radius: number,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number
  ): Promise<Array<Room>> {
    return this.roomService.getRoomsInRadius(
      lat,
      long,
      radius,
      minPrice,
      maxPrice
    );
  }
}
