import { Injectable } from '@nestjs/common';
import { Room } from '../db/models/room.model';
import { RoomRepository } from '../db/repositories/room.repository';

@Injectable()
export class RoomService {
    constructor(private readonly roomRepository: RoomRepository) {}

    async getRoomsInRadius(
        lat: number,
        long: number,
        radius: number
      ): Promise<Array<Room>> {
        const availableRooms = await this.roomRepository.getAvailableRoomsInRadius(
          lat, long, radius
        );
    
        return availableRooms;
      }
}
