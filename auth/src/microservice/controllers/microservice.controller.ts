/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { User } from '../../db/models/user.model';
import { CreateUserDto } from '../dtos/createUser.dto';
import { MicroserviceService } from '../services/microservice.service';

@Controller()
export class MicroserviceController {
  constructor(private readonly service: MicroserviceService) {}

  @MessagePattern({ cmd: 'authenticate' })
  validateToken(@Payload() authenticationHeader: string): Promise<any> {
    return this.service.validateToken(authenticationHeader);
  }

  @MessagePattern({ cmd: 'createUser' })
  createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
    return this.service.createUser(createUserDto);
  }
}
