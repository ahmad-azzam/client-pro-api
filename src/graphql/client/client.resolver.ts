import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { CreateClientDto, UpdateClientDto } from './dto';
import { ClientService } from './client.service';
import {
  ClientDetail,
  FileList,
  ClientList,
  ProjectList,
  TablePaginationArgs,
  ResponseClientList,
} from '../graphql';
import { FileService } from '../file/file.service';
import { JwtGuard } from 'src/shared/guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(JwtGuard)
export class ClientResolver {
  constructor(
    private clientService: ClientService,
    private fileService: FileService,
  ) {}

  @Query('getClientList')
  async getClientList(
    @Args('searchValue') searchValue: string,
    @Args('pagination') pagination: TablePaginationArgs,
  ): Promise<ResponseClientList> {
    return await this.clientService.getClientList({
      searchValue,
      ...pagination,
    });
  }

  @Query('getClientDetail')
  async getClientDetail(@Args('id') id: string): Promise<ClientDetail> {
    const result = await this.clientService.getClientDetail(id);

    const projects: ProjectList[] = result.client_folder.project_folders.map(
      (item) => {
        const { deadline, id, name, start_date, project_status } = item.project;

        return {
          deadline,
          id,
          name,
          start_date,
          status: {
            id: project_status.id,
            name: project_status.name,
            description: project_status.description,
          },
        };
      },
    );

    const documents: FileList[] = result.client_folder.client_files.map(
      (item) => {
        return {
          id: item.id,
          name: item.name,
          type: item.file_type.mime,
        };
      },
    );

    return {
      address: result.address,
      company_name: result.company_name,
      email: result.email,
      id: result.id,
      name: result.name,
      nationality: result.client_nationality.country_name,
      phone_number: result.phone,
      projects,
      documents,
    };
  }

  @Mutation('updateClient')
  async updateClient(
    @Args('payload') payload: UpdateClientDto,
    @Args('id') id: string,
  ) {
    await this.clientService.updateClient(id, payload);

    return {
      message: 'Success update client',
    };
  }

  @Mutation('createClient')
  async createClient(
    @Args({ name: 'document', type: () => GraphQLUpload }) document: FileUpload,
    @Args('payload') payload: CreateClientDto,
  ) {
    await this.clientService.createClient(payload, document);

    return { message: 'Successfully created client' };
  }

  @Mutation('deleteClient')
  async deleteClient(@Args('id') id: string) {
    await this.clientService.deleteClient(id);

    return { message: 'Successfully deleted client' };
  }

  @Mutation('addDocumentClient')
  async addDocument(
    @Args('id') id: string,
    @Args('documentNames') documentNames: string[],
    @Args({ name: 'documents', type: () => GraphQLUpload })
    documents: FileUpload[],
  ) {
    const files = await Promise.all(documents);

    await this.clientService.addDocument(id, documentNames, files);

    return { message: 'Success add documents' };
  }

  @Mutation('updateFileClient')
  async updateFile(@Args('fileId') fileId: string, @Args('name') name: string) {
    await Promise.all([
      this.fileService.renameFile(fileId, name),
      this.clientService.updateFile(fileId, name),
    ]);

    return { message: 'Success rename file' };
  }

  @Mutation('deleteFileClient')
  async deleteFile(@Args('fileId') fileId: string) {
    await Promise.all([
      this.fileService.deleteFile(fileId),
      this.clientService.deleteFile(fileId),
    ]);

    return { message: 'Success delete file' };
  }
}
