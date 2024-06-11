import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { GDriveModule } from 'src/shared/g-drive/g-drive.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { FileModule } from '../file/file.module';
import { ClientModule } from '../client/client.module';

@Module({
  providers: [ProjectService, ProjectResolver],
  imports: [GDriveModule, UtilsModule, FileModule, ClientModule],
})
export class ProjectModule {}
