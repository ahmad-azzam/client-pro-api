import { Query, Resolver } from '@nestjs/graphql';
import { ClientNationalityService } from './client-nationality.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/shared/guard';

@Resolver()
@UseGuards(JwtGuard)
export class ClientNationalityResolver {
  constructor(private clientNationalityService: ClientNationalityService) {}

  @Query('getClientNationalities')
  async getClientNationalities() {
    return await this.clientNationalityService.getClientNationalities();
  }
}
