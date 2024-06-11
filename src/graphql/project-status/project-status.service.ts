import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ProjectStatusService {
  constructor(private prismaService: PrismaService) {}

  async getProjectStatus() {
    return await this.prismaService.projectStatus.findMany();
  }
}
