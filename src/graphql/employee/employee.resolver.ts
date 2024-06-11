import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { EmployeeDetail, TablePaginationArgs } from '../graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/shared/guard';

@Resolver()
export class EmployeeResolver {
  constructor(private employeeService: EmployeeService) {}
  
  @UseGuards(JwtGuard)
  @Query('getEmployeeList')
  async getEmployeeList(
    @Args('searchValue') searchValue: string,
    @Args('pagination') pagination: TablePaginationArgs,
  ): Promise<EmployeeDetail[]> {
    return await this.employeeService.getEmployees({
      searchValue,
      ...pagination,
    });
  }

  @Mutation('bulkCreate')
  async bulkCreate(
    @Args({ name: 'dataUpload', type: () => GraphQLUpload })
    file: FileUpload,
  ) {
    await this.employeeService.bulkCreate(file);

    return 'Successfully created employees';
  }
}
