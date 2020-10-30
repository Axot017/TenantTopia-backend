import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { VerificationDto } from './dtos/verification.dto';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  sendVerificationEmail(verificaitonDto: VerificationDto): void {
    this.mailerService
      .sendMail({
        to: verificaitonDto.email,
        from: 'noreply@tenanttopia.com',
        subject: 'Email confirmation',
        template: 'confirmation',
        context: {
          confirmationUrl: verificaitonDto.confirmationUrl,
        },
      })
      .then(() => {
        Logger.log(`Confirmation email to ${verificaitonDto.email} - success`);
      })
      .catch((e) => {
        Logger.warn(
          `Confirmation email to ${verificaitonDto.email} - fail - ${e}`
        );
      });
  }
}
