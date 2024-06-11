import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { I18nValidationPipe, I18nMiddleware } from 'nestjs-i18n';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import helmet from 'helmet';
import { ImATeapotException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const DOMAIN_ORIGIN = configService.get<string>('DOMAIN_ORIGIN').split(',');

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);

        return;
      }

      const originSplit = origin.split(':');
      const domain = `${originSplit[0]}:${originSplit[1]}`;

      if (DOMAIN_ORIGIN.includes(domain)) {
        cb(null, true);

        return;
      }

      cb(new ImATeapotException('Not allowed by CORS'), false);
    },
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.use(graphqlUploadExpress());
  app.use(cookieParser('secret-cookie'));
  // app.use(I18nMiddleware);

  app.setGlobalPrefix(configService.get<string>('BASE_API'));

  app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));

  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();
