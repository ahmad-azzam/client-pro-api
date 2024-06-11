import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto';
import { EmailService } from 'src/shared/email/email.service';
import { I18nService } from 'nestjs-i18n';
import { PrismaPortfolioService } from 'src/shared/prisma-portfolio/prisma-portfolio.service';

@Injectable()
export class FormService {
  constructor(
    private prismaPortfolioService: PrismaPortfolioService,
    private emailService: EmailService,
    private i18n: I18nService,
  ) {}

  async createForm(data: CreateFormDto, lang: string) {
    await this.prismaPortfolioService.form.create({ data });

    this.emailService.sendEmail({
      emailRecipient: data.email,
      lang,
      subject: this.i18n.t('email.subject_email', { lang }),
      name: data.name,
    });
  }
}
