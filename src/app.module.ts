import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { FormModule } from './models/form/form.module';
import { EmailModule } from './shared/email/email.module';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
  CookieResolver,
  GraphQLWebsocketResolver,
  HeaderResolver,
  I18nMiddleware,
} from 'nestjs-i18n';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/common/filter/all-exception.filter';
import { IddModule } from './models/idd/idd.module';
import { ExcelModule } from './shared/excel/excel.module';
import { ResponseModule } from './shared/response/response.module';
import { PrismaPortfolioModule } from './shared/prisma-portfolio/prisma-portfolio.module';
import { AuthModule } from './graphql/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DateTimeResolver, UUIDResolver } from 'graphql-scalars';
import { RoleModule } from './graphql/role/role.module';
import { EmployeeModule } from './graphql/employee/employee.module';
import { GraphQLUpload } from 'graphql-upload-ts';
import { ProjectStatusModule } from './graphql/project-status/project-status.module';
import { TokenModule } from './graphql/token/token.module';
import { UtilsModule } from './shared/utils/utils.module';
import { ClientModule } from './graphql/client/client.module';
import { GDriveModule } from './shared/g-drive/g-drive.module';
import { ProjectModule } from './graphql/project/project.module';
import { FileModule } from './graphql/file/file.module';
import { GraphqlException } from './shared/common/filter';
import { ClientNationalityModule } from './graphql/client-nationality/client-nationality.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        new AcceptLanguageResolver(),
      ],
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      resolvers: {
        Upload: GraphQLUpload,
        UUID: UUIDResolver,
        Date: DateTimeResolver,
      },
      playground: false,
      path: '/graphql',

      formatError: (_, error: any) =>
        new GraphqlException().errorHandler(error),
    }),
    PrismaModule,
    FormModule,
    EmailModule,
    IddModule,
    ExcelModule,
    ResponseModule,
    PrismaPortfolioModule,
    AuthModule,
    RoleModule,
    EmployeeModule,
    ProjectStatusModule,
    TokenModule,
    UtilsModule,
    ClientModule,
    GDriveModule,
    ProjectModule,
    FileModule,
    ClientNationalityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
