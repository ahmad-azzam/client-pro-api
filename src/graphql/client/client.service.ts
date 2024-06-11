import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { FileUpload } from 'graphql-upload-ts';
import { UtilsService } from 'src/shared/utils/utils.service';
import { GDriveService } from 'src/shared/g-drive/g-drive.service';
import { TParameterList } from 'src/shared/type';
import { Prisma } from '@prisma/client';
import { TPayloadDocument } from '../file/type';
import { FileService } from '../file/file.service';
import { ResponseClientList } from '../graphql';

@Injectable()
export class ClientService {
  constructor(
    private prismaService: PrismaService,
    private utilsService: UtilsService,
    private gDriveService: GDriveService,
    private fileService: FileService,
  ) {}

  async createClient(payload: CreateClientDto, document?: FileUpload) {
    const client = await this.prismaService.client.create({
      data: {
        address: payload.address,
        company_name: payload.company_name,
        email: payload.email,
        name: payload.full_name,
        notes: payload.note,
        phone: payload.phone_number,
        client_nationality_id: payload.nationality,
      },
    });

    const folderGDrive = await this.gDriveService.createFolder({
      folderName: `${client.company_name}--${client.id}`,
    });

    await this.prismaService.clientFolder.create({
      data: {
        name: client.company_name,
        client_id: client.id,
        id: folderGDrive.data.id,
      },
    });

    if (document) {
      await this.fileService.addFile({
        type: 'client',
        document,
        folderId: folderGDrive.data.id,
        name: payload.document_name,
      });
    }

    return client;
  }

  async getClientList({
    page_index,
    searchValue,
    size,
  }: TParameterList): Promise<ResponseClientList> {
    const options: Prisma.ClientFindManyArgs = {
      include: {
        client_nationality: true,
      },
      ...this.utilsService.generateTakeAndSkip(page_index, size),
    };

    if (searchValue) {
      options.where = {
        OR: [
          {
            name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            id: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            company_name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const clientList = await this.prismaService.client.findMany(options);

    const data = clientList.map((item) => {
      return {
        id: item.id,
        name: item.name,
        company_name: item.company_name,
        phone_number: item.phone,
        email: item.email,
      };
    });

    const totalData = await this.prismaService.client.count();

    return {
      data,
      pagination: this.utilsService.generatePagination(
        totalData,
        page_index,
        size,
      ),
    };
  }

  async getClientDetail(id: string) {
    return await this.prismaService.client.findUniqueOrThrow({
      where: { id },
      include: {
        client_nationality: true,
        client_folder: {
          include: {
            project_folders: {
              include: {
                project: {
                  include: {
                    project_status: true,
                  },
                },
              },
            },
            client_files: {
              include: {
                file_type: true,
              },
            },
          },
        },
      },
    });
  }

  async updateClient(id: string, payload: UpdateClientDto) {
    return await this.prismaService.client.update({
      where: { id },
      data: {
        address: payload.address,
        name: payload.full_name,
        company_name: payload.company_name,
        phone: payload.phone_number,
        email: payload.email,
        client_nationality_id: payload.nationality,
        notes: payload.note,
      },
    });
  }

  async deleteClient(id: string) {
    const folder = await this.prismaService.clientFolder.findUniqueOrThrow({
      where: { client_id: id },
    });

    return await Promise.all([
      this.fileService.deleteFile(folder.id),
      this.prismaService.client.delete({ where: { id } }),
    ]);
  }

  async addDocument(
    id: string,
    documentNames: string[],
    documents: FileUpload[],
  ) {
    const folder = await this.prismaService.clientFolder.findFirstOrThrow({
      where: { client_id: id },
    });

    for (let index = 0; index < documents.length; index++) {
      const document = documents[index];
      const name = documentNames[index];

      await this.fileService.addFile({
        type: 'client',
        name,
        document,
        folderId: folder.id,
      });
    }
  }

  async updateFile(fileId: string, name: string) {
    return await this.prismaService.clientFile.update({
      where: { id: fileId },
      data: {
        name,
      },
    });
  }

  async deleteFile(fileId: string) {
    return await this.prismaService.clientFile.delete({
      where: { id: fileId },
    });
  }
}
