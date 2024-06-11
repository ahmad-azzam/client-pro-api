import { Global, Module } from '@nestjs/common';
import { PrismaPortfolioService } from './prisma-portfolio.service';

@Global()
@Module({
  providers: [PrismaPortfolioService],
  exports: [PrismaPortfolioService],
})
export class PrismaPortfolioModule {}
