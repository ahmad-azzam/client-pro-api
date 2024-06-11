import { Query, Resolver } from '@nestjs/graphql';
import { ProjectStatusService } from './project-status.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/shared/guard';

@Resolver()
export class ProjectStatusResolver {
  constructor(private projectStatusService: ProjectStatusService) {}

  @Query('getProjectStatus')
  // @UseGuards(JwtGuard)
  async getProjectStatus() {
    return await this.projectStatusService.getProjectStatus();
  }
}
