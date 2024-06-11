import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectDto, DocumentDto, UpdateProjectDto } from './dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ProjectService } from './project.service';
import {
  EmployeeDetail,
  FileList,
  ProjectDetail,
  ProjectList,
  ProjectUpdateArgs,
  ResponseProjectList,
  TablePaginationArgs,
} from '../graphql';
import { FileService } from '../file/file.service';
import { JwtGuard } from 'src/shared/guard';
import { UseGuards } from '@nestjs/common';
import { CreateClientDto } from '../client/dto';

@Resolver()
@UseGuards(JwtGuard)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    private fileService: FileService,
  ) {}

  @Query('getProjectList')
  async getProjectList(
    @Args('searchValue') searchValue: string,
    @Args('pagination') pagination: TablePaginationArgs,
  ): Promise<ResponseProjectList> {
    return await this.projectService.getProjects({
      searchValue,
      ...pagination,
    });
  }

  @Query('getProjectDetail')
  async getProjectDetail(@Args('id') id: string): Promise<ProjectDetail> {
    const result = await this.projectService.getProject(id);

    const members: EmployeeDetail[] = result.employees.map((item) => {
      return {
        full_name: item.employee.full_name,
        id: item.employee_id,
        role: item.employee.role,
      };
    });

    const documents: FileList[] = result.project_folder.project_files.map(
      (item) => {
        return {
          id: item.id,
          name: item.name,
          access: item.employees.map((element) => {
            return {
              id: element.employee_id,
              full_name: element.employee.full_name,
              role: {
                id: element.employee.role.id,
                name: element.employee.role.name,
                description: element.employee.role.description,
              },
            };
          }),
          type: item.file_type.mime,
        };
      },
    );

    return {
      costs: result.costs,
      deadline: result.deadline,
      goals: result.goals,
      name: result.name,
      projectId: result.id,
      start_date: result.start_date,
      clientId: result.project_folder.client_folder.client_id,
      status: result.project_status,
      documents,
      members,
    };
  }

  @Mutation('createProject')
  async createProject(
    @Args('payload') payload: CreateProjectDto,
    @Args('payloadClient') payloadClient?: CreateClientDto,
    @Args('payloadDocument') payloadDocument?: DocumentDto,
    @Args({ name: 'document', type: () => GraphQLUpload })
    document?: FileUpload,
  ) {
    await this.projectService.createProject({
      payload,
      document,
      payloadClient,
      payloadDocument,
    });

    return { message: 'Successfully created project' };
  }

  @Mutation('updateStatusProject')
  async updateStatusProject(
    @Args('projectId') projectId: string,
    @Args('status') status: string,
  ) {
    await this.projectService.updateStatusProject(projectId, status);
    return { message: 'Successfully updated status project' };
  }

  @Mutation('updateProject')
  async updateProject(@Args('payload') payload: UpdateProjectDto) {
    await this.projectService.updateProject(payload);
    return { message: 'Successfully updated project' };
  }

  @Mutation('deleteProject')
  async deleteProject(@Args('id') id: string) {
    await this.projectService.deleteProject(id);
    return { message: 'Successfully deleted project' };
  }

  @Mutation('addDocumentProject')
  async addDocument(
    @Args('id') id: string,
    @Args('documentNames') documentNames: string[],
    @Args({ name: 'documents', type: () => GraphQLUpload })
    documents: FileUpload[],
    @Args('access') access: string[][],
  ) {
    const files = await Promise.all(documents);

    await this.projectService.addDocument({
      id,
      documentNames,
      access,
      documents: files,
    });

    return { message: 'Success add documents' };
  }

  @Mutation('updateFileProject')
  async updateFileProject(
    @Args('fileId') fileId: string,
    @Args('name') name: string,
    @Args('access') access: string[],
  ) {
    await this.projectService.updateFile(fileId, name, access);

    return { message: 'Success update file project' };
  }

  @Mutation('deleteFileProject')
  async deleteFileProject(@Args('fileId') fileId: string) {
    await Promise.all([
      this.fileService.deleteFile(fileId),
      this.projectService.deleteFile(fileId),
    ]);

    return { message: 'Success delete file project' };
  }
}
