import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './file.service';
import { GDriveModule } from 'src/shared/g-drive/g-drive.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { FileResolver } from './file.resolver';
import { ClientModule } from '../client/client.module';

@Module({
  providers: [FileService, FileResolver],
  imports: [GDriveModule, UtilsModule, forwardRef(() => ClientModule)],
  exports: [FileService],
})
export class FileModule {}
