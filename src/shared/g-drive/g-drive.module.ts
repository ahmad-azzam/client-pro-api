import { Module } from '@nestjs/common';
import { GDriveService } from './g-drive.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [GDriveService],
  exports: [GDriveService],
  imports: [UtilsModule]
})
export class GDriveModule {}
