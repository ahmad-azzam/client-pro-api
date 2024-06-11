import { Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { TokenService } from '../token/token.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/shared/guard';
import { GetUser } from 'src/shared/common/decorator/get-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query('getKey')
  async getKey() {
    return await this.authService.getKey();
  }

  @Mutation('login')
  async login(@Context('req') req: Request, @Context('res') res: Response) {
    const authorization = req.headers.authorization;

    await this.authService.decryptedData(
      authorization.split('Bearer ')[1],
      res,
    );

    return { message: 'Successfully logged in' };
  }

  @Mutation('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser('id') id: string, @Context('res') res: Response) {
    await this.authService.logout(id, res);

    return { message: 'Successfully logged out' };
  }
}
