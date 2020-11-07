import { Controller, Get, Query } from '@nestjs/common';
import { Room } from '../../db/models/room.model';
import { RoomService } from '../../services/room.service';

@Controller('rooms')
export class RoomSearchController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getRoomsInRadius(
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('radius') radius: number
  ): Promise<Array<Room>> {
    return this.roomService.getRoomsInRadius(lat, long, radius);
  }
}
