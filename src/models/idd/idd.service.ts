import { Injectable } from '@nestjs/common';
import { QueryDto } from 'src/shared/dto';
import { ExcelService } from 'src/shared/excel/excel.service';
import { CreateIddDto } from './dto';
import { PrismaPortfolioService } from 'src/shared/prisma-portfolio/prisma-portfolio.service';

@Injectable()
export class IddService {
  constructor(
    private prismaPortfolioService: PrismaPortfolioService,
    private excelService: ExcelService,
  ) {}

  async findAll(query?: QueryDto) {
    return await this.prismaPortfolioService.idds.findMany({
      select: { id: true, code: true, name: true },
      ...{
        ...(query?.search && {
          where: {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                code: {
                  contains: query.search,
                },
              },
            ],
          },
        }),
      },
    });
  }

  async createBatch(file: Express.Multer.File) {
    const dataExcel = await this.excelService.readExcel(file.buffer);
    dataExcel.shift();

    const dataIdd: CreateIddDto[] = [];

    for (let index = 0; index < dataExcel.length; index++) {
      const dataRow = dataExcel[index];

      dataIdd.push({
        code: dataRow[1].toString(),
        name: dataRow[0].toString(),
      });
    }

    return await this.prismaPortfolioService.idds.createMany({ data: dataIdd });
  }
}
