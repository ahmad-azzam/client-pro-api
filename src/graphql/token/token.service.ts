import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prismaService: PrismaService) {}

  async findUniqueAccessToken(payload: Prisma.TokenFindUniqueArgs) {
    return await this.prismaService.token.findUnique(payload);
  }

  async findUniqueRefreshToken(payload: Prisma.AuthenticationFindUniqueArgs) {
    return await this.prismaService.authentication.findUnique(payload);
  }

  async upsertRefreshToken(employee_id: string, refresh_token: string) {
    return this.prismaService.authentication.upsert({
      where: {
        employee_id,
      },
      create: {
        refresh_token,
        employee_id,
      },
      update: {
        refresh_token,
      },
    });
  }

  async upsertAccessToken(employee_id: string, access_token: string) {
    return this.prismaService.token.upsert({
      create: {
        access_token,
        employee_id,
      },
      update: {
        access_token,
      },
      where: { employee_id },
    });
  }

  async deleteAccessToken(employee_id: string) {
    return this.prismaService.token.delete({ where: { employee_id } });
  }

  async removeTokens(employee_id: string) {
    await Promise.all([
      this.upsertRefreshToken(employee_id, null),
      this.prismaService.token.delete({ where: { employee_id } }),
    ]);
  }
}
