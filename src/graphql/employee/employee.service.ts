import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RoleService } from '../role/role.service';
import { FileUpload } from 'graphql-upload-ts';
import { ExcelService } from 'src/shared/excel/excel.service';
import { Prisma } from '@prisma/client';
import { UtilsService } from 'src/shared/utils/utils.service';
import { TParameterList } from 'src/shared/type';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private excelService: ExcelService,
    private utilsService: UtilsService,
  ) {}

  async bulkCreate(file: FileUpload) {
    const fileBuffer: Buffer =
      await this.utilsService.fileToBufferGraphql(file);

    const result = await this.excelService.readExcel(fileBuffer);
    result.shift();

    const dataExecution = [];

    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      dataExecution.push(
        this.prismaService.role.update({
          data: {
            employees: {
              create: {
                username: element[0].toString(),
                full_name: element[1].toString(),
                password: element[2].toString(),
                is_active: element[3] as boolean,
              },
            },
          },
          where: { name: element[4].toString() },
        }),
      );
    }

    await Promise.all(dataExecution);
  }

  async findUnique(payload: Prisma.EmployeeWhereUniqueInput) {
    return await this.prismaService.employee.findUnique({ where: payload });
  }

  async getEmployees({ page_index, searchValue, size = 1000 }: TParameterList) {
    const options: Prisma.EmployeeFindManyArgs = {
      ...this.utilsService.generateTakeAndSkip(page_index, size),
    };

    if (searchValue) {
      options.where = {
        OR: [
          {
            full_name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return await this.prismaService.employee.findMany({
      ...options,
      include: {
        role: true,
      },
    });
  }
}
