import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (params.action === 'update' && params.model === 'Role') {
        const employee = params.args.data.employees;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(employee.create.password, salt);
        employee.create.password = hash;
        params.args.data.employees = employee;
      }
      return next(params);
    });
  }
}
