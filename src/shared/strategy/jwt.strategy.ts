import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtPayload } from 'src/graphql/auth/type';
import { EmployeeService } from 'src/graphql/employee/employee.service';
import { TokenService } from 'src/graphql/token/token.service';
import { UtilsService } from '../utils/utils.service';
import { CookieName } from '../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private utilsService: UtilsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (!req.signedCookies?.access_token) throw new ForbiddenException();
          const accessTokenBearer = req.signedCookies.access_token as string;
          const accessToken = accessTokenBearer.split('Bearer ')[1];

          return accessToken;
        },
      ]),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: configService.get<string>('SECRET_JWT'),
    });
  }

  async validate(req: Request, payload: TJwtPayload) {
    if (!payload) throw new UnauthorizedException();

    const employee = await this.employeeService.findUnique({ id: payload.id });

    if (!employee) throw new UnauthorizedException();

    await this.checkExpiration(payload, req?.res);

    return payload;
  }

  private async checkExpiration(payload: TJwtPayload, res: Response) {
    const currentTime = Math.floor(Date.now() / 1000);

    const time = payload.exp - currentTime;

    if (time <= 0) {
      const authentication = await this.tokenService.findUniqueRefreshToken({
        where: { employee_id: payload.id },
      });

      const verifiedRefreshToken = await this.jwtService.verifyAsync(
        authentication.refresh_token,
        {
          secret: this.configService.get<string>('SECRET_REFRESH_JWT'),
          ignoreExpiration: true,
        },
      );

      if (verifiedRefreshToken.exp - currentTime <= 0) {
        await this.tokenService.removeTokens(payload.id);
        throw new ForbiddenException('Refresh token not found');
      }

      const access_token = await this.jwtService.signAsync(
        {
          id: payload.id,
          full_name: payload.full_name,
          role_id: payload.role_id,
        },
        {
          secret: this.configService.get<string>('SECRET_JWT'),
          expiresIn: Number(
            this.configService.get<number>('EXPIRED_TIME_SECRET'),
          ),
        },
      );

      await this.tokenService.upsertAccessToken(payload.id, access_token);

      this.utilsService.setCookie({
        res,
        name: CookieName.ACCESS_TOKEN,
        value: `Bearer ${access_token}`,
      });
    }
  }
}
