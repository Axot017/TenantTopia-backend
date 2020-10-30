import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VerificationDto } from './dtos/verification.dto';
import { EmailsService } from './emails.service';

@Controller()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @MessagePattern({ cmd: 'sendVerificationEmail' })
  sendVerificationEmail(@Payload() verificaitonDto: VerificationDto): void {
    this.emailsService.sendVerificationEmail(verificaitonDto);
  }
}
