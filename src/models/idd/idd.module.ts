import { Global, Module } from '@nestjs/common';
import { IddService } from './idd.service';
import { IddController } from './idd.controller';

@Global()
@Module({
  providers: [IddService],
  controllers: [IddController],
  exports: [IddService]
})
export class IddModule {}
