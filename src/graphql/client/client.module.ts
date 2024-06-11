import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { GDriveModule } from 'src/shared/g-drive/g-drive.module';
import { FileModule } from '../file/file.module';

@Module({
  providers: [ClientService, ClientResolver],
  imports: [UtilsModule, GDriveModule, forwardRef(() => FileModule)],
  exports: [ClientService],
})
export class ClientModule {}
