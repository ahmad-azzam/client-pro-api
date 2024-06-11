import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as fs from 'fs';
import * as mustache from 'mustache';
import { TEmailParameter } from './type';
import { FileTemplateEmail } from './enum';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: this.configService.get<string>('EMAIL_TRANSPORT'),
        pass: this.configService.get<string>('EMAIL_PASSWORD_TRANSPORT'),
      },
      logger: true,
    });
  }

  async sendEmail({
    emailRecipient,
    lang = 'en',
    name,
    subject,
  }: TEmailParameter) {
    const template = fs.readFileSync(
      lang === 'id' ? FileTemplateEmail.ID : FileTemplateEmail.EN,
      'utf-8',
    );

    return await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to: emailRecipient,
      subject,
      html: mustache.render(template.toString(), { name }),
    });
  }
}
