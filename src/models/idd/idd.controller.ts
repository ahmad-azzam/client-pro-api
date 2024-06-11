import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IddService } from './idd.service';

@Controller('idd')
export class IddController {
  constructor(private iddService: IddService) {}

  @Post('/batch')
  @UseInterceptors(FileInterceptor('file'))
  async createBatch(@UploadedFile() file: Express.Multer.File) {
    return await this.iddService.createBatch(file);
  }
}
