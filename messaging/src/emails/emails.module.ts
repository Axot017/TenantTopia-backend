import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  providers: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
