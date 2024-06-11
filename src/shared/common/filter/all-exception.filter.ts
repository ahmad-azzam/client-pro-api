import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nValidationException } from 'nestjs-i18n';
import { TError } from '../../type';
import { I18nContext, I18n } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from 'src/shared/response/response.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private error: TError = { message: null, messageCode: '', lang: '' };

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private configService: ConfigService,
    private responseService: ResponseService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    const type: string = host.getType();

    if (type === 'graphql') return exception;

    const { httpAdapter } = this.httpAdapterHost;
    const i18n = I18nContext.current(host);


    this.error.lang = i18n.lang;

    if (exception instanceof I18nValidationException) {
      const errorException = exception.errors[0];

      for (const property in errorException.constraints) {
        const errorCode = errorException.constraints[property].split('|')[0];
        this.error.message = i18n.t(errorCode, {
          lang: i18n.lang,
        });
        this.error.messageCode = errorCode;
      }
    }

    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!this.error.message) {
      this.error = {
        messageCode: 'system.internal_server_error',
        message: i18n.t('system.internal_server_error', { lang: i18n.lang }),
        lang: i18n.lang,
      };
    }

    const responseBody = this.responseService.error(status, this.error);

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
