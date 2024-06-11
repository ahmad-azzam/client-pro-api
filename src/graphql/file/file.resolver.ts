import { Args, Query, Resolver } from '@nestjs/graphql';

import { FileService } from './file.service';
import { UseGuards } from '@nestjs/common';
import { DocumentAccessGuard, JwtGuard } from 'src/shared/guard';

@Resolver()
@UseGuards(JwtGuard)
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query('getLinkFileDownload')
  @UseGuards(DocumentAccessGuard)
  async getLinkFileDownload(@Args('id') id: string) {
    return await this.fileService.getFileDownload(id);
  }

  // @Mutation('addDocument')
  // async addDocument(
  //   @Args('id') id: string,
  //   @Args('documentNames') documentNames: string[],
  //   @Args({ name: 'documents', type: () => GraphQLUpload })
  //   documents: FileUpload[],
  //   @Args('access') access: string[][],
  // ) {
  //   console.log(access);

  //   const files = await Promise.all(documents);

  //   await this.clientService.addDocument(id, documentNames, files);

  //   return { message: 'Success add documents' };
  // }
}
