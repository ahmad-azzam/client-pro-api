import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto, DocumentDto } from './dto';
import { FileUpload } from 'graphql-upload-ts';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GDriveService } from 'src/shared/g-drive/g-drive.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import { FileService } from '../file/file.service';
import { TParameterList } from 'src/shared/type';
import { Prisma } from '@prisma/client';
import { ProjectUpdateArgs, ResponseProjectList } from '../graphql';
import { TParameterCreateProject, TParameterDocumentProject } from './type';
import { ClientService } from '../client/client.service';

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    private gDriveService: GDriveService,
    private utilsService: UtilsService,
    private fileService: FileService,
    private clientService: ClientService,
  ) {}

  async createProject({
    payload,
    document,
    payloadClient,
    payloadDocument,
  }: TParameterCreateProject) {
    if (!payload.client && !payloadClient)
      throw new BadRequestException('Client must be provided');

    const { id: client_id } = payload.client
      ? await this.getProject(payload.client)
      : await this.clientService.createClient(payloadClient);

    const project = await this.prismaService.project.create({
      data: {
        costs: payload.costs,
        deadline: payload.deadline,
        goals: payload.goals,
        name: payload.name,
        start_date: payload.start_date,
        project_status_id: payload.status,
        employees: {
          createMany: {
            data: payload.members.map((item) => {
              return {
                employee_id: item,
              };
            }),
          },
        },
      },
    });

    const clientFolder = await this.prismaService.clientFolder.findFirstOrThrow(
      {
        where: { client_id },
      },
    );

    const folderGDrive = await this.gDriveService.createFolder({
      folderName: `${project.name}--${project.id}`,
      folderId: clientFolder.id,
    });

    await this.prismaService.projectFolder.create({
      data: {
        name: project.name,
        client_folder_id: clientFolder.id,
        id: folderGDrive.data.id,
        project_id: project.id,
      },
    });

    if (document) {
      await this.fileService.addFile({
        type: 'project',
        document,
        folderId: folderGDrive.data.id,
        name: payloadDocument.name,
        access: payloadDocument.access,
      });
    }
  }

  async getProjects({
    page_index,
    searchValue,
    size,
  }: TParameterList): Promise<ResponseProjectList> {
    const options: Prisma.ProjectFindManyArgs = {
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
            project_status: {
              name: {
                contains: searchValue,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }

    const projectList = await this.prismaService.project.findMany({
      ...options,
      include: { project_status: true },
    });

    const data = projectList.map((item) => {
      return {
        deadline: item.deadline,
        id: item.id,
        name: item.name,
        start_date: item.start_date,
        status: {
          id: item.project_status.id,
          name: item.project_status.name,
          description: item.project_status.description,
        },
      };
    });

    const totalData = await this.prismaService.project.count();

    return {
      data,
      pagination: this.utilsService.generatePagination(
        totalData,
        page_index,
        size,
      ),
    };
  }

  async getProject(id: string) {
    return await this.prismaService.project.findUniqueOrThrow({
      where: { id },
      include: {
        employees: {
          include: {
            employee: {
              include: {
                role: true,
              },
            },
          },
        },
        project_folder: {
          include: {
            project_files: {
              include: {
                employees: {
                  include: {
                    employee: {
                      include: {
                        role: true,
                      },
                    },
                  },
                },
                file_type: true,
              },
            },
            client_folder: {
              select: {
                client_id: true,
              },
            },
          },
        },
        project_status: true,
      },
    });
  }

  async updateStatusProject(projectId: string, status: string) {
    return await this.prismaService.project.update({
      where: { id: projectId },
      data: {
        project_status_id: status,
      },
    });
  }

  async updateProject(payload: ProjectUpdateArgs) {
    const { costs, deadline, goals, id, members, name, start_date, status } =
      payload;

    const membersProject = (await this.getProject(id)).employees.map(
      (item) => item.employee_id,
    );

    await this.prismaService.project.update({
      where: { id },
      data: {
        employees: {
          deleteMany: {
            employee_id: { in: membersProject },
          },
        },
      },
    });

    return await this.prismaService.project.update({
      where: { id },
      data: {
        costs,
        goals,
        deadline,
        start_date,
        name,
        project_status_id: status,
        employees: {
          createMany: {
            data: members.map((item) => {
              return {
                employee_id: item,
              };
            }),
          },
        },
      },
    });
  }

  async deleteProject(id: string) {
    const folder = await this.prismaService.projectFolder.findUniqueOrThrow({
      where: { project_id: id },
    });

    return await Promise.all([
      this.fileService.deleteFile(folder.id),
      this.prismaService.project.delete({ where: { id } }),
    ]);
  }

  async addDocument(params: TParameterDocumentProject) {
    const { access: accessDocuments, documentNames, documents, id } = params;
    const folder = await this.prismaService.projectFolder.findFirstOrThrow({
      where: { project_id: id },
    });

    for (let index = 0; index < documents.length; index++) {
      const document = documents[index];
      const name = documentNames[index];
      const access = accessDocuments[index];

      await this.fileService.addFile({
        type: 'project',
        name,
        document,
        folderId: folder.id,
        access,
      });
    }
  }

  async updateFile(fileId: string, name: string, access: string[]) {
    const fileAccess = (
      await this.prismaService.projectFile.findUniqueOrThrow({
        where: { id: fileId },
        include: {
          employees: true,
        },
      })
    ).employees.map((item) => item.employee_id);

    await this.prismaService.projectFile.update({
      where: { id: fileId },
      data: {
        employees: {
          deleteMany: { employee_id: { in: fileAccess } },
        },
      },
    });

    await Promise.all([
      this.fileService.renameFile(fileId, name),
      this.prismaService.projectFile.update({
        where: { id: fileId },
        data: {
          employees: {
            createMany: {
              data: access.map((item) => ({ employee_id: item })),
            },
          },
        },
      }),
    ]);
  }

  async deleteFile(fileId: string) {
    return await this.prismaService.projectFile.delete({
      where: { id: fileId },
    });
  }
}
