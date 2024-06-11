import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { ValidationError } from 'class-validator';
import { GraphQLError } from 'graphql';
import { I18nValidationException } from 'nestjs-i18n';
import { TErrorGraphql } from 'src/shared/type';

export class GraphqlException {
  private error: TErrorGraphql = {
    message: 'Something went wrong in server',
    messageCode: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  };

  errorHandler(error: any): TErrorGraphql {
    console.log(error)
    if (error instanceof GraphQLError) {
      const originError = error.originalError;

      if (originError instanceof ForbiddenException) {
        const res = originError.getResponse() as any;

        this.error = {
          message: res?.message,
          messageCode: res?.error,
          statusCode: res?.statusCode,
        };
      }

      if (originError instanceof JsonWebTokenError) {
        this.error = {
          message: originError.message,
          messageCode: originError.name,
          statusCode: 401,
        };
      }

      if (originError instanceof I18nValidationException) {
        const message = Object.entries(originError.errors[0].constraints).map(
          (item) => item,
        );

        this.error = {
          message: message[0][1],
          messageCode: originError.message,
          statusCode: 400,
        };
      }

      if (originError instanceof BadRequestException) {
        const res = originError.getResponse() as any;

        this.error = {
          message: res?.message,
          messageCode: res?.error,
          statusCode: res?.statusCode,
        };
      }

      this.error = {
        message: error.message,
        messageCode: 'Bad Request',
        statusCode: 400,
      };
    }

    return this.error;
  }
}
