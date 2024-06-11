import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma-portfolio/prisma/client';

@Injectable()
export class PrismaPortfolioService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
