import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { Account } from '../db/models/account.model';
import { Room } from '../db/models/room.model';
import { AccountRepository } from '../db/repositories/account.repository';
import { FlatRepository } from '../db/repositories/flat.repository';
import { RoomRepository } from '../db/repositories/room.repository';
import { CreateRoomDto } from '../dtos/createRoom.dto';
import { EditRoomDto } from '../dtos/editRoom.dto';
import { exception } from 'console';

export const ROOM_IMAGES_DIR = './images/room';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly flatRepository: FlatRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async getRoomsInRadius(
    lat: number,
    long: number,
    radius: number
  ): Promise<Array<Room>> {
    if (!(lat && long && radius)) {
      return [];
    }

    const availableRooms = await this.roomRepository.getAvailableRoomsInRadius(
      lat,
      long,
      radius
    );

    return availableRooms;
  }

  async createRoom(
    currentUser: Account,
    createRoomDto: CreateRoomDto
  ): Promise<Room> {
    const usersFlat = await this.flatRepository.getUsersFlatByOwnerIdWithoutRooms(
      currentUser.id
    );

    if (!usersFlat) {
      throw new NotFoundException('Users flat not found');
    }

    const room = { ...createRoomDto, flat: usersFlat };

    return this.roomRepository.save(room);
  }

  async updateRoom(modifyRoomDto: EditRoomDto, roomId: number): Promise<Room> {
    const room = await this.getRoom(roomId);

    const { ownerEmail, ...roomModification } = modifyRoomDto;

    if (ownerEmail) {
      const user = await this.accountRepository.findOneByEmail(ownerEmail);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newRoomOwner = user;

      return this.roomRepository.save({
        ...room,
        ...roomModification,
        owner: newRoomOwner,
      });
    }

    return this.roomRepository.save({ ...room, ...roomModification });
  }

  async getRoom(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async deleteRoom(roomId: number): Promise<void> {
    const room = await this.getRoom(roomId);
    await this.roomRepository.remove(room);
  }

  async uploadImage(filename: string, roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) {
      const filePath = join(process.cwd(), 'images', 'room', filename);
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
      throw new NotFoundException('Room not found');
    }

    room.images.push(filename);

    await this.roomRepository.save(room);
  }

  async deleteImage(filename: string, roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const dir = join(process.cwd(), 'images', 'room', filename);
    if (existsSync(dir)) {
      rmSync(dir);
    } else {
      throw new NotFoundException();
    }

    room.images = room.images.filter((item) => item !== filename);

    await this.roomRepository.save(room);
  }
}
