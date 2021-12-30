import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
  }

  // Placeholder
  async sendInvitation(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'info@minun.fi',
      subject: 'Tervetuloa käyttäjäksi!',
      template: 'templates/invitation',
      context: {
        code
      }
    });
  }
}
