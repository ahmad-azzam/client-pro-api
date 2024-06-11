import { Injectable } from '@nestjs/common';
import { GaxiosResponse } from 'gaxios';
import { drive_v3 } from 'googleapis';
import { FileUpload } from 'graphql-upload-ts';
import { GDriveService } from 'src/shared/g-drive/g-drive.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import { TAddFile, TUpsertFile } from './type';

@Injectable()
export class FileService {
  constructor(
    private gDriveService: GDriveService,
    private utilsService: UtilsService,
    private prismaService: PrismaService,
  ) {}

  async getFileDownload(id: string) {
    return await this.gDriveService.getLinkFileDownload(id);
  }

  async addFile(params: TAddFile) {
    const { document, folderId, name, type } = params;
    const access = type === 'project' && params.access;

    const file = await this.utilsService.fileToBufferGraphql(document);

    const fileGDrive = await this.gDriveService.createFile({
      file,
      fileName: name ? name : document.filename,
      folderId,
      mimeType: document.mimetype,
    });

    await this.upsertFile({ access, fileGDrive, folderId, type });
  }

  async upsertFile(params: TUpsertFile) {
    const { fileGDrive, folderId, type } = params;
    const { mimeType: mime, name, id } = fileGDrive.data;
    const access = type === 'project' && params.access;

    switch (type) {
      case 'client':
        return await this.prismaService.fileType.upsert({
          where: { mime },
          create: {
            mime,
            name,
            client_files: {
              create: {
                name,
                id,
                client_folder_id: folderId,
              },
            },
          },
          update: {
            client_files: {
              create: {
                name,
                id,
                client_folder_id: folderId,
              },
            },
          },
        });

      case 'project':
        await this.prismaService.fileType.upsert({
          where: { mime },
          create: {
            mime,
            name,
            project_files: {
              create: {
                name,
                project_folder_id: folderId,
                id,
                employees: {
                  createMany: {
                    data: access.map((item) => {
                      return {
                        employee_id: item,
                      };
                    }),
                  },
                },
              },
            },
          },
          update: {
            project_files: {
              create: {
                name,
                project_folder_id: folderId,
                id,
                employees: {
                  createMany: {
                    data: access.map((item) => {
                      return {
                        employee_id: item,
                      };
                    }),
                  },
                },
              },
            },
          },
        });
    }
  }

  async renameFile(fileId: string, name: string) {
    return await this.gDriveService.renameFile(fileId, name);
  }

  async deleteFile(fileId: string) {
    return await this.gDriveService.deleteFile(fileId);
  }
}
