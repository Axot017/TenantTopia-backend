import { Injectable } from '@nestjs/common';
import { FlatRepository } from '../db/repositories/flat.repository';
import { RoomRepository } from '../db/repositories/room.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly flatRepository: FlatRepository
  ) {}
}
