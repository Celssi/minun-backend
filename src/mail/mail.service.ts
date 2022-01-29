import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(email: string, code: string, frontendUrl: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'info@minun.info',
      subject: 'Tervetuloa käyttäjäksi!',
      template: 'templates/confirmation',
      context: {
        code,
        email,
        frontendUrl
      }
    });
  }
}
