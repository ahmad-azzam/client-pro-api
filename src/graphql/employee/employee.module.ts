import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  providers: [EmployeeService, EmployeeResolver],
  exports: [EmployeeService],
  imports: [UtilsModule],
})
export class EmployeeModule {}
