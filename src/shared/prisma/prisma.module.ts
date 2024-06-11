import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  constructor(private prismaService: PrismaService) {
    this.prismaService.$extends({
      query: {
        employee: {
          async $allOperations({ operation, args, query }) {
            console.log({ args, operation });

            return await query(args);
          },
        },
      },
    });
  }
}
