import { Module } from '@nestjs/common';
import { ClientNationalityService } from './client-nationality.service';
import { ClientNationalityResolver } from './client-nationality.resolver';

@Module({
  providers: [ClientNationalityService, ClientNationalityResolver]
})
export class ClientNationalityModule {}
