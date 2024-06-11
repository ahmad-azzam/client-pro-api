import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ClientNationalityService {
  constructor(private prismaService: PrismaService) {}

  async getClientNationalities() {
    return await this.prismaService.clientNationality.findMany();
  }
}
