import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('email.host'),
      port: configService.get('email.port'),
      secure: configService.get('email.secure'),
      auth: {
        user: configService.get('email.user'),
        pass: configService.get('email.pass'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('email.user'),
      },
      to,
      subject,
      html,
    });
  }
}
