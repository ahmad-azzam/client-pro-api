import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class DocumentAccessGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { id } = ctx.getArgs();
    const { user } = ctx.getContext().req;

    await this.checkUser(id, user.id);

    return true;
  }

  private async checkUser(fileId: string, userId: string) {
    const fileProject = await this.prismaService.employeeProjectFile.findFirst({
      where: {
        AND: {
          employee_id: userId,
          project_file_id: fileId,
        },
      },
    });

    if (!fileProject)
      throw new UnauthorizedException('User have not access to this document');
  }
}
