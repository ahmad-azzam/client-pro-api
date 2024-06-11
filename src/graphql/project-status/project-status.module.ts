import { Module } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusResolver } from './project-status.resolver';

@Module({
  providers: [ProjectStatusService, ProjectStatusResolver],
  imports: [],
})
export class ProjectStatusModule {}
