import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Account } from '../../db/models/account.model';
import { MicroserviceService } from '../services/micoservice.service';

@Controller()
export class MicroserviceController {
  constructor(private readonly microserviceService: MicroserviceService) {}

  @MessagePattern({ cmd: 'getAccountById' })
  getAccountById(@Payload() id: number): Promise<Account> {
    return this.microserviceService.getAccountById(id);
  }
}
